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
import {
    CameraHelper
} from '../../utils/camera-helper';
import L from 'leaflet';

export default class AddStoryPresenter {
    constructor(view) {
        this.view = view;
        this.map = null;
        this.selectedLocation = null;
        this.selectedMarker = null;
        this.selectedPhoto = null;
        this.cameraHelper = new CameraHelper();
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

        this.selectedMarker = L.marker([lat, lng]).addTo(this.map);
        this.selectedMarker.bindPopup('Lokasi yang dipilih').openPopup();
    }

    setupPhotoInput() {
        const photoInput = document.getElementById('photo');
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.selectedPhoto = file;
                const imageUrl = URL.createObjectURL(file);
                this.view.showPhotoPreview(imageUrl, file.name);
            }
        });
    }

    setupCameraFeature() {
        const cameraBtn = document.getElementById('camera-btn');
        const cameraContainer = document.getElementById('camera-container');
        const video = document.getElementById('camera-video');
        const captureBtn = document.getElementById('capture-btn');
        const closeCameraBtn = document.getElementById('close-camera-btn');
        const canvas = document.getElementById('camera-canvas');

        cameraBtn.addEventListener('click', async () => {
            const started = await this.cameraHelper.startCamera(video);
            if (started) {
                cameraContainer.style.display = 'block';
                cameraBtn.style.display = 'none';
            } else {
                showToast('Tidak dapat mengakses kamera', 'error');
            }
        });

        captureBtn.addEventListener('click', async () => {
            const photoBlob = await this.cameraHelper.capturePhoto(video, canvas);
            this.selectedPhoto = new File([photoBlob], 'camera-photo.jpg', {
                type: 'image/jpeg'
            });

            const imageUrl = URL.createObjectURL(photoBlob);
            this.view.showPhotoPreview(imageUrl, 'camera-photo.jpg');

            this.cameraHelper.stopCamera();
            video.srcObject = null;
            cameraContainer.style.display = 'none';
            cameraBtn.style.display = 'inline-block';

            showToast('Foto berhasil diambil!', 'success');
        });

        closeCameraBtn.addEventListener('click', () => {
            this.cameraHelper.stopCamera();
            video.srcObject = null;
            cameraContainer.style.display = 'none';
            cameraBtn.style.display = 'inline-block';
        });
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
                showToast('Cerita berhasil ditambahkan!', 'success');
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
        this.cameraHelper.stopCamera();
        if (this.map) {
            this.map.remove();
        }
    }
}