from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from models.model import Base
from models.rfo import RFO


class BillingTickets(Base):
    __tablename__ = 'billing_tickets'
    bill_id = Column("bill_id", Integer, primary_key=True)
    rfo_id = Column("rfo_ids", Integer, ForeignKey(RFO.rfo_id))
    ticket_number = Column("ticket_number", String(200))
    # We won't ever need an image ID, right? If not, how will the image ID be integrated with the rest of the app
    image_id = Column("image_id", String(200))
    bucket = Column("bucket", String(50))
    region = Column("region", String(50))
    billed = Column("billed", Boolean, default=False)

    def __init__(self, rfo_id, ticket_number, image_id, bucket, region):
        self.rfo_id = rfo_id
        self.ticket_number = ticket_number
        self.image_id = image_id
        self.bucket = bucket
        self.region = region

    def __repr__(self):
        return f"BILLING TICKET: ({self.bill_id}) {self.rfo_id} {self.ticket_number} {self.image_id}"

    def to_dict(self):
        return {
            "bill_id": self.bill_id,
            "rfo_id": self.rfo_id,
            "ticket_number": self.ticket_number,
            "image_id": self.image_id,
            "billed": self.billed
        }
