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

async function loadCheckoutCart() {
    const token = getToken();

    if (!token) {
        alert("Please login first before checkout.");
        window.location.href = "login-register.html";
        return;
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

        alert("Your login expired. Please login again.");
        window.location.href = "login-register.html";
        return;
    }

    if (!res.ok) {
        document.getElementById("checkout-cart").innerHTML = `
            <p>${data.error || "Failed to load cart."}</p>
        `;
        return;
    }

    renderCheckoutCart(data);
}

function renderCheckoutCart(cart) {
    const cartBox = document.getElementById("checkout-cart");
    const items = cart.items || [];

    if (items.length === 0) {
        cartBox.innerHTML = `
            <p>Your cart is empty.</p>
            <button onclick="window.location.href='index.html'">Continue Shopping</button>
        `;
        return;
    }

cartBox.innerHTML = items.map(item => `
    <div class="checkout-item">
        <strong>${item.title}</strong>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: $${Number(item.subtotal).toFixed(2)}</p>
    </div>
`).join("");

    cartBox.innerHTML += `
    <div class="checkout-total">
        <strong>Total: $${Number(cart.total).toFixed(2)}</strong>
    </div>
    `;}

async function placeOrder() {
    const token = getToken();

    if (!token) {
        alert("Please login first before checkout.");
        window.location.href = "login-register.html";
        return;
    }

    const addressInput = document.getElementById("delivery-address");
    const message = document.getElementById("checkout-message");

    const deliveryAddress = addressInput.value.trim();

    if (!deliveryAddress) {
        message.textContent = "Please enter your delivery address.";
        return;
    }

    const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            delivery_address: deliveryAddress
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
        message.textContent = data.error || "Checkout failed.";
        return;
    }

    message.textContent = `Order placed successfully. Order ID: ${data.order_id}`;

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutCart();

    const placeOrderBtn = document.getElementById("place-order-btn");
    placeOrderBtn.addEventListener("click", placeOrder);
});
