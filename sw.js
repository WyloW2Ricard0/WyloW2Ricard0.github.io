// =====================================================
// SERVICE WORKER — Cache stratégique pour Mnémosyne
// Stratégie : Cache-First pour assets statiques
//             Network-First pour HTML
// =====================================================
const CACHE_NAME = 'mnemosyne-v1';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/main.js',
    '/assets/js/diagrams.js',
    '/assets/js/perf.js',
    '/core/catalog.js',
    '/adapters/stripe.js',
    '/adapters/github.js',
    '/assets/img/logo_SP_contour_20250831.ico',
];

// Installation : pré-cache des assets statiques
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activation : purger les anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch : Cache-First pour assets, Network-First pour HTML
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Ne pas intercepter les API externes
    if (url.hostname !== self.location.hostname) return;

    // Network-First pour HTML
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-First pour CSS/JS/images
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(res => {
                if (res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                }
                return res;
            });
        })
    );
});
