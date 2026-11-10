// === SEKCJA: PORA DNIA W UI (DELIKATNY NASTRÓJ) ===
// Subtelna nakładka na całe UI + mała etykieta w rogu. Nie blokuje kliknięć.
// Wywołanie: applyDayNight(true) = noc, applyDayNight(false) = dzień.
const DAYNIGHT_STYLE_ID = "daynight-style";

function applyDayNight(isNight) {
  if (!document.getElementById(DAYNIGHT_STYLE_ID)) {
    const st = document.createElement("style");
    st.id = DAYNIGHT_STYLE_ID;
    st.textContent = `
      #daynight-tint { position: fixed; inset: 0; pointer-events: none; z-index: 5; transition: background 1.6s ease; }
      #daynight-tint.dn-night { background: radial-gradient(ellipse at 50% -10%, rgba(59, 80, 170, 0.16), rgba(3, 8, 22, 0.42) 75%); }
      #daynight-tint.dn-day { background: radial-gradient(ellipse at 50% -10%, rgba(254, 240, 200, 0.07), rgba(255, 244, 220, 0.0) 70%); }
      #daynight-label { position: fixed; top: 6px; right: 10px; z-index: 6; pointer-events: none; font-family: "Share Tech Mono", monospace; font-size: 0.7rem; letter-spacing: 1px; opacity: 0.55; transition: opacity 1.6s ease; }
      #daynight-label.dn-night { color: var(--accent-glow); }
      #daynight-label.dn-day { color: #fde68a; }
    `;
    document.head.appendChild(st);
  }
  let tint = document.getElementById("daynight-tint");
  if (!tint) {
    tint = document.createElement("div");
    tint.id = "daynight-tint";
    document.body.appendChild(tint);
  }
  let label = document.getElementById("daynight-label");
  if (!label) {
    label = document.createElement("div");
    label.id = "daynight-label";
    document.body.appendChild(label);
  }
  const cls = isNight ? "dn-night" : "dn-day";
  tint.className = cls;
  label.className = cls;
  label.textContent = isNight ? "☾ NOC" : "☀ DZIEŃ";
  document.body.dataset.timeOfDay = isNight ? "night" : "day";
}
