const params = new URLSearchParams(window.location.search);
const url = params.get("url");

document.getElementById("site").textContent = url;

// Go Back
const backBtn = document.getElementById("backBtn");

if (backBtn) {
    backBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "goBack" });
    });
}

// Continue Once
const continueBtn = document.getElementById("continueOnce");

if (continueBtn) {
    continueBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({
            action: "continueOnce",
            url: url,
        });
    });
}

// Add to Whitelist
const whitelistBtn = document.getElementById("whitelist");

if (whitelistBtn) {
    whitelistBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({
            action: "addWhitelist",
            url: url,
        });
    });
}

// document.getElementById("continue").addEventListener("click", async () => {
//     const domain = new URL(url).hostname;

//     chrome.storage.local.get(["websiteToIgnore"], (data) => {
//         let list = data.websiteToIgnore || [];

//         if (!list.includes(domain)) {
//             list.push(domain);
//         }

//         chrome.storage.local.set({ websiteToIgnore: list }, () => {
//             chrome.runtime.sendMessage({
//                 action: "continueToSite",
//                 url: url,
//             });
//         });
//     });
// });
// document.getElementById("continue").addEventListener("click", () => {
//     if (url) {
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             chrome.tabs.update(tabs[0].id, { url: url });
//         });
//     }
// });

// document.getElementById("backBtn").addEventListener("click", () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.remove(tabs[0].id);
//     });
// });
