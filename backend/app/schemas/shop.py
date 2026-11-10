from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ShopBase(BaseModel):
    name: str
    description: Optional[str] = None
    address: str
    category: Optional[str] = "Kirana & Daily Essentials"
    banner_url: Optional[str] = None
    badge: Optional[str] = "Verified Kirana"
    delivery_time: Optional[str] = "15-25 mins"
    rating: Optional[str] = "4.8"
    is_active: bool = True

class ShopCreate(ShopBase):
    pass

class ShopUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    category: Optional[str] = None
    banner_url: Optional[str] = None
    badge: Optional[str] = None
    delivery_time: Optional[str] = None
    is_active: Optional[bool] = None

class ShopResponse(ShopBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

