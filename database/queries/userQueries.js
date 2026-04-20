import db from "../connection.js";
// Create User
const createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (email, password)
      VALUES (?, ?)
    `;

    db.run(sql, [email, password], function (err) {
      if (err) {
        return reject(new Error("Failed to create user"));
      }

      resolve({
        id: this.lastID,
        email,
      });
    });
  });
};

// Find User by Email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, email, password, created_at 
      FROM users 
      WHERE email = ?
    `;

    db.get(sql, [email], (err, row) => {
      if (err) {
        return reject(new Error("Database error"));
      }

      if (!row) {
        return reject(new Error("User not found"));
      }

      resolve({
        id: row.id,
        email: row.email,
        password: row.password,
        created_at: row.created_at,
      });
    });
  });
};

module.exports = {
  createUser,
  findUserByEmail,
};