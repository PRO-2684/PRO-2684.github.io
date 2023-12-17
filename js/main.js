const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// Progress bar
NProgress.configure({
    trickleSpeed: 100,
    minimum: 0.05,
    showSpinner: false
});
NProgress.start();
// md converter - showdown
showdown.setFlavor('github');
const enabled_features = ['openLinksInNewWindow', 'metadata', 'parseImgDimensions'];
for (i in enabled_features) {
    showdown.setOption(enabled_features[i], true);
}
const main_article = $("#markdown");
const showdown_converter = new showdown.Converter({ extensions: ["footnotes"] });
let current_page = 'index';
const menu_element = $("#main-content > aside.panel.right-panel");
const menu_button = $("#show-sidebar");
const from_span = $("#from");
const overlay = $('#overlay');
const bookmark_element = $("#bookmarks");
const tag_trans = {
    Index: "top",
    Latest: "最近更新",
    Useful: "实用",
    Technical: "技术",
    Python: "python",
    Web: "web",
    Ebook: "电子书",
    Academic: "学业",
    Other: "其他",
    Test: "测试用"
};
const from_trans = {
    "loading": { color: "gray", text: "Loading..." },
    "cache": { color: "green", text: "Cache" },
    "network": { color: "green", text: "Network" },
    "outdated-cache": { color: "orange", text: "Outdated cache" },
    "fallback": { color: "red", text: "Fallback" },
    "failed": { color: "red", text: "Failed" },
};
const sw_supported = 'serviceWorker' in navigator;
// formula renderer - katex
const katex_config = {
    delimiters:
        [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
        ],
    macros: {
        "\\ge": "\\geqslant",
        "\\le": "\\leqslant",
        "\\geq": "\\geqslant",
        "\\leq": "\\leqslant"
    }
};
// Custom functions
function getQueryString(name) {
    const params = new URL(window.location.href).searchParams;
    const result = params.get(name);
    if (result)
        return decodeURIComponent(result);
    return null;
}
function setFrom(from) {
    const attr = from_trans[from];
    from_span.style.color = attr.color;
    from_span.textContent = attr.text;
}
function removeEmoji(s) {
    return s.replaceAll(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDEFF]|\uFE0F| )+-/g, '');
}
async function addAnchor(node) {
    node.id = removeEmoji(node.id); // remove emojis in id to prevent weired hashes
    const node_ = node.appendChild(document.createElement('a'));
    node_.className = 'anchor';
    node_.href = '#' + node.id;
}
function addAnchors() {
    const nodes = main_article.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (let i = 0; i < nodes.length; i++) {
        addAnchor(nodes[i]);
    }
}
function hasModifier(e) { // Check if ctrl/alt/shift is pressed, in order to be none-intrusive
    return e.ctrlKey || e.altKey || e.shiftKey;
}
function insertNoteJS() {
    const script = document.head.appendChild(document.createElement('script'));
    script.id = 'note_js';
    script.src = `./notes/note_js/${current_page}.js`;
    console.info(`Added script ${current_page}.js`);
}
function parseMetadata() {
    const metadata = showdown_converter.getMetadata();
    if (metadata['title']) {
        document.title = metadata['title'] + " - PRO's blog";
        $('#title').innerHTML = metadata['title'];
    } else {
        document.title = current_page + ".md - PRO's blog";
        $('#title').innerHTML = 'none';
    }
    if (metadata['keywords']) {
        const keywords = metadata['keywords'].slice(1, -1);
        $("meta[name='keywords']").setAttribute('content', keywords);
    } else {
        $("meta[name='keywords']").setAttribute('content', 'PRO, blog, notes, ' + current_page);
    }
    if (metadata['description']) $("meta[name='description']").setAttribute('content', metadata['description']);
    else $("meta[name='description']").setAttribute('content', 'PRO 的个人博客');
    if (metadata['scripts'] === "true") {
        window.addEventListener("note_loaded", insertNoteJS, { once: true });
    }
    if (metadata['tags']) {
        let tags = metadata['tags'].slice(1, -1).split(',');
        for (let i = 0; i < tags.length; i++) {
            tags[i] = tags[i].trim();
        }
        if (tags.length) {
            // .innerHTML = '<a class="tag">' + tags.join('</a><a class="tag">') + '</a>';
            const tag_container = $('#tags');
            if (tags.length >= 1) {
                tag_container.innerHTML = '';
                tags.forEach(tag_name => {
                    const new_tag = tag_container.appendChild(document.createElement('a'));
                    new_tag.classList.add('tag');
                    new_tag.href = '?page=index#' + tag_trans[tag_name];
                    new_tag.addEventListener("click", (e) => {
                        if (hasModifier(e)) return;
                        history.pushState(null, null, '?page=index#' + tag_trans[tag_name]);
                        load('index');
                        e.preventDefault();
                    });
                    new_tag.innerText = tag_name;
                });
            } else {
                tag_container.innerHTML = 'none';
            }
            return;
        }
    }
    $('#tags').innerHTML = 'none';
}
function focus(sel) {
    const el = $(sel);
    if (!el) return;
    // Scroll to element
    el.scrollIntoView({ block: "center" });
    // Flash element
    el.classList.add("attention");
    el.addEventListener("animationend", () => {
        el.classList.remove("attention");
    }, { once: true });
}
async function modifyLink(node) {
    const dst = node.attributes.href.value;
    if (dst.startsWith('@note/')) {
        const filename = dst.slice(6);
        node.href = "?page=" + filename;
        node.removeAttribute("target");
        node.removeAttribute("rel");
        node.addEventListener("click", (e) => {
            if (hasModifier(e)) return;
            history.pushState(null, null, '?page=' + filename);
            load(filename.split('#')[0]);
            e.preventDefault();
        });
    } else if (dst.startsWith('@attachment/')) {
        const filename = dst.slice(12);
        node.href = "./attachments/" + filename;
        node.removeAttribute("target");
        node.removeAttribute("rel");
        node.classList.add('external-link');
    } else if (dst.startsWith("@element/")) {
        const href = node.getAttribute("href");
        const sel = href.slice(9);
        // node.href = "javascript:void(0)";
        node.removeAttribute("href");
        node.addEventListener("click", (e) => {
            e.preventDefault();
            focus(sel);
        });
        node.classList.add('element-link');
    } else if (!dst.startsWith("#")) {
        node.classList.add('external-link');
    }
}
async function modifyImg(node) {
    const dst = node.attributes.src.value;
    if (dst.startsWith('@attachment/')) {
        node.src = './attachments/' + dst.slice(12);
    }
}
function modifyLinks() {
    for (const node of main_article.getElementsByTagName('a')) {
        modifyLink(node);
    }
    for (const node of document.getElementsByTagName('img')) {
        modifyImg(node);
    }
}
function generateOutline() {
    const nodes = main_article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const outline = document.getElementsByClassName('outline')[0];
    outline.innerHTML = '';
    if (nodes.length <= 1) {
        const child = outline.appendChild(document.createElement('li'));
        child.innerHTML = '<i>Nothing to show.</i>';
        return;
    }
    for (i = 0; i < nodes.length; i++) {
        const outline_item = outline.appendChild(document.createElement('li'));
        const link = outline_item.appendChild(document.createElement('a'));
        link.className = 'outline-link';
        link.href = '#' + nodes[i].id;
        link.innerText = '  '.repeat(nodes[i].tagName.slice(1) - 1) + nodes[i].textContent;
    }
}
let animate;
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animate = render;
} else {
    animate = (markdown) => {
        main_article.style.opacity = 0;
        window.setTimeout(() => {
            render(markdown);
        }, 200);
        window.setTimeout(() => {
            main_article.style.opacity = 1;
        }, 200);
    }
}

