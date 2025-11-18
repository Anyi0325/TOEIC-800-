// skill-page.js
// 每次抽 10 題；提交後分析 grammar / vocab 錯誤次數並回報弱點；錯題自動加入錯題本；每題亦可手動加入與加註

const skillArea = document.getElementById('skill-area');
const btnNewSkill = document.getElementById('btn-new-skill');
const btnSubmitSkill = document.getElementById('btn-submit-skill');
const skillResult = document.getElementById('skill-result');

let currentSkill = [];

function renderSkill(questions){
  skillArea.innerHTML = '';
  questions.forEach((q, idx) => {
    const el = document.createElement('div');
    el.className = 'question-card';
    el.innerHTML = `
      <div class="question-text">${idx+1}. ${escapeHtml(q.question)}</div>
      <div class="options">${makeOptionHtml(q, idx)}</div>
      <div style="margin-top:8px;">
        <button class="btn btn-add-manual" data-idx="${idx}">手動加入錯題並備註</button>
      </div>
    `;
    skillArea.appendChild(el);
  });

  // 綁定手動按鈕
  document.querySelectorAll('.btn-add-manual').forEach(b=>{
    b.addEventListener('click', e=>{
      const i = parseInt(e.target.dataset.idx,10);
      const q = currentSkill[i];
      const note = prompt('請輸入備註（可留空）','');
      addErrorNote({
        question: q.question,
        answer: q.answer,
        source: 'skill',
        note: note || ''
      });
      alert('已加入錯題本');
    });
  });
  btnSubmitSkill.disabled = false;
}

function startNewSkill(){
  currentSkill = drawRandomQuestions(skillBank, 10);
  renderSkill(currentSkill);
  skillResult.textContent = '';
}

btnNewSkill.addEventListener('click', ()=> startNewSkill());

btnSubmitSkill.addEventListener('click', ()=>{
  let wrongGrammar = 0, wrongVocab = 0, correct=0;
  currentSkill.forEach((q, idx)=>{
    const sel = document.querySelector(`input[name="${q.id}"]:checked`);
    const chosen = sel ? sel.value : null;
    if(chosen === q.answer) correct++;
    else {
      // 自動加入錯題本
      addErrorNote({ question: q.question, answer: q.answer, source: 'skill', note: '' });
      if(q.type === 'grammar') wrongGrammar++;
      if(q.type === 'vocab') wrongVocab++;
    }
  });

  // 分析結果
  let res = `得分：${correct} / ${currentSkill.length}。`;
  const weak = [];
  if(wrongGrammar > 0) weak.push(`文法 (${wrongGrammar} 題)`);
  if(wrongVocab > 0) weak.push(`單字 (${wrongVocab} 題)`);
  if(weak.length===0) res += ' 未發現明顯弱點。';
  else res += ' 建議加強：' + weak.join('、');
  skillResult.textContent = res;
  btnSubmitSkill.disabled = true;
});

// init
startNewSkill();

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
