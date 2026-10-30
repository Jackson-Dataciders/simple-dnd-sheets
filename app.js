'use strict';
/* Simple D&D Sheets — everything lives in the browser (localStorage). */

const STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const SPECIES = ['human', 'elf', 'dwarf', 'halfling', 'gnome', 'halfElf', 'halfOrc', 'tiefling', 'dragonborn'];
const CLASSES = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'];
const ALIGN = ['lg', 'ng', 'cg', 'ln', 'n', 'cn', 'le', 'ne', 'ce'];
const USES = ['always', 'short', 'long'];
const OTHER = '__other';
const ARCANA = '◆';
const MAX_ATTACKS = 8; // more would not fit on one A4 page
/* Damage types for basic attacks: badge color + emoji for the dropdown (sheet uses drawn icons). */
const DTYPES = {
  bludgeoning: { color: '#6b625a', emoji: '🔨' }, piercing: { color: '#3f5f80', emoji: '🏹' },
  nature: { color: '#3f7d32', emoji: '🌿' }, fire: { color: '#d2491b', emoji: '🔥' },
  water: { color: '#2a7fbf', emoji: '💧' }, light: { color: '#d4a017', emoji: '☀️' },
  dark: { color: '#3d2a5c', emoji: '🌙' }, mental: { color: '#a03c8c', emoji: '🧠' },
};

