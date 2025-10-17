// ==========================================
// FRONTEND PART 3 - Pages (Home, Shop, Product Details)
// ==========================================

// ========== src/pages/Home.jsx ==========
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const { data } = await api.get('/products/featured');
      setFeatured(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-screen flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Timeless Elegance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto"
          >
            Discover premium fashion crafted for the modern Indian wardrobe
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/shop">
              <Button>Explore Collection</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="font-display text-4xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {['Men', 'Women', 'Accessories', 'Footwear'].map((category, index) => (
              <Link
                key={category}
                to={`/shop?category=${category}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-square overflow-hidden bg-neutral-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-end justify-center p-6">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                      {category}
                    </h3>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">
              Featured Collection
            </h2>
            <p className="text-neutral-600">
              Handpicked pieces for your perfect wardrobe
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🚚
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-neutral-600 text-sm">On orders above ₹999</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔄
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p className="text-neutral-600 text-sm">7-day return policy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💳
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-neutral-600 text-sm">100% secure transactions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


// ========== src/pages/Shop.jsx ==========
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { CATEGORIES, SORT_OPTIONS } from '../utils/constants';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt'
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('sort', filters.sort);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt'
    });
  };

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-bold">
            {filters.category || 'All Products'}
          </h1>
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input-field w-auto"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden btn-outline py-2"
            >
              <FiFilter className="inline mr-2" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white p-6 border-r
              transform transition-transform lg:transform-none
              ${filterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setFilterOpen(false)}>
                <FiX size={24} />
              </button>
            </div>

            {/* Category */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">
                Category
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === ''}
                    onChange={() => handleFilterChange('category', '')}
                    className="mr-2"
                  />
                  All
                </label>
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat}
                      onChange={() => handleFilterChange('category', cat)}
                      className="mr-2"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 uppercase text-sm tracking-wider">
                Price Range
              </h3>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min Price (₹)"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Max Price (₹)"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <button onClick={clearFilters} className="btn-outline w-full">
              Clear All Filters
            </button>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-500 text-lg">No products found</p>
              </div>
            ) : (
              <>
                <p className="text-neutral-600 mb-6">
                  Showing {products.length} products
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {filterOpen && (
        <div
          onClick={() => setFilterOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
    </div>
  );
};

export default Shop;


// ========== src/pages/ProductPage.jsx ==========
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setSelectedSize(data.sizes[0]?.size || '');
      setSelectedColor(data.colors[0]?.name || '');
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div>Product not found</div>;

  const discount = calculateDiscount(product.price, product.discountPrice);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[3/4] bg-neutral-100 mb-4"
            >
              <img
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square border-2 ${
                    selectedImage === index ? 'border-neutral-900' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
              {product.category}
            </p>
            <h1 className="font-display text-4xl font-bold mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold">
                    {formatPrice(product.discountPrice)}
                  </span>
                  <span className="text-xl text-neutral-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 text-sm font-semibold">
                    {discount}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-neutral-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block font-semibold mb-3 uppercase text-sm tracking-wider">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      disabled={s.stock === 0}
                      className={`
                        px-6 py-2 border-2 font-medium transition-all
                        ${selectedSize === s.size
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 hover:border-neutral-900'
                        }
                        ${s.stock === 0 && 'opacity-30 cursor-not-allowed'}
                      `}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block font-semibold mb-3 uppercase text-sm tracking-wider">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`
                        w-10 h-10 rounded-full border-2
                        ${selectedColor === c.name ? 'border-neutral-900 ring-2 ring-offset-2 ring-neutral-900' : 'border-neutral-300'}
                      `}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block font-semibold mb-3 uppercase text-sm tracking-wider">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-neutral-300 hover:border-neutral-900"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-neutral-300 hover:border-neutral-900"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mb-8">
              <Button onClick={handleAddToCart} className="flex-1">
                <FiShoppingBag className="inline mr-2" />
                Add to Cart
              </Button>
              <button
                onClick={handleWishlist}
                className="btn-outline"
              >
                <FiHeart className={inWishlist ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Additional Info */}
            {product.material && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Material</h3>
                <p className="text-neutral-600">{product.material}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
