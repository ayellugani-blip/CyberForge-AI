const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const PhishingScenario = require("../models/PhishingScenario");
const PhishingAttempt = require("../models/PhishingAttempt");
const Progress = require("../models/progress");

/* ------------------ HELPERS ------------------ */

const calculateScore = (scenario, submission) => {
    let score = 0;
    const { selectedAction, detectedIndicators } = submission;

    // Correct final decision: +50
    if (selectedAction === scenario.correctAction) {
        score += 50;
    } else {
        // Penalty for wrong final decision
        score -= 15;
    }

    // Each indicator detected: +10
    if (detectedIndicators && Array.isArray(detectedIndicators)) {
        detectedIndicators.forEach(clue => {
            const match = scenario.indicators.find(ind => ind.description === clue);
            if (match) score += 10;
        });
    }

    // Malicious actions penalties
    if (submission.maliciousInteractions) {
        // e.g., click_link, download_attachment
        submission.maliciousInteractions.forEach(action => {
            if (action === "download") score -= 30;
            if (action === "click_link") score -= 15;
        });
    }

    return score;
};

/* ------------------ ROUTES ------------------ */

// GET RANDOM SCENARIO
router.get("/:type/:difficulty", verifyToken, async (req, res) => {
    try {
        const { type, difficulty } = req.params;
        const count = await PhishingScenario.countDocuments({ type, difficulty });
        const random = Math.floor(Math.random() * count);
        const scenario = await PhishingScenario.findOne({ type, difficulty }).skip(random);

        if (!scenario) return res.status(404).json({ msg: "No scenarios found" });

        res.json(scenario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SUBMIT ATTEMPT
router.post("/submit", verifyToken, async (req, res) => {
    try {
        const { scenarioId, selectedAction, detectedIndicators, maliciousInteractions, timeTaken } = req.body;
        const userId = req.user.id;

        const scenario = await PhishingScenario.findById(scenarioId);
        if (!scenario) return res.status(404).json({ msg: "Scenario not found" });

        const score = calculateScore(scenario, { selectedAction, detectedIndicators, maliciousInteractions });
        const isCorrect = selectedAction === scenario.correctAction;

        const attempt = new PhishingAttempt({
            userId,
            scenarioId,
            selectedAction,
            detectedIndicators,
            correct: isCorrect,
            score,
            timeTaken
        });

        await attempt.save();

        // Update User Progress
        let progress = await Progress.findOne({ userId });
        if (!progress) {
            progress = new Progress({ userId });
        }

        progress.xp += Math.max(0, score); // No negative XP
        progress.activities.phishing += 1;
        progress.history.push({
            type: "phishing",
            scenarioType: scenario.type,
            score,
            timestamp: new Date()
        });

        await progress.save();

        res.json({
            success: true,
            score,
            isCorrect,
            explanation: scenario.explanation,
            nextLevelThreshold: progress.xp // Simplified for now
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET USER PROGRESS
router.get("/progress", verifyToken, async (req, res) => {
    try {
        const attempts = await PhishingAttempt.find({ userId: req.user.id })
            .populate("scenarioId", "type difficulty")
            .sort({ timestamp: -1 });

        res.json(attempts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
