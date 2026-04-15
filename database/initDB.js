const fs = require("fs");
const db = require("./connection");

const sql = fs.readFileSync("./database/init.sql", "utf-8");

db.exec(sql, (err) => {
    if (err) {
        console.error("Init DB Error:", err);
    } else {
        console.log("Database initialized ✅");
    }
});