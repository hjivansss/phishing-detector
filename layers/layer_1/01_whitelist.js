/*
Whitelist Rule

Purpose:
Skip scanning for trusted domains.

Sources of whitelist:
1. Built-in trusted domains (config)
2. User-added whitelist stored in chrome.storage

Returning true here immediately marks the site SAFE.
*/

import trustedDomains from "../../config/trustedDomains.js";

export async function isWhitelisted(domain) {
    //check trustedDomain
    if (trustedDomains.includes(domain)) {
        return true;
    }
     
    //check  user-defined whitelist stored locally
    const data = await chrome.storage.local.get(["websiteToIgnore"]);
    const userList = data.websiteToIgnore || []; //an array of the whitelist ( websiteToignoree)

    return userList.includes(domain);
}