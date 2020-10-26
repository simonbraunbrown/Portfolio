(function headerAnimation() {
	let container;
	container = document.querySelector('.headerCanvasContainer');
	window.addEventListener('resize', onWindowResize);
	let rad = 0.0;
	const increment = 0.0005;

	let scene;
	let camera;
	let object;
	let renderer;

	let image = loadTexture('../images/nebula1.png');
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

	const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

	const fragment = `
varying vec2 vUv;
uniform float dispFactor;
uniform float dpr;
uniform sampler2D tex;
uniform float angle1;
uniform float angle2;
uniform float intensity1;
uniform float intensity2;
uniform vec4 res;
uniform vec2 container;

mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec4 disp = texture2D(tex, vUv);
  vec2 dispVec = vec2(disp.r, disp.g);
  vec2 uv = 0.5 * gl_FragCoord.xy / (res.xy) ;
  vec2 myUV = (uv - vec2(0.5)) * res.zw + vec2(0.5);
  vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;
  vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
  vec4 _texture1 = texture2D(tex, distortedPosition1);
  vec4 _texture2 = texture2D(tex, distortedPosition2);
  gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
`;

	function init() {
		createScene();
		createCamera();
		createMesh();
		createRenderer();
	}

	function createScene() {
		scene = new THREE.Scene();
	}

	function createCamera() {
		camera = new THREE.OrthographicCamera(
			container.offsetWidth / -2,
			container.offsetWidth / 2,
			container.offsetHeight / 2,
			container.offsetHeight / -2,
			1,
			1000
		);

		camera.position.z = 1.0;
	}

	function createMesh() {
		let texture = image;

		texture.magFilter = texture.magFilter = THREE.LinearFilter;

		var mat = new THREE.ShaderMaterial({
			uniforms: {
				intensity1: {
					type: 'f',
					value: intensity1,
				},
				intensity2: {
					type: 'f',
					value: intensity2,
				},
				dispFactor: {
					type: 'f',
					value: 1.0,
				},
				angle1: {
					type: 'f',
					value: angle1,
				},
				angle2: {
					type: 'f',
					value: angle2,
				},
				tex: {
					type: 't',
					value: texture,
				},
				res: {
					type: 'vec4',
					value: new THREE.Vector4(
						container.offsetWidth,
						container.offsetHeight,
						a1,
						a2
					),
				},
				dpr: {
					type: 'f',
					value: window.devicePixelRatio,
				},
			},

			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
			opacity: 1.0,
		});

		const geometry = new THREE.PlaneBufferGeometry(
			container.offsetWidth,
			container.offsetHeight,
			1
		);
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
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		renderer.setPixelRatio(2.0);

		renderer.setClearColor(0x000000, 0);

		renderer.setSize(container.clientWidth, container.clientHeight);

		renderer.setPixelRatio(window.devicePixelRatio);

		container.appendChild(renderer.domElement);
	}

	function update() {
		object.material.uniforms.dispFactor.value =
			Math.sin(rad * Math.PI) * 0.25 + 0.5;
		rad += increment;
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
		if (container.offsetHeight / container.offsetWidth < imageAspect) {
			a1 = 1;
			a2 = container.offsetHeight / container.offsetWidth / imageAspect;
		} else {
			a1 = (container.offsetWidth / container.offsetHeight) * imageAspect;
			a2 = 1;
		}
		object.material.uniforms.res.value = new THREE.Vector4(
			container.offsetWidth,
			container.offsetHeight,
			a1,
			a2
		);
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	}

	init();
	render();
	play();
})();
