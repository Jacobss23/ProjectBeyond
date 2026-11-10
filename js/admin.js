// === SEKCJA: STAN PANELU ADMINISTRATORA ===
let db = {
  items: {},
  enemies: {},
  traders: [],
  maps: {},
  skills: {},
  perks: {},
};

let currentTab = "items";
let selectedItemId = null;
let selectedEnemyId = null;
let selectedTraderId = null;
let selectedMapId = null;
let selectedSkillId = null;
let selectedPerkId = null;

// === SEKCJA: INICJALIZACJA ===
document.addEventListener("DOMContentLoaded", () => {
  loadWorkingDatabase();
  renderCurrentTab();
});

function loadWorkingDatabase() {
  // Domyślne wartości
  db.items = typeof ITEMS !== "undefined" ? JSON.parse(JSON.stringify(ITEMS)) : {};
  db.enemies = typeof ENEMIES !== "undefined" ? JSON.parse(JSON.stringify(ENEMIES)) : {};
  db.traders = typeof TRADERS !== "undefined" ? JSON.parse(JSON.stringify(TRADERS)) : [];
  db.maps = typeof MAPS !== "undefined" ? JSON.parse(JSON.stringify(MAPS)) : {};
  db.skills = typeof SKILLS !== "undefined" ? JSON.parse(JSON.stringify(SKILLS)) : {};
  db.perks = typeof PERKS !== "undefined" ? JSON.parse(JSON.stringify(PERKS)) : {};
  db.quests = typeof QUESTS !== "undefined" ? JSON.parse(JSON.stringify(QUESTS)) : [];
  db.loot = typeof LOOT !== "undefined" ? JSON.parse(JSON.stringify(LOOT)) : {};

  // Załaduj nadpisania z localStorage jeśli istnieją
  try {
    const raw = localStorage.getItem("gameData_overrides");
    if (raw) {
      const ov = JSON.parse(raw);
      if (ov.items) Object.assign(db.items, ov.items);
      if (ov.enemies) Object.assign(db.enemies, ov.enemies);
      if (ov.traders) db.traders = ov.traders;
      if (ov.maps) Object.assign(db.maps, ov.maps);
      if (ov.skills) Object.assign(db.skills, ov.skills);
      if (ov.perks) Object.assign(db.perks, ov.perks);
      if (ov.quests) db.quests = ov.quests;
      if (ov.loot) db.loot = ov.loot;
    }
  } catch (e) {
    console.error("Błąd odczytu overrides:", e);
  }
}

function showToast(msg, isError = false) {
  const t = document.getElementById("admin-toast");
  t.textContent = msg;
  t.style.borderColor = isError ? "#ef4444" : "#22c55e";
  t.style.color = isError ? "#fca5a5" : "#86efac";
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 3500);
}


// === SEKCJA: OKNA DIALOGOWE (zamiast blokowanych prompt/confirm/alert) ===
function askText(title, placeholder = "") {
  return new Promise((resolve) => {
    const ov = document.createElement("div");
    ov.className = "admin-dialog-ov";
    ov.innerHTML = `<div class="admin-dialog" role="dialog" aria-modal="true">
      <h3></h3><input type="text" autocomplete="off" /><div class="admin-dialog-btns">
      <button type="button" data-a="ok" class="primary">OK</button><button type="button" data-a="cancel" class="ghost">Anuluj</button></div></div>`;
    ov.querySelector("h3").textContent = title;
    const input = ov.querySelector("input");
    input.placeholder = placeholder;
    const close = (val) => {
      document.removeEventListener("keydown", onKey, true);
      ov.remove();
      resolve(val);
    };
    const onKey = (e) => {
      if (e.key === "Escape") close(null);
      if (e.key === "Enter") close(input.value);
    };
    ov.querySelector('[data-a="ok"]').onclick = () => close(input.value);
    ov.querySelector('[data-a="cancel"]').onclick = () => close(null);
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(ov);
    setTimeout(() => input.focus(), 0);
  });
}

function askConfirm(text) {
  return new Promise((resolve) => {
    const ov = document.createElement("div");
    ov.className = "admin-dialog-ov";
    ov.innerHTML = `<div class="admin-dialog" role="alertdialog" aria-modal="true">
      <p></p><div class="admin-dialog-btns">
      <button type="button" data-a="ok" class="danger">Tak</button><button type="button" data-a="cancel" class="ghost">Nie</button></div></div>`;
    ov.querySelector("p").textContent = text;
    const close = (val) => {
      document.removeEventListener("keydown", onKey, true);
      ov.remove();
      resolve(val);
    };
    const onKey = (e) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    ov.querySelector('[data-a="ok"]').onclick = () => close(true);
    ov.querySelector('[data-a="cancel"]').onclick = () => close(false);
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(ov);
    setTimeout(() => ov.querySelector('[data-a="cancel"]').focus(), 0);
  });
}

// === SEKCJA: ZAKŁADKI ===
function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll(".admin-tab").forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));

  const targetTabBtn = Array.from(document.querySelectorAll(".admin-tab")).find((b) => b.getAttribute("onclick")?.includes(tabId));
  if (targetTabBtn) targetTabBtn.classList.add("active");

  const pane = document.getElementById(`tab-${tabId}`);
  if (pane) pane.classList.add("active");

  renderCurrentTab();
}

function renderCurrentTab() {
  if (currentTab === "items") renderItemsList();
  if (currentTab === "perks") renderPerksList();
  if (currentTab === "enemies") renderEnemiesList();
  if (currentTab === "traders") renderTradersList();
  if (currentTab === "maps") renderMapsList();
  if (currentTab === "skills") renderSkillsList();
  if (currentTab === "quests") renderQuestsList();
  if (currentTab === "loot") renderLootList();
  if (currentTab === "raw") renderRawJson();
}

// === SEKCJA: EDYTOR PRZEDMIOTÓW ===
function renderItemsList() {
  const listEl = document.getElementById("items-list");
  listEl.innerHTML = "";
  const query = (document.getElementById("items-search")?.value || "").toLowerCase();

  const keys = Object.keys(db.items).filter((k) => {
    const it = db.items[k];
    return k.toLowerCase().includes(query) || it.name.toLowerCase().includes(query) || it.type?.toLowerCase().includes(query);
  });

  if (!selectedItemId && keys.length) selectedItemId = keys[0];

  keys.forEach((id) => {
    const it = db.items[id];
    const btn = document.createElement("button");
    btn.className = `list-item-btn ${id === selectedItemId ? "selected" : ""}`;
    btn.onclick = () => {
      selectedItemId = id;
      renderItemsList();
    };

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    if (it.image) {
      const img = document.createElement("img");
      img.src = it.image;
      img.className = "item-thumb-micro";
      left.appendChild(img);
    }
    const txt = document.createElement("span");
    txt.textContent = it.name || id;
    left.appendChild(txt);

    const right = document.createElement("span");
    right.style.color = "#94a3b8";
    right.style.fontSize = "0.75rem";
    right.textContent = it.type;

    btn.append(left, right);
    listEl.appendChild(btn);
  });

  renderItemEditor();
}

function filterItemsList() {
  renderItemsList();
}

