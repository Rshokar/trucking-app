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
    
    
    def to_dict(self):
        return {
            "dispatch_id": self.dispatch_id,
            "company_id": self.company_id,
            "customer_id": self.customer_id,
            "notes": self.notes, 
            "date": self.date,
        }

def test_create_dispatch(client, session):
    # Create a company and customer for the dispatch

    # Make a POST request to create a new dispatch
    data = {
        'company_id': 6,
        'customer_id': 1,
        'notes': 'Test dispatch',
        'date': '2022-02-21T10:00:00Z'
    }
    response = client.post('/dispatch/', json=data)
    assert response.status_code == 201

    # Check that the dispatch was created and returned in the response
    dispatch_data = response.json['dispatch']
    assert dispatch_data['company_id'] == company.id
    assert dispatch_data['customer_id'] == customer.id
    assert dispatch_data['notes'] == 'Test dispatch'
    assert dispatch_data['date'] == '2022-02-21T10:00:00Z'
