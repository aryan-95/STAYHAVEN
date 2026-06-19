import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropertyCard from '../components/property/PropertyCard';
import api from '../api/axios';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/wishlist')
      .then(res => setWishlist(res.data.wishlist || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 page-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Saved properties</h1>
          {!loading && <p className="text-gray-500 mt-1">{wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'} saved</p>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">❤️</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved properties yet</h3>
            <p className="text-gray-500 mb-6">Tap the heart on any listing to save it here.</p>
            <Link to="/properties" className="btn-primary">Start exploring</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(p => <PropertyCard key={p._id} property={p} showWishlist={true} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
