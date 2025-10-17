// ==========================================
// FRONTEND PART 1 - Core Setup & Context
// ==========================================

// ========== src/main.jsx ==========
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


// ========== src/App.jsx ==========
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;


// ========== src/styles/index.css ==========
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-body text-neutral-900 bg-neutral-50;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

@layer components {
  /* Premium Button */
  .btn-primary {
    @apply bg-neutral-900 text-white px-8 py-3 rounded-none font-medium 
           uppercase tracking-wider text-sm transition-all duration-300
           hover:bg-neutral-800 hover:shadow-lg transform hover:-translate-y-0.5;
  }

  .btn-outline {
    @apply border-2 border-neutral-900 text-neutral-900 px-8 py-3 rounded-none 
           font-medium uppercase tracking-wider text-sm transition-all duration-300
           hover:bg-neutral-900 hover:text-white;
  }

  /* Premium Card */
  .product-card {
    @apply bg-white overflow-hidden group cursor-pointer;
  }

  .product-card-image {
    @apply relative overflow-hidden aspect-[3/4];
  }

  .product-card-image img {
    @apply w-full h-full object-cover transition-transform duration-700 
           group-hover:scale-110;
  }

  /* Input Fields */
  .input-field {
    @apply w-full px-4 py-3 border border-neutral-300 rounded-none
           focus:outline-none focus:border-neutral-900 transition-colors;
  }

  /* Container */
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  /* Section Spacing */
  .section-padding {
    @apply py-16 md:py-24;
  }
}

@layer utilities {
  /* Smooth Scroll */
  .smooth-scroll {
    scroll-behavior: smooth;
  }

  /* Hide Scrollbar */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Text Shadow for Hero */
  .text-shadow {
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  }
}


// ========== src/utils/api.js ==========
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


// ========== src/utils/constants.js ==========
export const CATEGORIES = ['Men', 'Women', 'Accessories', 'Footwear'];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating.average', label: 'Highest Rated' }
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Puducherry'
];


// ========== src/utils/helpers.js ==========
// Format price in INR
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (price, discountPrice) => {
  if (!discountPrice) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Generate slug
export const generateSlug = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
};


// ========== src/context/AuthContext.jsx ==========
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// ========== src/context/CartContext.jsx ==========
import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, color, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id && item.size === size && item.color === color
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, size, color, quantity }];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prev) => prev.filter(
      (item) => !(item._id === productId && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (productId, size, color, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


// ========== src/context/WishlistContext.jsx ==========
import { createContext, useState, useEffect, useContext } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
