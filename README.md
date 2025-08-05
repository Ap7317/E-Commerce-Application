# 🛍️ Full-Stack E-Commerce Website

A modern, feature-rich e-commerce application built with React.js, TypeScript, Tailwind CSS, and Shadcn/ui for the frontend, and Node.js with PostgreSQL for the backend.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)

## ✨ Features

### 🎨 Frontend Features
- 🛍️ **Modern UI**: Built with React.js 18, TypeScript, and Tailwind CSS
- 🎨 **Beautiful Components**: Using Shadcn/ui component library
- 🌙 **Dark/Light Mode**: Seamless theme switching with next-themes
- 🛒 **Shopping Cart**: Add, update, and remove items with real-time updates
- 🔐 **Authentication**: Secure user registration and login with JWT
- 📱 **Responsive Design**: Mobile-first approach, works on all devices
- 🎯 **Product Catalog**: Advanced search, filter, and browse products by category
- ⭐ **Product Ratings**: 5-star rating system with reviews and statistics
- 📦 **Order Management**: Complete order tracking and order history
- 👤 **User Profile**: Manage user information and preferences
- 🔒 **Protected Routes**: Role-based access control (Admin/User)
- 🏪 **Category Navigation**: Browse products by categories
- 🎨 **Enhanced Footer**: Modern dark-themed footer with social links

### 🚀 Backend Features
- � **REST API**: Built with Node.js, Express.js, and TypeScript
- 🔒 **JWT Authentication**: Secure token-based authentication system
- 🗄️ **PostgreSQL Database**: Robust relational database with optimized queries
- 📝 **Data Validation**: Comprehensive input validation and sanitization
- 🛡️ **Security**: Helmet, CORS, bcrypt, and other security middleware
- 📊 **Admin Dashboard**: Complete product, user, and order management
- ⭐ **Rating System**: Advanced rating system with automatic calculations
- 🔄 **Real-time Updates**: Live cart and inventory management
- 👥 **User Management**: Admin can manage users and assign roles
- 📈 **Order Analytics**: Comprehensive order tracking and statistics

## 🛠️ Tech Stack

### Frontend Technologies
- **React.js 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Shadcn/ui** - Beautiful, accessible, and customizable UI components
- **next-themes** - Perfect dark/light mode implementation
- **Zustand** - Lightweight state management solution
- **React Router v6** - Modern client-side routing
- **Axios** - Promise-based HTTP client
- **Vite** - Lightning-fast build tool and dev server
- **Lucide React** - Beautiful and consistent icons

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast and minimalist web framework
- **TypeScript** - Type safety for backend development
- **PostgreSQL** - Advanced relational database with JSON support
- **JWT** - Secure JSON Web Tokens for authentication
- **bcryptjs** - Robust password hashing
- **Helmet** - Security middleware for Express
- **CORS** - Cross-origin resource sharing configuration
- **dotenv** - Environment variable management

### Database Schema
- **Users** - Authentication and profile management
- **Categories** - Product categorization system
- **Products** - Complete product catalog
- **Cart** - Shopping cart persistence
- **Orders & Order Items** - Order management system
- **Product Ratings** - 5-star rating system with reviews
- **Automatic Triggers** - Database-level rating calculations

## Project Structure

```
E-Commerce Website/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Data models and types
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Database scripts
│   │   └── utils/          # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── frontend/               # Frontend React app
    ├── src/
    │   ├── components/     # Reusable components
    │   │   └── ui/        # Shadcn/ui components
    │   ├── pages/         # Page components
    │   ├── store/         # Zustand stores
    │   ├── lib/           # Utilities and API
    │   ├── types/         # TypeScript types
    │   └── hooks/         # Custom React hooks
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## 🔧 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v15 or higher) - [Download here](https://postgresql.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control

### 🗄️ Database Setup

1. **Create Database**:
```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE ecommerce_db;
```

2. **Set up Neon Database (Recommended)**:
   - Sign up at [Neon](https://neon.tech/)
   - Create a new project
   - Copy the connection string

### 🚀 Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment Configuration**:
```bash
cp .env.example .env
```

4. **Update `.env` file**:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. **Initialize Database**:
```bash
# Run database migrations
npm run init-db

# Run rating system migration
npm run migrate-ratings
```

6. **Start Development Server**:
```bash
npm run dev
```

Backend API will be available at `http://localhost:5000/api`

### 🎨 Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment Configuration**:
```bash
# Create .env file
touch .env
```

4. **Update `.env` file**:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. **Start Development Server**:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 🎯 Quick Start Commands

```bash
# Clone the repository
git clone <your-repo-url>
cd E-Commerce-Website

# Backend setup
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run init-db
npm run dev

# In a new terminal - Frontend setup
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional: Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🗄️ Database Schema

The application uses a robust PostgreSQL database with the following structure:

### Core Tables
- **users** - User accounts, profiles, and authentication
- **categories** - Product categorization system
- **products** - Complete product catalog with details
- **cart** - Persistent shopping cart items
- **orders** - Order records and tracking
- **order_items** - Individual items within orders
- **product_ratings** - 5-star rating system with reviews

### Advanced Features
- **Database Triggers** - Automatic rating average calculations
- **Indexes** - Optimized queries for better performance
- **Foreign Keys** - Data integrity and relationships
- **JSON Support** - Flexible data storage for product attributes

### Rating System Schema
```sql
CREATE TABLE product_ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Automatic rating calculation trigger
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM product_ratings 
        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get products (with pagination/filtering)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Ratings
