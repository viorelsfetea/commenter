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

        linkNode.appendChild(this.sourceIconNode);
        linkNode.appendChild(this.titleNode);
        linkNode.appendChild(this.metaNode);

        return linkNode;
    }

    get sourceIconNode() {
        const sourceIconNode = document.createElement('img');
        sourceIconNode.src = this.result._sourceIcon;

        return sourceIconNode;
    }

    get titleNode() {
        const titleNode = document.createElement('span');
        titleNode.className = 'result-title';
        titleNode.appendChild(document.createTextNode(this.result._title));

        return titleNode;
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
        const commentsIconNode = document.createElement('span');
        commentsNode.className = 'icon-container';
        commentsIconNode.className = 'icon icon-comments';

        commentsNode.appendChild(commentsIconNode);
        commentsNode.appendChild(document.createTextNode(this.result._totalComments));

        return commentsNode;
    }

    get karmaNode() {
        const karmaNode = document.createElement('span');
        const karmaIconNode = document.createElement('span');
        karmaNode.className = 'icon-container';
        karmaIconNode.className = 'icon icon-karma';

        karmaNode.appendChild(karmaIconNode);
        karmaNode.appendChild(document.createTextNode(this.result._totalKarma));

        return karmaNode;
    }
}
