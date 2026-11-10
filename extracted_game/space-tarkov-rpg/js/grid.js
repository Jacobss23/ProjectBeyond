// === SEKCJA: KONTENERY (LOGIKA SIATKI) ===
const CELL = 36;

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

function newContainer(w, h, grow = false) {
  return { w, h, grow, items: [] };
}

function baseSize(id) {
  return ITEMS[id].size || [1, 1];
}

function stackMax(id) {
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

function findSpot(cont, id) {
  const s = baseSize(id);
  const rots = s[0] === s[1] ? [0] : [0, 1];
  for (let y = 0; y < cont.h; y++)
    for (let x = 0; x < cont.w; x++)
      for (const r of rots) if (canPlace(cont, id, x, y, r)) return { x, y, r };
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
    cont.items.push({ uid: uid(), id, x: spot.x, y: spot.y, r: spot.r, qty: q });
    left -= q;
  }
  return left;
}

function countItem(cont, id) {
  return cont.items.filter((o) => o.id === id).reduce((s, o) => s + o.qty, 0);
}

function removeById(cont, id, qty = 1) {
  if (countItem(cont, id) < qty) return false;
  let left = qty;
  const rows = cont.items.filter((o) => o.id === id).sort((a, b) => a.qty - b.qty);
  for (const o of rows) {
    const t = Math.min(o.qty, left);
    o.qty -= t;
    left -= t;
    if (o.qty <= 0) cont.items.splice(cont.items.indexOf(o), 1);
    if (!left) break;
  }
  return true;
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
    return x;
  }
  const c = newContainer(w, h, grow);
  if (Array.isArray(x)) x.forEach((r) => ITEMS[r.id] && addToContainer(c, r.id, r.qty));
  return c;
}

function itemStats(id) {
  const it = ITEMS[id];
  const lines = [`Rozmiar: ${baseSize(id).join("x")}`];
  if (it.type === "weapon") {
    lines.push(`Obrażenia: ${it.dmg[0]}-${it.dmg[1]}, celność: ${Math.round(it.acc * 100)}%`);
    if (it.ammo) lines.push(`Amunicja: ${ITEMS[it.ammo].name}`);
  }
  if (it.def) lines.push(`Pancerz: -${it.def} obrażeń`);
  if (it.heal) lines.push(`Leczenie: +${it.heal} HP`);
  if (it.stack) lines.push(`Stos: do ${it.stack}`);
  if (it.quest) lines.push("Przedmiot zadaniowy");
  else lines.push(`Wartość: ${it.value} kr`);
  return lines;
}

// === SEKCJA: SIATKA (INTERFEJS I PRZECIĄGANIE) ===
const gridViews = new Map();
let selected = null;
let drag = null;

function mountGrid(el, cont, opts = {}) {
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
    const it = ITEMS[inst.id];
    const [w, h] = itemDims(inst);
    const d = document.createElement("div");
    const isSel = selected && selected.uid === inst.uid;
    d.className = `item it-${it.type}${isSel ? " selected" : ""}`;
    d.style.cssText = `left:${inst.x * CELL}px;top:${inst.y * CELL}px;width:${w * CELL}px;height:${h * CELL}px`;
    d.title = it.name;
    const label = document.createElement("span");
    label.className = "it-label";
    label.textContent = w * h === 1 ? it.name.slice(0, 3) : it.name;
    d.appendChild(label);
    if (inst.qty > 1) {
      const q = document.createElement("em");
      q.className = "it-qty";
      q.textContent = inst.qty;
      d.appendChild(q);
    }
    d.addEventListener("pointerdown", (e) => startDrag(e, view, inst, d));
    d.addEventListener("mousedown", (e) => e.preventDefault());
    d.addEventListener("dblclick", () => view.opts.onQuickMove && view.opts.onQuickMove(inst, view));
    el.appendChild(d);
  });
}

function refreshGrids() {
  gridViews.forEach(renderGrid);
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
  const r = inst.r ? 0 : 1;
  if (!canPlace(view.cont, inst.id, inst.x, inst.y, r, inst.uid)) return false;
  inst.r = r;
  renderGrid(view);
  if (view.opts.onChange) view.opts.onChange();
  return true;
}

