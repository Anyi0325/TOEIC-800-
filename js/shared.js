/* shared.js
   - 產生題庫 (100題)
   - 錯題本 (localStorage API)
   - 每日句陣列
*/

///// ----- daily sentences -----
const dailySentences = [
  "Please submit the report by the end of the day.",
  "The company is planning to expand its business.",
  "Employees must wear ID badges at all times.",
  "We appreciate your continued support.",
  "Please confirm your attendance by Friday.",
  "The meeting has been rescheduled to 2 PM.",
  "Your application is under review.",
  "All staff must complete the training module.",
  "The new policy takes effect next month.",
  "We will send the invoice by email."
];

function getDailySentence(index){
  return dailySentences[index % dailySentences.length];
}
function saveToMySentences(s){
  const key = 'mySentences_v1';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  if(!arr.includes(s)){
    arr.push(s);
    localStorage.setItem(key, JSON.stringify(arr));
  }
}

/***** ----- 題庫產生（100 題） ----- *****
   為了範例簡潔，我用模板自動生成 100 題：
   - mix of grammar/vocab/word-choice questions
   你可以替換 questionBank 裡的內容為真實題目文本。
*/
function generateQuestionBank(){
  const bank = [];
  const templates = [
    // grammar: blank insertion
    { type:'grammar', q: "Choose the correct word: The meeting ___ at 9:00.", a:"starts", opts:["starts","start","is starting"] },
    { type:'grammar', q: "Choose the correct tense: She ___ to the office yesterday.", a:"went", opts:["gone","goes","went"] },
    { type:'vocab', q: "What is the meaning of 'acquire'?", a:"obtain", opts:["obtain","remove","ignore"] },
    { type:'vocab', q: "What is the meaning of 'annual'?", a:"yearly", opts:["monthly","none","yearly"] },
    { type:'grammar', q: "Fill: He ___ his homework every night.", a:"does", opts:["do","does","did"] },
    { type:'grammar', q: "Passive voice: The letter ___ by the manager.", a:"was signed", opts:["signs","was signed","is signing"] }
  ];

  // 產生 100 題（循環 templates 並變化字尾或數字）
  for(let i=0;i<100;i++){
    const t = templates[i % templates.length];
    // 複製並小幅變體化問題內容（保持題型一致）
    const q = {
      id: 'q' + (i+1),
      type: t.type,
      question: `${t.q} [#${i+1}]`,
      answer: t.a,
      options: t.opts.map(o => o + ((i%7===0)?'':''))
    };
    bank.push(q);
  }
  return bank;
}

const questionBank = generateQuestionBank(); // 100 題 for test
const skillBank = generateQuestionBank();     // 100 題 for skill (可改成不同題庫)

/***** ----- Helper: 抽題 ----- *****/
function drawRandomQuestions(bank, count){
  const copy = bank.slice();
  const out = [];
  while(out.length < count && copy.length){
    const idx = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}

/***** ----- 錯題本 localStorage API ----- *****/
const ERR_KEY = 'toeic_error_notes_v1';

function loadErrorNotes(){
  return JSON.parse(localStorage.getItem(ERR_KEY) || '[]');
}

function saveErrorNotes(arr){
  localStorage.setItem(ERR_KEY, JSON.stringify(arr));
}

function addErrorNote(obj){
  // obj: { question, answer, source:'test'|'skill', note }
  const arr = loadErrorNotes();
  arr.push(Object.assign({ t: Date.now() }, obj));
  saveErrorNotes(arr);
}

function updateErrorNote(index, partial){
  const arr = loadErrorNotes();
  if(index>=0 && index < arr.length){
    arr[index] = Object.assign({}, arr[index], partial);
    saveErrorNotes(arr);
  }
}

function deleteErrorNote(index){
  const arr = loadErrorNotes();
  if(index>=0 && index < arr.length){
    arr.splice(index,1);
    saveErrorNotes(arr);
  }
}

function clearErrorNotes(){
  localStorage.removeItem(ERR_KEY);
}

/***** ----- 小工具 ----- *****/
function createEl(tag, attrs={}, children=[]){
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') el.className = v;
    else if(k==='html') el.innerHTML = v;
    else el.setAttribute(k,v);
  });
  children.forEach(c => el.appendChild(c));
  return el;
}

/* 用於顯示選項選擇欄位的 helper */
function makeOptionHtml(q, idx){
  // 返回一段 HTML 字串
  return q.options.map((opt, i) => 
    `<label class="option"><input type="radio" name="${q.id}" value="${opt}"> ${opt}</label>`
  ).join('');
}
