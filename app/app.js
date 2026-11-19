// Leonida Trophy Guide — checklist, roadmap, filters, spoiler setting, export/import.
// All data comes from data/trophies.json (same origin, fetched once). Progress lives in
// localStorage under KEY and is exported/imported as plain JSON. No network at runtime.
const KEY = 'gta6-trophy-guide-v1';
const POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };
const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

const PHASES = [
  { n: 1, title: 'Story', desc: 'Chapters 1–4 + the final mission. Do Lucia\u2019s balcony meditation in Chapter 1 and save at every chapter start — there is no mission replay.', ids: [2, 3, 4, 5, 6, 7] },
  { n: 2, title: 'Strangers & missions', desc: 'The 6 named story missions plus the stranger strands and their finales — 8 strands for #25, and the time-sensitive Yago race in Chapter 3.', ids: [8, 9, 10, 11, 12, 13, 22, 23, 24, 25, 26, 27] },
  { n: 3, title: 'Activities & collectibles', desc: 'Stunts, shooting range, drone races, fishing, meditation, cards, WAiNK scans, challenges, vehicles, exploring Leonida and the gangs.', ids: [15, 16, 17, 18, 19, 20, 21, 28, 29, 30, 31, 32, 35, 42, 43, 46, 51] },
  { n: 4, title: 'Grind & cleanup', desc: 'The platinum, 100% completion, crime sprees, secret moments and the money trophies. Save these for after the credits.', ids: [1, 14, 33, 34, 36, 37, 38, 39, 40, 41, 44, 45, 47, 48, 49, 50, 52, 53, 54, 55] },
];

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
  if (saved && Array.isArray(saved.earned)) earned = new Set(saved.earned.filter((x) => Number.isInteger(x)));
} catch { earned = new Set(); }

let activePhase = null;
const expanded = new Set();

function save() {
  localStorage.setItem(KEY, JSON.stringify({ version: 1, app: 'gta6-trophy-guide-01', earned: [...earned].sort((a, b) => a - b) }));
}