function renderItemEditor() {
  const ed = document.getElementById("item-editor-content");
  if (!selectedItemId || !db.items[selectedItemId]) {
    ed.innerHTML = `<p class="empty-hint">Wybierz przedmiot z listy lub kliknij "+ Nowy".</p>`;
    return;
  }

  const it = db.items[selectedItemId];
  const type = it.type || "junk";
  const sizeW = it.size ? it.size[0] : 1;
  const sizeH = it.size ? it.size[1] : 1;
  const dmgMin = it.dmg ? it.dmg[0] : 0;
  const dmgMax = it.dmg ? it.dmg[1] : 0;

  const isWeapon = type === "weapon";
  const isArmor = type === "armor";
  const isConsumable = type === "consumable";
  const isAmmo = type === "ammo";
  const canStack = type === "junk" || type === "ammo" || type === "consumable" || type === "quest";

  ed.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2 style="margin:0; font-size:1.4rem; color:#f8fafc;">Edycja: ${it.name} <small style="color:#a78bfa;">(${selectedItemId})</small></h2>
      <div style="display:flex; gap:8px;">
        <button onclick="duplicateItem('${selectedItemId}')" class="sm-btn">Klonuj</button>
        <button onclick="deleteItem('${selectedItemId}')" class="danger-btn" style="padding:4px 10px; font-size:0.8rem;">Usuń</button>
      </div>
    </div>

    <!-- Upload grafiki przedmiotu -->
    <div class="image-upload-wrapper" style="margin-bottom: 20px;">
      <div class="image-preview-box">
        ${it.image ? `<img src="${it.image}" alt="Podgląd" />` : `<span style="font-size:0.75rem; color:#64748b;">Brak grafiki</span>`}
      </div>
      <div>
        <label style="font-weight:600; color:#e2e8f0; display:block; margin-bottom:4px; font-size:0.9rem;">Własna grafika / sprite przedmiotu:</label>
        <input type="file" accept="image/*" onchange="uploadItemImage(event, '${selectedItemId}')" style="font-size:0.8rem; color:#cbd5e1;" />
        <small style="color:#64748b; display:block; margin-top:4px;">Obsługuje formaty PNG, JPG, WebP. Zostanie zapisana w bazie jako Data URL.</small>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Nazwa wyświetlana</label>
        <input type="text" value="${it.name || ''}" onchange="updateItemField('${selectedItemId}', 'name', this.value)" />
      </div>

      <div class="form-group">
        <label>Typ przedmiotu</label>
        <select onchange="updateItemField('${selectedItemId}', 'type', this.value)">
          <option value="junk" ${type === 'junk' ? 'selected' : ''}>Części / Surowce (junk)</option>
          <option value="weapon" ${type === 'weapon' ? 'selected' : ''}>Broń (weapon)</option>
          <option value="armor" ${type === 'armor' ? 'selected' : ''}>Pancerz (armor)</option>
          <option value="consumable" ${type === 'consumable' ? 'selected' : ''}>Medykament / Żywność (consumable)</option>
          <option value="ammo" ${type === 'ammo' ? 'selected' : ''}>Amunicja (ammo)</option>
          <option value="quest" ${type === 'quest' ? 'selected' : ''}>Przedmiot fabularny (quest)</option>
        </select>
      </div>

      <div class="form-group">
        <label>Rozmiar siatki [Szerokość x Wysokość]</label>
        <div style="display:flex; gap:8px;">
          <input type="number" min="1" max="6" value="${sizeW}" onchange="updateItemSize('${selectedItemId}', 0, parseInt(this.value))" title="Szerokość" />
          <input type="number" min="1" max="6" value="${sizeH}" onchange="updateItemSize('${selectedItemId}', 1, parseInt(this.value))" title="Wysokość" />
        </div>
      </div>

      <div class="form-group">
        <label>Wartość bazowa (kredyty)</label>
        <input type="number" min="0" value="${it.value || 0}" onchange="updateItemField('${selectedItemId}', 'value', parseInt(this.value))" />
      </div>

      ${canStack ? `
      <div class="form-group">
        <label>Maks. stos w polu (stack)</label>
        <input type="number" min="1" max="100" value="${it.stack || 1}" onchange="updateItemField('${selectedItemId}', 'stack', parseInt(this.value))" />
      </div>
      ` : ''}

      ${isConsumable ? `
      <div class="form-group">
        <label>Leczenie HP (heal)</label>
        <input type="number" min="1" value="${it.heal || 15}" onchange="updateItemField('${selectedItemId}', 'heal', parseInt(this.value))" />
      </div>
      ` : ''}

      ${isWeapon ? `
      <div class="form-group">
        <label>Obrażenia broni [Min - Max]</label>
        <div style="display:flex; gap:8px;">
          <input type="number" min="0" value="${dmgMin}" onchange="updateItemDmg('${selectedItemId}', 0, parseInt(this.value))" placeholder="Min" />
          <input type="number" min="0" value="${dmgMax}" onchange="updateItemDmg('${selectedItemId}', 1, parseInt(this.value))" placeholder="Max" />
        </div>
      </div>

      <div class="form-group">
        <label>Celność broni (0.1 - 1.0)</label>
        <input type="number" step="0.05" min="0.1" max="1.0" value="${it.acc || 0.8}" onchange="updateItemField('${selectedItemId}', 'acc', parseFloat(this.value))" />
      </div>

      <div class="form-group">
        <label>Wymagana amunicja (puste dla białej)</label>
        <input type="text" value="${it.ammo || ''}" placeholder="np. ammo9, ammo12, ammo556 lub puste" onchange="updateItemField('${selectedItemId}', 'ammo', this.value || undefined)" />
      </div>
      ` : ''}

      ${isArmor ? `
      <div class="form-group">
        <label>Pancerz redukcji obrażeń (def)</label>
        <input type="number" min="1" value="${it.def || 3}" onchange="updateItemField('${selectedItemId}', 'def', parseInt(this.value))" />
      </div>
      ` : ''}

      <div class="form-group">
        <label>Rzadkość (rarity)</label>
        <select onchange="updateItemField('${selectedItemId}', 'rarity', this.value || undefined)">
          <option value="" ${!it.rarity ? 'selected' : ''}>Powszechny (Standard)</option>
          <option value="rare" ${it.rarity === 'rare' ? 'selected' : ''}>Rzadki (Rare)</option>
        </select>
      </div>

      <div class="form-group">
        <label>Przedmiot questowy (quest)</label>
        <select onchange="updateItemField('${selectedItemId}', 'quest', this.value === 'true')">
          <option value="false" ${!it.quest ? 'selected' : ''}>Nie</option>
          <option value="true" ${it.quest ? 'selected' : ''}>Tak (zablokowany handel)</option>
        </select>
      </div>
    </div>
  `;
}

function updateItemField(id, field, val) {
  if (!db.items[id]) return;
  db.items[id][field] = val;
  if (field === "name") renderItemsList();
  if (field === "type") renderItemEditor();
}

function updateItemSize(id, idx, val) {
  if (!db.items[id]) return;
  db.items[id].size = db.items[id].size || [1, 1];
  db.items[id].size[idx] = Math.max(1, val);
}

function updateItemDmg(id, idx, val) {
  if (!db.items[id]) return;
  db.items[id].dmg = db.items[id].dmg || [0, 0];
  db.items[id].dmg[idx] = Math.max(0, val);
}

function uploadItemImage(e, id) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    db.items[id].image = evt.target.result;
    renderItemEditor();
    renderItemsList();
    showToast(`Wczytano grafikę dla ${db.items[id].name}`);
  };
  reader.readAsDataURL(file);
}

async function addNewItem() {
  const newId = await askText("Podaj unikalny identyfikator przedmiotu (np. rifle_laser, stim_adrenaline):");
  if (!newId) return;
  const cleanId = newId.trim().toLowerCase().replace(/\s+/g, "_");
  if (db.items[cleanId]) return showToast("Przedmiot o takim ID już istnieje!", true);

  db.items[cleanId] = {
    name: "Nowy Przedmiot",
    type: "junk",
    size: [1, 1],
    value: 50,
  };
  selectedItemId = cleanId;
  renderItemsList();
}

function duplicateItem(id) {
  const copyId = `${id}_copy`;
  if (db.items[copyId]) return showToast(`Przedmiot ${copyId} już istnieje!`, true);
  db.items[copyId] = JSON.parse(JSON.stringify(db.items[id]));
  db.items[copyId].name += " (Kopia)";
  selectedItemId = copyId;
  renderItemsList();
}

async function deleteItem(id) {
  if (!await askConfirm(`Czy na pewno usunąć przedmiot ${db.items[id].name} (${id})?`)) return;
  delete db.items[id];
  selectedItemId = Object.keys(db.items)[0] || null;
  renderItemsList();
}

// === SEKCJA: EDYTOR WROGÓW ===
function renderEnemiesList() {
  const listEl = document.getElementById("enemies-list");
  listEl.innerHTML = "";
  const keys = Object.keys(db.enemies);
  if (!selectedEnemyId && keys.length) selectedEnemyId = keys[0];

  keys.forEach((id) => {
    const e = db.enemies[id];
    const btn = document.createElement("button");
    btn.className = `list-item-btn ${id === selectedEnemyId ? "selected" : ""}`;
    btn.onclick = () => {
      selectedEnemyId = id;
      renderEnemiesList();
    };

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    if (e.image) {
      const img = document.createElement("img");
      img.src = e.image;
      img.className = "item-thumb-micro";
      left.appendChild(img);
    }
    const txt = document.createElement("span");
    txt.textContent = e.name || id;
    left.appendChild(txt);

    const right = document.createElement("span");
    right.style.color = "#ef4444";
    right.style.fontSize = "0.75rem";
    right.textContent = `${e.hp} HP`;

    btn.append(left, right);
    listEl.appendChild(btn);
  });

  renderEnemyEditor();
}

function renderEnemyEditor() {
  const ed = document.getElementById("enemy-editor-content");
  if (!selectedEnemyId || !db.enemies[selectedEnemyId]) {
    ed.innerHTML = `<p class="empty-hint">Wybierz wroga z listy lub dodaj nowego.</p>`;
    return;
  }

  const e = db.enemies[selectedEnemyId];
  const dmgMin = e.dmg ? e.dmg[0] : 1;
  const dmgMax = e.dmg ? e.dmg[1] : 5;

  ed.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2 style="margin:0; font-size:1.4rem; color:#f8fafc;">Edycja: ${e.name} <small style="color:#a78bfa;">(${selectedEnemyId})</small></h2>
      <button onclick="deleteEnemy('${selectedEnemyId}')" class="danger-btn" style="padding:4px 10px; font-size:0.8rem;">Usuń wroga</button>
    </div>

    <!-- Upload grafiki wroga -->
    <div class="image-upload-wrapper" style="margin-bottom: 20px;">
      <div class="image-preview-box">
        ${e.image ? `<img src="${e.image}" alt="Podgląd" />` : `<span style="font-size:0.75rem; color:#64748b;">Brak grafiki</span>`}
      </div>
      <div>
        <label style="font-weight:600; color:#e2e8f0; display:block; margin-bottom:4px; font-size:0.9rem;">Własny portret / sprite wroga:</label>
        <input type="file" accept="image/*" onchange="uploadEnemyImage(event, '${selectedEnemyId}')" style="font-size:0.8rem; color:#cbd5e1;" />
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Nazwa wroga</label>
        <input type="text" value="${e.name || ''}" onchange="updateEnemyField('${selectedEnemyId}', 'name', this.value)" />
      </div>

      <div class="form-group">
        <label>Punkty życia (HP)</label>
        <input type="number" min="1" value="${e.hp || 30}" onchange="updateEnemyField('${selectedEnemyId}', 'hp', parseInt(this.value))" />
      </div>

      <div class="form-group">
        <label>Obrażenia ataku [Min - Max]</label>
        <div style="display:flex; gap:8px;">
          <input type="number" min="0" value="${dmgMin}" onchange="updateEnemyDmg('${selectedEnemyId}', 0, parseInt(this.value))" placeholder="Min" />
          <input type="number" min="0" value="${dmgMax}" onchange="updateEnemyDmg('${selectedEnemyId}', 1, parseInt(this.value))" placeholder="Max" />
        </div>
      </div>

      <div class="form-group">
        <label>Celność ataku (0.1 - 1.0)</label>
        <input type="number" step="0.05" min="0.1" max="1.0" value="${e.acc || 0.6}" onchange="updateEnemyField('${selectedEnemyId}', 'acc', parseFloat(this.value))" />
      </div>

      <div class="form-group">
        <label>Nagroda XP za pokonanie</label>
        <input type="number" min="0" value="${e.xp || 15}" onchange="updateEnemyField('${selectedEnemyId}', 'xp', parseInt(this.value))" />
      </div>

      <div class="form-group">
        <label>Czasownik ataku (np. gryzie, drapie, strzela)</label>
        <input type="text" value="${e.verb || 'atakuje'}" onchange="updateEnemyField('${selectedEnemyId}', 'verb', this.value)" />
      </div>

      <div class="form-group">
        <label>Tabela łupu (loot)</label>
        <input type="text" value="${e.loot || 'zombie'}" onchange="updateEnemyField('${selectedEnemyId}', 'loot', this.value)" />
      </div>

      <div class="form-group">
        <label>Liczba rzutów na łup (rolls)</label>
        <input type="number" min="1" max="6" value="${e.rolls || 1}" onchange="updateEnemyField('${selectedEnemyId}', 'rolls', parseInt(this.value))" />
      </div>
    </div>
  `;
}

