// === SEKCJA: INICJALIZACJA ===
const save = loadSave();
const st = save ? playerStats(save) : null;
const say = termLog;

let curTrader = TRADERS[0].id;
let openModule = null;
let stashView = null;
let loadView = null;
let sellView = null;
const trader = () => TRADERS.find((t) => t.id === curTrader);

if (!save) {
  window.location.replace("index.html");
} else {
  document.addEventListener("DOMContentLoaded", init);
}

function init() {
  const common = { onChange: persist };
  stashView = mountGrid($("stash-grid"), save.stash, {
    ...common,
    onSelect: () => renderInvInfo(),
    onQuickMove: (inst) => moveBetween(stashView, loadView, inst),
  });
  loadView = mountGrid($("load-grid"), save.loadout, {
    ...common,
    onSelect: () => renderInvInfo(),
    onQuickMove: (inst) => moveBetween(loadView, stashView, inst),
  });
  sellView = mountGrid($("sell-grid"), save.stash, {
    ...common,
    onSelect: () => renderSellInfo(),
    onQuickMove: () => {},
  });
  renderAll();
  say("Terminal schronu aktywny. Wybierz opcję.", "intro");
}

function persist() {
  writeSave(save);
  renderAll();
}

function goTo(screenId) {
  showScreen(screenId);
  setTimeout(renderAll, 450);
}

function btn(label, fn, cls = "", disabled = false) {
  const b = document.createElement("button");
  b.textContent = label;
  b.className = `sm ${cls}`;
  b.disabled = disabled;
  b.onclick = fn;
  return b;
}

function row(text, ...buttons) {
  const r = document.createElement("div");
  r.className = "row";
  const label = document.createElement("span");
  label.textContent = text;
  r.appendChild(label);
  const act = document.createElement("span");
  buttons.forEach((b) => act.appendChild(b));
  r.appendChild(act);
  return r;
}

function fill(id, rows, emptyText = "Pusto.") {
  const box = $(id);
  box.innerHTML = "";
  if (!rows.length) box.textContent = emptyText;
  rows.forEach((r) => box.appendChild(r));
}

// === SEKCJA: RENDER ===
function renderAll() {
  renderStatus();
  renderInvInfo();
  renderSellInfo();
  renderTrader();
  renderShip();
  renderModule();
  renderRaidList();
  $("stash-info").textContent = `${usedCells(save.stash)} / ${save.stash.w * save.stash.h}`;
  $("load-info").textContent = `${usedCells(save.loadout)} / ${save.loadout.w * save.loadout.h}`;
  refreshGrids();
}

function renderStatus() {
  $("hub-title").textContent = `Schron - ${save.name}`;
  const lines = [
    ["Planeta", save.planet],
    ["Poziom", `${save.level} (XP ${save.xp} / ${xpForLevel(save.level)})`],
    ["HP", `${save.hp} / ${save.maxHp}`],
    ["Kredyty", save.credits],
    ["Statek", save.kit],
    ["Aktywne moduły", SHIP_MODULES.filter((m) => moduleActive(save, m.id)).map((m) => m.id).join(", ")],
    ["Cechy", save.traits.length ? save.traits.join(", ") : "brak"],
    ["Rajdy / zgony", `${save.raids} / ${save.deaths}`],
  ];
  const box = $("hub-status");
  box.innerHTML = "";
  lines.forEach(([k, v]) => {
    const d = document.createElement("div");
    d.className = "stat-line";
    const a = document.createElement("span");
    a.textContent = k;
    const b = document.createElement("span");
    b.textContent = v;
    d.append(a, b);
    box.appendChild(d);
  });
}

function infoInto(box, sel, buttons) {
  box.innerHTML = "";
  if (!sel) {
    const p = document.createElement("p");
    p.className = "hint";
    p.textContent = "Kliknij przedmiot, aby zobaczyć szczegóły. Przeciągaj, aby przenosić. R obraca. Dwuklik - szybki transfer.";
    box.appendChild(p);
    return;
  }
  const it = ITEMS[sel.inst.id];
  const h = document.createElement("h3");
  h.textContent = `${it.name}${sel.inst.qty > 1 ? ` x${sel.inst.qty}` : ""}`;
  box.appendChild(h);
  itemStats(sel.inst.id).forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    box.appendChild(p);
  });
  const r = document.createElement("div");
  r.className = "btn-row";
  r.style.marginTop = "8px";
  buttons.forEach((b) => r.appendChild(b));
  box.appendChild(r);
}

