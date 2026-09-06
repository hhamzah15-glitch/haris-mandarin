/* Haris's Mandarin — app logic. Reads everything from UNITS in data.js. */

const STORAGE_KEY = "harisMandarin.progress.v1";

function loadProgress(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { known: {}, mastered: {} };
  }catch(e){
    return { known: {}, mastered: {} };
  }
}
function saveProgress(p){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }catch(e){/* ignore */}
}
let progress = loadProgress();

/* ---------- Derived data ---------- */

// Unique vocab across all units, keeping which unit ids each word appears in
function buildVocabIndex(){
  const map = new Map();
  UNITS.forEach(unit => {
    unit.vocab.forEach(v => {
      if(!map.has(v.word)){
        map.set(v.word, { ...v, units: [unit.id] });
      } else {
        const entry = map.get(v.word);
        if(!entry.units.includes(unit.id)) entry.units.push(unit.id);
      }
    });
  });
  return Array.from(map.values());
}
const VOCAB = buildVocabIndex();

// Unique single characters, each with an example word for context
function buildCharIndex(){
  const map = new Map();
  const hanziRe = /[一-鿿]/;
  UNITS.forEach(unit => {
    unit.vocab.forEach(v => {
      for(const ch of v.word){
        if(!hanziRe.test(ch)) continue;
        if(!map.has(ch)){
          map.set(ch, { char: ch, exampleWord: v.word, pinyin: v.pinyin, meaning: v.meaning, units: [unit.id] });
        } else {
          const entry = map.get(ch);
          if(!entry.units.includes(unit.id)) entry.units.push(unit.id);
        }
      }
    });
  });
  return Array.from(map.values());
}
const CHARS = buildCharIndex();

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ---------- Tabs ---------- */

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

/* ---------- Home ---------- */

function renderHome(){
  document.getElementById("syncedNote").textContent = "Synced from Seesaw: " + LAST_SYNCED;

  const knownCount = Object.keys(progress.known).filter(w => progress.known[w]).length;
  const masteredCount = Object.keys(progress.mastered).filter(c => progress.mastered[c]).length;
  const totalSentences = UNITS.reduce((n,u)=>n+u.sentencePatterns.length,0);

  document.getElementById("statsRow").innerHTML = `
    <div class="stat-box"><div class="num">${VOCAB.length}</div><div class="label">words taught</div></div>
    <div class="stat-box"><div class="num">${knownCount}</div><div class="label">words you know</div></div>
    <div class="stat-box"><div class="num">${masteredCount}</div><div class="label">characters mastered</div></div>
  `;

  const list = document.getElementById("unitList");
  list.innerHTML = "";
  UNITS.forEach(unit => {
    const div = document.createElement("div");
    div.className = "unit-card";
    div.innerHTML = `
      <h3>${unit.title}</h3>
      <div class="meta">${unit.source}</div>
      <div class="word-chip-row">
        ${unit.vocab.map(v => `<span class="chip">${v.word}</span>`).join("")}
      </div>
    `;
    list.appendChild(div);
  });
}

/* ---------- Unit filter dropdowns ---------- */

function populateUnitFilter(selectEl){
  selectEl.innerHTML = `<option value="all">All units</option>` +
    UNITS.map(u => `<option value="${u.id}">${u.title}</option>`).join("");
}

/* ---------- Flashcards ---------- */

let fcList = [];
let fcIndex = 0;

function fcCurrentVocab(){
  const unitId = document.getElementById("fcUnitFilter").value;
  return unitId === "all" ? VOCAB : VOCAB.filter(v => v.units.includes(unitId));
}

function fcNewSession(){
  fcList = shuffle(fcCurrentVocab());
  fcIndex = 0;
  renderFlashcard();
}