const STRINGS = {
  en: {
    appTitle: 'Simple D&D Sheets', characters: 'Characters', newChar: '+ New character', duplicate: 'Duplicate',
    del: 'Delete', confirmDel: 'Delete this character? This cannot be undone.', exportSheet: 'Export sheet (Word)',
    exportCards: 'Export all ability cards', exportCard: 'Export card', unnamed: 'Unnamed hero', preview: 'Sheet preview',
    basics: 'Basics', name: 'Name', species: 'Species', cls: 'Class', alignment: 'Alignment', other: 'Other…',
    otherPh: 'Type your own', picture: 'Picture', upload: 'Upload picture', remove: 'Remove',
    stats: 'Ability scores', proficiency: 'Proficiency', profHint: 'rolls with this stat have advantage', advantage: 'Advantage',
    combat: 'Combat', hp: 'Hit Points', hpCur: 'Current HP', hpMax: 'Max HP', hpNow: 'NOW', hpMaxShort: 'MAX',
    ac: 'Armor Class', arcana: 'Arcana', arcanaMax: 'Arcana pool (max)', arcanaHint: 'Arcana replaces cantrips and spell slots. Players place paper chips on the circles.',
    armor: 'Armor', armorHint: 'place armor card here', attacks: 'Basic attacks', attack: 'Attack', kind: 'Kind',
    weapon: 'Weapon', spell: 'Spell', range: 'Range', damage: 'Damage', cost: 'Arcana cost', mult: 'Extra dice per extra arcana',
    inventory: 'Inventory', abilities: 'Additional abilities', abilitiesHint: 'Not shown on the sheet — exported as separate A5 cards.',
    addAbility: '+ Add ability', type: 'Type', passive: 'Passive', effect: 'Effect', flavor: 'Flavor text',
    trigger: 'Trigger / condition', uses: 'Uses', stat: 'Attack stat', dmgType: 'Damage / effect type', duration: 'Duration',
    save: 'Saving throw', none: 'None', baseDmg: 'Base damage', scaling: 'Arcana scaling', theme: 'Theme',
    themeDefault: 'Classic', themeFall: 'Fall', storageFull: 'Browser storage is full — try a smaller picture.',
    noAbilities: 'No abilities yet.', perArcana: 'per extra',
    hpHint: 'Hit points stay blank on the sheet and are written in pencil (they change during play and on level-up).',
    addAttack: '+ Add attack', maxAttacks: 'Maximum reached — more attacks would not fit on one page.', dtype: 'Damage type',
    dtypeL: { bludgeoning: 'Bludgeoning', piercing: 'Piercing', nature: 'Nature', fire: 'Fire', water: 'Water', light: 'Light', dark: 'Dark', mental: 'Mental' },
    speciesL: { human: 'Human', elf: 'Elf', dwarf: 'Dwarf', halfling: 'Halfling', gnome: 'Gnome', halfElf: 'Half-Elf', halfOrc: 'Half-Orc', tiefling: 'Tiefling', dragonborn: 'Dragonborn' },
    classL: { barbarian: 'Barbarian', bard: 'Bard', cleric: 'Cleric', druid: 'Druid', fighter: 'Fighter', monk: 'Monk', paladin: 'Paladin', ranger: 'Ranger', rogue: 'Rogue', sorcerer: 'Sorcerer', warlock: 'Warlock', wizard: 'Wizard' },
    alignL: { lg: 'Lawful Good', ng: 'Neutral Good', cg: 'Chaotic Good', ln: 'Lawful Neutral', n: 'True Neutral', cn: 'Chaotic Neutral', le: 'Lawful Evil', ne: 'Neutral Evil', ce: 'Chaotic Evil' },
    statL: { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' },
    statA: { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' },
    usesL: { always: 'Always', short: '1× per short rest', long: '1× per long rest' },
    typeL: { passive: 'Passive', attack: 'Attack', spell: 'Spell' },
  },
  de: {
    appTitle: 'Einfache D&D-Bögen', characters: 'Charaktere', newChar: '+ Neuer Charakter', duplicate: 'Duplizieren',
    del: 'Löschen', confirmDel: 'Diesen Charakter löschen? Das kann nicht rückgängig gemacht werden.', exportSheet: 'Bogen exportieren (Word)',
    exportCards: 'Alle Fähigkeitskarten exportieren', exportCard: 'Karte exportieren', unnamed: 'Namenloser Held', preview: 'Bogen-Vorschau',
    basics: 'Grundlagen', name: 'Name', species: 'Spezies', cls: 'Klasse', alignment: 'Gesinnung', other: 'Andere…',
    otherPh: 'Eigene Eingabe', picture: 'Bild', upload: 'Bild hochladen', remove: 'Entfernen',
    stats: 'Attribute', proficiency: 'Übung', profHint: 'Würfe mit diesem Attribut haben Vorteil', advantage: 'Vorteil',
    combat: 'Kampf', hp: 'Trefferpunkte', hpCur: 'Aktuelle TP', hpMax: 'Max. TP', hpNow: 'AKTUELL', hpMaxShort: 'MAX',
    ac: 'Rüstungsklasse', arcana: 'Arkana', arcanaMax: 'Arkana-Vorrat (max)', arcanaHint: 'Arkana ersetzt Zaubertricks und Zauberplätze. Spieler legen Papierchips auf die Kreise.',
    armor: 'Rüstung', armorHint: 'Rüstungskarte hier ablegen', attacks: 'Basisangriffe', attack: 'Angriff', kind: 'Art',
    weapon: 'Waffe', spell: 'Zauber', range: 'Reichweite', damage: 'Schaden', cost: 'Arkana-Kosten', mult: 'Extra-Würfel pro extra Arkana',
    inventory: 'Inventar', abilities: 'Zusätzliche Fähigkeiten', abilitiesHint: 'Nicht auf dem Bogen — werden als eigene A5-Karten exportiert.',
    addAbility: '+ Fähigkeit hinzufügen', type: 'Typ', passive: 'Passiv', effect: 'Effekt', flavor: 'Flavor-Text',
    trigger: 'Auslöser / Bedingung', uses: 'Nutzungen', stat: 'Angriffsattribut', dmgType: 'Schadens- / Effekttyp', duration: 'Dauer',
    save: 'Rettungswurf', none: 'Keiner', baseDmg: 'Grundschaden', scaling: 'Arkana-Steigerung', theme: 'Design',
    themeDefault: 'Klassisch', themeFall: 'Herbst', storageFull: 'Browser-Speicher ist voll — versuche ein kleineres Bild.',
    noAbilities: 'Noch keine Fähigkeiten.', perArcana: 'pro extra',
    hpHint: 'Trefferpunkte bleiben auf dem Bogen leer und werden mit Bleistift eingetragen (sie ändern sich im Spiel und beim Stufenaufstieg).',
    addAttack: '+ Angriff hinzufügen', maxAttacks: 'Maximum erreicht — mehr Angriffe passen nicht auf eine Seite.', dtype: 'Schadensart',
    dtypeL: { bludgeoning: 'Wucht', piercing: 'Stich', nature: 'Natur', fire: 'Feuer', water: 'Wasser', light: 'Licht', dark: 'Dunkelheit', mental: 'Psychisch' },
    speciesL: { human: 'Mensch', elf: 'Elf', dwarf: 'Zwerg', halfling: 'Halbling', gnome: 'Gnom', halfElf: 'Halbelf', halfOrc: 'Halbork', tiefling: 'Tiefling', dragonborn: 'Drachenblütiger' },
    classL: { barbarian: 'Barbar', bard: 'Barde', cleric: 'Kleriker', druid: 'Druide', fighter: 'Kämpfer', monk: 'Mönch', paladin: 'Paladin', ranger: 'Waldläufer', rogue: 'Schurke', sorcerer: 'Zauberer', warlock: 'Hexenmeister', wizard: 'Magier' },
    alignL: { lg: 'Rechtschaffen gut', ng: 'Neutral gut', cg: 'Chaotisch gut', ln: 'Rechtschaffen neutral', n: 'Neutral', cn: 'Chaotisch neutral', le: 'Rechtschaffen böse', ne: 'Neutral böse', ce: 'Chaotisch böse' },
    statL: { str: 'Stärke', dex: 'Geschicklichkeit', con: 'Konstitution', int: 'Intelligenz', wis: 'Weisheit', cha: 'Charisma' },
    statA: { str: 'STÄ', dex: 'GES', con: 'KON', int: 'INT', wis: 'WEI', cha: 'CHA' },
    usesL: { always: 'Immer', short: '1× pro kurzer Rast', long: '1× pro langer Rast' },
    typeL: { passive: 'Passiv', attack: 'Angriff', spell: 'Zauber' },
  },
};

/* Themes: add a new object here (and a matching body[data-theme] block in style.css) to add a theme. */
const THEMES = {
  default: { label: 'themeDefault', bg: '#f5ecd7', soft: '#eadcbc', ink: '#2b1d14', accent: '#7a1f1f', accent2: '#b08a3e', border: '#4a3222',
    font: 'Georgia', css: "Georgia, 'Times New Roman', serif", ornament: 'flourish' },
  fall: { label: 'themeFall', bg: '#fbf0de', soft: '#f4d9b0', ink: '#3b2314', accent: '#b84a12', accent2: '#d39a1c', border: '#6b3410',
    font: 'Palatino Linotype', css: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", ornament: 'leaves' },
};

/* ---------- state & storage ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
};
const state = {
  chars: store.get('dnd-sheets', []),
  currentId: store.get('dnd-current', null),
  lang: store.get('dnd-lang', 'en'),
  theme: store.get('dnd-theme', 'default'),
};
if (!STRINGS[state.lang]) state.lang = 'en';
if (!THEMES[state.theme]) state.theme = 'default';

const uid = () => Math.random().toString(36).slice(2, 10);
const newAttack = () => ({ kind: 'weapon', name: '', range: '', dmg: '', type: 'bludgeoning', cost: 1, mult: '' });
function newChar() {
  return {
    id: uid(), name: '', species: 'human', speciesOther: '', cls: 'fighter', clsOther: '', alignment: 'n', alignmentOther: '',
    img: '', stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, prof: 'str',
    ac: 10, arcana: 3, attacks: [newAttack(), newAttack(), newAttack()], abilities: [],
  };
}
function newAbility() {
  return { id: uid(), type: 'spell', name: '', img: '', effect: '', flavor: '', trigger: '', uses: 'always', usesOther: '',
    stat: 'str', range: '', dmg: '', dmgType: 'bludgeoning', cost: 1, mult: '', duration: '', save: '' };
}
function save() {
  const ok = store.set('dnd-sheets', state.chars) && store.set('dnd-current', state.currentId);
  if (!ok) alert(t('storageFull'));
  return ok;
}
const cur = () => state.chars.find(c => c.id === state.currentId);

/* ---------- helpers ---------- */
const t = k => STRINGS[state.lang][k] ?? STRINGS.en[k] ?? k;
const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const mod = s => Math.floor(((Number(s) || 0) - 10) / 2);
const fmtMod = n => (n >= 0 ? '+' : '') + n;
const pick = (val, other, map) => (val === OTHER ? other : (map[val] ?? val)) || '';
const speciesText = c => pick(c.species, c.speciesOther, t('speciesL'));
const classText = c => pick(c.cls, c.clsOther, t('classL'));
const alignText = c => pick(c.alignment, c.alignmentOther, t('alignL'));
const usesText = a => pick(a.uses, a.usesOther, t('usesL'));
const nameOf = c => c.name || t('unnamed');
/** Name font size in pt so long names stay on one line in the 142 mm header. */
const nameSize = n => Math.max(13, Math.min(22, Math.floor(700 / Math.max(1, n.length))));
const th = () => THEMES[state.theme];

function parseDice(s) {
  const m = String(s || '').trim().replace(/^\+\s*/, '').match(/^(\d*)\s*([dDwW])\s*(\d+)$/);
  return m ? { n: +(m[1] || 1), L: m[2].toLowerCase() === 'w' ? 'W' : 'd', d: +m[3] } : null;
}
/** Damage when `extra` arcana above the base cost is spent. */
function scaleDice(base, mult, extra) {
  if (!extra || !mult) return base || '—';
  const b = parseDice(base), m = parseDice(mult);
  if (b && m && b.d === m.d) return `${b.n + m.n * extra}${b.L}${b.d}`;
  return `${base || '0'} + ${extra}×${String(mult).replace(/^\+\s*/, '')}`;
}
function scaling(cost, base, mult) {
  const c = Math.min(3, Math.max(1, Number(cost) || 1)), out = [];
  for (let lvl = c; lvl <= 3; lvl++) out.push([ARCANA.repeat(lvl), scaleDice(base, mult, lvl - c)]);
  return out;
}
const scalingText = (cost, base, mult) => scaling(cost, base, mult).map(([d, v]) => `${d} ${v}`).join('     ');
function attackArcana(a) {
  if (a.kind !== 'spell') return '—';
  const m = String(a.mult || '').replace(/^\+\s*/, '');
  return `${ARCANA}${a.cost || 1}` + (m ? ` (+${m}/${ARCANA})` : '');
}

function getPath(o, p) { return p.split('.').reduce((x, k) => x?.[k], o); }
function setPath(o, p, v) { const ks = p.split('.'); const last = ks.pop(); ks.reduce((x, k) => x[k], o)[last] = v; }

function readImage(file, max = 500) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        const x = cv.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, cv.width, cv.height);
        x.drawImage(img, 0, 0, cv.width, cv.height);
        res(cv.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = rej; img.src = r.result;
    };
    r.onerror = rej; r.readAsDataURL(file);
  });
}

