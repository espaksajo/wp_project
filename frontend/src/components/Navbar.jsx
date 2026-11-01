import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isDark = (location.pathname.startsWith('/events/') && location.pathname !== '/events')
    || location.pathname === '/my-bookings'
    || location.pathname === '/my-events'
    || location.pathname === '/create-event';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#050505]/80 backdrop-blur-md'
            : 'bg-[#F4F4F2]/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className={`text-xl font-bold tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-[#1A1A1A]'
          }`}
        >
          SMS
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:opacity-70 ${
              isDark ? 'text-white' : 'text-[#1A1A1A]'
            }`}
          >
            Events
          </Link>
          
          {user && (
            <>
              <Link
                to="/my-bookings"
                className={`text-sm font-medium transition-colors hover:opacity-70 ${
                  isDark ? 'text-white' : 'text-[#1A1A1A]'
                }`}
              >
                My Bookings
              </Link>
              <Link
                to="/my-events"
                className={`text-sm font-medium transition-colors hover:opacity-70 ${
                  isDark ? 'text-white' : 'text-[#1A1A1A]'
                }`}
              >
                My Events
              </Link>
              <Link
                to="/create-event"
                className={`text-sm font-medium transition-colors hover:opacity-70 ${
                  isDark ? 'text-white' : 'text-[#1A1A1A]'
                }`}
              >
                + List Event
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className={`text-sm ${isDark ? 'text-[#666666]' : 'text-[#888888]'}`}>
                {user.name}
              </span>
              <button
                onClick={logout}
                className={`text-sm font-medium px-4 py-2 rounded transition-all btn-lift ${
                  isDark
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-[#1A1A1A] text-white hover:bg-[#333333]'
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors hover:opacity-70 ${
                  isDark ? 'text-white' : 'text-[#1A1A1A]'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium px-4 py-2 rounded bg-[#FF3B5C] text-white transition-all btn-lift hover:bg-[#e63354]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
