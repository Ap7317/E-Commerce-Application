import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get all categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
    GROUP BY c.id
    ORDER BY c.name
  `);

  res.json({ categories: result.rows });
});

// Get single category
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json({ category: result.rows[0] });
});

// Create category (Admin only)
export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, image } = req.body;

  const result = await pool.query(
    'INSERT INTO categories (name, description, image) VALUES ($1, $2, $3) RETURNING *',
    [name, description, image]
  );

  res.status(201).json({
    message: 'Category created successfully',
    category: result.rows[0]
  });
});

// Update category (Admin only)
export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  const result = await pool.query(
    'UPDATE categories SET name = $1, description = $2, image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
    [name, description, image, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json({
    message: 'Category updated successfully',
    category: result.rows[0]
  });
});

// Delete category (Admin only)
export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json({ message: 'Category deleted successfully' });
});

// Validation rules
export const categoryValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Category name must be at least 2 characters'),
];
