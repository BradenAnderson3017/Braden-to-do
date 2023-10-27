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

  let leftDivs = document.querySelector(".added-list");
  leftDivs.addEventListener("click", rightSideList);
  searchingItems();
}

//Clicking on the leftside to bring up the content on the left
function rightSideList() {
  let addedListArr = document.querySelectorAll(".added-list");
  addedListArr.forEach((element) => {
    element.removeAttribute("id");
  });
  this.setAttribute("id", "current");

  let myToDoList = `<div class="todo-list">
  <p id="title" class="${this.textContent}">${this.textContent}</p>
  <ul class="taskContainer" id="taskContainer">
  </ul>
  <input id="newTask" type="text" placeholder="+ Add a new to do and hit enter">`;
  displayList(myToDoList);

  let taskInput = document.getElementById("newTask");

  // Add event listener for the Enter key
  taskInput.addEventListener("keydown", function (event) {
    newToDoItem(event);
  });
  let title = this.textContent;
  previousItems(title);
  save();
  editingItems();
}

//checks to see if the input value already exists
function inputCheck() {
  if (!createdListArr.includes(newList.value)) {
    let listItem = document.createElement("div");
    let listIcon = document.createElement("div");
    let listCircle = document.createElement("div");
    let circleText = document.createElement("div");
    circleText.classList.add("circleText");
    circleText.prepend(listCircle, newList.value);
    listCircle.classList.add("listCircle");
    listIcon.classList.add("listIcons");
    listItem.classList.add("added-list");
    if (newList.value.length === 0) {
      newList.placeholder = "You Need to Name Your List!";
    } else {
      listItem.prepend(circleText);
      listContainer.prepend(listItem);
      listIcon.innerHTML = `<i id=taskButton class="fa-regular fa-trash-can" style="color: #4772FA;"></i>`;
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
  save(createdListArr);
  newList.value = "";
  deletingList();
}

//function to add new todo item on right side of screen and saves to data structure

function newToDoItem(event) {
  if (event && event.key === "Enter") {
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
          <div class="checkboxContainer">
            <input class="checkbox" type="checkbox">
            <p id="${taskInput.value}">${taskInput.value}</p>
          </div>
          <div class="deleteButton">
          <i class="fa-regular fa-trash-can" style="color: #4772FA;"></i>
          </div>
          `;

          emptyDiv.innerHTML = taskItem;
          let taskContainer = document.getElementById("taskContainer");
          taskContainer.append(emptyDiv);
          deletingItem();
          checkbox();
          save();
          searchingItems();
          editingItems();
          attachEventListeners();
          break;
        }
      }
    }
    taskInput.value = "";
  }
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
        let checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkboxContainer");
        let taskText = document.createElement("p");
        taskText.textContent = todo.text;
        taskText.id = todo.text;

        let deleteButton = document.createElement("div");
        deleteButton.classList.add("deleteButton");
        deleteButton.innerHTML = `<i id=taskButton class="fa-regular fa-trash-can" style="color: #4772FA;"></i>`;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(taskText);
        taskItem.appendChild(checkboxContainer);
        taskItem.appendChild(deleteButton);

        // Append the taskItem to the taskContainer
        taskContainer.appendChild(taskItem);
      });
    }
    deletingItem();
    checkbox();
    save();
    editingItems();
  }
  searchingItems();
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
      let listCircle = document.createElement("div");
      let circleText = document.createElement("div");
      circleText.classList.add("circleText");
      //listItem.textContent = savedLists[listId].name;
      //let words = (listItem.textContent);
      circleText.prepend(listCircle, savedLists[listId].name);
      listCircle.classList.add("listCircle");
      listItem.prepend(circleText);
      listContainer.prepend(listItem);
      listIcon.innerHTML = `<i id=taskButton class="fa-regular fa-trash-can" style="color: #4772FA;"></i>`;
      listItem.append(listIcon);

      displayList()

      let leftDivs = document.querySelector(".added-list");
      leftDivs.addEventListener("click", rightSideList);
    }
  }
  deletingList();
  attachEventListeners();
}
//deleting a to do item
function deletingItem() {
  const deleteButtons = document.querySelectorAll(".deleteButton");
  deleteButtons.forEach((del) => {
    del.addEventListener("click", function (event) {
      const todoText =
        event.target.parentElement.parentElement.querySelector("p").textContent;
      for (let i in lists) {
        for (let j in lists[i].toDos) {
          const todo = lists[i].toDos[j];
          if (todo.text === todoText) {
            let index = lists[i].toDos.indexOf(todo);
            lists[i].toDos.splice(index, 1);
            save();
            event.target.parentElement.parentElement.remove();
            break;
          }
        }
      }
    });
  });
}

//deleting the lists on the left
function deletingList() {
  const listIcons = document.querySelectorAll(".listIcons");

  listIcons.forEach((btn) => {
    btn.addEventListener("click", addingListListener);
  });

  function addingListListener(event) {
    let list = event.target.parentElement.parentElement;
    let li = event.target.parentElement.parentElement.textContent.trim();
    for (let i in lists) {
      if (lists[i].name === li) {
        confirm("Are you sure to delete?");
        delete lists[i];
        list.remove();
        save();
        displayList();
        break;
      }
    }
  }
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
            let del = event.target.parentElement.parentElement;
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
                  y: Math.random() - 0.2,
                },
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

function searchingItems() {
  let search = document.getElementById("search");
  search.addEventListener("input", function () {
    let searchTerm = search.value.toLowerCase();
    let todoItems = document.querySelectorAll(".todo-item");
    todoItems.forEach((item) => {
      let itemText = item.querySelector("p").textContent.toLowerCase();
      item.style.display = "none";
      if (itemText.includes(searchTerm)) {
        item.style.display = "";
      }
    });
  });
}

function editingItems() {
  let todosToEdit = document.querySelectorAll(".todo-item");
  todosToEdit.forEach((item) => {
    let itemText = item.querySelector("p");
    item.querySelector("p").setAttribute("contenteditable", true);
    item.querySelector("p").setAttribute("spellcheck", false);
    item.querySelector("p").addEventListener("click", function () {
      let orginalItem = itemText.textContent;
      item.querySelector("p").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          item.querySelector("p").setAttribute("contenteditable", false);
          item.querySelector("p").setAttribute("contenteditable", true);
          for (let i in lists) {
            for (let j in lists[i].toDos) {
              if (lists[i].toDos[j].text === orginalItem)
                lists[i].toDos[j].text = itemText.textContent;
              save();
            }
          }
        }
      });
      item.querySelector("p").addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          item.querySelector("p").setAttribute("contenteditable", false);
          item.querySelector("p").setAttribute("contenteditable", true);
          for (let i in lists) {
            for (let j in lists[i].toDos) {
              if (lists[i].toDos[j].text === orginalItem)
                lists[i].toDos[j].text = itemText.textContent;
              save();
            }
          }
        }
      });
      document.addEventListener("click", function () {
        setTimeout(() => {
          document.addEventListener("click", function () {
            item.querySelector("p").setAttribute("contenteditable", true);
            for (let i in lists) {
              for (let j in lists[i].toDos) {
                if (lists[i].toDos[j].text === orginalItem)
                  lists[i].toDos[j].text = itemText.textContent;
                save();
              }
            }
          });
        }, 1000);
      });
    });
  });
}
function displayList(div) {
  let right = document.getElementById("right");
  if (div) {
    right.innerHTML = div;
  } else {
    right.innerHTML = "";
  }
}
function attachEventListeners() {
  deletingItem();
  checkbox();
  editingItems();
}