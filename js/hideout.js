// === SEKCJA: INICJALIZACJA ===
const save = loadSave();
const st = save ? playerStats(save) : null;
const say = termLog;

let curTrader = TRADERS[0].id;
let openModule = null;
let stashView = null;
let loadView = null;
let sellView = null;
let traderView = null;
let traderContainer = null;
const trader = () => TRADERS.find((t) => t.id === curTrader) || TRADERS[0];

if (!save) {
  window.location.replace("index.html");
} else {
  document.addEventListener("DOMContentLoaded", init);
}

function init() {
  mountContainers();
  if (typeof applyDayNight === "function") applyDayNight(!!save.lastNight);
  renderAll();
  setTimeout(maybeRunBaseTour, 600);
  say("Terminal schronu aktywny. Wybierz opcję.", "intro");
}

function mountContainers() {
  const common = { onChange: persist };
  stashView = mountGrid($("stash-grid"), save.stash, {
    ...common,
    onSelect: () => renderInvInfo(),
    onQuickMove: (inst) => quickFromInventory(stashView, loadView, inst),
  });
  loadView = mountGrid($("load-grid"), save.loadout, {
    ...common,
    containerName: "Zestaw na rajd",
    // Kontenerów nie zabiera się na rajd (sprawdzane też przy starcie)
    canMoveIn: (inst) => !ITEMS[inst.id]?.container,
    onSelect: () => renderInvInfo(),
    onQuickMove: (inst) => quickFromInventory(loadView, stashView, inst),
  });
  sellView = mountGrid($("sell-grid"), save.stash, {
    ...common,
    onSelect: () => renderSellInfo(),
    onQuickMove: () => {},
  });
}

// === SEKCJA: PANEL KONTENERA (v1.67.0) ===
let openCont = null; // { view, inst, el, innerView }

