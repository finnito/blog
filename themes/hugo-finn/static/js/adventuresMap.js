document.addEventListener("DOMContentLoaded", function () {
    var sheetID="1QY2dUuuoUGDj1-ueKmzRNrZQeEiIhYWc145FCIo3olI";
    var base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
    var sheetName = 'Sheet1';
    var query = encodeURIComponent('Select *')
    var url = `${base}&sheet=${sheetName}&tq=${query}`;
    
    const data = [];

    fetch(url)
    .then(res => res.text())
    .then(rep => {
      var jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      var table = document.querySelector("adventuresTable");

      // Extract the table header row.
      let headerRow = document.createElement('tr');
      jsonData.table.cols.forEach((heading) => {
        let th = document.createElement("th");
        th.innerText = heading.label;
        headerRow.appendChild(th);
      });
      table.thead.appendChild(thead);

      // Extract the data rows.
      jsonData.table.rows.forEach((row) => {
        let tr = document.createElement("tr");

        row.c.forEach((col) => {
          let td = document.createElement("td");
          if (col !== null) {
            td.innerText = col.v;
          }
          tr.appendChild(td);
        });
        table.tbody.appendChild(tr);
        // console.log(row);
      });


    // Create Map
    var HikeMap = L.map("hikeMap", {
        zoom: 12,
        center: L.latLng(-43.55947876166007, 172.63676687379547),
        maxZoom: 15
    });
    var Tracks = L.featureGroup().addTo(HikeMap);

    // Manage map tiles
    var layer50 = L.tileLayer("https://tiles-a.data-cdn.linz.govt.nz/services;key=50b8923a67814d28b7a1067e28f03000/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png", {
        attribution: "NZ Topo Map by <a href=\"https://data.linz.govt.nz/layer/50767-nz-topo50-maps/\">LINZ</a>"
    });
    var layer250 = L.tileLayer("https://tiles-a.data-cdn.linz.govt.nz/services;key=50b8923a67814d28b7a1067e28f03000/tiles/v4/layer=50798/EPSG:3857/{z}/{x}/{y}.png", {
        attribution: "NZ Topo Map by <a href=\"https://data.linz.govt.nz/layer/50767-nz-topo250-maps/\">LINZ</a>"
    });

    if (HikeMap.getZoom() > 12) {
        HikeMap.removeLayer(layer250);
        layer50.addTo(HikeMap);
    } else {
        HikeMap.removeLayer(layer50);
        layer250.addTo(HikeMap);
    }

    HikeMap.on("zoomend", function () {
        if (HikeMap.getZoom() > 12) {
            HikeMap.removeLayer(layer250);
            layer50.addTo(HikeMap);
            return;
        }
        HikeMap.removeLayer(layer50);
        layer250.addTo(HikeMap);
    });

    var table = document.querySelector(".adventuresTable");
    table.querySelectorAll("tbody tr").forEach(function (row) {
        var markerURL = "/css/images/marker-"
                + row.children[1].innerText.toLowerCase()
                + "-"
                + row.children[0].innerText.toLowerCase()
                + ".png";

        var marker = L.icon({
            iconUrl: markerURL,
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            popupAnchor: [13, -41],
            tooltipAnchor: [13, -41]
        });

        // Add each row to the map
        L.marker(row.children[2].innerText.split(","), {icon: marker})
            .bindTooltip(row.children[3].innerText)
            .addTo(Tracks);
    });

    HikeMap.fitBounds(Tracks.getBounds());
});