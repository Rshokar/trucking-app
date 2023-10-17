import re
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.orm import validates, relationship
from models.model import Base
from config import db
from enum import Enum
from datetime import timedelta, datetime
import os

RESET_PASSWORD_CODE_EXPIRY = os.environ.get("RESET_PASSWORD_CODE_EXPIRY")


class UserRole(str, Enum):
    DISPATCHER = "dispatcher"


class User(Base):
    __tablename__ = 'users'
    id = Column("id", String(50), primary_key=True)
    role = Column("role", String(20))
    email_validated = Column('email_validated', Boolean, default=False)
    reset_code = Column("reset_code", String(6), nullable=True)  # 6-digit code
    recovery_token = Column("recovery_token", String(
        255), nullable=True)  # Token sent to client
    code_created_at = Column("token_created_at", DateTime, nullable=True)

    @validates("role")
    def validate_role(self, key, role):
        if role != UserRole.DISPATCHER.value:
            raise ValueError("Invalid Role")
        return role

    @validates("reset_code")
    def validate_reset_code(self, key, reset_code):
        # Only allow six-digit codes
        if reset_code is not None and not re.match("^\d{6}$", reset_code):
            raise ValueError("Invalid reset code format")
        return reset_code

    company = relationship("Company", backref="owner",
                           lazy=True, cascade="delete", uselist=False)

    def __init__(self, id, role=UserRole.DISPATCHER.value, reset_code=None, recovery_token=None):
        self.role = role
        self.id = id
        self.reset_code = reset_code
        self.recovery_token = recovery_token

    def __repr__(self):
        return f"USER: ({self.id}) {self.role}, {self.reset_code}, {self.recovery_token}"

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "reset_code": self.reset_code,
            "recovery_token": self.recovery_token,
        }

    def check_token_expiration(self):
        """Check if the token has expired."""
        TOKEN_EXPIRATION_DURATION = timedelta(
            minutes=int(RESET_PASSWORD_CODE_EXPIRY))
        if self.code_created_at:
            expiration_time = self.code_created_at + TOKEN_EXPIRATION_DURATION
            return datetime.utcnow() > expiration_time
        return True  # If no token_created_at is set, assume it's expired
