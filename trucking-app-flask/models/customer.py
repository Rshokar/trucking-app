from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, Boolean, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from models.model import Base


class Customer(Base):
    __tablename__ = 'customer'
    customer_id = Column('customer_id', Integer, primary_key=True)
    company_id = Column('company_id', Integer, ForeignKey('company.company_id'), nullable=False)
    customer_name = Column('customer_name', String(200), nullable=False)
    deletes = Column('deleted', Boolean(), default=False, nullable=False)


    dispatches = relationship("Dispatch", backref="customer", lazy=True)


    def __init__(self, company_id, customer_name):
        self.company_id = company_id
        self.customer_name = customer_name

    def __repr__(self):
        return f"CUSTOMER: ({self.customer_id}) {self.customer_name} {self.company_id}"

    def to_dict(self):
        return {
            "customer_id": self.customer_id,
            "customer_name": self.customer_name, 
            "company_id": self.company_id
        }
