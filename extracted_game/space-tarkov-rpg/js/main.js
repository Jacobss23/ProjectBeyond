// === SEKCJA: INICJALIZACJA MENU GŁÓWNEGO ===
document.addEventListener("DOMContentLoaded", () => {
  for (let i = 1; i <= 3; i++) {
    const save = localStorage.getItem(`saveSlot_${i}`);
    const btn = document.getElementById(`btn-slot-${i}`);
    if (save && btn) {
      const data = JSON.parse(save);
      // Naprawiono interpolację stringa, która powodowała błąd w twoim kodzie
      btn.innerText = `Slot ${i} - ${data.name} (${data.planet})`;
    }
  }
});

// === SEKCJA: LOGIKA ŁADOWANIA ZAPISU ===
function loadSlot(slot) {
  const save = localStorage.getItem(`saveSlot_${slot}`);
  if (save) {
    localStorage.setItem("currentSlot", slot);
    window.location.href = "hideout.html";
  } else {
    window.location.href = `creator.html?slot=${slot}`;
  }
}
