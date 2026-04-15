const fs = require("fs");
const path = require("path");
const db = require("./connection");

const initSql = fs.readFileSync(
    path.resolve(__dirname, "init.sql"),
    "utf-8"
);

db.exec(initSql, (err) => {
    if (err) {
        console.error("Error initializing DB:", err.message);
    } else {
        console.log("Database initialized successfully");
    }
}); 