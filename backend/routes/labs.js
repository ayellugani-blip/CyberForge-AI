const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const VirtualLab = require('../models/VirtualLab');
const labEngine = require('../services/labEngine');

// Get all available labs
router.get('/', verifyToken, async (req, res) => {
    try {
        console.log("📡 INCOMING LABS FETCH REQUEST");
        const labs = await VirtualLab.find({});
        console.log(`✅ FOUND ${labs.length} LABS IN DATABASE`);
        res.json(labs);
    } catch (err) {
        console.error("❌ LABS FETCH ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Start or resume a lab
router.post('/start/:labId', verifyToken, async (req, res) => {
    try {
        console.log(`📡 STARTING LAB ${req.params.labId} FOR USER ${req.user.id}`);
        const state = await labEngine.startLab(req.user.id, req.params.labId);
        res.json(state);
    } catch (err) {
        console.error("❌ LAB START ERROR:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Perform an action
router.post('/action', verifyToken, async (req, res) => {
    try {
        const { labId, action, objectId } = req.body;
        const result = await labEngine.processAction(req.user.id, labId, { action, objectId });
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
