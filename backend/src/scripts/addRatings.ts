import { pool } from '../config/database';

const addRatingsToProducts = async () => {
  try {
    console.log('🌟 Adding ratings to products...');

    // Add average_rating column to products table
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0
    `);

    // Create reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    // Update existing products with random ratings for demo
    const products = await pool.query('SELECT id FROM products');
    
    for (const product of products.rows) {
      const rating = (Math.random() * 2 + 3).toFixed(1); // Rating between 3.0 - 5.0
      const reviewCount = Math.floor(Math.random() * 50) + 10; // 10-60 reviews
      
      await pool.query(
        'UPDATE products SET average_rating = $1, review_count = $2 WHERE id = $3',
        [rating, reviewCount, product.id]
      );
    }

    // Add some sample reviews
    const sampleReviews = [
      { rating: 5, comment: 'Excellent product! Highly recommended.' },
      { rating: 4, comment: 'Good quality, fast delivery.' },
      { rating: 5, comment: 'Amazing! Will buy again.' },
      { rating: 4, comment: 'Works as expected, good value.' },
      { rating: 5, comment: 'Perfect! Exactly what I needed.' }
    ];

    const users = await pool.query('SELECT id FROM users LIMIT 5');
    
    for (let i = 0; i < Math.min(users.rows.length, products.rows.length); i++) {
      const review = sampleReviews[i % sampleReviews.length];
      await pool.query(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, product_id) DO NOTHING',
        [users.rows[i % users.rows.length].id, products.rows[i].id, review.rating, review.comment]
      );
    }

    console.log('✅ Ratings and reviews added successfully!');
    console.log('📊 Products now have average ratings and review counts');

  } catch (error) {
    console.error('❌ Error adding ratings:', error);
  } finally {
    process.exit(0);
  }
};

addRatingsToProducts();
