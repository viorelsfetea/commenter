'use strict';

class ResultsBuilder {
    constructor(resultsUpdatedCallback) {
        this.results = {};
        this.resultsUpdatedCallback = resultsUpdatedCallback;
    }

    appendResults(tabId, results) {
        this.initializeResultsArray(tabId);
        this.results[tabId] = this.results[tabId].concat(results);
        this.parseResults(tabId);
        this.resultsUpdatedCallback(tabId);
    }

    parseResults(tabId) {
        this.results[tabId] = this.results[tabId].sort((result1, result2) => {
            if (result1.weight > result2.weight) return -1;
            if (result1.weight < result2.weight) return 1;

            return 0;
        });
    }

    initializeResultsArray(tabId) {
        if(!this.results.hasOwnProperty(tabId)) {
            this.results[tabId] = [];
        }
    }

    resetResultsForTab(tabId) {
        delete this.results[tabId];
    }
}
