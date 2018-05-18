'use strict';

class ActionsObservable extends Observable {
    constructor() {
        super();
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify(url, callback) {
        this.observers.forEach((observer) => {
           observer.notify(url, callback);
        }, this);
    }
}
