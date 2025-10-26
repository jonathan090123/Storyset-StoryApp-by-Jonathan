import AddStoryView from './add-story-view';
import AddStoryPresenter from './add-story-presenter';
import {
    isAuthenticated
} from '../../utils/auth-helper';
import {
    CameraHelper
} from '../../utils/camera-helper';
import {
    showToast
} from '../../utils';

export default class AddStoryPage {
    constructor() {
        this.view = new AddStoryView();
        this.presenter = new AddStoryPresenter(this.view);
    }

    async render() {
        if (!isAuthenticated()) {
            window.location.hash = '#/login';
            return '<div></div>';
        }
        return this.view.render();
    }

    async afterRender() {
        this.presenter.initializeMap();
        //  {perbaikan} semua listerner event di sini sudah dipindahkan 
        const photoInput = document.getElementById('photo');
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.presenter.setSelectedPhoto(file);
                const imageUrl = URL.createObjectURL(file);
                this.view.showPhotoPreview(imageUrl, file.name);
            }
        });

        
        this.cameraHelper = new CameraHelper();
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
            const file = new File([photoBlob], 'camera-photo.jpg', {
                type: 'image/jpeg'
            });
            this.presenter.setSelectedPhoto(file);

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

        const form = document.getElementById('add-story-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            this.presenter.handleSubmit(description);
        });
    }

    cleanup() {
        // stop camera if active
        if (this.cameraHelper) {
            this.cameraHelper.stopCamera();
        }
        // let presenter cleanup map
        if (this.presenter && typeof this.presenter.cleanup === 'function') {
            this.presenter.cleanup();
        }
    }
}