/* ---------- canvas drawings (shared by preview + Word export). Units: mm ---------- */
function mmCanvas(wmm, hmm, s) {
  const cv = document.createElement('canvas');
  cv.width = Math.round(wmm * s); cv.height = Math.round(hmm * s);
  const x = cv.getContext('2d'); x.scale(s, s);
  return [cv, x];
}
function rr(x, X, Y, W, H, r) {
  x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r);
  x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath();
}
function fitText(x, text, cx, y, maxW, size, weight = 'bold') {
  let s = size;
  do { x.font = `${weight} ${s}px ${th().css}`; s -= 0.1; } while (x.measureText(text).width > maxW && s > 1);
  x.fillText(text, cx, y);
}
function leaf(x, size, color) {
  x.fillStyle = color; x.beginPath();
  // simple maple-ish leaf: 5 points
  const pts = [[0, -1], [0.28, -0.45], [0.75, -0.6], [0.5, -0.1], [0.85, 0.25], [0.3, 0.2], [0.12, 0.65], [0, 0.4],
    [-0.12, 0.65], [-0.3, 0.2], [-0.85, 0.25], [-0.5, -0.1], [-0.75, -0.6], [-0.28, -0.45]];
  pts.forEach(([a, b], i) => (i ? x.lineTo(a * size, b * size) : x.moveTo(a * size, b * size)));
  x.closePath(); x.fill();
  x.strokeStyle = '#0003'; x.lineWidth = size * 0.05; x.beginPath(); x.moveTo(0, -0.7 * size); x.lineTo(0, 0.9 * size); x.stroke();
}
function cornerOrnament(x, T, size) {
  if (T.ornament === 'leaves') {
    [[0, 0, 0.6, T.accent], [size * 0.95, size * 0.15, 1.5, T.accent2], [size * 0.15, size * 0.95, -0.2, T.border]].forEach(([dx, dy, rot, col]) => {
      x.save(); x.translate(dx, dy); x.rotate(rot); leaf(x, size * 0.55, col); x.restore();
    });
  } else {
    x.strokeStyle = T.accent; x.fillStyle = T.accent; x.lineWidth = size * 0.07;
    x.beginPath(); x.moveTo(0, -size * 0.3); x.lineTo(size * 0.3, 0); x.lineTo(0, size * 0.3); x.lineTo(-size * 0.3, 0); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(size * 0.45, 0); x.lineTo(size * 1.6, 0); x.moveTo(0, size * 0.45); x.lineTo(0, size * 1.6); x.stroke();
    x.beginPath(); x.arc(size * 1.75, 0, size * 0.12, 0, 7); x.arc(0, size * 1.75, size * 0.12, 0, 7); x.fill();
    x.beginPath(); x.arc(size * 0.65, size * 0.65, size * 0.35, Math.PI, 1.5 * Math.PI); x.stroke();
  }
}
/** Full-page decorative background (sheet: A4 square-ish corners, card: A5 rounded). */
function drawFrame(wmm, hmm, { radius = 0, inset = 6, orn = 7 } = {}) {
  const T = th();
  const [cv, x] = mmCanvas(wmm, hmm, 4);
  if (radius) { rr(x, 1, 1, wmm - 2, hmm - 2, radius); x.save(); x.clip(); }
  x.fillStyle = T.bg; x.fillRect(0, 0, wmm, hmm);
  // soft vignette
  const g = x.createRadialGradient(wmm / 2, hmm / 2, Math.min(wmm, hmm) * 0.3, wmm / 2, hmm / 2, Math.max(wmm, hmm) * 0.75);
  g.addColorStop(0, '#ffffff00'); g.addColorStop(1, T.soft + 'aa'); x.fillStyle = g; x.fillRect(0, 0, wmm, hmm);
  if (radius) x.restore();
  x.strokeStyle = T.border; x.lineWidth = 1.1;
  rr(x, inset, inset, wmm - inset * 2, hmm - inset * 2, Math.max(1, radius - inset / 2)); x.stroke();
  x.strokeStyle = T.accent; x.lineWidth = 0.35;
  rr(x, inset + 1.8, inset + 1.8, wmm - inset * 2 - 3.6, hmm - inset * 2 - 3.6, Math.max(0.5, radius - inset / 2 - 1.5)); x.stroke();
  if (radius) { x.strokeStyle = T.border; x.lineWidth = 0.4; rr(x, 1, 1, wmm - 2, hmm - 2, radius); x.stroke(); }
  const o = inset + 3.5;
  [[o, o, 0], [wmm - o, o, Math.PI / 2], [wmm - o, hmm - o, Math.PI], [o, hmm - o, -Math.PI / 2]].forEach(([cx, cy, r]) => {
    x.save(); x.translate(cx, cy); x.rotate(r); cornerOrnament(x, T, orn); x.restore();
  });
  return cv.toDataURL('image/png');
}
function heartPath(x, cx, y, w, h) {
  x.beginPath(); x.moveTo(cx, y + h * 0.3);
  x.bezierCurveTo(cx, y, cx - w / 2, y, cx - w / 2, y + h * 0.3);
  x.bezierCurveTo(cx - w / 2, y + h * 0.6, cx, y + h * 0.8, cx, y + h);
  x.bezierCurveTo(cx, y + h * 0.8, cx + w / 2, y + h * 0.6, cx + w / 2, y + h * 0.3);
  x.bezierCurveTo(cx + w / 2, y, cx, y, cx, y + h * 0.3); x.closePath();
}
function shieldPath(x, cx, y, w, h) {
  x.beginPath(); x.moveTo(cx - w / 2, y + h * 0.08); x.quadraticCurveTo(cx, y - h * 0.05, cx + w / 2, y + h * 0.08);
  x.lineTo(cx + w / 2, y + h * 0.45); x.quadraticCurveTo(cx + w / 2, y + h * 0.85, cx, y + h);
  x.quadraticCurveTo(cx - w / 2, y + h * 0.85, cx - w / 2, y + h * 0.45); x.closePath();
}
/** Strip with broken heart (HP), AC shield, empty armor square and arcana circles: 182 × 52 mm. */
function drawVitals(c) {
  const T = th();
  const [cv, x] = mmCanvas(182, 52, 6);
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const label = (txt, cx, w) => { x.fillStyle = T.border; fitText(x, txt.toUpperCase(), cx, 5, w, 3.2); };

  // Broken heart, left blank for pencil: current HP left of the crack, max HP right of it
  const hx = 31, hy = 9, hw = 56, hh = 40, gap = 1.3;
  label(t('hp'), hx, 60);
  const crack = [[hx + 0.5, hy - 2], [hx - 1.8, hy + hh * 0.36], [hx + 2, hy + hh * 0.5], [hx - 1.5, hy + hh * 0.66], [hx + 1.4, hy + hh * 0.82], [hx, hy + hh + 2]];
  [[-1, t('hpNow')], [1, t('hpMaxShort')]].forEach(([side, sub]) => {
    x.save(); x.translate(side * gap, 0);
    x.beginPath(); x.moveTo(hx + side * hw, hy - 3); crack.forEach(([a, b]) => x.lineTo(a, b)); x.lineTo(hx + side * hw, hy + hh + 3); x.closePath(); x.clip();
    heartPath(x, hx, hy, hw, hh);
    x.fillStyle = '#ffffff'; x.fill(); x.strokeStyle = T.accent; x.lineWidth = 1.6; x.stroke();
    // outline along the crack edge too
    heartPath(x, hx, hy, hw, hh); x.clip();
    x.beginPath(); crack.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.lineWidth = 1.2; x.stroke();
    x.restore();
    x.fillStyle = T.accent; fitText(x, sub, hx + side * (hw / 4 + 0.5), hy + hh * 0.27, hw / 2 - 14, 2.4);
  });

  // AC shield
  const sx = 80; label(t('ac'), sx, 30);
  shieldPath(x, sx, 10, 26, 36); x.fillStyle = T.soft; x.fill(); x.strokeStyle = T.border; x.lineWidth = 0.8; x.stroke();
  shieldPath(x, sx, 12, 21, 31); x.strokeStyle = T.accent2; x.lineWidth = 0.35; x.stroke();
  x.fillStyle = T.ink; fitText(x, String(c.ac ?? ''), sx, 32, 18, 12);

  // Empty armor square (players put a printed armor card on top)
  label(t('armor'), 122, 42);
  x.fillStyle = '#ffffff66'; x.fillRect(102, 9, 40, 40);
  x.strokeStyle = T.border; x.lineWidth = 0.6; x.strokeRect(102, 9, 40, 40);
  x.setLineDash([1.2, 1]); x.strokeStyle = T.accent2; x.lineWidth = 0.3; x.strokeRect(104, 11, 36, 36); x.setLineDash([]);
  x.fillStyle = T.soft; fitText(x, t('armorHint'), 122, 30, 32, 2.4, 'italic');

  // Arcana circles
  label(t('arcana'), 164, 36);
  const n = Math.max(0, Math.min(12, Number(c.arcana) || 0)), d = 7.6, gp = 1.9, x0 = 146;
  for (let i = 0; i < n; i++) {
    const cx = x0 + d / 2 + (i % 4) * (d + gp), cy = 9 + d / 2 + Math.floor(i / 4) * (d + gp);
    x.beginPath(); x.arc(cx, cy, d / 2, 0, 7); x.fillStyle = '#ffffff88'; x.fill();
    x.strokeStyle = T.accent; x.lineWidth = 0.45; x.stroke();
    x.beginPath(); x.arc(cx, cy, d / 2 - 1, 0, 7); x.strokeStyle = T.accent2; x.lineWidth = 0.2; x.stroke();
  }
  if (!n) { x.fillStyle = T.soft; fitText(x, '—', 164, 28, 30, 8); }
  return cv.toDataURL('image/png');
}

