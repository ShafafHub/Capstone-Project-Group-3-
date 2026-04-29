import jwt from 'jsonwebtoken';

const SECRET = 'secret123';

// --- Generate JWT token for user ---
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: '7d' }
  );
};

// --- Verify JWT token ---
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};