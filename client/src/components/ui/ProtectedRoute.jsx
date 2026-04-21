import { Navigate } from 'react-router-dom';

// Protect routes if not logged in
export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/signup" replace />
  }

  return children;
}