function renderInvInfo() {
  const sel = getSelected();
  const inLoad = sel && sel.view === loadView;
  const buttons = sel
    ? [
        btn("Obróć (R)", () => rotateSelected(), "ghost"),
        btn(inLoad ? "Do magazynu" : "Do zestawu", () => moveBetween(sel.view, inLoad ? stashView : loadView, sel.inst)),
      ]
    : [];
  infoInto($("inv-info"), sel, buttons);
}

function renderSellInfo() {
  const sel = getSelected();
  const buttons = [];
  if (sel) {
    const it = ITEMS[sel.inst.id];
    if (it.quest) buttons.push(btn("Nie na sprzedaż", () => {}, "ghost", true));
    else {
      buttons.push(btn(`Sprzedaj 1 (${sellPrice(sel.inst.id)} kr)`, () => sell(sel.inst, 1)));
      if (sel.inst.qty > 1) buttons.push(btn(`Cały stos (${sellPrice(sel.inst.id) * sel.inst.qty} kr)`, () => sell(sel.inst, sel.inst.qty), "ghost"));
    }
  }
  infoInto($("sell-info"), sel, buttons);
}

function renderTrader() {
  const tr = trader();
  const tabs = $("trader-tabs");
  tabs.innerHTML = "";
  TRADERS.forEach((t) => tabs.appendChild(btn(t.name, () => selectTrader(t.id), t.id === curTrader ? "" : "ghost")));
  $("trader-desc").textContent = tr.desc;
  $("trader-credits").textContent = `Kredyty: ${save.credits}`;
  fill(
    "trader-buy",
    tr.stock.map((id) => {
      const price = buyPrice(id);
      return row(`${ITEMS[id].name} - ${price} kr`, btn("Kup", () => buy(id), "", save.credits < price));
    }),
  );
}

function renderShip() {
  const box = $("ship-list");
  box.innerHTML = "";
  SHIP_MODULES.forEach((m) => {
    const active = moduleActive(save, m.id);
    const p = document.createElement("div");
    p.className = "panel";
    const h = document.createElement("h3");
    h.textContent = `${m.id} - ${active ? `aktywny (poz. ${save.ship.modules[m.id].level})` : "nieaktywny"}`;
    const d = document.createElement("p");
    d.textContent = active ? m.desc : `Wymaga: ${m.unlock ? `${m.unlock.quest} lub poziom ${m.unlock.level}` : "[placeholder]"}`;
    p.append(h, d);
    const r = document.createElement("div");
    r.className = "btn-row";
    r.appendChild(btn("Otwórz", () => openMod(m.id), "", !active));
    r.appendChild(btn("Ulepsz (placeholder)", () => {}, "ghost", true));
    p.appendChild(r);
    box.appendChild(p);
  });
}

function renderModule() {
  const m = SHIP_MODULES.find((x) => x.id === openModule);
  if (!m) return;
  $("module-title").textContent = `Moduł: ${m.id}`;
  $("module-desc").textContent = m.id === "Medyczny" ? `${m.desc} Odpoczynek przywraca pełne HP.` : m.desc;
  const list = RECIPES.filter((r) => r.module === m.id);
  fill(
    "module-recipes",
    list.map((r) => {
      const needs = r.in.map(([id, q]) => `${ITEMS[id].name} x${q}`).join(", ");
      const ok = r.in.every(([id, q]) => countItem(save.stash, id) >= q);
      return row(`${r.name} (${needs})`, btn("Wytwórz", () => craft(r.id), "", !ok));
    }),
    "[Brak receptur - placeholder]",
  );
}

