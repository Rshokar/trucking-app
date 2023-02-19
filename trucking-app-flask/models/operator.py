from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from models.model import Base
from models.company import Company


class Operator(Base):
    __tablename__ = 'operators'
    operator_id = Column("operator_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer, ForeignKey(Company.company_id), primary_key=True)
    operator_name = Column("operator_name", String(100))
    operator_email = Column("operator_email", String(200))

    def __init__(self, id, company, name, email) -> None:
        self.operator_id = id
        self.company_id = company
        self.operator_name = name
        self.operator_email = email

    def __repr__(self):
        return f"({self.operator_id}) {self.company_id} {self.operator_name} {self.operator_email}"
