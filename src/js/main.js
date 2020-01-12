console.log("hello");

var imageContainer = document.querySelector(".imageContainer");
var imageDisplay = imageContainer.querySelector(".imageDisplay");
var images = imageContainer.querySelectorAll(".image");

images.forEach(image => {
  image.addEventListener("click", () => {
    const backgroundImageURL = image.style.backgroundImage;
    const splitURL = backgroundImageURL.split('"');
    if (imageDisplay.querySelector(".imageToShow")) {
      var img = imageDisplay.querySelector(".imageToShow"); 
      var newImg = document.createElement("img");
      newImg.className = "imageToShow";
      newImg.src = splitURL[1];
      imageDisplay.replaceChild(newImg, img);
    } else {
      var img = document.createElement("img");
      img.className = "imageToShow";
      img.src = splitURL[1];
      imageDisplay.appendChild(img);
    }
  });
});
