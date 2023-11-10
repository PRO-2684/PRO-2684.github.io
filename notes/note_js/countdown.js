(function () {
    let count = 60;
    let timer = 0;
    const ele = $(".countdown > span.countdown-digit");
    function start() {
        window.clearInterval(timer);
        count = 60;
        step(); // show the initial value immediately
        timer = window.setInterval(step, 1000);
    }
    function step() {
        if (count) {
            count--;
            ele.style.setProperty('--value', count);
        } else {
            window.clearInterval(timer);
            alert("Time's up!");
        }
    }
    start();
    // Restart the timer when the user clicks the countdown
    ele.addEventListener("click", start);
    // Remember to clean up
    window.addEventListener("note_loading", () => {
        window.clearInterval(timer);
        removeEventListener("click", start);
    }, { once: true });
})();
