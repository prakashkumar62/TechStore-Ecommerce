import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Plus,
  MapPin,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const checkoutState = location.state || {};
  const shippingFee = checkoutState.shippingFee !== undefined ? checkoutState.shippingFee : (subtotal >= 1000 ? 0 : 99);
  const discountAmount = checkoutState.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  // Address State
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [mockPaymentModal, setMockPaymentModal] = useState(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const currentAddress =
    user?.addresses && user.addresses.length > 0
      ? user.addresses[selectedAddressIndex] || user.addresses[0]
      : newAddress;

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.postalCode) {
      toast.error('Please fill in all address fields');
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await authService.addAddress(newAddress);
        if (res.success) {
          toast.success('Address saved to profile!');
          setShowAddressForm(false);
        }
      } catch (err) {
        toast.error('Failed to save address');
      }
    } else {
      setShowAddressForm(false);
    }
  };

  const prepareOrderData = () => {
    const items = cartItems.map((item) => ({
      product: item.product?._id || item.product,
      nameSnapshot: item.product?.name || 'Tech Product',
      priceSnapshot: item.priceSnapshot || item.product?.price || 0,
      imageSnapshot:
        item.product?.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80',
      quantity: item.quantity,
    }));

    return {
      items,
      addressSnapshot: currentAddress,
      subtotal,
      shippingFee,
      discountAmount,
      totalAmount: grandTotal,
    };
  };

  const handleCheckout = async () => {
    if (!currentAddress.street || !currentAddress.city) {
      toast.error('Please specify a delivery address');
      setShowAddressForm(true);
      return;
    }

    setProcessing(true);
    const orderData = prepareOrderData();

    // 1. Cash On Delivery Flow
    if (paymentMethod === 'cod') {
      try {
        const res = await orderService.createOrder({
          ...orderData,
          paymentMethod: 'cod',
        });

        if (res.success && res.data) {
          clearCart();
          toast.success('Order placed successfully via Cash on Delivery!');
          navigate(`/order-success/${res.data._id}`, { state: { order: res.data } });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to place order');
      } finally {
        setProcessing(false);
      }
      return;
    }

    // 2. Razorpay Test Mode Payment Flow
    try {
      const orderRes = await paymentService.createRazorpayOrder(grandTotal, 'INR');

      if (!orderRes.success) {
        toast.error('Failed to initiate payment gateway');
        setProcessing(false);
        return;
      }

      const { id: razorpayOrderId, keyId, isMock } = orderRes.data;

      // If Razorpay SDK is loaded on window and real/test credentials configured
      if (window.Razorpay && !isMock) {
        const options = {
          key: keyId,
          amount: Math.round(grandTotal * 100),
          currency: 'INR',
          name: 'TechStore India',
          description: 'Portfolio Test Mode Checkout',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80',
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // Server-side verification
              const verifyRes = await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData,
              });

              if (verifyRes.success && verifyRes.data) {
                clearCart();
                toast.success('Payment verified! Order placed successfully.');
                navigate(`/order-success/${verifyRes.data._id}`, {
                  state: { order: verifyRes.data },
                });
              }
            } catch (err) {
              toast.error(err.response?.data?.message || 'Payment verification failed');
            } finally {
              setProcessing(false);
            }
          },
          prefill: {
            name: currentAddress.fullName,
            email: user?.email || 'customer@techstore.com',
            contact: currentAddress.phone || '9999999999',
          },
          theme: {
            color: '#4f46e5',
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              toast.info('Payment window closed. You can retry when ready.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Safe interactive demo simulation modal if keys are placeholder in .env
        setMockPaymentModal({
          orderId: razorpayOrderId,
          amount: grandTotal,
          orderData,
        });
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.response?.data?.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  const handleSimulatedPaymentSuccess = async () => {
    if (!mockPaymentModal) return;

    try {
      setProcessing(true);
      const fakePaymentId = `pay_sim_${Date.now()}`;
      const fakeSignature = `sig_sim_${Math.random().toString(36).substring(2)}`;

      const verifyRes = await paymentService.verifyPayment({
        razorpay_order_id: mockPaymentModal.orderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: fakeSignature,
        orderData: mockPaymentModal.orderData,
      });

      if (verifyRes.success && verifyRes.data) {
        setMockPaymentModal(null);
        clearCart();
        toast.success('Test payment verified successfully!');
        navigate(`/order-success/${verifyRes.data._id}`, {
          state: { order: verifyRes.data },
        });
      }
    } catch (err) {
      toast.error('Simulation verification failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>SSL 256-Bit Encrypted • Razorpay Test Gateway</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address & Payment Selection */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>1. Shipping Address</span>
              </div>
              {user?.addresses && user.addresses.length > 0 && !showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            {!showAddressForm && user?.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr, idx) => (
                  <label
                    key={addr._id || idx}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      selectedAddressIndex === idx
                        ? 'border-indigo-600 bg-indigo-50/30 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressIndex === idx}
                      onChange={() => setSelectedAddressIndex(idx)}
                      className="sr-only"
                    />
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{addr.fullName}</span>
                        {selectedAddressIndex === idx && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2 font-medium">
                        Phone: {addr.phone}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              /* Address Form */
              <form onSubmit={handleAddNewAddress} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={newAddress.fullName}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, fullName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address & Flat / House No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Greenfield Heights, Outer Ring Rd"
                    value={newAddress.street}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, street: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Bengaluru"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="Karnataka"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="560103"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, postalCode: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {user?.addresses && user.addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="text-xs text-slate-500 hover:underline mr-4"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Use this Address
                </button>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>2. Payment Option</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Razorpay Option */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'razorpay'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="sr-only"
                />
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  ₹
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Razorpay Test Mode
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-200 text-indigo-800">
                      Instant
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    UPI, Credit/Debit Cards, Netbanking, Wallets (No actual charge)
                  </p>
                </div>
              </label>

              {/* Cash On Delivery Option */}
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="sr-only"
                />
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pay with cash or UPI upon package handover at your doorstep
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Trigger */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Checkout Summary</h3>

          {/* Mini Items List */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item._id} className="pt-2 flex items-center justify-between text-xs">
                <div className="truncate pr-2">
                  <span className="font-semibold text-slate-800 block truncate">
                    {item.product?.name}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    Qty: {item.quantity} × ₹{(item.priceSnapshot || item.product?.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  ₹{((item.priceSnapshot || item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-slate-900">
                {shippingFee === 0 ? <span className="text-emerald-600 uppercase">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Applied</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total</span>
            <span className="text-2xl font-black text-indigo-600">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
          >
            {processing ? (
              <span>Processing Order...</span>
            ) : (
              <>
                <span>{paymentMethod === 'razorpay' ? 'Pay with Razorpay Test Mode' : 'Confirm COD Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-[10px] text-slate-400">
            <p>Razorpay Sandbox Test Simulation Mode enabled.</p>
            <p className="mt-0.5">Zero real money is charged during tests.</p>
          </div>
        </div>
      </div>

      {/* Test Sandbox Simulation Modal */}
      {mockPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                ⚡
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Razorpay Test Simulator</h3>
                <p className="text-[11px] text-slate-400">Order ID: {mockPaymentModal.orderId}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Payable Amount:</span>
                <span className="font-extrabold text-slate-900">
                  ₹{mockPaymentModal.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Test Merchant:</span>
                <span className="font-semibold text-slate-700">TechStore India</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway Status:</span>
                <span className="text-emerald-600 font-bold">HMAC Signature Ready</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              This interactive simulator verifies backend HMAC signature processing, decrements inventory stock, and confirms your order document in MongoDB Atlas.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMockPaymentModal(null)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulatedPaymentSuccess}
                disabled={processing}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
              >
                {processing ? 'Verifying...' : 'Simulate Success'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
