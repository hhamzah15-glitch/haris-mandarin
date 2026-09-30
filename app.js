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

/* ---------- Rewards / Gamification ---------- */
/* Gold, puzzle pieces, medals, treasure chests and seasonal Home backgrounds.
   Purely a motivation layer on top of the real progress tracked above —
   never changes which words/characters/sentences the app teaches. */

const REWARDS_KEY = "harisMandarin.rewards.v2";

// Shop items are unlocked in this order. Each locked item is a picture puzzle —
// clearing any tab anywhere in the app earns a piece toward the CURRENT item
// (the first one not yet owned). Once every piece is in, it becomes purchasable
// with gold. Themes are global, family-friendly events — nothing Mandarin-specific,
// so the reward system stays fun even for units that are all-characters.
const SHOP_ITEMS = [
  { id: "classic",  name: "Classic Red",          price: 0,  pieces: [] }, // always owned, no puzzle
  { id: "halloween",name: "Halloween Night",       price: 50, pieces: ["🎃","👻","🦇","🌙","🍬","🕸️"] },
  { id: "eid",      name: "Eid Celebration",       price: 60, pieces: ["🌙","🕌","⭐","🏮","🎁","🍩"] },
  { id: "children", name: "World Children's Day",  price: 60, pieces: ["🎈","🌈","🧸","🎠","⭐","🎉"] },
  { id: "winter",   name: "Winter Holidays",       price: 70, pieces: ["🎄","❄️","🎁","⛄","🔔","🌟"] },
  { id: "lunarny",  name: "Lunar New Year",        price: 80, pieces: ["🧧","🏮","🐉","🎆","🍊","✨"] }
];

const MEDALS = [
  { id: "first-clear",      name: "First Steps",      desc: "Complete any activity for the first time", emoji: "🥉" },
  { id: "perfect-dictation",name: "Perfect Dictation",desc: "Score 100% in a Dictation quiz of 3+ words", emoji: "🎯" },
  { id: "bookworm",         name: "Bookworm",         desc: "Master 10 characters in Write",             emoji: "📖" },
  { id: "wordsmith",        name: "Wordsmith",        desc: "Master 25 characters in Write",             emoji: "🖋️" },
  { id: "streak-3",         name: "3-Day Streak",     desc: "Practise 3 days in a row",                  emoji: "🔥" },
  { id: "streak-7",         name: "7-Day Streak",     desc: "Practise 7 days in a row",                  emoji: "🔥" },
  { id: "streak-30",        name: "30-Day Streak",    desc: "Practise 30 days in a row",                 emoji: "🔥" },
  { id: "treasure-hunter",  name: "Treasure Hunter",  desc: "Open 5 treasure chests",                    emoji: "🗝️" },
  { id: "all-rounder",      name: "All-Rounder",      desc: "Fully complete 3 units",                    emoji: "🌟" }
];

function todayStr(dateObj){
  const d = dateObj || new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

function defaultRewards(){
  return {
    gold: 0,
    completions: {},        // completions[unitId][tab] = { firstDate, lastDate, times }
    unitTabsDone: {},       // unitTabsDone[unitId] = { tab: true } — which tabs are cleared per unit
    unitMedalAwarded: {},   // unitId -> true once fully cleared
    sentencesChecked: {},   // "unitId|patternIdx" -> true
    medals: {},             // medalId -> date earned
    chests: { unopened: 0, openedTotal: 0 },
    streak: { current: 0, longest: 0, lastActiveDate: null },
    puzzle: { pieces: 0 },  // pieces collected toward the CURRENT shop item's picture
    background: { owned: ["classic"], active: "classic" }
  };
}
function loadRewards(){
  const d = defaultRewards();
  try{
    const raw = JSON.parse(localStorage.getItem(REWARDS_KEY));
    if(!raw || typeof raw !== "object") return d;
    return {
      gold: typeof raw.gold === "number" ? raw.gold : 0,
      completions: raw.completions || {},
      unitTabsDone: raw.unitTabsDone || {},
      unitMedalAwarded: raw.unitMedalAwarded || {},
      sentencesChecked: raw.sentencesChecked || {},
      medals: raw.medals || {},
      chests: Object.assign({ unopened: 0, openedTotal: 0 }, raw.chests || {}),
      streak: Object.assign({ current: 0, longest: 0, lastActiveDate: null }, raw.streak || {}),
      puzzle: Object.assign({ pieces: 0 }, raw.puzzle || {}),
      background: Object.assign({ owned: ["classic"], active: "classic" }, raw.background || {})
    };
  }catch(e){ return d; }
}
function saveRewards(){ try{ localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards)); }catch(e){/* ignore */} }
let rewards = loadRewards();

