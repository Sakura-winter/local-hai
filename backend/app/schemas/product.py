from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal = Field(..., ge=0)
    stock: int = Field(0, ge=0)
    unit: Optional[str] = "Standard Pack"
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_available: bool = True

class ProductCreate(ProductBase):
    shop_id: Optional[int] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    stock: Optional[int] = Field(None, ge=0)
    unit: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    shop_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

