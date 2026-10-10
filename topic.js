const page = document.querySelector('#topic-page');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderTopic(topic) {
  document.title = `${topic.title} | AZ-104 Fieldnotes`;
  const wrap = element('div', 'topic-wrap');
  const back = element('a', 'back-link', '← 返回六大主題');
  back.href = '../../index.html#curriculum';
  wrap.append(back);

  const header = element('header', 'topic-header');
  header.append(element('p', 'eyebrow', `PATH ${topic.number} · AZ-104`));
  header.append(element('h1', '', topic.title));
  header.append(element('p', 'english-title', topic.titleEn));
  header.append(element('p', 'topic-summary', topic.summary));
  const learnLink = element('a', 'source-link', topic.sourceLabel);
  learnLink.href = topic.sourceUrl;
  learnLink.target = '_blank';
  learnLink.rel = 'noreferrer';
  learnLink.append(element('span', '', ' ↗'));
  header.append(learnLink);
  wrap.append(header);

  const list = element('section', 'subtopics');
  list.setAttribute('aria-labelledby', 'subtopics-title');
  const listHeader = element('div', 'list-header');
  listHeader.append(element('p', 'eyebrow', 'STUDY OUTLINE'));
  const heading = element('h2', '', '小主題');
  heading.id = 'subtopics-title';
  listHeader.append(heading);
  list.append(listHeader);

  topic.subtopics.forEach((subtopic) => {
    const item = element('article', 'subtopic');
    const number = element('span', 'subtopic-number', subtopic.number);
    const copy = element('div', 'subtopic-copy');
    copy.append(element('h3', '', subtopic.title));
    copy.append(element('p', 'subtopic-en', subtopic.titleEn));
    copy.append(element('p', 'subtopic-description', subtopic.description));
    if (subtopic.notes?.length) {
      const notes = element('ul', 'study-notes');
      subtopic.notes.forEach((note) => notes.append(element('li', '', note)));
      copy.append(notes);
    }
    item.append(number, copy);
    list.append(item);
  });
  wrap.append(list);
  if (topic.practice?.length) wrap.append(renderPractice(topic.practice));

  const footer = element('footer', 'page-footer');
  footer.append(element('span', '', 'AZ / FIELDNOTES'));
  footer.append(element('span', '', 'Independent study notes. Not an official Microsoft publication.'));
  wrap.append(footer);
  page.replaceChildren(wrap);
}

function renderPractice(questions) {
  const section = element('section', 'practice');
  section.append(element('p', 'eyebrow', 'QUICK CHECK'));
  section.append(element('h2', '', '換你判斷'));
  section.append(element('p', 'practice-description', '作答後查看解析，確認你掌握角色與範圍。'));
  const counter = element('p', 'practice-counter');
  const prompt = element('h3', 'practice-prompt');
  const promptEn = element('p', 'practice-prompt-en');
  const answers = element('div', 'practice-answers');
  answers.setAttribute('role', 'radiogroup');
  answers.setAttribute('aria-label', '選擇答案');
  const feedback = element('div', 'practice-feedback');
  feedback.setAttribute('aria-live', 'polite');
  const hint = element('p', 'practice-hint', '選擇一個答案後確認。');
  const actions = element('div', 'practice-actions');
  const check = element('button', 'practice-button', '確認答案');
  check.type = 'button';
  const next = element('button', 'practice-button next', '下一題');
  next.type = 'button';
  next.hidden = true;
  actions.append(check, next);
  section.append(counter, prompt, promptEn, answers, feedback, actions, hint);

  let current = 0;
  let score = 0;
  let answered = false;
  let complete = false;

  function showQuestion() {
    const question = questions[current];
    answered = false;
    complete = false;
    counter.textContent = `QUESTION ${String(current + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')} · SCORE ${score}`;
    prompt.textContent = question.prompt;
    promptEn.textContent = question.promptEn;
    feedback.replaceChildren();
    hint.hidden = false;
    hint.textContent = '選擇一個答案後確認。';
    check.hidden = false;
    check.disabled = false;
    next.hidden = true;
    answers.replaceChildren(...question.answers.map((answer, index) => {
      const label = element('label', 'practice-option');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'topic-answer';
      input.value = String(index);
      const copy = element('span');
      copy.append(element('strong', '', answer.zh), element('small', '', answer.en));
      label.append(input, copy);
      return label;
    }));
  }

  check.addEventListener('click', () => {
    if (answered) return;
    const selected = answers.querySelector('input:checked');
    if (!selected) {
      hint.textContent = '請先選擇一個答案。';
      return;
    }
    answered = true;
    const question = questions[current];
    const correct = Number(selected.value) === question.correct;
    if (correct) score += 1;
    counter.textContent = `QUESTION ${String(current + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')} · SCORE ${score}`;
    feedback.classList.toggle('incorrect', !correct);
    feedback.append(element('strong', '', correct ? '答對了 / Correct' : '再想想 / Not quite'));
    feedback.append(element('span', '', question.explanation), element('span', '', question.explanationEn));
    answers.querySelectorAll('input').forEach((input) => { input.disabled = true; });
    check.hidden = true;
    next.hidden = false;
    next.textContent = current === questions.length - 1 ? '查看結果' : '下一題';
    hint.hidden = true;
  });

  next.addEventListener('click', () => {
    if (complete) {
      current = 0;
      score = 0;
      showQuestion();
      return;
    }
    current += 1;
    if (current < questions.length) {
      showQuestion();
      return;
    }
    counter.textContent = 'MODULE COMPLETE';
    prompt.textContent = `完成 ${score} / ${questions.length} 題`;
    promptEn.textContent = score === questions.length ? 'You have a solid grasp of roles and scope.' : 'Review scope inheritance and role permissions, then try again.';
    answers.replaceChildren();
    feedback.replaceChildren(element('span', '', '練習結果僅供自我檢核 / Practice result for self-assessment only'));
    check.hidden = true;
    next.hidden = false;
    next.textContent = '重新練習';
    complete = true;
  });

  showQuestion();
  return section;
}

fetch('./content.json')
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(renderTopic)
  .catch(() => {
    page.replaceChildren(element('p', 'load-error', '無法載入主題內容，請確認網站檔案已完整發布。'));
  });
