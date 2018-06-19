'use strict';

class InterfaceBuilder {
    constructor() {
        this.results = [];
    }

    appendResults(results) {
        this.results = this.results.concat(results);
        this.parseResults();
        this.sendResults();
        this.updateBadge();
    }

    parseResults() {
        this.results = this.results.sort((result1, result2) => {
            if (result1.weight > result2.weight) return -1;
            if (result1.weight < result2.weight) return 1;

            return 0;
        });
    }

    sendResults() {
        /*browser.tabs.query({active: true, currentWindow: true})
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {"type": "resultsReady", "results": this.results});
            });*/
    }

    updateBadge() {
        browser.runtime.sendMessage({"type": "updateBadge", "totalCount": this.results.length});
    }
}
