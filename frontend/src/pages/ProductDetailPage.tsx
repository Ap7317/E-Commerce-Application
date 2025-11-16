import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import StarRating from '../components/StarRating';
import ProductRating from '../components/ProductRating';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { toast } from '../lib/toast';
import { formatPrice } from '../lib/utils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  category_name: string;
  images: string[];
  featured: boolean;
  created_at: string;
}

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Generate random rating for demo purposes
  const generateRating = () => (Math.random() * 2 + 3).toFixed(1); // Rating between 3.0 - 5.0
  const [productRating] = useState(generateRating());

  useEffect(() => {
    if (id) {
      fetchProduct();
      generateDemoReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        // Convert string values to numbers for proper handling
        const processedProduct = {
          ...data.product,
          price: parseFloat(data.product.price) || 0,
          average_rating: parseFloat(data.product.average_rating) || 0,
          review_count: parseInt(data.product.review_count) || 0,
          stock_quantity: parseInt(data.product.stock_quantity) || 0
        };
        setProduct(processedProduct);
      } else {
        toast.error('Failed to fetch product details');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error loading product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const generateDemoReviews = () => {
    const demoReviews: Review[] = [
      {
        id: 1,
        user_name: 'John D.',
        rating: 5,
        comment: 'Excellent product! Highly recommended. Great quality and fast delivery.',
        created_at: '2024-07-15'
      },
      {
        id: 2,
        user_name: 'Sarah M.',
        rating: 4,
        comment: 'Good value for money. Works as expected.',
        created_at: '2024-07-10'
      },
      {
        id: 3,
        user_name: 'Mike R.',
        rating: 5,
        comment: 'Amazing! Will definitely buy again.',
        created_at: '2024-07-05'
      }
    ];
    setReviews(demoReviews);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (product.stock_quantity === 0) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      // Add to cart first, then redirect to checkout
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart!`);
      // Redirect to checkout for immediate purchase
      navigate('/checkout');
    } catch (error) {
      console.error('Error in buy now:', error);
      toast.error('Failed to process purchase');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Button onClick={() => navigate('/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-blue-600">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate('/products')} className="hover:text-blue-600">
          Products
        </button>
        <span>/</span>
        <button onClick={() => navigate(`/categories/${product.category_id}`)} className="hover:text-blue-600">
          {product.category_name}
        </button>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.images?.[selectedImageIndex] || '/api/placeholder/500/500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category_name}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {renderStars(averageRating)}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stock_quantity > 0 && (
                <span className="text-gray-500">({product.stock_quantity} available)</span>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                  max={product.stock_quantity}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                className="w-full"
                size="lg"
              >
                Buy Now - {formatPrice(product.price * quantity)}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" className="flex-1">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-6 border-t">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="h-5 w-5" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="h-5 w-5" />
              <span>2-year warranty included</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="h-5 w-5" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Rating Section */}
      <div className="mt-12">
        <ProductRating productId={product.id} />
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Related Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              Related products will be shown here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
