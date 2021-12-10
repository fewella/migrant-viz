let threshold = 100000;
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
    drawThresholdPaths(true);
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

    $( "#selection-text" ).empty();
}


function drawThresholdPaths(draw) {
    for (const src in data[currYear]) {
        if (lost.includes(src)) continue;
        for (const dst in data[currYear][src]) {
            if (lost.includes(dst)) continue;
            if (draw) {
              if (data[currYear][src][dst] > threshold) {
                drawPath(currYear, src, dst);
              }
            } else {
              erasePath(currYear, src, dst);
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

function addPath() {
  let src = $("#sourceCountry").val();
  let dst = $("#destCountry").val();

  const lineSymbol = {
      path: g.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 3,
      strokeWeight: 3
  };

  currYear = $('#dropdown').val();

  paths[currYear][src][dst] = new google.maps.Polyline({
      path: [
          { lat: centers[src][0], lng: centers[src][1] },
          { lat: centers[dst][0], lng: centers[dst][1] }
      ],
      icons:[
          {
              icon: lineSymbol,
              offset: "100%"
          }
      ],
      geodesic: true,
      strokeColor: "#081da3",
      strokeOpacity: 1.0,
      strokeWeight: 1,
  });

  paths[currYear][src][dst].setMap(map);

  let result = true;

  addText(src, dst, result);

}

function addText(src, dst, result) {
  $( "#selection-text" ).append( "<p>" + src + " --> " + dst + (result ? ": added!" : ": no data") + "</p>" );
}

// Adds countries for the autocomplete textboxes
$( function() {
  let countryList = [];

  countries.forEach((country) => {
      countryList.push(country["name"]);
  });

  $( "#sourceCountry" ).autocomplete({
    source: countryList
  });

  $( "#destCountry" ).autocomplete({
    source: countryList
  });
} );

$(document).on('input change', '#threshold-slider', function() {
  let val = $(this).val();

  switch(val) {
    case "0":
      threshold = 5000;
      $("#threshold-label").text("Select threshold: " + "5,000");
      break;

    case "1":
      threshold = 10000;
      $("#threshold-label").text("Select threshold: " + "10,000");
      break;

    case "2":
      threshold = 50000;
      $("#threshold-label").text("Select threshold: " + "50,000");
      break;

    case "3":
      threshold = 100000;
      $("#threshold-label").text("Select threshold: " + "100,000");
      break;

    case "4":
      threshold = 200000;
      $("#threshold-label").text("Select threshold: " + "200,000");
      break;

    case "5":
      threshold = 500000;
      $("#threshold-label").text("Select threshold: " + "500,000");
      break;

    case "6":
      threshold = 1000000;
      $("#threshold-label").text("Select threshold: " + "1,000,000");
      break;

    default:
      threshold = 100000;
      $("#threshold-label").text("Select threshold: " + "100,000");
      break;

  }

  console.log(threshold);

  drawThresholdPaths(false);
  drawThresholdPaths(true);


});
