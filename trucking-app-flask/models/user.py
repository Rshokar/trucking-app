import re
from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from sqlalchemy.orm import validates
from models.model import Base
from enum import Enum


class UserTypes(str, Enum):
    DISPATCHER = "dispatcher"


class User(Base):
    __tablename__ = 'users'
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    type = Column("type", String(500))
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

    @validates("type")
    def validate_type(self, key, type):
        # if (type == "dispatcher"):
        #     print("VALID TYPE")
        #     return type
        if (type == UserTypes.DISPATCHER):
            print("VALID ENUM TYPE")
            return type
        raise ValueError("Invalid Type")

    def __init__(self, type, email, password) -> None:
        self.type = type
        self.email = email
        self.password = password

    def __repr__(self):
        return f"({self.id}) {self.type} {self.email} {self.password}"

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "email": self.email,
        }
