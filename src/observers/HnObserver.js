import Observer from "./Observer";

const HN_SEARCH_URL_FORMAT = 'https://hn.algolia.com/api/v1/search?query={url}&restrictSearchableAttributes=url';
const HN_URL_FORMAT = 'https://news.ycombinator.com/item?id={objectID}';

class HnObserver extends Observer {
    constructor() {
        super();
        this.sourceName = 'HackerNews';
        this.sourceIcon = 'https://news.ycombinator.com/favicon.ico'; //move this to a local file
    }

    notify(tabId, tabUrl, callback) {
        let successCallback = results => {
            callback(tabId, this.parseResults(results));
        };

        this.searchUrl(tabUrl, successCallback);
    }

    searchUrl(url, successCallback) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', HnObserver.getFullUrl(url), true);
        xmlHttp.send();

        xmlHttp.onreadystatechange = () => {
            if (!HnObserver.isSuccessfulRequest(xmlHttp)) return;
            successCallback(JSON.parse(xmlHttp.responseText));
        };
    }

    parseResults(results) {
        if(!results.hasOwnProperty('hits') || results.hits.length === 0) return [];

        return results.hits.map((result) => {
            return new Result(
                result.title,
                HnObserver.getHNUrl(result.objectID),
                result.author,
                new Date(result.created_at_i),
                result.points,
                result.num_comments,
                this.sourceName,
                this.sourceIcon
            );
        });
    }

    static isSuccessfulRequest(xmlHttp) {
        return xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200 && xmlHttp.responseText.length > 0;
    }

    static getFullUrl(url) {
        return HN_SEARCH_URL_FORMAT.replace('{url}', encodeURI(url));
    }

    static getHNUrl(objectID) {
        return HN_URL_FORMAT.replace('{objectID}', objectID);
    }
}
