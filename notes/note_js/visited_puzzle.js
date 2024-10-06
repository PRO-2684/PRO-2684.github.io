(function () {
    const log = console.log.bind(console, "[Visited]");
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const sites = {
        "Google": {
            url: "https://www.google.com",
            visited: false
        },
        "YouTube": {
            url: "https://www.youtube.com",
            visited: false
        },
        "Facebook": {
            url: "https://www.facebook.com",
            visited: false
        },
        "Instagram": {
            url: "https://www.instagram.com",
            visited: false
        },
        "X (Twitter)": {
            url: "https://x.com",
            visited: false
        },
        "Reddit": {
            url: "https://www.reddit.com",
            visited: false
        },
        "LinkedIn": {
            url: "https://www.linkedin.com",
            visited: false
        },
        "GitHub": {
            url: "https://github.com",
            visited: false
        },
        "StackOverflow": {
            url: "https://stackoverflow.com",
            visited: false
        },
        "MDN (EN)": {
            url: "https://developer.mozilla.org/en-US/",
            visited: false
        },
        "MDN (ZH)": {
            url: "https://developer.mozilla.org/zh-CN/",
            visited: false
        },
        "W3Schools": {
            url: "https://www.w3schools.com",
            visited: false
        },
        "Bing (EN)": {
            url: "https://www.bing.com",
            visited: false
        },
        "Bing (ZH)": {
            url: "https://cn.bing.com",
            visited: false
        },
        "Bilibili": {
            url: "https://www.bilibili.com",
            visited: false
        },
        "AcFun": {
            url: "https://www.acfun.cn",
            visited: false
        },
        "Baidu": {
            url: "https://www.baidu.com",
            visited: false
        },
        "Zhihu": {
            url: "https://www.zhihu.com",
            visited: false
        },
    };
    const container = $(".container");
    const checkBtn = $("#check");
    const resetBtn = $("#reset");
    const coverage = $("#coverage");
    const result = $("#result");
    /**
     * Append site to container
     * @param {string} siteName
     */
    function append(siteName) {
        const site = sites[siteName];
        const a = document.createElement("a");
        a.href = site.url;
        a.classList.add("box");
        // Randomize the enabled state
        if (Math.random() < 0.5) {
            a.classList.add("enabled");
            site.visited = true;
        }
        a.addEventListener("click", function (e) {
            e.preventDefault();
            site.visited = a.classList.toggle("enabled");
        });
        container.appendChild(a);
    }
    /**
     * Reset the game
     */
    function reset() {
        for (const site of Object.values(sites)) {
            site.visited = false;
        }
        container.innerHTML = "";
        coverage.textContent = "N/A";
        result.innerHTML = "<li>Complete the game to see the results.</li>";
        // Randomize the order
        const siteNames = Object.keys(sites);
        siteNames.sort(() => Math.random() - 0.5);
        siteNames.forEach(append);
    }
    /**
     * Check visited sites and display the result
     */
    function check() {
        let visited = 0;
        let total = 0;
        result.innerHTML = "";
        for (const [siteName, site] of Object.entries(sites)) {
            total++;
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = site.url;
            a.textContent = siteName;
            li.appendChild(a);
            if (site.visited) {
                li.classList.add("visited");
                visited++;
            } else {
                li.classList.add("not-visited");
            }
            result.appendChild(li);
        }
        coverage.textContent = `${visited} / ${total}`;
    }
    checkBtn.addEventListener("click", check);
    resetBtn.addEventListener("click", reset);
    reset();
})();
