let tasks = [];
const getTask = localStorage.getItem('taskFromStorage');
if (getTask) {
    tasks = JSON.parse(getTask);
}

let task = document.getElementById('text');
const add = document.getElementById('add');
const delete1 = document.getElementById('delete1');
const hidden = document.querySelector('.hidden');
const searchInput = document.getElementById('search');
const allBtn = document.getElementById('all');
const completedBtn = document.getElementById('completed');
const pendingBtn = document.getElementById('pending');
const counter = document.querySelector('.counter');
const clearCompleted = document.querySelector('.clearCompleted');
renderTask();
setActive(allBtn);
updateCounter()

add.addEventListener('click', function () {
    let task1 = task.value;
    if (task1.trim() === "") {
        return;
    } else {
        tasks.push({
            text: task1, completed: false
        });
        task.value = "";
        updateCounter()
        renderTask();
        saveToStorage();
    }
})

clearCompleted.addEventListener('click', function () {
    tasks = tasks.filter(t => !t.completed);
    renderTask();
    saveToStorage()
    updateCounter()
})

allBtn.addEventListener('click', () => {
    searchInput.value = "";
    renderTask();
    setActive(allBtn);
});

completedBtn.addEventListener('click', () => {
    let completedTasks = tasks.filter(t => t.completed);
    searchInput.value = "";
    renderTask(completedTasks);
    setActive(completedBtn);
});

pendingBtn.addEventListener('click', () => {
    let pendingTasks = tasks.filter(t => !t.completed);
    searchInput.value = "";
    renderTask(pendingTasks);
    setActive(pendingBtn);
});

searchInput.addEventListener('input', () => {
    let searchVal = searchInput.value.toLowerCase();

    if (searchVal === "") {
        renderTask();
        return;
    }

    let filtered = tasks.filter((t) => {
        return t.text.toLowerCase().includes(searchVal);
    });

    renderTask(filtered);
});

function renderTask(list = tasks) {
    if (list.length === 0) {
        hidden.innerHTML = `No tasks found 😴`;
        return;
    } else {
        hidden.innerHTML = "";

        list.forEach((taskItem) => {

            let realIndex = tasks.indexOf(taskItem);

            hidden.innerHTML += `
        <p data-index="${realIndex}" class="${taskItem.completed ? 'done' : ''}">
            ${taskItem.text}
            <button data-index="${realIndex}" class="del">Delete</button>
            <button data-index="${realIndex}" class="do">Completed</button>
            <button data-index="${realIndex}" class="edit">Edit</button>
        </p>`;
        });
    }

}
task.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        add.click();
    }
});

hidden.addEventListener('click', function (e) {
    if (e.target.classList.contains('del')) {
        const parent = e.target.parentElement;
        const index = parent.getAttribute("data-index");

        tasks.splice(index, 1);
        updateCounter()
        renderTask();
        saveToStorage();
    } else if (e.target.classList.contains('do')) {
        const parent = e.target.parentElement;
        const index = parent.getAttribute("data-index");

        tasks[index].completed = !tasks[index].completed;

        updateCounter()
        renderTask();
        saveToStorage();
    } else if (e.target.classList.contains('edit')) {
        const parent = e.target.parentElement;
        const index = parent.getAttribute("data-index");
        const text = tasks[index].text;
        task.value = text;
        tasks.splice(index, 1);
        updateCounter()
        renderTask();
        saveToStorage();
    }
})

function setActive(clickedBtn) {
    allBtn.classList.remove('active');
    completedBtn.classList.remove('active');
    pendingBtn.classList.remove('active');
    clickedBtn.classList.add('active');
}

function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    counter.innerText = `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}

function saveToStorage() {
    localStorage.setItem("taskFromStorage", JSON.stringify(tasks));
}