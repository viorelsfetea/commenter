import {assert} from 'chai';
import moxios from 'moxios'
import sinon from 'sinon';

import HnObserver from '../../src/observers/HnObserver';

describe("HackerNews Observer Suite", function() {
    beforeEach(function () {
        // import and pass your custom axios instance to this method
        moxios.install()
    });

    afterEach(function () {
        // import and pass your custom axios instance to this method
        moxios.uninstall()
    });

    it("makes a successfull HTTP request", function(done) {
        const observer = new HnObserver();
        const tabId = 1;

        observer.notify(tabId, 'https://google.com');

        moxios.wait(function () {
            let request = moxios.requests.mostRecent();

            console.log(request);
            request.respondWith({
                status: 200,
                response: [
                    { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
                    { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
                ]
            }).then(function () {

                done()
            });
        });
    });
});

