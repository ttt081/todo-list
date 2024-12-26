let taskList = [];

// Load tasks from localStorage when the page loads
loadTasks();
displayList();

document.querySelector("#addButton").addEventListener("click", function () {
  let inputElement = document.querySelector("#inputBox");
  let dateElement = document.querySelector("#dateBox");
  let timeElement = document.querySelector("#timeBox");

  if (inputElement.value && dateElement.value && timeElement.value) {
    const dueDateTime = new Date(`${dateElement.value}T${timeElement.value}`);
    const today = new Date();

    // Check if the due date is in the future
    if (dueDateTime > today) {
      taskList.push({ item: inputElement.value, dueDate: dueDateTime });
      saveTasks(); // Save tasks to localStorage
      inputElement.value = ""; // Clear input after adding
      dateElement.value = ""; // Clear date after adding
      timeElement.value = ""; // Clear time after adding
      displayList(); // Update the displayed list
    } else {
      alert("Please enter a due date and time in the future.");
    }
  } else {
    alert("Please fill in all fields.");
  }
});

function displayList() {
  let displayElement = document.querySelector(".listContainer");

  let newHtml = "";

  for (let i = taskList.length-1; i >=0 ; i--) {
    const remainingTime = getRemainingTime(taskList[i].dueDate);
    newHtml += `<div class='listEl'>
       <span class='taskText'>${taskList[i].item} </span> 
       <span> Due: ${taskList[i].dueDate.toLocaleString()} </span>
       <span> Remaining: ${remainingTime} </span>
       <button onclick='deleteTask(${i});'> Delete </button>
    </div>`;
  }

  displayElement.innerHTML = newHtml;
}

function getRemainingTime(dueDate) {
  const now = new Date();
  const timeDiff = dueDate - now;

  if (timeDiff < 0) {
    return "Overdue";
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}

function deleteTask(index) {
  taskList.splice(index, 1);
  saveTasks(); // Save updated tasks to localStorage
  displayList();
}

function saveTasks() {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("taskList");
  if (storedTasks) {
    taskList = JSON.parse(storedTasks);
    // Convert dueDate back to Date objects
    taskList.forEach((task) => {
      task.dueDate = new Date(task.dueDate);
    });
  }
}
