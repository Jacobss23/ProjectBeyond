// === SEKCJA: KONTENERY & LOGIKA SIATKI EKWIPUNKU ===
const CELL = 44;

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

function newContainer(w, h, grow = false) {
  return { w, h, grow, items: [] };
}

function baseSize(id) {
  if (typeof ITEMS === "undefined" || !ITEMS[id]) return [1, 1];
  return ITEMS[id].size || [1, 1];
}

function stackMax(id) {
  if (typeof ITEMS === "undefined" || !ITEMS[id]) return 1;
  return ITEMS[id].stack || 1;
}

function itemDims(inst) {
  const s = baseSize(inst.id);
  return inst.r ? [s[1], s[0]] : [s[0], s[1]];
}

function canPlace(cont, id, x, y, r, ignoreUid) {
  const s = baseSize(id);
  const [w, h] = r ? [s[1], s[0]] : s;
  if (x < 0 || y < 0 || x + w > cont.w || y + h > cont.h) return false;
  return !cont.items.some((o) => {
    if (o.uid === ignoreUid) return false;
    const [ow, oh] = itemDims(o);
    return x < o.x + ow && x + w > o.x && y < o.y + oh && y + h > o.y;
  });
}

// Wstawia GOTOWĄ instancję przedmiotu (razem z zawartością kontenera `inner`) do kontenera.
// Zwraca 0 gdy się udało, 1 gdy brak miejsca. Nie tworzy nowej instancji, więc zawartość nie ginie.
function placeInstance(cont, inst) {
  const spot = findSpot(cont, inst.id);
  if (!spot) return 1;
  inst.x = spot.x;
  inst.y = spot.y;
  inst.r = spot.r;
  cont.items.push(inst);
  return 0;
}

function findSpot(cont, id) {
  const s = baseSize(id);
  const rots = s[0] === s[1] ? [0] : [0, 1];
  for (let y = 0; y < cont.h; y++) {
    for (let x = 0; x < cont.w; x++) {
      for (const r of rots) {
        if (canPlace(cont, id, x, y, r)) return { x, y, r };
      }
    }
  }
  return null;
}

function addToContainer(cont, id, qty = 1) {
  let left = qty;
  const max = stackMax(id);
  if (max > 1) {
    for (const o of cont.items) {
      if (o.id !== id || o.qty >= max || left <= 0) continue;
      const t = Math.min(max - o.qty, left);
      o.qty += t;
      left -= t;
    }
  }
  const minDim = Math.min(...baseSize(id));
  while (left > 0) {
    const spot = findSpot(cont, id);
    if (!spot) {
      if (cont.grow && cont.h < 300 && minDim <= cont.w) {
        cont.h++;
        continue;
      }
      break;
    }
    const q = Math.min(max, left);
    const inst = { uid: uid(), id, x: spot.x, y: spot.y, r: spot.r, qty: q };
    if (ITEMS[id]?.container) inst.inner = newContainer(ITEMS[id].container.inner[0], ITEMS[id].container.inner[1], false);
    cont.items.push(inst);
    left -= q;
  }
  return left;
}

// Liczy też przedmioty wewnątrz kontenerów (zadania i crafting widzą zawartość).
function countItem(cont, id) {
  return cont.items.reduce((s, o) => s + (o.id === id ? o.qty : 0) + (o.inner ? countItem(o.inner, id) : 0), 0);
}

function removeById(cont, id, qty = 1) {
  if (countItem(cont, id) < qty) return false;
  removeFromTree(cont, id, qty);
  return true;
}

// Zdejmuje `left` sztuk przedmiotu najpierw z magazynu, potem z kontenerów. Zwraca, ile zostało.
function removeFromTree(cont, id, left) {
  const rows = cont.items.filter((o) => o.id === id).sort((a, b) => a.qty - b.qty);
  for (const o of rows) {
    if (left <= 0) break;
    const t = Math.min(o.qty, left);
    o.qty -= t;
    left -= t;
    if (o.qty <= 0) cont.items.splice(cont.items.indexOf(o), 1);
  }
  for (const o of [...cont.items]) {
    if (left > 0 && o.inner) left = removeFromTree(o.inner, id, left);
  }
  return left;
}

