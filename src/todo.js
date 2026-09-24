import {compareAsc, format} from "date-fns";

class Todo {
    constructor(title, description, dueDate, priority, projectName){
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectName = projectName;
    }
}

class TodoList {
    constructor(name){
        this.name = name;
        this.list = [];
    }

    addTodo(todo){
        this.list.push(todo);
    }

    deleteTodo(id){
        this.list = this.list.filter((element) => element.id !== id);
    }

    sortPriority(){
        this.list.sort((a, b) => a.priority - b.priority);
    }

    sortDate(){
        this.list.sort(compareAsc);
    }
}

export default (function(){

    const defaultList = new TodoList('default');

    // holds all projects
    let projects = [defaultList];

    // creates a project
    function createProject(name){
        const project = new TodoList(name);
        projects.push(project);
    }

    // creates a todo instance and adds it to the default list and its project if it has one
    function createTodo(title, description, dueDate, priority, projectName){
        const todo = new Todo(title, description, dueDate, priority, projectName);
        projects.filter(project => project.name === todo.projectName).forEach((project) => {
            project.list.push(todo);
        });
    }

    // deletes a todo instance from the default list and its project if it has one based on id
    function deleteTodo(id){
        projects.forEach(project => project.deleteTodo(id));
    }

    // deletes a project and all todo instances associated with it
    function deleteProject(projectName){
        projects = projects.filter(project => project.name !== projectName);
        projects[0].list.filter(todo => todo.projectName !== projectName);
    }

    // stores all information through local storage
    function storeLocal(){
        const jsonStore = JSON.stringify(projects);
        console.log(jsonStore);
        localStorage.setItem('projects', jsonStore);
    }

    // retrieves all information through local storage
    function retrieveLocal(){
        const jsonStore = JSON.parse(localStorage.getItem('projects'));
        console.log(jsonStore);
        projects = jsonStore;
        projects.forEach(project => Object.setPrototypeOf(project, TodoList.prototype));
    }

    function storageAvailable(type) {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            console.log(e.name, e.message);
            return (
                e instanceof DOMException &&
                e.name === "QuotaExceededError" &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage &&
                storage.length !== 0
            );
        }
      }

    return {createProject, createTodo, deleteTodo, deleteProject, storeLocal, retrieveLocal, storageAvailable, projects};

})();