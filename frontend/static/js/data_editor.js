import { schedule } from "./classes/Schedule.js";
import { ButtonRow } from "./UIComponents/Buttons.js";
import { TableView } from "./UIComponents/TableView.js";

function initApp() {
    const views = ['group-view-btn', 'prof-view-btn', 'room-view-btn'];

    let data = [schedule.groups, schedule.lecturers, schedule.rooms];
    let currentData = data[0];

    const scheduleElement = document.getElementById('table-container');
    let headers =  Object.keys(currentData[0]);
    
    let tableView = new TableView(
        scheduleElement,
        headers,
        headers,
        currentData,
    );

    let viewSwitch = new ButtonRow([
        {id: views[0], callback: () => {
            schedule.saveData();
            tableView.updateHeaders(Object.keys(data[0][0]));
            tableView.updateData(data[0]);
        }},
        {id: views[1], callback: () => {
            schedule.saveData();
            tableView.updateHeaders(Object.keys(data[1][0]));
            tableView.updateData(data[1]);
        }},
        {id: views[2], callback: () => {
            schedule.saveData();
            tableView.updateHeaders(Object.keys(data[2][0]));
            tableView.updateData(data[2]);
        }},
    ]);
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);