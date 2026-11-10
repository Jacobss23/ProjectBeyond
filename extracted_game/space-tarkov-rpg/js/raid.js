// === SEKCJA: STAN RAJDU ===
const params = new URLSearchParams(window.location.search);
const MAP = MAPS[params.get("map") || "tutorial"];
const save = loadSave();
const st = save ? playerStats(save) : null;
const log = termLog;

let raid = null;
let bagView = null;
let groundView = null;
const tipsShown = {};

if (!save || !MAP) {
  window.location.replace("index.html");
} else {
  initRaid();
}

function initRaid() {
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
    over: false,
    repairing: null,
  };
  raid.startLoadout = summarize(raid.bag);
  bagView = mountGrid($("bag-grid"), raid.bag, {
    canMoveIn: canMoveItems,
    onMoveIn: (inst) => gotItem(inst),
    onSelect: renderInfo,
    onChange: onGridChange,
    onQuickMove: (inst) => dropToGround(inst),
  });
  $("take-all").onclick = takeAll;
  log(MAP.intro, "intro");
  tip("start");
  tip("hud");
  enterNode(MAP.start);
  tip("move");
}

function tip(key) {
  if (!MAP.tutorial || !MAP.tips || !MAP.tips[key] || tipsShown[key]) return;
  tipsShown[key] = true;
  log(MAP.tips[key], "tip");
}

// === SEKCJA: LOOT I SIATKA ===
function groundOf(nodeId) {
  if (!raid.ground[nodeId]) raid.ground[nodeId] = newContainer(8, 3, true);
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
  return !raid.enemy && !raid.over;
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

function rollLoot(tableName, rolls) {
  const table = LOOT[tableName].map((e) => ({
    ...e,
    w: e.w * (ITEMS[e.id].rarity === "rare" ? st.rareMult : 1),
  }));
  const total = table.reduce((s, e) => s + e.w, 0);
  const found = [];
  for (let i = 0; i < rolls; i++) {
    let r = Math.random() * total;
    const entry = table.find((e) => (r -= e.w) < 0) || table[0];
    const row = found.find((f) => f.id === entry.id);
    const qty = randInt(entry.min, entry.max);
    if (row) row.qty += qty;
    else found.push({ id: entry.id, qty });
  }
  return found;
}

function addGround(nodeId, items) {
  const ground = groundOf(nodeId);
  items.forEach((r) => addToContainer(ground, r.id, r.qty));
}

// === SEKCJA: INFO O PRZEDMIOCIE ===
function renderInfo() {
  const box = $("item-info");
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
  const h = document.createElement("h3");
  h.textContent = `${it.name}${inst.qty > 1 ? ` x${inst.qty}` : ""}`;
  box.appendChild(h);
  itemStats(inst.id).forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    box.appendChild(p);
  });
  const row = document.createElement("div");
  row.className = "btn-row";
  row.style.marginTop = "8px";
  const inBag = view === bagView;
  if (it.read) row.appendChild(btn("Czytaj", () => readItem(inst)));
  if (it.heal && inBag) row.appendChild(btn("Użyj", () => useInst(inst)));
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
  if (raid.hp === 0) die();
  else if (raid.hp < save.maxHp * 0.5) tip("heal");
  return raid.hp > 0;
}

function tick() {
  raid.moves++;
  if (!MAP.storm) return true;
  if (raid.moves === MAP.storm) log("Burza uderza! Każda akcja rani.", "danger");
  if (raid.moves >= MAP.storm) return damage(MAP.stormDmg, "burza", "danger");
  return true;
}

function move(id) {
  if (raid.enemy || raid.over || raid.repairing) return;
  if (!tick()) return;
  enterNode(id);
}

function enterNode(id) {
  raid.node = id;
  const node = MAP.nodes[id];
  const first = !raid.visited[id];
  raid.visited[id] = true;
  log(first ? `${node.name}: ${node.desc}` : `Wracasz: ${node.name}.`, "scene");
  mountGround();

  if (node.hazard) {
    const dmg = Math.round(node.hazard.dmg * (1 - (st.resist[node.hazard.type] || 0)));
    if (!damage(dmg, node.hazard.label)) return;
  }
  if (node.enemy && !raid.cleared[id] && Math.random() < node.enemy.chance) startCombat(node.enemy.id);
  render();
}

function search() {
  const node = MAP.nodes[raid.node];
  if (raid.enemy || raid.over || raid.searched[raid.node] || !node.loot) return;
  if (!tick()) return render();
  raid.searched[raid.node] = true;
  const found = rollLoot(node.loot.table, node.loot.rolls);
  (node.guaranteed || []).forEach(([id, q]) => found.push({ id, qty: q }));
  addGround(raid.node, found);
  log(`Przeszukujesz: ${node.name}. Znalezione: ${found.map((r) => ITEMS[r.id].name).join(", ") || "nic"}.`);
  edgeGlow("search");
  tip("loot");
  mountGround();
  render();
}

