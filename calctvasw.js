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
const cacheName = 'calctva-cache-v1.0';

self.addEventListener('install', (event) => {
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
                '/imgs/undo.svg',
                '/js/calctvaclass.js',
                '/js/calctva.js',
                '/favicon-512x512.png',
                '/favicon-144x144.png',
                '/favicon-32x32.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
            }).catch(error => {
        })
    );
});

self.addEventListener('activate', event => {
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
