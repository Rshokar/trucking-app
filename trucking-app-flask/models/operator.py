from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from models.model import Base
from models.company import Company


class Operator(Base):
    __tablename__ = 'operators'
    operator_id = Column("operator_id", Integer, primary_key=True)
    company_id = Column("company_id", Integer, ForeignKey(Company.company_id), primary_key=True)
    operator_name = Column("operator_name", String(100))
    operator_email = Column("operator_email", String(200))

    def __init__(self, company_id, operator_name, operator_email, operator_id=0) -> None:
        self.operator_id = operator_id
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
            "operator_email" : self.operator_email
        }
