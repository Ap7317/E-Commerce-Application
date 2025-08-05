import dotenv from 'dotenv';
import { pool } from '../config/database';

// Load environment variables
dotenv.config();

const addSampleData = async () => {
  try {
    console.log('🌱 Adding sample data to database...');

    // Add categories
    const categories = [
      { name: 'Electronics', description: 'Latest gadgets and tech devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500' },
      { name: 'Fashion', description: 'Trendy clothing and accessories', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500' },
      { name: 'Home & Garden', description: 'Everything for your home and garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500' },
      { name: 'Books', description: 'Books for all ages and interests', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500' },
      { name: 'Sports', description: 'Sports equipment and accessories', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500' }
    ];

    console.log('📂 Adding categories...');
    for (const category of categories) {
      await pool.query(
        'INSERT INTO categories (name, description, image) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING',
        [category.name, category.description, category.image]
      );
    }

    // Get category IDs
    const categoryResult = await pool.query('SELECT id, name FROM categories');
    const categoryMap = categoryResult.rows.reduce((acc: any, row: any) => {
      acc[row.name] = row.id;
      return acc;
    }, {});

    // Add products
    const products = [
      // Electronics
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera system and A17 Pro chip',
        price: 999.99,
        stock_quantity: 50,
        category_id: categoryMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
        featured: true
      },
      {
        name: 'MacBook Air M3',
        description: '13-inch laptop with M3 chip, perfect for work and creativity',
        price: 1299.99,
        stock_quantity: 30,
        category_id: categoryMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'],
        featured: true
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Wireless noise-canceling headphones with premium sound quality',
        price: 399.99,
        stock_quantity: 75,
        category_id: categoryMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        featured: false
      },
      {
        name: 'Samsung 4K Smart TV',
        description: '55-inch 4K Ultra HD Smart TV with HDR',
        price: 799.99,
        stock_quantity: 25,
        category_id: categoryMap['Electronics'],
        images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'],
        featured: true
      },

      // Fashion
      {
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket perfect for any casual outfit',
        price: 89.99,
        stock_quantity: 100,
        category_id: categoryMap['Fashion'],
        images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500'],
        featured: true
      },
      {
        name: 'Running Sneakers',
        description: 'Comfortable running shoes with advanced cushioning',
        price: 129.99,
        stock_quantity: 80,
        category_id: categoryMap['Fashion'],
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        featured: false
      },
      {
        name: 'Leather Handbag',
        description: 'Premium leather handbag with elegant design',
        price: 199.99,
        stock_quantity: 45,
        category_id: categoryMap['Fashion'],
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
        featured: true
      },

      // Home & Garden
      {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe',
        price: 149.99,
        stock_quantity: 60,
        category_id: categoryMap['Home & Garden'],
        images: ['https://images.unsplash.com/photo-1559118019-7b2a0ab5a5cf?w=500'],
        featured: false
      },
      {
        name: 'Indoor Plant Set',
        description: 'Collection of 3 low-maintenance indoor plants',
        price: 49.99,
        stock_quantity: 120,
        category_id: categoryMap['Home & Garden'],
        images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
        featured: true
      },
      {
        name: 'Throw Pillow Set',
        description: 'Set of 4 decorative throw pillows for your living room',
        price: 39.99,
        stock_quantity: 90,
        category_id: categoryMap['Home & Garden'],
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'],
        featured: false
      },

      // Books
      {
        name: 'The Art of Programming',
        description: 'Comprehensive guide to modern programming techniques',
        price: 59.99,
        stock_quantity: 200,
        category_id: categoryMap['Books'],
        images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
        featured: false
      },
      {
        name: 'Cooking Mastery',
        description: 'Master the art of cooking with this comprehensive cookbook',
        price: 34.99,
        stock_quantity: 150,
        category_id: categoryMap['Books'],
        images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500'],
        featured: true
      },

      // Sports
      {
        name: 'Yoga Mat',
        description: 'Premium non-slip yoga mat for all your fitness needs',
        price: 29.99,
        stock_quantity: 180,
        category_id: categoryMap['Sports'],
        images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'],
        featured: false
      },
      {
        name: 'Fitness Tracker',
        description: 'Advanced fitness tracker with heart rate monitoring',
        price: 199.99,
        stock_quantity: 70,
        category_id: categoryMap['Sports'],
        images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500'],
        featured: true
      }
    ];

    console.log('📦 Adding products...');
    for (const product of products) {
      await pool.query(
        'INSERT INTO products (name, description, price, stock_quantity, category_id, images, featured) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [product.name, product.description, product.price, product.stock_quantity, product.category_id, JSON.stringify(product.images), product.featured]
      );
    }

    // Create an admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['Admin User', 'admin@ecommerce.com', hashedPassword, 'admin']
    );

    console.log('✅ Sample data added successfully!');
    console.log('📧 Admin credentials: admin@ecommerce.com / admin123');
    console.log('🛍️ Added', products.length, 'products across', categories.length, 'categories');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    process.exit(0);
  }
};

addSampleData();
