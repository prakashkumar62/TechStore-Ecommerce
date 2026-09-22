import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({ page, status: statusFilter });
      if (res.success && res.data) {
        setOrders(res.data);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'processing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Order Fulfillment Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track customer shipments, verify payment statuses, and advance order lifecycles
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
          >
            <option value="all">All Orders</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : orders.length === 0 ? (
        <div className="bg-slate-950 p-12 text-center rounded-3xl border border-slate-800 text-slate-500 text-xs">
          No orders found matching the selected filter.
        </div>
      ) : (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Placed Date</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Payment</th>
                  <th className="py-3 px-4 font-bold">Fulfillment Status</th>
                  <th className="py-3 px-4 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-indigo-400">
                      #{ord._id.substring(ord._id.length - 8)}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {ord.user?.name || ord.addressSnapshot?.fullName || 'Customer'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.paymentStatus === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase border bg-slate-900 cursor-pointer focus:outline-none ${getBadgeClass(
                          ord.orderStatus
                        )}`}
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">
                Order #{selectedOrder._id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shipping Address</span>
              </div>
              <p className="font-bold text-white">{selectedOrder.addressSnapshot?.fullName}</p>
              <p>{selectedOrder.addressSnapshot?.street}</p>
              <p>{selectedOrder.addressSnapshot?.city}, {selectedOrder.addressSnapshot?.state} - {selectedOrder.addressSnapshot?.postalCode}</p>
              <p className="text-slate-500 font-mono text-[11px]">Phone: {selectedOrder.addressSnapshot?.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                Items Ordered ({selectedOrder.items?.length})
              </span>
              <div className="divide-y divide-slate-800/60 max-h-40 overflow-y-auto pr-1">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <span className="text-slate-200 truncate pr-2">
                      {it.quantity}x {it.nameSnapshot}
                    </span>
                    <span className="font-bold text-white shrink-0">
                      ₹{(it.priceSnapshot * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="font-bold uppercase text-slate-400">Total Order Value:</span>
              <span className="text-lg font-black text-indigo-400">
                ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
