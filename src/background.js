"use strict";

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    browser.tabs.sendMessage(
        tabId,
        {
            tabId: tabId,
            changeInfo: changeInfo,
            tab: tab
        }
    )
});

browser.runtime.onMessage.addListener(parseMessage);

function parseMessage(message) {
    if( message.type === 'updateBadge' ) {
        browser.browserAction.setBadgeText({text: message.totalCount.toString()});
    }
}
