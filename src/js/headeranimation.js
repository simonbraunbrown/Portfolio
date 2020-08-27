import * as THREE from './vendor/three/three.min.js';

let time = 0;

let scene;
let camera;
let light;
let mesh;
let renderer;

function init() {
  let container = document.querySelector('.canvasContainer');

  createScene();
  createCamera();
  createLight();
  createMesh();
  createRenderer();
}

function createScene() {}

function createCamera() {}

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
