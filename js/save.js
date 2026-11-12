// === SEKCJA: ZAPIS GRY & NADPISYWANIE DANYCH ===
const clone = (o) => JSON.parse(JSON.stringify(o));
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// Załaduj ewentualne nadpisania z panelu admina
(function loadOverrides() {
  try {
    const raw = localStorage.getItem("gameData_overrides");
    if (!raw) return;
    const ov = JSON.parse(raw);
    // Scalaj pola zamiast podmieniać cały wpis: stary zapis z panelu admina nie zna pól dodanych w kodzie (tone, category)
    if (ov.items && typeof ITEMS !== "undefined") Object.keys(ov.items).forEach((k) => { ITEMS[k] = { ...(ITEMS[k] || {}), ...ov.items[k] }; });
    if (ov.enemies && typeof ENEMIES !== "undefined") Object.assign(ENEMIES, ov.enemies);
    if (ov.traders && typeof TRADERS !== "undefined") {
      TRADERS.length = 0;
      ov.traders.forEach((t) => TRADERS.push(t));
    }
    if (ov.maps && typeof MAPS !== "undefined") Object.assign(MAPS, ov.maps);
    if (ov.skills && typeof SKILLS !== "undefined") {
      // JSON z panelu admina NIE zawiera funkcji (xpFormula, statBonus) - scalamy pola, zachowując funkcje z data/skills.js
      Object.keys(ov.skills).forEach((k) => {
        SKILLS[k] = { ...(SKILLS[k] || {}), ...ov.skills[k] };
      });
    }
    if (ov.perks && typeof PERKS !== "undefined") Object.assign(PERKS, ov.perks);
    if (ov.quests && typeof QUESTS !== "undefined") {
      QUESTS.length = 0;
      ov.quests.forEach((q) => QUESTS.push(q));
    }
    if (ov.loot && typeof LOOT !== "undefined") {
      Object.keys(LOOT).forEach((k) => delete LOOT[k]);
      Object.assign(LOOT, ov.loot);
    }
  } catch (e) {
    console.error("Błąd ładowania modyfikacji bazy:", e);
  }
})();

function getSlot() {
  return localStorage.getItem("currentSlot") || "1";
}

function stashSizeForLevel(lvl) {
  switch (lvl) {
    case 1: return [10, 12];
    case 2: return [10, 15];
    case 3: return [12, 16];
    case 4: return [12, 20];
    case 5: return [14, 24];
    default: return [10, 12];
  }
}

function findPerkDef(traitName) {
  if (typeof PERKS === "undefined") return null;
  if (PERKS[traitName]) return PERKS[traitName];
  return Object.values(PERKS).find(
    (p) => p.name === traitName || p.id === traitName
  );
}

