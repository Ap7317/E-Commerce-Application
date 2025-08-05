import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';
import { toast } from '../lib/toast';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    stock_quantity: number;
    category_name: string;
  };
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { updateCartItem, removeFromCart } = useCartStore();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [user, navigate]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems || []);
      } else {
        toast.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const item = cartItems.find(item => item.product_id === productId);
    if (!item) return;
    
    if (newQuantity > item.product.stock_quantity) {
      toast.error(`Only ${item.product.stock_quantity} items available in stock`);
      return;
    }

    try {
      setUpdating(productId);
      await updateCartItem(productId, newQuantity);
      
      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.product_id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeFromCart(productId);
      setCartItems(prev => prev.filter(item => item.product_id !== productId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const applyPromoCode = () => {
    const validCodes = {
      'SAVE10': 0.1,
      'SAVE20': 0.2,
      'WELCOME': 0.15
    };

    if (validCodes[promoCode as keyof typeof validCodes]) {
      setDiscount(validCodes[promoCode as keyof typeof validCodes]);
      toast.success(`Promo code applied! ${(validCodes[promoCode as keyof typeof validCodes] * 100)}% discount`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Navigate to checkout page (we'll create this next)
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="animate-pulse">
            <Card>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-6">
            <ShoppingBag className="h-24 w-24 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/products')} className="w-full max-w-sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full max-w-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/products')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.product.images[0] || '/api/placeholder/100/100'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 
                          className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                          onClick={() => navigate(`/products/${item.product.id}`)}
                        >
                          {item.product.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {item.product.category_name}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updating === item.product_id}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (newQuantity > 0) {
                              handleUpdateQuantity(item.product_id, newQuantity);
                            }
                          }}
                          className="w-16 h-8 text-center"
                          min="1"
                          max={item.product.stock_quantity}
                          disabled={updating === item.product_id}
                        />
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity || updating === item.product_id}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.product.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.product.stock_quantity <= 5 && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="text-xs">
                          Only {item.product.stock_quantity} left in stock
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Promo Code */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Promo Code</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                />
                <Button onClick={applyPromoCode} variant="outline">
                  Apply
                </Button>
              </div>
              {discount > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ {(discount * 100)}% discount applied
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({(discount * 100)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 100 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Truck className="h-4 w-4" />
                    Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-6 pt-0">
              <Button onClick={handleCheckout} className="w-full" size="lg">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>

          {/* Trust Signals */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Secure SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
