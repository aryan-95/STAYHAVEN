import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';

export default function SearchBar({ variant = 'hero' }) {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('search', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', guests);
    navigate(`/properties?${params.toString()}`);
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
          <FiMapPin className="text-brand w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Where</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Search destinations"
              className="w-full text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="hidden md:block w-px bg-gray-200 my-2" />

        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
          <FiCalendar className="text-brand w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Check in</label>
            <input
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full text-sm text-gray-800 outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="hidden md:block w-px bg-gray-200 my-2" />

        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
          <FiCalendar className="text-brand w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Check out</label>
            <input
              type="date"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="w-full text-sm text-gray-800 outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="hidden md:block w-px bg-gray-200 my-2" />

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
          <FiUsers className="text-brand w-5 h-5 flex-shrink-0" />
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-0.5">Guests</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-5 h-5 rounded-full border border-gray-300 text-gray-600 hover:border-gray-400 text-xs font-bold flex items-center justify-center">−</button>
              <span className="text-sm font-medium w-6 text-center">{guests}</span>
              <button type="button" onClick={() => setGuests(g => g + 1)} className="w-5 h-5 rounded-full border border-gray-300 text-gray-600 hover:border-gray-400 text-xs font-bold flex items-center justify-center">+</button>
            </div>
          </div>
        </div>

        <button type="submit" className="bg-brand text-white rounded-xl px-6 py-3 font-semibold flex items-center gap-2 hover:bg-primary-700 transition-colors flex-shrink-0">
          <FiSearch className="w-4 h-4" />
          <span className="hidden md:inline">Search</span>
        </button>
      </form>
    );
  }

  // Compact variant for listing page
  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
      <FiSearch className="text-gray-400 w-4 h-4 flex-shrink-0" />
      <input
        type="text"
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="Search location..."
        className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
      />
      <button type="submit" className="bg-brand text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-primary-700 transition-colors">
        Search
      </button>
    </form>
  );
}
