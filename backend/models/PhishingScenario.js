const mongoose = require("mongoose");

const phishingScenarioSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["email", "image", "sms"],
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "easy"
    },
    sender: {
        type: String, // email address, profile name, or phone number
        required: true
    },
    subject: {
        type: String // only for emails
    },
    messageContent: {
        type: String,
        required: true
    },
    links: [{
        displayUrl: String,
        realUrl: String,
        malicious: { type: Boolean, default: false }
    }],
    attachments: [{
        name: String,
        type: String,
        malicious: { type: Boolean, default: false }
    }],
    indicators: [{
        description: String,
        type: { type: String }, // e.g., "suspicious_link", "urgency", "spoofed_domain"
        clue: String // Text snippet that is the clue
    }],
    correctAction: {
        type: String,
        enum: ["report", "mark_safe", "ignore", "block"],
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 50
    }
}, { timestamps: true });

module.exports = mongoose.model("PhishingScenario", phishingScenarioSchema);
