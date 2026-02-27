require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progress");
const coursesRoutes = require("./routes/courses"); // NEW
const studyModuleRoutes = require("./routes/studyModule");
const newsRoutes = require("./routes/news");
const ctfRoutes = require("./routes/ctf");
const phishingRoutes = require("./routes/phishing");
const labsRoutes = require("./routes/labs");

const verifyToken = require("./middleware/authMiddleware");

const app = express();

/* ------------------ MIDDLEWARES ------------------ */

// Allow frontend (live server 5500 and production URL)
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5500";
console.log("CORS Configuration:");
console.log("- Allowed Origins:", ["http://127.0.0.1:5500", "http://localhost:5500", frontendURL]);
console.log("- FRONTEND_URL Env:", process.env.FRONTEND_URL);

app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500", frontendURL],
    credentials: true
}));

app.use(express.json());

app.use("/pdfs", express.static("engine/pdfs"));

/* ------------------ ROUTES ------------------ */

// PHASE 1 ROUTES (UNCHANGED)
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

// PHASE 2 ROUTE (NEW - LMS)
app.use("/api/courses", coursesRoutes);
app.use("/api/study-module", studyModuleRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/ctf", ctfRoutes);
app.use("/api/phishing", phishingRoutes);
app.use("/api/labs", labsRoutes);

/* ------------------ TEST PROTECTED ------------------ */

app.get("/api/protected", verifyToken, (req, res) => {
    res.json({
        message: "Protected data accessed",
        user: req.user
    });
});

/* ------------------ DATABASE CONNECTION ------------------ */

const News = require("./models/News");

const { syncLiveNews } = require("./services/newsService");

async function startServer() {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cyberforge";
        await mongoose.connect(mongoURI);

        console.log("✅ MongoDB Connected");

        // Sync Live News Intelligence
        await syncLiveNews();

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ MongoDB FAILED:", err.message);
        process.exit(1);
    }
}

startServer();