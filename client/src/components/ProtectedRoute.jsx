import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // --- Check for token in localStorage or sessionStorage ---
  const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');

  // --- Redirect to signin if no token exists ---
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // --- Render child routes if authenticated ---
  return <Outlet />;
}