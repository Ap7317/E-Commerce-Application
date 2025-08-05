import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryValidation,
} from '../controllers/categoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', authenticateToken, requireAdmin, categoryValidation, createCategory);
router.put('/:id', authenticateToken, requireAdmin, categoryValidation, updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

export default router;
