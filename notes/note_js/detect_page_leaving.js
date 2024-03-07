(function () {
    const logs = $("#logs");
    const log = (...args) => {
        const time = new Date().toLocaleTimeString();
        console.log(`[Detect Page Leaving] <${time}> Page leaving detected:`, ...args);
        const p = document.createElement("p");
        p.textContent = `<${time}> Page leaving detected: ${args.join(" ")}`;
        logs.after(p);
    }
    const timer = setInterval(() => {
        if (document.hidden) {
            log("document.hidden is true");
        }
        if (document.visibilityState === "hidden") {
            log("document.visibilityState is hidden");
        }
        if (!document.hasFocus()) {
            log("document.hasFocus() is false");
        }
    }, 1000);
    function onVisibilityChange() {
        log("got visibilitychange event");
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.onvisibilitychange = onVisibilityChange;
    function onMouseLeave() {
        log("got mouseleave event");
    }
    document.addEventListener("mouseleave", onMouseLeave);
    document.onmouseleave = onMouseLeave;
    function onBlur() {
        log("got blur event");
    }
    window.addEventListener("blur", onBlur);
    window.onblur = onBlur;
    function onPageHide() {
        log("got pagehide event");
    }
    window.addEventListener("pagehide", onPageHide);
    window.onpagehide = onPageHide;
    // Clean up
    window.addEventListener("note_loading", () => {
        clearInterval(timer);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        document.onvisibilitychange = null;
        document.removeEventListener("mouseleave", onMouseLeave);
        document.onmouseleave = null;
        window.removeEventListener("blur", onBlur);
        window.onblur = null;
        window.removeEventListener("pagehide", onPageHide);
        window.onpagehide = null;
    }, { once: true });
})();
