let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
const columns = document.querySelectorAll(".column");

// Render tasks
function renderTasks() {
  columns.forEach(c => c.querySelectorAll(".task").forEach(t => t.remove()));
  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.dataset.id = task.id;
    div.innerHTML = `
      <button onclick="deleteTask('${task.id}')">X</button>
      <strong>${task.title}</strong>
      <p>${task.description}</p>
    `;
    document.getElementById(task.status).appendChild(div);
    addDragEvents(div);
  });
}

// Save tasks
function saveTasks() {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

// Add new task
document.getElementById("addBtn").addEventListener("click", () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("desc").value.trim();
  if (!title || !description) return alert("Please enter both fields!");

  tasks.push({
    id: Date.now().toString(),
    title,
    description,
    status: "backlog",
  });
  saveTasks();
  renderTasks();
  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
});

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Drag & Drop events
function addDragEvents(task) {
  task.addEventListener("dragstart", () => task.classList.add("dragging"));
  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
    saveTasks();
  });
}

columns.forEach(col => {
  col.addEventListener("dragover", e => {
    e.preventDefault();
    col.classList.add("highlight");
  });

  col.addEventListener("dragleave", () => col.classList.remove("highlight"));

  col.addEventListener("drop", e => {
    e.preventDefault();
    col.classList.remove("highlight");
    const dragged = document.querySelector(".dragging");
    const id = dragged.dataset.id;
    col.appendChild(dragged);
    tasks = tasks.map(t =>
      t.id === id ? { ...t, status: col.id } : t
    );
    saveTasks();
  });
});

renderTasks();
