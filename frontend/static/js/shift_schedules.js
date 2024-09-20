import { schedule } from "./classes/Schedule.js";
import { TableView } from "./UIComponents/TableView.js";

function getDaysAndWeekdaysInCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    return Array.from({ length: daysInMonth }, (_, i) => {
        const dayNumber = i + 1;
        const weekday = weekdays[new Date(year, month, dayNumber).getDay()];
        return `<div>${dayNumber}</div><div>${weekday}</div>`;
    });
}

function initApp() {
    const scheduleElement = document.getElementById('schedule-container');
    const dayNumbers = Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => i + 1);
    
    const shiftHeaders = ['name', ...dayNumbers];
    const shiftDisplayHeaders = ['Преподаватели', ...getDaysAndWeekdaysInCurrentMonth()];

    const shiftData = schedule.lecturers.map(lecturer => {
        const shiftEntry = { 'name': lecturer.name };
        for (let day of dayNumbers) {
            shiftEntry[day] = schedule.shifts[lecturer.id]?.[day] || ''; // Set shift value or empty string
        }
        return shiftEntry;
    });

    const tableView = new TableView(scheduleElement,
        shiftHeaders,
        shiftDisplayHeaders,
        [],
        shiftData,
        'Расписание смен',
        'Сентябрь',
        {'table': 'table-striped table table-bordered'}
    );
    tableView.render();
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);