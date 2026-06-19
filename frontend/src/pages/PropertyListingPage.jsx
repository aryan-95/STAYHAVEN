import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropertyCard from '../components/property/PropertyCard';
import FilterSidebar from '../components/property/FilterSidebar';
import SearchBar from '../components/common/SearchBar';
import api from '../api/axios';
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
];

export default function PropertyListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState('createdAt');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    guests: searchParams.get('guests') || '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
  });

  const search = searchParams.get('search') || '';

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.guests) params.set('guests', filters.guests);
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
      if (filters.bathrooms) params.set('bathrooms', filters.bathrooms);
      if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','));

      const [sortBy, order] = sort === 'price_asc' ? ['price', 'asc']
        : sort === 'price_desc' ? ['price', 'desc']
        : sort === 'rating' ? ['rating', 'desc']
        : ['createdAt', 'desc'];

      params.set('sortBy', sortBy);
      params.set('order', order);
      params.set('page', page);
      params.set('limit', 12);

      const res = await api.get(`/properties?${params.toString()}`);
      setProperties(res.data.properties);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } finally {
      setLoading(false);
    }
  }, [search, filters, sort, page]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const activeFilterCount = [
    filters.category, filters.minPrice, filters.maxPrice,
    filters.guests, filters.bedrooms, filters.bathrooms,
    ...(filters.amenities || [])
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Top bar */}
      <div className="border-b border-gray-100 py-4 sticky top-16 lg:top-20 bg-white z-30">
        <div className="page-container flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar variant="compact" />
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors flex-shrink-0"
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 outline-none hover:border-gray-400 transition-colors hidden sm:block"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="page-container mt-3 flex flex-wrap gap-2">
            {filters.category && <FilterChip label={`Type: ${filters.category}`} onRemove={() => setFilters(f => ({ ...f, category: '' }))} />}
            {(filters.minPrice || filters.maxPrice) && (
              <FilterChip label={`$${filters.minPrice || 0}–$${filters.maxPrice || '∞'}`} onRemove={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '' }))} />
            )}
            {filters.guests && <FilterChip label={`${filters.guests}+ guests`} onRemove={() => setFilters(f => ({ ...f, guests: '' }))} />}
            {filters.bedrooms && <FilterChip label={`${filters.bedrooms}+ beds`} onRemove={() => setFilters(f => ({ ...f, bedrooms: '' }))} />}
            {(filters.amenities || []).map(a => (
              <FilterChip key={a} label={a} onRemove={() => setFilters(f => ({ ...f, amenities: f.amenities.filter(x => x !== a) }))} />
            ))}
            <button onClick={() => setFilters({ category: '', minPrice: '', maxPrice: '', guests: '', bedrooms: '', bathrooms: '', amenities: [] })}
              className="text-xs text-gray-500 hover:text-gray-800 underline">Clear all</button>
          </div>
        )}
      </div>

      <div className="flex-1 py-8">
        <div className="page-container">
          {/* Results count */}
          <p className="text-gray-500 text-sm mb-6">
            {loading ? 'Loading...' : `${total.toLocaleString()} ${total === 1 ? 'property' : 'properties'} found${search ? ` for "${search}"` : ''}`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : properties.length === 0 ? (
            <EmptyState onClear={() => setFilters({ category: '', minPrice: '', maxPrice: '', guests: '', bedrooms: '', bathrooms: '', amenities: [] })} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 disabled:opacity-40 transition-colors">
                <FiChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${page === i + 1 ? 'bg-gray-900 text-white' : 'border border-gray-200 hover:border-gray-400 text-gray-700'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-400 disabled:opacity-40 transition-colors">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="w-full max-w-sm bg-white shadow-2xl animate-slide-up">
            <FilterSidebar filters={filters} onChange={f => { setFilters(f); setPage(1); }} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove}><FiX className="w-3 h-3" /></button>
    </span>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="text-center py-24">
      <p className="text-6xl mb-4">🏠</p>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">No properties found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your filters or searching a different location.</p>
      <button onClick={onClear} className="btn-primary">Clear filters</button>
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
