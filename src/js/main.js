const progressBarWrappers = document.querySelectorAll('.progressBarWrapper');
const progressCount = document.querySelector('.progress');
const navigation = document.querySelector('.navigationWrapper');
const overlayWrapper = document.querySelector('.overlayWrapper');
const closeButtons = overlayWrapper.querySelectorAll('.closeButton');
let previousScrollY = 0;
let windowHeight = window.innerHeight;
let loaded = false;
let frameCounter = 0;
let headerAnimationPlaying = false;
let visibleElement;

let s, i, m, b, r, d, x, y, z;

document.addEventListener('DOMContentLoaded', function (event) {
	s = document.body.querySelector('.s');
	i = document.body.querySelector('.i');
	m = document.body.querySelector('.m');
	b = document.body.querySelector('.b');
	r = document.body.querySelector('.r');
	d = document.body.querySelector('.d');
	x = document.body.querySelector('.x');
	y = document.body.querySelector('.y');
	z = document.body.querySelector('.z');
	console.log('DOM fully loaded');
	loaded = true;
	checkBrowserSupport();
	//checkBrowserWidth();
	createPanels();
	drawAnimation();
	toggleOnScroll();
});

window.addEventListener('resize', function (event) {
	//checkBrowserWidth();
	if (loaded) {
		windowHeight = window.innerHeight;
	}
	toggleOnScroll();

});

function drawAnimation() {
	requestAnimationFrame(drawAnimation);
	if (headerAnimationPlaying) { window.headerAnimationPlay(); }
	frameCounter += 1;
	if (frameCounter % 3 !== 0 && !hasScrolled()) return;
	makeProgress();
	if (visibleElement) translate(visibleElement);
}

function createPanels() {
	const panelContainer = document.querySelector('.panelContainer');
	let panelContainerContent = [];
	let projectCount = projects.filter((project) => project.type !== 'text')
		.length;
	let projectLoaded = 0;

	function loadProgress() {
		const progressBar = document.querySelector('.loadProgress');
		const progress = projectLoaded / projectCount;
		progressBar.style.width = progress * 100 + '%';
		if (progress === 1) {
			const loadingOverlay = document.querySelector('.loadingOverlay');
			fadeOut(loadingOverlay);
		}
	}

	projects.forEach((project) => {
		let panelContent;
		if (project.type === 'text') {
			project.isMedia = false;
			panelContent = createTextPanel(project);
		} else if (project.type === 'image') {
			project.isMedia = true;
			panelContent = createImagePanel(project);
		} else if (project.type === 'video') {
			project.isMedia = true;
			panelContent = createVideoPanel(project);
		}
		panelContainerContent.push(panelContent);
	});
	appendElements(panelContainer, panelContainerContent);

	function createTextPanel(project) {
		const panelWrapper = createElementWithClassname('div', ['panelWrapper', 'panelWrapper--headline']);
		panelWrapper.project = project;
		const panel = createElementWithClassname('div', ['panel']);
		const info = createElementWithClassname('span', ['info', 'info--headline']);
		info.innerHTML = project.description;
		info.setAttribute('data-text', project.description);
		panel.appendChild(info);
		panelWrapper.appendChild(panel);
		return panelWrapper;
	}

	function createImagePanel(project) {
		const panelWrapper = createElementWithClassname('div', ['panelWrapper']);
		panelWrapper.project = project;
		const panel = createElementWithClassname('div', ['panel']);
		const filenameWrapper = createElementWithClassname('div', [
			'filenameWrapper',
		]);
		const filename = createElementWithClassname('span', ['filename']);
		const imageWrapper = createElementWithClassname('div', [
			'imageWrapper',
			'--hidden',
		]);
		const image = createElementWithClassname('img', ['image']);
		const info = createElementWithClassname('span', ['info']);
		filename.innerHTML = project.name;
		filenameWrapper.appendChild(filename);
		image.addEventListener('load', function () {
			projectLoaded += 1;
			loadProgress();
		});
		image.setAttribute('src', project.src);
		imageWrapper.appendChild(image);
		info.innerHTML = project.description;
		info.setAttribute('data-text', project.description);
		appendElements(panel, [imageWrapper, info]);
		appendElements(panelWrapper, [panel, filenameWrapper]);
		panelWrapper.addEventListener('click', () => {
			const panelWrappers = document.querySelectorAll('.panelWrappers');
			if (!panelWrapper.classList.contains('panelWrapper--expand')) {
				squeezeAll(panelWrappers);
				expand(panelWrapper);
			} else {
				squeezeIt(panelWrapper);
			}
		});
		return panelWrapper;
	}

	function createVideoPanel(project) {
		const panelWrapper = createElementWithClassname('div', ['panelWrapper']);
		panelWrapper.project = project;
		const panel = createElementWithClassname('div', ['panel']);
		const filenameWrapper = createElementWithClassname('div', [
			'filenameWrapper',
		]);
		const filename = createElementWithClassname('span', ['filename']);
		const imageWrapper = createElementWithClassname('div', [
			'imageWrapper',
			'--hidden',
		]);
		const video = createElementWithClassname('video', [
			'image',
			'image--video',
		]);
		filename.innerHTML = project.name;
		filenameWrapper.appendChild(filename);
		video.setAttribute('preload', 'metadata');
		video.setAttribute('playsinline', '');
		video.setAttribute('autoplay', '');
		video.setAttribute('muted', '');
		video.setAttribute('loop', '');
		video.pause();
		video.addEventListener('canplaythrough', function () {
			projectLoaded += 1;
			loadProgress();
		});
		const source = document.createElement('source');
		source.setAttribute('src', project.src);
		video.appendChild(source);
		imageWrapper.appendChild(video);
		const info = createElementWithClassname('span', ['info']);
		info.innerHTML = project.description;
		info.setAttribute('data-text', project.description);
		appendElements(panel, [imageWrapper, info]);
		appendElements(panelWrapper, [panel, filenameWrapper]);
		panelWrapper.addEventListener('click', () => {
			const panelWrappers = document.querySelectorAll('.panelWrappers');
			if (!panelWrapper.classList.contains('panelWrapper--expand')) {
				squeezeAll(panelWrappers);
				expand(panelWrapper);
				video.play();
			} else {
				squeezeIt(panelWrapper);
				video.pause();
			}
		});
		return panelWrapper;
	}

	function createElementWithClassname(type, className) {
		const element = document.createElement(type);
		className.forEach((name) => {
			element.classList.add(name);
		});
		return element;
	}

	function appendElements(parent, childsToAppend) {
		childsToAppend.forEach((child) => {
			parent.appendChild(child);
		});
		return parent;
	}
}

