export class CameraHelper {
    constructor() {
        this.stream = null;
    }

    async startCamera(videoElement) {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'
                },
                audio: false,
            });
            videoElement.srcObject = this.stream;
            return true;
        } catch (error) {
            console.error('Error accessing camera:', error);
            return false;
        }
    }

    capturePhoto(videoElement, canvasElement) {
        const context = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0);

        return new Promise((resolve) => {
            canvasElement.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.9);
        });
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}