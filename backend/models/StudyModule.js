const mongoose = require("mongoose");

const studyModuleSchema = new mongoose.Schema({
    topicId: { type: String, required: true, unique: true },
    title: String,
    description: String,
    pdf: String
});

module.exports = mongoose.model("StudyModule", studyModuleSchema);