function updateEnemyField(id, field, val) {
  if (!db.enemies[id]) return;
  db.enemies[id][field] = val;
  if (field === "name" || field === "hp") renderEnemiesList();
}

function updateEnemyDmg(id, idx, val) {
  if (!db.enemies[id]) return;
  db.enemies[id].dmg = db.enemies[id].dmg || [1, 5];
  db.enemies[id].dmg[idx] = Math.max(0, val);
}

function uploadEnemyImage(e, id) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    db.enemies[id].image = evt.target.result;
    renderEnemyEditor();
    renderEnemiesList();
    showToast(`Wczytano grafikę dla wroga ${db.enemies[id].name}`);
  };
  reader.readAsDataURL(file);
}

async function addNewEnemy() {
  const newId = await askText("Podaj unikalny identyfikator wroga (np. zombie_stalker, cyborg_elite):");
  if (!newId) return;
  const cleanId = newId.trim().toLowerCase().replace(/\s+/g, "_");
  if (db.enemies[cleanId]) return showToast("Wróg o takim ID już istnieje!", true);

  db.enemies[cleanId] = {
    name: "Nowy Mutujący Wróg",
    hp: 40,
    dmg: [4, 8],
    acc: 0.65,
    xp: 20,
    loot: "zombie",
    rolls: 1,
    verb: "szarżuje",
  };
  selectedEnemyId = cleanId;
  renderEnemiesList();
}

async function deleteEnemy(id) {
  if (!await askConfirm(`Czy na pewno usunąć wroga ${db.enemies[id].name}?`)) return;
  delete db.enemies[id];
  selectedEnemyId = Object.keys(db.enemies)[0] || null;
  renderEnemiesList();
}

// === SEKCJA: EDYTOR HANDLARZY ===
function renderTradersList() {
  const listEl = document.getElementById("traders-list");
  listEl.innerHTML = "";
  if (!selectedTraderId && db.traders.length) selectedTraderId = db.traders[0].id;

  db.traders.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = `list-item-btn ${t.id === selectedTraderId ? "selected" : ""}`;
    btn.onclick = () => {
      selectedTraderId = t.id;
      renderTradersList();
    };

    btn.innerHTML = `<span>${t.name}</span><span style="color:#38bdf8; font-size:0.75rem;">${t.stock.length} ofert</span>`;
    listEl.appendChild(btn);
  });

  renderTraderEditor();
}

async function addNewTrader() {
  const newId = await askText("Podaj ID handlarza (np. trader_blackmarket):");
  if (!newId) return;
  const cleanId = newId.trim();
  db.traders.push({
    id: cleanId,
    name: "Nowy Handlarz",
    desc: "Tajemniczy kupiec na stacji.",
    buyMult: 1.5,
    sellMult: 1.0,
    stock: ["ration", "ammo9"],
  });
  selectedTraderId = cleanId;
  renderTradersList();
}

// === SEKCJA: EDYTOR MAP ===
function renderMapsList() {
  const listEl = document.getElementById("maps-list");
  listEl.innerHTML = "";
  const keys = Object.keys(db.maps);
  if (!selectedMapId && keys.length) selectedMapId = keys[0];

  keys.forEach((id) => {
    const m = db.maps[id];
    const btn = document.createElement("button");
    btn.className = `list-item-btn ${id === selectedMapId ? "selected" : ""}`;
    btn.onclick = () => {
      selectedMapId = id;
      renderMapsList();
    };

    btn.innerHTML = `<span>${m.name}</span><span style="color:#a78bfa; font-size:0.75rem;">${Object.keys(m.nodes || {}).length} stref</span>`;
    listEl.appendChild(btn);
  });

  renderMapEditor();
}

async function addNewMap() {
  const newId = await askText("Podaj ID nowej mapy (np. derelict_station, titan_surface):");
  if (!newId) return;
  const cleanId = newId.trim().toLowerCase().replace(/\s+/g, "_");
  if (db.maps[cleanId]) return showToast("Mapa o takim ID już istnieje!", true);

  db.maps[cleanId] = {
    name: "Nowy Sektor Kosmiczny",
    tint: "#0f172a",
    start: "start_node",
    intro: "Nowy, niezbadany sektor pełen zagrożeń.",
    storm: 20,
    stormDmg: 5,
    nodes: {
      start_node: {
        name: "Śluza wejściowa",
        desc: "Zimny korytarz wejściowy.",
        exits: [],
        extract: true
      }
    }
  };
  selectedMapId = cleanId;
  renderMapsList();
}

// === SEKCJA: EDYTOR UMIEJĘTNOŚCI ===
function renderSkillsList() {
  const listEl = document.getElementById("skills-list-admin");
  listEl.innerHTML = "";
  const keys = Object.keys(db.skills);
  if (!selectedSkillId && keys.length) selectedSkillId = keys[0];

  keys.forEach((id) => {
    const sk = db.skills[id];
    const btn = document.createElement("button");
    btn.className = `list-item-btn ${id === selectedSkillId ? "selected" : ""}`;
    btn.onclick = () => {
      selectedSkillId = id;
      renderSkillsList();
    };

    btn.innerHTML = `<span>${sk.name}</span><span style="color:#8b5cf6; font-size:0.75rem;">Max 15</span>`;
    listEl.appendChild(btn);
  });

  renderSkillEditor();
}

