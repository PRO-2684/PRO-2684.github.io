(async function () {
    const log = console.log.bind(console, "[pURLfy]");
    const r = await fetch("https://cdn.jsdelivr.net/gh/PRO-2684/pURLfy@latest/rules.json");
    const rules = await r.json();

    const maxIter = 5; // Maximum iterations for purifying a URL
    const lambdaEnabled = true; // Enable lambda mode
    const decoders = {
        "url": decodeURIComponent,
        "base64": atob,
    };

    function validRule(rule) { // Check if the given rule is valid
        if (!rule || !rule.mode || !rule.description || !rule.author) return false;
        switch (rule.mode) {
            case "white":
            case "black":
                return Array.isArray(rule.params);
            case "regex":
                return false; // Not implemented yet
            case "param":
                return Array.isArray(rule.params) && Array.isArray(rule.decode);
            case "redirect":
                return true;
            case "lambda":
                return lambdaEnabled && typeof rule.lambda === "string";
            default:
                return false;
        }
    }

    function matchRule(parts, currentRules) { // Recursively match the longest rule for the given URL parts
        let matchedRule = null; // Matched rule
        let maxMatchedParts = 0; // Matched parts count
        for (const rulePath in currentRules) {
            if (rulePath === "") continue; // Fallback rule should be handled last
            const ruleParts = rulePath.split("/");
            const effectiveRuleLength = ruleParts[ruleParts.length - 1] === "" ? ruleParts.length - 1 : ruleParts.length; // Ignore trailing slash
            if (effectiveRuleLength > parts.length) { // Impossible to match
                continue;
            }
            let matchedParts = 0;
            let isMatched = true;
            let nestedMatchedRule = null;
            for (let i = 0; i < ruleParts.length; i++) {
                if (ruleParts[i] === parts[i]) {
                    matchedParts++;
                } else if (ruleParts[i] === "" && i === ruleParts.length - 1) { // Ending with a slash - recursive matching
                    const nextRules = currentRules[rulePath];
                    const nextPathParts = parts.slice(i);
                    const [nextRule, nextMatchedParts] = matchRule(nextPathParts, nextRules);
                    if (nextRule) {
                        matchedParts += nextMatchedParts;
                        nestedMatchedRule = nextRule;
                    } else {
                        isMatched = false;
                    }
                } else {
                    isMatched = false;
                    break;
                }
            }
            const possibleRule = nestedMatchedRule ?? currentRules[rulePath];
            if (isMatched && matchedParts > maxMatchedParts && validRule(possibleRule)) {
                matchedRule = possibleRule;
                maxMatchedParts = matchedParts;
            }
        }
        matchedRule ??= currentRules[""]; // Fallback
        // Returns the matched rule and matched parts count
        return [matchedRule, maxMatchedParts];
    }

    function divide() {
        log("=".repeat(20));
    }

    async function purifyURL(originalUrl) { // Purify the given URL based on `rules`
        let shallContinue = true;
        let url = originalUrl;
        let firstRule = null;
        let iteration = 0;
        divide();
        log("Purifying URL:", url);
        while (shallContinue && iteration++ < maxIter) {
            const logi = log.bind(console, `[#${iteration}]`);
            let urlObj;
            if (URL.canParse(url)) {
                urlObj = new URL(url);
            } else {
                logi(`Cannot parse URL ${url}`);
                return url;
            }
            const protocol = urlObj.protocol;
            if (protocol !== "http:" && protocol !== "https:") { // Not a valid HTTP URL
                logi(`Not a HTTP URL: ${url}`);
                return url;
            }
            const hostAndPath = urlObj.host + urlObj.pathname;
            const parts = hostAndPath.split("/").filter(part => part !== "");
            const rule = matchRule(parts, rules)[0];
            if (!rule) { // No matching rule found
                logi(`No matching rule found for ${url}.`);
                return url;
            }
            firstRule ??= rule;
            logi(`Matching rule: ${rule.description} by ${rule.author}`);
            const mode = rule.mode;
            shallContinue = false;
            switch (mode) { // Purifies `urlObj` based on the rule
                case "white": { // Whitelist mode
                    const newParams = new URLSearchParams();
                    for (const param of rule.params) {
                        if (urlObj.searchParams.has(param)) {
                            newParams.set(param, urlObj.searchParams.get(param));
                        }
                    }
                    urlObj.search = newParams.toString();
                    break;
                }
                case "black": { // Blacklist mode
                    for (const param of rule.params) {
                        urlObj.searchParams.delete(param);
                    }
                    break;
                }
                case "regex": { // Regex mode
                    logi("Regex mode not implemented yet");
                    break;
                }
                case "param": { // Specific param mode
                    // Decode given parameter to be used as a new URL
                    let paramValue = null;
                    for (const param of rule.params) { // Find the first available parameter value
                        if (urlObj.searchParams.has(param)) {
                            paramValue = urlObj.searchParams.get(param);
                            break;
                        }
                    }
                    if (!paramValue) {
                        logi("Parameter(s) not found:", rule.params.join(", "));
                        break;
                    }
                    let dest = paramValue;
                    for (const name of rule.decode) {
                        const decoder = decoders[name] ?? (s => s);
                        dest = decoder(dest);
                    }
                    urlObj = new URL(dest);
                    shallContinue = rule.continue ?? true;
                    break;
                }
                case "redirect": { // Redirect mode
                    let r = null;
                    try {
                        r = await fetch(url, {
                            method: "HEAD",
                            redirect: "manual"
                        });
                    } catch (e) {
                        logi("Error fetching URL:", e);
                        break;
                    }
                    if ((r.status === 301 || r.status === 302) && r.headers.has("location")) {
                        let dest = r.headers.get("location");
                        urlObj = new URL(dest);
                        shallContinue = rule.continue ?? true;
                    }
                    break;
                }
                case "lambda": {
                    if (!lambdaEnabled) {
                        logi("Lambda mode is disabled.");
                        break;
                    }
                    try {
                        const lambda = new Function("url", rule.lambda);
                        urlObj = lambda(urlObj);
                    } catch (e) {
                        logi("Error executing lambda:", e);
                    }
                    shallContinue = rule.continue ?? true;
                    break;
                }
                default: {
                    logi("Invalid mode:", mode);
                    break;
                }
            }
            logi("Purified URL:", urlObj.href);
            url = urlObj.href;
        }
        if (originalUrl === url) { // No changes made
            log("No changes made.");
            return {
                url: url,
                rule: `* ${firstRule.description} by ${firstRule.author}`
            };
        }
        divide();
        return {
            url: url,
            rule: `${firstRule.description} by ${firstRule.author}`
        };
    }
    // === Display ===
    const inputEl = $("#input");
    const urlEl = $("#url");
    const ruleEl = $("#rule");
    inputEl.removeAttribute("disabled");
    inputEl.removeAttribute("title");
    // Trigger on enter
    inputEl.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            if (!inputEl.value) inputEl.value = inputEl.placeholder;
            const url = inputEl.value;
            const purified = await purifyURL(url);
            urlEl.value = purified.url;
            ruleEl.value = purified.rule;
        }
    });
})();
