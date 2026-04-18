

const db = require("../connection");

// Create user
const createUser = (email, password, callback) => {
    const sql = `
    INSERT INTO users (email, password)
    VALUES (?, ?)
  `;

    db.run(sql, [email, password], function (err) {
        if (err) {
            console.error("DB Error:", err);
        }
        callback(err, this?.lastID);
    });
};

// Find user by email
const findUserByEmail = (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;

    db.get(sql, [email], (err, row) => {
        if (err) {
            console.error("DB Error:", err);
        }

        callback(err, row);
    });
};

module.exports = {
    createUser,
    findUserByEmail,
};