import fs from 'fs';
import path  from 'path';

import {assert} from 'chai';
import moxios from 'moxios'

import HnObserver from '../../src/observers/HnObserver';

describe("HackerNews Observer Suite", function() {
    const verifyResultItem = function(actual, expected) {
        assert.equal(actual.constructor.name, expected.constructor);
        assert.equal(actual.title, expected.title);
        assert.equal(actual.url, expected.url);
        assert.equal(actual.author, expected.author);
        assert.deepEqual(actual.creationDate, expected.creationDate);
        assert.equal(actual.totalKarma, expected.totalKarma);
        assert.equal(actual.totalComments, expected.totalComments);
        assert.equal(actual.sourceName, expected.sourceName);
        assert.equal(actual.icon, expected.icon);
    };

    beforeEach(function () {
        moxios.install()
    });

    afterEach(function () {
        moxios.uninstall()
    });

    it("makes a successful HTTP request with no results", function(done) {
        const observer = new HnObserver();
        const tabId = 1;

        observer.notify(tabId, 'https://google.com').then(results => {
            assert.equal(results.length, 0);

            done();
        })
            .catch(done);

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            let response = fs.readFileSync(path.join(__dirname, 'mock/hn_no_items.json'), 'utf8');
            request.respondWith({
                status: 200,
                response: JSON.parse(response)
            });
        });
    });

    it("makes a successful HTTP request with one result", function(done) {
        const observer = new HnObserver();
        const tabId = 1;

        observer.notify(tabId, 'https://dev.tube').then(results => {
            assert.equal(results.length, 1);
            verifyResultItem(results[0], {
                constructor: 'Result',
                title: 'The best developer videos in one place',
                url: 'https://news.ycombinator.com/item?id=17390527',
                author: 'haasted',
                creationDate: new Date('2018-06-25T07:21:46.000Z'),
                totalKarma: 301,
                totalComments: 93,
                sourceName: 'HackerNews',
                icon: 'icons/hacker-news-square.svg'
            });

            done();
        })
        .catch(done);

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            let response = fs.readFileSync(path.join(__dirname, 'mock/hn_one_item.json'), 'utf8');
            request.respondWith({
                status: 200,
                response: JSON.parse(response)
            });
        });
    });

    it("makes a successful HTTP request with three results", function(done) {
        const observer = new HnObserver();
        const tabId = 2;

        observer.notify(tabId, 'https://google.com').then(results => {
            assert.equal(results.length, 3);

            verifyResultItem(results[0], {
                constructor: 'Result',
                title: 'Machine Learning 101 slidedeck: 2 years of headbanging, so you don\'t have to',
                url: 'https://news.ycombinator.com/item?id=15919115',
                author: 'flor1s',
                creationDate: new Date('2017-12-14T00:54:14.000Z'),
                totalKarma: 1656,
                totalComments: 120,
                sourceName: 'HackerNews',
                icon: 'icons/hacker-news-square.svg'
            });

            verifyResultItem(results[1], {
                constructor: 'Result',
                title: 'Wozniak: “Actually, the movie was largely a lie about me”',
                url: 'https://news.ycombinator.com/item?id=7086411',
                author: 'jamesbritt',
                creationDate: new Date('2014-01-19T22:46:05.000Z'),
                totalKarma: 1522,
                totalComments: 308,
                sourceName: 'HackerNews',
                icon: 'icons/hacker-news-square.svg'
            });

            verifyResultItem(results[2], {
                constructor: 'Result',
                title: 'Google Noto Fonts',
                url: 'https://news.ycombinator.com/item?id=12654499',
                author: 'bpierre',
                creationDate: new Date('2016-10-06T17:51:13.000Z'),
                totalKarma: 1217,
                totalComments: 304,
                sourceName: 'HackerNews',
                icon: 'icons/hacker-news-square.svg'
            });

            done();
        })
            .catch(done);

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            let response = fs.readFileSync(path.join(__dirname, 'mock/hn_three_items.json'), 'utf8');
            request.respondWith({
                status: 200,
                response: JSON.parse(response)
            });
        });
    });

    it("makes an unsuccessful HTTP request", function(done) {
        const observer = new HnObserver();
        const tabId = 3;

        observer.notify(tabId, 'https://google.com').then(done)
            .catch((error) => {
                assert.equal(error.response.status, 503);
                assert.equal(error.response.statusText, 'Forbidden 503');
                done();
            })
            .catch(done);

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();

            request.respondWith({
                status: 503,
                statusText: 'Forbidden 503',
                response: {}
            });
        });
    });
});