function normalizeSave(s) {
  s.traits = s.traits || [];
  s.maxHp = s.maxHp || 100;
  s.hp = s.hp ?? s.maxHp;
  s.credits = s.credits ?? 500;
  s.hunger = s.hunger ?? 100;
  s.thirst = s.thirst ?? 100;
  s.level = s.level || 1;
  s.xp = s.xp || 0;
  s.raids = s.raids || 0;
  s.deaths = s.deaths || 0;
  s.tutorialDone = !!s.tutorialDone;
  s.quests = s.quests || {};
  s.completedQuests = s.completedQuests || [];
  s.traderRep = s.traderRep || {};
  if (typeof TRADERS !== "undefined") {
    TRADERS.forEach((t) => {
      s.traderRep[t.id] = s.traderRep[t.id] || 0;
    });
  }
  if (typeof initSaveBody === "function") initSaveBody(s);

  // Obliczenie limitu poziomu umiejętności (maxSkillCap)
  s.maxSkillCap = 15;
  s.traits.forEach((traitName) => {
    const p = findPerkDef(traitName);
    if (p && p.stats) {
      const capStat = p.stats.find((st) => st.stat === "maxSkillCap");
      if (capStat && capStat.val) s.maxSkillCap = parseInt(capStat.val, 10);
    }
  });

  // Inicjalizacja 7 modułów schronu
  s.ship = s.ship || { modules: {} };
  const allModules = ["Crafting", "Medstation", "Stash", "Silniki", "Komunikacja", "Hydroponika", "Safe system"];
  allModules.forEach((mId) => {
    const cur = s.ship.modules[mId] || {};
    let defActive = mId === s.module || mId === "Stash" || mId === "Komunikacja" || mId === "Hydroponika";
    let defLevel = mId === "Stash" || mId === "Hydroponika" ? 1 : (mId === s.module ? 1 : 0);
    s.ship.modules[mId] = {
      active: cur.active ?? defActive,
      level: cur.level ?? defLevel
    };
  });

  // Kompatybilność z dawnymi nazwami "Warsztat" i "Medyczny"
  if (s.module === "Warsztat" && s.ship.modules.Crafting.level === 0) {
    s.ship.modules.Crafting.level = 1;
    s.ship.modules.Crafting.active = true;
  }
  if (s.module === "Medyczny" && s.ship.modules.Medstation.level === 0) {
    s.ship.modules.Medstation.level = 1;
    s.ship.modules.Medstation.active = true;
  }

  // Inicjalizacja skilli
  s.skills = s.skills || {};
  if (typeof SKILLS !== "undefined") {
    Object.keys(SKILLS).forEach((k) => {
      s.skills[k] = s.skills[k] || { level: 0, xp: 0 };
    });
  }

  // Nadanie startowych poziomów umiejętności z perków (tylko raz przy tworzeniu)
  if (!s.traitBonusesApplied) {
    s.traits.forEach((traitName) => {
      const p = findPerkDef(traitName);
      if (p && p.stats) {
        p.stats.forEach((st) => {
          if (st.stat === "skillBonus" && st.skill && s.skills[st.skill]) {
            const add = parseInt(st.val, 10) || 0;
            s.skills[st.skill].level = Math.min(s.maxSkillCap, s.skills[st.skill].level + add);
          }
        });
      }
    });
    s.traitBonusesApplied = true;
  }

  // Inicjalizacja 3 slotów wyposażenia
  s.equipped = s.equipped || {
    armor: null,
    ranged: null,
    ranged2: null,
    melee: null,
    activeWeapon: "ranged"
  };

  // Inicjalizacja hydroponiki
  s.hydroponics = s.hydroponics || {
    lastCheck: Date.now(),
    food: 1,
    water: 1
  };

  const st = playerStats(s);
  const stashDim = stashSizeForLevel(s.ship.modules.Stash.level);
  s.stash = toContainer(s.stash, stashDim[0], stashDim[1], true);
  s.stash.w = stashDim[0];
  s.stash.h = stashDim[1];

  s.loadout = toContainer(s.loadout, 8, st.bagRows, false);
  s.loadout.w = Math.max(s.loadout.w, 8);
  s.loadout.h = Math.max(s.loadout.h, st.bagRows);

  if (!s.kitGiven) {
    (KITS[s.kit] || []).forEach(([id, qty]) => addToContainer(s.loadout, id, qty));
    s.lastLoadout = summarize(s.loadout);
    s.kitGiven = true;
  }
  s.lastLoadout = s.lastLoadout || [];

  return s;
}

