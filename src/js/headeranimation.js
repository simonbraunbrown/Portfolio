import * as THREE from './vendor/three/three.min.js';

let time = 0;

let scene;
let camera;
let light;
let mesh;
let renderer;

function init() {
  window.addEventListener('resize', onWindowResize);
  let container = document.querySelector('.canvasContainer');

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

function createLight() {}

function createMesh() {}

function createRenderer() {}

function update() {}

function render() {}

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
  console.log('resize');
}

init();
