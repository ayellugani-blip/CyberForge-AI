document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('deleteBtn');
    const safeBtn = document.getElementById('safeBtn');
    const overlay = document.getElementById('feedbackOverlay');
    const content = document.getElementById('feedbackContent');

    deleteBtn.onclick = () => showFeedback(true);
    safeBtn.onclick = () => showFeedback(false);

    function showFeedback(isDeleting) {
        overlay.classList.add('visible');
        if (isDeleting) {
            content.innerHTML = `
                <i class="fa-solid fa-circle-check" style="font-size: 60px; color: var(--success); margin-bottom: 20px;"></i>
                <h2 style="color: var(--success);">THREAT NEUTRALIZED</h2>
                <p>Excellent Work! You correctly identified the phishing attempt. Red flags included a spoofed domain, artificial urgency, and a malicious link hidden behind legitimate text.</p>
                <p style="margin-top: 20px; font-weight: bold; color: #fff;">+20 XP Gained</p>
            `;
            CyberState.grantXP(20, 'phishing');
        } else {
            content.innerHTML = `
                <i class="fa-solid fa-circle-xmark" style="font-size: 60px; color: var(--danger); margin-bottom: 20px;"></i>
                <h2 style="color: var(--danger);">COMPROMISED</h2>
                <p>Oh no! You marked a dangerous phishing email as safe. In a real-world scenario, your credentials would have been stolen by now.</p>
                <p style="margin-top: 20px; font-weight: bold; color: #fff;">Review the red flags and try again.</p>
            `;
        }
    }
});
