const imgContainer = document.querySelector('#imgContainer');
const button = document.querySelector('button')

let size;
let sort;

button.addEventListener('click', getUserInput);
document.addEventListener("keydown", function (event) {
    if (event.key === 'Enter' || event.key === 'NumpadEnter') {
        getUserInput(event);
    }
});

// This function retrieves user input for a search query and validates it. If input is valid, it calls another function to retrieve images.
function getUserInput(event) {
    event.preventDefault();

    imgContainer.innerHTML = '';

    const searchText = document.querySelector('#searchText').value;
    const amountOfImg = parseInt(document.querySelector('#amountOfImg').value);
    sort = document.querySelector('#sort').value;
    size = document.querySelector('#sizeSelect').value;

    if (!searchText) {
        alert("Please type a text/correct spelled text, and choose amount");
    } else if (amountOfImg < 1 || amountOfImg > 500 || !amountOfImg) {
        alert("Please choose a number between 1 and 500. You are only allowed to select up to 500 images per search.")
    } else {
        getImages(searchText, amountOfImg);
    }
    event.stopPropagation();
}

// This function retrieves images by constructing a URL using user input, sends a request using fetch and handles errors. Result is passed to another function for display.
function getImages(searchText, amountOfImg) {
    const apiUrl =
        `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=c2ec8d1f286de54ef6d3ad8d087d0f93&text=${searchText}&sort=${sort}&per_page=${amountOfImg}&format=json&nojsoncallback=1`;

    fetch(apiUrl)
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                throw new Error(`Something went wrong. Error message: ${error.message}`);
            }
        })
        .then(displayImages)
        .catch(error => {
            alert(`Request failed. Error message: ${error.message}`);
        });
}

// This function displays images by constructing URL, creating HTML elements, and appending them to the page with a click event to open in a new tab.
function displayImages(imgInfo) {
    if (imgInfo.photos.photo.length > 0) {
        imgInfo.photos.photo.forEach(photo => {
            const imgUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;

            const article = document.createElement('article');
            const img = document.createElement('img');
            img.src = imgUrl;

            img.addEventListener('click', () => {
                window.open(`${imgUrl}`, "_blank");
            });

            imgContainer.append(article);
            article.append(img)
        });

    } else {
        alert("No images found for the provided text");
    }
}