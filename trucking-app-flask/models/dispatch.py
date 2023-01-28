from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, Date
from models.model import Base

class Dispatch(Base):
    __tablename__ = 'dispatches'
    dispatch_id = Column("dispatch_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer, ForeignKey("companies.company_id"))
    #customer_id = Column("customer_id", Integer, ForeignKey("customers.customer_id")) #customers_id doesn't exist yet. Only fields in Customer entity are company_id and company_name
    notes = Column("notes", String(1000))
    date = Column("date", DateTime)

    def __init__(self, id, company, customer, notes, date):
        self.dispatch_id = id
        self.company_id = company
        self.customer = customer
        self.notes = notes
        self.date = date

    def __repr__(self):
        return f"({self.dispatch_id}) {self.company_id} {self.customer} {self.notes} {self.date}"
