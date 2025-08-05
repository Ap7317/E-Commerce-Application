import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get all products with pagination and filtering
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const search = req.query.search as string;
  const category = req.query.category as string;
  const featured = req.query.featured as string;
  const sortBy = req.query.sortBy as string || 'created_at';
  const sortOrder = req.query.sortOrder as string || 'DESC';

  const offset = (page - 1) * limit;

  // Build WHERE clause
  let whereClause = "WHERE p.status = 'active'";
  const queryParams: any[] = [];
  let paramCount = 0;

  if (search) {
    paramCount++;
    whereClause += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
    queryParams.push(`%${search}%`);
  }

  if (category) {
    paramCount++;
    whereClause += ` AND p.category_id = $${paramCount}`;
    queryParams.push(category);
  }

  if (featured === 'true') {
    whereClause += ` AND p.featured = true`;
  }

  // Add pagination parameters
  queryParams.push(limit, offset);
  const limitParam = paramCount + 1;
  const offsetParam = paramCount + 2;

  const query = `
    SELECT 
      p.*,
      c.name as category_name,
      c.description as category_description,
      p.average_rating,
      p.review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY p.${sortBy} ${sortOrder}
    LIMIT $${limitParam} OFFSET $${offsetParam}
  `;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM products p
    ${whereClause}
  `;

  const [productsResult, countResult] = await Promise.all([
    pool.query(query, queryParams),
    pool.query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
  ]);

  const products = productsResult.rows.map(row => ({
    ...row,
    images: row.images || [],
    category: row.category_id ? {
      id: row.category_id,
      name: row.category_name,
      description: row.category_description
    } : null
  }));

  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / limit);

  res.json({
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// Get single product by ID
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(`
    SELECT 
      p.*,
      c.name as category_name,
      c.description as category_description
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1 AND p.status = 'active'
  `, [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const product = {
    ...result.rows[0],
    images: result.rows[0].images || [],
    category: result.rows[0].category_id ? {
      id: result.rows[0].category_id,
      name: result.rows[0].category_name,
      description: result.rows[0].category_description
    } : null
  };

  res.json({ product });
});

// Create new product (Admin only)
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    price,
    stock_quantity,
    category_id,
    images,
    featured = false
  } = req.body;

  const result = await pool.query(`
    INSERT INTO products (name, description, price, stock_quantity, category_id, images, featured)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `, [name, description, price, stock_quantity, category_id, JSON.stringify(images || []), featured]);

  res.status(201).json({
    message: 'Product created successfully',
    product: {
      ...result.rows[0],
      images: result.rows[0].images || []
    }
  });
});

// Update product (Admin only)
export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    stock_quantity,
    category_id,
    images,
    featured,
    status
  } = req.body;

  const result = await pool.query(`
    UPDATE products 
    SET name = $1, description = $2, price = $3, stock_quantity = $4, 
        category_id = $5, images = $6, featured = $7, status = $8, updated_at = CURRENT_TIMESTAMP
    WHERE id = $9
    RETURNING *
  `, [name, description, price, stock_quantity, category_id, 
      JSON.stringify(images || []), featured, status, id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({
    message: 'Product updated successfully',
    product: {
      ...result.rows[0],
      images: result.rows[0].images || []
    }
  });
});

// Delete product (Admin only)
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({ message: 'Product deleted successfully' });
});

// Get featured products
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;

  const result = await pool.query(`
    SELECT 
      p.*,
      c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.featured = true AND p.status = 'active'
    ORDER BY p.created_at DESC
    LIMIT $1
  `, [limit]);

  const products = result.rows.map(row => ({
    ...row,
    images: row.images || [],
    category: row.category_id ? {
      id: row.category_id,
      name: row.category_name
    } : null
  }));

  res.json({ products });
});

// Validation rules
export const productValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
];
