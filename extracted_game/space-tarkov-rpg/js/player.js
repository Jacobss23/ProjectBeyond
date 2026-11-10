// === SEKCJA: INICJALIZACJA I STAN ZAPISU ===
const urlParams = new URLSearchParams(window.location.search);
const currentSlot = urlParams.get("slot") || 1;

let ccData = {
  name: "",
  gender: "",
  planet: "",
  traits: [],
  points: -3,
  kit: "",
  module: "",
};

// === SEKCJA: LOGIKA NAWIGACJI KREATORA ===
function nextStep(step) {
  if (step === 1) {
    ccData.name = document.getElementById("cc-name").value;
    ccData.gender = document.getElementById("cc-gender").value;
    if (!ccData.name || !ccData.gender) return alert("Wypełnij imię i płeć.");
    showScreen("cc-step-2");
  } else if (step === 2) {
    if (!ccData.planet) return alert("Wybierz planetę pochodzenia.");
    showScreen("cc-step-3");
  } else if (step === 3) {
    if (ccData.points < 0)
      return alert("Musisz mieć co najmniej 0 punktów (dobierz wady).");
    showScreen("cc-step-4");
  }
}

// === SEKCJA: LOGIKA WYBORÓW (RADIO BUTTONY) ===
function selectOption(category, value, btn) {
  ccData[category] = value;
  const siblings = btn.parentElement.querySelectorAll(".select-btn");
  siblings.forEach((el) => el.classList.remove("selected"));
  btn.classList.add("selected");
}

// === SEKCJA: LOGIKA CECH I PUNKTÓW ===
function toggleTrait(traitName, pointValue, btn) {
  const index = ccData.traits.indexOf(traitName);
  if (index === -1) {
    ccData.traits.push(traitName);
    ccData.points += pointValue;
    btn.classList.add("selected");
  } else {
    ccData.traits.splice(index, 1);
    ccData.points -= pointValue;
    btn.classList.remove("selected");
  }

  updatePointsDisplay();
}

function updatePointsDisplay() {
  const display = document.getElementById("trait-points");
  display.innerText = ccData.points;
  display.style.color = ccData.points < 0 ? "#ef4444" : "var(--accent-glow)";

  display.classList.remove("animate-points");
  void display.offsetWidth; // reset animacji w CSS
  display.classList.add("animate-points");

  document.getElementById("btn-step3-next").disabled = ccData.points < 0;
}

// === SEKCJA: ZAKOŃCZENIE TWORZENIA I ZAPIS ===
function finishCreation() {
  if (!ccData.kit || !ccData.module)
    return alert("Wybierz zestaw startowy i sprawny moduł.");

  const saveData = normalizeSave({
    ...ccData,
    hp: 100,
    maxHp: 100,
    credits: 500,
  });

  localStorage.setItem(`saveSlot_${currentSlot}`, JSON.stringify(saveData));
  localStorage.setItem("currentSlot", currentSlot);

  window.location.href = "raid.html?map=tutorial";
}
