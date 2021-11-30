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
    HikeMap = L.map('hikeMap');
    Tracks = L.featureGroup().addTo(HikeMap)
    // Add OpenStreetMap tile layer
    L.tileLayer('https://tiles-a.data-cdn.linz.govt.nz/services;key=50b8923a67814d28b7a1067e28f03000/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png', {attribution: 'NZ Topo Map images sourced from <a href="https://data.linz.govt.nz/layer/50767-nz-topo50-maps/">LINZ</a> - Crown Copyright Reserved'})
    .addTo(HikeMap);

    // Custom Icon URLs
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: RetinaMarkerIconURL,
        iconUrl: MarkerIconURL,
        shadowUrl: MarkerIconShadowURL
    });

    // Add Elevation Marker
    ElevationMarker = L.marker([0, 0]).addTo(HikeMap);

    // Add GPX File
    addGPXTracks();
}


/**
 * Process the GPXData after
 * the file has been loaded.
 **/
function asyncProcessGPXData(Data) {
    var name = getFilename(Data);
    var container = document.getElementById(name);
    if (container !== null) {
        addHikeStats(Data);
        var elevationData = parseGPXElevationData(Data);
        initScatterPlot(Data, elevationData);
    }

    if (document.getElementById("gpx-table") !== null) {
        populateGPXTable(Data);
    }
}


/**
 * Populate the GPX table
 * with data.
 **/
function populateGPXTable() {
    console.log(LayersLoaded, GPXFiles.length);
    if (LayersLoaded != GPXFiles.length) {
        return;
    }

    console.log("All loaded!");

    var totalDist = 0;
    var totalDur = 0;
    var totalElevGain = 0;
    var totalElevLoss = 0;

    for (const [layer, Data] of Object.entries(Tracks._layers)) {
        var table = document.querySelector("#gpx-table tbody");
        var date = Data.get_start_time();
        var distanceKm = (Data.get_distance() / 1000).toFixed(2);
        var duration = msToHMS(Data.get_total_time());
        var speed = ((Data.get_total_time()/1000/60) / (distanceKm)).toFixed(2);
        var elevGain = parseFloat(Data.get_elevation_gain().toFixed(0));
        var elevLoss = parseFloat(Data.get_elevation_loss().toFixed(0));

        totalDist += Data.get_distance();
        totalDur += Data.get_total_time();
        totalElevGain += Data.get_elevation_gain();
        totalElevLoss += Data.get_elevation_loss();

        var tableRow = "<tr><td onclick='showTrack(" + Data._leaflet_id + ")'>Zoom To</td><td>" + date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear() + "</td>"
            + "<td>" + distanceKm + "km</td>"
            + "<td>" + duration + "</td>"
            + "<td>" + speed + "min/km</td>"
            + "<td>" + elevGain + "m ⬆️, " + elevLoss + "m ⬇️</td>";
        table.innerHTML += tableRow;
    }

    table.innerHTML += "<tr><td></td><td>" + (totalDist/1000).toFixed(2) + "km</td><td>"
        + msToHMS(totalDur) + "</td><td></td><td>"
        + totalElevGain.toFixed(0) + "m ⬆️, "
        + totalElevLoss.toFixed(0) + "m ⬇️</td>";
}


function showTrack(id) {
    for (const [layer, Data] of Object.entries(Tracks._layers)) {
        if (Data._leaflet_id == id) {
            Data.setStyle({"opacity": 0.9});
            HikeMap.fitBounds(Data.getBounds());
        } else {
            Data.setStyle({"opacity": 0});
        }
    }
}



/**
 * Add the GPX file to
 * the LeafletJS map.
 **/
