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

document.addEventListener('DOMContentLoaded', function (event) {
	console.log('DOM fully loaded');
	loaded = true;
	createPanels();
	getPanelCords();
	drawAnimation();
});

window.addEventListener('resize', function (event) {
	if (loaded) {
		getPanelCords();
		windowHeight = window.innerHeight;
	}
});

function drawAnimation() {
	requestAnimationFrame(drawAnimation);
	redraw = hasScrolled();
	if (!redraw) return;
	toggleOnScroll();
	makeProgress();
}

function createPanels() {
	const panelContainer = document.querySelector('.panelContainer');
	let panelContainerContent = [];
	projects.forEach((project) => {
		let panelContent;
		if (project.type === 'text') {
			panelContent = createTextPanel(project);
		} else if (project.type === 'image') {
			panelContent = createImagePanel(project);
		} else if (project.type === 'video') {
			panelContent = createVideoPanel(project);
		}
		panelContainerContent.push(panelContent);
	});
	appendElements(panelContainer, panelContainerContent);

	function createTextPanel(project) {
		const panelWrapper = createElementWithClassname('div', ['panelWrapper']);
		const panel = createElementWithClassname('div', ['panel']);
		const info = createElementWithClassname('span', ['info']);
		info.innerHTML = project.description;
		info.setAttribute('data-text', project.description);
		panel.appendChild(info);
		panelWrapper.appendChild(panel);
		return panelWrapper;
	}

	function createImagePanel(project) {
		const panelWrapper = createElementWithClassname('div', ['panelWrapper']);
		const panel = createElementWithClassname('div', ['panel']);
		const imageWrapper = createElementWithClassname('div', ['imageWrapper']);
		const image = createElementWithClassname('img', ['image']);
		image.addEventListener('load', function () {});
		image.setAttribute('src', project.src);
		imageWrapper.appendChild(image);
		const info = createElementWithClassname('span', ['info']);
		info.innerHTML = project.description;
		info.setAttribute('data-text', project.description);
		appendElements(panel, [imageWrapper, info]);
		panelWrapper.appendChild(panel);
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
		const panel = createElementWithClassname('div', ['panel']);
		const imageWrapper = createElementWithClassname('div', ['imageWrapper']);
		const video = createElementWithClassname('video', [
			'image',
			'image--video',
		]);
		video.setAttribute('preload', 'preload');
		video.setAttribute('playsinline', 'playsinline');
		video.setAttribute('autoplay', 'autoplay');
		video.setAttribute('muted', 'muted');
		video.setAttribute('loop', 'loop');
		video.pause();
		const source = document.createElement('source');
		source.setAttribute('src', project.src);
		video.appendChild(source);
		imageWrapper.appendChild(video);
		const info = createElementWithClassname('span', ['info']);
		info.innerHTML = project.description;
		info.setAttribute('data-text', project.description);
		appendElements(panel, [imageWrapper, info]);
		panelWrapper.appendChild(panel);
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

const imageWrappers = document.querySelectorAll('.imageWrapper');
imageWrappers.forEach((w) => {
	w.classList.add('--hidden');
});

navigation.querySelectorAll('.navigationItem').forEach((item) => {
	item.addEventListener('click', function (event) {
		const overlay = overlayWrapper.querySelector(
			'.overlay--' + item.dataset.className
		);
		const isVisible = overlay.classList.contains('overlay--visible');

		if (isVisible) {
			overlay.classList.remove('overlay--visible');
		} else {
			overlayWrapper.querySelectorAll('.overlay--visible').forEach((item) => {
				item.classList.remove('overlay--visible');
			});
			overlay.classList.add('overlay--visible');
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
		((window.scrollY + window.innerHeight) / (bodyRect.bottom - bodyRect.top)) *
		100;

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
	progressCount.innerHTML = Math.floor(progress) + '%';
	progressBarWrappers.forEach((progressBarWrapper) => {
		progressBarWrapper.classList.toggle(
			'progressBarWrapper--visible',
			window.scrollY > windowHeight
		);
	});
}

function getPanelCords() {
	const panelWrappers = document.querySelectorAll('.panelWrapper');
	elementBodyOffsets = [];
	panelWrappers.forEach((wrapper) => {
		const bodyRect = document.body.getBoundingClientRect();
		const wrapperRect = wrapper.getBoundingClientRect();
		const elementTopBodyOffset = wrapperRect.top - bodyRect.top;
		const wrapperHeight = wrapperRect.bottom - wrapperRect.top;
		const values = {
			element: wrapper,
			elementHeight: wrapperHeight,
			elementTopBodyOffset: elementTopBodyOffset,
			elementCenterBodyOffset: elementTopBodyOffset + wrapperHeight * 0.5,
		};
		elementBodyOffsets.push(values);
	});
}

function toggleOnScroll() {
	if (!elementBodyOffsets) return;

	const ebos = elementBodyOffsets;
	const wC = windowHeight * 0.5;
	let y = Math.floor(window.scrollY);
	const expanded = (index) =>
		ebos[index].element.classList.contains('panelWrapper--expand');
	const showInfo = (index) =>
		ebos[index].element.classList.contains('panelWrapper--showInfo');
	let imageWrapper = null;
	for (let i = 0; i < ebos.length; i++) {
		if (ebos[i].element.querySelector('.imageWrapper')) {
			imageWrapper = ebos[i].element.querySelector('.imageWrapper');
		}
		const eH = ebos[i].elementHeight * 0.5;
		const eCBO = Math.floor(ebos[i].elementCenterBodyOffset);
		const cCO = y + wC - eCBO; // center to center offset
		if (cCO <= eH && cCO >= -eH && !expanded(i)) {
			if (ebos[i].element.querySelector('.image')) {
				ebos[i].element.querySelector('.image').style.transform =
					'scale(1.0) translate(0,calc(' +
					(-eH * 1.25 + eH) +
					'px - ' +
					cCO / 4 +
					'px))'; // 1.25 from image scale in css
			}
			ebos[i].element.classList.add('panelWrapper--showInfo');
			if (imageWrapper && !expanded(i)) {
				fadeIn(imageWrapper);
			}
		} else {
			if (expanded(i)) {
				ebos[i].element.querySelector('.image').style.transform = 'none';
			}
			ebos[i].element.classList.remove('panelWrapper--showInfo');
			if (imageWrapper && !expanded(i)) {
				fadeOut(imageWrapper);
			}
		}
	}
}

function fadeIn(element) {
	if (!element.classList.contains('--hidden')) return;
	element.classList.add('--fading');
	element.classList.remove('--hidden');
	setTimeout(function () {
		element.classList.remove('--fading');
	}, 50);
}

function fadeOut(element) {
	if (element.classList.contains('--hidden')) return;
	element.classList.add('--fading');
	element.addEventListener(
		'transitionend',
		function (event) {
			element.classList.add('--hidden');
			element.classList.remove('--fading');
		},
		{
			capture: false,
			once: true,
			passive: false,
		}
	);
}

function displayFilename(element, image) {
	let filename = image.src
		? image.src.split('/')[4]
		: image.getElementsByTagName('source')[0].src.split('/')[4];
	filename = filename.split('.')[0];
	const f = document.createElement('span');
	const fW = document.createElement('div');
	f.className = 'fileName';
	fW.className = 'fileNameWrapper';
	f.innerHTML = filename;
	fW.appendChild(f);
	element.appendChild(fW);
}

function expand(wrapper) {
	if (wrapper.querySelector('.image')) {
		wrapper.classList.add('panelWrapper--expand');
		window.scrollTo(0, alignToScreenCenter(wrapper));
	}
}

function squeezeAll(wrappers) {
	wrappers.forEach((w) => {
		w.classList.remove('panelWrapper--expand');
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
	const elementHeight = elementRect.bottom - elementRect.top;
	const scrollPos = elementTopBodyOffset - (windowHeight - elementHeight) * 0.5;
	return scrollPos;
}
