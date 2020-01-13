/**
 * Global Variables
 **/
var ElevationChart,
    ElevationData,
    ElevationMarker,
    HikeMap,
    GPXTracks,
    GPXData;

/**
 * Initaliser for a hike post.
 * Kick off functions that occur
 * before loading the GPX data.
 **/
function initHike() {
    // Create Map
    HikeMap = L.map('hikeMap');

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
    }).addTo(HikeMap);

    // Custom Icon URLs
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: RetinaMarkerIconURL,
        iconUrl: MarkerIconURL,
        shadowUrl: MarkerIconShadowURL,
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
function asyncProcessGPXData() {
    // Add Hike Stats
    addHikeStats();

    // Process the Elevation Data
    parseGPXElevationData();

    // Create the Scatter Plot
    initScatterPlot();
}

/**
 * Add the GPX file to
 * the LeafletJS map.
 **/
function addGPXTracks() {
    GPXTracks = new L.GPX(GPXFileURL, {
        async: true,
        polyline_options: {
            color: "#EA2027",
            opacity: 0.75,
            weight: 2,
            lineCap: 'round'
        },
        marker_options: {
            startIconUrl: "/img/pin-icon-start.png",
            endIconUrl: "/img/pin-icon-end.png",
            shadowUrl: null
        }
    }).on('loaded', function(e) {
        HikeMap.fitBounds(e.target.getBounds());
        GPXData = e.target;
        asyncProcessGPXData();
    }).addTo(HikeMap);
}

/**
 * Parse the GPX data to
 * get some hike stats and
 * add them to the card.
 **/
function addHikeStats() {
    // Distance
    var distance = GPXData.get_distance();
    var distanceKm = (distance / 1000).toFixed(2);
    document.querySelector(".distance .dynamic").textContent = distanceKm + "km";

    // Duration
    var duration = GPXData.get_total_time();
    document.querySelector(".duration .dynamic").textContent = msToHMS(duration);

    // Speed
    var speed = GPXData.get_total_speed().toFixed(2);
    document.querySelector(".speed .dynamic").textContent = speed + "km/hr";

    // Elevation
    var maxElev = parseFloat(GPXData.get_elevation_max().toFixed(0));
    var minElev = parseFloat(GPXData.get_elevation_min().toFixed(0));
    var ascent = maxElev - minElev;
    var elevGain = parseFloat(GPXData.get_elevation_gain().toFixed(0));
    var elevLoss = parseFloat(GPXData.get_elevation_loss().toFixed(0));
    // var elevNet = elevGain - elevLoss;
    // document.querySelector(".elev .dynamic").textContent = ascent.toLocaleString() + "m";
    document.querySelector(".climb .dynamic").textContent = "(" + elevGain.toLocaleString() + "m ⬆️ " + elevLoss.toLocaleString() + "m ⬇️)";
}

/**
 * Parse the GPX elevation data
 * for use in the ChartJS
 * scatter plot.
 **/
function parseGPXElevationData() {
    // Get the data
    var rawElevation = GPXData.get_elevation_data();

    // Iterate each track layer
    // and concatanate the points.
    var trackPoints = [];
    var firstLayer = GPXData._layers[Object.keys(GPXData._layers)[0]];
    for (let [key, value] of Object.entries(firstLayer._layers)) {
        if (value.hasOwnProperty("_latlngs")) {
            trackPoints = trackPoints.concat(value._latlngs);
        }
    }

    // Make a more useful dataset
    ElevationData = [];
    for (var i = 0; i < rawElevation.length; i++) {
        if ((i % 5) == 0) {
            ElevationData.push({
                x: rawElevation[i][0].toFixed(2),
                y: rawElevation[i][1].toFixed(2),
                lat: trackPoints[i].lat,
                lng: trackPoints[i].lng
            });
        }
    }
}

/**
 * Create the ChartJS scatter plot.
 * Lots of options!
 **/
function initScatterPlot() {
    var ctx = document.getElementById("elevationProfile");
    ctx.height = 500;
    ElevationChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: null,
                data: ElevationData,
                showLine: true,
                backgroundColor: "rgba(0, 148, 50, 0.5)",
                borderColor: "rgba(0, 148, 50, 0.75)",
                pointRadius: 0
            }]
        },
        options: {
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
                    label: function(tooltipItem, data) {
                        var latLng = [
                            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].lat,
                            data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].lng

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
            },
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
                        max: parseFloat(ElevationData[ElevationData.length - 1].x),
                        callback: function(value, index, values) {
                            return value.toLocaleString() + "km";
                        }
                    }
                }]
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
    return hours + ":" + minutes + ":" + seconds;
}


/**
 * Kick off the hike listener
 * when the document has loaded.
 **/
document.addEventListener("DOMContentLoaded", initHike);