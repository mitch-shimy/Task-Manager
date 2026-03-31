# Task Management App

A task management application with a terminal-inspired interface that organizes tasks into three status columns (PENDING, PROGRESS, DONE). Built using Node.js, Express, SQLite for the backend, and vanilla JavaScript, HTML, and CSS for the frontend.

## Features

- Add tasks with title, priority level (high, medium, low), and due date
- Display tasks in three status columns: PENDING, PROGRESS, DONE
- Move tasks between status columns (pending → in_progress → done)
- Delete tasks (only available for tasks in "done" status)
- Sort tasks by creation date (oldest first or newest first)
- View task counts for each status column
- Generate reports showing task counts by priority and status for tasks created on a specific date
- Due date validation (prevents creating tasks with past due dates)
- Visual indicators for overdue tasks
- Terminal-style user interface

## Project Structure

```
Task Management/
├── backend/
│   ├── controllers/
│   │   └── tasksController.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── services/
│   │   └── taskServices.js
│   ├── database.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── tasks.db
└── frontend/
    ├── index.html
    ├── script.js
    └── styles.css
```

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Local Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The application uses environment variables. A `.env` file is already configured with default values:
   ```
   DB_FILE=tasks.db
   PORT=3000
   ```
   You can modify these values if needed.

4. Start the server:
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000` (or the port specified in `.env`).

### Frontend Setup

1. Open the `frontend/index.html` file in your web browser.

   **Note:** The backend server must be running for the frontend to function properly, as it makes API calls to `http://localhost:3000`.

## Dependencies

### Backend Dependencies

- **express**: ^5.2.1 - Web framework for Node.js
- **sqlite3**: ^6.0.1 - SQLite database driver
- **cors**: ^2.8.6 - Cross-Origin Resource Sharing middleware
- **dotenv**: ^17.3.1 - Environment variable management

### Frontend Dependencies

- **Font Awesome**: ^6.4.0 - Icons (loaded via CDN)
- No additional JavaScript dependencies (vanilla JS)

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
  - Body: `{ "title": "string", "priority": "high|medium|low", "dueDate": "YYYY-MM-DD" }`
- `PATCH /api/tasks/:id` - Update task status
  - Body: `{ "status": "pending|in_progress|done" }`
- `DELETE /api/tasks/:id` - Delete a task by ID (only works for tasks with status "done")
- `GET /api/tasks/report?date=YYYY-MM-DD` - Get task report for tasks created on the specified date
  - Returns: `{ "date": "YYYY-MM-DD", "total": number, "summary": { "high": { "pending": number, "in_progress": number, "done": number }, "medium": {...}, "low": {...} } }`

## Example API Usage

Here are examples of how to interact with the API using curl commands. Replace `http://localhost:3000` with your server URL if different.

### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks
```

### Create a New Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

### Update Task Status
```bash
curl -X PATCH http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

### Delete a Task (only works for tasks with status "done")
```bash
curl -X DELETE http://localhost:3000/api/tasks/{task-id}
```

### Get Task Report for a Specific Date
```bash
curl -X GET "http://localhost:3000/api/tasks/report?date=2024-12-31"
```

### JavaScript Example (using fetch)
```javascript
// Create a new task
const createTask = async (title, priority, dueDate) => {
  try {
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        priority,
        dueDate
      })
    });
    const result = await response.json();
    console.log('Task created:', result);
  } catch (error) {
    console.error('Error creating task:', error);
  }
};

// Update task status
const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    });
    const result = await response.json();
    console.log('Task updated:', result);
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

// Get report for a specific date
const getTaskReport = async (date) => {
  try {
    const response = await fetch(`http://localhost:3000/api/tasks/report?date=${date}`);
    const report = await response.json();
    console.log('Report:', report);
  } catch (error) {
    console.error('Error fetching report:', error);
  }
};
```

## Database Schema

The application uses SQLite with a single `tasks` table:

```sql
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT NOT NULL,
    due_date TEXT,
    created_at TEXT,
    updated_at TEXT
)
```

Tasks are retrieved ordered by priority (high → medium → low) then by due date (earliest first).

## Usage

1. Start the backend server as described in the setup instructions.
2. Open `frontend/index.html` in your browser.
3. Add tasks using the form at the top:
   - Enter a task title
   - Select a priority level (high, medium, low)
   - Set a due date (use quick date buttons for today/tomorrow or select manually)
   - Click "CREATE" or press Enter
4. Tasks appear in the PENDING column.
5. Move tasks to PROGRESS by clicking the arrow button on pending tasks.
6. Move tasks to DONE by clicking the arrow button on in-progress tasks.
7. Delete completed tasks by clicking the trash icon on done tasks.
8. Use the SORT button in the footer to toggle between oldest first and newest first.
9. View task counts for each column in the column headers.
10. Click REPORT in the footer to view task creation statistics for a specific date.

## Development

- Backend code is located in the `backend/` directory.
- Frontend code is located in the `frontend/` directory.
- The database file `tasks.db` is created automatically when the server starts.

## Database Backups

### Creating a Database Dump

A database dump exports the entire database into a SQL file, which can be used to restore or migrate the database later.

To create a dump file, run:
```bash
sqlite3 tasks.db .dump > dump.sql
```

### Troubleshooting: "sqlite3: command not found"

This error occurs because the SQLite command-line tool (`sqlite3` CLI) is not installed on your system. 

**Important distinction:**
- The `sqlite3` npm package (installed in `package.json`) provides Node.js with the ability to use SQLite databases programmatically
- The `sqlite3` command-line tool is a separate utility that must be installed separately on your system

### Installing SQLite CLI

**Windows:**
1. Download the precompiled binary from [sqlite.org](https://www.sqlite.org/download.html)
2. Add the extracted executable to your system PATH, or place it in the project directory

**macOS:**
```bash
brew install sqlite3
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install sqlite3
```

After installation, verify it works:
```bash
sqlite3 --version
```

### Alternative: Database File Backup

If you cannot install the SQLite CLI, you can simply backup the database file directly:
```bash
cp backend/tasks.db backend/tasks.db.backup
```

To restore from a backup:
```bash
cp backend/tasks.db.backup backend/tasks.db
```

