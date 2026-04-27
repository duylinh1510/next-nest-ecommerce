# Nest-Next E-Commerce

Full-stack e-commerce application built with **NestJS** (backend) and **Next.js** (frontend), featuring product browsing, cart management, order processing, and **Stripe** payment integration.

## Overview

| | Backend | Frontend |
|---|---|---|
| **Framework** | NestJS 11 | Next.js 16 (App Router) |
| **Language** | TypeScript | TypeScript |
| **Database** | PostgreSQL + Prisma 7 | Redux Toolkit + Persist |
| **Auth** | JWT (Access + Refresh) | Axios interceptor auto-refresh |
| **Payment** | Stripe API | Stripe React Payment Element |
| **Docs** | Swagger (`/api/docs`) | — |

## Features

- **Product Catalog** — Browse, search, filter by category, pagination
- **Shopping Cart** — Local-first (works without login), auto-merge on checkout
- **User Auth** — Register, login, JWT rotation, role-based access (USER/ADMIN)
- **Checkout Flow** — 3-step process: Shipping → Payment → Confirmation
- **Stripe Payments** — Credit card, 3D Secure support, resume unpaid orders
- **Order Management** — View history, filter by status, order detail, cancel pending orders
- **Admin API** — Full CRUD for products, categories, orders, users (UI in progress)

## Architecture

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────┐
│   Next.js App    │  HTTP  │   NestJS API     │  SQL   │  PostgreSQL  │
│   (port 3000)    │───────>│   (port 3001)    │───────>│              │
│                  │        │                  │        │              │
│  React 19       │        │  Prisma ORM      │        │  8 tables    │
│  Redux Toolkit   │        │  JWT + Passport  │        │              │
│  Stripe SDK      │        │  Stripe API      │        │              │
└──────────────────┘        └──────────────────┘        └──────────────┘
```

## Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Stripe account (test keys)

### 1. Clone & install

```bash
git clone <repo-url>
cd nest-next-ecommerce

# Backend
cd api
npm install

# Frontend
cd ../front
bun install  # or npm install
```

### 2. Environment variables

**`api/.env`**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
STRIPE_SECRET_KEY="sk_test_..."
```

**`front/.env.local`**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Database setup

```bash
cd api
npx prisma generate
npx prisma db push
```

### 4. Run

```bash
# Terminal 1 — Backend
cd api
npm run dev

# Terminal 2 — Frontend
cd front
bun dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api/v1 |
| Swagger Docs | http://localhost:3001/api/docs |

## Database Schema

```mermaid
erDiagram
    users ||--o{ orders : "has many"
    users ||--o{ carts : "has many"
    users ||--o{ payments : "has many"
    categories ||--o{ products : "has many"
    products ||--o{ order_items : "has many"
    products ||--o{ carts_items : "has many"
    orders ||--o{ order_items : "has many"
    orders ||--|| payments : "has one"
    orders }o--|| carts : "belongs to"
    carts ||--o{ carts_items : "has many"

    users {
        string id PK
        string email UK
        string password
        string firstName
        string lastName
        enum role
    }

    products {
        string id PK
        string name
        decimal price
        int stock
        string sku UK
        string categoryId FK
    }

    categories {
        string id PK
        string name
        string slug UK
    }

    orders {
        string id PK
        string orderNumber UK
        enum status
        decimal totalAmount
        string shippingAddress
    }

    payments {
        string id PK
        decimal amount
        enum status
        string transactionId
        string orderId FK
    }

    carts {
        string id PK
        boolean checkedOut
    }
```

## Project Structure

```
nest-next-ecommerce/
├── api/                      # NestJS backend
│   ├── prisma/               # Database schema
│   └── src/modules/          # Auth, Products, Cart, Orders, Payments, Users
├── front/                    # Next.js frontend
│   ├── app/                  # App Router pages
│   ├── components/modules/   # UI components
│   ├── hooks/                # Custom React hooks
│   ├── services/api/         # API client layer
│   └── store/                # Redux state
└── README.md
```

See [api/README.md](./api/README.md) and [front/README.md](./front/README.md) for detailed documentation of each part.
