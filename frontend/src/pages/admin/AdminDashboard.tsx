import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminProducts from '@/pages/AdminProducts';
import AdminOrders from '@/pages/AdminOrders';
import AdminUsers from '@/pages/AdminUsers';
import { adminAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/orders', label: 'Orders' },
    { path: '/admin/users', label: 'Users' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive(item.path, item.exact)
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/users" element={<AdminUsers />} />
      </Routes>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getDashboardStats();
      console.log('📊 Dashboard Stats Received:', data);
      setStats(data);
    } catch (error: any) {
      console.error('❌ Error fetching stats:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading statistics...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-gray-700 text-sm font-medium mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.totalProducts}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="text-gray-700 text-sm font-medium mb-2">Total Orders</h3>
          <p className="text-4xl font-bold text-green-600">{stats.totalOrders}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <h3 className="text-gray-700 text-sm font-medium mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-purple-600">{stats.totalUsers}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
          <h3 className="text-gray-700 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-orange-600">${stats.totalRevenue.toFixed(2)}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/admin/products">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">Manage Products</h3>
              <p className="text-gray-600 text-sm">Add, edit, or delete products from your inventory</p>
            </Card>
          </Link>
          <Link to="/admin/orders">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">View Orders</h3>
              <p className="text-gray-600 text-sm">Manage and update order statuses</p>
            </Card>
          </Link>
          <Link to="/admin/users">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">User Management</h3>
              <p className="text-gray-600 text-sm">View all users and their purchase history</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
