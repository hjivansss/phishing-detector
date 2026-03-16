const params = new URLSearchParams(window.location.search);
const url = params.get("url");

async function scan() {
    let suspicious = false;

    if (url.includes("@") || url.length > 75) {
        suspicious = true;
    }

    try {
        const response = await fetch("https://openphish.com/feed.txt");
        const text = await response.text();

        if (text.includes(url)) {
            suspicious = true;
        }
    } catch (e) {
        console.log(e);
    }

    if (suspicious) {
        window.location.href =
            chrome.runtime.getURL("block.html") +
            "?url=" +
            encodeURIComponent(url);
    } else {
        window.location.href = url;
    }
}

scan();
