# Local Hai — Frontend

> *"Your friendly neighbourhood local store."*

Desktop-first responsive React web app built with Vite, React Router, Tailwind CSS, Google Fonts (Plus Jakarta Sans & Inter), and Material Symbols Outlined, styled from Stitch project `16957589711966114422`.

---

## Features Implemented
- **Authentication**: Login & Register with role toggle (`Customer` vs `Shopkeeper`), quick demo access buttons, JWT token in memory/localStorage.
- **Customer Experience**:
  - Home: Search bar, category filters, trust pillars, nearby shop cards, popular counter products.
  - Shop Page: Store banner, category tabs, product inventory with stock badges, "Add to web" / quantity incrementer, sticky bottom cart drawer.
  - Cart & Checkout: Single-shop constraint modal, items list, delivery address & notes, fee breakdown (Free delivery, Zero platform tax), "Swing it over!" CTA.
  - Order Confirmation: "Order caught in the web!" with order reference, live status stepper, item breakdown.
  - My Orders: Past orders with real-time status badges, cancel button for placed orders.
- **Shopkeeper Experience**:
  - The Daily Bugle (Dashboard): Total orders, pending orders alert, revenue stats, active counter products, incoming order action buttons ("Accept Order", "Mark Delivered", "Decline").
  - Inventory Control: Add new product modal, search, live stock counter increment/decrement, price edit, delete.
- **Multiverse 404**: "This page got lost in the multiverse. Swing back home."

---

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Mock Mode vs Real API
The frontend defaults to mock mode (`VITE_USE_MOCK=true` in `.env`), allowing full end-to-end interactive testing right now. When Stage 3 (FastAPI backend) is ready, set `VITE_USE_MOCK=false` to route all calls to the backend via `/api`.

