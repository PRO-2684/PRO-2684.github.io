const version = "1694850433";
const note = "note";
const other = "other";
const base = location.origin + location.pathname.slice(0, -5); // remove last "sw.js"
const note_url = base + "notes/";
const expiration = 60 * 60 * 24; // 1 day
// const expiration = 60; // debug: 1 min

const addResourcesToCache = async (resources, cahce_name) => {
    const cache = await caches.open(cahce_name);
    await cache.addAll(resources);
};

const putInCache = async (request, response, cache_name) => {
    const cache = await caches.open(cache_name);
    console.debug(`Put ${request.url} in ${cache_name}`);
    await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
    let cache_name = other;
    let parts = request.url.slice(base.length).split("/");
    // Everything directly under base, `/js`, `/css` is in version cache; `/notes` is in note cache; else in other cache
    if (parts.length <= 1) {
        cache_name = version;
    } else if (parts[0] === "notes") {
        cache_name = note;
    } else if (parts[0] === "js" || parts[0] === "css") {
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
            return responseFromCache;
        }
    }
    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        putInCache(request, preloadResponse.clone(), cache_name);
        console.debug(`Get ${request.url} from preload, saved in cache ${cache_name}`);
        return preloadResponse;
    }
    if (cache_name !== other) {
        request.cache = "no-store";
    }
    try {
        const responseFromNetwork = await fetch(request);
        putInCache(request, responseFromNetwork.clone(), cache_name);
        console.debug(`Get ${request.url} from network, saved in cache ${cache_name}`);
        return responseFromNetwork;
    } catch (error) {
        if (responseFromCache) {
            console.debug(`Network error, ${request.url} fall back to cache`);
            return responseFromCache;
        }
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            console.debug(`Get fallback for ${request.url} from url ${fallbackUrl} in cache`);
            return fallbackResponse;
        }
        console.debug(`Constructed fallback response for ${request.url}`);
        return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
};

const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
    }
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "/favicon.ico",
            "/css/main.css",
            // "/css/katex.min.css",
            "/css/nprogress.css",
            // "/css/prism_dark.css",
            // "/css/prism_light.css",
            // "/css/secret.css",
            "/js/main.js",
            "/js/showdown.js",
            "/js/showdown-footnotes.js",
            "/js/katex.min.js",
            "/js/katex-auto-render.min.js",
            "/js/nprogress.js",
            // "/js/md5.js",
            "/js/prism.js",
        ], version),
    );
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

const deleteCache = async (key) => {
    await caches.delete(key);
};

const deleteOldCaches = async () => {
    const cacheKeepList = [version, other, note];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
    // Delete caches from other that are not under base
    const cache = await caches.open(other);
    const requests = await cache.keys();
    const requestsToDelete = requests.filter((request) => !request.url.startsWith(base));
    await Promise.all(requestsToDelete.map((request) => cache.delete(request)));
};

self.addEventListener("activate", (event) => {
    event.waitUntil(Promise.all([
        enableNavigationPreload(),
        deleteOldCaches(),
    ]));
});