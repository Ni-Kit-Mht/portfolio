const CACHE_NAME = 'v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/shop/index.html',
  '/style.css',
  '/nav.js',
  '/footer.js',
  '/database.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        FILES_TO_CACHE.map(file =>
          fetch(file).then(response => {
            if (!response.ok) throw new Error(`Failed to fetch ${file}`);
            return cache.put(file, response.clone());
          }).catch(err => {
            console.warn(`[SW] Skipping ${file}: ${err.message}`);
          })
        )
      );
    })
  );
});
