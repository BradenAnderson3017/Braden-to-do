//global variables
let listContainer = document.getElementById("all-lists");
let addedListArr = document.querySelectorAll(".added-list");
let createdListArr = [];

//Data structure
const lists = {};
//let currentList = lists[0];
let list = document.getElementById("list");

//function for leftside lists
let newList = document.getElementById("new-list");

const createNewList = document.getElementById("submit");

createNewList.addEventListener("click", render);

function save() {
  for (let listId in lists) {
    if (lists[listId].name === "") {
      delete lists[listId];
    }
  }

  localStorage.setItem("lists", JSON.stringify(lists));
  localStorage.setItem("names", JSON.stringify(createdListArr));
}

function render() {
  //object that gets added to data structure

  const addedList = {
    name: newList.value,
    toDos: [],
  };
  let nextIndex = 0;
  while (lists[nextIndex]) {
    nextIndex++;
  }
  lists[nextIndex] = addedList;

  //creating html elments

  addedListArr.forEach((element) => {
    if (element.textContent !== newList.textContent) {
      createdListArr.push(element.textContent);
    }
  });

  inputCheck();
  let leftListener = document.querySelector("#all-lists");
  leftListener.addEventListener("click", leftEventListener);

  function leftEventListener() {
    let leftDivs = document.querySelector(".added-list");
    leftDivs.addEventListener("click", rightSideList);
  }
}

//Clicking on the leftside to bring up the content on the left
function rightSideList() {
  let addedListArr = document.querySelectorAll(".added-list");
  addedListArr.forEach((element) => {
    element.removeAttribute("id");
  });
  this.setAttribute("id", "current");

  let myToDoList = `<div class="todo-list">
  <h2 id="title" class="${this.textContent}">${this.textContent}</h2>
    <ul class="taskContainer" id="taskContainer">
    </ul>
    <input id="newTask" type="text" placeholder="Add a new task">
    <button id="taskButton">Add</button>`;

  let rightLists = document.getElementById("right");
  rightLists.innerHTML = myToDoList;

  let taskButton = document.getElementById("taskButton");
  taskButton.addEventListener("click", newToDoItem);

  let title = this.textContent; // Get the title of the selected list
  previousItems(title);
  save();
}

//checks to see if the input value already exists
function inputCheck() {
  if (!createdListArr.includes(newList.value)) {
    let listItem = document.createElement("div");
    let listIcon = document.createElement("div");
    listIcon.classList.add("listIcons");
    listItem.classList.add("added-list");
    if (newList.value.length === 0) {
      newList.placeholder = "You Need to Name Your List!";
    } else {
      listItem.textContent = newList.value;
      listContainer.prepend(listItem);
      listIcon.innerHTML = `<i class="icon fa-solid fa-xmark"></i>`;
      listItem.append(listIcon);
      listItem.setAttribute("id", newList.value);
      newList.placeholder = "Enter List Name...";
      createdListArr.push(newList.value);
    }
  } else {
    for (let listId in lists) {
      let savedNames = JSON.parse(localStorage.getItem("names"));
      if (createdListArr.includes(newList.value)) {
        newList.placeholder = "You Already Have a List with that Name!";
      } else if (createdListArr.includes(savedNames[listId].name)) {
        newList.placeholder = "You Already Have a List with that Name!";
      }
    }
  }
  save();
  newList.value = "";
  deletingList();
}

//function to add new todo item on right side of screen and saves to data structure

function newToDoItem(event) {
  event.preventDefault();

  let taskInput = document.getElementById("newTask");
  let emptyDiv = document.createElement("li");
  emptyDiv.classList.add("todo-item");

  if (taskInput.value.length === 0) {
    taskInput.placeholder = "You Need to Name Your Item!";
  } else {
    //adding todos to data structure when you click add button
    let title = document.getElementById("title").textContent;
    for (let listId in lists) {
      if (lists[listId].name === title) {
        let newToDoArr = {
          text: taskInput.value,
          completed: false,
        };
        lists[listId].toDos.push(newToDoArr);

        taskInput.placeholder = "Enter To Do Name...";

        let taskItem = `
        <input class="checkbox" type="checkbox">
        <p id="${taskInput.value}">${taskInput.value}</p>
        <button class="deleteButton">
        <p>Delete</p>
        </button>
        `;

        emptyDiv.innerHTML = taskItem;
        let taskContainer = document.getElementById("taskContainer");
        taskContainer.append(emptyDiv);
        deletingItem();
        checkbox();
        save();
        break;
      }
    }
  }

  taskInput.value = "";
}

