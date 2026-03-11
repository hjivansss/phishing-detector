const suspiciousPatterns = ["@", "login", "secure", "banking", "verify"];

async function checkBlacklist(url) {
    try {
        const response = await fetch("https://openphish.com/feed.txt");
        const text = await response.text();
        console.log(text);

        return text.includes(url);
    } catch (error) {
        console.log("Blacklist API error:", error);
        return false;
    }
}

function checkUrl(url) {
    if (url.length > 75) return true;

    if (url.includes("@")) return true;

    if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) return true;

    for (let word of suspiciousPatterns) {
        if (url.includes(word)) return true;
    }

    return false;
}

chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (details.frameId !== 0) return;

    const tab = await chrome.tabs.get(details.tabId);
    const url = tab.url;

    if (!url.startsWith("http")) return;

    const checkedUrlFlg = checkUrl(url);
    const blacklistFlag = await checkBlacklist(url);

    if (checkedUrlFlg || blacklistFlag) {
        chrome.tabs.update(details.tabId, {
            url:
                chrome.runtime.getURL("block.html") +
                "?url=" +
                encodeURIComponent(url),
        });
    }
});

console.log("Extension Running");
