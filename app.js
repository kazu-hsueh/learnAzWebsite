const questions = [
  {
    prompt: '新進工程師需要檢視「開發」資源群組內所有資源，但不應變更設定。你應如何授權？',
    promptEn: 'A new engineer needs to view all resources in the Development resource group but must not change them. How should you grant access?',
    answers: [
      { zh: '在資源群組範圍指派 Reader', en: 'Assign Reader at the resource group scope' },
      { zh: '在訂用帳戶範圍指派 Contributor', en: 'Assign Contributor at the subscription scope' },
      { zh: '在每個資源上指派 Owner', en: 'Assign Owner on each resource' },
    ],
    correct: 0,
    explanation: 'Reader 提供檢視權限；在資源群組範圍指派可涵蓋該群組內資源，且不授予變更能力。',
    explanationEn: 'Reader provides viewing access. Assigning it at the resource group scope covers its resources without granting change permissions.',
  },
  {
    prompt: '某人只需要管理一台虛擬機器。符合最小權限原則的做法是哪一項？',
    promptEn: 'Someone only needs to manage one virtual machine. Which option follows least privilege?',
    answers: [
      { zh: '在管理群組範圍指派 Contributor', en: 'Assign Contributor at the management group scope' },
      { zh: '在該虛擬機器範圍指派 Contributor', en: 'Assign Contributor at that virtual machine scope' },
      { zh: '在訂用帳戶範圍指派 Owner', en: 'Assign Owner at the subscription scope' },
    ],
    correct: 1,
    explanation: '將 Contributor 指派在目標虛擬機器範圍，可把權限限制在必要的資源與操作內。',
    explanationEn: 'Assigning Contributor at the target VM scope limits access to the required resource and actions.',
  },
  {
    prompt: '開發者必須建立及管理資源，但不能授予其他人 Azure RBAC 權限。哪個內建角色符合需求？',
    promptEn: 'A developer must create and manage resources but must not grant Azure RBAC access to others. Which built-in role fits?',
    answers: [
      { zh: 'Reader', en: 'Reader' },
      { zh: 'Contributor', en: 'Contributor' },
      { zh: 'Owner', en: 'Owner' },
    ],
    correct: 1,
    explanation: 'Contributor 可管理資源，但不能指派 Azure RBAC 角色；Owner 則包含管理存取權的能力。',
    explanationEn: 'Contributor can manage resources but cannot assign Azure RBAC roles. Owner can also manage access.',
  },
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionArea = document.querySelector('#question-area');
const questionCount = document.querySelector('#question-count');
const scoreDisplay = document.querySelector('#score');
const progressBar = document.querySelector('#progress-bar');
const feedback = document.querySelector('#feedback');
const checkButton = document.querySelector('#check-answer');
const nextButton = document.querySelector('#next-question');
const hint = document.querySelector('#quiz-hint');

function renderQuestion() {
  const question = questions[currentQuestion];
  answered = false;
  questionCount.textContent = `QUESTION ${String(currentQuestion + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
  scoreDisplay.textContent = score;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionArea.innerHTML = `
    <h3 class="question-heading">${question.prompt}</h3>
    <p class="question-heading-en">${question.promptEn}</p>
    <div class="answer-list" role="radiogroup" aria-label="選擇答案 / Select an answer">
      ${question.answers.map((answer, index) => `
        <label class="answer-option">
          <input type="radio" name="answer" value="${index}">
          <span><strong>${answer.zh}</strong><small>${answer.en}</small></span>
        </label>
      `).join('')}
    </div>
  `;
  feedback.hidden = true;
  feedback.classList.remove('is-incorrect');
  checkButton.hidden = false;
  checkButton.disabled = false;
  nextButton.hidden = true;
  hint.hidden = false;
}

function finishQuiz() {
  const percentage = Math.round((score / questions.length) * 100);
  const message = score === questions.length
    ? ['範圍與角色都掌握得很好。', 'You have a solid grasp of roles and scope.']
    : ['再回顧一次範圍繼承與角色權限，再試一次。', 'Review scope inheritance and role permissions, then try again.'];
  questionCount.textContent = 'MODULE COMPLETE';
  progressBar.style.width = '100%';
  questionArea.innerHTML = `
    <div class="result-screen">
      <div class="result-number">${score}<span style="color: var(--quiet)"> / ${questions.length}</span></div>
      <h3>本次完成 / Session complete</h3>
      <p>${message[0]}</p>
      <p>${message[1]}</p>
      <p>${percentage}% · 練習結果僅供自我檢核 / Practice result for self-assessment only</p>
      <button class="retry-button" id="retry-quiz" type="button">重新練習 / TRY AGAIN</button>
    </div>
  `;
  feedback.hidden = true;
  checkButton.hidden = true;
  nextButton.hidden = true;
  hint.hidden = true;
  document.querySelector('#retry-quiz').addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    renderQuestion();
  });
}

checkButton.addEventListener('click', () => {
  if (answered) return;
  const selected = questionArea.querySelector('input[name="answer"]:checked');
  if (!selected) {
    hint.textContent = '請先選擇一個答案 / Select an answer first';
    return;
  }

  answered = true;
  const question = questions[currentQuestion];
  const isCorrect = Number(selected.value) === question.correct;
  if (isCorrect) score += 1;
  scoreDisplay.textContent = score;
  feedback.classList.toggle('is-incorrect', !isCorrect);
  feedback.innerHTML = `<strong>${isCorrect ? '答對了 / Correct' : '再想想 / Not quite'}</strong><span>${question.explanation}</span><span>${question.explanationEn}</span>`;
  feedback.hidden = false;
  questionArea.querySelectorAll('input').forEach((input) => { input.disabled = true; });
  checkButton.disabled = true;
  nextButton.hidden = false;
  nextButton.innerHTML = currentQuestion === questions.length - 1
    ? '查看結果 <span>SEE RESULTS</span><b aria-hidden="true">→</b>'
    : '下一題 <span>NEXT QUESTION</span><b aria-hidden="true">→</b>';
  hint.hidden = true;
});

nextButton.addEventListener('click', () => {
  currentQuestion += 1;
  if (currentQuestion === questions.length) {
    finishQuiz();
    return;
  }
  renderQuestion();
});

renderQuestion();