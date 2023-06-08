const itemForm = document.getElementById("item_submit");
const itemList = document.getElementById("item-list");
const itemInput = document.getElementById("item_input");
const clearAll = document.getElementById("clear");
const filter = document.getElementsByClassName("filter");
let isEdit = false;

function displayItems() {
  const itemsFromLocalStorage = getItemFromStorage();
  itemsFromLocalStorage.forEach((item) => {
    addItemToDom(item);
    hideBoth();
  });
}
// localStorage.clear();
function addItem(e) {
  e.preventDefault();
  if (itemInput.value === "") {
    alert("Please enter item name");
    return;
  }
  if (isEdit) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.innerHTML = `${itemInput.value} <button class="remove-item""><i class="fa-solid fa-xmark"></i></button>`;
    // itemToEdit.remove();
    isEdit = false;
    hideBoth();
    return;
  } else {
    if (checkItemExists(itemInput.value)) {
      console.log(itemInput.value.toLowerCase() + "as");
      alert("Item already exists!");
      return;
    }
  }
  addItemToDom(itemInput.value);
  addItemToLocalStorage(itemInput.value);
  console.log(itemInput.value);
  hideBoth();
  itemInput.value = "";
}
//DO NOT ADD DUPLICATE ITES
function checkItemExists(item) {
  const getItems = getItemFromStorage();
  return getItems.includes(item);
}
// add new item to DOM
function addItemToDom(itemName) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(itemName));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  itemList.appendChild(li);
}
//ADD ITEM TO LOCAL STORAGE
function addItemToLocalStorage(item) {
  const localStorageItems = getItemFromStorage();
  localStorageItems.push(item);

  //CONVERT TO JSON STRING AND SET TO LOCAL STORAGE
  localStorage.setItem("items", JSON.stringify(localStorageItems));
}
function getItemFromStorage() {
  let localStorageItems;
  if (localStorage.getItem("items") === null) {
    localStorageItems = [];
  } else {
    localStorageItems = JSON.parse(localStorage.getItem("items"));
  }
  return localStorageItems;
}
//create button with classes
function createButton(clases) {
  const button = document.createElement("button");
  button.className = clases;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}
//create icon
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}
function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

//edit the item
function setItemToEdit(item) {
  isEdit = true;
  itemList.querySelectorAll("li").forEach((item) => {
    item.classList.remove("edit-mode");
  });
  item.classList.add("edit-mode");
  console.log(itemForm.innerHTML);
  itemForm.innerHTML = `<i class="fa-solid fa-plus"></i>Update Item`;
  itemForm.style.color = "white";
  itemForm.style.background = "#228B22";

  itemInput.value = item.textContent;
}
//remove item
function removeItem(item) {
  if (confirm("Are you sure?")) {
    //remove item from DOM
    removeItemFromStorage(item.textContent);
    item.remove();
    //Remove item from storage
    hideBoth();
  }
}
// function removeItem(e) {
//   if (e.target.parentElement.classList.contains("remove-item")) {
//     e.target.parentElement.parentElement.remove();
//   }
// }

//Remove item from local storage
function removeItemFromStorage(item) {
  let localStorageItems = getItemFromStorage();
  //filter out item to be removed
  localStorageItems = localStorageItems.filter((i) => i !== item);
  localStorage.setItem("items", JSON.stringify(localStorageItems));
}
//hide clear all button and filter input box
function hideBoth() {
  itemInput.value = "";
  if (itemList.firstChild) {
    clearAll.style.display = "block";
    filter[0].style.display = "block";
  } else {
    clearAll.style.display = "none";
    filter[0].style.display = "none";
  }
  itemForm.innerHTML = `<i class="fa-solid fa-plus"></i>Add Item`;
  itemForm.style.background = "#333";
  isEdit = false;
}
//remove all
function removeAll(e) {
  while (itemList.firstChild) {
    itemList.firstChild.remove();
  }
  localStorage.clear();
  hideBoth();
}
//filter items function
function filterItem(e) {
  const items = itemList.querySelectorAll("li");
  const inputText = e.target.value.toLowerCase();
  items.forEach((item) => {
    const originalText = item.firstChild.textContent.toLowerCase();
    if (originalText.indexOf(inputText) != -1) {
      item.style.display = "flex"; //As by default it is flex so i also used flex ok brother
    } else {
      item.style.display = "none";
    }
  });
}
//Event listener
itemForm.addEventListener("click", addItem);
itemList.addEventListener("click", onClickItem);
clearAll.addEventListener("click", removeAll);
filter[0].addEventListener("input", filterItem);
document.addEventListener("DOMContentLoaded", displayItems);
