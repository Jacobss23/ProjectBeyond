// === SEKCJA: WIKI (wyszukiwarka przedmiotów, wrogów i zadań) ===
// Przycisk "W" w lewym górnym rogu. Rankingi liczone z tabel łupu, węzłów map i sklepów.
const WIKI_STYLE_ID = "wiki-style";

function wikiNorm(s) {
  return String(s || "").toLowerCase();
}

// Oczekiwana liczba sztuk przedmiotu na jednej mapie (suma po wszystkich pokojach z łupem i wrogami)
function wikiItemMapScores(itemId) {
  const out = {};
  const add = (mapId, val, where) => {
    if (!out[mapId]) out[mapId] = { score: 0, nodes: [] };
    out[mapId].score += val;
    if (where && !out[mapId].nodes.includes(where)) out[mapId].nodes.push(where);
  };
  Object.entries(MAPS).forEach(([mapId, m]) => {
    Object.entries(m.nodes || {}).forEach(([nodeId, node]) => {
      const nodeName = node.name || nodeId;
      if (node.loot && LOOT[node.loot.table]) {
        const table = LOOT[node.loot.table];
        const total = table.reduce((a, e) => a + e.w, 0) || 1;
        const hit = table.find((e) => e.id === itemId);
        if (hit) {
          const avg = (hit.min + hit.max) / 2;
          add(mapId, (node.loot.rolls || 1) * (hit.w / total) * avg, nodeName);
        }
      }
      (node.guaranteed || []).forEach(([id, qty]) => {
        if (id === itemId) add(mapId, qty || 1, nodeName + " (gwarantowane)");
      });
      if (node.mine && node.mine.type === itemId) add(mapId, node.mine.qty || 1, nodeName + " (wydobycie)");
      if (node.enemy && ENEMIES[node.enemy.id] && typeof ENEMIES[node.enemy.id].loot === "string") {
        const t = LOOT[ENEMIES[node.enemy.id].loot] || [];
        const total = t.reduce((a, e) => a + e.w, 0) || 1;
        const hit = t.find((e) => e.id === itemId);
        if (hit) add(mapId, (node.enemy.chance || 1) * (hit.w / total) * ((hit.min + hit.max) / 2), nodeName + " (od wroga)");
      }
    });
  });
  return out;
}

function wikiShops(itemId) {
  const res = [];
  TRADERS.forEach((t) => {
    Object.entries(t.stock || {}).forEach(([tier, arr]) => {
      if (arr.includes(itemId)) res.push(`${t.name} (Tier ${tier})`);
    });
  });
  return res;
}

function wikiEnemyMaps(enemyId) {
  const out = [];
  Object.entries(MAPS).forEach(([mapId, m]) => {
    Object.entries(m.nodes || {}).forEach(([nodeId, node]) => {
      if (node.enemy && node.enemy.id === enemyId) {
        out.push({ mapId, mapName: m.name, nodeName: node.name || nodeId, chance: node.enemy.chance });
      }
    });
  });
  return out;
}

function wikiQuestsFor(itemId) {
  return QUESTS.filter((q) => q.req.some((r) => r.id === itemId)).map((q) => {
    const map = q.task && MAPS[q.task.map] ? MAPS[q.task.map].name : null;
    return { title: q.title, trader: (TRADERS.find((t) => t.id === q.traderId) || {}).name, main: !!q.isMain, map };
  });
}

function wikiQuestsForEnemy(enemyId) {
  return QUESTS.filter((q) => q.kill === enemyId).map((q) => ({ title: q.title, main: !!q.isMain }));
}

function wikiMapOfQuestItem(itemId) {
  // mapy, na których można zdobyć przedmiot questowy (ranking)
  return Object.entries(wikiItemMapScores(itemId))
    .sort((a, b) => b[1].score - a[1].score)
    .map(([mapId, v]) => ({ mapId, mapName: MAPS[mapId].name, score: v.score, nodes: v.nodes }));
}

