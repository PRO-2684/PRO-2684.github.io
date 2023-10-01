// Progress bar
NProgress.configure({
    trickleSpeed: 100,
    minimum: 0.05,
    showSpinner: false
});
NProgress.start();
// md converter - showdown
let enabled_features = ['tables', 'strikethrough', 'tasklists', 'openLinksInNewWindow', 'metadata', 'ghCompatibleHeaderId', 'simpleLineBreaks'];
for (i in enabled_features) {
    showdown.setOption(enabled_features[i], true);
}
let main_article = document.getElementById("markdown");
let showdown_converter = new showdown.Converter({extensions: ["footnotes"]});
let current_page = 'index';
let menu_element = document.querySelector("#main-content > aside.panel.right-panel");
let menu_button = document.querySelector("#show-sidebar");
const from_span = document.querySelector("#from");
let overlay = document.getElementById('overlay');
let bookmark_element = document.getElementById("bookmarks");
let tag_trans = {
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
let sw_supported = 'serviceWorker' in navigator;

// formula renderer - katex
let katex_config = {
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
// custom functions
function getQueryString(name) {
    let params = new URL(window.location.href).searchParams;
    let result = params.get(name);
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
    let node_ = document.createElement('a');
    node_.className = 'anchor';
    node_.href = '#' + node.id;
    node.appendChild(node_);
}
function addAnchors() {
    let nodes = main_article.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (let i = 0; i < nodes.length; i++) {
        addAnchor(nodes[i]);
    }
}
function parseMetadata() {
    let metadata = showdown_converter.getMetadata();
    if (metadata['title']) {
        document.title = metadata['title'] + " - PRO's blog";
        document.getElementById('title').innerHTML = metadata['title'];
    }
    else {
        document.title = current_page + ".md - PRO's blog";
        document.getElementById('title').innerHTML = 'none';
    }
    if (metadata['created']) document.getElementById('created').innerHTML = metadata['created'].slice(0, 10) + ' ' + metadata['created'].slice(11, 19);
    else document.getElementById('created').innerHTML = 'none';
    if (metadata['modified']) document.getElementById('modified').innerHTML = metadata['modified'].slice(0, 10) + ' ' + metadata['modified'].slice(11, 19);
    else document.getElementById('modified').innerHTML = 'none';
    if (metadata['description']) document.querySelector("meta[name='description']").setAttribute('content', metadata['description']);
    else document.querySelector("meta[name='description']").setAttribute('content', 'PRO 的个人博客');
    if (metadata['tags']) {
        let tags = metadata['tags'].slice(1, -1).split(',');
        for (let i = 0; i < tags.length; i++) {
            tags[i] = tags[i].trim();
        }
        if (tags.length) {
            // .innerHTML = '<a class="tag">' + tags.join('</a><a class="tag">') + '</a>';
            let tag_container = document.getElementById('tags');
            if (tags.length >= 1) {
                tag_container.innerHTML = '';
                tags.forEach(tag_name => {
                    let new_tag = document.createElement('a');
                    new_tag.classList.add('tag');
                    new_tag.href = '?page=index#' + tag_trans[tag_name];
                    new_tag.onclick = function (e) {
                        history.pushState(null, null, '?page=index#' + tag_trans[tag_name]);
                        load('index');
                        e.preventDefault();
                    }
                    new_tag.innerText = tag_name;
                    tag_container.appendChild(new_tag);
                });
            } else {
                tag_container.innerHTML = 'none';
            }
            return;
        }
    }
    document.getElementById('tags').innerHTML = 'none';
}
async function modifyLink(node) {
    let dst = node.attributes.href.value;
    if (dst.startsWith('@note/')) {
        let filename = dst.slice(6);
        node.href = "?page=" + filename;
        node.removeAttribute("target");
        node.removeAttribute("rel");
        node.onclick = function (e) {
            history.pushState(null, null, '?page=' + filename);
            load(filename.split('#')[0]);
            e.preventDefault();
        }
    } else if (dst.startsWith('@attachment/')) {
        let filename = dst.slice(12);
        node.href = "./attachments/" + filename;
        node.removeAttribute("target");
        node.removeAttribute("rel");
        node.classList.add('external-link');
    } else if (!dst.startsWith("#")) {
        node.classList.add('external-link');
    }
}
async function modifyImg(node) {
    let dst = node.attributes.src.value;
    if (dst.startsWith('@attachment/')) {
        node.src = './attachments/' + dst.slice(12);
    }
}
function modifyLinks() {
    let nodes = main_article.getElementsByTagName('a');
    for (let node of nodes) {
        modifyLink(node);
    }
    nodes = document.getElementsByTagName('img');
    for (let node of nodes) {
        modifyImg(node);
    }
}
function generateOutline() {
    let nodes = main_article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let outline = document.getElementsByClassName('outline')[0];
    outline.innerHTML = '';
    if (nodes.length <= 1) {
        let child = document.createElement('li');
        child.innerHTML = '<i>Nothing to show.</i>';
        outline.appendChild(child);
        return;
    }
    for (i = 0; i < nodes.length; i++) {
        let outline_item = document.createElement('li');
        let link = document.createElement('a');
        link.className = 'outline-link';
        link.href = '#' + nodes[i].id;
        link.innerText = '  '.repeat(nodes[i].tagName.slice(1) - 1) + nodes[i].textContent;
        outline_item.appendChild(link);
        outline.appendChild(outline_item);
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
    main_article.innerHTML = showdown_converter.makeHtml(markdown);  // render markdown
    modifyLinks();  // link modifying
    addAnchors();  // add anchor to headers
    parseMetadata();  // metadata parsing
    generateOutline();  // outline
    renderMathInElement(main_article, katex_config);  // render formula
    Prism.highlightAllUnder(main_article, true);  // code highlight
    // source code link
    let link_element = document.getElementById('source_code');
    link_element.href = './notes/' + current_page + '.md';
    link_element.textContent = current_page + '.md';
    let s = decodeURIComponent(window.location.hash.slice(1));
    let target = document.getElementById(s);
    if (target) {
        target.scrollIntoView();
    } else if (s === "top") {
        window.scrollTo({ top: 0 });
    }
}
function load(name) {
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
    let target_page = getQueryString('page');
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
        window.setTimeout(function() {overlay.style.display = 'none'; overlay.style.pointerEvents = ''; menu_button.style.pointerEvents = '';}, 200);
    } else {  // Menu is hidden.
        menu_element.style.top = '0';
        overlay.style.display = '';
        overlay.style.pointerEvents = 'none';
        menu_button.style.pointerEvents = 'none';
        window.setTimeout(function() {overlay.style.opacity = ''; overlay.style.pointerEvents = ''; menu_button.style.pointerEvents = '';}, 50);
    }
}
function refreshBookmark() {
    let storage = window.localStorage.getItem("bookmarks");
    if (!storage) {
        storage = JSON.stringify([]);
        window.localStorage.setItem("bookmarks", storage);
    }
    let bookmarks = JSON.parse(storage);
    bookmark_element.innerHTML = "";
    for (let i = 0; i < bookmarks.length; i++) {
        var li = document.createElement("li");
        var link_1 = document.createElement("a");
        var link_2 = document.createElement("a");
        link_1.href = "?page=" + bookmarks[i];
        link_1.setAttribute("one-link-mark", "yes");
        link_1.innerText = bookmarks[i];
        link_1.onclick = function (e) {
            history.pushState(null, null, '?page=' + bookmarks[i]);
            load(bookmarks[i].split('#')[0]);
            e.preventDefault();
        }
        link_2.href = `javascript:removeBookmark(${i});`;
        link_2.classList.add("bookmark-op");
        link_2.setAttribute("one-link-mark", "yes");
        link_2.setAttribute("title", "Delete this bookmark.");
        link_2.innerHTML = "<b>-</b>";
        li.appendChild(link_1);
        li.appendChild(link_2);
        bookmark_element.appendChild(li);
    }
    var li = document.createElement("li");
    var link_1 = document.createElement("a");
    var link_2 = document.createElement("a");
    link_1.innerText = current_page;
    link_2.href = `javascript:addBookmark("${current_page}");`;
    link_2.classList.add("bookmark-op");
    link_2.setAttribute("one-link-mark", "yes");
    link_2.setAttribute("title", "Add current page to bookmarks.");
    link_2.innerHTML = "<b>+</b>";
    li.appendChild(link_1);
    li.appendChild(link_2);
    bookmark_element.appendChild(li);
}
function addBookmark(name) {
    let storage = window.localStorage.getItem("bookmarks");
    let bookmarks = JSON.parse(storage);
    bookmarks.push(name);
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    refreshBookmark();
}
function removeBookmark(index) {
    let storage = window.localStorage.getItem("bookmarks");
    let bookmarks = JSON.parse(storage);
    bookmarks.splice(index, 1);
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    refreshBookmark();
}
function clearCache(cache_name) {
    caches.delete(cache_name);
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

// initialize
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
document.onkeydown = function (e) {
    if ((e.key == "F5") && e.ctrlKey) {
        if (window.event) {
            try{e.keyCode = 0;}catch(e){}
            e.returnValue = false;
        } else {
            e.preventDefault();
        }
        if (!sw_supported) {
            window.sessionStorage.clear();
        } else {
            clearCache("note");
            clearCache("other");
        }
        location.reload(true);
    }
}
refreshBookmark();
// Double click to get to top
let div = document.getElementById("main-content");
let button = document.querySelector("#float-buttons > a[href='#top']");
div.addEventListener("dblclick", (e) => {
    if (e.target == div) {
        button.click();
    }
});
