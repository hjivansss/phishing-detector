const params = new URLSearchParams(window.location.search);

const url = params.get("url");

// For now (until Layer 2 exists)
// simply allow the page after short delay

setTimeout(() => {
    chrome.runtime.sendMessage({
        action: "scanNow",
        url
    });
}, 500);