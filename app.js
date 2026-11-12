// DOM Elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");

// State
let todos = [];
let currentFilter = "all";

// Functions
function createTodoElement(todo) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    if (todo.completed) {
        li.classList.add("completed");
    }

    // Checkbox / Toggle
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "toggle-checkbox";
    checkbox.checked = todo.completed;

    // Task text label
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "×";

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = todos.filter((todo) => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true; // 'all'
    });

    filteredTodos.forEach((todo) => {
        todoList.appendChild(createTodoElement(todo));
    });

    updateStats();
}

function addTodo(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTodo = {
        id: Date.now(),
        text: trimmedText,
        completed: false
    };

    todos.push(newTodo);
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
}

function editTodo(id, newText) {
    const trimmedText = newText.trim();
    if (!trimmedText) {
        deleteTodo(id);
        return;
    }
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, text: trimmedText };
        }
        return todo;
    });
    renderTodos();
}

function updateStats() {
    const activeCount = todos.filter((todo) => !todo.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
}

function filterTodos(filter) {
    currentFilter = filter;
    filters.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === filter);
    });
    renderTodos();
}

// Event Listeners
form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo(input.value);
    input.value = "";
});

todoList.addEventListener("click", function (event) {
    const li = event.target.closest("li");
    if (!li) return;
    const todoId = Number(li.dataset.id);

    if (event.target.classList.contains("delete-btn")) {
        deleteTodo(todoId);
    } else if (event.target.classList.contains("toggle-checkbox")) {
        toggleTodo(todoId);
    }
});

// Double-click to Edit (Bonus Requirement)
todoList.addEventListener("dblclick", function (event) {
    if (!event.target.classList.contains("todo-text")) return;

    const span = event.target;
    const li = span.closest("li");
    const todoId = Number(li.dataset.id);
    const originalText = span.textContent;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = originalText;

    li.replaceChild(editInput, span);
    editInput.focus();

    function saveEdit() {
        editTodo(todoId, editInput.value);
    }

    editInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            saveEdit();
        } else if (e.key === "Escape") {
            renderTodos(); // Cancel editing
        }
    });

    editInput.addEventListener("blur", saveEdit);
});

// Filter buttons click handler
filters.forEach((btn) => {
    btn.addEventListener("click", () => filterTodos(btn.dataset.filter));
});

// Clear Completed button handler
clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.completed);
    renderTodos();
});

// Initialize
renderTodos();