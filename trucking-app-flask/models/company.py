from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from models.model import Base

class Company(Base):
    __tablename__ = 'companies'
    company_id = Column('company_id', Integer, primary_key=True)
    owner_id=Column('owner_id', Integer, ForeignKey("users.id")) #our MVP currently doesn't have an "owner" entity. We should discuss this if the solution isn't obvious to you
    company_name = Column("company_name", String(200))

    def __init__(self, owner_id, name) -> None:
        self.owner_id = owner_id # placeholder value
        self.company_name = name

        
    def __repr__(self):
        return f"COMPANY: ({self.company_id}) {self.owner_id} {self.company_name}"

    def to_dict(self):
        return {
            "company_id": self.company_id,
            "owner_id": self.owner_id,
            "company_name": self.company_name,
        }
