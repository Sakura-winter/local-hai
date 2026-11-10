from fastapi import FastAPI, Depends, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import get_db, engine, Base
from app.routers import auth, shops, products, orders, owner

# Create DB tables automatically if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Local Hai API",
    description="Community Marketplace API connecting neighbourhood kiranas directly with nearby residents.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Endpoint at ROOT (not under /api)
# Returns 200 only if API is up AND it can run a simple query against the database, otherwise 503
@app.get("/health", tags=["Health"])
def health_check(response: Response, db: Session = Depends(get_db)):
    try:
        # Run a simple query to verify database connectivity
        db.execute(text("SELECT 1;"))
        return {
            "status": "healthy",
            "database": "connected",
            "message": "Your friendly neighbourhood API and database are swinging strong."
        }
    except Exception as exc:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(exc)
        }

# Mount all business routes under /api
app.include_router(auth.router, prefix="/api")
app.include_router(shops.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(owner.router, prefix="/api")

@app.get("/", tags=["Root"])
def root():
    return {
        "name": "Local Hai API",
        "tagline": "Your friendly neighbourhood local store.",
        "docs": "/docs",
        "health": "/health"
    }

