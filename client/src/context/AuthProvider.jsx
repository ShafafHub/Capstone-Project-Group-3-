import { useState } from 'react';
import { AuthContext } from './auth.context';

export function AuthProvider({ children }) {
  // --- Initialize userId from localStorage ---
  const [userId, setUserId] = useState(() => {
    const saved = localStorage.getItem('user_id');
    return saved ? parseInt(saved) : 1;
  });

  // --- Login function ---
  const login = (id) => {
    setUserId(id);
    localStorage.setItem('user_id', id);
  };

  // --- Logout function ---
  const logout = () => {
    setUserId(null);
    localStorage.removeItem('user_id');
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
}