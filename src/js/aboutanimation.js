import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function createAboutAnimation() {
	let container;
	let time = 0;

	let scene;
	let camera;
	let light;
	let model;
	let renderer;
	let controls;

	function init() {
		window.addEventListener('resize', onWindowResize);
		container = document.querySelector('.aboutCanvasContainer');

		createScene();
		createCamera();
		createLight();
		loadModel();
		createRenderer();
		createControls();
	}

	function createScene() {
		scene = new THREE.Scene();
		//scene.background = new THREE.Color(0x161616);
	}

	function createCamera() {
		const fov = 40;
		const aspect = container.clientWidth / container.clientHeight;
		const near = 0.1;
		const far = 5;
		camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.set(0, 0, 3.0);
	}

	function createLight() {
		const color = 0xffffff;
		const intensity = 1.0;
		light = new THREE.AmbientLight(color, intensity);
		light.position.set(-10, 2, 4);
		scene.add(light);
	}

	function loadTexture(_url) {
		const loader = new THREE.TextureLoader();
		const url = _url;
		let texture;

		const addTexture = () => {};

		const onError = (e) => {
			console.log(e);
		};
		texture = loader.load(
			url,
			(response) => addTexture(response),
			undefined,
			onError
		);
		return texture;
	}

	function loadModel() {
		const loader = new GLTFLoader();
		const url = new URL('../models/export_me_lowPoly_glossy.glb', import.meta.url).href;
		const modelPosition = new THREE.Vector3(0, -0.1, 0);

		const addModel = (gltf, position) => {
			model = gltf.scene.children[0];
			model.position.copy(position);

			const envMap = loadTexture(new URL('../models/Photo-studio-with-umbrella.jpg', import.meta.url).href);
			envMap.mapping = THREE.EquirectangularReflectionMapping;
			envMap.encoding = THREE.sRGBEncoding;

			let mat = new THREE.MeshStandardMaterial();

			// const matMaterial = new THREE.MeshMatcapMaterial({
			// 	flatShading: true,
			// 	color: 0xffffff,
			// 	matcap: loadTexture('../images/nebula1.png'),
			// });

			model.traverse((child) => {
				if (child.material) mat.copy(child.material);
				mat.flatShading = false;
				mat.envMap = envMap;
				mat.envMapIntensity = 2.0;
				mat.metalness = 0.0;
				mat.roughness = 0.4;
				if (child.material) child.material = mat;
			});

			//model.material.copy(material);
			//console.log(model);
			scene.add(model);
		};

		const onProgress = () => {
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
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		renderer.setClearColor(0x000000, 0);

		renderer.setSize(container.clientWidth, container.clientHeight);

		renderer.setPixelRatio(window.devicePixelRatio);

		container.appendChild(renderer.domElement);
	}

	function createControls() {
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.enablePan = false;
		controls.enableZoom = false;
		controls.enableKeys = false;
		controls.minPolarAngle = Math.PI / 2;
		controls.maxPolarAngle = Math.PI / 2;
	}

	function update() {
		time += 0.001;
		const speed = 1;
		const rot = time * speed;

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
	return {play, stop, onWindowResize}
}

export { createAboutAnimation }
