const mongoose = require("mongoose");

const phishingAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    scenarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PhishingScenario",
        required: true
    },
    selectedAction: {
        type: String,
        required: true
    },
    detectedIndicators: [{
        type: String // Array of clue descriptions found by user
    }],
    correct: {
        type: Boolean,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number // seconds
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PhishingAttempt", phishingAttemptSchema);
