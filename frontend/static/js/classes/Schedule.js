let courses = [
    { id: 1, name: 'Математика', prof: 'Др. Смирнов' },
    { id: 2, name: 'Физика', prof: 'Др. Иванов' },
];

let groups = [
    { id: 1, name: '1БС11' },
    { id: 2, name: '1БС12' },
    { id: 3, name: '1БС20' },
    { id: 4, name: '1БС30' },
    { id: 5, name: '1БС30п' },
    { id: 6, name: '1ИС41п' },
    { id: 7, name: '1ИС10' },
    { id: 8, name: '1ИС21' },
    { id: 9, name: '1ИС22' },
    { id: 10, name: '1ИС30' },
    { id: 11, name: '1ИС30п' },
];

let rooms = [
    { id: 0, name: '305', building: 'Гл (ИндИ)', "type": "Учебная аудитория" },
    { id: 1, name: '325', building: 'Гл (ИндИ)', "type": "Учебная аудитория" },
    { id: 2, name: '323', building: 'Гл (ИндИ)', "type": "Учебная аудитория" },
    { id: 3, name: 'СЗ', building: 'Гл (ИндИ)', "type": "Спортивный зал" },
    { id: 4, name: '301', building: 'Гл (ИндИ)', "type": "Компьютерный класс" },
];

let timeslots = [
    { id: 1, date: '16.09.2024', type: 'Лекция', courseId: 1, room: '101', groupId: 8 },
    { id: 2, date: '16.09.2024', type: 'Практическое занятие', courseId: 2, room: '202', groupId: 9 },
];

let lecturers = [
    { id: 0, name: "Игнатенко Е.С.." },
    { id: 1, name: "Тяпкова Т.В." },
    { id: 2, name: "Макеева Н.В.." },
    { id: 3, name: "Джабраилов М.С" },
    { id: 4, name: "Леонов А.Е." },
];

let shifts = {
    0: { 1: '+', 2: '-', 3: '-', 4: '+', 5: '-', 6: '+', 7: '-', 8: '+' },
};

// Управляет данными расписания
export class Schedule {
    constructor(courses, groups, rooms, timeslots, lecturers, shifts) {
        this.courses = courses;
        this.groups = groups;
        this.rooms = rooms;
        this.timeslots = timeslots;
        this.lecturers = lecturers;
        this.shifts = shifts;
        this.observers = [];
        this.loadData();
        this.saveTimeout = null;

        // Сохранение при закрытии страницы
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });

        // Автосохранение с заданным интервалом
        this.autoSaveInterval = setInterval(() => {
            this.saveData();
        }, 5000);
    }

    exportData() {
        return JSON.stringify({
            'courses': this.courses,
            'groups': this.groups,
            'rooms': this.rooms,
            'timeslots': this.timeslots,
            'lecturers': this.lecturers,
            'shifts': this.shifts,
        });
    }

    importData(data) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (typeof data === 'object') {
            this.courses = data.courses;
            this.groups = data.groups;
            this.rooms = data.rooms;
            this.timeslots = data.timeslots;
            this.lecturers = data.lecturers;
            this.shifts = data.shifts;

            console.log('Schedule: данные импортированы');
            this.notifyObservers();
        } else {
            console.warn('Schedule: импорт не удался');
        }
    }

    addObserver(observer) {
        if (typeof observer.update === 'function') {
            console.log(`Schedule: добавлен observer: ${ observer.constructor.name}`);
            this.observers.push(observer);
        } else {
            console.warn('Observer does not implement the update method:', observer);
        }
    }

    removeObserver(observer) {
        console.log(`Schedule: removed observer: ${ observer.constructor.name}`);
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => {
            console.log(`Schedule: уведомление`, observer.constructor.name);
            observer.update();
        });
    }

    loadData() {
        const savedData = JSON.parse(localStorage.getItem('scheduleData'));
        if (savedData) {
            this.importData(savedData);
            console.log('Schedule: данные загружены');
        }
    }

    saveData() {
        clearTimeout(this.saveTimeout);
        if (this.exportData() != localStorage.getItem('scheduleData')) {
            localStorage.setItem('scheduleData', this.exportData());
            console.log('Schedule: данные сохранены');
        }
    }
    
    updateField(entityType, id, field, value) {
        const entity = this.data[entityType][id];
        if (!entity) {
            console.warn(`Сущность с ID ${id} не найдена в ${entityType}.`);   
        }
        if (entity[field] !== value) {
            entity[field] = value;
            this.saveData();
        }
    }
}

export let schedule = new Schedule(courses, groups, rooms, timeslots, lecturers, shifts);