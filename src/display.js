import todoController from './todo.js'
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faHouse, faCalendar, faCalendarDays, faDiagramProject } from '@fortawesome/free-solid-svg-icons';

export default (function(){

    library.add(faHouse, faCalendar, faCalendarDays, faDiagramProject);
    dom.watch();
    
    const addButton = document.getElementById('add-button');

    const content = document.getElementById('content');

    function createTodo(description, date){
        const todo = document.createElement('div');
        todo.classList.add('todo');

        const todoButton = document.createElement('button');
        todoButton.classList.add('todo-button');
        todoButton.appendChild(document.createElement('div'));
        todo.appendChild(todoButton);

        const div = document.createElement('div');

        const descriptionText = document.createElement('p');
        descriptionText.classList.add('description');
        descriptionText.textContent = description;
        div.appendChild(descriptionText);

        const dateText = document.createElement('p');
        dateText.classList.add('date');
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-calendar-days');
        dateText.appendChild(icon);
        dateText.append(' ', date.toDateString());
        div.appendChild(dateText);

        todo.appendChild(div);

        return todo;
    }

    function createProject(projectName){
        const project = document.createElement('div');
        project.classList.add('project');
        const projectTitle = document.createElement('h2');
        projectTitle.textContent = projectName;
        projectTitle.classList.add('project-title');
        project.appendChild(projectTitle);

        return project;
    }

    function renderTodos(){
        const projects = todoController.projects;
        for (let i = 0; i < projects.length; ++i){
            if (projects[i].list.length === 0) continue;
            const project = createProject(projects[i].name);
            for (let j = 0; j < projects[i].list.length; ++j){
                const todo = createTodo(projects[i].list[j].description, projects[i].list[j].dueDate);
                project.appendChild(todo);
                if (j != projects[i].list.length - 1) project.appendChild(document.createElement('hr'));
            }
            content.appendChild(project);
        }
    }

    return {createTodo, createProject, renderTodos};

})();