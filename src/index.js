import "./styles.css";
import todoController from "./todo.js";
import displayController from "./display.js";

todoController.retrieveLocal();

displayController.renderTodos();
displayController.renderSidebarProjects();

displayController.addEventListeners();