from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.shop import Shop
from app.schemas.auth import UserRegister, UserLogin, UserResponse, Token
from app.services.auth import get_password_hash, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if email is already taken
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A hero with this email address already exists in the neighbourhood."
        )

    # Hash password
    hashed_pwd = get_password_hash(user_in.password)

    # Create user
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    shop_id = None
    shop_name = None

    # If role is shop_owner, create their initial shop
    if user_in.role == "shop_owner":
        shop_title = user_in.shop_name or f"{user_in.full_name}'s Kirana"
        shop_addr = user_in.shop_address or "Local Neighbourhood"
        shop_cat = user_in.shop_category or "Kirana & Daily Essentials"
        
        new_shop = Shop(
            owner_id=new_user.id,
            name=shop_title,
            address=shop_addr,
            category=shop_cat,
            description="Your neighbourhood mom-and-pop store on Local Hai.",
            banner_url="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80",
            badge="Verified Kirana",
            delivery_time="15-25 mins",
            rating="5.0",
            is_active=True
        )
        db.add(new_shop)
        db.commit()
        db.refresh(new_shop)
        shop_id = new_shop.id
        shop_name = new_shop.name

    access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})

    user_resp = UserResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role,
        created_at=new_user.created_at,
        shop_id=shop_id,
        shop_name=shop_name
    )

    return Token(access_token=access_token, token_type="bearer", user=user_resp)

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Suit up with the right credentials!",
            headers={"WWW-Authenticate": "Bearer"},
        )

    shop_id = None
    shop_name = None
    if user.role == "shop_owner":
        shop = db.query(Shop).filter(Shop.owner_id == user.id).first()
        if shop:
            shop_id = shop.id
            shop_name = shop.name

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        created_at=user.created_at,
        shop_id=shop_id,
        shop_name=shop_name
    )

    return Token(access_token=access_token, token_type="bearer", user=user_resp)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    shop_id = None
    shop_name = None
    if current_user.role == "shop_owner":
        shop = db.query(Shop).filter(Shop.owner_id == current_user.id).first()
        if shop:
            shop_id = shop.id
            shop_name = shop.name

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        created_at=current_user.created_at,
        shop_id=shop_id,
        shop_name=shop_name
    )

