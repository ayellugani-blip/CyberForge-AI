const express = require("express");
const router = express.Router();
const News = require("../models/News");

// GET /api/news - Fetch from Database
router.get("/", async (req, res) => {
    try {
        const newsList = await News.find()
            .sort({ trendingScore: -1 }) // Ranked by importance
            .limit(15);

        // Simulate slight network delay for dash aesthetic
        setTimeout(() => {
            res.json(newsList);
        }, 800);
    } catch (err) {
        console.error("News API Error:", err);
        res.status(500).json({ error: "Could not fetch intelligence feeds" });
    }
});

module.exports = router;
