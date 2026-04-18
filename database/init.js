const fs = require("fs");
const path = require("path");
const db = require("./connection");

const initPath = path.resolve(__dirname, "init.sql");
fs.readFile(initPath, "utf-8", (err, sql) => {
    if (err) {
        console.error("Failed to read init.sql:", err.message);
        return;
    }
    db.exec(sql, (err) => {
        if (err) {
            console.error("Error initializing DB:", err.message);
        }
        else {
            console.log("Database initialized successfully");
        }
    });
});
