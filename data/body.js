// === SEKCJA: ANATOMIA I EFEKTY CIAŁA ===
const BODY_PARTS = {
  head: { name: "Głowa", maxHp: 35 },
  torso: { name: "Tułów", maxHp: 100 },
  left_arm: { name: "Lewa Ręka", maxHp: 45 },
  right_arm: { name: "Prawa Ręka", maxHp: 45 },
  left_leg: { name: "Lewa Noga", maxHp: 50 },
  right_leg: { name: "Prawa Noga", maxHp: 50 },
};

const BODY_EFFECTS = {
  szept: {
    name: "Szept w krwi",
    desc: "Wirus Szept rozchodzi się po ciele: -1 HP co turę. Leczy się Zestawem dekontaminacyjnym.",
    cure: ["decontam_kit"],
    cureName: "Zestaw dekontaminacyjny",
    severity: "danger",
    dmgPerTurn: 1,
  },
  krwawienie: {
    name: "Krwawienie",
    desc: "Powolny wyciek krwi (-3 HP / turę).",
    cure: ["bandage", "tourniquet", "hemostatic", "medkit"],
    cureName: "Bandaż / Bandaż uciskowy / Apteczka",
    severity: "danger",
    dmgPerTurn: 3,
  },
  mocne_krwawienie: {
    name: "Mocne Krwawienie",
    desc: "Gwałtowny krwotok (-7 HP / turę). Wymaga opaski uciskowej.",
    cure: ["tourniquet", "hemostatic"],
    cureName: "Bandaż uciskowy / Opatrunek hemostatyczny",
    severity: "danger",
    dmgPerTurn: 7,
  },
  siniak: {
    name: "Siniak / Stłuczenie",
    desc: "Krótkotrwały ból (+3% otrzymywanych obrażeń, -5% celności). Utrzymuje się krótko.",
    cure: ["ointment"],
    cureName: "Maść regeneracyjna",
    severity: "warn",
    duration: 4,
  },
  podraznienie: {
    name: "Podrażnienie",
    desc: "Skażenie chemiczne skóry lub oczu (-10% celności).",
    cure: ["ointment", "decontam_kit"],
    cureName: "Maść regeneracyjna / Pakiet dekontaminacyjny",
    severity: "warn",
    duration: 6,
  },
  zlamanie: {
    name: "Złamanie Kości",
    desc: "Pęknięta kość kończyny (-25% zręczności i szansy ucieczki).",
    cure: ["splint", "medkit"],
    cureName: "Szyna usztywniająca / Apteczka",
    severity: "danger",
  },
  strach: {
    name: "Strach",
    desc: "Gwałtowny skok tętna i drżenie dłoni (-12% celności).",
    cure: ["stim_adrenal", "morphine"],
    cureName: "Stymulator Adrenal-X / Morfina",
    severity: "warn",
    duration: 5,
  },
  bleedStop: {
    name: "Bufor BleedStop",
    desc: "Ochronny stymulant - pełna odporność na krwawienia.",
    type: "buff",
    severity: "hit",
    duration: 15,
  },
  saturnCola: {
    name: "Haj SaturnCola",
    desc: "Pobudzenie metanowe (+15% do krytyka, +10% celność, +5 HP).",
    type: "buff",
    severity: "hit",
    duration: 12,
  },
};

function initSaveBody(s) {
  if (!s) return;
  s.body = s.body || {
    head: { hp: 35, status: [] },
    torso: { hp: 100, status: [] },
    left_arm: { hp: 45, status: [] },
    right_arm: { hp: 45, status: [] },
    left_leg: { hp: 50, status: [] },
    right_leg: { hp: 50, status: [] },
  };
  s.globalBuffs = s.globalBuffs || {};
}

function applyDamageToPart(s, partKey, dmg, effectChance) {
  initSaveBody(s);
  if (!s || !s.body) return;
  if (!s.body[partKey]) partKey = "torso";
  const part = s.body[partKey];
  part.hp = Math.max(0, part.hp - dmg);

  if (effectChance && Math.random() < (effectChance.chance || 0)) {
    const effId = effectChance.type;
    if (effId === "krwawienie" || effId === "mocne_krwawienie") {
      if ((s.globalBuffs?.bleedStop || 0) > 0) {
        return; // Odporność BleedStop
      }
    }
    if (!part.status.includes(effId)) {
      part.status.push(effId);
    }
  }
}

