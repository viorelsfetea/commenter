const HN_SOURCE_NAME = 'HackerNews';
const HN_SEARCH_URL_FORMAT = 'https://hn.algolia.com/api/v1/search?query={url}&restrictSearchableAttributes=url';
const HN_URL_FORMAT = 'https://news.ycombinator.com/item?id={objectID}';
const HN_MAX_RESULTS = 5;

class HnObserver extends Observer {
    constructor() {
        super();
    }

    notify(url, callback) {
        let successCallback = results => {
            let response = new Response(HN_SOURCE_NAME, HnObserver.parseResults(results));
            callback(response);
        };

        this.searchUrl(url, successCallback);
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

    static parseResults(results) {
        let response = [];

        if(!results.hasOwnProperty('hits') || results.hits.length === 0) return response;

        const resultsFiltered = HnObserver.filterResults(results);

        return resultsFiltered.map((result) => {
            return new Result(
                HnObserver.getHNUrl(result.objectID),
                result.author,
                new Date(result.created_at_i),
                result.points,
                result.num_comments,
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

    static filterResults(results) {
        if(results.hits.length <= 1) return results.hits;

        results = results.hits.sort((result1, result2) => {
            if(result1.points > result2.points) return -1;

            if (result1.points < result2.points) return 1;

            return 0;
        });

        return results.slice(0, HN_MAX_RESULTS);
    }
}
