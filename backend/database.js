require ("dotenv").config();
const sqlite3 = require("sqlite3").verbose();

const dbPath = process.env.DB_FILE || "./tasks.db";

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("DB connection error:", err.message);
    } else {
        console.log(`Connected to ${dbPath} database`);
    }
});

// Create table if it doesn't exist
db.run(`
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT NOT NULL,
    due_date TEXT,
    created_at TEXT,
    updated_at TEXT
)
`);

module.exports = db;