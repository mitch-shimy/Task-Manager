const BASE_URL = "http://localhost:3000";
const AppState = {
    tasks: [],
    loading: true,
    error: null,
    report: {
        data: {},
        loading: true,
        error: null
    }
}

const StorageService = {
    async loadTasks() {
        try{
            AppState.loading = true
            AppState.error = null

            const response = await fetch(`${BASE_URL}/api/tasks`)
            const data = await response.json()
            return data.tasks ?? [];
        }catch(error){
            AppState.error = error
            console.log(error)
            return []
        }finally{
            AppState.loading = false
        }

    }
};

const TaskManager = {
    add: async function(title, priority, dueDate) {
        if (!title || !priority) {
            throw new Error("Please provide Task title")
        }

        if (helpers.isOverDue(dueDate)) {
            throw new Error("Due date cannot be in the past")
        }

        const res = await fetch(`${BASE_URL}/api/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, priority, dueDate })
        })

        if (!res.ok) {
            const data = await res.json()
            throw new Error(data.message || "Failed to create task")
        }
    },
    delete: async function(id) {
        if(!id) return
        try{
            const res = await fetch(`${BASE_URL}/api/tasks/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            }
        }catch(error){
            console.log(error)
        }
    },
    updatestatus: async function(id, status) {
        if(!id || !status) return

        try{
            await fetch(`${BASE_URL}/api/tasks/${id}`,{
                method: "PATCH",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({status})
            })
        }catch(error){
            console.log(error)
        }
    },
    fetchReport: async function (date) {
        if(!date) {
            AppState.report.error = "Please select a date"
            return
        }

        try {
            AppState.report.loading = true
            AppState.report.error = null
            const response = await fetch(`${BASE_URL}/api/tasks/report?date=${date}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch report");
            }
            AppState.report.data = data
            
        } catch (error) {
            AppState.report.error = error
            console.error(error);               
        } finally {
            AppState.report.loading = false 
        }

    },
    getCompletedTasks: function() {
        if (AppState.tasks.length === 0) return [];
        return AppState.tasks.filter(task => task.status === "done");
    },

    getProgressTasks: function() {
        if (AppState.tasks.length === 0) return [];
        return AppState.tasks.filter(task => task.status === "in_progress");
    },
    getPendingTasks: function() {
        if (AppState.tasks.length === 0) return [];
        return AppState.tasks.filter(task => task.status === "pending");
    },

    sort: function(data, direction = "ascending") {
        if (data.length === 0) return [];

        if (direction === "ascending") {
            return [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        if (direction === "descending") {
            return [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        return data;
    }
}

const helpers = {
    setQuickDate: function (daysToAdd) {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        DOM.dueDate.value = `${year}-${month}-${day}`;
    },
    isOverDue: function (dueDate) {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        return due < today;
    },
    formatDate: function (dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
}

const DOM = {
    input: {
        title: document.getElementById("task-input")
    },
    priority: document.getElementById("priority-select"),
    dueDate: document.getElementById("due-date-input"),
    quickDateBtns: document.querySelectorAll(".quick-date-btn"),
    buttons: {
        addtask: document.getElementById("add-task-btn"),
    },
    count: {
        pending: document.getElementById("pending-count"),
        progress: document.getElementById("progress-count"),
        done: document.getElementById("done-count"),
        total: document.getElementById("total-tasks")
    },
    columns: {
        pending: document.getElementById("pending"),
        progress: document.getElementById("progress"),
        done: document.getElementById("done")
    },
    list: {
        pending: document.getElementById("pending-list"),
        progress: document.getElementById("progress-list"),
        done: document.getElementById("done-list")
    },
    sort: document.getElementById("sort"),
    board: document.querySelector(".board"),
    reportBtn: document.getElementById("report-btn"),
    reportModal: document.getElementById("report-modal"),
    closeModal: document.getElementById("close-modal"),
    fetchReport: document.getElementById("fetch-report"),
    reportDate: document.getElementById("report-date"),
    reportContent: document.getElementById("report-content"),
    loadingState: document.querySelector(".add-panel .report-loading"),
    errorState: document.querySelector(".add-panel .report-error")
}

const populateDOM = {
    renderStats: function() {
        DOM.count.pending.textContent = TaskManager.getPendingTasks().length || 0
        DOM.count.progress.textContent = TaskManager.getProgressTasks().length || 0
        DOM.count.done.textContent = TaskManager.getCompletedTasks().length || 0
        DOM.count.total.textContent = AppState.tasks.length || 0
    },
    renderTasklist: function(data) {
        DOM.list.pending.innerHTML = ""
        DOM.list.progress.innerHTML = ""
        DOM.list.done.innerHTML = ""
        DOM.loadingState.classList.remove("active")

        if(AppState.error){
            DOM.errorState.classList.add("active")
            DOM.errorState.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${AppState.error?.message}`;
        } else {
            DOM.errorState.classList.remove("active")
        }
        if (TaskManager.getPendingTasks().length === 0) {
            DOM.list.pending.innerHTML = `
                <div class="empty-state" style="display: block;">
                    <i class="fas fa-archive"></i>
                    NO TASKS ADDED
                </div>
            `
        }

        if (TaskManager.getCompletedTasks().length === 0) {
            DOM.list.done.innerHTML = `
                <div class="empty-state" style="display: block;">
                    <i class="fas fa-archive"></i>
                    NO COMPLETED TASKS
                </div>
            `
        }

        if (TaskManager.getProgressTasks().length === 0) {
            DOM.list.progress.innerHTML = `
                <div class="empty-state" style="display: block;">
                    <i class="fas fa-terminal"></i>
                    NO ACTIVE TASKS
                </div>
            `
        }

        if(AppState.loading){
            DOM.loadingState.classList.add("active")
            DOM.loadingState.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading data...';
        }


        data.forEach(task => {
            const { id, title, status, created_at, updated_at, priority, due_date } = task

            const createdAt = helpers.formatDate(created_at);
            const updatedAt = updated_at ? helpers.formatDate(updated_at) : null;
            const dueDateFormatted = due_date ? helpers.formatDate(due_date) : null;
            const overdue = due_date ? helpers.isOverDue(due_date) : false;

            const taskCard = document.createElement("div")
            taskCard.setAttribute("class", "task-card")
            if (overdue && status !== "done") {
                taskCard.classList.add("overdue")
            }
            taskCard.setAttribute("id", id)
            
            let priorityClass = ""
            if (priority === "high") priorityClass = "priority-high"
            else if (priority === "medium") priorityClass = "priority-medium"
            else if (priority === "low") priorityClass = "priority-low"
            
            taskCard.innerHTML = `
                <div class="task-title">
                    ${title}
                    <span class="priority-badge ${priorityClass}">${priority.toUpperCase()}</span>
                    ${dueDateFormatted ? `<span class="due-date-badge ${overdue && status !== "done" ? 'overdue' : ''}">Due: <i class="far fa-calendar-alt"></i> ${dueDateFormatted}</span>` : ''}
                </div>
            `

            const taskMeta = document.createElement("div")
            taskMeta.setAttribute("class", "task-meta")
            taskMeta.innerHTML = `
                <div class="task-info">
                    <div class="task-timestamp">
                        <i class="far fa-clock"></i>
                        <span> Created: ${createdAt}</span>
                    </div>
                    ${updatedAt ? `                        
                    <div class="task-timestamp">
                        <i class="far fa-edit"></i>
                        <span> Updated: ${updatedAt}</span>
                    </div>
                    ` : ""}
                </div>
            `
            const taskActions = document.createElement("div")
            taskActions.setAttribute("class", "task-actions")
            const updateProgressBtn = document.createElement("button")

            if (status === "pending") {
                updateProgressBtn.setAttribute("id", "progress-btn")
            } else if (status === "in_progress") {
                updateProgressBtn.setAttribute("id", "done-btn")
            }
            updateProgressBtn.classList.add("task-btn", "move")
            updateProgressBtn.innerHTML = `<i class="fas fa-arrow-right"></i>`

            const deleteBtn = document.createElement("button")

            if(status === "done"){
                deleteBtn.setAttribute("id", "delete-btn")
                deleteBtn.classList.add("task-btn", "delete")
                deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`

                taskActions.appendChild(deleteBtn)
            }

            taskActions.appendChild(updateProgressBtn)
            
            taskMeta.appendChild(taskActions)
            taskCard.appendChild(taskMeta)

            if (status === "pending") {
                DOM.list.pending.appendChild(taskCard)
            }
            if (status === "in_progress") {
                DOM.list.progress.appendChild(taskCard)
            }
            if (status === "done") {
                DOM.list.done.appendChild(taskCard)
                updateProgressBtn.setAttribute("disabled", "")
            }
        })
    },


    renderReport: function (reportData) {
        if (AppState.report.error) {
            DOM.reportContent.innerHTML = `<div class="report-error"><i class="fas fa-exclamation-triangle"></i> Error: ${AppState.report.error.message}</div>`;
            return
        }
        
        if(AppState.report.loading){
            DOM.reportContent.innerHTML = '<div class="report-loading"><i class="fas fa-spinner fa-spin"></i> Loading report...</div>';                    
        }        

        const { date, total, summary } = reportData;
        const priorities = ["high", "medium", "low"];
        const statuses = ["pending", "in_progress", "done"];
        const statusLabels = {
            pending: "PENDING",
            in_progress: "IN_PROGRESS",
            done: "DONE"
        };
        
        let html = `
            <div class="report-total">
                <i class="fas fa-calendar-day"></i> ${date} &nbsp;|&nbsp;
                <i class="fas fa-tasks"></i> TOTAL TASKS: ${total}
            </div>
            <div class="report-summary">
        `;
        
        priorities.forEach(priority => {
            const priorityUpper = priority.toUpperCase();
            html += `
                <div class="priority-section">
                    <div class="priority-header">
                        <span class="priority-badge priority-${priority}">${priorityUpper}</span>
                    </div>
                    <div class="status-grid">
            `;
            
            statuses.forEach(status => {
                const count = summary[priority]?.[status] || 0;
                html += `
                    <div class="status-item">
                        <div class="status-label">${statusLabels[status]}</div>
                        <div class="status-count">${count}</div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        DOM.reportContent.innerHTML = html;
    }
}

function render(){
    populateDOM.renderStats()
    populateDOM.renderTasklist(AppState.tasks)
}

async function afterStateChange() {
    AppState.loading = true;
    render();
    AppState.tasks = await StorageService.loadTasks();
    render();
}

function initEventListeners() {
    // Set default due date to today
    helpers.setQuickDate(0);
    
    // Set default report date to today
    const today = new Date().toISOString().split('T')[0];
    DOM.reportDate.value = today;
    
    // Quick date buttons
    DOM.quickDateBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const days = parseInt(btn.getAttribute("data-days"));
            helpers.setQuickDate(days);
        });
    });
    
    // Add Task
    DOM.buttons.addtask.addEventListener("click", async () => {
        const title = DOM.input.title.value.toUpperCase().trim()
        const priority = DOM.priority.value
        const dueDate = DOM.dueDate.value
        try {
            await TaskManager.add(title, priority, dueDate)

            DOM.input.title.value = ""
            afterStateChange()

        } catch (error) {
            AppState.error = error
            render()
        }
    })
    DOM.input.title.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            const title = DOM.input.title.value.toUpperCase().trim()
            const priority = DOM.priority.value
            const dueDate = DOM.dueDate.value
            if(!title) return
            try {
                await TaskManager.add(title, priority, dueDate)

                DOM.input.title.value = ""
                afterStateChange()

            } catch (error) {
                AppState.error = error
                render()
            }
        }
    })

    //Task Actions
    DOM.board.addEventListener("click", async (e)=>{
        const item = e.target.closest(".task-card")
        if(!item) return
        const id = item.id

        //Delete Task
        if(e.target.closest(".delete")){
            await TaskManager.delete(id)
            afterStateChange()
            return                
        }

        //Update Status
        if(e.target.closest("#progress-btn")){
            await TaskManager.updatestatus(id, "in_progress")
            afterStateChange()
            return  
        }
        if(e.target.closest("#done-btn")){
            await TaskManager.updatestatus(id, "done")
            afterStateChange()
            return  
        }
    })

    // Sort
    DOM.sort.addEventListener("click", (e) => {
        if (e.target.innerText === " SORT: OLDEST FIRST") {
            e.target.lastChild.data = " SORT: NEWEST FIRST"
            populateDOM.renderTasklist(TaskManager.sort(AppState.tasks, "ascending"))
        } else if (e.target.innerText === " SORT: NEWEST FIRST") {
            e.target.lastChild.data = " SORT: OLDEST FIRST"
            populateDOM.renderTasklist(TaskManager.sort(AppState.tasks, "descending"))
        }
    })
    
    // Report modal
    DOM.reportBtn.addEventListener("click", async () => {
        DOM.reportModal.classList.add("active");
        await TaskManager.fetchReport(DOM.reportDate.value);
        populateDOM.renderReport(AppState.report.data);
    });
    
    DOM.closeModal.addEventListener("click", () => {
        DOM.reportModal.classList.remove("active");
    });
    
    DOM.fetchReport.addEventListener("click", async () => {
        await TaskManager.fetchReport(DOM.reportDate.value);
        populateDOM.renderReport(AppState.report.data);
    });
    
    // Close modal when clicking outside
    DOM.reportModal.addEventListener("click", (e) => {
        if (e.target === DOM.reportModal) {
            DOM.reportModal.classList.remove("active");
        }
    });
}

// INITIALIZE
document.addEventListener("DOMContentLoaded", async () => {
    initEventListeners()
    afterStateChange()
})