function wikiStyle() {
  if (document.getElementById(WIKI_STYLE_ID)) return;
  const st = document.createElement("style");
  st.id = WIKI_STYLE_ID;
  st.textContent = `
    #wiki-btn { position: fixed; top: 6px; left: 6px; z-index: 9500; width: 26px; height: 26px; padding: 0; font-family: "Share Tech Mono", monospace; font-size: 13px; background: var(--btn-bg); color: var(--accent-glow); border: 1px solid var(--btn-border); cursor: pointer; opacity: 0.7; }
    #wiki-btn:hover { opacity: 1; }
    #wiki-ov { position: fixed; inset: 0; background: rgba(3, 8, 22, 0.78); z-index: 9499; display: flex; align-items: flex-start; justify-content: center; padding: 48px 12px; }
    #wiki-box { width: min(620px, 96vw); max-height: 86vh; overflow: auto; background: var(--btn-bg); color: var(--text-color); border: 1px solid var(--btn-border); box-shadow: 0 0 18px rgba(139, 92, 246, 0.3); padding: 12px 14px; font-family: "Karla", sans-serif; font-size: 0.95rem; }
    #wiki-box h3 { font-family: "Orbitron", sans-serif; font-size: 0.85rem; color: var(--accent-glow); margin: 12px 0 6px; letter-spacing: 1px; text-transform: uppercase; }
    #wiki-box input { width: 100%; box-sizing: border-box; padding: 8px 10px; background: rgba(0,0,0,0.3); color: var(--text-color); border: 1px solid var(--btn-border); font-family: "Share Tech Mono", monospace; }
    #wiki-box .wiki-res { cursor: pointer; padding: 5px 8px; border-left: 2px solid transparent; }
    #wiki-box .wiki-res:hover { border-left-color: var(--accent-glow); background: rgba(139,92,246,0.08); }
    #wiki-box .wiki-note { font-size: 0.82rem; color: rgba(224,242,254,0.6); }
    #wiki-box .wiki-rank { font-family: "Share Tech Mono", monospace; font-size: 0.85rem; padding: 3px 0; }
    #wiki-box .wiki-close { float: right; cursor: pointer; background: none; border: none; color: var(--accent-glow); font-size: 1rem; }
  `;
  document.head.appendChild(st);
}

function wikiOpen() {
  if (document.getElementById("wiki-ov")) return;
  wikiStyle();
  const ov = document.createElement("div");
  ov.id = "wiki-ov";
  const box = document.createElement("div");
  box.id = "wiki-box";
  box.innerHTML = `<button class="wiki-close" aria-label="Zamknij">✕</button>
    <h3>Wiki</h3>
    <input id="wiki-q" type="text" placeholder="Nazwa przedmiotu, wroga albo zadania..." autocomplete="off">
    <div id="wiki-out" style="margin-top:8px;"></div>`;
  ov.appendChild(box);
  document.body.appendChild(ov);

  const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  box.querySelector(".wiki-close").onclick = close;
  ov.addEventListener("click", (e) => { if (e.target === ov) close(); });

  const q = box.querySelector("#wiki-q");
  const out = box.querySelector("#wiki-out");
  q.addEventListener("input", () => renderSearch(q.value, out));
  q.focus();
}

function renderSearch(text, out) {
  const t = wikiNorm(text).trim();
  out.innerHTML = "";
  if (t.length < 2) {
    out.innerHTML = '<div class="wiki-note">Wpisz co najmniej 2 litery.</div>';
    return;
  }
  const items = Object.entries(ITEMS).filter(([id, it]) => !it.quest && wikiNorm(it.name).includes(t)).slice(0, 8);
  const enemies = Object.entries(ENEMIES).filter(([id, e]) => wikiNorm(e.name).includes(t)).slice(0, 6);
  const questItems = Object.entries(ITEMS).filter(([id, it]) => it.quest && wikiNorm(it.name).includes(t)).slice(0, 6);

  if (items.length) {
    const h = document.createElement("h3"); h.textContent = "Przedmioty"; out.appendChild(h);
    items.forEach(([id, it]) => {
      const row = document.createElement("div");
      row.className = "wiki-res";
      row.textContent = it.name;
      row.onclick = () => renderItem(id, out);
      out.appendChild(row);
    });
  }
  if (questItems.length) {
    const h = document.createElement("h3"); h.textContent = "Przedmioty zadaniowe"; out.appendChild(h);
    questItems.forEach(([id, it]) => {
      const row = document.createElement("div");
      row.className = "wiki-res";
      row.textContent = it.name;
      row.onclick = () => renderItem(id, out);
      out.appendChild(row);
    });
  }
  if (enemies.length) {
    const h = document.createElement("h3"); h.textContent = "Wrogowie"; out.appendChild(h);
    enemies.forEach(([id, e]) => {
      const row = document.createElement("div");
      row.className = "wiki-res";
      row.textContent = e.name;
      row.onclick = () => renderEnemy(id, out);
      out.appendChild(row);
    });
  }
  if (!items.length && !enemies.length && !questItems.length) {
    out.innerHTML = '<div class="wiki-note">Nic nie znaleziono.</div>';
  }
}

