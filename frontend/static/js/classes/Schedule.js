let courses = [
    { id: 1, name: 'Наладчик компьютерных сетей' },
    { id: 2, name: 'Технология разработки и защиты баз данных' },
    { id: 2, name: 'Стандартизация, сертификация и техническое документоведение' },
    { id: 2, name: 'Иностранный язык в профессиональной деятельности' },
    { id: 2, name: 'Разработка программных модулей' },
    { id: 2, name: 'Менеджмент в профессиональной деятельности' },
    { id: 2, name: 'Физическая культура ОГСЭ.05' },
    { id: 2, name: 'Разговоры о важном / классный час' },
];

let lesson_types = {
    0: 'Лекция',
    1: 'Пр. занятие',
    2: 'Экзамен',
};
console.log()
let groups = [
    { id: 6, name: '1ИС41п' },
    { id: 7, name: '1ИС10' },
    { id: 8, name: '1ИС21' },
    { id: 9, name: '1ИС22' },
    { id: 10, name: '1ИС30' },
    { id: 11, name: '1ИС30п' },
];

let syllabus = {
    1: {
        1: { course: 'Математика', prof: 'Киркоров Ф.П.', form_of_attestation: 'экз'},
        2: { course: 'Физика', prof: 'Киркоров Ф.П.', form_of_attestation: 'дз' },
    }
};

let rooms = {
    0: { name: '305', building: 'Гл (ИндИ)', "type": "Учебная аудитория" },
    1: { name: '325', building: 'Гл (ИндИ)', "type": "Учебная аудитория" },
    2: { name: '323', building: 'Гл (ИндИ)', "type": "Учебная аудитория" },
    3: { name: 'СЗ', building: 'Гл (ИндИ)', "type": "Спортивный зал" },
    4: { name: '301', building: 'Гл (ИндИ)', "type": "Компьютерный класс" },
};


let buildings = {
    0: 'Гл (ИндИ)',
    1: '2 (ИндИ)',
};

let room_types = {
    0: 'Учебная аудитория',
    1: 'Компьютерный класс',
    2: 'Спортивный зал',
};

let lecturers = [
    { id: 0, name: 'Киркоров Ф.П.' },
    { id: 1, name: 'Фриске Ж.А.' },
    { id: 2, name: 'Лыков А.С.' },
    { id: 3, name: 'Краса Л.И.' },
    { id: 4, name: 'Никитин Д.И.' },
    { id: 5, name: 'Хрюмик А А.' },
    { id: 6, name: 'Авкина Л.И.' },
    { id: 7, name: 'Никитин Д. И.' },
];

let timeslots = {};

function sample(collection){
    collection = Object.values(collection);
    return collection[Math.floor(Math.random() * collection.length)];
}

let timeslotCounter = Object.keys(timeslots).length;

groups.forEach(group => {
    [...Array(6).keys()].forEach(day => {
        day += 23;
        [...Array(3).keys()].forEach(lesson_number => {
            lesson_number += 1;
            timeslots[timeslotCounter] = {
                timeslot: String(lesson_number),
                date: `${day}.09.2024`,
                course: sample(courses).name,
                type: sample(lesson_types),
                lecturer: sample(lecturers).name,
                room: sample(rooms).name,
                group: group.name
            };
            timeslotCounter++;
        });
    });
});

let shifts = {
    0: { 1: '+', 2: '-', 3: '-', 4: '+', 5: '-', 6: '+', 7: '-', 8: '+' },
};

// Управляет данными расписания
export class Schedule {
    constructor(courses, lesson_types, groups, rooms, buildings, room_types, timeslots, lecturers, shifts) {
        this.courses = courses;
        this.lesson_types = lesson_types;
        this.groups = groups;
        this.rooms = rooms;
        this.buildings = buildings;
        this.room_types = room_types;
        this.timeslots = timeslots;
        this.lecturers = lecturers;
        this.shifts = shifts;
        this.observers = [];
        //this.loadData();
        this.saveTimeout = null;

        // Сохранение при закрытии страницы
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });

        // Автосохранение с заданным интервалом
        this.autoSaveInterval = setInterval(() => {
            this.saveData();
        }, 10000);
    }

    exportData() {
        return JSON.stringify({
            'courses': this.courses,
            'lesson_types': this.lesson_types,
            'groups': this.groups,
            'rooms': this.rooms,
            'buildings': this.buildings,
            'room_types': this.room_types,
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
            this.lesson_types = data.lesson_types;
            this.groups = data.groups;
            this.rooms = data.rooms;
            this.buildings = data.buildings;
            this.room_types = data.room_types;
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
    
    deleteEntity(entityType, id) {
        const entityList = this.data[entityType];
        if (!entityList) {
            entityList = entityList.filter(entity => entity.id !== id);
            this.notifyObservers();
            this.saveData();
        }
    }
}

export let schedule = new Schedule(courses, lesson_types, groups, rooms, buildings, room_types, timeslots, lecturers, shifts);