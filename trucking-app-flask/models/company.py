from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.model import Base


class Company(Base):
    __tablename__ = 'company'
    company_id = Column('company_id', Integer,
                        primary_key=True)
    owner_id = Column('owner_id', String(
        50), ForeignKey("users.id"), unique=True)
    company_name = Column("company_name", String(200))

    customers = relationship(
        "Customer", backref="company", lazy=True, cascade="delete")
    dispatches = relationship(
        "Dispatch", backref="company", lazy=True, cascade="delete")

    operators = relationship(
        "Operator", backref="company", lazy=True, cascade="delete")

    def __init__(self, owner_id, name):
        self.owner_id = owner_id
        self.company_name = name

    def __repr__(self):
        return f"COMPANY: ({self.company_id}) {self.owner_id} {self.company_name}"

    def to_dict(self, include_customers=True, include_operators=True):
        data = {
            "company_id": self.company_id,
            "owner_id": self.owner_id,
            "company_name": self.company_name,
        }

        if include_customers:
            data["customers"] = [customer.to_dict()
                                 for customer in self.customers]

        if include_operators:
            data["operators"] = [operator.to_dict()
                                 for operator in self.operators]

        return data

    def get_company_by_id(session, company_id):
        return session.query(Company).filter_by(company_id=company_id).first()
