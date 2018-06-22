const REDDIT_SEARCH_URL_FORMAT = 'https://www.reddit.com/api/info.json?url={url}';
const REDDIT_URL_FORMAT = 'https://www.reddit.com{permalink}';

class RedditObserver extends Observer {
    constructor() {
        super();
        this.sourceName = 'Reddit';
        this.sourceIcon = 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png'; //move this to a local file
    }

    notify(tabId, tabUrl, callback) {
        let successCallback = results => {
            callback(tabId, this.parseResults(results));
        };

        this.searchUrl(tabUrl, successCallback);
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
                data.title,
                RedditObserver.getRedditUrl(data.permalink),
                data.author,
                new Date(data.created),
                data.score,
                data.num_comments,
                this.sourceName,
                this.sourceIcon
            );
        });
    }

    static isSuccessfulRequest(xmlHttp) {
        return xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200 && xmlHttp.responseText.length > 0;
    }

    static getFullUrl(url) {
        return REDDIT_SEARCH_URL_FORMAT.replace('{url}', encodeURI(url));
    }

    static getRedditUrl(permalink) {
        return REDDIT_URL_FORMAT.replace('{permalink}', permalink);
    }
}
