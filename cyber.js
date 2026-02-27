// cyber.js - ULTIMATE HACKATHON VERSION (100% Bug-Free + CLICK-TO-REVEAL)
// cybersecurity.html BUTTONS WORK + All Features Perfect + Topic Reveal Fixed

// ================= GLOBAL STATE =================
let currentDate = new Date();
let stars = [];
let rafId = null;
let isAnimating = false;

// ================= SINGLE ENTRY POINT =================
document.addEventListener('DOMContentLoaded', function () {

    checkLoginStatus();

    // Refresh dashboard on focus to ensure XP sync
    window.addEventListener('focus', () => {
        const dashboard = document.querySelector('.dashboard');
        if (dashboard && dashboard.offsetParent !== null) {
            loadUserDashboard();
        }
    });


    // Boot sequence OR direct init
    const bootScreen = document.getElementById("bootScreen");
    const hasBooted = sessionStorage.getItem("hasBooted");

    if (bootScreen && !hasBooted) {
        runBootSequence();
    } else {
        if (bootScreen) bootScreen.style.display = "none";
        initApp();
        loadUserDashboard();
    }

    initProfileDropdown();
});

// ================= PERFECT LOGIN SYSTEM =================
function checkLoginStatus() {
    const session = CyberState.getSession();
    const isLoggedIn = session !== null;

    // Hero button
    const joinBtn = document.getElementById("joinbtn");
    if (joinBtn) joinBtn.style.display = isLoggedIn ? "none" : "block";

    // Nav items
    const joinNavItem = document.getElementById("joinNavItem");
    const profileNavItem = document.getElementById("profileNavItem");
    const welcomeUser = document.getElementById("welcomeUser");

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

    if (joinNavItem) {
        joinNavItem.style.display = isLoggedIn ? "none" : "block";
    }

    if (profileNavItem) {
        if (isLoggedIn && hideOnTopic) {
            profileNavItem.style.setProperty("display", "none", "important");
            profileNavItem.style.visibility = "hidden";
        } else {
            profileNavItem.style.display = isLoggedIn ? "block" : "none";
            profileNavItem.style.visibility = isLoggedIn ? "visible" : "hidden";
        }
    }

    if (welcomeUser) welcomeUser.textContent = `Hi, ${session?.username || "User"}`;
}

function logoutUser() {
    CyberState.logout();
    location.reload();
}

function openLoginPage() {
    window.location.href = 'login.html';
}

// ================= LEARNING PATH BUTTONS =================
function toggleLevel(id) {
    const card = document.getElementById(id).closest(".level-card");

    // Check if locked
    if (card.classList.contains("locked")) {
        triggerLockShake(card);
        return;
    }

    // Close all other sections first
    document.querySelectorAll(".topics-wrapper").forEach(section => {
        if (section.id !== id) {
            section.style.maxHeight = null;
            const icon = section.parentElement.querySelector(".level-arrow i");
            if (icon) icon.style.transform = "rotate(0deg)";
        }
    });

    const wrapper = document.getElementById(id);
    if (!wrapper) return;

    const arrow = wrapper.parentElement.querySelector(".level-arrow i");

    // Toggle current section
    if (wrapper.style.maxHeight) {
        wrapper.style.maxHeight = null;
        if (arrow) arrow.style.transform = "rotate(0deg)";
    } else {
        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        if (arrow) arrow.style.transform = "rotate(180deg)";
    }
}

function openTopic(topicId, level = "beginner") {
    window.location.href = `topic.html?topic=${topicId}&level=${level}`;
}

// ================= CLICK-TO-REVEAL FUNCTIONS (NEW) =================
function initClickToReveal() {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.onclick = function () {
            this.classList.toggle('revealed');
        };
    });
}

