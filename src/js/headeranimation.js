(function headerAnimation() {
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
		//scene.background = new THREE.Color(0x161616);
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
		const color = 0x404040;
		const intensity = 1.0;
		light = new THREE.AmbientLight(color, intensity);
		//light.position.set(-10, 2, 4);
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

	function loadTexture(_url) {
		const loader = new THREE.TextureLoader();
		const url = _url;
		let texture;

		const addTexture = (res) => {};

		const onError = (e) => {
			console.log(e);
		};
		texture = loader.load(
			url,
			(response) => addTexture(response),
			undefined,
			onError
		);
		console.log(texture);
		return texture;
	}

	function loadModel() {
		const loader = new THREE.GLTFLoader();
		const url = '../models/me_lowPoly_matcap.glb';
		const modelPosition = new THREE.Vector3(0, 0, 0);

		const addModel = (gltf, position) => {
			model = gltf.scene.children[0];
			model.position.copy(position);

			const envMap = loadTexture('../models/Warehouse-with-lights.jpg');
			envMap.mapping = THREE.EquirectangularReflectionMapping;
			envMap.encoding = THREE.sRGBEncoding;

			const material = new THREE.MeshStandardMaterial({
				color: 0x161616,
				flatShading: true,
				roughness: 0.05,
				metalness: 1.0,
				envMap: envMap,
				envMapIntensity: 1.5,
				morphNormals: true,
				opacity: 1.0,
			});

			const matMaterial = new THREE.MeshMatcapMaterial({
				color: 0xffffff,
				matcap: loadTexture('../images/YouTubeHistory_all_small.png'),
			});

			model.traverse((child) => {
				if (child.material) child.material = matMaterial;
			});

			//model.material.copy(material);
			console.log(model);
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
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		renderer.setClearColor(0x000000, 0);

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
		controls.minPolarAngle = Math.PI / 2;
		controls.maxPolarAngle = Math.PI / 2;
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
})();
