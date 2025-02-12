let todoList;
let todoInput;

window.onload = () => {
  // fetch system information through IPC as soon as window is loaded.
  getSystemInfo();
  // Execute the ping pong test to demonstrate the data flow cycle from the renderer 
  // to the main process, utilizing a callback function.
  testPingPong();

  todoList = document.getElementById('todo-list');
  todoInput = document.getElementById('todo-input');

};

/**
 * Fetches system information from main process
 */
function getSystemInfo() {
  window['system'].getSystemInfo().then((result) => {
    console.log('Current system Information is', result);
  }).catch((error) => {
    console.log('Something went wrong while fetching system info', error);

  });
}

/**
 * Triggers login and waits on auth code from login window, This is connected via IPC.
 */
function triggerLogin() {
  window['login'].launchLoginWindow().then((authCode) => {
    console.log('Login successful with AuthCode: ', authCode);
  }).catch((error) => {
    console.log('Error during login: ', error);
  });
}

/**
 * Test for ping pong with cb
 */
function testPingPong() {
  console.log('Sending data from renderer check Main process log for payload (data from renderer)');
  window['pingPong'].fromRender('data from renderer', (data) => {
    console.log('Pong from main:', data[0]);
  });
}

/**
 * Re-render list on UI
 */
function updateUI(todos) {
  todoList.innerHTML = '';
  todos.forEach((task, index) => {
    const li = document.createElement('li');
    li.setAttribute('data-index', index);
    li.innerHTML = `${task} <button class="delete-btn" onclick="deleteTodo(event)">Delete</button>`;
    todoList.appendChild(li);
  });
}

/**
 * Adds a task to list
 * trims value to remove whitespaces also checks for empty input
 */
function addTodo() {
  const task = todoInput.value.trim();
  if (task) {
    window['todo'].addTodo(task, (todos) => {
      updateUI(todos);
      todoInput.value = '';
    });
  }
}


function deleteTodo(event) {
  const index = event.target.parentElement.getAttribute('data-index');
  window['todo'].removeTodo(index, (todos) => {
    updateUI(todos);
  });
}