const express = require("express");
const router = express.Router();
const StudyModule = require("../models/StudyModule");

// GET module by topic
router.get("/:topicId", async (req, res) => {
    try {
        const module = await StudyModule.findOne({ topicId: req.params.topicId });
        if (!module) return res.status(404).json({ msg: "Not found" });
        res.json(module);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;