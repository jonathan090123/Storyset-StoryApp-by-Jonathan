import { getAllStories, deleteStory } from '../../utils/idb-helper';
import { showLoading, hideLoading } from '../../utils';
import { showSuccess, showError } from '../../utils/toast';

export default class FavoritesPresenter {
  constructor(view) {
    this.view = view;
    this.favoriteStories = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    const favoritesContainer = document.getElementById('favorites-list');
    if (favoritesContainer) {
      favoritesContainer.addEventListener('click', async (e) => {
        if (e.target.matches('.remove-favorite-btn')) {
          const storyId = e.target.dataset.storyId;
          if (storyId) {
            await this.removeStoryFromFavorite(storyId);
          }
        }
      });
    }
  }

  async loadFavoriteStories() {
    showLoading();
    try {
      this.favoriteStories = await getAllStories();
      this.view.renderFavoriteStories(this.favoriteStories);
    } catch (error) {
      this.view.showError('Terjadi kesalahan saat memuat cerita favorit.');
      console.error(error);
    } finally {
      hideLoading();
    }
  }

  async removeStoryFromFavorite(storyId) {
    try {
      await deleteStory(storyId);
      // Refresh daftar favorit setelah menghapus
      await this.loadFavoriteStories();
      showSuccess('Story berhasil dihapus dari Favorit!');
    } catch (error) {
      showError('Gagal menghapus story dari Favorit!');
      console.error(error);
    }
  }
}