navigation.querySelectorAll('.navigationItem').forEach((item) => {
	item.addEventListener('click', function (event) {
		const overlay = overlayWrapper.querySelector(
			'.overlay--' + item.dataset.className
		);
		const isVisible = overlay.classList.contains('overlay--visible');

		if (isVisible) {
			overlay.classList.remove('overlay--visible');
			window.aboutAnimationStop();
		} else {
			overlayWrapper.querySelectorAll('.overlay--visible').forEach((item) => {
				item.classList.remove('overlay--visible');
			});
			overlay.classList.add('overlay--visible');
			// setTimeout(() => {
			// 	window.aboutAnimationResize();
			// 	window.aboutAnimationPlay();
			// },300);
			overlay.addEventListener(
				'transitionend',
				function () {
					window.aboutAnimationResize();
					window.aboutAnimationPlay();
				},
				{
					capture: false,
					once: true,
					passive: false,
				}
			);
		}
		// const overlay = overlayWrapper.querySelector('.overlay--'+ item.dataset.className);
		// overlayWrapper.querySelectorAll('.overlay').forEach(item => {
		//   item.classList[overlay === item ? 'toggle' : 'remove']('overlay--visible');
		// });
	});
});

closeButtons.forEach((button) => {
	button.addEventListener('click', function (event) {
		const overlay = overlayWrapper.querySelector('.overlay--visible');
		overlay.classList.remove('overlay--visible');
		window.aboutAnimationStop();
	});
});

function hasScrolled() {
	let redraw = previousScrollY !== window.scrollY;
	previousScrollY = window.scrollY;
	return redraw;
}

function makeProgress() {
	const bodyRect = document.body.getBoundingClientRect();
	const progress =
		((window.scrollY + window.innerHeight) / bodyRect.height) * 100;

	progressBarWrappers.forEach((wrapper) => {
		const progressBar = wrapper.querySelector('.progressBar');
		if (
			wrapper.classList.contains('progressBarWrapper--left') ||
			wrapper.classList.contains('progressBarWrapper--right')
		) {
			progressBar.style.height = progress + '%';
		} else {
			progressBar.style.width = progress + '%';
		}
	});
	progressCount.innerHTML = Math.round(progress) + '%';
	progressBarWrappers.forEach((progressBarWrapper) => {
		progressBarWrapper.classList.toggle(
			'progressBarWrapper--visible',
			window.scrollY > windowHeight
		);
	});

	if (window.scrollY > windowHeight) {
		headerAnimationPlaying = false;
	}
	else {
		headerAnimationPlaying = true;
		translateHeadline();
	}
}

function toggleOnScroll() {
	const panelWrappers = document.querySelectorAll('.panelWrapper');
	const options = {
		root: null,
		threshold: [0.0, 0.75, 0.85, 1.0],
		rootMargin: '0%'
	};
	const observer = new IntersectionObserver(handleIntersect, options);

	panelWrappers.forEach(panelWrapper => {
		observer.observe(panelWrapper);
	});
}