function openContainer(view, inst) {
  const cfg = ITEMS[inst.id]?.container;
  if (!cfg) return;
  if (!inst.inner) inst.inner = newContainer(cfg.inner[0], cfg.inner[1], false);
  closeContainer();
  const el = $("container-grid");
  const innerView = mountGrid(el, inst.inner, {
    onChange: persist,
    containerName: ITEMS[inst.id].name,
    canMoveIn: (moved) => containerAccepts(inst.id, moved.id),
    onQuickMove: (moved) => moveBetween(innerView, stashView, moved),
    onSelect: () => {},
  });
  openCont = { view, inst, el, innerView };
  $("container-title").textContent = `${ITEMS[inst.id].name} (wnętrze ${cfg.inner[0]}x${cfg.inner[1]})`;
  $("container-accepts").textContent = `Przyjmuje: ${cfg.label}. Kontenerów nie wkładasz do kontenerów.`;
  $("container-panel").style.display = "";
  refreshGrids();
  $("container-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Podwójny klik w przedmiot z magazynu/zestawu: gdy kontener jest otwarty, wkłada go do kontenera
// (jeśli kontener go przyjmuje). Bez otwartego kontenera przenosi między magazynem a zestawem.
function quickFromInventory(from, other, inst) {
  // Podwójny klik w kontener otwiera jego panel (zamiast przenosić go gdzie indziej)
  if (ITEMS[inst.id]?.container) return openContainer(from, inst);
  if (!openCont) return moveBetween(from, other, inst);
  const name = ITEMS[inst.id].name;
  const cname = ITEMS[openCont.inst.id].name;
  if (!containerAccepts(openCont.inst.id, inst.id)) return say(`${cname} nie przyjmuje: ${name}.`, "warn");
  return moveBetween(from, openCont.innerView, inst);
}

function closeContainer() {
  if (openCont) {
    gridViews.delete(openCont.el);
    openCont.el.innerHTML = "";
  }
  openCont = null;
  const p = $("container-panel");
  if (p) p.style.display = "none";
}

// Zamyka panel, gdy kontener nie leży już w magazynie ani w zestawie (np. sprzedany).
function refreshContainerPanel() {
  if (!openCont) return;
  const inStash = stashView && stashView.cont.items.includes(openCont.inst);
  const inLoad = loadView && loadView.cont.items.includes(openCont.inst);
  if (!inStash && !inLoad) closeContainer();
}

function persist() {
  writeSave(save);
  renderAll();
  refreshContainerPanel();
}

function goTo(screenId) {
  markTour("visit_" + screenId);
  showScreen(screenId);
  if (screenId === "hub-raid") renderRaidList(true);
  if (screenId !== "hub-main") hideBaseTourPopup();
  setTimeout(renderAll, 450);
  if (screenId === "hub-main") setTimeout(maybeRunBaseTour, 500);
}

function goToRaidScreen() {
  goTo("hub-raid");
}
window.goToRaidScreen = goToRaidScreen;

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

// === SEKCJA: RENDER GŁÓWNY ===
function renderAll() {
  renderStatus();
  if (typeof renderAnatomyPanel === "function") renderAnatomyPanel($("anatomy-panel"), save);
  renderEquipmentSlots();
  renderInvInfo();
  renderSellInfo();
  renderTrader();
  renderShip();
  renderSkills();
  renderHydro();
  renderModule();
  renderQuests();
  renderRaidList();
  if ($("stash-info")) $("stash-info").textContent = `${usedCells(save.stash)} / ${save.stash.w * save.stash.h}`;
  if ($("load-info")) $("load-info").textContent = `${usedCells(save.loadout)} / ${save.loadout.w * save.loadout.h}`;
  refreshGrids();
}

function renderEquipmentSlots() {
  const box = $("eq-slots-container");
  if (box && typeof renderEquipmentSlotsUI === "function") {
    renderEquipmentSlotsUI(box, false);
  }
}

function showTraitsModal() {
  const modal = $("traits-modal");
  const listEl = $("traits-modal-list");
  if (!modal || !listEl) return;

  listEl.innerHTML = "";
  const traits = save.traits || [];

  if (!traits.length) {
    listEl.innerHTML = `<p class="hint" style="text-align:center; padding:16px;">Brak wybranych cech genetycznych dla tej postaci.</p>`;
  } else {
    traits.forEach((tName) => {
      const p = typeof findPerkDef === "function" ? findPerkDef(tName) : ((typeof PERKS !== "undefined" && PERKS[tName]) ? PERKS[tName] : null);
      const isNeg = p ? (p.points > 0 || p.type === "neg") : false;
      const card = document.createElement("div");
      card.style.background = isNeg ? "rgba(239, 68, 68, 0.08)" : "rgba(34, 197, 94, 0.08)";
      card.style.border = `1px solid ${isNeg ? "rgba(239, 68, 68, 0.4)" : "rgba(34, 197, 94, 0.4)"}`;
      card.style.borderRadius = "4px";
      card.style.padding = "10px 12px";

      const top = document.createElement("div");
      top.style.display = "flex";
      top.style.justifyContent = "space-between";
      top.style.alignItems = "center";
      top.style.marginBottom = "4px";

      const nameEl = document.createElement("strong");
      nameEl.style.color = isNeg ? "#f87171" : "#4ade80";
      nameEl.style.fontSize = "1rem";
      nameEl.textContent = p ? p.name : tName;

      const badge = document.createElement("span");
      badge.className = "term-badge";
      badge.style.fontSize = "0.75rem";
      badge.style.padding = "2px 6px";
      badge.style.borderColor = isNeg ? "#f87171" : "#4ade80";
      badge.style.color = isNeg ? "#f87171" : "#4ade80";
      badge.textContent = isNeg ? "[WADA / CECHA NEGATYWNA]" : "[ZALETA / CECHA POZYTYWNA]";

      top.append(nameEl, badge);

      const descEl = document.createElement("div");
      descEl.style.color = "#cbd5e1";
      descEl.style.fontSize = "0.85rem";
      descEl.style.lineHeight = "1.4";
      descEl.textContent = p?.desc || "Cecha genetyczna modyfikująca parametry postaci.";

      let statsEl = null;
      if (p && p.stats && p.stats.length) {
        statsEl = document.createElement("div");
        statsEl.style.marginTop = "6px";
        statsEl.style.fontSize = "0.8rem";
        statsEl.style.color = "#38bdf8";
        statsEl.style.fontFamily = "'Share Tech Mono', monospace";
        const statTexts = p.stats.map((st) => {
          if (st.stat === "skillBonus") {
            const sName = typeof SKILLS !== "undefined" && SKILLS[st.skill] ? SKILLS[st.skill].name : st.skill;
            return `+${st.val} do ${sName}`;
          }
          if (st.stat === "maxSkillCap") return `Maksymalny limit poziomu: ${st.val}`;
          const sDef = typeof HIDDEN_STATS_DEF !== "undefined" && HIDDEN_STATS_DEF[st.stat];
          const sLabel = sDef ? sDef.name : st.stat;
          const valSign = parseFloat(st.val) > 0 ? `+${st.val}` : `${st.val}`;
          const unit = sDef ? sDef.unit : "";
          return `${valSign}${unit} ${sLabel}`;
        });
        statsEl.textContent = `Efekty: ${statTexts.join(" | ")}`;
      }

      card.append(top, descEl);
      if (statsEl) card.append(statsEl);
      listEl.appendChild(card);
    });
  }

  modal.style.display = "flex";
  modal.classList.remove("hidden");
}

function hideTraitsModal() {
  const modal = $("traits-modal");
  if (!modal) return;
  modal.style.display = "none";
  modal.classList.add("hidden");
}

function renderStatus() {
  $("hub-title").textContent = `Schron - ${save.name}`;

  // Bezpieczne wartości głodu i pragnienia (domyślnie 100/100, max 100)
  save.hunger = Math.max(0, Math.min(100, save.hunger ?? 100));
  save.thirst = Math.max(0, Math.min(100, save.thirst ?? 100));
  const foodPct = Math.round((save.hunger / 100) * 50); // 0-50% paska
  const waterPct = Math.round((save.thirst / 100) * 50); // 0-50% paska
  const totalCond = Math.round(((save.hunger + save.thirst) / 200) * 100);

  const hpRatio = (save.hp / save.maxHp) * 100;
  const hpColor = hpRatio > 65 ? "#4ade80" : hpRatio > 35 ? "#fbbf24" : "#ef4444";

  const lines = [
    {
      k: "Planeta",
      valHtml: `<span style="color:#38bdf8; font-weight:bold;">${save.planet}</span>`
    },
    {
      k: "Poziom",
      valHtml: `<span style="color:#a855f7; font-weight:bold;">${save.level}</span> <span style="color:#64748b; font-size:0.85rem;">(XP ${save.xp} / ${xpForLevel(save.level)})</span>`
    },
    {
      k: "HP",
      valHtml: `<span style="color:${hpColor}; font-weight:bold;">${save.hp}</span> / <span style="color:#94a3b8;">${save.maxHp}</span>`
    },
    {
      k: "Kondycja",
      isCondition: true,
      totalCond: totalCond,
      hunger: save.hunger,
      thirst: save.thirst,
      foodPct: foodPct,
      waterPct: waterPct
    },
    {
      k: "Kredyty",
      valHtml: `<span style="color:#fbbf24; font-weight:bold;">${save.credits} kr</span>`
    },
    {
      k: "Statek",
      valHtml: `<span style="color:#06b6d4;">${save.kit}</span>`
    },
    {
      k: "Aktywne stacje",
      valHtml: SHIP_MODULES.filter((m) => moduleActive(save, m.id))
        .map((m) => `<span style="color:#38bdf8;">${m.id}</span> <span style="color:#64748b;">(${moduleLevel(save, m.id)})</span>`)
        .join(", ") || `<span style="color:#64748b;">brak</span>`
    },
    {
      k: "Cechy",
      isTraits: true,
      traits: save.traits
    },
    {
      k: "Rajdy / zgony",
      valHtml: `<span style="color:#10b981; font-weight:bold;">${save.raids}</span> / <span style="color:#f87171; font-weight:bold;">${save.deaths}</span>`
    },
  ];

  const box = $("hub-status");
  box.innerHTML = "";

  lines.forEach((item) => {
    const d = document.createElement("div");
    d.className = "stat-line";

    const label = document.createElement("span");
    label.className = "stat-line-label";
    label.textContent = item.k;

    if (item.isCondition) {
      d.style.flexDirection = "column";
      d.style.alignItems = "stretch";
      d.style.padding = "5px 0";

      const topRow = document.createElement("div");
      topRow.style.display = "flex";
      topRow.style.justifyContent = "space-between";
      topRow.style.alignItems = "center";
      topRow.style.width = "100%";

      const valTop = document.createElement("div");
      valTop.className = "stat-line-val";
      valTop.innerHTML = `
        <span style="color:#38bdf8; font-weight:bold;">${item.totalCond}%</span>
        <span style="color:#64748b; font-size:0.82rem; font-weight:normal;">
          (<span style="color:#22c55e;">Jedzenie: ${Math.round(item.hunger * 0.5)}/50%</span>, 
          <span style="color:#0ea5e9;">Picie: ${Math.round(item.thirst * 0.5)}/50%</span>)
        </span>
      `;

      topRow.append(label, valTop);

      // Pasek z gradientem zielono-niebieskim z mini przedziałkiem na środku
      const barContainer = document.createElement("div");
      barContainer.className = "cond-dual-bar";
      barContainer.title = `Kondycja: ${item.totalCond}% | Jedzenie: ${item.hunger}% | Picie: ${item.thirst}%`;

      const foodHalf = document.createElement("div");
      foodHalf.style.width = "50%";
      foodHalf.style.height = "100%";
      foodHalf.style.display = "flex";
      foodHalf.style.justifyContent = "flex-end";
      foodHalf.style.background = "rgba(16, 185, 129, 0.1)";

      const foodSeg = document.createElement("div");
      foodSeg.className = "cond-seg food";
      foodSeg.style.width = `${item.hunger}%`;
      foodHalf.appendChild(foodSeg);

      const divider = document.createElement("div");
      divider.className = "cond-divider";

      const waterHalf = document.createElement("div");
      waterHalf.style.width = "50%";
      waterHalf.style.height = "100%";
      waterHalf.style.display = "flex";
      waterHalf.style.justifyContent = "flex-start";
      waterHalf.style.background = "rgba(14, 165, 233, 0.1)";

      const waterSeg = document.createElement("div");
      waterSeg.className = "cond-seg water";
      waterSeg.style.width = `${item.thirst}%`;
      waterHalf.appendChild(waterSeg);

      barContainer.append(foodHalf, divider, waterHalf);
      d.append(topRow, barContainer);
    } else if (item.isTraits) {
      const val = document.createElement("div");
      val.className = "stat-line-val";
      val.style.display = "flex";
      val.style.alignItems = "center";
      val.style.gap = "6px";
      val.style.flexWrap = "wrap";
      val.style.justifyContent = "flex-end";

      if (item.traits && item.traits.length) {
        const preview = item.traits.slice(0, 2).map((t) => {
          const p = typeof findPerkDef === "function" ? findPerkDef(t) : null;
          const isNeg = p ? (p.points > 0 || p.type === "neg") : false;
          return `<span style="color:${isNeg ? '#f87171' : '#4ade80'};">${t}</span>`;
        }).join(", ");
        const moreCount = item.traits.length > 2 ? ` (+${item.traits.length - 2})` : "";

        const summaryText = document.createElement("span");
        summaryText.innerHTML = `${preview}${moreCount}`;
        summaryText.style.fontSize = "0.85rem";

        const btnEl = document.createElement("button");
        btnEl.className = "trait-chip-btn";
        btnEl.innerHTML = `<span>Szczegóły</span> <span style="font-size:0.7rem;">🔍</span>`;
        btnEl.onclick = (e) => {
          e.preventDefault();
          showTraitsModal();
        };

        val.append(summaryText, btnEl);
      } else {
        const noneEl = document.createElement("span");
        noneEl.style.color = "#64748b";
        noneEl.textContent = "brak";
        val.appendChild(noneEl);
      }

      d.append(label, val);
    } else {
      const val = document.createElement("span");
      val.className = "stat-line-val";
      val.innerHTML = item.valHtml;
      d.append(label, val);
    }

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
  if (!it) return;
  const h = document.createElement("h3");
  h.textContent = `${it.name}${sel.inst.qty > 1 ? ` x${sel.inst.qty}` : ""}`;
  if (it.quest) {
    const qb = document.createElement("span");
    qb.className = "quest-badge-tag";
    qb.textContent = "PRZEDMIOT FABULARNY // QUEST";
    h.appendChild(qb);
  }
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
  const buttons = [];
  if (sel && (sel.view === stashView || sel.view === loadView)) {
    buttons.push(btn("Obróć (R)", () => rotateSelected(), "ghost"));
    buttons.push(btn(inLoad ? "Do magazynu" : "Do zestawu", () => moveBetween(sel.view, inLoad ? stashView : loadView, sel.inst)));
    if (ITEMS[sel.inst.id]?.container) buttons.push(btn("Otwórz kontener", () => openContainer(sel.view, sel.inst), "primary-btn"));
    // Usuwanie: sama ikona śmietnika (tylko w schronie, w raidzie zostaje „Wyrzuć”)
    const trash = btn("", () => deleteSelected(sel), "ghost");
    trash.innerHTML = TRASH_ICON;
    trash.title = "Usuń przedmiot";
    trash.setAttribute("aria-label", "Usuń przedmiot");
    trash.classList.add("trash-btn");
    buttons.push(trash);

    if (sel.inst.id === "hash_codes") {
      buttons.push(btn("Zaimplementuj kody", () => startHashMinigame(sel.view, sel.inst), "primary-btn"));
    }

    const it = ITEMS[sel.inst.id];
    if (it) {
      // Sloty pancerza i broni
      if (it.type === "armor") {
        buttons.push(btn("Załóż Pancerz", () => {
          const ok = equipItem(save, sel.inst.id, "armor", sel.view.cont, sel.inst);
          if (ok) persist();
          else say("Nie można założyć pancerza.", "warn");
        }, "primary-btn"));
      } else if (it.type === "weapon" && it.ammo) {
        buttons.push(btn("Wyposaż: Palna 1", () => {
          const ok = equipItem(save, sel.inst.id, "ranged", sel.view.cont, sel.inst);
          if (ok) persist();
          else say("Nie można wyposażyć broni.", "warn");
        }, "primary-btn"));
        if (typeof hasHolster === "function" && hasHolster(save)) {
          buttons.push(btn("Wyposaż: Palna 2 (Kabura)", () => {
            const ok = equipItem(save, sel.inst.id, "ranged2", sel.view.cont, sel.inst);
            if (ok) persist();
            else say("Nie można wyposażyć drugiej broni.", "warn");
          }, "ghost"));
        }
      } else if (it.type === "weapon" && !it.ammo) {
        buttons.push(btn("Wyposaż: Broń Biała", () => {
          const ok = equipItem(save, sel.inst.id, "melee", sel.view.cont, sel.inst);
          if (ok) persist();
          else say("Nie można wyposażyć broni białej.", "warn");
        }, "primary-btn"));
      }

      // Medykamenty i pożywienie
      const isMedicalOrUsable = it.heal || it.cures || it.buff || it.type === "medical" || ["ration", "bandage", "hemostatic", "bruise_ointment", "splint", "stim_bleedstop", "saturn_cola", "medkit", "morphine", "decontam_kit"].includes(sel.inst.id);
      if (isMedicalOrUsable) {
        buttons.push(btn("Użyj (Leczenie)", () => useMedicalInHideout(sel.inst, sel.view), "primary-btn"));
      }
    }
  }
  infoInto($("inv-info"), sel, buttons);
}

function useMedicalInHideout(inst, view) {
  const itemId = inst.id;
  const it = ITEMS[itemId];
  if (!it) return;

  let used = false;
  let logText = "";

  // 1. Uleczenie efektów ciała / podanie stymulanta
  if (typeof cureBodyEffect === "function") {
    const cureMsg = cureBodyEffect(save, itemId);
    if (cureMsg) {
      used = true;
      logText += cureMsg + ". ";
    }
  }

  // 2. Leczenie HP postaci
  if (it.heal && save.hp < save.maxHp) {
    const healVal = Math.ceil(it.heal * playerStats(save).healMult);
    save.hp = Math.min(save.maxHp, save.hp + healVal);
    used = true;
    logText += `Przywrócono +${healVal} HP (Stan: ${save.hp}/${save.maxHp}). `;
  }

  // 3. Pożywienie i picie: uzupełnia wskaźnik (0–100), tylko gdy jest poniżej 100
  if (it.hunger && save.hunger < 100) {
    save.hunger = Math.min(100, save.hunger + it.hunger);
    used = true;
    logText += `Głód +${it.hunger}%. `;
  }
  if (it.thirst && save.thirst < 100) {
    save.thirst = Math.min(100, save.thirst + it.thirst);
    used = true;
    logText += `Pragnienie +${it.thirst}%. `;
  }

  if (used) {
    consumeInst(view.cont, inst, 1);
    say(logText || `Użyto: ${it.name}.`, "hit");
    edgeGlow("heal");
    persist();
  } else {
    say(`Brak potrzeby użycia ${it.name} (postać jest w pełni zdrowa).`, "warn");
  }
}

function renderSellInfo() {
  const sel = getSelected();
  const buttons = [];
  if (sel) {
    if (sel.view === traderView) {
      const price = buyPrice(sel.inst.id);
      buttons.push(btn(`Kup 1 (${price} kr)`, () => buyFromTrader(sel.inst), "primary-btn", save.credits < price));
    } else {
      const it = ITEMS[sel.inst.id];
      if (it.quest) buttons.push(btn("Nie na sprzedaż", () => {}, "ghost", true));
      else {
        buttons.push(btn(`Sprzedaj 1 (${sellPrice(sel.inst.id)} kr)`, () => sell(sel.inst, 1)));
        if (sel.inst.qty > 1) buttons.push(btn(`Cały stos (${sellPrice(sel.inst.id) * sel.inst.qty} kr)`, () => sell(sel.inst, sel.inst.qty), "ghost"));
      }
    }
  }
  infoInto($("sell-info"), sel, buttons);
}

// === SEKCJA: // === SEKCJA: HANDLARZE (ZALEŻNI OD KOMUNIKACJI & EKWIPUNEK GRID) ===
function availableTraders() {
  const commLvl = moduleLevel(save, "Komunikacja");
  return TRADERS.filter((t) => !traderGateReason(t.id));
}

// === SEKCJA: DRZEWO HANDLARZY ===
// Wymagania odblokowania handlarza (każdy poza Borysem i Nadią ma inny warunek):
//   tutorial (samouczek), kills (łączna liczba zabitych), skill+lvl (umiejętność), lvl (poziom postaci),
//   comm (poziom Komunikacji), kill (pokonany boss z zapisu save.kills)
const TRADER_TREE = [
  { id: "trader1", tutorial: true, short: "Lekarz i epidemiolog. Leki, bandaże, próbki biologiczne." },
  { id: "trader2", kills: 5, short: "Rusznikarz. Broń, amunicja i modyfikacje taktyczne." },
  { id: "trader3", comm: 1, short: "Odzysk podzespołów instalacji podtrzymywania życia." },
  { id: "trader4", lvl: 15, short: "Pancerze i sprzęt ochronny wolnych kolonii." },
  { id: "trader5", skill: "przeszukiwanie", skillLvl: 3, short: "Haker. Czarne skrzynki, chipy taktyczne i szyfry." },
  { id: "trader6", kills: 20, short: "Dowódca straży. Zleca czyszczenie stref i polowania." },
  { id: "trader7", skill: "inzynieria", skillLvl: 4, short: "Geolog głębinowy. Ruda, Xenonit, Hel-3, Rękawica." },
  { id: "trader8", kill: "archive_mother", short: "Czarny rynek. Odkupuje ultra-rzadkie kosztowności." },
];

function traderGateReason(id) {
  const node = TRADER_TREE.find((n) => n.id === id);
  if (!node) return null;
  if (node.tutorial && !save.tutorialDone) return "Ukończ samouczek";
  if (node.kill && !(save.kills && save.kills[node.kill])) return "Po Archiwum: pokonaj Matkę Archiwum";
  if (node.lvl && (save.level || 1) < node.lvl) return "Poziom postaci " + node.lvl;
  if (node.comm != null && moduleLevel(save, "Komunikacja") < node.comm) return "Komunikacja poz. " + node.comm;
  if (node.kills && (save.totalKills || 0) < node.kills) {
    return `Zabij łącznie ${node.kills} zarażonych (${save.totalKills || 0}/${node.kills})`;
  }
  if (node.skill) {
    const cur = (save.skills && save.skills[node.skill] && save.skills[node.skill].level) || 0;
    if (cur < node.skillLvl) {
      const nm = (SKILLS[node.skill] && SKILLS[node.skill].name) || node.skill;
      return `Umiejętność ${nm} poz. ${node.skillLvl}`;
    }
  }
  return null;
}

// Otwiera drzewko handlarzy na ekranie hub-trader-tree; from = ekran, do którego wracamy
function openTraderTree(from) {
  window.traderTreeFrom = from || "hub-trader";
  showScreen("hub-trader-tree");
  showTraderTree($("trader-tree-wrap"), () => goTo(window.traderTreeFrom), "Wróć");
}

// Układ drzewka: każdy handlarz ma rodzica (warunek wstępny), linie idą od rodzica do dziecka
const TRADER_LAYOUT = {
  trader1: { x: 320, y: 55, parent: null },
  trader2: { x: 480, y: 165, parent: "trader1" },
  trader3: { x: 160, y: 165, parent: "trader1" },
  trader4: { x: 80, y: 280, parent: "trader3" },
  trader5: { x: 240, y: 280, parent: "trader3" },
  trader6: { x: 480, y: 280, parent: "trader2" },
  trader7: { x: 80, y: 395, parent: "trader4" },
  trader8: { x: 480, y: 395, parent: "trader6" },
};

function showTraderTree(wrap, backFn, backLabel) {
  const W = 150;
  const H = 58;
  const edges = TRADER_TREE.filter((n) => TRADER_LAYOUT[n.id] && TRADER_LAYOUT[n.id].parent)
    .map((n) => {
      const c = TRADER_LAYOUT[n.id];
      const p = TRADER_LAYOUT[c.parent];
      const lit = !traderGateReason(n.id) && !traderGateReason(c.parent);
      const y1 = p.y + H / 2;
      const y2 = c.y - H / 2;
      const my = (y1 + y2) / 2;
      return `<path class="tt-edge ${lit ? "lit" : ""}" d="M ${p.x} ${y1} C ${p.x} ${my}, ${c.x} ${my}, ${c.x} ${y2}"/>`;
    })
    .join("");
  const nodes = TRADER_TREE.map((n) => {
    const L = TRADER_LAYOUT[n.id];
    if (!L) return "";
    const tr = TRADERS.find((t) => t.id === n.id) || { name: n.id, color: "#38bdf8" };
    const lock = traderGateReason(n.id);
    const tier = getTraderTier(save, n.id);
    const short = tr.name.split(" - ")[0];
    const status = lock ? "🔒 zablokowany" : `Tier ${tier} · dostępny`;
    return `<g class="tt-node ${lock ? "locked" : "open"}" data-trader-node="${n.id}" tabindex="0" transform="translate(${L.x - W / 2},${L.y - H / 2})">
      <rect width="${W}" height="${H}" rx="6" style="stroke:${tr.color}"/>
      <text x="${W / 2}" y="22" text-anchor="middle" class="tt-name">${short}</text>
      <text x="${W / 2}" y="41" text-anchor="middle" class="tt-status">${status}</text></g>`;
  }).join("");
  const body = `<div class="tt-tree">
      <svg class="tt-svg" viewBox="0 0 640 450" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Drzewko handlarzy">
        ${edges}${nodes}
      </svg>
    </div>
    <div class="hint" style="text-align:center;">Linie prowadzą od warunku do handlarza. Kliknij węzeł, by zobaczyć, co trzeba zrobić.</div>`;
  rmapSetView(wrap, {
    title: "Drzewo Handlarzy",
    back: { label: backLabel || "Wróć", fn: backFn || (() => goTo("hub-trader")) },
    body,
    detail: "<p>Kliknij handlarza na drzewie.</p>",
  });
  wrap.querySelectorAll("[data-trader-node]").forEach((el) =>
    el.addEventListener("click", () => traderDetail(wrap, el.dataset.traderNode))
  );
}

function traderDetail(wrap, id) {
  const det = document.getElementById("rmap-detail");
  if (!det) return;
  const n = TRADER_TREE.find((x) => x.id === id);
  const tr = TRADERS.find((t) => t.id === id) || { name: id };
  const lock = traderGateReason(id);
  const tier = getTraderTier(save, id);
  const rep = (save.traderRep && save.traderRep[id]) || 0;
  const qs = QUESTS.filter((q) => q.traderId === id && !q.isMain);
  const countT = (t) => qs.filter((q) => q.tier === t && q.phase !== "final").length;
  const finalT = (t) => qs.find((q) => q.tier === t && q.phase === "final");
  const t1 = TRADER_TIER_THRESHOLDS[1];
  const t2 = TRADER_TIER_THRESHOLDS[2];
  det.innerHTML = "";
  const h = document.createElement("h3");
  h.textContent = tr.name;
  const p = document.createElement("p");
  p.textContent = n ? n.short : "";
  const stat = document.createElement("p");
  stat.className = "hint";
  stat.textContent = lock ? `Stan: zablokowany. ${lock}.` : `Stan: dostępny. Tier ${tier}, reputacja ${rep}.`;
  const ul = document.createElement("ul");
  const add = (t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  };
  if (tier < 1) add(`Tier 1: zdobyj ${t1} rep. Zrób zlecenia Tier 0 (w sumie: ${countT(0)}).`);
  if (tier < 2) add(`Tier 2: zdobyj ${t2} rep. Zrób zlecenia Tier 1 (w sumie: ${countT(1)}).`);
  if (tier < 3) add(`Tier 3: zdobyj ${TRADER_TIER_THRESHOLDS[3]} rep. Zrób zlecenia Tier 2 (w sumie: ${countT(2)}).`);
  if (finalT(1)) add(`Finał Tier 1: ${finalT(1).title}`);
  if (finalT(2)) add(`Finał Tier 2: ${finalT(2).title}`);
  if (tier >= 3) add("Najwyższy poziom zaufania (Tier 3) osiągnięty.");
  det.append(h, p, stat, ul);
}

function renderTrader() {
  const list = availableTraders();
  if (!list.find((t) => t.id === curTrader)) curTrader = list[0].id;
  const tr = trader();

  const tabs = $("trader-tabs");
  tabs.innerHTML = "";
  list.forEach((t) => {
    const isCur = t.id === curTrader;
    const tLvl = typeof getTraderTier === "function" ? getTraderTier(save, t.id) : 0;
    const b = document.createElement("button");
    b.textContent = `${t.name} [TIER ${tLvl}]`;
    b.className = `sm ${isCur ? "" : "ghost"}`;
    b.style.borderColor = t.color || "#38bdf8";
    if (isCur) {
      b.style.background = t.color || "#38bdf8";
      b.style.color = "#000";
      b.style.fontWeight = "bold";
    } else {
      b.style.color = t.color || "#38bdf8";
    }
    b.onclick = () => selectTrader(t.id);
    tabs.appendChild(b);
  });

  const commLvl = moduleLevel(save, "Komunikacja");
  const discountText = commLvl >= 3 ? " [Czarne Łącze: -10% zniżki na zakupy!]" : "";
  const descEl = $("trader-desc");
  descEl.style.borderLeft = `4px solid ${tr.color || "#38bdf8"}`;
  descEl.style.paddingLeft = "8px";

  const tLvl = typeof getTraderTier === "function" ? getTraderTier(save, tr.id) : 0;
  const repVal = save.traderRep ? save.traderRep[tr.id] || 0 : 0;
  const nextTarget = TRADER_TIER_THRESHOLDS[tLvl + 1];

  const repBarHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:0.85rem; background:rgba(15, 23, 42, 0.7); padding:6px 10px; border-radius:4px; border:1px solid rgba(56, 189, 248, 0.3);">
      <span><strong>Poziom Handlarza:</strong> <span style="color:#fde68a; font-weight:bold;">TIER ${tLvl}</span></span>
      <span><strong>Reputacja:</strong> <span style="color:#38bdf8; font-weight:bold;">${repVal}</span> ${tLvl < 3 ? `/ ${nextTarget} pkt (do Tier ${tLvl + 1})` : "(MAKSYMALNY TIER)"}</span>
    </div>
  `;
  const mPct = Math.round(marketMult(tr.id) * 100 - 100);
  const marketTxt = `<div class="hint" style="margin-top:4px;">Rynek dziś: ${mPct >= 0 ? "+" : ""}${mPct}% do cen zakupu</div>`;
  descEl.innerHTML = `<div>${tr.desc}${discountText}</div>${marketTxt}${repBarHtml}`;
  const linkRow = document.createElement("div");
  linkRow.className = "btn-row";
  linkRow.style.marginTop = "6px";
  linkRow.appendChild(btn("Połącz się", () => connectTrader(tr), "ghost"));
  descEl.appendChild(linkRow);
  // Handlarze, którzy jeszcze nie są dostępni, z podanym warunkiem
  const lockedTraders = TRADERS.filter((t) => traderGateReason(t.id));
  if (lockedTraders.length) {
    const hint = document.createElement("div");
    hint.className = "hint";
    hint.style.marginTop = "8px";
    hint.textContent =
      "Zablokowani handlarze: " +
      lockedTraders.map((t) => `${t.name.split(" - ")[0]} (${traderGateReason(t.id)})`).join("; ") +
      ".";
    descEl.appendChild(hint);
  }
  if (tr.id === "trader1") renderClinic(descEl);
  $("trader-credits").textContent = `Kredyty: ${save.credits} kr`;

  // Stworzenie kontenera siatki dla handlarza z uwzględnieniem odblokowanego Tieru
  traderContainer = newContainer(8, 6, false);
  let currentStock = [];
  if (Array.isArray(tr.stock)) {
    currentStock = tr.stock;
  } else if (typeof tr.stock === "object") {
    for (let i = 0; i <= tLvl; i++) {
      if (tr.stock[i]) currentStock.push(...tr.stock[i]);
    }
  }

  currentStock.forEach((itemId) => {
    if (ITEMS[itemId]) {
      addToContainer(traderContainer, itemId, 1);
    }
  });

  traderView = mountGrid($("trader-grid"), traderContainer, {
    onSelect: (inst) => {
      renderTraderItemInfo(inst);
    },
    onQuickMove: (inst) => buyFromTrader(inst),
    canMoveIn: () => false,
  });

  // Renderuj zlecenia tego konkretnego handlarza w oknie handlu
  renderTraderQuestsInShop(tr);
}

function renderTraderQuestsInShop(tr) {
  const box = $("trader-quests-list");
  const title = $("trader-quests-title");
  if (!box || !title) return;

  const tLvl = typeof getTraderTier === "function" ? getTraderTier(save, tr.id) : 0;
  title.textContent = `[ZLECENIA HANDLARZA: ${tr.name} // TIER ${tLvl}]`;
  title.style.color = tr.color || "#38bdf8";
  box.innerHTML = "";

  save.quests = save.quests || {};
  autoAcceptQuests();

  const topRow = document.createElement("div");
  topRow.className = "btn-row";
  topRow.style.marginBottom = "8px";
  topRow.appendChild(makeCompletedToggle());
  box.appendChild(topRow);

  const visibleQuests = QUESTS.filter((q) => q.traderId === tr.id).filter((q) => {
    const st = save.quests[q.id] || "available";
    if (st === "completed") return showCompletedQuests;
    return st === "active";
  });

  if (!visibleQuests.length) {
    box.insertAdjacentHTML("beforeend", `<p class="hint">Brak aktywnych zleceń u tego handlarza (Tier ${tLvl}).</p>`);
    return;
  }

  visibleQuests.forEach((q) => {
    const status = save.quests[q.id] || "available";
    box.appendChild(createQuestCard(q, tr, status));
  });
}

// Sortowanie magazynu: układa przedmioty od największych, po typie; łączy stacki.
function sortStash() {
  const st = save.stash;
  const tmp = newContainer(st.w, st.h, false);
  const typeOrder = { weapon: 0, armor: 1, container: 2, consumable: 2, ammo: 3, tool: 4, valuable: 5, junk: 6 };
  // Kontenery (z zawartością) zostają osobnymi instancjami; zwykłe przedmioty łączymy w stacki
  const boxes = st.items.filter((o) => o.inner);
  const stacks = {};
  st.items.filter((o) => !o.inner).forEach((o) => (stacks[o.id] = (stacks[o.id] || 0) + o.qty));
  const entries = [
    ...boxes.map((o) => ({ id: o.id, inst: o })),
    ...Object.keys(stacks).map((id) => ({ id, qty: stacks[id] })),
  ];
  entries.sort((a, b) => {
    const ta = typeOrder[ITEMS[a.id]?.type] ?? 9;
    const tb = typeOrder[ITEMS[b.id]?.type] ?? 9;
    if (ta !== tb) return ta - tb;
    const [aw, ah] = baseSize(a.id);
    const [bw, bh] = baseSize(b.id);
    return bw * bh - aw * ah || a.id.localeCompare(b.id);
  });
  for (const e of entries) {
    // kopia obiektu: przy nieudanym sortowaniu oryginalny magazyn nie zmienia się wcale
    const ok = e.inst ? placeInstance(tmp, { ...e.inst }) === 0 : addToContainer(tmp, e.id, e.qty) === 0;
    if (!ok) return say("Nie udało się posortować – przedmioty nie mieszczą się w ułożonym magazynie.", "warn");
  }
  st.items = tmp.items;
  writeSave(save);
  renderAll();
  say("Magazyn posortowany.", "hit");
}

function renderTraderItemInfo(inst) {
  const box = $("sell-info");
  if (!inst) return renderSellInfo();
  box.innerHTML = "";

  const it = ITEMS[inst.id];
  if (!it) return;

  const h = document.createElement("h3");
  h.textContent = `${it.name}`;
  if (it.quest) {
    const qb = document.createElement("span");
    qb.className = "quest-badge-tag";
    qb.textContent = "QUEST";
    h.appendChild(qb);
  }
  box.appendChild(h);

  itemStats(inst.id).forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    box.appendChild(p);
  });

  const unitPrice = buyPrice(inst.id);
  const maxQty = it.stack || 3;
  let selectedQty = 1;

  const sliderBox = document.createElement("div");
  sliderBox.style.margin = "10px 0";
  sliderBox.style.padding = "8px";
  sliderBox.style.background = "rgba(15, 23, 42, 0.7)";
  sliderBox.style.border = "1px solid rgba(56, 189, 248, 0.3)";
  sliderBox.style.borderRadius = "4px";

  const labelRow = document.createElement("div");
  labelRow.style.display = "flex";
  labelRow.style.justifyContent = "space-between";
  labelRow.style.fontSize = "0.88rem";
  labelRow.style.marginBottom = "6px";

  const qtyTitle = document.createElement("span");
  qtyTitle.textContent = "Wybierz ilość do zakupu:";
  const qtyVal = document.createElement("span");
  qtyVal.style.fontWeight = "bold";
  qtyVal.style.color = "#38bdf8";
  qtyVal.textContent = "1 szt.";
  labelRow.append(qtyTitle, qtyVal);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "1";
  slider.max = maxQty.toString();
  slider.value = "1";
  slider.className = "trader-qty-slider";
  slider.style.width = "100%";

  const buyBtn = btn(`Kup 1 szt. (${unitPrice} kr)`, () => buyFromTrader(inst, selectedQty), "primary-btn", save.credits < unitPrice);

  slider.oninput = () => {
    selectedQty = parseInt(slider.value, 10);
    qtyVal.textContent = `${selectedQty} szt.`;
    const totalPrice = unitPrice * selectedQty;
    buyBtn.textContent = `Kup ${selectedQty} szt. (${totalPrice} kr)`;
    buyBtn.disabled = save.credits < totalPrice;
  };

  sliderBox.append(labelRow, slider);
  box.appendChild(sliderBox);

  const row = document.createElement("div");
  row.className = "btn-row";
  row.appendChild(buyBtn);
  box.appendChild(row);
}

// Dynamiczny rynek: ceny zmieniają się z każdym rajdem (liczba zakończonych rajdów = "dzień")
function marketMult(trId) {
  const seed = trId + ":" + (save.raids || 0);
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return 0.85 + (h % 36) / 100; // 0.85 - 1.20
}

const buyPrice = (id) => {
  if (trader().fixedPrices && trader().fixedPrices[id]) return trader().fixedPrices[id];
  if (ITEMS[id].price) return ITEMS[id].price;
  const commLvl = moduleLevel(save, "Komunikacja");
  const mult = trader().buyMult * marketMult(trader().id) * (commLvl >= 3 ? 0.9 : 1.0);
  return Math.ceil(ITEMS[id].value * mult);
};
const sellPrice = (id) => Math.floor(ITEMS[id].value * trader().sellMult);

function selectTrader(id) {
  curTrader = id;
  say(`Handlarz: ${trader().name}.`);
  renderTrader();
  renderSellInfo();
}

function buyFromTrader(inst, qty = 1) {
  if (!inst) return;
  const id = inst.id;
  const price = buyPrice(id) * qty;
  if (save.credits < price) return say(`Za mało kredytów: brakuje ${price - save.credits} kr (cena ${price} kr).`, "warn");
  save.credits -= price;
  addToContainer(save.stash, id, qty);
  markTour("bought");
  say(`Kupiono: ${ITEMS[id].name}${qty > 1 ? ` x${qty}` : ""} (-${price} kr).`, "hit");
  edgeGlow("loot");
  persist();
}

function sell(inst, qty) {
  if (inst.inner && inst.inner.items.length) return say("Najpierw opróżnij kontener.", "warn");
  const id = inst.id;
  const gain = sellPrice(id) * qty;
  consumeInst(save.stash, inst, qty);
  save.credits += gain;
  say(`Sprzedano handlarzowi: ${ITEMS[id].name} x${qty} (+${gain} kr).`, "hit");
  edgeGlow("heal");
  persist();
}

// === SEKCJA: 7 MODUŁÓW SCHRONU (ULEPSZANIE) ===
function renderShip() {
  const box = $("ship-list");
  box.innerHTML = "";

  SHIP_MODULES.forEach((m) => {
    const curLvl = moduleLevel(save, m.id);
    const isMax = curLvl >= m.maxLevel;
    const curLevelDef = m.levels.find((l) => l.level === curLvl) || m.levels[0];
    const nextLevelDef = isMax ? null : m.levels.find((l) => l.level === curLvl + 1);

    const p = document.createElement("div");
    p.className = "ship-module-card";

    const h = document.createElement("h3");
    h.textContent = `${m.name} [Poziom ${curLvl}/${m.maxLevel}]`;

    const sub = document.createElement("p");
    sub.className = "hint";
    sub.textContent = `${curLevelDef.title}: ${curLevelDef.desc}`;

    p.append(h, sub);

    const costDiv = document.createElement("div");
    costDiv.style.margin = "8px 0";
    costDiv.style.fontSize = "0.9rem";

    let canUpgrade = false;
    if (nextLevelDef) {
      const hasCreds = save.credits >= nextLevelDef.cost;
      const credText = `${nextLevelDef.cost} kr (masz: ${save.credits})`;

      const reqItems = nextLevelDef.items.map(([itId, need]) => {
        const have = countItem(save.stash, itId);
        const name = ITEMS[itId] ? ITEMS[itId].name : itId;
        const ok = have >= need;
        return { ok, str: `${name}: ${have}/${need}` };
      });

      const allItemsOk = reqItems.every((r) => r.ok);
      canUpgrade = hasCreds && allItemsOk;

      const itemsStr = reqItems.map((r) => `<span style="color:${r.ok ? '#86efac' : '#f87171'}">${r.str}</span>`).join(" | ");
      costDiv.innerHTML = `<strong>Kolejny poziom (${nextLevelDef.title}):</strong> ${nextLevelDef.desc}<br/>Koszt: <span style="color:${hasCreds ? '#86efac' : '#f87171'}">${credText}</span>${itemsStr ? ` | Wymagane: ${itemsStr}` : ""}`;
    } else {
      costDiv.innerHTML = `<span style="color:#a78bfa; font-weight: bold;">MAKSYMALNY POZIOM STACJI</span>`;
    }
    p.appendChild(costDiv);

    const r = document.createElement("div");
    r.className = "btn-row";

    if (m.id === "Crafting" || m.id === "Medstation") {
      r.appendChild(btn("Otwórz stację", () => openMod(m.id), "", curLvl === 0));
    } else if (m.id === "Hydroponika") {
      r.appendChild(btn("Przejdź do farmy", () => goTo("hub-hydro"), "", curLvl === 0));
    }

    if (!isMax && nextLevelDef) {
      r.appendChild(btn(`Ulepsz na poz. ${curLvl + 1}`, () => upgradeModule(m.id), "", !canUpgrade));
    }

    p.appendChild(r);
    box.appendChild(p);
  });
}

function upgradeModule(modId) {
  const m = SHIP_MODULES.find((x) => x.id === modId);
  if (!m) return;
  const curLvl = moduleLevel(save, m.id);
  if (curLvl >= m.maxLevel) return;
  const next = m.levels.find((l) => l.level === curLvl + 1);
  if (!next) return;

  if (save.credits < next.cost) return say("Za mało kredytów na ulepszenie.", "warn");
  const missingItem = next.items.find(([id, qty]) => countItem(save.stash, id) < qty);
  if (missingItem) return say(`Brak wystarczającej ilości: ${ITEMS[missingItem[0]]?.name || missingItem[0]}.`, "warn");

  save.credits -= next.cost;
  next.items.forEach(([id, qty]) => removeById(save.stash, id, qty));

  save.ship.modules[modId].level = curLvl + 1;
  save.ship.modules[modId].active = true;

  if (modId === "Stash") {
    const dim = stashSizeForLevel(save.ship.modules.Stash.level);
    save.stash.w = dim[0];
    save.stash.h = dim[1];
    mountContainers();
  }

  grantSkillXp(save, "inzynieria", 35);
  say(`Ulepszono stację: ${m.name} -> Poziom ${curLvl + 1}! (+35 XP Inżynieria).`, "hit");
  edgeGlow("tech");
  persist();
}

// === SEKCJA: UMIEJĘTNOŚCI (0-15) ===
function renderSkills() {
  const box = $("skills-list");
  if (!box || typeof SKILLS === "undefined") return;
  box.innerHTML = "";

  Object.values(SKILLS).forEach((sk) => {
    const cur = save.skills[sk.id] || { level: 0, xp: 0 };
    const maxCap = save.maxSkillCap || 15;
    const isMax = cur.level >= maxCap;
    const req = skillXpReq(sk, cur.level);
    const pct = isMax ? 100 : Math.min(100, Math.floor((cur.xp / req) * 100));

    const p = document.createElement("div");
    p.className = "panel";
    p.style.textAlign = "left";

    const titleRow = document.createElement("div");
    titleRow.style.display = "flex";
    titleRow.style.justifyContent = "space-between";
    titleRow.style.alignItems = "center";
    titleRow.innerHTML = `<strong>${sk.name}</strong> <span style="color:var(--accent-glow)">Poz. ${cur.level}/${maxCap}</span>`;

    const desc = document.createElement("p");
    desc.className = "hint";
    desc.style.margin = "4px 0";
    desc.textContent = sk.desc;

    const barOuter = document.createElement("div");
    barOuter.style.background = "rgba(0,0,0,0.5)";
    barOuter.style.border = "1px solid var(--btn-border)";
    barOuter.style.borderRadius = "4px";
    barOuter.style.height = "12px";
    barOuter.style.overflow = "hidden";
    barOuter.style.position = "relative";
    barOuter.style.marginTop = "6px";

    const barInner = document.createElement("div");
    barInner.style.background = isMax ? "#22c55e" : "linear-gradient(90deg, #3b82f6, #8b5cf6)";
    barInner.style.height = "100%";
    barInner.style.width = `${pct}%`;
    barOuter.appendChild(barInner);

    const xpLabel = document.createElement("div");
    xpLabel.style.fontSize = "0.75rem";
    xpLabel.style.color = "#94a3b8";
    xpLabel.style.marginTop = "3px";
    xpLabel.textContent = isMax ? "MISTRZOSTWO (MAX)" : `Postęp: ${cur.xp} / ${req} XP (${pct}%)`;

    p.append(titleRow, desc, barOuter, xpLabel);
    box.appendChild(p);
  });
}

// === SEKCJA: HYDROPONIKA (FARMA ŻYWNOŚCI I WODA) ===
// Produkcja w tle: 1 cykl = 1 godzina rzeczywistego czasu; zapasy nie rosną ponad 3 cykle produkcji
const HYDRO_CYCLE_MS = 60 * 60 * 1000;
function hydroTick() {
  const h = save.hydroponics || (save.hydroponics = { lastCheck: Date.now(), food: 0, water: 0 });
  const lvl = moduleLevel(save, "Hydroponika");
  const now = Date.now();
  if (lvl === 0) {
    h.lastCheck = now;
    return;
  }
  const cycles = Math.floor((now - (h.lastCheck || now)) / HYDRO_CYCLE_MS);
  if (cycles <= 0) return;
  const prodFood = lvl;
  const prodWater = Math.ceil(lvl / 2);
  const capFood = Math.max(h.food ?? 0, lvl * 3);
  const capWater = Math.max(h.water ?? 0, prodWater * 3);
  h.food = Math.min(capFood, (h.food ?? 0) + cycles * prodFood);
  h.water = Math.min(capWater, (h.water ?? 0) + cycles * prodWater);
  h.lastCheck += cycles * HYDRO_CYCLE_MS;
}
function renderHydro() {
  const box = $("hydro-status");
  if (!box) return;
  hydroTick();
  const lvl = moduleLevel(save, "Hydroponika");

  if (lvl === 0) {
    box.innerHTML = `<p style="color:#f87171">Hydroponika jest nieaktywna (poziom 0). Ulepsz moduł w sekcji <em>Moduły bazy</em>, aby rozpocząć uprawę pożywienia i produkcję czystej wody.</p>`;
    return;
  }

  const productionRation = lvl;
  const productionWater = Math.ceil(lvl / 2);
  const curFood = save.hydroponics?.food ?? 1;
  const curWater = save.hydroponics?.water ?? 1;

  box.innerHTML = `
    <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:12px;">
      <div style="text-align:center;">
        <span class="term-badge" style="display:inline-block; margin-bottom:4px;">[ŻYWNOŚĆ]</span><br/>
        <strong>Gotowe racje:</strong> ${curFood} szt.
      </div>
      <div style="text-align:center;">
        <span class="term-badge" style="display:inline-block; margin-bottom:4px;">[WODA PITNA]</span><br/>
        <strong>Czysta woda:</strong> ${curWater} szt.
      </div>
      <div style="text-align:center;">
        <span class="term-badge" style="display:inline-block; margin-bottom:4px;">[WYDAJNOŚĆ]</span><br/>
        <strong>Produkcja:</strong> ${productionRation} racji / cykl
      </div>
    </div>
    <p class="hint">Farma działa w trybie zamkniętej biosfery. Zbieraj zapasy regularnie, aby zaopatrzyć się na wyprawy do stref skażonych.</p>
  `;
}

function harvestHydro() {
  const lvl = moduleLevel(save, "Hydroponika");
  if (lvl === 0) return say("Hydroponika nieaktywna. Najpierw ulepsz moduł.", "warn");
  hydroTick();

  const curFood = save.hydroponics?.food ?? 1;
  const curWater = save.hydroponics?.water ?? 1;

  if (curFood <= 0 && curWater <= 0) {
    return say("Brak plonów gotowych do zbioru. Odczekaj kolejny cykl.", "warn");
  }

  let gathered = 0;
  if (curFood > 0) {
    addToContainer(save.stash, "ration", curFood);
    gathered += curFood;
  }
  if (curWater > 0) {
    addToContainer(save.stash, "water", curWater);
    gathered += curWater;
  }

  save.hydroponics.food = 0;
  save.hydroponics.water = 0;
  grantSkillXp(save, "metabolizm", 15);
  say(`Zebrano plony: ${gathered} zapasów przeniesiono do magazynu! (+15 XP Metabolizm).`, "hit");
  edgeGlow("loot");
  persist();
}

// === SEKCJA: WNĘTRZE MODUŁU (CRAFTING & MEDSTATION) ===
function openMod(id) {
  openModule = id;
  say(`Moduł: ${id}.`, "tip");
  renderModule();
  goTo("hub-module");
}

function renderModule() {
  const m = SHIP_MODULES.find((x) => x.id === openModule);
  if (!m) return;
  $("module-title").textContent = `${m.name} (Poz. ${moduleLevel(save, m.id)})`;
  $("module-desc").textContent = m.desc;

  const curLvl = moduleLevel(save, m.id);
  const list = RECIPES.filter((r) => r.module === m.id || (m.id === "Crafting" && r.module === "Warsztat") || (m.id === "Medstation" && r.module === "Medyczny"));

  const rows = list.map((r) => {
    const minLvl = r.minLevel || 1;
    const lvlOk = curLvl >= minLvl;
    const needs = r.in.map(([id, q]) => `${ITEMS[id]?.name || id} ${countItem(save.stash, id)}/${q}`).join(", ");
    const matsOk = r.in.every(([id, q]) => countItem(save.stash, id) >= q);

    const btnLabel = !lvlOk ? `Wymaga poz. ${minLvl}` : "Wytwórz";
    return row(`${r.name} (${needs})`, btn(btnLabel, () => craft(r.id), "", !lvlOk || !matsOk));
  });

  fill("module-recipes", rows, "[Brak receptur dla tej stacji]");
}

function craft(recipeId) {
  const r = RECIPES.find((x) => x.id === recipeId);
  if (!r) return;
  const shortage = r.in
    .filter(([id, q]) => countItem(save.stash, id) < q)
    .map(([id, q]) => `${ITEMS[id]?.name || id} (brakuje ${q - countItem(save.stash, id)})`);
  if (shortage.length) return say(`Brak materiałów w magazynie: ${shortage.join(", ")}.`, "warn");

  r.in.forEach(([id, q]) => removeById(save.stash, id, q));
  addToContainer(save.stash, r.out[0], r.out[1]);

  grantSkillXp(save, "inzynieria", 15);
  say(`Wytworzono: ${r.name} (+15 XP Inżynieria).`, "hit");
  edgeGlow("tech");
  persist();
}

// === SEKCJA: RAJDY & SAFE SYSTEM RADAR ===
// === SEKCJA: MAPA ROZRAIDU – NAWIGACJA: GALAKTYKI → UKŁADY → UKŁAD SŁONECZNY → TYTAN ===
const RAID_TITAN_NODES = [
  { id: "titan_dome", x: 330, y: 92, label: "Kopuła Nowy Ereb" },
  { id: "titan_mines", x: 470, y: 300, label: "Szyby Prometeusz" },
  { id: "titan_archive", x: 170, y: 306, label: "Archiwum" },
];

function mapLockReason(id, ignoreTransit) {
  const m = MAPS[id];
  if (id === "vega" && moduleLevel(save, "Silniki") < 1) return "Wymaga: Napęd Statku poz. 1";
  if (id === "vega" && countItem(save.stash, "fuel_cell") + countItem(save.loadout, "fuel_cell") < 1) return "Wymaga: 1x Ogniwo paliwowe (paliwo na lot)";
  if (m.requiresHash && !(save && save.hashImplemented)) {
    return "Wymaga: zaimplementowanych kodów Hash (system anty-statkowy)";
  }
  if (m.viaTransit && !ignoreTransit) {
    return "Wejście tylko przez transit w: " + ((MAPS[m.viaTransit] || {}).name || m.viaTransit);
  }
  if (m.unlock && getTraderTier(save, m.unlock.trader) < m.unlock.tier) {
    const tr = (TRADERS.find((t) => t.id === m.unlock.trader) || {}).name || m.unlock.trader;
    return "Wymaga: zaufania: " + tr + ", Tier " + m.unlock.tier;
  }
  return null;
}

// Wróć na ekranie rajdu: o jeden poziom mapy w górę (menu tylko z najwyższego poziomu)
function raidMapBack() {
  if (window.rmapBackFn) return window.rmapBackFn();
  goTo("hub-main");
}
window.raidMapBack = raidMapBack;

// Mapa galaktyki buduje się tylko przy wejściu na ekran rajdu (force), a nie przy każdym zapisie.
// Wcześniej renderAll przebudowywał ją w tle: klik mógł trafić w usunięty element albo cofnąć widok.
function renderRaidList(force) {
  const box = $("raid-list");
  if (!box) return;
  if (!force && box.querySelector(".rmap-view")) return;
  box.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "rmap-view";
  box.appendChild(wrap);
  showGalaxies(wrap);
}

// Wspólna rama widoku: tło gwiazd, nagłówek z „wstecz”, treść, panel szczegółów
function rmapSetView(wrap, opts) {
  window.rmapBackFn = opts.back ? opts.back.fn : null;
  const back = opts.back
    ? `<button class="sm ghost" data-back>← ${opts.back.label}</button>`
    : "<span></span>";
  wrap.innerHTML = `
    <div class="rmap-stars"></div>
    <div class="rmap-back">${back}<span class="rmap-title">${opts.title}</span></div>
    ${opts.body}
    <div class="rmap-detail" id="rmap-detail">${opts.detail || "<p>Wybierz cel na mapie.</p>"}</div>`;
  addRmapStars(wrap);
  wrap.classList.remove("rmap-enter");
  void wrap.offsetWidth;
  wrap.classList.add("rmap-enter");
  if (opts.back) wrap.querySelector("[data-back]").addEventListener("click", opts.back.fn);
  if (opts.tutorial && !save.tutorialDone) {
    // samouczek zawsze dostępny z pierwszego widoku, dopóki nie jest ukończony
  }
  wrap.querySelectorAll("[data-map]").forEach((el) => el.addEventListener("click", () => showMapDetail(el.dataset.map)));
  wrap.querySelectorAll("[data-go]").forEach((el) => el.addEventListener("click", () => RMAP_GO[el.dataset.go](wrap)));
  wrap.querySelectorAll("[data-planet]").forEach((el) => el.addEventListener("click", () => showPlanetDetail(el.dataset.planet)));
}

function addRmapStars(wrap) {
  const field = wrap.querySelector(".rmap-stars");
  if (!field) return;
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
    s.style.width = s.style.height = (Math.random() < 0.2 ? 3 : 2) + "px";
    field.appendChild(s);
  }
}

// Spirala galaktyki (rzut ukośny)
function spiralD(cx, cy, arms, turns, rMax) {
  let d = "";
  for (let a = 0; a < arms; a++) {
    const off = (a * 2 * Math.PI) / arms;
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const ang = off + t * turns * 2 * Math.PI;
      const r = rMax * t;
      const x = cx + r * Math.cos(ang);
      const y = cy + r * Math.sin(ang) * 0.5;
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
  }
  return d;
}

function galaxyDots(cx, cy, rMax, n) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const r = rMax * Math.pow(Math.random(), 0.6);
    const a = Math.random() * Math.PI * 2;
    const x = (cx + r * Math.cos(a)).toFixed(1);
    const y = (cy + r * Math.sin(a) * 0.5).toFixed(1);
    s += `<circle cx="${x}" cy="${y}" r="${(Math.random() * 1.6 + 0.6).toFixed(1)}"/>`;
  }
  return s;
}

