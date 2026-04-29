// --- Admin only middleware (without token) ---
export const adminAuthMiddleware = async (req, res, next) => {
  const { email, password } = req.body;
  
  // --- Hardcoded admin credentials ---
  const ADMIN_EMAIL = 'admin@test.com';
  const ADMIN_PASSWORD = '123456'; // Or whatever you have in the database
  
  // --- Check if credentials match admin ---
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.user = { id: 1, email: ADMIN_EMAIL, role: 'admin' };
    return next();
  }
  
  // --- Invalid credentials response ---
  res.status(401).json({ message: 'Invalid admin credentials' });
};