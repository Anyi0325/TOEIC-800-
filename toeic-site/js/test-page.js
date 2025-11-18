// test-page.js
// 需求：每次抽 5 題（從 questionBank 100 題抽），提交後自動將錯題加入錯題本，並在每題旁提供「加入備註」按鈕

// DOM
const quizArea = document.getElementById('quiz-area');
const btnNew = document.getElementById('btn-new-quiz');
const btnSubmit = document.getElementById('btn-submit');
const testScore = document.getElementById('test-score');

let currentQuiz = [];

// 生成題目介面
function renderQuiz(questions){
  quizArea.innerHTML = '';
  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="question-text">${idx+1}. ${escapeHtml(q.question)}</div>
      <div class="options">${makeOptionHtml(q, idx)}</div>
      <div class="muted">來源: 題庫（${q.type}）</div>
      <div style="margin-top:8px;">
        <button class="btn btn-add-manual" data-idx="${idx}">手動加入錯題並加備註</button>
      </div>
    `;
    quizArea.appendChild(card);
  });

  // 啟用提交按鈕
  btnSubmit.disabled = false;

  // 綁定手動加入按鈕
  document.querySelectorAll('.btn-add-manual').forEach(b=>{
    b.addEventListener('click', e=>{
      const i = parseInt(e.target.dataset.idx,10);
      const q = currentQuiz[i];
      const note = prompt('請輸入備註（可留空）', '');
      addErrorNote({
        question: q.question,
        answer: q.answer,
        source: 'test',
        note: note || ''
      });
      alert('已加入錯題本');
    });
  });
}

function startNewQuiz(){
  currentQuiz = drawRandomQuestions(questionBank, 5);
  renderQuiz(currentQuiz);
  testScore.textContent = '';
}

btnNew.addEventListener('click', () => startNewQuiz());

btnSubmit.addEventListener('click', ()=>{
  let correct = 0;
  currentQuiz.forEach((q, idx) => {
    const sel = document.querySelector(`input[name="${q.id}"]:checked`);
    const chosen = sel ? sel.value : null;
    if(chosen === q.answer) correct++;
    else {
      // 自動加入錯題本（自動 + 可手動）
      addErrorNote({
        question: q.question,
        answer: q.answer,
        source: 'test',
        note: ''
      });
    }
  });
  testScore.textContent = `得分：${correct} / ${currentQuiz.length}`;
  btnSubmit.disabled = true;
});

// init
startNewQuiz();

/* escapeHtml helper */
function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