// --- Poziom 1: galaktyki ---
function showGalaxies(wrap) {
  rmapSetView(wrap, {
    title: "Galaktyki",
    body: `
      <svg class="rmap-svg" viewBox="0 0 640 300" role="img" aria-label="Galaktyki">
        <g class="galaxy" data-go="milky">
          <circle class="gal-hit" cx="170" cy="150" r="150"/>
          <g class="galaxy-spin" style="transform-origin:170px 150px">
            <path class="arm" d="${spiralD(170, 150, 2, 1.8, 130)}"/>
            <g class="dots">${galaxyDots(170, 150, 130, 140)}</g>
          </g>
          <circle class="gal-core" cx="170" cy="150" r="14"/>
          <text x="170" y="292">Droga Mleczna</text>
        </g>
        <g class="galaxy" data-go="whirl">
          <circle class="gal-hit" cx="470" cy="150" r="150"/>
          <g class="galaxy-spin reverse" style="transform-origin:470px 150px">
            <path class="arm red" d="${spiralD(470, 150, 2, 2.4, 110)}"/>
            <g class="dots red">${galaxyDots(470, 150, 110, 110)}</g>
          </g>
          <circle class="gal-core red" cx="470" cy="150" r="12"/>
          <text x="470" y="292">Wirlpool (M51)</text>
        </g>
      </svg>
      <div class="btn-row" style="justify-content:center;margin-top:6px;"><button class="sm primary-btn" data-go="progress">Progresja Map</button></div>`,
    detail: "<p>Wybierz galaktykę, aby zbliżyć się do jej układów gwiezdnych.</p>",
  });
  // samouczek pozostaje dostępny na pierwszym poziomie
  {
    const det = wrap.querySelector("#rmap-detail");
    det.insertAdjacentHTML("afterbegin", '<button class="sm ghost" data-map="tutorial" style="margin-bottom:8px;">Samouczek</button>');
    wrap.querySelector('[data-map="tutorial"]').addEventListener("click", () => showMapDetail("tutorial"));
  }
}

