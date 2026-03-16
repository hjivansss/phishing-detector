/*
Blacklist Rule

Purpose:
Immediately block domains that are already known to be phishing.

Sources:
1. Domains added after LLM detection
2. Domains added from threat feed APIs
3. Manual developer additions

This list is stored in chrome.storage so it persists.
*/
export async function isBlacklisted(domain) {

    const data = await chrome.storage.local.get(["blacklist"]);

    const blacklist = data.blacklist || [];

    if (blacklist.includes(domain)) {
        return true;
    }

    return false;
}