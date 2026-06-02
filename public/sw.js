const CACHE_NAME = 'chi-khordam-v1';
const ASSETS = [
    '/',
    '/profile',
    '/meals',
    '/add-meal',
    '/manifest.json',
    '/globals.css',
    // Add other static assets if they exist
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