// --- Poziom 2: Droga Mleczna – układy gwiezdne ---
function showMilky(wrap) {
  rmapSetView(wrap, {
    back: { label: "Galaktyki", fn: () => showGalaxies(wrap) },
    title: "Droga Mleczna",
    body: `
      <svg class="rmap-svg" viewBox="0 0 640 320" role="img" aria-label="Droga Mleczna">
        <path class="arm faint" d="${spiralD(320, 160, 2, 1.4, 290)}"/>
        <g class="star" data-go="sol" transform="translate(250 150)">
          <circle class="star-hit" r="26"/><circle class="star-core yellow" r="10"/><text y="34">Słońce · Sol</text>
        </g>
        <g class="star" data-go="vega" transform="translate(430 96)">
          <circle class="star-hit" r="26"/><circle class="star-core blue" r="9"/><text y="32">Wega</text>
        </g>
        <g class="star" data-go="tau" transform="translate(380 236)">
          <circle class="star-hit" r="26"/><circle class="star-core orange" r="9"/><text y="32">Tau Ceti</text>
        </g>
      </svg>`,
    detail: "<p>Trzy zbadane układy. Wybierz gwiazdę, aby wejść do jej układu.</p>",
  });
}

function showWhirl(wrap) {
  rmapSetView(wrap, {
    back: { label: "Galaktyki", fn: () => showGalaxies(wrap) },
    title: "Wirlpool (M51)",
    body: `
      <svg class="rmap-svg" viewBox="0 0 640 260" role="img" aria-label="Wirlpool">
        <g class="galaxy-spin reverse" style="transform-origin:320px 130px">
          <path class="arm faint red" d="${spiralD(320, 130, 2, 2.4, 230)}"/>
        </g>
      </svg>`,
    detail: "<h3>Brak danych</h3><p>Ta galaktyka nie została jeszcze zbadana. Układy gwiezdne są poza zasięgiem.</p>",
  });
}

// --- Poziom 3: układ słoneczny (Sol) – wszystkie planety; nazwy po najechaniu, grywalne zawsze ---
// Orbity spowolnione o 70% (prędkość 30%) – czasy trwania mnożone przez ORBIT_SLOW.
const ORBIT_SLOW = 1 / 0.3;

function ellipsePath(cx, cy, rx, ry) {
  return `M${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`;
}

// Start orbity z różnego miejsca: ujemny begin = przesunięcie fazy
function orbitBegin(i, dur) {
  return `-${(((i * 0.618) % 1) * dur).toFixed(1)}s`;
}

// Opisy planet zgodne z lore (wirus Szept). "maps" = lokacje grywalne na planecie.
const PLANET_INFO = {
  merkury: { name: "Merkury", desc: "Spalona skała bez atmosfery. Stacje pomiarowe przy Słońcu zamilkły jako pierwsze. Nikt nie wraca tu po dane.", maps: [] },
  wenus: { name: "Wenus", desc: "Gęsta, kwasowa atmosfera. Kolonie orbitalne stoją puste, a w chmurach wciąż krążą stare sygnały z pierwszych zarażeń.", maps: [] },
  ziemia: { name: "Ziemia", desc: "Kolebka ludzkości, dziś pogrążona w ciszy. Miasta spłonęły w pierwszej fali Szeptu. Nocą w ruinach migają jeszcze światła, a ocaleni omijają je szerokim łukiem.", maps: ["ziemia_clinic"] },
  mars: { name: "Mars", desc: "Pierwszy świat, na który Szept przeskoczył z Ziemi. Kolonie na powierzchni zamieniły się w pustkowie pełne Pustych. Tu rozbił się twój statek.", maps: [] },
  jowisz: { name: "Jowisz", desc: "Gazowy olbrzym. Jego księżyce były zapleczem przemysłowym. Dziś tylko ciche automaty wciąż wysyłają zapytania o konserwację.", maps: ["jowisz_depths"] },
  saturn: { name: "Saturn", desc: "Pierścienie pełne szczątków zniszczonych statków. Na jego księżycu Tytanie leżało jedno z największych miast w galaktyce.", maps: [] },
  uran: { name: "Uran", desc: "Lodowy olbrzym na krańcu układu. Nadajniki obronne wciąż nadają ostrzeżenia, ale od lat nikt nie odpowiada.", maps: [] },
  neptun: { name: "Neptun", desc: "Najdalsza planeta układu, ciemna i zimna. Zarejestrowano tu sygnały o nietypowej strukturze, których nie udało się rozszyfrować.", maps: ["neptun_relay"] },
  exodus: { name: "Exodus Prime", desc: "Statek-planeta, ostatnia szansa ludzkości na ucieczkę z zarażonych układów. Na razie nie ma tu żadnych lokacji.", maps: [] },
  wega1: { name: "Wega I", desc: "Rozgrzany do czerwoności glob najbliżej gwiazdy. Sondy odebrały tu sygnały, których nie da się wyjaśnić.", maps: [] },
  wega2: { name: "Wega II", desc: "Skalista, martwa planeta. Na orbicie dryfują szczątki transportowców, które wracały z zarażonych kolonii.", maps: [] },
  wega3: { name: "Wega III", desc: "Wilgotny świat z dziwnie bujną zielenią. Badacze pracujący tu jako pierwsi zauważyli zmiany w zachowaniu zwierząt.", maps: [] },
  wega4: { name: "Wega IV", desc: "Lodowy glob, pod którego powierzchnią pracuje stara fabryka syntezy paliw. Szept dotarł tu jako pierwszy, przez transport z Wegi-7.", maps: ["vega_iv_glacier"] },
  tau_e: { name: "Tau Ceti e", desc: "Planeta z normalną atmosferą. Ruiny fabryki Helix i osada kolonistów Ecru. To tu Szept po raz pierwszy wyskoczył poza jedną planetę.", maps: ["tau_e_factory", "tau_e_colony"] },
  tau_f: { name: "Tau Ceti f", desc: "Kryształowa planeta z bastionem anty-statkowym. Zestrzeliwuje każdą jednostkę wylatującą z zainfekowanych układów.", maps: ["tau_f_bastion", "uran_armory"] },
  tau_g: { name: "Tau Ceti g", desc: "Gorący świat w gęstych chmurach. Sondy tracą łączność przy zejściu, więc nikt nie wie, co jest pod spodem.", maps: [] },
  tau_h: { name: "Tau Ceti h", desc: "Zimny, odległy świat na skraju układu. Jego orbitę zaśmiecają szczątki po zniszczonych statkach.", maps: [] },
};

