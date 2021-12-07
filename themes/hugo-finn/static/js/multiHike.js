/**
 * Global Variables
 **/
var HikeMap;
var ElevationData = [];
var ElevationChart;
var Tracks;
var LayersLoaded = 0;
var GPXData = {};
var trackColours = [
    "#ff3838",
    "#6F1E51",
    "#c56cf0",
    "#33d9b2",
    "#17c0eb",
    "#ff3838",
    "#6F1E51",
    "#c56cf0",
    "#33d9b2",
    "#17c0eb",
    "#ff3838",
    "#6F1E51",
    "#c56cf0",
    "#33d9b2",
    "#17c0eb",
];


/**
 * Initaliser for a hike post.
 * Kick off functions that occur
 * before loading the GPX data.
 **/
function initHike() {
    // Create Map
    HikeMap = L.map('hikeMap', {zoom: 12, center: L.latLng(-43.55947876166007, 172.63676687379547), fullscreenControl: true});
    Tracks = L.featureGroup().addTo(HikeMap)

    // Manage map tiles
    var layer50 = L.tileLayer('http://tiles-a.data-cdn.linz.govt.nz/services;key=50b8923a67814d28b7a1067e28f03000/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png', {
        attribution: 'NZ Topo Map by <a href="https://data.linz.govt.nz/layer/50767-nz-topo50-maps/">LINZ</a>'
    });
    var layer250 = L.tileLayer('http://tiles-a.data-cdn.linz.govt.nz/services;key=50b8923a67814d28b7a1067e28f03000/tiles/v4/layer=50798/EPSG:3857/{z}/{x}/{y}.png', {
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
}


/**
 * Populate the GPX table
 * with data.
 **/
function populateGPXTable() {
    if (document.querySelector("#gpx-table") == null) {
        return;
    }

    document.getElementById("gpx-table").innerHTML += "<tbody></tbody>";
    var table = document.querySelector("#gpx-table tbody");
    var totalDist = 0;
    var totalDur = 0;
    var totalElevGain = 0;
    var totalElevLoss = 0;

    for (const [id, gpxFile] of Object.entries(GPXDataFiles)) {
        var date = gpxFile.stats.date;
        var distanceKm = (gpxFile.stats.distance / 1000).toFixed(2);
        var duration = msToHMS(gpxFile.stats.duration * 1000);
        var speed = ((gpxFile.stats.distance / 1000)/(gpxFile.stats.duration/3600)).toFixed(2);
        var elevGain = parseFloat(gpxFile.stats.uphill.toFixed(0));
        var elevLoss = parseFloat(gpxFile.stats.downhill.toFixed(0));

        totalDist += gpxFile.stats.distance;
        totalDur += gpxFile.stats.duration;
        totalElevGain += gpxFile.stats.uphill;
        totalElevLoss += gpxFile.stats.downhill;

        var tableRow = "<tr><td><small>" + date + "</small><br/>" + gpxFile.stats.name + "</td>"
            + "<td>" + distanceKm + "km<br/>" + duration + "hrs</td>"
            + "<td>" + speed + "km/hr<br/>" + elevGain + "m ⬆️, " + elevLoss + "m ⬇️</td>"
            + "<td><a download href='" + GPXFiles[id] + "'>Download GPX</a></td>";
        table.innerHTML += tableRow;
    }
    table.innerHTML += "<tr><td></td><td>" + (totalDist/1000).toFixed(2) + "km<br/>" + msToHMS(totalDur * 1000)+ "hrs</td>"
        + "<td>" + totalElevGain.toFixed(0) + "m ⬆️, "
        + totalElevLoss.toFixed(0) + "m ⬇️</td><td></td>";
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

    for (i = 0; i < GPXDataFiles.length; i++) {
        var trackGroup = new L.featureGroup();
        trackGroup.addTo(Tracks);
        var polyline = L.Polyline.fromEncoded(GPXDataFiles[i].stats.polyline, {
            color: trackColours[i]
        }).addTo(trackGroup);

        trackGroup.on("mouseover", function(e) {
            console.log("Hovered on: ", e.target._leaflet_id);
            for (const [layerGroupID, layerGroup] of Object.entries(Tracks._layers)) {
                console.log("Checking layer group ", layerGroupID, " vs ", e.target._leaflet_id, layerGroupID == e.target._leaflet_id);
                if (layerGroupID != e.target._leaflet_id) {
                    console.log("Hiding: ", layerGroup);
                    layerGroup.setStyle({"opacity": 0.1});
                }
            }
        }).on("mouseout", function(e) {
            for (const [layer, value] of Object.entries(Tracks._layers)) {
                value.setStyle({"opacity": 0.9});
            }
        });
        L.marker([polyline._latlngs[0].lat, polyline._latlngs[0].lng]).addTo(trackGroup);
        addTooltip(trackGroup, GPXDataFiles[i]);
    }
    HikeMap.fitBounds(Tracks.getBounds());
    populateGPXTable();
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
    el.bindTooltip(tooltipText, {sticky: true});
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


/**
 * Kick off the hike listener
 * when the document has loaded.
 **/
document.addEventListener("DOMContentLoaded", initHike);