function renderSkillEditor() {
  const ed = document.getElementById("skill-editor-content");
  if (!selectedSkillId || !db.skills[selectedSkillId]) {
    ed.innerHTML = `<p class="empty-hint">Wybierz umiejętność z listy.</p>`;
    return;
  }
  const sk = db.skills[selectedSkillId];

  ed.innerHTML = `
    <h2 style="margin:0 0 16px 0; font-size:1.4rem; color:#f8fafc;">Umiejętność: ${sk.name} <small style="color:#a78bfa;">(${selectedSkillId})</small></h2>

    <div class="form-grid">
      <div class="form-group">
        <label>Nazwa umiejętności</label>
        <input type="text" value="${sk.name}" onchange="setRec('skills', selectedSkillId, 'name', this.value); renderSkillsList();" />
      </div>

      <div class="form-group full-width">
        <label>Opis i statystyki per poziom</label>
        <textarea onchange="setRec('skills', selectedSkillId, 'desc', this.value);">${sk.desc || ''}</textarea>
      </div>
    </div>
  `;
}

// === SEKCJA: EDYTOR CECH & PERKÓW (Z NIEWIDZIALNYMI STATYSTYKAMI) ===
function renderPerksList() {
  const listEl = document.getElementById("perks-list");
  if (!listEl) return;
  listEl.innerHTML = "";
  const query = (document.getElementById("perks-search")?.value || "").toLowerCase();

  const keys = Object.keys(db.perks).filter((k) => {
    const p = db.perks[k];
    return k.toLowerCase().includes(query) || p.name.toLowerCase().includes(query) || p.desc?.toLowerCase().includes(query);
  });

  if (!selectedPerkId && keys.length) selectedPerkId = keys[0];

  keys.forEach((id) => {
    const p = db.perks[id];
    const isNeg = p.points > 0 || p.type === "neg";
    const btn = document.createElement("button");
    btn.className = `list-item-btn ${id === selectedPerkId ? "selected" : ""}`;
    btn.onclick = () => {
      selectedPerkId = id;
      renderPerksList();
    };

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "6px";

    const badge = document.createElement("span");
    badge.className = "stat-tag";
    badge.textContent = isNeg ? `+${p.points} pkt` : `${p.points} pkt`;
    badge.style.borderColor = isNeg ? "#ef4444" : "#22c55e";
    badge.style.color = isNeg ? "#f87171" : "#86efac";

    const txt = document.createElement("span");
    txt.textContent = p.name || id;

    left.append(badge, txt);

    const right = document.createElement("span");
    right.style.color = "#94a3b8";
    right.style.fontSize = "0.75rem";
    right.textContent = (p.stats || []).length + " stat.";

    btn.append(left, right);
    listEl.appendChild(btn);
  });

  renderPerkEditor();
}

function filterPerksList() {
  renderPerksList();
}

