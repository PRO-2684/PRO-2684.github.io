(async function () {
    const url = "https://raw.githubusercontent.com/PRO-2684/transitio/refs/heads/main/userstyles.json";
    function main() {
        const stylesPromise = fetch(url).then((response) => response.json());
        // const styles = await (await fetch(url)).json();
        const templateContent = $("#userstyle-template").content;
        const container = $("#userstyles");
        function addStyleCard(style) {
            const node = templateContent.cloneNode(true);
            const name = node.querySelector(".name");
            name.textContent = style.name;
            name.title = style.name;
            name.href = style.link;
            name.parentElement.setAttribute("data-preprocessor", style.preprocessor);
            const description = node.querySelector(".description");
            description.textContent = style.description;
            description.title = style.description;
            const author = node.querySelector(".author");
            author.textContent = style.author;
            author.title = style.author;
            author.href = `https://github.com/${style.author}`;
            if (style.download) {
                const download = node.querySelector(".download");
                download.href = style.download;
                download.download = style.download.split("/").pop();
            }
            // const install = node.querySelector(".install");
            // install.href = `llqqnt://transitio/install-userstyle?url=${encodeURIComponent(style.download)}`;
            container.appendChild(node);
        }
        container.innerHTML = "Loading...";
        stylesPromise.then((styles) => {
            container.innerHTML = "";
            styles.forEach(addStyleCard);
            addStyleCard({
                name: "Share Your UserStyle",
                description: "分享您的用户样式",
                author: "You",
                link: "https://github.com/PRO-2684/transitio/issues/4",
                download: "",
                preprocessor: "any",
            });
            const share = container.lastElementChild;
            share.querySelector(".author").href = "https://github.com/settings/profile";
            const download = share.querySelector(".download");
            download.href = "https://github.com/PRO-2684/transitio/wiki";
            download.textContent = "Wiki";
            download.title = "Transitio Wiki";
        }).catch((error) => {
            console.error(error);
            container.innerHTML = "";
            addStyleCard({
                name: "Failed to Load UserStyles",
                description: error.message,
                author: "Error",
                link: "#",
                download: "",
                preprocessor: "any",
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
