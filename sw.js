var cacheName = 'vokabulator-pwa';
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/bootstrap.min.css',
  '/js/bootstrap.min.js',
  '/js/jquery-3.3.1.slim.min.js',
  '/js/popper.min.js',
  '/js/vue2_6_11.js',
  '/js/main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
