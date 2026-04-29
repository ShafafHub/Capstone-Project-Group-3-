import bcrypt from 'bcryptjs';

// --- Hash password (prevents crash) ---
export const hashPassword = async (password) => {
  if (!password) throw new Error('Password is required for hashing');
  return await bcrypt.hash(password, 10);
};

// --- Compare password with hash ---
export const comparePassword = async (password, hash) => {
  if (!password || !hash) {
    throw new Error('Password or hash is missing');
  }

  return await bcrypt.compare(password, hash);
};