// Dopina wnętrze kontenerom, które go nie mają (stare zapisy, nagrody, zakupy).
function ensureInner(cont) {
  cont.items.forEach((o) => {
    const cfg = ITEMS[o.id]?.container;
    if (!cfg) return;
    if (!o.inner) o.inner = newContainer(cfg.inner[0], cfg.inner[1], false);
    ensureInner(o.inner);
  });
  return cont;
}

// Czy kontener `containerId` przyjmie przedmiot `itemId`. Kontenery nigdy nie mieszczą się w kontenerach.
function containerAccepts(containerId, itemId) {
  const cfg = ITEMS[containerId]?.container;
  const it = ITEMS[itemId];
  if (!cfg || !it) return false;
  if (it.type === "container") return false;
  if (it.quest) return false;
  if (cfg.ids) return cfg.ids.includes(itemId);
  return cfg.types.includes(it.type);
}

function consumeInst(cont, inst, qty = 1) {
  inst.qty -= qty;
  if (inst.qty <= 0) cont.items.splice(cont.items.indexOf(inst), 1);
}

function usedCells(cont) {
  return cont.items.reduce((s, o) => {
    const [w, h] = itemDims(o);
    return s + w * h;
  }, 0);
}

function summarize(cont) {
  const map = {};
  cont.items.forEach((o) => (map[o.id] = (map[o.id] || 0) + o.qty));
  return Object.entries(map).map(([id, qty]) => ({ id, qty }));
}

function toContainer(x, w, h, grow) {
  if (x && Array.isArray(x.items)) {
    x.grow = grow;
    return ensureInner(x);
  }
  const c = newContainer(w, h, grow);
  if (Array.isArray(x)) {
    x.forEach((r) => {
      if (typeof ITEMS !== "undefined" && ITEMS[r.id]) {
        addToContainer(c, r.id, r.qty);
      }
    });
  }
  return ensureInner(c);
}

function itemStats(id) {
  if (typeof ITEMS === "undefined" || !ITEMS[id]) return [];
  const it = ITEMS[id];
  const lines = [`Rozmiar: ${baseSize(id).join("x")}`];
  if (it.type === "weapon") {
    lines.push(`Kaliber: ${it.caliber || "—"}`);
    lines.push(`Obrażenia: ${it.dmg[0]}-${it.dmg[1]}, celność: ${Math.round(it.acc * 100)}%`);
    if (it.ammo && ITEMS[it.ammo]) lines.push(`Amunicja: ${ITEMS[it.ammo].name}`);
  }
  if (it.def) lines.push(`Pancerz: -${it.def} obrażeń`);
  if (it.heal) lines.push(`Leczenie: +${it.heal} HP`);
  if (it.use) lines.push(`Działanie: ${it.use}`);
  if (it.stack) lines.push(`Stos: do ${it.stack}`);
  if (it.container) lines.push(`Wnętrze: ${it.container.inner.join("x")}`, `Przyjmuje: ${it.container.label}`);
  if (it.quest) lines.push("Przedmiot zadaniowy");
  else lines.push(`Wartość: ${it.value} kr`);
  return lines;
}

// === SEKCJA: RENDEROWANIE SIATKI & OBSŁUGA INTERAKCJI ===
const gridViews = new Map();
let selected = null;
let drag = null;
let lastClickInfo = { uid: null, time: 0 };

function mountGrid(el, cont, opts = {}) {
  if (!el) return null;
  const view = { el, cont, opts };
  gridViews.set(el, view);
  el.classList.add("grid");
  renderGrid(view);
  return view;
}

function getSelected() {
  if (!selected) return null;
  const inst = selected.view.cont.items.find((o) => o.uid === selected.uid);
  if (!inst) {
    selected = null;
    return null;
  }
  return { view: selected.view, inst };
}

