import axios from 'axios';

import Observer from './Observer';
import Result from '../data/Result';

const HN_SEARCH_URL_FORMAT = 'https://hn.algolia.com/api/v1/search?query={url}&restrictSearchableAttributes=url';
const HN_URL_FORMAT = 'https://news.ycombinator.com/item?id={objectID}';

class HnObserver extends Observer {
    constructor() {
        super();
        this.sourceName = 'HackerNews';
        this.sourceIcon = 'https://news.ycombinator.com/favicon.ico'; //TODO move this to a local file
    }

    notify(tabId, tabUrl) {
        return new Promise((resolve, reject) => {
            axios.get(HnObserver.getFullUrl(tabUrl))
                .then((response) => {
                    if(response.status !== 200)
                        reject(response.status + ': ' + response.statusText);

                    resolve(this.parseResults(response.data));
                })
                .catch(reject);
        });
    }

    parseResults(results) {
        if(!results.hasOwnProperty('hits') || results.hits.length === 0) return [];

        return results.hits.map((result) => {
            return new Result(
                result.title,
                HnObserver.getHNUrl(result.objectID),
                result.author,
                new Date(result.created_at),
                result.points,
                result.num_comments,
                this.sourceName,
                this.sourceIcon
            );
        });
    }

    static getFullUrl(url) {
        return HN_SEARCH_URL_FORMAT.replace('{url}', escape(url));
    }

    static getHNUrl(objectID) {
        return HN_URL_FORMAT.replace('{objectID}', objectID);
    }
}

export default HnObserver;
