import re
from sqlalchemy import Column, String, DateTime, Integer, func, Boolean, CheckConstraint, ForeignKey
from sqlalchemy.orm import validates, relationship
from models.model import Base
from config import db
from enum import Enum
from datetime import timedelta, datetime
import os
import time

RESET_PASSWORD_CODE_EXPIRY = os.environ.get("RESET_PASSWORD_CODE_EXPIRY")


class Usage(Base):
    __tablename__ = 'usage'
    usage_id = Column(Integer, primary_key=True)   
    user_id = Column(String(50), ForeignKey("users.id") , unique=True) # Ensures a 1 - 1 relationship
    billing_start_period = Column(Integer,  nullable=False)
    billing_end_period = Column(Integer,  nullable=False)
    amount = Column(Integer, CheckConstraint("amount >= 0"))
    
    
    user = relationship("User", back_populates="usage")
    