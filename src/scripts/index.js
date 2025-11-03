import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';

import App from './pages/app';
import {
  registerServiceWorker,
  requestNotificationPermission,
  subscribeForPush,
  unsubscribeFromPush,
  isPushSubscribed,
} from './push-manager';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  //  skip to content
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.getElementById('main-content');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
        
        main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
      }
    });
  }

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Service worker + Push toggle wiring
  try {
    const swRegistration = await registerServiceWorker();
    const pushToggle = document.getElementById('nav-push-toggle');
    if (pushToggle) {
      const updateToggleState = async () => {
        const subscribed = swRegistration ? await isPushSubscribed(swRegistration) : false;
        pushToggle.textContent = subscribed ? 'Disable Push' : 'Enable Push';
        pushToggle.setAttribute('aria-pressed', String(subscribed));
      };

      await updateToggleState();

      pushToggle.addEventListener('click', async () => {
        if (!swRegistration) {
          // try to register again
          const r = await registerServiceWorker();
          if (!r) return alert('Service worker not available in this browser.');
        }

        const current = await isPushSubscribed(swRegistration);
        if (current) {
          await unsubscribeFromPush(swRegistration);
        } else {
          const perm = await requestNotificationPermission();
          if (perm !== 'granted') return alert('Notification permission is required to enable push.');
          const sub = await subscribeForPush(swRegistration);
          // Optionally: send subscription to server here using your API and auth token
          // await sendSubscriptionToServer(sub, token);
          console.log('Push subscription:', sub);
          alert('Berhasil berlangganan notification!. Anda dapat mengetes notifikasi lewat DevTools atau dari server.');
        }

        await updateToggleState();
      });
    }
  } catch (err) {
    console.error('Push setup error', err);
  }
});