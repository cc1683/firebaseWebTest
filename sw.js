var cacheName="basicv0.1";
var filesToCache = [
    '/',
    '/index.html',
    '/img/firebase-logo-512.png',
    '/manifest.json'
];

self.addEventListener('install', function(e) {
    self.skipWaiting(); // attempt to activate
    console.log('sw install event');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('sw caching');
            return cache.addAll(filesToCache); // dependent resource
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('sw activate event');
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('sw Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim(); // attempt to take control of all clients
});

  self.addEventListener('fetch', function(e) {
    e.respondWith(
        // Cache, fall back to network
        // Cache => Page or Net => Page
        // ----------------------------
        caches.match(e.request).then(function(response) {
            if(response){
                console.log('sw fetch cache ', e.request.url);
                return response;
            }
            console.log('sw fetch net ', e.request.url);
            return fetch(e.request);
        }).catch(()=>{ console.log('cache error')})
    );
  });


