// === SEKCJA: SYSTEM DIALOGÓW (SZKIELET - BEZ TREŚCI) ===
// Styl jak w ramce dialogowej: portret po lewej, dymek z tekstem po prawej.
// Treści NIE są jeszcze dodane. Wypełniaj je według schematu poniżej.
//
// CHARACTERS: kto mówi. portrait = ścieżka do obrazka albo null (wtedy inicjał imienia).
//   const CHARACTERS = {
//     hub_commander: { name: "Kapitan Wren", portrait: "assets/portraits/wren.png" },
//   };
//
// DIALOGUES: id dialogu -> lista linii. Każda linia: speaker (klucz z CHARACTERS) i text.
//   const DIALOGUES = {
//     intro_hideout: [
//       { speaker: "hub_commander", text: "..." },
//     ],
//   };
//
// Użycie w kodzie: playDialogue("intro_hideout", () => { ...co po dialogu... });
// Sterowanie: klik / Enter / Spacja - dalej (klik w trakcie pisania dokańcza tekst), Esc - pomiń.

const CHARACTERS = {};
const DIALOGUES = {};

const DIALOGUE_STYLE_ID = "dlg-style";

function ensureDialogueStyle() {
  if (document.getElementById(DIALOGUE_STYLE_ID)) return;
  const st = document.createElement("style");
  st.id = DIALOGUE_STYLE_ID;
  st.textContent = `
    .dlg-overlay { position: fixed; inset: 0; background: rgba(3, 8, 22, 0.82); display: flex; align-items: center; justify-content: center; z-index: 9998; cursor: pointer; }
    .dlg-wrap { display: flex; align-items: center; gap: 44px; max-width: min(820px, 94vw); }
    .dlg-portrait { width: 200px; height: 260px; flex: 0 0 auto; background-color: var(--btn-bg); border: 1px solid var(--btn-border); box-shadow: 0 0 18px rgba(139, 92, 246, 0.25), inset 0 0 24px rgba(139, 92, 246, 0.12); background-size: cover; background-position: center top; background-repeat: no-repeat; display: flex; align-items: center; justify-content: center; font-family: "Orbitron", "Chakra Petch", sans-serif; font-size: 64px; color: var(--accent-glow); }
    .dlg-bubble { position: relative; background: var(--btn-bg); color: var(--text-color); border: 1px solid var(--btn-border); box-shadow: 0 0 16px rgba(139, 92, 246, 0.25); padding: 14px 18px 12px; min-width: 280px; font-family: "Karla", sans-serif; }
    .dlg-bubble::before { content: ""; position: absolute; left: -10px; top: 40px; width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-right: 10px solid var(--btn-border); }
    .dlg-bubble::after { content: ""; position: absolute; left: -7px; top: 41px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 9px solid var(--btn-bg); }
    .dlg-name { font-family: "Orbitron", "Chakra Petch", sans-serif; font-size: 0.8rem; color: var(--accent-glow); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .dlg-text { font-size: 1.05rem; line-height: 1.4; min-height: 2.6em; }
    .dlg-narr { font-style: italic; opacity: 0.8; }
    .dlg-choices { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
    .dlg-choices button { text-align: left; background: rgba(15, 23, 42, 0.8); color: var(--text-color); border: 1px solid var(--btn-border); padding: 7px 10px; font-family: "Karla", sans-serif; font-size: 0.95rem; cursor: pointer; }
    .dlg-choices button:hover { border-color: var(--accent-glow); box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); }
    .dlg-hint { margin-top: 10px; font-family: "Share Tech Mono", monospace; font-size: 0.7rem; color: rgba(224, 242, 254, 0.45); text-align: right; }
  `;
  document.head.appendChild(st);
}

function playDialogue(id, onEnd) {
  const lines = DIALOGUES[id];
  if (!lines || !lines.length) {
    if (onEnd) onEnd();
    return;
  }
  ensureDialogueStyle();

  const ov = document.createElement("div");
  ov.className = "dlg-overlay";
  ov.innerHTML = `
    <div class="dlg-wrap">
      <div class="dlg-portrait"></div>
      <div class="dlg-bubble">
        <div class="dlg-name"></div>
        <div class="dlg-text"></div>
        <div class="dlg-hint">Kliknij, aby kontynuować · Esc: pomiń</div>
      </div>
    </div>`;
  document.body.appendChild(ov);

  const portraitEl = ov.querySelector(".dlg-portrait");
  const nameEl = ov.querySelector(".dlg-name");
  const textEl = ov.querySelector(".dlg-text");

  let idx = 0;
  let full = "";
  let shown = 0;
  let timer = null;
  let choicePending = false;
  const choicesEl = document.createElement("div");
  choicesEl.className = "dlg-choices";
  choicesEl.style.display = "none";
  ov.querySelector(".dlg-bubble").insertBefore(choicesEl, ov.querySelector(".dlg-hint"));

  function stopTyping() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function typeLine() {
    stopTyping();
    shown = 0;
    textEl.textContent = "";
    timer = setInterval(() => {
      shown++;
      textEl.textContent = full.slice(0, shown);
      if (shown >= full.length) stopTyping();
    }, 22);
  }

  function showChoice(line) {
    stopTyping();
    choicePending = true;
    textEl.textContent = "";
    nameEl.textContent = (CHARACTERS.player && CHARACTERS.player.name) || "Ty";
    portraitEl.style.backgroundImage = "none";
    portraitEl.textContent = "?";
    choicesEl.innerHTML = "";
    line.choice.forEach((opt) => {
      const b = document.createElement("button");
      b.textContent = opt.label;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        choicePending = false;
        choicesEl.style.display = "none";
        // Wybór zamienia się w linię gracza i odtwarza tylko odpowiedzi tej opcji
        lines.splice(idx, 1, { speaker: "player", text: opt.text }, ...(opt.lines || []));
        showLine();
      });
      choicesEl.appendChild(b);
    });
    choicesEl.style.display = "flex";
    ov.querySelector(".dlg-hint").style.display = "none";
  }

  function showLine() {
    const line = lines[idx];
    if (line.choice) return showChoice(line);
    choicesEl.style.display = "none";
    ov.querySelector(".dlg-hint").style.display = "";
    textEl.classList.toggle("dlg-narr", line.speaker === "narrator");
    const ch = CHARACTERS[line.speaker] || { name: line.speaker || "", portrait: null };
    nameEl.textContent = line.speaker === "narrator" ? "Połączenie wideo" : (ch.name || "");
    if (ch.portrait) {
      portraitEl.style.backgroundImage = `url("${ch.portrait}")`;
      portraitEl.textContent = "";
    } else {
      portraitEl.style.backgroundImage = "none";
      portraitEl.textContent = (ch.name || "?").charAt(0);
    }
    full = line.text || "";
    typeLine();
  }

  function end() {
    stopTyping();
    document.removeEventListener("keydown", onKey);
    ov.remove();
    if (onEnd) onEnd();
  }

  function next() {
    if (choicePending) return;
    if (timer) {
      stopTyping();
      textEl.textContent = full;
      return;
    }
    idx++;
    if (idx >= lines.length) return end();
    showLine();
  }

  function onKey(e) {
    if (e.key === "Escape") return end();
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      next();
    }
  }

  ov.addEventListener("click", next);
  document.addEventListener("keydown", onKey);
  showLine();
}

if (typeof window !== "undefined") {
  window.playDialogue = playDialogue;
  window.CHARACTERS = CHARACTERS;
  window.DIALOGUES = DIALOGUES;
}
