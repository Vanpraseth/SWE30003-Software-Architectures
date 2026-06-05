function getToken() {
    return localStorage.getItem("token");
}

async function fetchCart() {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${API_BASE}/cart`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) return null;
    return await res.json();
}

function renderCart(cartItems) {
    const aside = document.querySelector(".right-aside");

    aside.innerHTML = `<h2>Cart</h2>`;

    if (!cartItems || cartItems.length === 0) {
        aside.innerHTML += `<p>Empty</p>`;
        return;
    }

    aside.innerHTML += cartItems.map(item => `
        <div class="cart-item">
            <div>${item.title}</div>
            <div>Qty: ${item.quantity}</div>
        </div>
    `).join("");
}

async function loadCart() {
    const cart = await fetchCart();
    renderCart(cart || []);
}

async function addToCart(bookId, quantity = 1) {
    const token = getToken();

    if (!token) {
        window.location.href = "login-register.html";
        return;
    }

    const res = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            book_id: bookId,
            quantity
        })
    });

    if (!res.ok) {
        console.log("Failed to add to cart");
        return;
    }

    await loadCart();
}

window.addToCart = addToCart;