/** Round damage-type badge (white glyph on the type's color). Cached PNG data URL. */
const _icons = {};
function drawIcon(type) {
  if (_icons[type]) return _icons[type];
  const T = DTYPES[type] || DTYPES.bludgeoning, S = 48;
  const cv = document.createElement('canvas'); cv.width = cv.height = S * 2;
  const x = cv.getContext('2d'); x.translate(S, S); x.scale(S, S);
  x.beginPath(); x.arc(0, 0, 0.97, 0, 7); x.fillStyle = T.color; x.fill();
  x.fillStyle = '#fff'; x.strokeStyle = '#fff'; x.lineCap = 'round'; x.lineJoin = 'round';
  const fill = draw => { x.beginPath(); draw(); x.fill(); };
  if (type === 'bludgeoning') { x.rotate(-Math.PI / 4); x.fillRect(-0.08, -0.25, 0.16, 0.85); x.fillRect(-0.45, -0.6, 0.9, 0.38); }
  if (type === 'piercing') {
    x.rotate(Math.PI / 4); x.lineWidth = 0.12; x.beginPath(); x.moveTo(0, 0.6); x.lineTo(0, -0.35); x.stroke();
    fill(() => { x.moveTo(0, -0.68); x.lineTo(0.26, -0.28); x.lineTo(-0.26, -0.28); x.closePath(); });
    x.lineWidth = 0.09; x.beginPath(); x.moveTo(0, 0.42); x.lineTo(0.2, 0.62); x.moveTo(0, 0.42); x.lineTo(-0.2, 0.62); x.stroke();
  }
  if (type === 'nature') {
    x.rotate(0.6);
    fill(() => { x.moveTo(0, -0.66); x.quadraticCurveTo(0.6, -0.05, 0, 0.5); x.quadraticCurveTo(-0.6, -0.05, 0, -0.66); });
    x.strokeStyle = T.color; x.lineWidth = 0.07; x.beginPath(); x.moveTo(0, -0.45); x.lineTo(0, 0.45); x.stroke();
    x.strokeStyle = '#fff'; x.lineWidth = 0.09; x.beginPath(); x.moveTo(0, 0.45); x.lineTo(0, 0.7); x.stroke();
  }
  if (type === 'fire') fill(() => {
    x.moveTo(0, -0.7); x.bezierCurveTo(0.2, -0.35, 0.5, -0.15, 0.48, 0.2); x.bezierCurveTo(0.46, 0.55, 0.2, 0.65, 0, 0.65);
    x.bezierCurveTo(-0.3, 0.65, -0.5, 0.45, -0.48, 0.15); x.bezierCurveTo(-0.46, -0.1, -0.25, -0.15, -0.2, -0.38);
    x.bezierCurveTo(-0.05, -0.25, 0.05, -0.45, 0, -0.7);
  });
  if (type === 'water') fill(() => {
    x.moveTo(0, -0.65); x.bezierCurveTo(0.15, -0.35, 0.42, -0.05, 0.42, 0.2); x.arc(0, 0.2, 0.42, 0, Math.PI);
    x.bezierCurveTo(-0.42, -0.05, -0.15, -0.35, 0, -0.65);
  });
  if (type === 'light') {
    fill(() => x.arc(0, 0, 0.28, 0, 7)); x.lineWidth = 0.1;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; x.beginPath(); x.moveTo(Math.cos(a) * 0.42, Math.sin(a) * 0.42); x.lineTo(Math.cos(a) * 0.66, Math.sin(a) * 0.66); x.stroke(); }
  }
  if (type === 'dark') { fill(() => x.arc(-0.05, 0, 0.52, 0, 7)); x.fillStyle = T.color; fill(() => x.arc(0.2, -0.16, 0.46, 0, 7)); }
  if (type === 'mental') {
    x.lineWidth = 0.1; x.beginPath();
    for (let a = 0; a <= 4.2 * Math.PI; a += 0.1) { const r = 0.04 + a * 0.042; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    x.stroke();
  }
  return (_icons[type] = cv.toDataURL('image/png'));
}
/** Sheet layout for n attacks: row heights in mm and how many inventory lines still fit on one page. */
function sheetLayout(n) {
  const head = 7, rowH = 9, gap = 1.5, budget = 130; // attacks + inventory share 130 mm
  const att = n ? head + n * (rowH + gap) + 3 : 0;
  return { head, rowH, gap, invLines: Math.max(3, Math.floor((budget - att - 8) / 8)) };
}

/* ---------- UI rendering ---------- */
const $ = s => document.querySelector(s);
const form = $('#form');

function opts(keys, map, val, withOther = true) {
  return keys.map(k => `<option value="${k}"${k === val ? ' selected' : ''}>${esc(map[k] ?? k)}</option>`).join('') +
    (withOther ? `<option value="${OTHER}"${val === OTHER ? ' selected' : ''}>${esc(t('other'))}</option>` : '');
}
function input(label, path, val, { type = 'text', max = 40, cls = '', min, maxN } = {}) {
  const extra = type === 'number' ? ` min="${min ?? 0}" max="${maxN ?? 999}"` : ` maxlength="${max}"`;
  return `<label class="f ${cls}"><span>${esc(label)}</span><input type="${type}" data-p="${path}" value="${esc(val)}"${extra}></label>`;
}
function textarea(label, path, val, max) {
  return `<label class="f wide"><span>${esc(label)}</span><textarea data-p="${path}" maxlength="${max}" rows="3">${esc(val)}</textarea></label>`;
}
function select(label, path, inner, cls = '') {
  return `<label class="f ${cls}"><span>${esc(label)}</span><select data-p="${path}">${inner}</select></label>`;
}
function selectOther(label, path, keys, map, obj, otherKey, max = 24) {
  return select(label, path, opts(keys, map, obj[path.split('.').pop()])) +
    (obj[path.split('.').pop()] === OTHER ? input(t('other').replace('…', ''), path.replace(/[^.]+$/, otherKey), obj[otherKey], { max }) : '');
}
const statOpts = (val, withNone) => (withNone ? `<option value=""${!val ? ' selected' : ''}>${esc(t('none'))}</option>` : '') +
  STATS.map(s => `<option value="${s}"${s === val ? ' selected' : ''}>${esc(t('statL')[s])}</option>`).join('');
const costOpts = v => [1, 2, 3].map(n => `<option value="${n}"${Number(v) === n ? ' selected' : ''}>${ARCANA.repeat(n)} ${n}</option>`).join('');
function picField(path, img) {
  return `<div class="f wide"><span>${esc(t('picture'))}</span><div class="pic-row">
    <div class="pic" style="background-image:${img ? `url(${img})` : 'none'}"></div>
    <label class="btn small">${esc(t('upload'))}<input type="file" accept="image/*" data-img="${path}" hidden></label>
    ${img ? `<button type="button" class="btn small" data-act="rmimg" data-path="${path}">${esc(t('remove'))}</button>` : ''}
  </div></div>`;
}

