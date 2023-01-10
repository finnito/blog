/**
 * Global Variables
 **/
var HikeMap;
var ElevationData = [];
var ElevationChart;
var Tracks;
var LayersLoaded = 0;
var ColourIterator = 0;
var GPXData = {};
var trackColours = [
    "#ff3838",
    "#c56cf0",
    "#4cd137",
    "#00a8ff",
    "#ff3838",
    "#c56cf0",
    "#4cd137",
    "#00a8ff",
    "#ff3838",
    "#c56cf0",
    "#4cd137",
    "#00a8ff",
    "#ff3838",
    "#c56cf0",
    "#4cd137",
    "#00a8ff",
    "#ff3838",
    "#c56cf0",
    "#4cd137",
    "#00a8ff",
    "#ff3838",
    "#c56cf0",
    "#4cd137",
    "#00a8ff"
];


/**
 * Initaliser for a hike post.
 * Kick off functions that occur
 * before loading the GPX data.
 **/
function initHike() {
    // Create Map
    HikeMap = L.map('hikeMap', {zoom: 12, center: L.latLng(-43.55947876166007, 172.63676687379547)});
    HikeMap.addControl(new L.Control.Fullscreen());
    Tracks = L.featureGroup().addTo(HikeMap);

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

    // Add GPX File
    addGPXTracks();
    addImages();
}



/**
 * Adds images to the
 * Leaflet map.
 **/
function addImages() {
    var figures = document.querySelectorAll("figure[data-lat]");
    var i,
        fig,
        photoIcon;
    for (i = 0; i < figures.length; i += 1) {
        fig = figures[i];
        photoIcon = L.icon({
            iconUrl: '/css/images/marker-image.png',
            iconSize:     [38, 38],
            iconAnchor:   [19, 38],
            popupAnchor:  [-3, -76],
            fig:          fig.getAttribute("data-fig")
        });
        if (fig.getAttribute("data-lat") !== 0) {
            L.marker([fig.getAttribute("data-lat"), fig.getAttribute("data-lng")], {icon: photoIcon}, {test: "something"})
            .bindTooltip(fig.querySelector("figcaption").innerHTML)
            .on("click", function(e) {
                document.querySelector("figure[data-fig='" + e.target.options.icon.options.fig + "']").scrollIntoView();
            })
            .addTo(HikeMap);
        }
    }
}


/**
 * Show a given layer group
 * by activity name (in tooltip).
 **/
function showActivityByName(name) {
    HikeMap.eachLayer(function(layer) {
        if (layer.hasOwnProperty('_tooltip')) {
            if (layer._tooltip._content.indexOf(name) > -1) {
                HikeMap.fitBounds(layer.getBounds());
            }
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
}



/**
 * Add the GPX file to
 * the LeafletJS map.
 **/
function addGPXTracks() {
    var i,
        data,
        line,
        path;

    var orangeIcon = L.icon({
        iconUrl: '/css/images/marker-icon-2x-orange.png',

        iconSize:     [25, 41],
        iconAnchor:   [13, 41],
        popupAnchor:  [13, -41],
        tooltipAnchor:  [13, -41]
    });

    for (i = 0; i < GPXDataFiles.length; i++) {
        fetch(GPXDataFiles[i])
        .then(response => {
            return response.json()
        })
        .then(response => {
            var trackGroup = new L.featureGroup();
            trackGroup.addTo(Tracks);

            // Add the track polyline
            var polyline = L.Polyline.fromEncoded(response.stats.polyline, {
                color: trackColours[ColourIterator]
            }).addTo(trackGroup);

            // Different colour next time.
            if (ColourIterator == trackColours.length - 1) {
                ColourIterator = 0;
            } else {
                ColourIterator += 1;
            }

            // Add any waypoints
            for (j = 0; j < response.stats.waypoints.length; j++) {
                var txt = response.stats.waypoints[j][2]
                    + "<br>" + response.stats.waypoints[j][0]
                    + ","
                    + response.stats.waypoints[j][1]
                    + "<br>Click to Copy Text";

                L.marker([
                    response.stats.waypoints[j][0],
                    response.stats.waypoints[j][1]
                ],{'icon': orangeIcon})
                .bindTooltip(txt)
                .on("click", function(e) {
                    navigator.clipboard.writeText(e.target._tooltip._content.replace("<br>", "\n"));
                    window.alert("Copied \"" + e.target._tooltip._content.replace("<br>", "\n") + "\" to clipboard.");
                })
                .addTo(trackGroup);
            }

            L.marker([polyline._latlngs[0].lat, polyline._latlngs[0].lng]).addTo(trackGroup);
            addTooltip(polyline, response);

            HikeMap.fitBounds(Tracks.getBounds());
        })
    }
}


/**
 * Returns summary text
 * of a GPX file.
 **/
function addTooltip(el, data) {
    var tooltipText = "<strong>" + data.stats.name + "</strong><br/>"
        + "Date: " + (data.stats.date) + "<br/>"
        + "Distance: " + (data.stats.distance/1000).toFixed(2) + "km<br/>"
        + "Duration: " + msToHMS(data.stats.duration * 1000) + "<br/>"
        + "Pace: " + ((data.stats.distance / 1000)/(data.stats.duration/3600)).toFixed(2) + "km/hr<br/>"
        + "Elevation Gain: " + data.stats.uphill + "m<br/>"
        + "Elevation Loss: " + data.stats.downhill + "m<br/>";
    el.bindTooltip(tooltipText, {sticky: true, keepInView: true});
}


/**
 * A helper function that converts
 * miliseconds to a hh:mm:ss string.
 *
 * @param   integer ms
 * @return  string "hh:mm:ss"
 **/
function msToHMS( ms ) {
    var seconds,
        minutes,
        hours;
    seconds = ms / 1000;
    hours = parseInt( seconds / 3600 );
    seconds = seconds % 3600;
    minutes = ('00' + (parseInt( seconds / 60 ))).slice(-2);
    seconds = ('00' + (seconds % 60)).slice(-2);
    return hours + ":" + minutes;
}
