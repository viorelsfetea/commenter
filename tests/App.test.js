import {assert} from 'chai';
import browser from 'sinon-chrome';

import App from '../src/App';
import Observer from "../src/observers/Observer";
import Observable from "../src/classes/Observable";

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

describe("App Suite", function() {
    before(function () {
        global.browser = browser;
    });

    beforeEach(function () {
        browser.runtime.sendMessage.flush();
    });

    it("tests observers are correctly initialized", function() {
        let app = new App();
        let mockObservable = new MockObservable();

        app.observable = mockObservable;
        app.initObservers([MockObserver, AnotherMockObserver]);

        assert.sameDeepMembers(mockObservable.getObservers(), [new MockObserver(), new AnotherMockObserver()]);
    });

    it("tests that on tab url changed listener is initiated", function () {
        let app = new App();

        app.listenForTabUrlChange();
        assert.ok(browser.tabs.onUpdated.addListener.calledOnce);
    });

    it("tests that on message listener is initiated", function () {
        let app = new App();

        app.listenForExternalMessages();
        assert.ok(browser.runtime.onMessage.addListener.calledOnce);
    });

    it("tests that tab url changed messaged is parsed correctly on status complete", function () {
        const tabId = 1;
        const tabUrl = 'my-url';

        let app = new App();
        let searchForUrlTabId = 0;
        let searchForUrlTabUrl = '';

        app.searchForUrl = (tabId, tabUrl) => {
            searchForUrlTabId = tabId;
            searchForUrlTabUrl = tabUrl;
        };

        app.listenForTabUrlChange();
        browser.tabs.onUpdated.dispatch(tabId, {'status': app.STATUS_COMPLETE}, {url: tabUrl});

        assert.equal(searchForUrlTabId, tabId);
        assert.equal(searchForUrlTabUrl, tabUrl);
    });

    it("tests that tab url changed messaged is parsed correctly on status incomplete", function () {
        const tabId = 1;
        const tabUrl = 'my-url';

        let app = new App();
        let searchForUrlTabId = 0;
        let searchForUrlTabUrl = '';

        app.searchForUrl = (tabId, tabUrl) => {
            searchForUrlTabId = tabId;
            searchForUrlTabUrl = tabUrl;
        };

        app.listenForTabUrlChange();
        browser.tabs.onUpdated.dispatch(tabId, {'status': 'really not done yet'}, {url: tabUrl});

        assert.equal(searchForUrlTabId, 0);
        assert.equal(searchForUrlTabUrl, '');
    });

    it("tests that message was correctly received", function () {
        let app = new App();

        let receivedType = '';
        let receivedTabId = 0;

        app.parseMessage = (message) => {
            receivedTabId = message.tabId;
            receivedType = message.type;
        };

        app.listenForExternalMessages();
        browser.runtime.onMessage.dispatch({type: 'some-type', tabId: 1});

        assert.equal(receivedTabId, 1);
        assert.equal(receivedType, 'some-type');
    });
});

