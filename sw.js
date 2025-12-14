const CACHE_NAME = 'monkeyclone-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    // External Libraries (Inhe cache karenge taaki offline me bhi chale)
    'https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500&family=Roboto+Mono:wght@400;500;700&family=Inconsolata:wght@500&family=Source+Code+Pro:wght@500&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Fetch Event (Offline Support)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Agar cache me hai to wahi se do, nahi to network se lao
                return response || fetch(event.request);
            })
    );
});

// Activate Event (Purana cache clear karne ke liye)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});