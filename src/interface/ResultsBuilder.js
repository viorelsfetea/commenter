'use strict';

class ResultsBuilder {
    constructor(resultsUpdatedCallback) {
        if(typeof resultsUpdatedCallback !== 'function')
            throw Error('ResultsBuilder callback is not a function');

        this.results = {};
        this.resultsUpdatedCallback = resultsUpdatedCallback;
    }

    appendResults(tabId, results) {
        this.initializeResultsArray(tabId);
        this.concatResults(tabId, results);
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

    concatResults(tabId, results) {
        this.results[tabId] = this.results[tabId].concat(results);
    }

    initializeResultsArray(tabId) {
        if(!this.results.hasOwnProperty(tabId)) {
            this.results[tabId] = [];
        }
    }

    resetResultsForTab(tabId) {
        if(this.results.hasOwnProperty(tabId))
            delete this.results[tabId];
    }
}

export default ResultsBuilder;