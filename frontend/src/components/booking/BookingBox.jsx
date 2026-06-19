import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiStar, FiChevronDown } from 'react-icons/fi';

export default function BookingBox({ property }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [guestOpen, setGuestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [breakdown, setBreakdown] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  useEffect(() => {
    if (nights > 0) {
      const subtotal = nights * property.pricePerNight;
      const cleaningFee = property.cleaningFee || 0;
      const serviceFee = Math.round(subtotal * 0.12);
      const taxes = Math.round(subtotal * 0.08);
      setBreakdown({ subtotal, cleaningFee, serviceFee, taxes, total: subtotal + cleaningFee + serviceFee + taxes });
    } else {
      setBreakdown(null);
    }
  }, [nights, property]);

  const totalGuests = guests.adults + guests.children;

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!checkIn || !checkOut) { toast.error('Please select dates'); return; }
    if (nights <= 0) { toast.error('Check-out must be after check-in'); return; }
    if (totalGuests > property.guests) { toast.error(`Max ${property.guests} guests allowed`); return; }

    setLoading(true);
    try {
      const res = await api.post('/bookings', {
        propertyId: property._id,
        checkIn,
        checkOut,
        guests,
        specialRequests: ''
      });
      toast.success('Booking confirmed!');
      navigate(`/bookings/${res.data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-card sticky top-24">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-2xl font-bold text-gray-900">${property.pricePerNight?.toLocaleString()}</span>
          <span className="text-gray-500 text-sm"> / night</span>
        </div>
        {property.rating > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <FiStar className="fill-gray-900 stroke-gray-900 w-3.5 h-3.5" />
            <span className="font-semibold">{property.rating.toFixed(1)}</span>
            <span className="text-gray-500">({property.reviewCount})</span>
          </div>
        )}
      </div>

      <div className="border border-gray-300 rounded-xl overflow-hidden mb-3">
        <div className="grid grid-cols-2">
          <div className="p-3 border-r border-b border-gray-300">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Check in</label>
            <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)}
              className="w-full text-sm text-gray-800 outline-none" />
          </div>
          <div className="p-3 border-b border-gray-300">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Check out</label>
            <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)}
              className="w-full text-sm text-gray-800 outline-none" />
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setGuestOpen(!guestOpen)} className="w-full p-3 text-left flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Guests</div>
              <div className="text-sm text-gray-800">{totalGuests} guest{totalGuests !== 1 ? 's' : ''}{guests.infants ? `, ${guests.infants} infant` : ''}</div>
            </div>
            <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${guestOpen ? 'rotate-180' : ''}`} />
          </button>
          {guestOpen && (
            <div className="border-t border-gray-200 p-3 space-y-3">
              {[
                { label: 'Adults', sub: '13 or above', key: 'adults', min: 1 },
                { label: 'Children', sub: 'Ages 2–12', key: 'children', min: 0 },
                { label: 'Infants', sub: 'Under 2', key: 'infants', min: 0 },
              ].map(({ label, sub, key, min }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{label}</div>
                    <div className="text-xs text-gray-500">{sub}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGuests(g => ({ ...g, [key]: Math.max(min, g[key] - 1) }))}
                      className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:border-gray-800 text-sm font-bold flex items-center justify-center">−</button>
                    <span className="w-5 text-center text-sm">{guests[key]}</span>
                    <button onClick={() => setGuests(g => ({ ...g, [key]: g[key] + 1 }))}
                      disabled={totalGuests >= property.guests}
                      className="w-7 h-7 rounded-full border border-gray-300 text-gray-600 hover:border-gray-800 text-sm font-bold flex items-center justify-center disabled:opacity-40">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleBook} disabled={loading}
        className="w-full btn-primary py-3.5 text-base mb-4 rounded-xl">
        {loading ? 'Booking...' : nights > 0 ? 'Reserve Now' : 'Check Availability'}
      </button>

      <p className="text-center text-gray-500 text-xs mb-4">You won't be charged yet</p>

      {breakdown && (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>${property.pricePerNight?.toLocaleString()} × {nights} nights</span>
            <span>${breakdown.subtotal.toLocaleString()}</span>
          </div>
          {breakdown.cleaningFee > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Cleaning fee</span>
              <span>${breakdown.cleaningFee}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-700">
            <span>Service fee</span>
            <span>${breakdown.serviceFee}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Taxes</span>
            <span>${breakdown.taxes}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>${breakdown.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
