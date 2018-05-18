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
