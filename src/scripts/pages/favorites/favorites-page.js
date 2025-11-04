import FavoritesView from './favorites-view';
import FavoritesPresenter from './favorites-presenter';
import { isAuthenticated } from '../../utils/auth-helper';

export default class FavoritesPage {
  constructor() {
    this.view = new FavoritesView();
    this.presenter = new FavoritesPresenter(this.view);
  }

  async render() {
    if (!isAuthenticated()) {
      window.location.hash = '#/login';
      return '<div></div>';
    }
    return this.view.render();
  }

  async afterRender() {
    await this.presenter.loadFavoriteStories();

    // Event handler untuk tombol Hapus dari Favorit
    const removeFavButtons = document.querySelectorAll('.remove-favorite-btn');
    removeFavButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent card click event
        const storyId = btn.getAttribute('data-story-id');
        await this.presenter.removeStoryFromFavorite(storyId);
      });
    });
  }
}