// ================= BOOT SCREEN =================
function runBootSequence() {
    const bootScreen = document.getElementById("bootScreen");
    const bootText = document.getElementById("bootText");

    const bootLines = [
        "Initializing CyberForge AI...",
        "Loading security modules...",
        "Establishing encrypted channel...",
        "Launching AI Core...",
        "System Ready."
    ];

    let lineIndex = 0, charIndex = 0;

    function typeLine() {
        if (lineIndex < bootLines.length) {
            if (charIndex < bootLines[lineIndex].length) {
                bootText.innerHTML += bootLines[lineIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeLine, 30);
            } else {
                bootText.innerHTML += "<br/>";
                charIndex = 0;
                lineIndex++;
                setTimeout(typeLine, 400);
            }
        } else {
            setTimeout(() => {
                sessionStorage.setItem("hasBooted", "true");
                bootScreen.style.display = "none";
                initApp();
                loadUserDashboard();
            }, 800);
        }
    }
    typeLine();
}

// ================= MAIN APP =================
function initApp() {
    initStarfield();  // 100 stars max - mobile safe
    initHologram();

    // Page-specific
    if (document.getElementById("calendar")) generateCalendar();
    if (document.getElementById("progressCircle")) animateProgress(78);
    if (document.getElementById("chartCanvas")) drawChart();

    initScrollReveal();
    initCalendarClicks();
    initClickToReveal();
    initLevelLocking();  // Initialize locks and completion status
    initRankBadge();     // Global Rank UI
    initNewsSection();   // [NEW] Trending News
    initEmailReveal();   // [NEW] Footer Email Reveal
}

// ================= RANK BADGE UI =================
function initRankBadge() {
    // wait until backend progress arrives
    if (!window.CyberForge || !window.CyberForge.ready) {
        document.addEventListener("cyberforgeReady", initRankBadge, { once: true });
        return;
    }

    const progress = window.CyberForge?.progress;
    if (!progress) return; // Only show if logged in

    const isAIPage = window.location.pathname.includes("AI.html");
    const isCyberPage = window.location.pathname.includes("cybersecurity.html");

    // Hide badge and remove themes on the main Dashboard (home page)
    if (!isAIPage && !isCyberPage) {
        const existingBadge = document.getElementById("globalRankBadge");
        if (existingBadge) existingBadge.style.display = "none";
        document.body.classList.remove("theme-bronze", "theme-silver", "theme-gold");
        return;
    }

    // Use path-specific XP for sub-pages
    let currentXP = 0;
    let pathLabel = "";

    if (isAIPage) {
        currentXP = progress.aiXP || 0;
        pathLabel = "CYBER AI";
    } else if (isCyberPage) {
        currentXP = progress.cyberXP || 0;
        pathLabel = "CYBERSECURITY";
    }

    let rank = "Bronze";
    let theme = "bronze";
    let icon = "fa-shield";

    if (currentXP >= 240) {
        rank = "Gold";
        theme = "gold";
        icon = "fa-crown";
    } else if (currentXP >= 120) {
        rank = "Silver";
        theme = "silver";
        icon = "fa-medal";
    }

    // Apply theme to body for global styling
    document.body.classList.remove("theme-bronze", "theme-silver", "theme-gold");
    document.body.classList.add(`theme-${theme}`);

    // Create/Update badge
    let badge = document.getElementById("globalRankBadge");
    if (!badge) {
        badge = document.createElement("div");
        badge.id = "globalRankBadge";
        badge.className = "rank-badge";
        const nav = document.querySelector(".main-nav");
        if (nav) nav.parentNode.insertBefore(badge, nav.nextSibling);
    }

    badge.className = `rank-badge rank-${theme}`;
    badge.innerHTML = `
        <div class="rank-icon-wrapper">
            <i class="fa-solid ${icon}"></i>
        </div>
        <div class="rank-info">
            <span class="rank-label">${pathLabel} RANK</span>
            <span class="rank-name">${rank}</span>
        </div>
        <div class="rank-xp-display">${currentXP} XP</div>
    `;
}

