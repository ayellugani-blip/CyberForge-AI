const mongoose = require("mongoose");
const News = require("../models/News");

async function seedNews() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/cyberforge");
        console.log("Connected to MongoDB for Seeding...");

        // Clear existing news to simulate "latest"
        await News.deleteMany({});

        const newsToSeed = [
            {
                title: "Post-Quantum Cryptography: Global Standards Finalized",
                description: "NIST has officially finalized the first set of post-quantum encryption standards, marking a historic shift in global digital security infrastructure.",
                link: "https://example.com/pq-standards",
                pubDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                source: "CyberDefense Insider",
                category: "Policy"
            },
            {
                title: "AI-Powered Threat Hunting Neutralizes Massive Supply Chain Botnet",
                description: "Security teams utilized next-gen AI behavioral analysis to identify and dismantle a sophisticated botnet targeting critical logistics providers.",
                link: "https://example.com/ai-hunt",
                pubDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                source: "Global Sec Herald",
                category: "AI Threat"
            },
            {
                title: "Critical Zero-Day Patched in Major Enterprise Virtualization Suite",
                description: "A high-severity remote code execution vulnerability has been remediated. All enterprise administrators are urged to apply the emergency patch immediately.",
                link: "https://example.com/v-patch",
                pubDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                source: "Security Monitor",
                category: "Vulnerability"
            },
            {
                title: "Ransomware Group 'SilverLock' Claims Responsibility for Power Grid Outage",
                description: "Analysis reveals a localized power disruption was the work of the SilverLock syndicate, highlighting the increasing physical risks of cyber extortion.",
                link: "https://example.com/power-breach",
                pubDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                source: "Quantum Threat Labs",
                category: "Breach"
            },
            {
                title: "New Polymorphic Malware Detected Evading Traditional Signature Scans",
                description: "A novel malware strain that rewrites its own code to avoid detection has been spotted in the wild, specifically targeting cloud-native workloads.",
                link: "https://example.com/poly-malware",
                pubDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                source: "Malware Analytics",
                category: "Malware"
            },
            {
                title: "Emerging Policy: Digital Identity Sovereignty Laws Drafted",
                description: "New legislative drafts propose giving individuals absolute control over their biometric and digital identity data, challenging major tech storage models.",
                link: "https://example.com/identity-policy",
                pubDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                source: "LegalTech Review",
                category: "Policy"
            }
        ];

        await News.insertMany(newsToSeed);
        console.log("✅ News Hub Seeded Successfully with Dynamic Dates!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Seeding Failed:", err);
        process.exit(1);
    }
}

seedNews();