const SOL_PLANETS = [
  { name: "Merkury", rx: 62, r: 2.5, key: "merkury", color: "#a8a29e", dur: 24 },
  { name: "Wenus", rx: 82, r: 3.5, key: "wenus", color: "#fde68a", dur: 34 },
  { name: "Ziemia", rx: 108, r: 4.2, key: "ziemia", ruined: true, dur: 46 },
  { name: "Mars", rx: 134, r: 3.2, key: "mars", color: "#f87171", dur: 60 },
  { name: "Jowisz", rx: 168, r: 9, key: "jowisz", color: "#fdba74", dur: 110 },
  { name: "Saturn", rx: 200, r: 7.5, key: "saturn", color: "#fde68a", dur: 140, rings: true, moon: true },
  { name: "Uran", rx: 230, r: 6, key: "uran", color: "#67e8f9", dur: 180 },
  { name: "Neptun", rx: 260, r: 6.5, key: "neptun", color: "#60a5fa", dur: 220 },
];

function ruinedEarthSvg() {
  return `<g class="ruined-earth">
    <circle r="4.8" class="earth-body"/>
    <path class="cracks" d="M-3 -2 L0 0 L-1.5 3 M1.5 -3.5 L2.5 -0.5 L1 1.5"/>
    <circle class="lights" cx="1.6" cy="-1.4" r="0.7"/>
    <ellipse class="debris" rx="9" ry="3"/>
  </g>`;
}

// Nazwa planety: po najechaniu (lub zawsze, gdy grywalna)
function planetName(text, y, always) {  // grywalne: zawsze; reszta: po najechaniu
  return `<text class="pname${always ? " always" : ""}" y="${y}">${text}</text>`;
}

function showSol(wrap) {
  const cx = 320;
  const cy = 190;
  const ex = { x: 60 + Math.random() * 520, y: 50 + Math.random() * 280 };
  const orbits = SOL_PLANETS.map((p) => `<ellipse class="orbit faint" cx="${cx}" cy="${cy}" rx="${p.rx}" ry="${p.rx * 0.5}"/>`).join("");
  const planets = SOL_PLANETS.map((p, i) => {
    const dur = (p.dur * ORBIT_SLOW).toFixed(0);
    const body = p.ruined ? ruinedEarthSvg() : `<circle r="${p.r}" fill="${p.color}" class="planet-dot"/>`;
    const rings = p.rings ? `<ellipse class="saturn-ring" rx="${(p.r * 2.4).toFixed(1)}" ry="${(p.r * 0.7).toFixed(1)}"/>` : "";
    const moon = p.moon
      ? `<g data-go="titan" class="moon" pointer-events="all">
            <animateMotion dur="${(22 * ORBIT_SLOW).toFixed(0)}s" repeatCount="indefinite" path="${ellipsePath(0, 0, 42, 42)}"/>
            <circle class="moon-hit" r="14" pointer-events="all"/>
            <circle class="moon-body" r="5"/>
            <text y="-12" class="pname always">Tytan</text>
          </g>`
      : "";
    return `<g class="pl" data-planet="${p.key}">
        <animateMotion dur="${dur}s" begin="${orbitBegin(i, Number(dur))}" repeatCount="indefinite" path="${ellipsePath(cx, cy, p.rx, p.rx * 0.5)}"/>
        <circle class="hit" r="${Math.max(9, p.r + 6)}" pointer-events="all"/>
        ${body}${rings}${moon}
        ${planetName(p.name, -(p.r + 8), !!(PLANET_INFO[p.key] && PLANET_INFO[p.key].maps && PLANET_INFO[p.key].maps.length))}
      </g>`;
  }).join("");
  rmapSetView(wrap, {
    back: { label: "Droga Mleczna", fn: () => showMilky(wrap) },
    title: "Układ Słoneczny",
    body: `
      <svg class="rmap-svg sol" viewBox="0 0 640 380" role="img" aria-label="Układ Słoneczny">
        <defs>
          <radialGradient id="gSun" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="#fffbeb"/><stop offset="0.5" stop-color="#fde047"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/>
          </radialGradient>
        </defs>
        ${orbits}
        <circle class="sun-glow" cx="${cx}" cy="${cy}" r="46" fill="url(#gSun)"/>
        <circle class="sun" cx="${cx}" cy="${cy}" r="20"/>
        <text x="${cx}" y="${cy + 38}" class="sun-label">Słońce</text>
        ${planets}
        <g class="exodus" data-go="exodus" transform="translate(${ex.x.toFixed(0)} ${ex.y.toFixed(0)})">
          <circle class="exodus-hit" r="20"/>
          <circle class="exodus-pulse" r="14"/>
          <rect x="-9" y="-4" width="18" height="8" rx="2" class="exodus-body"/>
          <text y="-22" class="pname always">Exodus Prime</text>
        </g>
      </svg>`,
    detail: "<p>Osiem planet krąży wokół Słońca. Grywalne obiekty mają nazwę zawsze widoczną, reszta pokazuje się po najechaniu. Kliknij planetę, by poznać jej historię.</p>",
  });
}

// --- Poziom 3: układ Wega (stacja Wega-7 + planety z nazwami po najechaniu) ---
function showVega(wrap) {
  const cx = 320;
  const cy = 150;
  const specs = [
    { name: "Wega I", key: "wega1", rx: 70, r: 3, dur: 30 },
    { name: "Wega II", key: "wega2", rx: 110, r: 4.5, dur: 55 },
    { name: "Wega III", key: "wega3", rx: 150, r: 5.5, dur: 80 },
    { name: "Wega IV", key: "wega4", play: true, rx: 240, r: 8, dur: 120 },
  ];
  const orbits = specs.map((s) => `<ellipse class="orbit faint" cx="${cx}" cy="${cy}" rx="${s.rx}" ry="${s.rx * 0.5}"/>`).join("");
  const planets = specs
    .map((s, i) => {
      const dur = (s.dur * ORBIT_SLOW).toFixed(0);
      return `<g class="pl" data-planet="${s.key}">
        <animateMotion dur="${dur}s" begin="${orbitBegin(i, Number(dur))}" repeatCount="indefinite" path="${ellipsePath(cx, cy, s.rx, s.rx * 0.5)}"/>
        <circle class="hit" r="${Math.max(9, s.r + 6)}" pointer-events="all"/>
        <circle r="${s.r}" fill="#94a3b8" class="planet-dot"/>
        ${planetName(s.name, -(s.r + 8), !!s.play)}
      </g>`;
    })
    .join("");
  rmapSetView(wrap, {
    back: { label: "Droga Mleczna", fn: () => showMilky(wrap) },
    title: "Układ Wegi",
    body: `
      <svg class="rmap-svg" viewBox="0 0 640 300" role="img" aria-label="Układ Wegi">
        <defs>
          <radialGradient id="gVega" cx="50%" cy="50%" r="50%">
            <stop offset="0" stop-color="#f0f9ff"/><stop offset="0.5" stop-color="#7dd3fc"/><stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/>
          </radialGradient>
        </defs>
        ${orbits}
        <circle class="sun-glow" cx="${cx}" cy="${cy}" r="60" fill="url(#gVega)"/>
        <circle class="sun" cx="${cx}" cy="${cy}" r="20" style="fill:#e0f2fe;stroke:#38bdf8"/>
        <text x="${cx}" y="${cy + 36}" class="sun-label">Wega</text>
        ${planets}
        <g pointer-events="none">
          <animateMotion dur="${(60 * ORBIT_SLOW).toFixed(0)}s" repeatCount="indefinite" path="${ellipsePath(cx, cy, 205, 102)}"/>
          <g data-map="vega" class="station" pointer-events="all">
            <circle class="ring" r="16"/><circle r="9" fill="#38bdf8"/><text y="28" class="pname always">Wega-7</text>
          </g>
        </g>
      </svg>`,
    detail: "<p>Wega-7 to wojskowa stacja badawcza na orbicie Wegi. Wega IV jest jedyną planetą tego układu, na której da się wylądować.</p>",
  });
}

// --- Poziom 3: układ Tau Ceti (planety z nazwami po najechaniu) ---
function showTau(wrap) {
  const cx = 320;
  const cy = 130;
  const specs = [
    { name: "Tau Ceti e", key: "tau_e", play: true, rx: 60, r: 3, dur: 26 },
    { name: "Tau Ceti f", key: "tau_f", play: true, rx: 100, r: 4.5, dur: 40 },
    { name: "Tau Ceti g", key: "tau_g", rx: 140, r: 6, dur: 58 },
    { name: "Tau Ceti h", key: "tau_h", rx: 190, r: 4, dur: 84 },
  ];
  const orbits = specs.map((s) => `<ellipse class="orbit faint" cx="${cx}" cy="${cy}" rx="${s.rx}" ry="${(s.rx * 0.45).toFixed(1)}"/>`).join("");
  const planets = specs
    .map((s, i) => {
      const dur = (s.dur * ORBIT_SLOW).toFixed(0);
      const ry = (s.rx * 0.45).toFixed(1);
      return `<g class="pl" data-planet="${s.key}">
        <animateMotion dur="${dur}s" begin="${orbitBegin(i, Number(dur))}" repeatCount="indefinite" path="${ellipsePath(cx, cy, s.rx, ry)}"/>
        <circle class="hit" r="${Math.max(9, s.r + 6)}" pointer-events="all"/>
        <circle r="${s.r}" fill="#fdba74" class="planet-dot"/>
        ${planetName(s.name, -(s.r + 8), !!s.play)}
      </g>`;
    })
    .join("");
  rmapSetView(wrap, {
    back: { label: "Droga Mleczna", fn: () => showMilky(wrap) },
    title: "Układ Tau Ceti",
    body: `
      <svg class="rmap-svg" viewBox="0 0 640 260" role="img" aria-label="Układ Tau Ceti">
        ${orbits}
        <circle class="sun-glow" cx="${cx}" cy="${cy}" r="60" fill="#fdba74" style="opacity:.22"/>
        <circle class="sun" cx="${cx}" cy="${cy}" r="20" style="fill:#fdba74;stroke:#ea580c"/>
        <text x="${cx}" y="${cy + 36}" class="sun-label">Tau Ceti</text>
        ${planets}
      </svg>`,
    detail: "<p>Tau Ceti e ma normalną atmosferę i da się na nią zejść. Tau Ceti f strzeże bastion anty-statkowy. Pozostałe planety są poza zasięgiem.</p>",
  });
}

// --- Poziom 4: Tytan (schemat przekroju) ---
function showTitan(wrap) {
  rmapSetView(wrap, {
    back: { label: "Układ Słoneczny", fn: () => showSol(wrap) },
    title: "Schemat Tytana",
    body: `
      <svg class="rmap-svg" viewBox="0 0 640 380" role="img" aria-label="Schemat przekroju Tytana">
        <defs>
          <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0c1a2e"/><stop offset="1" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="gCrust" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#78350f"/><stop offset="1" stop-color="#1c0f05"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="640" height="130" fill="url(#gSky)"/>
        <rect x="0" y="130" width="640" height="250" fill="url(#gCrust)"/>
        <path class="surface" d="M0 130 Q320 110 640 130"/>
        <path class="dome dome-glow" d="M250 124 Q330 18 410 124"/>
        <path class="link flow" d="M360 126 Q420 200 470 300"/>
        <path class="link flow" d="M300 126 Q220 220 170 306"/>
        <path class="link faint flow" d="M170 306 Q320 350 470 300"/>
        ${RAID_TITAN_NODES.map((n) => {
          const lock = mapLockReason(n.id);
          return `
          <g class="mnode${lock ? " locked" : ""}" data-map="${n.id}" transform="translate(${n.x} ${n.y})">
            <circle class="pulse" r="18"/>
            <circle class="core" r="9"/>
            <text y="32">${n.label}</text>
            ${lock ? '<text y="48" class="lock-tag">🔒</text>' : ""}
          </g>`;
        }).join("")}
      </svg>`,
    detail: "<p>Tytan, księżyc Saturna, i ostatnia wielka kopuła ludzi: Nowy Ereb. Szept przeszedł przez miasto jak pożar. Wściekli zarażeni biegają ulicami, a w archiwum myśli coś, co nauczyło się planować. Wybierz lokację na schemacie.</p>",
  });
}

// Panel planety: opis + przyciski do lokacji grywalnych na tej planecie
function showPlanetDetail(key) {
  const info = PLANET_INFO[key];
  const det = document.getElementById("rmap-detail");
  if (!info || !det) return;
  det.innerHTML = "";
  det.classList.remove("rmap-enter");
  void det.offsetWidth;
  det.classList.add("rmap-enter");

  const h = document.createElement("h3");
  h.textContent = info.name;
  const p = document.createElement("p");
  p.textContent = info.desc;
  det.append(h, p);

  if (info.maps && info.maps.length) {
    const row = document.createElement("div");
    row.className = "btn-row";
    info.maps.forEach((mid) => {
      const m = MAPS[mid];
      if (!m) return;
      const lock = mapLockReason(mid);
      row.appendChild(btn(`${m.name}${lock ? " (zablokowane)" : ""}`, () => showMapDetail(mid), lock ? "ghost" : "primary-btn"));
    });
    det.appendChild(row);
    info.maps.forEach((mid) => {
      const m = MAPS[mid];
      const lock = m && mapLockReason(mid);
      if (!lock) return;
      const need = document.createElement("p");
      need.className = "hint";
      need.textContent = `${m.name}: ${lock}`;
      det.appendChild(need);
    });
  } else {
    const none = document.createElement("p");
    none.className = "hint";
    none.textContent = "Brak dostępnych lokacji na tej planecie.";
    det.appendChild(none);
  }
}

function showExodus(wrap) {
  const det = wrap.querySelector("#rmap-detail");
  showPlanetDetail("exodus");
  det.classList.remove("rmap-enter");
  void det.offsetWidth;
  det.classList.add("rmap-enter");
}

const RMAP_GO = {
  milky: (w) => showMilky(w),
  whirl: (w) => showWhirl(w),
  sol: (w) => showSol(w),
  vega: (w) => showVega(w),
  tau: (w) => showTau(w),
  titan: (w) => showTitan(w),
  exodus: (w) => showExodus(w),
  progress: (w) => showProgression(w),
};

