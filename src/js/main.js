const imageContainer = document.querySelector('.imageContainer');
const imageDisplay = imageContainer.querySelector('.imageDisplay');
const images = imageContainer.querySelectorAll('.image');
const panelWrappers = imageContainer.querySelectorAll('.panelWrapper');
const Infos = imageContainer.querySelectorAll('.info');
const progressBarWrapper = document.querySelector('.progressBarWrapper');
const progressBar = document.querySelector('.progressBar');
const progressCount = document.querySelector('.progress');
const canvasHeight = 150;
let elementBodyOffsets = [];
let previousScrollY = 0;
let windowHeight = window.innerHeight;
let loaded = false;
let redraw = hasScrolled();

imageContainer.querySelectorAll('.image--video').forEach(video => video.pause());
Infos.forEach( info => {
  const infoText = info.innerHTML;
  info.setAttribute('data-text', infoText);
})

document.addEventListener('DOMContentLoaded', function (event) {
  console.log('DOM fully loaded');
  loaded = true;
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
  if(!redraw) return;
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
  const progress = Math.ceil((window.scrollY + window.innerHeight) / (bodyRect.bottom - bodyRect.top) * 100);
  progressBar.style.height = progress+'vh';
  progressCount.innerHTML = progress+'%';
  progressBarWrapper.classList.toggle('progressBarWrapper--visible', window.scrollY > windowHeight);
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
  if(!elementBodyOffsets) return;

  const ebos = elementBodyOffsets;
  const wC = windowHeight * 0.5;
  let y = Math.floor(window.scrollY);
  for (let i = 0; i < ebos.length; i++) {
    const eH = ebos[i].elementHeight * 0.5;
    const eCBO = Math.floor(ebos[i].elementCenterBodyOffset);
    const cCO = (y + wC) - eCBO; // center to center offset
    if (cCO <= eH && cCO >= -eH && !ebos[i].element.classList.contains('panelWrapper--expand')) {
      ebos[i].element.querySelector('.image').style.transform = 'scale(1.0) translate(0,calc('+ (-eH*1.25+eH) +'px - '+ cCO/4 +'px))'; // 1.25 from image scale in css
      ebos[i].element.classList.add('panelWrapper--showInfo');
    } else {
      ebos[i].element.querySelector('.image').style.transform = 'none';
      ebos[i].element.classList.remove('panelWrapper--showInfo');
    }
  }
}

panelWrappers.forEach((wrapper) => {
  const self = wrapper;
  const video = wrapper.querySelector('.image--video');
  wrapper.addEventListener('click', (e) => {
    if (!self.classList.contains('panelWrapper--expand')) {
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
  wrapper.classList.add('panelWrapper--expand');
  wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function squeezeAll(wrappers) {
  wrappers.forEach((w) => {
  w.classList.remove('panelWrapper--expand');
  });
}

function squeezeIt(wrapper) {
  wrapper.classList.remove('panelWrapper--expand');
  const wrapperRect = wrapper.getBoundingClientRect();
  const offset = (wrapperRect.bottom - wrapperRect.top) * 0.5
  window.scrollTo(0, previousScrollY - ((windowHeight * 0.5) - offset));
}

const s = (sketch) => {
  let canvas;

  function centerCanvas() {
    let x = (sketch.windowWidth - sketch.width) / 2;
    let y = (sketch.windowHeight - sketch.height) / 2;
    canvas.position(x, y);
  }

  sketch.setup = () => {
    canvas = sketch.createCanvas(sketch.windowWidth, canvasHeight);
    //canvas.parent('sketch-footer');
    canvas.style('display', 'block');
    canvas.style('max-width', '100%');
    sketch.background(0);
    sketch.color(0);
    sketch.strokeWeight(1);
    sketch.stroke(128);
    sketch.frameRate(24);
    sketch.noLoop();
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, canvasHeight);
  };

  sketch.draw = () => {};
};

// let myp5Header = new p5(s, 'sketch-header');

// myp5Header.draw = () => {
//     myp5Header.background(0, 50);
//     myp5Header.frameRate(10);

//         if (myp5Header.frameCount % 60 == 0) {
//             myp5Header.frameRate(60);
//             myp5Header.line(myp5Header.random(0, myp5Header.width), 0, myp5Header.mouseX, myp5Header.mouseY);
//         }
// }

let myp5Footer = new p5(s, 'sketch-footer');

myp5Footer.draw = () => {
  if (myp5Footer.frameCount % 2 == 0) {
    myp5Footer.background(0, 50);
  }
  myp5Footer.noFill();
  const rand = myp5Footer.random(0, 1);
  const offset = 30;
  const canvasWidth = myp5Footer.width;
  const canvasHeight = myp5Footer.height;

  if (rand < 0.3) {
    //myp5Footer.frameRate(60);
    const w = myp5Footer.random(5, canvasWidth / 3);
    const h = myp5Footer.random(5, canvasHeight / 2);
    //myp5Footer.line(myp5Footer.random(0, myp5Footer.width), canvasHeight, myp5Footer.mouseX, myp5Footer.mouseY);
    //myp5Footer.line(myp5Footer.random(0, myp5Footer.width), canvasHeight, myp5Footer.mouseX, myp5Footer.mouseY);
    if (myp5Footer.mouseY >= 0 && myp5Footer.mouseY <= canvasHeight) {
      myp5Footer.rect(
        myp5Footer.random(
          myp5Footer.mouseX - offset,
          myp5Footer.mouseX + offset
        ),
        myp5Footer.random(
          myp5Footer.mouseY - offset,
          myp5Footer.mouseY + offset
        ),
        w / 2,
        h / 2
      );
    } else if (myp5Footer.mouseY < 0) {
      myp5Footer.rect(
        myp5Footer.random(0, canvasWidth - w),
        myp5Footer.random(0, canvasHeight - h),
        w,
        h
      );
    }
  }
};
