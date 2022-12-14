/**
 * Global Variables
 **/
var HikeMap,
    Locations,
    Features;

/**
 * Initaliser for a hike post.
 * Kick off functions that occur
 * before loading the GPX data.
 **/
function initHike() {
    // Create Map
    HikeMap = L.map('hikeMap', {zoom: 12, center: L.latLng(-43.55947876166007, 172.63676687379547), fullscreenControl: true,});
    Features = L.featureGroup().addTo(HikeMap);

    // Manage map tiles
    var layer50 = L.tileLayer('https://tiles-a.data-cdn.linz.govt.nz/services;key=50b8923a67814d28b7a1067e28f03000/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png', {
        attribution: 'NZ Topo Map by <a href="https://data.linz.govt.nz/layer/50767-nz-topo50-maps/">LINZ</a>'
    });
    var layer250 = L.tileLayer('https://tiles-a.data-cdn.linz.govt.nz/services;key=50b8923a67814d28b7a1067e28f03000/tiles/v4/layer=50798/EPSG:3857/{z}/{x}/{y}.png', {
        attribution: 'NZ Topo Map by <a href="https://data.linz.govt.nz/layer/50767-nz-topo250-maps/">LINZ</a>'
    });
    if (HikeMap.getZoom() > 12) {
        HikeMap.removeLayer(layer250);
        layer50.addTo(HikeMap);
    } else {
        HikeMap.removeLayer(layer50);
        layer250.addTo(HikeMap);
    }
    HikeMap.on('fullscreenchange', function () {
        HikeMap.invalidateSize();
    });
    HikeMap.on("zoomend", function(e){
        if (HikeMap.getZoom() > 12) {
            HikeMap.removeLayer(layer250);
            layer50.addTo(HikeMap);
            return;
        }
        HikeMap.removeLayer(layer50);
        layer250.addTo(HikeMap);
    });
    // HikeMap.addControl(new L.Control.Fullscreen());

    // Add GPX File
    addCheckins();
}

function addCheckins() {
    Locations.forEach(function(entry) {
        L.marker([entry[2], entry[3]])
        .bindTooltip(entry[0] + "<br/>" + entry[1])
        .addTo(Features);
    });
    HikeMap.fitBounds(Features.getBounds());
}


/**
 * Show a given layer group
 * by activity name (in tooltip).
 **/
function showByDate(date) {
    HikeMap.eachLayer(function(layer) {
        if (layer.hasOwnProperty('_tooltip')) {
            if (layer._tooltip._content.indexOf(date) > -1) {
                HikeMap.flyTo(layer.getLatLng(), 14);
                layer.openTooltip();
            }
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
}


/**
 * Kick off the hike listener
 * when the document has loaded.
 **/
window.addEventListener("DOMContentLoaded", initHike());
