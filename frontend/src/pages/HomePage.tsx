import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  average_rating: number;
  review_count: number;
  stock_quantity: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsResponse = await fetch('http://localhost:5000/api/products/featured?limit=8');
        const productsData = await productsResponse.json();
        if (productsResponse.ok) {
          // Handle both array and object responses
          const productsArray = Array.isArray(productsData) ? productsData : productsData.products || [];
          setFeaturedProducts(productsArray);
        }

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5000/api/categories');
        const categoriesData = await categoriesResponse.json();
        if (categoriesResponse.ok) {
          // Handle both array and object responses
          const categoriesArray = Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || [];
          setCategories(categoriesArray);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Our Store
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop now and enjoy free shipping on orders over $100.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.isArray(categories) && categories.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
                onClick={() => navigate(`/products?category=${category.id}`)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={category.image || '/api/placeholder/200/150'}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.isArray(featuredProducts) && featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.images?.[0] || '/api/placeholder/300/300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(Number(product.average_rating) || 0)}
                      <span className="text-xs text-gray-500 ml-1">
                        {Number(product.average_rating)?.toFixed(1) || '0.0'} ({product.review_count || 0})
                      </span>
                    </div>
                    
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </p>
                    
                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <p className="text-sm text-orange-600 mt-1">
                        Only {product.stock_quantity} left!
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
};

export default HomePage;
