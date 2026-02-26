/* =========================================
   AUTH UI CONTROLLER (STABLE)
   Prevents redirect race condition
========================================= */

window.CyberForge = {
    user: null,
    ready: false
};

async function waitForToken() {
    // wait max 500ms for storage commit
    for (let i = 0; i < 10; i++) {
        const token = localStorage.getItem("token");
        if (token && token.length > 20) return token;
        await new Promise(r => setTimeout(r, 50));
    }
    return null;
}

async function updateAuthUI() {
    const token = await waitForToken();

    const joinBtn = document.getElementById("joinbtn");
    const profileIcon = document.getElementById("profileIcon");
    const loginIcon = document.getElementById("loginIcon");
    const joinNavItem = document.getElementById("joinNavItem");
    const profileNavItem = document.getElementById("profileNavItem");

    const isTopicPage = () => {
        const path = window.location.pathname.toLowerCase();
        const topics = [
            "cybersecurity.html", "ai.html", "topic.html", "adversarial-ai.html",
            "ai-hunting.html", "ai-automation.html", "ai-policy.html", "identity.html",
            "threat.html", "communication.html", "defense.html", "quiz.html",
            "password.html", "phishing.html"
        ];
        return topics.some(t => path.includes(t));
    };

    const hideOnTopic = isTopicPage();

    if (token) {
        console.log("User detected -> Logged in");

        window.CyberForge.user = {
            name: localStorage.getItem("username") || "User"
        };

        if (joinBtn) joinBtn.style.display = "none";
        if (loginIcon) loginIcon.style.display = "none";
        if (joinNavItem) joinNavItem.style.display = "none";

        // Hide profile icon/item only on topic pages as requested
        if (hideOnTopic) {
            if (profileIcon) {
                profileIcon.style.setProperty("display", "none", "important");
                profileIcon.style.visibility = "hidden";
            }
            if (profileNavItem) {
                profileNavItem.style.setProperty("display", "none", "important");
                profileNavItem.style.visibility = "hidden";
            }
        } else {
            if (profileIcon) {
                profileIcon.style.display = "inline-block";
                profileIcon.style.visibility = "visible";
            }
            if (profileNavItem) {
                profileNavItem.style.display = "block";
                profileNavItem.style.visibility = "visible";
            }
        }

    } else {
        console.log("User detected -> Guest");

        // Guests should still see the join button on topic pages
        if (joinBtn) joinBtn.style.display = "inline-block";
        if (loginIcon) loginIcon.style.display = "inline-block";
        if (joinNavItem) joinNavItem.style.display = "block";

        if (profileIcon) profileIcon.style.display = "none";
        if (profileNavItem) profileNavItem.style.display = "none";

    }

    window.CyberForge.ready = true;
}

/* Wait until DOM AND storage stable */
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(updateAuthUI, 120);
});