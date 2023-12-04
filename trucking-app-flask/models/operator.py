from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from models.model import Base
from models.company import Company
import enum

class ContactMethods(enum.Enum):
    sms = 'sms'
    email = 'email'

class Operator(Base):
    __tablename__ = 'operators'
    operator_id = Column("operator_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer, ForeignKey(Company.company_id))
    operator_name = Column("operator_name", String(100), nullable=False)
    contact_method = Column(Enum(ContactMethods), nullable=False)
    operator_email = Column("operator_email", String(200), nullable=True)
    operator_phone = Column(String(20), nullable=True)
    operator_phone_country_code = Column(String(4), nullable=True)
    confirmed = Column("confirmed", Boolean,  default=False)
    confirm_token = Column("confirm_token", String(200), nullable=True)
    
    def __init__(self, company_id, operator_name, contact_method, operator_email=None, operator_phone=None, operator_phone_country_code=None, confirm_token=None, confirmed=False) -> None:
        self.company_id = company_id
        self.operator_name = operator_name
        self.operator_email = operator_email
        self.confirmed = confirmed
        self.confirm_token = confirm_token
        self.operator_phone = operator_phone
        self.contact_method = contact_method
        self.operator_phone_country_code = operator_phone_country_code

    rfo = relationship("RFO", backref="operator", lazy=True)

    def __repr__(self):
        return f"OPERATOR: ({self.operator_id}) {self.company_id} {self.operator_name} {self.operator_email} {self.confirmed}"

    def to_dict(self):
        return {
            "operator_id": self.operator_id,
            "company_id": self.company_id,
            "operator_name": self.operator_name,
            "operator_email": self.operator_email,
            "confirmed": self.confirmed,
            "confirm_token": self.confirm_token
        }

    def get_operator_by_id_and_owner(session, operator_id, owner_id):
        return session.query(Operator)\
            .join(Company, Operator.company_id == Company.company_id)\
            .filter(Operator.operator_id == operator_id)\
            .filter(Company.owner_id == owner_id)\
            .first()