function addGPXTracks() {
    trackGroup = new L.featureGroup();

    var i,
        path;
    for (i = 0; i < GPXFiles.length; i += 1) {
        path = GPXFiles[i];
        GPXTracks = new L.GPX(GPXFiles[i], {
            async: true,
            polyline_options: {
                color: trackColours[i],
                opacity: 0.9,
                weight: 3,
                lineCap: 'round'
            },
            marker_options: {
                startIconUrl: "/img/pin-icon-start.png",
                endIconUrl: "/img/pin-icon-end.png",
                shadowUrl: null,
                iconAnchor: [12, 35],
                iconSize: [24, "auto"]
            },
            path: GPXFiles[i]
        }).on('loaded', function(e) {
            LayersLoaded += 1;
            var Data = e.target;
            trackGroup.addLayer(e.target);
            HikeMap.fitBounds(trackGroup.getBounds());
            asyncProcessGPXData(e.target);
            addTooltip(e.target);
            populateGPXTable();
        }).on("mouseover", function(e) {
            // console.log(e.target);
            for (const [layer, value] of Object.entries(Tracks._layers)) {
                console.log(layer, value.layers, e.target._leaflet_id);
                if (parseInt(layer) !== e.target._leaflet_id) {
                    value.setStyle({"opacity": 0.1});
                    // e.target.options.polyline_options.opacity = 0.1;
                }
                
            }

            // console.log(e, Tracks);
        }).on("mouseout", function(e) {
            for (const [layer, value] of Object.entries(Tracks._layers)) {
                value.setStyle({"opacity": 0.9});
            }
        }).addTo(Tracks);
    }
}


/**
 * Returns summary text
 * of a GPX file.
 **/
function addTooltip(Data) {
    var date = Data.get_start_time();
    var distanceKm = (Data.get_distance() / 1000).toFixed(2);
    var duration = msToHMS(Data.get_total_time());
    var speed = ((Data.get_total_time()/1000/60) / (distanceKm)).toFixed(2);
    var elevGain = parseFloat(Data.get_elevation_gain().toFixed(0));
    var elevLoss = parseFloat(Data.get_elevation_loss().toFixed(0));
    var tooltipText = "<strong>" + date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear() + "</strong><br/>"
        + "Distance: " + distanceKm + "km<br/>"
        + "Duration: " + duration + "<br/>"
        + "Pace: " + speed + "min/km<br/>"
        + "Elevation Gain: " + elevGain + "m<br/>"
        + "Elevation Loss: " + elevLoss + "m<br/>";
    Data.bindTooltip(tooltipText, {sticky: true}).openTooltip();
}


/**
 * Parse the GPX data to
 * get some hike stats and
 * add them to the card.
 **/
function addHikeStats(Data) {
    var name = getFilename(Data);
    var container = document.getElementById(name);

    container.innerHTML = `
        <p class="hike-stats">
            <span class="distance">
                <span class="dynamic"></span>
            </span>
            <span class="climb">
                <span class="dynamic"></span>
            </span> in 
            <span class="duration">
                <span class="dynamic"></span>
            </span> @ 
            <span class="speed">
                <span class="dynamic"></span>
            </span><br>
            <span class="downloadGPX"></span>
        </p>
    <div class="chart-container">
        <canvas id="elevationProfile"></canvas>
    </div>`;

    // Distance
    var distance = Data.get_distance();
    var distanceKm = (distance / 1000).toFixed(2);
    container.querySelector(".distance .dynamic").textContent = distanceKm + "km";

    // Duration
    var duration = Data.get_total_time();
    container.querySelector(".duration .dynamic").textContent = msToHMS(duration);

    // Speed
    // console.log(Data.get_moving_time()/1000);
    var speed = (distance) / (Data.get_total_time()/3600);
    // console.log(speed)
    // var speed = Data.get_moving_speed();
    container.querySelector(".speed .dynamic").textContent = speed.toFixed(2) + "km/hr";

    // GPX Download
    // console.log(Data);
    container.querySelector(".downloadGPX").innerHTML = "<a download='" + Data._gpx + "' title='Download GPX file for " + Data._info.name + "'>Download GPX</a>";

    // Elevation
    var maxElev = parseFloat(Data.get_elevation_max().toFixed(0));
    var minElev = parseFloat(Data.get_elevation_min().toFixed(0));
    var ascent = maxElev - minElev;
    var elevGain = parseFloat(Data.get_elevation_gain().toFixed(0));
    var elevLoss = parseFloat(Data.get_elevation_loss().toFixed(0));
    container.querySelector(".climb .dynamic").textContent = "(" + elevGain.toLocaleString() + "m ⬆️ " + elevLoss.toLocaleString() + "m ⬇️)";
}


/**
 * Parse the GPX elevation data
 * for use in the ChartJS
 * scatter plot.
 **/
