var todoList = {
  todos: [],
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
    view.checkCompletedTodos();
  },
  changeTodo: function(position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
    view.displayTodos();
    view.checkCompletedTodos();
  },
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;
    
    // Get number of completed todos.
    this.todos.forEach(function(todo) {
      if (todo.completed) {
        completedTodos++;
      }
    });
    
    this.todos.forEach(function(todo) {
      if (completedTodos === totalTodos) {
        todo.completed = false;
      } else {
        todo.completed = true;
      }
    });
    
    view.checkCompletedTodos();
  }
};

var handlers = {
  addTodo: function() {
    var addTodoTextInput = document.getElementById('newTodo');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
  },
  changeTodo: function() {
    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    var changeTodoTextInput = document.getElementById('changeTodoTextInput');
    todoList.changeTodo(changeTodoPositionInput.valueAsNumber, changeTodoTextInput.value);
    changeTodoPositionInput.value = '';
    changeTodoTextInput.value = '';
    view.displayTodos();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
    view.checkCompletedTodos();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
  }  
};

var view = {
  displayTodos: function() {
    var todosUl = document.getElementById('myTodoList');
    todosUl.innerHTML = '';
    
    todoList.todos.forEach(function(todo, position) {
      var isCompleted = false;
      var todoDiv = document.createElement('div');
      todoDiv.className += " input-group btn-group";
      var todoSpanCb = document.createElement('span');
      todoSpanCb.className += " input-group-addon";
      if (todo.completed) {
        isCompleted = true;
      } else {
        isCompleted = false;
      }
      
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isCompleted;
      checkbox.id = position;
      checkbox.addEventListener("click",function(e){
        todoList.toggleCompleted(position);
      },false);
      var todoTextbox = document.createElement('input');
      todoTextbox.id = position;
      todoTextbox.type = 'text';
      todoTextbox.value = todo.todoText;
      todoTextbox.className += ' form-control remove-highlight';
      todoTextbox.addEventListener("dblclick",function(e){
        this.readOnly = false;
      },false);
      todoTextbox.addEventListener("blur",function(e){
        this.readOnly = true;
        todoList.changeTodo(position, todoTextbox.value);
      },false);
      todoTextbox.addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          todoList.changeTodo(position, todoTextbox.value);
          this.blur();
        }
      });
      
      view.strikeThroughChange(isCompleted, todoTextbox);
      
      var todoSpanBtn = document.createElement('span');
      todoSpanBtn.className += " input-group-btn";
      var deleteButton = document.createElement('input');
      deleteButton.type = 'button';
      deleteButton.className += ' btn btn-secondary';
      deleteButton.value = 'x';
      deleteButton.addEventListener("click",function(e){
        handlers.deleteTodo(position);
      },false);
      
      todoSpanBtn.appendChild(deleteButton);
      todoSpanCb.appendChild(checkbox);
      todoDiv.appendChild(todoSpanCb);
      todoDiv.appendChild(todoTextbox);
      todoDiv.appendChild(todoSpanBtn);
      
      todosUl.appendChild(todoDiv);
    });
    
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  checkCompletedTodos: function() {
    var totalTodos = todoList.todos.length;
    var completedTodos = 0;
    var itemsToBeDone = 0;
    
    todoList.todos.forEach(function(todo, position) {
      if (todo.completed) {
        completedTodos += 1;
      }
    });
    
    var toggleAll = document.getElementById('toggleAll');
    if (totalTodos === 0) {
      toggleAll.checked = false;
    }
    else if (completedTodos != totalTodos) {
      toggleAll.checked = false;
    }
    else {
      toggleAll.checked = true;
    }
    
    // Count items left to be done.
    var itemsLeft = document.createElement('input');
    itemsLeft.id = 'itemsLeft';
    itemsLeft.type = 'text';
    itemsLeft.className = 'form-control';
    itemsLeft.disabled = true;
    var footer = document.getElementById('footer');
    footer.innerHTML = '';
    footer.appendChild(itemsLeft);
    
    if (todoList.todos.length === 0) {
      itemsLeft.style.visibility = 'hidden';
    }
    else {
      itemsToBeDone = totalTodos - completedTodos;
      if (itemsToBeDone === 1) { itemsLeft.value = itemsToBeDone + ' item left'; }
      else { itemsLeft.value = itemsToBeDone + ' items left'; }
      itemsLeft.style.visibility = 'visible';
    }
  },
  strikeThroughChange: function(isCompleted, input) {
    input.style.textDecoration = (isCompleted)?'line-through':'none';
  },
  setUpEventListeners: function() {
    var newTodo = document.getElementById('newTodo');
    newTodo.addEventListener('keyup', function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        handlers.addTodo();
      }
    });
    
    var toggleAll = document.getElementById("toggleAll").onclick = function() {
      handlers.toggleAll();
    };
  }
};

view.setUpEventListeners();