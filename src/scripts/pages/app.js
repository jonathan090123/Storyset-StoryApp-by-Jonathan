import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { isAuthenticated, removeToken } from '../utils/auth-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._updateNavigation();
    this._setupLogout();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      const isOpen = this.#navigationDrawer.classList.toggle('open');
      this.#drawerButton.setAttribute('aria-expanded', isOpen);
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', 'false');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
          this.#drawerButton.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Keyboard navigation
    this.#drawerButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.#drawerButton.click();
      }
    });
  }

  _updateNavigation() {
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');
    const navAddStory = document.getElementById('nav-add-story');
    const navLogout = document.getElementById('nav-logout');

    if (isAuthenticated()) {
      navLogin.style.display = 'none';
      navRegister.style.display = 'none';
      navAddStory.style.display = 'block';
      navLogout.style.display = 'block';
    } else {
      navLogin.style.display = 'block';
      navRegister.style.display = 'block';
      navAddStory.style.display = 'none';
      navLogout.style.display = 'none';
    }
  }

  _setupLogout() {
    const logoutBtn = document.getElementById('nav-logout');
    logoutBtn.addEventListener('click', () => {
      removeToken();
      window.location.hash = '#/login';
      this._updateNavigation();
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      this.#content.innerHTML = '<div class="container"><h1>404 - Halaman tidak ditemukan</h1></div>';
      return;
    }

    // View transition API support
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }

    this._updateNavigation();
    
    // Focus main content for accessibility
    this.#content.focus();
  }
}

export default App;