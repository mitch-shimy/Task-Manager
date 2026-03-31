require("dotenv").config();
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

function initDB() {
  return new Promise((resolve, reject) => {
    if (process.env.PREFILL_DB === 'true') {
      if (!fs.existsSync("tasks.db")) {
        console.log("Prefilling database...");

        const db = new sqlite3.Database("tasks.db");
        const sql = fs.readFileSync("dump.sql", "utf-8");

        db.exec(sql, (err) => {
          if (err) {
            console.error("DB prefill error:", err);
            reject(err);
          } else {
            console.log("Database prefilling successfully");
            resolve();
          }
          db.close();
        });

      } else {
        console.log("Database already exists. Skipping prefill.");
        resolve();
      }
    } else {
      console.log("Prefill disabled. Normal operations.");
      resolve();
    }
  });
}

module.exports = initDB;

// If run directly (e.g., via prestart), execute the function
if (require.main === module) {
  initDB().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
