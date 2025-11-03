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

export async function subscribeForPush(registration) {
  if (!registration || !registration.pushManager) throw new Error('Invalid service worker registration');
  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  // store locally for convenience
  localStorage.setItem('storyset_push_subscription', JSON.stringify(subscription));
  return subscription;
}

export async function unsubscribeFromPush(registration) {
  if (!registration || !registration.pushManager) throw new Error('Invalid service worker registration');
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return false;
  const success = await subscription.unsubscribe();
  localStorage.removeItem('storyset_push_subscription');
  return success;
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
