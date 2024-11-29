(function () {
    const timer = setInterval(() => {
        console.log("test");
    }, 1000);
    document.querySelector("#vibrate").addEventListener("click", () => {
        navigator.vibrate(1000);
    });
    document.querySelector("#secret").addEventListener("beforematch", (e) => {
        console.log("Congrats! You found the secret!", e);
    }, { once: true });
    // Remember to clean up
    window.addEventListener("note_loading", () => {
        clearInterval(timer);
    }, { once: true });
})();
