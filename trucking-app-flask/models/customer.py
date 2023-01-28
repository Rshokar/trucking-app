from sqlalchemy import Column, Integer, String, ForeignKey, CHAR
from models.model import Base


class Customer(Base):
    __tablename__ = 'customers'
    company_id = Column("company_id", Integer, primary_key=True)
    customer_name = Column("customer_name", String(100), primary_key=True)

    def __init__(self, id, name) -> None:
        self.company_id = id
        self.customer_name = name

    def __repr__(self):
        return f"({self.id}) {self.company_id}"