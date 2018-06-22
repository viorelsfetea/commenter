'use strict';
import Observable from './Observable';

class ActionsObservable extends Observable {
    constructor() {
        super();
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify(tabId, tabUrl, callback) {
        this.observers.forEach((observer) => {
           observer.notify(tabId, tabUrl, callback);
        }, this);
    }
}

export default ActionsObservable;