# TechStore — Full-Stack E-Commerce Platform

> Production-style portfolio project built with **React + Tailwind CSS + Node.js + Express + MongoDB Atlas + Razorpay Test Mode + Cloud Deployment**.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Test%20Mode-0C2340.svg)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview & Architecture

TechStore is a modern, high-performance electronics store showcasing best practices in full-stack architecture, secure RESTful API engineering, JWT-based role authorization, atomic database operations, server-side payment verification with HMAC SHA256 signatures, and an intuitive Admin control center.

### High-Level Architecture Flow

```
                      +-----------------------------+
                      |   React 18 + Tailwind UI   |
                      |   (Vite Hosted on Vercel)   |
                      +--------------+--------------+
                                     |
                                     | REST API (JSON / JWT)
                                     v
                      +-----------------------------+
                      |    Node.js + Express API    |
                      |   (Hosted on Render Cloud)  |
                      +--------------+--------------+
                                     |
           +-------------------------+-------------------------+
           |                         |                         |
           v                         v                         v
+--------------------+    +--------------------+    +--------------------+
|   MongoDB Atlas    |    | Razorpay Test Mode |    | Cloudinary Storage |
|  Document Models   |    | HMAC Verification  |    | CDN Product Images |
+--------------------+    +--------------------+    +--------------------+
```

---

## 2. Key Features

- **Authentication & RBAC**:
  - Secure registration, login, profile updates, and address book management.
  - Password hashing via `bcryptjs` (salt rounds = 10).
  - Stateless JSON Web Tokens (JWT) with authorization middleware (`requireAuth`, `requireAdmin`).
- **Product Catalog & Discovery**:
  - Advanced search query indexing across title, brand, description, and category.
  - Multi-attribute filtering (category, brand, price range, in-stock only).
  - Sorting (price asc/desc, highest rated, newest arrivals) and server-side pagination.
- **Shopping Cart & Checkout**:
  - Hybrid cart persistence (server database sync for authenticated users; guest localStorage fallback).
  - Real-time stock validation and out-of-stock guards.
  - Promo code discounts (`WELCOME10`, `TECHSTORE500`).
- **Razorpay Test Mode Payment**:
  - Server-side Razorpay order initiation in smallest currency units (Paise for INR).
  - Server-side HMAC SHA256 signature verification (`order_id + '|' + payment_id`).
  - Safe interactive test simulation modal for effortless local demonstration.
- **Order Management & Audit**:
  - Immutable price and item snapshots preserved at checkout time.
  - Lifecycle timeline: `placed` -> `processing` -> `shipped` -> `delivered` / `cancelled`.
  - Inventory auto-restoration upon order cancellation.
- **Admin Control Center**:
  - Business analytics KPIs: Total revenue, total orders, active catalog SKUs, customers.
  - Real-time low inventory alerts.
  - Complete Product CRUD with Cloudinary image upload.
  - Interactive order status transition and customer directory.
- **Security Hardening**:
  - HTTP header protection with Helmet.
  - Strict CORS origin filtering.
  - Rate limiting on authentication (`30 req/15m`) and payment creation endpoints.
  - Centralized error handler suppressing internal stack traces in production.

---

## 3. Project Structure

```
techstore/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection logic
│   │   ├── cloudinary.js         # Cloudinary configuration
│   │   └── razorpay.js           # Razorpay instance setup
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile, addresses
│   │   ├── productController.js  # Product CRUD, filters, search, reviews
│   │   ├── cartController.js     # Cart items add/update/remove
│   │   ├── orderController.js    # Order creation, history, cancellations
│   │   ├── paymentController.js  # Razorpay order generation & HMAC signature verification
│   │   ├── adminController.js    # Analytics KPIs, orders & users management
│   │   ├── couponController.js   # Promo code validation
│   │   └── uploadController.js   # Cloudinary image upload
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   ├── errorMiddleware.js    # Centralized error handler & 404 handler
│   │   ├── rateLimiter.js        # Express rate limiting
│   │   └── upload.js             # Multer memory storage handler
│   ├── models/
│   │   ├── User.js               # User schema with hashed passwords
│   │   ├── Product.js            # Product schema with stock & images
│   │   ├── Cart.js               # User cart with price snapshots
│   │   ├── Order.js              # Order with address/price snapshots & timeline
│   │   ├── Review.js             # Customer reviews & ratings
│   │   └── Coupon.js             # Promotional discounts
│   ├── routes/                   # Express REST route definitions
│   ├── seed.js                   # Database seeder with sample gadgets & accounts
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # HTTP listener binding 0.0.0.0
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProductCard, FilterSidebar, Skeletons
│   │   ├── context/              # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── layouts/              # MainLayout, AdminLayout, ProtectedRoute, AdminRoute
│   │   ├── pages/                # Home, Products, Details, Cart, Checkout, Orders, Profile, Admin
│   │   ├── services/             # Axios API service clients
│   │   ├── App.jsx               # React Router route registry
│   │   ├── main.jsx              # App entrypoint
│   │   └── index.css             # Tailwind design system
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── render.yaml                   # Render deployment configuration
├── README.md
└── .gitignore
```

---

## 4. Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/techstore
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=placeholder_secret_key
CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=placeholder_cloudinary_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Local Setup & Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB (Local service or MongoDB Atlas cluster connection string)

