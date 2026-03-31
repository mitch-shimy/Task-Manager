const db = require("../database")
const {getTasksService,addTaskService,deleteTaskService,updateTaskService,getReportsService} = require("../services/taskServices")

const getTasks = async (req, res) => {

    try{
        const tasks = await getTasksService()
        return res.status(200).json({
            message: tasks.length === 0 ? "No tasks found" : "Tasks fetched successfully",
            tasks
        });
    }catch(error){
        return res.status(500).json({ message: err.message });
    }
};

const addTask = async (req, res) => {
    
    try{
        const { title, dueDate, priority } = req.body;
        const newTask = await addTaskService(title, dueDate, priority)
        return res.status(201).json({
        message: "Task created successfully",
        newTask
        });
    }catch(error){
        if (err.message === "Due date cannot be in the past" || err.message === "Invalid priority value") {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }
};

const deleteTask = async (req, res) => {
    try{
        const id = req.params.id;
        const deleted = await deleteTaskService(id)
        return res.status(200).json({
        message: "Task deleted successfully",
        deleted
        });

    }catch(error){
        if (err.message === "Task not found") {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const updatedTask = await updateTaskService(id, status);

        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (err) {

        if (err.message === "Task not found") {
            return res.status(404).json({ message: err.message });
        }

        if (err.message === "Invalid status value") {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }
};

const getReports = async (req, res) => {
    try {
        const { date } = req.query;

        const report = await getReportsService(date);

        return res.status(200).json({
            message: "Report fetched successfully",
            ...report
        });

    } catch (err) {

        if (err.message === "Date query parameter is required") {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getTasks,
    addTask,
    deleteTask,
    updateTask,
    getReports
}