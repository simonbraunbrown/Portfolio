let container;
let time = 0;

let scene;
let camera;
let light;
let mesh;
let model;
let renderer;
let controls;

function init() {
  window.addEventListener('resize', onWindowResize);
  container = document.querySelector('.canvasContainer');

  createScene();
  createCamera();
  createLight();
  createMesh();
  loadModel();
  createRenderer();
  createControls();
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
  camera.position.set(0, 0, 1.5);
}

function createLight() {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-10, 2, 4);
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
  //scene.add(mesh);
}

function loadModel() {
  const loader = new THREE.GLTFLoader();
  const url = '../models/me_lowPoly.glb';
  const modelPosition = new THREE.Vector3(0, 0, 0);

  const addModel = (gltf, position) => {
    console.log(gltf);
    model = gltf.scene.children[0];
    model.position.copy(position);

    const material = new THREE.MeshStandardMaterial({
      color: 0xd6d6d6,
      flatShading: true,
      roughness: 0.35,
      metalness: 1.0
    });

    model.material.copy(material);

    scene.add(model);
    play();
  };

  const onProgress = (progress) => {
    //console.log(progress);
  };

  const onError = (e) => {
    console.log(e);
  };

  loader.load(
    url,
    (response) => addModel(response, modelPosition),
    onProgress,
    onError
  );
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableKeys = false;
  controls.minPolarAngle = Math.PI/2;
  controls.maxPolarAngle = Math.PI/2;

}

function update() { 
  time += 0.001;
  const speed = 1;
  const rot = time * speed;

  mesh.rotation.x = rot;
  mesh.rotation.y = rot;
  model.rotation.y = rot;

  controls.update(); 
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
  camera.aspect = container.clientWidth / container.clientHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

init();
