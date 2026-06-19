import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BookingBox from '../components/booking/BookingBox';
import ReviewCard from '../components/property/ReviewCard';
import api from '../api/axios';
import { FiStar, FiMapPin, FiUsers, FiHome, FiDroplet, FiBriefcase, FiChevronLeft, FiShare2, FiHeart } from 'react-icons/fi';

const AMENITY_ICONS = {
  'WiFi': '📶', 'Pool': '🏊', 'Kitchen': '🍳', 'AC': '❄️', 'Heating': '🔥',
  'Washer': '🫧', 'Dryer': '🌀', 'Free Parking': '🚗', 'Hot Tub': '♨️',
  'BBQ Grill': '🔥', 'Fireplace': '🪵', 'Gym': '💪', 'Pet Friendly': '🐾',
  'TV': '📺', 'Workspace': '💻', 'Beach Access': '🏖️', 'Ski Access': '⛷️',
  'Breakfast Included': '🥐', 'Garden': '🌿', 'Balcony': '🌅',
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`/properties/${id}`),
      api.get(`/reviews/property/${id}`)
    ]).then(([prop, rev]) => {
      setProperty(prop.data.property);
      setReviews(rev.data.reviews);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="aspect-[16/7] bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🏚️</p>
        <h2 className="text-xl font-semibold mb-2">Property not found</h2>
        <Link to="/properties" className="btn-primary">Browse properties</Link>
      </div>
    </div>
  );

  const images = property.images || [];
  const host = property.host || {};

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-container py-6">
        {/* Back */}
        <Link to="/properties" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-4 group">
          <FiChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to listings
        </Link>

        {/* Title */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {property.rating > 0 && (
                <span className="flex items-center gap-1 font-semibold text-gray-900">
                  <FiStar className="fill-gray-900 stroke-gray-900 w-4 h-4" />
                  {property.rating.toFixed(1)}
                  <span className="text-gray-500 font-normal">({reviews.length} reviews)</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <FiMapPin className="w-3.5 h-3.5" />
                {property.location?.city}, {property.location?.country}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors">
              <FiShare2 className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors">
              <FiHeart className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden aspect-[16/7] mb-10 cursor-pointer" onClick={() => setGalleryOpen(true)}>
          {images.slice(0, 5).map((img, i) => (
            <div key={i} className={`relative overflow-hidden bg-gray-200 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <img src={img.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              {i === 4 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{images.length - 5} more</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 pb-8 border-b border-gray-100">
              <Stat icon={FiUsers} label={`${property.guests} guests`} />
              <Stat icon={FiHome} label={`${property.bedrooms} bedrooms`} />
              <Stat icon={FiBriefcase} label={`${property.beds} beds`} />
              <Stat icon={FiDroplet} label={`${property.bathrooms} bathrooms`} />
            </div>

            {/* Host info */}
            <div className="flex items-center gap-4 py-6 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-brand flex-shrink-0 flex items-center justify-center">
                {host.avatar
                  ? <img src={host.avatar} alt={host.name} className="w-full h-full object-cover" />
                  : <span className="text-white text-xl font-bold">{host.name?.[0]}</span>
                }
              </div>
              <div>
                <p className="font-semibold text-gray-900">Hosted by {host.name}</p>
                <p className="text-sm text-gray-500">Host since {new Date(host.createdAt).getFullYear()}</p>
                {host.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{host.bio}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-3">About this place</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <span className="text-xl">{AMENITY_ICONS[a] || '✓'}</span>
                      <span className="text-sm text-gray-700">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House rules */}
            {property.houseRules && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">House rules</h2>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2"><span>🕐</span> Check-in after {property.houseRules.checkIn}</div>
                  <div className="flex items-center gap-2"><span>🕐</span> Check-out by {property.houseRules.checkOut}</div>
                  {property.houseRules.noSmoking && <div className="flex items-center gap-2"><span>🚭</span> No smoking</div>}
                  {property.houseRules.noParties && <div className="flex items-center gap-2"><span>🎉</span> No parties or events</div>}
                  {!property.houseRules.noPets && <div className="flex items-center gap-2"><span>🐾</span> Pets allowed</div>}
                  {property.houseRules.selfCheckIn && <div className="flex items-center gap-2"><span>🔑</span> Self check-in</div>}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <FiStar className="fill-gray-900 stroke-gray-900 w-5 h-5" />
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  {property.rating > 0 ? `${property.rating.toFixed(1)} · ${reviews.length} reviews` : 'No reviews yet'}
                </h2>
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Be the first to review this property after your stay.</p>
              )}
            </div>
          </div>

          {/* Booking box */}
          <div className="lg:col-span-1">
            <BookingBox property={property} />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
          <button className="absolute top-4 right-4 text-white text-2xl hover:opacity-70 z-10" onClick={() => setGalleryOpen(false)}>✕</button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:opacity-70 z-10"
            onClick={e => { e.stopPropagation(); setGalleryIdx(i => (i - 1 + images.length) % images.length); }}>‹</button>
          <img src={images[galleryIdx]?.url} alt="" className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:opacity-70 z-10"
            onClick={e => { e.stopPropagation(); setGalleryIdx(i => (i + 1) % images.length); }}>›</button>
          <p className="absolute bottom-4 text-white/60 text-sm">{galleryIdx + 1} / {images.length}</p>
        </div>
      )}

      <Footer />
    </div>
  );
}

function Stat({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <Icon className="w-5 h-5 text-gray-400" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
