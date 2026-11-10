from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(Text, nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="customer")  # "customer" or "shop_owner"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    shops = relationship("Shop", back_populates="owner", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="customer", cascade="all, delete-orphan")

