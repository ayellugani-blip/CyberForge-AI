const API_BASE = window.API_BASE_URL || "http://localhost:4000";

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    const container = document.getElementById("modulesContainer");

    if (!token) {
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: rgba(255,255,255,0.05); border-radius: 20px; border: 1px solid rgba(127,0,255,0.2);">
                    <h3 style="color: #b784ff; margin-bottom: 10px;">Enrolled Session Required</h3>
                    <p style="color: rgba(255,255,255,0.6);">Please <a href="login.html" style="color: #00ff88; text-decoration: underline;">log in</a> to access your AI Security course modules and track progress.</p>
                </div>
            `;
        }
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/courses/ai_security`);
        const course = await res.json();

        container.innerHTML = "";

        course.modules.forEach(module => {
            const div = document.createElement("div");
            div.classList.add("module-card");

            div.innerHTML = `
                <h3>${module.title}</h3>
                <p>Duration: ${module.duration} mins</p>
                <a href="${API_BASE}${module.pdf}" target="_blank">Download PDF</a>
                <button data-id="${module.moduleId}">Mark Complete</button>
            `;

            const button = div.querySelector("button");

            button.addEventListener("click", async () => {
                await fetch(`${API_BASE}/api/progress/complete-module`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        courseId: "ai_security",
                        moduleId: module.moduleId
                    })
                });

                alert("Module Completed + XP Awarded");
            });

            container.appendChild(div);
        });

    } catch (err) {
        console.error("Course load error:", err);
    }
});