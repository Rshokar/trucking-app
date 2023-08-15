import re
from sqlalchemy import Column, String
from sqlalchemy.orm import validates, relationship
from models.model import Base
from config import db
from enum import Enum


class UserRole(str, Enum):
    DISPATCHER = "dispatcher"


class User(Base):
    __tablename__ = 'users'
    id = Column("id", String(50), primary_key=True)
    role = Column("role", String(20))

    @validates("role")
    def validate_role(self, key, role):
        if role != UserRole.DISPATCHER.value:
            raise ValueError("Invalid Role")
        return role

    company = relationship("Company", backref="owner",
                           lazy=True, cascade="delete", uselist=False)

    def __init__(self, id, role=UserRole.DISPATCHER.value):
        self.role = role
        self.id = id

    def __repr__(self):
        return f"USER: ({self.id}) {self.role}"

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
        }
