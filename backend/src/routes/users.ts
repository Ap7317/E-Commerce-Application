import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Placeholder for user management routes
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: 'User management routes coming soon' });
});

export default router;
