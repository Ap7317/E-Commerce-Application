import { Router } from 'express';
import {
  addRating,
  getProductRatings,
  getUserRating,
  deleteRating,
  getRatingStats,
  ratingValidation
} from '../controllers/ratingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/products/:productId/ratings', getProductRatings);
router.get('/products/:productId/ratings/stats', getRatingStats);

// Protected routes (require authentication)
router.post('/products/:productId/ratings', authenticateToken, ratingValidation, addRating);
router.get('/products/:productId/ratings/user', authenticateToken, getUserRating);
router.delete('/products/:productId/ratings', authenticateToken, deleteRating);

export default router;
