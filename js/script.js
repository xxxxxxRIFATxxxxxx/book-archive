// Define UI Element
const bookContainer = document.getElementById("book-container");
const totalBooks = document.getElementById("total-books");
const searchText = document.getElementById("search-text");

// Clear Element From UI
const clearElement = id => {
    document.getElementById(id).innerHTML = "";
};

// Toggle Spinner
const toggleSpinner = style => {
    document.getElementById("spinner-container").style.display = style;
};

// Show Alert
const showAlert = (style, message) => {
    const alert = document.getElementById("alert-section");
    alert.innerText = message;
    alert.style.display = style;
};

// Check Property Function
const checkElement = property => {
    let newProperty;
    if (property) {
        newProperty = property;
    }
    else {
        newProperty = "NONE";
    };

    return newProperty;
};

// Handle Image Function
const handleImage = image => {
    let newImage;
    if (image) {
        newImage = `https://covers.openlibrary.org/b/id/${image}-M.jpg`
    }

    else {
        newImage = "../images/default-image.jpg";
    };

    return newImage;
};

// Create Single Book Card
const createSingleBook = (bookTitle, bookAuthor, firstPublish, bookPublisher, bookImage) => {
    const div = document.createElement("div");
    div.classList.add("col");
    div.innerHTML = `
                <div class="card mb-3 bg-dark shadow-box h-100" style="max-width: 540px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${bookImage}" class="img-fluid rounded-start" alt="${bookTitle}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title light-green-text">${bookTitle}</h5>
    
                                <p class="card-text text-white mb-0">
                                    <small class="text-muted">Author:</small>
                                    <span>${bookAuthor[0]}</span>
                                </p>
    
                                <p class="card-text text-white mb-0">
                                    <small class="text-muted">First Publish:</small>
                                    <span>${firstPublish}</span>
                                </p>

                                <p class="card-text text-white mb-0">
                                    <small class="text-muted">Publisher:</small>
                                    <span>${bookPublisher[0]}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>`
    bookContainer.appendChild(div);
};

// Search Button Event Handler
document.getElementById("search-btn").addEventListener("click", () => {
    // Remove Alert
    showAlert("none");

    // Clear Total Books Count And Display Books Count
    clearElement("total-books");

    // Clear Book Container
    clearElement("book-container");

    // Show Spinner
    toggleSpinner("block");

    // Check search text has value or not
    let url;
    if (searchText.value === "") {
        // Remove Spinner
        toggleSpinner("none");

        // Show Alert
        showAlert("block", "Please write any book name in the box and click the search button!");
    }

    else {
        url = `https://openlibrary.org/search.json?q=${searchText.value}`;
        // Call API
        fetch(url)
            .then(response => response.json())
            .then(data => showBooks(data))
            .catch(error => {
                // Show Alert
                showAlert("block", "Something went wrong please try again!");
            });
    };

    // Clear Search Text
    searchText.value = "";
});

// Show Book Function
const showBooks = (data) => {
    const { numFound, docs } = data;
    const bookList = docs.slice(0, 30);

    // If No Book Found
    if (bookList.length === 0) {
        // Remove Spinner
        toggleSpinner("none");

        // Show Alert
        showAlert("block", "No Books Found!");
    }

    else {
        totalBooks.innerText = `Total Books Found ${numFound} but display only ${bookList.length}`;
        bookList.forEach((book) => {
            const { title, author_name, cover_i, first_publish_year, publisher } = book;

            // For checking if any property available or not
            const bookTitle = checkElement(title);
            const bookAuthor = checkElement(author_name);
            const firstPublish = checkElement(first_publish_year);
            const bookPublisher = checkElement(publisher);

            // For checking image available or not
            // If not then add a default Image
            const bookImage = handleImage(cover_i);

            // For Create Single Book Card
            createSingleBook(bookTitle, bookAuthor, firstPublish, bookPublisher, bookImage);
        });
    };

    // Remove Spinner
    toggleSpinner("none");
};