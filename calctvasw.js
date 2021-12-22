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
self.addEventListener('install', (event) => {
    console.log('DEBUG: Service Worker Install event!');
    const cacheName = 'calctva-cache-v1';
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll([
                '/',
                'index.html',
                '/css/calctva.css',
                '/css/normalise.css',
                '/fonts/roboto-regular.ttf',
                '/imgs/calc-empty-black.svg',
                '/imgs/calc-full-back.svg',
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

self.addEventListener('activate', event => {
    console.log('DEBUG: Activate event!');
});

self.addEventListener('fetch', event => {
    // Get asset from the cache
    event.respondWith(caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
    console.log('DEBUG: Fetch intercepted for:', event.request.url);
});
