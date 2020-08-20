const imageContainer = document.querySelector(".imageContainer");
const imageDisplay = imageContainer.querySelector(".imageDisplay");
const images = imageContainer.querySelectorAll(".image");
const panelWrappers = imageContainer.querySelectorAll(".panelWrapper");
const Infos = imageContainer.querySelectorAll(".info");
const progressBarWrapper = document.querySelector(".progressBarWrapper");
const progressBar = document.querySelector(".progressBar");
const progressCount = document.querySelector(".progress");
let elementBodyOffsets = [];
let previousScrollY = 0;
let windowHeight = window.innerHeight;
let loaded = false;
let redraw = hasScrolled();

imageContainer
  .querySelectorAll(".image--video")
  .forEach((video) => video.pause());
Infos.forEach((info) => {
  const infoText = info.innerHTML;
  info.setAttribute("data-text", infoText);
});

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded");
  loaded = true;
  getPanelCords();
  drawAnimation();
});

window.addEventListener("resize", function (event) {
  if (loaded) {
    getPanelCords();
    windowHeight = window.innerHeight;
  }
});

function drawAnimation() {
  requestAnimationFrame(drawAnimation);
  redraw = hasScrolled();
  if (!redraw) return;
  toogleOnScroll();
  makeProgress();
}

function hasScrolled() {
  let redraw = previousScrollY !== window.scrollY;
  previousScrollY = window.scrollY;
  return redraw;
}

function makeProgress() {
  const bodyRect = document.body.getBoundingClientRect();
  const progress = Math.ceil(
    ((window.scrollY + window.innerHeight) / (bodyRect.bottom - bodyRect.top)) *
      100
  );
  progressBar.style.height = progress + "vh";
  progressCount.innerHTML = progress + "%";
  progressBarWrapper.classList.toggle(
    "progressBarWrapper--visible",
    window.scrollY > windowHeight
  );
}

function getPanelCords() {
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

function toogleOnScroll() {
  if (!elementBodyOffsets) return;

  const ebos = elementBodyOffsets;
  const wC = windowHeight * 0.5;
  let y = Math.floor(window.scrollY);
  for (let i = 0; i < ebos.length; i++) {
    const eH = ebos[i].elementHeight * 0.5;
    const eCBO = Math.floor(ebos[i].elementCenterBodyOffset);
    const cCO = y + wC - eCBO; // center to center offset
    if (
      cCO <= eH &&
      cCO >= -eH &&
      !ebos[i].element.classList.contains("panelWrapper--expand")
    ) {
      ebos[i].element.querySelector(".image").style.transform =
        "scale(1.0) translate(0,calc(" +
        (-eH * 1.25 + eH) +
        "px - " +
        cCO / 4 +
        "px))"; // 1.25 from image scale in css
      ebos[i].element.classList.add("panelWrapper--showInfo");
    } else {
      ebos[i].element.querySelector(".image").style.transform = "none";
      ebos[i].element.classList.remove("panelWrapper--showInfo");
    }
  }
}

panelWrappers.forEach((wrapper) => {
  const self = wrapper;
  const video = wrapper.querySelector(".image--video");
  wrapper.addEventListener("click", (e) => {
    if (!self.classList.contains("panelWrapper--expand")) {
      squeezeAll(panelWrappers);
      expand(self);
      getPanelCords();
      if (video) {
        video.play();
      }
    } else {
      squeezeIt(self);
      getPanelCords();
      if (video) {
        video.pause();
      }
    }
  });
});

function expand(wrapper) {
  wrapper.classList.add("panelWrapper--expand");
  wrapper.scrollIntoView({ behavior: "smooth", block: "start" });
}

function squeezeAll(wrappers) {
  wrappers.forEach((w) => {
    w.classList.remove("panelWrapper--expand");
  });
}

function squeezeIt(wrapper) {
  wrapper.classList.remove("panelWrapper--expand");
  const wrapperRect = wrapper.getBoundingClientRect();
  const offset = (wrapperRect.bottom - wrapperRect.top) * 0.5;
  window.scrollTo(0, previousScrollY - (windowHeight * 0.5 - offset));
}
