import { create } from 'zustand';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  stock_quantity: number;
  category_name: string;
}

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  setCart: (items: CartItem[], total: number, itemCount: number) => void;
  addItem: (item: CartItem) => void;
  updateItem: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  
  setCart: (items: CartItem[], total: number, itemCount: number) => {
    set({ items, total, itemCount });
  },
  
  addItem: (item: CartItem) => {
    const currentItems = get().items;
    const existingItem = currentItems.find(i => i.product_id === item.product_id);
    
    if (existingItem) {
      const updatedItems = currentItems.map(i =>
        i.product_id === item.product_id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
      const total = updatedItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
      set({ items: updatedItems, total, itemCount: updatedItems.length });
    } else {
      const updatedItems = [...currentItems, item];
      const total = updatedItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
      set({ items: updatedItems, total, itemCount: updatedItems.length });
    }
  },
  
  updateItem: (id: number, quantity: number) => {
    const currentItems = get().items;
    const updatedItems = currentItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    set({ items: updatedItems, total });
  },
  
  removeItem: (id: number) => {
    const currentItems = get().items;
    const updatedItems = currentItems.filter(item => item.id !== id);
    const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    set({ items: updatedItems, total, itemCount: updatedItems.length });
  },
  
  clearCart: () => {
    set({ items: [], total: 0, itemCount: 0 });
  },

  // API methods
  addToCart: async (productId: number, quantity: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId, quantity })
    });

    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }

    // Optionally refresh cart data here
  },

  updateCartItem: async (productId: number, quantity: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }
  },

  removeFromCart: async (productId: number) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to remove from cart');
    }
  },
}));
