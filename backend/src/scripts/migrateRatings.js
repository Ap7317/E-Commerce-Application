const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const runRatingMigration = async () => {
  try {
    console.log('🔄 Running rating system migration...');
    
    // Add rating columns to products table
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
    `);
    console.log('✅ Added rating columns to products table');

    // Create product_ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_ratings (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(product_id, user_id)
      );
    `);
    console.log('⭐ Created product_ratings table');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_product_ratings_product_id ON product_ratings(product_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_product_ratings_user_id ON product_ratings(user_id);
    `);
    console.log('📊 Created indexes for better performance');

    // Create function for updating product ratings
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_product_rating()
      RETURNS TRIGGER AS $$
      BEGIN
          UPDATE products SET 
              average_rating = (
                  SELECT ROUND(AVG(rating)::numeric, 2)
                  FROM product_ratings 
                  WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
              ),
              rating_count = (
                  SELECT COUNT(*)
                  FROM product_ratings 
                  WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
              )
          WHERE id = COALESCE(NEW.product_id, OLD.product_id);
          
          RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('🔧 Created update_product_rating function');

    // Create triggers
    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_update_product_rating_insert ON product_ratings;
      CREATE TRIGGER trigger_update_product_rating_insert
          AFTER INSERT ON product_ratings
          FOR EACH ROW
          EXECUTE FUNCTION update_product_rating();
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_update_product_rating_update ON product_ratings;
      CREATE TRIGGER trigger_update_product_rating_update
          AFTER UPDATE ON product_ratings
          FOR EACH ROW
          EXECUTE FUNCTION update_product_rating();
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS trigger_update_product_rating_delete ON product_ratings;
      CREATE TRIGGER trigger_update_product_rating_delete
          AFTER DELETE ON product_ratings
          FOR EACH ROW
          EXECUTE FUNCTION update_product_rating();
    `);
    console.log('🎯 Created triggers for automatic rating updates');
    
    console.log('');
    console.log('🎉 Rating system migration completed successfully!');
    console.log('📋 Summary:');
    console.log('   ✅ Added average_rating and rating_count columns to products');
    console.log('   ⭐ Created product_ratings table');
    console.log('   📊 Added database indexes');
    console.log('   🔄 Created automatic rating calculation triggers');
    console.log('');
    console.log('🚀 Your rating system is now ready to use!');
    
  } catch (error) {
    console.error('❌ Error running rating migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

runRatingMigration()
  .then(() => {
    console.log('Migration completed successfully');
  })
  .catch((error) => {
    console.error('Migration failed:', error);
  });
