import { Request, Response } from 'express';
import { pool } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

// Get dashboard stats
export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Get total users
  const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
  
  // Get total products
  const productsResult = await pool.query('SELECT COUNT(*) as total FROM products');
  
  // Get total orders
  const ordersResult = await pool.query('SELECT COUNT(*) as total FROM orders');
  
  // Get total revenue
  const revenueResult = await pool.query('SELECT SUM(total_amount) as total FROM orders WHERE status != \'cancelled\'');
  
  // Get recent orders
  const recentOrdersResult = await pool.query(`
    SELECT o.*, u.name as user_name 
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    ORDER BY o.created_at DESC 
    LIMIT 10
  `);
  
  // Get recent users
  const recentUsersResult = await pool.query(`
    SELECT id, name, email, created_at 
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 10
  `);

  res.json({
    totalUsers: parseInt(usersResult.rows[0].total),
    totalProducts: parseInt(productsResult.rows[0].total),
    totalOrders: parseInt(ordersResult.rows[0].total),
    totalRevenue: parseFloat(revenueResult.rows[0].total || '0'),
    recentOrders: recentOrdersResult.rows,
    recentUsers: recentUsersResult.rows
  });
});

// Get all users
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await pool.query(`
    SELECT 
      u.*,
      COUNT(o.id) as orders_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);

  res.json({ users: result.rows });
});

// Create user
export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, role = 'user' } = req.body;

  // Check if user already exists
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(`
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
  `, [name, email, hashedPassword, role]);

  res.status(201).json({
    message: 'User created successfully',
    user: result.rows[0]
  });
});

// Update user
export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  // Check if email is already taken by another user
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: 'Email is already taken by another user' });
  }

  const result = await pool.query(`
    UPDATE users 
    SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING id, name, email, role, created_at, updated_at
  `, [name, email, role, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    message: 'User updated successfully',
    user: result.rows[0]
  });
});

// Delete user
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Check if user has orders
  const ordersResult = await pool.query('SELECT COUNT(*) as count FROM orders WHERE user_id = $1', [id]);
  const orderCount = parseInt(ordersResult.rows[0].count);

  if (orderCount > 0) {
    return res.status(400).json({ 
      message: `Cannot delete user with ${orderCount} existing orders. Consider deactivating instead.` 
    });
  }

  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: 'User deleted successfully' });
});

// Get all products (admin view)
export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await pool.query(`
    SELECT 
      p.*,
      c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);

  const products = result.rows.map(row => ({
    ...row,
    price: parseFloat(row.price) || 0,
    images: row.images || []
  }));

  res.json({ products });
});

// Get all orders (admin view)
export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const offset = (page - 1) * limit;

  let whereClause = '';
  const queryParams: any[] = [limit, offset];
  let paramCount = 2;

  if (status && status !== 'all') {
    paramCount++;
    whereClause = `WHERE o.status = $${paramCount}`;
    queryParams.push(status);
  }

  const result = await pool.query(`
    SELECT 
      o.*,
      u.name as user_name,
      u.email as user_email,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name
        )
      ) as items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    ${whereClause}
    GROUP BY o.id, u.name, u.email
    ORDER BY o.created_at DESC
    LIMIT $1 OFFSET $2
  `, queryParams);

  const countResult = await pool.query(`
    SELECT COUNT(DISTINCT o.id) as total
    FROM orders o
    ${whereClause}
  `, status && status !== 'all' ? [status] : []);

  const orders = result.rows.map(order => ({
    ...order,
    total_amount: parseFloat(order.total_amount),
    shipping_address: order.shipping_address || {},
    items: order.items.filter((item: any) => item.id !== null)
  }));

  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / limit);

  res.json({
    orders,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;

  const result = await pool.query(`
    UPDATE orders 
    SET status = $1, payment_status = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `, [status, payment_status, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json({
    message: 'Order status updated successfully',
    order: result.rows[0]
  });
});
