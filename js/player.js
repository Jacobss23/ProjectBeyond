// === SEKCJA: INICJALIZACJA I STAN ZAPISU KREATORA ===
const urlParams = new URLSearchParams(window.location.search);
const currentSlot = urlParams.get("slot") || "1";

let ccData = {
  name: "",
  gender: "",
  planet: "",
  traits: [],
  points: -1, // Zgodnie z wymaganiami: startujemy od -1 punktu!
  kit: "",
  module: "",
};

document.addEventListener("DOMContentLoaded", () => {
  renderTraitsFromDatabase();
  updatePointsDisplay();
  logTelemetry("[INIT: KREATOR POSTACI // PROTOKÓŁ BIOMETRYCZNY]");
});

function logTelemetry(msg) {
  const term = document.getElementById("cc-terminal-log");
  if (!term) return;
  const line = document.createElement("div");
  line.className = "term-line";
  const now = new Date();
  const time = now.toTimeString().split(" ")[0];
  line.innerHTML = `<span class="term-time">[${time}]</span> <span class="term-txt">${msg}</span>`;
  term.appendChild(line);
  term.scrollTop = term.scrollHeight;
}

// Dynamiczne generowanie cech z bazy danych PERKS (z obsługą edycji z panelu Admina)
function renderTraitsFromDatabase() {
  const container = document.getElementById("traits-dyn-container");
  if (!container) return;
  container.innerHTML = "";

  const colPos = document.createElement("div");
  colPos.className = "trait-column";
  colPos.innerHTML = "<h3>Zalety (Wymagają punktów)</h3>";

  const colNeg = document.createElement("div");
  colNeg.className = "trait-column";
  colNeg.innerHTML = "<h3>Wady (Dodają punkty)</h3>";

  const perksList = typeof PERKS !== "undefined" ? Object.values(PERKS) : [];

  perksList.forEach((p) => {
    const isNeg = p.points > 0 || p.type === "neg";
    const btn = document.createElement("button");
    const isSel = ccData.traits.includes(p.name);
    btn.className = `trait-btn ${isNeg ? "trait-neg" : "trait-pos"} ${isSel ? "selected" : ""}`;
    const sign = p.points > 0 ? `+${p.points}` : `${p.points}`;
    btn.innerHTML = `${p.name} (${sign})`;

    // Zbuduj tooltip ze szczegółowymi modyfikatorami ukrytymi i skillami
    let statsDetails = "";
    if (p.stats && p.stats.length > 0) {
      statsDetails = "<br><span class='tooltip-stats'>" + p.stats.map((st) => {
        if (st.stat === "skillBonus") {
          const sName = typeof SKILLS !== "undefined" && SKILLS[st.skill] ? SKILLS[st.skill].name : st.skill;
          return `+${st.val} do ${sName}`;
        }
        if (st.stat === "maxSkillCap") {
          return `Maksymalny limit umiejętności: ${st.val}`;
        }
        const sDef = typeof HIDDEN_STATS_DEF !== "undefined" && HIDDEN_STATS_DEF[st.stat];
        const sLabel = sDef ? sDef.name : st.stat;
        const valSign = parseFloat(st.val) > 0 ? `+${st.val}` : `${st.val}`;
        const unit = sDef ? sDef.unit : "";
        return `${valSign}${unit} ${sLabel}`;
      }).join(", ") + "</span>";
    }

    const tip = document.createElement("span");
    tip.className = "tooltip";
    tip.innerHTML = `<span class="q-mark">?</span><span class="tooltip-text">${p.desc || ""}${statsDetails}</span>`;
    btn.appendChild(tip);

    btn.onclick = (e) => {
      // Jeśli kliknięto w tooltip, nie przełączaj cechy
      if (e.target.closest(".tooltip")) return;
      toggleTrait(p.name, p.points, btn);
    };

    if (isNeg) colNeg.appendChild(btn);
    else colPos.appendChild(btn);
  });

  container.appendChild(colPos);
  container.appendChild(colNeg);
}