function getActiveBodyEffects(s) {
  initSaveBody(s);
  if (!s || !s.body) return [];
  const active = [];
  Object.entries(s.body).forEach(([partKey, part]) => {
    (part.status || []).forEach((effId) => {
      active.push({ partKey, partName: BODY_PARTS[partKey]?.name || partKey, effId, ...BODY_EFFECTS[effId] });
    });
  });
  Object.entries(s.globalBuffs || {}).forEach(([effId, turns]) => {
    if (turns > 0 && BODY_EFFECTS[effId]) {
      active.push({ partKey: "global", partName: "Całe ciało", effId, turnsLeft: turns, ...BODY_EFFECTS[effId] });
    }
  });
  return active;
}

function cureBodyEffect(s, itemId) {
  initSaveBody(s);
  if (!s) return null;
  const it = typeof ITEMS !== "undefined" ? ITEMS[itemId] : null;
  if (!it) return null;

  let curedSomething = false;
  let msg = [];

  if (it.buff) {
    s.globalBuffs[it.buff] = it.buffDuration || 10;
    msg.push(`Aktywowano: ${BODY_EFFECTS[it.buff]?.name || it.buff}`);
    curedSomething = true;
  }

  if (it.cures && Array.isArray(it.cures)) {
    Object.entries(s.body).forEach(([partKey, part]) => {
      const remaining = [];
      (part.status || []).forEach((effId) => {
        if (it.cures.includes(effId)) {
          curedSomething = true;
          msg.push(`Uleczono ${BODY_EFFECTS[effId]?.name || effId} na: ${BODY_PARTS[partKey]?.name}`);
        } else {
          remaining.push(effId);
        }
      });
      part.status = remaining;
    });
  }

  return curedSomething ? msg.join(", ") : null;
}