function renderFlashcard(){
  const card = document.getElementById("flashcard");
  card.classList.remove("flipped");
  const direction = document.getElementById("fcDirection").value;

  if(fcList.length === 0){
    document.getElementById("fcFront").innerHTML = `<p>No words in this unit yet.</p>`;
    document.getElementById("fcBack").innerHTML = "";
    document.getElementById("fcProgress").textContent = "";
    return;
  }

  const item = fcList[fcIndex % fcList.length];

  if(direction === "cn2en"){
    document.getElementById("fcFront").innerHTML = `<div class="hanzi">${item.word}</div>`;
    document.getElementById("fcBack").innerHTML = `
      <div class="pinyin">${item.pinyin}</div>
      <div class="meaning">${item.meaning}</div>`;
  } else {
    document.getElementById("fcFront").innerHTML = `<div class="en-word">${item.meaning}</div>`;
    document.getElementById("fcBack").innerHTML = `
      <div class="hanzi-small">${item.word}</div>
      <div class="pinyin">${item.pinyin}</div>`;
  }

  const knownCount = fcList.filter(v => progress.known[v.word]).length;
  document.getElementById("fcProgress").textContent =
    `Card ${ (fcIndex % fcList.length) + 1 } of ${fcList.length} · ${knownCount} known in this set`;
}

function fcAdvance(markKnown){
  const item = fcList[fcIndex % fcList.length];
  if(item){
    progress.known[item.word] = markKnown;
    saveProgress(progress);
  }
  fcIndex++;
  renderFlashcard();
  renderHome();
}

document.getElementById("flashcard").addEventListener("click", () => {
  document.getElementById("flashcard").classList.toggle("flipped");
});
document.getElementById("fcGotIt").addEventListener("click", () => fcAdvance(true));
document.getElementById("fcStillLearning").addEventListener("click", () => fcAdvance(false));
document.getElementById("fcUnitFilter").addEventListener("change", fcNewSession);
document.getElementById("fcDirection").addEventListener("change", renderFlashcard);

/* ---------- Write ---------- */

let currentWriter = null;
let currentChar = null;

function writeCurrentChars(){
  const unitId = document.getElementById("writeUnitFilter").value;
  return unitId === "all" ? CHARS : CHARS.filter(c => c.units.includes(unitId));
}

function renderCharPicker(){
  const chars = writeCurrentChars();
  const picker = document.getElementById("charPicker");
  picker.innerHTML = "";
  chars.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "char-btn" + (progress.mastered[c.char] ? " mastered" : "") + (c.char === currentChar ? " active" : "");
    btn.textContent = c.char;
    btn.title = c.pinyin + " · " + c.meaning;
    btn.addEventListener("click", () => selectChar(c));
    picker.appendChild(btn);
  });
  if(!currentChar && chars.length){
    selectChar(chars[0]);
  }
}

function selectChar(c){
  currentChar = c.char;
  document.getElementById("writePinyin").textContent = `${c.char}  (${c.pinyin})`;
  document.getElementById("writeMeaning").textContent = `From "${c.exampleWord}" — ${c.meaning}`;
  renderCharPicker();

  const target = document.getElementById("hanziTarget");
  target.innerHTML = "";
  const size = target.clientWidth || 260;

  if(typeof HanziWriter === "undefined"){
    currentWriter = null;
    target.innerHTML = `<p style="padding:1rem;color:var(--muted);font-size:0.85rem;">
      Stroke-order practice needs an internet connection to load character data.
      Check your connection and reload the page.</p>`;
    return;
  }

  try{
    currentWriter = HanziWriter.create(target, c.char, {
      width: size,
      height: size,
      padding: 12,
      showOutline: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 300
    });
  }catch(err){
    currentWriter = null;
    target.innerHTML = `<p style="padding:1rem;color:var(--muted);font-size:0.85rem;">
      Couldn't load this character's stroke data right now. Try again in a moment.</p>`;
  }
}

document.getElementById("btnShowStrokes").addEventListener("click", () => {
  if(currentWriter) currentWriter.animateCharacter();
});
document.getElementById("btnQuizMe").addEventListener("click", () => {
  if(!currentWriter) return;
  currentWriter.quiz({
    onComplete: (summary) => {
      progress.mastered[currentChar] = true;
      saveProgress(progress);
      renderCharPicker();
      renderHome();
    }
  });
});
document.getElementById("writeUnitFilter").addEventListener("change", () => {
  currentChar = null;
  renderCharPicker();
});

/* ---------- Sentences ---------- */

function sentUnits(){
  const unitId = document.getElementById("sentUnitFilter").value;
  return unitId === "all" ? UNITS : UNITS.filter(u => u.id === unitId);
}

