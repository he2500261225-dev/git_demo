const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#todo-count");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");

const STORAGE_KEY = "todo-app-items";

let todos = loadTodos();

function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  try {
    return JSON.parse(savedTodos);
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodo(text) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };
}

function renderTodos() {
  list.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `标记“${todo.text}”为完成`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `删除“${todo.text}”`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  updateSummary();
}

function updateSummary() {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  count.textContent = `${activeCount} 个待办`;
  emptyState.classList.toggle("hidden", todos.length > 0);
  clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.unshift(createTodo(text));
  input.value = "";
  saveTodos();
  renderTodos();
});

list.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") {
    return;
  }

  const item = event.target.closest(".todo-item");
  const todo = todos.find((currentTodo) => currentTodo.id === item.dataset.id);

  if (!todo) {
    return;
  }

  todo.completed = event.target.checked;
  saveTodos();
  renderTodos();
});

list.addEventListener("click", (event) => {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }

  const item = event.target.closest(".todo-item");
  todos = todos.filter((todo) => todo.id !== item.dataset.id);
  saveTodos();
  renderTodos();
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

renderTodos();
