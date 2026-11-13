// Simple state management pattern
const state = {
  todos: [],
  filter: "all",
  theme: "light",
};

// State update function
function setState(updates) {
  Object.assign(state, updates);
  saveState();
  render();
}

// Update specific properties
function setFilter(filter) {
  setState({ filter });
}

function addTodo(text) {
  setState({
    todos: [...state.todos, { id: Date.now(), text, completed: false }],
  });
}

function toggleTodo(id) {
  setState({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  });
}

// Persist state
function saveState() {
  localStorage.setItem("appState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("appState");
  if (saved) {
    Object.assign(state, JSON.parse(saved));
  }
}

// Not in the assignment, but needed so render() exists
function render() {
  console.log("Rendering:", state);
}

loadState();
render();
