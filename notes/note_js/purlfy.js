(async function () {
    if (typeof Purlfy === "function") {
        console.log("pURLfy already loaded");
        main();
    } else {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/PRO-2684/pURLfy@latest/purlfy.min.js";
        script.addEventListener("load", () => {
            console.log("pURLfy loaded");
            main();
        });
        document.head.appendChild(script);
    }
    async function main() {
        const fetchEnabled = typeof GM_fetch === "function";
        const list = await (await fetch("https://cdn.jsdelivr.net/gh/PRO-2684/pURLfy-rules/list.json")).json();
        const promises = list.map(name => fetch(`https://cdn.jsdelivr.net/gh/PRO-2684/pURLfy-rules/${name}.json`).then(r => r.json()));
        const config = {
            fetchEnabled: fetchEnabled,
            lambdaEnabled: true,
        };
        if (fetchEnabled) {
            config.fetch = GM_fetch;
        }
        const purifier = new Purlfy(config);
        purifier.addEventListener("statisticschange", e => {
            console.log("Statistics increment:", e.detail);
        });
        const rulesets = await Promise.all(promises);
        purifier.importRules(...rulesets);
        // === Display ===
        const inputEl = $("#input");
        const urlEl = $("#url");
        const ruleEl = $("#rule");
        inputEl.removeAttribute("disabled");
        inputEl.removeAttribute("title");
        if (fetchEnabled) {
            inputEl.placeholder = "https://b23.tv/SI6OEcv";
            urlEl.placeholder = "https://www.bilibili.com/video/BV1GJ411x7h7/?p=1";
            ruleEl.placeholder = "哔哩哔哩短链 by PRO-2684";
            const corsEn = $("#cors-en");
            const corsCn = $("#cors-cn");
            corsEn.textContent = "Enabled";
            corsEn.style.color = "green";
            corsCn.textContent = "已启用";
            corsCn.style.color = "green";
        }
        // Trigger on enter
        inputEl.addEventListener("keydown", async (e) => {
            if (e.key === "Enter") {
                if (!inputEl.value) inputEl.value = inputEl.placeholder;
                const url = inputEl.value;
                const purified = await purifier.purify(url);
                urlEl.value = purified.url;
                ruleEl.value = purified.rule;
            }
        });
    }
})();
