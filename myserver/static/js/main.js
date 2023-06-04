const loading = document.getElementById("loading");
const btnPerspective3D = document.getElementById("Perspective_3d");
const btn3Dquit = document.getElementById("3D-quit");
const map2 = document.getElementById("map");

// const container = document.getElementById("canvas");


const container = document.getElementById( 'canvas' );
document.body.appendChild( container );

const CANVAS_WIDTH = container.offsetWidth;
const CANVAS_HEIGHT = container.offsetHeight;
console.log(CANVAS_WIDTH, CANVAS_HEIGHT)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
container.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 100);
// camera.position.set(-10, -10, 100);
// camera.lookAt(scene.position);
// scene.add(camera);

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
// container.appendChild(renderer.domElement);
// document.body.appendChild(renderer.domElement);

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

// Load the CSV data using d3.csv
btnPerspective3D.addEventListener("click", e => {
  map2.style.visibility = "hidden";

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
    let mergedMeshes = []; // Declare an array to store all merged meshes
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
          cubeGeometry.translate(4 * (d.X - 8), 4 * (d.Y - 47), Math.cbrt(d.Z / 1000) / 2);

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
        console.log(mergedMeshes);
      }

      loading.style.visibility = "hidden";
      container.style.visibility = "visible";
    }
    function updateYear(year) {
      currentYear = year;
      mergedMeshes.forEach(function(mesh,idx) {
        mesh.visible = idx+2000 == year;
        console.log(mesh.visible);
      });
    }
    // Function to map the Z value to a color
    function getColorFromZ(z) {
      const minZ = 0; // Minimum Z value
      const maxZ = 1000; // Maximum Z value

      const normalizedZ = (z - minZ) / (maxZ - minZ);

      const colorMap = d3.interpolateRgb("blue", "red");
      const color = new THREE.Color(colorMap(normalizedZ));

      return color;
    }

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

    // Update the aspect ratio when the window is resized
    // window.addEventListener("resize", function() {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(window.innerWidth, window.innerHeight);
    // });

    // Add the event listener to the slider
    const yearSlider = document.getElementById("year-slider");
    yearSlider.addEventListener("input", function() {
      year = parseInt(yearSlider.value);
      updateYear(year);
    });
  });
});

btn3Dquit.addEventListener("click", function() {
  container.style.visibility = "hidden";
  map2.style.visibility = "visible";
});