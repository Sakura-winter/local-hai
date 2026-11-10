# Local Hai — Project Document

> *"Your friendly neighbourhood local store."*
> *"The heroes were your local shopkeepers all along."*

---

## 1. Overview and Problem Statement

### What is Local Hai?

**Local Hai** is a community marketplace that connects neighbourhood kirana / mom-and-pop shops with nearby customers — online. Instead of a single company (Blinkit, Zepto, Swiggy Instamart) owning the relationship, controlling margins and setting delivery rules, every shop owner retains full control over their own storefront, inventory, prices and orders.

### The Problem

Hyperlocal delivery apps today work by:
1. Aggregating inventory into dark stores owned by the platform.
2. Charging shops a cut of every sale or pushing them out entirely.
3. Making local shops invisible to online shoppers.

The local kirana has trust, proximity, credit relationships and curated stock that no warehouse can replicate — but zero digital presence.

### The Solution

Local Hai gives every neighbourhood shop owner a **self-managed digital storefront** at zero platform tax:

- Customers browse shops near them and order directly from their own kirana.
- Owners manage their own inventory, prices and orders from a simple dashboard.
- No middleman. No dark store. No algorithmic demotion.

### Long-Term Vision

A Shopify-like platform for neighbourhood retail: multi-shop discovery, integrated delivery, analytics dashboards, inventory sync and eventually a network of trusted local couriers. The current scope is a **focused MVP** only.

---

## 2. User Types and Feature List (MVP)

### User Types

| Role | Description |
|------|-------------|
| `customer` | Browses nearby shops, searches products, places orders, tracks status |
| `shop_owner` | Registers a shop, manages inventory, reviews and fulfils orders |

### MVP Features

#### Authentication (Both roles)
- Register with email, password and role selection (`customer` or `shop_owner`)
- Login and receive a JWT
- Protected routes by role

#### Shop Owner
- **Dashboard** — daily order count, revenue summary, pending orders (The Daily Bugle)
- **Inventory Management** — add, edit and delete products; set name, description, price, stock quantity, category
- **Order Management** — view incoming orders, accept them, mark as delivered, cancel

#### Customer
- **Browse** — see a grid of registered nearby shops
- **Search** — full-text search across product names
- **Shop Page** — view a specific shop's product catalogue
- **Cart** — add products (single-shop constraint enforced), adjust quantities, remove items
- **Checkout** — place order, see confirmation ("Order caught in the web!")
- **Order History** — list past orders with current status

---

## 3. Architecture and Tech Stack

### Three-Tier Architecture

```
┌─────────────────────────────────┐
│          PRESENTATION           │
│   React (Vite) — static files   │
│   Served by Nginx on port 80    │
└────────────────┬────────────────┘
                 │  HTTP (REST / JSON)
                 │  /api/* proxied by Nginx
┌────────────────▼────────────────┐
│          APPLICATION            │
│   FastAPI (Python) — uvicorn    │
│   Port 8000 (internal)          │
└────────────────┬────────────────┘
                 │  SQLAlchemy 2.0 / psycopg
┌────────────────▼────────────────┐
│             DATA                │
│   PostgreSQL — separate server  │
│   Port 5432 (internal)          │
└─────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18, Vite, React Router v6 | Desktop-first responsive web app |
| Styling | CSS Modules / plain CSS | Stitch design tokens |
| API client | fetch (native) | All calls centralised in `frontend/src/api/` |
| Backend | Python 3.11+, FastAPI | Async, Pydantic v2 validation |
| ORM | SQLAlchemy 2.0 | Async sessions |
| Migrations | Alembic | Version-controlled schema |
| Database driver | psycopg (psycopg3) | Native async support |
| Auth | JWT (python-jose), bcrypt | Stateless tokens |
| Database | PostgreSQL 15+ | ACID transactions, row-level locking |
| Web server | Nginx (you manage) | Serves static files + reverse proxy |
| Process manager | uvicorn | ASGI server for FastAPI |

---

## 4. Folder Structure

```
localhai/
├── PROJECT.md                  ← this document
├── README.md                   ← repo overview
├── .gitignore
│
├── frontend/                   ← React + Vite app
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/                ← all API calls live here
│       │   ├── auth.js
│       │   ├── shops.js
│       │   ├── products.js
│       │   ├── orders.js
│       │   └── client.js       ← base fetch wrapper + JWT injection
│       ├── components/         ← shared / reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ShopCard.jsx
│       │   └── ...
│       ├── pages/              ← one file per screen
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── CustomerHome.jsx
│       │   ├── ShopPage.jsx
│       │   ├── Cart.jsx
│       │   ├── OrderConfirmation.jsx
│       │   ├── OrderHistory.jsx
│       │   ├── OwnerDashboard.jsx
│       │   ├── OwnerInventory.jsx
│       │   └── OwnerOrders.jsx
│       ├── context/            ← React context (auth, cart)
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       └── mock/               ← mock data (flag-gated)
│           └── data.js
│
├── backend/                    ← FastAPI app
│   ├── README.md
│   ├── requirements.txt
│   ├── .env.example
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   ├── seed.py                 ← demo data script
│   └── app/
│       ├── main.py             ← FastAPI app + router registration
│       ├── config.py           ← env-var settings (pydantic-settings)
│       ├── database.py         ← async engine + session factory
│       ├── models/             ← SQLAlchemy ORM models
│       │   ├── user.py
│       │   ├── shop.py
│       │   ├── product.py
│       │   ├── order.py
│       │   └── order_item.py
│       ├── schemas/            ← Pydantic v2 request/response schemas
│       │   ├── auth.py
│       │   ├── shop.py
│       │   ├── product.py
│       │   └── order.py
│       ├── routers/            ← FastAPI APIRouter per domain
│       │   ├── auth.py
│       │   ├── shops.py
│       │   ├── products.py
│       │   ├── orders.py
│       │   └── owner.py
│       ├── services/           ← business logic (transactions, stock)
│       │   ├── auth.py
│       │   └── order.py
│       └── dependencies.py     ← get_current_user, role guards
│
├── terraform/                  ← (empty — managed by you)
├── ansible/                    ← (empty — managed by you)
├── puppet/                     ← (empty — managed by you)
└── nagios/                     ← (empty — managed by you)
```

---

## 5. Database Schema

### Entity-Relationship Overview

```
users ──< shops ──< products
                       │
