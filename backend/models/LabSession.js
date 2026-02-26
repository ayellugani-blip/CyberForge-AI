const mongoose = require('mongoose');

const LabSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'VirtualLab', required: true },
    currentStageId: { type: String, required: true },
    inventory: [String],
    solvedSteps: [String],
    startTime: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LabSession', LabSessionSchema);
