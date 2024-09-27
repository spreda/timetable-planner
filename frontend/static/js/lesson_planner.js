import { schedule } from "./classes/Schedule.js";
import { ButtonRow } from "./UIComponents/Buttons.js";
import { TableView, ColumnConfig, CELL_EDIT_EVENT } from "./UIComponents/TableView.js";

function listView(schedule, tableContainer) {
    const tableViewData = schedule.timeslots;

    const columnConfigs = new Map([
        ['date', new ColumnConfig({ header: 'Дата' })],
        ['timeslot', new ColumnConfig({
            header: 'Номер пары',
            type: 'dropdown',
            dropdownOptions: ['1', '2', '3','4', '5', '6', '7']
        })],
        ['course', new ColumnConfig({
            header: 'Предмет',
            type: 'dropdown',
            dropdownOptions: Object.values(schedule.courses).map(course => course.name)
        })],
        ['type', new ColumnConfig({
            header: 'Тип занятия',
            type: 'dropdown',
            dropdownOptions: schedule.lesson_types
        })],
        ['lecturer', new ColumnConfig({
            header: 'Преподаватель',
            type: 'dropdown',
            dropdownOptions: Object.values(schedule.lecturers).map(lecturer => lecturer.name)
        })],
        ['room', new ColumnConfig({
            header: 'Кабинет',
            type: 'dropdown',
            dropdownOptions: Object.values(schedule.rooms).map(room => room.name)
        })],
        ['group', new ColumnConfig({
            header: 'Группа',
            type: 'dropdown',
            dropdownOptions: Object.values(schedule.groups).map(group => group.name)
        })],
    ]);
    
    console.log(tableViewData)

    const tableView = new TableView(
        tableContainer,
        tableViewData,
        columnConfigs,
        'Текущее расписание'
    );
    schedule.addObserver(tableView);
    
    tableView.render();
}

function gridView(schedule, tableContainer) {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const daysOfWeekRussian = [ 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    
    const tableViewData = schedule.groups.map(group => {
        let scheduleEntry = { name: group.name };
        
        // Заполнение расписания для группы
        Object.values(schedule.timeslots).forEach(slot => {
            if (slot.group === group.name) {
                const dayIndex = parseDate(slot.date).getDay();
                if (dayIndex >= 1 && dayIndex <= 6) {
                    const dayName = daysOfWeek[dayIndex - 1];
                    scheduleEntry[dayName] = `
                    <table class="table child-table table-sm table-responsive m-0 p-0">
                        <tr>
                            <td>${slot.course}</td>
                            <td>${slot.type}</td>
                        </tr>
                        <tr>
                            <td>${slot.lecturer}</td>
                            <td>${slot.room}</td>
                        </tr>
                    </table>`;
                }
            }
        });
    
        return scheduleEntry;
    });

    const columnConfigs = {
        name: new ColumnConfig({ header: 'Группа' }),
    };

    // Создание конфигурации для каждого дня недели
    daysOfWeek.forEach((day, index) => {
        columnConfigs[day] = new ColumnConfig({
            header: daysOfWeekRussian[index], // Заголовок на русском
        });
    });

    const tableView = new TableView(
        tableContainer,
        tableViewData,
        columnConfigs,
        'Текущее расписание'
    );

    tableView.render();
}

let parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day); 
};

function initApp() {    
    const scheduleElement = document.getElementById('schedule-container');

    scheduleElement.addEventListener(CELL_EDIT_EVENT, () => {
        schedule.saveData();
    });

    const viewButtons = new ButtonRow([
        {id: 'table-view-btn', callback: () => {
            scheduleElement.classList.remove('list-view');
            scheduleElement.classList.add('grid-view');
            gridView(schedule, scheduleElement);
        }},
        {id: 'list-view-btn', callback: () => {
            scheduleElement.classList.remove('grid-view');
            scheduleElement.classList.add('list-view');
            listView(schedule, scheduleElement);
        }},
    ]);
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);