// --- import path module for file handling ---
const path = require('path');

// --- knex configuration for development environment ---
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'dev.sqlite3'),
    },
    useNullAsDefault: true,
  },
};  