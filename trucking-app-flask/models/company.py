from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from models.model import Base

class Company(Base):
    __tablename__ = 'companies'
    company_id = Column('company_id', Integer, primary_key=True)
    owner_id=Column('owner_id', Integer, ForeignKey("users.id")) #our MVP currently doesn't have an "owner" entity. We should discuss this if the solution isn't obvious to you
    company_name = Column("company_name", String(200))

    def __init__(self, id, owner, name) -> None:
        self.company_id = id
        self.owner = 0 # placeholder value
        self.company_name = name

        
    def __repr__(self):
        return f"({self.company_id}) {self.owner} {self.company_name}"