function showMapDetail(id) {
  const det = document.getElementById("rmap-detail");
  if (!det || !MAPS[id]) return;
  const m = MAPS[id];
  const lock = mapLockReason(id);
  det.innerHTML = "";
  det.classList.remove("rmap-enter");
  void det.offsetWidth;
  det.classList.add("rmap-enter");

  const h = document.createElement("h3");
  h.textContent = m.name;
  const p = document.createElement("p");
  p.textContent = m.intro;
  const diff = document.createElement("p");
  diff.className = "hint";
  const t = m.tier != null ? m.tier : 1;
  const full = Math.floor(t);
  const half = t % 1 >= 0.5 ? 1 : 0;
  diff.textContent = "Trudność: " + "★".repeat(full) + (half ? "◐" : "") + "☆".repeat(Math.max(0, 5 - full - half)) + " (" + t + "/5)";
  det.append(h, p, diff);

  if (moduleLevel(save, "Safe system") >= 1) {
    const nodes = Object.values(m.nodes || {});
    const radar = document.createElement("p");
    radar.className = "radar";
    radar.textContent = `Safe System · lokacji: ${nodes.length} · wrogów: ~${nodes.filter((n) => n.enemy).length} · ewakuacji: ${nodes.filter((n) => n.extract).length}`;
    det.appendChild(radar);
  }

  det.appendChild(
    btn(lock ? `Zablokowane – ${lock}` : "Wyrusz na rajd", () => startRaid(id), lock ? "" : "primary-btn", !!lock)
  );

  document.querySelectorAll("[data-map]").forEach((el) => el.classList.toggle("sel", el.dataset.map === id));
}

// === SEKCJA: AKCJE OGÓLNE ===
// Ikona śmietnika (SVG, dziedziczy kolor tekstu)
const TRASH_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>`;
// Przedmioty questowe, które wolno usunąć: tylko te z tutorialu na Marsie
const MARS_QUEST_ITEMS = new Set(["manual", "part_injector", "part_coil", "part_gasket"]);

let pendingDeleteItem = null;

function hideItemDeleteModal() {
  const modal = $("item-delete-modal");
  if (modal) {
    modal.style.display = "none";
    modal.classList.add("hidden");
  }
  pendingDeleteItem = null;
}

function showItemDeleteModal(sel, it) {
  const modal = $("item-delete-modal");
  const textEl = $("item-delete-modal-text");
  const confirmBtn = $("btn-confirm-delete-item");
  if (!modal || !confirmBtn) return;

  pendingDeleteItem = sel;
  if (textEl) {
    const qtyText = sel.inst.qty > 1 ? ` (ilość: ${sel.inst.qty})` : "";
    textEl.innerHTML = `Czy na pewno chcesz bezpowrotnie usunąć <strong style="color:#ef4444;">${it.name}${qtyText}</strong> z magazynu?<br><span style="font-size:0.85rem; color:#94a3b8;">Tej operacji nie można cofnąć.</span>`;
  }

  confirmBtn.onclick = () => {
    confirmDeleteSelectedItem();
  };

  modal.style.display = "flex";
  modal.classList.remove("hidden");
}

function confirmDeleteSelectedItem() {
  if (!pendingDeleteItem) return hideItemDeleteModal();
  const { view, inst } = pendingDeleteItem;
  const it = ITEMS[inst.id];
  const idx = view.cont.items.indexOf(inst);
  if (idx >= 0) {
    view.cont.items.splice(idx, 1);
    selected = null;
    say(`Usunięto z magazynu: ${it?.name || inst.id}.`, "hit");
    persist();
  }
  hideItemDeleteModal();
}

// Usuwa zaznaczony przedmiot z magazynu lub zestawu. Zakazy: kontener z zawartością, quest spoza Marsa.
function deleteSelected(sel) {
  if (!sel || !sel.inst) return;
  const inst = sel.inst;
  const it = ITEMS[inst.id];
  if (!it) return;

  // Przedmioty questowe: zablokowane poza gwarantowanymi przedmiotami tutorialu z Marsa
  if (it.quest && !MARS_QUEST_ITEMS.has(inst.id)) {
    return say(`Przedmiotu fabularnego nie można usunąć: ${it.name}.`, "warn");
  }

  // Kontenery z zawartością nie mogą być usunięte
  if (it.container && inst.inner && inst.inner.items && inst.inner.items.length > 0) {
    return say(`Najpierw opróżnij kontener: ${it.name}.`, "warn");
  }

  showItemDeleteModal(sel, it);
}

function moveBetween(from, to, inst) {
  const name = ITEMS[inst.id].name;
  if (to.opts.canMoveIn && !to.opts.canMoveIn(inst, from)) return say(`${to.opts.containerName || "Cel"} nie przyjmuje: ${name}.`, "warn");
  if (!quickMove(from, to, inst)) return say(`Brak miejsca: ${name}.`, "warn");
  say(`Przeniesiono: ${name}.`);
}

function clearLoadout() {
  const left = [];
  [...save.loadout.items].forEach((o) => {
    if (o.inner) {
      if (placeInstance(save.stash, o)) left.push(o);
      return;
    }
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

function rest() {
  if (typeof naturalHealBody === "function") {
    naturalHealBody(save, 300);
  } else {
    const medLvl = moduleLevel(save, "Medstation");
    let target = Math.ceil(save.maxHp * 0.5);
    if (medLvl === 1) target = Math.ceil(save.maxHp * 0.85);
    if (medLvl >= 2) target = save.maxHp;
    save.hp = target;
  }

  grantSkillXp(save, "witalnosc", 10);
  // Odpoczynek przywraca co najwyżej 35% jedzenia i 30% picia (więcej trzeba zjeść i wypić)
  save.hunger = Math.max(save.hunger ?? 100, 35);
  save.thirst = Math.max(save.thirst ?? 100, 30);
  markTour("rested");
  say(`Odpoczywasz w schronie (5 minut). Regeneracja HP i leczenie obrażeń ciała (${save.hp} / ${save.maxHp} HP).`, "hit");
  edgeGlow("heal");
  persist();
}

function startRaid(mapId) {
  if (save.loadout.items.some((o) => ITEMS[o.id]?.container)) {
    return say("Kontenerów nie zabierasz na rajd. Odłóż je do magazynu.", "warn");
  }
  if (mapId === "vega") {
    // Lot na Wegę-7 zużywa 1 ogniwo paliwowe (ze schronu lub z zestawu)
    const src = countItem(save.stash, "fuel_cell") > 0 ? save.stash : save.loadout;
    if (countItem(src, "fuel_cell") < 1) return notifyUser("Brak paliwa: potrzebujesz 1x Ogniwo paliwowe.", true);
    removeById(src, "fuel_cell", 1);
    writeSave(save);
  }
  // Oczekujący start: rajd zamieni go na activeRaid przy pierwszym wejściu na stronę rajdu
  save.raidStart = mapId;
  writeSave(save);
  try {
    sessionStorage.removeItem("raidSnap");
  } catch (e) {
    /* nic do czyszczenia */
  }
  window.location.replace(`raid.html?map=${mapId}`);
}

// === SEKCJA: SYSTEM MISJI I ZLECEŃ (FILTRY & MAIN QUEST NEON) ===
let questFilterStatus = "active";
let questLocFilter = "all";

// Lokacja zadania: mapa, na której trzeba wykonać minigrę (terminal, hack, pamięć, przewody)
function questLocation(q) {
  return (q.task && q.task.map) || null;
}

let questLocOpen = false;

// Własna rozwijana lista w stylu gry (zamiast natywnego <select>)
function renderQuestLocSelect() {
  const box = $("qfilter-loc");
  if (!box) return;
  const ids = [...new Set(QUESTS.map(questLocation).filter(Boolean))]
    .sort((a, b) => ((MAPS[a] || {}).name || a).localeCompare((MAPS[b] || {}).name || b, "pl"));
  if (questLocFilter !== "all" && !ids.includes(questLocFilter)) questLocFilter = "all";
  const opts = [["all", "Wszystkie lokacje"]].concat(ids.map((id) => [id, (MAPS[id] || {}).name || id]));
  const cur = opts.find((o) => o[0] === questLocFilter) || opts[0];

  box.innerHTML = "";
  box.classList.toggle("open", questLocOpen);
  const head = document.createElement("button");
  head.type = "button";
  head.className = "gdrop-btn";
  head.textContent = cur[1];
  head.onclick = (e) => {
    e.stopPropagation();
    questLocOpen = !questLocOpen;
    renderQuestLocSelect();
  };
  const menu = document.createElement("div");
  menu.className = "gdrop-menu";
  opts.forEach(([id, label]) => {
    const it = document.createElement("button");
    it.type = "button";
    it.className = "gdrop-item" + (id === questLocFilter ? " sel" : "");
    it.textContent = label;
    it.onclick = (e) => {
      e.stopPropagation();
      questLocFilter = id;
      questLocOpen = false;
      renderQuests();
    };
    menu.appendChild(it);
  });
  box.append(head, menu);
}

// Zamknij listę po kliknięciu poza nią
document.addEventListener("click", () => {
  if (!questLocOpen) return;
  questLocOpen = false;
  renderQuestLocSelect();
});
let showCompletedQuests = false;

// Nowe zlecenia przyjmują się automatycznie (bez przycisku)
function autoAcceptQuests() {
  save.quests = save.quests || {};
  save.questNew = save.questNew || {};
  let count = 0;
  QUESTS.forEach((q) => {
    // Misje główne przyjmujesz tylko w rozmowie z handlarzem
    if (q.isMain) return;
    if ((save.quests[q.id] || "available") !== "available") return;
    if (getQuestAvailability(q, save) !== "available") return;
    save.quests[q.id] = "active";
    save.questNew[q.id] = true;
    count++;
  });
  if (count > 0) {
    writeSave(save);
    say(count === 1 ? "Nowe zlecenie od handlarza." : `Nowe zlecenia od handlarzy: ${count}.`, "hit");
  }
}

// Ładny checkbox „Pokaż ukończone”
function makeCompletedToggle() {
  const lab = document.createElement("label");
  lab.className = "chk";
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = showCompletedQuests;
  cb.onchange = () => {
    showCompletedQuests = cb.checked;
    renderAll();
  };
  const box = document.createElement("span");
  box.className = "chk-box";
  lab.append(cb, box, document.createTextNode(" Pokaż ukończone"));
  return lab;
}

function getQuestAvailability(q, s) {
  s.quests = s.quests || {};

  // Sprawdź czy handlarz jest odblokowany (zależy od poziomu modułu Komunikacji)
  if (typeof availableTraders === "function") {
    const activeTraders = availableTraders();
    const isTraderUnlocked = activeTraders.some((t) => t.id === q.traderId);
    if (!isTraderUnlocked) {
      return "locked_trader";
    }
  }

  const status = s.quests[q.id] || "available";
  if (status === "completed") return "completed";
  if (status === "active") return "active";

  // Misje główne: u jednego handlarza tylko jedna główna naraz, w kolejności z listy MAIN_QUESTS
  if (q.isMain) {
    const sibs = QUESTS.filter((x) => x.isMain && x.traderId === q.traderId);
    const idx = sibs.indexOf(q);
    if (sibs.some((x) => x !== q && (s.quests[x.id] || "available") === "active")) return "locked_main";
    if (sibs.slice(0, idx).some((x) => s.quests[x.id] !== "completed")) return "locked_main";
    return "available";
  }

  // Sprawdź czy handlarz odblokował dany tier
  const traderLvl = typeof getTraderTier === "function" ? getTraderTier(s, q.traderId) : 0;
  if (q.tier !== undefined && q.tier !== null && traderLvl < q.tier) {
    return "locked_tier";
  }

  // Sprawdź progresję faz w obrębie danego tieru handlarza
  const sameTierQuests = QUESTS.filter((x) => x.traderId === q.traderId && x.tier === q.tier && !x.isMain);
  const phase1Quests = sameTierQuests.filter((x) => x.phase === 1);
  const phase2Quests = sameTierQuests.filter((x) => x.phase === 2);
  const baseQuests = [...phase1Quests, ...phase2Quests];

  const phase1DoneCount = phase1Quests.filter((x) => s.quests[x.id] === "completed").length;
  const baseDoneCount = baseQuests.filter((x) => s.quests[x.id] === "completed").length;

  if (q.phase === 1) {
    return "available";
  }
  if (q.phase === 2) {
    if (phase1DoneCount >= 1) return "available";
    return "locked_phase";
  }
  if (q.phase === "final") {
    if (baseDoneCount >= baseQuests.length) return "available";
    return "locked_final";
  }

  return "available";
}

function filterQuestStatus(status) {
  questFilterStatus = status;
  ["ready", "active"].forEach((st) => {
    const b = $(`qfilter-${st}`);
    if (b) {
      if (st === status) b.classList.remove("ghost");
      else b.classList.add("ghost");
    }
  });
  renderQuests();
}

function createQuestCard(q, tr, status) {
  const panel = document.createElement("div");
  panel.className = "panel" + (q.isMain ? " main-quest-card" : "");
  panel.style.borderLeft = `4px solid ${tr.color || "#38bdf8"}`;

  const top = document.createElement("div");
  top.style.display = "flex";
  top.style.justifyContent = "space-between";
  top.style.alignItems = "center";
  top.style.marginBottom = "6px";

  const titleH = document.createElement("h3");
  titleH.style.margin = "0";
  titleH.textContent = q.title;

  const badge = document.createElement("span");
  badge.className = "term-badge";
  badge.style.borderColor = tr.color || "#38bdf8";
  badge.style.color = tr.color || "#38bdf8";

  let tierLabel = q.isMain ? "MISJA GŁÓWNA" : `TIER ${q.tier}`;
  if (q.phase === "final") tierLabel += " // OSTATECZNA";

  const statusLabel = status === "completed" ? "ZAKOŃCZONE" : status === "active" ? "W TRAKCIE" : "DOSTĘPNE";
  badge.textContent = `[${tierLabel}] // ${statusLabel}`;
  top.append(titleH, badge);

  const traderLine = document.createElement("div");
  traderLine.style.fontSize = "0.85rem";
  traderLine.style.color = tr.color || "#94a3b8";
  traderLine.style.fontWeight = "bold";
  traderLine.style.marginBottom = "6px";
  traderLine.textContent = `Zleceniodawca: ${tr.name}`;

  const desc = document.createElement("p");
  desc.style.margin = "4px 0 8px 0";
  desc.textContent = q.desc;

  // Postęp wymaganych zasobów
  const reqBox = document.createElement("div");
  reqBox.style.fontSize = "0.88rem";
  reqBox.style.marginBottom = "8px";
  reqBox.style.padding = "6px 8px";
  reqBox.style.background = "rgba(15, 23, 42, 0.6)";
  reqBox.style.borderRadius = "4px";

  let allReqsMet = true;
  // Zlecenia fabularne i powyżej Tieru 0: trzeba WYNIEŚĆ przedmioty z rajdu (udana ewakuacja)
  const needsCarryCard = q.isMain || q.tier !== 0;
  const carriedNow = (save.questCarry || {})[q.id] || {};
  const reqLines = q.req.map((r) => {
    const itemName = ITEMS[r.id]?.name || r.id;
    if (needsCarryCard) {
      const got = Math.min(r.qty, carriedNow[r.id] || 0);
      const metC = got >= r.qty;
      if (!metC) allReqsMet = false;
      return `<span style="color:${metC ? '#4ade80' : '#f87171'}">${metC ? '[OK]' : '[BRAK]'} Ewakuuj się z ${itemName} ${got}/${r.qty}</span>`;
    }
    const have = countItem(save.stash, r.id) + countItem(save.loadout, r.id);
    const isMet = have >= r.qty;
    if (!isMet) allReqsMet = false;
    return `<span style="color:${isMet ? '#4ade80' : '#f87171'}">${isMet ? '[OK]' : '[BRAK]'} ${itemName}: ${have} / ${r.qty}</span>`;
  });
  if (q.needModule) {
    const lvl = moduleLevel(save, q.needModule.id);
    const okMod = lvl >= q.needModule.level;
    if (!okMod) allReqsMet = false;
    const modName = (SHIP_MODULES.find((m) => m.id === q.needModule.id) || {}).name || q.needModule.id;
    reqLines.push('<span style="color:' + (okMod ? "#4ade80" : "#f87171") + '">' + (okMod ? "[OK]" : "[BRAK]") + " Ulepsz: " + modName + " do poziomu " + q.needModule.level + " (teraz " + lvl + ")</span>");
  }
  if (q.kill) {
    const killed = !!(save.kills || {})[q.kill];
    if (!killed) allReqsMet = false;
    reqLines.push('<span style="color:' + (killed ? "#4ade80" : "#f87171") + '">' + (killed ? "[OK]" : "[BRAK]") + " Pokonaj cel zlecenia</span>");
  }
  if (q.task) {
    const termDone = !!(save.taskDone || {})[q.id];
    if (!termDone) allReqsMet = false;
    reqLines.push(
      `<span style="color:${termDone ? '#4ade80' : '#22d3ee'}">${termDone ? '[OK]' : '[BRAK]'} ${q.task.label} w rajdzie (${MAPS[q.task.map]?.nodes?.[q.task.node]?.name || q.task.node})</span>`
    );
  }
  reqBox.innerHTML = `<strong>Wymagane zasoby:</strong> ` + reqLines.join(" | ");

  // Nagroda
  const rewardBox = document.createElement("div");
  rewardBox.style.fontSize = "0.85rem";
  rewardBox.style.color = "#38bdf8";
  rewardBox.style.marginBottom = "10px";
  const repReward = q.reward.rep || 30;
  let rewardText = `Nagroda: +${q.reward.credits} kr, +${q.reward.xp} XP, +${repReward} Reputacji`;
  if (q.reward.item && ITEMS[q.reward.item]) {
    rewardText += `, ${ITEMS[q.reward.item].name}${q.reward.itemQty > 1 ? ` x${q.reward.itemQty}` : ""}`;
  }
  if (q.reward.bonusItem && ITEMS[q.reward.bonusItem]) rewardText += `, ${ITEMS[q.reward.bonusItem].name}`;
  rewardBox.textContent = rewardText;

  // Przyciski akcji
  const actionRow = document.createElement("div");
  actionRow.className = "btn-row";

  if (status === "completed") {
    const doneLabel = document.createElement("span");
    doneLabel.style.color = "#10b981";
    doneLabel.style.fontWeight = "bold";
    doneLabel.textContent = "[ZLECENIE WYKONANE I ODEBRANE]";
    actionRow.appendChild(doneLabel);
  } else if (q.isMain && status === "available") {
    actionRow.appendChild(btn("Porozmawiaj z handlarzem", () => playOfferDialogue(q), "primary-btn"));
  } else if (status === "active") {
    // Rozmowa z handlarzem dotyczy wyłącznie zleceń głównych; tierowe oddaje się bez dialogu
    if (q.isMain) {
      const ready = !mainBlocker(q);
      actionRow.appendChild(
        btn(
          ready ? "Porozmawiaj i oddaj zlecenie" : "Zbierz wymagane przedmioty...",
          () => playDoneDialogue(q),
          ready ? "primary-btn" : "ghost",
          !ready
        )
      );
    } else {
      actionRow.appendChild(
        btn(
          allReqsMet ? "Oddaj zlecenie i odbierz nagrodę" : "Zbierz wymagane przedmioty...",
          () => turnInQuest(q.id),
          allReqsMet ? "primary-btn" : "ghost",
          !allReqsMet
        )
      );
    }
  }

  // Nowe zlecenie mruga, dopóki nie najedziemy na nie myszką
  if (save.questNew && save.questNew[q.id]) {
    panel.classList.add("quest-new");
    panel.addEventListener(
      "mouseenter",
      () => {
        panel.classList.remove("quest-new");
        delete save.questNew[q.id];
        writeSave(save);
      },
      { once: true }
    );
  }

  panel.append(top, traderLine, desc, reqBox, rewardBox, actionRow);
  return panel;
}