// ================= LEVEL LOCKING LOGIC =================
function initLevelLocking() {

    // wait until backend progress arrives
    if (!window.CyberForge || !window.CyberForge.ready) {
        console.log("Waiting for backend progress...");
        document.addEventListener("cyberforgeReady", initLevelLocking, { once: true });
        return;
    }

    const progress = window.CyberForge.progress;
    const isLoggedIn = !!progress;
    const completedTopics = progress?.completedTopics || [];

    // Get current page context (Cybersecurity or AI)
    const isAIPage = window.location.pathname.includes("AI.html");
    const config = isAIPage ? CyberState.LEVEL_CONFIG.ai : CyberState.LEVEL_CONFIG.cybersecurity;

    const levelCards = document.querySelectorAll(".level-card");
    if (!levelCards.length) return;

    // Level unlocking logic based on XP milestones
    levelCards.forEach((card, index) => {
        const header = card.querySelector(".level-header");

        // Add lock icon if not present
        if (!header.querySelector(".lock-status-icon")) {
            const icon = document.createElement("i");
            icon.className = "fa-solid lock-status-icon";
            header.insertBefore(icon, header.firstChild);
        }

        const statusIcon = header.querySelector(".lock-status-icon");

        // Use path-specific XP for locking
        const pathXP = isAIPage ? (progress?.aiXP || 0) : (progress?.cyberXP || 0);

        if (index === 0) {
            // Beginner level - Always unlocked
            unlockLevel(card, statusIcon);
        } else if (index === 1) {
            // Intermediate level - 120 path-specific XP
            if (isLoggedIn && pathXP >= 120) {
                unlockLevel(card, statusIcon);
            } else {
                lockLevel(card, statusIcon);
            }
        } else if (index === 2) {
            // Professional level - 240 path-specific XP
            if (isLoggedIn && pathXP >= 240) {
                unlockLevel(card, statusIcon);
            } else {
                lockLevel(card, statusIcon);
            }
        }
    });

    // Handle session-based unlocking (for demo/instant feedback if progress changes)
    checkUnlockingAnimation(levelCards, config, completedTopics, isLoggedIn);
}

function lockLevel(card, icon) {
    card.classList.remove("unlocked");
    card.classList.add("locked");
    icon.className = "fa-solid fa-lock lock-status-icon";
}

function unlockLevel(card, icon) {
    card.classList.remove("locked");
    card.classList.add("unlocked");
    icon.className = "fa-solid fa-lock-open lock-status-icon";
}

function triggerLockShake(card) {
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 400);

    const isAIPage = window.location.pathname.includes("AI.html");
    const pathXP = isAIPage ? (window.CyberForge?.progress?.aiXP || 0) : (window.CyberForge?.progress?.cyberXP || 0);
    const pathName = isAIPage ? "AI path" : "Cybersecurity path";

    let msg = !CyberState.getSession() ? "Access Denied: Please log in first." : "Access Denied: Reach the XP milestone to unlock this level.";

    if (CyberState.getSession()) {
        const nextMilestone = card.querySelector("h3").textContent.includes("Intermediate") ? 120 : 240;
        msg = `Access Denied: You need ${nextMilestone} XP in the ${pathName} to unlock this level. Your current ${pathName} XP: ${pathXP}`;
    }

    console.log(msg);
    alert(msg);
}

function checkUnlockingAnimation(cards, config, completedTopics, isLoggedIn) {
    // Check if a level was JUST unlocked (simulate for UX)
    const lastUnlocked = sessionStorage.getItem("lastUnlockedLevel");

    cards.forEach((card, index) => {
        if (index > 0 && !card.classList.contains("locked")) {
            const levelId = index === 1 ? "intermediate" : "professional";
            if (sessionStorage.getItem(`unlock_anim_${levelId}`) === "pending") {
                card.classList.add("unlocking");
                sessionStorage.removeItem(`unlock_anim_${levelId}`);
                setTimeout(() => card.classList.remove("unlocking"), 2000);
            }
        }
    });
}

// ================= OPTIMIZED STARS (100 max) =================
function initStarfield() {
    const canvas = document.getElementById("starCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        speed: Math.random() * 5 + 3 // Increased speed and base
    }));

    isAnimating = true;
    animateStars(ctx);
}

