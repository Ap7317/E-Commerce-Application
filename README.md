# E-Commerce Website

A full-stack e-commerce application built with React.js, TypeScript, Tailwind CSS, and Shadcn/ui for the frontend, and Node.js with PostgreSQL for the backend.

## Features

### Frontend
- 🛍️ **Modern UI**: Built with React.js, TypeScript, and Tailwind CSS
- 🎨 **Beautiful Components**: Using Shadcn/ui component library
- 🛒 **Shopping Cart**: Add, update, and remove items
- 🔐 **Authentication**: User registration and login
- 📱 **Responsive Design**: Mobile-first approach
- 🎯 **Product Catalog**: Search, filter, and browse products
- 📦 **Order Management**: Track orders and order history
- 👤 **User Profile**: Manage user information and preferences
- 🔒 **Protected Routes**: Role-based access control

### Backend
- 🚀 **REST API**: Built with Node.js and Express.js
- 🔒 **JWT Authentication**: Secure token-based authentication
- 🗄️ **PostgreSQL Database**: Robust relational database
- 📝 **Data Validation**: Input validation and sanitization
- 🛡️ **Security**: Helmet, CORS, and other security middleware
- 📊 **Admin Dashboard**: Product and order management
- 🔄 **Real-time Updates**: Live cart and inventory management

## Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful and accessible UI components
- **Zustand** - Simple state management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

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

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
DATABASE_URL=your_postgresql_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Initialize the database:
```bash
npm run init-db
```

6. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000/api`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

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

## Database Schema

The application uses the following main tables:

- **users** - User accounts and profiles
- **categories** - Product categories
- **products** - Product catalog
- **cart** - Shopping cart items
- **orders** - Order records
- **order_items** - Individual items in orders

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
- Helmet security headers
- SQL injection prevention
- Rate limiting (recommended for production)

## Production Deployment

### Backend Deployment
1. Build the TypeScript code:
```bash
npm run build
```

2. Set environment variables for production
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
