from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, Boolean
from sqlalchemy.orm import relationship
from models.model import Base


class Customer(Base):
    __tablename__ = 'customer'
    customer_id = Column('customer_id', Integer, primary_key=True)
    company_id = Column('company_id', Integer,
                        ForeignKey('companies.company_id'))
    customer_name = Column('customer_name', String(200))
    deletes = Column('deleted', Boolean(), default=False)

    # Many-to-One relationship with Company model
    company = relationship("Company", back_populates="customers")

    # One-to-Many relationship with Dispatch Model
    dispatches = relationship("Dispatch", back_populates="customer")

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
