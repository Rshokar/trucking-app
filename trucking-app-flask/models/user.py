import re
from sqlalchemy import Column, String, DateTime, func, Boolean, CheckConstraint
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
    email_validation_token = Column("email_validation_token", String(6), CheckConstraint(
        'LENGTH(email_validation_token) = 6'), nullable=True)
    email_validation_token_consumed = Column(
        'email_validation_token_cosumed', Boolean, default=True)
    stripe_id = Column("stripe_id", String(18), nullable=False)
    stripe_subscribed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    @validates("stripe_id")
    def validate_stripe_id(self, key, stripe_id):
        LENGTH = 18
        if len(stripe_id) != LENGTH:
             raise ValueError("Invalid stripe id")
         
        return stripe_id

    @validates("role")
    def validate_role(self, key, role):
        if role != UserRole.DISPATCHER.value:
            raise ValueError("Invalid r ole")
        return role

    @validates("reset_code")
    def validate_reset_code(self, key, reset_code):
        # Only allow six-digit codes
        if reset_code is not None and not re.match("^\d{6}$", reset_code):
            raise ValueError("Invalid reset code format")
        return reset_code

    company = relationship("Company", backref="owner",
                           lazy=True, cascade="delete", uselist=False)

    def __init__(self, id, stripe_id, role=UserRole.DISPATCHER.value, reset_code=None, recovery_token=None, email=None, created_at=datetime.now()):
        self.role = role
        self.id = id
        self.reset_code = reset_code
        self.recovery_token = recovery_token
        self.stripe_id = stripe_id
        self.email = email
        self.created_at = created_at 

    def __repr__(self):
        return f"USER: ({self.id}) {self.role}, {self.reset_code}, {self.recovery_token}, {self.stripe_id}"

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
