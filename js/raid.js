// === SEKCJA: STAN RAJDU ===
const params = new URLSearchParams(window.location.search);
const MAP = MAPS[params.get("map") || "tutorial"];
const save = loadSave();
if (MAP && MAP.requiresHash && !(save && save.hashImplemented)) {
  window.location.replace("hideout.html");
}
// Mapa z wejściem tylko przez transit (Archiwum): bez przeniesionego stanu rajdu nie da się wejść
let transitCarry = null;
if (MAP && MAP.viaTransit) {
  try {
    transitCarry = JSON.parse(sessionStorage.getItem("raidTransit") || "null");
    sessionStorage.removeItem("raidTransit");
  } catch (e) {
    transitCarry = null;
  }
  if (!transitCarry || transitCarry.to !== (params.get("map") || "")) window.location.replace("hideout.html");
}
const st = save ? playerStats(save) : null;
const log = termLog;
// Opisy znaczników wymaganych do ewakuacji (node.extractRequires)
const EXTRACT_LOCK_TEXT = { engineFixed: "najpierw napraw silnik statku" };


let raid = null;
let combatBagOpen = false;
let uiMode = null;
let bagView = null;
let groundView = null;
const tipsShown = {};

// Etykiety buffów z przedmiotów (używane w logu i w opisie)
const BUFF_LABEL = { bleedStop: "BleedStop", saturnCola: "SaturnCola", sytosc: "Sytość", znieczulenie: "Znieczulenie", adrenalina: "Adrenalina" };

// Losowe zdarzenia na węźle (ważone losowanie)
const NODE_EVENTS = [
  { w: 3, msg: "[ZDARZENIE] Zapomniany skład. W kącie leży paczka z częściami.", run: () => addGround(raid.node, [{ id: "scrap", qty: 2 }, { id: "wires", qty: 1 }]) },
  { w: 2, msg: "[ZDARZENIE] Osuwisko! Kamienie spadają z góry.", run: () => damage(3, "osuwisko") },
  { w: 2, msg: "[ZDARZENIE] Pod ścianą leży czyjaś apteczka. Ktoś musiał uciekać w pośpiechu.", run: () => addGround(raid.node, [{ id: "bandage", qty: 1 }]) },
  { w: 2, msg: "[ZDARZENIE] Przez chwilę panuje cisza. Nawet echo kroków milknie.", run: () => { raid.noise = 0; } },
  { w: 1, msg: "[ZDARZENIE] Martwy zarażony leży przy wejściu. Z jego kieszeni wypada układ scalony.", run: () => addGround(raid.node, [{ id: "circuit", qty: 1 }]) },
];

// Minimapa: kierunki zgodne z klawiszami (indeks wyjścia 0=W, 1=A, 2=S, 3=D)
const MM_DIRS = [[0, -1], [-1, 0], [0, 1], [1, 0]];
const MM_KEYS = ["W", "A", "S", "D"];

// === SEKCJA: WZNOWIENIE RAJDU I BLOKADY (v.1.74.0) ===
// Stan rajdu trzymamy w sessionStorage (przeżywa F5 w tej samej karcie). Rajd w toku ma
// flagę save.activeRaid; jeśli stanu nie ma (nowa karta, zamknięta przeglądarka), rajd jest przerwany.
const RAID_SNAP_KEY = "raidSnap";
function raidMapKey() {
  return params.get("map") || "tutorial";
}
function saveRaidSnap() {
  if (!raid || raid.over) return;
  try {
    sessionStorage.setItem(RAID_SNAP_KEY, JSON.stringify({ map: raidMapKey(), raid, tipsShown }));
  } catch (e) {
    /* brak miejsca w pamięci przeglądarki - rajd działa dalej bez wznowienia */
  }
}
function clearRaidSnap() {
  try {
    sessionStorage.removeItem(RAID_SNAP_KEY);
  } catch (e) {
    /* nic do czyszczenia */
  }
}
function loadRaidSnap() {
  try {
    const s = JSON.parse(sessionStorage.getItem(RAID_SNAP_KEY) || "null");
    return s && s.map === raidMapKey() && s.raid && !s.raid.over ? s : null;
  } catch (e) {
    return null;
  }
}
// Cofanie w przeglądarce nie opuszcza rajdu; zamknięcie/odświeżenie pyta o potwierdzenie
function guardRaid() {
  history.pushState({ raid: true }, "", location.href);
  window.addEventListener("popstate", () => {
    if (!raid || raid.over) return;
    history.pushState({ raid: true }, "", location.href);
    log("Nie możesz cofnąć się w trakcie rajdu. Ewakuuj się albo zgiń.", "warn");
  });
  window.addEventListener("beforeunload", (e) => {
    if (!raid || raid.over) return;
    e.preventDefault();
    e.returnValue = "";
  });
  window.addEventListener("pagehide", saveRaidSnap);
}

// Stan reakcji QTE
let qteActive = null;
let qteTimer = null;
let autoFightStepTimeout = null;

if (!save || !MAP) {
  window.location.replace("index.html");
} else {
  initRaid();
}

function initRaid() {
  $("combat-bag-btn").onclick = () => { combatBagOpen = true; syncUiMode(); };
  $("bag-back-btn").onclick = () => { combatBagOpen = false; syncUiMode(); };
  guardRaid();
  const freshStart = !!(save.raidStart && save.raidStart === raidMapKey());
  if (freshStart) {
    // Świeży start ze schronu
    save.raidStart = null;
    save.activeRaid = true;
    writeSave(save);
  }
  const snap = loadRaidSnap();
  if (save.activeRaid && !freshStart && !snap && !transitCarry) {
    // Rajd był w toku, ale stanu nie ma (nowa karta / zamknięta przeglądarka / awaryjne wyjście): przegrany
    save.activeRaid = false;
    if (!MAP.tutorial) {
      save.deaths++;
      save.equipped = { armor: null, ranged: null, ranged2: null, melee: null, activeWeapon: "ranged" };
      save.loadout.items = [];
      writeSave(save);
      alert("Rajd został przerwany. Ekwipunek przepadł.");
      window.location.replace("hideout.html");
      return;
    }
    writeSave(save);
  }
  if (snap && !transitCarry) {
    // Wznowienie po F5: wracamy dokładnie w miejsce, w którym był rajd
    raid = snap.raid;
    Object.assign(tipsShown, snap.tipsShown || {});
    if (typeof applyDayNight === "function") applyDayNight(raid.isNight);
    mountRaidBag();
    render();
    log("[WZNOWIENIE] Rajd wznowiony.", "tip");
    return;
  }
  raid = {
    node: MAP.start,
    hp: save.hp,
    bag: clone(save.loadout),
    ground: {},
    visited: {},
    searched: {},
    cleared: {},
    flags: {},
    moves: 0,
    kills: 0,
    xp: 0,
    enemy: null,
    stealthMode: null,
    unawareTurns: 0,
    autoFighting: false,
    autoFightPaused: false,
    over: false,
    repairing: null,
  };
  raid.startLoadout = summarize(raid.bag);
  raid.noise = 0;
  if (transitCarry && transitCarry.raid) {
    // Kontynuacja rajdu po przejściu transitem: zachowaj plecak, HP, łup i postępy
    const c = transitCarry.raid;
    raid.bag = c.bag;
    raid.hp = c.hp;
    raid.xp = c.xp || 0;
    raid.kills = c.kills || 0;
    raid.found = c.found || {};
    raid.flags = c.flags || {};
    raid.startLoadout = c.startLoadout || raid.startLoadout;
  }
  raid.pos = { [MAP.start]: { x: 0, y: 0 } };
  raid.isNight = Math.random() < 0.5;
  save.lastNight = raid.isNight;
  writeSave(save);
  if (typeof applyDayNight === "function") applyDayNight(raid.isNight);
  mountRaidBag();
  if (MAP.tutorial && MAP.nodes) {
    const targetModId = save.tutorialModule || (save.module === "Crafting" ? "Medstation" : "Crafting");
    const modDef = typeof SHIP_MODULES !== "undefined" ? SHIP_MODULES.find((m) => m.id === targetModId) : null;
    const reqs = modDef?.levels[1]?.items || [];
    if (MAP.nodes.depot) {
      MAP.nodes.depot.guaranteed = MAP.nodes.depot.guaranteed || [];
      reqs.forEach(([id, qty]) => {
        if (!MAP.nodes.depot.guaranteed.some((g) => g[0] === id)) {
          MAP.nodes.depot.guaranteed.push([id, qty]);
        }
      });
    }
  }
  log(MAP.intro, "intro");
  log(raid.isNight ? "[NOC] Zapada noc. Cienie są głębsze, a Pusty słabiej widzą w ciemności." : "[DZIEŃ] Jasne światło. Trudniej o ukrycie, ale widać więcej.", "tip");
  tip("start");
  tip("hud");
  enterNode(MAP.start);
  tip("move");
}

function mountRaidBag() {
  bagView = mountGrid($("bag-grid"), raid.bag, {
    canMoveIn: canMoveItems,
    onMoveIn: (inst) => gotItem(inst),
    onSelect: renderInfo,
    onChange: onGridChange,
    onQuickMove: (inst) => dropToGround(inst),
  });
  const takeBtn = $("take-all");
  if (takeBtn) {
    takeBtn.textContent = "Zabierz wszystko [Shift+R]";
    takeBtn.onclick = takeAll;
  }
}

function tip(key) {
  if (!MAP.tutorial || !MAP.tips || !MAP.tips[key] || tipsShown[key]) return;
  tipsShown[key] = true;
  log(MAP.tips[key], "tip");
}

// === SEKCJA: LOOT I SIATKA ===
function groundOf(nodeId) {
  if (!raid.ground[nodeId]) raid.ground[nodeId] = newContainer(6, 4, true);
  return raid.ground[nodeId];
}

function mountGround() {
  groundView = mountGrid($("ground-grid"), groundOf(raid.node), {
    canMoveIn: canMoveItems,
    onMoveIn: (inst) => {
      log(`Wyrzucono: ${ITEMS[inst.id].name}${inst.qty > 1 ? ` x${inst.qty}` : ""}.`);
    },
    onSelect: renderInfo,
    onChange: onGridChange,
    onQuickMove: (inst) => takeToBag(inst),
  });
}

function canMoveItems() {
  return !raid.enemy && !raid.stealthMode && !qteActive && !raid.over;
}

function onGridChange() {
  if (raid && !raid.over) render();
}

function gotItem(inst) {
  log(`Zabrano: ${ITEMS[inst.id].name}${inst.qty > 1 ? ` x${inst.qty}` : ""}.`);
  edgeGlow("loot");
  const R = MAP.repair;
  if (R && R.parts.includes(inst.id)) {
    const have = R.parts.filter((p) => countItem(raid.bag, p) > 0 || p === inst.id).length;
    log(`Część zdobyta (${have}/${R.parts.length}).`, "tip");
    if (have === R.parts.length) tip("repair");
  }
}

function takeToBag(inst) {
  if (!canMoveItems()) return log("W walce nie możesz przekładać przedmiotów.", "warn");
  if (!quickMove(groundView, bagView, inst)) log("Brak miejsca w plecaku.", "warn");
}

function dropToGround(inst) {
  if (!canMoveItems()) return log("W walce nie możesz przekładać przedmiotów.", "warn");
  quickMove(bagView, groundView, inst);
}

function takeAll() {
  if (!canMoveItems()) return log("W walce nie możesz przekładać przedmiotów.", "warn");
  const ground = groundOf(raid.node);
  [...ground.items].forEach((inst) => quickMove(groundView, bagView, inst));
  if (ground.items.length) log("Nie wszystko zmieściło się w plecaku.", "warn");
  render();
}

// Poziom wartości przedmiotu: 0 tanie ... 3 najdroższe; rzadkie +1 (max 4)
function itemLootTier(it) {
  if (!it) return 0;
  let t = it.value <= 150 ? 0 : it.value <= 400 ? 1 : it.value <= 800 ? 2 : 3;
  if (it.rarity === "rare") t = Math.min(4, t + 1);
  return t;
}

function rollLoot(tableName, rolls) {
  if (!LOOT[tableName]) return [];
  const mapTier = typeof MAP !== "undefined" && MAP && MAP.tier != null ? MAP.tier : 1;
  const table = LOOT[tableName]
    .filter((e) => !ITEMS[e.id]?.quest && itemLootTier(ITEMS[e.id]) <= mapTier)
    .map((e) => ({
      ...e,
      w: e.w * (ITEMS[e.id] && ITEMS[e.id].rarity === "rare" ? st.rareMult : 1),
    }));
  if (!table.length) return [];
  const total = table.reduce((s, e) => s + e.w, 0);
  const found = [];
  for (let i = 0; i < rolls; i++) {
    let r = Math.random() * total;
    for (const entry of table) {
      r -= entry.w;
      if (r <= 0) {
        found.push({ id: entry.id, qty: randInt(entry.min, entry.max) });
        break;
      }
    }
  }
  return found;
}

function addGround(nodeId, items) {
  const ground = groundOf(nodeId);
  raid.found = raid.found || {};
  items.forEach((r) => {
    addToContainer(ground, r.id, r.qty);
    raid.found[r.id] = (raid.found[r.id] || 0) + r.qty;
  });
}

// === SEKCJA: INFO O PRZEDMIOCIE ===
function renderInfo() {
  const box = $("item-info");
  if (!box) return;
  box.innerHTML = "";
  const sel = getSelected();
  if (!sel) {
    const p = document.createElement("p");
    p.className = "hint";
    p.textContent = "Kliknij przedmiot, aby zobaczyć szczegóły. Przeciągaj między Plecakiem a Ziemią. R obraca.";
    box.appendChild(p);
    return;
  }
  const { view, inst } = sel;
  const it = ITEMS[inst.id];
  if (!it) return;
  const h = document.createElement("h3");
  h.textContent = `${it.name}${inst.qty > 1 ? ` x${inst.qty}` : ""}`;
  box.appendChild(h);
  itemStats(inst.id).forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    box.appendChild(p);
  });

  // Dodatkowe podpowiedzi leczenia ran
  if (it.cures) {
    const cureNames = it.cures.map((c) => BODY_EFFECTS[c]?.name || c).join(", ");
    const cp = document.createElement("p");
    cp.style.color = "#38bdf8";
    cp.textContent = `Ulecza rany: ${cureNames}`;
    box.appendChild(cp);
  }
  if (it.use) {
    const up = document.createElement("p");
    up.className = "hint";
    up.textContent = "Działanie: " + it.use;
    box.appendChild(up);
  }
  if (it.buff) {
    const bp = document.createElement("p");
    bp.style.color = "#4ade80";
    bp.textContent = `Daje wzmocnienie: ${BUFF_LABEL[it.buff] || BODY_EFFECTS[it.buff]?.name || it.buff} (${it.buffDuration} tur)`;
    box.appendChild(bp);
  }

  const row = document.createElement("div");
  row.className = "btn-row";
  row.style.marginTop = "8px";
  const inBag = view === bagView;
  if (it.read) row.appendChild(btn("Czytaj", () => readItem(inst)));
  if ((it.heal || it.cures || it.buff || it.hunger || it.thirst) && inBag) row.appendChild(btn("Użyj", () => useInst(inst)));
  row.appendChild(btn("Obróć (R)", () => rotateSelected(), "ghost"));
  row.appendChild(btn(inBag ? "Wyrzuć" : "Zabierz", () => (inBag ? dropToGround(inst) : takeToBag(inst)), "ghost"));
  box.appendChild(row);
}