function renderGrid(view) {
  const { el, cont } = view;
  el.style.width = `${cont.w * CELL}px`;
  el.style.height = `${cont.h * CELL}px`;
  el.innerHTML = "";

  cont.items.forEach((inst) => {
    const it = ITEMS[inst.id] || { name: inst.id, type: "junk" };
    const [w, h] = itemDims(inst);
    const d = document.createElement("div");
    const isSel = selected && selected.uid === inst.uid;
    d.className = `item it-${it.type}${it.tone ? ` it-tone-${it.tone}` : ""}${it.category ? ` it-cat-${it.category}` : ""}${isSel ? " selected" : ""}${it.quest ? " item-quest" : ""}`;
    d.style.cssText = `left:${inst.x * CELL}px;top:${inst.y * CELL}px;width:${w * CELL}px;height:${h * CELL}px;`;
    d.title = (it.quest ? `[PRZEDMIOT FABULARNY // QUEST] ${it.name}` : it.name) + (inst.inner ? ` (w środku: ${inst.inner.items.length})` : "");

    const icon = typeof ITEM_ICONS !== "undefined" ? ITEM_ICONS[inst.id] : null;
    if (icon) {
      d.classList.add("it-has-icon");
      if (w * h === 1) d.classList.add("it-single");
      const ic = document.createElement("span");
      ic.className = "it-icon";
      ic.innerHTML = icon;
      d.appendChild(ic);
    }
    const label = document.createElement("span");
    label.className = "it-label";
    label.textContent = w * h === 1 ? it.name.slice(0, 3) : it.name;
    if (icon && w * h === 1) label.style.display = "none";
    d.appendChild(label);

    if (it.quest) {
      const qb = document.createElement("span");
      qb.className = "quest-badge-tag";
      qb.style.position = "absolute";
      qb.style.top = "1px";
      qb.style.right = "1px";
      qb.style.fontSize = "0.55rem";
      qb.style.padding = "1px 3px";
      qb.textContent = "Q";
      d.appendChild(qb);
    }

    if (inst.qty > 1) {
      const q = document.createElement("em");
      q.className = "it-qty";
      q.textContent = inst.qty;
      d.appendChild(q);
    }

    // Pointer eventy dla stabilnego przeciągania i szybkiego przenoszenia
    d.addEventListener("pointerdown", (e) => onPointerDownItem(e, view, inst, d));

    // Podwójne kliknięcie (dodatkowe zabezpieczenie dla szybkiego przenoszenia)
    d.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (view.opts.onQuickMove) view.opts.onQuickMove(inst, view);
    });

    el.appendChild(d);
  });
}

function refreshGrids() {
  gridViews.forEach((view) => {
    if (view.el && view.el.isConnected) {
      renderGrid(view);
    }
  });
}

function selectItem(view, inst) {
  selected = inst ? { view, uid: inst.uid } : null;
  refreshGrids();
  if (view.opts.onSelect) view.opts.onSelect(inst, view);
}

function rotateSelected() {
  const sel = getSelected();
  if (!sel) return false;
  const { view, inst } = sel;
  const newR = inst.r ? 0 : 1;
  if (!canPlace(view.cont, inst.id, inst.x, inst.y, newR, inst.uid)) return false;
  inst.r = newR;
  renderGrid(view);
  if (view.opts.onChange) view.opts.onChange();
  return true;
}

function quickMove(from, to, inst) {
  if (!from || !to || !inst) return 0;
  if (to.opts.canMoveIn && !to.opts.canMoveIn(inst, from)) return 0;
  // Kontener przenosimy jako całość, żeby nie stracił zawartości
  if (inst.inner) {
    const spot = findSpot(to.cont, inst.id);
    if (!spot) return 0;
    from.cont.items.splice(from.cont.items.indexOf(inst), 1);
    placeInstance(to.cont, inst);
    if (selected && selected.uid === inst.uid) selected = null;
    if (to.opts.onMoveIn) to.opts.onMoveIn({ id: inst.id, qty: 1 }, from);
    if (from.opts.onChange) from.opts.onChange();
    if (to.opts.onChange) to.opts.onChange();
    refreshGrids();
    return 1;
  }
  const before = inst.qty;
  const left = addToContainer(to.cont, inst.id, before);
  const placed = before - left;
  if (!placed) return 0;
  consumeInst(from.cont, inst, placed);
  if (selected && selected.uid === inst.uid) selected = null;
  if (to.opts.onMoveIn) to.opts.onMoveIn({ id: inst.id, qty: placed }, from);
  if (from.opts.onChange) from.opts.onChange();
  if (to.opts.onChange) to.opts.onChange();
  refreshGrids();
  return placed;
}

// Sprawdzenie, nad którą WIDOCZNĄ siatką znajduje się kursor
function viewAtPoint(x, y) {
  for (const [el, view] of gridViews.entries()) {
    if (!el || !el.isConnected) continue;
    // Pomiń siatki w ukrytych zakładkach
    if (el.offsetParent === null) continue;
    const r = el.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      return view;
    }
  }
  return null;
}

