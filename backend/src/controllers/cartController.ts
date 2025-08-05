import { Request, Response } from 'express';
import { pool } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get user's cart
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const result = await pool.query(`
    SELECT 
      c.*,
      p.name as product_name,
      p.price as product_price,
      p.images as product_images,
      p.stock_quantity
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1 AND p.status = 'active'
    ORDER BY c.created_at DESC
  `, [userId]);

  const cartItems = result.rows.map(row => ({
    id: row.id,
    product_id: row.product_id,
    quantity: row.quantity,
    created_at: row.created_at,
    product: {
      id: row.product_id,
      name: row.product_name,
      price: parseFloat(row.product_price),
      images: row.product_images || [],
      stock_quantity: row.stock_quantity
    }
  }));

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  res.json({
    items: cartItems,
    cartItems: cartItems, // Keep both for compatibility
    total: parseFloat(total.toFixed(2)),
    itemCount: cartItems.length
  });
});

// Add item to cart
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { product_id, quantity = 1 } = req.body;

  // Check if product exists and is active
  const productResult = await pool.query(
    'SELECT id, stock_quantity FROM products WHERE id = $1 AND status = $2',
    [product_id, 'active']
  );

  if (productResult.rows.length === 0) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const product = productResult.rows[0];

  if (quantity > product.stock_quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  // Check if item already exists in cart
  const existingItem = await pool.query(
    'SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2',
    [userId, product_id]
  );

  if (existingItem.rows.length > 0) {
    // Update existing item
    const newQuantity = existingItem.rows[0].quantity + quantity;
    
    if (newQuantity > product.stock_quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    await pool.query(
      'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newQuantity, existingItem.rows[0].id]
    );
  } else {
    // Add new item
    await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
      [userId, product_id, quantity]
    );
  }

  res.json({ message: 'Item added to cart successfully' });
});

// Update cart item quantity
export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  // Check if cart item belongs to user
  const cartResult = await pool.query(
    'SELECT c.*, p.stock_quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = $1 AND c.user_id = $2',
    [id, userId]
  );

  if (cartResult.rows.length === 0) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  const cartItem = cartResult.rows[0];

  if (quantity > cartItem.stock_quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  await pool.query(
    'UPDATE cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [quantity, id]
  );

  res.json({ message: 'Cart item updated successfully' });
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  res.json({ message: 'Item removed from cart successfully' });
});

// Clear entire cart
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

  res.json({ message: 'Cart cleared successfully' });
});
