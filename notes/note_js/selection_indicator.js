(function () {
    let selected = 0, i = 0;
    const container = $(".list-container");
    // Set data-index attribute for each span
    for (const span of container.children) {
        span.setAttribute("data-index", i++);
    }
    // Event listener for container
    function onContainerClick(e) {
        const span = e.target.closest("span");
        if (!span) return;
        const index = parseInt(span.getAttribute("data-index"));
        if (index === selected) return;
        const prev = container.children[selected];
        if (prev) prev.toggleAttribute("data-active", false);
        selected = index;
        span.toggleAttribute("data-active", true);
        container.style.setProperty("--selected", selected);
    }
    container.addEventListener("click", onContainerClick);
    // Remember to clean up
    window.addEventListener("note_loading", () => {
        container.removeEventListener("click", onContainerClick);
    }, { once: true });
})();
