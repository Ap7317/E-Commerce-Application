export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatar?: string;
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category_id?: number;
  images?: string[];
  featured: boolean;
  status: 'active' | 'inactive';
  average_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Rating {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface Cart {
  cartItems: CartItem[];
  total: number;
  itemCount: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_intent_id?: string;
  shipping_address?: ShippingAddress;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}
