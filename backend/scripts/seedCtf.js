const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const CtfChallenge = require("../models/CtfChallenge");

const challenges = [
    // HIDDEN FLAGS
    {
        title: "The Phantom Log",
        type: "hidden",
        difficulty: "Easy",
        description: "An intruder left a trace in the system logs. Can you find the hidden flag fingerprint?",
        points: 50,
        assets: {
            files: [
                { name: "system.log", content: "Feb 23 10:11:01 server sshd[1234]: Accepted password for root...\nFeb 23 10:12:05 server kernel: [FLAG{LOG_SNOOPER_2026}] detected in buffer..." },
                { name: "error.log", content: "No errors detected." }
            ]
        },
        flag: "FLAG{LOG_SNOOPER_2026}",
        hints: ["Check the kernel messages in system.log"]
    },
    // PASSWORD CRACKING
    {
        title: "Admin Breach Simulation",
        type: "password",
        difficulty: "Medium",
        description: "We've intercepted an MD5 hash of a local administrator. Crack it to gain entry.",
        points: 100,
        assets: {
            hash: "e10adc3949ba59abbe56e057f20f883e", // "123456" in MD5 (for demo)
            algorithm: "MD5"
        },
        flag: "123456",
        hints: ["This looks like a very common 6-digit password."]
    },
    // STEGANOGRAPHY
    {
        title: "Pixel Secret",
        type: "stego",
        difficulty: "Hard",
        description: "A secure operative hidden a message inside the blue channel of this satellite image.",
        points: 150,
        assets: {
            imageUrl: "/assets/stego/satellite_blue.png",
            hiddenMessage: "FLAG{ST3GO_MAST3R_X}"
        },
        flag: "FLAG{ST3GO_MAST3R_X}",
        hints: ["Focus on the LSB (Least Significant Bit) of the blue channel."]
    }
];

async function seedCtf() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/cyberforge");
        console.log("✅ Connected to MongoDB for CTF Seeding");

        await CtfChallenge.deleteMany({}); // Clear existing
        console.log("🗑️  Cleared old CTF challenges.");

        for (let ch of challenges) {
            const salt = await bcrypt.genSalt(10);
            ch.flagHash = await bcrypt.hash(ch.flag, salt);
            delete ch.flag; // Don't store plain text
            await CtfChallenge.create(ch);
        }

        console.log("🏁 CTF Challenges seeded successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
}

seedCtf();
