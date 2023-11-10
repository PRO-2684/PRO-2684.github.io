(function () {
    const timer = setInterval(() => {
        console.log("test");
    }, 1000);
    // Remember to clean up
    window.addEventListener("note_loading", () => {
        clearInterval(timer);
    }, { once: true });
})();
