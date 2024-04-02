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
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
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
        if (task.status === 'to-do') {
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

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault(); // Prevent the form from submitting normally

    // Get input values from the form
    const title = $('#taskTitle').val();
    const description = $('#taskDescription').val();
    const dueDate = $('#dueDate').val();

    // Create a new task object
    const newTask = {
        id: generateTaskId(), // Generate a unique ID for the task
        title: title,
        description: description,
        dueDate: dueDate,
        status: 'to-do' // Assuming new tasks are always in the 'todo' status
    };

    // Add the new task to the task list
    taskList.push(newTask);

    // Save the updated task list to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Increment nextId for the next task
    nextId++;

    // Render the updated task list
    renderTaskList();

    // Close the modal after adding the task
    $('#formModal').modal('hide');

    // Clear the form fields
    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#dueDate').val('');
}
// Todo: create a function to handle dropping a task onto a lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('id');
    const status = $(event.target).attr('id');
    
    // Update the status of the dropped task
    const taskIndex = taskList.findIndex(task => task.id.toString() === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = status;
        
        // Save the updated task list to localStorage
        localStorage.setItem('tasks', JSON.stringify(taskList));
        
        // Re-render the task list
        renderTaskList();
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr('data-task-id');
    
    // Remove the task from the taskList array
    taskList = taskList.filter(task => task.id.toString() !== taskId);
    
    // Save the updated task list to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));
    
    // Re-render the task list
    renderTaskList();
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
    $('#dueDate').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});
