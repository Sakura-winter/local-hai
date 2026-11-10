from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.user import User
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from app.dependencies import get_current_user, require_customer
from app.services.order import create_order_atomic

router = APIRouter(prefix="/orders", tags=["Orders (Customer)"])

def map_order_to_response(order: Order) -> OrderResponse:
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

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    created = create_order_atomic(db=db, order_in=order_in, customer_id=current_user.id)
    # Reload with relationships
    order_full = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.shop), joinedload(Order.customer))
        .filter(Order.id == created.id)
        .first()
    )
    return map_order_to_response(order_full)

@router.get("", response_model=List[OrderResponse])
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.shop), joinedload(Order.customer))
        .filter(Order.customer_id == current_user.id)
        .order_by(Order.id.desc())
        .all()
    )
    return [map_order_to_response(o) for o in orders]

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.shop), joinedload(Order.customer))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order #{order_id} not found."
        )

    # Customers can only view their own orders; owners can view orders for their shops
    if current_user.role == "customer" and order.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this order."
        )

    return map_order_to_response(order)

@router.delete("/{order_id}")
def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order #{order_id} not found."
        )

    if order.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to cancel this order."
        )

    if order.status != "placed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel order with status '{order.status}'. Only 'placed' orders may be cancelled."
        )

    order.status = "cancelled"
    db.commit()
    return {"message": "Order was successfully cancelled."}

