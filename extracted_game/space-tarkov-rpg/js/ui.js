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
