import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">All pan-India orders over ₹1,000</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Razorpay Test Gateway</h4>
              <p className="text-xs text-slate-400 mt-0.5">End-to-end HMAC verified payment</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Replacement</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free guarantee for genuine tech</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Expert Help</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated hardware support team</p>
            </div>
          </div>
        </div>

        {/* Links & Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-lg">
                ⚡
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Tech<span className="text-indigo-400">Store</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-slate-400">
              A modern, production-grade full-stack e-commerce experience showcasing React, Tailwind, Express, MongoDB Atlas, and Razorpay Test Mode payments.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Razorpay Test Sandbox Ready
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Categories</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/products?category=Laptops" className="hover:text-white transition-colors">Laptops & MacBooks</Link></li>
              <li><Link to="/products?category=Smartphones" className="hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link to="/products?category=Audio" className="hover:text-white transition-colors">Audio & ANC Headphones</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-white transition-colors">Custom Keyboards & Mice</Link></li>
              <li><Link to="/products?category=Displays" className="hover:text-white transition-colors">Gaming Displays</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Navigation</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/products" className="hover:text-white transition-colors">Explore All Gadgets</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Account Settings</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Demo Credentials Box */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 space-y-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Demo Accounts</h5>
            <div className="text-[11px] space-y-1.5 font-mono">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                <span className="text-indigo-400 font-bold block">Admin:</span>
                <span className="text-slate-300">admin@techstore.com</span>
                <span className="text-slate-500 block">Pass: Admin@123</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                <span className="text-emerald-400 font-bold block">Customer:</span>
                <span className="text-slate-300">customer@techstore.com</span>
                <span className="text-slate-500 block">Pass: Customer@123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} TechStore. Built for high-performance portfolio demonstration.</p>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Powered by</span>
            <span className="text-slate-300 font-semibold">MERN Stack + Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