function readItem(inst) {
  const it = ITEMS[inst.id];
  if (it.read === "repair" && MAP.repair) {
    log("INSTRUKCJA - kolejność napraw:", "tip");
    MAP.repair.steps.forEach((s, i) => log(`${i + 1}. ${s}`, "tip"));
  } else {
    log("Nieczytelne.", "warn");
  }
}

// === SEKCJA: RUCH I EKSPLORACJA ===
function damage(n, src, glow = "hurt") {
  raid.hp = Math.max(0, raid.hp - n);
  log(`Tracisz ${n} HP (${src}).`, "danger");
  edgeGlow(glow);
  if (typeof grantSkillXp === "function") grantSkillXp(save, "witalnosc", 8);
  writeSave(save);
  if (raid.hp === 0) die();
  else if (raid.hp < save.maxHp * 0.5) tip("heal");
  return raid.hp > 0;
}

// Głód i pragnienie: szanse na spadek o 2% za turę (ruch / walka / przeszukiwanie)
const NUTR_CHANCE = {
  move: { food: 0.15, water: 0.22 },
  fight: { food: 0.35, water: 0.43 },
  search: { food: 0.22, water: 0.27 },
};
function nutritionTurn(kind) {
  const c = NUTR_CHANCE[kind];
  if (!c) return;
  const h0 = save.hunger ?? 100;
  const t0 = save.thirst ?? 100;
  if (Math.random() < c.food) save.hunger = Math.max(0, h0 - 2);
  if (Math.random() < c.water) save.thirst = Math.max(0, t0 - 2);
  nutritionWarn("Jedzenie", h0, save.hunger ?? 100);
  nutritionWarn("Picie", t0, save.thirst ?? 100);
}

// Jednorazowe ostrzeżenie, gdy wskaźnik przekroczy próg 50%, 20% lub 0%
function nutritionWarn(label, before, after) {
  for (const lvl of [50, 20, 0]) {
    if (before > lvl && after <= lvl) {
      const need = label === "Picie" ? "picia" : "jedzenia";
      const txt = lvl === 0
        ? `${label}: 0%. Organizm odmawia posłuszeństwa, każdy ruch kosztuje zdrowie.`
        : `${label} spada do ${lvl}%. Szukaj ${need} zanim będzie gorzej.`;
      log(`[${label.toUpperCase()}] ${txt}`, lvl <= 20 ? "danger" : "warn");
    }
  }
}

function tick(kind = "move") {
  raid.moves++;
  nutritionTurn(kind);

  // Hałas opada z każdym ruchem; przy progu przyciąga Pustych z sąsiedztwa
  if (raid.noise > 0) raid.noise--;
  if ((raid.noise || 0) >= 3) {
    raid.noise = 0;
    attractPustych();
  }

  // Obrażenia od krwawienia z efektów anatomii
  const activeEffs = typeof getActiveBodyEffects === "function" ? getActiveBodyEffects(save) : [];
  let bleedDmg = 0;
  activeEffs.forEach((eff) => {
    if (eff.dmgPerTurn) bleedDmg += eff.dmgPerTurn;
  });

  if (bleedDmg > 0) {
    log(`[RANY] Utrata krwi z ran ciętych! Tracisz -${bleedDmg} HP. Użyj bandaża/opaski!`, "danger");
    if (!damage(bleedDmg, "krwawienie")) return false;
  }

  // Głód i pragnienie: gdy średnia kondycja jest poniżej 50%, każdy ruch kosztuje 3% max HP
  if (kind === "move") {
    const nutr = ((save.hunger ?? 100) + (save.thirst ?? 100)) / 2;
    if (nutr < 50) {
      const starveDmg = Math.ceil(save.maxHp * 0.03);
      log(`[GŁÓD/PRAGNIENIE] Kondycja ${Math.round(nutr)}%: tracisz -${starveDmg} HP.`, "danger");
      if (!damage(starveDmg, "głód/pragnienie")) return false;
    }
  }

  // Sytość (Racja): pasywna regeneracja co turę
  if (save.globalBuffs && save.globalBuffs.sytosc > 0 && raid.hp < save.maxHp) {
    raid.hp = Math.min(save.maxHp, raid.hp + 15);
  }

  // Zmniejszanie liczników czasowych buforów i efektów
  if (save.globalBuffs) {
    Object.keys(save.globalBuffs).forEach((k) => {
      if (save.globalBuffs[k] > 0) {
        save.globalBuffs[k]--;
        if (save.globalBuffs[k] === 0) {
          log(`Efekt [${BUFF_LABEL[k] || BODY_EFFECTS[k]?.name || k}] wygasł.`, "warn");
        }
      }
    });
  }

  // Opóźnienie wykrywalności nieświadomego wroga
  if (raid.unawareTurns > 0) {
    raid.unawareTurns--;
    if (raid.unawareTurns > 0) {
      log(`[OPÓŹNIONA WYKRYWALNOŚĆ] Przeciwnik jest odwrócony! Pozostało ${raid.unawareTurns} tur opóźnienia zanim cię dostrzeże.`, "tip");
    } else {
      log(`[WYKRYCIE!] Wróg odwrócił się i cię zauważył! Rozpoczyna się walka.`, "danger");
      const node = MAP.nodes[raid.node];
      if (node && node.enemy) startCombat(node.enemy.id);
    }
  }

  if (!MAP.storm) return true;
  if (raid.moves === MAP.storm) log("Burza uderza! Każda akcja rani.", "danger");
  if (raid.moves >= MAP.storm) return damage(MAP.stormDmg, "burza", "danger");
  return true;
}

// === SEKCJA: WYBÓR BRONI I PRZEŁĄCZANIE ORĘŻA ===
function getActiveWeaponObject() {
  save.equipped = save.equipped || { armor: null, ranged: null, ranged2: null, melee: null, activeWeapon: "ranged" };
  const choice = raid.autoFighting ? (raid.autoWeaponChoice || "ranged") : (raid.activeWeaponChoice || save.equipped.activeWeapon || "ranged");

  if (choice === "ranged2") {
    if (save.equipped.ranged2 && ITEMS[save.equipped.ranged2]) return ITEMS[save.equipped.ranged2];
  }
  if (choice === "ranged") {
    if (save.equipped.ranged && ITEMS[save.equipped.ranged]) return ITEMS[save.equipped.ranged];
    return bestWeapon(raid.bag);
  }
  if (choice === "melee") {
    if (save.equipped.melee && ITEMS[save.equipped.melee]) return ITEMS[save.equipped.melee];
    let bestMelee = FISTS;
    let bestAvg = 3;
    raid.bag.items.forEach((r) => {
      const it = ITEMS[r.id];
      if (it && it.type === "weapon" && !it.ammo) {
        const avg = (it.dmg[0] + it.dmg[1]) / 2;
        if (avg > bestAvg) {
          bestMelee = { ...it, id: r.id };
          bestAvg = avg;
        }
      }
    });
    return bestMelee;
  }
  return bestWeapon(raid.bag);
}

function switchWeaponChoice(newChoice) {
  if (raid.autoFighting) return log("Nie możesz zmieniać broni podczas auto-walki!", "warn");
  const curChoice = raid.activeWeaponChoice || save.equipped?.activeWeapon || "ranged";
  if (curChoice === newChoice) return;

  const isRangedToRanged = (curChoice === "ranged" && newChoice === "ranged2") || (curChoice === "ranged2" && newChoice === "ranged");

  raid.activeWeaponChoice = newChoice;
  save.equipped = save.equipped || {};
  save.equipped.activeWeapon = newChoice;
  writeSave(save);

  const w = getActiveWeaponObject();

  if (isRangedToRanged) {
    log(`[ZMIANA BRONI] Wyciąganie drugiej broni palnej (${w.name})... Akcja zajmuje 1 turę!`, "warn");
    render();
    enemyTurn();
  } else {
    log(`[ZMIANA BRONI] Szybkie przełączenie oręża na: ${w.name} (darmowa akcja).`, "tip");
    render();
  }
}

function move(id) {
  if (raid.searching) return;
  if (raid.enemy || raid.stealthMode || qteActive || raid.over || raid.repairing || raid.terminal) return;
  if (raid.choice) return;
  const gateNode = MAP.nodes[id];
  if (gateNode && gateNode.gate && !raid.flags["gate_" + id]) return openGate(id);
  if (!tick()) return;
  enterNode(id);
}

function enterNode(id) {
  raid.from = raid.node;
  // Pozycja na minimapie: nowy pokój leży o jeden krok w kierunku użytego klawisza
  raid.pos = raid.pos || {};
  const fromNode = MAP.nodes[raid.from];
  const slot = fromNode && fromNode.exits ? fromNode.exits.indexOf(id) : -1;
  if (slot >= 0 && raid.pos[raid.from] && !raid.pos[id]) {
    const p = raid.pos[raid.from];
    const d = MM_DIRS[slot];
    raid.pos[id] = { x: p.x + d[0], y: p.y + d[1] };
  }
  raid.node = id;
  raid.unnoticed = null;
  const node = MAP.nodes[id];
  const first = !raid.visited[id];
  raid.visited[id] = true;
  log(first ? `${node.name}: ${node.desc}` : `Wracasz: ${node.name}.`, "scene");
  if (node.choice) {
    raid.choice = id;
    log(node.choice.text, "tip");
  }
  if (!node.enemy && Math.random() < 0.15) rollNodeEvent(id);
  mountGround();

  computeShimmers();

  if (node.hazard && node.hazard.mask && countItem(raid.bag, node.hazard.mask) > 0) {
    log("Maska filtruje toksyczną mgłę.", "tip");
  } else if (node.hazard) {
    const immuneBonus = Math.max(0, (st.immunity || 0) * 0.01);
    const dmg = Math.max(1, Math.round(node.hazard.dmg * (1 - ((st.resist[node.hazard.type] || 0) + immuneBonus))));
    if (!damage(dmg, node.hazard.label)) return;
  }

  if (node.enemy && !raid.cleared[id] && node.enemy.boss) {
    startCombat(node.enemy.id);
    return render();
  }
  if (node.enemy && !raid.cleared[id]) {
    const effectiveChance = Math.max(0.05, node.enemy.chance * (1 - (st.stealth || 0) * 0.01));
    const noticed = Math.random() < effectiveChance;
    if (!noticed) {
      raid.unnoticed = { nodeId: id, enemyId: node.enemy.id };
      log(`[CISZA] ${ENEMIES[node.enemy.id]?.name || "Wróg"} jest w tym pokoju, ale cię nie zauważył. Pokój wciąż jest niebezpieczny.`, "tip");
    }
    if (noticed) {
      // 1. Szansa na opóźnioną wykrywalność (20%): cel patrzy w inną stronę
      if (Math.random() < 0.2) {
        raid.unawareTurns = 3;
        log(`[OPÓŹNIONA WYKRYWALNOŚĆ] Przeciwnik [${ENEMIES[node.enemy.id]?.name || node.enemy.id}] jest odwrócony plecami! Masz 3 tury wolnego działania zanim cię dostrzeże.`, "tip");
        edgeGlow("search");
        render();
        return;
      }

      // 2. Szansa na skradanie "W UKRYCIU" (35%):
      const sneakChance = Math.min(0.7, 0.35 + (st.stealth || 0) * 0.01);
      if (Math.random() < sneakChance) {
        triggerStealthMode(node.enemy.id);
        return;
      }

      // Standardowe natychmiastowe starcie
      startCombat(node.enemy.id);

      if (Math.random() * 100 < (st.intuition || 0)) {
        log("[INTUICJA] Szósty zmysł wyczuł wroga w cieniu! Wykonujesz atak wyprzedzający.", "tip");
        if (raid.enemy) {
          const surpriseDmg = randInt(4, 8);
          raid.enemy.hp = Math.max(0, raid.enemy.hp - surpriseDmg);
          log(`Cios wyprzedzający rani ${raid.enemy.name} za ${surpriseDmg} HP.`, "hit");
          if (raid.enemy.hp <= 0) return winCombat();
        }
      }
    }
  }
  render();
}

// === SEKCJA: ZAMKNIĘTE POMIESZCZENIA (karty dostępu) ===
// Pomieszczenie z keyLock jest zamknięte, dopóki save.openedRooms[keyLock] nie jest ustawione.
function roomLocked(node) {
  return !!(node && node.keyLock && !((save.openedRooms || {})[node.keyLock]));
}

// Otwiera pomieszczenie kartą z plecaka. Karta jest zużywana jednorazowo i znika.
function useKeycard() {
  const node = MAP.nodes[raid.node];
  if (!node || raid.over || !roomLocked(node)) return;
  const inst = raid.bag.items.find((i) => ITEMS[i.id] && ITEMS[i.id].keyFor === node.keyLock);
  if (!inst) return log(`Potrzebna: ${node.keyLabel || "karta dostępu"}.`, "warn");
  consumeInst(raid.bag, inst, 1);
  save.openedRooms = save.openedRooms || {};
  save.openedRooms[node.keyLock] = true;
  writeSave(save);
  log(`Karta zadziałała. ${node.name} jest otwarte. Karta zniknęła.`, "hit");
  edgeGlow("loot");
  render();
}

function search() {
  const node = MAP.nodes[raid.node];
  if (raid.enemy || raid.stealthMode || qteActive || raid.over || raid.searched[raid.node] || !node.loot) return;
  if (raid.searching) return;
  if (roomLocked(node)) return log("Drzwi są zamknięte. Potrzebna karta dostępu.", "warn");
  if (!tick("search")) return render();

  // Przeszukiwanie: bazowo 3 s, z rozwojem skilla Przeszukiwanie schodzi do 1 s (poziom 15)
  const sLvl = Math.min(15, (save.skills && save.skills.przeszukiwanie && save.skills.przeszukiwanie.level) || 0);
  const dur = Math.round(3000 - (sLvl / 15) * 2000);
  const nodeAtStart = raid.node;
  raid.searching = true;
  showSearchProgress(dur);
  render();
  setTimeout(() => {
    raid.searching = false;
    if (raid.over || raid.node !== nodeAtStart) return render();
    doSearch(nodeAtStart);
  }, dur);
}

// Nakładka przeszukiwania zajmuje cały panel "Ziemia"
function showSearchProgress(dur) {
  const panel = $("ground-panel");
  if (!panel) return;
  panel.querySelectorAll(".search-overlay").forEach((el) => el.remove());
  const ov = document.createElement("div");
  ov.className = "search-overlay";
  ov.style.setProperty("--sdur", `${dur}ms`);
  ov.innerHTML = '<span class="so-label">Przeszukujesz pomieszczenie...</span><div class="so-track"><div class="so-fill"></div><div class="so-scan"></div></div>';
  panel.appendChild(ov);
  const fill = ov.querySelector(".so-fill");
  requestAnimationFrame(() => {
    fill.style.transition = `width ${dur}ms linear`;
    fill.style.width = "100%";
  });
  setTimeout(() => ov.remove(), dur + 60);
}

