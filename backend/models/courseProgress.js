const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: String, required: true },
    completedModules: { type: [String], default: [] },
    lastAccessed: String,
    percentage: { type: Number, default: 0 }
}, { timestamps: true });

// one progress per user per course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("CourseProgress", courseProgressSchema);