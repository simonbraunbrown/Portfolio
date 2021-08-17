(function headerAnimation() {
	let container;
	container = document.querySelector('.headerCanvasContainer');
	window.addEventListener('resize', onWindowResize);
	window.addEventListener( 'pointermove', onPointerMove, false );
	let rad = 0.0;
	const increment = 0.0005;
	let mouseX = 0.0;
	let mouseY = 0.0;

	let scene;
	let camera;
	let object;
	let renderer;
	let composer;

	const bloomParams = {
		bloomExposure: 1,
		bloomStrength: 0.2,
		bloomThreshold: 0.3,
		bloomRadius: 0
	};

	const images = projects.filter(project => project.type === 'image');
	let image1 = loadTexture(images[Math.floor(Math.random() * images.length)].src);
	let image2 = loadTexture(images[Math.floor(Math.random() * images.length)].src);
	let dispImage = loadTexture('../images/nebula1.png');
	
	let imagesRatio = 1.0;
	let intensity1 = 1.0;
	let intensity2 = 1.0;
	let commonAngle = Math.PI / 4;
	let angle1 = commonAngle;
	let angle2 = -commonAngle * 3;

	let a1, a2;
	let imageAspect = imagesRatio;
	if (container.offsetHeight / container.offsetWidth < imageAspect) {
		a1 = 1;
		a2 = container.offsetHeight / container.offsetWidth / imageAspect;
	} else {
		a1 = (container.offsetWidth / container.offsetHeight) * imageAspect;
		a2 = 1;
	}

	function init() {
		createScene();
		createCamera();
		createMesh();
		createRenderer();
		createCompositor();
	}

	function createScene() {
		scene = new THREE.Scene();
	}

	function createCamera() {
		const fov = 40;
		const aspect = container.clientWidth / container.clientHeight;
		const near = 0.1;
		const far = 50;
		camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.set(0, 0, 10.0);

	}

	function createMesh() {
		let texture1 = image1;
		let texture2 = image2;
		let texture3 = dispImage;

		//texture1.magFilter = texture2.magFilter = THREE.LinearFilter;
		//texture1.minFilter = texture2.minFilter = THREE.LinearFilter;
		texture3.minFilter = texture3.minFilter = THREE.LinearFilter;

		
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );

		const mat = new THREE.MeshBasicMaterial({ color: 0xd6d6d6 });

		object = new THREE.Mesh(geometry, mat);
		scene.add(object);
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
		return texture;
	}

	function createRenderer() {
		renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });

		renderer.setPixelRatio(container.clientWidth / container.clientHeight);

		renderer.setClearColor(0x000000, 0);

		renderer.setSize(container.clientWidth, container.clientHeight);

		container.appendChild(renderer.domElement);
	}

	function createCompositor() {
		const renderScene = new THREE.RenderPass( scene, camera );

		const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( container.clientWidth, container.clientHeight ), 1.5, 0.4, 0.85 );
		bloomPass.exposure = bloomParams.bloomExposure;
		bloomPass.threshold = bloomParams.bloomThreshold;
		bloomPass.strength = bloomParams.bloomStrength;
		bloomPass.radius = bloomParams.bloomRadius;

		composer = new THREE.EffectComposer( renderer );
		composer.addPass( renderScene );
		composer.addPass( bloomPass );
	}

	function update() {
		camera.position.x = ( mouseX - camera.position.x ) * 0.005;
		camera.position.y = ( - ( mouseY ) - camera.position.y ) * 0.005;
	}

	function render() {
		renderer.render(scene, camera);
		//composer.render();
	}

	function play() {
		update();
		render();
	}

	function stop() {
		renderer.setAnimationLoop(null);
	}

	function onWindowResize() {
		if (container.offsetHeight / container.offsetWidth < imageAspect) {
			a1 = 1;
			a2 = container.offsetHeight / container.offsetWidth / imageAspect;
		} else {
			a1 = (container.offsetWidth / container.offsetHeight) * imageAspect;
			a2 = 1;
		}

		renderer.setSize(container.offsetWidth, container.offsetHeight);
		composer.setSize(container.offsetWidth, container.offsetHeight);
	}

	function onPointerMove( event ) {

		if ( event.isPrimary === false ) return;

		mouseX = (event.clientX - window.innerWidth * 0.5);
		mouseY = (event.clientY - window.innerHeight * 0.5);

	}
	init();
	window.headerAnimationPlay = play;
	window.headerAnimationStop = stop;
})();
