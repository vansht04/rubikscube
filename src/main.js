import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 3, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

// Rubik's Cube colors (standard layout)
const materials = [
  new THREE.MeshStandardMaterial({ color: 0xff0000 }), // right (red)
  new THREE.MeshStandardMaterial({ color: 0xffa500 }), // left (orange)
  new THREE.MeshStandardMaterial({ color: 0xffffff }), // top (white)
  new THREE.MeshStandardMaterial({ color: 0xffff00 }), // bottom (yellow)
  new THREE.MeshStandardMaterial({ color: 0x00ff00 }), // front (green)
  new THREE.MeshStandardMaterial({ color: 0x0000ff }), // back (blue)
];

// Cube
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Black edges (THIS is what makes it look like a Rubik's Cube)
const edges = new THREE.EdgesGeometry(geometry);
const line = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);
cube.add(line);

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
animate();

// Resize fix
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});