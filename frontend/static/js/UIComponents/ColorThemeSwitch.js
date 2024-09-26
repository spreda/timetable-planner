import { Button } from "./Buttons.js";

export class ColorThemeSwitch {
    constructor() {
        this.switchElement = document.getElementById('theme-switch-container');
        this.switchElement.innerHTML = `<i class="bi" id="color-theme-image"></i>`;
        this.imageElement = document.getElementById('color-theme-image');
        
        Object.assign(this, new Button({
            id: 'color-theme-image',
            callback: () => this.toggleTheme()
        }));

        this.theme = this.getPreferredTheme();
        this.setTheme(this.theme);
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
        console.log('Store:', theme);
    }

    getPreferredTheme() {
        const storedTheme = this.getStoredTheme()
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        if (theme === 'light') {
            this.imageElement.classList.remove('bi-moon');
            this.imageElement.classList.add('bi-sun');
        } else {
            this.imageElement.classList.remove('bi-sun');
            this.imageElement.classList.add('bi-moon')
        }
        this.setStoredTheme(theme);
    }

    toggleTheme() {
        if (this.theme === 'light') {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        this.setTheme(this.theme)
    }
}