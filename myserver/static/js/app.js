//const fs = require('fs');

// Initialize the map
const EPFLGeo = [46.5192, 6.5662]
const map = L.map('map').setView(EPFLGeo, 5)
// const map = L.map('map').setView([48.8566, 2.3522], 12);;
let clicked = false
let clickedElem = null

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  //maxZoom: 18,
}).addTo(map);

// Load the geoJSON data for the countries
fetch('/geojson')
  .then(response => response.json())
  .then(data => {
    // Create a layer group for the countries
    var countries = L.geoJSON(data, {
      style: {
        color: '#000',
        weight: 1,
        fillOpacity: 0,
      },
      onEachFeature: function(feature, layer) {
        // console.log(feature.properties.name)
        // console.log(layer)
        // Add a mouseover event to highlight the country
        layer.on('mouseover', function() {
          if(clicked && clickedElem != this) {
            this.setStyle({
              fillOpacity: 0.5,
            });
            return
          }

          this.setStyle({
            fillOpacity: 0.5,
            fillColor: '#f00',
          });
        });
        // Add a mouseout event to unhighlight the country
        layer.on('mouseout', function() {
          if(clicked && clickedElem != this) {
            this.setStyle({
              fillOpacity: 0.8,
            });
            return
          }
          this.setStyle({
            fillOpacity: 0,
          });
        });

        layer.on('click', function(event) {
          clicked = true
          clickedElem = this
          this.setStyle({
            fillColor: '#000',
            opacity: 0,
            fillOpacity: 0
          });
          // Markers to see the bounds of the country
          // console.log(event.target);
          // console.log(this);
          
          const markerShape = "M0,-10L10,10L-10,10Z";
          const arrGeo = [this.getBounds()._northEast.lat, this.getBounds()._northEast.lng] //, this.getBounds()._southWest.lat, this.getBounds()._southWest.lng]
          const marker = L.marker(arrGeo, {
            icon: L.divIcon({
              className: 'my-div-icon',
              html: '<svg width="20" height="20"><path d="' + markerShape + '" fill="red"></path></svg>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
          }).addTo(map);
          
          const arrGeo2 = [this.getBounds()._southWest.lat, this.getBounds()._southWest.lng]
          const marker2 = L.marker(arrGeo2, {
            icon: L.divIcon({
              className: 'my-div-icon',
              html: '<svg width="20" height="20"><path d="' + markerShape + '" fill="red"></path></svg>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
          }).addTo(map);
          
          // console.log(this.getBounds());
          map.fitBounds(this.getBounds());

          this_path = this._path;
          map.eachLayer(function(l) {
            if (l._path != this_path && l._path != undefined) {
              l.setStyle({
                fillColor: '#000',
                opacity: 0.8,
                fillOpacity: 0.8
              });
            }
          });
        });
      },
    }).addTo(map)
  });

var populationLayer = L.layerGroup().addTo(map);
let populationData = {}
var gradient = {
  0.1: 'red', 
  0.2: 'yellow', 
  0.3: 'green', 
  0.4: "purple", 
  0.5: 'blue',
  0.6: 'orange',
  0.7: 'black',
  0.8: 'white',
  0.9: 'grey',
  1.0: 'pink'
}; 
let b = true
let radius = 1
let heatmapData = []
let heatmap = L.heatLayer([], {radius: radius, gradient: gradient}).addTo(map);
d3.csv("/swiss_all").then(function(data) {
  data.forEach(function(d) {
    // if d.year is key of heatmapData push d to heatmapData[d.year] else create new key and push d to heatmapData[d.year]
    if (d.year in populationData) {
      populationData[d.year].push({lng:d.X, lat:d.Y, pop:d.Z})
    } else {
      populationData[d.year] = [{lng:d.X, lat:d.Y, pop:d.Z}]
    }
  })

  const min = parseInt(d3.min(data, function(datum) { return datum.year; }))
  const max = parseInt(d3.max(data, function(datum) { return datum.year; }))

  noUiSlider.create(slider, {
    range: {
      min: min,
      max: max
    },
    step: 1,
    tooltips: true,
    start: [min, max],
    behaviour: 'drag'
  });

  slider.noUiSlider.on('update', function(values, handle) {
    var year = parseInt(values[handle]);
    heatmapData = []
    populationData[year].forEach(function(datum) {
      var latlng = L.latLng(datum.lat, datum.lng);
      var population = parseFloat(datum.pop);
      // var marker = L.marker(latlng);
      // populationLayer.addLayer(marker);
      // OR
      heatmapData.push([datum.lat, datum.lng, population]);
    })
    map.removeLayer(heatmap);
    heatmap = L.heatLayer(heatmapData,{
      radius: radius,
      gradient: gradient
    }).addTo(map);
    //updateData(year);

    console.log(heatmapData[0])
    console.log(heatmapData[1])
    console.log(heatmapData[2])
    
  });

  // console.log(heatmapData)
  /*if (b) {
    b = false
    console.log(data[0])
    console.log(data[1])
    console.log(data[2])
  }*/
  // Access the parsed data through the data variable
  // Create a Leaflet map and add it to the DOM
});
document.querySelector(`#Perspective_3d`).addEventListener(`click`, e => {
  alert("Go 3D")
})

document.querySelector(`#slider_radius`).addEventListener(`input`, e => {
  radius = parseInt(e.target.value)
  document.querySelector(`#output_radius`).innerHTML = radius
  heatmap.setOptions({ radius: parseInt(radius) });
})
document.querySelector(`#toggleHeatmap`).addEventListener(`click`, e => {
  _this = e.target
  if (_this.checked) {
    heatmap = L.heatLayer(heatmapData,{
      radius: radius,
      gradient: gradient
    }).addTo(map);
  } else {
    map.removeLayer(heatmap);
  }
})

map.on('zoom', function() {
  heatmap.setOptions({ radius: getRadius(map.getZoom()) });
});

function getRadius(zoom) {
  // Define a formula to calculate the radius based on the zoom level
  // This formula can be adjusted to fit your needs
  var radius = Math.pow(2, zoom) / 20;
  return radius;
}

/*
fs.readFile('', 'utf8', (err, data) => {
  if (err) throw err;

  const csvData = d3.csvParse(data);

  // Do something with the CSV data here
});
*/