function doSearch(nodeId) {
  const node = MAP.nodes[nodeId];
  if (!node) return;
  raid.searched[nodeId] = true;

  if (typeof grantSkillXp === "function") {
    grantSkillXp(save, "przeszukiwanie", 15);
    grantSkillXp(save, "percepcja", 10);
    writeSave(save);
  }

  const found = rollLoot(node.loot.table, node.loot.rolls);
  (node.guaranteed || []).forEach(([id, q]) => found.push({ id, qty: q }));

  if (st.bonusLootChance && Math.random() < st.bonusLootChance) {
    const bonus = rollLoot(node.loot.table, 1);
    if (bonus.length) {
      found.push(...bonus);
      log(`[SZCZĘŚCIE] Wysoki współczynnik szczęścia (${Math.round(st.luck)}%) ujawnił ukrytą skrytkę z zaopatrzeniem!`, "tip");
    }
  }

  if (node.codeChance && Math.random() < node.codeChance) {
    found.push({ id: "access_code", qty: 1 });
    log("W szufladzie znajdujesz kod dostępu!", "tip");
  }
  addGround(nodeId, found);
  log(`Przeszukujesz: ${node.name}. Znalezione: ${found.map((r) => ITEMS[r.id]?.name || r.id).join(", ") || "nic"}.`);
  edgeGlow("search");
  tip("loot");
  mountGround();
  render();
}

function mineNode() {
  const node = MAP.nodes[raid.node];
  if (!node || !node.mine || raid.enemy || raid.stealthMode || qteActive || raid.over) return;
  if (raid.mined && raid.mined[raid.node]) return log("Złoże zostało już w pełni wyeksploatowane.", "warn");

  const gloveInst = raid.bag.items.find((i) => i.id === "mining_glove");
  if (!gloveInst) {
    return log("Wymagana Rękawica Wydobywcza (Chwytak Plazmowy) w plecaku!", "warn");
  }

  gloveInst.uses = (gloveInst.uses !== undefined ? gloveInst.uses : 5) - 1;
  log(`[RĘKAWICA WYDOBYWCZA] Użyto chwytaka plazmowego. Pozostało użyć: ${gloveInst.uses}/5.`, "tip");

  if (gloveInst.uses <= 0) {
    removeById(raid.bag, "mining_glove", 1);
    log("[SPRZĘT] Rękawica Wydobywcza uległa całkowitemu zużyciu!", "danger");
  }

  raid.mined = raid.mined || {};
  raid.mined[raid.node] = true;

  const minable = node.mine;
  const qty = randInt(1, minable.qty || 2);
  addGround(raid.node, [{ id: minable.type, qty }]);

  if (typeof grantSkillXp === "function") {
    grantSkillXp(save, "inzynieria", 25);
    grantSkillXp(save, "sila", 15);
    writeSave(save);
  }

  log(`[WYDOBYCIE SUKCES] Wydobyto: ${ITEMS[minable.type]?.name || minable.type} x${qty}!`, "hit");
  edgeGlow("tech");
  mountGround();
  render();
}

// === SEKCJA: W UKRYCIU ===
// Czerwony węzeł = w tym pokoju na 100% jest żywy wróg. Liczone od nowa przy każdym renderze.
function computeShimmers() {
  const node = MAP.nodes[raid.node];
  raid.nodeShimmers = {};
  if (!node) return;
  node.exits.forEach((exitId) => {
    const exNode = exitId && MAP.nodes[exitId];
    if (!exNode) return;
    const isEnemyPresent = exNode.enemy && !raid.cleared[exitId];
    if (isEnemyPresent) {
      raid.nodeShimmers[exitId] = "node-shimmer-danger";
    } else if (exNode.guaranteed || (exNode.loot && (exNode.loot.table === "titan_vault" || exNode.loot.table === "electronics"))) {
      if (st.intuition > 5 || st.luck > 5) raid.nodeShimmers[exitId] = "node-shimmer-valuable";
    } else if (exNode.mine && (!raid.mined || !raid.mined[exitId])) {
      raid.nodeShimmers[exitId] = "node-shimmer-mine";
    }
  });
}

// Atak na wroga, który jeszcze nie zauważył gracza (przycisk na slocie 9)
function unnoticedHere() {
  return !!(raid.unnoticed && raid.unnoticed.nodeId === raid.node && !raid.cleared[raid.node] && !raid.enemy && !raid.stealthMode);
}

function unnoticedAttack() {
  if (!unnoticedHere()) return;
  const enemyId = raid.unnoticed.enemyId;
  raid.unnoticed = null;
  raid.stealthMode = { enemyId, e: ENEMIES[enemyId] };
  log(`[ATAK Z UKRYCIA] ${ENEMIES[enemyId]?.name || "Wróg"} nie widzi cię. Próbujesz zaskoczyć go od tyłu.`, "tip");
  stealthAttack();
}

// Błysk "ZWYCIĘSTWO" trwający około sekundy
function flashWin() {
  const el = $("win-flash");
  if (!el) return;
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
}

// Przełącza widok: normalny (ziemia + plecak) / walka (UI walki) / plecak w walce
function isCombatNow() {
  return !!(raid && (raid.enemy || qteActive || raid.stealthMode));
}

function syncUiMode() {
  const combat = isCombatNow();
  if (!combat) combatBagOpen = false;
  const mode = !combat ? "normal" : combatBagOpen ? "bag" : "combat";
  if (mode === uiMode) return;
  uiMode = mode;
  const invWrap = $("inv-wrap");
  const cu = $("combat-ui");
  const back = $("bag-back-btn");
  if (!invWrap || !cu) return;
  invWrap.style.display = mode === "combat" ? "none" : "";
  cu.style.display = mode === "combat" ? "" : "none";
  back.style.display = mode === "bag" ? "" : "none";
  const entering = mode === "combat" ? cu : invWrap;
  const cls = mode === "combat" ? "combat-enter" : "normal-enter";
  entering.classList.remove("combat-enter", "normal-enter");
  void entering.offsetWidth;
  entering.classList.add(cls);
}

function triggerStealthMode(enemyId) {
  const e = ENEMIES[enemyId];
  raid.stealthMode = { enemyId, e };
  if (raid.isNight) log("[NOC] Ciemność ułatwia ukrycie: cichy atak ma większą szansę.", "tip");
  log(`[W UKRYCIU] Wstrzymujesz oddech w cieniu... Wykrywasz cel: ${e.name}! Wróg jeszcze cię nie dostrzegł.`, "tip");
  edgeGlow("search");
  render();
}

function stealthBypass() {
  if (!raid.stealthMode) return;
  const e = raid.stealthMode.e;
  log(`[CICHY ODWROT] Ostrożnie omijasz ${e.name} i wycofujesz się za osłonę.`, "scene");
  raid.stealthMode = null;
  render();
}

function stealthAttack() {
  if (!raid.stealthMode) return;
  const enemyId = raid.stealthMode.enemyId;
  const eDef = ENEMIES[enemyId];
  raid.stealthMode = null;

  const isSneakSuccess = Math.random() < (raid.isNight ? 0.8 : 0.65);
  const w = bestWeapon(raid.bag);

  if (isSneakSuccess) {
    let baseDmg = randInt(w.dmg[0], w.dmg[1]);
    if (!w.ammo) baseDmg = Math.round(baseDmg * st.meleeMult);
    else baseDmg = Math.round(baseDmg * 1.1); // broń palna +10%
    const sneakDmg = Math.round(baseDmg * 2.5);

    log(`[ATAK W UKRYCIU (SUKCES)] Cichy cios z cienia! ${w.name}: dewastujące uderzenie za ${sneakDmg} HP w ${eDef.name}!`, "hit");
    edgeGlow("hit");

    if (sneakDmg >= eDef.hp) {
      raid.kills++;
      raid.flags["kill_" + enemyId] = true;
      const xp = Math.round(eDef.xp * st.xpMult * 1.25);
      log(`Cichy atak natychmiast zlikwidował ${eDef.name}! +${xp} XP.`, "hit");
      raid.xp += xp;
      raid.cleared[raid.node] = true;
      addGround(raid.node, rollLoot(eDef.loot, eDef.rolls));
      mountGround();
      flashWin();
      render();
      return;
    }

    startCombat(enemyId);
    if (raid.enemy) {
      raid.enemy.hp = Math.max(1, raid.enemy.hp - sneakDmg);
      log(`${raid.enemy.name} jest zszokowany ciosem z zaskoczenia (${raid.enemy.hp}/${raid.enemy.maxHp} HP)!`, "warn");
    }
    render();
  } else {
    log(`[WYKRYCIE!] Porażka skradania! ${eDef.name} usłyszał twój krok i kontratakuje!`, "danger");
    edgeGlow("danger");
    startCombat(enemyId);
    enemyTurn();
  }
}

// === SEKCJA: WALKA & QTE SZYBKA REAKCJA ===
// Mnożniki siły wrogów wg poziomu mapy
const DIFF_MULT = { 0: 0.8, 1: 1, 2: 1.25, 3: 1.55, 4: 1.9 };
// Trudność może być ułamkowa (np. 3.5): mnożnik to średnia z sąsiednich poziomów
// Szansa na QTE: 15% bazowo, +35% gdy HP poniżej 50%
function qteChance() {
  return 0.15 * (raid.hp < save.maxHp * 0.5 ? 1.35 : 1);
}

function diffMultFor(t) {
  const a = Math.floor(t);
  const b = Math.ceil(t);
  const ma = DIFF_MULT[a] ?? 1;
  const mb = DIFF_MULT[b] ?? ma;
  return a === b ? ma : (ma + mb) / 2;
}

function startCombat(enemyId) {
  const e = ENEMIES[enemyId];
  const k = diffMultFor(typeof MAP !== "undefined" && MAP && MAP.tier != null ? MAP.tier : 1);
  const hp = Math.round(e.hp * k);
  const dmg = Array.isArray(e.dmg) ? e.dmg.map((x) => Math.round(x * k)) : e.dmg;
  raid.enemy = { id: enemyId, ...e, hp, maxHp: hp, dmg };
  log(`${e.name} atakuje! (${e.hp} HP)`, "danger");
  edgeGlow("danger");
  tip("combat");
}

let qteLoopInterval = null;

