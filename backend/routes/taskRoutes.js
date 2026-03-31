const express = require("express")
const router = express.Router()
const {getTasks,addTask,deleteTask,updateTask,getReports} = require("../controllers/tasksController")

router.get("/tasks",getTasks)
router.post("/tasks",addTask)
router.delete("/tasks/:id",deleteTask)
router.patch("/tasks/:id",updateTask)
router.get("/tasks/report",getReports)

module.exports = router

