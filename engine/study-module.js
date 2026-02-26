const API = "http://localhost:4000";

async function loadStudyModule(topicId) {

    try {
        const res = await fetch(`${API}/api/study-module/${topicId}`);
        if (!res.ok) return;

        const module = await res.json();

        const container = document.getElementById("studyModuleContainer");

        container.innerHTML = `
            <div class="pdf-card">
                <div class="pdf-info">
                    <h2>${module.title}</h2>
                    <p>${module.description}</p>
                </div>
                <a class="pdf-btn" href="${API}${module.pdf}" target="_blank">
                    Download PDF
                </a>
            </div>
        `;

    } catch (err) {
        console.error("Module load error:", err);
    }
}