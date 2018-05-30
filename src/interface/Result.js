class Result {
    constructor(url, author, creationDate, totalKarma, totalComments) {
        this._url = url;
        this._author = author;
        this._creationDate = creationDate;
        this._totalKarma = totalKarma;
        this._totalComments = totalComments;
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
}
