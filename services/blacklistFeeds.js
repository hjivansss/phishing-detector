// services/threatFeeds.js

let cachedFeed = null;

export async function getOpenPhishFeed() {
    if (cachedFeed) return cachedFeed;

    try {
        const response = await fetch("https://openphish.com/feed.txt");
        const text = await response.text();

        cachedFeed = text.split("\n").filter(Boolean); // array
        return cachedFeed;

    } catch (error) {
        console.error("Threat feed error:", error);
        return [];
    }
}