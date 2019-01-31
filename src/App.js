import browser from 'webextension-polyfill'

import Results from './data/Results';
import ActionsObservable from "./classes/ActionsObservable";
import Builder from "./classes/Builder";
class App {
    constructor() {
        this.results = new Results(this.resultsUpdatedCallback.bind(this));
        this.observable = new ActionsObservable();
        this.STATUS_COMPLETE = 'complete';
    }

    init(observers) {
        this.initObservers(observers);
        this.initListeners();
    }

    initObservers(observers) {
        new Builder(this.observable, observers).build();
    }

    initListeners() {
        this.listenForTabUrlChange();
        this.listenForExternalMessages();
    }

    listenForTabUrlChange() {
        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if(!this.isTabUrlChanged(changeInfo)) return;

            this.searchForUrl(tabId, tab.url);
        });
    }

    listenForExternalMessages() {
        browser.runtime.onMessage.addListener(this.parseMessage.bind(this));
    }

    searchForUrl(tabId, tabUrl) {
        this.results.resetResultsForTab(tabId);
        this.observable.notify(tabId, tabUrl, this.results.append.bind(this.results));
    }

    resultsUpdatedCallback(tabId) {
        this.notifyResultsUpdated(tabId);
        this.updateBadgeText(tabId);
    }

    notifyResultsUpdated(tabId) {
        browser.runtime.sendMessage({
            type: 'resultsUpdated',
            tabId: tabId,
            results: this.results.getResultsForTab(tabId)
        }).catch(App.logError);
    }

    updateBadgeText(tabId) {
        browser.browserAction.setBadgeText({
            tabId: tabId,
            text: this.results.getResultsForTab(tabId).length.toString()
        }).catch(App.logError);
    }

    parseMessage(message) {
        if( message.type === 'getResultsForTab' && this.results.hasResultsForTab(message.tabId)) {
            browser.runtime.sendMessage({
                type: 'resultsUpdated',
                tabId: message.tabId,
                results: this.results.getResultsForTab(message.tabId)
            }).catch(App.logError);
        }
    }

    isTabUrlChanged(changeInfo) {
        return changeInfo.hasOwnProperty('status') && changeInfo.status === this.STATUS_COMPLETE;
    }

    static logError(error) {
        console.error(error);
    }
}

export default App;
