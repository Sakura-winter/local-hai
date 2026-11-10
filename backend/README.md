# Local Hai — Backend API

> *"Your friendly neighbourhood local store."*

Production-ready FastAPI backend for Local Hai, backed by PostgreSQL, SQLAlchemy 2.0, Alembic migrations, and the `psycopg` driver.

---

## Architecture & Features
- **FastAPI 0.161+ & Pydantic v2**: High performance async-ready REST framework with schema validation.
- **SQLAlchemy 2.0 & psycopg**: Relational ORM mapping `users`, `shops`, `products`, `orders`, and `order_items`.
- **Atomic Transactions & Row Locking**: Orders are placed with `SELECT ... FOR UPDATE` row locks, preventing race conditions when multiple customers buy the last item.
- **JWT & bcrypt Auth**: Stateless JSON Web Tokens, bcrypt password hashing, and role-based access (`customer` vs `shop_owner`).
- **Health Check Endpoint**: `GET /health` at root verifies both the web process and live database query execution (returns 200 on success, 503 if unreachable).
- **Interactive OpenAPI Documentation**: Available at `/docs` (Swagger UI) and `/redoc`.

---

## Local Setup & Run

### 1. Prerequisites
- Python 3.11+
- PostgreSQL 15+ running locally (e.g. `brew services start postgresql@17`)

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` matches your local database:
```dotenv
DATABASE_URL=postgresql+psycopg:///localhai
JWT_SECRET=your-secure-random-secret
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Database Creation & Migrations
```bash
# Create database (if not already created)
createdb localhai

# Run Alembic migrations
alembic upgrade head

# Seed initial neighbourhood shops, products & demo users
python seed.py
```

### 4. Run the API Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- API Base URL: `http://localhost:8000/api`
- Interactive Swagger UI: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

---

## Demo Accounts
| Role | Email | Password | Store Name |
|---|---|---|---|
| **Customer** | `resident@localhai.in` | `Neighbourhood2025` | — |
| **Shopkeeper** | `guptastores@localhai.in` | `KiranaPass2025` | Lakshmi Provision Store |

