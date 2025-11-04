export default class AddStoryView {
    render() {
        return `
      <section class="container add-story-section">
        <div class="add-story-card">
          <h1 class="page-title">Tambah Cerita Baru</h1>
          
          <form id="add-story-form" class="story-form" novalidate>
            <div class="form-group">
              <label for="description">Cerita Anda</label>
              <textarea 
                id="description" 
                name="description" 
                rows="5" 
                required
                aria-required="true"
                aria-describedby="description-error"
                placeholder="Ceritakan pengalaman Anda..."
              ></textarea>
              <span id="description-error" class="error-text" role="alert"></span>
            </div>

            <div class="form-group">
              <label for="photo">Tambah Foto</label>
              <div class="photo-input-group">
                <input 
                  type="file" 
                  id="photo" 
                  name="photo" 
                  accept="image/*"
                  required
                  aria-required="true"
                  aria-describedby="photo-error"
                />
                <button type="button" id="camera-btn" class="btn btn-secondary">
                    Buka Camera
                </button>
              </div>
              <span id="photo-error" class="error-text" role="alert"></span>
              <div id="photo-preview" class="photo-preview"></div>
            </div>

            <div id="camera-container" class="camera-container" style="display: none;">
              <video id="camera-video" class="camera-video" autoplay playsinline></video>
              <canvas id="camera-canvas" style="display: none;"></canvas>
              <div class="camera-controls">
                <button type="button" id="capture-btn" class="btn btn-primary">Ambil Foto</button>
                <button type="button" id="close-camera-btn" class="btn btn-secondary">Tutup Kamera</button>
              </div>
            </div>

            <div class="form-group">
              <label for="add-story-map">Lokasi (Klik pada peta)</label>
              <div id="add-story-map" class="map" role="application" aria-label="Pilih lokasi pada peta"></div>
              <p class="form-hint">
                Latitude: <span id="lat-display">-</span>, 
                Longitude: <span id="lon-display">-</span>
              </p>
              <span id="location-error" class="error-text" role="alert"></span>
            </div>

            <button type="submit" class="btn btn-primary btn-large">Bagikan Sekarang</button>
          </form>
        </div>
      </section>
    `;
    }

    showDescriptionError(message) {
        document.getElementById('description-error').textContent = message;
        document.getElementById('description').setAttribute('aria-invalid', 'true');
    }

    showPhotoError(message) {
        document.getElementById('photo-error').textContent = message;
    }

    showLocationError(message) {
        document.getElementById('location-error').textContent = message;
    }

    clearErrors() {
        ['description-error', 'photo-error', 'location-error'].forEach(id => {
            document.getElementById(id).textContent = '';
        });
        document.getElementById('description').removeAttribute('aria-invalid');
    }

    updateLocationDisplay(lat, lon) {
        document.getElementById('lat-display').textContent = lat.toFixed(6);
        document.getElementById('lon-display').textContent = lon.toFixed(6);
    }

    showPhotoPreview(imageUrl, filename) {
        const preview = document.getElementById('photo-preview');
        preview.innerHTML = `
      <div class="preview-image">
        <img src="${imageUrl}" alt="Preview foto" />
        <p>${filename}</p>
      </div>
    `;
    }
}