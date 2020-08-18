const imageContainer = document.querySelector(".imageContainer");
const imageDisplay = imageContainer.querySelector(".imageDisplay");
const images = imageContainer.querySelectorAll(".image");
const panelWrappers = imageContainer.querySelectorAll(".panelWrapper");
const button = document.querySelector(".closeButton");
const canvasHeight = 150;
let elementBodyOffsets = [];
let windowHeight = window.innerHeight;
let loaded = false;
imageContainer.querySelectorAll('.image--video').forEach(video => video.pause());

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded");
  loaded = true;
  getPanelCords();
});

window.addEventListener("resize", function (event) {
  if (loaded) {
    getPanelCords();
    windowHeight = window.innerHeight;
  }
});

window.addEventListener("scroll", function (e) {
  if (loaded) {
    toogleOnScroll(elementBodyOffsets);
  }
});

function getPanelCords() {
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

function toogleOnScroll(_elementBodyOffsets) {
  const ebos = _elementBodyOffsets;
  const wC = windowHeight * 0.5;
  let y = Math.floor(window.scrollY);
  for (let i = 0; i < ebos.length; i++) {
    const eH = ebos[i].elementHeight * 0.5;
    const eCBO = Math.floor(ebos[i].elementCenterBodyOffset);
    const cCO = (y + wC) - eCBO; // center to center offset
    if (cCO <= eH && cCO >= -eH) {
      ebos[i].element.style.border = "2px solid red";
      ebos[i].element.classList.add("panelWrapper--showInfo");
    } else {
      ebos[i].element.style.border = "none";
      ebos[i].element.classList.remove("panelWrapper--showInfo");
    }
  }
}

panelWrappers.forEach((wrapper) => {
  const self = wrapper;
  const video = wrapper.querySelector(".image--video");
  wrapper.querySelector(".image").addEventListener("click", (e) => {
    if (!self.classList.contains("panelWrapper--expand")) {
      panelWrappers.forEach((w) => {
        squeeze(w);
      });
      expand(self);
      getPanelCords();
      if (video) {
        video.play();
      }
    } else {
      squeeze(self);
      getPanelCords();
      if (video) {
        video.pause();
      }
    }
  });
});

// images.forEach((image) => {
//     image.addEventListener('click', () => {
//         const backgroundImageURL = image.style.backgroundImage;
//         const splitURL = backgroundImageURL.split('"');
//         if (imageDisplay.querySelector('.imageToShow')) {
//             let img = imageDisplay.querySelector('.imageToShow');
//             let newImg = document.createElement('img');
//             newImg.className = 'imageToShow';
//             newImg.src = splitURL[1];
//             imageDisplay.replaceChild(newImg, img);
//             imageDisplay.style.display = 'block';
//         } else {
//             let img = document.createElement('img');
//             img.className = 'imageToShow';
//             img.src = splitURL[1];
//             imageDisplay.appendChild(img);
//             imageDisplay.style.display = 'block';
//         }
//         imageDisplay.scrollIntoView({ behavior: 'smooth', block: 'end' });
//     });
// });

// button.addEventListener('click', () => {
//     imageDisplay.style.display = 'none';
// });

function expand(wrapper) {
  wrapper.classList.add("panelWrapper--expand");
  // const buttonWrapper = document.createElement('div');
  // buttonWrapper.className = 'buttonWrapper';
  // const button = document.createElement('button');
  // button.className = 'closeButton';
  // button.addEventListener('click', (e) => {
  //     squeeze(wrapper);
  // });
  // buttonWrapper.appendChild(button)
  // wrapper.appendChild(buttonWrapper);
  wrapper.scrollIntoView({ behavior: "smooth", block: "start" });
}

function squeeze(wrapper) {
  wrapper.classList.remove("panelWrapper--expand");
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
    //canvas.parent("sketch-footer");
    canvas.style("display", "block");
    canvas.style("max-width", "100%");
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

let myp5Footer = new p5(s, "sketch-footer");

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
