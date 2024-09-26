import { schedule } from "./classes/Schedule.js";
import { ButtonRow } from "./UIComponents/Buttons.js";
import { TableView } from "./UIComponents/TableView.js";

function listView(schedule, timetableElement) {
    timetableElement.innerHTML = `
        <div class="card-header">
            <h2 class="h4 mb-0">Текущее расписание</h2>
        </div>
        <div class="card-body">
            <table class="table table-bordered table-hover">
                <thead class="table-light">
                <tr>
                    <th>Дата</th>
                    <th>Номер пары</th>
                    <th>Предмет</th>
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
            <td>${course ? course.prof : 'Н/Д'}</td>
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

function updateCourseSelect() {
    let lessonDate = document.getElementById('lessonDate');
    lessonDate.value = new Date().toISOString().substring(0, 10);
    let courseSelect = document.getElementById('timeslotCourseId');
    courseSelect.innerHTML = '<option value="" disabled selected>Предмет</option>';
    schedule.courses.forEach(course => {
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

let parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day); 
};

function initApp() {
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

    let btnRow = new ButtonRow([
        {id: 'group-view-btn'},
        {id: 'prof-view-btn'},
        {id: 'room-view-btn'},
    ]);
    
    const scheduleElement = document.getElementById('schedule-container');

    let daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    let tableViewHeaders = [ 'name', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    let tableViewDisplayHeaders = [ 'Группа', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    let tableViewData = schedule.groups.map(group => {
        let scheduleEntry = { name: group.name };
        
        // Инициализация пустых звписей для каждого дня
        daysOfWeek.forEach(day => scheduleEntry[day] = '');
    
        // Заполнение расписания для группы
        schedule.timeslots.forEach(slot => {
            if (slot.groupId === group.id) {
                const dayIndex = parseDate(slot.date).getDay();
                if (dayIndex >= 1 && dayIndex <= 6) {
                    const dayName = daysOfWeek[dayIndex - 1];
                    scheduleEntry[dayName] = `
                    <div>
                        <div>${schedule.courses.find(c => c.id === slot.courseId).name}</div>
                        <div>${slot.type}</div>
                        <div>${slot.room}</div>
                    </div>`;
                }
            }
        });
    
        return scheduleEntry;
    });

    let tableView = new TableView(
        scheduleElement,
        tableViewHeaders,
        tableViewDisplayHeaders,
        tableViewData,
        'Текущее расписание'
    );

    let viewSelect = new ButtonRow([
        {id: 'table-view-btn', callback: () => {
            scheduleElement.classList.toggle('table-view');
            tableView.render();
        }},
        {id: 'list-view-btn', callback: () => {
            scheduleElement.classList.toggle('list-view');
            listView(schedule, scheduleElement);
        }},
    ]);

    updateCourseSelect();
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);