function triggerQTE(type, onSuccess, onFail) {
  if (raid.autoFighting) {
    raid.autoFightPaused = true;
    if (autoFightStepTimeout) clearTimeout(autoFightStepTimeout);
  }

  if (qteTimer) clearTimeout(qteTimer);
  if (qteLoopInterval) clearInterval(qteLoopInterval);

  const modeRoll = Math.random();
  let mode = "single";
  if (modeRoll < 0.35) mode = "timing";
  else if (modeRoll < 0.65) mode = "sequence";
  else if (modeRoll < 0.82) mode = "parry";
  else mode = "single";

  const keyPool = [
    { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" },
    { code: "KeyL", label: "L" },
    { code: "KeyE", label: "E" },
    { code: "KeyA", label: "A" },
    { code: "KeyD", label: "D" },
    { code: "Space", label: "SPACJA" }
  ];

  if (mode === "timing") {
    const duration = 2800;
    qteActive = {
      mode: "timing",
      type,
      needlePos: 0,
      dir: 1,
      targetMin: 55,
      targetMax: 80,
      label: "SPACJA",
      code: "Space",
      expiresAt: Date.now() + duration,
      onSuccess,
      onFail
    };

    qteLoopInterval = setInterval(() => {
      if (!qteActive || qteActive.mode !== "timing") {
        if (qteLoopInterval) clearInterval(qteLoopInterval);
        return;
      }
      qteActive.needlePos += qteActive.dir * 4.5;
      if (qteActive.needlePos >= 100) {
        qteActive.needlePos = 100;
        qteActive.dir = -1;
      } else if (qteActive.needlePos <= 0) {
        qteActive.needlePos = 0;
        qteActive.dir = 1;
      }
      const needleEl = $("qte-needle");
      if (needleEl) needleEl.style.left = `${qteActive.needlePos}%`;
    }, 20);

    qteTimer = setTimeout(() => {
      if (qteActive && qteActive.mode === "timing") {
        resolveQTE(false, "[PRZEKROCZENIE CZASU!] Błąd wyczucia momentu.");
      }
    }, duration);

    log(`[OKIENKO CZASOWE // QTE] Wciśnij [SPACJA] lub kliknij dokładnie w ZIELONYM POLU! (Nie za wcześnie, nie za późno!)`, "danger");
  } else if (mode === "sequence") {
    const seqCount = Math.random() < 0.5 ? 2 : 3;
    const shuffled = [...keyPool].sort(() => Math.random() - 0.5);
    const seq = shuffled.slice(0, seqCount);
    const duration = seqCount === 2 ? 2600 : 3400;

    qteActive = {
      mode: "sequence",
      type,
      seq,
      step: 0,
      expiresAt: Date.now() + duration,
      onSuccess,
      onFail
    };

    qteTimer = setTimeout(() => {
      if (qteActive && qteActive.mode === "sequence") {
        resolveQTE(false, "[CZAS UPŁYNĄŁ!] Nie ukończono sekwencji klawiszy na czas.");
      }
    }, duration);

    log(`[KOMBO SEKWENCJA // QTE] Wciśnij ${seqCount} przyciski po kolei: ${seq.map((s) => `[${s.label}]`).join(" ➔ ")}!`, "danger");
  } else if (mode === "parry") {
    const dirKeys = [
      { code: "KeyW", label: "▲ W (GÓRA)" },
      { code: "KeyA", label: "◄ A (LEWO)" },
      { code: "KeyS", label: "▼ S (DÓŁ)" },
      { code: "KeyD", label: "► D (PRAWO)" }
    ];
    const choice = dirKeys[Math.floor(Math.random() * dirKeys.length)];
    const duration = 2200;

    qteActive = {
      mode: "parry",
      type,
      choice,
      code: choice.code,
      label: choice.label,
      expiresAt: Date.now() + duration,
      onSuccess,
      onFail
    };

    qteTimer = setTimeout(() => {
      if (qteActive && qteActive.mode === "parry") {
        resolveQTE(false, "[BRAK REAKCJI!] Nie sparowano ataku z danego kierunku.");
      }
    }, duration);

    log(`[PAROWANIE // QTE] Cios wroga z kierunku! SPARUJ KLAWISZEM: [${choice.label}]!`, "danger");
  } else {
    const choice = keyPool[Math.floor(Math.random() * keyPool.length)];
    const duration = 2400;

    qteActive = {
      mode: "single",
      type,
      code: choice.code,
      label: choice.label,
      expiresAt: Date.now() + duration,
      onSuccess,
      onFail
    };

    qteTimer = setTimeout(() => {
      if (qteActive && qteActive.mode === "single") {
        resolveQTE(false, "[ZA WOLNO!] Reakcja spóźniona.");
      }
    }, duration);

    log(`[SZYBKA REAKCJA // QTE] SZYBKO! WCIŚNIJ [${choice.label}]!`, "danger");
  }

  edgeGlow("danger");
  render();
}

function triggerTimingClick() {
  if (!qteActive || qteActive.mode !== "timing") return;
  const pos = qteActive.needlePos;
  if (pos >= qteActive.targetMin && pos <= qteActive.targetMax) {
    resolveQTE(true, `[PERFEKCYJNE WYCZUCIE CZASU!] Trafienie idealnie w dziesiątkę (${Math.round(pos)}%)!`);
  } else if (pos < qteActive.targetMin) {
    resolveQTE(false, `[ZA WCZEŚNIE!] Błąd timingu (${Math.round(pos)}% < ${qteActive.targetMin}%).`);
  } else {
    resolveQTE(false, `[ZA PÓŹNO!] Błąd timingu (${Math.round(pos)}% > ${qteActive.targetMax}%).`);
  }
}

function resolveQTE(success, customMsg = "") {
  if (!qteActive) return;
  const qte = qteActive;
  qteActive = null;
  if (qteTimer) clearTimeout(qteTimer);
  if (qteLoopInterval) clearInterval(qteLoopInterval);

  if (success) {
    const msg = customMsg || `[PERFEKCYJNA REAKCJA!] Sukces QTE!`;
    log(msg, "hit");
    edgeGlow("hit");
    qte.onSuccess();
  } else {
    const msg = customMsg || `[PORAŻKA REAKCJI!] Błąd w QTE.`;
    log(msg, "danger");
    edgeGlow("hurt");
    qte.onFail();
  }

  render();

  if (raid.autoFighting && raid.autoFightPaused && !raid.over && raid.enemy) {
    raid.autoFightPaused = false;
    autoFightStepTimeout = setTimeout(stepAutoFight, 600);
  }
}

function attack() {
  if (!raid.enemy || qteActive || raid.over || raid.searching) return;

  // Broń palna bez amunicji w plecaku nie strzela (wcześniej strzelała bez końca)
  const wAmmo = getActiveWeaponObject();
  if (wAmmo.ammo && countItem(raid.bag, wAmmo.ammo) < 1) {
    return log(`Brak amunicji (${ITEMS[wAmmo.ammo]?.name || wAmmo.ammo}) w plecaku. Przełącz na broń białą.`, "warn");
  }

  nutritionTurn("fight");

  // Szansa na wyzwolenie QTE (15%)
  if (Math.random() < qteChance()) {
    const qteType = Math.random() < 0.5 ? "dodge" : "strike";
    triggerQTE(
      qteType,
      () => {
        if (qteType === "dodge") {
          log("[QTE UNIK!] Błyskawiczny unik! Unikasz ciosu i zadajesz +25 HP cios kontrujący!", "hit");
          if (raid.enemy) {
            raid.enemy.hp = Math.max(0, raid.enemy.hp - 25);
            if (raid.enemy.hp <= 0) return winCombat();
          }
        } else {
          log("[QTE CIOS!] Perfekcyjne cięcie krytyczne za +35 HP!", "hit");
          if (raid.enemy) {
            raid.enemy.hp = Math.max(0, raid.enemy.hp - 35);
            if (raid.enemy.hp <= 0) return winCombat();
          }
        }
        enemyTurn();
      },
      () => {
        log("[QTE SPÓŹNIENIE!] Pudłujesz i otrzymujesz +8 dodatkowych obrażeń!", "danger");
        damage(8, "spóźniony unik");
        enemyTurn();
      }
    );
    return;
  }

  const w = getActiveWeaponObject();
  const e = raid.enemy;

  if (w.ammo) {
    if (st.scavenger && Math.random() * 100 < st.scavenger) {
      log(`[SCAVENGER] Zaoszczędzono amunicję (${w.name})!`, "tip");
    } else {
      removeById(raid.bag, w.ammo, 1);
    }
    if (typeof grantSkillXp === "function") grantSkillXp(save, "bronPalna", 12);
  } else {
    if (typeof grantSkillXp === "function") grantSkillXp(save, "sila", 12);
  }
  writeSave(save);

  raid.noise = (raid.noise || 0) + (w.ammo ? 2 : 1);
  let acc = w.acc * (w.ammo ? st.rangedAcc : 1);
  if (save.globalBuffs && save.globalBuffs.saturnCola) acc += 0.1;

  if (Math.random() < acc) {
    let dmg = randInt(w.dmg[0], w.dmg[1]);
    if (!w.ammo) dmg = Math.round(dmg * st.meleeMult);
    else dmg = Math.round(dmg * 1.1); // broń palna +10%

    if (raid.hp <= save.maxHp * 0.35 && st.adrenaline > 0) {
      dmg = Math.round(dmg * (1 + st.adrenaline * 0.01));
      if (save.globalBuffs?.adrenalina > 0) dmg = Math.round(dmg * 1.25);
      log(`[ADRENALINA] Furia niskiego HP (+${Math.round(st.adrenaline)}% obrażeń)!`, "tip");
    }

    let critBase = st.critChance || 5;
    if (save.globalBuffs && save.globalBuffs.saturnCola) critBase += 15;

    const isCrit = Math.random() * 100 < critBase;
    if (isCrit) {
      dmg = Math.round(dmg * 1.75);
      log(`[KRYTYK!] ${w.name}: trafienie krytyczne za ${dmg} w ${e.name}!`, "hit");
    } else {
      log(`${w.name}: trafiasz ${e.name} za ${dmg}.`, "hit");
    }

    e.hp = Math.max(0, e.hp - dmg);
    edgeGlow("hit");
  } else {
    log(`${w.name}: pudło.`, "miss");
  }

  if (e.hp <= 0) return winCombat();
  enemyTurn();
}

function enemyTurn() {
  const e = raid.enemy;
  if (!e || raid.over) return;

  e.turns = (e.turns || 0) + 1;
  if (e.boss && !e.enraged && e.hp <= e.maxHp * 0.6) {
    e.enraged = true;
    log("Matka wpada w szał – uderza mocniej i częściej!", "danger");
    edgeGlow("danger");
  }
  if (e.boss && e.turns % 3 === 0) return bossAcidAttack(e);

  if (Math.random() < e.acc + (e.enraged ? 0.1 : 0)) {
    const armor = bestArmor(raid.bag);
    const activeEffs = typeof getActiveBodyEffects === "function" ? getActiveBodyEffects(save) : [];
    const bruiseCount = activeEffs.filter((ef) => ef.effId === "siniak").length;
    const dmgMult = 1 + bruiseCount * 0.03;

    const domeMult = params.get("map") === "titan_dome" ? 0.8 : 1; // Kopuła Tytana: wrogowie -20% obrażeń
    const dmg = Math.max(1, Math.round((randInt(e.dmg[0], e.dmg[1]) - (armor ? armor.def : 0)) * dmgMult * domeMult * (e.enraged ? 1.3 : 1) * (save.globalBuffs?.znieczulenie > 0 ? 0.7 : 1)));
    log(`${e.name} ${e.verb}.`, "enemy");

    // Losowanie trafionej kończyny
    const roll = Math.random();
    let hitLimb = "torso";
    if (roll < 0.1) hitLimb = "head";
    else if (roll < 0.55) hitLimb = "torso";
    else if (roll < 0.75) hitLimb = Math.random() < 0.5 ? "left_arm" : "right_arm";
    else hitLimb = Math.random() < 0.5 ? "left_leg" : "right_leg";

    if (typeof applyDamageToPart === "function") {
      applyDamageToPart(save, hitLimb, dmg, e.statusOnHit);
    }

    if (e.strain === "pustka" && typeof applyDamageToPart === "function") {
      applyDamageToPart(save, hitLimb, 0, { type: "szept", chance: 0.2 });
    }
    damage(dmg, e.name);
  } else {
    log(`${e.name} chybia.`, "miss");
  }
  render();
}

function autoFight() {
  if (raid.enemy && raid.enemy.boss) return log("Z bossem nie ma auto-walki.", "warn");
  if (!raid.enemy || raid.over) return;
  raid.usedAutoFight = true;
  raid.autoFighting = true;
  raid.autoFightPaused = false;
  raid.autoWeaponChoice = raid.activeWeaponChoice || save.equipped?.activeWeapon || "ranged";
  stepAutoFight();
}

// Czy przedmiot coś da TERAZ: leczy, bo gracz nie ma pełnego HP, albo leczy efekt, który gracz ma na ciele
function bodyHasStatus(effId) {
  const b = save.body;
  if (!b) return false;
  return Object.values(b).some((p) => p && Array.isArray(p.status) && p.status.includes(effId));
}

function itemUsefulNow(it) {
  if (!it) return false;
  if (it.heal && raid.hp < save.maxHp) return true;
  if (it.cures && it.cures.some(bodyHasStatus)) return true;
  if ((it.hunger && save.hunger < 100) || (it.thirst && save.thirst < 100)) return true;
  return false;
}

function stepAutoFight() {
  if (!raid.enemy || raid.over || !raid.autoFighting || raid.autoFightPaused) return;

  // QTE w auto-walce
  if (Math.random() < qteChance()) {
    const qteType = Math.random() < 0.5 ? "dodge" : "strike";
    triggerQTE(
      qteType,
      () => {
        if (qteType === "dodge") {
          log("[AUTO-WALKA / QTE UNIK!] Szybki unik! Kontra za +25 HP!", "hit");
          if (raid.enemy) {
            raid.enemy.hp = Math.max(0, raid.enemy.hp - 25);
            if (raid.enemy.hp <= 0) return winCombat();
          }
        } else {
          log("[AUTO-WALKA / QTE CIOS!] Perfekcyjny krytyk za +35 HP!", "hit");
          if (raid.enemy) {
            raid.enemy.hp = Math.max(0, raid.enemy.hp - 35);
            if (raid.enemy.hp <= 0) return winCombat();
          }
        }
      },
      () => {
        log("[AUTO-WALKA / QTE BLĄD] Błąd reakcji! +8 obrażeń!", "danger");
        damage(8, "spóźniony unik");
      }
    );
    return; // Pauzuje auto-pętlę
  }

  // Automatyczne leczenie w stanie zagrożenia życia
  const needHeal = raid.hp <= save.maxHp * 0.38;
  const needCure = Object.values(save.body || {}).some((p) => p && Array.isArray(p.status) && p.status.length > 0);
  if (needHeal || needCure) {
    const healInst = raid.bag.items.find((i) => ITEMS[i.id] && itemUsefulNow(ITEMS[i.id]) && (needHeal || (ITEMS[i.id].cures && ITEMS[i.id].cures.some(bodyHasStatus))));
    if (healInst) {
      const qty0 = healInst.qty;
      useInst(healInst);
      const consumed = healInst.qty !== qty0 || !raid.bag.items.includes(healInst);
      // Jeśli przedmiot nic nie dał (nic nie zużyto), nie powtarzaj go w pętli - przejdź do ataku
      if (consumed) {
        if (raid.enemy && !raid.over && raid.autoFighting && !raid.autoFightPaused) {
          autoFightStepTimeout = setTimeout(stepAutoFight, 400);
        }
        return;
      }
    }
  }

  const wCheck = getActiveWeaponObject();
  if (wCheck.ammo && countItem(raid.bag, wCheck.ammo) < 1) {
    raid.autoWeaponChoice = "melee";
    log("[AUTO-WALKA] Skończyła się amunicja. Przechodzę na broń białą.", "warn");
    autoFightStepTimeout = setTimeout(stepAutoFight, 400);
    return;
  }
  const w = getActiveWeaponObject();
  const e = raid.enemy;

  if (w.ammo) {
    if (st.scavenger && Math.random() * 100 < st.scavenger) {
      log(`[SCAVENGER] Zaoszczędzono amunicję!`, "tip");
    } else {
      removeById(raid.bag, w.ammo, 1);
    }
    if (typeof grantSkillXp === "function") grantSkillXp(save, "bronPalna", 12);
  } else {
    if (typeof grantSkillXp === "function") grantSkillXp(save, "sila", 12);
  }
  writeSave(save);

  let acc = w.acc * (w.ammo ? st.rangedAcc : 1);
  if (save.globalBuffs && save.globalBuffs.saturnCola) acc += 0.1;

  if (Math.random() < acc) {
    let dmg = randInt(w.dmg[0], w.dmg[1]);
    if (!w.ammo) dmg = Math.round(dmg * st.meleeMult);
    else dmg = Math.round(dmg * 1.1); // broń palna +10%

    if (raid.hp <= save.maxHp * 0.35 && st.adrenaline > 0) {
      dmg = Math.round(dmg * (1 + st.adrenaline * 0.01));
      if (save.globalBuffs?.adrenalina > 0) dmg = Math.round(dmg * 1.25);
    }

    let critBase = st.critChance || 5;
    if (save.globalBuffs && save.globalBuffs.saturnCola) critBase += 15;

    const isCrit = Math.random() * 100 < critBase;
    if (isCrit) {
      dmg = Math.round(dmg * 1.75);
      log(`[AUTO-WALKA / KRYTYK!] ${w.name}: trafienie za ${dmg} HP!`, "hit");
    } else {
      log(`[AUTO-WALKA] ${w.name}: trafiasz ${e.name} za ${dmg}.`, "hit");
    }

    e.hp = Math.max(0, e.hp - dmg);
    edgeGlow("hit");
  } else {
    log(`[AUTO-WALKA] ${w.name}: pudło.`, "miss");
  }

  if (e.hp <= 0) return winCombat();

  enemyTurn();

  if (raid.enemy && !raid.over && raid.autoFighting && !raid.autoFightPaused) {
    autoFightStepTimeout = setTimeout(stepAutoFight, 400);
  }
}

function winCombat() {
  const e = raid.enemy;
  raid.autoFighting = false;
  raid.autoFightPaused = false;
  raid.kills++;

  let xp = Math.round(e.xp * st.xpMult);
  if (raid.usedAutoFight) {
    xp = Math.max(1, Math.round(xp * 0.95));
    log(`${e.name} pokonany w trybie auto-walki! +${xp} XP.`, "hit");
    raid.usedAutoFight = false;
  } else {
    log(`${e.name} pokonany. +${xp} XP.`, "hit");
  }

  raid.xp += xp;
  raid.cleared[raid.node] = true;
  addGround(raid.node, rollLoot(e.loot, e.rolls));
  raid.enemy = null;
  edgeGlow("hit");
  mountGround();
  flashWin();
  render();
  // Każde zabójstwo liczy się do zleceń (save.kills po udanej ewakuacji), nie tylko bossy
  raid.flags["kill_" + e.id] = true;
}

function flee() {
  if (raid.enemy && raid.enemy.boss) return log("Matki Archiwum nie da się zgubić. Walcz!", "warn");
  if (!raid.enemy || qteActive || raid.over) return;
  raid.autoFighting = false;
  if (typeof grantSkillXp === "function") {
    grantSkillXp(save, "wytrzymalosc", 15);
    writeSave(save);
  }
  const chance = Math.max(0.15, 0.55 + st.fleeMod + (st.stealth || 0) * 0.005);
  if (Math.random() < chance) {
    const back = MAP.nodes[raid.node].exits.find(Boolean);
    log("Udaje ci się uciec i zerwać kontakt wzrokowy.", "scene");
    raid.enemy = null;
    if (tick()) enterNode(back);
  } else {
    log("Ucieczka nieudana! Wróg zablokował ci drogę.", "warn");
    enemyTurn();
  }
}

function healWith(id) {
  const inst = raid.bag.items.find((i) => i.id === id);
  if (inst) useInst(inst);
}

function useInst(inst) {
  const it = ITEMS[inst.id];
  if (!it || raid.over) return;
  if (it.unpackAmmo) {
    const drops = unpackAmmoCrate();
    consumeInst(raid.bag, inst, 1);
    addGround(raid.node, drops);
    log(`${it.name}: ${drops.map((d) => `${ITEMS[d.id].name} x${d.qty}`).join(", ")} (leżą na ziemi).`, "hit");
    return render();
  }
  if (it.skillDoc) {
    const sid = applySkillDoc(save, it.skillDoc);
    consumeInst(raid.bag, inst, 1);
    writeSave(save);
    log(sid ? `${it.name}: +${it.skillDoc} poziomy w umiejętności „${(SKILLS[sid] || {}).name || sid}”.` : "Nie ma już umiejętności do rozwinięcia.", "hit");
    return render();
  }

  let curedMsg = null;
  if (typeof cureBodyEffect === "function") {
    curedMsg = cureBodyEffect(save, inst.id);
  }

  let healed = 0;
  if (it.heal && raid.hp < save.maxHp) {
    healed = Math.min(it.heal, save.maxHp - raid.hp);
    raid.hp += healed;
  }

  if (it.buff) {
    save.globalBuffs = save.globalBuffs || {};
    save.globalBuffs[it.buff] = it.buffDuration || 5;
  }
  let fedMsg = null;
  if (it.hunger && save.hunger < 100) {
    save.hunger = Math.min(100, save.hunger + it.hunger);
    fedMsg = `Głód +${it.hunger}%`;
  }
  if (it.thirst && save.thirst < 100) {
    save.thirst = Math.min(100, save.thirst + it.thirst);
    fedMsg = fedMsg ? `${fedMsg}, pragnienie +${it.thirst}%` : `Pragnienie +${it.thirst}%`;
  }
  if (!healed && !curedMsg && !it.buff && !fedMsg) return log("Brak potrzeby użycia tego medykamentu.", "warn");
  if (fedMsg) log(`${it.name}: ${fedMsg}.`, "hit");

  if (typeof grantSkillXp === "function") {
    grantSkillXp(save, "medycyna", 15);
    writeSave(save);
  }

  consumeInst(raid.bag, inst, 1);
  let summaryText = `${it.name}: `;
  if (healed) summaryText += `+${healed} HP. `;
  if (curedMsg) summaryText += `${curedMsg}. `;
  if (it.buff) summaryText += `${BUFF_LABEL[it.buff] || it.buff} przez ${it.buffDuration} tur.`;
  log(summaryText, "hit");
  edgeGlow("heal");

  if (raid.enemy) enemyTurn();
  else render();
}

// === SEKCJA: NAPRAWA SILNIKA ===
function startRepair() {
  const R = MAP.repair;
  if (!R || raid.enemy || raid.over) return;
  const missing = R.parts.filter((p) => countItem(raid.bag, p) < 1);
  if (missing.length) return log(`Brakuje części: ${missing.map((p) => ITEMS[p]?.name || p).join(", ")}.`, "warn");
  if (countItem(raid.bag, R.manual) < 1) return log("Brak Instrukcji serwisowej w plecaku.", "warn");
  const order = R.steps.map((_, i) => i).sort(() => Math.random() - 0.5);
  raid.repairing = { progress: 0, order };
  log("Terminal naprawy aktywny. Wykonaj kroki w kolejności z instrukcji.", "tip");
  edgeGlow("tech");
  render();
}

function repairStep(i) {
  const rp = raid.repairing;
  if (!rp) return;
  const R = MAP.repair;
  if (i === rp.progress) {
    rp.progress++;
    log(`OK: ${R.steps[i]}.`, "hit");
    edgeGlow("tech");
    if (rp.progress === R.steps.length) return finishRepair();
  } else {
    rp.progress = 0;
    log("Błąd sekwencji. Zresetowano - sprawdź instrukcję.", "danger");
    edgeGlow("hurt");
  }
  render();
}

function cancelRepair() {
  raid.repairing = null;
  render();
}

function finishRepair() {
  MAP.repair.parts.forEach((p) => removeById(raid.bag, p, 1));
  raid.flags.engineFixed = true;
  raid.repairing = null;
  raid.xp += 30;
  log("Silnik działa! Statek jest gotowy do startu. +30 XP.", "hit");
  edgeGlow("extract");
  tip("extract");
  render();
}

// === SEKCJA: KONIEC RAJDU ===
// Stan ewakuacji na mapie: dźwignia + minimalna liczba tur (samouczek jest wyjątkiem)
function evacStatus() {
  if (!MAP || MAP.tutorial || !MAP.evac) return { ok: true, text: "" };
  if (!raid.evacOpen) return { ok: false, text: "uruchom dźwignię ewakuacji" };
  const left = Math.max(0, MAP.evac.minTurns - (raid.moves || 0));
  if (left > 0) return { ok: false, text: `poczekaj jeszcze ${left} tur` };
  return { ok: true, text: "" };
}

function pullEvacLever() {
  if (!MAP.evac || raid.enemy || raid.over || raid.searching || raid.evacOpen) return;
  raid.evacOpen = true;
  log(`[DŹWIGNIA] Ewakuacja uruchomiona. Wyjście będzie dostępne po ${MAP.evac.minTurns} turach.`, "tip");
  render();
}

function extract() {
  const node = MAP.nodes[raid.node];
  if (!node.extract || raid.enemy || raid.over) return;
  const ev = evacStatus();
  if (!ev.ok) return log(`Ewakuacja niedostępna: ${ev.text}.`, "warn");
  if (node.extractRequires && !raid.flags[node.extractRequires]) {
    return log(`Ewakuacja niedostępna: ${EXTRACT_LOCK_TEXT[node.extractRequires] || "wykonaj wymagany krok"}.`, "warn");
  }

  if (MAP.tutorial) {
    const targetModId = save.tutorialModule || (save.module === "Crafting" ? "Medstation" : "Crafting");
    const modDef = typeof SHIP_MODULES !== "undefined" ? SHIP_MODULES.find((m) => m.id === targetModId) : null;
    const reqs = modDef?.levels[1]?.items || [];
    const missing = reqs.filter(([id, qty]) => countItem(raid.bag, id) < qty);
    if (missing.length > 0) {
      const missingText = missing
        .map(([id, qty]) => {
          const name = ITEMS[id]?.name || id;
          const have = countItem(raid.bag, id);
          return `${name} (${have}/${qty})`;
        })
        .join(", ");
      return log(`[TUTORIAL] Ewakuacja zablokowana! Musisz najpierw zebrać materiały do rozbudowy modułu ${modDef?.name || targetModId}: ${missingText}.`, "warn");
    }
  }

  raid.over = true;
  log("Ewakuacja.", "scene");
  edgeGlow("extract");
  finish(true);
}

function die() {
  raid.over = true;
  raid.enemy = null;
  log("Giniesz.", "danger");
  finish(false);
}

function finish(success) {
  clearRaidSnap();
  save.activeRaid = false;
  const tutorialFail = !success && MAP.tutorial;
  let ups = 0;
  if (!tutorialFail) {
    save.hp = success ? raid.hp : Math.ceil(save.maxHp * 0.5);
    ups = grantXp(save, raid.xp);
    save.raids++;
    save.totalKills = (save.totalKills || 0) + (raid.kills || 0);
    save.lastLoadout = raid.startLoadout;
    if (success) {
      // Zlecenia powyżej Tieru 0 liczą tylko przedmioty WYNIESIONE z rajdu (przy udanej ewakuacji)
      save.questCarry = save.questCarry || {};
      (typeof QUESTS !== "undefined" ? QUESTS : []).forEach((q) => {
        if (save.quests && save.quests[q.id] !== "active") return;
        if (!q.isMain && q.tier === 0) return;
        save.questCarry[q.id] = save.questCarry[q.id] || {};
        q.req.forEach((r) => {
          // liczy się tylko to, co ZNALEZIONO w tym rajdzie (nie to, co przyniesiono ze schronu) i co jest w plecaku
          const have = Math.min(countItem(raid.bag, r.id), (raid.found || {})[r.id] || 0);
          if (have > 0) {
            const prev = save.questCarry[q.id][r.id] || 0;
            save.questCarry[q.id][r.id] = Math.min(r.qty, prev + have);
          }
        });
      });
      raid.bag.items.filter((r) => !ITEMS[r.id]?.quest).forEach((r) => {
        if (r.inner) placeInstance(save.stash, r);
        else addToContainer(save.stash, r.id, r.qty);
      });
      if (success && MAP.tutorial && !save.tutorialDone) {
        addToContainer(save.stash, "ration", 5);
        addToContainer(save.stash, "water", 5);
        log("[NAGRODA] Za tutorial na Marsie: 5x Racja żywnościowa i 5x Czysta woda.", "hit");
      }
      if (MAP.tutorial) save.tutorialDone = true;
      save.mapsDone = save.mapsDone || {};
      save.mapsDone[params.get("map") || "tutorial"] = true;
      save.taskDone = save.taskDone || {};
      (typeof QUESTS !== "undefined" ? QUESTS : []).forEach((q) => {
        if (q.task && raid.flags[q.id]) save.taskDone[q.id] = true;
      });
      Object.keys(raid.flags)
        .filter((k) => k.startsWith("kill_"))
        .forEach((k) => {
          save.kills = save.kills || {};
          save.kills[k.slice(5)] = true;
        });
    } else {
      save.deaths++;
      // Po śmierci tracisz też przedmioty założone na sobie (pancerz, broń), nie tylko plecak z zestawem
      save.equipped = { armor: null, ranged: null, ranged2: null, melee: null, activeWeapon: "ranged" };
    }
    save.loadout.items = [];
    writeSave(save);
  }
  renderEnd(success, tutorialFail, ups);
  if (ups) setTimeout(() => edgeGlow("level"), 900);
}

// Pasek „Prowiant” w rajdzie: średnia jedzenia i picia (0–100%), z etykietami F (jedzenie) i W (woda)
function renderNutritionHud() {
  const hunger = Math.max(0, Math.min(100, Math.round(save.hunger ?? 100)));
  const thirst = Math.max(0, Math.min(100, Math.round(save.thirst ?? 100)));
  const avg = (hunger + thirst) / 2;
  if ($("prov-bar")) {
    $("prov-bar").style.width = `${avg}%`;
    $("prov-f").textContent = `F: ${hunger}%`;
    $("prov-w").textContent = `W: ${thirst}%`;
  }
}

function renderEnd(success, tutorialFail, ups) {
  $("hp-bar").style.width = `${(raid.hp / save.maxHp) * 100}%`;
  $("hp-text").textContent = `${raid.hp} / ${save.maxHp} HP`;
  $("objectives").style.display = "none";
  const box = $("actions");
  box.innerHTML = "";
  const title = document.createElement("h3");
  title.textContent = success ? "Ewakuacja udana" : "Nie żyjesz";
  box.appendChild(title);

  const lines = [`Pokonani wrogowie: ${raid.kills}`];
  if (!tutorialFail) lines.push(`Zdobyte XP: ${raid.xp}${ups ? ` (awans: poziom ${save.level}!)` : ""}`);
  if (success) {
    const loot = summarize(raid.bag).filter((x) => !ITEMS[x.id]?.quest).map((r) => `${ITEMS[r.id]?.name || r.id} x${r.qty}`);
    lines.push(`Przeniesiono do magazynu: ${loot.length ? loot.join(", ") : "nic"}`);
  } else if (tutorialFail) {
    lines.push("To był trening - nic nie tracisz. Spróbuj ponownie.");
  } else {
    lines.push("Straciłeś cały zestaw, który zabrałeś na rajd, razem z założonym ekwipunkiem.");
  }
  lines.forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    box.appendChild(p);
  });

  const b = document.createElement("button");
  b.textContent = tutorialFail ? "Spróbuj ponownie" : "Wróć do schronu";
  b.onclick = () => (tutorialFail ? window.location.reload() : window.location.replace("hideout.html"));
  box.appendChild(b);
  refreshGrids();
}

