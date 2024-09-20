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

let timeslots = [
    { id: 1, date: '16.09.2024', type: 'Лекция', courseId: 1, room: 'A101', groupId: 8 },
    { id: 2, date: '16.09.2024', type: 'Практическое занятие', courseId: 2, room: 'B202', groupId: 9 },
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

export class Schedule {
    constructor(courses, groups, timeslots, lecturers, shifts) {
      this.courses = courses;
      this.groups = groups;
      this.timeslots = timeslots;
      this.lecturers = lecturers;
      this.shifts = shifts;
    }
}

export let schedule = new Schedule(courses, groups, timeslots, lecturers, shifts);