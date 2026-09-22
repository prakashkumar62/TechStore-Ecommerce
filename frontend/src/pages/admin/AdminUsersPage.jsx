import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, User } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminService.getUsers();
        if (res.success && res.data) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error('Error fetching admin users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Registered Customers & Staff</h1>
        <p className="text-xs text-slate-400 mt-1">
          Overview of registered customer profiles, credentials, and access roles
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">User</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Addresses</th>
                  <th className="py-3 px-4 font-bold text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <span className="font-semibold text-white">{u.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                          <User className="w-3 h-3" />
                          <span>Customer</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {u.addresses?.length || 0} saved
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
