# Premium Fashion Store - Sample Data & Deployment Guide

## 📊 Sample Products Data (MongoDB)

Here's sample data to populate your store. Insert this into MongoDB:

```javascript
// Sample Products for MongoDB
const sampleProducts = [
  {
    name: "Classic Cotton Kurta",
    description: "Premium cotton kurta with intricate embroidery. Perfect for festive occasions and casual wear. Breathable fabric ensures comfort all day long.",
    price: 2499,
    discountPrice: 1999,
    images: [
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a", alt: "Cotton Kurta" }
    ],
    category: "Men",
    subcategory: "Kurtas",
    sizes: [
      { size: "M", stock: 10 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 8 }
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", stock: 20 },
      { name: "Navy", hex: "#1B365D", stock: 13 }
    ],
    material: "100% Cotton",
    careInstructions: "Machine wash cold. Do not bleach. Tumble dry low.",
    featured: true,
    rating: { average: 4.5, count: 28 }
  },
  {
    name: "Silk Embroidered Saree",
    description: "Exquisite pure silk saree with traditional zari work. Handcrafted by skilled artisans. A timeless piece for weddings and celebrations.",
    price: 8999,
    discountPrice: 6999,
    images: [
      { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c", alt: "Silk Saree" }
    ],
    category: "Women",
    subcategory: "Ethnic Wear",
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 }
    ],
    colors: [
      { name: "Maroon", hex: "#800000", stock: 7 },
      { name: "Gold", hex: "#FFD700", stock: 6 }
    ],
    material: "Pure Silk with Zari Work",
    careInstructions: "Dry clean only",
    featured: true,
    rating: { average: 4.8, count: 45 }
  },
  {
    name: "Premium Denim Jacket",
    description: "Contemporary denim jacket with a relaxed fit. Versatile piece that pairs well with both casual and semi-formal outfits.",
    price: 3999,
    discountPrice: 2999,
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5", alt: "Denim Jacket" }
    ],
    category: "Men",
    subcategory: "Jackets",
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 12 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 5 }
    ],
    colors: [
      { name: "Blue", hex: "#4169E1", stock: 18 },
      { name: "Black", hex: "#000000", stock: 15 }
    ],
    material: "100% Cotton Denim",
    careInstructions: "Machine wash cold with like colors",
    featured: true,
    rating: { average: 4.6, count: 32 }
  },
  {
    name: "Designer Leather Handbag",
    description: "Elegant leather handbag with gold-tone hardware. Spacious interior with multiple compartments. A statement accessory for every outfit.",
    price: 4999,
    discountPrice: 3999,
    images: [
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3", alt: "Leather Handbag" }
    ],
    category: "Accessories",
    subcategory: "Bags",
    sizes: [
      { size: "One Size", stock: 20 }
    ],
    colors: [
      { name: "Tan", hex: "#D2B48C", stock: 12 },
      { name: "Black", hex: "#000000", stock: 8 }
    ],
    material: "Genuine Leather",
    careInstructions: "Wipe clean with damp cloth",
    featured: true,
    rating: { average: 4.7, count: 56 }
  },
  {
    name: "Athletic Running Shoes",
    description: "High-performance running shoes with advanced cushioning technology. Lightweight design for maximum comfort during workouts.",
    price: 5499,
    discountPrice: 4299,
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", alt: "Running Shoes" }
    ],
    category: "Footwear",
    subcategory: "Sneakers",
    sizes: [
      { size: "7", stock: 5 },
      { size: "8", stock: 8 },
      { size: "9", stock: 10 },
      { size: "10", stock: 7 }
    ],
    colors: [
      { name: "White", hex: "#FFFFFF", stock: 15 },
      { name: "Grey", hex: "#808080", stock: 15 }
    ],
    material: "Synthetic mesh and rubber sole",
    careInstructions: "Wipe with damp cloth. Air dry only.",
    featured: true,
    rating: { average: 4.4, count: 89 }
  },
  {
    name: "Floral Print Summer Dress",
    description: "Lightweight summer dress with vibrant floral print. Comfortable fit perfect for warm weather and outdoor gatherings.",
    price: 2799,
    discountPrice: 1999,
    images: [
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8", alt: "Summer Dress" }
    ],
    category: "Women",
    subcategory: "Dresses",
    sizes: [
      { size: "XS", stock: 5 },
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 8 }
    ],
    colors: [
      { name: "Floral", hex: "#FF69B4", stock: 38 }
    ],
    material: "100% Cotton",
    careInstructions: "Machine wash cold. Hang to dry.",
    featured: false,
    rating: { average: 4.5, count: 67 }
  }
];
```

