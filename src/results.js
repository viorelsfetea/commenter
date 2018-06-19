browser.tabs.query({currentWindow: true}).then(function (tabs) {
    console.log(tabs);
});
