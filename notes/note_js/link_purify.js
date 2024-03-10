(async function () {
    // TODO: Pathname -> Paths[]; Support regex mode & redirect mode
    // === Import from Tarnhelm ===
    function b64decode(encoded) { // Decode base64 with support for unicode
        return decodeURIComponent(escape(atob(encoded)));
    }
    function cleanParamsArray(array) {
        const result = [];
        for (const param of array) {
            if (param === "") {
                continue;
            }
            result.push(param.trim());
        }
        return result;
    }
    function parseTarnhelmLink(url) {
        const encodedRule = url.slice(26);
        const rule = JSON.parse(b64decode(decodeURIComponent(encodedRule)));
        const host = rule.e;
        const type = rule.f;
        if (type === undefined) {
            console.log("Type not found for rule", rule);
            return;
        }
        rules[host] = {
            "": {
                "description": rule.a,
                "mode": type,
                "params": cleanParamsArray(rule.g),
                "author": rule.d
            }
        };
    }
    function importFromTarnhelm() {
        // Navigate to https://tarnhelm.project.ac.cn/rules.html and call this function to import rules
        const links = $$("a[href^='tarnhelm://rule?parameter=']");
        links.forEach(link => parseTarnhelmLink(link.href));
    }
    // === Main logic ===
    const debug = console.debug.bind(console, "[Link Purify]");
    // Host -> Pathname -> Rule, where Rule consists of description, mode, params/regexes, author
    // Description: A brief description of the URL it matches
    // Mode: 0 - Whitelist, 1 - Blacklist, 2 - Regex
    // Params: An array of strings, each of which is a parameter to remove or keep
    // Regexes: An array of [regex, replacement] pairs, where matches of regex are replaced with replacement
    // Author: The author of the rule
    // Notes:
    //   If Pathname is empty with leading and trailing slashes trimmed, it will apply to the whole host
    //   The same goes for Host: if it is empty, it will apply to every URL (hopefully as a fallback rule)
    //   If a given URL matches multiple rules, the most specific one is used
    const r = await fetch("attachments/link_purify_rules.json");
    const rules = await r.json();
    function removeSlashes(pathname) { // Remove leading and trailing slashes
        return pathname.replace(/^\/+|\/+$/g, "");
    }
    function purifyURL(url) {
        if (!url.startsWith("http")) { // Not a valid URL
            return url;
        }
        try {
            var urlObj = new URL(url);
        } catch (e) {
            console.log(`Error parsing URL ${url}:`, e);
            return url;
        }
        const host = urlObj.host ?? "";
        const pathname = removeSlashes(urlObj.pathname) ?? "";
        const rule = rules[host]?.[pathname] ?? rules[host]?.[""] ?? rules[""]?.[""];
        debug(`Matching rule for ${url}:`, rule);
        if (!rule) { // No matching rule found
            return url;
        }
        const mode = rule.mode;
        const params = rule.params;
        if (mode === 0) { // Whitelist mode
            const newParams = new URLSearchParams();
            for (const param of params) {
                if (urlObj.searchParams.has(param)) {
                    newParams.set(param, urlObj.searchParams.get(param));
                }
            }
            urlObj.search = newParams.toString();
        } else if (mode === 1) { // Blacklist mode
            for (const param of params) {
                urlObj.searchParams.delete(param);
            }
        } else if (mode === 2) {
            console.log("Regex mode not implemented yet");
        }
        return urlObj.toString();
    }
    // === Display ===
    const input = $("textarea#input");
    const output = $("textarea#output");
    // Only trigger on enter
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const inputText = input.value;
            const urls = inputText.split("\n");
            const purifiedURLs = urls.map(purifyURL);
            output.value = purifiedURLs.join("\n");
        }
    });
})();
