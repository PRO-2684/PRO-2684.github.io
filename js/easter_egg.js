toast("Hello there!");
function random_toast() {
    toasts = [
        "You've got only 1% chance of seeing these toasts!",
        "Do you know that these toasts are seldom seen?",
        "Is this your 1st time seeing these toasts?"
    ];
    toast(toasts[Math.floor(Math.random() * toasts.length)]);
}
setTimeout(random_toast, Math.random() * 2000 + 1000);
