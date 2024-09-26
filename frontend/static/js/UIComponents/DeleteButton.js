import { Button } from "./Buttons.js";

export class DeleteButton {
    constructor(id) {
        const callback = () => {
                console.log(`DeleteButton: ${id}`);
        };
        Object.assign(this, new Button({'id': id, 'callback': callback}));
        this.buttonElement.classList.add('btn');
        this.buttonElement.classList.add('btn-sm');
        this.buttonElement.classList.add('btn-danger');
        this.buttonElement.innerHTML = '<i class="bi bi-trash"></i>';
    }
}