function animateStars(ctx) {
    if (!isAnimating || !ctx) return;

    ctx.fillStyle = "rgba(5, 5, 9, 0.3)"; // Brighter trails
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    stars.forEach(star => {
        star.z -= star.speed;
        if (star.z <= 0) star.z = ctx.canvas.width;

        const px = (star.x - ctx.canvas.width / 2) * (ctx.canvas.width / star.z) + ctx.canvas.width / 2;
        const py = (star.y - ctx.canvas.height / 2) * (ctx.canvas.width / star.z) + ctx.canvas.height / 2;
        const size = (1 - star.z / ctx.canvas.width) * 6.5 + 0.5; // Larger stars

        // Determine star color based on difficulty level or theme
        let starColor = "#7f00ff"; // default purple

        if (document.body.classList.contains("theme-bronze"))
            starColor = "#cd7f32";        // bronze
        else if (document.body.classList.contains("theme-silver"))
            starColor = "#c0c0c0";        // silver
        else if (document.body.classList.contains("theme-gold"))
            starColor = "#ffd700";        // gold
        else if (document.body.classList.contains("theme-puzzle"))
            starColor = "#00ffcc";        // puzzle (mint)
        else if (document.body.classList.contains("theme-escape"))
            starColor = "#ffb800";        // escape (amber)
        else if (document.body.classList.contains("theme-scenario"))
            starColor = "#ff1a4a";        // scenario (crimson)
        else if (document.body.classList.contains("beginner-theme"))
            starColor = "#00aaff";        // beginner (blue)
        else if (document.body.classList.contains("intermediate-theme"))
            starColor = "#00ff88";        // intermediate (green)
        else if (document.body.classList.contains("professional-theme"))
            starColor = "#ff2a2a";        // professional (red)
        else if (document.body.classList.contains("theme-purple"))
            starColor = "#7f00ff";        // purple theme

        ctx.fillStyle = starColor;
        ctx.shadowBlur = size * 2; // Glow effect
        ctx.shadowColor = starColor;

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow for performance
        ctx.shadowBlur = 0;

    });

    rafId = requestAnimationFrame(() => animateStars(ctx));
}

// ================= RESIZE (THROTTLED) =================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const canvas = document.getElementById("starCanvas");
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStarfield();
        }
    }, 250);
});

// ================= HOLOGRAM =================
function initHologram() {
    const hologram = document.querySelector(".ai-hologram");
    const coreText = document.getElementById("coreWord");
    if (!coreText || !hologram) return;

    const words = ["Train", "Hack", "Defend"];
    const themes = ["hologram-train", "hologram-hack", "hologram-defend"];
    let wordIndex = 0;

    // Initial state
    hologram.classList.add(themes[0]);

    setInterval(() => {
        coreText.classList.remove("core-animate-in");
        coreText.classList.add("core-animate-out");

        setTimeout(() => {
            // Remove previous theme class
            hologram.classList.remove(themes[wordIndex]);

            // Update indices
            wordIndex = (wordIndex + 1) % words.length;

            // Apply new word and theme
            coreText.textContent = words[wordIndex];
            hologram.classList.add(themes[wordIndex]);

            coreText.classList.remove("core-animate-out");
            coreText.classList.add("core-animate-in");
        }, 2200);
    }, 4000);
}

// ================= CALENDAR + MODAL =================
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    generateCalendar();
}

function generateCalendar() {
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");
    if (!calendar || !monthYear) return;

    calendar.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = currentDate.toLocaleString("default", { month: "long" }) + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement("div");
        dayCell.className = "calendar-day";
        dayCell.textContent = day;
        dayCell.onclick = () => openModal(day);

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add("today-live");
        }

        calendar.appendChild(dayCell);
    }
}

function initCalendarClicks() {
    const calendarDays = document.querySelectorAll(".calendar-day");
    calendarDays.forEach(day => {
        day.onclick = () => openModal(parseInt(day.textContent));
    });
}

