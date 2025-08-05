import { Request, Response } from 'express';
import { pool } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Create new order
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { shipping_address } = req.body;

  // Start transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Get cart items
    const cartResult = await client.query(`
      SELECT 
        c.product_id,
        c.quantity,
        p.name,
        p.price,
        p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1 AND p.status = 'active'
    `, [userId]);

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cartResult.rows) {
      if (item.quantity > item.stock_quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}` 
        });
      }
    }

    // Calculate total
    const total_amount = cartResult.rows.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity), 
      0
    );

    // Create order
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, total_amount, shipping_address)
      VALUES ($1, $2, $3)
      RETURNING id, created_at
    `, [userId, total_amount, JSON.stringify(shipping_address)]);

    const orderId = orderResult.rows[0].id;

    // Create order items and update stock
    for (const item of cartResult.rows) {
      // Add order item
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.product_id, item.quantity, item.price]);

      // Update product stock
      await client.query(`
        UPDATE products 
        SET stock_quantity = stock_quantity - $1 
        WHERE id = $2
      `, [item.quantity, item.product_id]);
    }

    // Clear cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        total_amount,
        created_at: orderResult.rows[0].created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// Get user orders
export const getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const result = await pool.query(`
    SELECT 
      o.*,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name,
          'product_images', p.images
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3
  `, [userId, limit, offset]);

  const orders = result.rows.map(order => ({
    ...order,
    shipping_address: order.shipping_address || {},
    items: order.items.filter((item: any) => item.id !== null)
  }));

  res.json({ orders });
});

// Get single order
export const getOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const result = await pool.query(`
    SELECT 
      o.*,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name,
          'product_images', p.images
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = $1 AND o.user_id = $2
    GROUP BY o.id
  `, [id, userId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const order = {
    ...result.rows[0],
    shipping_address: result.rows[0].shipping_address || {},
    items: result.rows[0].items.filter((item: any) => item.id !== null)
  };

  res.json({ order });
});

// Get all orders (Admin only)
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;
  const offset = (page - 1) * limit;

  let whereClause = '';
  const queryParams: any[] = [limit, offset];

  if (status) {
    whereClause = 'WHERE o.status = $3';
    queryParams.push(status);
  }

  const result = await pool.query(`
    SELECT 
      o.*,
      u.name as customer_name,
      u.email as customer_email,
      COUNT(oi.id) as item_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    ${whereClause}
    GROUP BY o.id, u.name, u.email
    ORDER BY o.created_at DESC
    LIMIT $1 OFFSET $2
  `, queryParams);

  const orders = result.rows.map(order => ({
    ...order,
    shipping_address: order.shipping_address || {}
  }));

  res.json({ orders });
});

// Update order status (Admin only)
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
