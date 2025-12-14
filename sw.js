const CACHE_VERSION = "v2";
const STATIC_CACHE = `monkeyclone-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `monkeyclone-runtime-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => !key.includes(CACHE_VERSION))
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  const { request } = event;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(res => {
          if (res.status === 200) {
            const resClone = res.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, resClone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});