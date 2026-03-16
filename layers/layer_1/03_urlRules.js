/*
URL Rules

Purpose:
Detect suspicious patterns inside the URL string itself.

These checks are cheap and fast.

We detect:
- phishing keywords
- very long URLs
- '@' redirection trick
*/

import suspiciousKeywords from "../../config/suspiciousKeywords.js";

export function checkUrlRules(url) {

    let suspicious = false;

    const lowerUrl = url.toLowerCase();

    /* Suspicious Keywords */

    for (const keyword of suspiciousKeywords) {

        if (lowerUrl.includes(keyword)) {
            suspicious = true;
            break;
        }

    }

    /*
    contains '@':
    
    Example:
    http://paypal.com@attacker.ru

    Browser actually opens:
    attacker.ru
    */
    if (url.includes("@")) {
        return { block: true };
    }


    /* Long URLs often hide phishing content */
    if (url.length > 150) {
        suspicious = true;
    }

    return { suspicious };
}

