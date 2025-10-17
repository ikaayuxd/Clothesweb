// ==========================================
// FRONTEND PART 4 - Cart, Checkout & Auth
// ==========================================

// ========== src/pages/Cart.jsx ==========
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import Button from '../components/common/Button';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <FiShoppingBag className="mx-auto text-6xl text-neutral-300 mb-4" />
          <h2 className="font-display text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-neutral-600 mb-8">Add some products to get started</p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shipping = getCartTotal() > 999 ? 0 : 99;
  const total = getCartTotal() + shipping;

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="font-display text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={`${item._id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-200 p-4 flex gap-4"
              >
                {/* Image */}
                <Link to={`/product/${item._id}`} className="w-24 h-32 bg-neutral-100 flex-shrink-0">
                  <img
                    src={item.images[0]?.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1">
                  <Link to={`/product/${item._id}`}>
                    <h3 className="font-semibold mb-1 hover:text-neutral-600">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-neutral-600 mb-2">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="font-semibold">
                    {formatPrice(item.discountPrice || item.price)}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center space-x-2 mt-4">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.size, item.color, Math.max(1, item.quantity - 1))
                      }
                      className="w-8 h-8 border border-neutral-300 hover:border-neutral-900"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.size, item.color, item.quantity + 1)
                      }
                      className="w-8 h-8 border border-neutral-300 hover:border-neutral-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item._id, item.size, item.color)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 p-6 sticky top-24">
              <h2 className="font-semibold text-xl mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-neutral-500">
                    Add {formatPrice(999 - getCartTotal())} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-neutral-300 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full mb-4">Proceed to Checkout</Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


// ========== src/pages/Checkout.jsx ==========
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { INDIAN_STATES } from '../utils/constants';
import Button from '../components/common/Button';
import api from '../utils/api';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'card'
  });
  
  const [loading, setLoading] = useState(false);

  const shipping = getCartTotal() > 999 ? 0 : 99;
  const total = getCartTotal() + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images[0]?.url,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        subtotal: getCartTotal(),
        shipping,
        total
      };

      const { data } = await api.post('/orders', orderData);
      
      // Clear cart and redirect
      clearCart();
      alert('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="font-semibold text-xl mb-4">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      pattern="[6-9][0-9]{9}"
                      required
                      className="input-field"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="font-semibold text-xl mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <label className="block text-sm font-medium mb-2">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      pattern="[0-9]{6}"
                      required
                      className="input-field"
                      placeholder="6-digit PIN code"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-neutral-200 p-6">
                <h2 className="font-semibold text-xl mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {['card', 'upi', 'netbanking', 'cod'].map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <span className="capitalize">{method === 'cod' ? 'Cash on Delivery' : method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 p-6 sticky top-24">
              <h2 className="font-semibold text-xl mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="w-16 h-20 bg-neutral-200">
                      <img src={item.images[0]?.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-neutral-600">
                        {item.size} | {item.color} | Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatPrice((item.discountPrice || item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-neutral-300 pt-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                loading={loading}
                className="w-full"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


// ========== src/components/auth/Login.jsx ==========
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container-custom max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200 p-8"
        >
          <h1 className="font-display text-3xl font-bold text-center mb-8">Login</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </form>

          <p className="text-center mt-6 text-neutral-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;


// ========== src/components/auth/Register.jsx ==========
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container-custom max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200 p-8"
        >
          <h1 className="font-display text-3xl font-bold text-center mb-8">Register</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="input-field"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Register
            </Button>
          </form>

          <p className="text-center mt-6 text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
