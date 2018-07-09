browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
    .then(tabs => browser.tabs.get(tabs[0].id))
    .then(tab => {
        requestResults(tab.id);

        browser.runtime.onMessage.addListener(function (message) {
            if(message.type !== 'resultsUpdated' || message.tabId !== tab.id) return;

            showResults(message.results);
        });
    });

function requestResults(tabId) {
    browser.runtime.sendMessage({
        type: 'getResultsForTab',
        tabId: tabId
    });
}

function showResults(results) {
    document.getElementById('preloader').style.display = 'none';

    if(results.length === 0) {
        document.getElementById('no-comments').style.display = 'block';
        return;
    }

    let commentsListContainer = document.getElementById('comments-list-container');
    let commentsList = document.getElementById('comments-list');

    removeAllChildNodes(commentsListContainer);

    results.forEach(function (result) {
        const resultDOMElement = new ResultDOM(result);
        commentsList.appendChild(resultDOMElement.html);
    });

    commentsListContainer.style.display = 'block';
}

function removeAllChildNodes(parent) {
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }
}
