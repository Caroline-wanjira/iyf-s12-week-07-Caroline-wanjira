const users = [
    { name: "Amina", age: 21 },
    { name: "Brian", age: 17 },
];

console.log("Basic message");
console.log("%cImportant!", "color: red; font-size: 20px;");
console.warn("This might be a problem");
console.error("This is definitely wrong");
console.table(users);

console.group("User Processing");
console.log("Step 1");
console.log("Step 2");
console.groupEnd();

console.time("loop");
for (let i = 0; i < 100000; i++) {}
console.timeEnd("loop");

const x = -5;
console.assert(x > 0, "x should be positive");
console.trace("How did we get here?");
