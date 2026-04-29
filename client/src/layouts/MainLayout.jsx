import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  const location = useLocation();

  // --- Show footer only on home page ---
  const showFooter = location.pathname === '/home';

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {showFooter && <Footer />}

    </div>
  );
}