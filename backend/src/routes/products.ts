import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  productValidation,
} from '../controllers/productController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', authenticateToken, requireAdmin, productValidation, createProduct);
router.put('/:id', authenticateToken, requireAdmin, productValidation, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;
