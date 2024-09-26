import { ColorThemeSwitch } from "./UIComponents/ColorThemeSwitch.js";

function initApp() {
    // Переключение цветовой темы
    new ColorThemeSwitch();
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);