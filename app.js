"use strict";

const form = document.querySelector(".create-task-form"); // <form>
const taskInput = document.querySelector(".task-input"); // <input 1>
const filterInput = document.querySelector(".filter-input"); // <input 2>
const clearTasksButton = document.querySelector(".clear-tasks"); // <button2>
const taskList = document.querySelector(".collection"); // <ul>
const editTask = document.querySelector(".edit-btn");

document.addEventListener("DOMContentLoaded", renderTasks); // для збереження даних на сторінці пілся update
form.addEventListener("submit", addTask);
taskList.addEventListener("click", removeTask);
clearTasksButton.addEventListener("click", removeAllTasks); //clearTasksButton - кнопка “Видалити всі завдання”
filterInput.addEventListener("input", filterTasks); //коли input змінюється, то запускається функція filterTasks

function addTask(event) {
  event.preventDefault();
  const value = taskInput.value;

  if (!value.trim()) {
    return;
  }

  const li = document.createElement("li");
  const button = document.createElement("button");
  //console.log(event);

  li.innerHTML = value;
  button.innerHTML = "X";
  button.classList.add("delete-btn");
  const taskId = new Date().getTime();

  li.setAttribute("id", taskId);
  taskList.append(li);

  const editButton = document.createElement("button");
  editButton.classList.add("edit-btn");
  //li.append(editButton);
  //editButton.after(button);

  const divWrapper = document.createElement("div");
  divWrapper.classList.add("buttons-wrapper");
  divWrapper.prepend(editButton);
  divWrapper.append(button);
  li.append(divWrapper);

  storeTaskInLocalStorage({ value: value, taskId: taskId });
  taskInput.value = "";
}

function storeTaskInLocalStorage(taskValue) {
  let taskS = [];

  if (localStorage.getItem("tasks")) {
    taskS = JSON.parse(localStorage.getItem("tasks"));
  }

  taskS.push(taskValue);
  localStorage.setItem("tasks", JSON.stringify(taskS));
}

function removeTask(event) {
  if (event.target.classList.contains("delete-btn")) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const li = event.target.closest("li");
    const taskId = li.getAttribute("id");
    const taskValue = event.target.previousSibling.textContent;
    console.log(event.target);
    console.log(taskId);
    console.log(tasks);

    const filteredTasks = tasks.filter((task) => {
      console.log(task);
      return task.taskId !== +taskId;
    });

    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
    renderTasks();
  } else if (event.target.classList.contains("edit-btn")) {
    handleEditTask(event);
  }
}

function renderTasks() {
  taskList.innerHTML = "";
  if (localStorage.getItem("tasks")) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    //console.log(tasks);
    tasks.forEach((task) => {
      const li = document.createElement("li");
      const button = document.createElement("button");

      li.innerHTML = task.value;
      li.setAttribute("id", task.taskId);
      button.innerHTML = "X";
      button.classList.add("delete-btn");
      taskList.append(li);

      const editButton = document.createElement("button");
      editButton.classList.add("edit-btn");
      // li.append(editButton);
      // editButton.after(button);

      const divWrapper = document.createElement("div");
      divWrapper.classList.add("buttons-wrapper");
      divWrapper.prepend(editButton);
      divWrapper.append(button);
      li.append(divWrapper);
    });
    //console.log(tasks);
  }
}

function removeAllTasks() {
  localStorage.removeItem("tasks");
  renderTasks();
}

function filterTasks(event) {
  const searchQuery = event.target.value;
  const liCollection = taskList.querySelectorAll("li");

  liCollection.forEach((task) => {
    const liValue = task.firstChild.textContent;

    if (liValue.includes(searchQuery)) {
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
}

function handleEditTask(event) {
  const taskElement = event.target.parentElement.parentElement;
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const taskId = taskElement.getAttribute("id");
  const newTaskValue = prompt("Edit task:", taskElement.firstChild.textContent);

  if (newTaskValue !== null && newTaskValue.trim() !== "") {
    tasks.forEach((task) => {
      if (task.taskId == taskId) {
        task.value = newTaskValue;
      }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskElement.firstChild.textContent = newTaskValue;
  }
}