// === SEKCJA: RENDER ===
function btn(label, fn, cls = "", disabled = false) {
  const b = document.createElement("button");
  b.textContent = label;
  b.className = `sm ${cls}`;
  b.disabled = disabled;
  b.onclick = fn;
  return b;
}

function render() {
  if (raid.over) return;
  saveRaidSnap();
  const node = MAP.nodes[raid.node];
  $("loc-name").textContent = node.name;
  $("hp-bar").style.width = `${(raid.hp / save.maxHp) * 100}%`;
  $("hp-text").textContent = `${raid.hp} / ${save.maxHp} HP`;
  renderNutritionHud();
  $("bag-info").textContent = `${usedCells(raid.bag)} / ${raid.bag.w * raid.bag.h}`;
  $("storm-text").textContent = MAP.storm
    ? raid.moves >= MAP.storm
      ? "BURZA"
      : `Burza za: ${MAP.storm - raid.moves}`
    : "";

  if (typeof renderAnatomyPanel === "function") {
    renderAnatomyPanel($("anatomy-panel"), save);
  }
  if (typeof renderEquipmentSlotsUI === "function") {
    renderEquipmentSlotsUI($("eq-slots-container"), true);
  }

  renderArt(node);
  renderMinimap();
  renderObjectives();
  renderActions(node);
  renderInfo();
  refreshGrids();
}

function renderArt(node) {
  const art = $("art");
  const container = $("game-container");
  if (raid.stealthMode) {
    art.style.setProperty("--tint", "#0284c7");
    art.textContent = `[W UKRYCIU // WYKRYTO CEL: ${raid.stealthMode.e.name.toUpperCase()}]`;
    if (container) container.classList.add("stealth-mode-active");
  } else if (raid.enemy) {
    art.style.setProperty("--tint", "#7f1d1d");
    art.textContent = `[Grafika wroga: ${raid.enemy.name}]`;
    if (container) container.classList.remove("stealth-mode-active");
  } else {
    art.style.setProperty("--tint", MAP.tint || "#0b192c");
    art.textContent = `[Grafika lokacji: ${node.name}]`;
    if (container) container.classList.remove("stealth-mode-active");
  }
}

function renderObjectives() {
  const box = $("objectives");
  const R = MAP.repair;
  if (!MAP.tutorial || !R) return renderTaskObjectives(box);
  box.style.display = "block";
  const fixed = !!raid.flags.engineFixed;
  const has = (id) => fixed || countItem(raid.bag, id) > 0;

  const targetModId = save.tutorialModule || (save.module === "Crafting" ? "Medstation" : "Crafting");
  const modDef = typeof SHIP_MODULES !== "undefined" ? SHIP_MODULES.find((m) => m.id === targetModId) : null;
  const reqs = modDef?.levels[1]?.items || [];

  const rows = [
    [`Znajdź: ${ITEMS[R.manual]?.name || R.manual}`, has(R.manual)],
    ...R.parts.map((p) => [`Znajdź: ${ITEMS[p]?.name || p}`, has(p)]),
    ...reqs.map(([id, qty]) => {
      const have = countItem(raid.bag, id);
      const name = ITEMS[id]?.name || id;
      return [`Zbierz materiał (${modDef?.name || targetModId}): ${name} (${have}/${qty})`, have >= qty];
    }),
    ["Napraw silnik przy statku", fixed],
    ["Wystartuj statkiem", false],
  ];
  box.innerHTML = "<h3>Cele Tutorialu</h3>";
  rows.forEach(([text, done]) => {
    const d = document.createElement("div");
    d.className = done ? "done" : "";
    d.textContent = `${done ? "[x]" : "[ ]"} ${text}`;
    box.appendChild(d);
  });
}