function renderSentences(){
  const container = document.getElementById("sentenceList");
  container.innerHTML = "";

  sentUnits().forEach(unit => {
    unit.sentencePatterns.forEach((p, idx) => {
      const card = document.createElement("div");
      card.className = "sentence-card";

      let blankHtml = "";
      if(p.blankCount && p.blankWordBank){
        const parts = p.chinese.split("___");
        const slotsId = `slots-${unit.id}-${idx}`;
        const bankId = `bank-${unit.id}-${idx}`;
        const resultId = `result-${unit.id}-${idx}`;

        let sentenceHtml = parts[0];
        for(let i=1;i<parts.length;i++){
          sentenceHtml += `<span class="blank-slot" data-slot="${i-1}" id="${slotsId}-${i-1}">?</span>`;
          sentenceHtml += parts[i];
        }

        blankHtml = `
          <div class="blank-fill">
            <div><strong>Build it yourself:</strong></div>
            <div class="chinese" style="margin-top:0.4rem;">${sentenceHtml}</div>
            <div class="word-bank" id="${bankId}"></div>
            <div class="sentence-tools">
              <button class="btn btn-soft" data-reset="${unit.id}|${idx}">Reset</button>
              <button class="btn btn-primary" data-check="${unit.id}|${idx}">Check</button>
            </div>
            <div class="check-result" id="${resultId}"></div>
          </div>
        `;
      }

      card.innerHTML = `
        <h3>${p.title}</h3>
        <div class="chinese">${p.chinese}</div>
        <div class="pinyin">${p.pinyin}</div>
        <div class="meaning">${p.meaning}</div>
        ${blankHtml}
      `;
      container.appendChild(card);

      if(p.blankCount && p.blankWordBank){
        setupBlankFill(unit.id, idx, p);
      }
    });
  });

  if(container.innerHTML === ""){
    container.innerHTML = `<p>No sentence patterns in this unit yet.</p>`;
  }
}

const blankState = {}; // key: "unitId|idx" -> {slots: [word|null], usedTiles: Set}

function setupBlankFill(unitId, idx, pattern){
  const key = `${unitId}|${idx}`;
  blankState[key] = { slots: new Array(pattern.blankCount).fill(null) };

  const bank = document.getElementById(`bank-${unitId}-${idx}`);
  bank.innerHTML = "";
  const tiles = shuffle(pattern.blankWordBank);
  tiles.forEach((word, tileIdx) => {
    const tile = document.createElement("button");
    tile.className = "word-tile";
    tile.textContent = word;
    tile.dataset.tileIdx = tileIdx;
    tile.addEventListener("click", () => {
      const state = blankState[key];
      const nextEmpty = state.slots.findIndex(s => s === null);
      if(nextEmpty === -1) return;
      state.slots[nextEmpty] = { word, tileIdx };
      tile.classList.add("used");
      const slotEl = document.getElementById(`slots-${unitId}-${idx}-${nextEmpty}`);
      slotEl.textContent = word;
      slotEl.classList.add("filled");
      slotEl.onclick = () => {
        state.slots[nextEmpty] = null;
        slotEl.textContent = "?";
        slotEl.classList.remove("filled");
        tile.classList.remove("used");
      };
    });
    bank.appendChild(tile);
  });

  document.querySelector(`[data-check="${key}"]`).addEventListener("click", () => {
    const state = blankState[key];
    const resultEl = document.getElementById(`result-${unitId}-${idx}`);
    if(state.slots.some(s => s === null)){
      resultEl.textContent = "Fill in every blank first!";
      resultEl.className = "check-result bad";
    } else {
      resultEl.textContent = "Nice! That's a real sentence using words Haris has learned. 👏";
      resultEl.className = "check-result ok";
    }
  });

  document.querySelector(`[data-reset="${key}"]`).addEventListener("click", () => {
    renderSentences();
  });
}

document.getElementById("sentUnitFilter").addEventListener("change", renderSentences);

/* ---------- Init ---------- */

function init(){
  populateUnitFilter(document.getElementById("fcUnitFilter"));
  populateUnitFilter(document.getElementById("writeUnitFilter"));
  populateUnitFilter(document.getElementById("sentUnitFilter"));

  // Render the tabs that don't depend on the external stroke-data library first,
  // so a slow/broken CDN load never leaves the rest of the app blank.
  renderHome();
  fcNewSession();
  renderSentences();

  try{
    renderCharPicker();
  }catch(err){
    console.error("Write tab failed to initialise:", err);
  }
}

init();