orders >── order_items ┘
  │
users (customer)
```

### Tables

---

#### `users`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PK | Auto-increment |
| `email` | `VARCHAR(255)` | UNIQUE NOT NULL | Login identifier |
| `hashed_password` | `TEXT` | NOT NULL | bcrypt hash |
| `full_name` | `VARCHAR(255)` | NOT NULL | Display name |
| `role` | `VARCHAR(20)` | NOT NULL | `'customer'` or `'shop_owner'` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL DEFAULT now() | |

---

#### `shops`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PK | Auto-increment |
| `owner_id` | `INTEGER` | FK → users(id) NOT NULL | Shop owner |
| `name` | `VARCHAR(255)` | NOT NULL | Shop display name |
| `description` | `TEXT` | | Tagline / about |
| `address` | `TEXT` | NOT NULL | Physical address (MVP: text only) |
| `category` | `VARCHAR(100)` | | e.g. "Grocery", "Electronics" |
| `is_active` | `BOOLEAN` | NOT NULL DEFAULT true | Soft-disable |
| `created_at` | `TIMESTAMPTZ` | NOT NULL DEFAULT now() | |

**Relationships:** One `user` (role=`shop_owner`) → many `shops`. Each shop belongs to exactly one owner.

---

#### `products`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PK | Auto-increment |
| `shop_id` | `INTEGER` | FK → shops(id) NOT NULL | Parent shop |
| `name` | `VARCHAR(255)` | NOT NULL | Product name |
| `description` | `TEXT` | | |
| `price` | `NUMERIC(10,2)` | NOT NULL CHECK (price >= 0) | INR, two decimal places |
| `stock` | `INTEGER` | NOT NULL DEFAULT 0 CHECK (stock >= 0) | Current stock level |
| `category` | `VARCHAR(100)` | | Product category |
| `image_url` | `TEXT` | | Optional image |
| `is_available` | `BOOLEAN` | NOT NULL DEFAULT true | Soft-hide |
| `created_at` | `TIMESTAMPTZ` | NOT NULL DEFAULT now() | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL DEFAULT now() | Updated on edit |

**Relationships:** One `shop` → many `products`.

---

#### `orders`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PK | Auto-increment |
| `customer_id` | `INTEGER` | FK → users(id) NOT NULL | Ordering customer |
| `shop_id` | `INTEGER` | FK → shops(id) NOT NULL | Exactly ONE shop per order |
| `status` | `VARCHAR(20)` | NOT NULL DEFAULT 'placed' | See business rules |
| `total_amount` | `NUMERIC(10,2)` | NOT NULL | Sum of item subtotals at purchase time |
| `delivery_address` | `TEXT` | NOT NULL | Customer's delivery address |
| `notes` | `TEXT` | | Customer instructions |
| `created_at` | `TIMESTAMPTZ` | NOT NULL DEFAULT now() | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL DEFAULT now() | |

**Relationships:** One `user` (role=`customer`) → many `orders`. One `shop` → many `orders`. **Each order belongs to exactly one shop.**

---

#### `order_items`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PK | Auto-increment |
| `order_id` | `INTEGER` | FK → orders(id) NOT NULL | Parent order |
| `product_id` | `INTEGER` | FK → products(id) NOT NULL | Snapshot reference |
| `quantity` | `INTEGER` | NOT NULL CHECK (quantity > 0) | Units ordered |
| `unit_price` | `NUMERIC(10,2)` | NOT NULL | Price **at time of purchase** (immutable) |
| `subtotal` | `NUMERIC(10,2)` | NOT NULL | `quantity × unit_price` (denormalised for speed) |

**Relationships:** One `order` → many `order_items`. Each item references one `product` (price is captured at purchase — subsequent price changes do not affect old orders).

---

## 6. REST API Reference

All endpoints are prefixed with `/api`. Auth = JWT Bearer token required.

### Authentication

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| `POST` | `/api/auth/register` | ✗ | `{email, password, full_name, role}` | `{id, email, full_name, role, access_token}` |
| `POST` | `/api/auth/login` | ✗ | `{email, password}` | `{access_token, token_type, user: {id, email, role}}` |
| `GET` | `/api/auth/me` | ✓ | — | `{id, email, full_name, role}` |

### Shops (Customer-facing)

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| `GET` | `/api/shops` | ✗ | query: `?search=` | `[{id, name, description, address, category, is_active}]` |
| `GET` | `/api/shops/{shop_id}` | ✗ | — | Shop detail object |
| `GET` | `/api/shops/{shop_id}/products` | ✗ | query: `?search=&category=` | `[{id, name, price, stock, category, image_url, is_available}]` |

### Products — Global Search

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| `GET` | `/api/products/search` | ✗ | query: `?q=` | `[{product…, shop: {id, name}}]` |

### Orders (Customer)

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| `POST` | `/api/orders` | ✓ customer | `{shop_id, delivery_address, notes?, items:[{product_id, quantity}]}` | `{order_id, status, total_amount, items}` |
| `GET` | `/api/orders` | ✓ customer | — | `[{id, shop_name, status, total_amount, created_at}]` |
| `GET` | `/api/orders/{order_id}` | ✓ customer | — | Full order detail with items |
| `DELETE` | `/api/orders/{order_id}` | ✓ customer | — | Cancel order (only if status=`placed`) |

### Owner — Shop Management

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| `POST` | `/api/owner/shops` | ✓ shop_owner | `{name, description, address, category}` | Created shop object |
| `GET` | `/api/owner/shops` | ✓ shop_owner | — | List of owner's shops |
| `PUT` | `/api/owner/shops/{shop_id}` | ✓ shop_owner | `{name?, description?, address?, category?, is_active?}` | Updated shop object |

### Owner — Inventory

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| `POST` | `/api/owner/products` | ✓ shop_owner | `{shop_id, name, description, price, stock, category, image_url?}` | Created product |
| `GET` | `/api/owner/products` | ✓ shop_owner | query: `?shop_id=` | `[{id, name, price, stock, is_available}]` |
| `PUT` | `/api/owner/products/{product_id}` | ✓ shop_owner | `{name?, description?, price?, stock?, is_available?}` | Updated product |
| `DELETE` | `/api/owner/products/{product_id}` | ✓ shop_owner | — | `{message: "deleted"}` |

### Owner — Orders

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| `GET` | `/api/owner/orders` | ✓ shop_owner | query: `?shop_id=&status=` | `[{id, customer_name, status, total_amount, created_at}]` |
| `GET` | `/api/owner/orders/{order_id}` | ✓ shop_owner | — | Full order with items |
| `PATCH` | `/api/owner/orders/{order_id}/status` | ✓ shop_owner | `{status: "accepted"\|"delivered"\|"cancelled"}` | Updated order |

### Owner — Stats / Dashboard

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|----------|
| `GET` | `/api/owner/stats` | ✓ shop_owner | query: `?shop_id=` | `{total_orders, pending_orders, revenue_today, revenue_total}` |

### Health

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| `GET` | `/health` | ✗ | 200 if API + DB reachable; 503 otherwise |

---

## 7. Business Rules

### Order Creation (Atomic Transaction)

1. **Single-shop constraint** — a cart/order may only contain products from **one shop**. The API validates that all `product_id`s in the request belong to the same `shop_id`.
2. **Stock check with row locking** — inside one database transaction, each product row is fetched with `SELECT ... FOR UPDATE` before decrementing stock. This prevents two concurrent customers from buying the last unit.
3. **Insufficient stock → 422** — if any product's stock is less than the requested quantity, the entire transaction is rolled back and a `422 Unprocessable Entity` is returned with which product(s) failed.
4. **Stock reduction** — on successful order creation, `products.stock` is decremented by the ordered quantity **in the same transaction**.
5. **Price snapshot** — `order_items.unit_price` is set to `products.price` at the moment of order creation. Future price edits do **not** affect existing orders.
6. **Total calculation** — `orders.total_amount` = Σ `(quantity × unit_price)` for all items; computed server-side, never trusted from the client.

### Order Status Lifecycle

```
placed ──► accepted ──► delivered
   │                        
   └──────────────────► cancelled
