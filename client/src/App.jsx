import { Routes, Route, Navigate } from 'react-router-dom';

// --- Page imports ---
import New from './pages/New.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Bag from './pages/Bag.jsx';
import Shipping from './pages/Shipping.jsx';
import Men from './pages/Men.jsx';
import Women from './pages/Women.jsx';
import Kids from './pages/Kids.jsx';
import Payment from './pages/Payment.jsx';
import Favorites from './pages/Favorites';

// --- Component imports ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';

export default function App() {

  // --- Check authentication status ---
  const isAuth = localStorage.getItem('token') || sessionStorage.getItem('token');

  return (
    <AuthProvider>
      <Routes>

        {/* --- Root redirect based on auth status --- */}
        <Route
          path="/"
          element={
            isAuth
              ? <Navigate to="/home" replace />
              : <Navigate to="/signin" replace />
          }
        />

        {/* --- Public auth routes (redirect if already logged in) --- */}
        <Route
          path="/signin"
          element={isAuth ? <Navigate to="/home" replace /> : <SignIn />}
        />

        <Route
          path="/signup"
          element={isAuth ? <Navigate to="/home" replace /> : <SignUp />}
        />

        {/* --- Protected routes (require authentication) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Main pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/collections" element={<Products />} />
            <Route path="/new" element={<New />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/kids" element={<Kids />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Cart and checkout flow */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/bag" element={<Bag />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            
            {/* Favorites */}
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Route>

        {/* --- Admin route (unprotected for now) --- */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* --- Fallback route for unknown paths --- */}
        <Route
          path="*"
          element={
            isAuth
              ? <Navigate to="/home" replace />
              : <Navigate to="/signin" replace />
          }
        />

      </Routes>
    </AuthProvider>
  );
}