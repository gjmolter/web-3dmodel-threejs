// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// To load the .hdr file
import { RGBELoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js";


//import cubem


// Constants
const CAMERA_FOV = 30;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 10000;
const RENDERER_ALPHA = true;
const LIGHT_COLOR = 0xffffff;
const LIGHT_INTENSITY = -1.9; // Increased light intensity
const AMBIENT_LIGHT_COLOR = 0xffffff;
const AMBIENT_LIGHT_INTENSITY = 1.6; // Increased ambient light intensity

// Create a Three.JS Scene
const scene = new THREE.Scene();

// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR);

// Keep track of the mouse position, so we can make the rover move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;



// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Set which object folder to render
let objToRender = 'my_glb_model';

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the rover model and place it on top of the ground plane
loader.load(
  `models/${objToRender}/moon.glb`,
  function (gltf) {
    object = gltf.scene;
    object.scale.set(1000, 1000, 1100);
    object.position.set(0,140,0); // position the rover on top of the ground plane
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);



// // Add an infinite ground plane to the scene
// const groundPlaneGeometry = new THREE.PlaneGeometry(10000, 10000); // large size to create an infinite ground plane
// const groundPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 }); // gray color
// const groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
// groundPlane.rotation.x = -Math.PI / 2; // rotate the plane to face upwards
// groundPlane.position.y = -30; // position the plane lower to create a sense of depth
// scene.add(groundPlane);



// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
const container = document.getElementById("container3D");
if (container) {
  container.appendChild(renderer.domElement);
} else {
  console.error("Container element not found");
}

// Set how far the camera will be from the 3D model
camera.position.z = objToRender === "my_glb_model" ? 5000 : 5000; // Increased camera distance

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY); // (color, intensity)
topLight.position.set(200, 200, 200) // top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY);
scene.add(ambientLight);



// Create OrbitControls to allow the camera to move around the scene
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping to prevent camera from moving too fast
controls.dampingFactor = 0.1; // Adjust damping factor to your liking
controls.minDistance = 800; // minimum distance from the model
controls.maxDistance = 5000; // maximum distance from the model

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});
window.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // WASD movement
  const speed = 200; // Adjust speed as necessary
  if (keys['w']) camera.position.z -= speed * 0.1;
  if (keys['s']) camera.position.z += speed * 0.1;
  if (keys['a']) camera.position.x -= speed * 0.1;
  if (keys['d']) camera.position.x += speed * 0.1;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Add event listeners for window resize and mouse move
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// function onMouseMove(event) {
//   mouseX = event.clientX;
//   mouseY = event.clientY;
// }