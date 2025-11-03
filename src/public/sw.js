/* Service Worker for Storyset - PWA & Push Notifications */

// Cache names
const CACHE_NAME = 'storyset-v1';
const API_CACHE_NAME = 'storyset-api-v1';

// Resources to cache
const APP_SHELL = [
  '/',
  '/index.html',
  '/app.bundle.js',
  '/app.css',
  '/manifest.json',
  '/images/storyset.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Handle incoming push events. Expect data as JSON with { title, body, icon, url, actions }
self.addEventListener('push', (event) => {
  let data = { title: 'Storyset', body: 'You have a new message', icon: '/images/storyset.png', url: '/', actions: [] };
  try {
    if (event.data) {
      const text = event.data.text();
      data = JSON.parse(text);
    }
  } catch (err) {
    // if parsing fails, fall back to simple text
    data.body = event.data ? event.data.text() : data.body;
  }

  const options = {
    body: data.body,
    icon: data.icon || '/images/storyset.png', // Icon utama menggunakan foto story
    image: data.image, // Thumbnail gambar story yang lebih besar
    badge: data.icon || '/images/storyset.png', // Badge juga menggunakan foto story
    data: {
      url: data.url || '/',
      payload: data.payload || null,
    },
    actions: Array.isArray(data.actions) ? data.actions : [],
    // Tampilkan gambar lebih besar di notifikasi
    silent: false,
    requireInteraction: true, // Notifikasi tidak otomatis hilang
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Storyset', options));
});

// Re-subscribe handler placeholder
self.addEventListener('pushsubscriptionchange', (event) => {
  // In many implementations you'd re-subscribe here and post new subscription to your server
  // event.waitUntil(...)
});

// Handle notification click — focus existing client or open new window to provided url
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
