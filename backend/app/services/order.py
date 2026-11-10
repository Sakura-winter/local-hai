import random
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.shop import Shop
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate

def create_order_atomic(db: Session, order_in: OrderCreate, customer_id: int) -> Order:
    # 1. Verify that shop exists and is active
    shop = db.query(Shop).filter(Shop.id == order_in.shop_id, Shop.is_active == True).first()
    if not shop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shop #{order_in.shop_id} does not exist or is currently inactive."
        )

    # 2. Extract product IDs and validate single-shop & uniqueness
    product_req_map = {}
    for item in order_in.items:
        if item.product_id in product_req_map:
            product_req_map[item.product_id] += item.quantity
        else:
            product_req_map[item.product_id] = item.quantity

    product_ids = sorted(list(product_req_map.keys()))

    try:
        # 3. Lock products with SELECT ... FOR UPDATE inside the transaction
        # Row locking prevents race conditions when concurrent customers order the last item
        locked_products = (
            db.query(Product)
            .filter(Product.id.in_(product_ids))
            .with_for_update()
            .all()
        )

        locked_prod_dict = {p.id: p for p in locked_products}

        # Check for missing products
        for pid in product_ids:
            if pid not in locked_prod_dict:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product #{pid} not found in store counter."
                )

        # 4. Enforce Single-Shop Constraint
        for p in locked_products:
            if p.shop_id != order_in.shop_id:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY if hasattr(status, 'HTTP_422_UNPROCESSABLE_ENTITY') else 422,
                    detail=f"Product '{p.name}' (ID: {p.id}) does not belong to shop #{order_in.shop_id}. Orders can only contain products from one shop."
                )

        # 5. Check stock levels for all products
        insufficient_stock_errors = []
        for pid, requested_qty in product_req_map.items():
            product = locked_prod_dict[pid]
            if product.stock < requested_qty:
                insufficient_stock_errors.append(
                    f"'{product.name}': requested {requested_qty}, but only {product.stock} available"
                )

        if insufficient_stock_errors:
            # Transaction will be rolled back automatically
            raise HTTPException(
                status_code=getattr(status, 'HTTP_422_UNPROCESSABLE_CONTENT', 422),
                detail=f"Insufficient stock for: {'; '.join(insufficient_stock_errors)}"
            )

        # 6. Generate unique order number
        order_number = f"LH-{random.randint(1000, 9999)}"

        # 7. Calculate server-side total and build order items
        total_amount = Decimal("0.00")
        order_items_to_create = []

        for pid, requested_qty in product_req_map.items():
            product = locked_prod_dict[pid]
            # Atomic stock decrement
            product.stock -= requested_qty
            
            unit_price = Decimal(str(product.price))
            subtotal = Decimal(str(round(unit_price * requested_qty, 2)))
            total_amount += subtotal

            order_items_to_create.append(
                OrderItem(
                    product_id=product.id,
                    quantity=requested_qty,
                    unit_price=unit_price,
                    subtotal=subtotal
                )
            )

        # 8. Create Order record
        new_order = Order(
            order_number=order_number,
            customer_id=customer_id,
            shop_id=order_in.shop_id,
            status="placed",
            total_amount=total_amount,
            delivery_address=order_in.delivery_address,
            notes=order_in.notes,
            items=order_items_to_create
        )

        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        return new_order

    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to place order: {str(exc)}"
        )