function clearEqSlotHover() {
  document.querySelectorAll("[data-eq-slot]").forEach((el) => {
    el.classList.remove("eq-slot-hover-ok", "eq-slot-hover-bad", "hover-ok", "hover-bad");
  });
}

function clearHint() {
  document.querySelectorAll(".drop-hint").forEach((h) => h.remove());
  clearEqSlotHover();
}

// === SEKCJA: DRAG & DROP OBSŁUGA ===
function onPointerDownItem(e, view, inst, node) {
  if (e.button === 2) {
    // Prawy przycisk myszy - obrót w miejscu jeśli nie przeciągamy
    e.preventDefault();
    selectItem(view, inst);
    rotateSelected();
    return;
  }
  if (e.button !== 0) return;

  const now = Date.now();
  // Obsługa podwójnego kliknięcia lub Shift+Klik do natychmiastowego przerzucania
  if (e.shiftKey || (lastClickInfo.uid === inst.uid && now - lastClickInfo.time < 350)) {
    lastClickInfo = { uid: null, time: 0 };
    if (view.opts.onQuickMove) {
      view.opts.onQuickMove(inst, view);
      return;
    }
  }
  lastClickInfo = { uid: inst.uid, time: now };

  const rect = node.getBoundingClientRect();
  drag = {
    view,
    inst,
    node,
    sx: e.clientX,
    sy: e.clientY,
    lx: e.clientX,
    ly: e.clientY,
    offX: e.clientX - rect.left,
    offY: e.clientY - rect.top,
    r: inst.r || 0,
    moved: false,
    ghost: null,
    target: null,
    res: null,
  };

  window.addEventListener("pointermove", onDragMove);
  window.addEventListener("pointerup", onDragEnd);
}

function ghostSize() {
  if (!drag) return [1, 1];
  const s = baseSize(drag.inst.id);
  return drag.r ? [s[1], s[0]] : [s[0], s[1]];
}

function onDragMove(e) {
  if (!drag) return;
  drag.lx = e.clientX;
  drag.ly = e.clientY;

  if (!drag.moved) {
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 4) return;
    drag.moved = true;

    // Tworzenie ducha przeciąganego elementu
    const g = document.createElement("div");
    g.className = `item it-${ITEMS[drag.inst.id]?.type || "junk"}${ITEMS[drag.inst.id]?.category ? ` it-cat-${ITEMS[drag.inst.id].category}` : ""} drag-ghost`;
    const [w, h] = ghostSize();
    g.style.width = `${w * CELL}px`;
    g.style.height = `${h * CELL}px`;
    g.style.position = "fixed";
    g.style.pointerEvents = "none";
    g.style.zIndex = "9999";
    g.style.opacity = "0.85";
    g.style.boxShadow = "0 0 20px rgba(56, 189, 248, 0.6)";

    const label = document.createElement("span");
    label.className = "it-label";
    label.textContent = ITEMS[drag.inst.id]?.name || drag.inst.id;
    g.appendChild(label);

    document.body.appendChild(g);
    drag.ghost = g;
    drag.node.classList.add("dragging");
  }

  updateDrag();
}

