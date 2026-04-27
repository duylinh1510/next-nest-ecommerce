# E-Commerce API
## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT (Access + Refresh Token), Passport |
| Payment | Stripe |
| Docs | Swagger / OpenAPI |
| Validation | class-validator, class-transformer |
| Security | bcrypt, Throttler (rate limiting), Role-based guards |

## Features

### Authentication & Authorization
- Register / Login / Logout
- JWT Access Token + Refresh Token rotation
- Role-based access control (USER, ADMIN)
- Password hashing with bcrypt (12 rounds)

### Products
- CRUD (Admin)
- Paginated listing with search, category filter, active status filter
- Stock management with atomic decrement on order

### Categories
- CRUD (Admin)
- Slug-based lookup
- Active/inactive toggle

### Cart (Server-side)
- Add / update / remove items
- Clear cart
- Merge guest cart on login

### Orders
- Create order from cart items with stock validation
- All-or-Nothing transaction (Prisma `$transaction`)
- Paginated listing with status filter and search
- Order detail, update status, cancel (with stock rollback)
- Separate admin routes for full management

### Payments (Stripe)
- Create PaymentIntent
- Confirm payment and auto-update order status to PROCESSING
- Mark cart as checked out on payment success
- Payment history per user

### Users (Admin)
- View / update profile
- Change password
- Admin CRUD for user management

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user | Public |
| `POST` | `/auth/login` | Login | Public |
| `POST` | `/auth/refresh` | Refresh access token | Refresh Token |
| `POST` | `/auth/logout` | Logout | JWT |
| `GET` | `/products` | List products (paginated) | Public |
| `GET` | `/products/:id` | Product detail | Public |
| `POST` | `/products` | Create product | Admin |
| `PATCH` | `/products/:id` | Update product | Admin |
| `DELETE` | `/products/:id` | Delete product | Admin |
| `GET` | `/category` | List categories | Public |
| `GET` | `/category/:id` | Category by ID | Public |
| `GET` | `/category/slug/:slug` | Category by slug | Public |
| `POST` | `/category` | Create category | Admin |
| `PATCH` | `/category/:id` | Update category | Admin |
| `DELETE` | `/category/:id` | Delete category | Admin |
| `GET` | `/cart` | Get user cart | JWT |
| `POST` | `/cart` | Add item to cart | JWT |
| `POST` | `/cart/merge` | Merge guest cart | JWT |
| `PATCH` | `/cart/:itemId` | Update cart item | JWT |
| `DELETE` | `/cart/:itemId` | Remove cart item | JWT |
| `DELETE` | `/cart` | Clear cart | JWT |
| `POST` | `/orders` | Create order | JWT |
| `GET` | `/orders` | User's orders (paginated) | JWT |
| `GET` | `/orders/:id` | Order detail | JWT |
| `PATCH` | `/orders/:id` | Update order | JWT |
| `DELETE` | `/orders/:id` | Cancel order | JWT |
| `GET` | `/orders/admin/all` | All orders | Admin |
| `POST` | `/payments/create-intent` | Create Stripe PaymentIntent | JWT |
| `POST` | `/payments/confirm` | Confirm payment | JWT |
| `GET` | `/payments` | Payment history | JWT |
| `GET` | `/payments/:id` | Payment detail | JWT |

## Project Setup

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Stripe account (for payment integration)

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
STRIPE_SECRET_KEY="sk_test_..."
```

### Installation

```bash
cd api
npm install
```

### Database

```bash
npx prisma generate
npx prisma db push
```

### Run

```bash
# Development (watch mode)
npm run dev

# Production
npm run build
npm run start:prod
```

### Swagger Docs

After starting the server, visit: `http://localhost:3001/api/docs`

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
        string refreshToken
        datetime createdAt
        datetime updatedAt
    }

    categories {
        string id PK
        string name
        string description
        string slug UK
        string imageUrl
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    products {
        string id PK
        string name
        string description
        decimal price
        int stock
        string sku UK
        string imageUrl
        boolean isActive
        string categoryId FK
        datetime createdAt
        datetime updatedAt
    }

    orders {
        string id PK
        string orderNumber UK
        enum status
        decimal totalAmount
        string userId FK
        string cartId FK
        string shippingAddress
        datetime createdAt
        datetime updatedAt
    }

    order_items {
        string id PK
        int quantity
        decimal price
        string productId FK
        string orderId FK
        datetime createdAt
        datetime updatedAt
    }

    carts {
        string id PK
        string userId FK
        boolean checkedOut
        datetime createdAt
        datetime updatedAt
    }

    carts_items {
        string id PK
        int quantity
        string productId FK
        string cartId FK
        datetime createdAt
        datetime updatedAt
    }

    payments {
        string id PK
        decimal amount
        enum status
        string currency
        string paymentMethod
        string transactionId
        string userId FK
        string orderId FK
        datetime createdAt
        datetime updatedAt
    }
```

## Project Structure

```
api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── common/
│   │   ├── decorators/       # @GetUser, @Roles, @Throttle
│   │   └── guards/           # JwtAuthGuard, RolesGuard
│   ├── modules/
│   │   ├── auth/             # Register, Login, JWT, Refresh Token
│   │   ├── products/         # Product CRUD
│   │   ├── category/         # Category CRUD
│   │   ├── cart/             # Server-side cart
│   │   ├── orders/           # Order management
│   │   ├── payments/         # Stripe integration
│   │   ├── users/            # User profile & admin management
│   │   └── strategies/       # JWT & Refresh Token strategies
│   ├── prisma/               # PrismaService
│   ├── app.module.ts
│   └── main.ts
└── package.json
```
