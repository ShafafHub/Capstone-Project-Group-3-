import jwt from 'jsonwebtoken';

const SECRET = 'secret123';

// --- Generate token ---
export const generateToken = (user) => {
  return jwt.sign({ id: user.id }, SECRET, {
    expiresIn: '7d',
  });
};

// --- Verify token ---
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};