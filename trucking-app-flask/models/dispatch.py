from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, DateTime
from sqlalchemy.orm import relationship
from models.model import Base
from models.company import Company
from datetime import datetime, timedelta


class Dispatch(Base):
    __tablename__ = 'dispatch'
    dispatch_id = Column("dispatch_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer, ForeignKey(
        "company.company_id"), nullable=False)
    customer_id = Column("customer_id", Integer, ForeignKey(
        "customer.customer_id"), nullable=False)
    notes = Column("notes", String(1000))
    date = Column("date", DateTime)
    expiry = Column('expiry', DateTime, nullable=False)

    rfos = relationship("RFO", backref="dispatch", lazy=True)

    def __init__(self, company_id, customer_id, notes, date):
        self.company_id = company_id
        self.customer_id = customer_id
        self.notes = notes
        self.date = date
        self.expiry = date + timedelta(days=7)

    def __repr__(self):
        return f"DISPATCH: ({self.dispatch_id}) {self.company_id} {self.customer_id} {self.date}"

    def to_dict(self, customer=False):
        dispatch_dict = {
            "dispatch_id": self.dispatch_id,
            "company_id": self.company_id,
            "customer_id": self.customer_id,
            "notes": self.notes,
            "date": self.date.isoformat(),
            "expiry": self.expiry.isoformat()
        }

        if customer is not None:
            dispatch_dict["customer"] = self.customer.to_dict()

        return dispatch_dict

    def expired(self):
        return datetime.now() > self.expiry

    def get_dispatch_by_id_and_owner(session, dispatch_id, owner_id):
        return session.query(Dispatch)\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .filter(Dispatch.dispatch_id == dispatch_id)\
            .filter(Company.owner_id == owner_id)\
            .first()
