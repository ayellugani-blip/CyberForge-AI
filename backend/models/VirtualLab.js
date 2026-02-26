const mongoose = require('mongoose');

const LabStageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    narrative: { type: String, required: true },
    availableObjects: [{
        id: String,
        name: String,
        description: String,
        actions: [String] // e.g. ["examine", "take", "use"]
    }],
    validActions: [{
        action: String,
        objectId: String,
        requiredItem: String,
        unlocksStage: String,
        givesItem: String,
        feedback: String,
        isExit: { type: Boolean, default: false }
    }]
});

const VirtualLabSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['puzzle', 'escape', 'scenario'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    description: { type: String, required: true },
    stages: [LabStageSchema],
    pointsAwarded: { type: Number, default: 100 }
});

module.exports = mongoose.model('VirtualLab', VirtualLabSchema);