function handleIntersect(entries, observer) {
	entries.forEach(entry => {
		const imageWrapper = entry.target.querySelector('.imageWrapper');
		if (entry.intersectionRatio > 0.75) {
			entry.target.classList.add('panelWrapper--showInfo');
			if (imageWrapper) {
				visibleElement = entry.target;
				if (entry.intersectionRatio > 0.85) {
					fadeIn(imageWrapper);
				}
			}
		} else {
			entry.target.classList.remove('panelWrapper--showInfo');
			if (imageWrapper && entry.intersectionRatio < 0.85) {
				fadeOut(imageWrapper);
			}
		}
	});
}

function translateHeadline() {
	const slowScroll = Math.floor(window.scrollY / 4);
	const t = Math.pow(1 - window.scrollY / window.innerHeight, 2);

	s.style.transform = `translate(-${slowScroll}%, ${slowScroll}%) scale(${1 + slowScroll * 0.01})`;
	i.style.transform = `translate(0, -${slowScroll * 0.1}%) scaleY(${1 + slowScroll * 0.05}) `;
	m.style.transform = `scale(${1 + slowScroll * 0.005}) translate(${slowScroll}%, ${slowScroll}%)`;
	b.style.transform = `translate(0, -${slowScroll * 2}%)`;
	r.style.transform = `scale(${1 + slowScroll * 0.01}) translate(${slowScroll}%, -${slowScroll}%)`;
	d.style.transform = `scaleX(${1 + slowScroll * 0.1})`;
	x.style.transform = `translate(${slowScroll * 3}%, -${slowScroll * 3}%)`;
	y.style.transform = `translate(-${slowScroll}%, -${slowScroll * 0.5}%) scale(${1 + slowScroll * -0.001})`;
	z.style.transform = `translate(${slowScroll}%, ${slowScroll}%) scale(${1 + slowScroll * 0.02})`;

	s.style.opacity = `${t}`;
	i.style.opacity = `${t}`;
	m.style.opacity = `${t}`;
	b.style.opacity = `${t}`;
	r.style.opacity = `${t}`;
	d.style.opacity = `${t}`;
	x.style.opacity = `${t}`;
	y.style.opacity = `${t}`;
	z.style.opacity = `${t}`;
}

function fadeIn(element) {
	if (!element.classList.contains('--hidden')) return;
	if (element.classList.contains('--fadingOut')) return;
	element.classList.remove('--hidden');
	element.classList.add('--fadingIn');
	setTimeout(function () { element.classList.remove('--fadingIn'); }, 300);
}

function fadeOut(element) {
	if (element.classList.contains('--hidden')) return;
	if (element.classList.contains('--fadingIn')) return;
	element.classList.add('--fadingOut');
	setTimeout(function () {
		element.classList.remove('--fadingOut');
		element.classList.add('--hidden');
	}, 300);

	element.addEventListener('transitionend', function () {
	}, {
		capture: false,
		once: true,
		passive: false,
	});
}

function expand(wrapper) {
	if (wrapper.querySelector('.image')) {
		wrapper.classList.add('panelWrapper--expand');
		//window.scrollTo(0, alignToScreenCenter(wrapper));
		if (wrapper.querySelector('.imageWrapper').classList.contains('--hidden')) {
			fadeIn(wrapper.querySelector('.imageWrapper'));
		}
	}
}

function squeezeAll() {
	const panelWrappers = document.querySelectorAll('.panelWrapper');
	panelWrappers.forEach((w) => {
		w.classList.remove('panelWrapper--expand');
		const video = w.querySelector('.image--video');
		if (video) {
			video.pause();
		}
	});
}

function squeezeIt(wrapper) {
	wrapper.classList.remove('panelWrapper--expand');
	//window.scrollTo(0, alignToScreenCenter(wrapper));
}

function alignToScreenCenter(element) {
	const bodyRect = document.body.getBoundingClientRect();
	const elementRect = element.getBoundingClientRect();
	const elementTopBodyOffset = elementRect.top - bodyRect.top;
	const elementHeight = elementRect.height;
	const scrollPos = elementTopBodyOffset - (windowHeight - elementHeight) * 0.5;
	return scrollPos;
}

function translate(element) {
	const bounds = element.getBoundingClientRect();
	const bodyBounds = document.body.getBoundingClientRect();
	const expanded = element.classList.contains('panelWrapper--expand');
	const elementTopBodyOffset = bounds.top - bodyBounds.top;
	const eCBO = elementTopBodyOffset + bounds.height * 0.5;
	const cCO = window.scrollY + window.innerHeight - eCBO; // center to center offset
	if (!expanded) {
		element.querySelector('.image').style.transform = `translate(-50%, calc(-50% - ${(-bounds.height + cCO)}% * 0.025)) scale(1.25)`;
	}
	else {
		element.querySelector('.image').style.transform = 'translate(-50%, -50%)';
	}
}
