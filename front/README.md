# E-Commerce Frontend

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| State Management | Redux Toolkit + Redux Persist |
| HTTP Client | Axios (interceptors for JWT refresh) |
| Payment | Stripe React SDK |
| Styling | SCSS Modules |
| Icons | Lucide React |
| Animation | Framer Motion |

## Features

### Shopping
- Product listing with search, pagination
- Product detail with similar products (same category)
- Breadcrumb navigation

### Cart
- Add / remove / update quantity
- Local cart (Redux Persist) — works without login
- Auto-merge to server cart on checkout

### Authentication
- Login / Register forms with client-side validation
- JWT access token auto-attached via Axios interceptor
- Silent token refresh on 401 (refresh token in Authorization header)
- Redirect to login when session expires

### Checkout (3-step flow)
1. **Shipping** — Enter shipping address
2. **Payment** — Select method, Stripe Payment Element
3. **Complete** — Order confirmation with details

### Orders
- Order history with status filter (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Order detail page with line items
- Cancel order (PENDING only)
- Resume payment for unpaid PENDING orders ("Pay Now")

### User Experience
- User dropdown menu (profile info, orders link, logout)
- Responsive design
- Sticky header with cart badge
- Admin dashboard link (for ADMIN role)

## Pages

| Route | Description |
|---|---|
| `/` | Home — Product listing |
| `/[id]` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow (shipping → payment → success) |
| `/checkout?orderId=...&amount=...` | Resume payment for existing order |
| `/checkout/success` | Stripe 3D Secure redirect handler |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/user/orders` | Order history |
| `/user/orders/[id]` | Order detail |

## Project Setup

### Prerequisites
- Node.js >= 18
- Bun (recommended) or npm

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Installation

```bash
cd front
bun install
# or
npm install
```

### Run

```bash
# Development
bun dev
# or
npm run dev
```

App runs at `http://localhost:3000`

## Project Structure

```
front/
├── app/
│   ├── (landing)/            # Home page
│   ├── (product)/[id]/       # Product detail
│   ├── auth/
│   │   ├── login/            # Login page
│   │   └── register/         # Register page
│   ├── cart/                 # Cart page
│   ├── checkout/
│   │   ├── page.tsx          # Checkout flow
│   │   └── success/          # Stripe redirect handler
│   ├── user/orders/
│   │   ├── page.tsx          # Order list
│   │   └── [id]/             # Order detail
│   ├── layout.tsx
│   └── globals.css
├── components/modules/
│   ├── landing/              # Header, Footer, ProductList, ProductCard
│   ├── product/              # ProductDetail, Breadcrumbs, SimilarProducts
│   ├── cart/                 # CartClient, CartItem
│   ├── auth/                 # LoginForm, RegisterForm
│   ├── checkout/             # CheckoutClient, Steps, Stripe form
│   └── orders/               # OrdersClient, OrderDetailClient
├── hooks/                    # useAuth, useCart, useProducts, useOrder, usePayment
├── services/api/             # Axios config, auth, product, cart, order, payment services
├── store/                    # Redux store, authSlice, cartSlice
├── types/                    # TypeScript interfaces
├── providers/                # Redux + Persist provider
└── package.json
```

## Architecture Decisions

- **Local-first cart**: Cart data lives in Redux (persisted to localStorage). Only merges with server cart at checkout time, allowing guest users to shop freely without an account.
- **Axios interceptor pattern**: Automatically refreshes JWT on 401 and retries the failed request. Excludes `/auth/refresh` from retry to prevent infinite loops.
- **Resume payment flow**: Users can leave checkout and return to pay later via `/checkout?orderId=...&amount=...`, skipping the shipping step since the order already exists.
