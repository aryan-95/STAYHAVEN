import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const CATEGORIES = ['beach', 'mountain', 'city', 'countryside', 'lake', 'cabin', 'villa', 'apartment', 'treehouse'];
const AMENITIES = ['WiFi', 'Pool', 'Kitchen', 'AC', 'Heating', 'Washer', 'Dryer', 'Free Parking', 'Hot Tub', 'BBQ Grill', 'Fireplace', 'Gym', 'Pet Friendly', 'Workspace'];

export default function FilterSidebar({ filters, onChange, onClose }) {
  const [local, setLocal] = useState(filters);

  const set = (key, val) => setLocal(p => ({ ...p, [key]: val }));

  const toggleAmenity = (amenity) => {
    const current = local.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    set('amenities', updated);
  };

  const apply = () => { onChange(local); onClose?.(); };
  const reset = () => {
    const empty = { category: '', minPrice: '', maxPrice: '', guests: '', bedrooms: '', bathrooms: '', amenities: [] };
    setLocal(empty);
    onChange(empty);
    onClose?.();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="font-display font-semibold text-lg">Filters</h3>
        {onClose && <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><FiX /></button>}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Category */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Property type</h4>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => set('category', local.category === cat ? '' : cat)}
                className={`px-3 py-1.5 rounded-full border text-sm font-medium capitalize transition-all ${
                  local.category === cat
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Price range (per night)</h4>
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input type="number" min="0" value={local.minPrice} onChange={e => set('minPrice', e.target.value)}
                  className="input-field pl-7" placeholder="0" />
              </div>
            </div>
            <span className="text-gray-400 mt-5">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input type="number" min="0" value={local.maxPrice} onChange={e => set('maxPrice', e.target.value)}
                  className="input-field pl-7" placeholder="1000" />
              </div>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Rooms & guests</h4>
          <div className="space-y-3">
            {[
              { label: 'Guests', key: 'guests' },
              { label: 'Bedrooms', key: 'bedrooms' },
              { label: 'Bathrooms', key: 'bathrooms' },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{label}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => set(key, Math.max(0, (Number(local[key]) || 0) - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-gray-800 transition-colors flex items-center justify-center font-bold">−</button>
                  <span className="w-6 text-center text-sm font-medium">{local[key] || 'Any'}</span>
                  <button onClick={() => set(key, (Number(local[key]) || 0) + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-gray-800 transition-colors flex items-center justify-center font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map(amenity => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(local.amenities || []).includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-4 h-4 rounded border-gray-300 text-brand accent-brand"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 flex gap-3">
        <button onClick={reset} className="btn-secondary flex-1 text-sm py-2.5">Clear all</button>
        <button onClick={apply} className="btn-primary flex-1 text-sm py-2.5">Apply filters</button>
      </div>
    </div>
  );
}
