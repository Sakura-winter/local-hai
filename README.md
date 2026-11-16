# 🕸️ Local Hai

> *"Your friendly neighbourhood local store."*
> *"The heroes were your local shopkeepers all along."*

**Local Hai** is a community marketplace where neighbourhood kirana / mom-and-pop shops register themselves and sell products online to nearby customers — no middleman, no dark stores, no platform tax.

Think of it as a **Shopify for your local street** — shop owners control their own storefront, inventory, and orders, while customers browse and order from the shops they already trust.

---

## ✨ Features (MVP)

### 🛒 Customer
- Browse nearby shops in a clean grid layout
- Search products across all shops
- View a shop's full product catalogue
- Add items to cart (**"Add to web"** 🕸️)
- Place orders (**"Swing it over!"**) with order confirmation (**"Order caught in the web!"**)
- View order history with live status tracking

### 🏪 Shop Owner
- Register a shop and manage its details
- **Inventory management** — add, edit, delete, and toggle product visibility
- **Dashboard** (**"Your Daily Bugle"**) — daily order count, revenue stats, pending orders
- **Order management** — accept, deliver, or cancel incoming orders

### 🔐 Auth
- JWT-based authentication with role selection (customer / shop_owner)
- Protected routes by role
- bcrypt password hashing

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│          PRESENTATION           │
│   React (Vite) — static files   │
│   Served by Nginx on port 80    │
└────────────────┬────────────────┘
                 │  /api/* proxied by Nginx
┌────────────────▼────────────────┐
│          APPLICATION            │
│   FastAPI (Python) — uvicorn    │
│   Port 8000                     │
└────────────────┬────────────────┘
                 │  SQLAlchemy 2.0 / psycopg
┌────────────────▼────────────────┐
│             DATA                │
│   PostgreSQL                    │
│   Port 5432                     │
└─────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Python 3.11+, FastAPI, Pydantic v2 |
| ORM | SQLAlchemy 2.0 (async) |
| Migrations | Alembic |
| Database | PostgreSQL 15+ |
| Auth | JWT (python-jose), bcrypt |
| Server | uvicorn (ASGI) |

---

## 📁 Project Structure

```
localhai/
├── PROJECT.md              # Full project specification
├── README.md               # This file
├── .gitignore
│
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── api/            # All API calls (fetch wrapper + JWT)
│   │   ├── components/     # Navbar, Footer, ProtectedRoute
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── mock/           # Mock data (flag-gated)
│   │   └── pages/          # One file per screen
│   └── ...
│
├── backend/                # FastAPI app
│   ├── app/
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── schemas/        # Pydantic v2 schemas
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic (auth, orders)
│   │   ├── dependencies.py # Auth guards
│   │   ├── config.py       # Environment config
│   │   ├── database.py     # DB engine + sessions
│   │   └── main.py         # FastAPI entrypoint
│   ├── alembic/            # DB migrations
│   ├── seed.py             # Demo data script
│   └── ...
│
├── terraform/              # (placeholder — managed separately)
├── ansible/                # (placeholder — managed separately)
├── puppet/                 # (placeholder — managed separately)
└── nagios/                 # (placeholder — managed separately)
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 15+** running locally

### 1. Database

```bash
createdb localhai
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env → set DATABASE_URL, JWT_SECRET

# Run migrations
alembic upgrade head

# (Optional) Seed demo data
python seed.py

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API docs available at **http://localhost:8000/docs**

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start dev server
npm run dev
```

App available at **http://localhost:5173**

> The Vite dev server proxies `/api/*` to `http://localhost:8000` so the frontend talks to the backend without CORS issues during development.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | — | Secret key for JWT signing |
| `CORS_ORIGINS` | ❌ | `http://localhost:5173` | Comma-separated allowed origins |
| `JWT_ALGORITHM` | ❌ | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ | `60` | Token expiry in minutes |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ❌ | `/api` | Base URL for API requests |
| `VITE_USE_MOCK` | ❌ | `false` | Use mock data instead of real API |

---

## 📡 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | ✗ | Health check (API + DB) |
| `POST` | `/api/auth/register` | ✗ | Register new user |
| `POST` | `/api/auth/login` | ✗ | Login, get JWT |
| `GET` | `/api/auth/me` | ✓ | Current user profile |
| `GET` | `/api/shops` | ✗ | List all shops |
| `GET` | `/api/shops/{id}/products` | ✗ | Shop's product catalogue |
| `GET` | `/api/products/search?q=` | ✗ | Global product search |
| `POST` | `/api/orders` | ✓ customer | Place an order |
| `GET` | `/api/orders` | ✓ customer | Order history |
| `DELETE` | `/api/orders/{id}` | ✓ customer | Cancel order |
| `POST` | `/api/owner/shops` | ✓ owner | Create a shop |
| `GET` | `/api/owner/products` | ✓ owner | List own products |
| `POST` | `/api/owner/products` | ✓ owner | Add a product |
| `PUT` | `/api/owner/products/{id}` | ✓ owner | Edit product |
| `DELETE` | `/api/owner/products/{id}` | ✓ owner | Delete/archive product |
| `GET` | `/api/owner/orders` | ✓ owner | Incoming orders |
| `PATCH` | `/api/owner/orders/{id}/status` | ✓ owner | Accept/deliver/cancel |
| `GET` | `/api/owner/stats` | ✓ owner | Dashboard stats |

---

## 🕷️ Spider-Man Themed Copy

| UI Element | Copy |
|------------|------|
| Hero headline | *"Your friendly neighbourhood local store."* |
| Hero subline | *"The heroes were your local shopkeepers all along."* |
| Add to cart | **"Add to web"** |
| Place order | **"Swing it over!"** |
| Order confirmed | *"Order caught in the web!"* |
| Dashboard heading | **"Your Daily Bugle"** |
| Empty cart | *"Your web is empty."* |
| Logout | *"Swing away"* |

---

## 📋 Business Rules

- **Single-shop cart** — a cart can only contain items from one shop
- **Atomic orders** — stock is checked and decremented in a single DB transaction with row-level locking (`SELECT ... FOR UPDATE`)
- **Insufficient stock** → `422` error, entire order rolled back
- **Price snapshot** — `order_items.unit_price` is frozen at purchase time
- **Order lifecycle:** `placed` → `accepted` → `delivered` (or `cancelled`)

---

## 🔒 Out of Scope (MVP)

Payments · Real delivery tracking · Maps / GPS · Notifications · Multi-region · Reviews & ratings · Image upload · Multi-shop cart · Admin panel · DevOps (Terraform, Ansible, Puppet, Nagios, Docker, CI/CD — handled separately)

---

## 🧑‍💻 Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Shop Owner | `owner@localhai.com` | `password123` |
| Customer | `customer@localhai.com` | `password123` |

---

## 📄 License

This is a class project. Not licensed for production use.