function render(markdown) {
    main_article.innerHTML = showdown_converter.makeHtml(markdown);  // Render markdown
    modifyLinks();  // Link modifying
    parseMetadata();  // Metadata parsing
    renderMathInElement(main_article, katex_config);  // Render formula
    Prism.highlightAllUnder(main_article, true);  // Code highlight
    window.dispatchEvent(new CustomEvent('note_loaded'));
}
function load(name) {
    window.dispatchEvent(new CustomEvent('note_loading', {
        detail: {
            previous: current_page,
            current: name
        }
    }));
    NProgress.start();
    current_page = name;
    setFrom("loading");
    refreshBookmark();
    if (!sw_supported && sessionStorage.getItem(current_page)) {
        animate(sessionStorage.getItem(current_page));
        NProgress.done();
        setFrom("cache");
        return;
    }
    fetch('./notes/' + name + '.md', { cache: "reload" }).then(
        (r) => {
            if (r.status == 200) {
                NProgress.inc();
                r.text().then(
                    (text) => {
                        NProgress.inc();
                        if (!sw_supported) sessionStorage.setItem(current_page, text);
                        animate(text);
                        NProgress.done();
                        const from = r.headers.get("x-sw-from");
                        setFrom(from ? from : "network");
                    }
                );
            } else {
                current_page = '';
                document.title = r.status.toString() + ' ' + r.statusText + " - PRO's blog";
                main_article.innerHTML = '<p><font color="red">Failed to load "'
                    + name + '.md": <b>'
                    + r.status.toString() + ' ' + r.statusText + '</b>.</font><br/>Maybe you want to <a href="@note/index">return to the main page</a>?</p><img src="./cat/'
                    + r.status.toString() + '.jpg"></img>';
                modifyLinks();
                NProgress.done();
                setFrom("failed");
            }
        },
        (r) => {
            main_article.innerHTML = '<font color="red"><strong>⚠️ Network error!</strong></font>';
            NProgress.done();
            setFrom("failed");
        }
    );
}
function onPopState(e) {
    const target_page = getQueryString('page');
    if (current_page === target_page) return;
    current_page = target_page;
    load(current_page);
}
function menu() {
    if (menu_element.style.top) {  // Menu is displayed.
        menu_element.style.top = '';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        menu_button.style.pointerEvents = 'none';
        window.setTimeout(function () { overlay.style.display = 'none'; overlay.style.pointerEvents = ''; menu_button.style.pointerEvents = ''; }, 200);
    } else {  // Menu is hidden.
        menu_element.style.top = '0';
        overlay.style.display = '';
        overlay.style.pointerEvents = 'none';
        menu_button.style.pointerEvents = 'none';
        window.setTimeout(function () { overlay.style.opacity = ''; overlay.style.pointerEvents = ''; menu_button.style.pointerEvents = ''; }, 50);
    }
}
function addEntry(text1, op, href2, title2) {
    const li = bookmark_element.appendChild(document.createElement("li"));
    const link_1 = li.appendChild(document.createElement("a"));
    const link_2 = li.appendChild(document.createElement("a"));
    link_1.rel = "nofollow";
    link_1.innerText = text1;
    link_2.rel = "nofollow";
    link_2.classList.add("bookmark-op");
    link_2.innerHTML = `<b>${op}</b>`;
    link_2.href = href2;
    link_2.setAttribute("title", title2);
    return link_1;
}
function refreshBookmark() {
    let storage = window.localStorage.getItem("bookmarks");
    if (!storage) {
        storage = JSON.stringify([]);
        window.localStorage.setItem("bookmarks", storage);
    }
    const bookmarks = JSON.parse(storage);
    bookmark_element.innerHTML = "";
    for (let i = 0; i < bookmarks.length; i++) {
        const link_1 = addEntry(bookmarks[i], "-", `javascript:removeBookmark(${i});`, "Delete this bookmark.");
        link_1.href = "?page=" + bookmarks[i];
        link_1.addEventListener("click", (e) => {
            if (hasModifier(e)) return;
            history.pushState(null, null, '?page=' + bookmarks[i]);
            load(bookmarks[i].split('#')[0]);
            e.preventDefault();
        });
    }
    addEntry(current_page, "+", `javascript:addBookmark("${current_page}");`, "Add current page to bookmarks.");
}
function addBookmark(name) {
    const storage = window.localStorage.getItem("bookmarks");
    let bookmarks = JSON.parse(storage);
    bookmarks.push(name);
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    refreshBookmark();
}
function removeBookmark(index) {
    const storage = window.localStorage.getItem("bookmarks");
    let bookmarks = JSON.parse(storage);
    bookmarks.splice(index, 1);
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    refreshBookmark();
}
function handleImgClick(e) {
    const url = this.src;
    window.open(url, "_blank");
}
async function clearCache(cache_name) {
    await caches.delete(cache_name);
}
async function clearContents() {
    if (!sw_supported) {
        window.sessionStorage.clear();
    } else {
        await clearCache("note");
        await clearCache("other");
    }
}
// Service worker
const registerServiceWorker = async () => {
    try {
        await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
        });
    } catch (error) {
        console.error(`Registration failed: ${error}`);
    }
}
if (sw_supported) {
    registerServiceWorker();
} else {
    console.log("Service workers are not supported in this environment.");
}