function renderRaidList() {
  const box = $("raid-list");
  box.innerHTML = "";
  const entries = save.tutorialDone ? Object.entries(MAPS).filter(([, m]) => !m.tutorial) : [["tutorial", MAPS.tutorial]];
  entries.forEach(([id, m]) => {
    const p = document.createElement("div");
    p.className = "panel";
    const h = document.createElement("h3");
    h.textContent = m.name;
    const d = document.createElement("p");
    d.textContent = m.intro + (m.storm ? ` Burza po ${m.storm} akcjach.` : "");
    p.append(h, d, btn("Wyrusz", () => startRaid(id)));
    box.appendChild(p);
  });
  const info = document.createElement("p");
  info.className = "msg";
  info.textContent = save.tutorialDone ? "Śmierć w rajdzie oznacza utratę zestawu." : "Najpierw ukończ rajd treningowy.";
  box.appendChild(info);
}

// === SEKCJA: AKCJE ===
function moveBetween(from, to, inst) {
  const name = ITEMS[inst.id].name;
  if (!quickMove(from, to, inst)) return say(`Brak miejsca: ${name}.`, "warn");
  say(`Przeniesiono: ${name}.`);
}

function clearLoadout() {
  const left = [];
  [...save.loadout.items].forEach((o) => {
    if (addToContainer(save.stash, o.id, o.qty)) left.push(o);
  });
  save.loadout.items = left;
  say("Zestaw odłożony do magazynu.");
  persist();
}

function repeatLoadout() {
  clearLoadout();
  let skipped = false;
  save.lastLoadout.forEach((r) => {
    const n = Math.min(r.qty, countItem(save.stash, r.id));
    if (n < r.qty) skipped = true;
    if (!n) return;
    removeById(save.stash, r.id, n);
    const left = addToContainer(save.loadout, r.id, n);
    if (left) {
      skipped = true;
      addToContainer(save.stash, r.id, left);
    }
  });
  say(skipped ? "Część poprzedniego zestawu niedostępna lub nie mieści się w plecaku." : "Poprzedni zestaw załadowany.", skipped ? "warn" : "");
  persist();
}

const buyPrice = (id) => Math.ceil(ITEMS[id].value * trader().buyMult);
const sellPrice = (id) => Math.floor(ITEMS[id].value * trader().sellMult);

function selectTrader(id) {
  curTrader = id;
  say(`Handlarz: ${trader().name}.`);
  renderTrader();
  renderSellInfo();
}

function openMod(id) {
  openModule = id;
  say(`Moduł: ${id}.`, "tip");
  renderModule();
  goTo("hub-module");
}

function buy(id) {
  const price = buyPrice(id);
  if (save.credits < price) return say("Za mało kredytów.", "warn");
  save.credits -= price;
  addToContainer(save.stash, id, 1);
  say(`Kupiono: ${ITEMS[id].name} (-${price} kr).`);
  edgeGlow("loot");
  persist();
}

function sell(inst, qty) {
  const id = inst.id;
  const gain = sellPrice(id) * qty;
  consumeInst(save.stash, inst, qty);
  save.credits += gain;
  say(`Sprzedano: ${ITEMS[id].name} x${qty} (+${gain} kr).`, "hit");
  edgeGlow("heal");
  persist();
}

function craft(recipeId) {
  const r = RECIPES.find((x) => x.id === recipeId);
  if (!r.in.every(([id, q]) => countItem(save.stash, id) >= q)) return say("Brak materiałów.", "warn");
  r.in.forEach(([id, q]) => removeById(save.stash, id, q));
  addToContainer(save.stash, r.out[0], r.out[1]);
  say(`Wytworzono: ${r.name}.`, "hit");
  edgeGlow("tech");
  persist();
}

function rest() {
  const target = moduleActive(save, "Medyczny") ? save.maxHp : Math.ceil(save.maxHp * 0.6);
  if (save.hp >= target) return say("Nie ma potrzeby odpoczynku.", "warn");
  save.hp = target;
  say(`Odpoczywasz. HP: ${save.hp} / ${save.maxHp}.`, "hit");
  edgeGlow("heal");
  persist();
}

function startRaid(mapId) {
  if (!save.loadout.items.length && !confirm("Zestaw jest pusty. Wyruszyć z pustymi rękami?")) return;
  if (save.hp < save.maxHp * 0.3 && !confirm("Masz bardzo mało HP. Wyruszyć mimo to?")) return;
  window.location.href = `raid.html?map=${mapId}`;
}
