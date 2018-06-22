"use strict";

const STATUS_COMPLETE = 'complete';
const observable = new ActionsObservable();

function resultsUpdatedCallback(tabId) {
    browser.runtime.sendMessage({
        type: 'resultsUpdated',
        tabId: tabId,
        results: resultsBuilder.results[tabId]
    });

    browser.browserAction.setBadgeText({tabId: tabId, text: resultsBuilder.results[tabId].length.toString()});
}

const resultsBuilder = new ResultsBuilder(resultsUpdatedCallback);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.hasOwnProperty('status') && changeInfo.status === STATUS_COMPLETE) {
        searchForUrl(tab.id, tab.url);
    }
});

function searchForUrl(tabId, tabUrl) {
    const builder = new Builder(observable, [HnObserver, RedditObserver]);
    builder.build();
    resultsBuilder.resetResultsForTab(tabId);
    observable.notify(tabId, tabUrl, resultsBuilder.appendResults.bind(resultsBuilder));
}

browser.runtime.onMessage.addListener(parseMessage);

function parseMessage(message) {

    if( message.type === 'saveEntries' ) {
        console.log(message);
    }

    if( message.type === 'getResults' ) {
        if(resultsBuilder.results.hasOwnProperty(message.tabId)) {
            browser.runtime.sendMessage({
                type: 'resultsUpdated',
                tabId: message.tabId,
                results: resultsBuilder.results[message.tabId]
            });
        }
    }
}
