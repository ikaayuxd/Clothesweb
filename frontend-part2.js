// ==========================================
// FRONTEND PART 2 - Components (Navbar, Footer, Product Card)
// ==========================================

// ========== src/components/common/Navbar.jsx ==========
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const categories = ['Men', 'Women', 'Accessories', 'Footwear'];

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white text-center py-2 text-xs uppercase tracking-wider">
        Free Shipping on Orders Above ₹999 | COD Available
      </div>

      {/* Main Navbar */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-2xl"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold tracking-tight">
            LUXE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/shop?category=${category}`}
                className="text-sm uppercase tracking-wider hover:text-neutral-600 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-xl hover:text-neutral-600 transition-colors"
            >
              <FiSearch />
            </button>

            <Link to="/wishlist" className="relative text-xl hover:text-neutral-600 transition-colors">
              <FiHeart />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-xl hover:text-neutral-600 transition-colors">
              <FiShoppingBag />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="text-xl hover:text-neutral-600 transition-colors">
                  <FiUser />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-neutral-50">
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-neutral-50">
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-neutral-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-xl hover:text-neutral-600 transition-colors">
                <FiUser />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neutral-200 overflow-hidden"
          >
            <div className="container-custom py-4">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 bg-white z-50 lg:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-display text-2xl font-bold">LUXE</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-2xl">
                <FiX />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/shop?category=${category}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium"
                >
                  {category}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;


// ========== src/components/common/Footer.jsx ==========
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">LUXE</h3>
            <p className="text-neutral-400 text-sm">
              Premium Indian fashion for the modern wardrobe. Curated collections for every occasion.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-xl hover:text-neutral-400 transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="text-xl hover:text-neutral-400 transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="text-xl hover:text-neutral-400 transition-colors">
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><Link to="/shop?category=Men" className="hover:text-white">Men</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-white">Women</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-white">Accessories</Link></li>
              <li><Link to="/shop?category=Footwear" className="hover:text-white">Footwear</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Help</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><Link to="/track-order" className="hover:text-white">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns & Exchange</Link></li>
              <li><Link to="/shipping" className="hover:text-white">Shipping Info</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-neutral-400 text-sm mb-4">
              Subscribe for exclusive offers and updates
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-white text-sm"
              />
              <button className="bg-white text-neutral-900 px-4 py-2 font-semibold text-sm hover:bg-neutral-100">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400 text-sm">
          <p>&copy; 2025 LUXE Fashion. All rights reserved. Made in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


// ========== src/components/products/ProductCard.jsx ==========
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const inWishlist = isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.discountPrice);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = product.sizes[0]?.size;
    const defaultColor = product.colors[0]?.name;
    addToCart(product, defaultSize, defaultColor, 1);
  };

  return (
    <Link to={`/product/${product._id}`}>
      <motion.div
        className="product-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Image */}
        <div className="product-card-image">
          <img
            src={product.images[0]?.url}
            alt={product.name}
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-semibold uppercase">
              {discount}% OFF
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-neutral-100"
            >
              <FiHeart className={inWishlist ? 'fill-current text-red-500' : ''} />
            </button>
            <button
              onClick={handleQuickAdd}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-neutral-100"
            >
              <FiShoppingBag />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-neutral-900 mb-2 line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2">
            {product.discountPrice ? (
              <>
                <span className="font-semibold text-lg">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-sm text-neutral-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-lg">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating?.count > 0 && (
            <div className="flex items-center mt-2 text-sm text-neutral-600">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{product.rating.average.toFixed(1)}</span>
              <span className="ml-1 text-neutral-400">({product.rating.count})</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;


// ========== src/components/common/Button.jsx ==========
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false,
  disabled = false,
  ...props 
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-outline';

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseClass} ${className} ${(loading || disabled) && 'opacity-50 cursor-not-allowed'}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;


// ========== src/components/common/Loader.jsx ==========
const Loader = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-neutral-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-neutral-900 rounded-full border-t-transparent animate-spin" />
      </div>
    </div>
  );
};

export default Loader;
