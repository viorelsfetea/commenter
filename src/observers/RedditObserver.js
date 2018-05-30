const REDDIT_SOURCE_NAME = 'Reddit';
const REDDIT_SEARCH_URL_FORMAT = 'https://www.reddit.com/api/info.json?url={url}';
const REDDIT_URL_FORMAT = 'https://www.reddit.com{permalink}';
const REDDIT_MAX_RESULTS = 5;

class RedditObserver extends Observer {
    constructor() {
        super();
    }

    notify(url, callback) {
        let successCallback = results => {
            let response = new Response(REDDIT_SOURCE_NAME, RedditObserver.parseResults(results));
            callback(response);
        };

        this.searchUrl(url, successCallback);
    }

    searchUrl(url, successCallback) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', RedditObserver.getFullUrl(url), true);
        xmlHttp.send();

        xmlHttp.onreadystatechange = () => {
            if (!RedditObserver.isSuccessfulRequest(xmlHttp)) return;

            successCallback(JSON.parse(xmlHttp.responseText));
        };
    }

    static parseResults(results) {
        let response = [];

        if(!results.hasOwnProperty('data') || !results.data.hasOwnProperty('children') || results.data.children.length === 0) return response;

        const resultsFiltered = RedditObserver.filterResults(results);

        return resultsFiltered.map(({data}) => {
            return new Result(
                RedditObserver.getRedditUrl(data.permalink),
                data.author,
                new Date(data.created),
                data.score,
                data.num_comments,
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

    static filterResults(results) {
        if(results.data.children.length <= 1) return results.data.children;

        results = results.data.children.sort((result1, result2) => {
            if(result1.data.score > result2.data.score) return -1;

            if (result1.data.score < result2.data.score) return 1;

            return 0;
        });

        return results.slice(0, REDDIT_MAX_RESULTS);
    }
}
