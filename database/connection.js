const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// 1. Path Configuration (configurable + absolute)
const dbPath = process.env.DB_PATH || path.resolve(__dirname, "app.db");

// 2. Ensure DB file exists
if (!fs.existsSync(dbPath)) {
    console.log("Database file not found. Creating...");
}

// 3. Create single reusable connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database");

        // 4. Validation: check writable
        fs.access(dbPath, fs.constants.W_OK, (err) => {
            if (err) {
                console.error("Database is not writable");
            } else {
                console.log("Database is writable");
            }
        });
    }
});

// 5. Recommended settings with error handling
db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON", (err) => {
        if (err) console.error("PRAGMA foreign_keys error:", err.message);
    });

    db.run("PRAGMA journal_mode = WAL", (err) => {
        if (err) console.error("PRAGMA journal_mode error:", err.message);
    });
});

// 6. Graceful shutdown with error handling
process.on("exit", () => {
    db.close((err) => {
        if (err) {
            console.error("Error closing database:", err.message);
        } else {
            console.log("Database connection closed");
        }
    });
});

module.exports = db;