const dtypeSelect = (path, val) => select(t('dtype'), path,
  Object.keys(DTYPES).map(k => `<option value="${k}"${val === k ? ' selected' : ''}>${DTYPES[k].emoji} ${esc(t('dtypeL')[k])}</option>`).join(''));

function renderForm() {
  const c = cur();
  if (!c) { form.innerHTML = ''; return; }
  const attacks = c.attacks.map((a, i) => `<div class="attack">
      <div class="ability-head"><img class="dicon" alt="" src="${drawIcon(a.type)}">
        <span class="grow">${esc(a.name || `${t('attack')} ${i + 1}`)}</span>
        <button type="button" class="btn small danger" data-act="rmatk" data-i="${i}">✕</button></div>
      <div class="grid">
      ${select(t('kind'), `attacks.${i}.kind`, ['weapon', 'spell'].map(k => `<option value="${k}"${a.kind === k ? ' selected' : ''}>${esc(t(k))}</option>`).join(''))}
      ${input(t('name'), `attacks.${i}.name`, a.name, { max: 28 })}
      ${input(t('range'), `attacks.${i}.range`, a.range, { max: 14 })}
      ${input(t('damage'), `attacks.${i}.dmg`, a.dmg, { max: 14 })}
      ${dtypeSelect(`attacks.${i}.type`, a.type)}
      ${a.kind === 'spell' ? select(t('cost'), `attacks.${i}.cost`, costOpts(a.cost)) + input(t('mult'), `attacks.${i}.mult`, a.mult, { max: 8 }) : ''}
    </div></div>`).join('');

  const abilities = c.abilities.map((a, i) => {
    const P = `abilities.${i}`;
    const usesSel = select(t('uses'), `${P}.uses`, opts(USES, t('usesL'), a.uses)) + (a.uses === OTHER ? input(t('other').replace('…', ''), `${P}.usesOther`, a.usesOther, { max: 30 }) : '');
    let specific = '';
    if (a.type === 'passive') specific = input(t('trigger'), `${P}.trigger`, a.trigger, { max: 80, cls: 'wide' }) + usesSel;
    if (a.type === 'attack') specific = select(t('stat'), `${P}.stat`, statOpts(a.stat)) + input(t('range'), `${P}.range`, a.range, { max: 20 }) +
      input(t('damage'), `${P}.dmg`, a.dmg, { max: 16 }) + dtypeSelect(`${P}.dmgType`, a.dmgType) + usesSel;
    if (a.type === 'spell') specific = select(t('cost'), `${P}.cost`, costOpts(a.cost)) + input(t('baseDmg'), `${P}.dmg`, a.dmg, { max: 16 }) +
      input(t('mult'), `${P}.mult`, a.mult, { max: 8 }) + dtypeSelect(`${P}.dmgType`, a.dmgType) +
      input(t('range'), `${P}.range`, a.range, { max: 20 }) + input(t('duration'), `${P}.duration`, a.duration, { max: 24 }) +
      select(t('save'), `${P}.save`, statOpts(a.save, true)) +
      `<div class="f wide"><span>${esc(t('scaling'))}</span><div class="strip" data-strip="${i}">${esc(scalingText(a.cost, a.dmg, a.mult))}</div></div>`;
    return `<div class="ability">
      <div class="ability-head">
        ${a.type !== 'passive' ? `<img class="dicon" alt="" src="${drawIcon(a.dmgType)}">` : ''}<span class="grow">${esc(a.name || t('typeL')[a.type])}</span>
        <button type="button" class="btn small" data-act="up" data-i="${i}" title="▲">▲</button>
        <button type="button" class="btn small" data-act="down" data-i="${i}" title="▼">▼</button>
        <button type="button" class="btn small primary" data-act="card" data-i="${i}">${esc(t('exportCard'))}</button>
        <button type="button" class="btn small danger" data-act="rmab" data-i="${i}">✕</button>
      </div>
      <div class="grid">
        ${select(t('type'), `${P}.type`, ['passive', 'attack', 'spell'].map(k => `<option value="${k}"${a.type === k ? ' selected' : ''}>${esc(t('typeL')[k])}</option>`).join(''))}
        ${input(t('name'), `${P}.name`, a.name, { max: 32 })}
        ${specific}
        ${textarea(t('effect'), `${P}.effect`, a.effect, 600)}
        ${textarea(t('flavor'), `${P}.flavor`, a.flavor, 220)}
        ${picField(`${P}.img`, a.img)}
      </div>
    </div>`;
  }).join('') || `<p class="hint">${esc(t('noAbilities'))}</p>`;

  form.innerHTML = `
  <fieldset><legend>${esc(t('basics'))}</legend><div class="grid">
    ${input(t('name'), 'name', c.name, { max: 40, cls: 'wide' })}
    ${selectOther(t('species'), 'species', SPECIES, t('speciesL'), c, 'speciesOther')}
    ${selectOther(t('cls'), 'cls', CLASSES, t('classL'), c, 'clsOther')}
    ${selectOther(t('alignment'), 'alignment', ALIGN, t('alignL'), c, 'alignmentOther')}
    ${picField('img', c.img)}
  </div></fieldset>
  <fieldset><legend>${esc(t('stats'))}</legend><div class="grid stats">
    ${STATS.map(s => `<label class="f"><span>${esc(t('statL')[s])} <b class="mod" data-mod="${s}">${fmtMod(mod(c.stats[s]))}</b></span>
      <input type="number" min="1" max="30" data-p="stats.${s}" value="${esc(c.stats[s])}"></label>`).join('')}
  </div>
  <div class="grid" style="margin-top:8px">${select(t('proficiency'), 'prof', statOpts(c.prof), 'wide')}</div>
  <p class="hint" style="margin-top:6px">★ ${esc(t('profHint'))}</p></fieldset>
  <fieldset><legend>${esc(t('combat'))}</legend><div class="grid">
    ${input(t('ac'), 'ac', c.ac, { type: 'number', maxN: 99 })}
    ${input(t('arcanaMax'), 'arcana', c.arcana, { type: 'number', maxN: 12 })}
  </div><p class="hint" style="margin-top:6px">${esc(t('hpHint'))}<br>${esc(t('arcanaHint'))}</p></fieldset>
  <fieldset><legend>${esc(t('attacks'))}</legend>${attacks}
    ${c.attacks.length < MAX_ATTACKS ? `<button type="button" class="btn" data-act="addatk">${esc(t('addAttack'))}</button>` : `<p class="hint">${esc(t('maxAttacks'))}</p>`}</fieldset>
  <fieldset><legend>${esc(t('abilities'))}</legend><p class="hint">${esc(t('abilitiesHint'))}</p>${abilities}
    <button type="button" class="btn" data-act="addab">${esc(t('addAbility'))}</button></fieldset>`;
}

