import sys
import os
from decimal import Decimal
from datetime import datetime, timezone

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.shop import Shop
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.services.auth import get_password_hash

def seed_database():
    print("🕸️  Recreating schema tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if users already seeded
        existing = db.query(User).filter(User.email == "resident@localhai.in").first()
        if existing:
            print("Database already contains seed users. Skipping recreation.")
            return

        print("🦸 Creating neighbourhood users...")
        peter = User(
            email="resident@localhai.in",
            hashed_password=get_password_hash("Neighbourhood2025"),
            full_name="Peter Parker",
            role="customer"
        )
        ramesh = User(
            email="guptastores@localhai.in",
            hashed_password=get_password_hash("KiranaPass2025"),
            full_name="Ramesh Gupta",
            role="shop_owner"
        )
        priya = User(
            email="priya@localhai.in",
            hashed_password=get_password_hash("GreenValley2025"),
            full_name="Priya Sharma",
            role="shop_owner"
        )
        syed = User(
            email="syed@localhai.in",
            hashed_password=get_password_hash("BakeryPass2025"),
            full_name="Syed Imran",
            role="shop_owner"
        )

        db.add_all([peter, ramesh, priya, syed])
        db.commit()
        db.refresh(peter)
        db.refresh(ramesh)
        db.refresh(priya)
        db.refresh(syed)

        print("🏪 Creating verified neighbourhood shops...")
        shop1 = Shop(
            owner_id=ramesh.id,
            name="Lakshmi Provision Store",
            description="Serving the neighbourhood with fresh daily staples, spices, and groceries for over 28 years.",
            address="Shop #4, Cross Rd 2, Indiranagar, Bengaluru",
            category="Kirana & Daily Essentials",
            banner_url="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop&q=80",
            badge="Neighbourhood Hero",
            delivery_time="15-25 mins",
            rating="4.8",
            is_active=True
        )

        shop2 = Shop(
            owner_id=priya.id,
            name="Green Valley Organics & Fruits",
            description="Farm-fresh regional veggies, seasonal fruits, and organic cold-pressed oils.",
            address="12th Main, 4th Block, Koramangala, Bengaluru",
            category="Fresh Fruits & Veggies",
            banner_url="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&auto=format&fit=crop&q=80",
            badge="Verified Local",
            delivery_time="20-30 mins",
            rating="4.9",
            is_active=True
        )

        shop3 = Shop(
            owner_id=syed.id,
            name="New Bangalore Bakery & Sweets",
            description="Iconic Iyengar-style sponge cakes, fresh milk bread, khara biscuits, and hot samosas.",
            address="88 Bazaar Street, Domlur, Bengaluru",
            category="Bakery & Savouries",
            banner_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80",
            badge="Legendary Kirana",
            delivery_time="10-20 mins",
            rating="4.7",
            is_active=True
        )

        db.add_all([shop1, shop2, shop3])
        db.commit()
        db.refresh(shop1)
        db.refresh(shop2)
        db.refresh(shop3)

        print("📦 Stocking counter products...")
        products = [
            # Shop 1
            Product(
                shop_id=shop1.id,
                name="Aashirvaad Shudh Chakki Atta",
                description="100% whole wheat grain atta made with traditional chakki process for softer rotis.",
                price=Decimal("245.00"),
                stock=32,
                unit="5 kg",
                category="Flours & Grains",
                image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop1.id,
                name="Amul Taaza Homogenised Toned Milk",
                description="Pasteurised toned milk with 3.0% fat, fresh and wholesome for morning tea and coffee.",
                price=Decimal("56.00"),
                stock=18,
                unit="1 L Pouch",
                category="Dairy & Eggs",
                image_url="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop1.id,
                name="Tata Salt Vacuum Evaporated Iodised",
                description="Desh ka namak with guaranteed iodine content for healthy family cooking.",
                price=Decimal("28.00"),
                stock=54,
                unit="1 kg",
                category="Salt & Spices",
                image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop1.id,
                name="Fortune Sunlite Refined Sunflower Oil",
                description="Light and healthy cooking oil fortified with Vitamin A and D.",
                price=Decimal("135.00"),
                stock=24,
                unit="1 L Pouch",
                category="Oils & Ghee",
                image_url="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop1.id,
                name="Maggi 2-Minute Masala Noodles",
                description="Classic favourite instant noodles with signature blend of 10 roasted spices.",
                price=Decimal("55.00"),
                stock=40,
                unit="Pack of 4 (280g)",
                category="Instant Food",
                image_url="https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop1.id,
                name="Brooke Bond Taj Mahal Rich Tea",
                description="Exquisite tea leaves selected for the discerning palate with signature aroma.",
                price=Decimal("320.00"),
                stock=15,
                unit="500 g",
                category="Tea & Beverages",
                image_url="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop1.id,
                name="Surf Excel Easy Wash Detergent Powder",
                description="Removes tough stains easily while keeping clothes vibrant and fresh.",
                price=Decimal("140.00"),
                stock=20,
                unit="1 kg",
                category="Household & Cleaning",
                image_url="https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop1.id,
                name="Fresh Farm Nashik Red Onions",
                description="Crisp and flavorful local onions sourced directly from wholesale mandi.",
                price=Decimal("35.00"),
                stock=45,
                unit="1 kg",
                category="Fresh Produce",
                image_url="https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),

            # Shop 2
            Product(
                shop_id=shop2.id,
                name="Organic Shimla Royal Delicious Apples",
                description="Crisp, sweet mountain-grown apples packed with vitamins and natural pectin.",
                price=Decimal("180.00"),
                stock=22,
                unit="1 kg (4-5 pcs)",
                category="Fresh Fruits",
                image_url="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop2.id,
                name="Naturally Ripened Robusta Bananas",
                description="Chemical-free ripened sweet bananas, high potassium and dietary fiber.",
                price=Decimal("60.00"),
                stock=30,
                unit="1 Dozen",
                category="Fresh Fruits",
                image_url="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),

            # Shop 3
            Product(
                shop_id=shop3.id,
                name="Iyengar Bakery Fresh Honey Butter Bun",
                description="Iconic sweet bread roll stuffed with whipped honey butter and tutti frutti.",
                price=Decimal("40.00"),
                stock=25,
                unit="Pack of 2",
                category="Bakery",
                image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
                is_available=True
            ),
            Product(
                shop_id=shop3.id,
                name="Crispy Bangalore Khara Biscuits",
                description="Traditional savory cookies flavoured with fresh coriander, curry leaves, and green chillies.",
                price=Decimal("85.00"),
                stock=18,
                unit="250 g Box",
                category="Snacks",
                image_url="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80",
                is_available=True
            )
        ]

        db.add_all(products)
        db.commit()

        print("⚡ Creating sample demo orders...")
        order1 = Order(
            order_number="LH-8041",
            shop_id=shop1.id,
            customer_id=peter.id,
            status="placed",
            total_amount=Decimal("357.00"),
            delivery_address="Flat 302, Spider Apt, 5th Cross, Indiranagar, Bengaluru",
            notes="Leave by the door if I'm swinging on the roof!"
        )
        db.add(order1)
        db.commit()
        db.refresh(order1)

        p1 = db.query(Product).filter(Product.shop_id == shop1.id, Product.name.ilike("%Atta%")).first()
        p2 = db.query(Product).filter(Product.shop_id == shop1.id, Product.name.ilike("%Milk%")).first()

        item1 = OrderItem(
            order_id=order1.id,
            product_id=p1.id,
            quantity=1,
            unit_price=p1.price,
            subtotal=p1.price * 1
        )
        item2 = OrderItem(
            order_id=order1.id,
            product_id=p2.id,
            quantity=2,
            unit_price=p2.price,
            subtotal=p2.price * 2
        )
        db.add_all([item1, item2])
        db.commit()

        print("✅ Local Hai database seed completed successfully!")
        print("Demo credentials:")
        print("  Customer:   resident@localhai.in / Neighbourhood2025")
        print("  Shopkeeper: guptastores@localhai.in / KiranaPass2025")

    except Exception as exc:
        db.rollback()
        print(f"❌ Error during seed: {exc}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

