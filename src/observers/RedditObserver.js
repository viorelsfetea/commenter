import axios from 'axios';

import Observer from './Observer';
import Result from '../data/Result';

const REDDIT_SEARCH_URL_FORMAT = 'https://www.reddit.com/api/info.json?url={url}';
const REDDIT_URL_FORMAT = 'https://www.reddit.com{permalink}';

class RedditObserver extends Observer {
    constructor() {
        super();
        this.sourceName = 'Reddit';
        this.sourceIconCSSClass = 'fab fa-reddit-square';
    }

    notify(tabId, tabUrl, callback) {return new Promise((resolve, reject) => {
        axios.get(RedditObserver.getFullUrl(tabUrl))
            .then((response) => {
                if(response.status !== 200)
                    reject(response.status + ': ' + response.statusText);

                resolve(this.parseResults(response.data));
            })
            .catch(reject);
    });
    }

    searchUrl(url, successCallback) {

        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', RedditObserver.getFullUrl(url), true);
        xmlHttp.setRequestHeader('User-Agent', 'Reddit client');
        xmlHttp.send();

        xmlHttp.onreadystatechange = () => {
            if (!RedditObserver.isSuccessfulRequest(xmlHttp)) return;

            successCallback(JSON.parse(xmlHttp.responseText));
        };
    }

    parseResults(results) {
        if(!results.hasOwnProperty('data') || !results.data.hasOwnProperty('children') || results.data.children.length === 0) return [];

        return results.data.children.map(({data}) => {
            return new Result(
                '/r/' + data.subreddit + ': ' + data.title,
                RedditObserver.getRedditUrl(data.permalink),
                data.author,
                new Date(data.created * 1000),
                data.score,
                data.num_comments,
                this.sourceName,
                this.sourceIconCSSClass
            );
        });
    }

    static getFullUrl(url) {
        return REDDIT_SEARCH_URL_FORMAT.replace('{url}', encodeURI(url));
    }

    static getRedditUrl(permalink) {
        return REDDIT_URL_FORMAT.replace('{permalink}', permalink);
    }
}

export default RedditObserver;
