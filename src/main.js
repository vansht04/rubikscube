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
camera.position.set(4, 4, 4);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
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

// Rubik's colors
const colors = {
  right: 0xff0000,   // red
  left: 0xffa500,    // orange
  top: 0xffffff,     // white
  bottom: 0xffff00,  // yellow
  front: 0x00ff00,   // green
  back: 0x0000ff     // blue
};

// Cubie size + spacing
const size = 0.95;

// Group for whole cube
const rubiksCube = new THREE.Group();
scene.add(rubiksCube);

// Create 27 cubies (3x3x3)
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {

      const materials = [
        new THREE.MeshStandardMaterial({ color: x === 1 ? colors.right : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: x === -1 ? colors.left : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: y === 1 ? colors.top : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: y === -1 ? colors.bottom : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: z === 1 ? colors.front : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: z === -1 ? colors.back : 0x111111 }),
      ];

      const cubie = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        materials
      );

      cubie.position.set(x, y, z);

      rubiksCube.add(cubie);

      // black edges for each cubie
      const edges = new THREE.EdgesGeometry(cubie.geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );

      cubie.add(line);
    }
  }
}

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});