function quickMove(from, to, inst) {
  if (to.opts.canMoveIn && !to.opts.canMoveIn(inst, from)) return 0;
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

function viewAtPoint(x, y) {
  for (const e of document.elementsFromPoint(x, y)) {
    const g = e.closest && e.closest(".grid");
    if (g && gridViews.has(g)) return gridViews.get(g);
  }
  return null;
}

function clearHint() {
  document.querySelectorAll(".drop-hint").forEach((h) => h.remove());
}

function startDrag(e, view, inst, node) {
  if (e.button !== 0) return;
  e.preventDefault();
  const rect = node.getBoundingClientRect();
  drag = {
    view,
    inst,
    node,
    sx: e.clientX,
    sy: e.clientY,
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
  const s = baseSize(drag.inst.id);
  return drag.r ? [s[1], s[0]] : s;
}

function onDragMove(e) {
  if (!drag) return;
  if (!drag.moved) {
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 5) return;
    drag.moved = true;
    drag.ghost = drag.node.cloneNode(true);
    drag.ghost.classList.add("drag-ghost");
    document.body.appendChild(drag.ghost);
    drag.node.classList.add("dragging");
  }
  drag.lx = e.clientX;
  drag.ly = e.clientY;
  updateDrag();
}

function updateDrag() {
  const [w, h] = ghostSize();
  const g = drag.ghost;
  g.style.width = `${w * CELL}px`;
  g.style.height = `${h * CELL}px`;
  drag.offX = Math.min(drag.offX, w * CELL - 1);
  drag.offY = Math.min(drag.offY, h * CELL - 1);
  g.style.left = `${drag.lx - drag.offX}px`;
  g.style.top = `${drag.ly - drag.offY}px`;

  clearHint();
  drag.target = viewAtPoint(drag.lx, drag.ly);
  drag.res = null;
  if (!drag.target) return;
  const gr = drag.target.el.getBoundingClientRect();
  const x = Math.round((drag.lx - drag.offX - gr.left) / CELL);
  const y = Math.round((drag.ly - drag.offY - gr.top) / CELL);
  drag.res = dropCheck(drag.target, x, y);
  const hint = document.createElement("div");
  hint.className = `drop-hint ${drag.res.ok ? "ok" : "bad"}`;
  hint.style.cssText = `left:${x * CELL}px;top:${y * CELL}px;width:${w * CELL}px;height:${h * CELL}px`;
  drag.target.el.appendChild(hint);
}

function dropCheck(target, x, y) {
  const inst = drag.inst;
  const same = target === drag.view;
  if (!same && target.opts.canMoveIn && !target.opts.canMoveIn(inst, drag.view)) return { ok: false };
  const max = stackMax(inst.id);
  if (max > 1) {
    const under = target.cont.items.find((o) => {
      if (o.uid === inst.uid || o.id !== inst.id || o.qty >= max) return false;
      const [ow, oh] = itemDims(o);
      return x >= o.x && x < o.x + ow && y >= o.y && y < o.y + oh;
    });
    if (under) return { ok: true, merge: under, x, y };
  }
  return { ok: canPlace(target.cont, inst.id, x, y, drag.r, same ? inst.uid : null), x, y };
}

function onDragEnd() {
  window.removeEventListener("pointermove", onDragMove);
  window.removeEventListener("pointerup", onDragEnd);
  const d = drag;
  drag = null;
  if (!d) return;
  clearHint();
  if (!d.moved) return selectItem(d.view, d.inst);
  d.ghost.remove();
  d.node.classList.remove("dragging");
  const { target, res, inst } = d;
  if (!target || !res || !res.ok) return refreshGrids();

  if (res.merge) {
    const t = Math.min(stackMax(inst.id) - res.merge.qty, inst.qty);
    res.merge.qty += t;
    consumeInst(d.view.cont, inst, t);
    if (target !== d.view && target.opts.onMoveIn) target.opts.onMoveIn({ id: inst.id, qty: t }, d.view);
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

document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    if (drag && drag.moved) {
      drag.r = drag.r ? 0 : 1;
      updateDrag();
    } else if (!/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) {
      rotateSelected();
    }
  }
});

document.addEventListener("contextmenu", (e) => {
  if (drag && drag.moved) {
    e.preventDefault();
    drag.r = drag.r ? 0 : 1;
    updateDrag();
  }
});
