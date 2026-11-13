import { filterTodos, countRemaining } from "./todo-logic.js";

const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filterButtons = document.querySelectorAll(".filter");

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;
  if (todo.completed) {
    li.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "toggle-checkbox";
  checkbox.checked = todo.completed;

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todo.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "×";

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

export function render(state) {
  todoList.innerHTML = "";

  filterTodos(state.todos, state.filter).forEach((todo) => {
    todoList.appendChild(createTodoElement(todo));
  });

  const remaining = countRemaining(state.todos);
  itemsLeft.textContent = `${remaining} item${remaining === 1 ? "" : "s"} left`;

  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === state.filter);
  });
}

export function startEditing(span, onSave, onCancel) {
  const li = span.closest("li");

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = span.textContent;

  li.replaceChild(editInput, span);
  editInput.focus();

  let finished = false;
  function finish(shouldSave) {
    if (finished) return;
    finished = true;
    if (shouldSave) {
      onSave(editInput.value);
    } else {
      onCancel();
    }
  }

  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    else if (e.key === "Escape") finish(false);
  });
  editInput.addEventListener("blur", () => finish(true));
}