## 🚀 Deployment Guide

### Option 1: Deploy to Render (Backend) + Vercel (Frontend)

#### Backend on Render:
1. Push your server code to GitHub
2. Go to [Render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Random secure string
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `CLIENT_URL`: Your frontend URL

#### Frontend on Vercel:
1. Push your client code to GitHub
2. Go to [Vercel.com](https://vercel.com) and import project
3. Set framework preset: Vite
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL
   - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key

### Option 2: Deploy to Railway (Fullstack)

1. Push entire project to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Railway will auto-detect both services
5. Add environment variables for both services
6. Deploy!

### MongoDB Atlas Setup:

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Replace `<password>` with your password

### Stripe Setup (INR):

1. Create account at [Stripe.com](https://stripe.com)
2. Go to Dashboard → Settings → Account details
3. Set business country to India
4. Enable INR currency
5. Get API keys from Developers section
6. Use test mode keys for development:
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

## 🧪 Testing Locally

### 1. Setup MongoDB
```bash
# Option A: Install MongoDB locally
brew install mongodb-community@7.0  # macOS
# OR use MongoDB Compass GUI

# Option B: Use MongoDB Atlas (recommended)
# Get connection string from Atlas dashboard
```

### 2. Setup Environment Variables

**Server (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/premium-fashion-store
JWT_SECRET=your_super_secret_jwt_key_12345
STRIPE_SECRET_KEY=sk_test_your_key
CLIENT_URL=http://localhost:3000
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
```

### 3. Install & Run

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

### 4. Seed Database (Optional)

Create a seed script `server/seed.js`:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products (use array from above)
    await Product.insertMany(sampleProducts);
    
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();
```

Run: `node seed.js`

## 🎨 Customization Tips

### Change Color Scheme:
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',  // Change primary color
  }
}
```

### Add More Payment Gateways:
- **Razorpay** (Popular in India): Install `razorpay` package
- **Paytm**: Use Paytm Payment Gateway SDK
- Update `paymentController.js` accordingly

### Add Email Notifications:
```bash
npm install nodemailer
```

Create email service to send:
- Order confirmations
- Shipping updates
- Password reset emails

## 📱 Progressive Web App (PWA)

Add PWA support for mobile app-like experience:

1. Install Vite PWA plugin:
```bash
npm install -D vite-plugin-pwa
```

2. Update `vite.config.js`:
```javascript
import { VitePWA } from 'vite-plugin-pwa';

plugins: [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'LUXE Fashion',
      short_name: 'LUXE',
      theme_color: '#171717',
      icons: [...]
    }
  })
]
```

## 🔒 Security Checklist

- ✅ Environment variables secured
- ✅ CORS configured for production domains only
- ✅ Input validation on all forms
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ HTTPS enabled in production
- ✅ Rate limiting implemented
- ✅ SQL injection prevented (using Mongoose)

## 📈 Performance Optimization

1. **Image Optimization**: Use Cloudinary or ImageKit
2. **Code Splitting**: Already handled by Vite
3. **Lazy Loading**: Implement for routes and images
4. **Caching**: Add Redis for API caching
5. **CDN**: Use Cloudflare for static assets

## 🎯 Next Features to Add

1. **Admin Dashboard**: Product/order management
2. **Reviews System**: Let users review products
3. **Wishlist Sync**: Save to database
4. **Size Guide**: Help users choose correct size
5. **Live Chat**: Customer support
6. **Push Notifications**: Order updates
7. **Analytics**: Google Analytics integration
8. **SEO**: Meta tags, sitemap, schema markup

## 📞 Support

For issues or questions:
- Check console for errors
- Verify environment variables
- Test API endpoints with Postman
- Check MongoDB connection

---

**Built with ❤️ for Indian Fashion E-commerce**

Good luck with your premium fashion store! 🚀