function renderItem(id, out) {
  out.innerHTML = "";
  const it = ITEMS[id];
  const h = document.createElement("h3"); h.textContent = it.name; out.appendChild(h);
  const ranking = wikiMapOfQuestItem(id).slice(0, 3);
  const r = document.createElement("div");
  r.innerHTML = '<div class="wiki-note">Najlepsze mapy (3 z największą szansą):</div>';
  if (!ranking.length) {
    r.innerHTML += '<div class="wiki-rank">Brak źródeł w rajdach (kupuje się tylko w sklepie albo nagroda zadania).</div>';
  } else {
    ranking.forEach((x, i) => {
      const line = document.createElement("div");
      line.className = "wiki-rank";
      line.textContent = `${i + 1}. ${x.mapName} - ok. ${x.score.toFixed(2)} szt. na wizytę (${x.nodes.slice(0, 3).join(", ")})`;
      r.appendChild(line);
    });
  }
  out.appendChild(r);
  const shops = wikiShops(id);
  if (shops.length) {
    const s = document.createElement("div");
    s.className = "wiki-note";
    s.textContent = "Do kupienia u: " + shops.join("; ");
    out.appendChild(s);
  }
  const quests = wikiQuestsFor(id);
  if (quests.length) {
    const qh = document.createElement("h3"); qh.textContent = "Zlecenia z tym przedmiotem"; out.appendChild(qh);
    quests.forEach((x) => {
      const line = document.createElement("div");
      line.className = "wiki-note";
      line.textContent = `${x.main ? "[FABULA] " : ""}${x.title}${x.trader ? " - " + x.trader : ""}${x.map ? " (mapa zadania: " + x.map + ")" : ""}`;
      out.appendChild(line);
    });
  }
  const back = document.createElement("div");
  back.className = "wiki-note";
  back.style.marginTop = "8px";
  back.textContent = "← wróć do wyszukiwania (wpisz ponownie)";
  out.appendChild(back);
}

function renderEnemy(id, out) {
  out.innerHTML = "";
  const e = ENEMIES[id];
  const h = document.createElement("h3"); h.textContent = e.name; out.appendChild(h);
  const maps = wikiEnemyMaps(id);
  if (!maps.length) {
    out.innerHTML += '<div class="wiki-note">Nie występuje w żadnym pokoju map.</div>';
  } else {
    const byMap = {};
    maps.forEach((m) => { (byMap[m.mapName] = byMap[m.mapName] || []).push(m); });
    Object.entries(byMap).forEach(([name, arr]) => {
      const line = document.createElement("div");
      line.className = "wiki-rank";
      line.textContent = `${name}: ${arr.map((x) => x.nodeName).join(", ")}`;
      out.appendChild(line);
    });
  }
  const quests = wikiQuestsForEnemy(id);
  if (quests.length) {
    const qh = document.createElement("h3"); qh.textContent = "Zlecenia z tym celem"; out.appendChild(qh);
    quests.forEach((x) => {
      const line = document.createElement("div");
      line.className = "wiki-note";
      line.textContent = `${x.main ? "[FABULA] " : ""}${x.title}`;
      out.appendChild(line);
    });
  }
}

function wikiInit() {
  if (document.getElementById("wiki-btn")) return;
  wikiStyle();
  const b = document.createElement("button");
  b.id = "wiki-btn";
  b.textContent = "W";
  b.title = "Wiki";
  b.onclick = wikiOpen;
  document.body.appendChild(b);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wikiInit);
  else wikiInit();
}
