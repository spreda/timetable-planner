import { schedule } from "./classes/Schedule.js";
import { TableView, ColumnConfig } from "./UIComponents/TableView.js";

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
    
    const shiftDisplayHeaders = getDaysAndWeekdaysInCurrentMonth();

    let columnConfigs = new Map();

    columnConfigs.set('name', new ColumnConfig({ header: 'Преподаватели' }));

    // Создание конфигураций
    dayNumbers.forEach((header, index) => {
        columnConfigs.set(header, new ColumnConfig({
            header: shiftDisplayHeaders[index], // Заголовок на русском
            editable: true // Ячейки можно редактировать
        }));
    });

    const shiftData = schedule.lecturers.map(lecturer => {
        const shiftEntry = { 'name': lecturer.name };
        for (let day of dayNumbers) {
            shiftEntry[day] = schedule.shifts[lecturer.id]?.[day] || '';
        }
        return shiftEntry;
    });
    
    console.log(columnConfigs)
    const tableView = new TableView(
        scheduleElement,
        shiftData,
        columnConfigs,
        'Расписание смен на сентябрь',
    );
    tableView.render();
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);