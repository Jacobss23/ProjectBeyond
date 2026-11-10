// === SEKCJA: POMOCNICZE ===
const $ = (id) => document.getElementById(id);

// === SEKCJA: SYSTEM PRZEJŚĆ MIĘDZY EKRANAMI ===
let isAnimating = false;

function showScreen(screenId) {
  if (isAnimating) return;
  isAnimating = true;

  const currentScreen = document.querySelector(".screen.active");
  const nextScreen = document.getElementById(screenId);
  const overlay = document.getElementById("transition-overlay");

  overlay.classList.add("overlay-active");

  if (currentScreen) {
    currentScreen.classList.add("fade-out");

    setTimeout(() => {
      currentScreen.classList.remove("active", "fade-out");
      nextScreen.classList.add("active");

      setTimeout(() => {
        overlay.classList.remove("overlay-active");
        isAnimating = false;
      }, 100);
    }, 400);
  } else {
    nextScreen.classList.add("active");
    isAnimating = false;
  }
}

// === SEKCJA: GLOW KRAWĘDZI EKRANU ===
// typy: search, loot, danger, hit, hurt, heal, extract, tech, level
function edgeGlow(type) {
  let el = document.getElementById("edge-glow");
  if (!el) {
    el = document.createElement("div");
    el.id = "edge-glow";
    document.body.appendChild(el);
  }
  el.className = "";
  void el.offsetWidth;
  el.classList.add(`glow-${type}`);
}

// === SEKCJA: TERMINAL ===
let typing = null;

function finishTyping() {
  if (!typing) return;
  clearTimeout(typing.timer);
  typing.p.textContent = typing.text;
  typing.p.classList.remove("typing");
  typing = null;
}

function termLog(text, cls = "") {
  const el = document.getElementById("log");
  if (!el) return;
  finishTyping();
  const p = document.createElement("p");
  p.className = `${cls} typing`;
  el.appendChild(p);
  while (el.children.length > 150) el.removeChild(el.firstChild);
  typing = { p, text: `> ${text}`, i: 0, timer: null };
  const step = () => {
    if (!typing || typing.p !== p) return;
    typing.i += 3;
    p.textContent = typing.text.slice(0, typing.i);
    el.scrollTop = el.scrollHeight;
    if (typing.i >= typing.text.length) return finishTyping();
    typing.timer = setTimeout(step, 14);
  };
  step();
}

