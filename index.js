let threshold = 500000;
let currYear  = 2019;
let centers   = {};
let paths     = {};
let map;

let lost = ["Bonaire, Sint Eustatius and Saba", "Cura\u00e7ao", "Sint Maarten (Dutch part)", "Channel Islands", "Wallis and Futuna Islands", "Holy See"]
let g;

function initMap() {
    g   = google;
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 3,
      center: { lat: 0, lng: -180 },
      mapTypeId: "terrain",
    });

    initCenters();
    associateCountries();
    drawThresholdPaths();
}

function associateCountries() {
    const lineSymbol = {
        path: g.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        strokeWeight: 3
    };
    for (const year in data) {
        console.log(year);
        paths[year] = {};
        
        for (const src in data[year]) {
            if (lost.includes(src)) continue;
            paths[year][src] = {};
            
            for (const dst in data[year][src]) {
                if (lost.includes(dst)) continue;
                
                let num_migrants = data[year][src][dst];
                
                paths[year][src][dst] = new google.maps.Polyline({
                    path: [
                        { lat: centers[dst][0], lng: centers[dst][1] },
                        { lat: centers[src][0], lng: centers[src][1] }
                    ],
                    icons:[
                        {
                            icon: lineSymbol,
                            offset: "100%"
                        }
                    ],
                    geodesic: true,
                    strokeColor: "#ba70ff",
                    strokeOpacity: 1.0,
                    strokeWeight: 1,
                });
            }
        }
    }
}


function initCenters() {
    countries.forEach((country) => {
        centers[country["name"]] = [country["latitude"], country["longitude"]];
    })
}


function onChangeYear() {
    drawThresholdPaths(false);
    currYear = $('#dropdown').val();
    drawThresholdPaths(true);
}


function drawThresholdPaths(draw) {
    for (const src in data[currYear]) {
        if (lost.includes(src)) continue;
        for (const dst in data[currYear][src]) {
            if (lost.includes(dst)) continue;
            if (data[currYear][src][dst] > threshold)
                if (draw) {
                    drawPath(currYear, src, dst);
                } else {
                    erasePath(currYear, src, dst)
                }
        }
    }
}

function drawPath(year, src, dst) {
    paths[year][src][dst].setMap(map);
}

function erasePath(year, src, dst) {
    paths[year][src][dst].setMap(null);
}
