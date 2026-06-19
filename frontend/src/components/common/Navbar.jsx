import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiHeart, FiCalendar, FiHome, FiSettings, FiLogOut, FiGrid } from 'react-icons/fi';

export default function Navbar({ transparent = false }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const navClass = transparent && isHome
    ? 'fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-white/20'
    : 'sticky top-0 z-50 bg-white border-b border-gray-100 shadow-nav';

  return (
    <nav className={navClass}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <FiHome className="text-white w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">StayHaven</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/properties" className="btn-ghost text-sm">Explore Stays</Link>
            {user?.role === 'host' || user?.role === 'admin' ? (
              <Link to="/host/dashboard" className="btn-ghost text-sm">Host Dashboard</Link>
            ) : (
              <Link to="/register?become=host" className="btn-ghost text-sm">Become a Host</Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3" ref={menuRef}>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 hover:shadow-md transition-shadow"
                >
                  <FiMenu className="w-4 h-4 text-gray-600" />
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-brand flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <MenuItem icon={FiUser} label="Profile" to="/dashboard" onClick={() => setMenuOpen(false)} />
                    <MenuItem icon={FiCalendar} label="My Bookings" to="/my-bookings" onClick={() => setMenuOpen(false)} />
                    <MenuItem icon={FiHeart} label="Wishlist" to="/wishlist" onClick={() => setMenuOpen(false)} />
                    {(user?.role === 'host' || user?.role === 'admin') && (
                      <MenuItem icon={FiGrid} label="Host Dashboard" to="/host/dashboard" onClick={() => setMenuOpen(false)} />
                    )}
                    {user?.role === 'admin' && (
                      <MenuItem icon={FiSettings} label="Admin Panel" to="/admin" onClick={() => setMenuOpen(false)} />
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <FiLogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1 animate-slide-up">
            <MobileLink to="/properties" onClick={() => setMobileOpen(false)}>Explore Stays</MobileLink>
            {isAuthenticated ? (
              <>
                <MobileLink to="/dashboard" onClick={() => setMobileOpen(false)}>Profile</MobileLink>
                <MobileLink to="/my-bookings" onClick={() => setMobileOpen(false)}>My Bookings</MobileLink>
                <MobileLink to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</MobileLink>
                {(user?.role === 'host' || user?.role === 'admin') && (
                  <MobileLink to="/host/dashboard" onClick={() => setMobileOpen(false)}>Host Dashboard</MobileLink>
                )}
                {user?.role === 'admin' && (
                  <MobileLink to="/admin" onClick={() => setMobileOpen(false)}>Admin Panel</MobileLink>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 font-medium">Sign out</button>
              </>
            ) : (
              <>
                <MobileLink to="/login" onClick={() => setMobileOpen(false)}>Sign in</MobileLink>
                <MobileLink to="/register" onClick={() => setMobileOpen(false)}>Sign up</MobileLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function MenuItem({ icon: Icon, label, to, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
      <Icon className="w-4 h-4 text-gray-500" /> {label}
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg">
      {children}
    </Link>
  );
}
