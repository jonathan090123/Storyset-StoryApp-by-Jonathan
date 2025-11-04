import HomeView from './home-view';
import HomePresenter from './home-presenter';
import { isAuthenticated } from '../../utils/auth-helper';

export default class HomePage {
  constructor() {
    this.view = new HomeView();
    this.presenter = new HomePresenter(this.view);
  }

  async render() {
    if (!isAuthenticated()) {
      window.location.hash = '#/login';
      return '<div></div>';
    }
    return this.view.render();
  }

  async afterRender() {
    await this.presenter.loadStories();

    // {PERBAIKAN v2 , semua event listener sudah dipindahkan ke sini }
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach((card, index) => {
      // Mouse hover for highlight (map marker)
      card.addEventListener('mouseenter', () => {
        this.presenter.onCardMouseEnter(index);
        card.classList.add('highlighted');
      });

      card.addEventListener('mouseleave', () => {
        this.presenter.onCardMouseLeave();
        card.classList.remove('highlighted');
      });

      // Click to sync with map
      card.addEventListener('click', () => {
        this.presenter.onCardClick(index);
        // highlight and scroll the clicked card
        card.classList.add('highlighted');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      // Keyboard accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.presenter.onCardKeyActivate(index);
          card.classList.add('highlighted');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });

  // Event handler untuk tombol Simpan ke Favorit
  const favButtons = document.querySelectorAll('.favorite-btn');
  favButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
    const storyId = btn.getAttribute('data-story-id');
    await this.presenter.saveStoryToFavorite(storyId);
    });
  });
  }
}