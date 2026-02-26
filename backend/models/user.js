const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    xp: { type: Number, default: 0 },
    level: { type: String, default: "beginner" },

    totalCorrect: { type: Number, default: 0 },
    completedTopics: { type: [String], default: [] },

    activities: {
        ctf: { type: Number, default: 0 },
        phishing: { type: Number, default: 0 },
        password: { type: Number, default: 0 },
        quiz: { type: Number, default: 0 }
    },

    quizHistory: [
        {
            topic: String,
            score: Number,
            date: Date
        }
    ],

    tasks: { type: Object, default: {} }
});

module.exports = mongoose.model("User", userSchema);