function loadSave() {
  const key = `saveSlot_${getSlot()}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return normalizeSave(JSON.parse(raw));
  } catch (err) {
    // Uszkodzony zapis: nie wywalamy gry, a surowe dane zostają w kopii zapasowej
    console.warn("Uszkodzony zapis, tworzę kopię:", err);
    try {
      localStorage.setItem(key + "_backup", raw);
    } catch (e) {
      /* brak miejsca w pamięci przeglądarki - trudno, zapis i tak jest nieczytelny */
    }
    return null;
  }
}

function writeSave(s) {
  localStorage.setItem(`saveSlot_${getSlot()}`, JSON.stringify(s));
}

function moduleActive(s, id) {
  return !!s.ship.modules[id]?.active && (s.ship.modules[id]?.level > 0);
}

function moduleLevel(s, id) {
  return s.ship.modules[id]?.level || 0;
}

// === SEKCJA: STATYSTYKI POSTACI & NIEWIDZIALNE STATYSTYKI ===
function playerStats(s) {
  const t = s.traits || [];
  const sk = s.skills || {};

  const lvlSila = sk.sila?.level || 0;
  const lvlWytrzymalosc = sk.wytrzymalosc?.level || 0;
  const lvlWitalnosc = sk.witalnosc?.level || 0;
  const lvlPrzeszukiwanie = sk.przeszukiwanie?.level || 0;
  const lvlPercepcja = sk.percepcja?.level || 0;
  const lvlBron = sk.bronPalna?.level || 0;
  const lvlMedycyna = sk.medycyna?.level || 0;
  const lvlInzynieria = sk.inzynieria?.level || 0;
  const lvlMetabolizm = sk.metabolizm?.level || 0;
  const lvlPrzetrwanie = sk.przetrwanie?.level || 0;

  // Niewidzialne statystyki bazowe
  let luck = 0;
  let critChance = 5; // bazowo 5%
  let immunity = 0;
  let intuition = 0;
  let stealth = 0;
  let scavenger = 0;
  let adrenaline = 0;
  let maxSkillCap = s.maxSkillCap || 15;

  // Zliczanie z wybranych perków
  t.forEach((traitName) => {
    const p = findPerkDef(traitName);
    if (!p || !p.stats) return;
    p.stats.forEach((m) => {
      const v = parseFloat(m.val) || 0;
      if (m.stat === "luck") luck += v;
      if (m.stat === "critChance") critChance += v;
      if (m.stat === "immunity") immunity += v;
      if (m.stat === "intuition") intuition += v;
      if (m.stat === "stealth") stealth += v;
      if (m.stat === "scavenger") scavenger += v;
      if (m.stat === "adrenaline") adrenaline += v;
      if (m.stat === "maxSkillCap") maxSkillCap = parseInt(m.val, 10);
    });
  });

  // Dodatkowy wpływ umiejętności na ukryte statystyki
  luck += lvlPrzeszukiwanie * 1.5;
  intuition += lvlPercepcja * 2.5;
  immunity += lvlPrzetrwanie * 2.0;
  stealth += lvlWytrzymalosc * 1.0;
  scavenger += lvlInzynieria * 2.0;

  const hasTrait = (name) => t.includes(name) || t.some((x) => {
    const p = findPerkDef(x);
    return p && (p.name === name || p.id === name);
  });

  return {
    // Niewidzialne statystyki
    luck,
    critChance: Math.max(1, critChance),
    immunity,
    intuition,
    stealth,
    scavenger,
    adrenaline,
    maxSkillCap,

    // Główne parametry
    bagRows: 5 + (hasTrait("Silny") ? 1 : 0) + (s.planet === "Kepler-452 b" ? 1 : 0),
    meleeMult: (hasTrait("Silny") ? 1.25 : 1) * (1 + lvlSila * 0.03),
    rangedAcc: (hasTrait("Krótkowidz") || hasTrait("Krotkowidz") ? 0.8 : 1) * (1 + lvlBron * 0.015),
    rangedDmgMult: 1 + lvlBron * 0.02,
    xpMult: hasTrait("Bystry") ? 1.25 : 1,
    fleeMod: (hasTrait("Astmatyk") ? -0.15 : 0) + (s.planet === "Kepler-452 b" ? -0.1 : 0) + lvlWytrzymalosc * 0.02 + stealth * 0.005,
    rareMult: (hasTrait("Pechowiec") ? 0.6 : 1) * (1 + lvlPrzeszukiwanie * 0.025) * (1 + Math.max(-0.5, luck * 0.01)),
    bonusLootChance: Math.max(0, luck * 0.01),
    healMult: 1 + lvlMedycyna * 0.04,
    bonusHp: lvlWitalnosc * 3,
    resist: {
      frost: (s.planet === "TRAPPIST-1 e" ? 0.1 : 0) + lvlPrzetrwanie * 0.015 + immunity * 0.005,
      radiation: (s.planet === "Ross-128 b" ? 0.15 : 0) + lvlPrzetrwanie * 0.015 + immunity * 0.005,
      toxic: Math.max(0, immunity * 0.01),
    },
  };
}

const FISTS = { name: "Pięści", dmg: [2, 4], acc: 0.9 };

function bestWeapon(cont) {
  let best = FISTS;
  let bestAvg = 3;
  cont.items.forEach((r) => {
    const it = ITEMS[r.id];
    if (!it || it.type !== "weapon") return;
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
  if (typeof save !== "undefined" && save && save.equipped && save.equipped.armor && ITEMS[save.equipped.armor]) {
    return ITEMS[save.equipped.armor];
  }
  let best = null;
  if (cont && cont.items) {
    cont.items.forEach((r) => {
      const it = ITEMS[r.id];
      if (it && it.type === "armor" && (!best || it.def > best.def)) best = it;
    });
  }
  return best;
}

// === SEKCJA: DOŚWIADCZENIE I ROZWÓJ SKILLI ===
function xpForLevel(l) {
  return 50 * l;
}

function grantXp(s, amount) {
  s.xp += amount;
  let ups = 0;
  while (s.xp >= xpForLevel(s.level)) {
    s.xp -= xpForLevel(s.level);
    s.level++;
    // Maks. HP rośnie z poziomu tylko co 5 poziomów (+10). Resztę daje Witalność.
    if (s.level % 5 === 0) {
      s.maxHp += 10;
      s.hp = Math.min(s.maxHp, s.hp + 10);
    }
    ups++;
  }
  return ups;
}

// Koszt XP do następnego poziomu umiejętności (odporny na brak xpFormula, np. po edycji w panelu admina)
function skillXpReq(def, lvl) {
  return typeof def?.xpFormula === "function" ? def.xpFormula(lvl) : 60 * (lvl + 1);
}

function grantSkillXp(s, skillId, amount) {
  s.skills = s.skills || {};
  const sk = s.skills[skillId] || { level: 0, xp: 0 };
  s.skills[skillId] = sk;
  const maxCap = s.maxSkillCap || 15;
  if (sk.level >= maxCap) return 0;

  sk.xp += amount;
  let ups = 0;
  const def = typeof SKILLS !== "undefined" ? SKILLS[skillId] : null;
  const formula = (lvl) => skillXpReq(def, lvl);

  while (sk.level < maxCap && sk.xp >= formula(sk.level)) {
    sk.xp -= formula(sk.level);
    sk.level++;
    ups++;
  }
  return ups;
}

// Skrzynia z amunicją: 3 różne rodzaje amunicji, każdy stos to 60–100% pełnego stosu.
function unpackAmmoCrate() {
  const ids = Object.keys(ITEMS).filter((k) => ITEMS[k].type === "ammo");
  const picked = [];
  while (picked.length < 3 && ids.length) picked.push(ids.splice(Math.floor(Math.random() * ids.length), 1)[0]);
  return picked.map((id) => ({ id, qty: Math.max(1, Math.round(ITEMS[id].stack * (0.6 + Math.random() * 0.4))) }));
}

// Dokumentacja umiejętności: +n pełnych poziomów losowej umiejętności, która nie jest na maksimum. Zwraca id umiejętności.
function applySkillDoc(s, n) {
  s.skills = s.skills || {};
  const cap = s.maxSkillCap || 15;
  const keys = Object.keys(typeof SKILLS !== "undefined" ? SKILLS : {});
  const pool = keys.filter((k) => ((s.skills[k] || {}).level || 0) < cap);
  if (!pool.length) return null;
  const id = pool[Math.floor(Math.random() * pool.length)];
  const sk = s.skills[id] || { level: 0, xp: 0 };
  s.skills[id] = sk;
  sk.level = Math.min(cap, sk.level + n);
  sk.xp = 0;
  return id;
}

// === SEKCJA: DEDYKOWANE SLOTY WYPOSAŻENIA (PANCERZ, PALNA, BIAŁA) ===
function hasHolster(s) {
  if (!s) return false;
  return (
    countItem(s.stash, "holster") > 0 ||
    countItem(s.loadout, "holster") > 0 ||
    (s.equipped && (s.equipped.holster === "holster" || s.equipped.ranged2)) ||
    (s.traits && s.traits.some((t) => t.toLowerCase().includes("kabura")))
  );
}

function equipItem(s, itemId, slot, fromCont, inst) {
  if (!s || !ITEMS[itemId]) return false;
  s.equipped = s.equipped || { armor: null, ranged: null, ranged2: null, melee: null, activeWeapon: "ranged" };
  const it = ITEMS[itemId];

  let valid = false;
  if (slot === "armor" && it.type === "armor") valid = true;
  if (slot === "ranged" && it.type === "weapon" && it.ammo) valid = true;
  if (slot === "ranged2" && it.type === "weapon" && it.ammo && hasHolster(s)) valid = true;
  if (slot === "melee" && it.type === "weapon" && !it.ammo) valid = true;

  if (!valid) return false;

  // Jeśli slot jest zajęty, spróbuj odłożyć poprzedni przedmiot do siatki
  if (s.equipped[slot]) {
    const prevId = typeof s.equipped[slot] === "string" ? s.equipped[slot] : s.equipped[slot].id;
    const dest = fromCont || s.stash || s.loadout;
    const left = addToContainer(dest, prevId, 1);
    if (left > 0) {
      const altDest = dest === s.stash ? s.loadout : s.stash;
      const leftAlt = addToContainer(altDest, prevId, 1);
      if (leftAlt > 0) return false; // Brak miejsca na stary przedmiot
    }
  }

  // Usuń zakładany przedmiot z siatki źródłowej
  if (fromCont && inst) {
    consumeInst(fromCont, inst, 1);
  } else if (fromCont) {
    removeById(fromCont, itemId, 1);
  } else {
    if (countItem(s.loadout, itemId) > 0) removeById(s.loadout, itemId, 1);
    else if (countItem(s.stash, itemId) > 0) removeById(s.stash, itemId, 1);
  }

  s.equipped[slot] = itemId;
  return true;
}

function unequipItem(s, slot, targetCont) {
  if (!s || !s.equipped || !s.equipped[slot]) return false;
  const itemId = typeof s.equipped[slot] === "string" ? s.equipped[slot] : s.equipped[slot].id;
  const dest = targetCont || s.stash || s.loadout;

  let left = addToContainer(dest, itemId, 1);
  if (left > 0) {
    const altDest = dest === s.stash ? s.loadout : s.stash;
    left = addToContainer(altDest, itemId, 1);
    if (left > 0) return false; // Brak miejsca na odłożenie przedmiotu
  }

  s.equipped[slot] = null;
  return true;
}

// Progi reputacji na Tier. Tier 1 wymaga ukończenia całego Tieru 0 danego handlarza (210 pkt) + misji głównych/terminala.
// Tier 2 wymaga ukończenia całego Tieru 1 (290 pkt) + reszty. Zmieniając, sprawdź też nextTarget w hideout.js.
const TRADER_TIER_THRESHOLDS = { 1: 240, 2: 520, 3: 800 };

function getTraderTier(s, traderId) {
  if (!s || !s.traderRep) return 0;
  const rep = s.traderRep[traderId] || 0;
  if (rep >= TRADER_TIER_THRESHOLDS[3]) return 3;
  if (rep >= TRADER_TIER_THRESHOLDS[2]) return 2;
  if (rep >= TRADER_TIER_THRESHOLDS[1]) return 1;
  return 0;
}
