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
  // Try to add all shell resources, log failures, and ensure install completes
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const failedResources = [];
      for (const resource of APP_SHELL) {
        try {
          await cache.add(resource);
          console.log('[SW] Cached:', resource);
        } catch (e) {
          failedResources.push(resource);
          console.warn('[SW] Failed to cache resource:', resource, e && e.message ? e.message : e);
        }
      }
      if (failedResources.length > 0) {
        console.error('[SW] These resources failed to cache:', failedResources);
      } else {
        console.log('[SW] All app shell resources cached successfully');
      }
    }).then(() => self.skipWaiting())
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

// Log lifecycle events for easier debugging
self.addEventListener('install', () => console.log('[SW] install event'));
self.addEventListener('activate', () => console.log('[SW] activate event'));

// Open notification settings database
function openNotificationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NotificationSettings', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    };
  });
}

// Check if notifications are enabled
async function isNotificationsEnabled() {
  try {
    const db = await openNotificationDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('enabled');
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result === true);
    });
  } catch (error) {
    console.error('Error checking notification state:', error);
    return false;
  }
}

// Handle incoming push events. Expect data as JSON with { title, body, icon, url, actions }
self.addEventListener('push', async (event) => {

  const isEnabled = await isNotificationsEnabled();
  
  if (!isEnabled) {
    console.log('Notifications are disabled, ignoring push event');
    return;
  }
  
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
    icon: data.icon || '/images/storyset.png',
    image: data.image,
    badge: data.icon || '/images/storyset.png',
    data: {
      url: data.url || '/',
      payload: data.payload || null,
    },
    actions: Array.isArray(data.actions) ? data.actions : [],
    silent: false,
    requireInteraction: true,
  };

  // Show notification (allow DevTools-simulated pushes even without a subscription)
  console.log('[SW] Showing notification:', data.title || 'Storyset');
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
