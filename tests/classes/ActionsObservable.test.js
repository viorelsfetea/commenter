import {assert} from 'chai';

import ActionsObservable from '../../src/classes/ActionsObservable';
import Observer from "../../src/observers/Observer";

class MockObserverOne extends Observer {
    constructor() {
        super();
        this.notified = false;
    }

    notify(tabId, tabUrl) {
        this.notified = true;

        return new Promise((resolve) => {resolve()});
    }
}

class MockObserverTwo extends MockObserverOne {
    constructor() {
        super();
    }
}

describe("Actions Observable Suite", function() {
    it("registers one observer", function() {
        const observer = new MockObserverOne();
        const observable = new ActionsObservable();

        observable.subscribe(observer);

        assert.equal(observable.observers.length, 1);
    });

    it("notifies one observer", function() {
        const observer = new MockObserverOne();
        const observable = new ActionsObservable();

        observable.subscribe(observer);
        observable.notify(1, '', () => {});

        assert.equal(observer.notified, true);
    });

    it("registers two observers", function() {
        const observerOne = new MockObserverOne();
        const observerTwo = new MockObserverTwo();
        const observable = new ActionsObservable();

        observable.subscribe(observerOne);
        observable.subscribe(observerTwo);

        assert.equal(observable.observers.length, 2);
    });

    it("notifies two observers", function() {
        const observerOne = new MockObserverOne();
        const observerTwo = new MockObserverTwo();
        const observable = new ActionsObservable();

        observable.subscribe(observerOne);
        observable.subscribe(observerTwo);

        observable.notify(1, '', () => {});

        assert.equal(observerOne.notified, true);
        assert.equal(observerTwo.notified, true);
    });
});

