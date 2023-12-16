(function () {
    const lib = document.head.appendChild(document.createElement("script"));
    lib.src = "https://open.mobile.qq.com/sdk/qqapi.wk.js";
    function main() {
        alert("Lib loaded");
        const api = window?.mqq?.app;
        if (!api) {
            alert("mqq not found!");
            return;
        }
        api.isAppInstalled("com.tencent.mm", (result) => { alert("WeChat installed: " + result); });
    }
    lib.addEventListener("load", main);
})();