function renderPreview() {
  const c = cur(), el = $('#sheet');
  if (!c) { el.innerHTML = ''; return; }
  el.style.backgroundImage = `url(${frameCache()})`;
  const L = sheetLayout(c.attacks.length);
  const rows = c.attacks.map(a => `<tr class="gap"><td colspan="5"></td></tr><tr class="atk">
    <td class="ic"><img alt="" src="${drawIcon(a.type)}"></td><td><b>${esc(a.name)}</b></td><td>${esc(a.range)}</td>
    <td>${esc(a.dmg)} <i>${esc(t('dtypeL')[a.type] || '')}</i></td><td>${esc(attackArcana(a))}</td></tr>`).join('');
  el.innerHTML = `
    <div class="sh-head">
      <div class="sh-portrait" style="background-image:${c.img ? `url(${c.img})` : 'none'}"></div>
      <div>
        <div class="sh-name" style="font-size:calc(var(--mm) * ${(nameSize(nameOf(c)) * 0.3528).toFixed(2)})">${esc(nameOf(c))}</div>
        <div class="sh-sub">${esc([speciesText(c), classText(c)].filter(Boolean).join(' · '))}</div>
        <div class="sh-align">${esc(alignText(c))}</div>
        <div class="sh-prof">★ ${esc(t('proficiency'))}: ${esc(t('statL')[c.prof])} — ${esc(t('profHint'))}</div>
      </div>
    </div>
    <div class="sh-stats">${STATS.map(s => `<div class="sh-stat${c.prof === s ? ' prof' : ''}"><b>${t('statA')[s]}</b>
      <span class="sc">${esc(c.stats[s])}</span><span class="md">${fmtMod(mod(c.stats[s]))}</span>
      ${c.prof === s ? `<span class="adv">★ ${esc(t('advantage'))}</span>` : ''}</div>`).join('')}</div>
    <img class="sh-vitals" alt="" src="${drawVitals(c)}">
    ${c.attacks.length ? `<table class="sh-att"><colgroup><col style="width:6%"><col style="width:30%"><col style="width:16%"><col style="width:24%"><col style="width:24%"></colgroup>
      <tr><th colspan="2">${esc(t('attacks'))}</th><th>${esc(t('range'))}</th><th>${esc(t('damage'))}</th><th>${esc(t('arcana'))}</th></tr>${rows}</table>` : ''}
    <div class="sh-inv"><h3>${esc(t('inventory'))}</h3>${'<div></div>'.repeat(L.invLines)}</div>`;
}
let _frame = {};
function frameCache() { return _frame[state.theme] ??= drawFrame(210, 297, { radius: 0, inset: 5, orn: 6 }); }

function renderList() {
  $('#charList').innerHTML = state.chars.map(c => `<li data-id="${c.id}" class="${c.id === state.currentId ? 'on' : ''}">
    <span class="thumb" style="background-image:${c.img ? `url(${c.img})` : 'none'}"></span>
    <span><b>${esc(nameOf(c))}</b><small>${esc([speciesText(c), classText(c)].filter(Boolean).join(' · '))}</small></span></li>`).join('');
  $('#actions').innerHTML = cur() ? `
    <button type="button" class="btn primary" data-act="sheet">${esc(t('exportSheet'))}</button>
    <button type="button" class="btn" data-act="cards"${cur().abilities.length ? '' : ' disabled'}>${esc(t('exportCards'))}</button>
    <button type="button" class="btn" data-act="dup">${esc(t('duplicate'))}</button>
    <button type="button" class="btn danger" data-act="del">${esc(t('del'))}</button>` : '';
}
function renderChrome() {
  document.documentElement.lang = state.lang;
  document.body.dataset.theme = state.theme;
  document.title = t('appTitle');
  $('#appTitle').textContent = t('appTitle');
  $('#charsTitle').textContent = t('characters');
  $('#newChar').textContent = t('newChar');
  $('#previewTitle').textContent = t('preview');
  $('#themeLabel').textContent = t('theme');
  $('#themeSelect').innerHTML = Object.entries(THEMES).map(([k, v]) => `<option value="${k}"${k === state.theme ? ' selected' : ''}>${esc(t(v.label))}</option>`).join('');
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === state.lang));
}
function renderAll() { renderChrome(); renderList(); renderForm(); renderPreview(); }

/* ---------- events ---------- */
form.addEventListener('input', e => {
  const el = e.target, p = el.dataset.p, c = cur();
  if (!p || !c || el.tagName === 'SELECT') return;
  setPath(c, p, el.type === 'number' ? (el.value === '' ? '' : Number(el.value)) : el.value);
  save();
  const m = p.match(/^stats\.(\w+)$/);
  if (m) form.querySelector(`[data-mod="${m[1]}"]`).textContent = fmtMod(mod(c.stats[m[1]]));
  const at = p.match(/^attacks\.(\d+)\.name$/);
  if (at) el.closest('.attack').querySelector('.grow').textContent = el.value || `${t('attack')} ${Number(at[1]) + 1}`;
  const ab = p.match(/^abilities\.(\d+)\./);
  if (ab) {
    const a = c.abilities[ab[1]], strip = form.querySelector(`[data-strip="${ab[1]}"]`);
    if (strip) strip.textContent = scalingText(a.cost, a.dmg, a.mult);
    el.closest('.ability').querySelector('.grow').textContent = a.name || t('typeL')[a.type];
  }
  if (p === 'name' || p.endsWith('Other')) renderList();
  renderPreview();
});
form.addEventListener('change', async e => {
  const el = e.target, c = cur();
  if (!c) return;
  if (el.dataset.img && el.files[0]) {
    try { setPath(c, el.dataset.img, await readImage(el.files[0])); } catch { return; }
    if (!save()) setPath(c, el.dataset.img, '');
    renderAll(); return;
  }
  if (el.tagName === 'SELECT' && el.dataset.p) {
    setPath(c, el.dataset.p, /\.cost$/.test(el.dataset.p) ? Number(el.value) : el.value);
    save(); renderList(); renderForm(); renderPreview();
  }
});
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); const c = cur();
  if (b && c) {
    const i = Number(b.dataset.i), act = b.dataset.act;
    if (act === 'addatk' && c.attacks.length < MAX_ATTACKS) { c.attacks.push(newAttack()); save(); renderForm(); renderPreview(); }
    if (act === 'rmatk' && confirm(t('remove') + '?')) { c.attacks.splice(i, 1); save(); renderForm(); renderPreview(); }
    if (act === 'addab') { c.abilities.push(newAbility()); save(); renderAll(); }
    if (act === 'rmab' && confirm(t('remove') + '?')) { c.abilities.splice(i, 1); save(); renderAll(); }
    if (act === 'up' && i > 0) { [c.abilities[i - 1], c.abilities[i]] = [c.abilities[i], c.abilities[i - 1]]; save(); renderForm(); }
    if (act === 'down' && i < c.abilities.length - 1) { [c.abilities[i + 1], c.abilities[i]] = [c.abilities[i], c.abilities[i + 1]]; save(); renderForm(); }
    if (act === 'rmimg') { setPath(c, b.dataset.path, ''); save(); renderAll(); }
    if (act === 'dup') { const d = JSON.parse(JSON.stringify(c)); d.id = uid(); d.name = (c.name || t('unnamed')) + ' (2)'; d.abilities.forEach(a => (a.id = uid())); state.chars.push(d); state.currentId = d.id; save(); renderAll(); }
    if (act === 'del' && confirm(t('confirmDel'))) { state.chars = state.chars.filter(x => x.id !== c.id); state.currentId = state.chars[0]?.id ?? null; if (!state.chars.length) addChar(); save(); renderAll(); }
    if (act === 'sheet') await runExport(b, () => exportSheet(c));
    if (act === 'cards') await runExport(b, () => exportCards(c, c.abilities));
    if (act === 'card') await runExport(b, () => exportCards(c, [c.abilities[i]]));
    return;
  }
  const li = e.target.closest('#charList li');
  if (li) { state.currentId = li.dataset.id; save(); renderAll(); }
  const lb = e.target.closest('[data-lang]');
  if (lb) { state.lang = lb.dataset.lang; store.set('dnd-lang', state.lang); renderAll(); }
});
$('#newChar').addEventListener('click', () => { addChar(); save(); renderAll(); });
$('#themeSelect').addEventListener('change', e => { state.theme = e.target.value; store.set('dnd-theme', state.theme); renderAll(); });
function addChar() { const c = newChar(); state.chars.push(c); state.currentId = c.id; }
async function runExport(btn, fn) {
  btn.disabled = true;
  try { await fn(); } catch (err) { console.error(err); alert('Export failed: ' + err.message); } finally { btn.disabled = false; }
}

