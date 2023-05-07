// global variables
const populationData = {}
const gradient = {
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
let clicked = false
let clickedElem = null
let radius = 1
let heatmapData = []

// Initialize the map
const EPFLGeo = [46.5192, 6.5662]
const map = L.map('map').setView(EPFLGeo, 5)

// Add heatMap on map
let heatmap = L.heatLayer([], {radius: radius, gradient: gradient}).addTo(map);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Load the geoJSON data for the countries
d3.json('/geojson')
  .then(data => {
    // Create a layer group for the countries
    const countries = L.geoJSON(data, {
      style: {
        color: '#000',
        weight: 1,
        fillOpacity: 0,
      },
      onEachFeature: (feature, layer) => {
        // Add a mouseover event to highlight the country
        layer.on('mouseover', e => {
          if(clicked && clickedElem == e.target) { // TODO: change logic
            return
          }

          e.target.setStyle({
            fillOpacity: 0.5,
          });
        });
        // Add a mouseout event to unhighlight the country
        layer.on('mouseout', e => {
          if(clicked && clickedElem != e.target) { // TODO: change logic
            e.target.setStyle({
              fillOpacity: 0.8,
            });
            return
          }
          e.target.setStyle({
            fillOpacity: 0,
          });
        });

        layer.on('click', e => {
          clicked = true
          clickedElem = e.target
          e.target.setStyle({
            fillColor: '#000',
            opacity: 0,
            fillOpacity: 0
          });

          // Markers to see the bounds of the country
          /*
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
          */
          
          map.fitBounds(e.target.getBounds());

          const this_path = e.target._path;
          map.eachLayer(l => {
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


d3.csv("/swiss_all").then((data) => {
  data.forEach((d) => {
    if(!(d.year in populationData)) {
      populationData[d.year] = [];
    }

    populationData[d.year].push({lng: d.X, lat: d.Y, pop: d.Z});
  })

  const min = Number(d3.min(data, function(datum) { return datum.year; }))
  const max = Number(d3.max(data, function(datum) { return datum.year; }))

  noUiSlider.create(slider, {
    range: {
      min: min,
      max: max
    },
    step: 1,
    tooltips: true,
    start: [min],
    behaviour: 'tap-drag',
  });

  slider.noUiSlider.on('update', (values, handle) => {
    const year = parseInt(values[handle]);
    heatmapData = []
    populationData[year].forEach(datum => heatmapData.push([datum.lat, datum.lng, datum.pop]))
    map.removeLayer(heatmap);
    heatmap = L.heatLayer(heatmapData,{
      radius: radius,
      gradient: gradient
    }).addTo(map);
  });

  // Access the parsed data through the data variable
  // Create a Leaflet map and add it to the DOM
});
document.querySelector(`#Perspective_3d`).addEventListener(`click`, _ => {
  alert("Go 3D")
})

document.querySelector(`#toggleHeatmap`).addEventListener(`click`, e => {
  if (e.target.checked) {
    heatmap = L.heatLayer(heatmapData,{
      radius: radius,
      gradient: gradient
    }).addTo(map);
    return
  } 

  map.removeLayer(heatmap);
})

/* // TODO: find a good way to compute the radius based on the zoom level
map.on('zoom', function() {
  heatmap.setOptions({ radius: getRadius(map.getZoom()) });
});

function getRadius(zoom) {
  // Define a formula to calculate the radius based on the zoom level
  // This formula can be adjusted to fit your needs
  return Math.pow(2, zoom) / 20;
}
*/

document.querySelector(`#slider_radius`).addEventListener(`input`, e => {
  radius = parseInt(e.target.value)
  document.querySelector(`#output_radius`).innerHTML = radius
  heatmap.setOptions({ radius: parseInt(radius) });
})