const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const pdfDir = path.join(__dirname, '..', 'pdfs');

// Ensure directory exists
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

const modules = [
    {
        filename: 'identity-protection.pdf',
        title: 'Identity Protection & Access Management',
        icon: '🛡️',
        intro: 'Identity Protection is the first line of defense in cybersecurity. It focuses on ensuring that digital identities—usernames, passwords, and biometric data—are used by the correct person and are protected from theft or misuse.',
        sections: [
            {
                heading: 'Advanced Credential Security',
                body: 'Digital identities are often protected by passwords, but modern security demands passphrases. A passphrase is a long string of words (e.g., "BlueMountains-2024-CoffeeTime") that is easier to remember but exponentially harder for computers to crack due to its length and complexity.'
            },
            {
                heading: 'Multi-Factor Authentication (MFA)',
                body: 'MFA adds secondary layers of proof. Hardware tokens like YubiKeys provide the highest level of security by requiring a physical device. App-based authenticators (TOTP) are a secure middle ground, while SMS-based codes are considered less secure due to SIM-swapping risks.'
            },
            {
                heading: 'Privileged Access Management (PAM)',
                body: 'In enterprise environments, PAM controls administrative access. By using "Just-In-Time" (JIT) access, admins are only granted elevated permissions when they need them for a specific task, limiting the damage an attacker can do if a manager\'s account is compromised.'
            }
        ],
        tips: [
            'Use a unique passphrase for every account.',
            'Enable MFA everywhere, especially on email and banking.',
            'Use a reputable Password Manager to track your credentials.',
            'Regularly check HaveIBeenPwned.com for data breaches.'
        ],
        tools: ['Bitwarden', 'Okta', 'YubiKey', 'Microsoft Authenticator']
    },
    {
        filename: 'threat-detection.pdf',
        title: 'Advanced Threat Detection & Analysis',
        icon: '🔍',
        intro: 'Threat detection is the art of finding malicious activities within a network. It involves moving from reactive security to proactive "threat hunting" to find intruders before they can execute their objectives.',
        sections: [
            {
                heading: 'SIEM & Log Aggregation',
                body: 'Security Information and Event Management (SIEM) systems aggregate logs from every device on a network. By correlating data from firewalls, servers, and endpoints, SIEMs can highlight patterns that individual tools would miss.'
            },
            {
                heading: 'EDR & XDR Technology',
                body: 'Endpoint Detection and Response (EDR) monitors individual devices for suspicious processes. Extended Detection and Response (XDR) takes this further by combining endpoint data with network and cloud telemetry for a unified view of the attack.'
            },
            {
                heading: 'Behavioral Baselining',
                body: 'Advanced systems establish a "normal" baseline for user behavior. If a user suddenly begins accessing sensitive HR files at 2 AM from a new IP, the system flags this as a behavioral anomaly rather than waiting for a known virus signature.'
            }
        ],
        tips: [
            'Log everything, but focus your analysis on high-value systems.',
            'Automate common responses to reduce analyst fatigue.',
            'Baseline your network to understand what "normal" looks like.',
            'Practice incident response drills regularly.'
        ],
        tools: ['Splunk', 'Microsoft Sentinel', 'CrowdStrike Falcon', 'Wireshark']
    },
    {
        filename: 'secure-comm.pdf',
        title: 'Secure Communication & Cryptography',
        icon: '🔒',
        intro: 'Secure communication ensures that data moving between two points remains confidential and untampered. Cryptography is the mathematical foundation that allows us to trust the internet.',
        sections: [
            {
                heading: 'End-to-End Encryption (E2EE)',
                body: 'E2EE ensures that only the sender and recipient can read the data. Not even the service provider (the "man in the middle") has the keys to decrypt the message. This is critical for privacy in messaging and storage.'
            },
            {
                heading: 'TLS and PKI',
                body: 'Transport Layer Security (TLS) is the protocol behind HTTPS. It uses Public Key Infrastructure (PKI) to verify that you are talking to the real "google.com" and not a fake server set up by an attacker.'
            },
            {
                heading: 'Zero Trust Network Access (ZTNA)',
                body: 'ZTNA is the modern replacement for VPNs. It follows the "Never Trust, Always Verify" model, granting access only to specific applications rather than the entire corporate network.'
            }
        ],
        tips: [
            'Always look for the HTTPS padlock in your browser.',
            'Avoid public Wi-Fi for sensitive work without a VPN.',
            'Use Signal for highly sensitive private messaging.',
            'Rotate your encryption keys periodically.'
        ],
        tools: ['OpenSSL', 'Signal', 'ProtonMail', 'Cloudflare Zero Trust']
    },
    {
        filename: 'system-defense.pdf',
        title: 'System Defense & Infrastructure Hardening',
        icon: '🖥️',
        intro: 'System defense is the practice of hardening operating systems and network infrastructure to withstand attacks. It follows the "Defense in Depth" philosophy.',
        sections: [
            {
                heading: 'Infrastructure Hardening',
                body: 'Default settings are often insecure. Hardening involves disabling unnecessary ports, removing unused software, and following benchmarks like CIS or NIST to minimize the attack surface.'
            },
            {
                heading: 'Vulnerability Management',
                body: 'Patching is the single most important task in system defense. Organizations must identify known vulnerabilities (CVEs) and apply security updates within hours for critical systems.'
            },
            {
                heading: 'Network Segmentation',
                body: 'By dividing a network into smaller zones (VLANs), you can prevent "lateral movement." If one computer is compromised, the attacker is trapped in that segment and cannot reach the core database servers.'
            }
        ],
        tips: [
            'Apply the Principle of Least Privilege (PoLP).',
            'Automate your patch management process.',
            'Keep your backups offline or immutable.',
            'Hardened systems are safer but harder to manage—find the balance.'
        ],
        tools: ['Nessus', 'Ansible', 'Palo Alto Firewalls', 'Veeam']
    },
    {
        filename: 'ai-hunting.pdf',
        title: 'AI-Driven Threat Hunting',
        icon: '🤖',
        intro: 'AI Threat Hunting uses machine learning to find "needles in the haystack" across petabytes of security data. It identifies complex attacks that bypass traditional signature-based detection.',
        sections: [
            {
                heading: 'Anomaly Detection Models',
                body: 'ML models like Isolation Forests scan network traffic for data points that deviate from the norm. This is effective against Zero-Day exploits where no signature yet exists.'
            },
            {
                heading: 'Malware Pattern Recognition',
                body: 'Deep learning can "fingerprint" malware by its code structure. Polymorphic malware that changes its code to evade AV is easily caught by AI because its underlying behavior remains the same.'
            },
            {
                heading: 'Automated Correlation',
                body: 'AI can stitch together events from cloud, network, and endpoint logs into a single coherent story, showing the exact path an attacker took during a breach.'
            }
        ],
        tips: [
            'Data quality is king—ensure your logs are clean and labeled.',
            'AI should augment humans, not replace them.',
            'Watch for "model drift" as attacker tactics change over time.',
            'Combine AI insights with standard threat intelligence.'
        ],
        tools: ['Splunk MLTK', 'Chronicle Security AI', 'Microsoft Sentinel AI']
    },
    {
        filename: 'adversarial-ai.pdf',
        title: 'Adversarial AI Defense',
        icon: '🛡️',
        intro: 'As AI models are used for defense, they also become targets. Adversarial AI focuses on protecting the "brain" of the machine from intelligent exploitation.',
        sections: [
            {
                heading: 'Prompt Injection Defense',
                body: 'Large Language Models (LLMs) can be tricked into ignoring their safety rules. Defense involves sanitizing user inputs and using secondary "moderator" models to check for malicious intent.'
            },
            {
                heading: 'Model Poisoning',
                body: 'If an attacker can manipulate the training data, they can create a "backdoor" in the AI. Protecting the data pipeline and verifying data sources is critical for model integrity.'
            },
            {
                heading: 'Adversarial Hardening',
                body: 'By intentionally testing models with "adversarial examples"—slightly modified inputs designed to fool the AI—engineers can retrain the models to be more robust and resilient.'
            }
        ],
        tips: [
            'Treat all user input to an LLM as untrusted code.',
            'Sanitize and audit your training data pipelines.',
            'Monitor AI output for unexpected or biased behavior.',
            'Use Rate Limiting to prevent model extraction attacks.'
        ],
        tools: ['Adversarial Robustness Toolbox (ART)', 'Giskard', 'MITRE ATLAS']
    },
    {
        filename: 'ai-automation.pdf',
        title: 'Autonomous Security & AI Automation',
        icon: '⚡',
        intro: 'Autonomous systems remove the human from the loop for rapid incident containment. In the age of machine-speed attacks, automated defense is no longer optional.',
        sections: [
            {
                heading: 'AI-Powered SOAR',
                body: 'Security Orchestration, Automation, and Response (SOAR) platforms use AI to execute complex playbooks—like automatically isolating a server the moment a breach is confirmed.'
            },
            {
                heading: 'Self-Healing Infrastructure',
                body: 'When a misconfiguration is detected (e.g., an open S3 bucket), AI systems can automatically rollback the change to a known-secure state before an attacker finds it.'
            },
            {
                heading: 'Dynamic Risk Scoring',
                body: 'Systems continuously recalculate the risk level of every user. If a user starts acting strangely, the AI can autonomously trigger a password reset or force an MFA prompt.'
            }
        ],
        tips: [
            'Start with low-impact automation and gradually build trust.',
            'Ensure every autonomous action is logged and auditable.',
            'Define clear "human-in-the-loop" checkpoints for high-risk actions.',
            'Test your playbooks in a sandbox before deploying them.'
        ],
        tools: ['Palo Alto Cortex SOAR', 'Tines', 'Azure Logic Apps']
    },
    {
        filename: 'ai-policy.pdf',
        title: 'AI Governance, Ethics & Policy',
        icon: '📜',
        intro: 'Governance ensures that AI is used responsibly, ethically, and within the bounds of the law. It bridges the gap between technical capability and corporate responsibility.',
        sections: [
            {
                heading: 'NIST AI Risk Management Framework',
                body: 'The NIST AI RMF provides a structured way to identify, manage, and mitigate risks across the AI lifecycle—from design and development to decommissioning.'
            },
            {
                heading: 'Explainable AI (XAI)',
                body: 'Black-box AI is dangerous in security. Governance policies demand that AI decisions be explainable to human auditors, ensuring that no one is unfairly blocked from a system.'
            },
            {
                heading: 'Data Privacy & GDPR',
                body: 'AI training often involves massive amounts of data. Governance ensures that this data is anonymized and handled in compliance with global privacy laws like GDPR and CCPA.'
            }
        ],
        tips: [
            'Establish an AI Ethics Board within your organization.',
            'Prioritize transparency in AI-driven decisions.',
            'Regularly audit your AI models for bias and fairness.',
            'Ensure your AI policies evolve with changing regulations.'
        ],
        tools: ['NIST AI RMF', 'OneTrust', 'IBM AI OpenScale']
    }
];

