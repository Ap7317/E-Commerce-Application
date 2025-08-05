import axios, { AxiosResponse } from 'axios';
import { User, Product, Category, Cart, Order, PaginationInfo } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, role: string = 'customer'): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ products: Product[]; pagination: PaginationInfo }> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id: number): Promise<{ product: Product }> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async (limit?: number): Promise<{ products: Product[] }> => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  createProduct: async (data: Partial<Product>): Promise<{ product: Product }> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: Partial<Product>): Promise<{ product: Product }> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// Categories API
export const categoriesAPI = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategory: async (id: number): Promise<{ category: Category }> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: Partial<Category>): Promise<{ category: Category }> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<Category>): Promise<{ category: Category }> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Cart API
export const cartAPI = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (product_id: number, quantity: number = 1): Promise<void> => {
    await api.post('/cart/add', { product_id, quantity });
  },

  updateCartItem: async (id: number, quantity: number): Promise<void> => {
    await api.put(`/cart/${id}`, { quantity });
  },

  removeFromCart: async (id: number): Promise<void> => {
    await api.delete(`/cart/${id}`);
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

// Orders API
export const ordersAPI = {
  createOrder: async (shipping_address: any): Promise<{ order: Order }> => {
    const response = await api.post('/orders', { shipping_address });
    return response.data;
  },

  getUserOrders: async (page?: number, limit?: number): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orders/my-orders', { params: { page, limit } });
    return response.data;
  },

  getOrder: async (id: number): Promise<{ order: Order }> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getAllOrders: async (page?: number, limit?: number, status?: string): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orders', { params: { page, limit, status } });
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string, payment_status?: string): Promise<{ order: Order }> => {
    const response = await api.put(`/orders/${id}/status`, { status, payment_status });
    return response.data;
  },
};

export default api;
