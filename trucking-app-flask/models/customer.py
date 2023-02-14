from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from sqlalchemy.orm import relationship
from models.model import Base


class Customer(Base):
    __tablename__ = 'customers'
    customer_id = Column('customer_id', Integer, primary_key=True)
    company_id = Column('company_id', Integer, ForeignKey('companies.company_id'))
    customer_name = Column('customer_name', String(200))
    company = relationship("Company", back_populates="customers")

    def __init__(self, company_id, name):
        self.company_id = company_id
        self.customer_name = name

    def __repr__(self):
        return f"CUSTOMER: ({self.customer_id}) {self.customer_name}"

    def to_dict(self):
        return {
            "customer_id": self.customer_id,
            "customer_name": self.customer_name
        }