function parseGPXElevationData(Data) {
    // for (let name in GPXData) {
        var name = getFilename(Data);
        var container = document.getElementById(name);

        // Get the data
        var rawElevation = Data.get_elevation_data();
        // Iterate each track layer
        // and concatenate the points.
        var trackPoints = [];
        var firstLayer = Data._layers[Object.keys(Data._layers)[0]];
        for (let [key, value] of Object.entries(firstLayer._layers)) {
            if (value.hasOwnProperty("_latlngs")) {
                trackPoints = trackPoints.concat(value._latlngs);
            }
        }

        // Make a more useful dataset
        elevationData = [];
        for (var i = 0; i < rawElevation.length; i++) {
            if ((i % 5) == 0) {
                elevationData.push({
                    x: rawElevation[i][0].toFixed(2),
                    y: rawElevation[i][1].toFixed(2),
                    lat: trackPoints[i].lat,
                    lng: trackPoints[i].lng
                });
                ElevationData.push({
                    x: rawElevation[i][0].toFixed(2),
                    y: rawElevation[i][1].toFixed(2),
                    lat: trackPoints[i].lat,
                    lng: trackPoints[i].lng
                });
            }
        }
        return elevationData;
    // }
}


/**
 * Create the ChartJS scatter plot.
 * Lots of options!
 **/
function initScatterPlot(Data, elevationData) {
    var name = getFilename(Data);
    var container = document.getElementById(name);
    var ctx = container.querySelector("canvas");
    if (typeof ctx !== "undefined") {
        ctx.height = 150;
        ElevationChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                {
                    label: null,
                    data: elevationData,
                    showLine: true,
                    backgroundColor: "rgba(0, 148, 50, 0.5)",
                    borderColor: "rgba(0, 148, 50, 0.75)",
                    pointRadius: 0
                }
                ]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Elevation (m)"
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toLocaleString() + "m";
                            }
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Distance (km)"
                        },
                        ticks: {
                            min: 0,
                            max: parseFloat(ElevationData[ElevationData.length - 1].x)
                        }
                    }]
                },
                customLine: {
                    color: '#009432'
                },
                legend: {
                    display: false
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                        label: function(tooltipItem, Data) {
                            var latLng = [
                                Data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].lat,
                                Data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].lng

                            ];
                            ElevationMarker.setLatLng(latLng);
                            var label = [
                                "Distance: " + tooltipItem.xLabel + "km",
                                "Elevation: " + tooltipItem.yLabel.toLocaleString() + "m"
                            ];
                            return label;
                        }
                    },
                    custom: function( tooltip ) {
                        if( tooltip.opacity > 0 ) {
                            ElevationMarker.setOpacity(1);
                        } else {
                            ElevationMarker.setOpacity(0);
                        }
                        return;
                    }
                }
            },
            plugins: [{
                beforeEvent: function(chart, e) {
                    if ((e.type === 'mousemove')
                    && (e.x >= e.chart.chartArea.left)
                    && (e.x <= e.chart.chartArea.right)
                    ) {
                        chart.options.customLine.x = e.x;
                    }
                },
                afterDraw: function(chart, easing) {
                    var ctx = chart.chart.ctx;
                    var chartArea = chart.chartArea;
                    var x = chart.options.customLine.x;

                    if (!isNaN(x)) {
                        ctx.save();
                        ctx.strokeStyle = chart.options.customLine.color;
                        ctx.moveTo(chart.options.customLine.x, chartArea.bottom);
                        ctx.lineTo(chart.options.customLine.x, chartArea.top);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }]
        });
    }

}


/**
 * A helper function that gets the
 * file name from a GPX file path.
 *
 * @param   string path
 * @return  string
 **/
function getFilename (obj) {
    var splits = obj._gpx.split("/");
    var nameWithExt = splits[splits.length - 1];
    var name = nameWithExt.split(".")[0];
    return name;
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
    return hours + "hrs " + minutes + "min";
}


/**
 * A helper function to calculate
 * the distance between two coordinates
 * using the Haversine formula.
 * https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
 **/
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}
function haversine() {
    var lat2 = 42.741;
    var lon2 = -71.3161;
    var lat1 = 42.806911;
    var lon1 = -71.290611;

    var R = 6371000;
    var x1 = lat2-lat1;
    var dLat = x1.toRad();
    var x2 = lon2-lon1;
    var dLon = x2.toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
}


/**
 * Kick off the hike listener
 * when the document has loaded.
 **/
document.addEventListener("DOMContentLoaded", initHike);