function previousItems(title) {
  for (let listId in lists) {
    if (lists[listId].name === title) {
      let todos = lists[listId].toDos;
      let taskContainer = document.getElementById("taskContainer");
      taskContainer.innerHTML = ""; // Clear previous items

      // Loop through the todos array and create HTML elements
      todos.forEach((todo) => {
        let taskItem = document.createElement("li");
        taskItem.classList.add("todo-item");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");

        let taskText = document.createElement("p");
        taskText.textContent = todo.text;
        taskText.id = todo.text;

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteButton");
        deleteButton.innerHTML = "<p>Delete</p>";

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);

        // Append the taskItem to the taskContainer
        taskContainer.appendChild(taskItem);
      });
    }
    deletingItem();
    checkbox();
    save();
  }
}

//reload page
reloadMyLeft();

function reloadMyLeft() {
  let savedLists = JSON.parse(localStorage.getItem("lists"));

  if (savedLists) {
    for (let listId in savedLists) {
      lists[listId] = savedLists[listId];
      let listItem = document.createElement("div");
      let listIcon = document.createElement("div");
      listIcon.classList.add("listIcons");

      let listContainer = document.getElementById("all-lists");

      listItem.setAttribute("id", listId);
      listItem.classList.add("added-list");
      listItem.textContent = savedLists[listId].name;

      listContainer.prepend(listItem);
      listIcon.innerHTML = `<i class="icon fa-solid fa-xmark"></i>`;
      listItem.append(listIcon);
      let leftDivs = document.querySelector(".added-list");
      leftDivs.addEventListener("click", rightSideList);
    }
  }
  deletingList();
}
//deleting a to do item

function deletingItem() {
  const deleteButton = document.querySelectorAll(".deleteButton");

  deleteButton.forEach((del) => {
    del.addEventListener("click", addingEventListener);
  });
  function addingEventListener(event) {
    for (let i in lists) {
      for (let j in lists[i].toDos) {
        let del = event.target.parentElement.parentElement;
        let todoText =
          event.target.parentElement.parentElement.querySelector(
            "p"
          ).textContent;
        if (lists[i].toDos[j].text === todoText) {
          let index = lists[i].toDos.indexOf(lists[i].toDos[j]);
          lists[i].toDos.splice(index, 1);
          save();
          del.remove();
        }
      }
    }
  }
}
//deleting the lists on the left
function deletingList() {
  const listIcons = document.querySelectorAll(".listIcons");

  function addingListListener(event) {
    for (let i in lists) {
      let li = event.target.parentElement.parentElement.textContent.trim();
      if (lists[i].name === li) {
        let list = event.target.parentElement.parentElement;
        delete lists[i];
        save();
        list.remove();
      }
    }
  }
  listIcons.forEach((btn) => {
    btn.addEventListener("click", addingListListener);
  });
}

//checking a todoItem off the list
function checkbox() {
  let checks = document.querySelectorAll(".checkbox");
  function checkboxEvent(event) {
    let todoText = event.target.parentElement.querySelector("p").textContent;
    for (let i in lists) {
      for (let j in lists[i].toDos) {
        if (lists[i].toDos[j].text === todoText) {
          lists[i].toDos[j].completed = true;
          if ((lists[i].toDos[j].completed = true)) {
            let del = event.target.parentElement;
            let index = lists[i].toDos.indexOf(lists[i].toDos[j]);
            lists[i].toDos.splice(index, 1);
            save();
            setTimeout(() => {
              del.remove();
            }, 1000);
            var duration = 1000;
            var end = Date.now() + duration;

            (function frame() {
              // launch a few confetti from the left edge
              confetti({
                particleCount: 100,
                startVelocity: 10,
                spread: 360,
                origin: {
                  x: Math.random(),
                  // since they fall down, start a bit higher than random
                  y: Math.random() - 0.2
                }
              });

              // keep going until we are out of time
              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            })();
          }
        }
      }
    }
  }

  checks.forEach((box) => {
    box.addEventListener("click", checkboxEvent);
  });
}
console.log(lists);
