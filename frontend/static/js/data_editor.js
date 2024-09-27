import { schedule } from "./classes/Schedule.js";
import { ButtonRow } from "./UIComponents/Buttons.js";
import { DeleteButton } from "./UIComponents/DeleteButton.js";
import { TableView, ColumnConfig, CELL_EDIT_EVENT } from "./UIComponents/TableView.js";

function initApp() {    
    const viewDataMappings = [
        { id: 'group-view-btn', data: schedule.groups },
        { id: 'prof-view-btn', data: schedule.lecturers },
        { id: 'room-view-btn', data: schedule.rooms },
    ];

    const tableContainer = document.getElementById('table-container');
    
    // Инициализация с первого представления в массиве (список групп)
    const initialView = viewDataMappings[0];
    let currentViewData = initialView.data;

    const headers = Object.keys(currentViewData[0]);
    let tableView = new TableView(tableContainer, currentViewData);
    
    // Сохранение данных после редактирования ячейки
    tableContainer.addEventListener(CELL_EDIT_EVENT, () => {
        schedule.saveData();
    });
    
    schedule.addObserver(tableView);

   // Создание кнопок для выбора редактируемых данных
    new ButtonRow(viewDataMappings.map(({ id, data }) => ({
        id,
        callback: () => {
            let viewData = structuredClone(data);
            tableView.updateData(viewData);
        }
    })));
    
    // Сохранение данных при закрытии страницы
    window.addEventListener('beforeunload', (event) => {
        document.activeElement.blur();
        return;
    });
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);