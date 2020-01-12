console.log("hello");

var imageContainer = document.querySelector('.imageContainer');
var imageDisplay = imageContainer.querySelector('.imageDisplay');
var images = imageContainer.querySelectorAll('.image');
var button = document.querySelector('.closeButton');

images.forEach(image => {
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