// === SEKCJA: LOGIKA NAWIGACJI KREATORA ===
function nextStep(step) {
  if (step === 1) {
    ccData.name = document.getElementById("cc-name").value.trim();
    ccData.gender = document.getElementById("cc-gender").value;
    if (!ccData.name || !ccData.gender) return notifyUser("Wypełnij imię i płeć.");
    logTelemetry(`Tożsamość zarejestrowana: ${ccData.name} (${ccData.gender === "m" ? "Mężczyzna" : "Kobieta"})`);
    showScreen("cc-step-2");
  } else if (step === 2) {
    if (!ccData.planet) return notifyUser("Wybierz planetę pochodzenia.");
    logTelemetry(`Pochodzenie wybrane: ${ccData.planet}`);
    showScreen("cc-step-3");
  } else if (step === 3) {
    if (ccData.points < 0)
      return notifyUser("Musisz mieć co najmniej 0 punktów (dobierz wady).");
    logTelemetry(`Cechy zatwierdzone: ${ccData.traits.join(", ") || "Brak"} (Bilans: ${ccData.points} pkt)`);
    showScreen("cc-step-4");
  }
}

// === SEKCJA: LOGIKA WYBORÓW (RADIO BUTTONY) ===
function selectOption(category, value, btn) {
  ccData[category] = value;
  const siblings = btn.parentElement.querySelectorAll(".select-btn");
  siblings.forEach((el) => el.classList.remove("selected"));
  btn.classList.add("selected");
  logTelemetry(`Wybrano: ${category} -> ${value}`);
}

// === SEKCJA: LOGIKA CECH I PUNKTÓW ===
function toggleTrait(traitName, pointValue, btn) {
  const index = ccData.traits.indexOf(traitName);
  if (index === -1) {
    ccData.traits.push(traitName);
    ccData.points += pointValue;
    btn.classList.add("selected");
    logTelemetry(`Dodano cechę: ${traitName} (${pointValue > 0 ? "+" : ""}${pointValue} pkt)`);
  } else {
    ccData.traits.splice(index, 1);
    ccData.points -= pointValue;
    btn.classList.remove("selected");
    logTelemetry(`Usunięto cechę: ${traitName}`);
  }

  updatePointsDisplay();
}

function updatePointsDisplay() {
  const display = document.getElementById("trait-points");
  if (!display) return;
  display.innerText = ccData.points;
  display.style.color = ccData.points < 0 ? "#ef4444" : "#22c55e";

  display.classList.remove("animate-points");
  void display.offsetWidth; // reset animacji w CSS
  display.classList.add("animate-points");

  const btnNext = document.getElementById("btn-step3-next");
  if (btnNext) btnNext.disabled = ccData.points < 0;
}

// === SEKCJA: ZAKOŃCZENIE TWORZENIA I ZAPIS ===
function finishCreation() {
  if (!ccData.kit || !ccData.module)
    return notifyUser("Wybierz zestaw startowy i sprawny moduł.");

  logTelemetry("[ZAPIS: Generowanie profilu ocalałego...]");

  const saveData = normalizeSave({
    ...ccData,
    hp: 100,
    maxHp: 100,
    credits: 500,
  });

  localStorage.setItem(`saveSlot_${currentSlot}`, JSON.stringify(saveData));
  localStorage.setItem("currentSlot", currentSlot);

  logTelemetry("[STATUS: Gotowy do lądowania na Marsie. Przekierowanie do rajdu...]");

  setTimeout(() => {
    window.location.replace("raid.html?map=tutorial");
  }, 400);
}

// Losowy kryptonim dla przycisku "Losuj" w kreatorze
const CALLSIGN_A = ["Cień", "Echo", "Pył", "Kruk", "Nów", "Szron", "Iskra", "Wrak", "Sztorm", "Zmierzch", "Rdza", "Orbita"];
const CALLSIGN_B = ["Zero", "Lis", "Sęp", "Kompas", "Lustro", "Gniazdo", "Sygnał", "Wilk", "Nić", "Fala", "Bastion", "Wąwóz"];
function randomizeName() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const num = Math.random() < 0.5 ? "" : "-" + (10 + Math.floor(Math.random() * 90));
  const input = document.getElementById("cc-name");
  if (input) input.value = pick(CALLSIGN_A) + " " + pick(CALLSIGN_B) + num;
}