// Initialize
let page = getQueryString('page');
if (!page) {
    page = 'index';
    history.replaceState(null, null, '?page=index')
}
overlay.style.display = 'none';
overlay.style.opacity = '0';
load(page);
window.addEventListener('popstate', onPopState);
window.addEventListener('load', NProgress.done);
window.addEventListener('note_loading', (e) => {
    const script = $("#note_js");
    if (script) {
        script.remove();
        console.info(`Removed script from note "${e.detail.previous}"`);
    }
});
window.addEventListener('note_loaded', (e) => {
    addAnchors();  // Add anchor to headers
    generateOutline();  // Outline
    // Source code link
    const link_element = $('#source_code');
    link_element.href = './notes/' + current_page + '.md';
    link_element.textContent = current_page + '.md';
    // Jump to hash
    const s = decodeURIComponent(window.location.hash.slice(1));
    const target = document.getElementById(s);
    if (target) {
        target.scrollIntoView();
    } else if (s === "top") {
        window.scrollTo({ top: 0 });
    }
    $$("img").forEach((img) => img.addEventListener("click", handleImgClick)); // Click to open image in new tab
});
refreshBookmark();
// Double click to get to top
const div = $("#main-content");
const button = $("#float-buttons > a[href='#top']");
div.addEventListener("dblclick", (e) => {
    if (e.target == div) {
        button.click();
    }
});
// Click span to clear cache
from_span.addEventListener("click", (e) => {
    if (hasModifier(e)) return;
    clearContents().then(() => {
        console.log("Cache cleared by clicking span");
        load(current_page);
    });
});
// Double refresh or Ctrl+F5 to clear cache
document.addEventListener("keydown", (e) => {
    if (e.key != "F5") return;
    if (e.ctrlKey) {
        clearContents();
        console.log("Cache cleared by Ctrl+F5");
    } else {
        const last = parseInt(window.sessionStorage.getItem("last-refresh") || "0");
        const now = Date.now();
        if (now - last < 5000) {
            clearContents();
            console.log("Cache cleared by double refresh");
        }
        window.sessionStorage.setItem("last-refresh", now);
    }
});
