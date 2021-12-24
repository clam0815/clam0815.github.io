var cacheName = 'dummy-pwa';
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/bootstrap.min.css',
  '/js/bootstrap.min.js',
  '/js/jquery-3.3.1.slim.min.js',
  '/js/popper.min.js',
  '/js/tools.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Network falling back to the cache */
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