// === SEKCJA: WALKA ===
function startCombat(enemyId) {
  const e = ENEMIES[enemyId];
  raid.enemy = { id: enemyId, ...e, hp: e.hp, maxHp: e.hp };
  log(`${e.name} atakuje! (${e.hp} HP)`, "danger");
  edgeGlow("danger");
  tip("combat");
}

function attack() {
  if (!raid.enemy || raid.over) return;
  const w = bestWeapon(raid.bag);
  const e = raid.enemy;
  if (w.ammo) removeById(raid.bag, w.ammo, 1);
  const acc = w.acc * (w.ammo ? st.rangedAcc : 1);
  if (Math.random() < acc) {
    let dmg = randInt(w.dmg[0], w.dmg[1]);
    if (!w.ammo) dmg = Math.round(dmg * st.meleeMult);
    e.hp = Math.max(0, e.hp - dmg);
    log(`${w.name}: trafiasz ${e.name} za ${dmg}.`, "hit");
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
  if (Math.random() < e.acc) {
    const armor = bestArmor(raid.bag);
    const dmg = Math.max(1, randInt(e.dmg[0], e.dmg[1]) - (armor ? armor.def : 0));
    log(`${e.name} ${e.verb}.`, "enemy");
    damage(dmg, e.name);
  } else {
    log(`${e.name} chybia.`, "miss");
  }
  render();
}

function winCombat() {
  const e = raid.enemy;
  raid.kills++;
  const xp = Math.round(e.xp * st.xpMult);
  raid.xp += xp;
  raid.cleared[raid.node] = true;
  addGround(raid.node, rollLoot(e.loot, e.rolls));
  raid.enemy = null;
  log(`${e.name} pokonany. +${xp} XP.`, "hit");
  edgeGlow("hit");
  mountGround();
  render();
}

function flee() {
  if (!raid.enemy || raid.over) return;
  const chance = Math.max(0.15, 0.55 + st.fleeMod);
  if (Math.random() < chance) {
    const back = MAP.nodes[raid.node].exits[0];
    log("Udaje ci się uciec.", "scene");
    raid.enemy = null;
    if (tick()) enterNode(back);
  } else {
    log("Ucieczka nieudana!", "warn");
    enemyTurn();
  }
}

function healWith(id) {
  const inst = raid.bag.items.find((i) => i.id === id);
  if (inst) useInst(inst);
}

function useInst(inst) {
  const it = ITEMS[inst.id];
  if (!it.heal || raid.over) return;
  if (raid.hp >= save.maxHp) return log("Masz pełne HP.", "warn");
  consumeInst(raid.bag, inst, 1);
  const healed = Math.min(it.heal, save.maxHp - raid.hp);
  raid.hp += healed;
  log(`${it.name}: +${healed} HP.`, "hit");
  edgeGlow("heal");
  if (raid.enemy) enemyTurn();
  else render();
}

// === SEKCJA: NAPRAWA SILNIKA ===
function startRepair() {
  const R = MAP.repair;
  if (!R || raid.enemy || raid.over) return;
  const missing = R.parts.filter((p) => countItem(raid.bag, p) < 1);
  if (missing.length) return log(`Brakuje części: ${missing.map((p) => ITEMS[p].name).join(", ")}.`, "warn");
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
function extract() {
  const node = MAP.nodes[raid.node];
  if (!node.extract || raid.enemy || raid.over) return;
  if (node.extractRequires && !raid.flags[node.extractRequires]) return log("Ewakuacja niedostępna.", "warn");
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
  const tutorialFail = !success && MAP.tutorial;
  let ups = 0;
  if (!tutorialFail) {
    save.hp = success ? raid.hp : Math.ceil(save.maxHp * 0.5);
    ups = grantXp(save, raid.xp);
    save.raids++;
    save.lastLoadout = raid.startLoadout;
    if (success) {
      raid.bag.items.filter((r) => !ITEMS[r.id].quest).forEach((r) => addToContainer(save.stash, r.id, r.qty));
      if (MAP.tutorial) save.tutorialDone = true;
    } else {
      save.deaths++;
    }
    save.loadout.items = [];
    writeSave(save);
  }
  renderEnd(success, tutorialFail, ups);
  if (ups) setTimeout(() => edgeGlow("level"), 900);
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
    const loot = summarize(raid.bag).filter((x) => !ITEMS[x.id].quest).map((r) => `${ITEMS[r.id].name} x${r.qty}`);
    lines.push(`Przeniesiono do magazynu: ${loot.length ? loot.join(", ") : "nic"}`);
  } else if (tutorialFail) {
    lines.push("To był trening - nic nie tracisz. Spróbuj ponownie.");
  } else {
    lines.push("Straciłeś cały zestaw, który zabrałeś na rajd.");
  }
  lines.forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    box.appendChild(p);
  });

  const b = document.createElement("button");
  b.textContent = tutorialFail ? "Spróbuj ponownie" : "Wróć do schronu";
  b.onclick = () => (tutorialFail ? window.location.reload() : (window.location.href = "hideout.html"));
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
  const node = MAP.nodes[raid.node];
  $("loc-name").textContent = node.name;
  $("hp-bar").style.width = `${(raid.hp / save.maxHp) * 100}%`;
  $("hp-text").textContent = `${raid.hp} / ${save.maxHp} HP`;
  $("bag-info").textContent = `${usedCells(raid.bag)} / ${raid.bag.w * raid.bag.h}`;
  $("storm-text").textContent = MAP.storm
    ? raid.moves >= MAP.storm
      ? "BURZA"
      : `Burza za: ${MAP.storm - raid.moves}`
    : "";
  renderArt(node);
  renderObjectives();
  renderActions(node);
  renderInfo();
  refreshGrids();
}

