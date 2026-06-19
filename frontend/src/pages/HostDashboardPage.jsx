import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../api/axios';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiDollarSign, FiCalendar, FiHome, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function HostDashboardPage() {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('properties');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, p, b] = await Promise.all([
        api.get('/properties/host/stats'),
        api.get('/properties/host/my-properties'),
        api.get('/properties/host/bookings'),
      ]);
      setStats(s.data.stats);
      setProperties(p.data.properties);
      setBookings(b.data.bookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteProperty = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(ps => ps.filter(p => p._id !== id));
      toast.success('Listing removed');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your listings and bookings</p>
          </div>
          <Link to="/host/add-property" className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add listing
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FiHome} label="Active listings" value={stats.totalProperties} color="blue" />
            <StatCard icon={FiCalendar} label="Total bookings" value={stats.totalBookings} color="green" />
            <StatCard icon={FiDollarSign} label="Total earnings" value={`$${stats.totalEarnings?.toLocaleString()}`} color="purple" />
            <StatCard icon={FiStar} label="Avg rating" value={stats.avgRating?.toFixed(1) || '—'} color="yellow" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {['properties', 'bookings'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : tab === 'properties' ? (
          properties.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => (
                <div key={p._id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={p.images[0]?.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className={`absolute top-3 left-3 badge ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">{p.location.city}, {p.location.country}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-semibold text-gray-900">${p.pricePerNight}/night</span>
                        {p.rating > 0 && (
                          <span className="flex items-center gap-1 text-gray-600">
                            <FiStar className="w-3 h-3 fill-gray-600 stroke-gray-600" /> {p.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Link to={`/host/edit-property/${p._id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => deleteProperty(p._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No bookings received yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Property', 'Guest', 'Check-in', 'Check-out', 'Guests', 'Total', 'Status'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map(b => (
                      <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={b.property?.images?.[0]?.url} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[150px]">{b.property?.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {b.guest?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-700">{b.guest?.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{format(new Date(b.checkIn), 'MMM d, yyyy')}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{format(new Date(b.checkOut), 'MMM d, yyyy')}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{b.totalGuests}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">${b.totalPrice.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={b.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
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
  return <span className={`badge capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🏠</p>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
      <p className="text-gray-500 mb-6">Add your first property to start earning.</p>
      <Link to="/host/add-property" className="btn-primary inline-flex items-center gap-2">
        <FiPlus className="w-4 h-4" /> Add your first listing
      </Link>
    </div>
  );
}