function renderQuests() {
  const box = $("quests-list");
  if (!box || typeof QUESTS === "undefined") return;
  box.innerHTML = "";
  save.quests = save.quests || {};
  autoAcceptQuests();

  const slot = $("qchk-slot");
  if (slot) {
    slot.innerHTML = "";
    slot.appendChild(makeCompletedToggle());
  }

  renderQuestLocSelect();
  const list = QUESTS.filter((q) => {
    if (questLocFilter !== "all" && questLocation(q) !== questLocFilter) return false;
    const avail = getQuestAvailability(q, save);
    if (avail.startsWith("locked")) return false;

    const status = save.quests[q.id] || "available";
    if (status === "completed") return showCompletedQuests;

    const allReqsMet =
      q.req.every((r) => countItem(save.stash, r.id) + countItem(save.loadout, r.id) >= r.qty) &&
      (!q.task || !!(save.taskDone || {})[q.id]) &&
      (!q.kill || !!(save.kills || {})[q.kill]);

    if (questFilterStatus === "ready") return status === "active" && allReqsMet;
    if (q.isMain && status === "available") return true; // do przyjęcia w rozmowie
    return status === "active";
  });

  if (!list.length) {
    box.innerHTML = save.tutorialDone && questFilterStatus !== "ready" && !showCompletedQuests
      ? `<p class="hint">Brak aktywnych zleceń. Samouczek zaliczony: nowa mapa <strong>Tytan - Kopuła Nowy Ereb</strong> jest już otwarta. Wybierz ją na ekranie rajdu, a zlecenia handlarzy pojawią się w miarę postępów.</p>`
      : `<p class="hint">Brak zleceń w tym widoku.</p>`;
    return;
  }

  list.forEach((q) => {
    const tr = TRADERS.find((t) => t.id === q.traderId) || { name: "Handlarz", color: "#38bdf8" };
    const status = save.quests[q.id] || "available";
    box.appendChild(createQuestCard(q, tr, status));
  });
}

function turnInQuest(questId) {
  const q = QUESTS.find((x) => x.id === questId);
  if (!q || save.quests[questId] !== "active") return;
  if (q.kill && !(save.kills || {})[q.kill]) return say("Najpierw pokonaj cel zlecenia.", "warn");
  if (q.needModule && moduleLevel(save, q.needModule.id) < q.needModule.level) {
    return say("Najpierw ulepsz wymagany moduł bazy.", "warn");
  }
  if (q.task && !(save.taskDone || {})[q.id]) {
    return say(`Najpierw wykonaj zadanie w rajdzie (${q.task.label}).`, "warn");
  }

  const needsCarry = q.isMain || q.tier !== 0;
  if (needsCarry) {
    const carried = (save.questCarry || {})[q.id] || {};
    const okCarry = q.req.every((r) => (carried[r.id] || 0) >= r.qty);
    if (!okCarry) {
      return say("Najpierw ewakuuj się z wymaganymi przedmiotami (zobacz wymagania zlecenia).", "warn");
    }
  }

  const canTurnIn = q.req.every((r) => {
    const total = countItem(save.stash, r.id) + countItem(save.loadout, r.id);
    return total >= r.qty;
  });

  if (!canTurnIn) return say("Nie posiadasz wszystkich wymaganych przedmiotów.", "warn");

  q.req.forEach((r) => {
    let needed = r.qty;
    const inLoad = countItem(save.loadout, r.id);
    if (inLoad > 0) {
      const take = Math.min(needed, inLoad);
      removeById(save.loadout, r.id, take);
      needed -= take;
    }
    if (needed > 0) {
      removeById(save.stash, r.id, needed);
    }
  });

  save.credits += q.reward.credits;
  const ups = grantXp(save, q.reward.xp);
  if (q.reward.item && ITEMS[q.reward.item]) {
    addToContainer(save.stash, q.reward.item, q.reward.itemQty || 1);
  }
  if (q.reward.bonusItem && ITEMS[q.reward.bonusItem]) {
    addToContainer(save.stash, q.reward.bonusItem, 1);
  }

  save.quests[questId] = "completed";
  if (save.questCarry) delete save.questCarry[questId];
  save.completedQuests = save.completedQuests || [];
  if (!save.completedQuests.includes(questId)) save.completedQuests.push(questId);

  // Dodawanie reputacji u handlarza
  save.traderRep = save.traderRep || {};
  const prevTier = typeof getTraderTier === "function" ? getTraderTier(save, q.traderId) : 0;
  const repGain = q.reward.rep || 30;
  save.traderRep[q.traderId] = (save.traderRep[q.traderId] || 0) + repGain;
  const newTier = typeof getTraderTier === "function" ? getTraderTier(save, q.traderId) : 0;

  const trObj = TRADERS.find((t) => t.id === q.traderId);
  let repMsg = ` (+${repGain} Reputacji u ${trObj ? trObj.name : "handlarza"})`;
  if (newTier > prevTier) {
    repMsg += ` ➔ [AWANS HANDLARZA NA TIER ${newTier}!] Odblokowano nowe towary w sklepie i nowe zlecenia!`;
    edgeGlow("level");
  }

  say(`Zlecenie "${q.title}" zakończone sukcesem! Nagroda: +${q.reward.credits} kr, +${q.reward.xp} XP${repMsg}${ups ? ` (Awans na poziom ${save.level}!)` : ""}.`, "hit");
  edgeGlow("extract");
  persist();
}



// === SEKCJA: IMPLEMENTACJA KODÓW HASH (minigra "Protokół Hash") ===
// 3 rundy. Każda runda pokazuje ciąg znaków (3, 4, 5). Po chwili kod znika i trzeba
// kliknąć te znaki w siatce 4x4 w dobrej kolejności. Trzy życia; błąd resetuje rundę.
function startHashMinigame(view, inst) {
  if (!inst || inst.id !== "hash_codes") return;
  if (document.getElementById("hash-mg")) return;
  const HEX = "0123456789ABCDEF";
  const ROUNDS = 3;
  let round = 1;
  let lives = 3;
  let step = 0;
  let target = [];
  let cells = [];
  let clicked = new Set();
  let busy = true;

  const ov = document.createElement("div");
  ov.id = "hash-mg";
  ov.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,.85);display:flex;align-items:center;justify-content:center;z-index:9999;";
  const box = document.createElement("div");
  box.className = "panel";
  box.style.cssText = "min-width:320px;max-width:420px;text-align:center;border:1px solid #38bdf8;padding:16px;";
  ov.appendChild(box);
  document.body.appendChild(ov);

  const onKey = (e) => {
    if (e.key === "Escape") close();
  };
  const close = () => {
    document.removeEventListener("keydown", onKey);
    ov.remove();
  };
  document.addEventListener("keydown", onKey);

  const rnd = () => HEX[Math.floor(Math.random() * HEX.length)];

  function newRound() {
    const len = 2 + round;
    target = Array.from({ length: len }, rnd);
    const pos = [...Array(16).keys()].sort(() => Math.random() - 0.5).slice(0, len);
    cells = Array.from({ length: 16 }, rnd);
    pos.forEach((p, i) => (cells[p] = target[i]));
    clicked = new Set();
    step = 0;
    showTarget();
  }

  function header(text) {
    const h = document.createElement("h3");
    h.textContent = "Protokół Hash - implementacja kodów";
    const info = document.createElement("p");
    info.className = "hint";
    info.textContent = `Runda ${round}/${ROUNDS} · Życia: ${"♥".repeat(lives)}${"·".repeat(3 - lives)}`;
    const msg = document.createElement("p");
    msg.style.minHeight = "1.4em";
    msg.textContent = text || "";
    box.replaceChildren(h, info, msg);
    return msg;
  }

  function showTarget() {
    busy = true;
    const msg = header("Zapamiętaj kod:");
    const code = document.createElement("div");
    code.style.cssText = "font-family:monospace;font-size:1.8rem;letter-spacing:.4em;color:#38bdf8;margin:14px 0;";
    code.textContent = target.join(" ");
    box.appendChild(code);
    setTimeout(() => {
      if (!ov.isConnected) return;
      code.textContent = "? ? ?";
      msg.textContent = "Kod ukryty. Znajdź znaki w siatce w dobrej kolejności.";
      showGrid();
    }, 2800 + round * 400);
  }

  function showGrid() {
    busy = false;
    const grid = document.createElement("div");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px;";
    cells.forEach((ch, idx) => {
      const b = document.createElement("button");
      b.className = "sm ghost";
      b.style.fontFamily = "monospace";
      b.style.margin = "0";
      b.textContent = ch;
      b.dataset.idx = String(idx);
      b.onclick = () => pick(idx, b);
      grid.appendChild(b);
    });
    box.appendChild(grid);
  }

  function pick(idx, btnEl) {
    if (busy || clicked.has(idx)) return;
    const msgEl = box.querySelector("p:last-of-type") || null;
    if (cells[idx] === target[step]) {
      clicked.add(idx);
      btnEl.disabled = true;
      btnEl.classList.add("primary-btn");
      step++;
      if (step === target.length) {
        busy = true;
        if (round >= ROUNDS) return win();
        round++;
        const m = header("Kod przyjęty. Kolejna runda...");
        setTimeout(() => ov.isConnected && newRound(), 900);
        return m;
      }
    } else {
      lives--;
      if (lives <= 0) return lose();
      busy = true;
      const m = header(`Błąd protokołu! Pozostało prób: ${lives}. Runda startuje od nowa.`);
      setTimeout(() => ov.isConnected && showTarget(), 1400);
      return m;
    }
    return msgEl;
  }

  function win() {
    close();
    consumeInst(view.cont, inst, 1);
    save.hashImplemented = true;
    persist();
    say("[HASH] Kody zaimplementowane. System anty-statkowy na Tau Ceti f zaakceptuje statek.", "hit");
    edgeGlow("tech");
  }

  function lose() {
    close();
    say("[HASH] Protokół odrzucony. Kody nie zostały zaimplementowane. Spróbuj ponownie.", "warn");
  }

  newRound();
}


// === SEKCJA: POŁĄCZENIE Z HANDLARZEM ===
// Na razie tylko standardowa odpowiedź. Treści rozmów dojdą później (system dialogów w dialogue.js).
function ensureCharacters() {
  TRADERS.forEach((t) => {
    CHARACTERS[t.id] = CHARACTERS[t.id] || { name: t.name, portrait: null };
  });
  CHARACTERS.player = { name: (save && save.name) || "Ty", portrait: null };
  CHARACTERS.narrator = { name: "", portrait: null };
}

// Linie z danych: t = handlarz, n = narrator, p = gracz; wybory zostają jako choice
function mainDialogLines(q, part) {
  const d = (typeof MAIN_DIALOGS !== "undefined" && MAIN_DIALOGS[q.id]) || null;
  if (!d || !d[part]) {
    // Zlecenia bez osobnej rozmowy: krótkie zlecenie z opisu
    return part === "offer"
      ? [{ speaker: q.traderId, text: q.desc }]
      : [{ speaker: q.traderId, text: "Dobra robota. Oto twoja nagroda." }];
  }
  return d[part].map((l) => {
    if (l.choice) return { choice: l.choice };
    const speaker = l.k === "t" ? q.traderId : l.k === "n" ? "narrator" : "player";
    return { speaker, text: l.text };
  });
}

// Co jeszcze blokuje oddanie głównej misji (null = gotowa do oddania)
function mainBlocker(q) {
  if (q.kill && !(save.kills || {})[q.kill]) return "Pokonaj cel zlecenia.";
  if (q.needModule && moduleLevel(save, q.needModule.id) < q.needModule.level) return "Ulepsz wymagany moduł bazy.";
  if (q.task && !(save.taskDone || {})[q.id]) return `Wykonaj zadanie w rajdzie: ${q.task.label}.`;
  // Zlecenia tier 0 (poza głównymi) nie wymagają wyniesienia z rajdu, tak jak w turnInQuest()
  if (q.isMain || q.tier !== 0) {
    const carried = (save.questCarry || {})[q.id] || {};
    if (!q.req.every((r) => (carried[r.id] || 0) >= r.qty)) return "Ewakuuj się z wymaganymi przedmiotami.";
  }
  if (!q.req.every((r) => countItem(save.stash, r.id) + countItem(save.loadout, r.id) >= r.qty)) return "Zbierz wymagane przedmioty.";
  return null;
}

function acceptMainQuest(q) {
  if ((save.quests[q.id] || "available") !== "available") return;
  if (getQuestAvailability(q, save) !== "available") return;
  save.quests[q.id] = "active";
  save.questNew = save.questNew || {};
  delete save.questNew[q.id];
  say(`Przyjęto misję: ${q.title}.`, "hit");
  persist();
}

function playOfferDialogue(q) {
  ensureCharacters();
  DIALOGUES["main_offer_" + q.id] = mainDialogLines(q, "offer");
  playDialogue("main_offer_" + q.id, () => acceptMainQuest(q));
}

function playDoneDialogue(q) {
  const blocker = mainBlocker(q);
  if (blocker) return say(blocker, "warn");
  ensureCharacters();
  DIALOGUES["main_done_" + q.id] = mainDialogLines(q, "done");
  playDialogue("main_done_" + q.id, () => turnInQuest(q.id));
}

// „Połącz się”: oddanie aktywnej misji, przyjęcie nowej misji albo krótka rozmowa
function connectTrader(tr) {
  ensureCharacters();
  // 1. Sprawdź aktywne misje tego handlarza gotowe do oddania (główne lub tierowe z dialogiem)
  const myQuests = QUESTS.filter((q) => q.traderId === tr.id);
  const activeReady = myQuests.find((q) => {
    if (!q.isMain || save.quests[q.id] !== "active") return false;
    return !mainBlocker(q);
  });
  if (activeReady) {
    return playDoneDialogue(activeReady);
  }

  // 2. Jeśli jest dostępna misja główna - zaoferuj dialog
  const mains = myQuests.filter((q) => q.isMain);
  const nextMain = mains.find((q) => (save.quests[q.id] || "available") === "available" && getQuestAvailability(q, save) === "available");
  if (nextMain) return playOfferDialogue(nextMain);

  // 3. Aktywne główne zlecenie, którego gracz jeszcze nie skończył: przypomnienie bez nazwy zlecenia
  const blockedMain = myQuests.find((q) => q.isMain && save.quests[q.id] === "active" && mainBlocker(q));
  if (blockedMain) {
    return playIdleDialogue(tr, `Czego chcesz? ${blockerHint(blockedMain)}`);
  }

  // 4. Kwestie klimatyczne TRADER_IDLE
  const lines = (typeof TRADER_IDLE !== "undefined" && TRADER_IDLE[tr.id]) || ["Nie mam dla ciebie żadnych wiadomości."];
  playIdleDialogue(tr, lines[Math.floor(Math.random() * lines.length)]);
}

