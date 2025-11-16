import { Request, Response } from 'express';
import { pool } from '../config/database';

// Get ratings for a product
export const getProductRatings = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `SELECT r.*, u.name as user_name 
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};

// Create a new rating
export const createRating = async (req: Request, res: Response) => {
  try {
    const { product_id, rating, review } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!product_id || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user already rated this product
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    if (existingRating.rows.length > 0) {
      // Update existing rating
      const result = await pool.query(
        `UPDATE ratings 
         SET rating = $1, review = $2, created_at = NOW()
         WHERE user_id = $3 AND product_id = $4
         RETURNING *`,
        [rating, review || null, userId, product_id]
      );

      return res.json({ 
        message: 'Rating updated successfully', 
        rating: result.rows[0] 
      });
    }

    // Create new rating
    const result = await pool.query(
      `INSERT INTO ratings (user_id, product_id, rating, review)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, product_id, rating, review || null]
    );

    res.status(201).json({ 
      message: 'Rating created successfully', 
      rating: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ message: 'Error creating rating' });
  }
};

// Get user's rating for a product
export const getUserRating = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const result = await pool.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ message: 'Error fetching user rating' });
  }
};

// Delete a rating
export const deleteRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if rating belongs to user
    const rating = await pool.query(
      'SELECT * FROM ratings WHERE id = $1',
      [id]
    );

    if (rating.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (rating.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this rating' });
    }

    await pool.query('DELETE FROM ratings WHERE id = $1', [id]);

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Error deleting rating' });
  }
};
