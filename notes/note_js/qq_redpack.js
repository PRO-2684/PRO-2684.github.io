(function () {
    const form = $("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const qq = data.get("qq");
        const type = data.get("dest-type");
        const url = `https://h5.qianbao.qq.com/sendRedpack/index?_wv=67112960&_wvNt=0xFFFFFF&_wvSb=1&recv_uin=${qq}&recv_type=${type}`;
        window.open(url);
    });
})();