```

- **placed** → initial state after successful order creation.
- **accepted** → shop owner acknowledges the order.
- **delivered** → shop owner marks fulfilment complete.
- **cancelled** → customer may cancel while status is `placed`; owner may cancel at any stage before `delivered`.
- Backward transitions are forbidden; the API returns `400` for invalid transitions.

### Access Control

- Owners may only view/edit their **own** shops and products. Attempting to touch another owner's resources returns `403 Forbidden`.
- Customers may only view their **own** orders.
- Order detail endpoints verify ownership before returning data.

---

## 8. UI Screens

### Spider-Man-Inspired Copy Tone

The app speaks with warmth, neighbourhood energy and a Spider-Man flavour — no corporate jargon, no cold UI text. Examples:

| UI Element | Copy |
|------------|------|
| Hero headline | *"Your friendly neighbourhood local store."* |
| Hero subline | *"The heroes were your local shopkeepers all along."* |
| Add to cart button | **"Add to web"** |
| Place order button | **"Swing it over!"** |
| Order confirmed message | *"Order caught in the web!"* |
| Shop owner dashboard heading | **"Your Daily Bugle"** |
| Empty cart state | *"Your web is empty."* |
| No shops found | *"No heroes spotted in this neighbourhood yet."* |
| Loading products | *"Spinning the web…"* |
| Logout | *"Swing away"* |

### Screen List

#### Customer Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | **Login** | `/login` | Email + password form; link to register |
| 2 | **Register** | `/register` | Toggle between Customer / Shop Owner; email, password, name, role |
| 3 | **Customer Home** | `/` | Search bar + grid of nearby shops (ShopCards) |
| 4 | **Shop Page** | `/shop/:id` | Shop info header, product grid with "Add to web" button per product |
| 5 | **Cart** | `/cart` | List of cart items, quantity controls, total, "Swing it over!" CTA |
| 6 | **Order Confirmation** | `/order/:id/confirmation` | "Order caught in the web!" + order summary |
| 7 | **Order History** | `/orders` | List of past orders with status badges |

#### Shop Owner Screens

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 8 | **Owner Dashboard** | `/owner/dashboard` | "Your Daily Bugle" — pending orders count, revenue stats, recent orders table |
| 9 | **Inventory** | `/owner/inventory` | Product table with add/edit/delete; stock levels highlighted when low |
| 10 | **Owner Orders** | `/owner/orders` | Incoming orders list; accept / cancel / mark delivered buttons |

---

## 9. Environment Variables and Local Development

### Backend (`backend/.env`)

```dotenv
# Database (required)
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/localhai

