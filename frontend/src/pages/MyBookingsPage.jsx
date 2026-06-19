import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format, isPast } from 'date-fns';
import { FiMapPin, FiCalendar, FiUsers, FiStar, FiX } from 'react-icons/fi';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewModal, setReviewModal] = useState(null);

  useEffect(() => {
    api.get('/bookings/my-bookings')
      .then(res => setBookings(res.data.bookings))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(bs => bs.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const submitReview = async ({ bookingId, propertyId, rating, comment }) => {
    try {
      await api.post('/reviews', { bookingId, ratings: { overall: rating }, comment });
      setBookings(bs => bs.map(b => b._id === bookingId ? { ...b, hasReview: true } : b));
      toast.success('Review submitted! ⭐');
      setReviewModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">My Bookings</h1>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === t.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🗓️</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <Link to="/properties" className="btn-primary mt-4 inline-block">Find your next stay</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(b => {
              const isPastBooking = isPast(new Date(b.checkOut));
              const canCancel = b.status === 'confirmed' && !isPast(new Date(b.checkIn));
              const canReview = (b.status === 'confirmed' || b.status === 'completed') && isPastBooking && !b.hasReview;

              return (
                <div key={b._id} className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col sm:flex-row">
                  <div className="sm:w-52 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img src={b.property?.images?.[0]?.url} alt={b.property?.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link to={`/properties/${b.property?._id}`} className="font-display font-semibold text-gray-900 hover:text-brand transition-colors line-clamp-1">
                            {b.property?.title}
                          </Link>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <FiMapPin className="w-3 h-3" />
                            {b.property?.location?.city}, {b.property?.location?.country}
                          </div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <FiCalendar className="w-3.5 h-3.5" />
                          {format(new Date(b.checkIn), 'MMM d')} – {format(new Date(b.checkOut), 'MMM d, yyyy')} · {b.nights} nights
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiUsers className="w-3.5 h-3.5" />
                          {b.totalGuests} guests
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">Confirmation: {b.confirmationCode}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="font-bold text-gray-900 text-lg">${b.totalPrice.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm"> total</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {canReview && (
                          <button onClick={() => setReviewModal(b)}
                            className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-400 px-3 py-1.5 rounded-lg transition-colors">
                            <FiStar className="w-3.5 h-3.5" /> Leave a review
                          </button>
                        )}
                        <Link to={`/bookings/${b._id}`}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors">
                          View details
                        </Link>
                        {canCancel && (
                          <button onClick={() => cancel(b._id)}
                            className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review modal */}
      {reviewModal && (
        <ReviewModal booking={reviewModal} onSubmit={submitReview} onClose={() => setReviewModal(null)} />
      )}
    </div>
  );
}

function ReviewModal({ booking, onSubmit, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-gray-900">Leave a review</h3>
          <button onClick={onClose}><FiX className="w-5 h-5 text-gray-500" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">How was your stay at <span className="font-medium text-gray-800">{booking.property?.title}</span>?</p>

        <div className="flex gap-2 mb-5">
          {[1,2,3,4,5].map(s => (
            <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
              <FiStar className={`w-8 h-8 transition-colors ${s <= (hover || rating) ? 'fill-amber-400 stroke-amber-400' : 'stroke-gray-300'}`} />
            </button>
          ))}
        </div>

        <textarea value={comment} onChange={e => setComment(e.target.value)}
          rows={4} className="input-field resize-none mb-4" placeholder="Share your experience..." />

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => onSubmit({ bookingId: booking._id, propertyId: booking.property?._id, rating, comment })}
            disabled={comment.length < 10} className="btn-primary flex-1 disabled:opacity-50">
            Submit review
          </button>
        </div>
      </div>
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
  return <span className={`badge capitalize flex-shrink-0 ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}
