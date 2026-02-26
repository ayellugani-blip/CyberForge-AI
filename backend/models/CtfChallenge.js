const mongoose = require("mongoose");

const CtfChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ["hidden", "password", "stego"], required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    description: { type: String, required: true },
    points: { type: Number, required: true },
    assets: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { files: [], imageUrl: "" }
    flagHash: { type: String, required: true }, // bcrypt hashed flag
    hints: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("CtfChallenge", CtfChallengeSchema);
