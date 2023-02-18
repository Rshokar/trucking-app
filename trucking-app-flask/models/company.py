from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from sqlalchemy.orm import relationship
from models.model import Base


class Company(Base):
    __tablename__ = 'companies'
    company_id = Column('company_id', Integer, primary_key=True)
    owner_id = Column('owner_id', Integer, ForeignKey("users.id"))
    company_name = Column("company_name", String(200))

    # One-to-Many relationship with Customer model
    customers = relationship(
        "Customer", back_populates="company", cascade="all, delete-orphan")

    # One-to-Many relationship with Dispatch Model
    dispatch = relationship(
        "Dispatch", back_populates="company", cascade="all, delete-orphan")

    def __init__(self, owner_id, name):
        self.owner_id = owner_id
        self.company_name = name

    def __repr__(self):
        return f"COMPANY: ({self.company_id}) {self.owner_id} {self.company_name}"

    def to_dict(self):
        return {
            "company_id": self.company_id,
            "owner_id": self.owner_id,
            "company_name": self.company_name,
            "customers": [customer.to_dict() for customer in self.customers]
        }
