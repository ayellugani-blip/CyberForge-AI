const mongoose = require("mongoose");

const CtfSubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "CtfChallenge", required: true },
    correct: { type: Boolean, required: true },
    attempts: { type: Number, default: 1 },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("CtfSubmission", CtfSubmissionSchema);
