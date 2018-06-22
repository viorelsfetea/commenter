'use strict';

class Builder {
    constructor(actionsObservable, observers) {
        this.actionsObservable = actionsObservable;
        this.observers = observers;
    }

    build() {
        this.observers.forEach((observer) => {
            this.actionsObservable.subscribe(new observer());
        }, this);
    }
}

export default Builder;