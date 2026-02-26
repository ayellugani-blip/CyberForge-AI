const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/authMiddleware");
const CtfChallenge = require("../models/CtfChallenge");
const CtfSubmission = require("../models/CtfSubmission");
const User = require("../models/user");
const Progress = require("../models/progress");

// GET /api/ctf/:type - Fetch challenges by type
router.get("/:type", verifyToken, async (req, res) => {
    try {
        const { type } = req.params;
        const challenges = await CtfChallenge.find({ type }).select("-flagHash");
        res.json(challenges);
    } catch (err) {
        console.error("CTF Fetch Error:", err);
        res.status(500).json({ error: "Could not fetch challenges" });
    }
});

// GET /api/ctf/challenge/:id - Fetch single challenge
router.get("/challenge/:id", verifyToken, async (req, res) => {
    try {
        const challenge = await CtfChallenge.findById(req.params.id).select("-flagHash");
        if (!challenge) return res.status(404).json({ error: "Challenge not found" });
        res.json(challenge);
    } catch (err) {
        res.status(500).json({ error: "Error fetching challenge" });
    }
});

// POST /api/ctf/submit - Submit a flag
router.post("/submit", verifyToken, async (req, res) => {
    const { challengeId, flag } = req.body;
    const userId = req.user.id;

    try {
        const challenge = await CtfChallenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ error: "Challenge not found" });

        // Check if already solved
        const existingSuccess = await CtfSubmission.findOne({ userId, challengeId, correct: true });
        if (existingSuccess) return res.status(400).json({ error: "Challenge already solved" });

        // Validate Flag
        const isMatch = await bcrypt.compare(flag, challenge.flagHash);

        // Record submission
        await CtfSubmission.create({
            userId,
            challengeId,
            correct: isMatch,
            attempts: 1 // In a real app, we'd increment attempts for existing records
        });

        if (isMatch) {
            // Award Points & Update Progress
            const pointsAwarded = challenge.points;

            // Update User Profile
            await User.findByIdAndUpdate(userId, {
                $inc: { xp: pointsAwarded, "activities.ctf": 1 }
            });

            // Update Progress Model
            await Progress.findOneAndUpdate(
                { userId },
                {
                    $inc: { xp: pointsAwarded, "activities.ctf": 1 },
                    $push: {
                        history: {
                            type: "ctf",
                            title: challenge.title,
                            points: pointsAwarded,
                            date: new Date()
                        }
                    }
                },
                { upsert: true }
            );

            return res.json({
                success: true,
                msg: "ACCESS GRANTED. Flag captured!",
                points: pointsAwarded
            });
        } else {
            return res.status(400).json({
                success: false,
                msg: "ACCESS DENIED. Invalid flag fingerprint."
            });
        }

    } catch (err) {
        console.error("CTF Submit Error:", err);
        res.status(500).json({ error: "Internal server error during validation" });
    }
});

module.exports = router;
