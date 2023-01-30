from sqlalchemy import Column, Integer, String, ForeignKey, CHAR, DateTime
from models.model import Base
from models.dispatch import Dispatch
from models.operator import Operator


class RFO(Base):
    __tablename__ = 'rfos'
    rfo_id = Column("rfo_id", Integer, primary_key=True)
    # Dispatch has dispatch ID but the ERD on diagram.io is dispatcher ID. Is the Dispatch entity a dispatcher or the dispatch itself?
    # The entity looks like it's the dispatch itself.
    dispatcher_id = Column("dispatcher_id", Integer,
                           ForeignKey(Dispatch.dispatch_id))
    operator_id = Column("operator_id", Integer,
                         ForeignKey(Operator.operator_id))
    trailer = Column("trailer", String(100))
    truck = Column("truck", String(100))
    start_location = Column("start_location", String(300))
    start_time = Column("start_time", DateTime)
    dump_location = Column("dump_location", String(500))
    load_location = Column("load_location", String(500))

    def __init__(self, id, op_id, trailer, truck, start_location, start_time, dump_location, load_location) -> None:
        self.dispatcher_id = id
        self.operator_id = op_id
        self.trailer = trailer
        self.truck = truck
        self.start_location = start_location
        self.start_time = start_time
        self.dump_location = dump_location
        self.load_location = load_location

    def __repr__(self):
        return f"({self.dispatch_id}) {self.operator_id} {self.trailer} {self.truck} {self.start_location} {self.start_time}"
