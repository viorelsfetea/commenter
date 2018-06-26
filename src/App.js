import Results from './data/Results';
import ActionsObservable from "./classes/ActionsObservable";
import Builder from "./classes/Builder";
import HnObserver from "./observers/HnObserver";
import RedditObserver from "./observers/RedditObserver";

const STATUS_COMPLETE = 'complete';

class App {
    constructor() {
        this.results = new Results(this.resultsUpdatedCallback.bind(this));
        this.observable = new ActionsObservable();
    }

    init() {
        const builder = new Builder(this.observable, [HnObserver, RedditObserver]);
        builder.build();

        this.initListeners();
    }

    initListeners() {
        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if(!App.isTabUrlChanged(changeInfo)) return;

            this.searchForUrl(tab.id, tab.url);
        });

        browser.runtime.onMessage.addListener(this.parseMessage.bind(this));
    }

    searchForUrl(tabId, tabUrl) {
        this.results.resetResultsForTab(tabId);
        this.observable.notify(tabId, tabUrl, this.results.append.bind(this.results));
    }

    resultsUpdatedCallback(tabId) {
        browser.runtime.sendMessage({type: 'resultsUpdated', tabId: tabId, results: this.results.getResults(tabId)});

        browser.browserAction.setBadgeText({tabId: tabId, text: this.results.getResults(tabId).length.toString()});
    }

    parseMessage(message) {
        if( message.type === 'getResults' && this.results.getResults.hasOwnProperty(message.tabId)) {
            browser.runtime.sendMessage({
                type: 'resultsUpdated',
                tabId: message.tabId,
                results: this.results.getResults(message.tabId)
            });
        }
    }

    static isTabUrlChanged(changeInfo) {
        return changeInfo.hasOwnProperty('status') && changeInfo.status === STATUS_COMPLETE;
    }

}

export default App;
