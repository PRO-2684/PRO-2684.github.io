(function () {
    function focus(sel) {
        const el = $(sel);
        if (!el) return;
        // Scroll to element
        el.scrollIntoView({ block: "center" });
        // Flash element
        el.classList.add("attention");
        el.addEventListener("animationend", () => {
            el.classList.remove("attention");
        }, { once: true });
    }
    const actionLinks = $$("a[href^='@action:']");
    const trans = {
        "from": "span#from",
        "bookmark_name": "#bookmarks > li > a",
        "bookmark_op": "#bookmarks > li > a.bookmark-op"
    };
    for (const link of actionLinks) {
        const href = link.getAttribute("href");
        const action = href.slice(8);
        const sel = trans[action];
        link.href = "javascript:void(0)";
        link.addEventListener("click", (e) => {
            e.preventDefault();
            focus(sel);
        });
    }
})();
