import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SearchBar from '../components/common/SearchBar';
import PropertyCard from '../components/property/PropertyCard';
import api from '../api/axios';
import { FiArrowRight } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'mountain', label: 'Mountain', emoji: '⛰️' },
  { id: 'city', label: 'City', emoji: '🏙️' },
  { id: 'cabin', label: 'Cabin', emoji: '🪵' },
  { id: 'villa', label: 'Villa', emoji: '🏛️' },
  { id: 'treehouse', label: 'Treehouse', emoji: '🌳' },
  { id: 'lake', label: 'Lake', emoji: '🏞️' },
  { id: 'farm', label: 'Farm', emoji: '🌾' },
];

const DESTINATIONS = [
  { name: 'Bali, Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', count: '2,400+ stays' },
  { name: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', count: '3,100+ stays' },
  { name: 'Aspen, USA', img: 'https://images.unsplash.com/photo-1609868851778-9aab6d408427?w=400', count: '890+ stays' },
  { name: 'Tuscany, Italy', img: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400', count: '1,200+ stays' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newest, setNewest] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/properties/featured'),
      api.get('/properties?limit=8&sortBy=createdAt')
    ]).then(([feat, newest]) => {
      setFeatured(feat.data.properties);
      setNewest(newest.data.properties);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600"
            alt="Beautiful property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 py-20 w-full">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Over 50,000 unique properties worldwide
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Find your<br />
              <span className="text-primary-300">perfect</span> stay
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-lg mx-auto">
              Discover handpicked homes, villas, and unique escapes in over 190 countries.
            </p>
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="py-12 border-b border-gray-100">
        <div className="page-container">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/properties?category=${cat.id}`)}
                className="flex flex-col items-center gap-1.5 min-w-[72px] px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200 flex-shrink-0"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured properties */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-1">Editor's picks</p>
                <h2 className="section-title">Featured stays</h2>
              </div>
              <Link to="/properties" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                View all <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featured.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular destinations */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="mb-8">
            <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-1">Trending now</p>
            <h2 className="section-title">Popular destinations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DESTINATIONS.map(dest => (
              <button
                key={dest.name}
                onClick={() => navigate(`/properties?search=${dest.name.split(',')[0]}`)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <p className="font-display font-bold text-white text-lg leading-tight">{dest.name.split(',')[0]}</p>
                  <p className="text-white/70 text-sm">{dest.name.split(',')[1]?.trim()}</p>
                  <p className="text-white/60 text-xs mt-0.5">{dest.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newest properties */}
      <section className="py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-brand text-sm font-semibold uppercase tracking-wider mb-1">Just listed</p>
              <h2 className="section-title">New on StayHaven</h2>
            </div>
            <Link to="/properties?sortBy=createdAt" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
              Browse all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newest.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        </div>
      </section>

      {/* Become a host CTA */}
      <section className="py-20 bg-gray-900">
        <div className="page-container text-center">
          <p className="text-primary-300 text-sm font-semibold uppercase tracking-wider mb-3">Earn extra income</p>
          <h2 className="text-4xl font-display font-bold text-white mb-4">Become a host today</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">Share your space and earn extra income. Hosting is easy with our simple tools and 24/7 support.</p>
          <Link to="/register?become=host" className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors">
            Start hosting <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
}
