import {assert, expect} from 'chai';

import ResultsBuilder from '../src/interface/ResultsBuilder';
import Result from "../src/interface/Result";

describe("Results Builder Suite", function() {
    it("builds the results builder correctly", function() {
        const callback = () => {};

        const results_builder = new ResultsBuilder(callback);

        assert.equal(results_builder.resultsUpdatedCallback, callback);
        assert.deepEqual(results_builder.results, {});
    });

    it("fails building without a correct callback", function() {
        const callback = "I'm such a string";

        expect(function() {
            new ResultsBuilder(callback);
        }).to.throw('ResultsBuilder callback is not a function');
    });

    it("fails calls the callback", function() {
        let callbackCalled = false;

        const callback = () => {
            callbackCalled = true;
        };

        const results_builder = new ResultsBuilder(callback);

        results_builder.appendResults(0, [1, 2, 3]);

        assert.isTrue(callbackCalled);
    });

    it("initializes tab results array when it doesn't exist", function () {
        const callback = () => {};
        const tabId = 22;
        const results_builder = new ResultsBuilder(callback);

        assert.isFalse(results_builder.results.hasOwnProperty(tabId));
        results_builder.initializeResultsArray(tabId);
        assert.isTrue(results_builder.results.hasOwnProperty(tabId));
    });

    it("ignores tab results array if it already exists", function () {
        const callback = () => {};
        const tabId = 23;
        const resultsTestValue = 'Some test value';

        const results_builder = new ResultsBuilder(callback);
        results_builder.results[tabId] = resultsTestValue;
        results_builder.initializeResultsArray(tabId);
        assert.equal(results_builder.results[tabId], resultsTestValue);
    });

    it("resets tab results", function () {
        const callback = () => {};
        const tabId = 24;

        const results_builder = new ResultsBuilder(callback);
        results_builder.results[tabId] = [];

        results_builder.resetResultsForTab(tabId);

        assert.isFalse(results_builder.results.hasOwnProperty(tabId));
    });

    it("concats new added results with no preexisting results", function () {
        const callback = () => {};
        const tabId = 25;

        const results_builder = new ResultsBuilder(callback);
        results_builder.initializeResultsArray(tabId);

        results_builder.concatResults(tabId, [1, 2, 3]);

        assert.deepEqual(results_builder.results[tabId], [1, 2, 3]);
    });

    it("concats new added results with preexisting results", function () {
        const callback = () => {};
        const tabId = 26;

        const results_builder = new ResultsBuilder(callback);
        results_builder.results[tabId] = [1, 2];

        results_builder.concatResults(tabId, [3, 4, 5]);

        assert.deepEqual(results_builder.results[tabId], [1, 2, 3, 4, 5]);
    });

    it("parses results with one results", function () {
        const callback = () => {};
        const tabId = 27;

        const results_builder = new ResultsBuilder(callback);
        results_builder.initializeResultsArray(tabId);

        const mockResults1 = new Result(
            'A title', 'An url', 'An author', new Date(), 20, 2, '', ''
        );

        results_builder.results[tabId].push(mockResults1);

        results_builder.parseResults(tabId);

        assert.deepEqual(results_builder.results[tabId], [mockResults1]);
    });

    it("parses results with four unordered results", function () {
        const callback = () => {};
        const tabId = 27;

        const results_builder = new ResultsBuilder(callback);
        results_builder.initializeResultsArray(tabId);

        const mockResults1 = new Result('A title', 'An url', 'An author', new Date(), 200, 2, '', '');
        const mockResults2 = new Result('A title', 'An url', 'An author', new Date(), 70, 2, '', '');
        const mockResults3 = new Result('A title', 'An url', 'An author', new Date(), 90, 2, '', '');
        const mockResults4 = new Result('A title', 'An url', 'An author', new Date(), 201, 2, '', '');

        results_builder.results[tabId].push(mockResults1);
        results_builder.results[tabId].push(mockResults2);
        results_builder.results[tabId].push(mockResults3);
        results_builder.results[tabId].push(mockResults4);

        results_builder.parseResults(tabId);

        assert.deepEqual(results_builder.results[tabId], [mockResults4, mockResults1, mockResults3, mockResults2]);
    });
});