function updateDrag() {
  if (!drag || !drag.ghost) return;
  const [w, h] = ghostSize();
  const g = drag.ghost;
  g.style.width = `${w * CELL}px`;
  g.style.height = `${h * CELL}px`;

  // Bezpieczne przesunięcie kursora
  const posX = drag.lx - Math.min(drag.offX, w * CELL - 6);
  const posY = drag.ly - Math.min(drag.offY, h * CELL - 6);
  g.style.left = `${posX}px`;
  g.style.top = `${posY}px`;

  clearHint();

  // Sprawdzenie czy kursor unosi się nad slotem wyposażenia
  const hoveredEl = document.elementFromPoint(drag.lx, drag.ly);
  const eqSlotEl = hoveredEl ? hoveredEl.closest("[data-eq-slot]") : null;

  if (eqSlotEl) {
    const slotId = eqSlotEl.dataset.eqSlot;
    const curSave = typeof save !== "undefined" && save ? save : (typeof loadSave === "function" ? loadSave() : null);
    const it = typeof ITEMS !== "undefined" ? ITEMS[drag.inst.id] : null;
    let valid = false;
    if (it && curSave) {
      if (slotId === "armor" && it.type === "armor") valid = true;
      if (slotId === "ranged" && it.type === "weapon" && it.ammo) valid = true;
      if (slotId === "ranged2" && it.type === "weapon" && it.ammo && typeof hasHolster === "function" && hasHolster(curSave)) valid = true;
      if (slotId === "melee" && it.type === "weapon" && !it.ammo) valid = true;
    }
    eqSlotEl.classList.add(valid ? "hover-ok" : "hover-bad");
    drag.targetEqSlot = { slotId, valid, el: eqSlotEl };
    drag.target = null;
    drag.res = null;
    return;
  } else {
    drag.targetEqSlot = null;
  }

  drag.target = viewAtPoint(drag.lx, drag.ly);
  drag.res = null;
  if (!drag.target) return;

  const gr = drag.target.el.getBoundingClientRect();
  const rawX = (posX - gr.left) / CELL;
  const rawY = (posY - gr.top) / CELL;
  const x = Math.round(rawX);
  const y = Math.round(rawY);

  drag.res = dropCheck(drag.target, x, y);

  const hint = document.createElement("div");
  hint.className = `drop-hint ${drag.res.ok ? "ok" : "bad"}`;
  // Wrzucanie do kontenera: podświetlamy cały kontener, nie duszka
  const hb = drag.res.intoBox || drag.res.refusedBox;
  if (hb) {
    const [bw, bh] = itemDims(hb);
    hint.style.cssText = `left:${hb.x * CELL}px;top:${hb.y * CELL}px;width:${bw * CELL}px;height:${bh * CELL}px;position:absolute;z-index:5;pointer-events:none;`;
  } else {
    hint.style.cssText = `left:${x * CELL}px;top:${y * CELL}px;width:${w * CELL}px;height:${h * CELL}px;position:absolute;z-index:5;pointer-events:none;`;
  }
  drag.target.el.appendChild(hint);
}

function dropCheck(target, x, y) {
  const inst = drag.inst;
  const same = target === drag.view;
  if (!same && target.opts.canMoveIn && !target.opts.canMoveIn(inst, drag.view)) {
    return { ok: false, x, y };
  }
  const max = stackMax(inst.id);
  if (max > 1) {
    const under = target.cont.items.find((o) => {
      if (o.uid === inst.uid || o.id !== inst.id || o.qty >= max) return false;
      const [ow, oh] = itemDims(o);
      return x >= o.x && x < o.x + ow && y >= o.y && y < o.y + oh;
    });
    if (under) return { ok: true, merge: under, x, y };
  }
  // Upuszczenie na zamknięty kontener w siatce: liczy komórka POD KURSOREM (dowolne z pól kontenera)
  const gr = target.el.getBoundingClientRect();
  const cx = Math.floor((drag.lx - gr.left) / CELL);
  const cy = Math.floor((drag.ly - gr.top) / CELL);
  const inBox = (o) => {
    const [ow, oh] = itemDims(o);
    return cx >= o.x && cx < o.x + ow && cy >= o.y && cy < o.y + oh;
  };
  const box = target.cont.items.find((o) => o.uid !== inst.uid && ITEMS[o.id]?.container && containerAccepts(o.id, inst.id) && inBox(o));
  if (box) return { ok: true, intoBox: box, x, y };
  const refused = target.cont.items.find((o) => o.uid !== inst.uid && ITEMS[o.id]?.container && inBox(o));
  if (refused) return { ok: false, refusedBox: refused, x, y };
  return { ok: canPlace(target.cont, inst.id, x, y, drag.r, same ? inst.uid : null), x, y };
}

