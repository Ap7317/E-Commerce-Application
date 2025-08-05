import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from '../lib/toast';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  category_id: string;
  images: string[];
  featured: boolean;
  status: string;
}

interface Category {
  id: number;
  name: string;
}

const AdminProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user } = useAuthStore();
  const isEdit = !!productId;
  
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    images: [],
    featured: false,
    status: 'active'
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [user, navigate, isEdit, productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`);
      const data = await response.json();
      
      if (response.ok) {
        const productData = data.product;
        setProduct({
          id: productData.id,
          name: productData.name,
          description: productData.description,
          price: productData.price.toString(),
          stock_quantity: productData.stock_quantity.toString(),
          category_id: productData.category_id.toString(),
          images: productData.images || [],
          featured: productData.featured,
          status: productData.status
        });
      } else {
        toast.error('Failed to load product');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error loading product');
      navigate('/admin/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEdit 
        ? `http://localhost:5000/api/products/${productId}`
        : 'http://localhost:5000/api/products';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          stock_quantity: parseInt(product.stock_quantity),
          category_id: parseInt(product.category_id),
          images: product.images,
          featured: product.featured,
          status: product.status
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/admin/products');
      } else {
        toast.error(data.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProduct(prev => ({ ...prev, [name]: checked }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/products')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Product' : 'Create New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category_id">Category *</Label>
                <Select 
                  value={product.category_id} 
                  onValueChange={(value) => setProduct(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={product.stock_quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={product.status} 
                  onValueChange={(value) => setProduct(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={product.featured}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div>
              <Label>Product Images</Label>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter image URL"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                  />
                  <Button type="button" onClick={addImage}>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>
                
                {product.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductForm;