function renderPerkEditor() {
  const ed = document.getElementById("perk-editor-content");
  if (!ed) return;
  if (!selectedPerkId || !db.perks[selectedPerkId]) {
    ed.innerHTML = `<p class="empty-hint">Wybierz cechę z listy lub kliknij "+ Nowy Perk".</p>`;
    return;
  }

  const p = db.perks[selectedPerkId];
  p.stats = p.stats || [];

  let statsListHtml = "";
  if (p.stats.length === 0) {
    statsListHtml = `<p style="font-size:0.85rem; color:#64748b; font-style:italic; margin: 8px 0;">Brak przypisanych niewidzialnych statystyk ani bonusów do skilli. Kliknij poniższy przycisk, aby dodać!</p>`;
  } else {
    statsListHtml = p.stats.map((st, idx) => {
      let statLabel = "";
      if (st.stat === "skillBonus") {
        const sName = db.skills[st.skill]?.name || st.skill;
        statLabel = `Startowy poziom skilla: <strong style="color:#e2e8f0;">${sName}</strong> (+${st.val} lvl)`;
      } else if (st.stat === "maxSkillCap") {
        statLabel = `Limit poziomu umiejętności (Cap): <strong style="color:#f59e0b;">${st.val} lvl</strong>`;
      } else {
        const sDef = typeof HIDDEN_STATS_DEF !== "undefined" && HIDDEN_STATS_DEF[st.stat];
        const sName = sDef ? sDef.name : st.stat;
        const sign = parseFloat(st.val) > 0 ? `+${st.val}` : `${st.val}`;
        const unit = sDef ? sDef.unit : "";
        statLabel = `${sName}: <strong style="color:#38bdf8;">${sign}${unit}</strong>`;
      }

      return `
        <div class="perk-stat-item">
          <div>
            <span class="stat-tag" style="margin-right:8px;">#${idx + 1}</span>
            <span>${statLabel}</span>
          </div>
          <button onclick="removePerkStat('${selectedPerkId}', ${idx})" class="danger-btn" style="padding:2px 8px; font-size:0.75rem;">Usuń</button>
        </div>
      `;
    }).join("");
  }

  ed.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2 style="margin:0; font-size:1.4rem; color:#f8fafc;">
        Perk: <span style="color:#38bdf8;">${p.name}</span> <small style="color:#a78bfa;">(${selectedPerkId})</small>
      </h2>
      <div style="display:flex; gap:8px;">
        <button onclick="deletePerk('${selectedPerkId}')" class="danger-btn" style="padding:4px 10px; font-size:0.8rem;">Usuń Perk</button>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Nazwa perka / cechy</label>
        <input type="text" value="${p.name}" onchange="updatePerkField('${selectedPerkId}', 'name', this.value)" />
      </div>

      <div class="form-group">
        <label>Wartość punktowa (ujemne kosztują, dodatnie dają punkty)</label>
        <input type="number" value="${p.points}" onchange="updatePerkField('${selectedPerkId}', 'points', parseInt(this.value, 10) || 0)" />
      </div>

      <div class="form-group">
        <label>Typ cechy</label>
        <select onchange="updatePerkField('${selectedPerkId}', 'type', this.value)">
          <option value="pos" ${p.type === "pos" ? "selected" : ""}>Pozytywna (Zaleta - wymaga punktów)</option>
          <option value="neg" ${p.type === "neg" ? "selected" : ""}>Negatywna (Wada - daje punkty)</option>
        </select>
      </div>

      <div class="form-group full-width">
        <label>Opis cechy i fabularny tooltip</label>
        <textarea onchange="updatePerkField('${selectedPerkId}', 'desc', this.value)">${p.desc || ''}</textarea>
      </div>
    </div>

    <!-- SEKCJA: NIEWIDZIALNE STATYSTYKI I MODYFIKATORY PERKA -->
    <div class="perk-stats-box" style="margin-top:20px; padding:18px; background:rgba(15, 23, 42, 0.7); border:1px solid rgba(56, 189, 248, 0.3); border-radius:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div>
          <h3 style="margin:0; font-size:1.1rem; color:#38bdf8;">Niewidzialne statystyki & Modyfikatory</h3>
          <p style="margin:2px 0 0 0; font-size:0.8rem; color:#94a3b8;">Możesz dodać wiele ukrytych statystyk lub startowych poziomów skilli do jednego perka.</p>
        </div>
        <button onclick="toggleAddStatPanel('${selectedPerkId}')" class="primary-btn" style="padding:6px 14px; font-size:0.85rem;">
          + Dodaj statystykę
        </button>
      </div>

      <!-- Panel dodawania nowej statystyki (zgodnie z wymaganiem użytkownika) -->
      <div id="add-stat-panel-${selectedPerkId}" class="hidden" style="margin-bottom:16px; padding:14px; background:rgba(30, 41, 59, 0.95); border:1px solid #0284c7; border-radius:8px;">
        <h4 style="margin:0 0 10px 0; font-size:0.95rem; color:#e0f2fe;">Wybierz ukrytą statystykę lub skill:</h4>
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;">
          <div style="flex:1; min-width:200px;">
            <label style="display:block; font-size:0.8rem; color:#94a3b8; margin-bottom:4px;">Statystyka</label>
            <select id="new-stat-type-${selectedPerkId}" onchange="onStatTypeChange('${selectedPerkId}')" style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#f8fafc; border-radius:4px;">
              <optgroup label="Niewidzialne statystyki">
                <option value="luck">Szczęście (ilość i jakość lootu)</option>
                <option value="critChance">Krytyczne uderzenia (szansa na crit %)</option>
                <option value="immunity">Immunity (odporność na toksyny/skażenie %)</option>
                <option value="intuition">Intuicja (wykrywanie zagrożeń i unik zasadzki %)</option>
                <option value="stealth">Stealth (kamuflaż / omijanie wrogów %)</option>
                <option value="scavenger">Scavenger (oszczędzanie amunicji / więcej złomu %)</option>
                <option value="adrenaline">Adrenalina (bonus do walki przy <35% HP %)</option>
              </optgroup>
              <optgroup label="Maksymalny limit poziomu umiejętności">
                <option value="maxSkillCap">Limit poziomu umiejętności (np. 12 lub 18)</option>
              </optgroup>
              <optgroup label="Startowy poziom umiejętności">
                <option value="skillBonus_sila">Startowy poziom skilla: Siła</option>
                <option value="skillBonus_wytrzymalosc">Startowy poziom skilla: Wytrzymałość</option>
                <option value="skillBonus_witalnosc">Startowy poziom skilla: Witalność</option>
                <option value="skillBonus_przeszukiwanie">Startowy poziom skilla: Przeszukiwanie</option>
                <option value="skillBonus_percepcja">Startowy poziom skilla: Percepcja</option>
                <option value="skillBonus_bronPalna">Startowy poziom skilla: Broń Palna</option>
                <option value="skillBonus_medycyna">Startowy poziom skilla: Medycyna</option>
                <option value="skillBonus_inzynieria">Startowy poziom skilla: Inżynieria</option>
                <option value="skillBonus_metabolizm">Startowy poziom skilla: Metabolizm</option>
                <option value="skillBonus_przetrwanie">Startowy poziom skilla: Przetrwanie</option>
              </optgroup>
            </select>
          </div>

          <div style="width:150px;">
            <label style="display:block; font-size:0.8rem; color:#94a3b8; margin-bottom:4px;">Wartość (np. +3%, -3%, 12, 18, +1)</label>
            <input type="text" id="new-stat-val-${selectedPerkId}" value="+3%" style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#f8fafc; border-radius:4px;" />
          </div>

          <div style="display:flex; gap:6px;">
            <button onclick="submitNewStat('${selectedPerkId}')" class="primary-btn" style="padding:8px 14px;">Zatwierdź</button>
            <button onclick="toggleAddStatPanel('${selectedPerkId}')" class="ghost-btn" style="padding:8px 12px;">Anuluj</button>
          </div>
        </div>
      </div>

      <div class="stats-list">
        ${statsListHtml}
      </div>
    </div>
  `;
}

function updatePerkField(id, field, value) {
  if (!db.perks[id]) return;
  db.perks[id][field] = value;
  renderPerksList();
}

function toggleAddStatPanel(perkId) {
  const p = document.getElementById(`add-stat-panel-${perkId}`);
  if (p) p.classList.toggle("hidden");
}

function onStatTypeChange(perkId) {
  const sel = document.getElementById(`new-stat-type-${perkId}`);
  const inp = document.getElementById(`new-stat-val-${perkId}`);
  if (!sel || !inp) return;
  const val = sel.value;
  if (val === "maxSkillCap") inp.value = "12";
  else if (val.startsWith("skillBonus_")) inp.value = "+1";
  else inp.value = "+3%";
}

function submitNewStat(perkId) {
  const sel = document.getElementById(`new-stat-type-${perkId}`);
  const inp = document.getElementById(`new-stat-val-${perkId}`);
  if (!sel || !inp) return;

  const type = sel.value;
  const rawVal = inp.value.trim();
  const numVal = parseFloat(rawVal.replace("%", "").replace("+", "")) || 0;

  if (!db.perks[perkId]) return;
  db.perks[perkId].stats = db.perks[perkId].stats || [];

  if (type.startsWith("skillBonus_")) {
    const skillKey = type.replace("skillBonus_", "");
    db.perks[perkId].stats.push({
      stat: "skillBonus",
      skill: skillKey,
      val: Math.max(1, Math.round(numVal))
    });
  } else if (type === "maxSkillCap") {
    db.perks[perkId].stats.push({
      stat: "maxSkillCap",
      val: Math.round(numVal) || 12
    });
  } else {
    // Ukryta statystyka (np. +3% szczęście, -3% szczęście)
    db.perks[perkId].stats.push({
      stat: type,
      val: numVal
    });
  }

  showToast(`Dodano statystykę (${rawVal}) do perka!`);
  renderPerkEditor();
}

function removePerkStat(perkId, statIdx) {
  if (!db.perks[perkId] || !db.perks[perkId].stats) return;
  db.perks[perkId].stats.splice(statIdx, 1);
  showToast("Usunięto modyfikator z perka.");
  renderPerkEditor();
}

async function addNewPerk() {
  const name = await askText("Podaj nazwę nowego perka / cechy:");
  if (!name || !name.trim()) return;
  const cleanId = name.trim().replace(/[^a-zA-Z0-9]/g, "_");
  if (db.perks[cleanId]) return showToast("Perk o takim identyfikatorze już istnieje!", true);

  db.perks[cleanId] = {
    id: cleanId,
    name: name.trim(),
    type: "pos",
    points: -3,
    desc: "Nowo utworzona cecha postaci.",
    stats: []
  };

  selectedPerkId = cleanId;
  renderPerksList();
  showToast(`Stworzono nowy perk: ${name.trim()}`);
}

async function deletePerk(id) {
  if (!await askConfirm(`Czy na pewno chcesz usunąć perk "${db.perks[id]?.name || id}"?`)) return;
  delete db.perks[id];
  selectedPerkId = Object.keys(db.perks)[0] || null;
  renderPerksList();
  showToast("Perk został usunięty.");
}

// === SEKCJA: RAW JSON ===
function renderRawJson() {
  const tx = document.getElementById("raw-json-textarea");
  tx.value = JSON.stringify(db, null, 2);
}

async function applyRawJson() {
  try {
    const parsed = JSON.parse(document.getElementById("raw-json-textarea").value);
    db = parsed;
    showToast("Zastosowano zmiany z surowego formatu JSON!");
  } catch (err) {
    showToast("Błąd parsowania JSON: " + err.message, true);
  }
}

function formatRawJson() {
  try {
    const tx = document.getElementById("raw-json-textarea");
    tx.value = JSON.stringify(JSON.parse(tx.value), null, 2);
  } catch (e) {
    showToast("Niepoprawny JSON: " + e.message, true);
  }
}

// === SEKCJA: ZAPIS, EKSPORT & IMPORT ===
function saveAllChanges() {
  const overrides = {
    items: db.items,
    enemies: db.enemies,
    traders: db.traders,
    maps: db.maps,
    skills: db.skills,
    perks: db.perks,
    quests: db.quests,
    loot: db.loot,
  };

  localStorage.setItem("gameData_overrides", JSON.stringify(overrides));
  showToast("[ZAPISANO] Pomyślnie zapisano wszystkie zmiany! Gra natychmiast korzysta z nowych danych.");
}

function exportJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "space-tarkov-gamedata.json");
  dlAnchor.click();
  dlAnchor.remove();
  showToast("Pobrano plik konfiguracyjny JSON.");
}

function importJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const imported = JSON.parse(evt.target.result);
      if (imported.items) db.items = imported.items;
      if (imported.enemies) db.enemies = imported.enemies;
      if (imported.traders) db.traders = imported.traders;
      if (imported.maps) db.maps = imported.maps;
      if (imported.skills) db.skills = imported.skills;
      if (imported.perks) db.perks = imported.perks;
      if (imported.quests) db.quests = imported.quests;
      if (imported.loot) db.loot = imported.loot;

      saveAllChanges();
      renderCurrentTab();
      showToast("Pomyślnie zaimportowano bazę danych z pliku JSON!");
    } catch (err) {
      showToast("Błąd odczytu pliku JSON: " + err.message, true);
    }
  };
  reader.readAsText(file);
}

async function resetDefaults() {
  if (!await askConfirm("Czy na pewno chcesz usunąć wszystkie modyfikacje i przywrócić domyślną bazę danych?")) return;
  localStorage.removeItem("gameData_overrides");
  loadWorkingDatabase();
  renderCurrentTab();
  showToast("Przywrócono domyślne dane bazy.");
}

// === SEKCJA: WSPÓLNE POMOCNIKI EDYTORA (v27) ===
let selectedQuestId = null;
let selectedLootId = null;

function escHtml(v) {
  return String(v ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getRec(coll, id) {
  if (coll === "traders") return db.traders.find((t) => t.id === id);
  return db[coll] ? db[coll][id] : undefined;
}

// Ustawia pole rekordu (handlery inline nie widzą zmiennych lokalnych, więc wszystko idzie przez te funkcje)
function setRec(coll, id, field, value) {
  const rec = getRec(coll, id);
  if (rec) rec[field] = value;
}

// === SEKCJA: EDYTOR HANDLARZA (naprawiony) ===
function renderTraderEditor() {
  const ed = document.getElementById("trader-editor-content");
  const tr = getRec("traders", selectedTraderId);
  if (!tr) {
    ed.innerHTML = `<p class="empty-hint">Wybierz handlarza z listy.</p>`;
    return;
  }
  const id = tr.id;
  ed.innerHTML = `
    <h2 style="margin:0 0 16px 0; font-size:1.4rem; color:#f8fafc;">Edycja: ${escHtml(tr.name)} <small style="color:#a78bfa;">(${id})</small></h2>
    <div class="form-grid">
      <div class="form-group">
        <label>Nazwa handlarza</label>
        <input type="text" value="${escHtml(tr.name)}" onchange="setRec('traders','${id}','name',this.value); renderTradersList();" />
      </div>
      <div class="form-group">
        <label>Mnożnik cen kupna (buyMult)</label>
        <input type="number" step="0.1" value="${tr.buyMult}" onchange="setRec('traders','${id}','buyMult',parseFloat(this.value));" />
      </div>
      <div class="form-group">
        <label>Mnożnik cen sprzedaży gracza (sellMult)</label>
        <input type="number" step="0.1" value="${tr.sellMult}" onchange="setRec('traders','${id}','sellMult',parseFloat(this.value));" />
      </div>
      <div class="form-group full-width">
        <label>Opis i dialog handlarza</label>
        <textarea onchange="setRec('traders','${id}','desc',this.value);">${escHtml(tr.desc || "")}</textarea>
      </div>
      <div class="form-group full-width">
        <label>Towary na stanie (ID przedmiotów oddzielone przecinkami)</label>
        <textarea onchange="setRec('traders','${id}','stock',this.value.split(',').map(s => s.trim()).filter(Boolean)); renderTradersList();">${escHtml((tr.stock || []).join(", "))}</textarea>
      </div>
    </div>
  `;
}

// === SEKCJA: EDYTOR MAP I WĘZŁÓW (v27) ===
function renderMapEditor() {
  const ed = document.getElementById("map-editor-content");
  const m = db.maps[selectedMapId];
  if (!selectedMapId || !m) {
    ed.innerHTML = `<p class="empty-hint">Wybierz mapę z listy.</p>`;
    return;
  }
  const mid = selectedMapId;
  const nodeIds = Object.keys(m.nodes || {});
  const optList = (pairs, sel, empty) =>
    (empty !== undefined ? `<option value="">${empty}</option>` : "") +
    pairs.map(([v, l]) => `<option value="${escHtml(v)}" ${v === sel ? "selected" : ""}>${escHtml(l)}</option>`).join("");
  const lootOpts = (sel) => optList(Object.keys(db.loot || {}).map((k) => [k, k]), sel, "— brak —");
  const enemyOpts = (sel) => optList(Object.keys(db.enemies || {}).map((k) => [k, `${db.enemies[k].name} (${k})`]), sel, "— brak —");
  const startOpts = optList(nodeIds.map((n) => [n, `${m.nodes[n].name} (${n})`]), m.start);
  const KEYS = ["W", "A", "S", "D"];

  const cards = nodeIds
    .map((nid) => {
      const n = m.nodes[nid];
      const exits = n.exits || [];
      const exitRows =
        exits
          .map(
            (e, i) => `
          <div class="exit-row">
            <span class="exit-key">${KEYS[i] || "#" + (i + 1)}</span>
            <span>${escHtml(m.nodes[e]?.name || e)} <code>${e}</code></span>
            <button class="sm-btn" onclick="moveExit('${mid}','${nid}',${i},-1)">↑</button>
            <button class="sm-btn" onclick="moveExit('${mid}','${nid}',${i},1)">↓</button>
          </div>`
          )
          .join("") || `<p class="hint">Brak wyjść.</p>`;
      const checks = nodeIds
        .filter((o) => o !== nid)
        .map(
          (o) => `<label class="chk-line"><input type="checkbox" ${exits.includes(o) ? "checked" : ""} onchange="toggleExit('${mid}','${nid}','${o}',this.checked)" /> ${escHtml(m.nodes[o].name)} <code>${o}</code></label>`
        )
        .join("");
      const guaranteed = (n.guaranteed || []).map(([i, q]) => `${i}:${q}`).join(", ");
      return `
      <div class="panel node-card">
        <div class="node-head">
          <strong>${escHtml(n.name)}</strong> <code>${nid}</code>
          <button class="danger-btn sm-btn" onclick="deleteNode('${mid}','${nid}')">Usuń węzeł</button>
        </div>
        <div class="form-grid">
          <div class="form-group"><label>Nazwa</label>
            <input type="text" value="${escHtml(n.name)}" onchange="setNode('${mid}','${nid}','name',this.value); renderMapsList();" /></div>
          <div class="form-group"><label>Ewakuacja</label>
            <label class="chk-line"><input type="checkbox" ${n.extract ? "checked" : ""} onchange="setNode('${mid}','${nid}','extract',this.checked)" /> Można się ewakuować</label></div>
          <div class="form-group full-width"><label>Opis</label>
            <textarea onchange="setNode('${mid}','${nid}','desc',this.value)">${escHtml(n.desc || "")}</textarea></div>
          <div class="form-group"><label>Tabela łupu</label>
            <select onchange="setNodeLoot('${mid}','${nid}',this.value,'table')">${lootOpts(n.loot?.table)}</select></div>
          <div class="form-group"><label>Rzuty łupu (rolls)</label>
            <input type="number" min="1" value="${n.loot?.rolls || 1}" onchange="setNodeLoot('${mid}','${nid}',Number(this.value),'rolls')" /></div>
          <div class="form-group"><label>Wróg</label>
            <select onchange="setNodeEnemy('${mid}','${nid}',this.value,null)">${enemyOpts(n.enemy?.id)}</select></div>
          <div class="form-group"><label>Szansa na wroga (0–1)</label>
            <input type="number" step="0.05" min="0" max="1" value="${n.enemy?.chance ?? 0}" onchange="setNodeEnemy('${mid}','${nid}',null,Number(this.value))" /></div>
          <div class="form-group"><label>Wymagany znacznik ewakuacji (extractRequires)</label>
            <input type="text" value="${escHtml(n.extractRequires || "")}" onchange="setNode('${mid}','${nid}','extractRequires',this.value.trim() || undefined)" /></div>
          <div class="form-group"><label>Gwarantowane przedmioty (id:ilość, …)</label>
            <input type="text" value="${escHtml(guaranteed)}" onchange="setNodeGuaranteed('${mid}','${nid}',this.value)" /></div>
        </div>
        <div class="form-group full-width"><label>Wyjścia (kolejność = klawisze W, A, S, D)</label>
          <div class="exit-list">${exitRows}</div>
          <div class="exit-checks">${checks || `<span class="hint">Brak innych węzłów.</span>`}</div>
        </div>
      </div>`;
    })
    .join("");

  ed.innerHTML = `
    <h2 style="margin:0 0 16px 0; font-size:1.4rem; color:#f8fafc;">Edycja Mapy: ${escHtml(m.name)} <small style="color:#a78bfa;">(${mid})</small></h2>
    <div class="form-grid">
      <div class="form-group"><label>Nazwa mapy</label>
        <input type="text" value="${escHtml(m.name)}" onchange="setRec('maps','${mid}','name',this.value); renderMapsList();" /></div>
      <div class="form-group"><label>Kolor / odcień strefy (tint)</label>
        <input type="text" value="${escHtml(m.tint || "#1e1b4b")}" onchange="setRec('maps','${mid}','tint',this.value)" /></div>
      <div class="form-group"><label>Akcje do nadejścia burzy (storm)</label>
        <input type="number" value="${m.storm || 0}" onchange="setRec('maps','${mid}','storm',parseInt(this.value)||0)" /></div>
      <div class="form-group"><label>Obrażenia burzy (stormDmg)</label>
        <input type="number" value="${m.stormDmg || 0}" onchange="setRec('maps','${mid}','stormDmg',parseInt(this.value)||0)" /></div>
      <div class="form-group"><label>Węzeł startowy</label>
        <select onchange="setRec('maps','${mid}','start',this.value)">${startOpts}</select></div>
      <div class="form-group full-width"><label>Tekst wprowadzenia (intro)</label>
        <textarea onchange="setRec('maps','${mid}','intro',this.value)">${escHtml(m.intro || "")}</textarea></div>
    </div>

    <div class="node-toolbar">
      <h3 style="margin:0; color:#38bdf8;">Węzły (${nodeIds.length})</h3>
      <button class="sm-btn" onclick="addNode('${mid}')">+ Nowy węzeł</button>
      <button class="danger-btn sm-btn" onclick="deleteMap('${mid}')">Usuń mapę</button>
    </div>
    <p class="hint">Bramki (gate), zagrożenia (hazard), wybory (choice), zadania w węźle (task) i boss edytujesz w zakładce RAW JSON.</p>
    <div class="node-list">${cards}</div>
  `;
}

function setNode(mid, nid, field, value) {
  const n = db.maps[mid]?.nodes?.[nid];
  if (!n) return;
  if (value === undefined) delete n[field];
  else n[field] = value;
}

function setNodeLoot(mid, nid, val, part) {
  const n = db.maps[mid].nodes[nid];
  if (part === "table") {
    if (!val) delete n.loot;
    else n.loot = { table: val, rolls: n.loot?.rolls || 1 };
  } else if (n.loot) {
    n.loot.rolls = val || 1;
  }
  renderMapEditor();
}

// id !== null – zmiana wybranego wroga; chance !== null – zmiana szansy
function setNodeEnemy(mid, nid, id, chance) {
  const n = db.maps[mid].nodes[nid];
  if (id !== null) {
    if (!id) delete n.enemy;
    else n.enemy = { id, chance: n.enemy?.chance ?? 0.5 };
  }
  if (chance !== null && n.enemy) n.enemy.chance = chance;
  renderMapEditor();
}

function setNodeGuaranteed(mid, nid, text) {
  const n = db.maps[mid].nodes[nid];
  const list = text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => {
      const [i, q] = p.split(":");
      return [i.trim(), Math.max(1, parseInt(q) || 1)];
    });
  if (list.length) n.guaranteed = list;
  else delete n.guaranteed;
  renderMapEditor();
}

function toggleExit(mid, nid, target, on) {
  const n = db.maps[mid].nodes[nid];
  n.exits = n.exits || [];
  if (on) {
    if (!n.exits.includes(target)) n.exits.push(target);
  } else {
    n.exits = n.exits.filter((e) => e !== target);
  }
  renderMapEditor();
}

function moveExit(mid, nid, idx, dir) {
  const ex = db.maps[mid].nodes[nid].exits;
  const j = idx + dir;
  if (j < 0 || j >= ex.length) return;
  [ex[idx], ex[j]] = [ex[j], ex[idx]];
  renderMapEditor();
}

async function addNode(mid) {
  const raw = await askText("ID nowego węzła (np. hangar_b):");
  if (!raw) return;
  const id = raw.trim().toLowerCase().replace(/\s+/g, "_");
  const m = db.maps[mid];
  if (m.nodes[id]) return showToast("Węzeł o takim ID już istnieje.", true);
  m.nodes[id] = { name: "Nowy węzeł", desc: "", exits: [] };
  renderMapsList();
}

async function deleteNode(mid, nid) {
  const m = db.maps[mid];
  if (!await askConfirm(`Usunąć węzeł ${m.nodes[nid]?.name} (${nid})? Wyjścia prowadzące do niego też znikną.`)) return;
  delete m.nodes[nid];
  Object.values(m.nodes).forEach((n) => {
    if (n.exits) n.exits = n.exits.filter((e) => e !== nid);
  });
  if (m.start === nid) showToast("Uwaga: to był węzeł startowy. Ustaw nowy węzeł startowy.", true);
  renderMapsList();
}

async function deleteMap(mid) {
  if (!await askConfirm(`Usunąć mapę ${db.maps[mid].name} (${mid})?`)) return;
  delete db.maps[mid];
  selectedMapId = null;
  renderMapsList();
}

// === SEKCJA: EDYTOR ZLECEŃ (v27) ===
function getQuest(id) {
  return db.quests.find((q) => q.id === id);
}

function firstNodeOf(mapId) {
  return Object.keys(db.maps[mapId]?.nodes || {})[0] || "";
}

function renderQuestsList() {
  const el = document.getElementById("quests-list");
  el.innerHTML = "";
  if (!selectedQuestId && db.quests.length) selectedQuestId = db.quests[0].id;
  db.quests.forEach((q) => {
    const tr = db.traders.find((t) => t.id === q.traderId);
    const btn = document.createElement("button");
    btn.className = `list-item-btn ${q.id === selectedQuestId ? "selected" : ""}`;
    btn.onclick = () => {
      selectedQuestId = q.id;
      renderQuestsList();
    };
    btn.innerHTML = `<span>${escHtml(q.title)}</span><span style="color:#a78bfa; font-size:0.75rem;">${escHtml(tr ? tr.name : q.traderId)} · T${q.tier ?? 0}${q.isMain ? " · GŁÓWNE" : ""}${q.task ? " · minigra" : ""}</span>`;
    el.appendChild(btn);
  });
  renderQuestEditor();
}

function renderQuestEditor() {
  const ed = document.getElementById("quest-editor-content");
  const q = getQuest(selectedQuestId);
  if (!q) {
    ed.innerHTML = `<p class="empty-hint">Wybierz zlecenie z listy lub stwórz nowe.</p>`;
    return;
  }
  const id = q.id;
  const opt = (v, label, sel) => `<option value="${escHtml(v)}" ${v === sel ? "selected" : ""}>${escHtml(label)}</option>`;
  const itemSelect = (sel, onchange, empty) =>
    `<select onchange="${onchange}">${empty ? `<option value="">${empty}</option>` : ""}${Object.keys(db.items)
      .sort()
      .map((k) => opt(k, `${db.items[k].name} (${k})`, sel))
      .join("")}</select>`;

  const traderSel = `<select onchange="setQuest('${id}','traderId',this.value); renderQuestsList();">${db.traders
    .map((t) => opt(t.id, t.name, q.traderId))
    .join("")}</select>`;
  const enemySel = `<select onchange="setQuest('${id}','kill',this.value || undefined); renderQuestEditor();"><option value="">— brak —</option>${Object.keys(db.enemies)
    .map((k) => opt(k, `${db.enemies[k].name} (${k})`, q.kill))
    .join("")}</select>`;

  const reqRows =
    (q.req || [])
      .map(
        (r, i) => `
      <div class="req-row">
        ${itemSelect(r.id, `setQuestReq('${id}',${i},'id',this.value)`)}
        <input type="number" min="1" value="${r.qty}" onchange="setQuestReq('${id}',${i},'qty',Number(this.value))" />
        <button class="danger-btn sm-btn" onclick="removeQuestReq('${id}',${i})">Usuń</button>
      </div>`
      )
      .join("") || `<p class="hint">Brak wymagań.</p>`;

  const rw = q.reward || {};
  const rewardHtml = `
    <div class="form-grid">
      <div class="form-group"><label>Kredyty</label><input type="number" value="${rw.credits || 0}" onchange="setQuestReward('${id}','credits',Number(this.value))" /></div>
      <div class="form-group"><label>XP</label><input type="number" value="${rw.xp || 0}" onchange="setQuestReward('${id}','xp',Number(this.value))" /></div>
      <div class="form-group"><label>Reputacja</label><input type="number" value="${rw.rep || 0}" onchange="setQuestReward('${id}','rep',Number(this.value))" /></div>
      <div class="form-group"><label>Przedmiot nagrody</label>${itemSelect(rw.item, `setQuestReward('${id}','item',this.value)`, "— brak —")}</div>
      <div class="form-group"><label>Ilość przedmiotu</label><input type="number" min="1" value="${rw.itemQty || 1}" onchange="setQuestReward('${id}','itemQty',Number(this.value))" /></div>
    </div>`;

  const t = q.task || null;
  const taskType = t ? t.type : "none";
  const taskNames = { none: "— brak (zwykłe zlecenie)", terminal: "Terminal", hack: "Włamanie do zamka", wires: "Przewody", memory: "Pamięć (sekwencja)" };
  const mapOpts = Object.keys(db.maps)
    .map((k) => opt(k, db.maps[k].name, t?.map))
    .join("");
  const nodeOpts = t
    ? Object.keys(db.maps[t.map]?.nodes || {})
        .map((n) => opt(n, `${db.maps[t.map].nodes[n].name} (${n})`, t.node))
        .join("")
    : "";
  const taskHtml = `
    <div class="form-grid">
      <div class="form-group"><label>Typ minigry</label>
        <select onchange="setQuestTaskType('${id}',this.value)">
          ${Object.keys(taskNames).map((v) => opt(v, taskNames[v], taskType)).join("")}
        </select></div>
      ${
        t
          ? `
      <div class="form-group"><label>Etykieta przycisku</label>
        <input type="text" value="${escHtml(t.label || "")}" onchange="setQuestTask('${id}','label',this.value)" /></div>
      <div class="form-group"><label>Mapa</label>
        <select onchange="setQuestTask('${id}','map',this.value)">${mapOpts}</select></div>
      <div class="form-group"><label>Lokacja (węzeł)</label>
        <select onchange="setQuestTask('${id}','node',this.value)">${nodeOpts}</select></div>
      ${
        t.type === "terminal"
          ? `<div class="form-group"><label>Klucz dostępu</label>
        <input type="text" value="${escHtml(t.key || "")}" onchange="setQuestTask('${id}','key',this.value)" /></div>`
          : ""
      }
      <div class="form-group full-width"><label>Tekst intelu (w logu)</label>
        <textarea onchange="setQuestTask('${id}','intel',this.value)">${escHtml(t.intel || "")}</textarea></div>`
          : ""
      }
    </div>`;

  ed.innerHTML = `
    <h2 style="margin:0 0 16px 0; font-size:1.4rem; color:#f8fafc;">Zlecenie: ${escHtml(q.title)} <small style="color:#a78bfa;">(${id})</small></h2>
    <div class="form-grid">
      <div class="form-group"><label>Tytuł</label>
        <input type="text" value="${escHtml(q.title)}" onchange="setQuest('${id}','title',this.value); renderQuestsList();" /></div>
      <div class="form-group"><label>Handlarz</label>${traderSel}</div>
      <div class="form-group"><label>Poziom handlarza (tier)</label>
        <input type="number" min="0" value="${q.tier ?? 0}" onchange="setQuest('${id}','tier',Number(this.value)); renderQuestsList();" /></div>
      <div class="form-group"><label>Etap (liczba albo "final")</label>
        <input type="text" value="${escHtml(q.phase)}" onchange="setQuestPhase('${id}',this.value)" /></div>
      <div class="form-group"><label>Zadanie główne</label>
        <label class="chk-line"><input type="checkbox" ${q.isMain ? "checked" : ""} onchange="setQuest('${id}','isMain',this.checked); renderQuestsList();" /> Główne</label></div>
      <div class="form-group"><label>Wymagany zabity wróg (kill)</label>${enemySel}</div>
      <div class="form-group full-width"><label>Opis</label>
        <textarea onchange="setQuest('${id}','desc',this.value)">${escHtml(q.desc || "")}</textarea></div>
    </div>
    <h3 style="margin:18px 0 8px 0; color:#38bdf8;">Wymagane przedmioty</h3>
    <div class="req-list">${reqRows}</div>
    <button class="sm-btn" onclick="addQuestReq('${id}')">+ Dodaj wymaganie</button>
    <h3 style="margin:18px 0 8px 0; color:#38bdf8;">Nagroda</h3>
    ${rewardHtml}
    <h3 style="margin:18px 0 8px 0; color:#38bdf8;">Minigra zadania</h3>
    ${taskHtml}
    <div style="margin-top:20px;"><button class="danger-btn" onclick="deleteQuest('${id}')">Usuń zlecenie</button></div>
  `;
}

function setQuest(id, field, value) {
  const q = getQuest(id);
  if (!q) return;
  if (value === undefined) delete q[field];
  else q[field] = value;
}

function setQuestPhase(id, text) {
  const v = text.trim();
  setQuest(id, "phase", v !== "" && !isNaN(Number(v)) ? Number(v) : v);
}

function setQuestReq(id, idx, field, value) {
  const q = getQuest(id);
  q.req[idx][field] = field === "qty" ? Number(value) : value;
}

function addQuestReq(id) {
  const q = getQuest(id);
  q.req = q.req || [];
  q.req.push({ id: Object.keys(db.items)[0], qty: 1 });
  renderQuestEditor();
}

function removeQuestReq(id, idx) {
  getQuest(id).req.splice(idx, 1);
  renderQuestEditor();
}

function setQuestReward(id, field, value) {
  const q = getQuest(id);
  q.reward = q.reward || {};
  if (value === "" || value === undefined) delete q.reward[field];
  else q.reward[field] = value;
}

function setQuestTaskType(id, type) {
  const q = getQuest(id);
  if (type === "none") {
    delete q.task;
  } else if (q.task) {
    q.task.type = type;
    if (type === "terminal") q.task.key = q.task.key || "K1";
    else delete q.task.key;
  } else {
    const mapId = Object.keys(db.maps)[0] || "";
    q.task = { type, label: "Wykonaj minigrę", map: mapId, node: firstNodeOf(mapId), intel: "" };
    if (type === "terminal") q.task.key = "K1";
  }
  renderQuestEditor();
}

function setQuestTask(id, field, value) {
  const q = getQuest(id);
  if (!q.task) return;
  q.task[field] = value;
  if (field === "map") q.task.node = firstNodeOf(value);
  renderQuestEditor();
}

async function addNewQuest() {
  const raw = await askText("ID nowego zlecenia (np. q2_t3_nowe):");
  if (!raw) return;
  const id = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (getQuest(id)) return showToast("Zlecenie o takim ID już istnieje.", true);
  db.quests.push({
    id,
    traderId: db.traders[0]?.id || "",
    tier: 0,
    phase: 1,
    title: "Nowe zlecenie",
    desc: "",
    req: [],
    reward: { credits: 100, xp: 20, rep: 10 },
  });
  selectedQuestId = id;
  renderQuestsList();
}

async function deleteQuest(id) {
  if (!await askConfirm(`Usunąć zlecenie ${id}?`)) return;
  db.quests = db.quests.filter((q) => q.id !== id);
  selectedQuestId = null;
  renderQuestsList();
}

// === SEKCJA: EDYTOR TABEL ŁUPU (v27) ===
function renderLootList() {
  const el = document.getElementById("loot-list");
  el.innerHTML = "";
  const keys = Object.keys(db.loot);
  if (!selectedLootId && keys.length) selectedLootId = keys[0];
  keys.forEach((k) => {
    const btn = document.createElement("button");
    btn.className = `list-item-btn ${k === selectedLootId ? "selected" : ""}`;
    btn.onclick = () => {
      selectedLootId = k;
      renderLootList();
    };
    btn.innerHTML = `<span>${escHtml(k)}</span><span style="color:#a78bfa; font-size:0.75rem;">${db.loot[k].length} wpisów</span>`;
    el.appendChild(btn);
  });
  renderLootEditor();
}

function renderLootEditor() {
  const ed = document.getElementById("loot-editor-content");
  const t = selectedLootId;
  const rows = db.loot[t];
  if (!t || !rows) {
    ed.innerHTML = `<p class="empty-hint">Wybierz tabelę łupu z listy lub stwórz nową.</p>`;
    return;
  }
  const itemSel = (sel, i) =>
    `<select onchange="setLootRow('${t}',${i},'id',this.value)">${Object.keys(db.items)
      .sort()
      .map((k) => `<option value="${k}" ${k === sel ? "selected" : ""}>${escHtml(db.items[k].name)} (${k})</option>`)
      .join("")}</select>`;
  ed.innerHTML = `
    <h2 style="margin:0 0 16px 0; font-size:1.4rem; color:#f8fafc;">Tabela łupu: ${escHtml(t)}</h2>
    <p class="hint">w = waga losowania (większa = częściej). min / max = ilość przy wylosowaniu.</p>
    <div class="req-list">
      ${rows
        .map(
          (r, i) => `
        <div class="loot-row">
          ${itemSel(r.id, i)}
          <label>w <input type="number" min="0" value="${r.w}" onchange="setLootRow('${t}',${i},'w',Number(this.value))" /></label>
          <label>min <input type="number" min="1" value="${r.min}" onchange="setLootRow('${t}',${i},'min',Number(this.value))" /></label>
          <label>max <input type="number" min="1" value="${r.max}" onchange="setLootRow('${t}',${i},'max',Number(this.value))" /></label>
          <button class="danger-btn sm-btn" onclick="removeLootRow('${t}',${i})">Usuń</button>
        </div>`
        )
        .join("") || `<p class="hint">Pusta tabela.</p>`}
    </div>
    <button class="sm-btn" onclick="addLootRow('${t}')">+ Dodaj wpis</button>
    <div style="margin-top:20px;"><button class="danger-btn" onclick="deleteLootTable('${t}')">Usuń tabelę</button></div>
  `;
}

function setLootRow(t, i, field, value) {
  db.loot[t][i][field] = value;
}

function addLootRow(t) {
  db.loot[t].push({ id: Object.keys(db.items)[0], w: 10, min: 1, max: 1 });
  renderLootEditor();
}

function removeLootRow(t, i) {
  db.loot[t].splice(i, 1);
  renderLootEditor();
}

async function addNewLootTable() {
  const raw = await askText("Nazwa nowej tabeli łupu (np. boss_hangar):");
  if (!raw) return;
  const id = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (db.loot[id]) return showToast("Tabela o takiej nazwie już istnieje.", true);
  db.loot[id] = [];
  selectedLootId = id;
  renderLootList();
}

async function deleteLootTable(t) {
  const used = Object.values(db.maps).flatMap((m) => Object.values(m.nodes || {})).filter((n) => n.loot?.table === t).length;
  if (!await askConfirm(`Usunąć tabelę ${t}?${used ? ` Używa jej ${used} węzłów – one stracą łup.` : ""}`)) return;
  delete db.loot[t];
  selectedLootId = null;
  renderLootList();
}
