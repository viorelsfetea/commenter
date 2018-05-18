const HN_SEARCH_URL_FORMAT = 'https://hn.algolia.com/api/v1/search?query={url}&restrictSearchableAttributes=url';

class HnObserver extends Observer {
    constructor() {
        super();
    }

    notify(url, callback) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', HnObserver.getFullUrl(url), true);

        xmlHttp.onreadystatechange = function() {
            console.log(xmlHttp.readyState, xmlHttp.status, xmlHttp.responseText.length);
            if(HnObserver.isSuccessfulRequest(xmlHttp)) {
                const response = JSON.parse(this.responseText);

                console.log(response);
            }
        };

        xmlHttp.send();

        callback(['HN']);
    }

    static isSuccessfulRequest(xmlHttp) {
        return xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200 && xmlHttp.responseText.length > 0;
    }
    static getFullUrl(url) {
        return HN_SEARCH_URL_FORMAT.replace('{url}', encodeURI(url));
    }
}
