import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">E-Commerce</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your trusted online destination for quality products at amazing prices. 
                We're committed to providing exceptional shopping experiences.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">support@ecommerce.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">123 Shopping St, Commerce City</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  My Orders
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Track Your Order
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Social */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div>
              <h5 className="text-foreground font-medium mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <a href="#" className="bg-muted p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-muted p-2 rounded-lg hover:bg-blue-400 hover:text-white transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-muted p-2 rounded-lg hover:bg-pink-600 hover:text-white transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-muted p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h6 className="text-foreground font-medium">Free Shipping</h6>
                <p className="text-sm text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h6 className="text-foreground font-medium">Secure Payment</h6>
                <p className="text-sm text-muted-foreground">100% secure transactions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h6 className="text-foreground font-medium">24/7 Support</h6>
                <p className="text-sm text-muted-foreground">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-muted border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © 2025 E-Commerce. All rights reserved. Made with{' '}
                <Heart className="inline h-4 w-4 text-red-500" />{' '}
                for amazing shopping experiences.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground text-sm">We accept:</span>
              <div className="flex space-x-2">
                <div className="bg-background border border-border px-3 py-1 rounded">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="bg-background border border-border px-2 py-1 rounded text-xs font-bold">
                  VISA
                </div>
                <div className="bg-background border border-border px-2 py-1 rounded text-xs font-bold">
                  MC
                </div>
                <div className="bg-background border border-border px-2 py-1 rounded text-xs font-bold">
                  AMEX
                </div>
                <div className="bg-background border border-border px-2 py-1 rounded text-xs font-bold">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
