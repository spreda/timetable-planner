let courses = [
    { id: 1, name: 'Математика', professor: 'Др. Смирнов' },
    { id: 2, name: 'Физика', professor: 'Др. Иванов' },
];
let groups = [
    { id: 1, name: '1БС11' },
    { id: 2, name: '1БС12' },
    { id: 3, name: '1БС20' },
    { id: 4, name: '1БС30' },
    { id: 5, name: '1БС30п' },
    { id: 6, name: '1ИС41п' },
    { id: 7, name: '1ИС10' },
    { id: 8, name: '1ИС21' },
    { id: 9, name: '1ИС22' },
    { id: 10, name: '1ИС30' },
    { id: 11, name: '1ИС30п' },
];
let timeslots = [
    { id: 1, date: '16.09.2024', type: 'Лекция', courseId: 1, room: 'A101', groupId: 8 },
    { id: 2, date: '16.09.2024', type: 'Практическое занятие', courseId: 2, room: 'B202', groupId: 9 },
];

class Schedule {
    constructor(courses, groups, timeslots) {
      this.courses = courses;
      this.groups = groups;
      this.timeslots = timeslots;
    }
}

function listView(schedule, timetable) {
    timetable.innerHTML = `
        <div class="card-header bg-info text-white">
            <h2 class="h4 mb-0">Текущее расписание</h2>
        </div>
        <div class="card-body">
            <table class="table table-bordered table-hover">
                <thead class="table-light">
                <tr>
                    <th>Дата</th>
                    <th>Номер пары</th>
                    <th>Дисциплина</th>
                    <th>Тип</th>
                    <th>Преподаватель</th>
                    <th>Аудитория</th>
                    <th>Группа</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody id="timetableBody">
                </tbody>
            </table>
        </div>`
    const timetableBody = document.getElementById('timetableBody');
    schedule.timeslots.forEach(slot => {
        const course = schedule.courses.find(c => c.id === parseInt(slot.courseId));
        const group = schedule.groups.find(c => c.id === parseInt(slot.groupId));
        const row = document.createElement('tr');
        row.className = 'timetable-row';
        row.innerHTML = `
            <td>${slot.date}</td>
            <td>${slot.id}</td>
            <td>${course ? course.name : 'Н/Д'}</td>
            <td>${slot.type}</td>
            <td>${course ? course.professor : 'Н/Д'}</td>
            <td>${slot.room}</td>
            <td>${group.name ? course.name : 'Н/Д'}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteTimeslot(${slot.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        timetableBody.appendChild(row);
    });

}

function gridView(timeslots, timetable) {
    timetable.innerHTML = `
        <div class="card-header bg-info text-white">
            <h2 class="h4 mb-0">Текущее расписание</h2>
        </div>
        <div class="card-body">
            <table class="table table-bordered table-hover">
                <thead class="table-light">
                <tr>
                    <th>Группа</th>
                    <th>Понедельник</th>
                    <th>Вторник</th>
                    <th>Среда</th>
                    <th>Четверг</th>
                    <th>Пятница</th>
                    <th>Суббота</th>
                </tr>
                </thead>
                <tbody id="timetableBody">
                </tbody>
            </table>
        </div>`
    const timetableBody = document.getElementById('timetableBody');
    schedule.groups.forEach(group => {
        const slots = schedule.timeslots.find(s => s.groupId === parseInt(group.id));
        console.log(group.name, slots);
        const row = document.createElement('tr');
        row.className = 'timetable-row';
        row.innerHTML = `
            <td>${group.name}</td>
        `
        
        timetableBody.appendChild(row);
    });
}

function updateCourseSelect() {
    lessonDate = document.getElementById('lessonDate');
    lessonDate.value = new Date().toISOString().substring(0, 10);
    courseSelect = document.getElementById('timeslotCourseId');
    courseSelect.innerHTML = '<option value="" disabled selected>Выберите дисциплину</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
    });
}

function deleteTimeslot(id) {
    timeslots = timeslots.filter(slot => slot.id !== id);
    renderTimetable();
}

function initApp() {
//    document.getElementById('courseForm').addEventListener('submit', function(e) {
//        e.preventDefault();
//        const name = document.getElementById('courseName').value;
//        const professor = document.getElementById('courseProfessor').value;
//        courses.push({ id: courses.length + 1, name, professor });
//        this.reset();
//        updateCourseSelect();
//        renderTimetable();
//    });

    document.getElementById('timeslotForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newTimeslot = {
            id: timeslots.length + 1,
            day: document.getElementById('timeslotDay').value,
            startTime: document.getElementById('timeslotStartTime').value,
            endTime: document.getElementById('timeslotEndTime').value,
            courseId: parseInt(document.getElementById('timeslotCourseId').value),
            room: document.getElementById('timeslotRoom').value
        };
        timeslots.push(newTimeslot);
        this.reset();
        renderTimetable();
    });

    schedule = new Schedule(courses, groups, timeslots);
    
    const listViewBtn = document.getElementById('list-view-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const scheduleContainer = document.getElementById('schedule-container');

    listViewBtn.addEventListener('click', function() {
        scheduleContainer.classList.remove('grid-view');
        scheduleContainer.classList.add('list-view');
        setActiveButton(listViewBtn);
    });

    gridViewBtn.addEventListener('click', function() {
        scheduleContainer.classList.remove('list-view');
        scheduleContainer.classList.add('grid-view');
        setActiveButton(gridViewBtn);
    });

    function setActiveButton(activeButton) {
        listViewBtn.classList.remove('active');
        gridViewBtn.classList.remove('active');
        activeButton.classList.add('active');
    }

    listViewBtn.addEventListener('click', function() {
    scheduleContainer.classList.remove('grid-view');
    scheduleContainer.classList.add('list-view');
    listView(schedule, scheduleContainer); // Обновляем HTML для списка
    setActiveButton(listViewBtn);
    });

    gridViewBtn.addEventListener('click', function() {
    scheduleContainer.classList.remove('list-view');
    scheduleContainer.classList.add('grid-view');
    gridView(schedule, scheduleContainer); // Обновляем HTML для сетки
    setActiveButton(gridViewBtn);
    });

    function setActiveButton(activeButton) {
    listViewBtn.classList.remove('active');
    gridViewBtn.classList.remove('active');
    activeButton.classList.add('active');
    }

    // По умолчанию устанавливаем вид сетки
    gridViewBtn.click();

    updateCourseSelect();
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);