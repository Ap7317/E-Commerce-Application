import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { itemCount } = useCartStore();

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            E-Commerce
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ModeToggle />
            
            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm">
                Cart ({itemCount})
              </Button>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link to="/orders">
                  <Button variant="ghost" size="sm">
                    My Orders
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                  Hello, {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