function tabLabel(tab){
  return { recognise: "Recognise", write: "Write", sentences: "Sentences", dictation: "Dictation" }[tab] || tab;
}
function tabIcon(tab){
  return { recognise: "🔤", write: "✍️", sentences: "📝", dictation: "✏️" }[tab] || "•";
}

// Which of the 4 tabs actually have practisable content for a given unit —
// some early units have no fill-in-blank sentence pattern, so they only need
// 3 pieces, not 4.
function unitApplicableTabs(unit){
  const tabs = [];
  if(unit.vocab.length) tabs.push("recognise");
  if(CHARS.some(c => c.units.includes(unit.id))) tabs.push("write");
  if(unit.sentencePatterns.some(p => p.blankCount)) tabs.push("sentences");
  if(unit.vocab.length) tabs.push("dictation");
  return tabs;
}

function toastReward(msg, emoji){
  const el = document.createElement("div");
  el.className = "reward-toast";
  el.innerHTML = `<span class="rt-emoji">${emoji || "✨"}</span><span></span>`;
  el.querySelector("span:last-child").textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

function addGold(amount, reason){
  rewards.gold += amount;
  toastReward(`+${amount} gold — ${reason}`, "🪙");
  saveRewards();
}

function awardMedal(id){
  if(rewards.medals[id]) return;
  rewards.medals[id] = todayStr();
  saveRewards();
  const m = MEDALS.find(x => x.id === id);
  toastReward(`Medal earned: ${m ? m.name : id}`, m ? m.emoji : "🏅");
}

function grantChest(){
  rewards.chests.unopened += 1;
  saveRewards();
  toastReward("A treasure chest arrived! Open it on the Home tab.", "🎁");
}

function bumpStreak(){
  const today = todayStr();
  const s = rewards.streak;
  if(s.lastActiveDate === today) return;
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yesterday = todayStr(yest);
  s.current = (s.lastActiveDate === yesterday) ? s.current + 1 : 1;
  s.lastActiveDate = today;
  if(s.current > s.longest) s.longest = s.current;
  saveRewards();
  [3, 7, 30].forEach(n => { if(s.current === n) awardMedal(`streak-${n}`); });
  if(s.current > 0 && s.current % 5 === 0) grantChest();
}

function checkMasteryMedals(){
  const masteredCount = Object.keys(progress.mastered).filter(c => progress.mastered[c]).length;
  if(masteredCount >= 10) awardMedal("bookworm");
  if(masteredCount >= 25) awardMedal("wordsmith");
}

function markTabDone(unitId, tab){
  rewards.unitTabsDone[unitId] = rewards.unitTabsDone[unitId] || {};
  if(rewards.unitTabsDone[unitId][tab]) return;
  rewards.unitTabsDone[unitId][tab] = true;
  saveRewards();
}

// The shop item currently being assembled: the first one (in SHOP_ITEMS order)
// that isn't owned yet. Pieces only ever go toward this one item at a time —
// once it's bought, the next locked item becomes the new target.
function currentShopTarget(){
  return SHOP_ITEMS.find(it => it.pieces.length && !rewards.background.owned.includes(it.id)) || null;
}

function awardPuzzlePiece(){
  const target = currentShopTarget();
  if(!target) return;
  if(rewards.puzzle.pieces >= target.pieces.length) return; // full — waiting on purchase
  rewards.puzzle.pieces += 1;
  saveRewards();
  if(rewards.puzzle.pieces >= target.pieces.length){
    toastReward(`${target.name} picture complete — it's ready to buy in the Shop!`, "🧩");
  } else {
    toastReward(`Puzzle piece! ${rewards.puzzle.pieces}/${target.pieces.length} for ${target.name}`, "🧩");
  }
}

function checkUnitComplete(unit){
  if(rewards.unitMedalAwarded[unit.id]) return;
  const applicable = unitApplicableTabs(unit);
  const done_ = rewards.unitTabsDone[unit.id] || {};
  const done = applicable.length > 0 && applicable.every(t => done_[t]);
  if(!done) return;
  rewards.unitMedalAwarded[unit.id] = true;
  rewards.gold += 30;
  saveRewards();
  toastReward(`Unit complete: ${unit.title}! +30 gold and a treasure chest 🏆`, "🏆");
  grantChest();
  const fullyCleared = UNITS.filter(u => rewards.unitMedalAwarded[u.id]).length;
  if(fullyCleared >= 3) awardMedal("all-rounder");
}

// Called whenever a learner finishes a Recognise/Write/Sentences/Dictation
// activity for a specific unit. Awards a puzzle piece + gold the first time,
// a smaller gold bonus for practising it again on a later day.
function recordCompletion(unitId, tab){
  const unit = UNITS.find(u => u.id === unitId);
  if(!unit) return;
  const today = todayStr();
  rewards.completions[unitId] = rewards.completions[unitId] || {};
  const rec = rewards.completions[unitId][tab] || { firstDate: null, lastDate: null, times: 0 };
  const isFirst = !rec.firstDate;
  const isNewDay = rec.lastDate !== today;

  if(isFirst){
    rec.firstDate = today;
    rec.lastDate = today;
    rec.times = 1;
    rewards.completions[unitId][tab] = rec;
    saveRewards();
    markTabDone(unitId, tab);
    awardPuzzlePiece();
    addGold(15, `${tabLabel(tab)} · ${unit.title}`);
    awardMedal("first-clear");
    bumpStreak();
    checkUnitComplete(unit);
  } else if(isNewDay){
    rec.lastDate = today;
    rec.times += 1;
    rewards.completions[unitId][tab] = rec;
    saveRewards();
    addGold(5, `practice bonus · ${tabLabel(tab)}`);
    bumpStreak();
  } else {
    bumpStreak();
  }
  renderHome();
  renderRewardsPanel();
}

/* ----- Home rewards panel: gold/streak bar, chests, medals, shop ----- */

function renderRewardsPanel(){
  const bar = document.getElementById("rewardsBar");
  if(bar){
    bar.innerHTML = `
      <div class="reward-pill gold-pill">🪙 <strong>${rewards.gold}</strong>&nbsp;gold</div>
      <div class="reward-pill streak-pill">🔥 <strong>${rewards.streak.current}</strong>&nbsp;day streak</div>
    `;
  }
  renderChestTray();
  renderMedalCase();
  renderShop();
}

function renderChestTray(){
  const tray = document.getElementById("chestTray");
  if(!tray) return;
  const n = rewards.chests.unopened;
  if(n <= 0){
    tray.innerHTML = `<p class="empty-note">No treasure chests right now — clear a tab for a unit to earn one!</p>`;
    return;
  }
  tray.innerHTML = "";
  for(let i = 0; i < n; i++){
    const btn = document.createElement("button");
    btn.className = "chest-btn";
    btn.innerHTML = `🎁<span>Open</span>`;
    btn.addEventListener("click", openChest);
    tray.appendChild(btn);
  }
}

function openChest(){
  if(rewards.chests.unopened <= 0) return;
  rewards.chests.unopened -= 1;
  rewards.chests.openedTotal += 1;
  const amount = 10 + Math.floor(Math.random() * 41); // 10–50 gold
  rewards.gold += amount;
  saveRewards();
  toastReward(`Treasure chest opened: +${amount} gold!`, "🎉");
  if(rewards.chests.openedTotal >= 5) awardMedal("treasure-hunter");
  renderRewardsPanel();
}

function renderMedalCase(){
  const host = document.getElementById("medalCase");
  if(!host) return;
  host.innerHTML = MEDALS.map(m => {
    const earned = !!rewards.medals[m.id];
    return `<div class="medal-badge ${earned ? "earned" : "locked"}" title="${m.desc}">
      <span class="medal-emoji">${earned ? m.emoji : "🔒"}</span>
      <span class="medal-name">${m.name}</span>
    </div>`;
  }).join("");
}

function renderShop(){
  const host = document.getElementById("shopGrid");
  if(!host) return;
  const target = currentShopTarget();

  host.innerHTML = SHOP_ITEMS.map(bg => {
    const owned = rewards.background.owned.includes(bg.id);
    const active = rewards.background.active === bg.id;
    const isTarget = target && target.id === bg.id;
    const gotPieces = isTarget ? rewards.puzzle.pieces : (owned ? bg.pieces.length : 0);
    const puzzleReady = bg.pieces.length > 0 && gotPieces >= bg.pieces.length;

    let puzzleHtml = "";
    if(bg.pieces.length){
      puzzleHtml = `<div class="puzzle-grid">
        ${bg.pieces.map((emoji, i) => {
          const revealed = owned || (isTarget && i < gotPieces);
          return `<span class="puzzle-cell ${revealed ? "revealed" : ""}">${revealed ? emoji : "❓"}</span>`;
        }).join("")}
      </div>
      <div class="puzzle-count">${owned ? "Picture complete" : `${gotPieces}/${bg.pieces.length} pieces`}</div>`;
    }

    let btnHtml;
    if(active){
      btnHtml = `<button class="btn btn-soft" disabled>Equipped</button>`;
    } else if(owned){
      btnHtml = `<button class="btn btn-soft" data-equip="${bg.id}">Equip</button>`;
    } else if(!bg.pieces.length || puzzleReady){
      const afford = rewards.gold >= bg.price;
      btnHtml = `<button class="btn btn-primary" data-buy="${bg.id}" ${afford ? "" : "disabled"}>Buy · 🪙${bg.price}</button>`;
    } else if(isTarget){
      btnHtml = `<button class="btn btn-soft" disabled>Collecting pieces…</button>`;
    } else {
      btnHtml = `<button class="btn btn-soft" disabled>🔒 Locked</button>`;
    }

    return `<div class="shop-item ${owned ? "owned" : ""}">
      ${puzzleHtml}
      <div class="shop-name">${bg.name}</div>
      <div class="shop-price ${bg.price === 0 ? "free" : ""}">${bg.price === 0 ? "Free" : "🪙 " + bg.price}</div>
      ${btnHtml}
    </div>`;
  }).join("");

  host.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => buyBackground(btn.dataset.buy));
  });
  host.querySelectorAll("[data-equip]").forEach(btn => {
    btn.addEventListener("click", () => equipBackground(btn.dataset.equip));
  });
}

