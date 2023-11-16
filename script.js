let inputs = document.getElementById("inp");

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

document.getElementById("doneDialog").addEventListener("click", () => {
  let selectedPriority = document.getElementById("dropdown").value;
  let taskText = inputs.value.trim();
  let taskDescription = document.getElementById("desc").value.trim(); // Get task description

  if (!taskText) {
    alert("Please enter a task");
    return;
  }

  let existingTask = document.querySelector(".selected-task");
  if (existingTask) {
    // Update existing task and save to local storage
    updatePriority(existingTask, selectedPriority);
    saveTasksToLocalStorage();
  } else {
    // Add new task and save to local storage
    addTaskToList(taskText, taskDescription, selectedPriority);
    saveTasksToLocalStorage();
  }

  inputs.value = "";
  document.getElementById("desc").value = ""; // Clear task description
  document.getElementById("dialog").style.display = "none";
});

function addTaskToList(taskText, taskDescription, selectedPriority) {
  let taskList;

  switch (selectedPriority) {
    case "highpriopt":
      taskList = document.querySelector(".hptasks");
      break;
    case "midpriopt":
      taskList = document.querySelector(".mptasks");
      break;
    case "lowpriopt":
      taskList = document.querySelector(".lptasks");
      break;
    case "donepriopt":
      taskList = document.querySelector(".done");
      break;
    default:
      return;
  }

  let newTask = document.createElement("li");
  if (!taskDescription) {
    newTask.innerHTML = `${taskText} <i class="fa-solid fa-trash"></i> <i class="fa-solid fa-caret-down"></i>`;
  } else {
    newTask.innerHTML = `${taskText} - ${taskDescription} <i class="fa-solid fa-trash"></i> <i class="fa-solid fa-caret-down"></i>`;
  }
  taskList.appendChild(newTask);

  newTask.querySelector(".fa-trash").addEventListener("click", removeTask);
  newTask.querySelector(".fa-caret-down").addEventListener("click", openDialog);
}

function updatePriority(taskElement, selectedPriority) {
  let taskText = taskElement.textContent
    .trim()
    .replace("🗑", "")
    .replace("🔽", "");
  let taskDescription = ""; // Get the task description from your data model

  // Remove the existing task
  taskElement.remove();

  // Add the task as a new one with the updated priority
  addTaskToList(taskText, taskDescription, selectedPriority);

  // Save tasks to local storage
  saveTasksToLocalStorage();
}

function removeTask() {
  this.parentNode.remove();
  saveTasksToLocalStorage();
}

function openDialog() {
  // Remove the 'selected-task' class from all tasks
  document.querySelectorAll(".taskslist ul li").forEach((taskElement) => {
    taskElement.classList.remove("selected-task");
  });

  // Set the input value and show the dialog
  let taskText = this.parentNode.textContent
    .trim()
    .replace("🗑", "")
    .replace("🔽", "");
  inputs.value = taskText;
  document.getElementById("dialog").style.display = "block";

  // Add the 'selected-task' class to the current task
  this.parentNode.classList.add("selected-task");
}

function saveTasksToLocalStorage() {
  let tasks = [];

  document.querySelectorAll(".taskslist ul li").forEach((taskElement) => {
    let taskText = taskElement.textContent?.trim().replace("🗑", "").replace("🔽", "") || "";
    let [taskTextPart1, taskTextPart2] = taskText.split('-').map(part => part.trim());

    if (taskTextPart1) {
      let taskDescription = taskTextPart2 || "";
      let priority;

      // Determine priority based on taskElement's parent
      if (taskElement.parentNode.classList.contains("hptasks")) {
        priority = "highpriopt";
      } else if (taskElement.parentNode.classList.contains("mptasks")) {
        priority = "midpriopt";
      } else if (taskElement.parentNode.classList.contains("lptasks")) {
        priority = "lowpriopt";
      } else if (taskElement.parentNode.classList.contains("done")) {
        priority = "donepriopt";
      }

      tasks.push({ text: taskTextPart1, description: taskDescription, priority: priority });
    }
  });

  // Save tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    addTaskToList(task.text, task.description, task.priority);
  });
}
