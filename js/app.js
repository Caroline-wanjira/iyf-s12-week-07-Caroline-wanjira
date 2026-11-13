import {
    getState,
    subscribe,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
} from "./state.js";
import { render, startEditing } from "./ui.js";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo(input.value);
    input.value = "";
});

todoList.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) {return;}
    const todoId = Number(li.dataset.id);

    if (event.target.classList.contains("delete-btn")) {
        deleteTodo(todoId);
    } else if (event.target.classList.contains("toggle-checkbox")) {
        toggleTodo(todoId);
    }
});

// Double-click to edit
todoList.addEventListener("dblclick", (event) => {
    if (!event.target.classList.contains("todo-text")) {return;}

    const span = event.target;
    const todoId = Number(span.closest("li").dataset.id);

    startEditing(
        span,
        (newText) => editTodo(todoId, newText),
        () => render(getState())
    );
});

filters.forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

clearCompletedBtn.addEventListener("click", clearCompleted);

// Start the app
subscribe(render);
render(getState());
