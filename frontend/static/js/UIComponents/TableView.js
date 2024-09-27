// Константы для имен событий
export const CELL_EDIT_EVENT = 'cellEdit';

export class ColumnConfig {
    constructor({ header, editable = false, type = 'text', dropdownOptions = [], action = null } = {}) {
        this.header = header;
        this.editable = editable;
        this.type = type; // text, dropdown, button, etc.
        this.dropdownOptions = Object.values(dropdownOptions);
        this.action = action; // действия для кнопок
    }
}

// Отвечает за отображение данных в виде таблицы.
export class TableView {
    constructor(tableElement, data = [], columnConfigs = new Map(), title = '', classConfig = {}) {
        this.tableElement = tableElement;
        this.data = Array.isArray(data) ? data : Object.values(data);
        this.columnConfigs = columnConfigs instanceof Map ? columnConfigs : new Map(Object.entries(columnConfigs));
        this.title = title;
        this.classConfig = {
            table: classConfig.table || 'table table-bordered table-hover rounded-3 overflow-hidden',
            thead: classConfig.thead || 'table-active',
        };
        
        this.currentCell = null;
    }

    render() {
        if (!this.data.length && !Object.keys(this.data)) {
            console.warn('Ошибка: нет данных')
            return;
        }

        const configHeaders =  [...this.columnConfigs.keys()];
        const headers = configHeaders.length ? configHeaders : Object.keys(this.data[0] || {});
        const displayHeaders = headers.map(name => this.columnConfigs.get(name)?.header ?? name);

        this.tableElement.innerHTML = `
            ${this.title ? `<div class="card-header"><h2 class="h4 mb-0">${this.title}</h2></div>` : ''}
            <div class="card-body">
                <table class="${this.classConfig.table}">
                    <thead class="${this.classConfig.thead}">
                        <tr>
                            ${displayHeaders.map((header) => `<th>${header}</th>`).join('')}
                            ${this.hasActions() ? '<th>Actions</th>' : ''}
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        ${this.data.map((rowData, rowIndex) => `
                            <tr>
                                ${headers.map((header) => `
                                    <td data-header="${header}" data-row="${rowIndex}">
                                        ${this.renderCell(header, rowData[header], rowIndex)}
                                    </td>`).join('')}
                                
                                ${this.hasActions() ? `<td>${this.renderActionButtons(rowIndex)}</td>` : ''}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Обработчики для редактирования ячеек и удаления строк
        this.addEventListeners();
    }

    hasActions() {
        return Object.values(this.columnConfigs).some(config => config.type === 'button' && config.action);
    }

    renderCell(header, value, rowIndex) {
        const config = this.columnConfigs.get(header) || {};
        if (config.type === 'dropdown' && config.dropdownOptions.length) {
            return `
                <select class="rounded-1" data-row="${rowIndex}" data-header="${header}">
                    ${config.dropdownOptions.map(option => `
                        <option value="${option}" ${option === value ? 'selected' : ''}>${option}</option>
                    `).join('')}
                </select>
            `;
        } else if (config.editable === true) {
            return `<span contenteditable="true">${value ?? ''}</span>`;
        } else {
            return `<span>${value ?? ''}</span>`;
        }
    }

    renderActionButtons(rowIndex) {
        const actionConfig = Object.values(this.columnConfigs).find(config => config.type === 'button' && config.action);
        return actionConfig ? `<button class="btn btn-danger btn-sm" data-row="${rowIndex}">${actionConfig.action.label}</button>` : '';
    }

    addEventListeners() {
        const tbody = this.tableElement.querySelector('#table-body');

        tbody.addEventListener('blur', (event) => {
            const cell = event.target.closest('td');
            if (cell && event.target.nodeName === 'SPAN') {
                const { row, header } = cell.dataset;
                const newValue = event.target.innerText;
                this.updateCell(row, header, newValue);
            }
        }, true);

        tbody.addEventListener('change', (event) => {
            const select = event.target.closest('select');
            if (select) {
                const { row, header } = select.dataset;
                const newValue = select.value;
                this.updateCell(row, header, newValue);
            }
        }, true);

        tbody.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (button) {
                const rowIndex = button.dataset.row;
                const actionConfig = Object.values(this.columnConfigs).find(config => config.type === 'button' && config.action);
                if (actionConfig && actionConfig.action.callback) {
                    actionConfig.action.callback(rowIndex);
                }
            }
        });
        
        tbody.addEventListener('keydown', (event) => {
            const cell = document.activeElement.closest('td');
            if (event.key === 'Enter') {
                event.preventDefault();
                if (cell) {
                    const activeElement = document.activeElement;
                    if (activeElement) {
                        activeElement.blur();
                    }
                }
            }
        }, true);
    }

    handleCellEdit() {
        const event = new Event(CELL_EDIT_EVENT);
        this.tableElement.dispatchEvent(event);
    }

    updateCell(rowIndex, header, newValue) {
        if (this.data[rowIndex][header] != newValue) {
            console.log(`TableView: обновление ячейки row=${rowIndex}, header=${header}, newValue=${newValue}`);
            this.data[rowIndex][header] = newValue;
            this.render();
            this.handleCellEdit();
        }
    }
    
    update() {
        console.log(`TableView: Таблица обновлена:`);
        this.render();
    }

    updateData(newData) {
        console.log(`TableView: Данные таблицы обновлены:`);
        this.data = newData;
        this.render();
    }
}