### 1. Clone repository
```bash
git clone https://github.com/your-username/techstore.git
cd techstore
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Seed Database
Populate database with sample flagship tech items (MacBook Pro M3, iPhone 16 Pro, Sony ANC headphones, Keychron keyboards, 4K OLED monitors) and test accounts:
```bash
cd ../backend
npm run seed
```

**Pre-configured Test Accounts:**
- **System Admin**: `admin@techstore.com` / `Admin@123`
- **Customer**: `customer@techstore.com` / `Customer@123`
- **Promo Coupons**: `WELCOME10` (10% off), `TECHSTORE500` (₹500 off)

### 4. Start Development Servers
In terminal 1 (Backend API on `http://localhost:5000`):
```bash
cd backend
npm run dev
```

In terminal 2 (Frontend on `http://localhost:5173`):
```bash
cd frontend
npm run dev
```

---

## 6. REST API Reference

| Module | Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/health` | Service uptime and DB status | Public |
| **Auth** | `POST` | `/api/auth/register` | Register new user account | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public |
| **Auth** | `GET` | `/api/auth/profile` | Get logged-in user profile | Private |
| **Auth** | `PUT` | `/api/auth/profile` | Update profile / change password | Private |
| **Auth** | `POST` | `/api/auth/address` | Add delivery address | Private |
| **Auth** | `DELETE` | `/api/auth/address/:id` | Remove delivery address | Private |
| **Products**| `GET` | `/api/products` | List products (search, filter, sort, paginate) | Public |
| **Products**| `GET` | `/api/products/:id` | Get product details by ID or slug | Public |
| **Products**| `POST` | `/api/products` | Create product | Admin |
| **Products**| `PATCH` | `/api/products/:id` | Update product details or stock | Admin |
| **Products**| `DELETE` | `/api/products/:id` | Remove product | Admin |
| **Cart** | `GET` | `/api/cart` | Get current user cart items | Private |
| **Cart** | `POST` | `/api/cart/items` | Add item or increment quantity | Private |
| **Cart** | `PATCH` | `/api/cart/items/:id`| Update item quantity | Private |
| **Cart** | `DELETE` | `/api/cart/items/:id`| Remove item from cart | Private |
| **Orders** | `POST` | `/api/orders` | Create order (COD or direct) | Private |
| **Orders** | `GET` | `/api/orders` | Get user order history | Private |
| **Orders** | `GET` | `/api/orders/:id` | Get order details with timeline | Private |
| **Orders** | `PATCH` | `/api/orders/:id/cancel`| Cancel order and restore stock | Private |
| **Payments**| `POST` | `/api/payments/create-order`| Generate Razorpay order | Private |
| **Payments**| `POST` | `/api/payments/verify` | Verify HMAC signature & finalize order | Private |
| **Admin** | `GET` | `/api/admin/stats` | Dashboard KPIs & low stock alerts | Admin |
| **Admin** | `GET` | `/api/admin/orders` | List all customer orders | Admin |
| **Admin** | `PATCH` | `/api/admin/orders/:id/status`| Advance order status | Admin |
| **Admin** | `GET` | `/api/admin/users` | List registered users | Admin |
| **Coupons** | `POST` | `/api/coupons/validate` | Check promo code and calculate discount | Public |
| **Upload** | `POST` | `/api/upload` | Upload image to Cloudinary CDN | Admin |

---

## 7. Cloud Deployment Guide

### Backend (Render Web Service)
1. Push your repository to GitHub.
2. Create a **New Web Service** on Render and select your repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/techstore`
   - `JWT_SECRET`: `<secure_random_string>`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`
   - `RAZORPAY_KEY_ID`: `<your_razorpay_key_id>`
   - `RAZORPAY_KEY_SECRET`: `<your_razorpay_key_secret>`
5. Deploy and verify using `https://your-backend.onrender.com/api/health`.

### Frontend (Vercel)
1. Import repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
5. Deploy. `frontend/vercel.json` automatically ensures client-side routing handles refreshes on any route without 404s.

---

## 8. Technical Interview Talking Points

1. **Why React + Vite on the Frontend?**
   - React offers component reusability, declarative state updates, and an extensive ecosystem. Vite provides sub-second Hot Module Replacement (HMR) powered by native ES modules and Rollup for optimal production bundles.
2. **Why MongoDB Schema & Price Snapshots?**
   - In e-commerce, catalog prices fluctuate frequently. Storing an immutable `priceSnapshot` and `nameSnapshot` inside `Order.items` ensures historic billing accuracy without altering previous customer invoices when product catalog prices change.
3. **Why must Payment Verification happen on the Backend?**
   - Client-side code runs in an untrusted browser environment. A malicious client could tamper with JavaScript to forge a successful callback. By computing an HMAC SHA256 hash using the confidential `RAZORPAY_KEY_SECRET` exclusively on the server, we guarantee payment authenticity before decrementing inventory and marking orders as paid.
4. **How is Concurrent Stock Modification Handled?**
   - At checkout, atomic inventory verification and updates (`$inc: { stock: -quantity }`) prevent overselling. If inventory is insufficient, the transaction is rejected before payment capture.
5. **How does CORS work between Vercel and Render?**
   - Cross-Origin Resource Sharing (CORS) headers sent by Express (`Access-Control-Allow-Origin: CLIENT_URL`) inform the browser that requests from the Vercel domain are authorized, preventing cross-site scripting vulnerabilities while enabling authenticated cookies/tokens.
6. **Handling Render Free Tier Spin-Down:**
   - Free instances idle after 15 minutes of inactivity. The `/api/health` endpoint serves as a lightweight warmup probe.

---

## 9. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
