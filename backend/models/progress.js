const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    xp: {
        type: Number,
        default: 0
    },

    level: {
        type: String,
        enum: ["beginner", "intermediate", "professional"],
        default: "beginner"
    },

    completedTopics: {
        type: [String],
        default: []
    },

    correctAnswers: {
        type: Number,
        default: 0
    },

    activities: {
        quiz: { type: Number, default: 0 },
        lab: { type: Number, default: 0 },
        ctf: { type: Number, default: 0 },
        phishing: { type: Number, default: 0 }
    },

    history: {
        type: [Object],
        default: []
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);