- `POST /api/ratings` - Add product rating and review
- `GET /api/ratings/product/:productId` - Get product ratings
- `GET /api/ratings/user/:productId` - Get user's rating for product
- `DELETE /api/ratings/:id` - Delete rating (user/admin)
- `GET /api/ratings/stats/:productId` - Get rating statistics

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

## 🎯 Current Features

### ✅ Implemented Features
- ✅ **User Authentication & Authorization** - Complete JWT-based auth system
- ✅ **Product Catalog with Categories** - Browse and filter products
- ✅ **Shopping Cart Functionality** - Add, update, remove items
- ✅ **Order Management System** - Complete order processing
- ✅ **Admin Dashboard** - Full CRUD operations for products, users, orders
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Search and Filtering** - Advanced product search capabilities
- ✅ **Product Rating System** - 5-star ratings with reviews and statistics
- ✅ **Dark/Light Mode** - Seamless theme switching
- ✅ **Role-based Access Control** - Admin and user role management
- ✅ **Category Navigation** - Browse products by categories
- ✅ **Order History** - Complete order tracking for users
- ✅ **Enhanced UI Components** - Modern, accessible components
- ✅ **Database Triggers** - Automatic rating calculations

### 🚀 Future Enhancements
- � **Payment Integration** - Stripe/PayPal integration
- 📧 **Email Notifications** - Order confirmations and updates
- 🖼️ **Image Upload** - Cloudinary integration for product images
- 🔍 **Advanced Search** - Elasticsearch implementation
- 📊 **Analytics Dashboard** - Sales and user analytics
- 🌐 **Multi-language Support** - Internationalization
- 📱 **PWA Support** - Progressive Web App features
- 🚚 **Shipping Integration** - Real-time shipping calculations
- 💰 **Discount System** - Coupons and promotional codes
- 📱 **Mobile App** - React Native companion app

## 🔒 Security Features

- **Password Hashing** - bcryptjs with salt rounds for secure password storage
- **JWT Authentication** - Stateless, secure token-based authentication
- **Role-based Access Control** - Admin and user permission levels
- **Input Validation** - Comprehensive data validation and sanitization
- **CORS Protection** - Configured cross-origin resource sharing
- **Helmet Security** - Security headers and middleware
- **SQL Injection Prevention** - Parameterized queries and ORM protection
- **Environment Variables** - Sensitive data protection
- **Rate Limiting** - API endpoint protection (recommended for production)
- **HTTPS Ready** - SSL/TLS encryption support

## 🚀 Production Deployment

### Backend Deployment Options

#### Option 1: Railway/Render
1. **Build the application**:
```bash
npm run build
```
2. Connect your GitHub repository
3. Set environment variables
4. Deploy automatically

#### Option 2: Traditional VPS
1. **Prepare for production**:
```bash
npm run build
npm start
```
2. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start dist/server.js --name "ecommerce-api"
```

### Frontend Deployment Options

#### Option 1: Vercel (Recommended)
1. **Build the application**:
```bash
npm run build
```
2. Connect GitHub repository to Vercel
3. Set environment variables
4. Deploy automatically

#### Option 2: Netlify
1. **Build and deploy**:
```bash
npm run build
# Deploy dist folder to Netlify
```

### Environment Variables for Production

#### Backend Production Variables
```env
DATABASE_URL=your_production_database_url
JWT_SECRET=your_super_secure_production_jwt_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend Production Variables
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 📸 Screenshots

### 🏠 Homepage
- Modern hero section with featured products
- Category navigation
- Product showcase with ratings

### 🛍️ Product Catalog
- Advanced filtering and search
- Category-based browsing
- Product cards with ratings and pricing

### 🌟 Product Details
- Detailed product information
- 5-star rating system with reviews
- Add to cart functionality
- Related products

### 🛒 Shopping Cart
- Real-time cart updates
- Quantity management
- Price calculations
- Checkout process

### 👤 User Dashboard
- Order history and tracking
- Profile management
- Personal information updates

### ⚙️ Admin Dashboard
- Product management (CRUD operations)
- User management and role assignment
- Order management and status updates
- Analytics and statistics

### 🌙 Dark Mode
- Seamless theme switching
- Consistent dark mode across all components
- Modern dark theme design

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Process
1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**:
   - Follow TypeScript best practices
   - Add appropriate types
   - Write clean, maintainable code
4. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Submit a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Add TypeScript types for all functions
- Write meaningful commit messages
- Update documentation when necessary
- Add tests for new features
- Ensure all tests pass before submitting

### Areas for Contribution
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage improvements

## 📞 Support & Contact

### Getting Help
- 📖 **Documentation**: Check this README and code comments
- 🐛 **Bug Reports**: Create an issue on GitHub
- 💡 **Feature Requests**: Open a discussion on GitHub
- ❓ **Questions**: Use GitHub Discussions

### Development Team
- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, PostgreSQL
- **DevOps**: Database management, deployment

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vercel** - For the incredible developer experience
- **Shadcn** - For the beautiful UI components
- **Tailwind CSS** - For the utility-first CSS framework
- **PostgreSQL** - For the robust database system
- **Open Source Community** - For the countless libraries and tools

---

<div align="center">
  <h3>🌟 Star this repository if you found it helpful! 🌟</h3>
  <p>Made with ❤️ for the developer community</p>
</div>
