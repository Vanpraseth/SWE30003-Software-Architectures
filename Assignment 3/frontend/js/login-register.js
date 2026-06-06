document.addEventListener("DOMContentLoaded", () => {
    const registerInputs = document.querySelectorAll(".register input");
    const registerButton = document.querySelector(".register button");

    registerButton.addEventListener("click", async () => {
        const fullName = registerInputs[0].value.trim();
        const email = registerInputs[1].value.trim();
        const password = registerInputs[2].value;

        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name: fullName,
                email,
                password
            })
        });

        const registerData = await res.json().catch(() => ({}));

        if (!res.ok) {
            alert(registerData.error || "Register failed");
            console.log("Register failed:", registerData);
            return;
        }

        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const loginData = await loginRes.json().catch(() => ({}));

        if (!loginRes.ok || !loginData.token) {
            alert("Registered successfully, but auto-login failed. Please login manually.");
            console.log("Auto login failed:", loginData);
            return;
        }

        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify(loginData.user));

        alert("Registered and logged in successfully.");
        window.location.href = "index.html";
    });

    const loginInputs = document.querySelectorAll(".login input");
    const loginButton = document.querySelector(".login button");

    loginButton.addEventListener("click", async () => {
        const email = loginInputs[0].value.trim();
        const password = loginInputs[1].value;

        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.token) {
            alert(data.error || "Login failed");
            console.log("Login failed:", data);
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Logged in successfully.");
        window.location.href = "index.html";
    });
});