function renderArt(node) {
  const art = $("art");
  art.style.setProperty("--tint", raid.enemy ? "#7f1d1d" : MAP.tint || "#0b192c");
  art.textContent = raid.enemy ? `[Grafika wroga: ${raid.enemy.name}]` : `[Grafika lokacji: ${node.name}]`;
}

function renderObjectives() {
  const box = $("objectives");
  const R = MAP.repair;
  if (!MAP.tutorial || !R) return (box.style.display = "none");
  box.style.display = "block";
  const fixed = !!raid.flags.engineFixed;
  const has = (id) => fixed || countItem(raid.bag, id) > 0;
  const rows = [
    [`Znajdź: ${ITEMS[R.manual].name}`, has(R.manual)],
    ...R.parts.map((p) => [`Znajdź: ${ITEMS[p].name}`, has(p)]),
    ["Napraw silnik przy statku", fixed],
    ["Wystartuj statkiem", false],
  ];
  box.innerHTML = "<h3>Cele</h3>";
  rows.forEach(([text, done]) => {
    const d = document.createElement("div");
    d.className = done ? "done" : "";
    d.textContent = `${done ? "[x]" : "[ ]"} ${text}`;
    box.appendChild(d);
  });
}

function renderActions(node) {
  const box = $("actions");
  box.innerHTML = "";

  if (raid.enemy) {
    const e = raid.enemy;
    const w = bestWeapon(raid.bag);
    const info = document.createElement("div");
    info.className = "enemy-info";
    info.textContent = `${e.name}: ${e.hp} / ${e.maxHp} HP`;
    box.appendChild(info);
    const row = document.createElement("div");
    row.className = "btn-row";
    row.appendChild(btn(`Atak (${w.name}${w.ammo ? `, amunicja: ${countItem(raid.bag, w.ammo)}` : ""})`, attack));
    row.appendChild(btn("Ucieczka", flee, "ghost"));
    box.appendChild(row);
    const healIds = [...new Set(raid.bag.items.filter((i) => ITEMS[i.id].heal).map((i) => i.id))];
    if (healIds.length) {
      const hr = document.createElement("div");
      hr.className = "btn-row";
      healIds.forEach((id) =>
        hr.appendChild(btn(`${ITEMS[id].name} x${countItem(raid.bag, id)} (+${ITEMS[id].heal})`, () => healWith(id), "ghost")),
      );
      box.appendChild(hr);
    }
    return;
  }

  if (raid.repairing) return renderRepair(box);

  const row = document.createElement("div");
  row.className = "btn-row";
  if (node.loot && !raid.searched[raid.node]) row.appendChild(btn("Przeszukaj", search));
  if (node.repair && MAP.repair && !raid.flags.engineFixed) row.appendChild(btn("Napraw silnik", startRepair));
  if (node.extract) {
    const locked = node.extractRequires && !raid.flags[node.extractRequires];
    row.appendChild(btn(node.extractRequires ? "Start (ewakuacja)" : "Ewakuacja", extract, "extract", !!locked));
  }
  node.exits.forEach((id) => row.appendChild(btn(`Idź: ${MAP.nodes[id].name}`, () => move(id), "ghost")));
  box.appendChild(row);
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
