import CONFIG from './config';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }
  return null;
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'denied';
  const permission = await Notification.requestPermission();
  return permission;
}

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

// Set notification state in IndexedDB
async function setNotificationState(enabled) {
  const db = await openNotificationDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    const request = store.put(enabled, 'enabled');
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function subscribeForPush(registration) {
  if (!registration || !registration.pushManager) throw new Error('Invalid service worker registration');
  
  // Enable notifications in both IndexedDB and localStorage
  await setNotificationState(true);
  localStorage.setItem('notification_enabled', 'true');
  
  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  // store subscription
  localStorage.setItem('storyset_push_subscription', JSON.stringify(subscription));
  return subscription;
}

export async function unsubscribeFromPush(registration) {
  try {
    // Immediately disable notifications in both storages
    await setNotificationState(false);
    localStorage.setItem('notification_enabled', 'false');
    localStorage.removeItem('storyset_push_subscription');
    
    // Get all service worker registrations
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    // Unsubscribe from all
    for (const reg of registrations) {
      if (reg.pushManager) {
        const subscription = await reg.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }
      await reg.unregister();
    }

    // Clear all caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    
    // Force page reload to ensure clean state
    window.location.reload();
    return true;
    
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    // Ensure notifications stay disabled even if error
    await setNotificationState(false);
    localStorage.setItem('notification_enabled', 'false');
    throw error;
  }
}

export async function isPushSubscribed(registration) {
  if (!registration || !registration.pushManager) return false;
  const sub = await registration.pushManager.getSubscription();
  return !!sub;
}

// Optional helper: send subscription object to backend (if endpoint exists). It will POST JSON to the provided path.
export async function sendSubscriptionToServer(subscription, token, endpoint = `${CONFIG.BASE_URL}/subscribe`) {
  if (!subscription) throw new Error('No subscription to send');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(subscription),
  });
  return res.json();
}
