from sqlalchemy import Column, String, DateTime, Integer, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from models.model import Base
from config import db


class UsageArchive(Base):
    __tablename__ = 'usage_archive'
    user_id = Column(String(50), ForeignKey('users.id'), primary_key=True, unique=True) # Ensures a 1 - 1 relationship
    billing_start_period = Column(Integer,  nullable=False, primary_key=True)
    billing_end_period = Column(Integer,  nullable=False)
    amount = Column(Integer, CheckConstraint("amount >= 0"))
    
    
    user = relationship("User", back_populates="usage_archive")
    
