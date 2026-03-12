console.log("Phishing detector background running");

const scanningTabs = new Set();

function getDomain(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId !== 0) return;

    const tabId = details.tabId;
    const url = details.url;

    if (!url.startsWith("http")) return;

    if (url.startsWith("chrome-extension://")) return;

    if (url.includes("loading.html") || url.includes("block.html")) return;

    // Prevent loop if we already scanned this tab
    if (scanningTabs.has(tabId)) {
        scanningTabs.delete(tabId);
        return;
    }

    const domain = getDomain(url);

    chrome.storage.local.get(["websiteToIgnore"], (data) => {
        const ignoreList = data.websiteToIgnore || [];

        if (ignoreList.includes(domain)) {
            return;
        }

        scanningTabs.add(tabId);

        chrome.tabs.update(tabId, {
            url:
                chrome.runtime.getURL("loading.html") +
                "?url=" +
                encodeURIComponent(url),
        });
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "continueToSite") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.update(tabs[0].id, {
                url: message.url,
            });
        });
    }

    if (message.action === "goBack") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.remove(tabs[0].id);
        });
    }
});
