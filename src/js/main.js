
const imageContainer = document.querySelector('.imageContainer');
const imageDisplay = imageContainer.querySelector('.imageDisplay');
const images = imageContainer.querySelectorAll('.image');
const imageWrappers = imageContainer.querySelectorAll('.imageWrapper');
const button = document.querySelector('.closeButton');
const canvasHeight = 150;

imageWrappers.forEach((wrapper) =>{
    const self = wrapper;
    wrapper.querySelector('.image').addEventListener('click', (e) =>{
        if (self.className !=('imageWrapper imageWrapper--expand')) {
            expand(self);
        }
        else {
            squeeze(self);
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

button.addEventListener('click', () => {
    imageDisplay.style.display = 'none';
});

function expand(wrapper) {
    wrapper.classList.add('imageWrapper--expand');
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'buttonWrapper';
    const button = document.createElement('button');
    button.className = 'closeButton';
    button.addEventListener('click', (e) => {
        squeeze(wrapper);
    });
    buttonWrapper.appendChild(button)
    wrapper.appendChild(buttonWrapper);
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function squeeze(wrapper) {
    wrapper.classList.remove('imageWrapper--expand');
}

const s = (sketch) => {
    let canvas

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
        sketch.strokeWeight(3);
        sketch.stroke(128);
        sketch.frameRate(10);
    }

    sketch.windowResized = () => {
        sketch.resizeCanvas(sketch.windowWidth, canvasHeight);
    }

    sketch.draw = () => {
    }
}

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
    myp5Footer.background(0, 50);
    myp5Footer.frameRate(10);

        if (myp5Footer.frameCount % 60 == 5) {
            myp5Footer.frameRate(60);
            for(let i = 0; i < 10; i++) {
                myp5Footer.line(myp5Footer.random(0, myp5Footer.width), canvasHeight, myp5Footer.mouseX, myp5Footer.mouseY);
                //myp5Footer.line(myp5Footer.random(0, myp5Footer.width), canvasHeight, myp5Footer.mouseX, myp5Footer.mouseY);
            }
        }
} 