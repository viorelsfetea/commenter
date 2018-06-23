import {assert, expect} from 'chai';

import Results from '../src/data/Results';
import Result from "../src/data/Result";

describe("Results Builder Suite", function() {
    it("builds the results builder correctly", function() {
        const callback = () => {};

        const results = new Results(callback);

        assert.equal(results.resultsUpdatedCallback, callback);
        assert.deepEqual(results.results, {});
    });

    it("fails building without a correct callback", function() {
        const callback = "I'm such a string";

        expect(function() {
            new Results(callback);
        }).to.throw('Results callback is not a function');
    });

    it("fails calls the callback", function() {
        let callbackCalled = false;

        const callback = () => {
            callbackCalled = true;
        };

        const results = new Results(callback);

        results.append(0, [1, 2, 3]);

        assert.isTrue(callbackCalled);
    });

    it("fails to get the results when they were not retrieved", function () {
        const callback = () => {};
        const results = new Results(callback);

        expect(function() {
            results.getResults(123);
        }).to.throw('No results found for #123 tab id');
    });

    it("retrieves the results for one tab", function () {
        const callback = () => {};
        const results = new Results(callback);

        const tabId = 22;

        results.results[tabId] = [1, 2, 3];

        assert.deepEqual(results.getResults(tabId), [1, 2, 3])
    });

    it("initializes tab results array when it doesn't exist", function () {
        const callback = () => {};
        const tabId = 22;
        const results = new Results(callback);

        assert.isFalse(results.results.hasOwnProperty(tabId));
        results.initializeResultsArray(tabId);
        assert.isTrue(results.results.hasOwnProperty(tabId));
    });

    it("ignores tab results array if it already exists", function () {
        const callback = () => {};
        const tabId = 23;
        const resultsTestValue = 'Some test value';

        const results = new Results(callback);
        results.results[tabId] = resultsTestValue;
        results.initializeResultsArray(tabId);
        assert.equal(results.results[tabId], resultsTestValue);
    });

    it("resets tab results", function () {
        const callback = () => {};
        const tabId = 24;

        const results = new Results(callback);
        results.results[tabId] = [];

        results.resetResultsForTab(tabId);

        assert.isFalse(results.results.hasOwnProperty(tabId));
    });

    it("concats new added results with no preexisting results", function () {
        const callback = () => {};
        const tabId = 25;

        const results = new Results(callback);
        results.initializeResultsArray(tabId);

        results.concat(tabId, [1, 2, 3]);

        assert.deepEqual(results.results[tabId], [1, 2, 3]);
    });

    it("concats new added results with preexisting results", function () {
        const callback = () => {};
        const tabId = 26;

        const results = new Results(callback);
        results.results[tabId] = [1, 2];

        results.concat(tabId, [3, 4, 5]);

        assert.deepEqual(results.results[tabId], [1, 2, 3, 4, 5]);
    });

    it("parses results with one results", function () {
        const callback = () => {};
        const tabId = 27;

        const results = new Results(callback);
        results.initializeResultsArray(tabId);

        const mockResults1 = new Result(
            'A title', 'An url', 'An author', new Date(), 20, 2, '', ''
        );

        results.results[tabId].push(mockResults1);

        results.parse(tabId);

        assert.deepEqual(results.results[tabId], [mockResults1]);
    });

    it("parses results with four unordered results", function () {
        const callback = () => {};
        const tabId = 27;

        const results = new Results(callback);
        results.initializeResultsArray(tabId);

        const mockResults1 = new Result('A title', 'An url', 'An author', new Date(), 200, 2, '', '');
        const mockResults2 = new Result('A title', 'An url', 'An author', new Date(), 70, 2, '', '');
        const mockResults3 = new Result('A title', 'An url', 'An author', new Date(), 90, 2, '', '');
        const mockResults4 = new Result('A title', 'An url', 'An author', new Date(), 201, 2, '', '');

        results.results[tabId].push(mockResults1);
        results.results[tabId].push(mockResults2);
        results.results[tabId].push(mockResults3);
        results.results[tabId].push(mockResults4);

        results.parse(tabId);

        assert.deepEqual(results.results[tabId], [mockResults4, mockResults1, mockResults3, mockResults2]);
    });
});