function generatePDF(mod) {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const filePath = path.join(pdfDir, mod.filename);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Header
        doc.rect(0, 0, 612, 100).fill('#1a1a2e');
        doc.fillColor('#ffffff')
            .fontSize(24)
            .text('CyberForge AI', 50, 30, { characterSpacing: 2 });
        doc.fontSize(10)
            .text('OFFICIAL STUDY MODULE | TACTICAL CYBERSECURITY SERIES', 50, 65);

        // Icon and Title
        doc.fillColor('#1a1a2e')
            .fontSize(40)
            .text(mod.icon, 50, 130);

        doc.fontSize(28)
            .font('Helvetica-Bold')
            .text(mod.title, 50, 180);

        // Horizontal Line
        doc.moveTo(50, 225)
            .lineTo(562, 225)
            .stroke('#cccccc');

        // Intro
        doc.fillColor('#333333')
            .font('Helvetica')
            .fontSize(12)
            .text(mod.intro, 50, 250, { width: 512, lineGap: 5, align: 'justify' });

        let y = 330;

        // Sections
        mod.sections.forEach((sec) => {
            doc.fillColor('#16213e')
                .font('Helvetica-Bold')
                .fontSize(16)
                .text(sec.heading, 50, y);

            y += 25;

            doc.fillColor('#444444')
                .font('Helvetica')
                .fontSize(11)
                .text(sec.body, 50, y, { width: 512, lineGap: 3, align: 'justify' });

            y += 75;
        });

        // Tips Box
        doc.rect(50, y, 512, 110).fill('#f0f4f8');
        doc.fillColor('#1a1a2e')
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('⚡ Pro-Tips & Best Practices', 70, y + 15);

        doc.fillColor('#333333')
            .font('Helvetica')
            .fontSize(10);

        mod.tips.forEach((tip, i) => {
            doc.text(`• ${tip}`, 80, y + 40 + (i * 15));
        });

        // Footer
        doc.fillColor('#888888')
            .fontSize(8)
            .text(`© 2026 CyberForge AI - All Rights Reserved. This document is intended for educational purposes only.`, 50, 750, { align: 'center' });

        doc.end();

        stream.on('finish', () => {
            console.log(`Generated: ${mod.filename}`);
            resolve();
        });
    });
}

async function run() {
    console.log('Starting PDF Generation...');
    for (const mod of modules) {
        await generatePDF(mod);
    }
    console.log('All PDFs generated successfully!');
}

run();
