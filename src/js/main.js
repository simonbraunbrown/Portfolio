const panelContainer = document.querySelector('.panelContainer');
const images = panelContainer.querySelectorAll('.image');
const panelWrappers = panelContainer.querySelectorAll('.panelWrapper');
const Infos = panelContainer.querySelectorAll('.info');
const progressBarWrappers = document.querySelectorAll('.progressBarWrapper');
const progressCount = document.querySelector('.progress');
const navigation = document.querySelector('.navigationWrapper');
const overlayWrapper = document.querySelector('.overlayWrapper');
const closeButtons = overlayWrapper.querySelectorAll('.closeButton');
let elementBodyOffsets = [];
let previousScrollY = 0;
let windowHeight = window.innerHeight;
let loaded = false;
let redraw = hasScrolled();
let frameCounter = 0;
let headerAnimationPlaying = false;

document.addEventListener('DOMContentLoaded', function (event) {
	console.log('DOM fully loaded');
	loaded = true;
	checkBrowserSupport();
	checkBrowserWidth();
	createPanels();
	getPanelCords();
	drawAnimation();
});

window.addEventListener('resize', function (event) {
	checkBrowserWidth();
	if (loaded) {
		getPanelCords();
		windowHeight = window.innerHeight;
	}
});

function drawAnimation() {
	requestAnimationFrame(drawAnimation);
	if (headerAnimationPlaying) {window.headerAnimationPlay();}
	frameCounter += 1;
	if (frameCounter % 3 !== 0 && !hasScrolled()) return;
	toggleOnScroll(elementBodyOffsets);
	makeProgress();
	
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
		const elementWidth =
			(progressBar.clientWidth * 100) / document.body.clientWidth;
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
		const panelWrapper = createElementWithClassname('div', ['panelWrapper']);
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
				getPanelCords();
			} else {
				squeezeIt(panelWrapper);
				getPanelCords();
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
		video.setAttribute('preload', 'preload');
		video.setAttribute('playsinline', 'playsinline');
		video.setAttribute('autoplay', 'autoplay');
		video.setAttribute('muted', 'muted');
		video.setAttribute('loop', 'loop');
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
				getPanelCords();
				video.play();
			} else {
				squeezeIt(panelWrapper);
				getPanelCords();
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
	}
}

function getPanelCords() {
	const panelWrappers = document.querySelectorAll('.panelWrapper');
	elementBodyOffsets = [];
	panelWrappers.forEach((wrapper) => {
		const bodyRect = document.body.getBoundingClientRect();
		const wrapperRect = wrapper.getBoundingClientRect();
		const elementTopBodyOffset = wrapperRect.top - bodyRect.top;
		const wrapperHeight = wrapperRect.height;
		const values = {
			element: wrapper,
			elementHeight: wrapperHeight,
			elementTopBodyOffset: elementTopBodyOffset,
			elementCenterBodyOffset: elementTopBodyOffset + wrapperHeight * 0.5,
			active: false,
		};
		elementBodyOffsets.push(values);
	});
}

function toggleOnScroll(elementBodyOffsets) {
	if (!elementBodyOffsets) return;

	//const ebos = elementBodyOffsets;
	const wC = windowHeight * 0.5;
	let y = window.scrollY;
	elementBodyOffsets.forEach((props) => {
		const el = props.element;
		let imageWrapper;
		let active = false;
		let expanded;
		if (el.project.isMedia) {
			imageWrapper = el.querySelector('.imageWrapper');
			active = props.active;
			expanded = el.classList.contains('panelWrapper--expand');
		}
		const eH = props.elementHeight * 0.5;
		const eCBO = props.elementCenterBodyOffset;
		const cCO = y + wC - eCBO; // center to center offset
		if (imageWrapper) {
			const image = el.querySelector('.image');
			if (cCO <= eH && cCO >= -eH && !expanded) {
				image.style.transform = `scale(1.0) translate(0,${
					-eH * 1.25 + eH - cCO / 4
				}px)`; // 1.25 from image scale in css

				image.addEventListener('transitionend', function (event) {
					event.stopPropagation();
				});

				if (!active && !expanded) {
					fadeIn(imageWrapper);
					props.active = true;
				}
				el.classList.add('panelWrapper--showInfo');
			} else {
				if (expanded) {
					el.querySelector('.image').style.transform = 'none';
				}
				if (active && !expanded) {
					fadeOut(imageWrapper);
					props.active = false;
				}
				if (!active && !expanded) {
					fadeOut(imageWrapper);
				}
				el.classList.remove('panelWrapper--showInfo');
			}
		} else {
			if (cCO <= eH && cCO >= -eH) {
				el.classList.add('panelWrapper--showInfo');
			} else {
				el.classList.remove('panelWrapper--showInfo');
			}
		}
	});
}

function fadeIn(element) {
	if (!element.classList.contains('--hidden')) return;
	if (element.classList.contains('--fading')) return;
	element.classList.remove('--hidden');
	element.classList.add('--fading');
	
	setTimeout(function () {
		element.classList.remove('--fading');
	}, 30);
}

function fadeOut(element) {
	if (element.classList.contains('--hidden')) return;
	if (element.classList.contains('--fading')) return;
	element.classList.add('--fading');
	
	element.addEventListener('transitionend', function() {
		element.classList.remove('--fading');
		element.classList.add('--hidden');
	}, {
		capture: false,
		once: true,
		passive: false,
	});
}

function expand(wrapper) {
	if (wrapper.querySelector('.image')) {
		wrapper.classList.add('panelWrapper--expand');
		window.scrollTo(0, alignToScreenCenter(wrapper));
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
	window.scrollTo(0, alignToScreenCenter(wrapper));
}

function alignToScreenCenter(element) {
	const bodyRect = document.body.getBoundingClientRect();
	const elementRect = element.getBoundingClientRect();
	const elementTopBodyOffset = elementRect.top - bodyRect.top;
	const elementHeight = elementRect.height;
	const scrollPos = elementTopBodyOffset - (windowHeight - elementHeight) * 0.5;
	return scrollPos;
}
