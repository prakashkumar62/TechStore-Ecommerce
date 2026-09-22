import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-black text-white">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-800/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <TableSkeleton rows={4} />
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      sub: 'Verified paid orders',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      sub: 'Placed & processed',
      icon: ShoppingBag,
      color: 'from-indigo-500 to-violet-600',
    },
    {
      title: 'Catalog Products',
      value: stats?.totalProducts || 0,
      sub: 'Active SKUs',
      icon: Package,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Customers',
      value: stats?.totalUsers || 0,
      sub: 'Registered accounts',
      icon: Users,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System Analytics & KPIs</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time snapshot of TechStore revenue, sales pipeline, and catalog health
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {kpi.title}
                </span>
                <p className="text-2xl font-black text-white mt-1">{kpi.value}</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{kpi.sub}</span>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${kpi.color} text-white flex items-center justify-center shrink-0 shadow-md`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Low Stock Alert & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alert List (1 col) */}
        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Stock Alerts</span>
            </div>
            <Link
              to="/admin/products"
              className="text-[11px] text-indigo-400 hover:underline"
            >
              Manage
            </Link>
          </div>

          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              All inventory levels healthy.
            </p>
          )}
        </div>

        {/* Recent Orders Table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] border-b border-slate-800/80">
                  <th className="pb-2.5 font-bold">Order ID</th>
                  <th className="pb-2.5 font-bold">Customer</th>
                  <th className="pb-2.5 font-bold">Total</th>
                  <th className="pb-2.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {stats?.recentOrders?.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 font-mono text-[11px] text-indigo-400">
                      #{ord._id.substring(ord._id.length - 8)}
                    </td>
                    <td className="py-3 font-medium text-white">{ord.user?.name || 'Customer'}</td>
                    <td className="py-3 font-bold text-white">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
