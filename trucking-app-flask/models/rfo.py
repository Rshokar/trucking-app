from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, CheckConstraint, Boolean
from models.model import Base
from models.dispatch import Dispatch
from models.operator import Operator


class RFO(Base):
    __tablename__ = 'rfos'
    rfo_id = Column("rfo_id", Integer, primary_key=True)
    # Dispatch has dispatch ID but the ERD on diagram.io is dispatcher ID. Is the Dispatch entity a dispatcher or the dispatch itself?
    # The entity looks like it's the dispatch itself.
    dispatch_id = Column("dispatch_id", Integer,
                         ForeignKey(Dispatch.dispatch_id), nullable=False)
    operator_id = Column("operator_id", Integer,
                         ForeignKey(Operator.operator_id), nullable=False)

    trailer = Column("trailer", String(100))
    truck = Column("truck", String(100))
    start_location = Column("start_location", String(
        300), CheckConstraint('LENGTH(start_location) >= 3'))
    start_time = Column("start_time", DateTime)
    dump_location = Column("dump_location", String(
        500), CheckConstraint('LENGTH(dump_location) >= 3'))
    load_location = Column("load_location", String(
        500), CheckConstraint('LENGTH(load_location) >= 3'))

    # This is used to store six digit validation token
    token = Column("token", String(6), CheckConstraint(
        'LENGTH(token) = 6'), nullable=True)
    token_date = Column("token_date", DateTime, nullable=True)
    token_consumed = Column('token_cosumed', Boolean, default=True)

    def __init__(self, dispatch_id, operator_id, trailer, truck, start_location, start_time, dump_location, load_location) -> None:
        self.dispatch_id = dispatch_id
        self.operator_id = operator_id
        self.trailer = trailer
        self.truck = truck
        self.start_location = start_location
        self.start_time = start_time
        self.dump_location = dump_location
        self.load_location = load_location

    def __repr__(self):
        return f"RFO: ({self.rfo_id}) Dispatch: {self.dispatch_id} Equipment: {self.truck} {self.trailer} Start: {self.start_location} Load: {self.load_location} Dump: {self.dump_location} {self.start_time}"

    def to_dict(self):
        return {
            "rfo_id": self.rfo_id,
            "dispatch_id": self.dispatch_id,
            "operator_id": self.operator_id,
            "trailer": self.trailer,
            "truck": self.truck,
            "load_location": self.load_location,
            "start_location": self.start_location,
            "dump_location": self.dump_location,
            "start_time": self.start_time,
        }
