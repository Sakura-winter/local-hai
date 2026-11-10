from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    shop_id: int
    delivery_address: str
    notes: Optional[str] = None
    items: List[OrderItemCreate] = Field(..., min_length=1)

class OrderStatusUpdate(BaseModel):
    status: str  # "accepted", "delivered", "cancelled"

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    name: Optional[str] = None
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    shop_id: int
    shop_name: Optional[str] = None
    customer_id: int
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    status: str
    total_amount: Decimal
    delivery_address: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderStatsResponse(BaseModel):
    total_orders: int
    pending_orders: int
    active_products: int
    revenue_today: Decimal
    revenue_total: Decimal

