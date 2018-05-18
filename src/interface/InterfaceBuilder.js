'use strict';

class InterfaceBuilder {
    constructor() {
        this.results = [];
    }

    appendResults(results) {
        this.results.push(results);
        this.parseResults();
    }

    parseResults() {
        console.log('Results', this.results);
    }
}
