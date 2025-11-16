import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getProductRatings,
  createRating,
  getUserRating,
  deleteRating
} from '../controllers/ratingController';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductRatings);

// Protected routes
router.post('/', authenticateToken, createRating);
router.get('/user/:productId', authenticateToken, getUserRating);
router.delete('/:id', authenticateToken, deleteRating);

export default router;
