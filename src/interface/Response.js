class Response {
    constructor(sourceName, results) {
        this._sourceName = sourceName;
        this._results = results;
    }

    get sourceName() {
        return this._sourceName;
    }

    get results() {
        return this._results;
    }
}
