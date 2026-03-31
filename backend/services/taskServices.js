const db = require("../database")
const crypto = require("crypto")

//Get tasks
const getTasksService = () => {
    return new Promise((resolve,reject)=>{
        const sql = `
        SELECT * FROM tasks
        ORDER BY 
            CASE priority
                WHEN 'high' THEN 3
                WHEN 'medium' THEN 2
                WHEN 'low' THEN 1
            END DESC,
            due_date ASC
         `;
        db.all(sql, [] , (err,tasks) =>{
            if(err) return reject(err)
            resolve(tasks)
        })
    })
}

//Create Task
const addTaskService = (title, dueDate, priority) => {
    return new Promise((resolve, reject) => {

        const validPriorities = ["low", "medium", "high"];

        if (!validPriorities.includes(priority)) {
            return reject(new Error("Invalid priority value"));
        }

        function isOverdue(date) {
            if (!date) return false;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const due = new Date(date);
            due.setHours(0, 0, 0, 0);

            return due < today;
        }

        if (isOverdue(dueDate)) {
            return reject(new Error("Due date cannot be in the past"));
        }

        const checkSql = `
            SELECT * FROM tasks
            WHERE LOWER(title) = LOWER(?)
            AND due_date = ?
        `;

        db.get(checkSql, [title.trim(), dueDate], (err, existingTask) => {
            if (err) return reject(err);

            if (existingTask) {
                return reject(new Error("Task with same title and due date already exists"));
            }

            const sql = `
                INSERT INTO tasks (id, title, status, priority, due_date, created_at, updated_at)
                VALUES (?, ?, 'pending', ?, ?, ?, NULL)
            `;

            const id = crypto.randomUUID();
            const now = new Date().toISOString();

            db.run(sql, [id, title.trim(), priority, dueDate, now], function (err) {
                if (err) return reject(err);

                resolve({
                    id,
                    title,
                    status: "pending",
                    priority,
                    due_date: dueDate,
                    created_at: now,
                    updated_at: null
                });
            });
        });
    });
};

//Remove task
const deleteTaskService = (id) => {
    return new Promise((resolve,reject) =>{
        const selectSql = `SELECT * FROM tasks WHERE id = ?`

        db.get(selectSql, [id], (err,task)=>{
            if(err) return reject(err)
            
            if(!task) return reject(new Error("Task not found"))
            const deletesql = (`DELETE FROM tasks WHERE id = ? AND status = 'done'`)
            db.run(deletesql, [id], function(err){
                if(err) return reject(err)
                resolve(task)
            })
        })
    })
}

//Update task
const updateTaskService = (id, status) => {
    return new Promise((resolve, reject) => {

        const allowedStatuses = ["pending", "in_progress", "done"];

        const sqlFind = `SELECT * FROM tasks WHERE id = ?`;

        db.get(sqlFind, [id], (err, task) => {
            if (err) return reject(err);

            if (!task) {
                return reject(new Error("Task not found"));
            }

            if (status && !allowedStatuses.includes(status)) {
                return reject(new Error("Invalid status value"));
            }

            const updatedStatus = status || task.status;
            const updatedAt = new Date().toISOString();

            const sqlUpdate = `
                UPDATE tasks
                SET status = ?, updated_at = ?
                WHERE id = ?
            `;

            db.run(sqlUpdate, [updatedStatus, updatedAt, id], function (err) {
                if (err) return reject(err);

                db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, updatedTask) => {
                    if (err) return reject(err);

                    resolve(updatedTask);
                });
            });
        });
    });
};
const getReportsService = (date) => {
    return new Promise((resolve, reject) => {

        if (!date) {
            return reject(new Error("Date query parameter is required"));
        }

        const sql = `SELECT * FROM tasks`;

        db.all(sql, [], (err, tasks) => {
            if (err) return reject(err);

            const tasksForDate = tasks.filter(t =>
                new Date(t.created_at).toISOString().slice(0, 10) === date
            );

            const priorities = ["high", "medium", "low"];
            const statuses = ["pending", "in_progress", "done"];

            const summary = {};

            priorities.forEach(priority => {
                summary[priority] = {};

                statuses.forEach(status => {
                    summary[priority][status] = tasksForDate.filter(
                        t => t.priority === priority && t.status === status
                    ).length;
                });
            });

            resolve({
                date,
                total: tasksForDate.length,
                summary
            });
        });
    });
};
module.exports = {
    getTasksService,
    addTaskService,
    deleteTaskService,
    updateTaskService,
    getReportsService
}