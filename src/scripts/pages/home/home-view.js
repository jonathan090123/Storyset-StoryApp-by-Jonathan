export default class HomeView {
    constructor() {
        this.map = null;
        this.markers = [];
    }

    render() {
        return `
      <section class="container home-section">
        <h1 class="page-title">Cerita dari Seluruh Indonesia</h1>
        
        <div class="map-container">
          <div id="map" class="map" role="application" aria-label="Peta cerita"></div>
        </div>

        <div class="stories-section">
          <h2>Daftar Cerita</h2>
          <div id="stories-list" class="stories-grid">
            <div class="loading-placeholder">Memuat cerita...</div>
          </div>
        </div>
      </section>
    `;
    }

    renderStories(stories) {
        const storiesContainer = document.getElementById('stories-list');

        if (!stories || stories.length === 0) {
            storiesContainer.innerHTML = '<p class="no-data">Belum ada cerita tersedia.</p>';
            return;
        }

        storiesContainer.innerHTML = stories.map((story, index) => `
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
        </div>
      </article>
    `).join('');
    }

    showError(message) {
        const storiesContainer = document.getElementById('stories-list');
        storiesContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }

  highlightStoryCard(index) {
    const cards = document.querySelectorAll('.story-card');
    cards.forEach(card => card.classList.remove('highlighted'));

    if (cards[index]) {
      cards[index].classList.add('highlighted');
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }
}

import {
    showFormattedDate
} from '../../utils';