import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Add or update a product rating
export const addRating = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user?.id;

    // Check if product exists
    const productQuery = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [productId]
    );

    if (productQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already rated this product
    const existingRating = await pool.query(
      'SELECT id FROM product_ratings WHERE product_id = $1 AND user_id = $2',
      [productId, userId]
    );

    let result;
    if (existingRating.rows.length > 0) {
      // Update existing rating
      result = await pool.query(
        'UPDATE product_ratings SET rating = $1, review = $2, updated_at = CURRENT_TIMESTAMP WHERE product_id = $3 AND user_id = $4 RETURNING *',
        [rating, review, productId, userId]
      );
    } else {
      // Create new rating
      result = await pool.query(
        'INSERT INTO product_ratings (product_id, user_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING *',
        [productId, userId, rating, review]
      );
    }

    res.status(existingRating.rows.length > 0 ? 200 : 201).json({
      message: existingRating.rows.length > 0 ? 'Rating updated successfully' : 'Rating added successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Error in addRating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all ratings for a product
export const getProductRatings = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT pr.*, u.name as user_name 
       FROM product_ratings pr 
       JOIN users u ON pr.user_id = u.id 
       WHERE pr.product_id = $1 
       ORDER BY pr.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [productId, limit, offset]
    );

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM product_ratings WHERE product_id = $1',
      [productId]
    );

    res.json({
      ratings: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error) {
    console.error('Error in getProductRatings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's rating for a specific product
export const getUserRating = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      'SELECT * FROM product_ratings WHERE product_id = $1 AND user_id = $2',
      [productId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in getUserRating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a rating (user can only delete their own rating)
export const deleteRating = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(
      'DELETE FROM product_ratings WHERE product_id = $1 AND user_id = $2 RETURNING *',
      [productId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found or unauthorized' });
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error in deleteRating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get rating statistics for a product
export const getRatingStats = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const statsResult = await pool.query(
      `SELECT 
         AVG(rating)::numeric(3,2) as average_rating,
         COUNT(*) as total_ratings,
         COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
         COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
         COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
         COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
         COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
       FROM product_ratings 
       WHERE product_id = $1`,
      [productId]
    );

    const stats = statsResult.rows[0];
    
    res.json({
      average_rating: parseFloat(stats.average_rating) || 0,
      total_ratings: parseInt(stats.total_ratings),
      distribution: {
        5: parseInt(stats.five_star),
        4: parseInt(stats.four_star),
        3: parseInt(stats.three_star),
        2: parseInt(stats.two_star),
        1: parseInt(stats.one_star)
      }
    });
  } catch (error) {
    console.error('Error in getRatingStats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Validation middleware
export const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('review')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Review must not exceed 1000 characters')
];