import { describe, it, expect } from "vitest";
import {
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    filterTodos,
    countRemaining,
    editTodo,
    FILTER,
} from "../js/todo-logic.js";

function makeTodos() {
    return [
        { id: 1, text: "Read", completed: false },
        { id: 2, text: "Cook", completed: true },
    ];
}

describe("addTodo", () => {
    it("adds a new todo that is not completed", () => {
        const result = addTodo(makeTodos(), "Play basketball");
        expect(result).toHaveLength(3);
        expect(result[2].text).toBe("Play basketball");
        expect(result[2].completed).toBe(false);
    });

    it("ignores empty text (edge case)", () => {
        const result = addTodo(makeTodos(), "   ");
        expect(result).toHaveLength(2);
    });

    it("does not change the original array", () => {
        const original = makeTodos();
        addTodo(original, "New task");
        expect(original).toEqual(makeTodos());
    });
});

describe("toggleTodo", () => {
    it("flips completed for the matching id", () => {
        const result = toggleTodo(makeTodos(), 1);
        expect(result[0].completed).toBe(true);
        expect(result[1].completed).toBe(true);
    });

    it("leaves the list unchanged for an id that does not exist (edge case)", () => {
        const result = toggleTodo(makeTodos(), 999);
        expect(result).toEqual(makeTodos());
    });

    it("does not change the original array", () => {
        const original = makeTodos();
        toggleTodo(original, 1);
        expect(original).toEqual(makeTodos());
    });
});

describe("deleteTodo", () => {
    it("removes the todo with the given id", () => {
        const result = deleteTodo(makeTodos(), 1);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(2);
    });

    it("handles an empty list (edge case)", () => {
        expect(deleteTodo([], 1)).toEqual([]);
    });
});

describe("clearCompleted", () => {
    it("removes only completed todos", () => {
        const result = clearCompleted(makeTodos());
        expect(result).toEqual([{ id: 1, text: "Read", completed: false }]);
    });
});

describe("filterTodos", () => {
    it("returns only active todos", () => {
        const result = filterTodos(makeTodos(), FILTER.ACTIVE);
        expect(result.map((todo) => todo.id)).toEqual([1]);
    });

    it("returns only completed todos", () => {
        const result = filterTodos(makeTodos(), FILTER.COMPLETED);
        expect(result.map((todo) => todo.id)).toEqual([2]);
    });

    it("returns everything for 'all'", () => {
        expect(filterTodos(makeTodos(), FILTER.ALL)).toHaveLength(2);
    });
});

describe("countRemaining", () => {
    it("counts only the active todos", () => {
        expect(countRemaining(makeTodos())).toBe(1);
    });

    it("returns 0 for an empty list (edge case)", () => {
        expect(countRemaining([])).toBe(0);
    });
});

describe("editTodo", () => {
    it("changes the text of the matching todo", () => {
        const result = editTodo(makeTodos(), 1, "  Read a book  ");
        expect(result[0].text).toBe("Read a book");
    });

    it("deletes the todo when the new text is empty", () => {
        const result = editTodo(makeTodos(), 1, "");
        expect(result).toHaveLength(1);
    });
});