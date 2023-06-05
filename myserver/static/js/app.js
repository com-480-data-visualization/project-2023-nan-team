// global variables
const loading = document.getElementById("loading");
const btnPerspective3D = document.getElementById("Perspective_3d");
const btn3Dquit = document.getElementById("quit3D");
const map2 = document.getElementById("map");
const radiusButton = document.getElementById("radiusInput");
const graph = document.getElementById("graph");
const graphDiv = document.querySelector("#graph");

let mergedMeshes = []; // Declare an array to store all merged meshes

// const container = document.getElementById("canvas");
const container = document.getElementById( 'canvas' );
document.body.appendChild( container );

const populationData = {}
const gradient = {
  0.1: '#01623E',
  0.2: '#017D50',
  0.3: '#029A62',
  0.4: "#02B875",
  0.5: '#02D588',
  0.6: '#02F29A',
  0.7: '#33FDB3',
  0.8: '#6DFEC9',
  0.9: '#A7FEDE',
  1.0: '#E2FFF4'
};

let clicked = false
let clickedElem = null
let radius = 5
let heatmapData = []
let country

noUiSlider.create(slider, {
  range: {
    min: 2000,
    max: 2020
  },
  step: 1,
  tooltips: true,
  start: [2000],
  behaviour: 'tap-drag',
});

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
          if (clicked && clickedElem == e.target) { // TODO: change logic
            return
          }
          if(!clicked) {
            e.target.setStyle({
              fillOpacity: 0.5,
              fillColor: '#aaa',
            });
            return;
          }
          e.target.setStyle({
            fillOpacity: 0.9,
            fillColor: '#aaa',
          });
        });
        // Add a mouseout event to unhighlight the country
        layer.on('mouseout', e => {
          if (clicked && clickedElem != e.target) { // TODO: change logic
            e.target.setStyle({
              fillOpacity: 0.9,
              fillColor: '#000',
            });
            return
          }
          e.target.setStyle({
            fillOpacity: 0,
          });
        });

        layer.on('click', e => {
          // heatmap = L.heatLayer([]).addTo(map);
          heatmap.setLatLngs([]);
          // allow selection
          map.selectArea.enable();
          // Refresh the heat layer to reflect the changes
          clicked = true
          clickedElem = e.target
          e.target.setStyle({
            fillColor: '#000',
            opacity: 0,
            fillOpacity: 0
          });

          const countryName = e.target.feature.properties.ADMIN;
          country = countryName;
          btnPerspective3D.setAttribute("country", countryName)
          d3.csv(`/country/${countryName}`).then(data => {
            data.forEach((d) => {
              if (!(d.year in populationData)) {
                populationData[d.year] = [];
              }

              populationData[d.year].push({lng: d.X, lat: d.Y, pop: d.Z});
            })

            slider.noUiSlider.on('update', (values, handle) => {
              const year = parseInt(values[handle]);
              heatmapData = []
              populationData[year].forEach(datum => heatmapData.push([datum.lat, datum.lng, datum.pop]))
              map.removeLayer(heatmap);
              heatmap = L.heatLayer(heatmapData, {
                radius: radius,
                gradient: gradient
              }).addTo(map);
            });
          })
          // Markers to see the bounds of the country
          map.fitBounds(e.target.getBounds());

          const this_path = e.target._path;
          map.eachLayer(l => {
            if (l._path != this_path && l._path != undefined) {
              l.setStyle({
                fillColor: '#000',
                opacity: 0.9,
                fillOpacity: 0.9
              });
            }
          });
        });
      }
    }).addTo(map)
  });

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


