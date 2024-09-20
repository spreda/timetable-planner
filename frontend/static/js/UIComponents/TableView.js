export class TableView {
    constructor(tableElement, headers = [], displayNames = [], data = [], title = '', caption = '', classConfig = {}) {
        this.tableElement = tableElement;
        this.headers = headers;
        this.displayNames = displayNames; // Отображаемые названия для заголовков таблицы
        this.data = data;
        this.title = title;
        this.caption = caption;
        this.classConfig = {
            table: classConfig.table || 'table table-bordered',
            thead: classConfig.thead || 'table-light',
        };
    }

    getDisplayName(index) {
        return this.displayNames[index] || this.headers[index];
    }

    render() {
        const cardHeader = this.title ? `
            <div class="card-header bg-info text-white">
                <h2 class="h4 mb-0">${this.title}</h2>
            </div>
        ` : '';
        
        const tableCaption = this.caption ? `
            <caption>${this.caption}</caption>
        ` : '';

        this.tableElement.innerHTML = `
            ${cardHeader}
            <div class="card-body">
                <table class="${this.classConfig.table}">
                    ${tableCaption}
                    <thead class="${this.classConfig.thead}">
                    <tr>
                        ${this.headers.map((header, index) => 
                            `<th class="${index === 0 ? 'first-column' : 'other-column'}">${this.getDisplayName(index)}</th>`
                        ).join('')}
                    </tr>
                    </thead>
                    <tbody id="table-body">
                    </tbody>
                </table>
            </div>
        `;

        const tableBody = this.tableElement.querySelector('#table-body');
        this.data.forEach(rowData => {
            const row = document.createElement('tr');
            row.className = 'table-row';
            
            // Заполнение каждой ячейки в строке на основе объекта данных
            row.innerHTML = this.headers.map((header, index) => 
                `<td class="${index === 0 ? 'first-column' : 'other-column'}">${rowData[header] || ''}</td>`
            ).join('');
            tableBody.appendChild(row);
        });
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