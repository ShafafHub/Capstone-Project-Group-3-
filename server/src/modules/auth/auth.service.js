import { hashPassword } from '../../utils/hash.js';
import { dbPromise } from '../../config/db.js';

// --- Register user ---
export const registerUser = async (email, password) => {
  const db = await dbPromise;

  email = email.toLowerCase().trim();

  // --- check duplicate email ---
  const existingUser = await db.get(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUser) {
    const error = new Error('This email is already registered');
    error.status = 409
    throw error
  }

  const hashed = await hashPassword(password);

  const result = await db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashed]
  );

  return {
    id: result.lastID,
    email,
  };
};

// --- Login user ---
export const loginUser = async (email, password) => {
  const db = await dbPromise;

  const user = await db.get(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (!user) {
    const error = new Error('User not found');
    error.status = 404
    throw error
  }

  const { comparePassword } = await import('../../utils/hash.js');
  const valid = await comparePassword(password, user.password);

  if (!valid) {
    const error = new Error('Invalid password');
    error.status = 401
    throw error
  }

  return user;
};