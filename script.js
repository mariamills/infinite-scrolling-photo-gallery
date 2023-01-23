const windowHeight = window.innerHeight;
const windowScrollY = window.scrollY;
const windowOffsetHeight = this.document.body.offsetHeight;

const isInitialLoad = true;
let initialCount = 5;
const loader = document.getElementById("loader");
const imgContainer = document.getElementById("img-container");

//Unsplash API
const apiKey = "process.env.UNSPLASH_API_KEY";
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

//Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalDownloads = document.getElementById("modal-downloads");
const modalViews = document.getElementById("modal-views");
const modalDownloadBtn = document.getElementById("modal-download");
const closeBtn = document.getElementById("close-modal");
const author = document.getElementById("author");

let ready = false;
let imgsLoaded = 0;
let totalImgs = 0;
let photos = [];

function updateAPIURLCount(newCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}`;
}

//Check if all images were loaded
function imageLoaded() {
  imgsLoaded++;
  if (imgsLoaded === totalImgs) {
    ready = true;
    //Hide loader upon successful load
    loader.hidden = true;
  }
}

//Helper Function to Set Attributes on DOM Elements to enforce DRY
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function closeModal() {
  modal.style.display = "none";
}

//Create Elements For Links & Photos
function displayPhotos() {
  imgsLoaded = 0;
  totalImgs = photos.length;
  photos.forEach(function (photo) {
    const a = document.createElement("a");
    setAttributes(a, {
      href: photo.links.html,
      target: "_blank",
    });

    const img = document.createElement("img");
    img.style.cursor = "pointer";
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.description,
      title: photo.description
        ? photo.description
        : "A beautiful image with no default description",
    });

    img.addEventListener("load", imageLoaded);
    img.addEventListener("click", function () {
      modal.style.display = "block";
      modalImg.src = photo.urls.regular;
      author.innerText = `Author - ${photo.user.name}`;
      modalDownloads.innerText = photo.downloads;
      modalViews.innerHTML = photo.views;
      modalDownloadBtn.href = photo.links.html;
    });

    // a.appendChild(img);
    imgContainer.appendChild(img);
  });
}

//Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photos = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateAPIURLCount(10);
      isInitialLoad = false;
    }
  } catch (e) {
    //Catch error
  }
}

//Close modal upon click
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", closeModal);

//Load More Photos if user scrolls near bottom of page
window.addEventListener("scroll", function (e) {
  if (windowHeight + windowScrollY >= windowOffsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
});

//Upon load
getPhotos();
