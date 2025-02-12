const { parentPort } = require("process");

const todos = [];

function initTodoExecutorHandler() {
  parentPort.on('message', (message) => {
    console.log('Got message from parent process for event', message.data.event);
    switch (message.data.event) {
      case 'addTodo':
        todos.push(message.data.task);
        console.log(`Added task: ${message.data.task}`);
        parentPort.postMessage({ event: 'addTodoSuccess', data: todos });
        break;
      case 'removeTodo':
        todos.splice(message.data.taskIndex, 1);
        console.log(`Removing item at index ${message.data.taskIndex}`);
        parentPort.postMessage({ event: 'removeTodoSuccess', data: todos });
        break;

      default:
        break;
    }
  })
}

initTodoExecutorHandler();
