import { saveToStorage, getFromStorage } from "../js/storage.js";

const input = document.getElementById("note-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("note-list");

let notes = getFromStorage("notes", []);

function render() {
    list.innerHTML = "";
    notes.forEach((note, index) => {
        const li = document.createElement("li");
        li.textContent = note;
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.addEventListener("click", () => {
            notes.splice(index, 1);
            saveToStorage("notes", notes);
            render();
        });
        li.append(" ", del);
        list.appendChild(li);
    });
}

addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    notes.push(text);
    saveToStorage("notes", notes);
    input.value = "";
    render();
});

render();
