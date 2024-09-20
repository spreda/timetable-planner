export class TableView {
    constructor(tableElement, headers = [], displayNames = [], columnEditModes = [], data = [], title = '', caption = '', classConfig = {}) {
        this.tableElement = tableElement;
        this.headers = headers;
        this.displayNames = displayNames;
        this.data = data;
        this.title = title;
        this.caption = caption;
        this.classConfig = {
            table: classConfig.table || 'table table-bordered',
            thead: classConfig.thead || 'table-light',
        };
        this.render();
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

        this.populateTableBody();
    }

    populateTableBody() {
        const tableBody = this.tableElement.querySelector('#table-body');
        tableBody.innerHTML = '';

        this.data.forEach(rowData => {
            const row = document.createElement('tr');
            row.className = 'table-row';

            row.innerHTML = this.headers.map((header, index) => 
                `<td class="${index === 0 ? 'first-column' : 'other-column'}">
                    <div class="cell-content">${rowData[header] ?? ''}</div>
                </td>`
            ).join('');

            // Bind editCell directly to the div elements
            row.querySelectorAll('.cell-content').forEach(div => {
                div.addEventListener('click', () => this.editCell(div));
            });

            tableBody.appendChild(row);
        });
    }

    editCell(div) {
        const cell = div.parentElement;
        const currentValue = div.innerText;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;

        input.style.width = `${currentValue.length + 1}ch`;;

        cell.innerHTML = '';
        cell.appendChild(input);

        input.addEventListener('blur', () => {
            const newValue = input.value;
            div.innerHTML = newValue;
            cell.innerHTML = '';
            cell.appendChild(div);
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                input.blur();
            }
        });

        input.focus();
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
