export class TableView {
    constructor(tableElement, headers = [], displayNames = [], data = [], title = '', classConfig = {}) {
        this.tableElement = tableElement;
        this.headers = headers;
        this.displayNames = displayNames;
        this.data = data;
        this.title = title;
        this.classConfig = {
            table: classConfig.table || 'table table-bordered',
            thead: classConfig.thead || 'table-light',
        };
    }

    getDisplayName(index) {
        return this.displayNames[index] || this.headers[index];
    }

    render() {
        this.tableElement.innerHTML = `
            ${this.title ? `<div class="card-header bg-info text-white"><h2 class="h4 mb-0">${this.title}</h2></div>` : ''}
            <div class="card-body">
                <table class="${this.classConfig.table}">
                    <thead class="${this.classConfig.thead}">
                        <tr>
                            ${this.headers.map((header, index) => `<th>${this.getDisplayName(index)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        ${this.data.map((rowData, rowIndex) => `
                            <tr>
                                ${this.headers.map((header) => `
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

        this.tableElement.querySelector('#table-body').addEventListener('blur', (event) => {
            if (event.target.tagName === 'TD') {
                const { row, header } = event.target.dataset;
                this.data[row][header] = event.target.innerText;a
                schedule.saveData();
            }
        }, true);
    }

    updateData(newData) {
        this.data = newData;
        this.render();
    }

    updateHeaders(newHeaders) {
        this.headers = newHeaders;
        this.render();
    }
}
