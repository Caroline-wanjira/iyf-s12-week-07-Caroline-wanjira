export function addTodo(todos, text) {
  const trimmedText = text.trim();
  if (!trimmedText) return todos;
  return [...todos, { id: Date.now(), text: trimmedText, completed: false }];
}

export function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

export function deleteTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

export function clearCompleted(todos) {
  return todos.filter((todo) => !todo.completed);
}

export function filterTodos(todos, filter) {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

export function countRemaining(todos) {
  return todos.filter((todo) => !todo.completed).length;
}
export function editTodo(todos, id, newText) {
  const trimmedText = newText.trim();
  if (!trimmedText) return deleteTodo(todos, id);
  return todos.map((todo) =>
    todo.id === id ? { ...todo, text: trimmedText } : todo
  );
}