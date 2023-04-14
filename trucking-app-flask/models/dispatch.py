from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, DateTime
from sqlalchemy.orm import relationship
from models.model import Base
from models.company import Company


class Dispatch(Base):
    __tablename__ = 'dispatch'
    dispatch_id = Column("dispatch_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer, ForeignKey(
        "company.company_id"), nullable=False)
    customer_id = Column("customer_id", Integer, ForeignKey(
        "customer.customer_id"), nullable=False)
    notes = Column("notes", String(1000))
    date = Column("date", DateTime)

    rfos = relationship("RFO", backref="dispatch", lazy=True)

    def __init__(self, company_id, customer_id, notes, date):
        self.company_id = company_id
        self.customer_id = customer_id
        self.notes = notes
        self.date = date

    def __repr__(self):
        return f"DISPATCH: ({self.dispatch_id}) {self.company_id} {self.customer_id} {self.date}"

    def to_dict(self):
        return {
            "dispatch_id": self.dispatch_id,
            "company_id": self.company_id,
            "customer_id": self.customer_id,
            "notes": self.notes,
            "date": self.date,
        }

    def get_dispatch_by_id_and_owner(session, dispatch_id, owner_id):
        return session.query(Dispatch)\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .filter(Dispatch.dispatch_id == dispatch_id)\
            .filter(Company.owner_id == owner_id)\
            .first()