/* ---------- Word export ---------- */
const MM = 56.6929; // twips per mm
const tw = mm => Math.round(mm * MM);
const px = mm => mm * 96 / 25.4; // docx image sizes are in px @96dpi
const hex = c => c.replace('#', '').toUpperCase();
function bytes(dataUrl) { const s = atob(dataUrl.split(',')[1]); const a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
async function pngInfo(src) {
  const i = await loadImg(src); const cv = document.createElement('canvas');
  cv.width = i.naturalWidth; cv.height = i.naturalHeight; cv.getContext('2d').drawImage(i, 0, 0);
  return { data: bytes(cv.toDataURL('image/png')), w: i.naturalWidth, h: i.naturalHeight };
}
const safeName = s => (s || 'character').replace(/[^\p{L}\p{N} _-]+/gu, '').trim().replace(/\s+/g, '_') || 'character';
async function download(doc, name) {
  const blob = await docx.Packer.toBlob(doc);
  window.__lastExport = { blob, name }; // handy for testing
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '.docx';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/** Small builder kit bound to the current theme. */
function kit() {
  const D = docx, T = th(), F = T.font;
  const NB = { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const line = (color, size = 6, style = D.BorderStyle.SINGLE) => ({ style, size, color: hex(color) });
  const noBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };
  const cellB = (o = {}) => ({ top: NB, bottom: NB, left: NB, right: NB, ...o });
  const run = (text, o = {}) => new D.TextRun({ text: String(text ?? ''), font: F, color: hex(T.ink), size: 20, ...o });
  const para = (children, o = {}) => new D.Paragraph({ children: [].concat(children), spacing: { before: 0, after: 0 }, ...o });
  const spacer = mm => para(run('', { size: 2 }), { spacing: { before: 0, after: 0, line: tw(mm), lineRule: 'exact' } });
  const cell = (children, wmm, o = {}) => new D.TableCell({
    children: [].concat(children), width: { size: tw(wmm), type: D.WidthType.DXA }, borders: cellB(o.borders),
    verticalAlign: o.v ?? D.VerticalAlign.CENTER, margins: o.margins ?? { top: 0, bottom: 0, left: tw(1.5), right: tw(1.5) },
    shading: o.fill ? { type: D.ShadingType.CLEAR, color: 'auto', fill: hex(o.fill) } : undefined,
  });
  const row = (cells, hmm) => new D.TableRow({ children: cells, height: { value: tw(hmm), rule: D.HeightRule.EXACT }, cantSplit: true });
  const table = (rows, colsMm, o = {}) => new D.Table({
    rows, columnWidths: colsMm.map(tw), width: { size: tw(colsMm.reduce((a, b) => a + b, 0)), type: D.WidthType.DXA },
    layout: D.TableLayoutType.FIXED, borders: o.borders ?? noBorders,
  });
  const image = (info, maxW, maxH) => {
    const r = Math.min(maxW / info.w, maxH / info.h);
    return new D.ImageRun({ data: info.data, transformation: { width: px(info.w * r), height: px(info.h * r) } });
  };
  const background = (dataUrl, wmm, hmm) => para(new D.ImageRun({
    data: bytes(dataUrl), transformation: { width: px(wmm), height: px(hmm) },
    floating: {
      horizontalPosition: { relative: D.HorizontalPositionRelativeFrom.PAGE, offset: 0 },
      verticalPosition: { relative: D.VerticalPositionRelativeFrom.PAGE, offset: 0 },
      behindDocument: true, allowOverlap: true, lockAnchor: true, zIndex: 0,
    },
  }), { spacing: { before: 0, after: 0, line: tw(1), lineRule: 'exact' } });
  const center = D.AlignmentType.CENTER;
  return { D, T, F, NB, line, run, para, spacer, cell, row, table, image, background, center, noBorders };
}
function docStyles(F) {
  return { default: { document: { run: { font: F, size: 20 }, paragraph: { spacing: { before: 0, after: 0 } } } } };
}

async function exportSheet(c) {
  const K = kit(), { D, T, run, para, spacer, cell, row, table, image, line, center } = K;
  const portrait = c.img ? await pngInfo(c.img) : null;
  const vitals = await pngInfo(drawVitals(c));

  const header = table([row([
    cell(portrait ? para(image(portrait, 36, 36), { alignment: center }) : para(run('')), 40,
      { borders: { top: line(T.border, 12), bottom: line(T.border, 12), left: line(T.border, 12), right: line(T.border, 12) }, fill: portrait ? undefined : T.soft, margins: { top: 0, bottom: 0, left: 0, right: 0 } }),
    cell([
      para(run(nameOf(c), { size: nameSize(nameOf(c)) * 2, bold: true, color: hex(T.accent) }), { border: { bottom: { ...line(T.accent2, 8), space: 2 } } }),
      para(run([speciesText(c), classText(c)].filter(Boolean).join(' · '), { size: 26 }), { spacing: { before: 120 } }),
      para(run(alignText(c), { size: 22, italics: true })),
      para(run(`★ ${t('proficiency')}: ${t('statL')[c.prof]} — ${t('profHint')}`, { size: 17, color: hex(T.accent) }), { spacing: { before: 120 } }),
    ], 142, { margins: { top: 0, bottom: 0, left: tw(4), right: tw(1) } }),
  ], 40)], [40, 142]);

  const sw = 182 / 6;
  const stats = table([row(STATS.map(s => {
    const p = c.prof === s;
    return cell([
      para(run(t('statA')[s], { size: 18, bold: true, color: hex(T.accent) }), { alignment: center }),
      para(run(c.stats[s], { size: 40, bold: true }), { alignment: center }),
      para(run(fmtMod(mod(c.stats[s])), { size: 22 }), { alignment: center }),
      ...(p ? [para(run(`★ ${t('advantage')}`, { size: 14, bold: true }), { alignment: center })] : []),
    ], sw, { fill: p ? T.accent2 : T.soft, borders: { top: line(T.border, 6), bottom: line(T.border, 6), left: line(T.border, 6), right: line(T.border, 6) } });
  }), 24)], Array(6).fill(sw));

  // Attacks: each one in its own framed row with a damage-type icon, separated by small gaps
  const L = sheetLayout(c.attacks.length);
  const cols = [11, 55, 29, 44, 43];
  const icons = {};
  for (const a of c.attacks) icons[a.type] ??= await pngInfo(drawIcon(a.type));
  const hc = (txt, w) => cell(para(run(txt, { size: 18, bold: true, color: 'FFFFFF' })), w, { fill: T.accent });
  const ab = line(T.border, 8);
  const edge = (first, last) => ({ top: ab, bottom: ab, ...(first ? { left: ab } : {}), ...(last ? { right: ab } : {}) });
  const attacks = c.attacks.length ? table([
    new D.TableRow({ children: [new D.TableCell({ children: [para(run(t('attacks'), { size: 18, bold: true, color: 'FFFFFF' }))], columnSpan: 2,
      width: { size: tw(cols[0] + cols[1]), type: D.WidthType.DXA }, shading: { type: D.ShadingType.CLEAR, color: 'auto', fill: hex(T.accent) },
      verticalAlign: D.VerticalAlign.CENTER, margins: { left: tw(1.5), right: tw(1.5) }, borders: { top: K.NB, bottom: K.NB, left: K.NB, right: K.NB } }),
      hc(t('range'), cols[2]), hc(t('damage'), cols[3]), hc(t('arcana'), cols[4])], height: { value: tw(L.head), rule: D.HeightRule.EXACT } }),
    ...c.attacks.flatMap(a => [
      row(cols.map(w => cell(para(run('', { size: 2 })), w)), L.gap),
      row([
        cell(para(image(icons[a.type], 6.5, 6.5), { alignment: center }), cols[0], { borders: edge(true, false), fill: T.soft, margins: { left: 0, right: 0, top: 0, bottom: 0 } }),
        cell(para(run(a.name, { size: a.name.length > 22 ? 16 : 20, bold: true })), cols[1], { borders: edge() }),
        cell(para(run(a.range)), cols[2], { borders: edge() }),
        cell(para([run(a.dmg, { bold: true }), run('  ' + (t('dtypeL')[a.type] || ''), { size: 16, italics: true, color: DTYPES[a.type]?.color.slice(1) })]), cols[3], { borders: edge() }),
        cell(para(run(attackArcana(a), { color: hex(T.accent) })), cols[4], { borders: edge(false, true) }),
      ], L.rowH),
    ]),
  ], cols) : null;

  const box = line(T.border, 6);
  const inventory = table([
    row([cell(para(run(t('inventory'), { size: 22, bold: true, color: hex(T.accent) })), 182, { fill: T.soft, borders: { top: box, left: box, right: box } })], 8),
    ...Array.from({ length: L.invLines }, (_, i) => row([cell(para(run('')), 182, {
      borders: { left: box, right: box, bottom: i === L.invLines - 1 ? box : line(T.border, 4, D.BorderStyle.DOTTED) },
    })], 8)),
  ], [182]);

  const doc = new D.Document({
    creator: 'Simple D&D Sheets', title: nameOf(c), styles: docStyles(K.F),
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: tw(14), bottom: tw(10), left: tw(14), right: tw(14), header: 0, footer: 0 } } },
      children: [
        K.background(drawFrame(210, 297, { radius: 0, inset: 5, orn: 6 }), 210, 297),
        header, spacer(3), stats, spacer(3),
        para(image(vitals, 182, 52)), spacer(2),
        ...(attacks ? [attacks, spacer(3)] : []), inventory,
        para(run('', { size: 2 }), { spacing: { before: 0, after: 0, line: tw(1), lineRule: 'exact' } }),
      ],
    }],
  });
  await download(doc, safeName(nameOf(c)));
}

