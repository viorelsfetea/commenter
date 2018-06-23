"use strict";
import Results from './data/Results';

const STATUS_COMPLETE = 'complete';
const observable = new ActionsObservable();

function resultsUpdatedCallback(tabId) {
    browser.runtime.sendMessage({
        type: 'resultsUpdated',
        tabId: tabId,
        results: results.results[tabId]
    });

    browser.browserAction.setBadgeText({tabId: tabId, text: results.results[tabId].length.toString()});
}

const results = new Results(resultsUpdatedCallback);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.hasOwnProperty('status') && changeInfo.status === STATUS_COMPLETE) {
        searchForUrl(tab.id, tab.url);
    }
});

function searchForUrl(tabId, tabUrl) {
    const builder = new Builder(observable, [HnObserver, RedditObserver]);
    builder.build();
    results.resetResultsForTab(tabId);
    observable.notify(tabId, tabUrl, results.append.bind(results));
}

browser.runtime.onMessage.addListener(parseMessage);

function parseMessage(message) {

    if( message.type === 'saveEntries' ) {
        console.log(message);
    }

    if( message.type === 'getResults' ) {
        if(results.results.hasOwnProperty(message.tabId)) {
            browser.runtime.sendMessage({
                type: 'resultsUpdated',
                tabId: message.tabId,
                results: results.results[message.tabId]
            });
        }
    }
}
