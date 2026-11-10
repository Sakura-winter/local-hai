from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "customer"  # "customer" or "shop_owner"
    shop_name: Optional[str] = None
    shop_address: Optional[str] = None
    shop_category: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime
    shop_id: Optional[int] = None
    shop_name: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

