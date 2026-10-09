# TechStore — Full-Stack E-Commerce Platform

> Production-ready electronics and gadget e-commerce web application engineered with **React 18, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas**, featuring **JWT authentication, atomic inventory control, and dual-mode Razorpay checkout**.

[![Node.js](https://img.shields.io/badge/Node.js-v18%20%7C%20v20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Test%20Mode-0C2340?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

1. [Project Overview & Introduction](#1-project-overview--introduction)
2. [Objectives & Real-World Problems Solved](#2-objectives--real-world-problems-solved)
3. [Features Implemented](#3-features-implemented)
4. [Technology Stack](#4-technology-stack)
5. [Architecture & Folder Structure](#5-architecture--folder-structure)
6. [Prerequisites & System Requirements](#6-prerequisites--system-requirements)
7. [Installation & Setup](#7-installation--setup)
8. [Environment Variables Setup](#8-environment-variables-setup)
9. [MongoDB Configuration & Data Models](#9-mongodb-configuration--data-models)
10. [REST API Documentation](#10-rest-api-documentation)
11. [Authentication, RBAC & Payment Integration](#11-authentication-rbac--payment-integration)
12. [Testing Instructions](#12-testing-instructions)
13. [Deployment Guide](#13-deployment-guide)
14. [Screenshots & UI Walkthrough](#14-screenshots--ui-walkthrough)
15. [Technical Interview Talking Points](#15-technical-interview-talking-points)
16. [Future Improvements](#16-future-improvements)
17. [Contributing Guidelines](#17-contributing-guidelines)
18. [License](#18-license)

---

## 1. Project Overview & Introduction

**TechStore** is a modern, full-stack e-commerce web application tailored for consumer electronics, computing gear, and accessories. Built using the **MERN** architecture (MongoDB, Express, React, Node.js) with **Vite** and **Tailwind CSS**, it reflects production-grade engineering practices across both frontend and backend layers.

The project demonstrates:
- **Resilient RESTful API Design**: Modular routers, decoupled controller logic, standardized JSON responses, and centralized error handling with Mongoose validation parsing.
- **Stateless Authentication & Role-Based Access Control (RBAC)**: Secure user sessions powered by JSON Web Tokens (JWT) and `bcryptjs` password hashing, with granular route guards distinguishing verified customers from store administrators.
- **Atomic Inventory & Financial Consistency**: Point-in-time pricing and item snapshots in orders to protect invoice integrity against catalog price changes, alongside atomic inventory decrements and restoration upon order cancellation.
- **Flexible Dual-Mode Payment Architecture**: Seamless support for live **Razorpay Test Mode** with server-side HMAC SHA256 signature verification, paired with an interactive fallback simulation modal for frictionless demonstration when live API keys are not supplied.

---

## 2. Objectives & Real-World Problems Solved

| Challenge in E-Commerce | Real-World Impact | How TechStore Solves It |
| :--- | :--- | :--- |
| **Catalog Price Fluctuation** | If a product's price updates post-purchase, calculating historical invoice totals by joining on the catalog model corrupts past receipts and accounting audits. | **Point-in-Time Snapshots**: The `Order` and `Cart` schemas store immutable `priceSnapshot`, `nameSnapshot`, and `imageSnapshot` fields at checkout time, decoupling historical orders from future catalog modifications. |
| **Overselling & Inventory Race Conditions** | Concurrent checkouts for the last available item can push stock into negative values, resulting in unfulfillable orders. | **Atomic Verification & Stock Decrement**: Before finalizing orders, available stock is verified for every item. Inventory is atomically decremented using MongoDB's `$inc: { stock: -quantity }`. If an order is subsequently cancelled, stock is restored via `$inc: { stock: quantity }`. |
| **Client-Side Payment Spoofing** | Relying solely on client callbacks to confirm payments enables attackers to forge success requests and trigger order creation without payment. | **Server-Side HMAC SHA256 Verification**: Payments require cryptographic validation on the backend using `crypto.createHmac('sha256', secret)` on the payload (`order_id + '|' + payment_id`) before order completion. |
| **Guest Abandonment vs. Persistent Carts** | Forcing login before adding items drives bounce rates, while purely guest carts vanish when switching devices. | **Hybrid Cart Architecture**: Unauthenticated visitors maintain a cart persisted in browser `localStorage`. Authenticated users synchronize with their MongoDB `Cart` document, ensuring items persist across devices and sessions. |
| **Security & Brute-Force Attacks** | Unprotected auth endpoints and unconstrained traffic expose platforms to credential stuffing and denial of service. | **Layered Security**: Integrated `helmet` security headers, strict CORS origin whitelisting, and tiered `express-rate-limit` guards (`30 req/15m` on authentication, `50 req/10m` on payment creation, and `300 req/15m` globally). |

---

## 3. Features Implemented

### 🛍️ Customer Experience & Storefront
- **Responsive UI**: Clean, modern dark/slate themed interface built with Tailwind CSS and Lucide icons, fully adapted for mobile, tablet, and desktop viewports.
- **Search & Discovery**:
  - Full-text search across product name, brand, description, and category.
  - Multi-attribute filtering (category, brand, price min/max bounds, in-stock availability).
  - Sorting options: Price (Low to High, High to Low), Customer Rating (Highest), and Date Added (Newest, Oldest).
  - Server-side pagination with dynamic page calculations.
- **Product Details & Social Proof**:
  - Image gallery with primary hero display and fallback placeholders.
  - Key specification bullet points and dynamic stock status badges.
  - Customer review submission (rating 1–5 stars and text comment) with enforcement of one review per user per product.
  - Dynamic recalculation of aggregate rating and total review counts.
- **Cart & Wishlist**:
  - Hybrid cart system: Guest cart stored in `localStorage`; authenticated cart synchronized to MongoDB.
  - Real-time stock validation preventing users from incrementing beyond available units.
  - Wishlist toggle with instant UI feedback and `localStorage` persistence.
- **Coupons & Promotional Discounts**:
  - Promo code validation engine supporting percentage-based or fixed discounts (`WELCOME10`, `TECHSTORE500`).
  - Validation against minimum order threshold, usage limits, and expiration dates.
- **Checkout & Order Tracking**:
  - Address book management with default selection and inline new address creation.
  - Multiple payment choices: **Razorpay Online Payment** and **Cash on Delivery (COD)**.
  - Interactive payment simulation modal for local portfolio evaluation when credentials are in mock mode.
  - Order success page with breakdown summary and direct link to order history.
  - Visual status timeline tracking orders across lifecycle states: `placed` ➔ `processing` ➔ `shipped` ➔ `delivered` (or `cancelled`).
  - User-initiated cancellation for active orders with automatic stock replenishment.
- **Profile & Account Management**:
  - User profile update (name, email, avatar URL).
  - Password change with minimum length validation.
  - Multi-address management (add, delete, toggle default).
  - Simulated password reset token generation and submission flow.

### 🛡️ Admin Control Center (`/admin`)
- **Protected Administration Route**: Enforced via `AdminRoute` on the frontend and `requireAdmin` middleware on the backend.
- **Executive KPI Dashboard**: Real-time aggregation of Total Revenue (from completed orders), Total Orders, Active Catalog SKUs, and Registered Customers.
- **Inventory Alerts**: Live tracking of low-stock products (inventory $\le$ 5 units).
- **Product Catalog CRUD**:
  - Product creation and editing forms (pricing, compare-at pricing, brand, category, stock, features list, tags).
  - Image upload integration streaming files to Cloudinary CDN via Multer (with development base64 fallback).
  - Product deletion with immediate catalog refresh.
- **Order Pipeline Management**:
  - Tabulated order ledger displaying customer details, payment status, order amount, and timeline state.
  - Filtering by status (`all`, `placed`, `processing`, `shipped`, `delivered`, `cancelled`).
  - Status transition controls with optional administrative timeline comments and automatic delivery timestamp recording.
- **Customer Directory**: View-only directory of registered users with role badges, email records, and account creation dates.

---

## 4. Technology Stack

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | Declarative component-based UI library |
| **Vite** | `^6.1.0` | Ultra-fast build tool and local dev server with HMR |
| **Tailwind CSS** | `^3.4.17` | Utility-first CSS framework for custom responsive design |
| **React Router DOM** | `^6.29.0` | Client-side routing, protected routes, and layouts |
| **Axios** | `^1.7.9` | Promise-based HTTP client with interceptors for JWT injection |
| **Lucide React** | `^0.475.0` | Modern, lightweight icon suite |
| **clsx & tailwind-merge** | `^2.1.1` / `^3.0.1` | Conditional styling and conflict-free Tailwind class merging |
| **Razorpay SDK** | External Script | Client-side Razorpay standard checkout modal |

### Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>=18.0.0` | Server runtime environment (CommonJS) |
| **Express.js** | `^4.21.2` | Minimalist web application framework for REST APIs |
| **MongoDB & Mongoose** | `^8.9.5` | Document database and object data modeling (ODM) library |
| **JSON Web Token** | `^9.0.2` | Stateless authorization token signing and verification |
| **bcryptjs** | `^2.4.3` | Cryptographic password hashing (salt rounds = 10) |
| **Razorpay Node SDK** | `^2.9.5` | Server-side Razorpay order creation and payment management |
| **Cloudinary** | `^1.41.3` | Cloud media storage and delivery for product assets |
| **Multer** | `^1.4.5-lts.1`| In-memory multipart/form-data upload middleware |
| **Helmet** | `^8.0.0` | Secure HTTP response headers |
| **CORS** | `^2.8.5` | Cross-Origin Resource Sharing middleware |
| **express-rate-limit** | `^7.5.0` | Endpoint rate limiting against abuse and brute-force attacks |
| **Morgan** | `^1.10.0` | HTTP request logging for development |
| **dotenv** | `^16.4.7` | Zero-dependency environment variable loader |

### Infrastructure & Deployment
- **Backend**: Hosted on **Render** (Node.js web service defined via `render.yaml`).
- **Frontend**: Hosted on **Vercel** (Vite SPA configured with client routing rewrites in `vercel.json`).
- **Database**: **MongoDB Atlas** (Managed cloud cluster).
- **Media CDN**: **Cloudinary** (Cloud asset storage).

---

## 5. Architecture & Folder Structure

### High-Level Architecture Flow

```
                      +-----------------------------+
                      |   React 18 + Tailwind UI   |
                      |   (Vite Hosted on Vercel)   |
                      +--------------+--------------+
                                     |
                                     | HTTPS / JSON (JWT in Headers)
                                     v
                      +-----------------------------+
                      |    Node.js + Express API    |
                      |   (Hosted on Render Cloud)  |
                      +--------------+--------------+
                                     |
            +------------------------+------------------------+
            |                        |                        |
            v                        v                        v
 +--------------------+   +--------------------+   +--------------------+
 |   MongoDB Atlas    |   | Razorpay Gateway   |   | Cloudinary Storage |
 | - Users & Carts    |   | - Order Initiation |   | - Product Images   |
 | - Products/Reviews |   | - HMAC Verification|   | - Media CDN        |
 | - Orders & Coupons |   +--------------------+   +--------------------+
 +--------------------+
```

### Repository File Tree

```
techstore/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js         # Cloudinary SDK credentials & setup
│   │   ├── db.js                 # Mongoose connection with timeout & fallback logic
│   │   └── razorpay.js           # Razorpay client & test simulation detector
│   ├── controllers/
│   │   ├── adminController.js    # KPIs, order status updates, user management
│   │   ├── authController.js     # Register, login, profile, addresses, password reset
│   │   ├── cartController.js     # Cart fetch, item add/update/remove, clear
│   │   ├── couponController.js   # Promo code validation & coupon creation
│   │   ├── orderController.js    # COD order creation, user orders, cancellation
│   │   ├── paymentController.js  # Razorpay order generation & HMAC signature verification
│   │   ├── productController.js  # Product catalog filtering, pagination, CRUD, reviews
│   │   └── uploadController.js   # Image upload handler with base64 fallback
│   ├── middleware/
│   │   ├── auth.js               # requireAuth (JWT verification) & requireAdmin guards
│   │   ├── errorMiddleware.js    # 404 handler and Mongoose-aware error formatter
│   │   ├── rateLimiter.js        # authLimiter, paymentLimiter, and general apiLimiter
│   │   └── upload.js             # Multer in-memory storage & image MIME filter
│   ├── models/
│   │   ├── Cart.js               # Cart items with price snapshots
│   │   ├── Coupon.js             # Promotional codes with expiry and limits
│   │   ├── Order.js              # Orders with address snapshots, items, and status timeline
│   │   ├── Product.js            # Products with slugs, stock, pricing, and specs
│   │   ├── Review.js             # 1-to-5 star ratings with unique compound index
│   │   └── User.js               # User accounts with bcrypt pre-save hook & addresses
│   ├── routes/
│   │   ├── adminRoutes.js        # /api/admin
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── cartRoutes.js         # /api/cart
│   │   ├── couponRoutes.js       # /api/coupons
│   │   ├── orderRoutes.js        # /api/orders
│   │   ├── paymentRoutes.js      # /api/payments
│   │   ├── productRoutes.js      # /api/products
│   │   └── uploadRoutes.js       # /api/upload
│   ├── .env.example              # Environment variables template for backend
│   ├── app.js                    # Express app configuration, security, & route mounting
│   ├── package.json              # Backend scripts and dependencies
│   ├── seed.js                   # Database seeder (admin, customer, catalog, coupons)
│   └── server.js                 # HTTP server listener (binds to 0.0.0.0)
│
├── frontend/
│   ├── public/                   # Static browser assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── EmptyState.jsx       # Reusable zero-data placeholder
│   │   │   │   ├── Footer.jsx           # Responsive storefront footer
│   │   │   │   ├── Navbar.jsx           # Top navigation, cart badge, auth controls
│   │   │   │   ├── ProtectedRoute.jsx   # ProtectedRoute & AdminRoute wrapper guards
│   │   │   │   └── SkeletonLoader.jsx   # Shimmer loading states for cards & tables
│   │   │   └── product/
│   │   │       ├── FilterSidebar.jsx    # Category, brand, price, & stock controls
│   │   │       └── ProductCard.jsx      # Product card with price tags & quick add
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # User state, login, register, logout
│   │   │   ├── CartContext.jsx          # Cart state, local/server sync, quantities
│   │   │   ├── ToastContext.jsx         # Custom notification system
│   │   │   └── WishlistContext.jsx      # Wishlist toggle and localStorage persistence
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx          # Admin sidebar navigation & header layout
│   │   │   └── MainLayout.jsx           # Main customer storefront shell with navbar/footer
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.jsx # Analytics KPIs, revenue, low stock
│   │   │   │   ├── AdminOrdersPage.jsx    # Order status transitions & ledger
│   │   │   │   ├── AdminProductsPage.jsx  # Catalog management & image upload
│   │   │   │   └── AdminUsersPage.jsx     # Customer directory
│   │   │   ├── CartPage.jsx             # Shopping cart, promo code input, summary
│   │   │   ├── CheckoutPage.jsx         # Address select, COD/Razorpay checkout
│   │   │   ├── HomePage.jsx             # Hero banner, featured tech, category grids
│   │   │   ├── LoginPage.jsx            # Sign in form with demo account presets
│   │   │   ├── NotFoundPage.jsx         # 404 error page
│   │   │   ├── OrderDetailPage.jsx     # Order summary, invoice items, status timeline
│   │   │   ├── OrderSuccessPage.jsx     # Post-checkout confirmation
│   │   │   ├── OrdersPage.jsx           # User purchase history
│   │   │   ├── ProductDetailPage.jsx   # Product specs, gallery, reviews
│   │   │   ├── ProductsPage.jsx         # Filterable catalog with pagination
│   │   │   ├── ProfilePage.jsx          # Profile details, password update, addresses
│   │   │   └── RegisterPage.jsx         # New customer registration
│   │   ├── services/
│   │   │   ├── adminService.js          # Admin stats, orders, users client
│   │   │   ├── api.js                   # Base Axios instance with JWT interceptor
│   │   │   ├── authService.js           # Auth & address API calls
│   │   │   ├── cartService.js           # Cart endpoints client
│   │   │   ├── couponService.js         # Coupon validation client
│   │   │   ├── orderService.js          # Order placement & cancellation client
│   │   │   ├── paymentService.js        # Razorpay creation & verification client
│   │   │   └── productService.js        # Products catalog & reviews client
│   │   ├── App.jsx                      # Route registry
│   │   ├── index.css                    # Tailwind CSS directives & global styling
│   │   └── main.jsx                     # Application bootstrap with Context Providers
│   ├── .env.example              # Environment variables template for frontend
│   ├── index.html                # HTML entrypoint with Razorpay SDK script & Google Fonts
│   ├── package.json              # Frontend scripts and dependencies
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Tailwind CSS theme extension
│   ├── vercel.json               # SPA routing rewrite rules for Vercel
│   └── vite.config.js            # Vite build configuration
│
├── .gitignore                    # Git ignore file (excludes node_modules, .env, dist)
├── package.json                  # Root monorepo orchestration scripts
├── render.yaml                   # Infrastructure-as-code blueprint for Render
└── README.md                     # Comprehensive project documentation
```

---

## 6. Prerequisites & System Requirements

Before running the project locally, ensure you have the following installed on your machine:

- **Node.js**: `v18.0.0` or `v20.x` or higher (verified with Node.js 18+ and 20+)
- **npm**: `v9.0.0` or higher (bundled with Node.js)
- **MongoDB**: Either a local MongoDB instance running on `mongodb://127.0.0.1:27017` or a cloud-hosted [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- **Git**: For source version control
- *(Optional)*: A free [Razorpay Test Account](https://dashboard.razorpay.com/) for live test credentials
- *(Optional)*: A free [Cloudinary Account](https://cloudinary.com/) for live product image hosting

---

## 7. Installation & Setup

You can set up and run TechStore using either the **root orchestration commands** or by configuring the **backend and frontend workspaces individually**.

### Option A: Quick Start via Root Workspace Scripts

From the repository root directory:

```bash
# 1. Clone repository
git clone https://github.com/your-username/techstore.git
cd techstore

# 2. Install dependencies for both backend and frontend in one step
npm run install:all

# 3. Configure environment variables (see Section 8 below)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Seed database with initial catalog, admin, and demo users
npm run seed

# 5. Start development servers in separate terminal tabs
# Terminal 1: Backend API (http://localhost:5000)
npm run dev:backend

# Terminal 2: Frontend Client (http://localhost:5173)
npm run dev:frontend
```

---

### Option B: Step-by-Step Manual Setup

#### Step 1: Backend Setup

```bash
cd backend

# Install backend dependencies
npm install

# Copy environment variables file
cp .env.example .env

# Seed the database
npm run seed

# Start backend development server (uses node --watch)
npm run dev
```
> The API server will start on `http://localhost:5000`. You can confirm health at `http://localhost:5000/api/health`.

#### Step 2: Frontend Setup

Open a second terminal window:

```bash
cd frontend

# Install frontend dependencies
npm install

# Copy environment variables file
cp .env.example .env

# Start Vite development server
npm run dev
```
> The web application will launch at `http://localhost:5173`.

---

### Pre-Configured Test Accounts & Coupons (Post-Seeding)

When you run `npm run seed`, the database is populated with sample tech inventory, demo reviews, discount coupons, and the following testing credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@techstore.com` | `Admin@123` | Full access to `/admin` dashboard, catalog CRUD, orders, and users |
| **Demo Customer** | `customer@techstore.com` | `Customer@123` | Standard customer access to storefront, cart, checkout, profile |

**Active Promo Codes:**
- `WELCOME10`: 10% discount (Minimum order: ₹1,000 | Max discount: ₹2,500)
- `TECHSTORE500`: Flat ₹500 discount (Minimum order: ₹5,000 | Max discount: ₹500)

---

## 8. Environment Variables Setup

Both backend and frontend require environment configuration files based on their respective `.env.example` templates.

> **Security Notice**: Never commit `.env` files to source control. Ensure all confidential keys are strictly confined to local environments or secure cloud secret managers.

### Backend (`backend/.env`)

Create `backend/.env` using the template below:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local or Atlas)
# Local: mongodb://127.0.0.1:27017/techstore
# Atlas: mongodb+srv://<username>:<password>@cluster0.mongodb.net/techstore?retryWrites=true&w=majority
MONGO_URI=mongodb://127.0.0.1:27017/techstore

# JWT Authentication
JWT_SECRET=supersecret_techstore_jwt_token_key_change_in_production_2026
JWT_EXPIRE=30d

# Frontend Client URL (Used for CORS origin whitelisting)
CLIENT_URL=http://localhost:5173

# Razorpay Test Mode Credentials
# Leave as placeholder values to use the built-in Interactive Test Simulation Mode,
# or supply real test keys from https://dashboard.razorpay.com/ -> Settings -> API Keys
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=placeholder_secret_key

# Cloudinary Storage Credentials
# Leave as placeholders to use base64 data URI fallback during local development,
# or supply your Cloudinary account credentials for live CDN uploads
CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=placeholder_cloudinary_secret
```

### Frontend (`frontend/.env`)

Create `frontend/.env` using the template below:

```env
# Backend REST API Base URL
VITE_API_URL=http://localhost:5000/api
```

---

## 9. MongoDB Configuration & Data Models

### Database Connection (`backend/config/db.js`)
Mongoose manages connection lifecycles with an explicit `serverSelectionTimeoutMS: 5000` configuration, ensuring graceful fallback and terminal warnings if the local daemon is unstarted or Atlas IP access has not yet been whitelisted.

### Core Data Models

```
+------------------+         +--------------------+         +--------------------+
|       User       | 1     * |       Order        | *     1 |      Product       |
+------------------+---------+--------------------+---------+--------------------+
| _id              |         | _id                |         | _id                |
| name             |         | user (ref: User)   |         | name               |
| email (unique)   |         | items [            |         | slug (unique, idx) |
| password (bcrypt)|         |   product (ref)    |         | description        |
| role (user/admin)|         |   nameSnapshot     |         | price              |
| addresses []     |         |   priceSnapshot    |         | compareAtPrice     |
| resetPasswordTok |         |   imageSnapshot    |         | category (idx)     |
+------------------+         |   quantity         |         | brand (idx)        |
         | 1                 | ]                  |         | stock              |
         |                   | addressSnapshot    |         | isActive           |
         |                   | paymentMethod      |         | rating             |
         |                   | paymentStatus      |         | numReviews         |
         | 1                 | orderStatus        |         | features []        |
+------------------+         | subtotal           |         | tags []            |
|       Cart       |         | totalAmount        |         +--------------------+
+------------------+         | razorpayOrderId    |                    | 1
| user (ref: User) |         | statusTimeline []  |                    |
| items [          |         +--------------------+                    | *
|   product (ref)  |                                        +--------------------+
|   quantity       |                                        |       Review       |
|   priceSnapshot  |                                        +--------------------+
| ]                |                                        | user (ref: User)   |
+------------------+                                        | product (ref: Prod)|
                                                            | rating (1-5)       |
                                                            | comment            |
                                                            +--------------------+
```

1. **User (`backend/models/User.js`)**:
   - Stores customer credentials with `select: false` on the password field to prevent credential leaks in API responses.
   - Built-in `pre('save')` hook encrypting passwords with `bcryptjs` (salt rounds: 10).
   - Embedded subdocument array `addresses` with default address toggling logic.
2. **Product (`backend/models/Product.js`)**:
   - Stores catalog item specifications, images, category, brand, and available stock.
   - Automatically generates SEO-friendly slug strings (`pre('save')`) for URL routing.
3. **Cart (`backend/models/Cart.js`)**:
   - Maintains authenticated user cart state with product references, requested quantities, and price snapshots.
4. **Order (`backend/models/Order.js`)**:
   - Preserves complete point-in-time order items (`nameSnapshot`, `priceSnapshot`, `imageSnapshot`).
   - Retains address snapshot and stores payment identifiers (`razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`).
   - Features a chronologically ordered `statusTimeline` array logging status updates and timestamps.
5. **Review (`backend/models/Review.js`)**:
   - Contains 1-to-5 star ratings and textual comments.
   - Enforces a compound unique index `{ product: 1, user: 1 }` preventing users from submitting duplicate reviews on the same product.
6. **Coupon (`backend/models/Coupon.js`)**:
   - Manages promo codes, percentage or fixed discounts, minimum cart values, usage counters, and expiration dates.

---

## 10. REST API Documentation

Base URL for all REST endpoints: `/api`

### Health Check
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Service uptime, timestamp, environment, and MongoDB connection status |

### Authentication & User Profile (`/api/auth`)
| Method | Endpoint | Access | Description | Payload / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public (Rate-limited) | Register a new user | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Public (Rate-limited) | Authenticate user & get JWT | `{ email, password }` |
| `GET` | `/api/auth/profile` | Private | Fetch logged-in user profile | Requires `Bearer <token>` |
| `PUT` | `/api/auth/profile` | Private | Update profile details / password | `{ name, email, avatar, password? }` |
| `POST` | `/api/auth/address` | Private | Add new delivery address | `{ fullName, phone, street, city, state, postalCode, isDefault? }` |
| `DELETE`| `/api/auth/address/:addressId` | Private | Remove delivery address by ID | Removes address from user's address book |
| `POST` | `/api/auth/forgot-password` | Public (Rate-limited) | Request simulated password reset token | `{ email }` |
| `POST` | `/api/auth/reset-password` | Public (Rate-limited) | Reset password with token | `{ token, newPassword }` |

### Products & Reviews (`/api/products`)
| Method | Endpoint | Access | Description | Query Parameters / Payload |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products with search, filters, pagination | Query: `?page=1&limit=12&search=&category=&brand=&minPrice=&maxPrice=&inStock=true&sort=price-asc` |
| `GET` | `/api/products/meta` | Public | Fetch distinct active categories and brands | Returns `{ categories: [], brands: [] }` |
| `GET` | `/api/products/:id` | Public | Get product details by ID or slug with reviews | `:id` can be MongoDB ObjectId or string slug |
| `POST` | `/api/products` | Admin | Create new catalog product | `{ name, description, price, compareAtPrice?, images?, category, brand, stock, features?, tags? }` |
| `PATCH`| `/api/products/:id` | Admin | Update product details or stock level | Partial object with updated fields |
| `DELETE`| `/api/products/:id` | Admin | Permanently remove product | Deletes document by ID |
| `POST` | `/api/products/:id/reviews` | Private | Submit customer review & rating | `{ rating: 5, comment: "Excellent build" }` (1 per user) |

### Shopping Cart (`/api/cart`)
| Method | Endpoint | Access | Description | Payload / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Private | Get authenticated user cart items | Populated with active product details |
| `POST` | `/api/cart/items` | Private | Add item to cart or increment quantity | `{ productId, quantity }` (validates stock) |
| `PATCH`| `/api/cart/items/:itemId` | Private | Update specific cart item quantity | `{ quantity }` (validates stock) |
| `DELETE`| `/api/cart/items/:itemId` | Private | Remove item from cart | Deletes item subdocument |
| `DELETE`| `/api/cart` | Private | Clear entire cart | Empties user cart |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description | Payload / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private | Create order (Cash on Delivery or direct) | `{ items, addressSnapshot, paymentMethod: 'cod', subtotal, shippingFee, discountAmount, totalAmount }` |
| `GET` | `/api/orders` | Private | Get current user's order history | Sorted newest first |
| `GET` | `/api/orders/:id` | Private | Get order details & status timeline | Allowed for order owner or Admin |
| `PATCH`| `/api/orders/:id/cancel` | Private | Cancel order and replenish product stock | `{ reason? }` (allowed if status is `placed` or `processing`) |

### Payment Processing (`/api/payments`)
| Method | Endpoint | Access | Description | Payload / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-order` | Private (Rate-limited) | Initiate Razorpay order (in sub-units / Paise) | `{ amount, currency: 'INR', receipt? }` |
| `POST` | `/api/payments/verify` | Private (Rate-limited) | Cryptographically verify HMAC SHA256 signature & finalize order | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData }` |

### Coupons (`/api/coupons`)
| Method | Endpoint | Access | Description | Payload / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/coupons/validate` | Public | Validate promo code against cart total | `{ code: "WELCOME10", orderAmount: 2500 }` |
| `GET` | `/api/coupons` | Admin | List all promotional coupons | Returns active & inactive coupons |
| `POST` | `/api/coupons` | Admin | Create new promo coupon | `{ code, type, value, minOrder, maxDiscount, expiry, usageLimit }` |

### Media Upload (`/api/upload`)
| Method | Endpoint | Access | Description | Payload / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Admin | Upload image to Cloudinary CDN | `multipart/form-data` with field `image` (5MB limit, base64 fallback in dev) |

### Admin Management (`/api/admin`)
| Method | Endpoint | Access | Description | Query Parameters / Payload |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Dashboard analytics KPIs, low-stock alerts, recent orders | Returns revenue, order counts, SKU count, user totals |
| `GET` | `/api/admin/orders` | Admin | Fetch all store orders with status filtering | Query: `?page=1&limit=15&status=all` |
| `PATCH`| `/api/admin/orders/:id/status` | Admin | Advance order lifecycle status and log timeline entry | `{ status: 'shipped', comment: 'Dispatched via Express Courier' }` |
| `GET` | `/api/admin/users` | Admin | Directory of all registered customer accounts | Returns sanitized user records |

---

## 11. Authentication, RBAC & Payment Integration

### Authentication & Token Management
1. **Stateless JWT Tokens**: When a user registers or logs in, the backend signs a JSON Web Token containing the user's MongoDB `_id` (`jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' })`).
2. **Axios Request Interceptor**: On the frontend, `frontend/src/services/api.js` stores the token in `localStorage`. Every outgoing HTTP request automatically receives the header:
   ```http
   Authorization: Bearer <token>
   ```
3. **Route Authorization Middleware**:
   - `requireAuth` validates the token using `jwt.verify()`, retrieves the user document from MongoDB (excluding password), and attaches it to `req.user`.
   - `requireAdmin` checks `req.user.role === 'admin'`. If unauthorized, it returns an immediate HTTP `403 Forbidden`.

### Razorpay Dual-Mode Payment Architecture
TechStore implements a dual-mode payment flow that supports both live test transactions and an in-app interactive simulation modal for developer convenience:

```
[Customer on CheckoutPage]
           |
           v
[POST /api/payments/create-order] ---> (Amount converted to Paise)
           |
           +---> Are Live/Test Razorpay Keys configured in backend/.env?
                    |
                    +--- YES ---> Backend calls Razorpay SDK (instance.orders.create)
                    |             Frontend opens official window.Razorpay modal
                    |
                    +--- NO  ---> Backend issues mock order ID (isMock: true)
                                  Frontend opens interactive In-App Simulation Modal
           |
           v
[Customer Submits Payment]
           |
           v
[POST /api/payments/verify]
           |
           +---> Verifies HMAC SHA256 Signature (crypto.createHmac)
           +---> Verifies in-stock units for each item
           +---> Decrements inventory atomically ($inc: { stock: -quantity })
           +---> Creates Order document with point-in-time price snapshots
           +---> Empties user's Cart document
           v
[Order Confirmed -> Redirect to OrderSuccessPage]
```

---

## 12. Testing Instructions

### Automated Testing Status
> **Note**: Automated unit and integration test runners (such as Jest, Vitest, or Supertest) are not yet configured in the project's `package.json` scripts. Testing is currently conducted via manual API testing, frontend end-to-end user journeys, and production build validation.

### 1. Backend API & Health Check Verification
Verify service uptime and database connectivity using `curl` or Postman:

```bash
# Verify API Health & DB Connection
curl -X GET http://localhost:5000/api/health

# Expected response:
# {"status":"ok","service":"TechStore API","uptime":...,"database":"connected","environment":"development"}
```

```bash
# Verify Catalog Filtering & Pagination
curl -X GET "http://localhost:5000/api/products?page=1&limit=2&category=Laptops"
```

```bash
# Verify Promo Coupon Engine
curl -X POST http://localhost:5000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME10","orderAmount":2000}'
```

### 2. Frontend Production Build Verification
To ensure all React components, Tailwind directives, and imports compile cleanly without TypeScript or Rollup bundling errors:

```bash
cd frontend
npm run build
```
> The command executes `vite build` and should emit clean bundle chunks to the `frontend/dist/` directory.

### 3. End-to-End User Journey Verification
1. **Catalog Exploration**: Visit `http://localhost:5173/products`. Filter by category (e.g., *Laptops*), adjust price range sliders, and verify real-time card filtering.
2. **Guest Cart to Checkout**:
   - Add an item to the cart as an unauthenticated guest. Verify that `techstore_guest_cart` appears in `localStorage`.
   - Log in using the test customer credentials (`customer@techstore.com` / `Customer@123`).
   - Navigate to `/cart` and apply coupon code `WELCOME10`. Verify the discount is applied to the grand total.
3. **Payment Execution**:
   - Proceed to `/checkout`. Select a delivery address.
   - Choose **Razorpay Test Mode** and submit payment. In simulation mode, complete the order in the test modal.
   - Confirm redirection to `/order-success/:id`.
4. **Order Management & Stock Restoration**:
   - Navigate to `/orders`. Click into the created order.
   - Click **Cancel Order**. Verify that order status changes to `cancelled` and the stock is replenished in the catalog.
5. **Admin Operations**:
   - Log in as administrator (`admin@techstore.com` / `Admin@123`).
   - Navigate to `/admin`. Verify analytics KPIs, order list status updates, and product catalog additions.

---

## 13. Deployment Guide

The repository includes ready-to-use configuration files for cloud deployment:
- `backend/render.yaml` for deploying the Node.js REST API on **Render**.
- `frontend/vercel.json` for deploying the Vite SPA on **Vercel**.

---

### Backend Deployment (Render Web Service)

1. Push your repository to your GitHub account.
2. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** ➔ **Blueprint** (or **Web Service**).
3. If creating via Blueprint, Render detects `render.yaml` automatically. If configuring manually:
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Configure Environment Variables in the Render settings panel:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/techstore?retryWrites=true&w=majority`
   - `JWT_SECRET`: *(Generate a secure 64-character random string)*
   - `JWT_EXPIRE`: `30d`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app` *(Your Vercel domain)*
   - `RAZORPAY_KEY_ID`: `rzp_test_placeholder_key` *(or live test key)*
   - `RAZORPAY_KEY_SECRET`: `placeholder_secret_key` *(or live test secret)*
   - `CLOUDINARY_CLOUD_NAME`: *(your Cloudinary cloud name)*
   - `CLOUDINARY_API_KEY`: *(your Cloudinary API key)*
   - `CLOUDINARY_API_SECRET`: *(your Cloudinary API secret)*
5. Trigger manual deploy. Once healthy, test the live health endpoint:
   `https://your-backend-app.onrender.com/api/health`

> **Note on Render Free Tier**: Free tier instances spin down after 15 minutes of inactivity. The initial request may take 30–50 seconds to warm up the container.

---

### Frontend Deployment (Vercel)

1. Log in to [Vercel Dashboard](https://vercel.com/) and click **Add New...** ➔ **Project**.
2. Select your repository.
3. Configure project build settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`
5. Click **Deploy**.

> **Client-Side Routing on Vercel**: The included `frontend/vercel.json` file ensures that all page reloads (e.g., `/products/123`, `/checkout`, `/admin`) are redirected to `/index.html` without triggering 404 errors:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 14. Screenshots & UI Walkthrough

*(Screenshots can be added to a `docs/screenshots/` directory and referenced using markdown image syntax)*

| Screen | Preview Placeholder | Description |
| :--- | :--- | :--- |
| **Storefront Homepage** | ![Homepage Placeholder](https://via.placeholder.com/800x450/0f172a/ffffff?text=TechStore+Homepage+Hero+%26+Catalog) | High-impact hero section showcasing flagship electronics, featured categories, and trending deals. |
| **Catalog & Multi-Filters** | ![Catalog Page Placeholder](https://via.placeholder.com/800x450/0f172a/ffffff?text=Product+Catalog+%26+Faceted+Filters) | Filter sidebar by brand, category, price range, and in-stock status with dynamic grid layouts. |
| **Product Detail & Reviews** | ![Product Detail Placeholder](https://via.placeholder.com/800x450/0f172a/ffffff?text=Product+Details+%26+Customer+Reviews) | High-resolution image view, specifications list, stock availability indicator, and review submission. |
| **Cart & Promo Engine** | ![Shopping Cart Placeholder](https://via.placeholder.com/800x450/0f172a/ffffff?text=Cart+Management+%26+Coupon+Discounts) | Quantity adjustment, price subtotal calculation, and promo code verification (`WELCOME10`). |
| **Checkout & Razorpay Modal** | ![Checkout Page Placeholder](https://via.placeholder.com/800x450/0f172a/ffffff?text=Checkout+%26+Razorpay+Test+Gateway) | Delivery address selector, order summary, and Razorpay standard checkout / test simulation modal. |
| **Order Tracking Timeline** | ![Order Details Placeholder](https://via.placeholder.com/800x450/0f172a/ffffff?text=Order+Tracking+%26+Status+Timeline) | Detailed invoice breakdown and visual lifecycle timeline (`placed` ➔ `processing` ➔ `shipped` ➔ `delivered`). |
| **Admin Analytics Dashboard** | ![Admin Dashboard Placeholder](https://via.placeholder.com/800x450/0f172a/ffffff?text=Admin+Analytics+KPIs+%26+Inventory+Alerts) | High-level metrics: Total Revenue, Total Orders, Active SKUs, and real-time low-stock inventory alerts. |
| **Admin Catalog Management** | ![Admin Products Placeholder](https://via.placeholder.com/800x450/0f172a/ffffff?text=Admin+Catalog+CRUD+%26+Media+Upload) | Admin product creation form with Cloudinary image streaming and category classification. |

---

## 15. Technical Interview Talking Points

For technical interviews and architectural discussions, here are the key design choices and trade-offs made in TechStore:

1. **Why Vite over Create React App?**
   - Create React App relies on Webpack, which bundles the entire application before serving. Vite leverages native ES Modules (ESM) in modern browsers and performs lightning-fast on-demand compilation using `esbuild`. For production, Vite utilizes Rollup to generate optimized, tree-shaken static bundles.
2. **Why store Point-in-Time Price Snapshots in Orders?**
   - In a production e-commerce database, product prices change regularly due to inflation, sales, or supplier updates. If the `Order` schema simply referenced `Product._id` and computed totals dynamically, historical customer receipts and accounting ledgers would mutate whenever a product price changed. Preserving immutable `priceSnapshot` and `nameSnapshot` records guarantees audit integrity.
3. **Why must Payment Verification happen on the Server?**
   - Client-side code runs in an untrusted browser environment. A malicious user could tamper with frontend JavaScript, intercept the payment gateway callback, or simulate a success event. By performing cryptographic HMAC SHA256 hashing (`crypto.createHmac('sha256', secret)`) on the server with the confidential `RAZORPAY_KEY_SECRET`, the backend guarantees payment authenticity before decrementing inventory and finalizing orders.
4. **How are Inventory Race Conditions handled?**
   - Checking stock and decrementing stock in separate uncoordinated queries can cause overselling when two users place orders concurrently for the last unit. TechStore verifies available stock prior to payment and utilizes atomic MongoDB update operators (`$inc: { stock: -quantity }`). If an order is later cancelled, stock is restored via `$inc: { stock: quantity }`.
5. **How does the Hybrid Cart system work?**
   - To reduce friction, unauthenticated visitors can add products to a guest cart stored in browser `localStorage`. When the user logs in, the client switches to the authenticated MongoDB `Cart` document, ensuring items persist seamlessly across different devices and sessions.
6. **Graceful Fallbacks for External Services**:
   - To make the project portable for recruiters and evaluators who do not have personal Razorpay or Cloudinary accounts, the application detects missing or placeholder keys and switches to safe mock modes (in-app test payment modal and base64 image encoding fallback) without crashing.

---

## 16. Future Improvements

Planned enhancements for future iterations of TechStore:

- [ ] **Automated Testing Suite**: Introduce unit and integration tests using **Vitest** and **React Testing Library** for frontend components, and **Jest** + **Supertest** for REST API endpoints.
- [ ] **Automated Transactional Emails**: Integrate **Nodemailer** or **SendGrid** to deliver automated order confirmation receipts and authentic password reset links.
- [ ] **High-Performance Caching**: Integrate **Redis** caching for the product catalog and frequently queried filter endpoints to minimize database load.
- [ ] **Real-Time Order Updates**: Implement **WebSockets** (Socket.io) for live order status updates on the customer dashboard and instant low-stock notifications in the admin center.
- [ ] **Invoice PDF Generation**: Provide one-click PDF invoice downloads for completed orders.
- [ ] **Social Authentication**: Add OAuth 2.0 single sign-on support for Google and GitHub accounts.

---

## 17. Contributing Guidelines

Contributions, issues, and feature requests are welcome!

1. **Fork the Repository**:
   Click the **Fork** button at the top right of this page.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/<your-username>/techstore.git
   cd techstore
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Commit your Changes**:
   ```bash
   git commit -m "feat: add your descriptive feature commit message"
   ```
5. **Push to the Branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request**:
   Navigate to the original repository and open a Pull Request describing your changes, motivation, and any testing conducted.

---

## 18. License

This project is open-source and distributed under the terms of the **MIT License**. See the [LICENSE](LICENSE) file for more information.
