console.log("LOGIN JS LOADED");

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (registerBtn)
        registerBtn.addEventListener('click', () => container.classList.add("active"));

    if (loginBtn)
        loginBtn.addEventListener('click', () => container.classList.remove("active"));

    /* ================= REGISTER ================= */
    const signUpForm = document.getElementById('signUpForm');

    if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            try {
                const res = await fetch("http://localhost:4000/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await res.json();

                if (!res.ok) return alert(data.msg || "Registration failed");

                alert("Account created! Please Sign In.");
                container.classList.remove("active");

            } catch {
                alert("Backend not reachable");
            }
        });
    }

    /* ================= LOGIN (FINAL FIX) ================= */
    const signInForm = document.getElementById("signInForm");

    if (signInForm) {
        signInForm.addEventListener("submit", async (e) => {

            e.preventDefault();
            e.stopPropagation();

            console.log("LOGIN SUBMIT DETECTED");

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!email || !password)
                return alert("Enter email & password");

            try {
                const res = await fetch("http://localhost:4000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                console.log("SERVER RESPONSE:", data);

                if (!res.ok)
                    return alert(data.msg || "Invalid credentials");

                /* STORE SESSION ONLY */
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.name);

                console.log("LOGIN SUCCESS → Redirecting to dashboard");

                // Important: NO API CALLS HERE
                // Dashboard will validate session itself
                window.location.replace("cyber.html");

            } catch {
                alert("Server offline");
            }
        });
    }
});