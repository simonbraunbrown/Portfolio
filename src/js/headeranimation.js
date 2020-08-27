import * as THREE from './vendor/three/three.module.js';

let container;
let time = 0;

let scene;
let camera;
let light;
let mesh;
let renderer;

function init() {
  window.addEventListener('resize', onWindowResize);
  container = document.querySelector('.canvasContainer');

  createScene();
  createCamera();
  createLight();
  createMesh();
  createRenderer();
}

function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x161616);
}

function createCamera() {
  const fov = 75;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 5;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
}

function createLight() {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

function createMesh() {
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshStandardMaterial({ color: 0xd6d6d6 });

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  scene.add(mesh);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);
}

function update() {
  time += 0.001;
  const speed = 1;
  const rot = time * speed;

  mesh.rotation.x = rot;
  mesh.rotation.y = rot;
}

function render() {
  renderer.render(scene, camera);
}

function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function stop() {
  renderer.setAnimationLoop(null);
}

function onWindowResize() {
  
}

init();
play();