function renderActions(node = MAP.nodes[raid.node]) {
  syncUiMode();
  computeShimmers();
  const inCombat = isCombatNow();
  $("actions").innerHTML = "";
  const box = inCombat ? $("combat-body") : $("actions");
  box.innerHTML = "";
  if (raid.choice && raid.choice === raid.node) {
    const ch = MAP.nodes[raid.node].choice;
    const slots = moveSlots(MAP.nodes[raid.node], false);
    const pref = [1, 3, 7, 8, 9];
    ch.options.forEach((o, i) => {
      if (pref[i]) slots[pref[i]] = { label: o.label, fn: o.transit ? () => goTransit(o.transit) : () => pickChoice(o.to), cls: o.to === "boss_hall" || o.transit ? "primary-btn" : "ghost" };
    });
    renderActGrid(box, slots);
    return;
  }

  // Display QTE Alert Box if QTE is active
  if (qteActive) {
    const info = document.createElement("div");
    info.className = "qte-alert-box";

    if (qteActive.mode === "timing") {
      info.style.background = "rgba(15, 23, 42, 0.92)";
      info.style.borderColor = "#38bdf8";
      info.style.boxShadow = "0 0 25px rgba(56, 189, 248, 0.5)";
      info.innerHTML = `
        <div style="font-size:1rem; font-weight:900; color:#38bdf8; text-transform:uppercase;">
          [PERFEKCYJNE WYCZUCIE CZASU // TIMING]
        </div>
        <div style="font-size:0.85rem; margin:4px 0; color:#e0f2fe;">
          Wciśnij <span style="color:#fde68a; font-weight:bold;">[SPACJA]</span> lub kliknij przycisk dokładnie gdy wskazówka jest w <strong style="color:#4ade80;">ZIELONYM POLU</strong>!
        </div>
        <div style="position:relative; width:100%; height:26px; background:#0b192c; border:2px solid #38bdf8; border-radius:4px; overflow:hidden; margin:8px 0;">
          <div style="position:absolute; top:0; bottom:0; left:55%; width:25%; background:rgba(34, 197, 94, 0.45); border-left:2px solid #22c55e; border-right:2px solid #22c55e;">
            <span style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:0.68rem; color:#86efac; font-weight:bold;">CEL (55%-80%)</span>
          </div>
          <div id="qte-needle" style="position:absolute; top:0; bottom:0; left:${qteActive.needlePos}%; width:6px; background:#ef4444; box-shadow:0 0 12px #ef4444; border-radius:2px;"></div>
        </div>
      `;
      box.appendChild(info);

      const row = document.createElement("div");
      row.className = "btn-row";
      row.appendChild(btn("KLIKNIJ TERAZ [SPACJA]", triggerTimingClick, "primary-btn"));
      box.appendChild(row);
      return;
    }

    if (qteActive.mode === "sequence") {
      info.style.borderColor = "#f59e0b";
      info.innerHTML = `
        <div style="font-size:1rem; font-weight:900; color:#f59e0b; text-transform:uppercase;">
          [SEKWENCJA ${qteActive.seq.length} PRZYCISKÓW // COMBO]
        </div>
        <div style="font-size:0.85rem; margin:4px 0; color:#e0f2fe;">
          Wciśnij przyciski w dokładnej kolejności przed upływem czasu:
        </div>
        <div style="display:flex; justify-content:center; gap:8px; margin:10px 0;">
          ${qteActive.seq
            .map((s, idx) => {
              const isDone = idx < qteActive.step;
              const isCurrent = idx === qteActive.step;
              const bg = isDone ? "#22c55e" : isCurrent ? "#f59e0b" : "#1e293b";
              const color = isDone || isCurrent ? "#000" : "#94a3b8";
              const glow = isCurrent ? "box-shadow: 0 0 15px #f59e0b;" : "";
              return `<span style="background:${bg}; color:${color}; padding:6px 14px; font-weight:900; font-size:1.1rem; border-radius:6px; ${glow}">[ ${s.label} ]</span>`;
            })
            .join(" ")}
        </div>
      `;
      box.appendChild(info);

      const row = document.createElement("div");
      row.className = "btn-row";
      const currentReq = qteActive.seq[qteActive.step];
      row.appendChild(btn(`WCIŚNIJ KROK ${qteActive.step + 1}: [${currentReq ? currentReq.label : ""}]`, () => {
        if (!qteActive || qteActive.mode !== "sequence") return;
        qteActive.step++;
        if (qteActive.step >= qteActive.seq.length) {
          resolveQTE(true, `[SEKWENCJA UKOŃCZONA!] Perfekcyjny ciąg ${qteActive.seq.length} przycisków!`);
        } else {
          renderActions();
        }
      }, "primary-btn"));
      box.appendChild(row);
      return;
    }

    if (qteActive.mode === "parry") {
      info.style.borderColor = "#f59e0b";
      info.innerHTML = `
        <div style="font-size:1rem; font-weight:900; color:#f59e0b; text-transform:uppercase;">
          [PAROWANIE // KONTRA KIERUNKOWA]
        </div>
        <div style="font-size:0.9rem; margin:6px 0; color:#fff;">
          Szybko sparuj cios z kierunku: <span style="background:#f59e0b; color:#000; padding:4px 12px; border-radius:4px; font-weight:900;">[ ${qteActive.label} ]</span>!
        </div>
      `;
      box.appendChild(info);

      const row = document.createElement("div");
      row.className = "btn-row";
      row.appendChild(btn(`SPARUJ [${qteActive.label}]`, () => resolveQTE(true, "[PAROWANIE SUKCES!] Sparowano cios wroga!"), "primary-btn"));
      box.appendChild(row);
      return;
    }

    // Default single keypress QTE
    info.innerHTML = `
      <div style="font-size:1.1rem; font-weight:900; color:#f87171; text-transform:uppercase;">
        [SZYBKA REAKCJA // QTE]
      </div>
      <div style="font-size:1rem; margin:6px 0; color:#38bdf8;">
        WCIŚNIJ KLAWISZ <span style="background:#ef4444; color:#fff; padding:2px 10px; border-radius:4px; font-weight:bold; font-size:1.2rem; border:2px solid #fff;">[ ${qteActive.label} ]</span> ABY ${qteActive.type === "dodge" ? "WYKONAĆ UNIK" : "ZADAĆ KRYTYKA"}!
      </div>
      <div class="qte-progress-bar"><div class="qte-progress-fill"></div></div>
    `;
    box.appendChild(info);

    const row = document.createElement("div");
    row.className = "btn-row";
    row.appendChild(btn(`REAKCJA - KLIKNIJ [${qteActive.label}]`, () => resolveQTE(true), "primary-btn"));
    box.appendChild(row);
    return;
  }

  // W UKRYCIU
  if (raid.stealthMode) {
    const e = raid.stealthMode.e;
    const w = bestWeapon(raid.bag);
    const info = document.createElement("div");
    info.className = "enemy-info";
    info.style.borderColor = "#38bdf8";
    info.style.background = "rgba(14, 165, 233, 0.12)";
    info.style.color = "#38bdf8";
    info.innerHTML = `<strong>[W UKRYCIU]</strong><br/>
      Wykryto cel w cieniu: <span style="color:#f87171; font-weight:bold;">${e.name} (${e.hp} HP)</span>.
      <br/><small style="color:#cbd5e1;">Wróg jeszcze cię nie dostrzegł. Wybierz działanie klawiszem [1] lub [2]:</small>`;
    box.appendChild(info);
    renderActGrid(box, {
      ...moveSlots(node, false),
      1: { label: "[1] Omiń po cichu (wycofaj się)", fn: stealthBypass, cls: "ghost" },
      3: { label: `[2] Cichy atak, 65% krytyk (${w.name})`, fn: stealthAttack, cls: "primary-btn" },
    });
    return;
  }

  if (raid.enemy) {
    const e = raid.enemy;
    const w = getActiveWeaponObject();
    const info = document.createElement("div");
    info.className = "enemy-info";
    info.textContent = `${e.name}: ${e.hp} / ${e.maxHp} HP`;
    box.appendChild(info);

    const curChoice = raid.activeWeaponChoice || save.equipped?.activeWeapon || "ranged";
    const hasKabura = typeof hasHolster === "function" ? hasHolster(save) : false;
    const strip = [
      { label: "Palna 1" + (curChoice === "ranged" ? " [AKTYWNA]" : ""), fn: () => switchWeaponChoice("ranged"), cls: curChoice === "ranged" ? "primary-btn" : "ghost" },
    ];
    if (hasKabura && save.equipped?.ranged2) {
      strip.push({ label: "Palna 2" + (curChoice === "ranged2" ? " [AKTYWNA]" : ""), fn: () => switchWeaponChoice("ranged2"), cls: curChoice === "ranged2" ? "primary-btn" : "ghost" });
    }
    strip.push({ label: "Broń biała" + (curChoice === "melee" ? " [AKTYWNA]" : ""), fn: () => switchWeaponChoice("melee"), cls: curChoice === "melee" ? "primary-btn" : "ghost" });
    const healIds = [...new Set(raid.bag.items.filter((i) => ITEMS[i.id] && (ITEMS[i.id].heal || ITEMS[i.id].cures)).map((i) => i.id))];
    healIds.forEach((id) => strip.push({ label: `${ITEMS[id].name} x${countItem(raid.bag, id)}`, fn: () => healWith(id), cls: "ghost" }));

    renderActGrid(
      box,
      {
        ...moveSlots(node, false),
        1: { label: `[E] Atak (${w.name}${w.ammo ? `, amunicja: ${countItem(raid.bag, w.ammo)}` : ""})`, fn: attack, cls: "primary-btn" },
        3: { label: "[F] Ucieczka", fn: flee, cls: "ghost" },
        7: { label: "[Q] Auto-walka (-5% XP)", fn: autoFight, cls: "extract" },
      },
      strip
    );
    return;
  }

  if (raid.repairing) return renderRepair(box);

  // Zwykły widok: siatka 3x3. Pozycje 2/4/5/6 to wyjścia W/A/S/D (stałe).
  // Pozycje 1, 3, 7, 8, 9 zmieniają się zależnie od sytuacji.
  const slots = moveSlots(node, true);
  const extra = [];
  const place = (spec, prefs) => {
    const p = prefs.find((k) => !slots[k]);
    if (p) slots[p] = spec;
    else extra.push(spec);
  };
  if (roomLocked(node)) place({ label: `[K] Otwórz: ${node.keyLabel || "karta dostępu"}`, fn: useKeycard, cls: "primary-btn" }, [1, 7, 8, 9]);
  if (node.loot && !raid.searched[raid.node] && !raid.searching && !roomLocked(node)) place({ label: "[X] Przeszukaj", fn: search, cls: "ghost" }, [1, 7, 8, 9]);
  const task = activeTaskQuest();
  if (task) place({ label: `[T] Wykonaj zadanie: ${task.task.label}`, fn: openTask, cls: "primary-btn" }, [3, 7, 8, 9]);
  if (MAP.evac && raid.node === MAP.evac.lever.node && !raid.evacOpen) {
    place({ label: "[G] Uruchom dźwignię ewakuacji", fn: pullEvacLever, cls: "primary-btn" }, [7, 8, 9, 1]);
  }
  if (node.extract) {
    const ev = evacStatus();
    const locked = (node.extractRequires && !raid.flags[node.extractRequires]) || !ev.ok;
    const lockTxt = node.extractRequires && !raid.flags[node.extractRequires]
      ? EXTRACT_LOCK_TEXT[node.extractRequires] || "wykonaj wymagany krok"
      : ev.text;
    place(
      {
        label: locked ? `Ewakuacja zablokowana: ${lockTxt}` : node.extractRequires ? "Start (ewakuacja)" : "Ewakuacja",
        fn: extract,
        cls: "extract",
        disabled: !!locked,
      },
      [3, 7, 8, 9]
    );
  }
  if (node.mine && (!raid.mined || !raid.mined[raid.node])) {
    place({ label: `[M] Wydobądź minerał (${node.mine.label})`, fn: mineNode, cls: "primary-btn" }, [7, 8, 9, 1]);
  }
  if (node.repair && MAP.repair && !raid.flags.engineFixed) place({ label: "Napraw silnik", fn: startRepair, cls: "ghost" }, [7, 8, 9, 1]);
  if (moduleActive(save, "Safe system")) place({ label: "Radar (Safe System)", fn: showSafeRadar, cls: "ghost" }, [7, 8, 9, 1]);
  if (unnoticedHere()) {
    if (slots[9]) extra.push(slots[9]);
    slots[9] = { label: `[9] Zaatakuj wroga (nie widzi cię)`, fn: unnoticedAttack, cls: "primary-btn" };
  }
  node.exits.slice(4).forEach((id) => id && extra.push({ label: `Idź: ${MAP.nodes[id].name}`, fn: () => move(id), cls: `ghost ${raid.nodeShimmers[id] || ""}`.trim(), disabled: false }));
  renderActGrid(box, slots, extra);
}

// Pozycje siatki akcji: 1 2 3 / 4 5 6 / 7 8 9
function actBtn(spec) {
  const b = btn(spec.label, spec.fn, spec.cls || "ghost", !!spec.disabled);
  b.classList.add("act-btn");
  return b;
}

function renderActGrid(box, slots, strip = []) {
  const g = document.createElement("div");
  g.className = "act-grid";
  for (let i = 1; i <= 9; i++) {
    if (slots[i]) g.appendChild(actBtn(slots[i]));
    else {
      const e = document.createElement("div");
      e.className = "act-slot";
      g.appendChild(e);
    }
  }
  box.appendChild(g);
  if (strip.length) {
    const s = document.createElement("div");
    s.className = "act-strip";
    strip.forEach((spec) => s.appendChild(actBtn(spec)));
    box.appendChild(s);
  }
}

// Wyjścia na stałych pozycjach: exits[0]=W (poz. 2), exits[1]=A (4), exits[2]=S (5), exits[3]=D (6)
function moveSlots(node, enabled) {
  const keys = ["W", "A", "S", "D"];
  const out = {};
  [2, 4, 5, 6].forEach((pos, idx) => {
    const id = node.exits[idx];
    if (!id) return;
    const target = MAP.nodes[id];
    const shimmer = raid.nodeShimmers ? raid.nodeShimmers[id] || "" : "";
    const visit =
      (id === raid.from ? "node-from" : raid.visited && raid.visited[id] ? "node-visited" : "") +
      (pendingTaskAt(id) ? " node-task" : "");
    out[pos] = {
      label: `[${keys[idx]}] ${target.name}${target.gate && !raid.flags["gate_" + id] ? " [zamek]" : ""}`,
      fn: () => move(id),
      cls: `ghost ${shimmer} ${visit}`.trim(),
      disabled: !enabled,
    };
  });
  return out;
}

function showSafeRadar() {
  const safeLvl = moduleLevel(save, "Safe system");
  log(`--- RAPORT RADARU SAFE SYSTEM (POZ. ${safeLvl}) ---`, "tip");
  MAP.nodes[raid.node].exits.forEach((exitId) => {
    if (!exitId) return;
    const exNode = MAP.nodes[exitId];
    let info = `Lokacja [${exNode.name}]: `;
    if (exNode.enemy) {
      const e = ENEMIES[exNode.enemy.id];
      info += `Wykryto zagrożenie: ${e?.name || exNode.enemy.id} (~${Math.round(exNode.enemy.chance * 100)}% szans). `;
    } else {
      info += "Brak zagrożenia wrogami. ";
    }
    if (safeLvl >= 2) {
      if (exNode.loot) info += `[Loot: ${exNode.loot.table} x${exNode.loot.rolls}] `;
      if (exNode.guaranteed) info += `[Kluczowy element/quest!] `;
    }
    log(info, "tip");
  });
}

// === SEKCJA: ZADANIA W RAJDZIE (MINIGRY) ===
// Typy zadań (q.task.type): terminal | hack | wires | memory.
// Zadanie aktywuje się na lokacji q.task.node w mapie q.task.map. Minigra otwiera się
// w osobnym oknie (nakładce), nie w panelu akcji. Esc lub ✕ zamyka okno bez kary.
const TASK_SYMBOLS = ["▲", "●", "■", "◆", "★", "✚"];
const TERMINAL_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const WIRE_COLORS = [
  { name: "czerwony", css: "#ef4444" },
  { name: "niebieski", css: "#3b82f6" },
  { name: "żółty", css: "#eab308" },
  { name: "zielony", css: "#22c55e" },
];

