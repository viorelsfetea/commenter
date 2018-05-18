class RedditObserver extends Observer {
    constructor() {
        super()
    }

    notify(url, callback) {
        setTimeout(() => {
            callback(['REDDIT']);
        }, 4000);
    }
}
