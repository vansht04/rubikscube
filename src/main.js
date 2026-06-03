import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// ---------------- SCENE ----------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 4, 4);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

// ---------------- CUBE ROOT ----------------
const cube = new THREE.Group();
scene.add(cube);

// ---------------- STATE ----------------
const cubies = [];
let isAnimating = false;

// ---------------- CREATE CUBIES ----------------
function createCubies() {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {

        const materials = [
          new THREE.MeshStandardMaterial({ color: x === 1 ? 0xff0000 : 0x111111 }),
          new THREE.MeshStandardMaterial({ color: x === -1 ? 0xffa500 : 0x111111 }),
          new THREE.MeshStandardMaterial({ color: y === 1 ? 0xffffff : 0x111111 }),
          new THREE.MeshStandardMaterial({ color: y === -1 ? 0xffff00 : 0x111111 }),
          new THREE.MeshStandardMaterial({ color: z === 1 ? 0x00ff00 : 0x111111 }),
          new THREE.MeshStandardMaterial({ color: z === -1 ? 0x0000ff : 0x111111 }),
        ];

        const cubie = new THREE.Mesh(
          new THREE.BoxGeometry(0.95, 0.95, 0.95),
          materials
        );

        cubie.position.set(x, y, z);

        cube.add(cubie);
        cubies.push(cubie);

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(cubie.geometry),
          new THREE.LineBasicMaterial({ color: 0x000000 })
        );

        cubie.add(edges);
      }
    }
  }
}

createCubies();

// ---------------- SNAP FUNCTION (IMPORTANT FIX) ----------------
function snap(n) {
  return Math.round(n);
}

// ---------------- GET FACE ----------------
function getFace(axis, value) {
  return cubies.filter(c => snap(c.position[axis]) === value);
}

// ---------------- ROTATE FACE (FIXED + LOCKED) ----------------
function rotateFace(axis, value, angle) {
  if (isAnimating) return;
  isAnimating = true;

  const face = getFace(axis, value);

  const temp = new THREE.Group();
  cube.add(temp);

  face.forEach(c => temp.attach(c));

  gsap.to(temp.rotation, {
    [axis]: temp.rotation[axis] + angle,
    duration: 0.25,
    ease: "power2.inOut",
    onComplete: () => {

      // reattach to main cube
      face.forEach(c => cube.attach(c));

      cube.remove(temp);

      // ---------------- SNAP POSITION + ROTATION FIX ----------------
      cubies.forEach(c => {
        c.position.set(
          snap(c.position.x),
          snap(c.position.y),
          snap(c.position.z)
        );

        c.rotation.set(
          Math.round(c.rotation.x / (Math.PI / 2)) * (Math.PI / 2),
          Math.round(c.rotation.y / (Math.PI / 2)) * (Math.PI / 2),
          Math.round(c.rotation.z / (Math.PI / 2)) * (Math.PI / 2)
        );
      });

      isAnimating = false;
    }
  });
}

// ---------------- CONTROLS ----------------
window.addEventListener("keydown", (e) => {
  if (isAnimating) return;

  switch (e.key.toLowerCase()) {
    case "r": rotateFace("x", 1, Math.PI / 2); break;
    case "l": rotateFace("x", -1, -Math.PI / 2); break;
    case "u": rotateFace("y", 1, Math.PI / 2); break;
    case "d": rotateFace("y", -1, -Math.PI / 2); break;
    case "f": rotateFace("z", 1, Math.PI / 2); break;
    case "b": rotateFace("z", -1, -Math.PI / 2); break;
  }
});

// ---------------- SCRAMBLE ----------------
function scramble() {
  const moves = [
    () => rotateFace("x", 1, Math.PI / 2),
    () => rotateFace("x", -1, Math.PI / 2),
    () => rotateFace("y", 1, Math.PI / 2),
    () => rotateFace("y", -1, Math.PI / 2),
    () => rotateFace("z", 1, Math.PI / 2),
    () => rotateFace("z", -1, Math.PI / 2),
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i++ > 15) return clearInterval(interval);
    moves[Math.floor(Math.random() * moves.length)]();
  }, 300);
}

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "s") scramble();
});

// ---------------- SOLVE (INSTANT RESET) ----------------
function solve() {
  cubies.forEach(c => {
    c.position.set(
      snap(c.position.x),
      snap(c.position.y),
      snap(c.position.z)
    );

    c.rotation.set(0, 0, 0);
  });
}

// PRESS P TO SOLVE
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "p") solve();
});

// ---------------- ANIMATE ----------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// ---------------- RESIZE ----------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});