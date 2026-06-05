let allBooks = [];
let filteredBooks = [];

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
    const response = await fetch("http://localhost:5000/api/books");
    allBooks = await response.json();
    filteredBooks = allBooks;

    renderFilters();
    attachFilterEvents();
    renderBooks();
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
    const checkboxes = document.querySelectorAll(".filter input[type='checkbox']");
    const allBox = document.querySelector(".filter input[value='all']");

    checkboxes.forEach(box => {
        box.addEventListener("change", () => {

            if (box.value === "all") {
                if (box.checked) {
                    checkboxes.forEach(b => {
                        if (b.value !== "all") b.checked = false;
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
    const checkboxes = document.querySelectorAll(".filter input[type='checkbox']");
    const allBox = document.querySelector(".filter input[value='all']");

    const selectedGenres = Array.from(checkboxes)
        .filter(b => b.checked && b.value !== "all")
        .map(b => b.value);

    if (selectedGenres.length === 0) {
        filteredBooks = allBooks;

        // force "All" to be selected again
        allBox.checked = true;

    } else {
        filteredBooks = allBooks.filter(book =>
            selectedGenres.includes(book.category_name)
        );

        // ensure "All" is off when specific filters are active
        allBox.checked = false;
    }

    renderBooks();
}

function openBook(id) {
    window.location.href = `book-page.html?id=${id}`;
}

window.openBook = openBook;

loadBooks();