# Auth (required — generate a strong random secret)
JWT_SECRET=your-super-secret-key-change-this

# CORS (comma-separated origins for the FastAPI CORS middleware)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend (`frontend/.env`)

```dotenv
# Base URL for all API requests (empty = same origin, proxied by Vite dev server)
VITE_API_URL=/api

# Set to "true" to use mock data instead of real API calls
VITE_USE_MOCK=false
```

### Running Locally (Step-by-Step)

#### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ running locally

#### 1 — Database

```bash
createdb localhai
```

#### 2 — Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env           # then edit DATABASE_URL, JWT_SECRET

alembic upgrade head           # apply all migrations
python seed.py                 # (optional) load demo data

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API available at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

#### 3 — Frontend

```bash
cd frontend
npm install

cp .env.example .env           # adjust VITE_API_URL if needed

npm run dev
```

App available at `http://localhost:5173`.

Vite dev server proxies `/api/*` to `http://localhost:8000` so the frontend talks to the real backend without CORS issues during development.

---

## 10. Out of Scope (MVP)

The following are explicitly **not** part of the current build:

| Category | Excluded |
|----------|---------|
| **Payments** | No Razorpay, Stripe, UPI, COD flow |
| **Delivery** | No real-time tracking, no delivery agent assignment |
| **Maps / Location** | No GPS, no radius-based filtering, no map view |
| **Notifications** | No email, SMS or push notifications |
| **Multi-region** | No CDN, no data replication, single-region only |
| **Reviews & Ratings** | No product or shop reviews |
| **Image Upload** | No file upload; image URLs are plain text strings |
| **Multi-shop Cart** | Cart is restricted to one shop per order by design |
| **Admin Panel** | No platform-level admin for managing all shops |
| **DevOps** | Terraform, Ansible, Puppet, Nagios, Docker, CI/CD — handled by you |

---

*Document version: 1.0 — Stage 1 complete.*

