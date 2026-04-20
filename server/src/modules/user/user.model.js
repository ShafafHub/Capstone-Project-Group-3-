export const getUserById = (db, id) =>
    db.get('SELECT id, email FROM users WHERE id = ?', [id]);