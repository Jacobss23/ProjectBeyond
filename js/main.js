// === SEKCJA: INICJALIZACJA MENU GŁÓWNEGO & OBSŁUGA ZAPISÓW ===
document.addEventListener("DOMContentLoaded", () => {
  refreshSlots();
});

let deletePendingSlot = null;
let deleteTimer = null;

function refreshSlots() {
  for (let i = 1; i <= 3; i++) {
    const raw = localStorage.getItem(`saveSlot_${i}`);
    const btn = document.getElementById(`btn-slot-${i}`);
    const delBtn = document.getElementById(`btn-del-slot-${i}`);
    if (raw && btn) {
      try {
        const data = JSON.parse(raw);
        btn.innerText = `Slot ${i} - ${data.name || 'Ocalały'} (${data.planet || 'Mars'}) - Poz. ${data.level || 1}`;
        if (delBtn) {
          delBtn.style.display = "inline-block";
          if (deletePendingSlot !== i) {
            delBtn.textContent = "Usuń";
            delBtn.style.background = "rgba(239, 68, 68, 0.2)";
            delBtn.style.color = "#ef4444";
            delBtn.style.borderColor = "#ef4444";
            delBtn.style.fontWeight = "normal";
          }
        }
      } catch (e) {
        btn.innerText = `Slot ${i} - Uszkodzone dane`;
        if (delBtn) {
          delBtn.style.display = "inline-block";
          if (deletePendingSlot !== i) {
            delBtn.textContent = "Usuń";
            delBtn.style.background = "rgba(239, 68, 68, 0.2)";
            delBtn.style.color = "#ef4444";
            delBtn.style.borderColor = "#ef4444";
            delBtn.style.fontWeight = "normal";
          }
        }
      }
    } else if (btn) {
      btn.innerText = `Slot ${i} - Pusty`;
      if (delBtn) delBtn.style.display = "none";
    }
  }
}

// === SEKCJA: LOGIKA ŁADOWANIA I USUWANIA ZAPISÓW ===
function loadSlot(slot) {
  const save = localStorage.getItem(`saveSlot_${slot}`);
  if (save) {
    localStorage.setItem("currentSlot", slot);
    window.location.href = "hideout.html";
  } else {
    window.location.href = `creator.html?slot=${slot}`;
  }
}

function deleteSlot(slot) {
  const delBtn = document.getElementById(`btn-del-slot-${slot}`);
  if (!delBtn) {
    localStorage.removeItem(`saveSlot_${slot}`);
    refreshSlots();
    return;
  }

  if (deletePendingSlot === slot) {
    // Drugie kliknięcie: bezwarunkowe usunięcie zapisu bez użycia zablokowanego confirm()
    localStorage.removeItem(`saveSlot_${slot}`);
    if (deleteTimer) clearTimeout(deleteTimer);
    deletePendingSlot = null;
    refreshSlots();
  } else {
    // Pierwsze kliknięcie: zmiana stanu przycisku na czerwony z ostrzeżeniem
    if (deleteTimer) clearTimeout(deleteTimer);
    deletePendingSlot = slot;
    delBtn.textContent = "POTWIERDŹ USUNIĘCIE!";
    delBtn.style.background = "#ef4444";
    delBtn.style.color = "#ffffff";
    delBtn.style.borderColor = "#f87171";
    delBtn.style.fontWeight = "bold";

    // Automatyczny powrót po 4 sekundach bez potwierdzenia
    deleteTimer = setTimeout(() => {
      deletePendingSlot = null;
      refreshSlots();
    }, 4000);
  }
}

if (typeof window !== "undefined") {
  window.refreshSlots = refreshSlots;
  window.loadSlot = loadSlot;
  window.deleteSlot = deleteSlot;
}

