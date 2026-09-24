import "./styles.css";
import todoController from "./todo.js";
import displayController from "./display.js";

todoController.createProject('daily');
todoController.createTodo('yo', 'afadf', new Date(), 4, 'daily');

console.log(todoController.storageAvailable('localStorage'));

todoController.storeLocal();

todoController.retrieveLocal();

displayController.renderTodos();