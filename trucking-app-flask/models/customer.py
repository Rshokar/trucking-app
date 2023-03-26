from models.company import Company
from models.model import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship, validates


class Customer(Base):
    __tablename__ = 'customer'
    customer_id = Column('customer_id', Integer, primary_key=True)
    company_id = Column('company_id', Integer, ForeignKey(
        'company.company_id'), nullable=False)
    customer_name = Column('customer_name', String(
        50), nullable=False)
    deleted = Column('deleted', Boolean(), default=False, nullable=False)

    @validates("customer_name")
    def validate_customer_name(self, key, customer_name):
        if len(customer_name) < 3:
            raise ValueError(
                "Customer name must be between 3 and 50 characters")
        return customer_name

    # Define unique constraint
    __table_args__ = (
        UniqueConstraint('company_id', 'customer_name',
                         name='_company_customer_uc'),
    )

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
            "company_id": self.company_id,
            "deleted": self.deleted,
        }

    def get_customer_by_id(session, customer_id):
        return session.query(Customer).filter_by(customer_id=customer_id).first()

    def get_customer_by_id_and_owner(self, session, customer_id, owner_id):
        return session.query(Customer)\
            .join(Company, Customer.company_id == Company.company_id)\
            .filter(Customer.customer_id == customer_id)\
            .filter(Company.owner_id == owner_id)\
            .first()
