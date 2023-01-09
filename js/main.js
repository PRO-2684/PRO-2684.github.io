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
let showdown_converter = new showdown.Converter();
let current_page = 'index';
let menu_element = document.querySelector("#main-content > aside.panel.right-panel");
let menu_button = document.querySelector("#show-sidebar");
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
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.slice(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}
function removeEmoji(s) {
    return s.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]|\uFE0F| )+-/g, '');
}
function addAnchors() {
    let nodes = main_article.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].id = removeEmoji(nodes[i].id); // remove emojis in id to prevent weired hashes
        let node = document.createElement('a');
        node.className = 'anchor';
        node.href = '#' + nodes[i].id;
        nodes[i].appendChild(node);
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
function modifyLinks() {
    let nodes = main_article.getElementsByTagName('a');
    for (i = 0; i < nodes.length; i++) {
        let dst = nodes[i].attributes.href.value;
        if (dst.startsWith('@note/')) {
            let filename = dst.slice(6);
            nodes[i].href = "?page=" + filename;
            nodes[i].removeAttribute("target");
            nodes[i].removeAttribute("rel");
            nodes[i].onclick = function (e) {
                history.pushState(null, null, '?page=' + filename);
                load(filename.split('#')[0]);
                e.preventDefault();
            }
        } else if (dst.startsWith('@attachment/')) {
            let filename = dst.slice(12);
            nodes[i].href = "./attachments/" + filename;
            nodes[i].removeAttribute("target");
            nodes[i].removeAttribute("rel");
            nodes[i].classList.add('external-link');
        } else {
            nodes[i].classList.add('external-link');
        }
    }
    nodes = document.getElementsByTagName('img');
    for (let i = 0; i < nodes.length; i++) {
        let dst = nodes[i].attributes.src.value;
        if (dst.startsWith('@attachment/')) {
            nodes[i].src = './attachments/' + dst.slice(12);
        }
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
function render(markdown) {
    main_article.innerHTML = showdown_converter.makeHtml(markdown);  // render markdown
    renderMathInElement(main_article, katex_config);  // render formula
    Prism.highlightAllUnder(main_article, true);  // code highlight
    modifyLinks();  // link modifying
    addAnchors();  // add anchor to headers
    parseMetadata();  // metadata parsing
    // source code link
    let link_element = document.getElementById('source_code');
    link_element.href = './notes/' + current_page + '.md';
    link_element.textContent = current_page + '.md';
    generateOutline();  // outline
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
    refreshBookmark();
    if (sessionStorage.getItem(current_page)) {
        render(sessionStorage.getItem(current_page));
        NProgress.done();
        return;
    }
    var request = new XMLHttpRequest();
    request.open('GET', './notes/' + name + '.md?t=' + Date.now());
    request.send();
    request.onreadystatechange = function () {
        switch (request.readyState) {
            case 2:
                NProgress.inc();
                break;
            case 3:
                NProgress.inc();
                break;
            case 4:
                NProgress.inc();
                if (request.status == 200) {
                    main_article.innerHTML = request.responseText;
                    sessionStorage.setItem(current_page, request.responseText);
                    render(request.responseText);
                } else {
                    current_page = '';
                    document.title = request.status.toString() + ' ' + request.statusText + " - PRO's blog";
                    main_article.innerHTML = '<p><font color="red">Failed to load "'
                        + name + '.md": <b>'
                        + request.status.toString() + ' ' + request.statusText + '</b>.</font><br/>Maybe you want to <a href="@note/index">return to the main page</a>?</p><img src="./cat/'
                        + request.status.toString() + '.jpg"></img>';
                    modifyLinks();
                }
                NProgress.done();
                break;
            default:
                main_article.innerHTML = '<font color="red"><strong>Unexpected error!</strong></font>';
                NProgress.done();
        }
    }
}
function onPopState(e) {
    if (current_page === getQueryString('page')) return;
    current_page = getQueryString('page');
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
        window.sessionStorage.clear();
        location.reload(true);
    }
}
refreshBookmark();
