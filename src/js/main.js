
var imageContainer = document.querySelector('.imageContainer');
var imageDisplay = imageContainer.querySelector('.imageDisplay');
var images = imageContainer.querySelectorAll('.image');
var button = document.querySelector('.closeButton');
const canvasHeight = 150;

images.forEach((image) => {
    image.addEventListener('click', () => {
        const backgroundImageURL = image.style.backgroundImage;
        const splitURL = backgroundImageURL.split('"');
        if (imageDisplay.querySelector('.imageToShow')) {
            var img = imageDisplay.querySelector('.imageToShow');
            var newImg = document.createElement("img");
            newImg.className = 'imageToShow';
            newImg.src = splitURL[1];
            imageDisplay.replaceChild(newImg, img);
            imageDisplay.style.display = 'block';
        } else {
            var img = document.createElement("img");
            img.className = 'imageToShow';
            img.src = splitURL[1];
            imageDisplay.appendChild(img);
            imageDisplay.style.display = 'block';
        }
        imageDisplay.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
});

button.addEventListener('click', () => {
    imageDisplay.style.display = 'none';
});



const s = (sketch) => {
    sketch.setup = () => {
        var canvas = sketch.createCanvas(sketch.windowWidth, canvasHeight);
        // canvas.parent("sketch-footer");
        canvas.style("display", "block");
        sketch.background(0);
        sketch.strokeWeight(10);
        sketch.stroke(128);
        sketch.frameRate(10);
    }

    sketch.windowResized = () => {
        sketch.resizeCanvas(sketch.windowWidth, canvasHeight);
    }

    sketch.draw = () => {
    }
}

let myp5Header = new p5(s, 'sketch-header');
let myp5Footer = new p5(s, 'sketch-footer');

myp5Header.draw = () => {
    myp5Header.background(0, 50);
    myp5Header.frameRate(10);

        if (myp5Header.frameCount % 60 == 0) {
            myp5Header.frameRate(60);
            myp5Header.line(myp5Header.random(0, myp5Header.width), 0, myp5Header.mouseX, myp5Header.mouseY);
        }
} 

myp5Footer.draw = () => {
    myp5Footer.background(0, 50);
    myp5Footer.frameRate(10);

        if (myp5Footer.frameCount % 60 == 5) {
            myp5Footer.frameRate(60);
            myp5Footer.line(myp5Footer.random(0, myp5Footer.width), canvasHeight, myp5Footer.mouseX, myp5Footer.mouseY);
        }
} 