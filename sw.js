const version = "1724573466";
const note = "note";
const other = "other";
const inVersion = ["js", "css", "fonts"];
const base = location.origin + location.pathname.slice(0, -5); // remove last "sw.js"
const note_url = base + "notes/";
const expiration = 60 * 60 * 24; // 1 day

const addResourcesToCache = async (resources, cahce_name) => {
    const cache = await caches.open(cahce_name);
    await cache.addAll(resources);
};

const putInCache = async (request, response, cache_name) => {
    const cache = await caches.open(cache_name);
    console.debug(`Put ${request.url} in ${cache_name}`);
    await cache.put(request, response);
};

const modHeader = (response, from) => {
    const headers = new Headers(response.headers);
    headers.set("x-sw-from", from);
    return new Response(response.body, { headers });
}

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
    let cache_name = other;
    const parts = request.url.slice(base.length).split("/");
    // Everything directly under base, `/js`, `/css` is in version cache; `/notes` is in note cache; else in other cache
    if (parts.length <= 1) {
        cache_name = version;
    } else if (parts[0] === "notes") {
        cache_name = note;
    } else if (inVersion.includes(parts[0])) {
        cache_name = version;
    }
    const responseFromCache = await caches.match(request, {
        // If same origin, ignore search params
        ignoreSearch: request.url.startsWith(base),
    });
    if (responseFromCache) {
        const time_span = Date.now() - new Date(responseFromCache.headers.get("date")).getTime();
        const is_expired = (time_span > expiration * 1000) && (cache_name !== version);
        if (is_expired) {
            console.debug(`Get ${request.url} from cache, but expired`);
        } else {
            console.debug(`Get ${request.url} from cache`);
            return modHeader(responseFromCache, "cache");
        }
    }
    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        await putInCache(request, preloadResponse.clone(), cache_name);
        console.debug(`Get ${request.url} from preload, saved in cache ${cache_name}`);
        return modHeader(preloadResponse, "network");
    }
    if (cache_name !== other) {
        request.cache = "no-store";
    }
    try {
        const responseFromNetwork = await fetch(request);
        await putInCache(request, responseFromNetwork.clone(), cache_name);
        console.debug(`Get ${request.url} from network, saved in cache ${cache_name}`);
        return modHeader(responseFromNetwork, "network");
    } catch (error) {
        if (responseFromCache) {
            console.debug(`Network error, ${request.url} fall back to cache`);
            return modHeader(responseFromCache, "outdated-cache");
        }
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            console.debug(`Get fallback for ${request.url} from url ${fallbackUrl} in cache`);
            return modHeader(fallbackResponse, "fallback");
        }
        console.debug(`Constructed fallback response for ${request.url}`);
        return new Response("Network error", {
            status: 408,
            headers: {
                "Content-Type": "text/plain",
                "x-sw-from": "failed",
            },
        });
    }
};

const enableNavigationPreload = async () => {
    await self?.registration?.navigationPreload?.enable();
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "/favicon.ico",
            "/css/main.css",
            "/css/nprogress.css",
            "/js/main.js",
            "/js/showdown.js",
            "/js/showdown-footnotes.js",
            "/js/katex.min.js",
            "/js/katex-auto-render.min.js",
            "/js/nprogress.js",
            "/js/prism.js",
        ].map(url => url + `?v=${version}`), version),
    );
    return self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    if (event.request.url.startsWith(base)) { // Only cache resources under my website
        event.respondWith(
            cacheFirst({
                request: event.request,
                preloadResponsePromise: event.preloadResponse,
                fallbackUrl: "/cat/404.jpg",
            }),
        );
    }
});

const deleteOldCaches = async () => {
    const cacheKeepList = [version, other, note];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map((key) => caches.delete(key)));
    // Delete caches from other that are not under base
    const cache = await caches.open(other);
    const requests = await cache.keys();
    const requestsToDelete = requests.filter((request) => !request.url.startsWith(base));
    await Promise.all(requestsToDelete.map((request) => cache.delete(request)));
};

self.addEventListener("activate", (event) => {
    event.waitUntil(enableNavigationPreload()
        .then(deleteOldCaches)
        .then(() => self.clients.claim())
    );
});
