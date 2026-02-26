const aiRisk = document.getElementById("aiRisk");
const input = document.getElementById("passwordInput");
const fill = document.getElementById("strengthFill");
const text = document.getElementById("strengthText");

const entropyEl = document.getElementById("entropy");
const patternEl = document.getElementById("pattern");
const crackEl = document.getElementById("cracktime");
const advice = document.getElementById("adviceBox");

input.addEventListener("input", analyze);

async function analyze() {

    const pw = input.value;
    if (!pw) { reset(); return; }

    let score = 0;
    let pool = 0;

    /* character pool */
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/[0-9]/.test(pw)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pw)) pool += 32;

    /* entropy */
    const entropy = Math.round(pw.length * Math.log2(pool || 1));
    entropyEl.textContent = entropy + " Bits";

    /* scoring */
    if (pw.length >= 8) score += 20;
    if (pw.length >= 12) score += 20;
    if (/[A-Z]/.test(pw)) score += 15;
    if (/[0-9]/.test(pw)) score += 15;
    if (/[^A-Za-z0-9]/.test(pw)) score += 30;

    /* pattern detection */
    let warn = "None Detect";
    if (/123|abc|password|qwerty/i.test(pw)) {
        warn = "Common Pattern!";
        score -= 25;
    }
    patternEl.textContent = warn;

    /* strength */
    score = Math.max(0, Math.min(100, score));
    fill.style.width = score + "%";

    if (score < 30) {
        fill.style.background = "#ff1744";
        text.textContent = "Weak / Compromised";
        text.style.color = "#ff1744";
    }
    else if (score < 60) {
        fill.style.background = "#ff9100";
        text.textContent = "Moderate Resistance";
        text.style.color = "#ff9100";
    }
    else if (score < 80) {
        fill.style.background = "#ffee00";
        text.textContent = "High Security";
        text.style.color = "#ffee00";
    }
    else {
        fill.style.background = "#00e676";
        text.textContent = "Military Grade Encryption";
        text.style.color = "#00e676";
    }

    /* crack time estimate */
    const guesses = Math.pow(pool, pw.length);
    const seconds = guesses / 1e10; // Assuming 10 GH/s

    crackEl.textContent = human(seconds);

    /* advice */
    advice.textContent = generateAdvice(score, pw);

    /* AI analysis */
    runAIRisk(pw, score);

    /* 🔥 AMD GPU backend scan */
    await runGPUScan(pw);

}

function human(sec) {
    if (sec < 1) return "Instant";
    if (sec < 60) return "Seconds";
    if (sec < 3600) {
        const mins = Math.round(sec / 60);
        return mins === 1 ? "1 Minute" : mins + " Minutes";
    }
    if (sec < 86400) {
        const hours = Math.round(sec / 3600);
        return hours === 1 ? "1 Hour" : hours + " Hours";
    }
    if (sec < 31536000) {
        const days = Math.round(sec / 86400);
        return days === 1 ? "1 Day" : days + " Days";
    }
    const years = Math.pow(10, Math.floor(Math.log10(sec / 31536000)));
    if (sec / 31536000 > 1000000) return "Centuries+";
    const actualYears = Math.round(sec / 31536000);
    return actualYears + " Years";
}

function generateAdvice(score, pw) {
    if (score > 80) return "STATUS: Optimized ✔";
    if (pw.length < 12) return "GUIDANCE: Use 12+ characters";
    if (!/[A-Z]/.test(pw)) return "GUIDANCE: Add uppercase";
    if (!/[0-9]/.test(pw)) return "GUIDANCE: Include digits";
    if (!/[^A-Za-z0-9]/.test(pw)) return "GUIDANCE: Add symbols";
    return "GUIDANCE: Increase Entropy";
}

function reset() {
    fill.style.width = "0%";
    text.textContent = "Waiting for input...";
    text.style.color = "rgba(255,255,255,0.5)";
    entropyEl.textContent = "0 Bits";
    patternEl.textContent = "None";
    crackEl.textContent = "Instant";
    advice.textContent = "";
    aiRisk.innerHTML = "Awaiting sequence...";
}

/* ================= AI BEHAVIOR ANALYSIS ================= */

function runAIRisk(pw, score) {

    let risks = [];

    const commonNames = ["alex", "john", "admin", "user", "kiran", "rahul", "test", "saumya"];
    commonNames.forEach(n => {
        if (pw.toLowerCase().includes(n))
            risks.push("Personal identifier detected (" + n + ")");
    });

    if (/\d{4}/.test(pw))
        risks.push("Temporal date pattern identified");

    if (/(.)\1{2,}/.test(pw))
        risks.push("Sequential repetition alert");

    if (/qwerty|asdf|zxcv|1234|abcd/i.test(pw))
        risks.push("Keyboard proximity pattern detected");

    if (/@|0|\$|!/.test(pw) && /pass|admin|user/i.test(pw))
        risks.push("Predictable leetspeak substitution");

    let level = "LOW";

    if (score < 40 || risks.length >= 3) level = "CRITICAL";
    else if (score < 60 || risks.length >= 2) level = "HIGH";
    else if (score < 80 || risks.length >= 1) level = "MEDIUM";

    aiRisk.innerHTML =
        `THREAT LEVEL: <span style="color:${color(level)}; font-weight: bold;">${level}</span><br><br>` +
        (risks.length ? ("DETECTED VULNERABILITIES:<br>• " + risks.join("<br>• ")) : "ANALYSIS: No heuristic patterns detected. High randomness confirmed.");
}

function color(level) {
    if (level === "CRITICAL") return "#ff1744";
    if (level === "HIGH") return "#ff9100";
    if (level === "MEDIUM") return "#ffee00";
    return "#00e676";
}

/* ================= AMD GPU BACKEND CONNECTION ================= */

async function runGPUScan(pw) {

    try {

        const res = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pw })
        });

        if (!res.ok) throw new Error("Server not responding");

        const data = await res.json();

        /* append GPU result */
        crackEl.innerHTML += `<br><small style="font-size: 12px; color: #ff9100;">GPU attack time: ${data.crack_time} (${data.risk})</small>`;

        if (window.CyberState) CyberState.grantXP(15, "password_analysis");

    } catch (err) {
        /* silent fallback */
    }

}

// Initialize
reset();
