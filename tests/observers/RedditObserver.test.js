import fs from 'fs';
import path  from 'path';

import {assert} from 'chai';
import moxios from 'moxios'

import RedditObserver from '../../src/observers/RedditObserver';

describe("Reddit Observer Suite", function() {
    const verifyResultItem = function(actual, expected) {
        assert.equal(actual.constructor.name, expected.constructor);
        assert.equal(actual.title, expected.title);
        assert.equal(actual.url, expected.url);
        assert.equal(actual.author, expected.author);
        assert.deepEqual(actual.creationDate, expected.creationDate);
        assert.equal(actual.totalKarma, expected.totalKarma);
        assert.equal(actual.totalComments, expected.totalComments);
        assert.equal(actual.sourceName, expected.sourceName);
        assert.equal(actual.sourceIconCSSClass, expected.sourceIconCSSClass);
    };

    beforeEach(function () {
        moxios.install()
    });

    afterEach(function () {
        moxios.uninstall()
    });

    it("makes a successful HTTP request with no results", function(done) {
        const observer = new RedditObserver();
        const tabId = 1;

        observer.notify(tabId, 'https://google.com').then(results => {
            assert.equal(results.length, 0);

            done();
        })
            .catch(done);

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            let response = fs.readFileSync(path.join(__dirname, 'mock/reddit_no_items.json'), 'utf8');
            request.respondWith({
                status: 200,
                response: JSON.parse(response)
            });
        });
    });

    it("makes a successful HTTP request with one result", function(done) {
        const observer = new RedditObserver();
        const tabId = 1;

        observer.notify(tabId, 'github.com').then(results => {
            assert.equal(results.length, 1);
            verifyResultItem(results[0], {
                constructor: 'Result',
                title: '/r/bprogramming: Termtosvg – Record terminal sessions as SVG animations',
                url: 'https://www.reddit.com/r/bprogramming/comments/8vsfwj/termtosvg_record_terminal_sessions_as_svg/',
                author: 'bprogramming',
                creationDate: new Date('Tue, 03 Jul 2018 22:03:46 GMT'),
                totalKarma: 1,
                totalComments: 0,
                sourceName: 'Reddit',
                sourceIconCSSClass: 'fab fa-reddit-square'
            });

            done();
        })
            .catch(done);

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            let response = fs.readFileSync(path.join(__dirname, 'mock/reddit_one_item.json'), 'utf8');
            request.respondWith({
                status: 200,
                response: JSON.parse(response)
            });
        });
    });

        it("makes a successful HTTP request with three results", function(done) {
            const observer = new RedditObserver();
            const tabId = 2;

            observer.notify(tabId, 'https://google.com').then(results => {
                assert.equal(results.length, 3);

                verifyResultItem(results[0], {
                    constructor: 'Result',
                    title: '/r/bprogramming: Termtosvg – Record terminal sessions as SVG animations',
                    url: 'https://www.reddit.com/r/bprogramming/comments/8vsfwj/termtosvg_record_terminal_sessions_as_svg/',
                    author: 'bprogramming',
                    creationDate: new Date('Tue, 03 Jul 2018 22:03:46 GMT'),
                    totalKarma: 1,
                    totalComments: 0,
                    sourceName: 'Reddit',
                    sourceIconCSSClass: 'fab fa-reddit-square'
                });

                verifyResultItem(results[1], {
                    constructor: 'Result',
                    title: '/r/Python: Terminal session to SVG',
                    url: 'https://www.reddit.com/r/Python/comments/8uvbcl/terminal_session_to_svg/',
                    author: 'IT4ddict',
                    creationDate: new Date('Sat, 30 Jun 2018 02:10:40 GMT'),
                    totalKarma: 55,
                    totalComments: 12,
                    sourceName: 'Reddit',
                    sourceIconCSSClass: 'fab fa-reddit-square'
                });

                verifyResultItem(results[2], {
                    constructor: 'Result',
                    title: '/r/commandline: termtosvg - Record terminal sessions as SVG animations',
                    url: 'https://www.reddit.com/r/commandline/comments/8tkf95/termtosvg_record_terminal_sessions_as_svg/',
                    author: 'NervousScentedEagle',
                    creationDate: new Date('Mon, 25 Jun 2018 03:59:57 GMT'),
                    totalKarma: 134,
                    totalComments: 9,
                    sourceName: 'Reddit',
                    sourceIconCSSClass: 'fab fa-reddit-square'
                });

                done();
            })
                .catch(done);

            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                let response = fs.readFileSync(path.join(__dirname, 'mock/reddit_three_items.json'), 'utf8');
                request.respondWith({
                    status: 200,
                    response: JSON.parse(response)
                });
            });
        });
        it("makes an unsuccessful HTTP request", function(done) {
            const observer = new RedditObserver();
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