function openModal(day) {
    const modal = document.getElementById("taskModal");
    const modalDate = document.getElementById("modalDate");
    const taskList = document.getElementById("taskList");
    if (modal && modalDate && taskList) {
        modal.style.display = "block";
        const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        modalDate.textContent = `Tasks for ${currentDate.toLocaleString('default', { month: 'long' })} ${day}`;

        // Load tasks from CyberState
        taskList.innerHTML = "";
        const tasks = CyberState.getTasks(day);
        tasks.forEach(t => renderTask(t));
    }
}

function renderTask(taskText) {
    const taskList = document.getElementById("taskList");
    const newTask = document.createElement("li");
    newTask.innerHTML = `
        ${taskText}
        <div class="task-actions">
            <button onclick="toggleTask(this)">✓</button>
            <button onclick="deleteTask(this)">✕</button>
        </div>
    `;
    taskList.appendChild(newTask);
}

function closeModal() {
    const modal = document.getElementById("taskModal");
    if (modal) modal.style.display = "none";
}

function saveTask() {
    const taskInput = document.getElementById("taskInput");
    const modalDate = document.getElementById("modalDate");

    if (taskInput && taskInput.value.trim()) {
        const day = modalDate.textContent.split(" ").pop();
        const text = taskInput.value.trim();

        CyberState.saveTask(day, text);
        renderTask(text);
        taskInput.value = "";
    }
}

function toggleTask(btn) {
    const li = btn.closest("li");
    li.classList.toggle("completed");
}

function deleteTask(btn) {
    const li = btn.closest("li");
    li.remove();
}

// ================= CHARTS =================
function drawChart(dataPoints = [0, 0, 0, 0, 0, 0, 0], labels = ["T-6", "T-5", "T-4", "T-3", "T-2", "T-1", "NOW"]) {
    const chartCanvas = document.getElementById("chartCanvas");
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext("2d");
    const container = chartCanvas.parentElement;
    const padding = { top: 30, right: 30, bottom: 40, left: 50 };

    // Set actual display size
    const width = container.clientWidth - 40;
    const height = 220;

    chartCanvas.style.width = width + "px";
    chartCanvas.style.height = height + "px";

    // Scale for high DPI
    const dpr = window.devicePixelRatio || 1;
    chartCanvas.width = width * dpr;
    chartCanvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // 1. Draw Grid Lines (Horizontal)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.font = "10px 'Orbitron', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.textAlign = "right";

    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        const val = 100 - (i * 25);

        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        ctx.fillText(val + "%", padding.left - 10, y + 4);
    }

    // 2. Draw X-Axis Labels
    ctx.textAlign = "center";
    dataPoints.forEach((_, index) => {
        const x = padding.left + (index / (dataPoints.length - 1)) * chartWidth;
        ctx.fillText(labels[index], x, height - 15);
    });

    // 3. Create Gradient for Area
    const areaGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    areaGradient.addColorStop(0, "rgba(127, 0, 255, 0.3)");
    areaGradient.addColorStop(1, "rgba(127, 0, 255, 0)");

    // 4. Draw the Line and Fill
    const points = dataPoints.map((val, index) => ({
        x: padding.left + (index / (dataPoints.length - 1)) * chartWidth,
        y: padding.top + chartHeight - (val / 100) * chartHeight
    }));

    // Draw Fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartHeight);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = areaGradient;
    ctx.fill();

    // Draw Line
    ctx.beginPath();
    ctx.strokeStyle = "#a252ff";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(162, 82, 255, 0.8)";
    ctx.shadowBlur = 10;

    points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    ctx.shadowBlur = 0; // Reset shadow

    // 5. Draw Data Markers and Values
    points.forEach((p, i) => {
        // Outer glow circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(162, 82, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Value Label on top
        ctx.fillStyle = "#00ff88";
        ctx.font = "bold 11px Arial";
        ctx.fillText(Math.round(dataPoints[i]) + "%", p.x, p.y - 12);
    });
}

function animateProgress(percent) {
    const circle = document.getElementById("progressCircle");
    const text = document.getElementById("progressPercent");
    if (!circle || !text) return;

    // Radius 65 -> Circumference = 2 * PI * 65 = ~408
    const circumference = 408;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = offset;
    text.textContent = Math.round(percent) + "%";
}

