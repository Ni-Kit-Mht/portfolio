// sw.js (put in root)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('static-cache').then(cache => {
      return cache.addAll([
        '/',
        '/shop/index.html',
        '/database.json',
        '/style.css',
        '/script.js',
        // Add image URLs if you want them cached too
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
