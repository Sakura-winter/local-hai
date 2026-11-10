from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/products", tags=["Products (Global Search)"])

@router.get("/search", response_model=List[ProductResponse])
def search_products(
    q: Optional[str] = Query(None, description="Search term across all stores"),
    db: Session = Depends(get_db)
):
    if not q or not q.strip():
        return []

    term = f"%{q.strip()}%"
    return (
        db.query(Product)
        .filter(
            Product.is_available == True,
            or_(
                Product.name.ilike(term),
                Product.description.ilike(term),
                Product.category.ilike(term)
            )
        )
        .order_by(Product.id.asc())
        .limit(50)
        .all()
    )

