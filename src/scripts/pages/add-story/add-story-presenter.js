import {
    addStory
} from '../../data/api';
import {
    getToken
} from '../../utils/auth-helper';
import {
    validateRequired
} from '../../utils/validation';
import {
    showLoading,
    hideLoading,
    showToast
} from '../../utils';
import {
    initMap
} from '../../utils/map-helper';
import L from 'leaflet';

export default class AddStoryPresenter {
    constructor(view) {
        this.view = view;
        this.map = null;
        this.selectedLocation = null;
        this.selectedMarker = null;
        this.selectedPhoto = null;
    }

    initializeMap() {
        this.map = initMap('add-story-map');

        this.map.on('click', (e) => {
            this.selectLocation(e.latlng.lat, e.latlng.lng);
        });
    }

    selectLocation(lat, lng) {
        this.selectedLocation = {
            lat,
            lng
        };
        this.view.updateLocationDisplay(lat, lng);

        if (this.selectedMarker) {
            this.map.removeLayer(this.selectedMarker);
        }

        // {perbaikan marker, sudah diberi isi icon seharusnya bisa muncul }
        const icon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        this.selectedMarker = L.marker([lat, lng], { icon }).addTo(this.map);
        this.selectedMarker.bindPopup('Lokasi yang dipilih').openPopup();
    }

    setSelectedPhoto(file) {
        this.selectedPhoto = file;
    }

    async handleSubmit(description) {
        this.view.clearErrors();

        let hasError = false;

        if (!validateRequired(description)) {
            this.view.showDescriptionError('Cerita harus diisi');
            hasError = true;
        }

        if (!this.selectedPhoto) {
            this.view.showPhotoError('Foto harus dipilih');
            hasError = true;
        }

        if (!this.selectedLocation) {
            this.view.showLocationError('Lokasi harus dipilih pada peta');
            hasError = true;
        }

        if (hasError) return;

        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', this.selectedPhoto);
        formData.append('lat', this.selectedLocation.lat);
        formData.append('lon', this.selectedLocation.lng);

        showLoading();
        try {
            const token = getToken();
            const response = await addStory(token, formData);

            if (!response.error) {
                // Show success toast
                showToast('Cerita berhasil ditambahkan!', 'success');
                
                // If the story has an ID and photoUrl in response, we can use them
                const storyId = response.story?.id;
                const photoUrl = response.story?.photoUrl;
                const notificationPayload = {
                    title: 'Story Baru Ditambahkan!',
                    body: description.substring(0, 100) + (description.length > 100 ? '...' : ''),
                    icon: photoUrl || '/images/storyset.png', // Gunakan foto story sebagai icon
                    image: photoUrl, // Thumbnail gambar story yang lebih besar
                    badge: photoUrl || '/images/storyset.png', // Gunakan foto story sebagai badge juga
                    url: storyId ? `/#/stories/${storyId}` : '/#/',
                    actions: [
                        {
                            action: 'open',
                            title: 'Lihat Story'
                        }
                    ]
                };

                // If browser supports Notification API directly, show a local notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(notificationPayload.title, {
                        body: notificationPayload.body,
                        icon: notificationPayload.icon,
                        image: notificationPayload.image,
                        badge: notificationPayload.badge
                    });
                }
                setTimeout(() => {
                    window.location.hash = '#/';
                }, 1000);
            } else {
                showToast(response.message || 'Gagal menambahkan cerita', 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
            console.error(error);
        } finally {
            hideLoading();
        }
    }

    cleanup() {
        if (this.map) {
            this.map.remove();
        }
    }
}