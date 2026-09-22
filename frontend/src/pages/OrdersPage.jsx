import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/orderService';
import EmptyState from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/SkeletonLoader';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders with TechStore yet. Explore our gadgets and place your first order today!"
          actionLabel="Explore Catalog"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review details and track delivery progress for your past purchases
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-indigo-200 transition-all space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Placed</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
                <Link
                  to={`/orders/${order._id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Items previews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                  <img
                    src={item.imageSnapshot}
                    alt={item.nameSnapshot}
                    className="w-12 h-12 rounded-lg object-cover bg-white"
                  />
                  <div className="text-xs overflow-hidden">
                    <p className="font-semibold text-slate-800 truncate">{item.nameSnapshot}</p>
                    <p className="text-slate-500 text-[11px]">Qty: {item.quantity} • ₹{item.priceSnapshot.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
