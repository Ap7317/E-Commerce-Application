import { Request, Response } from 'express';
import { pool } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

// Get dashboard statistics
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const [productsResult, ordersResult, usersResult, revenueResult] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM products'),
    pool.query('SELECT COUNT(*) FROM orders'),
    pool.query("SELECT COUNT(*) FROM users"),
    pool.query("SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE status != 'cancelled'")
  ]);

  console.log('📊 Admin Stats:', {
    products: productsResult.rows[0].count,
    orders: ordersResult.rows[0].count,
    users: usersResult.rows[0].count,
    revenue: revenueResult.rows[0].revenue
  });

  res.json({
    totalProducts: parseInt(productsResult.rows[0].count),
    totalOrders: parseInt(ordersResult.rows[0].count),
    totalUsers: parseInt(usersResult.rows[0].count),
    totalRevenue: parseFloat(revenueResult.rows[0].revenue || 0)
  });
});

// Get all users with basic details
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT 
      id, 
      name, 
      email, 
      role,
      created_at,
      (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as total_orders,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = users.id AND status != 'cancelled') as total_spent
    FROM users
    ORDER BY created_at DESC
  `);

  res.json({ users: result.rows });
});

// Get all orders with details
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT 
      o.*,
      u.name as user_name,
      u.email as user_email,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_name', p.name,
          'quantity', oi.quantity,
          'price', oi.price
        )
      ) as items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id, u.name, u.email
    ORDER BY o.created_at DESC
  `);

  res.json({ orders: result.rows });
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const result = await pool.query(
    'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json({ message: 'Order status updated', order: result.rows[0] });
});