// Ile z wymaganych przedmiotów gracz już ma (magazyn, zestaw lub wyniesione z rajdów)
function questProgress(q) {
  const carried = (save.questCarry || {})[q.id] || {};
  return q.req.reduce((sum, r) => {
    const have = Math.max(carried[r.id] || 0, countItem(save.stash, r.id) + countItem(save.loadout, r.id));
    return sum + Math.min(r.qty, have);
  }, 0);
}

// Naturalna podpowiedź dla gracza, czego brakuje do oddania zlecenia
function blockerHint(q) {
  if (q.kill && !(save.kills || {})[q.kill]) return "Wróć, gdy pokonasz cel zlecenia.";
  if (q.needModule && moduleLevel(save, q.needModule.id) < q.needModule.level) return "Wróć, gdy ulepszysz wymagany moduł.";
  if (q.task && !(save.taskDone || {})[q.id]) return "Wróć, gdy wykonasz zadanie w rajdzie.";
  const inHand = q.req.every((r) => countItem(save.stash, r.id) + countItem(save.loadout, r.id) >= r.qty);
  return inHand ? "Wróć, gdy wyniesiesz z rajdu wymagane przedmioty." : "Wróć, gdy zdobędziesz wymagane przedmioty.";
}

function playIdleDialogue(tr, text) {
  ensureCharacters();
  DIALOGUES["connect_" + tr.id] = [{ speaker: tr.id, text }];
  playDialogue("connect_" + tr.id);
}


// === SEKCJA: PRZEWODNIK PO BAZIE (zadaniowy tutorial menu schronu) ===
// Pokazuje się raz, po ukończeniu samouczka na Marsie. Każdy krok wymaga wykonania czynności
// i przechodzi dalej dopiero po jej zaliczeniu. Zawiesza się przy wejściu do innego ekranu.
function markTour(key) {
  if (!save) return;
  save.tour = save.tour || {};
  if (save.tour[key]) return;
  save.tour[key] = true;
  persist();
}

function tourModuleSum() {
  return SHIP_MODULES.reduce((a, m) => a + moduleLevel(save, m.id), 0);
}

// intro: "Dalej". Pozostałe: zaliczają się same po wykonaniu czynności (check).
const BASE_TOUR_STEPS = [
  {
    target: "hub-status",
    text: "Witaj w schronie. Tu wracasz po rajdach. Na górze widzisz zdrowie, kredyty i stan bazy. Przejdź krótkie zadania, żeby poznać każdy dział.",
    task: null,
  },
  {
    target: "btn-hub-inv",
    text: "Załóż pancerz albo broń. Otwórz Ekwipunek & Magazyn i przeciągnij przedmiot na wolny slot.",
    task: "Załóż pancerz lub broń",
    check: () => {
      const e = save.equipped || {};
      return !!(e.armor || e.ranged || e.melee);
    },
  },
  {
    target: "btn-hub-quests",
    text: "Zajrzyj do Misji Handlarzy. Tu zobaczysz, czego potrzebują kolonie i jakie nagrody czekają.",
    task: "Otwórz Misje Handlarzy",
    check: () => !!(save.tour && save.tour["visit_hub-quests"]),
  },
  {
    target: "btn-hub-trader",
    text: "Kup dowolny przedmiot u handlarza. Wybierz towar i zatwierdź zakup.",
    task: "Kup przedmiot u handlarza",
    check: () => !!(save.tour && save.tour.bought),
  },
  {
    target: "btn-hub-ship",
    text: "Ulepsz dowolny moduł bazy. Każdy moduł otwiera nowe możliwości w schronie.",
    task: "Ulepsz moduł bazy",
    check: () => !!(save.tour && save.tour.tourSum != null && tourModuleSum() > save.tour.tourSum),
    onStart: () => {
      save.tour = save.tour || {};
      if (save.tour.tourSum == null) {
        save.tour.tourSum = tourModuleSum();
        persist();
      }
    },
  },
  {
    target: "btn-hub-rest",
    text: "Odpocznij w schronie, żeby zregenerować siły przed kolejnym rajdem.",
    task: "Odpocznij",
    check: () => !!(save.tour && save.tour.rested),
  },
  {
    target: "btn-hub-raid",
    text: "Wyrusz na rajd. Wybierz mapę na galaktyce, a potem wejdź do lokacji.",
    task: "Otwórz ekran wyprawy",
    check: () => !!(save.tour && save.tour["visit_hub-raid"]),
  },
];

let baseTourIdx = 0;
let baseTourPop = null;
let baseTourHl = null;
let baseTourTimer = null;

function ensureBaseTourStyle() {
  if (document.getElementById("tour-style")) return;
  const st = document.createElement("style");
  st.id = "tour-style";
  st.textContent = `
    .tour-hl { outline: 2px solid var(--accent-glow) !important; box-shadow: 0 0 18px rgba(139, 92, 246, 0.6) !important; position: relative; z-index: 8000; }
    #tour-pop { position: fixed; z-index: 9000; max-width: 320px; background: var(--btn-bg); color: var(--text-color); border: 1px solid var(--btn-border); box-shadow: 0 0 16px rgba(139, 92, 246, 0.3); padding: 12px 14px; font-family: "Karla", sans-serif; font-size: 0.95rem; line-height: 1.4; }
    #tour-pop .tour-step { font-family: "Share Tech Mono", monospace; font-size: 0.7rem; color: var(--accent-glow); margin-bottom: 6px; }
    #tour-pop .tour-task { margin-top: 8px; padding: 6px 8px; border: 1px dashed var(--btn-border); font-family: "Share Tech Mono", monospace; font-size: 0.8rem; }
    #tour-pop .tour-task.done { color: #4ade80; border-style: solid; }
    #tour-pop .tour-actions { display: flex; justify-content: space-between; gap: 8px; margin-top: 10px; }
  `;
  document.head.appendChild(st);
}

function hideBaseTourPopup() {
  if (baseTourTimer) clearInterval(baseTourTimer);
  baseTourTimer = null;
  if (baseTourPop) baseTourPop.remove();
  baseTourPop = null;
  if (baseTourHl) baseTourHl.classList.remove("tour-hl");
  baseTourHl = null;
}

function finishBaseTour() {
  hideBaseTourPopup();
  save.baseTourDone = true;
  persist();
}

function maybeRunBaseTour() {
  if (!save || !save.tutorialDone || save.baseTourDone) return;
  const hub = document.getElementById("hub-main");
  if (!hub || !hub.classList.contains("active")) return;
  if (baseTourPop) return;
  ensureBaseTourStyle();
  showBaseTourStep(baseTourIdx);
}

function showBaseTourStep(idx) {
  if (idx >= BASE_TOUR_STEPS.length) return finishBaseTour();
  baseTourIdx = idx;
  const step = BASE_TOUR_STEPS[idx];
  const el = document.getElementById(step.target);
  if (!el) return showBaseTourStep(idx + 1);
  hideBaseTourPopup();
  if (step.onStart) step.onStart();
  if (step.check && step.check()) return showBaseTourStep(idx + 1);

  el.classList.add("tour-hl");
  baseTourHl = el;

  const pop = document.createElement("div");
  pop.id = "tour-pop";
  const info = document.createElement("div");
  info.className = "tour-step";
  info.textContent = `PRZEWODNIK ${idx + 1}/${BASE_TOUR_STEPS.length}`;
  const txt = document.createElement("div");
  txt.textContent = step.text;
  pop.append(info, txt);

  const taskEl = document.createElement("div");
  taskEl.className = "tour-task";
  const isIntro = !step.check;
  if (!isIntro) {
    taskEl.textContent = `Zadanie: ${step.task}`;
    pop.appendChild(taskEl);
  }

  const row = document.createElement("div");
  row.className = "tour-actions";
  const skip = btn("Pomiń przewodnik", finishBaseTour, "ghost");
  row.appendChild(skip);
  if (isIntro) {
    row.appendChild(btn("Dalej", () => showBaseTourStep(idx + 1), "primary-btn"));
  }
  pop.appendChild(row);
  document.body.appendChild(pop);
  baseTourPop = pop;

  if (!isIntro) {
    baseTourTimer = setInterval(() => {
      if (!step.check || !step.check()) return;
      clearInterval(baseTourTimer);
      baseTourTimer = null;
      taskEl.classList.add("done");
      taskEl.textContent = "Zrobione!";
      setTimeout(() => showBaseTourStep(idx + 1), 900);
    }, 400);
  }

  const r = el.getBoundingClientRect();
  const pw = pop.offsetWidth || 300;
  const ph = pop.offsetHeight || 120;
  let left = r.right + 14;
  if (left + pw > window.innerWidth - 8) left = Math.max(8, r.left - pw - 14);
  let top = r.top + r.height / 2 - ph / 2;
  top = Math.max(8, Math.min(top, window.innerHeight - ph - 8));
  pop.style.left = left + "px";
  pop.style.top = top + "px";
  el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}


// === SEKCJA: KLINIKA MEDYCZNA (leczenie za kredyty) ===
// To, czego odpoczynek nie leczy (albo leczy tylko częściowo). Cena zależy od powagi.
const CLINIC_PRICES = { krwawienie: 150, mocne_krwawienie: 300, zlamanie: 500, szept: 1000 };

function clinicCure(effId) {
  const price = CLINIC_PRICES[effId];
  if (!price) return;
  if ((save.credits || 0) < price) return say("[KLINIKA] Za mało kredytów.", "warn");
  save.credits -= price;
  Object.values(save.body || {}).forEach((p) => {
    if (p && Array.isArray(p.status)) p.status = p.status.filter((x) => x !== effId);
  });
  persist();
  say(`[KLINIKA] Wyleczono: ${(BODY_EFFECTS[effId] || {}).name || effId} (-${price} kr).`, "hit");
  renderAll();
}

function renderClinic(parent) {
  const present = new Set();
  Object.values(save.body || {}).forEach((p) => {
    if (p && Array.isArray(p.status)) p.status.forEach((e) => { if (CLINIC_PRICES[e]) present.add(e); });
  });
  const box = document.createElement("div");
  box.className = "panel";
  box.style.marginTop = "10px";
  const h = document.createElement("div");
  h.style.fontWeight = "bold";
  h.textContent = "Klinika: leczenie za kredyty";
  box.appendChild(h);
  if (!present.size) {
    const none = document.createElement("div");
    none.className = "hint";
    none.textContent = "Nie masz żadnych ran do wyleczenia.";
    box.appendChild(none);
  } else {
    const row = document.createElement("div");
    row.className = "btn-row";
    present.forEach((eff) => {
      const price = CLINIC_PRICES[eff];
      row.appendChild(btn(`${(BODY_EFFECTS[eff] || {}).name || eff} (${price} kr)`, () => clinicCure(eff), "primary-btn", (save.credits || 0) < price));
    });
    box.appendChild(row);
  }
  parent.appendChild(box);
}


// === SEKCJA: PROGRESJA MAP (schemat drzew) ===
// Układ węzłów ustalony ręcznie; połączenia wynikają z MAP_REQUIREMENTS (zawsze zgodne z blokadami).
const PROG_LAYOUT = {
  tutorial: { x: 60, y: 135, label: "Samouczek (Mars)" },
  titan_dome: { x: 150, y: 70, label: "Kopuła Tytana" },
  titan_mines: { x: 280, y: 70, label: "Kopalnia Prometeusz" },
  titan_archive: { x: 410, y: 70, label: "Archiwum" },
  vega: { x: 540, y: 70, label: "Wega-7" },
  tau_e_colony: { x: 150, y: 220, label: "Osada Ecru" },
  tau_e_factory: { x: 280, y: 220, label: "Fabryka Helix" },
  tau_f_bastion: { x: 410, y: 160, label: "Bastion Tau f" },
  vega_iv_glacier: { x: 410, y: 280, label: "Wega IV" },
  // Lokacje zablokowane zaufaniem handlarzy (bez połączeń z mapami)
  ziemia_clinic: { x: 80, y: 345, label: "Ziemia - Szpital" },
  neptun_relay: { x: 205, y: 345, label: "Neptun - Przekaźnik" },
  jowisz_depths: { x: 330, y: 345, label: "Jowisz - Europa" },
  uran_armory: { x: 455, y: 345, label: "Tau f - Stacja Obrony" },
};

function progStatus(id) {
  if (id === "tutorial") return save.tutorialDone ? "done" : "open";
  return mapLockReason(id, true) ? "locked" : "open";
}

// "Ukończony" dotyczy tylko samouczka. Pozostałe mapy są tylko dostępne albo zablokowane.
const PROG_ST_LABEL = { done: "ukończony", open: "dostępna", locked: "zablokowana" };

function showProgression(wrap) {
  const edges = [["tutorial", "titan_dome"], ["tutorial", "tau_e_colony"]].concat(
    Object.entries(MAP_REQUIREMENTS).map(([child, parent]) => [parent, child])
  );
  const lines = edges
    .map(([a, b]) => {
      const A = PROG_LAYOUT[a];
      const B = PROG_LAYOUT[b];
      const on = progStatus(a) !== "locked" && progStatus(b) !== "locked";
      return `<line class="prog-edge${on ? " on" : ""}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"/>`;
    })
    .join("");
  const nodes = Object.keys(PROG_LAYOUT)
    .map((id) => {
      const L = PROG_LAYOUT[id];
      const st = progStatus(id);
      return `<g class="prog-node st-${st}" data-prog="${id}" tabindex="0">
        <rect x="${L.x - 56}" y="${L.y - 20}" width="112" height="40" rx="4"/>
        <text x="${L.x}" y="${L.y - 2}" text-anchor="middle" class="prog-name">${L.label}</text>
        <text x="${L.x}" y="${L.y + 12}" text-anchor="middle" class="prog-st">${PROG_ST_LABEL[st]}</text>
      </g>`;
    })
    .join("");
  const body = `
    <svg class="rmap-svg prog-svg" viewBox="0 0 640 380" role="img" aria-label="Drzewa progresji map">
      ${lines}${nodes}
    </svg>
    <div class="hint" style="text-align:center;">Zielone połączenie = wymagana kolejność (np. Archiwum wejdzie się tylko przez Kopalnię). Dolny rząd: lokacje odblokowywane zaufaniem handlarzy. Kliknij węzeł, by zobaczyć, czego brakuje.</div>`;
  rmapSetView(wrap, {
    title: "Progresja Map",
    back: { label: "Wróć", fn: () => showGalaxies(wrap) },
    body,
    detail: "<p>Kliknij węzeł na schemacie.</p>",
  });
  wrap.querySelectorAll("[data-prog]").forEach((el) =>
    el.addEventListener("click", () => progDetail(el.dataset.prog))
  );
}

function progDetail(id) {
  const det = document.getElementById("rmap-detail");
  if (!det) return;
  const st = progStatus(id);
  const L = PROG_LAYOUT[id];
  const reason = id === "tutorial" ? null : mapLockReason(id, true);
  const req = MAP_REQUIREMENTS[id];
  det.innerHTML = "";
  const h = document.createElement("h3");
  h.textContent = L.label;
  const p = document.createElement("p");
  p.textContent = `Stan: ${PROG_ST_LABEL[st]}.` + (req ? ` Ścieżka prowadzi z: ${(MAPS[req] || {}).name || req}.` : "");
  det.append(h, p);
  if (reason && st === "locked") {
    const r = document.createElement("p");
    r.className = "hint";
    r.textContent = reason;
    det.appendChild(r);
  }
  if (MAPS[id] && MAPS[id].viaTransit) {
    const t = document.createElement("p");
    t.className = "hint";
    t.textContent = "Wejście tylko przez transit w: " + ((MAPS[MAPS[id].viaTransit] || {}).name || MAPS[id].viaTransit) + ".";
    det.appendChild(t);
  }
  if (st === "open" && MAPS[id]) {
    det.appendChild(btn("Otwórz mapę", () => showMapDetail(id), "primary-btn"));
  }
}
