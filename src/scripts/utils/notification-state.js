// notification-state.js
const NOTIFICATION_STATE_KEY = 'notification_enabled';

export function enableNotifications() {
  localStorage.setItem(NOTIFICATION_STATE_KEY, 'true');
}

export function disableNotifications() {
  localStorage.setItem(NOTIFICATION_STATE_KEY, 'false');
}

export function isNotificationsEnabled() {
  return localStorage.getItem(NOTIFICATION_STATE_KEY) === 'true';
}