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
// NEED TO CHANGE CONSTS AND ATTRIBUTES???
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable')
        .attr('id', task.id);
    const cardBody = $('<div>').addClass('card-body');
    const cardTitle = $('<h5>').addClass('card-title').text(task.title);
    const cardDueDate = $('<p>').addClass('card-text').text("Due Date: " + task.dueDate);
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    // Set the card background color based on due date if exists and the status is not done
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        // If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // Append elements to the card
    cardBody.append(cardTitle, cardDueDate, cardDescription, cardDeleteBtn);
    taskCard.append(cardBody);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // Clear existing task cards
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    // Loop through each task in the task list
    for (const task of taskList) {
        // Create a task card based on the task status
        const taskCard = createTaskCard(task);

        // Append the task card to the corresponding lane based on task status
        if (task.status === 'todo') {
            $('#todo-cards').append(taskCard);
        } else if (task.status === 'in-progress') {
            $('#in-progress-cards').append(taskCard);
        } else if (task.status === 'done') {
            $('#done-cards').append(taskCard);
        } else {
            console.error('Invalid task status:', task.status);
        }
    }

    // Make task cards draggable
    $('.task-card').draggable({
        revert: 'invalid',
        zIndex: 1000,
        scroll: false,
        containment: 'document',
        helper: 'clone'
    });
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList(); // Render task list
    // Add event listeners
    $('#addTaskForm').submit(handleAddTask); // Submit event for adding a task
    $('.delete').click(handleDeleteTask); // Click event for deleting a task
    // Make lanes droppable
    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
    });
    // Make the due date field a date picker
    $('#dueDate').datepicker();
});