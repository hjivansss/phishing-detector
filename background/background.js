console.log("Phishing detector background running");

// Tabs allowed to bypass scan once
const temporaryAllowTabs = new Set();

// Tabs currently being scanned (prevents loop)
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

    // Ignore extension pages
    if (url.startsWith("chrome-extension://")) return;

    // Ignore internal extension pages
    if (url.includes("loading.html") || url.includes("block.html")) return;

    // Continue Once bypass
    if (temporaryAllowTabs.has(tabId)) {
        temporaryAllowTabs.delete(tabId);
        return;
    }

    // Prevent scanning loop
    if (scanningTabs.has(tabId)) {
        scanningTabs.delete(tabId);
        return;
    }

    const domain = getDomain(url);

    chrome.storage.local.get(["websiteToIgnore"], (data) => {
        const ignoreList = data.websiteToIgnore || [];

        // Permanent whitelist
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

// Listen for actions from block.html
chrome.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab?.id;

    if (!tabId) return;

    // Continue once
    if (message.action === "continueOnce") {
        temporaryAllowTabs.add(tabId);

        chrome.tabs.update(tabId, {
            url: message.url,
        });
    }

    // Add to whitelist
    if (message.action === "addWhitelist") {
        const domain = getDomain(message.url);

        chrome.storage.local.get(["websiteToIgnore"], (data) => {
            let list = data.websiteToIgnore || [];

            if (!list.includes(domain)) {
                list.push(domain);
            }

            chrome.storage.local.set({ websiteToIgnore: list }, () => {
                chrome.tabs.update(tabId, {
                    url: message.url,
                });
            });
        });
    }

    // Go back
    if (message.action === "goBack") {
        chrome.tabs.remove(tabId);
    }
});
