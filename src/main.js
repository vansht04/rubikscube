import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

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

// Cube group (IMPORTANT)
const cube = new THREE.Group();
scene.add(cube);

// Store cubies
const cubies = [];

// Create 27 cubies
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {

      const colors = [
        new THREE.MeshStandardMaterial({ color: x === 1 ? 0xff0000 : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: x === -1 ? 0xffa500 : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: y === 1 ? 0xffffff : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: y === -1 ? 0xffff00 : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: z === 1 ? 0x00ff00 : 0x111111 }),
        new THREE.MeshStandardMaterial({ color: z === -1 ? 0x0000ff : 0x111111 }),
      ];

      const cubie = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.95, 0.95),
        colors
      );

      cubie.position.set(x, y, z);

      cube.add(cubie);
      cubies.push(cubie);

      const edges = new THREE.EdgesGeometry(cubie.geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      cubie.add(line);
    }
  }
}

// Face selection helper
function getFace(axis, value) {
  return cubies.filter(c => Math.round(c.position[axis]) === value);
}

// Rotate a face
function rotateFace(axis, value, angle) {
  const face = getFace(axis, value);

  const temp = new THREE.Group();
  cube.add(temp);

  face.forEach(c => temp.attach(c));

  gsap.to(temp.rotation, {
    [axis]: temp.rotation[axis] + angle,
    duration: 0.4,
    onComplete: () => {
      face.forEach(c => cube.attach(c));
      temp.rotation.set(0, 0, 0);
      cube.remove(temp);
    }
  });
}

// Controls (keyboard moves)
window.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {

    case "r":
      rotateFace("x", 1, Math.PI / 2);
      break;

    case "l":
      rotateFace("x", -1, -Math.PI / 2);
      break;

    case "u":
      rotateFace("y", 1, Math.PI / 2);
      break;

    case "d":
      rotateFace("y", -1, -Math.PI / 2);
      break;

    case "f":
      rotateFace("z", 1, Math.PI / 2);
      break;

    case "b":
      rotateFace("z", -1, Math.PI / 2);
      break;
  }
});

// Scramble
function scramble() {
  const moves = ["r","l","u","d","f","b"];

  for (let i = 0; i < 15; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    window.dispatchEvent(new KeyboardEvent("keydown", { key: move }));
  }
}

// Press S to scramble
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "s") {
    scramble();
  }
});

// Animate
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