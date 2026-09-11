
// ==========================================
// ТРЕКЕР ЗАДАЧ
// ==========================================


// Получаем элементы страницы

const taskList = document.getElementById("taskList");

const taskInput = document.getElementById("taskInput");

const addTaskButton =
    document.getElementById("addTaskButton");

const prioritySelect =
    document.getElementById("prioritySelect");

const categorySelect =
    document.getElementById("categorySelect");

const dateInput =
    document.getElementById("dateInput");

const searchInput =
    document.getElementById("searchInput");

const emptyMessage =
    document.getElementById("emptyMessage");

const themeButton =
    document.getElementById("themeButton");


// Статистика

const activeCount =
    document.getElementById("activeCount");

const completedCount =
    document.getElementById("completedCount");

const totalCount =
    document.getElementById("totalCount");


// ==========================================
// Данные
// ==========================================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ==========================================
// Сохранение задач
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// ==========================================
// Отображение задач
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    let filteredTasks =
        tasks.filter(task => {

            // Поиск

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);


            if (!matchesSearch) {
                return false;
            }


            // Фильтр

            if (currentFilter === "all") {
                return true;
            }


            if (currentFilter === "active") {
                return !task.completed;
            }


            if (currentFilter === "completed") {
                return task.completed;
            }


            if (currentFilter === "urgent") {
                return task.category === "urgent";
            }


            if (currentFilter === "important") {
                return task.category === "important";
            }


            if (currentFilter === "postponed") {
                return task.category === "postponed";
            }


            return true;
        });


    // Если задач нет

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }


    // Создание элементов задач

    filteredTasks.forEach(task => {

        const taskElement =
            document.createElement("div");


        taskElement.className = "task";


        // Категория

        if (task.category === "urgent") {

            taskElement.classList.add(
                "category-urgent"
            );

        } else if (task.category === "important") {

            taskElement.classList.add(
                "category-important"
            );

        } else if (task.category === "postponed") {

            taskElement.classList.add(
                "category-postponed"
            );
        }


        // Выполненная задача

        if (task.completed) {

            taskElement.classList.add(
                "completed"
            );
        }


        // Название приоритета

        let priorityText = "Обычная";

        if (task.priority === "important") {
            priorityText = "Важная";
        }

        if (task.priority === "urgent") {
            priorityText = "Срочная";
        }


        // Название категории

        let categoryText = "Обычная";

        if (task.category === "important") {
            categoryText = "Важная";
        }

        if (task.category === "urgent") {
            categoryText = "Срочная";
        }

        if (task.category === "postponed") {
            categoryText = "Отложенная";
        }


        // Дата

        let dateText = "Без даты";

        if (task.date) {

            dateText =
                new Date(
                    task.date + "T00:00:00"
                ).toLocaleDateString("ru-RU");
        }


        taskElement.innerHTML = `

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                aria-label="Выполнить задачу"
            >

            <span class="task-text">
                ${escapeHtml(task.title)}
            </span>

            <span class="priority priority-${task.priority}">
                ${priorityText}
            </span>

            <span class="task-status">
                ${task.completed
                    ? "Выполнено"
                    : categoryText}
            </span>

            <span class="task-date">
                📅 ${dateText}
            </span>

            <button class="edit-button">
                Изменить
            </button>

            <button class="delete-button">
                Удалить
            </button>
        `;


        // Checkbox

        const checkbox =
            taskElement.querySelector(
                'input[type="checkbox"]'
            );

        checkbox.addEventListener(
            "change",
            () => toggleTask(task.id)
        );


        // Изменить

        const editButton =
            taskElement.querySelector(
                ".edit-button"
            );

        editButton.addEventListener(
            "click",
            () => editTask(task.id)
        );


        // Удалить

        const deleteButton =
            taskElement.querySelector(
                ".delete-button"
            );

        deleteButton.addEventListener(
            "click",
            () => deleteTask(task.id)
        );


        taskList.appendChild(taskElement);
    });


    updateStats();
}


// ==========================================
// Добавление задачи
// ==========================================

function addTask() {

    const title =
        taskInput.value.trim();


    if (title === "") {

        alert("Введите название задачи");

        taskInput.focus();

        return;
    }


    const newTask = {

        id: Date.now(),

        title: title,

        completed: false,

        priority:
            prioritySelect.value,

        category:
            categorySelect.value,

        date:
            dateInput.value
    };


    tasks.push(newTask);


    saveTasks();


    // Очистка формы

    taskInput.value = "";

    prioritySelect.value = "normal";

    categorySelect.value = "normal";

    dateInput.value = "";


    renderTasks();

    taskInput.focus();
}


// ==========================================
// Выполнить / вернуть задачу
// ==========================================

function toggleTask(id) {

    tasks =
        tasks.map(task => {

            if (task.id === id) {

                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;
        });


    saveTasks();

    renderTasks();
}


// ==========================================
// Удаление задачи
// ==========================================

function deleteTask(id) {

    const confirmed =
        confirm(
            "Вы действительно хотите удалить эту задачу?"
        );


    if (!confirmed) {
        return;
    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();
}


// ==========================================
// Редактирование задачи
// ==========================================

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    const newTitle =
        prompt(
            "Измените название задачи:",
            task.title
        );


    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) {
        return;
    }


    task.title =
        newTitle.trim();


    saveTasks();

    renderTasks();
}


// ==========================================
// Статистика
// ==========================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    activeCount.textContent =
        active;

    completedCount.textContent =
        completed;

    totalCount.textContent =
        total;
}


// ==========================================
// Фильтры
// ==========================================

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );
                    });


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();
            }
        );
    });


// ==========================================
// Добавление задачи
// ==========================================

addTaskButton.addEventListener(
    "click",
    addTask
);


// Enter

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();
        }
    }
);


// ==========================================
// Поиск
// ==========================================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ==========================================
// Тёмная / светлая тема
// ==========================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

        themeButton.textContent =
            "☀️ Светлая тема";

    } else {

        document.body.classList.remove(
            "dark-theme"
        );

        themeButton.textContent =
            "🌙 Тёмная тема";
    }
}


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-theme"
        );


        const isDark =
            document.body.classList.contains(
                "dark-theme"
            );


        if (isDark) {

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeButton.textContent =
                "☀️ Светлая тема";

        } else {

            localStorage.setItem(
                "theme",
                "light"
            );

            themeButton.textContent =
                "🌙 Тёмная тема";
        }
    }
);


// ==========================================
// Защита от HTML
// ==========================================

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// Форма "Связаться с нами"
// ==========================================

const contactForm =
    document.getElementById(
        "contactForm"
    );


contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        alert(
            "Сообщение отправлено!"
        );


        contactForm.reset();
    }
);


// ==========================================
// Запуск приложения
// ==========================================

loadTheme();

renderTasks();

