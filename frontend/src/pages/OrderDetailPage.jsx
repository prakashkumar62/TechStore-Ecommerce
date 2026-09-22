import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  AlertCircle,
  X,
  ArrowLeft,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/common/SkeletonLoader';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const toast = useToast();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(id, 'Cancelled by user from order details page');
      if (res.success) {
        toast.success('Order cancelled and inventory restored');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>
        <Link to="/orders" className="text-xs text-indigo-600 font-semibold mt-4 inline-block">
          Return to Orders
        </Link>
      </div>
    );
  }

  const steps = ['placed', 'processing', 'shipped', 'delivered'];
  const currentStepIdx = steps.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all orders</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Order #{order._id}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Cancel button if valid */}
        {!isCancelled && ['placed', 'processing'].includes(order.orderStatus) && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Status Timeline Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Delivery Status Progress
        </h3>

        {isCancelled ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>This order was cancelled. Any reserved items have been restored to store inventory.</span>
          </div>
        ) : (
          <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
            {/* Horizontal connecting bar */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 -z-0">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>

            {steps.map((st, i) => {
              const isDone = i <= currentStepIdx;
              const isCurrent = i === currentStepIdx;

              return (
                <div key={st} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-white'
                        : 'bg-slate-200 text-slate-500 ring-4 ring-white'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider mt-2 ${
                      isCurrent ? 'text-indigo-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items List (2 cols) */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
            Ordered Products ({order.items?.length})
          </h3>

          <div className="divide-y divide-slate-100 space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="pt-3 flex items-center gap-4">
                <img
                  src={item.imageSnapshot}
                  alt={item.nameSnapshot}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0"
                />
                <div className="flex-1 text-xs">
                  <h4 className="font-bold text-slate-900 leading-tight">{item.nameSnapshot}</h4>
                  <p className="text-slate-400 mt-1">Quantity: {item.quantity}</p>
                </div>
                <span className="font-bold text-sm text-slate-900 shrink-0">
                  ₹{(item.priceSnapshot * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-slate-900">
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount:</span>
                <span>-₹{order.discountAmount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Grand Total:</span>
              <span className="text-xl font-black text-indigo-600">
                ₹{order.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta (1 col) */}
        <div className="space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Delivery Address</span>
            </div>
            {order.addressSnapshot && (
              <div className="space-y-1 text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-800">{order.addressSnapshot.fullName}</p>
                <p>{order.addressSnapshot.street}</p>
                <p>
                  {order.addressSnapshot.city}, {order.addressSnapshot.state} -{' '}
                  {order.addressSnapshot.postalCode}
                </p>
                <p className="font-medium text-slate-500 pt-1">
                  Phone: {order.addressSnapshot.phone}
                </p>
              </div>
            )}
          </div>

          {/* Payment Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Payment Info</span>
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-bold uppercase text-slate-800">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold uppercase text-emerald-600">{order.paymentStatus}</span>
              </div>
              {order.razorpayPaymentId && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Razorpay Payment ID
                  </span>
                  <span className="font-mono text-[11px] text-slate-700 break-all">
                    {order.razorpayPaymentId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
