const VirtualLab = require('../models/VirtualLab');
const LabSession = require('../models/LabSession');
const LabAttempt = require('../models/LabAttempt');

class LabEngine {
    /**
     * Start or resume a lab session
     */
    async startLab(userId, labId) {
        const lab = await VirtualLab.findById(labId);
        if (!lab) throw new Error("Strategic Laboratory ID not found in intel database.");

        let session = await LabSession.findOne({ userId, labId, completed: false });

        if (!session) {
            session = new LabSession({
                userId,
                labId,
                currentStageId: lab.stages[0].id,
                inventory: [],
                solvedSteps: []
            });
            await session.save();

            // Log attempt start
            const attempt = new LabAttempt({ userId, labId, actions: [] });
            await attempt.save();
        }

        return this.getStageState(lab, session.currentStageId, session.inventory);
    }

    /**
     * Process a user action in the current stage
     */
    async processAction(userId, labId, actionInput) {
        const session = await LabSession.findOne({ userId, labId, completed: false });
        if (!session) throw new Error("No active session found");

        const lab = await VirtualLab.findById(labId);
        const currentStage = lab.stages.find(s => s.id === session.currentStageId);

        // Find matching valid action
        const actionRule = currentStage.validActions.find(a =>
            a.action === actionInput.action &&
            a.objectId === actionInput.objectId
        );

        let feedback = "Nothing happened.";
        let success = false;

        if (actionRule) {
            // Check required item
            if (actionRule.requiredItem && !session.inventory.includes(actionRule.requiredItem)) {
                feedback = `You need a ${actionRule.requiredItem} to do that.`;
            } else {
                success = true;
                feedback = actionRule.feedback || "Action successful.";

                // Grant item
                if (actionRule.givesItem && !session.inventory.includes(actionRule.givesItem)) {
                    session.inventory.push(actionRule.givesItem);
                }

                // Unlock next stage
                if (actionRule.unlocksStage) {
                    const nextExists = lab.stages.some(s => s.id === actionRule.unlocksStage);
                    if (nextExists) session.currentStageId = actionRule.unlocksStage;
                }

                // Check completion
                if (actionRule.isExit) {
                    session.completed = true;
                }

                await session.save();
            }
        }

        // Log the action
        await LabAttempt.findOneAndUpdate(
            { userId, labId, completed: false },
            {
                $push: {
                    actions: {
                        stageId: currentStage.id,
                        action: actionInput.action,
                        objectId: actionInput.objectId,
                        feedback,
                        success
                    }
                }
            }
        );

        return {
            feedback,
            success,
            newState: await this.getStageState(lab, session.currentStageId, session.inventory),
            completed: session.completed
        };
    }

    /**
     * Format current stage state for the frontend (clean data)
     */
    async getStageState(lab, stageId, inventory) {
        if (!lab) return null;
        let stage = lab.stages.find(s => s.id === stageId);

        // Fallback for completion/missing stages
        if (!stage) {
            stage = lab.stages[lab.stages.length - 1];
        }

        return {
            labId: lab._id,
            labTitle: lab.title,
            labType: lab.type,
            narrative: stage ? stage.narrative : "Neural protocols stabilized. Mission objective complete.",
            objects: (stage && stage.availableObjects) ? stage.availableObjects.map(o => ({
                id: o.id,
                name: o.name,
                description: o.description,
                actions: o.actions
            })) : [],
            inventory: inventory || []
        };
    }
}

module.exports = new LabEngine();
