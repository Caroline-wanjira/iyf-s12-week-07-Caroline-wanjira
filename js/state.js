import { getFromStorage, saveToStorage } from "./storage.js";
import * as logic from "./todo-logic.js";

const STORAGE_KEY = "todos";
const FILTER_KEY = "filter";

const state = {
    todos: getFromStorage(STORAGE_KEY, []),
    filter: getFromStorage(FILTER_KEY, "all"),
};

const listeners = [];

export function getState() {
    return state;
}

export function subscribe(listener) {
    listeners.push(listener);
}

function commit() {
    saveToStorage(STORAGE_KEY, state.todos);
    saveToStorage(FILTER_KEY, state.filter);
    listeners.forEach((listener) => listener(state));
}

export function addTodo(text) {
    state.todos = logic.addTodo(state.todos, text);
    commit();
}

export function toggleTodo(id) {
    state.todos = logic.toggleTodo(state.todos, id);
    commit();
}

export function deleteTodo(id) {
    state.todos = logic.deleteTodo(state.todos, id);
    commit();
}

export function editTodo(id, newText) {
    state.todos = logic.editTodo(state.todos, id, newText);
    commit();
}

export function clearCompleted() {
    state.todos = logic.clearCompleted(state.todos);
    commit();
}

export function setFilter(filter) {
    state.filter = filter;
    commit();
}
