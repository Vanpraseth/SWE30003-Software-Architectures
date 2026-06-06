let allBooks = [];
let filteredBooks = [];
let currentSort = null;
let currentSearch = "";

function createBookItem(book) {
    return `
        <div class="catalogue-item" onclick="openBook(${book.book_id})">
            <div class="book-left">
                <span class="title">${book.title}</span>
                <span class="author">${book.author}</span>
            </div>

            <div class="book-right">
                <span class="genre">${book.category_name}</span>
                <span class="stock">${book.stock_quantity} in stock</span>
                <span class="price">$${book.price.toFixed(2)}</span>
            </div>
        </div>
    `;
}

async function loadBooks() {
    const response = await fetch(`${API_BASE}/books`);

    allBooks = await response.json();
    filteredBooks = allBooks;

    currentSort = "newest-arrivals";

    renderFilters();

    attachFilterEvents();
    attachSortEvents();
    attachSearchEvents();

    updateFilters();
}

function renderBooks() {
    const catalogue = document.querySelector(".catalogue");

    catalogue.innerHTML = filteredBooks
        .map(createBookItem)
        .join("");
}

function extractGenres(books) {
    return [...new Set(books.map(b => b.category_name))].sort();
}

function renderFilters() {
    const filterContainer = document.querySelector(".filter");

    const genres = extractGenres(allBooks);

    filterContainer.innerHTML = `
        <h2>Filter</h2>

        <label>
            <input type="checkbox" value="all" checked>
            All
        </label>

        ${genres.map(g => `
            <label>
                <input type="checkbox" value="${g}">
                ${g}
            </label>
        `).join("")}
    `;
}

function attachFilterEvents() {
    const checkboxes = document.querySelectorAll(
        ".filter input[type='checkbox']"
    );

    const allBox = document.querySelector(
        ".filter input[value='all']"
    );

    checkboxes.forEach(box => {
        box.addEventListener("change", () => {

            if (box.value === "all") {
                if (box.checked) {
                    checkboxes.forEach(b => {
                        if (b.value !== "all") {
                            b.checked = false;
                        }
                    });
                }
            } else {
                allBox.checked = false;
            }

            updateFilters();
        });
    });
}

function updateFilters() {
    const checkboxes = document.querySelectorAll(
        ".filter input[type='checkbox']"
    );

    const allBox = document.querySelector(
        ".filter input[value='all']"
    );

    const selectedGenres = Array.from(checkboxes)
        .filter(box => box.checked && box.value !== "all")
        .map(box => box.value);

    if (selectedGenres.length === 0) {
        filteredBooks = allBooks;
        allBox.checked = true;
    } else {
        filteredBooks = allBooks.filter(book =>
            selectedGenres.includes(book.category_name)
        );

        allBox.checked = false;
    }

    if (currentSearch !== "") {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(currentSearch) ||
            book.author.toLowerCase().includes(currentSearch) ||
            book.category_name.toLowerCase().includes(currentSearch)
        );
    }

    filteredBooks = sortBooks(filteredBooks);

    renderBooks();
}

function sortBooks(books) {
    const sorted = [...books];

    switch (currentSort) {
        case "title":
            sorted.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            break;

        case "author":
            sorted.sort((a, b) =>
                a.author.localeCompare(b.author)
            );
            break;

        case "genre":
            sorted.sort((a, b) =>
                a.category_name.localeCompare(b.category_name)
            );
            break;

        case "price":
            sorted.sort((a, b) =>
                a.price - b.price
            );
            break;

        case "newest-arrivals":
            sorted.sort((a, b) =>
                b.book_id - a.book_id
            );
            break;
    }

    return sorted;
}

function attachSortEvents() {
    const radios = document.querySelectorAll(
        ".sort input[type='radio']"
    );

    console.log("SORT RADIOS FOUND:", radios.length);

    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            console.log("SORT CLICK:", radio.value);

            currentSort = radio.value;
            updateFilters();
        });
    });
}

function attachSearchEvents() {
    const searchInput = document.querySelector(
        ".main-header input[type='search']"
    );

    searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value.toLowerCase();

        updateFilters();
    });
}

function openBook(id) {
    window.location.href = `book-page.html?id=${id}`;
}

window.openBook = openBook;

document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
});