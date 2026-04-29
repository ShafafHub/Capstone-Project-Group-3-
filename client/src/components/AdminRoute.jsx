import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminRoute() {
  const token = localStorage.getItem('token');
  const location = useLocation();

  let isAdmin = false;
  let isValid = true;

  // --- Check if token exists ---
  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // --- Decode token and check admin role ---
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    isAdmin = payload.role === 'admin';
  } catch {
    isValid = false;
  }

  // --- Invalid token ---
  if (!isValid) {
    return <Navigate to="/signin" replace />;
  }

  // --- Not an admin ---
  if (!isAdmin) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // --- Admin is authenticated ---
  return <Outlet />;
}