/*********************************************************************
 *
 *  CalcTVA Service Worker
 *
 *  Created by Derek Erb Solutions ( https://derekerb.solutions)
 *  JavaScript programming and CSS styling by
 *  Victor Polouchine (victor@derekerb.solutions)
 *
 ********************************************************************/

// Local all app file assets to be loaded to the precache
const cacheName = 'calctva-cache-v0.9.0.9';

self.addEventListener('install', (event) => {
    console.log('DEBUG: Service Worker Install event!');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/calctva.css',
                '/css/normalise.css',
                '/fonts/roboto-regular.ttf',
                '/imgs/calc-empty-black.svg',
                '/imgs/calc-full-black.svg',
                '/imgs/moon.svg',
                '/imgs/question-empty-black.svg',
                '/imgs/question-full-black.svg',
                '/imgs/reset.svg',
                '/imgs/settings.svg',
                '/imgs/undo.svg'
            ]);
        })
    );
});

/*
self.addEventListener('fetch', event => {
    // Get asset from the cache
    event.respondWith(caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
    console.log('DEBUG: Fetch intercepted for: ', event.request.url);
});
*/

self.addEventListener('fetch', event => {
    console.log('DEBUG: Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('DEBUG: Fetch Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('DEBUG: Fetch Network request for ', event.request.url);
                return fetch(event.request)
            }).catch(error => {
                console.log('DEBUG: Fetch error - display custom offline page');
        })
    );
});

self.addEventListener('activate', event => {
    console.log('DEBUG: Activating new service worker...');

    const cacheAllowlist = [cacheName];

    // Remove outdated caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheNameEntry => {
                    if (cacheAllowlist.indexOf(cacheNameEntry) === -1) {
                        return caches.delete(cacheNameEntry);
                    }
                })
            );
        })
    );
});
