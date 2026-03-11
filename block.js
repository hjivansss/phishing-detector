const params = new URLSearchParams(window.location.search);
const url = params.get("url");

document.getElementById("site").textContent = url;

// Continue anyway
document.getElementById("continue").addEventListener("click", () => {
    chrome.runtime.sendMessage({
        action: "continueToSite",
        url: url,
    });
});

// Go back
document.getElementById("backBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({
        action: "goBack",
    });
});

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