// === SEKCJA: UNIWERSALNE RENDEROWANIE SLOTÓW WYPOSAŻENIA (HIDEOUT & RAJD) ===
function renderEquipmentSlotsUI(box, isCompact = false) {
  if (!box) return;
  box.innerHTML = "";

  const curSave = typeof save !== "undefined" && save ? save : (typeof loadSave === "function" ? loadSave() : null);
  if (!curSave) return;

  curSave.equipped = curSave.equipped || { armor: null, ranged: null, ranged2: null, melee: null, activeWeapon: "ranged" };
  const hasKabura = typeof hasHolster === "function" ? hasHolster(curSave) : false;

  const getItemId = (val) => (typeof val === "object" && val !== null ? val.id : val);

  const slots = [
    { id: "armor", label: "Pancerz", fullLabel: "Pancerz Ochronny", icon: "🛡️", item: getItemId(curSave.equipped.armor) },
    { id: "ranged", label: "Palna 1", fullLabel: "Broń Palna 1", icon: "🔫", item: getItemId(curSave.equipped.ranged) },
  ];

  if (hasKabura) {
    slots.push({ id: "ranged2", label: "Palna 2", fullLabel: "Broń Palna 2 (Kabura)", icon: "🔫", item: getItemId(curSave.equipped.ranged2) });
  }

  slots.push({ id: "melee", label: "Biała", fullLabel: "Broń Biała", icon: "🗡️", item: getItemId(curSave.equipped.melee) });

  box.className = isCompact ? "eq-slots-container eq-slots-raid" : "eq-slots-container";

  slots.forEach((s) => {
    const card = document.createElement("div");
    card.className = `eq-slot-card ${s.item ? "equipped" : "empty"}`;
    card.setAttribute("data-eq-slot", s.id);
    card.title = `Slot: ${s.fullLabel}. Przeciągnij tu przedmiot, aby założyć go na siebie.`;

    const titleRow = document.createElement("div");
    titleRow.className = "eq-slot-title";
    titleRow.style.fontSize = isCompact ? "0.72rem" : "0.82rem";
    titleRow.style.color = "#94a3b8";
    titleRow.style.fontWeight = "bold";
    titleRow.textContent = `${s.icon} ${isCompact ? s.label : s.fullLabel}`;

    const val = document.createElement("div");
    val.className = "eq-slot-item-name";
    val.style.fontSize = isCompact ? "0.82rem" : "0.92rem";
    val.style.fontWeight = "bold";
    val.style.margin = "2px 0";

    if (s.item && typeof ITEMS !== "undefined" && ITEMS[s.item]) {
      const it = ITEMS[s.item];
      val.style.color = it.quest ? "#f59e0b" : "#38bdf8";
      val.textContent = it.name;
    } else {
      val.style.color = "#64748b";
      val.textContent = s.id === "melee" ? "Pięści" : "Pusty slot";
    }

    const btnRow = document.createElement("div");
    btnRow.className = "btn-row";
    btnRow.style.marginTop = isCompact ? "2px" : "6px";

    if (s.item) {
      const unequipBtn = document.createElement("button");
      unequipBtn.className = "sm ghost";
      unequipBtn.style.padding = isCompact ? "2px 6px" : "4px 10px";
      unequipBtn.style.fontSize = isCompact ? "0.7rem" : "0.8rem";
      unequipBtn.textContent = "Zdejmij";
      unequipBtn.onclick = (e) => {
        e.stopPropagation();
        let dest = curSave.stash || curSave.loadout;
        if (typeof raid !== "undefined" && raid && raid.bag) {
          dest = raid.bag;
        }
        const ok = typeof unequipItem === "function" ? unequipItem(curSave, s.id, dest) : false;
        if (!ok) {
          if (typeof termLog === "function") termLog("Brak wolnego miejsca na odłożenie zdjętego przedmiotu!", "warn");
          else notifyUser("Brak wolnego miejsca na odłożenie zdjętego przedmiotu!");
        } else {
          if (typeof writeSave === "function") writeSave(curSave);
          if (typeof persist === "function") persist();
          if (typeof renderAll === "function") renderAll();
          if (typeof render === "function") render();
        }
      };
      btnRow.appendChild(unequipBtn);
    } else {
      const hint = document.createElement("span");
      hint.style.fontSize = isCompact ? "0.65rem" : "0.75rem";
      hint.style.color = "#475569";
      hint.textContent = "Upuść tu";
      btnRow.appendChild(hint);
    }

    card.append(titleRow, val, btnRow);
    box.appendChild(card);
  });
}

// Komunikat na stronie zamiast blokowanego alert() (w podglądzie AI Studio alert nie działa)
function notifyUser(msg, isErr = true) {
  let t = document.getElementById("ui-notice");
  if (!t) {
    t = document.createElement("div");
    t.id = "ui-notice";
    t.setAttribute("role", "status");
    t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);max-width:90vw;padding:10px 16px;border-radius:6px;font-size:0.9rem;color:#fff;z-index:9999;pointer-events:none;transition:opacity .3s;";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.background = isErr ? "rgba(127,29,29,0.95)" : "rgba(6,78,59,0.95)";
  t.style.border = "1px solid " + (isErr ? "#ef4444" : "#22c55e");
  t.style.opacity = "1";
  clearTimeout(t._hide);
  t._hide = setTimeout(() => (t.style.opacity = "0"), 2600);
}
