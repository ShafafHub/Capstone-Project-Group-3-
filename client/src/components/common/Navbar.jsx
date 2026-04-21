import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? 'bg-black text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`

  return (
    <nav className="w-full bg-white shadow-sm border-b">

      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <div className="text-xl font-bold">
          My Store
        </div>

        {/* Links */}
        <div className="flex items-center gap-2">

          <Link to="/home" className={linkClass('/home')}>
            Home
          </Link>

          <Link to="/products" className={linkClass('/products')}>
            Products
          </Link>

          <Link to="/cart" className={linkClass('/cart')}>
            Cart
          </Link>

        </div>

        {/* Auth buttons */}
        <div className="flex gap-2">
          
        </div>

      </div>
    </nav>
  )
}