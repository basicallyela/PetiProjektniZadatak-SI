import "./styles.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNTijRHaOE8rTHUyicrqjEEHbq1mXdqYs",
  authDomain: "testni-131f8.firebaseapp.com",
  projectId: "testni-131f8",
  storageBucket: "testni-131f8.appspot.com",
  messagingSenderId: "137597409877",
  appId: "1:137597409877:web:f1280e970c9ee3da9ed2dc",
  measurementId: "G-J2QL7RHSFD",
};

initializeApp(firebaseConfig);

const db = getFirestore();

const colRef = collection(db, "todos");

//query selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todos");
//event listeners
todoList.addEventListener("click", deleteCheck);


//gets all needed data from firestore database
getDocs(colRef)
  .then((snapshot) => {
    let todos = [];
    snapshot.docs.forEach((doc) => {
      todos.push({ ...doc.data(), id: doc.id });
    });
    let lentodos = todos.length;
    showAll(lentodos, todos);
    todoButton.addEventListener("click", addToFirebase);
  })
  .catch((err) => {
    console.log(err.message);
  });



//shows all previously added todos
function showAll(lentodos, todos) {
  for (let i = 0; i < lentodos; i++) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = todos[i].todo;
    newTodo.id = todos[i].id;
    newTodo.classList.add("todoItm");
    todoDiv.appendChild(newTodo);

    const completedButton = document.createElement("button");
    completedButton.innerHTML =
      '<i class="bi bi-check2" style="pointer-events: none;"></i></li>';
    completedButton.classList.add("check");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML =
      '<i class="bi bi-trash"  style="pointer-events: none;"></i></li>';
    trashButton.classList.add("trash");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
  }
}

//adds new todo to firebase and calls addTodo function
function addToFirebase() {
  if (todoInput.value !== "") {
    const doc = addDoc(colRef, { todo: todoInput.value }).then((doc) => {
      addTodo(doc.id);
    });
  }
}

//deletes a todo from the database only
function deleteFromFirebase(id) {
  const docRef = doc(db, "todos", id);
  deleteDoc(docRef).then(() => {
    console.log("Done");
  });
}

//adds a todo to screen and assigns it an id, after adding it to firebase
function addTodo(id) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;

  newTodo.id = id;
  newTodo.classList.add("todoItm");
  todoDiv.appendChild(newTodo);

  const completedButton = document.createElement("button");
  completedButton.innerHTML =
    '<i class="bi bi-check2" style="pointer-events: none;"></i></li>';
  completedButton.classList.add("check");
  todoDiv.appendChild(completedButton);

  const trashButton = document.createElement("button");
  trashButton.innerHTML =
    '<i class="bi bi-trash" style="pointer-events: none;"></i></li>';
  trashButton.classList.add("trash");
  todoDiv.appendChild(trashButton);

  todoList.appendChild(todoDiv);
  todoInput.value = "";
}

//deleting and checking
//checks which button is clicked
//if the trash icon is clicked it deletes the todo from screen and calls the deleteFromFirebase function
//if the check icon is clicked it 
function deleteCheck(e) {
  const item = e.target;
  if (item.classList[0] === "trash") {
    const todo = item.parentElement;
    todo.classList.add("sliding");
    todo.addEventListener("transitionend", function () {
      todo.remove();
      deleteFromFirebase(todo.children[0].id);
    });
  }
  if (item.classList[0] === "check") {
    const todo = item.parentElement;
    todo.classList.toggle("checked");
  }
}
