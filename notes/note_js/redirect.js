(function () {
    const log = console.log.bind(console, "[Redirect]");
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    // Redirecting
    const params = new URLSearchParams(location.search);
    const url = params.get("url");
    const tip = $("#markdown a code");
    if (URL.canParse(url)) {
        setTimeout(() => {
            tip.textContent = url;
            tip.parentElement.href = url;
            location.href = url;
        }, 500);
    }

    // Generate redirect url
    const form = $("form#redirect-form");
    const result = $("#result")
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const dest = $("#url").value;
        if (!URL.canParse(dest)) {
            result.textContent = "Invalid URL";
            return;
        }
        const url = new URL(location.href);
        url.searchParams.set("url", dest);
        result.textContent = url.href;
        navigator.clipboard.writeText(url.href);
    });
})();
