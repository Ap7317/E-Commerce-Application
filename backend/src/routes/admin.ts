import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProducts,
  getOrders,
  updateOrderStatus
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Users management
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Products management (admin view)
router.get('/products', getProducts);

// Orders management
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;
