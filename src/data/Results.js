'use strict';

class Results {
    constructor(resultsUpdatedCallback) {
        if(typeof resultsUpdatedCallback !== 'function')
            throw Error('Results callback is not a function');

        this.results = {};
        this.resultsUpdatedCallback = resultsUpdatedCallback;
    }

    getResultsForTab(tabId) {
        if(!this.results.hasOwnProperty(tabId))
            throw Error('No results found for #' + tabId + ' tab id');

        return this.results[tabId];
    }

    hasResultsForTab(tabId) {
        return this.results.hasOwnProperty(tabId);
    }

    append(tabId, results) {
        this.initializeResultsArray(tabId);
        this.concat(tabId, results);
        this.parse(tabId);
        this.resultsUpdatedCallback(tabId);
    }

    parse(tabId) {
        this.results[tabId] = this.results[tabId].sort((result1, result2) => {
            if (result1.weight > result2.weight) return -1;
            if (result1.weight < result2.weight) return 1;

            return 0;
        });
    }

    concat(tabId, results) {
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

export default Results;
