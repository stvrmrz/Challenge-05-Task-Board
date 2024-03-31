// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Check if 'taskList' or 'nextId' is null or undefined and assign default values.
if (!taskList) {
    taskList = [];
}
if (!nextId) {
    nextId = 1;
}

// Todo: create a function to generate a unique task id
// Returns the nextId and then increments it
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card task-card draggable')
    .attr('id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(project.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardTitle = $('<p>').addClass('card-title').text(task.title);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-project-id', project.id);
  cardDeleteBtn.on('click', handleDeleteProject);

    // ? Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardTitle, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

  return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
