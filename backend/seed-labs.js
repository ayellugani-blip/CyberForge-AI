const mongoose = require('mongoose');
const VirtualLab = require('./models/VirtualLab');

async function seedLabs() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cyberforge');

        console.log("Seeding Ultimate Virtual Labs...");
        await VirtualLab.deleteMany({});

        const labs = [
            {
                title: "Terminal Encryption Crack",
                type: "puzzle",
                difficulty: "Easy",
                description: "Access a restricted terminal and crack the SHA-256 password hash using digital footprints found in the environment.",
                pointsAwarded: 100,
                stages: [
                    {
                        id: "workstation_start",
                        narrative: "You are logged into a developer's guest workstation. The main server terminal is locked. You need to find the password hash and the decryption tool.",
                        availableObjects: [
                            { id: "terminal", name: "Locked Terminal", description: "The gateway to the main server. Requires an override code.", actions: ["examine", "use"] },
                            { id: "notes", name: "Sticky Notes", description: "Yellow notes scattered around the monitor.", actions: ["examine"] },
                            { id: "scripts", name: "Scripts Folder", description: "A folder containing automated maintenance scripts.", actions: ["examine", "take"] }
                        ],
                        validActions: [
                            { action: "examine", objectId: "notes", feedback: "One note says: 'Hash salt: 2026'. Another says: 'Check the scripts folder for the cracker tool.'" },
                            { action: "take", objectId: "scripts", givesItem: "Cracker Tool", feedback: "You secured the 'HashCracker.py' utility." },
                            {
                                action: "use",
                                objectId: "terminal",
                                requiredItem: "Cracker Tool",
                                unlocksStage: "cracked_success",
                                feedback: "You ran the cracker tool. SHA-256 Hash decrypted using salt 2026. Access GRANTED!",
                                isExit: true
                            }
                        ]
                    }
                ]
            },
            {
                title: "SOC Operation: Midnight Hunt",
                type: "scenario",
                difficulty: "Hard",
                description: "Lead the incident response. A zero-day exploit is active. Coordinate tools to isolate the threat and preserve the mainframe.",
                pointsAwarded: 250,
                stages: [
                    {
                        id: "soc_stage_1",
                        narrative: "LEVEL 5 ALERT: High-volume exfiltration detected on Port 443. The source is obscured but internal. Analyze the network to pinpoint the leak.",
                        availableObjects: [
                            { id: "net_map", name: "Network Map", description: "Real-time visualization of internal traffic flows.", actions: ["examine", "analyze"] },
                            { id: "monitor", name: "Traffic Monitor", description: "Shows packet volume per internal node.", actions: ["examine"] }
                        ],
                        validActions: [
                            { action: "analyze", objectId: "net_map", unlocksStage: "soc_stage_2", feedback: "Analysis complete. Asset 'Internal-DB-01' is transmitting 4.2GB/s to an external IP. Go to the server room console." },
                            { action: "examine", objectId: "monitor", feedback: "DB-Cluster-A: Normal. Web-Front-02: Normal. Internal-DB-01: CRITICAL SPIKE." }
                        ]
                    },
                    {
                        id: "soc_stage_2",
                        narrative: "You've accessed the 'Internal-DB-01' tactical node. The malware is attempting to wipe local logs. You must extract the signature before the data is lost.",
                        availableObjects: [
                            { id: "infected_node", name: "Infected DB Node", description: "The source of the data leak. It's radiating heat.", actions: ["examine", "extract"] },
                            { id: "forensic_tool", name: "Signature Extractor", description: "Used to capture malware patterns in memory.", actions: ["examine"] }
                        ],
                        validActions: [
                            { action: "extract", objectId: "infected_node", givesItem: "X-GHOST-CORE", unlocksStage: "soc_stage_3", feedback: "Signature 'X-GHOST-CORE' successfully isolated in the data buffer. Final lockdown required at the Core Firewall." }
                        ]
                    },
                    {
                        id: "soc_stage_3",
                        narrative: "Operative, the signature 'X-GHOST-CORE' ready for deployment. Access the Core Firewall and terminate the exfiltration tunnel.",
                        availableObjects: [
                            { id: "firewall", name: "Core Firewall", description: "The final barrier against the external bridge.", actions: ["examine", "deploy"] },
                            { id: "console", name: "Command Console", description: "Where tactical rules are applied.", actions: ["examine"] }
                        ],
                        validActions: [
                            {
                                action: "deploy",
                                objectId: "firewall",
                                requiredItem: "X-GHOST-CORE",
                                feedback: "Containment successful! The X-GHOST bridge has been collapsed. Mainframe integrity restored. Mission Success.",
                                isExit: true
                            }
                        ]
                    }
                ]
            }
        ];

        await VirtualLab.insertMany(labs);
        console.log("✅ Available Labs Seeded Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding Error:", err.message);
        process.exit(1);
    }
}

seedLabs();
