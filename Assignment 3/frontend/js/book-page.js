let bookId = null;
let book = null;

init();

function init() {
    bookId = getBookIdFromURL();

    if (!bookId) {
        console.error("No book id provided in URL");
        return;
    }

    loadBook(bookId);
}

function getBookIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function loadBook(id) {
    try {
        const response = await fetch(`${API_BASE}/books/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch book");
        }

        book = await response.json();

        renderBook(book);

    } catch (err) {
        console.error(err);
    }
}

function renderBook(book) {
    const titleEl = document.querySelector(".main-header h2");
    const authorEl = document.querySelector(".main-header h3");
    const descEl = document.querySelector(".description p");
    const stockEl = document.querySelector(".stock-price-cart h3");
    const priceEl = document.querySelector(".stock-price-cart h2");
    const button = document.querySelector("button");

    if (!titleEl || !authorEl || !descEl || !stockEl || !priceEl || !button) {
        console.error("Book page HTML elements not found");
        return;
    }

    titleEl.textContent = book.title;
    authorEl.textContent = book.author;
    descEl.textContent = book.description;
    stockEl.textContent = `Stock: ${book.stock_quantity}`;
    priceEl.textContent = `$${Number(book.price).toFixed(2)}`;

    button.onclick = () => addToCart(book.book_id, 1);
}

loadCart();