// ================= SCROLL REVEAL =================
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    const checkReveal = () => {
        reveals.forEach(section => {
            const elementTop = section.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 50) {
                section.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", checkReveal);
    checkReveal(); // Run once on load
}

// ================= PROFILE DROPDOWN =================
function initProfileDropdown() {
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            profileDropdown.style.display = profileDropdown.style.display === 'flex' ? 'none' : 'flex';
        });

        document.addEventListener('click', function (e) {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }
}

async function loadUserDashboard() {
    const progress = await CyberState.getProgress();
    console.log("Dashboard State Loaded:", progress);

    // Set global data for locking logic
    window.CyberForge = {
        ready: true,
        progress: progress
    };
    document.dispatchEvent(new CustomEvent("cyberforgeReady"));

    const xpCard = document.querySelector(".dash-card.large h1");

    if (!progress) {
        if (xpCard) xpCard.textContent = "0 XP";
        return;
    }

    // 1. XP & Stats
    const cyberXPValue = document.getElementById("cyberXPValue");
    const aiXPValue = document.getElementById("aiXPValue");

    if (cyberXPValue) cyberXPValue.textContent = (progress.cyberXP || 0) + " XP";
    if (aiXPValue) aiXPValue.textContent = (progress.aiXP || 0) + " XP";

    // Target specific cards for remainder
    const dashCards = document.querySelectorAll(".dash-card");
    let ctfCard, hoursCard;

    // Use loop to find by content/title if possible, or reliable indices
    // The new merged XP card is index 1 (col-4), Chart is 0 (col-8)
    // CTF and Hours follow
    ctfCard = dashCards[2]?.querySelector("h1");
    hoursCard = dashCards[3]?.querySelector("h1");

    if (ctfCard) ctfCard.textContent = (progress.completedTopics?.length || 0);
    if (hoursCard) hoursCard.textContent = Math.max(17, Math.round(progress.xp / 10)) + " hrs";

    // 2. Real-time Graph Data
    const history = progress.history || [];
    let chartData = [10, 15, 12, 18, 25, 30, 28]; // Baseline growth for new users
    let chartLabels = ["T-6", "T-5", "T-4", "T-3", "T-2", "T-1", "NOW"];

    if (history.length > 0) {
        // Take last 7 scores or pad with 0
        const recentScores = history.slice(-7).map(h => h.score);
        while (recentScores.length < 7) {
            recentScores.unshift(0);
        }
        chartData = recentScores;
    }
    drawChart(chartData, chartLabels);

    // 3. XP Progress (Ring)
    const progressRing = document.querySelector(".progress-text");
    if (progressRing) {
        // Assume next milestone for beginner is 100 XP
        const milestone = progress.xp < 100 ? 100 : (progress.xp < 200 ? 200 : 500);
        const percent = Math.min(100, (progress.xp / milestone) * 100);
        animateProgress(percent);
        const ringLabel = document.getElementById("progressPercent");
        if (ringLabel) ringLabel.textContent = progress.xp + " XP";
    }

    // Ensure rank badge and theme are updated
    initRankBadge();
}

function triggerRankCelebration(badge) {
    const overlay = document.getElementById("rankCelebration");
    const label = document.getElementById("newRankLabel");

    if (!overlay || !label) return;

    label.textContent = badge.name;
    overlay.classList.add("active");

    // Add content structure if missing
    if (!overlay.querySelector(".celebration-content")) {
        overlay.innerHTML = `
            <div class="celebration-content">
                <h1 style="font-size: 60px; color: #00ff88; text-shadow: 0 0 20px #00ff88;">RANK UP!</h1>
                <div class="badge-hex tier-${badge.tier}" style="margin: 30px auto; transform: scale(1.5);">
                    <i class="fa-solid ${badge.icon}"></i>
                </div>
                <h2 style="font-size: 30px; color: #fff;">${badge.name}</h2>
                <p style="color: rgba(255,255,255,0.7); margin-top: 15px;">Achievement Unlocked</p>
                <button onclick="this.parentElement.parentElement.classList.remove('active')" class="cta" style="margin-top: 30px;">AWESOME</button>
            </div>
        `;
    }

    // Auto-hide after 5s if they don't click
    setTimeout(() => {
        overlay.classList.remove("active");
    }, 6000);
}


function userLoggedIn() {
    return CyberState.getCurrentUser() !== null;
}

/* ================= NEWS HUB LOGIC ================= */
async function initNewsSection() {
    const newsGrid = document.getElementById("newsGrid");
    if (!newsGrid) return;

    // 1. Show Loading Skeletons
    showNewsSkeletons(newsGrid);

    try {
        // 2. Fetch News from API
        const response = await fetch(`${window.API_BASE_URL}/api/news`, { cache: 'no-store' });
        if (!response.ok) throw new Error("News source unavailable");

        const newsData = await response.json();

        // 3. Render News Cards
        renderNewsCards(newsGrid, newsData);

    } catch (err) {
        console.error("News Fetch Error:", err);
        newsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: rgba(255,255,255,0.4);">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 15px; color: #00f3ff;"></i>
                <p style="margin-bottom: 20px;">Unable to synchronize with intelligence feeds. Please check back shortly.</p>
                <button onclick="initNewsSection()" class="news-btn" style="display: inline-block; cursor: pointer;">RETRY SYNC</button>
            </div>
        `;
    }
}

function showNewsSkeletons(container) {
    container.innerHTML = Array(5).fill(0).map(() => `
        <div class="briefing-item" style="opacity: 1; transform: none; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div class="skeleton" style="width: 40px; height: 40px; border-radius: 50%;"></div>
            <div class="item-content">
                <div class="skeleton" style="width: 80%; height: 20px; margin-bottom: 10px;"></div>
                <div class="skeleton" style="width: 40%; height: 14px;"></div>
            </div>
            <div class="skeleton" style="width: 100px; height: 24px; border-radius: 4px;"></div>
            <div class="skeleton" style="width: 120px; height: 38px; border-radius: 6px;"></div>
        </div>
    `).join('');
}

function renderNewsCards(container, news) {
    // Sort just in case backend isn't perfect
    const sortedNews = [...news].sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));

    container.innerHTML = sortedNews.map((item, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-top-${rank}` : '';

        // Truncate summary to max 20 words
        const summaryArr = item.description.split(' ');
        const truncatedSummary = summaryArr.length > 20
            ? summaryArr.slice(0, 20).join(' ') + "..."
            : item.description;

        return `
            <div class="briefing-item ${rankClass}" data-rank="${rank}">
                <div class="rank-number">#${rank}</div>
                <div class="item-content">
                    <h3>${item.title}</h3>
                    <div class="item-meta">
                        <span><i class="fa-solid fa-paper-plane" style="margin-right: 5px;"></i> ${item.source}</span>
                        <span><i class="fa-regular fa-calendar" style="margin-right: 5px;"></i> ${item.pubDate}</span>
                    </div>
                    <p class="item-summary">${truncatedSummary}</p>
                </div>
                <div class="briefing-category">${item.category}</div>
                <a href="${item.link}" target="_blank" class="briefing-btn">READ INTEL</a>
            </div>
        `;
    }).join('');

    // Initialize Scroll Reveal for items inside the panel
    initBriefingReveal(container);
}

function initBriefingReveal(container) {
    const items = container.querySelectorAll('.briefing-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        root: container,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    items.forEach(item => observer.observe(item));
}

// ================= FOOTER EMAIL REVEAL =================
function initEmailReveal() {
    const gmailLink = document.querySelector('.gmail-link');
    if (!gmailLink) return;

    gmailLink.addEventListener('click', function (e) {
        e.preventDefault();
        const revealText = this.nextElementSibling;
        if (revealText && revealText.classList.contains('email-reveal-text')) {
            const isVisible = revealText.style.display === 'block';
            revealText.style.display = isVisible ? 'none' : 'block';
        }
    });
}