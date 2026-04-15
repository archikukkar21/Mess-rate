import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg
        ${isActive(to)
          ? 'text-brand-400 bg-brand-500/10'
          : 'text-white/60 hover:text-white hover:bg-white/5'}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-lg">
              🍽️
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Mess<span className="text-brand-400">Rate</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/reviews">Reviews</NavLink>
            <NavLink to="/stats">Stats</NavLink>
            {user && <NavLink to="/submit-review">Rate Meal</NavLink>}
            {user && <NavLink to="/my-reviews">My Reviews</NavLink>}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/80 font-medium">{user.fullName?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-sm text-white/40 hover:text-red-400 transition-colors px-2 py-1.5">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-xl px-4 py-3 space-y-1 animate-fade-in">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/reviews">Reviews</NavLink>
          <NavLink to="/stats">Stats</NavLink>
          {user && <NavLink to="/submit-review">Rate Meal</NavLink>}
          {user && <NavLink to="/my-reviews">My Reviews</NavLink>}
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          <div className="pt-2 border-t border-white/10 flex gap-2">
            {user ? (
              <button onClick={handleLogout} className="text-sm text-red-400 px-3 py-2">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
