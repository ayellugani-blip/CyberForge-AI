const mongoose = require("mongoose");
const PhishingScenario = require("./models/PhishingScenario");
require("dotenv").config();

const scenarios = [
    {
        type: "email",
        difficulty: "easy",
        subject: "Security Alert: Unauthorized Login Attempt",
        sender: "Security Team <security@internal.cyberf0rge.ai>",
        messageContent: "We detected a suspicious login attempt on your account from an unrecognized IP address (192.168.1.55). If this was not you, please secure your account immediately by clicking the link below.",
        links: [
            {
                displayUrl: "https://cyberforge.ai/secure-account",
                realUrl: "http://malicious-site.xyz/phish/login",
                malicious: true
            }
        ],
        attachments: [],
        correctAction: "report",
        indicators: [
            { description: "Typo in sender domain (cyberf0rge.ai)", type: "sender" },
            { description: "Mismatched URL in link hover", type: "link" },
            { description: "Urgent/Threatening tone", type: "content" }
        ],
        explanation: "This was a classic phishing attempt. The sender domain used a '0' instead of an 'o', and the link destination did not match the displayed text."
    },
    {
        type: "image",
        difficulty: "medium",
        sender: "Elon Musk [Official]",
        messageContent: "Giving back to the community! 🚀 The first 100 people to send 0.1 BTC to this address will get 1 BTC back instantly! Check the official announcement metadata for proof!",
        correctAction: "report",
        indicators: [
            { description: "Mismatched handle vs official name", type: "profile" },
            { description: "Too-good-to-be-true giveaway claim", type: "content" },
            { description: "Suspicious image metadata (edited in Photoshop)", type: "metadata" }
        ],
        explanation: "Verification badges can be faked, and official accounts never ask for crypto deposits in exchange for 'giveaways'."
    },
    {
        type: "sms",
        difficulty: "easy",
        sender: "+1 (855) 091-2300",
        messageContent: "UPS: Your package with ID #UPS-9942 is on hold due to a missing house number. Please update your details here:",
        links: [
            {
                displayUrl: "ups-delivery-update.com/tracking",
                realUrl: "http://smish-central.net/ups",
                malicious: true
            }
        ],
        correctAction: "block",
        indicators: [
            { description: "Random phone number for official carrier", type: "sender" },
            { description: "Missing package context", type: "content" },
            { description: "Suspicious shortlink domain", type: "link" }
        ],
        explanation: "Shipping carriers rarely text from random 10-digit numbers for delivery failures without prior app registration."
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cyber-ai");
        await PhishingScenario.deleteMany({});
        await PhishingScenario.insertMany(scenarios);
        console.log("Phishing scenarios seeded successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
