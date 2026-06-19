import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-8xl font-display font-black text-gray-100 select-none">404</p>
          <p className="text-5xl mb-4">🏚️</p>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like this page packed its bags and left. Let's get you back home.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-primary">Go to homepage</Link>
            <Link to="/properties" className="btn-secondary">Browse stays</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