function taskQuests() {
  return typeof QUESTS !== "undefined" ? QUESTS.filter((q) => q.task) : [];
}

// Zadanie czeka na wykonanie (aktywne, niezaliczone) – na danej lokacji rajdu
function pendingTaskAt(nodeId) {
  const mapKey = params.get("map") || "tutorial";
  return (
    taskQuests().find(
      (q) =>
        q.task.map === mapKey &&
        q.task.node === nodeId &&
        save.quests[q.id] === "active" &&
        !raid.flags[q.id] &&
        !(save.taskDone || {})[q.id]
    ) || null
  );
}

function activeTaskQuest() {
  if (!raid || raid.terminal || raid.over) return null;
  return pendingTaskAt(raid.node);
}

function makeTerminalCells(key) {
  const randChar = (not) => {
    let c;
    do {
      c = TERMINAL_CHARS[Math.floor(Math.random() * TERMINAL_CHARS.length)];
    } while (c === not);
    return c;
  };
  const cells = [0, 1, 2].map(() => ({ code: key, ok: true, clicked: false }));
  while (cells.length < 16) {
    const pos = Math.floor(Math.random() * key.length);
    const s = key.split("");
    s[pos] = randChar(key[pos]);
    cells.push({ code: s.join(""), ok: false, clicked: false });
  }
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  return cells;
}

function makeTaskState(q) {
  switch (q.task.type) {
    case "terminal":
      return { cells: makeTerminalCells(q.task.key), found: 0, errors: 0, locked: false };
    case "hack":
      return { pos: 0, dir: 1, zoneStart: 40, zoneWidth: 16, hits: 0, misses: 0, locked: false, timer: null, el: null };
    case "wires":
      return {
        right: WIRE_COLORS.map((_, i) => i).sort(() => Math.random() - 0.5),
        sel: null,
        joined: [],
        errors: 0,
        locked: false,
      };
    case "memory":
      return {
        seq: [0, 1, 2, 3].map(() => Math.floor(Math.random() * TASK_SYMBOLS.length)),
        input: [],
        phase: "show",
        shown: -1,
        errors: 0,
        locked: false,
        timers: [],
      };
  }
  return {};
}

function startTaskTimers(s, type) {
  if (type === "hack") {
    s.timer = setInterval(() => {
      s.pos += s.dir * 0.9;
      if (s.pos >= 100) { s.pos = 100; s.dir = -1; }
      if (s.pos <= 0) { s.pos = 0; s.dir = 1; }
      if (s.el) s.el.marker.style.left = `${s.pos}%`;
    }, 16);
  }
  if (type === "memory") {
    const step = 800;
    s.seq.forEach((_, i) => s.timers.push(setTimeout(() => { s.shown = i; renderMinigame(); }, 600 + i * step)));
    s.timers.push(
      setTimeout(() => {
        s.shown = -1;
        s.phase = "input";
        renderMinigame();
      }, 600 + s.seq.length * step + 300)
    );
  }
}

function stopTaskTimers(s) {
  if (!s) return;
  if (s.timer) clearInterval(s.timer);
  (s.timers || []).forEach(clearTimeout);
  s.timer = null;
  s.timers = [];
}

function openTask() {
  const q = activeTaskQuest();
  if (!q || raid.enemy || raid.stealthMode || qteActive || raid.repairing) return;
  const state = makeTaskState(q);
  raid.terminal = { quest: q, type: q.task.type, state };
  log(`[ZADANIE] ${q.task.label} – rozpoczęto.`, "tip");
  startTaskTimers(state, q.task.type);
  showMinigame();
}

function closeMinigame() {
  raid.pendingMove = null;
  stopTaskTimers(raid.terminal && raid.terminal.state);
  raid.terminal = null;
  const ov = document.getElementById("mg-overlay");
  if (ov) ov.remove();
  render();
}

function retryMinigame() {
  const t = raid.terminal;
  if (!t) return;
  stopTaskTimers(t.state);
  t.state = makeTaskState(t.quest);
  startTaskTimers(t.state, t.type);
  renderMinigame();
}

function taskSolved() {
  const t = raid.terminal;
  const q = t.quest;
  stopTaskTimers(t.state);
  raid.flags[q.id] = true;
  // Zadania z minigier (przewody, terminal, hack, pamięć) szkolą Inżynierię
  if (typeof grantSkillXp === "function") grantSkillXp(save, "inzynieria", 40);
  raid.terminal = null;
  const ov = document.getElementById("mg-overlay");
  if (ov) ov.remove();
  log(`[ZADANIE] Zaliczone. ${q.task.intel}`, "scene");
  render();
  const pm = raid.pendingMove;
  raid.pendingMove = null;
  if (pm) return move(pm);
}

function taskFailCheck(s) {
  if (s.errors >= 3 || s.misses >= 3) {
    s.locked = true;
    stopTaskTimers(s);
    log("[ZADANIE] Zablokowane. Ponów podejście.", "danger");
  }
}

// --- Akcje minigier ---
function terminalPick(i) {
  const s = raid.terminal.state;
  if (s.locked) return;
  const cell = s.cells[i];
  if (!cell || cell.clicked) return;
  cell.clicked = true;
  if (cell.ok) {
    s.found++;
    log(`[ZADANIE] Zgodny wpis: ${cell.code} (${s.found}/3).`, "tip");
    if (s.found >= 3) return taskSolved();
  } else {
    s.errors++;
    log(`[ZADANIE] Błędny wpis: ${cell.code}. Błędy: ${s.errors}/3.`, "warn");
    taskFailCheck(s);
  }
  renderMinigame();
}

function hackStop() {
  const s = raid.terminal.state;
  if (s.locked) return;
  const inZone = s.pos >= s.zoneStart && s.pos <= s.zoneStart + s.zoneWidth;
  if (inZone) {
    s.hits++;
    s.zoneWidth = Math.max(8, s.zoneWidth - 2);
    s.zoneStart = 8 + Math.random() * 80;
    log(`[ZADANIE] Trafienie (${s.hits}/3).`, "tip");
    if (s.hits >= 3) return taskSolved();
  } else {
    s.misses++;
    log(`[ZADANIE] Pudło (${s.misses}/3).`, "warn");
    taskFailCheck(s);
  }
  renderMinigame();
}

function wirePickLeft(i) {
  const s = raid.terminal.state;
  if (s.locked || s.joined.includes(i)) return;
  s.sel = s.sel === i ? null : i;
  renderMinigame();
}

function wirePickRight(j) {
  const s = raid.terminal.state;
  if (s.locked || s.sel === null) return;
  const c = s.right[j];
  if (s.joined.includes(c)) return;
  if (c === s.sel) {
    s.joined.push(c);
    s.sel = null;
    log(`[ZADANIE] Obwód połączony (${s.joined.length}/4).`, "tip");
    if (s.joined.length >= 4) return taskSolved();
  } else {
    s.errors++;
    s.sel = null;
    log(`[ZADANIE] Złe połączenie. Błędy: ${s.errors}/3.`, "warn");
    taskFailCheck(s);
  }
  renderMinigame();
}

function memoryPick(k) {
  const s = raid.terminal.state;
  if (s.phase !== "input" || s.locked) return;
  if (k === s.seq[s.input.length]) {
    s.input.push(k);
    if (s.input.length === s.seq.length) return taskSolved();
  } else {
    s.errors++;
    s.input = [];
    log(`[ZADANIE] Zły sygnał. Błędy: ${s.errors}/3.`, "warn");
    taskFailCheck(s);
  }
  renderMinigame();
}

// --- Widok (nakładka) ---
function mgEl(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function mgBtn(label, fn, cls, disabled) {
  const b = mgEl("button", `mg-cell ${cls || ""}`.trim(), label);
  b.disabled = !!disabled;
  b.onclick = fn;
  return b;
}

function showMinigame() {
  if (!document.getElementById("mg-overlay")) {
    const ov = mgEl("div", "mg-overlay");
    ov.id = "mg-overlay";
    document.body.appendChild(ov);
  }
  renderMinigame();
}

function renderMinigame() {
  const t = raid.terminal;
  const ov = document.getElementById("mg-overlay");
  if (!t || !ov) return;
  const q = t.quest;
  const s = t.state;
  ov.innerHTML = "";
  const panel = mgEl("div", "mg-panel");
  const head = mgEl("div", "mg-head");
  head.appendChild(mgEl("span", "", q.task.label));
  head.appendChild(mgBtn("✕", closeMinigame, "mg-x"));
  panel.appendChild(head);
  panel.appendChild(mgEl("div", "mg-sub", q.title));
  const body = mgEl("div", "mg-body");
  panel.appendChild(body);
  ov.appendChild(panel);

  const status = mgEl("div", "mg-status");
  body.appendChild(status);

  if (t.type === "terminal") {
    status.textContent = `Klucz dostępu: [${q.task.key}] · zgodne ${s.found}/3 · błędy ${s.errors}/3`;
    const grid = mgEl("div", "mg-grid");
    s.cells.forEach((c, i) => {
      const b = mgBtn(c.code, () => terminalPick(i), c.clicked ? "ok" : "", c.clicked || s.locked);
      grid.appendChild(b);
    });
    body.appendChild(grid);
  }

  if (t.type === "hack") {
    status.textContent = `Trafienia ${s.hits}/3 · pudła ${s.misses}/3 · zatrzymaj wskaźnik w zielonym polu`;
    const bar = mgEl("div", "mg-bar");
    const zone = mgEl("div", "mg-zone");
    zone.style.left = `${s.zoneStart}%`;
    zone.style.width = `${s.zoneWidth}%`;
    const marker = mgEl("div", "mg-marker");
    marker.style.left = `${s.pos}%`;
    bar.appendChild(zone);
    bar.appendChild(marker);
    body.appendChild(bar);
    s.el = { marker };
    const row = mgEl("div", "mg-row");
    row.appendChild(mgBtn("ZATRZYMAJ", hackStop, "mg-big", s.locked));
    if (s.locked) row.appendChild(mgBtn("Ponów", retryMinigame, ""));
    body.appendChild(row);
  }

  if (t.type === "wires") {
    status.textContent = `Połączone ${s.joined.length}/4 · błędy ${s.errors}/3 · wybierz kabel, potem gniazdo tego samego koloru`;
    const cols = mgEl("div", "mg-cols");
    const left = mgEl("div", "");
    WIRE_COLORS.forEach((c, i) => {
      const w = mgEl("button", `mg-wire ${s.sel === i ? "sel" : ""}`);
      w.disabled = s.locked || s.joined.includes(i);
      w.appendChild(mgEl("span", "mg-dot"));
      w.firstChild.style.background = c.css;
      w.appendChild(mgEl("span", "", c.name));
      w.onclick = () => wirePickLeft(i);
      left.appendChild(w);
    });
    const right = mgEl("div", "");
    s.right.forEach((ci, j) => {
      const c = WIRE_COLORS[ci];
      const w = mgEl("button", "mg-wire");
      w.disabled = s.locked || s.joined.includes(ci);
      w.appendChild(mgEl("span", "mg-dot"));
      w.firstChild.style.background = c.css;
      w.appendChild(mgEl("span", "", `gniazdo ${j + 1}`));
      w.onclick = () => wirePickRight(j);
      right.appendChild(w);
    });
    cols.appendChild(left);
    cols.appendChild(right);
    body.appendChild(cols);
    if (s.locked) body.appendChild(mgBtn("Ponów", retryMinigame, ""));
  }

  if (t.type === "memory") {
    if (s.phase === "show") {
      status.textContent = "Zapamiętaj sekwencję…";
      body.appendChild(mgEl("div", "mg-symbol", s.shown >= 0 ? TASK_SYMBOLS[s.seq[s.shown]] : ""));
    } else {
      status.textContent = `Odtwórz sekwencję: ${s.input.length}/${s.seq.length} · błędy ${s.errors}/3`;
      const grid = mgEl("div", "mg-grid");
      TASK_SYMBOLS.forEach((sym, k) => grid.appendChild(mgBtn(sym, () => memoryPick(k), "", s.locked)));
      body.appendChild(grid);
      if (s.locked) body.appendChild(mgBtn("Ponów", retryMinigame, ""));
    }
  }
}

function renderTaskObjectives(box) {
  const mapKey = params.get("map") || "tutorial";
  const list = taskQuests().filter((q) => q.task.map === mapKey && save.quests[q.id] === "active");
  if (!list.length) return (box.style.display = "none");
  box.style.display = "block";
  box.innerHTML = "<h3>Cele Zleceń</h3>";
  list.forEach((q) => {
    const done = !!(raid.flags[q.id] || (save.taskDone || {})[q.id]);
    const d = mgEl("div", done ? "done" : "", `${done ? "[x]" : "[ ]"} ${q.task.label}: ${MAP.nodes[q.task.node]?.name || q.task.node} (${q.title})`);
    box.appendChild(d);
  });
}

function renderRepair(box) {
  const R = MAP.repair;
  const rp = raid.repairing;
  const h = document.createElement("div");
  h.className = "enemy-info";
  h.style.color = "#2dd4bf";
  h.textContent = `Naprawa silnika: krok ${rp.progress + 1} / ${R.steps.length}`;
  box.appendChild(h);
  const row = document.createElement("div");
  row.className = "btn-row";
  rp.order.forEach((i) => row.appendChild(btn(R.steps[i], () => repairStep(i), "", i < rp.progress)));
  box.appendChild(row);
  const back = document.createElement("div");
  back.className = "btn-row";
  back.appendChild(btn("Anuluj", cancelRepair, "ghost"));
  box.appendChild(back);
}

// === SEKCJA: KLAWIATURA PODCZAS GRY ===
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || !raid || raid.over) return;

    const code = e.code;

    // [ukryte, testowe] Mars: 5x P -> cały łup z Marsa do magazynu, tutorial zaliczony, handlarz Rusznikarz odblokowany.
    if (code === "KeyP" && MAP && MAP.tutorial && !qteActive) {
      raid.secretP = (raid.secretP || 0) + 1;
      if (raid.secretP >= 5) {
        raid.secretP = 0;
        testSkipMars();
      }
      return;
    }

    // Szybka Reakcja QTE (Timing, Sekwencja, Parowanie, Klasyczny)
    if (qteActive) {
      if (qteActive.mode === "timing") {
        if (code === "Space" || code === "Enter" || code === "KeyE") {
          e.preventDefault();
          triggerTimingClick();
          return;
        }
      } else if (qteActive.mode === "sequence") {
        const expected = qteActive.seq[qteActive.step];
        if (expected && code === expected.code) {
          e.preventDefault();
          qteActive.step++;
          if (qteActive.step >= qteActive.seq.length) {
            resolveQTE(true, `[SEKWENCJA UKOŃCZONA!] Perfekcyjny ciąg ${qteActive.seq.length} przycisków!`);
          } else {
            log(`[SEKWENCJA] Krok ${qteActive.step}/${qteActive.seq.length} OK! Następny: [${qteActive.seq[qteActive.step].label}]!`, "tip");
            renderActions();
          }
          return;
        } else if (code.startsWith("Key") || code === "Space") {
          e.preventDefault();
          resolveQTE(false, `[BŁĄD SEKWENCJI!] Wciśnięto błędny klawisz!`);
          return;
        }
      } else if (qteActive.mode === "parry") {
        if (code === qteActive.code) {
          e.preventDefault();
          resolveQTE(true, `[PAROWANIE SUKCES!] Sparowano cios i wykonano ripostę!`);
          return;
        } else if (code.startsWith("Key")) {
          e.preventDefault();
          resolveQTE(false, `[ZŁY KIERUNEK PAROWANIA!]`);
          return;
        }
      } else {
        if (code === qteActive.code || (qteActive.code === "Space" && code === "Space")) {
          e.preventDefault();
          resolveQTE(true, `[SZYBKA REAKCJA!] Wciśnięto [${qteActive.label}] na czas!`);
          return;
        } else if (code.startsWith("Key") || code === "Space" || code.startsWith("Digit")) {
          e.preventDefault();
          resolveQTE(false, `[ZŁY KLAWISZ!]`);
          return;
        }
      }
    }

    // W UKRYCIU (1: Omiń, 2: Atak z ukrycia)
    if (raid.stealthMode) {
      if (code === "Digit1" || code === "KeyO") {
        e.preventDefault();
        stealthBypass();
        return;
      }
      if (code === "Digit2" || code === "KeyA" || code === "Enter") {
        e.preventDefault();
        stealthAttack();
        return;
      }
      return;
    }

    // W walce (E/Space: Atak, Q: Auto-walka, F: Ucieczka)
    if (raid.enemy) {
      if (code === "KeyE" || code === "Space") {
        e.preventDefault();
        attack();
        return;
      }
      if (code === "KeyQ") {
        e.preventDefault();
        autoFight();
        return;
      }
      if (code === "KeyF") {
        e.preventDefault();
        flee();
        return;
      }
      return;
    }

    // W trakcie naprawy silnika
    if (raid.repairing) return;

    // Terminal (minigra odczytu logów)
    if (raid.terminal) {
      if (code === "Escape") closeMinigame();
      return;
    }
    if (code === "KeyT") {
      e.preventDefault();
      openTask();
      return;
    }

    // Dźwignia ewakuacji pod G
    if (code === "KeyG") {
      e.preventDefault();
      if (MAP.evac && raid.node === MAP.evac.lever.node) pullEvacLever();
      return;
    }

    // Przeszukaj pod X
    if (code === "KeyX") {
      e.preventDefault();
      search();
      return;
    }

    // Wydobycie pod M
    if (code === "KeyM") {
      e.preventDefault();
      mineNode();
      return;
    }

    // Zabierz wszystko pod Shift+R
    if (code === "KeyR" && e.shiftKey) {
      e.preventDefault();
      takeAll();
      return;
    }

    // Poruszanie się W, A, S, D
    const node = MAP.nodes[raid.node];
    if (node && node.exits) {
      if (code === "KeyW" && node.exits[0]) {
        e.preventDefault();
        move(node.exits[0]);
        return;
      }
      if (code === "KeyA" && node.exits[1]) {
        e.preventDefault();
        move(node.exits[1]);
        return;
      }
      if (code === "KeyS" && node.exits[2]) {
        e.preventDefault();
        move(node.exits[2]);
        return;
      }
      if (code === "KeyD" && node.exits[3]) {
        e.preventDefault();
        move(node.exits[3]);
        return;
      }
    }
  });
}


