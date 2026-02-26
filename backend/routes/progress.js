const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const Progress = require("../models/progress");

// NEW MODELS
const Course = require("../models/Course");
const CourseProgress = require("../models/courseProgress");

/* =========================================
   GET CURRENT USER PROGRESS
========================================= */
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ msg: "Invalid token payload" });
        }

        let progress = await Progress.findOne({ userId });

        // FIRST LOGIN → CREATE PROFILE
        if (!progress) {
            progress = await Progress.create({
                userId,
                xp: 0,
                level: "beginner",
                completedTopics: [],
                correctAnswers: 0,
                activities: { quiz: 0, lab: 0, ctf: 0 }
            });
        }

        res.json(progress);

    } catch (err) {
        console.error("Progress Route Error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =========================================
   COMPLETE TOPIC (OLD SYSTEM - KEEP)
========================================= */
router.post("/complete-topic", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ msg: "Invalid token payload" });

        const { topicId, correct = 0, scorePercent = 0 } = req.body;

        let progress = await Progress.findOne({ userId });
        if (!progress) return res.status(404).json({ msg: "Progress not found" });

        if (!progress.completedTopics.includes(topicId)) {
            progress.completedTopics.push(topicId);
        }

        const xpGain = correct * 10;
        progress.xp += xpGain;

        if (progress.xp >= 200) progress.level = "professional";
        else if (progress.xp >= 100) progress.level = "intermediate";
        else progress.level = "beginner";

        progress.activities.quiz += 1;
        progress.correctAnswers += correct;

        // TRACK HISTORY FOR PATH-SPECIFIC XP
        progress.history.push({
            topicId,
            scorePercent,
            correct,
            type: 'quiz',
            timestamp: new Date()
        });

        progress.lastUpdated = new Date();
        await progress.save();

        res.json({
            msg: "Topic completed",
            xpGained: xpGain,
            level: progress.level,
            progress
        });

    } catch (err) {
        console.error("Complete Topic Error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =========================================
   GRANT XP (MANUAL / FLAT REWARD)
========================================= */
router.post("/grant-xp", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount = 0, topicId = null } = req.body;

        let progress = await Progress.findOne({ userId });
        if (!progress) return res.status(404).json({ msg: "Progress not found" });

        progress.xp += amount;

        // If topicId provided, record it in history as a generic completion
        if (topicId) {
            progress.history.push({
                topicId,
                amount,
                type: 'direct_grant',
                timestamp: new Date()
            });
        }

        await progress.save();
        res.json({ msg: "XP granted", totalXP: progress.xp });

    } catch (err) {
        console.error("Grant XP Error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* =========================================
   COMPLETE MODULE (NEW LMS SYSTEM)
========================================= */
router.post("/complete-module", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, moduleId } = req.body;

        if (!courseId || !moduleId)
            return res.status(400).json({ msg: "courseId and moduleId required" });

        // find course
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ msg: "Course not found" });

        // find or create course progress
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            courseProgress = await CourseProgress.create({
                userId,
                courseId,
                completedModules: []
            });
        }

        // add module once
        if (!courseProgress.completedModules.includes(moduleId)) {
            courseProgress.completedModules.push(moduleId);
        }

        // percentage calculation
        courseProgress.percentage = Math.round(
            (courseProgress.completedModules.length / course.modules.length) * 100
        );

        courseProgress.lastAccessed = moduleId;
        await courseProgress.save();

        /* ===== GIVE XP REWARD ===== */
        let player = await Progress.findOne({ userId });
        if (!player) player = await Progress.create({ userId });

        const xpGain = 20;
        player.xp += xpGain;

        if (player.xp >= 200) player.level = "professional";
        else if (player.xp >= 100) player.level = "intermediate";
        else player.level = "beginner";

        await player.save();

        res.json({
            msg: "Module completed",
            xpGained: xpGain,
            courseProgress,
            playerLevel: player.level
        });

    } catch (err) {
        console.error("Complete Module Error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;