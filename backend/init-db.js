const fs = require("fs");
const { execSync } = require("child_process");

if (!fs.existsSync("tasks.db")) {
  console.log("Initializing database...");
  execSync('sqlite3 tasks.db ".read dump.sql"', { stdio: "inherit" });
} else {
  console.log("Database already exists. Skipping init.");
}
