const CACHE_NAME = 'v1';
const FILES_TO_CACHE = [
  '/',
  '/shop/index.html',
  '/style.css',
  '/nav.js',
  '/footer.js',
  '/database.json'
];
const CACHE_EXPIRATION_DAYS = 7;
const METADATA_CACHE = 'metadata-cache';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      const metadataCache = await caches.open(METADATA_CACHE);
      const now = Date.now();

      await Promise.all(FILES_TO_CACHE.map(async file => {
        try {
          const response = await fetch(file);
          if (!response.ok) throw new Error(`Failed to fetch ${file}`);
          await cache.put(file, response.clone());

          // Save the timestamp for this file
          const metadata = new Response(JSON.stringify({ timestamp: now }));
          await metadataCache.put(file, metadata);
        } catch (err) {
          console.warn(`[SW] Skipping ${file}: ${err.message}`);
        }
      }));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const metadataCache = await caches.open(METADATA_CACHE);
      const keys = await cache.keys();
      const now = Date.now();

      await Promise.all(keys.map(async request => {
        const metadataResponse = await metadataCache.match(request.url);
        if (!metadataResponse) return;

        const { timestamp } = await metadataResponse.json();
        const ageInDays = (now - timestamp) / (1000 * 60 * 60 * 24);

        if (ageInDays > CACHE_EXPIRATION_DAYS) {
          console.log(`[SW] Deleting expired cache: ${request.url}`);
          await cache.delete(request);
          await metadataCache.delete(request.url);
        }
      }));
    })()
  );
});
