// --- find single user by email ---
export const findUserByEmail = (db, email) =>
  db('users').where({ email }).first();