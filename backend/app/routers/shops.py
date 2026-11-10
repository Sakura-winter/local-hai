from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.shop import Shop
from app.models.product import Product
from app.schemas.shop import ShopResponse
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/shops", tags=["Shops (Customer-Facing)"])

@router.get("", response_model=List[ShopResponse])
def get_shops(
    search: Optional[str] = Query(None, description="Search by shop name, address, or category"),
    db: Session = Depends(get_db)
):
    query = db.query(Shop).filter(Shop.is_active == True)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Shop.name.ilike(term),
                Shop.category.ilike(term),
                Shop.address.ilike(term)
            )
        )
    return query.order_by(Shop.id.asc()).all()

@router.get("/{shop_id}", response_model=ShopResponse)
def get_shop(shop_id: int, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.id == shop_id, Shop.is_active == True).first()
    if not shop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shop #{shop_id} not found in the neighbourhood."
        )
    return shop

@router.get("/{shop_id}/products", response_model=List[ProductResponse])
def get_shop_products(
    shop_id: int,
    search: Optional[str] = Query(None, description="Search product name or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    # Verify shop exists
    shop = db.query(Shop).filter(Shop.id == shop_id, Shop.is_active == True).first()
    if not shop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shop #{shop_id} not found."
        )

    query = db.query(Product).filter(Product.shop_id == shop_id, Product.is_available == True)

    if category and category.strip() and category.strip() != "All":
        query = query.filter(Product.category.ilike(category.strip()))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(term),
                Product.description.ilike(term)
            )
        )

    return query.order_by(Product.id.asc()).all()