map.on({
  'areaselected': (e) => {
    L.Util.requestAnimFrame(() => {
      map2.style.width = '50%';
      graphDiv.style.width = '50%';

      // Create a new div element
      var newDiv = document.createElement('div');

      // Set any desired properties or attributes to the new div
      newDiv.classList.add('quitBtn');
      newDiv.setAttribute('id', 'quitGraph');

      // Create a new span element
      var newSpan = document.createElement('span');

      // Set any desired properties or attributes to the span
      newSpan.textContent = 'X';
      // Append the span element to the div element
      newDiv.appendChild(newSpan);

      newDiv.onclick = function() {
        alert("clicked");
        map2.style.width = '90%';
        graphDiv.style.width = '0%';
        const svg = document.querySelector("#graphSVG");
        graphDiv.innerHTML = '';
      };

      // Add a click event listener to the new div
      newDiv.addEventListener('click', function() {
        alert("clicked");
        map2.style.width = '90%';
        graphDiv.style.width = '0%';
        const svg = document.querySelector("#graphSVG");
        graphDiv.innerHTML = '';
      });
      graphDiv.appendChild(newDiv);

      graphDiv.innerHTML += '<h2 onclick="alert("hello")"> Population growth </h2>';
      // set the dimensions and margins of the graph
      const margin = {top: 30, right: 50, bottom: 50, left: 30};
      const graphWidth = graphDiv.offsetWidth - margin.left - margin.right;
      const graphHeight = graphDiv.offsetHeight - margin.top - margin.bottom;
    // append the svg object to the body of the page
    var svg = d3.select("#graph")
    .append("svg")
    .attr("id", "graphSVG")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
      d3.csv(`/country/${country}`).then(data => {
        let dataSelected = [];
        data.forEach((d) => {
          if (!(d.year-2000 in dataSelected)) {
            dataSelected[d.year-2000] = 0;
          }
          if(e.bounds.contains({lat: d.Y, lng: d.X})){  
            dataSelected[d.year-2000] += parseInt(d.Z) * 5;
          }
        })


      // Calculate the chart area dimensions
      const chartWidth = graphWidth - margin.left - margin.right;
      const chartHeight = graphHeight - margin.top - margin.bottom;

      // Create a scale for the x-axis
      const xScale = d3.scaleLinear()
        .domain([0, 20])
        .range([0, chartWidth]);

      // Create a scale for the y-axis
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataSelected)])
        .range([chartHeight, 0]);

      // Create a line generator
      const line = d3.line()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d));

      // Clear svg
      svg.selectAll("*").remove();

      // Create the x-axis
      svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top + chartHeight})`)
        .call(d3.axisBottom(xScale));

      // Create the y-axis
      svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(yScale));

      // Create the line path
      svg.append("path")
      .datum(dataSelected)      
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line); 

      
    // Append circles for data points
   

    // Tooltip function for displaying values
    const tooltip = d3.select("#graph")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
          .html(`Value: ${dataSelected}`)
          .style("left", `${d3.event.pageX}px`)
          .style("top", `${d3.event.pageY}px`);
      }

      var mouseout = function(d) {
        tooltip.style("opacity", 0);
      }
      svg.selectAll("circle")
      .data(dataSelected)
      .enter()
      .append("circle")      
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("cx", (d, i) => xScale(i))
      .attr("cy", (d) => yScale(d))
      .attr("r", 5)
      .attr("fill", "steelblue")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

      
      });
    });
  },
});


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
radiusButton.addEventListener(`change`, e => {
  radius = parseInt(e.target.value)
  heatmap.setOptions({ radius: parseInt(radius) });
})

btn3Dquit.addEventListener("click", function() {
  mergedMeshes.forEach(function(mergedMesh) {
    scene.remove(mergedMesh);
  });

  container.style.visibility = "hidden";
  map2.style.visibility = "visible";
  graphDiv.style.visibility = "visible";
});

// THREEJS Part
const CANVAS_WIDTH = container.offsetWidth;
const CANVAS_HEIGHT = container.offsetHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
container.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 100);

// Add lighting to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, -10, 30);
directionalLight.castShadow = true;
scene.add(directionalLight);
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.bias = -0.001;
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default

let currentYear = 2000; // Default year

btnPerspective3D.addEventListener("click", e => {
  map2.style.visibility = "hidden";
  graphDiv.style.visibility = "hidden";

  loading.style.visibility = "visible";
  loading.style.top = "50%";
  loading.style.left = "50%";
  loading.style.transform = "translate(-50%, -50%)";
  loading.style.zIndex = "1000";

  container.style.visibility = "hidden";
  container.style.zIndex = "1000";
  container.style.top = "50%";
  container.style.left = "50%";
  container.style.transform = "translate(-50%, -50%)";

  // d3.csv("/new_3D/data/swiss_all_8.csv", function(data) {
  const countryName = e.target.getAttribute("country");
  d3.csv(`/country/${countryName}`).then(data => {
    console.log(data)
    // make mean of data coordinates:
    let meanX = 0;
    let meanY = 0;
    let meanZ = 0;

    for (let i = 0; i < data.length; i++) {
      meanX += parseFloat(data[i].X);
      meanY += parseFloat(data[i].Y);
      meanZ += parseFloat(data[i].Z);
    }
    meanX /= data.length;
    meanY /= data.length;
    meanZ /= data.length;
    function updateData() {
      // Remove the existing mergedMeshes from the scene
      mergedMeshes.forEach(function(mergedMesh) {
        scene.remove(mergedMesh);
      });

      // Clear the mergedMeshes array
      mergedMeshes = [];

      // Loop through all the years to create merged geometries
      for (let year = 2000; year <= 2020; year++) {
        // Filter the data for the current year
        const filteredData = data.filter(d => parseInt(d.year) === year);

        // Create a new merged geometry for the current year's data
        const mergedGeometry = new THREE.Geometry();

        filteredData.forEach(function(d) {
          const cubeGeometry = new THREE.BoxGeometry(0.05, 0.05, Math.cbrt(d.Z / 1000));
          cubeGeometry.translate(4 * (d.X - meanX), 4 * (d.Y - meanY), Math.cbrt(d.Z / 1000) / 2);

          const color = getColorFromZ(d.Z);
          for (let i = 0; i < cubeGeometry.faces.length; i++) {
            const face = cubeGeometry.faces[i];
            face.color.set(color);
          }

          mergedGeometry.merge(cubeGeometry);
        });

        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          vertexColors: THREE.VertexColors,

          // Set opacity based on the selected year
        });

        const mergedMesh = new THREE.Mesh(mergedGeometry, material);
        mergedMesh.castShadow = true;
        mergedMesh.receiveShadow = false;
        mergedMesh.visible = (year == currentYear)
        scene.add(mergedMesh);
        mergedMeshes.push(mergedMesh);
      }

      loading.style.visibility = "hidden";
      container.style.visibility = "visible";
    }
    function updateYear(year) {
      currentYear = year;
      mergedMeshes.forEach(function(mesh,idx) {
        mesh.visible = idx+2000 == year;
      });
    }
    // Function to map the Z value to a color
    function getColorFromZ(z) {
      const minZ = 0; // Minimum Z value
      const maxZ = 1000; // Maximum Z value

      const normalizedZ = (z - minZ) / (maxZ - minZ);

      const colorMap = d3.interpolateRgb("blue", "red");
      // const colorMap = d3.interpolateRgb("white", "rgb(4, 170, 109)");
      const color = new THREE.Color(colorMap(normalizedZ));

      return color;
    }

    slider.noUiSlider.on('update', (values, handle) => {
      const year = parseInt(values[handle]);
      updateYear(year);
    });

    // Call updateData() initially to render the default year
    updateData();

    // Define variables for camera movement
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;


    // Event listener for keydown event
    document.addEventListener("keydown", function(event) {
      // Set movement variables based on key pressed
      switch (event.key) {
        case "ArrowUp":
        case "z":
          moveForward = true;
          break;
        case "ArrowDown":
        case "s":
          moveBackward = true;
          break;
        case "ArrowLeft":
        case "q":
          moveLeft = true;
          break;
        case "ArrowRight":
        case "d":
          moveRight = true;
          break;
      }
    });

    // Event listener for keyup event
    document.addEventListener("keyup", function(event) {
      // Reset movement variables when key released
      switch (event.key) {
        case "ArrowUp":
        case "z":
          moveForward = false;
          break;
        case "ArrowDown":
        case "s":
          moveBackward = false;
          break;
        case "ArrowLeft":
        case "q":
          moveLeft = false;
          break;
        case "ArrowRight":
        case "d":
          moveRight = false;
          break;
      }
    });

    // Event listener for mousedown event
    renderer.domElement.addEventListener("mousedown", function(event) {

      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    // Event listener for mouseup event
    renderer.domElement.addEventListener("mouseup", function(event) {
      mouseDown = false;
    });

    // Event listener for mousemove event
    renderer.domElement.addEventListener("mousemove", function(event) {
      if (mouseDown) {
        const rotationSpeed = 0.002; // Adjust the rotation speed as needed

        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;

        // Update camera rotation based on mouse movement
        camera.rotation.y -= deltaX * rotationSpeed;
        camera.rotation.x -= deltaY * rotationSpeed;

        mouseX = event.clientX;
        mouseY = event.clientY;
      }
    });

    // Event listener for wheel event
    container.addEventListener("wheel", function(event) {
      const zoomSpeed = 0.005; // Adjust the zoom speed as needed

      // Adjust camera position based on wheel delta
      camera.position.z += event.deltaY   * zoomSpeed;
    });


    // Function to handle camera movement
    function handleCameraMovement() {
      const moveSpeed = 0.1; // Adjust the movement speed as needed

      // Get the camera direction
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);

      // Move camera based on movement variables
      if (moveBackward) {
        camera.position.add(cameraDirection.multiplyScalar(-moveSpeed));
      }
      if (moveForward) {
        camera.position.add(cameraDirection.multiplyScalar(moveSpeed));
      }
      if (moveLeft) {
        camera.position.add(cameraDirection.cross(new THREE.Vector3(0, 1, 1)).multiplyScalar(-moveSpeed));
      }
      if (moveRight) {
        camera.position.add(cameraDirection.cross(new THREE.Vector3(0, 1, 1)).multiplyScalar(moveSpeed));
      }
    }


    // Set the camera position
    camera.position.z = 20;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.lookAt(scene.position);


    function animate() {
      requestAnimationFrame(animate);
      handleCameraMovement();

      // camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }

    animate();
  });
  // Add OrbitControls to the scene
});
