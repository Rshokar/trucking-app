from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from models.model import Base


class User(Base):
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


class Company(Base):
    __tablename__ = 'companies'
    company_id = Column('company_id', Integer, primary_key=True)
    #owner_id=Column('owner_id', Integer, ForeignKey("owners.id")) #our MVP currently doesn't have an "owner" entity. We should discuss this if the solution isn't obvious to you
    company_name = Column("company_name", String(200))

    def __init__(self, id, owner, name) -> None:
        self.company_id = id
        self.owner = 0 # placeholder value
        self.company_name = name
