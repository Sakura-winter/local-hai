from typing import List, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.shop import Shop
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.shop import ShopCreate, ShopUpdate, ShopResponse
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.schemas.order import OrderResponse, OrderStatusUpdate, OrderStatsResponse, OrderItemResponse
from app.dependencies import require_shop_owner

router = APIRouter(prefix="/owner", tags=["Shop Owner (The Daily Bugle)"])

# ── Shop Management ────────────────────────────────────────────────────────────

@router.get("/shops", response_model=List[ShopResponse])
def get_owner_shops(
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    return db.query(Shop).filter(Shop.owner_id == current_user.id).all()

@router.post("/shops", response_model=ShopResponse, status_code=status.HTTP_201_CREATED)
def create_owner_shop(
    shop_in: ShopCreate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    shop = Shop(
        owner_id=current_user.id,
        name=shop_in.name,
        description=shop_in.description,
        address=shop_in.address,
        category=shop_in.category,
        banner_url=shop_in.banner_url,
        badge=shop_in.badge,
        delivery_time=shop_in.delivery_time,
        rating=shop_in.rating,
        is_active=shop_in.is_active
    )
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return shop

@router.put("/shops/{shop_id}", response_model=ShopResponse)
def update_owner_shop(
    shop_id: int,
    shop_in: ShopUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    if shop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this shop")

    update_data = shop_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(shop, field, value)

    db.commit()
    db.refresh(shop)
    return shop

# ── Inventory Management ───────────────────────────────────────────────────────

@router.get("/products", response_model=List[ProductResponse])
def get_owner_products(
    shop_id: Optional[int] = Query(None),
    include_archived: bool = Query(False),
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    owner_shops = db.query(Shop.id).filter(Shop.owner_id == current_user.id).all()
    owner_shop_ids = [s[0] for s in owner_shops]

    if not owner_shop_ids:
        return []

    target_id = shop_id if shop_id in owner_shop_ids else owner_shop_ids[0]
    query = db.query(Product).filter(Product.shop_id == target_id)
    if not include_archived:
        query = query.filter(Product.is_available == True)
    return query.order_by(Product.id.desc()).all()

@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    target_shop_id = product_in.shop_id
    if not target_shop_id:
        first_shop = db.query(Shop).filter(Shop.owner_id == current_user.id).first()
        if not first_shop:
            raise HTTPException(status_code=400, detail="Please create a shop before adding products")
        target_shop_id = first_shop.id

    shop = db.query(Shop).filter(Shop.id == target_shop_id, Shop.owner_id == current_user.id).first()
    if not shop:
        raise HTTPException(status_code=403, detail="You do not own this shop")

    product = Product(
        shop_id=target_shop_id,
        name=product_in.name,
        description=product_in.description,
        price=product_in.price,
        stock=product_in.stock,
        unit=product_in.unit,
        category=product_in.category,
        image_url=product_in.image_url,
        is_available=product_in.is_available
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .join(Shop)
        .filter(Product.id == product_id, Shop.owner_id == current_user.id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not owned by you")

    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .join(Shop)
        .filter(Product.id == product_id, Shop.owner_id == current_user.id)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not owned by you")

    # Check if this product has historical order items
    order_items_count = db.query(OrderItem).filter(OrderItem.product_id == product_id).count()
    if order_items_count > 0:
        # Soft delete to preserve order history integrity
        product.is_available = False
        db.commit()
        return {"message": "Product removed from store counter and archived"}
    else:
        # Hard delete if no orders have been placed for this item
        db.delete(product)
        db.commit()
        return {"message": "Product permanently removed from inventory"}

# ── Order Management ───────────────────────────────────────────────────────────

def map_owner_order_response(order: Order) -> OrderResponse:
    items_resp = [
        OrderItemResponse(
            id=i.id,
            product_id=i.product_id,
            name=i.product.name if i.product else f"Product #{i.product_id}",
            quantity=i.quantity,
            unit_price=i.unit_price,
            subtotal=i.subtotal
        )
        for i in order.items
    ]

    return OrderResponse(
        id=order.id,
        order_number=order.order_number,
        shop_id=order.shop_id,
        shop_name=order.shop.name if order.shop else "Neighbourhood Store",
        customer_id=order.customer_id,
        customer_name=order.customer.full_name if order.customer else "Resident",
        customer_phone=None,
        status=order.status,
        total_amount=order.total_amount,
        delivery_address=order.delivery_address,
        notes=order.notes,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=items_resp
    )

@router.get("/orders", response_model=List[OrderResponse])
def get_owner_orders(
    shop_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    owner_shops = db.query(Shop.id).filter(Shop.owner_id == current_user.id).all()
    owner_shop_ids = [s[0] for s in owner_shops]

    if not owner_shop_ids:
        return []

    target_shop_id = shop_id if (shop_id and shop_id in owner_shop_ids) else None

    query = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.shop), joinedload(Order.customer))
    )

    if target_shop_id:
        query = query.filter(Order.shop_id == target_shop_id)
    else:
        query = query.filter(Order.shop_id.in_(owner_shop_ids))

    if status and status.lower() != "all":
        query = query.filter(Order.status == status.lower())

    orders = query.order_by(Order.id.desc()).all()
    return [map_owner_order_response(o) for o in orders]

@router.patch("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .join(Shop)
        .filter(Order.id == order_id, Shop.owner_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or not owned by you")

    new_status = status_in.status.lower()
    valid_transitions = {
        "placed": ["accepted", "cancelled"],
        "accepted": ["delivered", "cancelled"],
        "delivered": [],
        "cancelled": []
    }

    if new_status not in valid_transitions.get(order.status, []):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot transition order status from '{order.status}' to '{new_status}'."
        )

    order.status = new_status
    db.commit()

    order_reloaded = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.shop), joinedload(Order.customer))
        .filter(Order.id == order.id)
        .first()
    )
    return map_owner_order_response(order_reloaded)

# ── Stats & Dashboard ──────────────────────────────────────────────────────────

@router.get("/stats", response_model=OrderStatsResponse)
def get_owner_stats(
    shop_id: Optional[int] = Query(None),
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db)
):
    owner_shops = db.query(Shop.id).filter(Shop.owner_id == current_user.id).all()
    owner_shop_ids = [s[0] for s in owner_shops]

    if not owner_shop_ids:
        return OrderStatsResponse(
            total_orders=0,
            pending_orders=0,
            active_products=0,
            revenue_today=Decimal("0.00"),
            revenue_total=Decimal("0.00")
        )

    target_ids = [shop_id] if (shop_id and shop_id in owner_shop_ids) else owner_shop_ids

    total_orders = db.query(func.count(Order.id)).filter(Order.shop_id.in_(target_ids)).scalar() or 0
    pending_orders = db.query(func.count(Order.id)).filter(Order.shop_id.in_(target_ids), Order.status == "placed").scalar() or 0
    active_products = db.query(func.count(Product.id)).filter(Product.shop_id.in_(target_ids), Product.is_available == True).scalar() or 0

    rev_total = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.shop_id.in_(target_ids), Order.status != "cancelled")
        .scalar()
        or Decimal("0.00")
    )

    return OrderStatsResponse(
        total_orders=total_orders,
        pending_orders=pending_orders,
        active_products=active_products,
        revenue_today=Decimal(str(rev_total)),
        revenue_total=Decimal(str(rev_total))
    )

