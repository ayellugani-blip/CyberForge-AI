document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic') || 'intro';
    const level = params.get('level') || 'beginner';

    const quizTitle = document.getElementById('quizTitle');
    const quizLevel = document.getElementById('quizLevel');
    const questionsContainer = document.getElementById('questions');
    const nextBtn = document.getElementById('nextBtn');
    const progressText = document.getElementById('progressText');

    let currentQuestionIndex = 0;
    let score = 0;
    let quizData = [];

    // Helper: Fisher-Yates Shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Initialize Quiz Data
    function initQuiz() {
        const rawPool = QuestionPool[topic] || QuestionPool['intro'];

        // 1. Shuffle all questions in the pool
        const shuffledPool = shuffleArray([...rawPool]);

        // 2. Take top 5 questions
        const selectedQuestions = shuffledPool.slice(0, 5);

        // 3. Process each question to shuffle its answers while maintaining correct index
        quizData = selectedQuestions.map(q => {
            const correctAnswerText = q.a[q.correct];
            const shuffledAnswers = shuffleArray([...q.a]);
            return {
                q: q.q,
                a: shuffledAnswers,
                correct: shuffledAnswers.indexOf(correctAnswerText)
            };
        });

        quizTitle.textContent = topic.toUpperCase().replace('_', ' ') + " Assessment";
        quizLevel.textContent = "LEVEL: " + level.toUpperCase();
        displayQuestion();
    }

    function displayQuestion() {
        if (!quizData.length) return;
        questionsContainer.innerHTML = '';
        const q = quizData[currentQuestionIndex];

        const box = document.createElement('div');
        box.className = 'question-box active';
        box.innerHTML = `<h3>${q.q}</h3><ul class="options-list"></ul>`;

        const list = box.querySelector('.options-list');
        q.a.forEach((opt, i) => {
            const item = document.createElement('li');
            item.className = 'option-item';
            item.textContent = opt;
            item.onclick = () => {
                list.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
            };
            list.appendChild(item);
        });

        questionsContainer.appendChild(box);
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    }

    nextBtn.onclick = () => {
        const selected = document.querySelector('.option-item.selected');
        if (!selected) return alert("Please select an answer.");

        const q = quizData[currentQuestionIndex];
        const options = Array.from(document.querySelectorAll('.option-item'));
        const selectedIndex = options.indexOf(selected);

        if (selectedIndex === q.correct) {
            score++;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            displayQuestion();
        } else {
            finishQuiz();
        }
    };

    async function finishQuiz() {
        const percent = Math.round((score / quizData.length) * 100);

        // Award flat 10 XP per user request
        const xpGain = 10;
        await CyberState.grantXP(xpGain, topic);
        await CyberState.completeTopic(topic, percent, score);

        // Small delay to ensure DB persistence before redirect
        await new Promise(r => setTimeout(r, 500));

        const isAI = topic.startsWith('ai_');
        const pathUrl = isAI ? 'AI.html' : 'cybersecurity.html';

        // Dynamic label based on level
        let pathLabel = "RETURN TO ";
        if (level === 'beginner') pathLabel += "BEGINNERS";
        else if (level === 'intermediate') pathLabel += "INTERMEDIATE";
        else if (level === 'professional') pathLabel += "PROFESSIONAL";

        questionsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fa-solid fa-trophy" style="font-size: 80px; color: #ffd700; margin-bottom: 20px;"></i>
                <h2>Quiz Complete!</h2>
                <p style="font-size: 24px;">Your Score: ${score}/${quizData.length} (${percent}%)</p>
                <div id="xpResult" style="color: var(--accent-main); font-weight: bold; margin-top: 20px; font-size: 20px;">
                    <i class="fa-solid fa-bolt"></i> +${xpGain} XP Awarded
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px; align-items: center; margin-top: 40px;">
                    <button class="cta-premium" style="width: 100%; max-width: 380px; min-height: 65px;" onclick="window.location.href='cyber.html'">
                        <i class="fa-solid fa-house"></i> RETURN TO DASHBOARD
                    </button>
                    <button class="cta-premium" style="width: 100%; max-width: 380px; min-height: 65px; background: rgba(255,255,255,0.05); border: 1px solid var(--accent-border);" 
                        onclick="window.location.href='${pathUrl}'">
                        <i class="fa-solid fa-arrow-left"></i> ${pathLabel}
                    </button>
                </div>
            </div>
        `;
        nextBtn.style.display = 'none';
        progressText.style.display = 'none';
    }

    // Start
    initQuiz();
});
