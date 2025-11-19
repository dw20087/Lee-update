// 간단한 단어 데이터 예시: {word, meaning}
// 실제로는 더 많은 항목을 추가하세요.
const words = [
  { word: "apple", meaning: "사과" },
  { word: "study", meaning: "공부하다" },
  { word: "efficient", meaning: "효율적인" },
  { word: "remarkable", meaning: "주목할 만한" },
  { word: "challenge", meaning: "도전, 어려움" }
];

const frontEl = document.getElementById('front');
const backEl = document.getElementById('back');
const revealBtn = document.getElementById('revealBtn');
const nextBtn = document.getElementById('nextBtn');
const markBtn = document.getElementById('markBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const progressEl = document.getElementById('progress');
const learnedCountEl = document.getElementById('learnedCount');

let order = [];
let idx = 0;
let learned = new Set(JSON.parse(localStorage.getItem('flash_learned') || '[]'));

function saveLearned(){
  localStorage.setItem('flash_learned', JSON.stringify([...learned]));
}

function initOrder(){
  order = words.map((_, i) => i);
  shuffle(order);
  idx = 0;
  render();
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

function render(){
  if(order.length === 0){
    frontEl.textContent = '단어 없음';
    backEl.textContent = '';
    progressEl.textContent = '0 / 0';
    learnedCountEl.textContent = `암기: ${learned.size}`;
    return;
  }
  const cur = words[order[idx]];
  frontEl.textContent = cur.word;
  backEl.textContent = cur.meaning;
  backEl.classList.add('hidden');
  progressEl.textContent = `${idx+1} / ${order.length}`;
  learnedCountEl.textContent = `암기: ${learned.size}`;
  updateMarkBtn();
}

function reveal(){
  backEl.classList.remove('hidden');
}

function next(){
  if(order.length === 0) return;
  idx = (idx + 1) % order.length;
  render();
}

function toggleMark(){
  const i = order[idx];
  if(learned.has(i)){
    learned.delete(i);
  } else {
    learned.add(i);
  }
  saveLearned();
  updateMarkBtn();
  learnedCountEl.textContent = `암기: ${learned.size}`;
}

function updateMarkBtn(){
  const i = order[idx];
  if(learned.has(i)){
    markBtn.textContent = '암기 취소';
    markBtn.style.opacity = '0.8';
  } else {
    markBtn.textContent = '암기 표시';
    markBtn.style.opacity = '1';
  }
}

// 섞기 버튼: 암기한 단어 제외하고 섞기
function shuffleUnlearned(){
  const unlearned = words.map((_,i)=>i).filter(i=>!learned.has(i));
  if(unlearned.length===0){
    alert('모든 단어를 암기한 상태입니다!');
    return;
  }
  order = unlearned;
  shuffle(order);
  idx = 0;
  render();
}

revealBtn.addEventListener('click', reveal);
nextBtn.addEventListener('click', next);
markBtn.addEventListener('click', toggleMark);
shuffleBtn.addEventListener('click', shuffleUnlearned);

// 초기화
initOrder();
