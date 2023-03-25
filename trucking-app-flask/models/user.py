import re
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import validates, relationship
from models.model import Base
from config import db
from enum import Enum
from werkzeug.security import generate_password_hash, check_password_hash


class UserRole(str, Enum):
    DISPATCHER = "dispatcher"


class User(Base):
    __tablename__ = 'users'
    id = Column("id", Integer, primary_key=True)
    role = Column("role", String(20))
    password_hash = Column("password_hash", String(100))
    email = Column("email", String(100), unique=True)

    @validates("email")
    def validate_email(self, key, address):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", address):
            raise ValueError(f"Invalid email address: {address}")
        return address

    @validates("password")
    def validate_password(self, key, password):
        if not re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$', password):
            raise ValueError(f"Invalid password")
        return password

    @validates("role")
    def validate_role(self, key, role):
        if role != UserRole.DISPATCHER.value:
            raise ValueError("Invalid Role")
        return role

    company = relationship("Company", backref="owner",
                           lazy=True, cascade="delete", uselist=False)

    def __init__(self, email, password, role=UserRole.DISPATCHER.value):
        self.role = role
        self.email = email
        self.password_hash = generate_password_hash(password)

    def __repr__(self):
        return f"USER: ({self.id}) {self.role} {self.email} {self.password_hash}"

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "email": self.email,
        }

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
