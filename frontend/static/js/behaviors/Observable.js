function observable() {
    return {
        observers: [],
        addObserver(observer) {
            if (typeof observer.update === 'function') {
                this.observers.push(observer);
            } else {
                console.warn('Observer must have an update method');
            }
        },
        removeObserver(observer) {
            this.observers = this.observers.filter(obs => obs !== observer);
        },
        notifyObservers() {
            this.observers.forEach(observer => observer.update());
        }
    };
}

function observer() {
    return {
        render() {
            console.log("Component: render method");
        },
        update() {
            this.render();
        }
    };
}