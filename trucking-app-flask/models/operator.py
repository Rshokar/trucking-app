from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.model import Base
from models.company import Company


class Operator(Base):
    __tablename__ = 'operators'
    operator_id = Column("operator_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer, ForeignKey(Company.company_id))
    operator_name = Column("operator_name", String(100))
    operator_email = Column("operator_email", String(200))

    def __init__(self, company_id, operator_name, operator_email) -> None:
        self.company_id = company_id
        self.operator_name = operator_name
        self.operator_email = operator_email

    def __repr__(self):
        return f"OPERATOR: ({self.operator_id}) {self.company_id} {self.operator_name} {self.operator_email}"

    def to_dict(self):
        return {
            "operator_id": self.operator_id,
            "company_id": self.company_id,
            "operator_name": self.operator_name,
            "operator_email": self.operator_email
        }

    def get_operator_by_id_and_owner(session, operator_id, owner_id):
        return session.query(Operator)\
            .join(Company, Operator.company_id == Company.company_id)\
            .filter(Operator.operator_id == operator_id)\
            .filter(Company.owner_id == owner_id)\
            .first()
