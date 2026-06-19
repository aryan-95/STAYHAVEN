import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function PropertyCard({ property, showWishlist = true }) {
  const { user, isAuthenticated } = useAuth();
  const [imgIndex, setImgIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(
    user?.wishlist?.includes(property._id) || false
  );
  const [loading, setLoading] = useState(false);

  const images = property.images || [];
  const mainImg = images[imgIndex]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600';

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Sign in to save properties'); return; }
    setLoading(true);
    try {
      await api.post(`/users/wishlist/${property._id}`);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/properties/${property._id}`} className="group block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={mainImg}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white w-3' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); setImgIndex(i => (i - 1 + images.length) % images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm text-gray-700 font-bold text-xs"
            >‹</button>
            <button
              onClick={(e) => { e.preventDefault(); setImgIndex(i => (i + 1) % images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm text-gray-700 font-bold text-xs"
            >›</button>
          </>
        )}

        {showWishlist && (
          <button
            onClick={handleWishlist}
            disabled={loading}
            className="absolute top-3 right-3 p-2 rounded-full transition-all"
          >
            <FiHeart
              className={`w-5 h-5 transition-all ${wishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-white fill-black/20 hover:fill-black/30'}`}
            />
          </button>
        )}

        <div className="absolute top-3 left-3">
          <span className="bg-white text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize shadow-sm">
            {property.category}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 flex-1">
            {property.title}
          </h3>
          {property.rating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <FiStar className="w-3.5 h-3.5 fill-gray-900 stroke-gray-900" />
              <span className="text-sm font-medium text-gray-900">{property.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <FiMapPin className="w-3 h-3 flex-shrink-0" />
          <span className="line-clamp-1">{property.location?.city}, {property.location?.country}</span>
        </div>

        <p className="text-gray-500 text-sm">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''} · {property.guests} guests</p>

        <p className="text-sm mt-1">
          <span className="font-semibold text-gray-900">${property.pricePerNight?.toLocaleString()}</span>
          <span className="text-gray-500"> / night</span>
        </p>
      </div>
    </Link>
  );
}
