import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiUsers, FiHome, FiCalendar, FiDollarSign, FiStar, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [s, u, p, b] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/properties'),
          api.get('/admin/bookings'),
        ]);
        setStats(s.data.stats);
        setUsers(u.data.users);
        setProperties(p.data.properties);
        setBookings(b.data.bookings);
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const toggleUser = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle`);
      setUsers(us => us.map(u => u._id === id ? res.data.user : u));
      toast.success('User status updated');
    } catch { toast.error('Failed'); }
  };

  const deleteProperty = async (id) => {
    if (!confirm('Remove this listing?')) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      setProperties(ps => ps.filter(p => p._id !== id));
      toast.success('Property removed');
    } catch { toast.error('Failed'); }
  };

  const TABS = ['overview', 'users', 'properties', 'bookings'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-8">
        <div className="mb-8">
          <span className="text-brand text-sm font-semibold uppercase tracking-wider">Admin</span>
          <h1 className="text-3xl font-display font-bold text-gray-900">Control Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize whitespace-nowrap transition-all ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
          <>
            {/* Overview */}
            {tab === 'overview' && stats && (
              <div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <StatCard icon={FiUsers} label="Total users" value={stats.users} />
                  <StatCard icon={FiHome} label="Properties" value={stats.properties} />
                  <StatCard icon={FiCalendar} label="Bookings" value={stats.bookings} />
                  <StatCard icon={FiStar} label="Reviews" value={stats.reviews} />
                  <StatCard icon={FiDollarSign} label="Revenue" value={`$${stats.totalRevenue?.toLocaleString()}`} />
                </div>
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="font-display font-semibold text-gray-900 mb-4">Recent bookings</h3>
                  <div className="space-y-3">
                    {stats.recentBookings?.map(b => (
                      <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{b.property?.title}</p>
                          <p className="text-xs text-gray-500">by {b.guest?.name}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users */}
            {tab === 'users' && (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">{users.length} total users</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                                {u.avatar
                                  ? <img src={u.avatar} className="w-full h-full rounded-full object-cover" />
                                  : <span className="text-white text-xs font-bold">{u.name?.[0]?.toUpperCase()}</span>
                                }
                              </div>
                              <span className="text-sm font-medium text-gray-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`badge capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'host' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                          <td className="px-4 py-3">
                            <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleUser(u._id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                              {u.isActive ? <FiToggleRight className="w-5 h-5 text-green-500" /> : <FiToggleLeft className="w-5 h-5 text-red-400" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Properties */}
            {tab === 'properties' && (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Property', 'Host', 'Location', 'Price', 'Rating', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {properties.map(p => (
                        <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={p.images?.[0]?.url} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[180px]">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.host?.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.location?.city}, {p.location?.country}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">${p.pricePerNight}/night</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.rating > 0 ? `⭐ ${p.rating.toFixed(1)}` : '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`badge ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {p.isActive ? 'Active' : 'Removed'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {p.isActive && (
                              <button onClick={() => deleteProperty(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings */}
            {tab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Property', 'Guest', 'Host', 'Check-in', 'Total', 'Status'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.slice(0, 50).map(b => (
                        <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[200px]">
                            <span className="line-clamp-1">{b.property?.title}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{b.guest?.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{b.host?.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{b.checkIn ? format(new Date(b.checkIn), 'MMM d, yyyy') : '—'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">${b.totalPrice?.toLocaleString()}</td>
                          <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <Icon className="w-5 h-5 text-brand mb-2" />
      <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };
  return <span className={`badge capitalize ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}
