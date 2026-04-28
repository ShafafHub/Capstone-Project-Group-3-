const db = require('../../config/db');

async function getUserById(id) {
    return await db('users')
        .select('id', 'email')
        .where({ id })
        .first();
}

module.exports = {
    getUserById,
};