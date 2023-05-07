// create a Leaflet map with a ThreeJS layer
const map = L.map('map').setView([51.505, -0.09], 13);
const threeLayer = L.threejs().addTo(map);

// create a ThreeJS camera with a 60 degree pitch
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 400);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// set the ThreeJS layer's camera to the new camera
threeLayer.getThreejsScene().add(camera);
threeLayer.getThreejsCamera().copy(camera);
threeLayer.getThreejsRenderer().render(threeLayer.getThreejsScene(), camera);

// create a ThreeJS mesh to represent the terrain
const geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
threeLayer.addTHREEObject(mesh);