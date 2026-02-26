const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
    moduleId: String,
    title: String,
    pdf: String,
    duration: Number
});

const courseSchema = new mongoose.Schema({
    _id: String, // ai_security, adversarial_ai etc
    title: String,
    level: String,
    description: String,
    modules: [moduleSchema]
});

module.exports = mongoose.model("Course", courseSchema);