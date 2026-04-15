// const db = require("../connection");

// // Create user
// const createUser = (name, email, password, callback) => {
//     const sql = `
//     INSERT INTO users (name, email, password)
//     VALUES (?, ?, ?)
//   `;

//     db.run(sql, [name, email, password], function (err) {
//         callback(err, this?.lastID);
//     });
// };

// // Find user by email
// const findUserByEmail = (email, callback) => {
//     const sql = `SELECT * FROM users WHERE email = ?`;

//     db.get(sql, [email], (err, row) => {
//         callback(err, row);
//     });
// };

// module.exports = {
//     createUser,
//     findUserByEmail,
// };////

const db = require("../connection");

// Create user
const createUser = (name, email, password, callback) => {
    const sql = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;

    db.run(sql, [name, email, password], function (err) {
        callback(err, this?.lastID);
    });
};

// Find user by email
const findUserByEmail = (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;

    db.get(sql, [email], (err, row) => {
        callback(err, row);
    });
};

module.exports = {
    createUser,
    findUserByEmail,
};