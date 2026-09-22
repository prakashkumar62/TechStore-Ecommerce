const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const Review = require('./models/Review');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const sampleProducts = [
  {
    name: 'Apple MacBook Pro 16" (M3 Max, 36GB, 1TB SSD)',
    description: 'The most advanced Mac laptop for pros. Supercharged by the M3 Max chip with a 16-core CPU and 40-core GPU. Stunning Liquid Retina XDR display with up to 120Hz ProMotion and 22 hours of battery life.',
    price: 349900,
    compareAtPrice: 399900,
    category: 'Laptops',
    brand: 'Apple',
    stock: 15,
    rating: 4.9,
    numReviews: 28,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_macbook_pro',
      },
      {
        url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_macbook_pro_side',
      },
    ],
    features: [
      'Apple M3 Max chip with 16-core CPU, 40-core GPU',
      '36GB Unified Memory + 1TB Fast NVMe SSD',
      '16.2-inch Liquid Retina XDR display (3456 x 2234)',
      '1080p FaceTime HD camera & 6-speaker sound system',
      'Up to 22 hours battery life on single charge',
    ],
    tags: ['apple', 'laptop', 'pro', 'm3 max', 'developer'],
  },
  {
    name: 'Dell XPS 15 OLED (Intel Core i9, RTX 4070, 32GB RAM)',
    description: 'Immersive 3.5K OLED InfinityEdge touch display with ultra-thin bezels. Powered by 13th Gen Intel Core i9-13900H and NVIDIA GeForce RTX 4070 Laptop GPU for creative studio performance.',
    price: 245000,
    compareAtPrice: 279999,
    category: 'Laptops',
    brand: 'Dell',
    stock: 10,
    rating: 4.7,
    numReviews: 19,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_dell_xps',
      },
    ],
    features: [
      '15.6" 3.5K (3456 x 2160) OLED Touch Display',
      '13th Gen Intel Core i9-13900H (14 cores, up to 5.4 GHz)',
      'NVIDIA GeForce RTX 4070 8GB GDDR6',
      'CNC machined aluminum and carbon fiber palm rest',
    ],
    tags: ['dell', 'xps', 'laptop', 'oled', 'rtx4070'],
  },
  {
    name: 'Apple iPhone 16 Pro Max (256GB, Desert Titanium)',
    description: 'Featuring a strong and lightweight titanium design with thinner borders around the 6.9-inch Super Retina XDR display. Powered by the groundbreaking A18 Pro chip and 48MP Fusion camera system.',
    price: 144900,
    compareAtPrice: 159900,
    category: 'Smartphones',
    brand: 'Apple',
    stock: 25,
    rating: 4.9,
    numReviews: 45,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_iphone_16_pro',
      },
    ],
    features: [
      '6.9-inch Super Retina XDR display with ProMotion 120Hz',
      'A18 Pro chip with 6-core GPU and Apple Intelligence',
      'Camera Control button for instant access to tools',
      '48MP Fusion camera with 5x Telephoto optical zoom',
    ],
    tags: ['iphone', 'apple', 'smartphone', '5g', 'flagship'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra (512GB, Titanium Gray)',
    description: 'The pinnacle of mobile AI intelligence with Galaxy AI. Includes built-in S Pen, 200MP camera system with 100x Space Zoom, and Snapdragon 8 Gen 3 for Galaxy.',
    price: 139999,
    compareAtPrice: 149999,
    category: 'Smartphones',
    brand: 'Samsung',
    stock: 20,
    rating: 4.8,
    numReviews: 32,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_galaxy_s24_ultra',
      },
    ],
    features: [
      '6.8-inch Dynamic AMOLED 2X, 120Hz, 2600 nits peak brightness',
      'Snapdragon 8 Gen 3 Mobile Platform for Galaxy',
      '200MP Main Camera with Quad Telephoto zoom',
      'Integrated S Pen stylus and Corning Gorilla Armor glass',
    ],
    tags: ['samsung', 'galaxy', 'smartphone', 'ai', 'spen'],
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation optimized by two processors and 8 microphones. Exceptional sound quality engineered with the new Integrated Processor V1 and LDAC high-res wireless audio.',
    price: 29990,
    compareAtPrice: 34990,
    category: 'Audio',
    brand: 'Sony',
    stock: 35,
    rating: 4.8,
    numReviews: 64,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_sony_headphones',
      },
    ],
    features: [
      'Industry-leading active noise cancellation (ANC)',
      'Up to 30-hour battery life with quick 3-minute charge for 3 hours playback',
      'Multipoint connection pairs with two Bluetooth devices at once',
      'Crystal-clear hands-free calling with 4 beamforming microphones',
    ],
    tags: ['sony', 'audio', 'anc', 'wireless', 'headphones'],
  },
  {
    name: 'Apple AirPods Pro (2nd Generation, USB-C)',
    description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio with dynamic head tracking. MagSafe Charging Case with speaker and lanyard loop.',
    price: 24900,
    compareAtPrice: 26900,
    category: 'Audio',
    brand: 'Apple',
    stock: 40,
    rating: 4.9,
    numReviews: 52,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_airpods_pro',
      },
    ],
    features: [
      'H2 chip delivers smarter noise cancellation and 3D sound',
      'Dust, sweat, and water resistant (IP54)',
      'Touch control for volume adjustment with a swipe',
      'Up to 30 hours of listening time with case',
    ],
    tags: ['apple', 'airpods', 'audio', 'earbuds', 'anc'],
  },
  {
    name: 'Logitech MX Master 3S Performance Wireless Mouse',
    description: 'An icon remastered with Quiet Clicks and 8,000 DPI track-on-glass sensor. MagSpeed electromagnetic scrolling scrolls 1,000 lines a second with pinpoint precision.',
    price: 10995,
    compareAtPrice: 12995,
    category: 'Accessories',
    brand: 'Logitech',
    stock: 50,
    rating: 4.9,
    numReviews: 78,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_mx_master',
      },
    ],
    features: [
      '8,000 DPI optical sensor tracks anywhere, even on glass',
      'Quiet Clicks with 90% less click noise',
      'MagSpeed scroll wheel shifts between ratchet and hyper-fast modes',
      'Connect across up to 3 computers using Logi Bolt or Bluetooth',
    ],
    tags: ['logitech', 'mouse', 'productivity', 'wireless'],
  },
  {
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    description: 'Full metal 75% layout QMK/VIA wireless custom mechanical keyboard. Double-gasket design, hot-swappable switches, screw-in stabilizers, and South-facing RGB backlighting.',
    price: 18999,
    compareAtPrice: 21999,
    category: 'Accessories',
    brand: 'Keychron',
    stock: 18,
    rating: 4.8,
    numReviews: 24,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_keychron_keyboard',
      },
    ],
    features: [
      'CNC machined 6063 aluminum body',
      'Double-Gasket design for acoustic dampening',
      'Hot-swappable pre-lubed mechanical switches',
      'Bluetooth 5.1 & Type-C wired dual connectivity',
    ],
    tags: ['keychron', 'keyboard', 'mechanical', 'custom'],
  },
  {
    name: 'LG UltraGear 32" OLED 4K UHD 240Hz Gaming Monitor',
    description: 'World premier 4K OLED gaming display with dual-mode refresh rate: 4K at 240Hz or Full HD at 480Hz. 0.03ms (GtG) response time, VESA DisplayHDR True Black 400, and NVIDIA G-SYNC compatibility.',
    price: 124990,
    compareAtPrice: 145000,
    category: 'Displays',
    brand: 'LG',
    stock: 8,
    rating: 4.9,
    numReviews: 15,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_lg_oled_monitor',
      },
    ],
    features: [
      '32-inch 4K UHD (3840 x 2160) WOLED panel',
      'Dual-Mode 4K 240Hz / FHD 480Hz with 0.03ms response time',
      'VESA DisplayHDR True Black 400 and 98.5% DCI-P3 color gamut',
      'Pixel Sound integrated into screen panel',
    ],
    tags: ['lg', 'ultragear', 'oled', 'monitor', 'gaming', '4k'],
  },
  {
    name: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium)',
    description: 'The ultimate sports and adventure watch. Powered by the S9 SiP with a 3,000-nit display, precision dual-frequency GPS, 36 hours of normal battery life, and 100m water resistance.',
    price: 89900,
    compareAtPrice: 94900,
    category: 'Wearables',
    brand: 'Apple',
    stock: 14,
    rating: 4.9,
    numReviews: 38,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=1000&q=80',
        publicId: 'tech_apple_watch_ultra',
      },
    ],
    features: [
      'Rugged 49mm aerospace-grade titanium case with sapphire front crystal',
      'Brightest Apple display ever: 3,000 nits peak brightness',
      'Action button customizable for workouts, compass waypoints, and sirens',
      'Dual-frequency GPS for precision pace and route calculation',
    ],
    tags: ['apple', 'watch', 'wearable', 'ultra', 'fitness'],
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techstore';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`[Seed]: Connected to MongoDB at ${mongoUri}`);

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    console.log('[Seed]: Cleared existing collections.');

    // Create Admin User
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@techstore.com',
      password: 'Admin@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
      addresses: [
        {
          fullName: 'Admin Operations',
          phone: '+91 9876543210',
          street: '101 Cyber Hub, Tech City',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    // Create Demo Customer User
    const customerUser = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@techstore.com',
      password: 'Customer@123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      addresses: [
        {
          fullName: 'Rahul Sharma',
          phone: '+91 9123456780',
          street: 'Flat 402, Greenfield Heights, Outer Ring Rd',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560103',
          country: 'India',
          isDefault: true,
        },
        {
          fullName: 'Rahul Sharma (Office)',
          phone: '+91 9123456780',
          street: 'Tower B, Tech Park, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560066',
          country: 'India',
          isDefault: false,
        },
      ],
    });

    console.log('[Seed]: Created Admin & Customer accounts:');
    console.log('  Admin:    admin@techstore.com / Admin@123');
    console.log('  Customer: customer@techstore.com / Customer@123');

    // Seed Products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seed]: Inserted ${createdProducts.length} tech products.`);

    // Seed Coupons
    await Coupon.create([
      {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrder: 1000,
        maxDiscount: 2500,
        expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        usageLimit: 500,
      },
      {
        code: 'TECHSTORE500',
        type: 'fixed',
        value: 500,
        minOrder: 5000,
        maxDiscount: 500,
        expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 200,
      },
    ]);
    console.log('[Seed]: Inserted discount coupons: WELCOME10, TECHSTORE500.');

    // Seed Reviews for some products
    if (createdProducts.length > 0) {
      await Review.create([
        {
          user: customerUser._id,
          product: createdProducts[0]._id,
          rating: 5,
          comment: 'Mind-blowing performance for software engineering and video rendering. Worth every penny!',
        },
        {
          user: customerUser._id,
          product: createdProducts[2]._id,
          rating: 5,
          comment: 'Best phone display and camera on the market. Titanium build feels super premium.',
        },
      ]);
      console.log('[Seed]: Inserted sample reviews.');
    }

    console.log('[Seed]: Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();
