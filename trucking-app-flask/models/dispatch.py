from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, DateTime
from models.model import Base
from sqlalchemy.orm import relationship


class Dispatch(Base):
    __tablename__ = 'dispatch'
    dispatch_id = Column("dispatch_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer,
                        ForeignKey("companies.company_id"))
    customer_id = Column("customer_id", Integer,
                         ForeignKey("customer.customer_id"))
    notes = Column("notes", String(1000))
    date = Column("date", DateTime)

    # One-to-Many relationship with Dispatch model
    company = relationship("Company", back_populates="dispatches")

    # One-to-Many relationship with Customer model
    customer = relationship("Customer", back_populates="dispatches")

    def __init__(self, id, company, customer, notes, date):
        self.dispatch_id = id
        self.company_id = company
        self.customer = customer
        self.notes = notes
        self.date = date

    def __repr__(self):
        return f"({self.dispatch_id}) {self.company_id} {self.customer} {self.notes} {self.date}"
