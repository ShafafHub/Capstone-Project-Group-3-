// --- components/Navbar.js - Fixed version with clickable Cart link ---
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import heart from '../../assets/heart.png';
import bag from '../../assets/bag.png';
import user from '../../assets/user.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // --- Get token ---
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // --- Extract user email from token ---
  const userEmail = useMemo(() => {
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.email || payload?.user?.email || '';
    } catch {
      return '';
    }
  }, [token]);

  // --- Close user menu when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Active link class helper ---
  const linkClass = (path) =>
    `text-[14px] tracking-[2px] ${
      location.pathname === path
        ? 'text-black font-medium'
        : 'text-gray-500'
    }`;

  return (
    <>
      <nav className="w-full bg-[#f2f2f2] relative z-50">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 lg:px-10 py-6">
          
          {/* --- LEFT SECTION --- */}
          <div className="flex items-center gap-10">
            {/* --- Mobile menu button --- */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden flex flex-col gap-[5px]"
            >
              <span className="w-6 h-[2px] bg-black"></span>
              <span className="w-6 h-[2px] bg-black"></span>
              <span className="w-6 h-[2px] bg-black"></span>
            </button>

            {/* --- Desktop navigation links --- */}
            <div className="hidden md:flex items-center gap-10">
              <Link to="/home" className={linkClass('/home')}>
                Home
              </Link>
              <Link to="/collections" className={linkClass('/collections')}>
                Collections
              </Link>
              <Link to="/new" className={linkClass('/new')}>
                New
              </Link>
            </div>
          </div>

          {/* --- CENTER LOGO --- */}
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 rotate-45 bg-black opacity-80"></div>
          </div>

          {/* --- RIGHT SECTION --- */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* --- Heart button → Favorites --- */}
            <Link to="/favorites">
              <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black/5 transition-colors">
                <img src={heart} alt="favorites" className="w-5 h-5" />
              </button>
            </Link>

            {/* --- Cart text - Now clickable link to /cart --- */}
            <Link to="/cart">
              <span className="hidden sm:block text-xs bg-black text-white px-3 py-1 rounded-full tracking-wide cursor-pointer hover:bg-gray-800 transition">
                Cart
              </span>
            </Link>

            {/* --- Bag button → Bag --- */}
            <Link to="/bag">
              <button className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-black/5 transition-colors">
                <img src={bag} alt="checkout" className="w-5 h-5" />
              </button>
            </Link>

            {/* --- User button → Profile with dropdown --- */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="w-9 h-9 rounded-full border flex items-center justify-center text-sm hover:bg-black/5 transition-colors"
                aria-haspopup="menu"
                aria-expanded={showUserMenu}
              >
                <img src={user} alt="profile" className="w-4 h-4" />
              </button>

              {/* --- User dropdown menu --- */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userEmail || 'User'}
                    </p>
                  </div>

                  {/* --- Logout button --- */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      localStorage.removeItem('token');
                      sessionStorage.removeItem('token');
                      localStorage.removeItem('remember_me');
                      // Force navigation out of protected routes immediately
                      setTimeout(() => {
                        navigate('/signin', { replace: true });
                      }, 0);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* --- MOBILE MENU (sidebar) --- */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-6 py-6 border-b">
          <span className="tracking-[4px] font-semibold">MENU</span>
          <button onClick={() => setOpen(false)} className="text-2xl">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-8 px-6 py-10 text-[18px] tracking-[2px]">
          <Link to="/home" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/collections" onClick={() => setOpen(false)}>
            Collections
          </Link>
          <Link to="/new" onClick={() => setOpen(false)}>
            New
          </Link>
          <div className="border-t pt-6 mt-6 text-gray-500 text-sm leading-7">
            MEN <br />
            WOMEN <br />
            KIDS
          </div>
        </div>
      </div>
    </>
  );
}