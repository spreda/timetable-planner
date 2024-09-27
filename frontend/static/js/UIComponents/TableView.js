// Константы для имен событий
export const CELL_EDIT_EVENT = 'cellEdit';

export class ColumnConfig {
    constructor({ header, editable = true, type = 'text', dropdownOptions = [], action = null } = {}) {
        this.header = header;
        this.editable = editable;
        this.type = type; // text, dropdown, button, etc.
        this.dropdownOptions = dropdownOptions;
        this.action = action; // действия для кнопок
    }
}

// Отвечает за отображение данных в виде таблицы.
export class TableView {
    constructor(tableElement, data = [], columnConfigs = new Map(), title = '', classConfig = {}) {
        this.tableElement = tableElement;
        this.data = data;
        this.columnConfigs = columnConfigs instanceof Map ? columnConfigs : new Map(Object.entries(columnConfigs));
        this.title = title;
        this.classConfig = {
            table: classConfig.table || 'table table-bordered table-hover rounded-3 overflow-hidden',
            thead: classConfig.thead || 'table-active',
        };
        
        this.currentCell = null;
    }

    render() {
        if (!this.data.length) {
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
                            ${headers.map((header, index) => `<th>${displayHeaders[index]}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        ${this.data.map((rowData, rowIndex) => `
                            <tr>
                                ${headers.map((header) => `
                                    <td contenteditable="true" data-row="${rowIndex}" data-header="${header}">
                                        ${rowData[header] ?? ''}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        const tbody = this.tableElement.querySelector('#table-body');

        tbody.addEventListener('focus', (event) => {
            const cell = event.target.closest('td');
            if (cell) {
                this.currentCell = cell;
            }
        }, true);

        tbody.addEventListener('blur', (event) => {
            const cell = event.target.closest('td');
            if (cell) {
                const { row, header } = cell.dataset;
                this.updateCell(row, header, cell.innerText);
                this.currentCell = null;
            }
        }, true);

        tbody.addEventListener('keydown', (event) => {
            const cell = event.target.closest('td');
            if (!cell) return;
            if (event.key === 'Enter') {
                event.preventDefault();
                cell.blur();
            }
        });
    }

    handleCellEdit() {
        const event = new Event(CELL_EDIT_EVENT);
        this.tableElement.dispatchEvent(event);
    }

    updateCell(rowIndex, header, newValue) {
        if (this.data[rowIndex][header] != newValue) {
            console.log(`TableView: cell update row=${rowIndex}, header=${header}, newValue=${newValue}`);
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