// === SEKCJA: BRAMY I BOSS ===
// Brama na lokacji (node.gate) wymaga minigry; po zaliczeniu ruch wykonuje się sam.
function openGate(nodeId) {
  if (raid.enemy || raid.stealthMode || qteActive || raid.repairing || raid.terminal) return;
  const g = MAP.nodes[nodeId].gate;
  const q = { id: "gate_" + nodeId, title: MAP.nodes[nodeId].name, task: { type: g.type, label: g.label, intel: g.intel } };
  const state = makeTaskState(q);
  raid.pendingMove = nodeId;
  raid.terminal = { quest: q, type: q.task.type, state };
  log("[ZADANIE] " + g.label + " – rozpoczęto.", "tip");
  startTaskTimers(state, q.task.type);
  showMinigame();
}

// Przejście do innej mapy w trakcie rajdu (plecak, HP i łup zostają przeniesione)
function goTransit(mapId) {
  if (!raid.choice || raid.over || raid.enemy) return;
  const target = MAPS[mapId];
  if (!target) return;
  if (target.unlock && getTraderTier(save, target.unlock.trader) < target.unlock.tier) {
    const tr = (typeof TRADERS !== "undefined" && TRADERS.find((t) => t.id === target.unlock.trader) || {}).name || target.unlock.trader;
    return log(`[GRODZ ZAMKNIĘTA] Brak zgody. Wymaga zaufania: ${tr}, Tier ${target.unlock.tier}.`, "warn");
  }
  try {
    sessionStorage.setItem(
      "raidTransit",
      JSON.stringify({
        to: mapId,
        raid: { bag: raid.bag, hp: raid.hp, xp: raid.xp, kills: raid.kills, found: raid.found || {}, flags: raid.flags, startLoadout: raid.startLoadout },
      }),
    );
  } catch (e) {
    return log("Nie można przejść dalej (brak pamięci przeglądarki).", "warn");
  }
  raid.over = true;
  clearRaidSnap();
  window.location.replace(`raid.html?map=${mapId}`);
}

function pickChoice(to) {
  if (!raid.choice) return;
  raid.choice = null;
  move(to);
}

// Boss: co 3. tura wyrzut kwasu, który omija pancerz
function bossAcidAttack(e) {
  const dmg = Math.round(randInt(e.dmg[0], e.dmg[1]) * 1.6);
  log(e.name + " wypluwa kwas – pancerz nie chroni!", "danger");
  damage(dmg, e.name);
  render();
}


// === SEKCJA: MECHANIKI DODATKOWE (ZDARZENIA, HAŁAS) ===


function rollNodeEvent(id) {
  const total = NODE_EVENTS.reduce((a, ev) => a + ev.w, 0);
  let r = Math.random() * total;
  const ev = NODE_EVENTS.find((x) => (r -= x.w) < 0) || NODE_EVENTS[0];
  log(ev.msg, "tip");
  ev.run();
}

// Hałas przyciąga Pustych z jednego z sąsiednich węzłów bez wroga
function attractPustych() {
  const node = MAP.nodes[raid.node];
  if (!node) return;
  const free = node.exits.filter((ex) => ex && MAP.nodes[ex] && !MAP.nodes[ex].enemy);
  if (!free.length) return;
  const ex = free[Math.floor(Math.random() * free.length)];
  const ids = ["zombie_walker", "zombie_crawler", "zombie_spitter"];
  MAP.nodes[ex].enemy = { id: ids[Math.floor(Math.random() * ids.length)], chance: 1 };
  raid.cleared[ex] = false;
  raid.nodeShimmers = raid.nodeShimmers || {};
  raid.nodeShimmers[ex] = "node-shimmer-danger";
  log(`[HAŁAS] Wystrzały usłyszały Pustych. Coś powoli zbliża się z: ${MAP.nodes[ex].name}.`, "danger");
  render();
}


// === SEKCJA: MINIMAPA (WASD) ===
// Rysuje odwiedzone pokoje (z pozycjami z ruchu gracza) i znane wyjścia (znaki "?").
function renderMinimap() {
  const box = document.getElementById("minimap");
  if (!box || !raid || !MAP || !MAP.coords) return;
  const cur = raid.node;
  const k = (x, y) => x + "," + y;
  const cells = new Map();
  const posOf = (id) => MAP.coords[id] || null;
  const visited = Object.keys(raid.visited || {}).filter((id) => posOf(id));

  visited.forEach((id) => {
    const p = posOf(id);
    const kind = id === cur ? "cur" : MAP.nodes[id]?.extract ? "ext" : "v";
    cells.set(k(p.x, p.y), { x: p.x, y: p.y, kind, id });
  });
  visited.forEach((id) => {
    const p = posOf(id);
    (MAP.nodes[id]?.exits || []).forEach((ex, slot) => {
      if (!ex || raid.visited[ex]) return;
      const q = { x: p.x + MM_DIRS[slot][0], y: p.y + MM_DIRS[slot][1] };
      if (!cells.has(k(q.x, q.y))) cells.set(k(q.x, q.y), { x: q.x, y: q.y, kind: "f", id: ex });
    });
  });

  const all = [...cells.values()];
  const minX = Math.min(...all.map((c) => c.x)) - 1.5;
  const maxX = Math.max(...all.map((c) => c.x)) + 1.5;
  const minY = Math.min(...all.map((c) => c.y)) - 1.5;
  const maxY = Math.max(...all.map((c) => c.y)) + 1.5;
  const S = 30;
  const W = (maxX - minX + 1) * S;
  const H = (maxY - minY + 1) * S;
  const sx = (x) => (x - minX) * S + S / 2;
  const sy = (y) => (y - minY) * S + S / 2;

  let lines = "";
  visited.forEach((id) => {
    const p = posOf(id);
    (MAP.nodes[id]?.exits || []).forEach((ex) => {
      if (!ex || !raid.visited[ex] || !posOf(ex)) return;
      const q = posOf(ex);
      lines += `<line x1="${sx(p.x)}" y1="${sy(p.y)}" x2="${sx(q.x)}" y2="${sy(q.y)}" stroke="#334155" stroke-width="2"/>`;
    });
  });

  let rects = "";
  all.forEach((c) => {
    const cx = sx(c.x), cy = sy(c.y), r = S * 0.36;
    if (c.kind === "f") {
      rects += `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="none" stroke="#64748b" stroke-dasharray="3 2"/>`;
      rects += `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" fill="#64748b">?</text>`;
    } else {
      const fill = c.kind === "cur" ? "#d8b4fe" : c.kind === "ext" ? "#065f46" : "#1e3a8a";
      const stroke = c.kind === "cur" ? "#ffffff" : "#38bdf8";
      rects += `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="${fill}" stroke="${stroke}"/>`;
      if (c.kind === "ext") rects += `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" fill="#d1fae5">E</text>`;
    }
  });

  // Znaczniki na pokojach: dźwignia (D), quest (Q), łup do przeszukania (kropka), przeszukany (✓)
  all.forEach((c) => {
    if (c.kind === "f") return;
    const node = MAP.nodes[c.id];
    if (!node) return;
    const cx = sx(c.x), cy = sy(c.y), r = S * 0.36;
    const searched = !!raid.searched[c.id];
    let mk = "";
    if (MAP.evac && MAP.evac.lever && c.id === MAP.evac.lever.node) {
      const col = raid.evacOpen ? "#22c55e" : "#f97316";
      mk += `<text x="${cx - r + 4}" y="${cy + r - 3}" font-size="10" font-weight="bold" fill="${col}"><title>${raid.evacOpen ? "Dźwignia ewakuacji uruchomiona" : "Dźwignia ewakuacji"}</title>D</text>`;
    }
    const hasQuest = (node.guaranteed || []).some(([id]) => ITEMS[id] && ITEMS[id].quest);
    if (hasQuest && !searched) {
      mk += `<text x="${cx - r + 4}" y="${cy - r + 10}" font-size="10" font-weight="bold" fill="#a78bfa"><title>Quest: przedmiot do znalezienia</title>Q</text>`;
    }
    if (node.loot && !searched) {
      mk += `<circle cx="${cx + r - 4}" cy="${cy - r + 4}" r="2.5" fill="#fbbf24"><title>Do przeszukania</title></circle>`;
    }
    if (searched) {
      mk += `<text x="${cx + r - 8}" y="${cy + r - 3}" font-size="9" fill="#94a3b8"><title>Przeszukany</title>✓</text>`;
    }
    rects += mk;
  });

  // Klawisze WASD wokół pokoju, w którym stoi gracz
  let keys = "";
  const cp = posOf(cur);
  if (cp) {
    (MAP.nodes[cur]?.exits || []).forEach((ex, slot) => {
      if (!ex) return;
      const d = MM_DIRS[slot];
      // etykieta klawisza leży na środku połączenia z sąsiadem, na małym tle
      const tx = sx(cp.x) + d[0] * S * 0.5;
      const ty = sy(cp.y) + d[1] * S * 0.5;
      keys += `<rect x="${tx - 6}" y="${ty - 6}" width="12" height="12" rx="2" fill="#0b1020" stroke="#d8b4fe" stroke-width="0.8"/>`;
      keys += `<text x="${tx}" y="${ty + 3.5}" text-anchor="middle" font-size="9" font-family="Share Tech Mono, monospace" fill="#d8b4fe">${MM_KEYS[slot]}</text>`;
    });
  }

  // Tło minimapy w kolorze lokacji (MAP.tint), przygaszone, żeby nie przeszkadzać w odczycie
  const hexToRgb = (hex) => {
    const h = String(hex || "#1e293b").replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0").slice(0, 6);
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  };
  const [tr, tg, tb] = hexToRgb(MAP.tint);
  const bgTop = `rgba(${tr}, ${tg}, ${tb}, 0.42)`;
  const bgBottom = `rgba(${Math.round(tr * 0.3)}, ${Math.round(tg * 0.3)}, ${Math.round(tb * 0.3)}, 0.85)`;
  box.style.background = `linear-gradient(180deg, ${bgTop}, ${bgBottom})`;
  box.style.borderRadius = "2px";
  box.style.padding = "6px 0 4px";

  box.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;height:auto;display:block;margin:0 auto;overflow:visible;" role="img" aria-label="Minimapa">
      ${lines}${rects}${keys}
    </svg>
    <div class="hint" style="text-align:center;font-size:0.7rem;margin-top:4px;">W góra · A lewo · S dół · D prawo</div>`;
}


// [ukryte, testowe] Pomija Mars: cały łup z mapy do magazynu, zalicza tutorial, pomija 5 zabitych (odblokowuje Rusznikarza) bez reputacji
function testSkipMars() {
  if (!save || raid.over) return;
  Object.values(MAP.nodes).forEach((node) => {
    if (node.loot && LOOT[node.loot.table]) {
      LOOT[node.loot.table].forEach((e) => {
        if (ITEMS[e.id]) addToContainer(save.stash, e.id, e.max || e.min || 1);
      });
    }
    (node.guaranteed || []).forEach(([id, qty]) => {
      if (ITEMS[id]) addToContainer(save.stash, id, qty || 1);
    });
  });
  // Testowy magazyn: maksymalny poziom modułu Stash (skarbiec orbitalny)
  if (save.ship && save.ship.modules && save.ship.modules.Stash) {
    const stashDef = (typeof SHIP_MODULES !== "undefined" ? SHIP_MODULES : []).find((m) => m.id === "Stash");
    save.ship.modules.Stash.level = stashDef ? stashDef.maxLevel : 5;
  }
  // Karta dostępu do skarbca na Kopule Tytana (do testów pomieszczenia)
  if (ITEMS.card_dome) addToContainer(save.stash, "card_dome", 1);
  // Testowe kontenery na start: karton, apteczka i skrzynia na broń
  ["cardboard_box", "medicine_case", "weapon_case"].forEach((id) => {
    if (ITEMS[id]) addToContainer(save.stash, id, 1);
  });
  // Rusznikarz (trader2) odblokowuje się po 5 zabitych zarażonych - pomijamy to licznikiem, bez reputacji
  save.totalKills = Math.max(save.totalKills || 0, 5);
  writeSave(save);
  finish(true);
}
