// --- Find user by email ---
export const findUserByEmail = (db, email) =>
     db.get('SELECT * FROM users WHERE email = ?', [email])