function buyBackground(id){
  const bg = SHOP_ITEMS.find(b => b.id === id);
  if(!bg || rewards.background.owned.includes(id) || rewards.gold < bg.price) return;
  const target = currentShopTarget();
  if(bg.pieces.length && (!target || target.id !== id || rewards.puzzle.pieces < bg.pieces.length)) return;
  rewards.gold -= bg.price;
  rewards.background.owned.push(id);
  rewards.background.active = id;
  rewards.puzzle.pieces = 0; // reset for the next item's picture
  saveRewards();
  applyBackground();
  toastReward(`${bg.name} unlocked!`, bg.pieces[0] || "🎉");
  renderRewardsPanel();
}
function equipBackground(id){
  if(!rewards.background.owned.includes(id)) return;
  rewards.background.active = id;
  saveRewards();
  applyBackground();
  renderRewardsPanel();
}
function applyBackground(){
  const id = rewards.background.active;
  document.body.className = document.body.className.replace(/\btheme-\S+/g, "").trim();
  document.body.classList.add("theme-" + id);
  const bg = SHOP_ITEMS.find(b => b.id === id);
  const strip = document.getElementById("themeEmojiStrip");
  if(strip) strip.textContent = (bg && bg.pieces.length) ? bg.pieces.join(" ").repeat(2) : "";
}

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
    const applicable = unitApplicableTabs(unit);
    const done = rewards.unitTabsDone[unit.id] || {};
    const doneCount = applicable.filter(t => done[t]).length;
    const complete = !!rewards.unitMedalAwarded[unit.id];

    const div = document.createElement("div");
    div.className = "unit-card" + (complete ? " unit-complete" : "");
    div.innerHTML = `
      <div class="unit-card-head">
        <h3>${unit.title}</h3>
        ${complete ? '<span class="unit-medal-badge" title="Unit complete">🏆</span>' : ""}
      </div>
      <div class="meta">${unit.source}</div>
      <div class="word-chip-row">
        ${unit.vocab.map(v => `<span class="chip">${v.word}</span>`).join("")}
      </div>
      <div class="unit-puzzle">
        <span class="puzzle-label">✅ ${doneCount}/${applicable.length} tabs cleared</span>
        <span class="puzzle-dots">
          ${applicable.map(t => `<span class="p-dot ${done[t] ? "done" : ""}" title="${tabLabel(t)}">${tabIcon(t)}</span>`).join("")}
        </span>
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
  if(fcList.length && fcIndex % fcList.length === 0){
    const unitId = document.getElementById("fcUnitFilter").value;
    if(unitId !== "all") recordCompletion(unitId, "recognise");
  }
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
      checkMasteryMedals();
      const charEntry = CHARS.find(c => c.char === currentChar);
      if(charEntry){
        charEntry.units.forEach(unitId => {
          const unitChars = CHARS.filter(c => c.units.includes(unitId));
          if(unitChars.length && unitChars.every(c => progress.mastered[c.char])){
            recordCompletion(unitId, "write");
          }
        });
      }
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

      rewards.sentencesChecked[key] = true;
      saveRewards();
      const unit = UNITS.find(u => u.id === unitId);
      if(unit){
        const totalBlankPatterns = unit.sentencePatterns.filter(p => p.blankCount).length;
        const checkedForUnit = unit.sentencePatterns.filter((p, i) =>
          p.blankCount && rewards.sentencesChecked[`${unitId}|${i}`]
        ).length;
        if(totalBlankPatterns && checkedForUnit >= totalBlankPatterns){
          recordCompletion(unitId, "sentences");
        }
      }
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
  applyBackground();
  renderHome();
  renderRewardsPanel();
  fcNewSession();
  renderSentences();

  try{
    renderCharPicker();
  }catch(err){
    console.error("Write tab failed to initialise:", err);
  }
}

init();

/* ---------- Dictation (听写) ---------- */
/* Practice mode: the word is shown, three gridded rows to copy it into.
   Quiz mode: only pinyin + meaning are shown, one row to write the characters,
   then reveal and self-mark. Every word comes from UNITS — nothing new. */

const DICT_KEY = "harisMandarin.dictation.v1";

let dictSelected = loadDictSelection();
let dictMode = null;      // "practice" | "quiz"
let dictQueue = [];
let dictIdx = 0;
let dictScore = {};       // word -> true/false
let dictRevealed = false;
let dictPads = [];

function loadDictSelection(){
  try{
    const raw = JSON.parse(localStorage.getItem(DICT_KEY));
    return Array.isArray(raw) ? raw.filter(w => VOCAB.some(v => v.word === w)) : [];
  }catch(e){ return []; }
}
function saveDictSelection(){
  try{ localStorage.setItem(DICT_KEY, JSON.stringify(dictSelected)); }catch(e){/* ignore */}
}

function dictBtn(cls, label, fn){
  const b = document.createElement("button");
  b.className = "btn " + cls;
  b.textContent = label;
  b.addEventListener("click", fn);
  return b;
}

function dictWordInfo(word){
  return VOCAB.find(v => v.word === word) || { word: word, pinyin: "", meaning: "" };
}

function showDictScreen(which){
  document.getElementById("dictSetup").hidden   = which !== "setup";
  document.getElementById("dictSession").hidden = which !== "session";
  document.getElementById("dictResults").hidden = which !== "results";
}

/* ----- Step 1: word picker ----- */

function toggleDictWord(word, on){
  const i = dictSelected.indexOf(word);
  if(on && i === -1) dictSelected.push(word);
  if(!on && i !== -1) dictSelected.splice(i, 1);
  saveDictSelection();
  updateDictCount();
}

function updateDictCount(){
  const n = dictSelected.length;
  document.getElementById("dictCount").textContent =
    n === 0 ? "No words picked yet" : (n === 1 ? "1 word selected" : n + " words selected");
  document.getElementById("dictStartPractice").disabled = n === 0;
  document.getElementById("dictStartQuiz").disabled = n === 0;
}

function renderDictPicker(){
  const host = document.getElementById("dictPicker");
  host.innerHTML = "";
  const seen = new Set();

  UNITS.forEach(unit => {
    const words = unit.vocab.filter(v => {
      if(seen.has(v.word)) return false;
      seen.add(v.word);
      return true;
    });
    if(!words.length) return;

    const block = document.createElement("div");
    block.className = "dict-unit";

    const head = document.createElement("div");
    head.className = "dict-unit-head";
    const h3 = document.createElement("h3");
    h3.textContent = unit.title;
    const allBtn = document.createElement("button");
    allBtn.className = "dict-unit-all";
    const allOn = words.every(v => dictSelected.includes(v.word));
    allBtn.textContent = allOn ? "Clear unit" : "Select all";
    allBtn.addEventListener("click", () => {
      words.forEach(v => toggleDictWord(v.word, !allOn));
      renderDictPicker();
    });
    head.appendChild(h3);
    head.appendChild(allBtn);
    block.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "dict-word-grid";
    words.forEach(v => {
      const on = dictSelected.includes(v.word);
      const label = document.createElement("label");
      label.className = "dict-word" + (on ? " on" : "");

      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = on;
      box.addEventListener("change", () => {
        toggleDictWord(v.word, box.checked);
        label.classList.toggle("on", box.checked);
      });

      const hanzi = document.createElement("span");
      hanzi.className = "dw-hanzi";
      hanzi.textContent = v.word;
      const py = document.createElement("span");
      py.className = "dw-pinyin";
      py.textContent = v.pinyin;
      const mean = document.createElement("span");
      mean.className = "dw-meaning";
      mean.textContent = v.meaning;

      label.appendChild(box);
      label.appendChild(hanzi);
      label.appendChild(py);
      label.appendChild(mean);
      grid.appendChild(label);
    });

    block.appendChild(grid);
    host.appendChild(block);
  });

  updateDictCount();
}

/* ----- Writing pad: one canvas per row, one square per character ----- */

function createPad(canvas, cells){
  const ctx = canvas.getContext("2d");
  let strokes = [];      // array of arrays of {x,y} in 0..1 space
  let current = null;
  let cssW = 0, cssH = 0;

  function drawGrid(){
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cssW, cssH);
    const cell = cssW / cells;

    ctx.save();
    ctx.strokeStyle = "rgba(208,52,44,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for(let i = 0; i < cells; i++){
      const x = i * cell;
      ctx.beginPath(); ctx.moveTo(x, cssH / 2); ctx.lineTo(x + cell, cssH / 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + cell / 2, 0); ctx.lineTo(x + cell / 2, cssH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + cell, cssH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + cell, 0); ctx.lineTo(x, cssH); ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = "rgba(208,52,44,0.55)";
    ctx.lineWidth = 1.5;
    for(let i = 0; i < cells; i++){
      ctx.strokeRect(i * cell + 0.75, 0.75, cell - 1.5, cssH - 1.5);
    }
  }

  function drawStrokes(){
    ctx.save();
    ctx.strokeStyle = "#262220";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(4, cssH * 0.055);
    strokes.forEach(pts => {
      if(!pts.length) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x * cssW, pts[0].y * cssH);
      if(pts.length === 1){
        ctx.lineTo(pts[0].x * cssW + 0.1, pts[0].y * cssH);
      } else {
        for(let i = 1; i < pts.length; i++){
          ctx.lineTo(pts[i].x * cssW, pts[i].y * cssH);
        }
      }
      ctx.stroke();
    });
    ctx.restore();
  }

  function redraw(){ drawGrid(); drawStrokes(); }

  function resize(){
    const parent = canvas.parentElement;
    const raw = (parent && parent.clientWidth) ? parent.clientWidth : 320;
    const avail = Math.max(180, raw - 78); // leave room for the Undo/Clear column
    const cell = Math.max(46, Math.min(112, Math.floor(avail / cells) - 2));
    cssW = cell * cells;
    cssH = cell;
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }

  function pos(e){
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / (r.width || 1),
      y: (e.clientY - r.top) / (r.height || 1)
    };
  }

  canvas.addEventListener("pointerdown", e => {
    e.preventDefault();
    try{ canvas.setPointerCapture(e.pointerId); }catch(err){/* ignore */}
    current = [pos(e)];
    strokes.push(current);
    redraw();
  });
  canvas.addEventListener("pointermove", e => {
    if(!current) return;
    e.preventDefault();
    current.push(pos(e));
    redraw();
  });
  function endStroke(){ current = null; }
  canvas.addEventListener("pointerup", endStroke);
  canvas.addEventListener("pointercancel", endStroke);
  canvas.addEventListener("pointerleave", endStroke);

  return {
    resize: resize,
    undo: function(){ strokes.pop(); redraw(); },
    clear: function(){ strokes = []; current = null; redraw(); },
    isEmpty: function(){ return strokes.length === 0; }
  };
}

function buildDictGrids(word, rows){
  const host = document.getElementById("dictGrids");
  host.innerHTML = "";
  dictPads = [];
  const cells = Math.max(1, Array.from(word).length);

  for(let r = 0; r < rows; r++){
    const wrap = document.createElement("div");
    wrap.className = "dict-row";

    const canvas = document.createElement("canvas");
    canvas.className = "dict-pad";
    wrap.appendChild(canvas);

    const tools = document.createElement("div");
    tools.className = "dict-row-tools";
    wrap.appendChild(tools);
    host.appendChild(wrap);

    const pad = createPad(canvas, cells);
    dictPads.push(pad);

    const undo = document.createElement("button");
    undo.className = "pad-btn";
    undo.textContent = "↶ Undo";
    undo.addEventListener("click", () => pad.undo());
    const clear = document.createElement("button");
    clear.className = "pad-btn";
    clear.textContent = "Clear";
    clear.addEventListener("click", () => pad.clear());
    tools.appendChild(undo);
    tools.appendChild(clear);

    pad.resize();
  }
  requestAnimationFrame(() => dictPads.forEach(p => p.resize()));
}

/* ----- The working screen ----- */

function dictStart(mode){
  if(!dictSelected.length) return;
  dictMode = mode;
  dictQueue = mode === "quiz" ? shuffle(dictSelected) : dictSelected.slice();
  dictIdx = 0;
  dictScore = {};
  showDictScreen("session");
  renderDictCard();
}

function renderDictCard(){
  if(dictIdx >= dictQueue.length){ renderDictResults(); return; }

  const info = dictWordInfo(dictQueue[dictIdx]);
  dictRevealed = false;

  document.getElementById("dictModeLabel").textContent =
    dictMode === "practice" ? "Practice ✍️" : "Quiz 📝";
  document.getElementById("dictProgress").textContent =
    (dictIdx + 1) + " / " + dictQueue.length;

  const prompt = document.getElementById("dictPrompt");
  const charCount = Array.from(info.word).length;
  if(dictMode === "practice"){
    prompt.innerHTML =
      '<div class="dict-word-big"></div>' +
      '<div class="dict-pinyin"></div>' +
      '<div class="dict-meaning"></div>';
    prompt.querySelector(".dict-word-big").textContent = info.word;
    prompt.querySelector(".dict-pinyin").textContent = info.pinyin;
    prompt.querySelector(".dict-meaning").textContent = info.meaning;
  } else {
    prompt.innerHTML =
      '<div class="dict-pinyin big"></div>' +
      '<div class="dict-meaning"></div>' +
      '<div class="dict-hint"></div>';
    prompt.querySelector(".dict-pinyin").textContent = info.pinyin;
    prompt.querySelector(".dict-meaning").textContent = info.meaning;
    prompt.querySelector(".dict-hint").textContent =
      charCount + (charCount === 1 ? " character" : " characters");
  }

  buildDictGrids(info.word, dictMode === "practice" ? 3 : 1);
  document.getElementById("dictRevealBox").innerHTML = "";
  renderDictActions();
}

function dictRevealAnswer(){
  const info = dictWordInfo(dictQueue[dictIdx]);
  const box = document.getElementById("dictRevealBox");
  box.innerHTML = '<div class="dict-answer-label">Answer</div><div class="dict-answer"></div>';
  box.querySelector(".dict-answer").textContent = info.word;
  dictRevealed = true;
  renderDictActions();
}

function dictMark(ok){
  dictScore[dictQueue[dictIdx]] = ok;
  dictIdx++;
  renderDictCard();
}

function renderDictActions(){
  const host = document.getElementById("dictActions");
  host.innerHTML = "";

  if(dictMode === "practice"){
    const prev = dictBtn("btn-soft", "← Previous", () => {
      if(dictIdx > 0){ dictIdx--; renderDictCard(); }
    });
    prev.disabled = dictIdx === 0;
    const next = dictBtn(
      "btn-primary",
      dictIdx === dictQueue.length - 1 ? "Finish ✅" : "Next word →",
      () => { dictIdx++; renderDictCard(); }
    );
    host.appendChild(prev);
    host.appendChild(next);
    return;
  }

  if(!dictRevealed){
    host.appendChild(dictBtn("btn-primary", "Reveal answer 👀", dictRevealAnswer));
  } else {
    host.appendChild(dictBtn("btn-soft", "✗ Not quite", () => dictMark(false)));
    host.appendChild(dictBtn("btn-primary", "✓ Got it", () => dictMark(true)));
  }
}

/* ----- Results ----- */

function dictBackToSetup(){
  showDictScreen("setup");
  renderDictPicker();
}

function renderDictResults(){
  showDictScreen("results");
  const host = document.getElementById("dictResults");
  host.innerHTML = "";

  if(dictMode === "practice"){
    const done = document.createElement("div");
    done.className = "dict-done";
    done.innerHTML =
      '<div class="dict-done-emoji">🎉</div>' +
      '<h2>Practice finished</h2>' +
      '<p class="dict-done-sub"></p>';
    done.querySelector(".dict-done-sub").textContent =
      dictQueue.length + (dictQueue.length === 1 ? " word" : " words") +
      " practised. Ready to be tested on them?";
    const actions = document.createElement("div");
    actions.className = "dict-done-actions";
    actions.appendChild(dictBtn("btn-soft", "← Word list", dictBackToSetup));
    actions.appendChild(dictBtn("btn-primary", "Quiz me 📝", () => dictStart("quiz")));
    done.appendChild(actions);
    host.appendChild(done);
    return;
  }

  const words = dictQueue.slice();
  const wrong = words.filter(w => !dictScore[w]);
  const right = words.length - wrong.length;

  if(right === words.length && words.length){
    if(words.length >= 3) awardMedal("perfect-dictation");
    const queueSet = new Set(words);
    UNITS.forEach(unit => {
      const unitWords = unit.vocab.map(v => v.word);
      if(unitWords.length && unitWords.every(w => queueSet.has(w))){
        recordCompletion(unit.id, "dictation");
      }
    });
  }

  const done = document.createElement("div");
  done.className = "dict-done";
  done.innerHTML =
    '<div class="dict-done-emoji"></div>' +
    '<h2>听写 finished</h2>' +
    '<div class="dict-final-score"></div>';
  done.querySelector(".dict-done-emoji").textContent =
    right === words.length ? "🏆" : (right >= words.length / 2 ? "👍" : "💪");
  done.querySelector(".dict-final-score").textContent = right + " / " + words.length + " correct";

  const list = document.createElement("div");
  list.className = "dict-result-list";
  words.forEach(w => {
    const info = dictWordInfo(w);
    const row = document.createElement("div");
    row.className = "dict-result-row " + (dictScore[w] ? "ok" : "bad");
    const mark = document.createElement("span");
    mark.className = "dict-result-mark";
    mark.textContent = dictScore[w] ? "✓" : "✗";
    const hz = document.createElement("span");
    hz.className = "dict-result-hanzi";
    hz.textContent = info.word;
    const py = document.createElement("span");
    py.className = "dict-result-pinyin";
    py.textContent = info.pinyin;
    const mn = document.createElement("span");
    mn.className = "dict-result-meaning";
    mn.textContent = info.meaning;
    row.appendChild(mark);
    row.appendChild(hz);
    row.appendChild(py);
    row.appendChild(mn);
    list.appendChild(row);
  });
  done.appendChild(list);

  const actions = document.createElement("div");
  actions.className = "dict-done-actions";
  actions.appendChild(dictBtn("btn-soft", "← Word list", dictBackToSetup));
  if(wrong.length){
    actions.appendChild(dictBtn("btn-primary", "Retry the " + wrong.length + " missed", () => {
      dictMode = "quiz";
      dictQueue = shuffle(wrong);
      dictIdx = 0;
      dictScore = {};
      showDictScreen("session");
      renderDictCard();
    }));
  } else {
    actions.appendChild(dictBtn("btn-primary", "Go again 🔁", () => dictStart("quiz")));
  }
  done.appendChild(actions);
  host.appendChild(done);
}

/* ----- Init ----- */

function initDictation(){
  renderDictPicker();
  document.getElementById("dictSelectAll").addEventListener("click", () => {
    dictSelected = VOCAB.map(v => v.word);
    saveDictSelection();
    renderDictPicker();
  });
  document.getElementById("dictClearAll").addEventListener("click", () => {
    dictSelected = [];
    saveDictSelection();
    renderDictPicker();
  });
  document.getElementById("dictStartPractice").addEventListener("click", () => dictStart("practice"));
  document.getElementById("dictStartQuiz").addEventListener("click", () => dictStart("quiz"));
  document.getElementById("dictExit").addEventListener("click", dictBackToSetup);
  window.addEventListener("resize", () => dictPads.forEach(p => p.resize()));
  showDictScreen("setup");
}

try{
  initDictation();
}catch(err){
  console.error("Dictation tab failed to initialise:", err);
}
