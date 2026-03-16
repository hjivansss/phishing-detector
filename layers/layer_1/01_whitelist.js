import trustedDomains from "../../config/trustedDomains.js";

export async function isWhitelisted(domain) {
    //check from trustedDomain
    if (trustedDomains.includes(domain)) {
        return true;
    }
     
    //check from user-defined whitelist stored locally
    const data = await chrome.storage.local.get(["websiteToIgnore"]);
    const userList = data.websiteToIgnore || []; //an array of the whitelist ( websiteToignoree)

    return userList.includes(domain);
}