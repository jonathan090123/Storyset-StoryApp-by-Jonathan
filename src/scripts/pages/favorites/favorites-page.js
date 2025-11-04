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
    // Re-setup event listeners after rendering
    this.presenter.setupEventListeners();
  }
}