from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from models.model import Base

class Operator(Base):
    __tablename__ = 'users'
    id = Column("id", Integer, primary_key=True)
    type = Column("type", String(5))
    password = Column("password", String(100))
    email = Column("email", String(100))

    def __init__(self, id, type, email, password) -> None:
        self.id = id
        self.type = type
        self.email = email
        self.password = password

    def __repr__(self):
        return f"({self.id}) {self.type} {self.email} {self.password}"