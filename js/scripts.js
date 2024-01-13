// Seleção de Elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldEditValue;

// Funções

const saveTodo = (text, done = 0, save = 1) => {

    const todo = document.createElement("div");
    todo.classList.add("todo");
     
    const task = document.createElement("h3");
    task.innerText = text;
    todo.appendChild(task);

    const finishTodo = document.createElement("button");
    finishTodo.classList.add("finish-todo");
    finishTodo.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(finishTodo);

    const editTodo = document.createElement("button");
    editTodo.classList.add("edit-todo");
    editTodo.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editTodo);

    const removeTodo = document.createElement("button");
    removeTodo.classList.add("remove-todo");
    removeTodo.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(removeTodo);

    if (done){
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStorage({text, done: 0})
    }

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
   const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
      let task = todo.querySelector("h3");
            
        if (task.innerText === oldEditValue) {
            task.innerText = text;

            updateTodoLocalStorage(oldEditValue, text)
     }
        
    });
};


const searchTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let task = todo.querySelector("h3").innerText.toLowerCase();

        const normalizeserach = text.toLowerCase();

          todo.style.display = "flex";
              
          if (!task.includes(normalizeserach)) {
              todo.style.display = "none";
       }
          
      });
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
  
    switch (filterValue) {
      case "all":
        todos.forEach((todo) => (todo.style.display = "flex"));
  
        break;
  
      case "done":
        todos.forEach((todo) =>
          todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );
  
        break;
  
      case "todo":
        todos.forEach((todo) =>
          !todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );
  
        break;
  
      default:
        break;
    }
  };

// Eventos

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoValue = todoInput.value.trim();
    const todos = document.querySelectorAll(".todo")

    let duplicada = false

    todos.forEach((todo) => {
        const existentH3 = todo.querySelector("h3")

        if (existentH3.innerText.toLowerCase() === todoValue.toLowerCase())
            duplicada = true;
    });

   if (duplicada) {
      console.log("Tarefa duplicada. Escolha um nome diferente.");
      return;
   }

 
   if (todoValue) {
     saveTodo(todoValue);
   }

}); 


document.addEventListener("click", (e) => {
    const targetEl = e.target
    const parentEl = targetEl.closest("div")
    let task;

    if (parentEl && parentEl.querySelector("h3")) {
        task = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(task);
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();

        removeTodoLocalStorage(task);
    }

    if (targetEl.classList.contains("edit-todo")) {
          toggleForms();     
          
          editInput.value = task;
          oldEditValue = task;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
  const editInputValue = editInput.value;

  const todos = document.querySelectorAll(".todo")

  let duplicada = false

  todos.forEach((todo) => {
      const existentH3 = todo.querySelector("h3")

      if (existentH3.innerText.toLowerCase() === editInputValue.toLowerCase())
          duplicada = true;
  });

 if (duplicada) {
    console.log("Tarefa duplicada. Escolha um nome diferente.");
    return;
 }
  
    if (editInputValue) {
      updateTodo(editInputValue);
    }
  
    toggleForms();
});


searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
        searchTodo (search);
})

eraseBtn.addEventListener("click", e => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));

})

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;
  
    filterTodos(filterValue);
  });

  // Local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
  
    return todos;
  };
  
  const loadTodos = () => {
    const todos = getTodosLocalStorage();
  
    todos.forEach((todo) => {
      saveTodo(todo.text, todo.done, 0);
    });
  };
  
  const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
  
    todos.push(todo);
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    const filteredTodos = todos.filter((todo) => todo.text != todoText);
  
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  };
  
  const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoText ? (todo.done = !todo.done) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoOldText ? (todo.text = todoNewText) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  loadTodos();