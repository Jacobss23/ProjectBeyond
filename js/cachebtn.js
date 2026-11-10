// Przycisk "Wyczyść cache" w prawym dolnym rogu.
// Czyści dane przeglądarki należące tylko do tej gry: Cache Storage, service workery i sessionStorage.
// NIE rusza zapisów (saveSlot_*, currentSlot) ani ustawień w localStorage.
(function () {

  const style = document.createElement("style");
  style.textContent = `
    #cache-clear-btn {
      position: fixed; right: 12px; bottom: 12px; z-index: 9000;
      padding: 6px 10px; font: 0.72rem "Share Tech Mono", monospace; letter-spacing: 0.04em;
      color: #cbd5e1; background: rgba(11, 16, 32, 0.85);
      border: 1px solid rgba(139, 92, 246, 0.55); border-radius: 4px; cursor: pointer;
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.25);
    }
    #cache-clear-btn:hover { color: #fff; border-color: #a78bfa; }
    #cache-clear-btn:disabled { opacity: 0.6; cursor: wait; }
  `;
  document.head.appendChild(style);

  async function clearGameCache() {
    const report = [];
    try {
      if (window.caches) {
        const names = await caches.keys();
        for (const n of names) await caches.delete(n);
        report.push(`cache: ${names.length}`);
      }
    } catch (e) { report.push("cache: błąd"); }
    try {
      if (navigator.serviceWorker) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();
        report.push(`service workery: ${regs.length}`);
      }
    } catch (e) { report.push("service workery: błąd"); }
    try { sessionStorage.clear(); report.push("sessionStorage: wyczyszczony"); } catch (e) { report.push("sessionStorage: błąd"); }
    return report;
  }

  function mount() {
    const btn = document.createElement("button");
    btn.id = "cache-clear-btn";
    btn.type = "button";
    btn.textContent = "Wyczyść cache";
    btn.title = "Czyści pamięć podręczną gry. Zapisy zostają.";
    btn.addEventListener("click", async () => {
      const ok = window.confirm("Wyczyścić pamięć podręczną gry?\nZapisy i ustawienia zostaną zachowane.");
      if (!ok) return;
      btn.disabled = true;
      btn.textContent = "Czyszczenie...";
      const report = await clearGameCache();
      console.info("[cache] " + report.join(", "));
      // odświeżenie z nową, czystą pamięcią podręczną
      const url = new URL(window.location.href);
      url.searchParams.set("_c", Date.now().toString());
      window.location.replace(url.toString());
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
