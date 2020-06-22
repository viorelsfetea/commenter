class ResultDOM {
    constructor(result) {
        this.result = result;
    }

    get html() {
        return this.listNode;
    }

    get listNode() {
        const listNode = document.createElement('li');

        listNode.appendChild(this.linkNode);

        return listNode;
    }

    get linkNode() {
        const linkNode = document.createElement('a');
        linkNode.href = this.result._url;
        linkNode.target = "_blank";

        linkNode.appendChild(this.icon);
        linkNode.appendChild(this.titleNode);
        linkNode.appendChild(this.metaNode);

        return linkNode;
    }

    get icon() {
        const iconNode = document.createElement('img');
        iconNode.className = 'result-icon';
        iconNode.src = this.result._icon;

        return iconNode;
    }

    get titleNode() {
        const titleNode = document.createElement('span');
        titleNode.className = 'result-title';
        titleNode.appendChild(document.createTextNode(this.result._title));
        titleNode.appendChild(this.dateNode);
        return titleNode;
    }

    get dateNode() {
        const dateNode = document.createElement('span');
        dateNode.className = 'result-date';
        dateNode.appendChild(document.createTextNode(ResultDOM.timeSince(this.result._creationDate)));

        return dateNode;
    }

    get metaNode() {
        const metaNode = document.createElement('span');
        metaNode.className = 'result-meta';
        metaNode.appendChild(this.commentsNode);
        metaNode.appendChild(this.karmaNode);

        return metaNode;
    }

    get commentsNode() {
        const commentsNode = document.createElement('span');
        const commentsIconNode = document.createElement('img');
        commentsNode.className = 'icon-container';
        commentsIconNode.src = '/icons/comments.svg';
        commentsIconNode.className = 'icon icon-comments';

        commentsNode.appendChild(commentsIconNode);
        commentsNode.appendChild(document.createTextNode(this.result._totalComments));

        return commentsNode;
    }

    get karmaNode() {
        const karmaNode = document.createElement('span');
        const karmaIconNode = document.createElement('img');
        karmaNode.className = 'icon-container';
        karmaIconNode.src = '/icons/arrow-alt-circle-up.svg';
        karmaIconNode.className = 'icon icon-karma';

        karmaNode.appendChild(karmaIconNode);
        karmaNode.appendChild(document.createTextNode(this.result._totalKarma));

        return karmaNode;
    }

    static timeSince(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const SECONDS_IN_YEAR = 31536000;
        const SECONDS_IN_MONTH = 2592000;
        const SECONDS_IN_DAY = 86400;
        const SECONDS_IN_HOUR = 3600;
        const SECONDS_IN_MINUTE = 60;

        let interval = Math.floor(seconds / SECONDS_IN_YEAR);
        if (interval > 1) return interval + " years ago";

        interval = Math.floor(seconds / SECONDS_IN_MONTH);
        if (interval > 1) return interval + " months ago";

        interval = Math.floor(seconds / SECONDS_IN_DAY);
        if (interval > 1) return interval + " days ago";

        interval = Math.floor(seconds / SECONDS_IN_HOUR);
        if (interval > 1) return interval + " hours ago";

        interval = Math.floor(seconds / SECONDS_IN_MINUTE);
        if (interval > 1) return interval + " minutes ago";

        return Math.floor(seconds) + " seconds ago";
    }
}
