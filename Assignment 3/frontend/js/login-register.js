document.addEventListener("DOMContentLoaded", () => {
    // REGISTER
    const registerInputs = document.querySelectorAll(".register input");
    const registerButton = document.querySelector(".register button");

    registerButton.addEventListener("click", async () => {
        const fullName = registerInputs[0].value;
        const email = registerInputs[1].value;
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

        if (!res.ok) {
            console.log("Register failed");
            return;
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);

        window.location.href = "index.html";
    });

    // LOGIN
    const loginInputs = document.querySelectorAll(".login input");
    const loginButton = document.querySelector(".login button");

    loginButton.addEventListener("click", async () => {
        const email = loginInputs[0].value;
        const password = loginInputs[1].value;

        console.log("LOGIN START");

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

        console.log("LOGIN RESPONSE STATUS:", res.status);

        const text = await res.text();
        console.log("RAW RESPONSE:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.log("Response is not valid JSON");
            return;
        }

        localStorage.setItem("token", data.token);

        window.location.href = "index.html";
    });
});