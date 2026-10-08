import todoController from './todo.js'
import { library, dom, icon } from '@fortawesome/fontawesome-svg-core';
import { faHouse, faCalendar, faCalendarDays, faDiagramProject, faTrash } from '@fortawesome/free-solid-svg-icons';
import {parseISO} from 'date-fns';

export default (function(){

    let state = 0;

    // adds icons to webpage
    library.add(faHouse, faCalendar, faCalendarDays, faDiagramProject, faTrash);
    dom.watch();

    // variable for content div
    const content = document.getElementById('content');

    let contentState = document.getElementById('home');

    // creates a todo on the display given relevant information
    function createTodoDisplay(title, date, id){
        const todo = document.createElement('div');
        todo.classList.add('todo');

        const todoButton = document.createElement('button');
        todoButton.classList.add('todo-button');
        todoButton.addEventListener('click', () => {
            const id = todoButton.parentElement.dataset.id;
            todoController.deleteTodo(id);
            todoController.storeLocal();

            todoButton.appendChild(document.createElement('div'));

            // transition
            todoButton.parentElement.classList.add('transition-delete');
        });
        todo.appendChild(todoButton);

        todo.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'opacity'){
                todo.remove();
                switch (state){
                    case 0:
                        renderTodos();
                        break;
                    case 1:
                        renderToday();
                        break;
                }
            }
        });

        const div = document.createElement('div');

        const descriptionText = document.createElement('p');
        descriptionText.classList.add('description');
        descriptionText.textContent = title;
        div.appendChild(descriptionText);

        const dateText = document.createElement('p');
        dateText.classList.add('date');
        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-calendar-days');
        dateText.appendChild(icon);
        dateText.append(' ' + date.toDateString());
        div.appendChild(dateText);

        todo.appendChild(div);
        todo.dataset.id = id;

        return todo;
    }

    // creates a project on the display
    function createProjectDisplay(projectName){
        const project = document.createElement('div');
        project.classList.add('project');
        const projectTitle = document.createElement('h2');
        projectTitle.textContent = projectName;
        projectTitle.classList.add('project-title');
        project.appendChild(projectTitle);

        return project;
    }

    // renders all the todos and projects from the data
    function renderTodos(){

        contentState.remove();
        contentState = document.createElement('div');
        contentState.id = 'home';

        const title = document.createElement('h1');
        title.textContent = 'Todo';
        title.classList.add('title');
        contentState.appendChild(title);
        contentState.appendChild(document.createElement('hr'));

        const projects = todoController.projects;
        for (let i = 0; i < projects.length; ++i){
            if (projects[i].list.length === 0) continue;
            const project = createProjectDisplay(projects[i].name);
            for (let j = 0; j < projects[i].list.length; ++j){
                const todoData = projects[i].list[j]; // todo object
                const todo = createTodoDisplay(todoData.title, todoData.dueDate, todoData.id);
                project.appendChild(todo);
                if (j != projects[i].list.length - 1) project.appendChild(document.createElement('hr'));
            }
            contentState.appendChild(project);
        }

        content.appendChild(contentState);

        state = 0;
    }

    function renderToday(){
        contentState.remove();
        contentState = document.createElement('div');
        contentState.id = 'today';

        const title = document.createElement('h1');
        title.textContent = 'Today';
        title.classList.add('title');
        contentState.appendChild(title);
        contentState.appendChild(document.createElement('hr'));

        const dayProject = todoController.getTodosByDate(new Date());
        console.log(dayProject);

        const emptyProject = document.createElement('div');
        emptyProject.classList.add('project');
        for (let i = 0; i < dayProject.list.length; ++i){
            const todoData = dayProject.list[i]; // todo object
            const todo = createTodoDisplay(todoData.title, todoData.dueDate, todoData.id);
            emptyProject.appendChild(todo);
            if (i != dayProject.list.length - 1) emptyProject.appendChild(document.createElement('hr'));
        }
        contentState.appendChild(emptyProject);

        content.appendChild(contentState);

        state = 1;
        
    }

    function renderProject(projectName){
        contentState.remove();
        contentState = document.createElement('div');

        const title = document.createElement('h1');
        title.textContent = projectName;
        title.classList.add('title');
        contentState.appendChild(title);
        contentState.appendChild(document.createElement('hr'));

        const emptyProject = document.createElement('div');
        emptyProject.classList.add('project');

        const projectData = todoController.projects.filter(project => {
            return project.name === projectName;
        })[0];

        projectData.list.forEach(todo => {
            const todoDisplay = createTodoDisplay(todo.title, todo.dueDate, todo.id);
            emptyProject.appendChild(todoDisplay);
            if (todo != projectData.list[projectData.list.length - 1]) emptyProject.appendChild(document.createElement('hr'));
        });

        contentState.appendChild(emptyProject);

        content.appendChild(contentState);

        state = projectName;

    }

    function resetDialog(){
        document.querySelector('#add-todo').close();
        document.getElementById('todo-form').reset();
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');
        document.getElementById('date').value = `${year}-${month}-${day}`;

        const projectSelect = document.getElementById('projects')
        projectSelect.innerHTML = "";
        todoController.projects.forEach(project => {
            const projectOption = document.createElement('option');
            projectOption.value = project.name;
            projectOption.textContent = project.name;
            if (project.name === 'Inbox') projectOption.selected = true;
            projectSelect.appendChild(projectOption);
        });
    }

    function createSidebarProjectDisplay(projectName) {
        const sidebarProject = document.createElement('div');
        sidebarProject.classList.add('sidebar-project');
        const sidebarContent = document.createElement('a');
        sidebarContent.href = "#";
        sidebarContent.classList.add('sidebar-element', 'sidebar-project');
        sidebarContent.textContent = "- " + projectName;
        sidebarContent.addEventListener('click', () => {
            renderProject(projectName);
        });
        sidebarProject.appendChild(sidebarContent);
        if (projectName !== "Inbox"){
            const trashIcon = icon(faTrash).node[0];
            trashIcon.classList.add('sidebar-icon');
            trashIcon.dataset.projectName = projectName;
            trashIcon.addEventListener('click', () => {
                todoController.deleteProject(trashIcon.dataset.projectName);
                todoController.storeLocal();
                renderSidebarProjects();
                renderTodos();
            });
            sidebarProject.appendChild(trashIcon);
        } 
        document.getElementById('sidebar').appendChild(sidebarProject);
    }

    function renderSidebarProjects(){
        document.querySelectorAll('.sidebar-project').forEach(projectDisplay => {
            projectDisplay.remove();
        });
        const projects = todoController.projects;
        projects.forEach(project => {
            createSidebarProjectDisplay(project.name);
        });
    }

    function addEventListeners(){

        // open dialog button
        const addButton = document.getElementById('add-button');
        addButton.addEventListener('click', () => {
            resetDialog();
        })

        // create todo button
        const todoForm = document.getElementById('todo-form');
        todoForm.addEventListener('submit', (event) => {

            // prevents webpage from POST request
            event.preventDefault();
            
            // gets form data
            const formData = Object.fromEntries(new FormData(event.target));

            todoController.createTodo(formData.title, formData.description, parseISO(formData.date), formData.priority, formData.projects);

            todoController.storeLocal();

            switch (state) {
                case 0:
                    renderTodos();
                    break;
                case 1:
                    renderToday();
                    break;
            }

            document.getElementById('add-todo').close();
            
        });

        // cancel dialog button
        const cancelButton = document.getElementById('cancel-todo');
        cancelButton.addEventListener('click', () => {
            document.querySelector('#add-todo').close();
        });

        // create project button
        const createProject = document.getElementById('create-project');
        createProject.addEventListener('click', () => {
            const projectInput = document.createElement('input');
            projectInput.id = 'project-input';
            projectInput.addEventListener('blur', () => {
                projectInput.remove();
            });
            projectInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const projectName = projectInput.value;
                    projectInput.blur();
                    todoController.createProject(projectName);
                    todoController.storeLocal();
                    renderSidebarProjects();
                }
            });
            document.getElementById('sidebar').appendChild(projectInput);
            projectInput.focus();
        });

        // Home button
        const homeButton = document.getElementById('home-button');
        homeButton.addEventListener('click', () => {
            renderTodos();
        });

        // Today button
        const todayButton = document.getElementById('today-button');
        todayButton.addEventListener('click', () => {
            renderToday();
        });


    }

    return {renderTodos, renderSidebarProjects, addEventListeners};

})();