function renderAnatomyPanel(el, s) {
  if (!el || !s) return;
  initSaveBody(s);

  const getPartColor = (partKey) => {
    const part = s.body[partKey];
    if (!part) return "#10b981";
    if (part.status.some((e) => e === "krwawienie" || e === "mocne_krwawienie" || e === "zlamanie")) return "#ef4444";
    if (part.status.some((e) => e === "siniak" || e === "podraznienie" || e === "strach")) return "#f59e0b";
    if (part.hp < part.maxHp * 0.5) return "#f59e0b";
    return "#10b981";
  };

  const active = getActiveBodyEffects(s);

  el.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(56,189,248,0.25); padding-bottom:4px; margin-bottom:6px;">
      <strong style="font-size:0.85rem; color:#38bdf8;">[STAN ANATOMII]</strong>
      <span style="font-size:0.75rem; color:#94a3b8;">${active.length} aktywnych</span>
    </div>

    <div style="display:flex; align-items:center; justify-content:center; gap:12px;">
      <svg width="60" height="100" viewBox="0 0 100 160" style="filter: drop-shadow(0 0 6px rgba(56,189,248,0.3)); flex-shrink:0;">
        <circle cx="50" cy="22" r="14" fill="${getPartColor('head')}" opacity="0.85" stroke="#38bdf8" stroke-width="1.5" />
        <rect x="36" y="40" width="28" height="48" rx="4" fill="${getPartColor('torso')}" opacity="0.85" stroke="#38bdf8" stroke-width="1.5" />
        <rect x="16" y="42" width="16" height="42" rx="3" fill="${getPartColor('left_arm')}" opacity="0.85" stroke="#38bdf8" stroke-width="1.5" />
        <rect x="68" y="42" width="16" height="42" rx="3" fill="${getPartColor('right_arm')}" opacity="0.85" stroke="#38bdf8" stroke-width="1.5" />
        <rect x="36" y="92" width="12" height="58" rx="3" fill="${getPartColor('left_leg')}" opacity="0.85" stroke="#38bdf8" stroke-width="1.5" />
        <rect x="52" y="92" width="12" height="58" rx="3" fill="${getPartColor('right_leg')}" opacity="0.85" stroke="#38bdf8" stroke-width="1.5" />
      </svg>

      <div style="font-size:0.72rem; line-height:1.25; flex:1;">
        ${Object.entries(BODY_PARTS).map(([k, def]) => {
          const part = s.body[k] || { hp: def.maxHp, status: [] };
          const col = getPartColor(k);
          return `<div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span style="color:#cbd5e1;">${def.name}:</span>
            <span style="color:${col}; font-weight:bold;">${part.hp}/${def.maxHp}${part.status.length ? ` (${part.status.length})` : ''}</span>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div style="margin-top:8px; border-top:1px dashed rgba(56,189,248,0.2); padding-top:6px;">
      <div style="font-size:0.75rem; color:#38bdf8; font-weight:600; margin-bottom:4px;">EFEKTY & RANY:</div>
      ${active.length === 0 
        ? `<div style="font-size:0.75rem; color:#4ade80;">[OK] Ciało w pełni sprawne.</div>`
        : active.map((eff) => {
            const isDanger = eff.severity === "danger";
            const col = isDanger ? "#f87171" : eff.severity === "hit" ? "#4ade80" : "#f59e0b";
            return `
            <div class="anatomy-effect-item" style="font-size:0.72rem; margin-bottom:4px; padding:3px 6px; background:rgba(15,23,42,0.8); border-left:3px solid ${col}; border-radius:2px; cursor:help;"
                 title="${eff.desc} &#10;ULECZENIE: ${eff.cureName || 'Mija samo z czasem'}">
              <div style="display:flex; justify-content:space-between;">
                <strong style="color:${col};">${eff.name}</strong>
                <span style="color:#94a3b8; font-size:0.68rem;">[${eff.partName}]</span>
              </div>
              <div style="color:#cbd5e1; font-size:0.68rem; margin-top:1px;">
                ${eff.cureName ? `Leczenie: <span style="color:#38bdf8;">${eff.cureName}</span>` : eff.desc}
              </div>
            </div>`;
          }).join('')}
    </div>
  `;
}

function naturalHealBody(s, secondsPassed = 300) {
  initSaveBody(s);
  if (!s) return;

  // 1. Odzyskiwanie HP postaci
  const healAmount = Math.ceil(s.maxHp * 0.4);
  s.hp = Math.min(s.maxHp, s.hp + healAmount);

  // 2. Odzyskiwanie HP poszczególnych części ciała
  Object.keys(BODY_PARTS).forEach((partKey) => {
    const part = s.body[partKey];
    if (part) {
      const maxPart = BODY_PARTS[partKey].maxHp;
      part.hp = Math.min(maxPart, part.hp + Math.ceil(maxPart * 0.5));
    }
  });

  // 3. Naturalne samowyleczenie/wygasanie efektów po czasie poza rajdem
  Object.keys(s.body).forEach((partKey) => {
    const part = s.body[partKey];
    if (!part || !part.status) return;
    const remaining = [];
    part.status.forEach((effId) => {
      const def = BODY_EFFECTS[effId];
      if (!def) return;

      // Siniaki, podrażnienia i strach znikają samoczynnie po czasie poza rajdem
      if (effId === "siniak" || effId === "podraznienie" || effId === "strach") {
        // Efekt zniknął po odpoczynku
        return;
      }

      // Krwawienia ustępują po odpoczynku w schronie o 1 poziom (np. mocne -> zwykłe, zwykłe -> brak)
      if (effId === "mocne_krwawienie") {
        remaining.push("krwawienie");
      } else if (effId === "krwawienie") {
        // Wygasa w bezpiecznym schronie
      } else {
        remaining.push(effId);
      }
    });
    part.status = remaining;
  });

  // 4. Dekrementacja buforów globalnych
  if (s.globalBuffs) {
    Object.keys(s.globalBuffs).forEach((k) => {
      s.globalBuffs[k] = Math.max(0, s.globalBuffs[k] - 5);
      if (s.globalBuffs[k] <= 0) delete s.globalBuffs[k];
    });
  }
}

if (typeof window !== "undefined") {
  window.BODY_PARTS = BODY_PARTS;
  window.BODY_EFFECTS = BODY_EFFECTS;
  window.initSaveBody = initSaveBody;
  window.applyDamageToPart = applyDamageToPart;
  window.getActiveBodyEffects = getActiveBodyEffects;
  window.cureBodyEffect = cureBodyEffect;
  window.naturalHealBody = naturalHealBody;
  window.renderAnatomyPanel = renderAnatomyPanel;
}
if (typeof globalThis !== "undefined") {
  globalThis.BODY_PARTS = BODY_PARTS;
  globalThis.BODY_EFFECTS = BODY_EFFECTS;
  globalThis.initSaveBody = initSaveBody;
  globalThis.applyDamageToPart = applyDamageToPart;
  globalThis.getActiveBodyEffects = getActiveBodyEffects;
  globalThis.cureBodyEffect = cureBodyEffect;
  window.naturalHealBody = naturalHealBody;
  globalThis.renderAnatomyPanel = renderAnatomyPanel;
}
