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

## Prerequisites

**What You Need Before Starting:**
- Node.js (version 14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)
- Git (for cloning the repository)
- A terminal/command prompt

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
│   ├── init-db.js
│   └── tasks.db
└── frontend/
    ├── index.html
    ├── script.js
    └── styles.css
```

## Getting Started (Local Setup)

### Step 1: Backend Setup

1. Clone or download this repository to your machine

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Check the `.env` file (already configured with defaults):
   ```
   DB_FILE=tasks.db
   PORT=3000
   PREFILL_DB=true
   ```
   - `DB_FILE`: Location of SQLite database
   - `PORT`: Server port (change if 3000 is in use)
   - `PREFILL_DB`: Set to `true` to load sample tasks, `false` for empty database

5. Start the backend server:
   ```bash
   npm start
   ```
   
   You should see:
   ```
   Initializing database...
   Database initialized successfully
   Server running on port 3000
   Connected to tasks.db database
   ```

### Step 2: Frontend Setup

1. Open `frontend/index.html` in your web browser
   - You can double-click the file or right-click → "Open with" → your browser

2. The frontend should now display and be ready to use

**Important:** Keep the backend server running (Step 1) while using the frontend, as all features depend on it.

### Step 3: Verify Everything Works

1. In the frontend, try adding a task:
   - Enter a task title
   - Select a priority
   - Click "CREATE"

2. If it works, you're all set! ✅

## How to Use the Application

Once the backend is running and frontend is open:

1. **Add a Task:**
   - Enter a task title in the input field
   - Select a priority level (high, medium, low)
   - Set a due date (use quick buttons or pick manually)
   - Click "CREATE" or press Enter

2. **View Tasks:**
   - Tasks appear in three columns: PENDING, PROGRESS, DONE
   - Check the column headers to see task counts

3. **Move Tasks Between Columns:**
   - Click the arrow (→) button on a task to move it to the next status
   - Pending → In Progress → Done

4. **Delete a Task:**
   - Completed tasks (in DONE column) have a trash icon
   - Click the trash icon to delete

5. **Sort Tasks:**
   - Click "SORT" in the footer to toggle between oldest and newest first

6. **View Reports:**
   - Click "REPORT" in the footer
   - Select a date to see task statistics for that day
   - View breakdown by priority and status

## API Reference

### Backend Dependencies

- **express**: ^5.2.1 - Web framework for Node.js
- **sqlite3**: ^6.0.1 - SQLite database driver
- **cors**: ^2.8.6 - Cross-Origin Resource Sharing middleware
- **dotenv**: ^17.3.1 - Environment variable management

### API Endpoints

The backend provides these REST API endpoints:

- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
  - Body: `{ "title": "string", "priority": "high|medium|low", "dueDate": "YYYY-MM-DD" }`
- `PATCH /api/tasks/:id` - Update task status
  - Body: `{ "status": "pending|in_progress|done" }`
- `DELETE /api/tasks/:id` - Delete a task (only works for "done" status)
- `GET /api/tasks/report?date=YYYY-MM-DD` - Get task report for a specific date

### Database Schema

SQLite single table:

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

Tasks are ordered by priority (high → medium → low) then by due date (earliest first).

### API Usage Examples

#### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks
```

#### Create a New Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

#### Update Task Status
```bash
curl -X PATCH http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

#### Delete a Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/{task-id}
```

#### Get Task Report
```bash
curl -X GET "http://localhost:3000/api/tasks/report?date=2024-12-31"
```

### JavaScript Example (fetch)

```javascript
// Create a new task
const createTask = async (title, priority, dueDate) => {
  try {
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority, dueDate })
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    console.log('Task updated:', result);
  } catch (error) {
    console.error('Error updating task:', error);
  }
};
```

## Deployment to Railway

### Backend Deployment

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app) and sign up

2. **Link Your Repository**
   - Create a new project and connect your GitHub repository
   - Railway will auto-detect Node.js and install dependencies

3. **Set Environment Variables**
   - In Railway dashboard, go to your service > Variables
   - Add `PREFILL_DB=true` to populate sample data on first deploy
   - Do not add port variable as Railway automatically provides it

4. **Deploy**
   - Push your code to GitHub → Railway auto-deploys
   - Your backend URL will be displayed (e.g., `https://your-app-name.up.railway.app`)

5. **Update Frontend for Production**
   - Edit `frontend/script.js` line 1:
     ```javascript
     const BASE_URL = "https://your-app-name.up.railway.app";
     ```
   - Replace with your actual Railway URL

6. **Database Persistence**
   - Railway automatically persists your SQLite database
   - First deploy with `PREFILL_DB=true` initializes from `dump.sql`
   - If `PREFILL_DB=false`, an empty tasks.db is initialized.

### Frontend Hosting Options

**Option A: GitHub Pages (Recommended for beginners)**
- Push frontend to a GitHub repository
- Go to Settings > Pages > Deploy from main branch
- Update `BASE_URL` in `frontend/script.js` to your Railway backend URL

**Option B: Vercel**
- Connect your frontend repository to Vercel
- Deploy as a static site
- Vercel auto-deploys on push
- Update `BASE_URL` in frontend to your backend URL

**Option C: Netlify**
- Connect your frontend repository to Netlify
- Netlify auto-deploys on push
- Update `BASE_URL` in frontend accordingly

## Development

- Backend code: `backend/` directory
- Frontend code: `frontend/` directory
- Database: Automatically created in `backend/tasks.db`
- Database initialization: Controlled by `backend/init-db.js`

## Troubleshooting

### "Server won't start"

1. Check if port 3000 is in use:
   ```bash
   netstat -an | grep 3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```

2. Change PORT in `.env` to an available port (e.g., 3001)

3. Make sure you're in the `backend` directory before running `npm start`

### "Frontend can't connect to backend"

1. Verify backend is running (check terminal for "Server running on port")
2. Check `BASE_URL` in `frontend/script.js` matches your backend URL
3. For local: should be `http://localhost:3000` (or your custom port)
4. For production: should be your Railway URL (with https://)

### "Database errors"

1. Delete the existing database to reset:
   ```bash
   cd backend
   rm tasks.db  # macOS/Linux
   del tasks.db  # Windows
   npm start
   ```

2. This will reinitialize the database with `dump.sql` if `PREFILL_DB=true`

### Creating a Database Dump

To backup your database:

```bash
sqlite3 backend/tasks.db .dump > backend/backup.sql
```

**Note:** Requires SQLite CLI installed. If not available, simply copy `backend/tasks.db` as a backup.

