import { schedule } from "./classes/Schedule.js";
import { ButtonRow } from "./UIComponents/Buttons.js";
import { DeleteButton } from "./UIComponents/DeleteButton.js";
import { TableView, ColumnConfig, CELL_EDIT_EVENT } from "./UIComponents/TableView.js";

function initApp() {    
    const viewDataMappings = [
        {
            id: 'group-view-btn',
            data: schedule.groups,
            columnConfigs: {
                id: new ColumnConfig(),
                name: new ColumnConfig({ header: 'Группа', editable: true }),
            }
        },
        {
            id: 'prof-view-btn',
            data: schedule.lecturers
        },
        {
            id: 'room-view-btn',
            data: schedule.rooms,
            columnConfigs: {
                id: new ColumnConfig(),
                name: new ColumnConfig({ header: 'Номер', editable: true }),
                building: new ColumnConfig({
                    header: 'Корпус',
                    type: 'dropdown',
                    dropdownOptions: schedule.buildings
                }),
                type: new ColumnConfig({
                    header: 'Тип аудитории',
                    type: 'dropdown',
                    dropdownOptions: schedule.room_types
                }),
            }
        },
    ];

    const tableContainer = document.getElementById('table-container');
    
    // Инициализация с первого представления в массиве (список групп)
    const initialView = viewDataMappings[0];
    let currentViewData = initialView.data;
    let currentConfigs = initialView.columnConfigs;

    const headers = Object.keys(currentViewData[0]);
    let tableView = new TableView(tableContainer, currentViewData, currentConfigs);
    
    // Сохранение данных после редактирования ячейки
    tableContainer.addEventListener(CELL_EDIT_EVENT, () => {
        schedule.saveData();
    });
    
    schedule.addObserver(tableView);

   // Создание кнопок для выбора редактируемых данных
    new ButtonRow(viewDataMappings.map(({ id, data, columnConfigs }) => ({
        id,
        callback: () => {
            tableView = new TableView(tableContainer, data, columnConfigs);
            tableView.render();
    
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