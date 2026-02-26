const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    pubDate: { type: String, required: true },
    source: { type: String, required: true },
    category: { type: String, enum: ["Vulnerability", "Breach", "Malware", "AI Threat", "Policy", "News"], required: true },
    trendingScore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("News", NewsSchema);
