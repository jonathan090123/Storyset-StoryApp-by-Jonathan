import { showFormattedDate } from '../../utils';

export default class FavoritesView {
  render() {
    return `
      <section class="container favorites-section">
        <h1 class="page-title">Cerita Favorit</h1>
        
        <div class="favorites-section">
          <div id="favorites-list" class="stories-grid">
            <div class="loading-placeholder">Memuat cerita favorit...</div>
          </div>
        </div>
      </section>
    `;
  }

  renderFavoriteStories(stories) {
    const favoritesContainer = document.getElementById('favorites-list');

    if (!stories || stories.length === 0) {
      favoritesContainer.innerHTML = '<p class="no-data">Belum ada cerita favorit.</p>';
      return;
    }

    favoritesContainer.innerHTML = stories.map((story, index) => `
      <article class="story-card" data-story-id="${story.id}" data-index="${index}" tabindex="0">
        <img 
          src="${story.photoUrl}" 
          alt="Foto cerita ${story.name}"
          class="story-image"
          loading="lazy"
        />
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <p class="story-date">${showFormattedDate(story.createdAt)}</p>
          ${story.lat && story.lon ? 
            `<p class="story-location">📍 ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}</p>` 
            : ''}
          <button class="remove-favorite-btn" data-story-id="${story.id}">Hapus dari Favorit</button>
        </div>
      </article>
    `).join('');
  }

  showError(message) {
    const favoritesContainer = document.getElementById('favorites-list');
    favoritesContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
}