function onDragEnd() {
  window.removeEventListener("pointermove", onDragMove);
  window.removeEventListener("pointerup", onDragEnd);
  const d = drag;
  drag = null;
  if (!d) return;

  clearHint();

  if (!d.moved) {
    selectItem(d.view, d.inst);
    return;
  }

  if (d.ghost) d.ghost.remove();
  d.node.classList.remove("dragging");

  if (d.targetEqSlot) {
    if (d.targetEqSlot.valid) {
      const curSave = typeof save !== "undefined" && save ? save : (typeof loadSave === "function" ? loadSave() : null);
      if (curSave) {
        const ok = typeof equipItem === "function" ? equipItem(curSave, d.inst.id, d.targetEqSlot.slotId, d.view.cont, d.inst) : false;
        if (ok) {
          if (typeof writeSave === "function") writeSave(curSave);
          if (typeof persist === "function") persist();
          if (typeof renderAll === "function") renderAll();
          if (typeof render === "function") render();
          if (typeof termLog === "function") termLog(`Założono na siebie: ${ITEMS[d.inst.id]?.name || d.inst.id}.`, "hit");
          return;
        }
      }
    } else {
      if (typeof termLog === "function") termLog("Nie można założyć tego przedmiotu w tym slocie!", "warn");
    }
    refreshGrids();
    return;
  }

  const { target, res, inst } = d;

  // Bezpieczne cofnięcie jeśli upuszczono w złym miejscu lub poza siatką
  if (!target || !res || !res.ok) {
    if (typeof say === "function") {
      if (res && res.refusedBox) {
        say(`${ITEMS[res.refusedBox.id].name} nie przyjmuje: ${ITEMS[inst.id]?.name || inst.id}.`, "warn");
      } else if (target && target !== d.view && target.opts.canMoveIn && !target.opts.canMoveIn(inst, d.view)) {
        const cname = target.opts.containerName || "Kontener";
        say(`${cname} nie przyjmuje: ${ITEMS[inst.id]?.name || inst.id}.`, "warn");
      }
    }
    refreshGrids();
    return;
  }

  if (res.intoBox) {
    const box = res.intoBox;
    if (!box.inner) {
      const cfg = ITEMS[box.id].container;
      box.inner = newContainer(cfg.inner[0], cfg.inner[1], false);
    }
    const before = inst.qty;
    const left = addToContainer(box.inner, inst.id, before);
    const placed = before - left;
    const name = ITEMS[inst.id]?.name || inst.id;
    const bname = ITEMS[box.id].name;
    if (placed > 0) consumeInst(d.view.cont, inst, placed);
    if (typeof say === "function") {
      if (placed) say(`Wrzucono do ${bname}: ${name}${placed > 1 ? ` x${placed}` : ""}.`);
      else say(`Brak miejsca w ${bname}: ${name}.`, "warn");
    }
    if (d.view.opts.onChange) d.view.opts.onChange();
    refreshGrids();
    return;
  }

  if (res.merge) {
    const t = Math.min(stackMax(inst.id) - res.merge.qty, inst.qty);
    res.merge.qty += t;
    consumeInst(d.view.cont, inst, t);
    if (target !== d.view && target.opts.onMoveIn) {
      target.opts.onMoveIn({ id: inst.id, qty: t }, d.view);
    }
  } else if (target === d.view) {
    inst.x = res.x;
    inst.y = res.y;
    inst.r = d.r;
  } else {
    d.view.cont.items.splice(d.view.cont.items.indexOf(inst), 1);
    inst.x = res.x;
    inst.y = res.y;
    inst.r = d.r;
    target.cont.items.push(inst);
    if (target.opts.onMoveIn) target.opts.onMoveIn(inst, d.view);
  }

  selected = { view: target, uid: inst.uid };
  if (d.view.opts.onChange) d.view.opts.onChange();
  if (target !== d.view && target.opts.onChange) target.opts.onChange();
  refreshGrids();
}

// Obracanie klawiszem R (bez Shift). Shift+R w rajdzie zbiera wszystko.
if (typeof document !== "undefined") {
  document.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") {
      if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName || "")) return;
      if (e.shiftKey) {
        return; // Shift+R obsługuje wyłącznie raid.js (zabierz wszystko) - tu nie robimy nic
      } else {
        if (drag && drag.moved) {
          e.preventDefault();
          drag.r = drag.r ? 0 : 1;
          updateDrag();
        } else {
          if (typeof rotateSelected === "function") {
            const ok = rotateSelected();
            if (ok) e.preventDefault();
          }
        }
      }
    }
  });

  // Obracanie prawym przyciskiem myszy podczas przeciągania
  document.addEventListener("contextmenu", (e) => {
    if (drag && drag.moved) {
      e.preventDefault();
      drag.r = drag.r ? 0 : 1;
      updateDrag();
    }
  });
}
