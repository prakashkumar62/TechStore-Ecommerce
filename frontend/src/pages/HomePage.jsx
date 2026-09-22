import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  Sparkles,
  Laptop,
  Smartphone,
  Headphones,
  Monitor,
  MousePointer,
  Tag,
} from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/common/SkeletonLoader';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({ limit: 8, sort: 'rating-desc' });
        if (res.success && res.data) {
          setFeaturedProducts(res.data);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Laptops', icon: Laptop, count: '10+ Models', path: '/products?category=Laptops', color: 'from-blue-600 to-indigo-600' },
    { name: 'Smartphones', icon: Smartphone, count: '15+ Models', path: '/products?category=Smartphones', color: 'from-violet-600 to-purple-600' },
    { name: 'Audio', icon: Headphones, count: '20+ Models', path: '/products?category=Audio', color: 'from-rose-500 to-pink-600' },
    { name: 'Accessories', icon: MousePointer, count: '30+ Items', path: '/products?category=Accessories', color: 'from-amber-500 to-orange-600' },
    { name: 'Displays', icon: Monitor, count: '8+ Monitors', path: '/products?category=Displays', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-400/30 text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Tech Essentials • Test Mode Sandbox</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Engineered for <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
                  Peak Performance.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover flagship Apple MacBooks, titanium smartphones, studio headphones, and high-refresh OLED gaming monitors with seamless Razorpay test checkout.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/products?category=Laptops"
                  className="w-full sm:w-auto px-7 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center transition-all"
                >
                  View M3 MacBooks
                </Link>
              </div>

              {/* Guarantees */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-slate-400 text-xs">
                <div>
                  <span className="font-extrabold text-white text-base block">100%</span>
                  <span>Genuine Hardware</span>
                </div>
                <div>
                  <span className="font-extrabold text-white text-base block">Fast</span>
                  <span>Free Express Delivery</span>
                </div>
                <div>
                  <span className="font-extrabold text-white text-base block">Razorpay</span>
                  <span>Verified Test Sandbox</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 group">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                  alt="Apple MacBook Pro 16"
                  className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                    Featured Flagship
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    MacBook Pro 16" M3 Max
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-black text-white">₹3,49,900</span>
                    <Link
                      to="/products?search=MacBook"
                      className="px-3.5 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Browse by Department
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Popular Categories</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>See all collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.name}
                to={c.path}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {c.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">{c.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Promotional Coupon Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">
                Enjoy 10% Extra Discount on your First Order
              </h3>
              <p className="text-xs text-indigo-100 mt-1">
                Use promo code <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">WELCOME10</span> at checkout (Min order ₹1,000).
              </p>
            </div>
          </div>
          <Link
            to="/products"
            className="px-6 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors shrink-0"
          >
            Claim Discount
          </Link>
        </div>
      </section>

      {/* Trending / Featured Tech Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Curated Selection
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Featured Flagships</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All ({featuredProducts.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
