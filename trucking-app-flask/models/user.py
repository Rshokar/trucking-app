import re
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import validates, relationship
from models.model import Base
from config import db
from enum import Enum


class UserRole(str, Enum):
    DISPATCHER = "dispatcher"


class User(Base):
    __tablename__ = 'users'
    id = Column("id", Integer, primary_key=True)
    role = Column("role", String(20))
    password = Column("password", String(100))
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

    def __init__(self, role, email, password):
        self.role = role
        self.email = email
        self.password = password

    def __repr__(self):
        return f"USER: ({self.id}) {self.role} {self.email} {self.password}"

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "email": self.email,
        }

    def has_role(self, role):
        return self.role == role
