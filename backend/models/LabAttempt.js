const mongoose = require('mongoose');

const LabAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'VirtualLab', required: true },
    actions: [{
        stageId: String,
        action: String,
        objectId: String,
        timestamp: { type: Date, default: Date.now },
        feedback: String,
        success: Boolean
    }],
    completed: { type: Boolean, default: false },
    timeTaken: Number, // In seconds
    finalScore: Number
});

module.exports = mongoose.model('LabAttempt', LabAttemptSchema);
