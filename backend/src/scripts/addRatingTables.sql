-- Add rating columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Create product_ratings table
CREATE TABLE IF NOT EXISTS product_ratings (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id) -- One rating per user per product
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_ratings_product_id ON product_ratings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ratings_user_id ON product_ratings(user_id);

-- Function to update product rating when a rating is added/updated
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the product's average rating and rating count
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

-- Create triggers to automatically update product ratings
DROP TRIGGER IF EXISTS trigger_update_product_rating_insert ON product_ratings;
CREATE TRIGGER trigger_update_product_rating_insert
    AFTER INSERT ON product_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

DROP TRIGGER IF EXISTS trigger_update_product_rating_update ON product_ratings;
CREATE TRIGGER trigger_update_product_rating_update
    AFTER UPDATE ON product_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

DROP TRIGGER IF EXISTS trigger_update_product_rating_delete ON product_ratings;
CREATE TRIGGER trigger_update_product_rating_delete
    AFTER DELETE ON product_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();