async function cardSection(c, a, frame) {
  const K = kit(), { D, T, run, para, spacer, cell, row, table, image, line, center } = K;
  const pic = a.img ? await pngInfo(a.img) : null;
  const typeName = t('typeL')[a.type];
  const dIcon = a.type !== 'passive' ? await pngInfo(drawIcon(a.dmgType)) : null;
  const corner = a.type === 'spell' ? run(ARCANA.repeat(Math.min(3, Math.max(1, Number(a.cost) || 1))), { size: 30, color: hex(T.accent) })
    : run(usesText(a), { size: 16, italics: true });

  const top = table([row([
    cell(para(run(typeName.toUpperCase(), { size: 20, bold: true, color: 'FFFFFF' }), { alignment: center }), 32, { fill: T.accent }),
    cell(para([...(dIcon ? [image(dIcon, 8, 8), run('  ', { size: 36 })] : []), run(a.name || typeName, { size: 36, bold: true, color: hex(T.accent) })]), 124, { margins: { top: 0, bottom: 0, left: tw(4), right: tw(1) } }),
    cell(para(corner, { alignment: D.AlignmentType.RIGHT }), 30),
  ], 14)], [32, 124, 30], { borders: { ...K.noBorders, bottom: line(T.accent2, 12) } });

  const stat = (label, value) => value ? [para([run(label + ': ', { bold: true, size: 19, color: hex(T.accent) }), run(value, { size: 19 })])] : [];
  const dCol = (DTYPES[a.dmgType] || DTYPES.bludgeoning).color.slice(1).toUpperCase();
  const damage = () => (a.dmg ? [para([run(t('damage') + ': ', { bold: true, size: 19, color: hex(T.accent) }),
    image(dIcon, 4.2, 4.2), run(' ' + a.dmg + ' ', { size: 19, bold: true }),
    run(t('dtypeL')[a.dmgType] || '', { size: 19, italics: true, color: dCol })])] : []);
  let details = [];
  if (a.type === 'passive') details = [...stat(t('trigger'), a.trigger), ...stat(t('uses'), usesText(a))];
  if (a.type === 'attack') details = [...stat(t('stat'), t('statL')[a.stat]), ...stat(t('range'), a.range), ...damage(), ...stat(t('uses'), usesText(a))];
  if (a.type === 'spell') {
    const m = String(a.mult || '').replace(/^\+\s*/, '');
    details = [...stat(t('cost'), `${ARCANA.repeat(Number(a.cost) || 1)} (${a.cost || 1})`), ...damage(), ...stat(t('range'), a.range),
      ...stat(t('duration'), a.duration), ...stat(t('save'), a.save ? t('statL')[a.save] : ''),
      ...(m ? stat(t('mult'), `+${m} ${t('perArcana')} ${ARCANA}`) : []),
      para(run(scalingText(a.cost, a.dmg, a.mult), { size: 22, bold: true, color: hex(T.accent) }),
        { shading: { type: D.ShadingType.CLEAR, color: 'auto', fill: hex(T.soft) }, spacing: { before: 100, after: 60 } })];
  }
  const effect = String(a.effect || '').split('\n').map((l, i) => para(run(l, { size: 20 }), { spacing: { before: i ? 0 : 120 } }));

  const body = table([row([
    cell(pic ? para(image(pic, 56, 70), { alignment: center })
      : para(run(typeName, { size: 18, italics: true, color: hex(T.border) }), { alignment: center }), 60,
    { fill: pic ? undefined : T.soft, borders: pic ? undefined : { top: line(T.border, 6), bottom: line(T.border, 6), left: line(T.border, 6), right: line(T.border, 6) } }),
    cell([...details, ...effect], 126, { v: D.VerticalAlign.TOP, margins: { top: tw(1), bottom: 0, left: tw(5), right: tw(1) } }),
  ], 76)], [60, 126]);

  const flavor = table([row([cell(para(run(a.flavor, { size: 20, italics: true, color: hex(T.border) }), { alignment: center }), 186)], 22)],
    [186], { borders: { ...K.noBorders, top: line(T.accent2, 8) } });

  return {
    properties: { page: { size: { width: 8391, height: 11906, orientation: D.PageOrientation.LANDSCAPE }, margin: { top: tw(12), bottom: tw(8), left: tw(12), right: tw(12), header: 0, footer: 0 } } },
    children: [K.background(frame, 210, 148), top, spacer(3), body, spacer(3), flavor,
      para(run('', { size: 2 }), { spacing: { before: 0, after: 0, line: tw(1), lineRule: 'exact' } })],
  };
}
async function exportCards(c, list) {
  if (!list.length) return;
  const frame = drawFrame(210, 148, { radius: 8, inset: 4, orn: 6 });
  const sections = [];
  for (const a of list) sections.push(await cardSection(c, a, frame));
  const doc = new docx.Document({ creator: 'Simple D&D Sheets', title: nameOf(c), styles: docStyles(th().font), sections });
  const name = list.length === 1 ? `${safeName(nameOf(c))}_${safeName(list[0].name || t('typeL')[list[0].type])}` : `${safeName(nameOf(c))}_cards`;
  await download(doc, name);
}

/* ---------- boot ---------- */
/** Map old free-text damage types ("fire", "Feuer", ...) onto the fixed list. */
function guessDtype(txt) {
  const s = String(txt || '').toLowerCase();
  const words = { piercing: ['pierc', 'stich'], nature: ['natur', 'poison', 'gift', 'acid', 'säure'], fire: ['fire', 'feuer', 'flame'],
    water: ['water', 'wasser', 'cold', 'kälte', 'ice', 'eis'], light: ['light', 'licht', 'radiant', 'gleißend', 'lightning', 'blitz'],
    dark: ['dark', 'dunkel', 'necrotic', 'nekrot', 'shadow', 'schatten'], mental: ['mental', 'psych'] };
  return Object.keys(words).find(k => words[k].some(w => s.includes(w))) || 'bludgeoning';
}
// migrate characters saved by older versions
state.chars.forEach(c => { c.attacks = (c.attacks || []).slice(0, MAX_ATTACKS); c.attacks.forEach(a => { if (!DTYPES[a.type]) a.type = 'bludgeoning'; }); delete c.hpCur; delete c.hpMax;
  (c.abilities || []).forEach(a => { if (!DTYPES[a.dmgType]) a.dmgType = guessDtype(a.dmgType); }); });
if (!state.chars.length) addChar();
if (!cur()) state.currentId = state.chars[0].id;
save();
renderAll();
