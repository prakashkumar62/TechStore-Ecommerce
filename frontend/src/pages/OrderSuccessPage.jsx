import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, ShieldCheck } from 'lucide-react';
import { orderService } from '../services/orderService';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await orderService.getOrderById(id);
          if (res.success && res.data) {
            setOrder(res.data);
          }
        } catch (err) {
          console.error('Error fetching order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Payment & Order Confirmed
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Thank You for Your Order!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Your order has been placed successfully in our system. We have notified our warehouse for immediate packaging and dispatch.
        </p>
      </div>

      {/* Order Card Preview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Order ID</span>
            <span className="font-mono font-bold text-slate-800">{id || order?._id}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
            <span className="font-bold text-indigo-600 uppercase">
              {order?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Verified'}
            </span>
          </div>
        </div>

        {order?.items && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-100 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between">
                <span className="text-slate-700 truncate pr-2 font-medium">
                  {item.quantity}x {item.nameSnapshot}
                </span>
                <span className="font-bold text-slate-900 shrink-0">
                  ₹{(item.priceSnapshot * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase text-slate-600">Total Paid</span>
          <span className="text-xl font-black text-indigo-600">
            ₹{order?.totalAmount ? order.totalAmount.toLocaleString('en-IN') : '...'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to={`/orders/${id}`}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
        >
          <Package className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
