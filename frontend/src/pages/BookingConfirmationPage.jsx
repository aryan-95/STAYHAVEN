import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../api/axios';
import { format } from 'date-fns';
import { FiCheckCircle, FiMapPin, FiCalendar, FiUsers, FiHash, FiPhone, FiMail } from 'react-icons/fi';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${id}`)
      .then(res => setBooking(res.data.booking))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen"><Navbar />
      <div className="page-container py-8 max-w-2xl">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Booking not found</h2>
        <Link to="/my-bookings" className="btn-primary">My Bookings</Link>
      </div>
    </div>
  );

  const nights = booking.nights;
  const property = booking.property;
  const host = booking.host;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="page-container py-8 max-w-2xl">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Booking confirmed!</h1>
          <p className="text-gray-500">Your reservation is all set. Have a wonderful stay!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
          {/* Property image */}
          <div className="aspect-[16/6] overflow-hidden">
            <img src={property?.images?.[0]?.url} alt={property?.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 space-y-5">
            {/* Property title */}
            <div>
              <Link to={`/properties/${property?._id}`} className="text-xl font-display font-bold text-gray-900 hover:text-brand transition-colors">
                {property?.title}
              </Link>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <FiMapPin className="w-3.5 h-3.5" />
                {property?.location?.address}, {property?.location?.city}, {property?.location?.country}
              </div>
            </div>

            {/* Confirmation code */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <FiHash className="w-5 h-5 text-brand" />
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Confirmation code</p>
                <p className="font-bold text-gray-900 text-lg tracking-widest">{booking.confirmationCode}</p>
              </div>
            </div>

            {/* Dates & guests */}
            <div className="grid grid-cols-2 gap-4">
              <InfoBlock icon={FiCalendar} label="Check-in">
                <p className="font-semibold text-gray-900">{format(new Date(booking.checkIn), 'EEE, MMM d, yyyy')}</p>
                <p className="text-sm text-gray-500">After {property?.houseRules?.checkIn || '15:00'}</p>
              </InfoBlock>
              <InfoBlock icon={FiCalendar} label="Check-out">
                <p className="font-semibold text-gray-900">{format(new Date(booking.checkOut), 'EEE, MMM d, yyyy')}</p>
                <p className="text-sm text-gray-500">Before {property?.houseRules?.checkOut || '11:00'}</p>
              </InfoBlock>
              <InfoBlock icon={FiUsers} label="Guests">
                <p className="font-semibold text-gray-900">{booking.totalGuests} guests</p>
                <p className="text-sm text-gray-500">{nights} nights</p>
              </InfoBlock>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-semibold text-gray-900 mb-3">Price breakdown</h3>
              <div className="space-y-2 text-sm">
                <Row label={`$${booking.pricePerNight?.toLocaleString()} × ${nights} nights`} value={`$${booking.subtotal?.toLocaleString()}`} />
                {booking.cleaningFee > 0 && <Row label="Cleaning fee" value={`$${booking.cleaningFee}`} />}
                <Row label="Service fee" value={`$${booking.serviceFee}`} />
                <Row label="Taxes" value={`$${booking.taxes}`} />
                <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-100 text-base">
                  <span>Total charged</span>
                  <span>${booking.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Host info */}
            {host && (
              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-semibold text-gray-900 mb-3">Your host</h3>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-brand flex items-center justify-center flex-shrink-0">
                    {host.avatar
                      ? <img src={host.avatar} alt={host.name} className="w-full h-full object-cover" />
                      : <span className="text-white font-bold">{host.name?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{host.name}</p>
                    <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                      {host.email && <span className="flex items-center gap-1"><FiMail className="w-3 h-3" />{host.email}</span>}
                      {host.phone && <span className="flex items-center gap-1"><FiPhone className="w-3 h-3" />{host.phone}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/my-bookings" className="btn-secondary flex-1 text-center py-3">View all bookings</Link>
          <Link to="/properties" className="btn-primary flex-1 text-center py-3">Explore more stays</Link>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, label, children }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
