export class Button {
    constructor({ id, callback = null }) {
        this.buttonElement = document.getElementById(id);
        this.callback = callback;
        this.isActive = false;

        this.buttonElement.addEventListener('click', () => this.handleClick());
    }

    handleClick() {
        if (this.callback) {
            this.callback();
        }
    }

    setActive() {
        this.isActive = true;
        this.buttonElement.classList.add('active');
    }

    setInactive() {
        this.isActive = false;
        this.buttonElement.classList.remove('active');
    }
}


export class ButtonRow {
    constructor(buttonConfigs = []) {
        this.buttons = [];
        this.activeIndex = -1;

        buttonConfigs.forEach((config, index) => {
            const button = new Button(config);
            this.buttons.push(button);

            button.buttonElement.addEventListener('click', () => this.setActiveButton(index));
        });

        this.buttons[0].buttonElement.click();
    }

    setActiveButton(index) {
        if (index === this.activeIndex) return;

        console.log(`setActiveButton(${index})`);
        if (this.activeIndex !== -1) {
            this.buttons[this.activeIndex].setInactive();
        }
        this.buttons[index].setActive();
        this.activeIndex = index;

    }  
}
