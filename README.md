# 🛒 E-Commerce Application

A full-stack e-commerce application built with **React.js**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL**. Features a complete shopping experience with user authentication, product management, shopping cart, order processing, and a powerful admin dashboard.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Admin Access](#-admin-access)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

### 🛍️ Customer Features
- **User Authentication**
  - User registration and login with JWT
  - Password hashing with bcrypt
  - Forgot password functionality (direct reset without email)
  - Protected routes with role-based access control

- **Product Browsing**
  - Browse products with pagination
  - Search products by name or description
  - Filter by categories
  - View featured products
  - Product detail pages with images
  - Product ratings and reviews (5-star system)

- **Shopping Cart**
  - Add products to cart
  - Update quantities
  - Remove items
  - Real-time cart total calculation
  - Persistent cart (stored in database)

- **Order Management**
  - Checkout with shipping address
  - Order placement
  - Order confirmation page
  - View order history
  - Track order status

- **User Profile**
  - View and update profile information
  - View order history
  - Manage account settings

### 👨‍💼 Admin Features
- **Admin Dashboard**
  - Real-time statistics (total products, orders, users, revenue)
  - Quick action cards
  - Beautiful gradient UI

- **Product Management**
  - View all products in grid layout
  - Add new products with full details
  - Edit existing products
  - Delete products with confirmation
  - Upload multiple product images (URLs)
  - Set product status (active/inactive)
  - Mark products as featured
  - Manage stock quantity
  - Assign products to categories

- **Order Management**
  - View all orders with customer details
  - See which products were ordered
  - Update order status (Pending, Processing, Shipped, Delivered, Cancelled)
  - Filter orders by status
  - View order statistics by status

- **User Management**
  - View all registered users
  - See user details (name, email, role)
  - View purchase history per user
  - Search users by name or email
  - Track total orders and spending per user

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
|-----------|-------------|
| **React 18** | Modern React with hooks and functional components |
| **TypeScript** | Type-safe JavaScript for better development experience |
| **Vite** | Fast build tool and development server |
| **React Router v6** | Client-side routing with protected routes |
| **Zustand** | Lightweight state management (auth & cart) |
| **Axios** | HTTP client with interceptors for authentication |
| **Tailwind CSS** | Utility-first CSS framework |
| **Shadcn/ui** | Beautiful and accessible UI components |
| **Lucide React** | Modern icon library |

### Backend
| Technology | Description |
|-----------|-------------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Fast, unopinionated web framework |
| **TypeScript** | Type-safe backend development |
| **PostgreSQL** | Robust relational database (Neon) |
| **JWT** | JSON Web Tokens for authentication |
| **bcryptjs** | Password hashing (12 salt rounds) |
| **express-validator** | Request validation middleware |
| **Helmet** | Security middleware |
| **CORS** | Cross-origin resource sharing |
| **Morgan** | HTTP request logger |
| **nodemon** | Auto-restart on file changes |
| **ts-node** | TypeScript execution for Node.js |

---

## 📁 Project Structure

```
E-Commerce-Application/
├── backend/                      # Backend API Server
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   └── database.ts      # PostgreSQL connection & schema
│   │   ├── controllers/         # Request handlers
│   │   │   ├── adminController.ts
│   │   │   ├── authController.ts
│   │   │   ├── cartController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── productController.ts
│   │   │   └── ratingController.ts
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.ts          # JWT authentication
│   │   │   └── errorHandler.ts  # Error handling
│   │   ├── models/              # TypeScript types
│   │   │   └── types.ts
│   │   ├── routes/              # API routes
│   │   │   ├── admin.ts
│   │   │   ├── auth.ts
│   │   │   ├── cart.ts
│   │   │   ├── categories.ts
│   │   │   ├── orders.ts
│   │   │   ├── products.ts
│   │   │   ├── ratings.ts
│   │   │   └── users.ts
│   │   ├── scripts/             # Database utilities
│   │   │   ├── createAdmin.ts   # Create admin user
│   │   │   ├── initDb.ts        # Initialize database
│   │   │   └── resetAdminPassword.ts
│   │   └── index.ts             # Server entry point
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                    # React Frontend
    ├── src/
    │   ├── components/         # Reusable components
    │   │   ├── ui/            # Shadcn/ui components
    │   │   │   ├── button.tsx
    │   │   │   ├── card.tsx
    │   │   │   ├── dialog.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── label.tsx
    │   │   │   ├── select.tsx
    │   │   │   ├── separator.tsx
    │   │   │   └── textarea.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── ProductRating.tsx
    │   │   ├── ProtectedRoute.tsx
    │   │   └── StarRating.tsx
    │   ├── pages/             # Page components
    │   │   ├── admin/
    │   │   │   └── AdminDashboard.tsx
    │   │   ├── AdminOrders.tsx
    │   │   ├── AdminProducts.tsx
    │   │   ├── AdminUsers.tsx
    │   │   ├── CartPage.tsx
    │   │   ├── CategoryPage.tsx
    │   │   ├── CheckoutPage.tsx
    │   │   ├── ForgotPasswordPage.tsx
    │   │   ├── HomePage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── OrderConfirmationPage.tsx
    │   │   ├── OrdersPage.tsx
    │   │   ├── ProductDetailPage.tsx
    │   │   ├── ProductsPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   └── RegisterPage.tsx
    │   ├── store/             # Zustand state management
    │   │   ├── authStore.ts   # Auth state
    │   │   └── cartStore.ts   # Cart state
    │   ├── lib/               # Utilities
    │   │   ├── api.ts         # API client
    │   │   ├── toast.ts       # Toast notifications
    │   │   └── utils.ts       # Helper functions
    │   ├── types/             # TypeScript types
    │   │   └── index.ts
    │   ├── App.tsx            # Main app component
    │   ├── main.tsx           # Entry point
    │   └── globals.css        # Global styles
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** database (local or cloud like Neon)
- **npm** or **yarn** package manager

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/E-Commerce-Application.git
cd E-Commerce-Application
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Add your environment variables (see below)

# Initialize database and create tables
npm run init-db

# Create admin user
npm run create-admin

# Start development server
npm run dev
```

**Backend will run on:** `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on:** `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend `.env` file
Create a `.env` file in the `backend` directory:

```env
# Database Configuration (Required)
# Get your connection string from your PostgreSQL provider (Neon, Railway, etc.)
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# JWT Secret (Required) - Generate a strong random string (min 32 characters)
# You can generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:3000
```

> ⚠️ **Security Warning:** Never commit your `.env` file to git. Keep your credentials secure!

### Frontend `.env` file (Optional)
Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🗄️ Database Setup

### Option 1: Using Neon (Cloud PostgreSQL) - Recommended
1. Sign up at [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env` file as `DATABASE_URL`

### Option 2: Local PostgreSQL
```bash
# Install PostgreSQL
# Create database
psql -U postgres
CREATE DATABASE ecommerce_db;

# Update DATABASE_URL in .env with your local credentials
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ecommerce_db
```

### Initialize Database Tables
```bash
cd backend
npm run init-db
```

This creates the following tables:
- `users` - User accounts (customers and admins)
- `categories` - Product categories
- `products` - Product catalog
- `cart` - Shopping cart items
- `orders` - Order records
- `order_items` - Items within orders
- `ratings` - Product ratings and reviews

---

## 🎮 Running the Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend (in new terminal):**
```bash
cd frontend
npm run dev
```

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 👨‍💼 Admin Access

### Create Admin User
```bash
cd backend
npm run create-admin
```

**Default Admin Credentials:**
- **Email:** `admin@ecommerce.com`
- **Password:** `admin123`

### Reset Admin Password
```bash
cd backend
npm run reset-admin
```

### Admin Dashboard Access
1. Login with admin credentials
2. Click "Admin Dashboard" button in navbar
3. Access admin features:
   - **Dashboard** - `/admin` - Statistics overview
   - **Products** - `/admin/products` - Manage products
   - **Orders** - `/admin/orders` - Manage orders
   - **Users** - `/admin/users` - View all users

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/reset-password` | Reset password | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update profile | Yes |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products (paginated) | No |
| GET | `/featured` | Get featured products | No |
| GET | `/:id` | Get product by ID | No |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all categories | No |
| GET | `/:id` | Get category by ID | No |
| POST | `/` | Create category | Admin |
| PUT | `/:id` | Update category | Admin |
| DELETE | `/:id` | Delete category | Admin |

### Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's cart | Yes |
| POST | `/` | Add item to cart | Yes |
| PUT | `/:id` | Update cart item quantity | Yes |
| DELETE | `/:id` | Remove item from cart | Yes |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/my-orders` | Get user's orders | Yes |
| GET | `/:id` | Get order by ID | Yes |
| POST | `/` | Create order | Yes |
| PUT | `/:id/status` | Update order status | Admin |

### Ratings (`/api/ratings`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/product/:productId` | Get product ratings | No |
| GET | `/user/:productId` | Get user's rating for product | Yes |
| POST | `/` | Create/update rating | Yes |
| DELETE | `/:id` | Delete rating | Yes |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats` | Get dashboard statistics | Admin |
| GET | `/users` | Get all users | Admin |
| GET | `/orders` | Get all orders | Admin |
| PUT | `/orders/:id/status` | Update order status | Admin |

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

## Features to Implement

### Current Features
- ✅ User authentication and authorization
- ✅ Product catalog with categories
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Search and filtering

### Future Enhancements
- 🔄 Payment integration (Stripe)
- 📧 Email notifications
- 🖼️ Image upload (Cloudinary)
- ⭐ Product reviews and ratings
- 🔍 Advanced search with Elasticsearch
- 📊 Analytics dashboard
- 🌐 Multi-language support
- 📱 PWA (Progressive Web App)
- 🚚 Shipping integration
- 💰 Discount codes and coupons

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
---

## 🎨 Key Features Explained

### Authentication System
- **JWT-based authentication** with 7-day token expiration
- **Password hashing** using bcrypt with 12 salt rounds
- **Role-based access control** (User vs Admin)
- **Protected routes** on both frontend and backend
- **Forgot password** feature with direct password reset
- **Auto-logout** on token expiration

### Shopping Cart
- **Persistent cart** stored in PostgreSQL database
- **Real-time updates** when items are added/removed
- **Stock validation** prevents ordering unavailable items
- **Cart badge** shows item count in navbar
- **Cart total** calculated automatically

### Product Management
- **Image support** via URL array (multiple images per product)
- **Category assignment** for better organization
- **Featured products** displayed on homepage
- **Stock tracking** with quantity management
- **Active/Inactive status** to hide products without deletion
- **Search and filter** by name, category, and featured status

### Rating & Review System
- **5-star rating** with half-star support
- **Review text** with optional comments
- **Average rating** calculation per product
- **One rating per user per product** (update if exists)
- **Delete own ratings** functionality
- **Real-time updates** after submission

---

## 🛡️ Security Features

- ✅ **JWT Authentication** with secure token storage
- ✅ **Password Hashing** using bcrypt (12 rounds)
- ✅ **SQL Injection Prevention** via parameterized queries
- ✅ **CORS Protection** with whitelist
- ✅ **Helmet.js** for HTTP headers security
- ✅ **Input Validation** using express-validator
- ✅ **Role-based Authorization** (User/Admin)
- ✅ **XSS Protection** via React's built-in escaping
- ✅ **HTTPS Support** ready for production

---

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Laptops (1024px and up)
- 🖥️ Desktop (1280px and up)

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Output will be in 'dist' folder
```

---

## 📝 Available Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run init-db      # Initialize database tables
npm run create-admin # Create admin user
npm run reset-admin  # Reset admin password
```

### Frontend
```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running

### Frontend can't connect
- Verify backend is running on port 5000
- Check CORS settings in backend

### Database errors
- Run `npm run init-db` to create tables
- Verify PostgreSQL credentials

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ap7317**
- GitHub: [@Ap7317](https://github.com/Ap7317)

---

## 🙏 Acknowledgments

- React Team for the amazing framework
- Shadcn/ui for beautiful components
- Tailwind CSS for styling
- PostgreSQL & Neon for database
- The open-source community

---

<div align="center">

**Made with ❤️ and TypeScript**

⭐ Star this repo if you find it helpful!

[⬆ Back to Top](#-e-commerce-application)

</div>
