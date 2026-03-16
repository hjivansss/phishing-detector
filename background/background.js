import { runRuleEngine } from "../layers/layer1_rules/ruleEngine.js";  

console.log("Phishing detector background running");

// Tabs allowed to bypass scan once
const temporaryAllowTabs = new Set();

// Tabs currently being scanned (prevents loop)
const scanningTabs = new Set();

//extraction of domain from webpage
function getDomain(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return; //only scans the main page . (main page has 0 frameId)

    const tabId = details.tabId;
    const url = details.url;

    if (!url.startsWith("http")) return;

    // Ignore extension pages
    if (url.startsWith("chrome-extension://")) return;

    // Ignore internal extension page
    // If we don't ignore these, it will scan its own pages and cause infinite loops.
    if (url.includes("loading.html") || url.includes("block.html")) return; 

    // Continue Once bypass(used by "Continue Anyway" button)
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
    if (!domain) return;

    
    /******* LAYER_1 ******/
    const result = await runRuleEngine(url, domain);
    console.log("Layer 1 result:", result.status , url);

    /* SAFE → allow navigation */
    if (result.status === "safe") {
        return;
    }

    /* PHISHING → block immediately */
    if (result.status === "phishing") {

        chrome.tabs.update(tabId, {
            url:
                chrome.runtime.getURL("ui/block.html") +
                "?url=" +
                encodeURIComponent(url),
        });

        return;
    }

    /* SUSPICIOUS → allow for now (Layer 2 not implemented yet) */
    if (result.status === "suspicious") {

        console.log("Suspicious site detected but Layer 2 not implemented yet.");

        return;
    }
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
