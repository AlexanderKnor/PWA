// Name des Cache
const CACHE_NAME = 'pwa-beispiel-v1';

// Dateien, die beim Installieren des Service Workers gecacht werden sollen
const FILES_TO_CACHE = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    './icons/icon-maskable.png'
];

// Service Worker Installation
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation');

    // Warten, bis der Cache geöffnet und befüllt ist
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching der App-Shell');
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    // Aktiviert den neuen Service Worker sofort
    self.skipWaiting();
});

// Service Worker Aktivierung - Alte Caches löschen
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Aktivierung');

    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Alten Cache löschen:', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    // Stellt sicher, dass der Service Worker die Kontrolle sofort übernimmt
    self.clients.claim();
});

// Fetch-Event: Interceptor für Netzwerkanfragen
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetch', event.request.url);

    // Cache-First-Strategie
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache-Hit - Datei aus dem Cache zurückgeben
                if (response) {
                    return response;
                }

                // Cache-Miss - Anfrage an das Netzwerk senden
                return fetch(event.request)
                    .then((response) => {
                        // Prüfen, ob wir eine gültige Antwort erhalten haben
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Antwort klonen, da sie sonst nur einmal gelesen werden kann
                        const responseToCache = response.clone();

                        // Antwort zum Cache hinzufügen für zukünftige Anfragen
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});