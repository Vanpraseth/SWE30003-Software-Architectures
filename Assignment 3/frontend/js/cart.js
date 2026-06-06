function getToken() {
    return localStorage.getItem("token");
}

async function readJsonResponse(res) {
    const text = await res.text();

    try {
        return text ? JSON.parse(text) : {};
    } catch (error) {
        return { error: text || "Invalid server response" };
    }
}

async function fetchCart() {
    const token = getToken();

    if (!token) {
        return { items: [], total: 0, loggedOut: true };
    }

    const res = await fetch(`${API_BASE}/cart`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await readJsonResponse(res);

    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return {
            items: [],
            total: 0,
            loggedOut: true,
            error: "Your login expired. Please login again."
        };
    }

    if (!res.ok) {
        console.log("Failed to fetch cart:", data.error || data);
        return {
            items: [],
            total: 0,
            error: data.error || "Failed to fetch cart"
        };
    }

    return data;
}

function renderCart(cart) {
    const aside = document.querySelector(".right-aside");
    if (!aside) return;

    const items = Array.isArray(cart) ? cart : (cart?.items || []);
    const total = Array.isArray(cart) ? 0 : (cart?.total || 0);

    aside.innerHTML = `<h2>Cart</h2>`;

    if (cart?.loggedOut) {
        aside.innerHTML += `
            <p>Please login first.</p>
            <button onclick="window.location.href='login-register.html'">
                Login / Register
            </button>
        `;
        return;
    }

    if (cart?.error) {
        aside.innerHTML += `<p>${cart.error}</p>`;
        return;
    }

    if (!items || items.length === 0) {
        aside.innerHTML += `<p>Empty</p>`;
        return;
    }

    aside.innerHTML += items.map(item => `
        <div class="cart-item">
            <div><strong>${item.title}</strong></div>
            <div>Qty: ${item.quantity}</div>
            <div>$${Number(item.subtotal).toFixed(2)}</div>
            <button onclick="removeFromCart(${item.book_id})">Remove</button>
        </div>
    `).join("");

    aside.innerHTML += `
        <hr>
        <h3>Total: $${Number(total).toFixed(2)}</h3>
        <button onclick="window.location.href='checkout.html'">Checkout</button>
    `;
}

async function loadCart() {
    const cart = await fetchCart();
    renderCart(cart);
}

async function addToCart(bookId, quantity = 1) {
    const token = getToken();

    if (!token) {
        alert("Please login first before adding books to cart.");
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
            book_id: Number(bookId),
            quantity: Number(quantity)
        })
    });

    const data = await readJsonResponse(res);

    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Your login expired. Please login again.");
        window.location.href = "login-register.html";
        return;
    }

    if (!res.ok) {
        alert(data.error || "Failed to add to cart");
        console.log("Failed to add to cart:", data);
        return;
    }

    alert("Book added to cart.");
    renderCart(data);
}
async function checkout() {
    const token = getToken();

    if (!token) {
        alert("Please login first before checkout.");
        window.location.href = "login-register.html";
        return;
    }

    const deliveryAddress = prompt("Enter your delivery address:");

    if (!deliveryAddress || !deliveryAddress.trim()) {
        alert("Delivery address is required.");
        return;
    }

    const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            delivery_address: deliveryAddress.trim()
        })
    });

    const data = await readJsonResponse(res);

    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Your login expired. Please login again.");
        window.location.href = "login-register.html";
        return;
    }

    if (!res.ok) {
        alert(data.error || "Checkout failed");
        console.log("Checkout failed:", data);
        return;
    }

    alert(`Order placed successfully. Order ID: ${data.order_id}`);
    await loadCart();
}

async function removeFromCart(bookId) {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_BASE}/cart/items/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Your login expired. Please login again.");
        window.location.href = "login-register.html";
        return;
    }
    await loadCart();
}
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.loadCart = loadCart;
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});
window.addEventListener("pageshow", () => {
    loadCart();
});
