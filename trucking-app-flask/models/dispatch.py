from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, Date
from models.model import Base


class User(Base):
    __tablename__ = 'users'
    id = Column("id", Integer, primary_key=True)
    type = Column("type", String(5))
    password = Column("password", String(100))
    email = Column("email", String(100))

    def __init__(self, id, type, email, password) -> None:
        self.id = id
        self.type = type
        self.email = email
        self.password = password

    def __repr__(self):
        return f"({self.id}) {self.type} {self.email} {self.password}"




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
