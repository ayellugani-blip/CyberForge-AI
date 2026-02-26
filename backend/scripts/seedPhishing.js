const mongoose = require("mongoose");
const PhishingScenario = require("../models/PhishingScenario");

const scenarios = [
    {
        type: "email",
        difficulty: "easy",
        sender: "security@accounts-google.com.secure-login.info",
        subject: "Urgent: Unusual sign-in activity detected",
        messageContent: "Someone just used your password to try to sign in to your account. Please click below to secure your account immediately.",
        links: [{
            displayUrl: "https://myaccount.google.com/security",
            realUrl: "http://secure-login.info/google/auth",
            malicious: true
        }],
        indicators: [
            {
                description: "Mismatched domain in sender address",
                clue: "secure-login.info"
            },
            {
                description: "Sense of extreme urgency",
                clue: "immediately"
            },
            {
                description: "Malicious link hidden behind official-looking text",
                clue: "https://myaccount.google.com/security"
            }
        ],
        correctAction: "report",
        explanation: "This is a classic 'Account Security' phishing attempt. Notice the sender's domain is not google.com, and the link actually leads to a suspicious sub-domain.",
        points: 50
    },
    {
        type: "sms",
        difficulty: "easy",
        sender: "+1 (855) 091-2300",
        messageContent: "[USPS] Your package is on hold due to a missing house number. Please update your delivery address at: https://usps-delivery-office.com",
        links: [{
            displayUrl: "https://usps-delivery-office.com",
            realUrl: "https://evil-tracking.com/phish",
            malicious: true
        }],
        indicators: [
            {
                description: "Unknown sender number",
                clue: "+1 (855) 091-2300"
            },
            {
                description: "Unofficial USPS domain",
                clue: "usps-delivery-office.com"
            }
        ],
        correctAction: "block",
        explanation: "Scammers often impersonate delivery services. USPS will never send a link for address updates via SMS from a full 10-digit number.",
        points: 50
    },
    {
        type: "image",
        difficulty: "medium",
        sender: "Elon_Musk_Official_Giveaway",
        messageContent: "I am giving away 5000 BTC to celebrate the new Tesla launch! 🚀 First come first served! Scan QR or visit the profile link!",
        indicators: [
            {
                description: "Too-good-to-be-true crypto giveaway",
                clue: "giving away 5000 BTC"
            },
            {
                description: "Fake verification badge or handle",
                clue: "Elon_Musk_Official_Giveaway"
            }
        ],
        correctAction: "report",
        explanation: "This is a social media scam. Legitimate celebrities do not conduct massive crypto giveaways through comments or random posts.",
        points: 60
    }
];

async function seed() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/cyberforge");
        console.log("Connected to MongoDB for seeding...");

        await PhishingScenario.deleteMany({});
        await PhishingScenario.insertMany(scenarios);

        console.log("✅ Phishing Scenarios Seeded!");
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