function isSpoiled(t) {
  return $('spoilerToggle').checked && t.kind === 'story' && t.id !== 1 && !earned.has(t.id);
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderProgress() {
  const total = trophies.length;
  const got = earned.size;
  const pct = total ? Math.round((got / total) * 100) : 0;
  const points = trophies.reduce((s, t) => s + (earned.has(t.id) ? POINTS[t.grade] : 0), 0);
  const totalPoints = trophies.reduce((s, t) => s + POINTS[t.grade], 0);
  $('earnedLine').textContent = `${got} / ${total} earned`;
  $('pointsLine').textContent = `${points.toLocaleString()} / ${totalPoints.toLocaleString()} points`;
  const byGrade = {};
  for (const t of trophies) if (earned.has(t.id)) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  $('gradeLine').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${byGrade[g] ?? 0} ${g}`).join(' · ');
  $('pctLabel').textContent = `${pct}%`;
  $('ringFg').style.strokeDashoffset = String(364.4 * (1 - got / total));
}

function renderRoadmap() {
  const wrap = $('phases');
  wrap.replaceChildren();
  for (const p of PHASES) {
    const btn = el('button', 'phase' + (activePhase === p.n ? ' active' : ''));
    btn.type = 'button';
    btn.setAttribute('aria-pressed', String(activePhase === p.n));
    btn.append(el('span', 'phase-num', `Phase ${p.n}`));
    btn.append(el('h3', null, p.title));
    btn.append(el('p', null, p.desc));
    const names = p.ids.map((id) => trophies.find((t) => t.id === id)).filter(Boolean);
    const meta = el('p', 'phase-trophies');
    meta.innerHTML = '';
    meta.append(el('span', 'phase-count', `${p.ids.length} trophies — `));
    names.forEach((t, i) => {
      if (i) meta.append(document.createTextNode(' · '));
      meta.append(el('b', isSpoiled(t) ? 'spoiler-text' : null, t.name));
    });
    btn.append(meta);
    btn.addEventListener('click', () => {
      activePhase = activePhase === p.n ? null : p.n;
      renderRoadmap();
      renderList();
      if (activePhase) $('trophyList').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    wrap.append(btn);
  }
}

function filtered() {
  const q = $('search').value.trim().toLowerCase();
  const grade = $('gradeFilter').value;
  const kind = $('kindFilter').value;
  const status = $('statusFilter').value;
  const sort = $('sortFilter').value;
  let out = trophies.filter((t) => {
    if (activePhase && !PHASES[activePhase - 1].ids.includes(t.id)) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (kind !== 'all' && t.kind !== kind) return false;
    if (status === 'earned' && !earned.has(t.id)) return false;
    if (status === 'not' && earned.has(t.id)) return false;
    if (status === 'missable' && t.missable !== 'yes') return false;
    if (q && ![t.name, t.description, t.guide].join(' ').toLowerCase().includes(q)) return false;
    return true;
  });
  const byId = (a, b) => a.id - b.id;
  if (sort === 'grade') out = [...out].sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || byId(a, b));
  else if (sort === 'difficulty') out = [...out].sort((a, b) => a.difficulty - b.difficulty || byId(a, b));
  else if (sort === 'name') out = [...out].sort((a, b) => a.name.localeCompare(b.name));
  else out = [...out].sort(byId);
  return out;
}

function renderList() {
  const items = filtered();
  listEl.replaceChildren();
  $('countLine').textContent = `Showing ${items.length} of ${trophies.length} trophies${activePhase ? ` — Phase ${activePhase}` : ''}`;
  $('emptyMsg').hidden = items.length > 0;
  for (const t of items) {
    const spoiled = isSpoiled(t);
    const card = el('article', 'card' + (earned.has(t.id) ? ' earned' : '') + (spoiled ? ' spoiled' : ''));
    card.dataset.trophyId = String(t.id);

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save(); renderProgress(); renderRoadmap(); renderList();
    });
    card.append(box);

    const head = el('div');
    const h = el('h3');
    h.append(el('span', 'num', `#${t.id}`));
    const nameSpan = el('span', spoiled ? 'spoiler-text' : null, t.name);
    h.append(nameSpan);
    const headRow = el('div', 'card-head');
    headRow.append(h);
    headRow.append(el('span', `badge ${t.grade}`, t.grade));
    headRow.append(el('span', 'chip kind', t.kind));
    headRow.append(el('span', 'chip', `Difficulty ${t.difficulty}/5`));
    headRow.append(el('span', 'chip', t.time));
    if (t.missable === 'yes') headRow.append(el('span', 'chip missable', '⚠ Missable'));
    head.append(headRow);
    const off = el('p', 'official');
    off.innerHTML = '';
    off.append(document.createTextNode('Official description: '));
    const q = document.createElement('q');
    q.className = spoiled ? 'spoiler-text' : '';
    q.textContent = t.description;
    off.append(q);
    head.append(off);
    if (spoiled) head.append(el('p', 'spoiler-note', 'Story trophy — hidden until earned. Tick it earned, or turn Spoilers off, to reveal the guide.'));
    card.append(head);

    const btn = el('button', 'details-btn', expanded.has(t.id) ? 'Hide guide' : 'Show guide');
    btn.type = 'button';
    btn.setAttribute('aria-expanded', String(expanded.has(t.id)));
    card.append(btn);

    const body = el('div', 'card-body');
    body.hidden = !expanded.has(t.id) || spoiled;
    if (!spoiled) {
      body.append(el('p', 'guide', t.guide));
      const steps = el('ol', 'steps');
      for (const s of t.steps) steps.append(el('li', null, s));
      body.append(steps);
      if (t.missable === 'yes') body.append(el('p', 'missable-note', t.missable_note));
      const src = el('p', 'sources');
      src.innerHTML = '';
      src.append(el('b', null, 'Sources: '));
      src.append(document.createTextNode(t.sources.join(' · ')));
      body.append(src);
    }
    card.append(body);

    btn.addEventListener('click', () => {
      if (spoiled) return;
      if (expanded.has(t.id)) expanded.delete(t.id); else expanded.add(t.id);
      renderList();
    });
    listEl.append(card);
  }
}

function clearFilters() {
  $('search').value = '';
  $('gradeFilter').value = 'all';
  $('kindFilter').value = 'all';
  $('statusFilter').value = 'all';
  $('sortFilter').value = 'list';
  activePhase = null;
  renderRoadmap();
  renderList();
}

$('search').addEventListener('input', renderList);
$('gradeFilter').addEventListener('change', renderList);
$('kindFilter').addEventListener('change', renderList);
$('statusFilter').addEventListener('change', renderList);
$('sortFilter').addEventListener('change', renderList);
$('spoilerToggle').addEventListener('change', () => { renderRoadmap(); renderList(); });
$('clearFiltersBtn').addEventListener('click', clearFilters);

$('exportBtn').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, app: 'gta6-trophy-guide-01', earned: [...earned].sort((x, y) => x - y) }, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

$('importInput').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  const msg = $('importMsg');
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids) || !ids.every((x) => Number.isInteger(x) && x >= 1 && x <= 55)) throw new Error('bad shape');
    earned = new Set(ids);
    save(); renderProgress(); renderList();
    msg.textContent = `Imported ${earned.size} earned trophies from ${file.name}.`;
  } catch {
    msg.textContent = `Could not import ${file.name}: not a valid progress file.`;
  }
  e.target.value = '';
});

$('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset all trophy progress? This clears every tick.')) return;
  earned = new Set();
  save(); renderProgress(); renderList();
});

renderProgress();
renderRoadmap();
renderList();
