import {assert} from 'chai';

import Builder from '../src/classes/Builder';
import Observable from '../src/classes/Observable';
import Observer from '../src/observers/Observer';

class MockObserver extends Observer {}
class AnotherMockObserver extends Observer {}

class MockObservable extends Observable {
    constructor() {
        super();
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    getObservers() {
        return this.observers;
    }
}

describe("Builder Suite", function() {
    it("builds with one worker", function() {
        const observer = new MockObservable();
        const builder = new Builder(observer, [MockObserver]);
        builder.build();

        assert.sameDeepMembers(observer.getObservers(), [new MockObserver()]);
    });

    it("builds with two observers", function() {
        const observer = new MockObservable();
        const builder = new Builder(observer, [MockObserver, AnotherMockObserver]);
        builder.build();

        assert.sameDeepMembers(observer.getObservers(), [new MockObserver(), new AnotherMockObserver()]);
    });
});

