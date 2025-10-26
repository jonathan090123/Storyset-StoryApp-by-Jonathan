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
  }
}