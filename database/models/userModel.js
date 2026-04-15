const userQueries = require("../queries/userQueries");

const createUser = (user) => {
    return new Promise((resolve, reject) => {
        userQueries.createUser(
            user.name,
            user.email,
            user.password,
            (err, id) => {
                if (err) reject(err);
                else resolve(id);
            }
        );
    });
};

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        userQueries.findUserByEmail(email, (err, user) => {
            if (err) reject(err);
            else resolve(user);
        });
    });
};

module.exports = {
    createUser,
    findUserByEmail,
};