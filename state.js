/* =====================================================
   CyberForge State Engine — FINAL STABLE BUILD
   Fixes login refresh loop + jwt malformed
===================================================== */

const CyberState = (() => {

    const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:4000/api"
        : window.location.origin + "/api";

    // NOTE: If you deploy your backend to a DIFFERENT domain (e.g. Render), 
    // replace the second line above with your Render URL (e.g. "https://your-api.onrender.com/api")

    let bootFinished = false;

    /* ---------- TOKEN ---------- */
    function getToken() {
        const token = localStorage.getItem("token");

        // Prevent malformed jwt requests
        if (!token || token === "null" || token === "undefined")
            return null;

        return token;
    }

    function getSession() {
        const token = getToken();
        if (!token) return null;

        return {
            token,
            username: localStorage.getItem("username") || "User"
        };
    }

    function logout(force = true) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        if (force)
            window.location.href = "login.html";
    }

    function requireAuth() {
        if (!getToken())
            window.location.href = "login.html";
    }

    /* ---------- SAFE REQUEST ---------- */
    async function request(endpoint, options = {}) {

        const token = getToken();

        // 🚫 DO NOT call backend if token not ready
        if (!token) {
            console.warn("No token yet — skipping request:", endpoint);
            return null;
        }

        try {
            const res = await fetch(API + endpoint, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                    ...(options.headers || {})
                }
            });

            // If backend says unauthorized AFTER boot → real logout
            if (res.status === 401) {
                if (bootFinished) {
                    console.warn("Session expired");
                    logout(true);
                } else {
                    console.warn("Auth pending — ignoring during boot");
                }
                return null;
            }

            const data = await res.json();
            bootFinished = true;
            return data;

        } catch (err) {
            console.warn("Backend not reachable yet");
            return null;
        }
    }

    /* ---------- PROGRESS ---------- */
    async function getProgress() {
        const progress = await request("/progress");
        if (!progress) return null;

        // Calculate path-specific XP locally based on completed topics
        // Cybersecurity topics have no prefix or "cyber_"
        // AI topics start with "ai_"
        const completed = progress.completedTopics || [];

        // Use a flat 10 XP per unique completed topic for path calculation 
        // (This matches the logic of 10 XP per set if we assume topics represent sets)
        // However, the backend returns total XP, so we should ideally have the backend track this.
        // For now, let's derive it from completedTopics strictly for locking logic.
        // Calculate path-specific XP from history to allow increments on repeats
        const history = progress.history || [];

        if (history.length > 0) {
            progress.cyberXP = history
                .filter(h => !h.topicId?.startsWith('ai_'))
                .length * 10;
            progress.aiXP = history
                .filter(h => h.topicId?.startsWith('ai_'))
                .length * 10;
        } else {
            // FALLBACK: Use unique completed topics if history is missing (old data)
            const completed = progress.completedTopics || [];
            progress.cyberXP = completed.filter(t => !t.startsWith('ai_')).length * 10;
            progress.aiXP = completed.filter(t => t.startsWith('ai_')).length * 10;
        }

        // Override total XP with path sum to stay in sync with 10XP per set rule
        // progress.xp = progress.cyberXP + progress.aiXP; 

        return progress;
    }

    async function completeTopic(topicId, scorePercent = 0, correct = 0) {
        return await request("/progress/complete-topic", {
            method: "POST",
            body: JSON.stringify({ topicId, scorePercent, correct })
        });
    }

    async function grantXP(amount, topicId = null) {
        return await request("/progress/grant-xp", {
            method: "POST",
            body: JSON.stringify({ amount, topicId })
        });
    }

    /* ---------- CONFIG ---------- */
    const LEVEL_CONFIG = {
        cybersecurity: { intermediate: 120, professional: 240 },
        ai: { intermediate: 120, professional: 240 }
    };

    /* ---------- USER ---------- */
    function getCurrentUser() {
        const session = getSession();
        if (!session) return null;
        return { name: session.username };
    }

    return {
        logout,
        requireAuth,
        getCurrentUser,
        getProgress,
        completeTopic,
        grantXP,
        getSession,
        request,
        LEVEL_CONFIG
    };

})();