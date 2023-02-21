from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, DateTime
from models.model import Base

class Dispatch(Base):
    __tablename__ = 'dispatch'
    dispatch_id = Column("dispatch_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer, ForeignKey("company.company_id"), nullable=False)
    customer_id = Column("customer_id", Integer, ForeignKey("customer.customer_id"), nullable=False)
    notes = Column("notes", String(1000))
    date = Column("date", DateTime)

    def __init__(self, company_id, customer_id, notes, date):
        self.company_id = company_id
        self.customer_id = customer_id
        self.notes = notes
        self.date = date

    def __repr__(self):
        return f"DISPATCH: ({self.dispatch_id}) {self.company_id} {self.customer_id} {self.date}"
