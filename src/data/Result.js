const KARMA_WEIGHT_FACTOR = 1;
const COMMENTS_WEIGHT_FACTOR = 10;

class Result {
    constructor(title, url, author, creationDate, totalKarma, totalComments, sourceName, sourceIconCSSClass) {
        this._title = title;
        this._url = url;
        this._author = author;
        this._creationDate = creationDate;
        this._totalKarma = totalKarma;
        this._totalComments = totalComments;
        this._sourceName = sourceName;
        this._sourceIconCSSClass = sourceIconCSSClass;
        this._weight = (this._totalKarma * KARMA_WEIGHT_FACTOR + this._totalComments * COMMENTS_WEIGHT_FACTOR) / KARMA_WEIGHT_FACTOR + COMMENTS_WEIGHT_FACTOR;
    }

    get title() {
        return this._title;
    }

    get url() {
        return this._url;
    }

    get author() {
        return this._author;
    }

    get creationDate() {
        return this._creationDate;
    }

    get totalKarma() {
        return this._totalKarma;
    }

    get totalComments() {
        return this._totalComments;
    }

    get sourceName() {
        return this._sourceName;
    }

    get sourceIconCSSClass() {
        return this._sourceIconCSSClass;
    }

    get weight() {
        return this._weight;
    }
}

export default Result;