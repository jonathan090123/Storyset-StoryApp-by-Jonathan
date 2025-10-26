import L from 'leaflet';
import CONFIG from '../config';

export function initMap(containerId) {
    const map = L.map(containerId, {
        center: [-2.5489, 118.0149],
        zoom: 5,
    });
    
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19,
    });

    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap',
        maxZoom: 17,
    });

    streetLayer.addTo(map);

    const baseMaps = {
        'Street': streetLayer,
        'Satellite': satelliteLayer,
        'Topographic': topoLayer,
    };

    L.control.layers(baseMaps).addTo(map);

    return map;
}

export function addMarker(map, lat, lng, popupContent, options = {}) {
    const marker = L.marker([lat, lng], options).addTo(map);
    if (popupContent) {
        marker.bindPopup(popupContent);
    }
    return marker;
}

export function highlightMarker(marker) {
    marker.setIcon(L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }));
}

export function resetMarker(marker) {
    marker.setIcon(L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }));
}