document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput").value;
    let deadlineInput = document.getElementById("deadlineInput").value;
    let priorityInput = document.getElementById("priorityInput").value;

    if (taskInput === "" || deadlineInput === "") {
        alert("Please enter a task and select a deadline!");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({
        text: taskInput,
        deadline: deadlineInput,
        priority: priorityInput,
        completed: false
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    document.getElementById("taskInput").value = "";
    document.getElementById("deadlineInput").value = "";
    document.getElementById("priorityInput").value = "Low";
    loadTasks();
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskTableBody = document.getElementById("taskTableBody");
    taskTableBody.innerHTML = "";
    let today = new Date().toISOString().split("T")[0]; // Get today's date

    tasks.forEach((task, index) => {
        let row = document.createElement("tr");

        // Task Text
        let taskCell = document.createElement("td");
        taskCell.textContent = task.text;
        row.appendChild(taskCell);

        // Deadline
        let deadlineCell = document.createElement("td");
        deadlineCell.textContent = task.deadline;
        row.appendChild(deadlineCell);

        // Priority Level
        let priorityCell = document.createElement("td");
        priorityCell.textContent = task.priority;
        priorityCell.classList.add(`priority-${task.priority.toLowerCase()}`);
        row.appendChild(priorityCell);

        // Status
        let statusCell = document.createElement("td");
        statusCell.textContent = task.completed ? "Completed" : "Incomplete";
        statusCell.classList.add(task.completed ? "completed" : "incomplete");
        row.appendChild(statusCell);

        // Actions
        let actionCell = document.createElement("td");

        // Checkbox for completion
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTaskStatus(index));
        actionCell.appendChild(checkbox);

        // Edit Button
        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        editButton.onclick = () => editTask(index);
        actionCell.appendChild(editButton);

        // Delete Button
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = () => deleteTask(index);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        // Highlight overdue tasks
        if (!task.completed && task.deadline < today) {
            row.classList.add("overdue");
        }

        taskTableBody.appendChild(row);
    });
}

function toggleTaskStatus(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let newTaskText = prompt("Edit Task:", tasks[index].text);
    let newDeadline = prompt("Edit Deadline (YYYY-MM-DD):", tasks[index].deadline);
    let newPriority = prompt("Edit Priority (Low, Medium, High):", tasks[index].priority);

    if (newTaskText && newDeadline && newPriority) {
        tasks[index].text = newTaskText;
        tasks[index].deadline = newDeadline;
        tasks[index].priority = newPriority;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }
}
