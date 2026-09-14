import {compareAsc, format} from "date-fns";

class Todo {
    constructor(title, description, dueDate, priority){
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

export default class TodoList {
    constructor(){
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