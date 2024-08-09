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
        const r = fetch("https://cdn.jsdelivr.net/gh/PRO-2684/pURLfy-rules/cn.json");
        const purifier = new Purlfy({
            fetchEnabled: false,
            lambdaEnabled: true,
        });
        purifier.addEventListener("statisticschange", e => {
            console.log("Statistics increment:", e.detail);
        });
        const rules = await (await r).json();
        purifier.importRules(rules);
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
                const purified = await purifier.purify(url);
                urlEl.value = purified.url;
                ruleEl.value = purified.rule;
            }
        });
    }
})();
