const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

if (!fs.existsSync("tasks.db")) {
  console.log("Initializing database...");

  const db = new sqlite3.Database("tasks.db");

  const sql = fs.readFileSync("dump.sql", "utf-8");

  db.exec(sql, (err) => {
    if (err) {
      console.error("DB init error:", err);
    } else {
      console.log("Database initialized successfully");
    }
    db.close();
  });

} else {
  console.log("Database already exists. Skipping init.");
}
