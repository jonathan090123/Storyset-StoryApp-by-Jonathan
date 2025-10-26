import {
    getStoriesWithLocation
} from '../../data/api';
import {
    getToken
} from '../../utils/auth-helper';
import {
    initMap,
    addMarker,
    highlightMarker,
    resetMarker
} from '../../utils/map-helper';
import {
    showLoading,
    hideLoading
} from '../../utils';

export default class HomePresenter {
    constructor(view) {
        this.view = view;
        this.stories = [];
        this.map = null;
        this.markers = [];
        this.activeMarkerIndex = null;
    }

    async loadStories() {
        showLoading();
        try {
            const token = getToken();
            const response = await getStoriesWithLocation(token);

            if (!response.error) {
                this.stories = response.listStory;
                this.view.renderStories(this.stories);
                this.initializeMap();
                this.setupInteractions();
            } else {
                this.view.showError('Gagal memuat cerita. Silakan login kembali.');
            }
        } catch (error) {
            this.view.showError('Terjadi kesalahan saat memuat cerita.');
            console.error(error);
        } finally {
            hideLoading();
        }
    }

    initializeMap() {
        if (this.map) {
            this.map.remove();
        }

        this.map = initMap('map');
        this.markers = [];

        this.stories.forEach((story, index) => {
            if (story.lat && story.lon) {
                const popupContent = `
          <div class="map-popup">
            <img src="${story.photoUrl}" alt="${story.name}" style="width: 100%; max-width: 200px; border-radius: 4px;" />
            <h4>${story.name}</h4>
            <p>${story.description.substring(0, 100)}...</p>
          </div>
        `;

                const marker = addMarker(this.map, story.lat, story.lon, popupContent);
                marker.storyIndex = index;

                marker.on('click', () => {
                    this.highlightStoryCard(index);
                });

                this.markers.push(marker);
            }
        });
    }

    setupInteractions() {
        const storyCards = document.querySelectorAll('.story-card');

        storyCards.forEach((card, index) => {
            // Mouse hover for highlight
            card.addEventListener('mouseenter', () => {
                this.highlightMarkerByIndex(index);
            });

            card.addEventListener('mouseleave', () => {
                this.resetAllMarkers();
            });

            // Click to sync with map
            card.addEventListener('click', () => {
                this.syncMapWithCard(index);
            });

            // Keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.syncMapWithCard(index);
                }
            });
        });
    }

    highlightMarkerByIndex(index) {
        if (this.markers[index]) {
            highlightMarker(this.markers[index]);
            this.activeMarkerIndex = index;
        }
    }

    resetAllMarkers() {
        this.markers.forEach(marker => resetMarker(marker));
        this.activeMarkerIndex = null;
    }

    syncMapWithCard(index) {
        const story = this.stories[index];
        if (story.lat && story.lon && this.markers[index]) {
            this.map.setView([story.lat, story.lon], 12, {
                animate: true,
            });
            this.markers[index].openPopup();
            this.highlightMarkerByIndex(index);
        }
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