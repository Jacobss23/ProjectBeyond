// === SEKCJA: ZAPIS GRY ===
const clone = (o) => JSON.parse(JSON.stringify(o));
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function getSlot() {
  return localStorage.getItem("currentSlot") || "1";
}

function normalizeSave(s) {
  s.traits = s.traits || [];
  s.maxHp = s.maxHp || 100;
  s.hp = s.hp ?? s.maxHp;
  s.credits = s.credits ?? 500;
  s.level = s.level || 1;
  s.xp = s.xp || 0;
  s.raids = s.raids || 0;
  s.deaths = s.deaths || 0;
  s.tutorialDone = !!s.tutorialDone;

  const st = playerStats(s);
  s.stash = toContainer(s.stash, 10, 12, true);
  s.loadout = toContainer(s.loadout, 8, st.bagRows, false);
  s.loadout.w = Math.max(s.loadout.w, 8);
  s.loadout.h = Math.max(s.loadout.h, st.bagRows);

  if (!s.kitGiven) {
    (KITS[s.kit] || []).forEach(([id, qty]) => addToContainer(s.loadout, id, qty));
    s.lastLoadout = summarize(s.loadout);
    s.kitGiven = true;
  }
  s.lastLoadout = s.lastLoadout || [];

  s.ship = s.ship || { modules: {} };
  SHIP_MODULES.forEach((m) => {
    const cur = s.ship.modules[m.id] || {};
    s.ship.modules[m.id] = { active: m.id === s.module || !!cur.active, level: cur.level || 1 };
  });
  return s;
}

function loadSave() {
  const raw = localStorage.getItem(`saveSlot_${getSlot()}`);
  return raw ? normalizeSave(JSON.parse(raw)) : null;
}

function writeSave(s) {
  localStorage.setItem(`saveSlot_${getSlot()}`, JSON.stringify(s));
}

function moduleActive(s, id) {
  return !!s.ship.modules[id]?.active;
}

// === SEKCJA: STATYSTYKI POSTACI ===
function playerStats(s) {
  const t = s.traits || [];
  return {
    bagRows: 5 + (t.includes("Silny") ? 1 : 0) + (s.planet === "Kepler-452 b" ? 1 : 0),
    meleeMult: t.includes("Silny") ? 1.25 : 1,
    rangedAcc: t.includes("Krótkowidz") ? 0.8 : 1,
    xpMult: t.includes("Bystry") ? 1.25 : 1,
    fleeMod: (t.includes("Astmatyk") ? -0.15 : 0) + (s.planet === "Kepler-452 b" ? -0.1 : 0),
    rareMult: t.includes("Pechowiec") ? 0.5 : 1,
    resist: {
      frost: s.planet === "TRAPPIST-1 e" ? 0.1 : 0,
      radiation: s.planet === "Ross-128 b" ? 0.15 : 0,
    },
  };
}

const FISTS = { name: "Pięści", dmg: [2, 4], acc: 0.9 };

function bestWeapon(cont) {
  let best = FISTS;
  let bestAvg = 3;
  cont.items.forEach((r) => {
    const it = ITEMS[r.id];
    if (it.type !== "weapon") return;
    if (it.ammo && countItem(cont, it.ammo) < 1) return;
    const avg = (it.dmg[0] + it.dmg[1]) / 2;
    if (avg > bestAvg) {
      best = { ...it, id: r.id };
      bestAvg = avg;
    }
  });
  return best;
}

function bestArmor(cont) {
  let best = null;
  cont.items.forEach((r) => {
    const it = ITEMS[r.id];
    if (it.type === "armor" && (!best || it.def > best.def)) best = it;
  });
  return best;
}

// === SEKCJA: DOŚWIADCZENIE ===
function xpForLevel(l) {
  return 50 * l;
}

function grantXp(s, amount) {
  s.xp += amount;
  let ups = 0;
  while (s.xp >= xpForLevel(s.level)) {
    s.xp -= xpForLevel(s.level);
    s.level++;
    s.maxHp += 10;
    s.hp = Math.min(s.maxHp, s.hp + 10);
    ups++;
  }
  return ups;
}
