function getCurrentUser() {
    const userText = localStorage.getItem("user");

    if (!userText) {
        return null;
    }

    try {
        return JSON.parse(userText);
    } catch (error) {
        return null;
    }
}

function updateAuthUI() {
    const authBox = document.querySelector(".auth");

    if (!authBox) {
        return;
    }

    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    const isLoginPage = window.location.pathname.includes("login-register");

    if (token && user) {
        if (isLoginPage) {
            window.location.href = "index.html";
            return;
        }
        const fullName = user.full_name || user.name || "User";

        authBox.innerHTML = `
            <h2>Welcome, ${fullName}!</h2>
            <p class="logout-link" style="cursor: pointer;">Logout</p>
        `;

        const logoutLink = authBox.querySelector(".logout-link");

        logoutLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Logged out successfully.");
            window.location.href = "login-register.html";
        });

        return;
    }

    if (isLoginPage) {
        authBox.innerHTML = `
            <h2>Welcome!</h2>
            <p style="cursor: pointer;" onclick="window.location.href='index.html'">Home</p>
        `;
        return;
    }
    authBox.innerHTML = `
        <h2>Welcome!</h2>
        <p style="cursor: pointer;" onclick="window.location.href='login-register.html'">
            Login / Register
        </p>
    `;
}

function makeLogoClickable() {
    const logo = document.querySelector(".left-aside img");

    if (!logo) {
        return;
    }

    logo.style.cursor = "pointer";

    logo.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    makeLogoClickable();
});

window.addEventListener("pageshow", () => {
    updateAuthUI();
});
