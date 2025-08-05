# E-Commerce Backend API

A robust Node.js backend API for an e-commerce platform built with TypeScript, Express, and PostgreSQL.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 📦 **Product Management**: CRUD operations for products with categories and stock management
- 🛒 **Shopping Cart**: Add, update, remove items with stock validation
- 📋 **Order Management**: Complete order processing with order history
- 👥 **User Management**: User profiles and role-based permissions
- 🗄️ **PostgreSQL Database**: Robust relational database with proper relationships
- 🛡️ **Security**: Helmet, CORS, input validation, and password hashing
- 📝 **Logging**: Morgan HTTP request logging
- ⚡ **TypeScript**: Full type safety and better developer experience

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Security**: bcryptjs, helmet, CORS
- **Validation**: express-validator

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database connection string and other configurations:
```env
DATABASE_URL=your_postgresql_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Initialize the database:
```bash
npm run build
npm run init-db
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/:id` - Update cart item quantity (protected)
- `DELETE /api/cart/:id` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear entire cart (protected)

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/my-orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `categories` - Product categories
- `products` - Product catalog
- `cart` - Shopping cart items
- `orders` - Order records
- `order_items` - Individual items in orders

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run init-db` - Initialize database tables

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Helmet security headers
- SQL injection prevention with parameterized queries

## Error Handling

The API includes comprehensive error handling with:
- Centralized error middleware
- Proper HTTP status codes
- Detailed error messages in development
- Async error handling wrapper

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
