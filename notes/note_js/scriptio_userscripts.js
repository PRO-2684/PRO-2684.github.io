(async function () {
    const url = "https://raw.githubusercontent.com/PRO-2684/Scriptio/refs/heads/main/userscripts.json";
    function main() {
        const scriptsPromise = fetch(url).then((response) => response.json());
        // const styles = await (await fetch(url)).json();
        const templateContent = $("#userscript-template").content;
        const container = $("#userscripts");
        function addScriptCard(script) {
            const node = templateContent.cloneNode(true);
            const name = node.querySelector(".name");
            name.textContent = script.name;
            name.title = script.name;
            name.href = script.link;
            name.parentElement.setAttribute("data-reactive", script.reactive);
            const description = node.querySelector(".description");
            description.textContent = script.description;
            description.title = script.description;
            const author = node.querySelector(".author");
            author.textContent = script.author;
            author.title = script.author;
            author.href = `https://github.com/${script.author}`;
            if (script.download) {
                const download = node.querySelector(".download");
                download.href = script.download;
                download.download = script.download.split("/").pop();
            }
            // const install = node.querySelector(".install");
            // install.href = `llqqnt://scriptio/install-userscript?url=${encodeURIComponent(script.download)}`;
            container.appendChild(node);
        }
        container.innerHTML = "Loading...";
        scriptsPromise.then((scripts) => {
            container.innerHTML = "";
            scripts.forEach(addScriptCard);
            addScriptCard({
                name: "Share Your UserScript",
                description: "分享您的用户脚本",
                author: "You",
                link: "https://github.com/PRO-2684/Scriptio/issues/1",
                download: "",
                reactive: null,
            });
            const share = container.lastElementChild;
            share.querySelector(".author").href = "https://github.com/settings/profile";
            const download = share.querySelector(".download");
            download.href = "https://github.com/PRO-2684/Scriptio/wiki";
            download.textContent = "Wiki";
            download.title = "Scriptio Wiki";
        }).catch((error) => {
            console.error(error);
            container.innerHTML = "";
            addScriptCard({
                name: "Failed to Load UserScripts",
                description: error.message,
                author: "Error",
                link: "#",
                download: "",
                reactive: null,
            });
            const failed = container.lastElementChild;
            failed.querySelector(".author").href = "#";
            const download = failed.querySelector(".download");
            download.textContent = "Retry";
            download.title = "Retry";
            download.addEventListener("click", main);
            download.href = "#";
            const author = failed.querySelector(".author");
            author.href = "#";
        });
    }
    main();
})();
