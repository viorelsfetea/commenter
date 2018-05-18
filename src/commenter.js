"use strict";

const STATUS_COMPLETE = 'complete';

(function() {
    const observable = new ActionsObservable();
    const interfaceBuilder = new InterfaceBuilder();

    const builder = new Builder(observable, [HnObserver, RedditObserver]);
    builder.build();

    browser.runtime.onMessage.addListener(request => {
        if( request.tab.status === STATUS_COMPLETE ) {
            observable.notify(request.tab.url, interfaceBuilder.appendResults.bind(interfaceBuilder));
        }

        return Promise.resolve({});
    });

})();
