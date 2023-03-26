from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from models.model import Base


class Customer(Base):
    __tablename__ = 'customer'
    customer_id = Column('customer_id', Integer, primary_key=True)
    company_id = Column('company_id', Integer, ForeignKey(
        'company.company_id'), nullable=False)
    customer_name = Column('customer_name', String(200), nullable=False)
    deleted = Column('deleted', Boolean(), default=False, nullable=False)

    dispatches = relationship("Dispatch", backref="customer", lazy=True)

    def __init__(self, company_id, customer_name):
        self.company_id = company_id
        self.customer_name = customer_name

    def __repr__(self):
        return f"CUSTOMER: ({self.customer_id}) {self.company_id} {self.customer_name}"

    def to_dict(self):
        return {
            "customer_id": self.customer_id,
            "customer_name": self.customer_name,
            "company_id": self.company_id
        }

    def get_customer_by_id(session, customer_id):
        return session.query(Customer).filter_by(customer_id=customer_id).first()
