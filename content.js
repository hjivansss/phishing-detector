// Send the current page URL to the background script

chrome.runtime.sendMessage({
    type: "PAGE_LOADED",
    url: window.location.href,
});
