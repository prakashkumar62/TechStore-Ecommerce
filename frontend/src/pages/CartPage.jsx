import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { couponService } from '../services/couponService';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Shipping calculation (Free if subtotal >= ₹1,000)
  const shippingFee = subtotal >= 1000 || subtotal === 0 ? 0 : 99;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      const res = await couponService.validateCoupon(couponCode, subtotal);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
        toast.success(res.message || 'Coupon applied successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or inapplicable coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        appliedCoupon,
        shippingFee,
        discountAmount,
        grandTotal,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Explore our latest tech collection and discover flagship gadgets with exclusive launch deals."
          actionLabel="Start Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected tech gadgets and accessories
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => {
            const product = item.product || {};
            const itemPrice = item.priceSnapshot || product.price || 0;
            const primaryImg =
              product.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80';

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition-all"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${product.slug || product._id}`}
                  className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 shrink-0"
                >
                  <img
                    src={primaryImg}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {product.brand}
                  </span>
                  <Link
                    to={`/products/${product.slug || product._id}`}
                    className="block text-sm font-bold text-slate-900 hover:text-indigo-600 line-clamp-1 transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs font-extrabold text-slate-900 mt-1">
                    ₹{itemPrice.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1, product)}
                    disabled={item.quantity <= 1}
                    className="p-1.5 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1, product)}
                    disabled={item.quantity >= (product.stock || 99)}
                    className="p-1.5 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total & Remove */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-slate-900 w-24 text-right">
                    ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Have a Promo Coupon?</span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{appliedCoupon.code} applied (-₹{appliedCoupon.discount})</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs uppercase bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}
            <p className="text-[10px] text-slate-400">
              Try code <span className="font-mono font-bold text-slate-700">WELCOME10</span> or <span className="font-mono font-bold text-slate-700">TECHSTORE500</span>.
            </p>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-slate-600 pb-4 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <span className="text-sm font-black text-slate-900 block">Total Amount</span>
                <span className="text-[10px] text-slate-400">Including GST</span>
              </div>
              <span className="text-2xl font-black text-indigo-600">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Razorpay 256-Bit Test Mode Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
