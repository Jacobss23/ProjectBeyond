## Aktualizacja v.1.80.3 (karty dostępu, zamknięte skarbce)

- v.1.80.3: celność end-game broni podniesiona (działo Ares 0.86, Helios 0.93, Caelum-X 0.97, Ostrze Próżni 0.98). Kopuła Tytana: szansa na wroga w każdym węźle ×0.4 (pierwsza mapa). Nie zmieniano dmg.
- v.1.80.2: 5x P na Marsie ustawia moduł Stash na maksymalny poziom (`maxLevel`, czyli 14x24).
- v.1.80.1: każda broń ma pole `caliber` (z amunicji; broń biała `—`), kaliber widoczny w info o broni (`grid.js`). Działo szynowe Ares używa `ammo_rail` (nowa amunicja). Skarbiec Kopuły zawiera 2 stosy `ammo_rail` (po 10). Każdy skarbiec daje 3 losowe łupy z `vault_rare` (bez broni i pancerza).

- Nowe pomieszczenia z zamkiem: `vault_dome` (Kopuła Tytana, `apartments`), `vault_vega` (Wega-7, `medbay`), `vault_helix` (Fabryka Helix, `storage`). Pola węzła: `keyLock` (id klucza), `keyLabel`, `guaranteed` (1 sztuka), `codeChance: 0.15` (kod dostępu), `loot` (tabela `vault_rare`).
- Karty: `card_dome`, `card_vega`, `card_helix` (typ `tool`, `keyFor`). Nie są w tabelach łupu ani w sklepie z zakupem. Zdobywa się je rzadko w łupie (wagi 1-2 w tabelach tech, military, boss_archive, titan_brute, titan_military) lub przez wymianę (`barter` u tradera: Jax -> card_dome, Thorne -> card_vega, Val -> card_helix; tier 1).
- Otwieranie: przycisk `[K]` w pomieszczeniu (`useKeycard` w raid.js) zużywa kartę z plecaka. Stan zapisany w `save.openedRooms[keyLock]`, więc pomieszczenie zostaje otwarte w kolejnych rajdach.
- Przeszukanie zamkniętego pomieszczenia jest zablokowane (`roomLocked` w `search()`).
- Dokumentacja umiejętności `doc_skill` (`skillDoc: 3`): `applySkillDoc` w save.js dodaje 3 poziomy losowej umiejętności poniżej maksimum (w schronie i na rajdzie).
- Nowe przedmioty końcowe: `rail_cannon` (heavy, max 1), `armor_singularity` (def 12, max 1), `access_code`.
- Test dev: `testSkipMars` (5x P na Marsie) dodaje `card_dome`.
- Numer wersji w lewym dolnym rogu: `#build-version` na index, hideout, raid, creator (styl w css/style.css).
- Wymiana: przetestowana w Chromium (karta w magazynie, surowce zużyte). Wejście do skarbca w rajdzie NIE przetestowane end-to-end.

## Aktualizacja v.1.79.5 (odpoczynek: jedzenie i picie)

- Baza: kod z paczki `v.1.79.4 github-push` (zawiera poprawkę `questItemHeld`, czyli zlecenia z przedmiotami fabularnymi liczone z `questCarry`; zachowana).
- **Odpoczynek w schronie** (`rest()` w `js/hideout.js`): jedzenie i picie naładowują się do **70 w skali 0-100**, czyli **35/50 na pasku** (pasek pokazuje połowę wartości). Wyższe wartości nie są obniżane (`Math.max`).
- Wcześniej floor był 35 / 30 w skali 0-100 (co dawało 17/50 i 15/50 na pasku).
- Test: Playwright, zapis testowy, `rest()` z 5/10 daje 70/70; z 90/95 zostaje 90/95.
- Uwaga o numeracji: ta paczka jest od 1.79.4, a nie od 1.88.x z innego katalogu roboczego. Jeśli wersje mają być jedną linią, trzeba to ujednolicić.

# HANDOFF — Space Tarkov RPG

> **Aktualna wersja:** v.1.79.4 (poprawka questa Patrol Zachodni, sekcja 15.11). Poprzednio v.1.79.2 rozmowy z handlarzem tylko o zleceniach głównych, bez nazw zleceń (poprzednio v.1.79.1) (szczegóły zmian: sekcja 15.10).
>
> **Status:** działający prototyp po serii zmian: niezawodne sterowanie `R` w rajdzie, wymuszony tutorial schronu po pierwszej misji, trzeci moduł startowy `Komunikacja`, znaczniki węzłów, „Przyjmij wszystkie zlecenia”, filtrowanie questów po odblokowanych handlarzach, sloty ekwipunku i suwaki ilości u handlarzy.
>
> **Dokument siostrzany:** [`SCHEMA.md`](./SCHEMA.md) — pełny schemat zapisu, danych i stanu runtime.
>
> **Katalog projektu:** `/Users/user/space-tarkov-rpg`  
> **Git:** brak repozytorium. Zmiany są lokalne i niezacommitowane.

---

## 1. TL;DR dla następnego AI

1. To **statyczna gra przeglądarkowa** HTML + CSS + vanilla JS. Brak Reacta w kodzie gry, brak importów ES, brak backendu.
2. Każdy ekran to osobny plik HTML, który ładuje globalne skrypty z `data/` i `js/`.
3. Zapis gry żyje w `localStorage` (`saveSlot_1..3`, `currentSlot`) i jest normalizowany przez `normalizeSave()` w `js/save.js`.
4. **Nie omijaj `loadSave()`** — on wykonuje migracje i jednorazowe granty.
5. Najważniejsze pliki: `js/save.js`, `js/hideout.js`, `js/raid.js`, `js/grid.js`, `data/maps.js`, `data/traders.js`, `data/items.js`, `data/ship.js`.
6. Tutorial schronu startuje dopiero po **udanej** pierwszej misji (`tutorialDone = true`) i blokuje pełny rajd do zaliczenia wszystkich kroków poza `launch`.
7. Cel tutorialu to zawsze **Crafting albo Medstation**, nigdy moduł wybrany na start i nigdy inny moduł.
8. `R` w rajdzie jest przechwytywane w fazie **capture**; `Shift+R` zawsze bierze wszystko.
9. Handlarze i questy są filtrowani przez poziom modułu `Komunikacja`.
10. Przed zmianą przeczytaj sekcję **Invarianty** i **Znane problemy**.

---

## 2. Uruchomienie

### Najprościej (bez instalacji)

```bash
cd /Users/user/space-tarkov-rpg
python3 -m http.server 8000
```

Otwórz `http://localhost:8000/`.

### Przez Vite

```bash
npm install
npm run dev
```

`package.json` pochodzi z szablonu AI Studio/React i nie opisuje realnie tej gry. `npm run lint` to `tsc --noEmit`; przy braku `node_modules` nie zadziała. Nie traktuj tego pliku jako źródła prawdy o architekturze.

### Brak testów

Nie ma testów automatycznych ani konfiguracji CI. Weryfikacja to `node --check` + ręczny smoke test w przeglądarce (sekcja 16).

---

## 3. Mapa projektu

```
/
├─ index.html              menu główne + wybór slotu
├─ creator.html            kreator postaci (4 kroki)
├─ raid.html               ekran rajdu (walka, loot, eksploracja)
├─ hideout.html            schron (ekwipunek, handlarze, questy, moduły)
├─ tutorial-raid.html      przekierowanie do raid.html?map=tutorial
├─ admin.html              panel edycji danych gry
├─ css/style.css           cały styl gry
├─ data/
│  ├─ items.js             ITEMS, KITS, RECIPES
│  ├─ maps.js              LOOT, MAPS
│  ├─ enemies.js           ENEMIES
│  ├─ traders.js           TRADERS, QUESTS
│  ├─ ship.js              SHIP_MODULES
│  ├─ skills.js            SKILLS
│  └─ perks.js             HIDDEN_STATS_DEF, DEFAULT_PERKS, PERKS
├─ js/
│  ├─ save.js              zapis, normalizacja, ekwipunek, statystyki, XP
│  ├─ grid.js              siatka Tarkov, drag & drop, rotacja, quick move
│  ├─ hideout.js           logika schronu i tutorialu schronu
│  ├─ raid.js              logika rajdu, walki, lootu, percepcji
│  ├─ player.js            kreator postaci
│  ├─ main.js              menu główne i wybór slotu
│  ├─ ui.js                showScreen, edgeGlow, termLog
│  └─ admin.js             edytor danych
├─ public/                 archiwalne assety i stary summary JSON
└─ extracted_game/         archiwum starej wersji — NIE EDYTUJ
```

`public/assets/aistudio/space-tarkov-rpg_c7549bf3.zip` i `extracted_game/` to archiwa. Runtime ich nie używa.

---

## 4. Architektura i kolejność ładowania

### Model

- **Multi-page app**: przejścia przez `window.location.href`.
- **Globalne zmienne**: `ITEMS`, `MAPS`, `QUESTS`, `SHIP_MODULES`, `PERKS`, `save`, `raid`, `st` itd.
- **Brak bundlera w runtime**: każdy HTML jawnie ładować musi wszystkie potrzebne skrypty.
- **Stan ekranu**: divy `.screen`, przełączane przez `showScreen(id)` z `js/ui.js`.
- **Przejścia**: `showScreen` blokuje się na ~400 ms przez `isAnimating`; `goTo()` w schronie dodatkowo odświeża UI po 450 ms.
- **Terminal**: `termLog(text, cls)` z efektem pisania; klasy `intro`, `tip`, `hit`, `warn`, `danger`, `scene`, `miss`, `enemy`.
- **Glow**: `edgeGlow(type)` — `search`, `loot`, `danger`, `hit`, `hurt`, `heal`, `extract`, `tech`, `level`.

### Kolejność skryptów

| Ekran | Kolejność |
|---|---|
| `index.html` | `ui.js`, `main.js` |
| `creator.html` | `data/skills.js`, `data/items.js`, `data/ship.js`, `data/perks.js`, `js/grid.js`, `js/save.js`, `js/ui.js`, `js/player.js` |
| `hideout.html` | `data/skills.js`, `data/items.js`, `data/ship.js`, `data/traders.js`, `data/maps.js`, `data/perks.js`, `js/grid.js`, `js/save.js`, `js/ui.js`, `js/hideout.js` |
| `raid.html` | `data/skills.js`, `data/body.js` **(brak pliku → 404)**, `data/items.js`, `data/ship.js`, `data/enemies.js`, `data/traders.js`, `data/maps.js`, `data/perks.js`, `js/grid.js`, `js/save.js`, `js/ui.js`, `js/raid.js` |
| `admin.html` | `data/skills.js`, `data/items.js`, `data/enemies.js`, `data/traders.js`, `data/maps.js`, `data/ship.js`, `data/perks.js`, `js/save.js`, `js/admin.js` |

**Konsekwencje:**

- `save.js` potrzebuje `ITEMS` i `KITS` przy normalizacji → muszą być wcześniej.
- `raid.js` potrzebuje `QUESTS` → `data/traders.js` musi być dołączony do `raid.html` (już jest).
- `raid.js` używa `FISTS`, zdefiniowanego w `save.js`.
- `hideout.js` potrzebuje `QUESTS` i `TRADERS` z `data/traders.js`.
- Brak `data/body.js` powoduje 404, ale nie zatrzymuje kolejnych skryptów.

### Nadpisania z panelu admina

`js/save.js` przy starcie czyta `localStorage.gameData_overrides` i mutuje globalne bazy:

```js
{
  items: {...},
  enemies: {...},
  traders: [...],
  maps: {...},
  skills: {...},
  perks: {...}
}
```

`traders` jest nadpisywane przez `TRADERS.length = 0; push(...)`; reszta przez `Object.assign`. Oznacza to, że admin może zmienić zachowanie gry bez edycji plików. Reset: usuń `gameData_overrides`.

---

## 5. Przepływ gry end-to-end

```
index.html
  └─ loadSlot(slot)
       ├─ brak zapisu → creator.html?slot=N
       └─ zapis → hideout.html

creator.html
  └─ finishCreation()
       └─ normalizeSave(...) → localStorage
            └─ raid.html?map=tutorial

raid.html?map=tutorial
  ├─ śmierć → nic nie zapisano, „Spróbuj ponownie”
  └─ ewakuacja → tutorialDone = true → hideout.html

hideout.html
  ├─ hideoutTutorial aktywny
  │    ├─ krok po kroku: equip → accept → turnin → buy → sell
  │    │                 → upgrade → skills → hydro → rest → launch
  │    └─ startRaid() blokowany do zaliczenia wszystkich poza launch
  └─ po tutorialu → pełne rajdy (titan_dome; vega po Silniki 1)
```

### 5.1. Nowa gra

`creator.html` zbiera:

```js
ccData = { name, gender, planet, traits, points, kit, module };
```

`finishCreation()`:

1. waliduje `kit` i `module`,
2. wywołuje `normalizeSave({ ...ccData, hp: 100, maxHp: 100, credits: 500 })`,
3. zapisuje `saveSlot_${slot}` i `currentSlot`,
4. przekierowuje do `raid.html?map=tutorial`.

Wartości modułu w kreatorze:

- `Medyczny` → legacy nazwa, mapowana na `Medstation`,
- `Warsztat` → legacy nazwa, mapowana na `Crafting`,
- `Komunikacja` → nowy trzeci wybór, od razu poziom 1.

### 5.2. Pierwsza misja (tutorial na Marsie)

- `MAPS.tutorial`.
- Cel: znaleźć instrukcję, 3 części silnika, materiały na moduł tutorialu, materiały na `q0_supplies`, naprawić silnik, wystartować.
- Śmierć: `tutorialFail = true` → **żadnych zmian w zapisie**, przycisk „Spróbuj ponownie”.
- Sukces: `tutorialDone = true`; łup (poza przedmiotami `quest`) trafia do magazynu; brakujące materiały są dogenerowywane.
- `MAPS.tutorial` znika z listy rajdów po `tutorialDone`.

### 5.3. Tutorial schronu

Patrz sekcja 6 — to najbardziej złożony fragment.

### 5.4. Pełny rajd

- Po tutorialu lista rajdów pokazuje wszystkie mapy bez `tutorial: true`.
- `titan_dome` dostępny od razu.
- `vega` wymaga `Silniki >= 1`.
- Śmierć: `deaths++`, plecak startowy przepada, gracz wraca do schronu z 50% HP.
- Ewakuacja: `raids++`, `lastLoadout` zapisany, łup (poza quest items) do magazynu, `save.hp = raid.hp`.

---

## 6. Tutorial schronu — kompletny opis

### 6.1. Kiedy startuje

`hideoutTutorial` jest tworzony w `normalizeSave()` tylko wtedy, gdy:

```js
s.tutorialDone === true && !s.hideoutTutorial
```

To oznacza:

- po pierwszym udanym rajdzie treningowym,
- także dla **starych zapisów**, które mają już `tutorialDone: true` — celowo, żeby wszyscy przeszli nowy tutorial,
- nie startuje, dopóki gracz nie ukończy pierwszej misji.

Stan początkowy:

```js
{
  started: true,
  done: false,
  completed: {},
  startedAt: Date.now(),
  grantGiven: false,
  startSupplies: false
}
```

### 6.2. Jednorazowe granty

**A. `normalizeSave()` — fundusz:**

- `+250 kr`,
- `+1 ration` do magazynu,
- `food/water = max(1, ...)`,
- `grantGiven = true`, `funds = 250`.

**B. `ensureTutorialStartSupplies()` — `hideout.js`, przy `init()`:**

Dla celu tutorialu oraz questa `q0_supplies`:

- sumuje wymagane materiały,
- dodaje `+1` szt. każdego materiału jako zapas bezpieczeństwa,
- uzupełnia brakujące w magazynie/plecaku,
- jeśli brak pancerza — dodaje `armor_damaged`,
- jeśli brak broni białej — dodaje `combat_knife`,
- ustawia `startSupplies = true`.

**C. `grantTutorialCompletionSupplies()` — `raid.js`, po sukcesie pierwszej misji:**

- liczy to samo, ale **tylko z magazynu** (łup jest już przeniesiony),
- dogenerowuje brakujące materiały celu i `q0_supplies` + `1` zapasu,
- dodaje pancerz, jeśli nadal brak,
- zapisuje listę w `raid.tutorialSupplies`, którą widać na ekranie końcowym.

### 6.3. Cel modułu tutorialu

Funkcje w `js/save.js`:

```js
function starterModuleId(m) {
  if (m === "Warsztat") return "Crafting";
  if (m === "Medyczny") return "Medstation";
  return m;
}

function tutorialTargetModule(s) {
  const chosen = starterModuleId(s.module);

  if (
    (s.tutorialModule === "Crafting" || s.tutorialModule === "Medstation") &&
    s.tutorialModule !== chosen
  ) return s.tutorialModule;

  if (chosen === "Crafting") return "Medstation";
  if (chosen === "Medstation") return "Crafting";

  const craftingLvl = s.ship?.modules?.Crafting?.level || 0;
  return craftingLvl > 0 ? "Medstation" : "Crafting";
}
```

**Reguła invariantu:**

- Cel jest zawsze `Crafting` albo `Medstation`.
- Cel nigdy nie jest modułem wybranym na start.
- Wybór `Komunikacja` → cel `Crafting` (bo `Crafting.level === 0`).
- `tutorialModule` jest zapisywany w save i stabilny między reloadami, o ile pozostaje poprawny.

### 6.4. Kroki tutorialu

Definicja w `js/hideout.js`:

| # | `id` | Etykieta | Docelowy ekran | Jak zaliczany |
|---|---|---|---|---|
| 1 | `equip` | Wejdź w Ekwipunek i ubierz pancerz oraz broń | `hub-inv` | automatycznie: `hasRaidEquipment(save)` |
| 2 | `accept` | Przyjmij zlecenie u dostępnego handlarza | `hub-quests` | automatycznie: dowolny quest ma stan `active` |
| 3 | `turnin` | Oddaj ukończone zlecenie i odbierz nagrodę | `hub-quests` | automatycznie: dowolny quest ma stan `completed` |
| 4 | `buy` | Kup dowolny przedmiot u handlarza | `hub-trader` | `tutMark("buy")` w `buy()` |
| 5 | `sell` | Sprzedaj dowolny przedmiot u handlarza | `hub-trader` | `tutMark("sell")` w `sell()` |
| 6 | `upgrade` | Ulepsz wskazany moduł bazy do poziomu 1 | `hub-ship` | automatycznie: `moduleLevel(save, req.id) >= req.level` lub `tutMark("upgrade")` |
| 7 | `skills` | Odwiedź ekran Umiejętności | `hub-skills` | `goTo("hub-skills")` |
| 8 | `hydro` | Odwiedź Hydroponikę i zbierz plony | `hub-hydro` | `harvestHydro()` lub wejście przy poziomie 0 |
| 9 | `rest` | Odpocznij w schronie | `hub-main` | `rest()` — także gdy nie ma potrzeby odpoczynku |
| 10 | `launch` | Wyrusz na pierwszy pełny rajd | `hub-raid` | `startRaid()` po zaliczeniu 1–9 |

### 6.5. Mechanika banera

- `renderTutorial()` renderuje baner `#tutorial-banner`.
- `tutAutoCheck()` przy każdym renderze sprawdza warunki automatyczne.
- `currentTutStep()` zwraca pierwszy niezaznaczony krok.
- `tutMark(id)`:
  - ignoruje, gdy tutorial nieaktywny lub krok już zaliczony,
  - ustawia `completed[id] = true`,
  - loguje `[TUTORIAL] Zaliczono: ...`,
  - `edgeGlow("level")`,
  - jeśli wszystkie kroki poza `launch` są gotowe — komunikat o odblokowaniu rajdu,
  - `writeSave(save)` + `renderTutorial()`.
- Baner podświetla przycisk docelowy klasą `.tutorial-focus`.
- Przycisk „Przejdź” wywołuje `goTo(step.target)`.

### 6.6. Blokada rajdu

W `hideout.js` → `startRaid(mapId)`:

```js
const t = save.hideoutTutorial;
if (t && !t.done) {
  tutAutoCheck();
  const pending = HIDEOUT_TUTORIAL_STEPS.filter(
    (s) => s.id !== "launch" && !t.completed[s.id]
  );
  if (pending.length) {
    const step = pending[0];
    say(`[TUTORIAL] Najpierw ukończ krok: ${tutorialStepLabel(step)}`, "warn");
    goTo(step.target);
    return;
  }
  t.completed.launch = true;
  t.done = true;
  t.finishedAt = Date.now();
  writeSave(save);
}
```

**Uwaga:** `launch` i `done` są ustawiane **przed** sprawdzeniem pustego plecaka i niskiego HP. Jeśli gracz anuluje `confirm`, tutorial jest już oznaczony jako ukończony, mimo że nie wyruszył. To znany problem — patrz sekcja 17.

### 6.7. Ochrona przed sprzedażą

`tutorialBlocksSale(id)` blokuje podczas aktywnego tutorialu:

- wszystkie przedmioty typu `armor` i `weapon`,
- materiały wymagane na cel tutorialu,
- materiały `q0_supplies`, dopóki quest nie jest `completed`.

Dzięki temu gracz nie może zepsuć sobie tutorialu. Sprzedać można m.in. rację, amunicję, bandaże.

### 6.8. Dofinansowanie ulepszenia

W `upgradeModule()`:

- jeśli brakuje kredytów i moduł jest celem tutorialu, gra dodaje różnicę i loguje `[TUTORIAL] Dofinansowanie szkoleniowe`,
- materiały nadal muszą być dostępne,
- liczone są z magazynu **i** plecaka (`countEverywhere` / `consumeEverywhere`).

### 6.9. Materiały misji tutorialowej

`MAPS.tutorial.tutorialModuleLoot`:

| Cel | ship | dunes | wreck | ravine | depot | Suma |
|---|---|---|---|---|---|---|
| Crafting | scrap 1 | scrap 2 | wires 1 | scrap 2 | cloth 2, wires 1 | scrap 5, wires 2, cloth 2 |
| Medstation | scrap 1 | cloth 2 | wires 1 | cloth 2 | cloth 2, wires 1 | scrap 1, cloth 6, wires 2 |

Wymagania:

- `Crafting` lvl 1: `scrap 4`, `wires 2`.
- `Medstation` lvl 1: `cloth 4`, `wires 2`.
- `q0_supplies`: `cloth 2`, `scrap 1`.

Sumy są dokładnie wystarczające. `tutorialCommonLoot.ravine` gwarantuje `armor_damaged x1`.

---

## 7. Ekwipunek i sloty postaci

### 7.1. Sloty

Definicja w `js/save.js` → `EQUIP_SLOT_DEFS`:

| Slot | Nazwa | Akceptuje | Warunek |
|---|---|---|---|
| `armor` | Pancerz | `type === "armor"` | — |
| `ranged` | Broń palna 1 | `type === "weapon" && ammo` | — |
| `ranged2` | Broń palna 2 (kabura) | `type === "weapon" && ammo` | `gear` musi zawierać `holster` |
| `melee` | Broń biała | `type === "weapon" && !ammo` | — |
| `gear` | Akcesorium | `type === "gear"` lub `holster` | nie można założyć innego geara, gdy `ranged2` zajęty |

### 7.2. Zasady kabury

- `hasHolster(s)` sprawdza `s.equipped.gear?.id === "holster"`.
- `ranged2` bez kabury jest czyszczony w `normalizeSave`.
- `canEquip` blokuje `ranged2` bez kabury.
- `canEquip` blokuje założenie innego `gear`, gdy `ranged2` jest zajęty.
- `unequipItem` blokuje zdjęcie kabury, gdy `ranged2` jest zajęty.
- `holster` jest w `ITEMS` i w stocku `trader4`.

### 7.3. Zakładanie i zdejmowanie

- `equipFromContainer(save, cont, inst, slot)` — preferowana ścieżka z UI:
  - waliduje slot,
  - sprawdza, czy stary przedmiot zmieści się po zwolnieniu miejsca,
  - usuwa nowy item z kontenera,
  - zakłada,
  - odkłada stary item do tego samego kontenera.
- `unequipItem(save, slot, save.stash)` — zdejmuje do magazynu.
- `equipItem(save, itemId, slot)` — prosty wariant bez kontenera; **nie odkłada starego przedmiotu**. Używaj tylko świadomie.
- `hasRaidEquipment(s)` = pancerz + (broń palna **lub** biała). To warunek kroku `equip`.

### 7.4. Walka a ekwipunek

- `getActiveWeapon()`:
  - `auto` → `bestWeapon(raid.bag)`,
  - `melee` → `equippedWeapon(save, "melee") || FISTS`,
  - `ranged` / `ranged2` → `equippedWeapon(save, slot) || FISTS`.
- Amunicja zużywana jest z `raid.bag`, nie z `save.equipped`.
- `equippedArmor(save) || bestArmor(raid.bag)` redukuje obrażenia wroga.
- Auto-walka blokuje zmianę broni do końca starcia (`raid.weaponLocked`).
- Zmiana `ranged → ranged2` kosztuje turę; zmiana na/białą lub z białej jest darmowa.

### 7.5. Ważna konsekwencja

`raid.bag` to klon `save.loadout`. Założone przedmioty (`save.equipped`) **nie są** kopiowane do plecaka i **przeżywają rajd oraz śmierć**. Komunikat po śmierci mówi o utracie całego zestawu, ale dotyczy to plecaka, nie slotów postaci. To znany problem projektowy — patrz sekcja 17.

---

## 8. Rajd — pełny przebieg

### 8.1. Inicjalizacja

`initRaid()` w `js/raid.js`:

```js
raid = {
  node: MAP.start,
  prevNode: null,
  hp: save.hp,
  bag: clone(save.loadout),
  ground: {},
  visited: {},
  searched: {},
  cleared: {},
  flags: {},
  moves: 0,
  kills: 0,
  xp: 0,
  enemy: null,
  listenMode: null,
  over: false,
  repairing: null,
  activeSlot: defaultActiveWeaponSlot(save),
  weaponLocked: false,
  weaponChoices: [],
  nodeShimmers: {},
  nodeSpawn: {},
  perceptionRolled: {},
  tutorialSupplies: [],
};
```

`activeSlot`:

- `ranged` jeśli założona broń palna 1,
- `melee` jeśli biała,
- `ranged2` jeśli kabura i broń w kaburze,
- `auto` w przeciwnym razie.

### 8.2. Ruch i węzły

- `move(id)` blokuje się przy wrogu, trybie nasłuchu, zakończeniu rajdu i naprawie.
- `tick()` zwiększa `moves`; po `MAP.storm` każde działanie zadaje `MAP.stormDmg`.
- `raid.prevNode = raid.node` przed wejściem do nowego węzła.
- `enterNode(id)`:
  - oznacza `visited`,
  - montuje siatkę ziemi dla węzła,
  - zadaje obrażenia od `hazard`,
  - rozstrzyga spawn wroga (raz),
  - może wejść w tryb nasłuchu albo walkę,
  - pre-rolluje percepcję dla sąsiadów,
  - renderuje.

### 8.3. Percepcja i czerwony znacznik

- `perceptionDetectChance()` = `0.1 + 0.4 * min(1, percepcja / 15)`.
- `effectiveEnemyChance(node)` = `max(0.05, chance * (1 - stealth * 0.01))`.
- `rollPerceptionForNode(nodeId)`:
  - raz na węzeł (`raid.perceptionRolled`),
  - spawn jest losowany raz (`raid.nodeSpawn`),
  - `nodeShimmers[nodeId] = true` **tylko** gdy spawn jest pewny i test percepcji się uda.
- UI w `renderActions`:
  - `raid.nodeShimmers[id] && !raid.cleared[id]` → klasa `.node-shimmer-danger` + `.node-danger-dot`,
  - tooltip: „Percepcja: 100% pewności wroga w tej lokacji”.

To realizuje wymóg „czerwony shimmer tylko przy gwarantowanym wrogu”.

### 8.4. Znacznik poprzedniej lokacji

- `raid.prevNode` ustawiany przy każdym `move()` i przy udanej ucieczce.
- W `renderActions` przycisk wyjścia do `raid.prevNode` dostaje:
  - klasę `.node-return`,
  - dziecko `.node-return-dot` (niebieska kropka),
  - tooltip „Miejsce, z którego przyszedłeś”.

Na starcie rajdu `prevNode = null`, więc znacznika nie ma.

### 8.5. Loot

- `rollLoot(tableName, rolls)`:
  - wagi rzadkich przedmiotów mnożone przez `st.rareMult`,
  - zwraca listę `{ id, qty }`.
- `search()`:
  - jednorazowe na węzeł (`raid.searched`),
  - losuje loot z tabeli,
  - dodaje `node.guaranteed`,
  - dodaje `tutorialGuaranteedFor(node)`,
  - opcjonalny bonus od `st.bonusLootChance`,
  - dodaje na ziemię.
- Przedmioty fabularne (`quest: true`) nie są przenoszone do magazynu po rajdzie.

### 8.6. Walka

- `startCombat(enemyId)` tworzy runtime enemy z `ENEMIES`.
- `attack()`:
  - sprawdza amunicję,
  - `scavenger` może zaoszczędzić amunicję,
  - trafienie: `w.acc * (w.ammo ? st.rangedAcc : 1)`,
  - obrażenia: `randInt(dmg) * meleeMult/rangedDmgMult`,
  - adrenalina poniżej 35% HP,
  - crit `st.critChance` (domyślnie 5%, x1.75),
  - po ataku `enemyTurn()`.
- `enemyTurn()`:
  - trafienie `e.acc`,
  - obrażenia minus `armor.def`,
  - `damage()`.
- `autoFight()`:
  - blokuje broń,
  - leczy przy `hp <= 38% maxHp`, jeśli ma item z `heal`,
  - atakuje,
  - kara `-5% XP` przy zwycięstwie.
- `flee()`:
  - szansa `max(0.15, 0.55 + st.fleeMod + stealth * 0.005)`,
  - sukces → powrót do pierwszego wyjścia,
  - porażka → tura wroga.
- `winCombat()`:
  - XP, `cleared`, loot na ziemię, odblokowanie broni.

### 8.7. Tryb nasłuchu (The Last of Us)

- `triggerListenMode(enemyId)` — wróg jeszcze nie atakuje.
- `stealthBypass()` — ciche ominięcie, bez walki.
- `stealthAttack()` — 65% szansy na x2.5 obrażeń; przy zabiciu natychmiastowy loot.
- Klawisze: `1`/`O` — obejście, `2`/`A`/`Enter` — atak z zaskoczenia.

### 8.8. Naprawa silnika

- `MAP.repair` definiuje `manual`, `parts`, `steps`.
- `startRepair()` wymaga instrukcji i wszystkich części w plecaku.
- `repairStep(i)`:
  - poprawny krok → `progress++`,
  - zły krok → reset do 0,
  - ukończenie → `finishRepair()`.
- `finishRepair()` zużywa części, ustawia `raid.flags.engineFixed`, daje +30 XP.
- Ewakuacja ze statku wymaga `extractRequires: "engineFixed"`.

### 8.9. Ewakuacja i śmierć

`finish(success)`:

- **tutorial + śmierć** (`tutorialFail`):
  - nie zapisuje nic,
  - ekran „To był trening — nic nie tracisz”.
- **sukces**:
  - `save.hp = raid.hp`,
  - XP, `raids++`,
  - `save.lastLoadout = raid.startLoadout`,
  - `save.loadout.items = []`,
  - loot (poza quest) do magazynu,
  - jeśli tutorial → `tutorialDone = true` + `grantTutorialCompletionSupplies()`.
- **śmierć w pełnym rajdzie**:
  - `save.hp = ceil(maxHp * 0.5)`,
  - XP mimo śmierci,
  - `deaths++`,
  - plecak przepada.

### 8.10. Klawiatura

W `raid.js`:

- `R` — capture-phase:
  - `Shift+R` → `takeAll()`,
  - `R` z zaznaczonym itemem → `rotateSelected()`,
  - `R` bez zaznaczenia → `takeAll()` (fallback).
- `E` / `Space` — atak.
- `Q` — auto-walka.
- `F` — ucieczka.
- `1` / `2` / `3` — wybór broni.
- `X` — przeszukanie.
- `M` — radar Safe System.
- `W` / `A` / `S` / `D` — wyjścia 0–3.

`R` jest przechwytywane w fazie capture i `stopPropagation()`, żeby nie kolidowało z listenerem `grid.js`. To naprawia wcześniejszy problem niestabilnego obrotu.

---

## 9. Handlarze, questy i ekonomia

### 9.1. Dostępność handlarzy

`hideout.js` → `availableTraders()`:

```js
const commLvl = moduleLevel(save, "Komunikacja");
if (commLvl <= 0) return TRADERS.slice(0, 1);
if (commLvl === 1) return TRADERS.slice(0, 2);
return TRADERS;
```

Wynika z tego:

- kolejność `TRADERS` w `data/traders.js` definiuje kolejność odblokowania,
- `Komunikacja` na start (wybrana w kreatorze) daje poziom 1 → trader2 od razu,
- brak `Komunikacja` → tylko trader1.

### 9.2. Filtrowanie questów

`accessibleQuests()`:

```js
const traderIds = new Set(availableTraders().map((t) => t.id));
return QUESTS.filter((q) => traderIds.has(q.traderId));
```

`renderQuests()` pokazuje wyłącznie questy od dostępnych handlarzy. Filtr tierów (`all`, `0`, `1`) działa na tej przefiltrowanej liście.

### 9.3. „Przyjmij wszystkie zlecenia”

- Przycisk `#accept-all-quests` w `hideout.html`.
- `acceptAllQuests()`:
  - bierze `accessibleQuests()`,
  - filtruje status `available`,
  - respektuje aktualny filtr tieru,
  - ustawia `save.quests[q.id] = "active"`,
  - loguje liczbę,
  - `tutMark("accept")`,
  - `persist()`.
- Etykieta przycisku pokazuje liczbę nowych zleceń; przycisk jest disabled przy 0.

### 9.4. Przyjmowanie i oddawanie

- `acceptQuest(id)` → `active`.
- `turnInQuest(id)`:
  - wymaga statusu `active` i wszystkich req,
  - zużywa z plecaka, potem z magazynu,
  - dodaje kredyty, XP, item,
  - ustawia `completed`,
  - `tutMark("turnin")`.

### 9.5. Ceny i suwaki

- `buyPrice(id) = ceil(ITEMS[id].value * trader().buyMult * (commLvl >= 3 ? 0.9 : 1))`.
- `sellPrice(id) = floor(ITEMS[id].value * trader().sellMult)`.
- `traderBuyRow(id)` renderuje:
  - nazwę i cenę jednostkową,
  - suwak `1..max`, gdzie `max = max(1, min(stack || 3, 30))`,
  - aktualną ilość,
  - „Razem: X kr”,
  - przycisk „Kup xN” (disabled przy zbyt małej liczbie kredytów).
- `buy(id, qty)`:
  - pobiera kredyty tylko za faktycznie kupione sztuki,
  - częściowy zakup przy pełnym magazynie,
  - loguje brak miejsca.
- Ilości są pamiętane w `traderQty[id]` między renderami.

### 9.6. Rabat Czarnego Rynku

`Komunikacja >= 3` daje `-10%` na zakupy i dopisek w opisie handlarza.

---

## 10. Moduły bazy, crafting, hydroponika, skille

### 10.1. Moduły

7 modułów z `data/ship.js`:

| ID | Poziomy | Rola |
|---|---|---|
| `Crafting` | 0–3 | amunicja, broń, pancerze |
| `Medstation` | 0–2 | leczenie, medykamenty |
| `Stash` | 1–5 | rozmiar magazynu |
| `Silniki` | 0–2 | odblokowanie `vega` |
| `Komunikacja` | 0–3 | handlarze, questy, rabat |
| `Hydroponika` | 0–5 | racje i „woda” (obecnie bandage) |
| `Safe system` | 0–2 | radar przedrajdowy i w rajdzie |

Start:

- `Stash = 1`,
- `Hydroponika = 1`,
- `Komunikacja = 1` jeśli wybrana, inaczej `active: true, level: 0`,
- wybrany `Crafting`/`Medstation` = 1,
- pozostałe = 0.

`upgradeModule()`:

- sprawdza poziom, koszt, materiały (magazyn + plecak),
- pobiera kredyty i materiały,
- ustawia `level` i `active`,
- przy `Stash` przelicza wymiary i remountuje siatki,
- daje +35 XP Inżynierii,
- `tutMark("upgrade")` dla celu tutorialu.

### 10.2. Crafting / Medstation

- `openMod(id)` ustawia `openModule` i przechodzi do `hub-module`.
- `renderModule()` filtruje `RECIPES`.
- `craft(recipeId)`:
  - sprawdza materiały **tylko w magazynie**,
  - zużywa,
  - dodaje produkt,
  - +15 XP Inżynierii.

### 10.3. Hydroponika

- Od v.1.78.0 `hydroTick()` dorabia plony w tle: 1 cykl = 1 godzina, `food += poziom`, `water += ceil(poziom/2)` za cykl, zapasy nie rosną ponad 3 cykle produkcji.
- `save.hydroponics.food` i `.water` startują z `1/1` (normalizacja) i są zerowane po zbiorze.
- „Woda” to od v.1.78.0 osobny przedmiot `water` („Czysta woda”), nie bandaż.
- `harvestHydro()`:
  - przenosi `food` racji i `water` bandage’y do magazynu,
  - zeruje zapasy i ustawia `lastCheck` (pole obecnie nieużywane do regeneracji),
  - +15 XP Metabolizmu,
  - `tutMark("hydro")`.
- Poziom modułu wpływa więc na wyświetlaną „wydajność” i odblokowanie zbierania, ale nie generuje zapasów w tle.

### 10.4. Odpoczynek

- Poziom Medstation 0 → 50% max HP,
- 1 → 85%,
- 2 → 100%.
- `rest()` daje +10 XP Witalności i zawsze `tutMark("rest")`, nawet jeśli HP było pełne.

### 10.5. Skille i statystyki

- 10 skilli w `data/skills.js`, max 15 (lub 12/18 z perków).
- `grantSkillXp(s, skillId, amount)` używa `xpFormula`.
- `playerStats(s)` liczy m.in.:
  - `bagRows`, `meleeMult`, `rangedAcc`, `rangedDmgMult`, `xpMult`,
  - `fleeMod`, `rareMult`, `bonusLootChance`, `healMult`, `bonusHp`,
  - `resist.frost/radiation/toxic`,
  - ukryte: `luck`, `critChance`, `immunity`, `intuition`, `stealth`, `scavenger`, `adrenaline`, `maxSkillCap`.

---

## 11. Mapa UI

### 11.1. `hideout.html`

| Element | ID | Funkcja |
|---|---|---|
| Baner tutorialu | `tutorial-banner` | `renderTutorial()` |
| Ekran główny | `hub-main` | `#hub-title`, `#hub-status` |
| Rajd | `hub-raid` | `renderRaidList()`, `startRaid()` |
| Ekwipunek | `hub-inv` | `#stash-grid`, `#load-grid`, `#equipped-slots`, `#inv-info` |
| Handlarze | `hub-trader` | `#trader-tabs`, `#trader-buy`, `#sell-grid`, `#sell-info` |
| Questy | `hub-quests` | `#quests-list`, `#accept-all-quests`, filtry `#qfilter-*` |
| Moduły | `hub-ship` | `renderShip()` |
| Skille | `hub-skills` | `renderSkills()` |
| Hydroponika | `hub-hydro` | `renderHydro()`, `harvestHydro()` |
| Moduł | `hub-module` | `renderModule()`, `craft()` |
| Terminal | `log` | `termLog()` |

Przyciski nawigacji: `btn-raid`, `btn-inv`, `btn-trader`, `btn-quests`, `btn-ship`, `btn-skills`, `btn-hydro`, `btn-rest`.

### 11.2. `raid.html`

| Element | ID | Funkcja |
|---|---|---|
| Nazwa lokacji | `loc-name` | `render()` |
| Pasek HP | `hp-bar`, `hp-text` | `render()` |
| Burza | `storm-text` | `render()` |
| Grafika | `art` | `renderArt()` |
| Cele | `objectives` | `renderObjectives()` |
| Log | `log` | `termLog()` |
| Akcje | `actions` | `renderActions()` |
| Sloty bojowe | `raid-equip` | `renderRaidEquip()` |
| Plecak | `bag-grid`, `bag-info` | `mountGrid()`, `render()` |
| Ziemia | `ground-grid` | `mountGround()` |
| Zabierz wszystko | `take-all` | `takeAll()` |
| Info o przedmiocie | `item-info` | `renderInfo()` |
| Anatomia | `anatomy-panel` | **brak renderera** |

### 11.3. Ważne funkcje globalne

**`js/save.js`**

- `normalizeSave(s)` — kontrakt zapisu.
- `loadSave()`, `writeSave(s)`.
- `starterModuleId`, `tutorialTargetModule`, `tutorialModuleReq`, `hideoutTutorialActive`.
- `EQUIP_SLOT_DEFS`, `equipSlotDef`, `hasHolster`, `hasRaidEquipment`, `canEquip`, `equipFromContainer`, `equipItem`, `unequipItem`, `equippedWeapon`, `equippedArmor`.
- `playerStats`, `grantXp`, `grantSkillXp`.

**`js/grid.js`**

- `mountGrid(el, cont, opts)`.
- `addToContainer`, `countItem`, `removeById`, `consumeInst`, `summarize`, `toContainer`.
- `getSelected`, `rotateSelected`, `quickMove`, `refreshGrids`.
- Drag & drop przez pointer events; R w `document` keydown (bubble).

**`js/hideout.js`**

- `goTo`, `renderAll`, `persist`.
- `renderTutorial`, `tutMark`, `tutAutoCheck`, `currentTutStep`.
- `renderEquipped`, `doEquip`, `unequipToStash`.
- `availableTraders`, `renderTrader`, `buy`, `sell`, `tutorialBlocksSale`.
- `renderShip`, `upgradeModule`, `openMod`, `craft`.
- `renderSkills`, `renderHydro`, `harvestHydro`, `rest`.
- `renderRaidList`, `startRaid`.
- `accessibleQuests`, `renderQuests`, `acceptAllQuests`, `acceptQuest`, `turnInQuest`.

**`js/raid.js`**

- `initRaid`, `enterNode`, `move`, `search`, `takeAll`, `takeToBag`, `dropToGround`.
- `rollPerceptionForNode`, `effectiveEnemyChance`.
- `attack`, `enemyTurn`, `autoFight`, `flee`, `winCombat`.
- `triggerListenMode`, `stealthBypass`, `stealthAttack`.
- `startRepair`, `repairStep`, `finishRepair`.
- `extract`, `die`, `finish`, `renderEnd`.
- `render`, `renderActions`, `renderObjectives`, `renderRaidEquip`, `renderArt`.
- `getActiveWeapon`, `weaponChoices`, `switchWeapon`, `defaultActiveWeaponSlot`.

---

## 12. Persistence i migracje

Pełny schemat: [`SCHEMA.md`](./SCHEMA.md).

Najważniejsze zasady:

1. `loadSave()` zawsze normalizuje i **zapisuje** wynik.
2. `writeSave()` zapisuje tylko aktualny slot.
3. Nowe pola dodawaj do `normalizeSave()` z bezpiecznym defaultem.
4. Jednorazowe granty muszą mieć flagę (`grantGiven`, `startSupplies`, `kitGiven`, `traitBonusesApplied`).
5. Nie zmieniaj znaczenia istniejących pól bez migracji.
6. `s.module` może być legacy (`Warsztat`, `Medyczny`) — nie zakładaj, że to zawsze `ModuleId`.
7. `s.tutorialModule` jest wyliczany, ale respektowany, jeśli poprawny.
8. `save.equipped` może zawierać stringi w starych zapisach; `normalizeSave` to naprawia.
9. `save.stash.grow === true`; `save.loadout.grow === false`.
10. `completedQuests` istnieje, ale nie jest używane — stan jest w `save.quests`.

---

## 13. Invarianty — nie łam ich

1. **`normalizeSave()` jest jedynym kontraktem zapisu.** Każda nowa funkcja czytająca save może zakładać jego wynik.
2. **Tutorial target ∈ {Crafting, Medstation} i ≠ moduł wybrany na start.**
3. **Poziom `Komunikacja` steruje dostępem do handlarzy i questów.** Nie pokazuj questa od zablokowanego tradera.
4. **`q0_supplies` musi być dostępny w tutorialu.** Jest od `trader1`, więc działa przy `Komunikacja 0`.
5. **Pierwsza misja musi być ukończona, zanim startuje tutorial schronu.**
6. **Pełny rajd jest zablokowany, dopóki wszystkie kroki tutorialu poza `launch` nie są zaliczone.**
7. **Materiały tutorialu muszą wystarczyć na moduł + `q0_supplies`.** Jeśli zmieniasz koszty w `data/ship.js` lub req w `data/traders.js`, zaktualizuj `tutorialModuleLoot` i fallbacki.
8. **Nie sprzedawaj ochronionych przedmiotów podczas tutorialu.** `tutorialBlocksSale` musi obejmować nowe wymagania.
9. **`R` w rajdzie musi pozostać w fazie capture.** Inaczej `grid.js` zacznie przechwytywać obrót i `Shift+R` przestanie działać.
10. **`raid.html` musi ładować `data/traders.js`.** `grantTutorialCompletionSupplies()` używa `QUESTS`.
11. **`FISTS` musi być zdefiniowane przed użyciem w `raid.js`.** Obecnie w `js/save.js`.
12. **Nie zmieniaj kolejności `TRADERS` bez aktualizacji `availableTraders()`.** Odblokowanie opiera się na indeksach.
13. **`MAPS.tutorial` nie może być pokazana po `tutorialDone`.** `renderRaidList()` filtruje po `m.tutorial`.
14. **Każde wyjście w mapie musi wskazywać istniejący węzeł.** Brak walidacji w runtime.
15. **Przedmioty `quest: true` nie trafiają do magazynu po rajdzie.**
16. **`save.hp` aktualizuje się dopiero w `finish()`.** W trakcie rajdu źródłem prawdy jest `raid.hp`.
17. **Przenosząc istniejący przedmiot, używaj `placeInstance(cont, inst)`, nie `addToContainer(cont, id, qty)`.** `addToContainer` tworzy nową instancję i gubi `inner` (zawartość kontenera). Patrz 15.4.
18. **Rajd w toku ma `save.activeRaid = true` i stan w `sessionStorage` (`raidSnap`).** Nie zapisuj do zapisu gracza nic z rajdu poza `finish()`. Nowy sposób wejścia w rajd musi ustawiać `raidStart`, inaczej `initRaid()` uzna rajd za przerwany.

---

## 14. Przepisy na rozszerzenia

### 14.1. Nowy przedmiot

1. Dodaj wpis do `ITEMS` w `data/items.js`:
   ```js
   medgel: {
     name: "Żel medyczny",
     type: "consumable",
     size: [1, 1],
     value: 60,
     heal: 30,
   },
   ```
2. Opcjonalnie dodaj do:
   - `KITS` (zestaw startowy),
   - `TRADERS[x].stock`,
   - tabeli `LOOT`,
   - `MAPS[...].nodes[...].guaranteed`,
   - `RECIPES`.
3. Jeśli nowy `type`, dodaj styl `.it-<type>` w `css/style.css` (opcjonalnie).
4. Jeśli item ma być questowy: `type: "quest", quest: true, value: 0`.

### 14.2. Nowy wróg

1. `ENEMIES.nowy = { name, hp, dmg, acc, xp, loot: "nowa_tabela", rolls, verb }`.
2. `LOOT.nowa_tabela = [...]`.
3. Przypisz do węzła: `enemy: { id: "nowy", chance: 0.7 }`.
4. Pamiętaj, że `ENEMIES` jest potrzebne tylko w `raid.html` i `admin.html`.

### 14.3. Nowa mapa

1. Dodaj `MAPS.nowa_mapa`:
   ```js
   nowa_mapa: {
     name: "Nowa lokacja",
     tint: "#334155",
     start: "start",
     intro: "...",
     storm: 20,
     stormDmg: 4,
     nodes: {
       start: { name: "...", desc: "...", exits: ["next"], extract: true },
       next: { name: "...", desc: "...", exits: ["start"], loot: { table: "junk", rolls: 1 } },
     },
   }
   ```
2. Upewnij się, że każde `exits` wskazuje istniejący klucz.
3. Jeśli mapa ma być odblokowana warunkowo, dodaj warunek w `renderRaidList()`.
4. Jeśli mapa jest tutorialem, ustaw `tutorial: true` i dodaj `tutorialModuleLoot` / `tutorialCommonLoot`.

### 14.4. Nowy quest

1. Dodaj do `QUESTS`:
   ```js
   {
     id: "q2_test",
     traderId: "trader2",
     tier: 2,
     title: "...",
     desc: "...",
     req: [["scrap", 3]],
     reward: { credits: 300, xp: 50, item: "bandage", itemQty: 2 },
   }
   ```
2. Upewnij się, że `traderId` istnieje i jest odblokowywany.
3. Jeśli dodajesz nowy tier, rozszerz filtry w `hideout.html` i `filterQuestTier()`.
4. Nie musisz zmieniać UI listy — `renderQuests()` jest generyczne.

### 14.5. Nowy handlarz

1. Dodaj obiekt do `TRADERS` w `data/traders.js`.
2. Pamiętaj: `availableTraders()` używa `slice(0, 1)`, `slice(0, 2)` i „wszyscy”. Jeśli nowy handlarz ma się odblokować na poziomie 2, dodaj go przed końcem tablicy.
3. Dodaj questy z `traderId`.
4. Stock może zawierać dowolne `ITEMS`.

### 14.6. Nowy moduł bazy

1. Dodaj do `SHIP_MODULES`.
2. Dodaj ID do `allModules` w `normalizeSave()`.
3. Ustaw default `active/level` w normalizacji.
4. Jeśli moduł ma efekt, dopisz go w `playerStats()` lub w konkretnej funkcji.
5. Jeśli ma własny ekran, dodaj go do `hideout.html` i `goTo`.
6. Pamiętaj o `moduleActive()` i `moduleLevel()`.

### 14.7. Nowy krok tutorialu schronu

1. Dodaj wpis do `HIDEOUT_TUTORIAL_STEPS`:
   ```js
   { id: "craft", label: "Wytwórz przedmiot w module.", target: "hub-module" },
   ```
2. Dodaj mapowanie w `renderTutorial()` → `targetMap`, jeśli nowy ekran.
3. Dodaj auto-check w `tutAutoCheck()` lub wywołanie `tutMark("craft")` w akcji.
4. Jeśli krok ma własną etykietę dynamiczną, rozszerz `tutorialStepLabel()`.
5. Nie musisz zmieniać bramki `startRaid()` — automatycznie obejmuje nowy krok.
6. Upewnij się, że krok jest wykonalny przy grantach tutorialu.

### 14.8. Nowy slot ekwipunku

1. Dodaj wpis do `EQUIP_SLOT_DEFS`:
   ```js
   { id: "backpack", name: "Plecak", short: "PLECAK", accepts: (it) => it.type === "gear" },
   ```
2. `normalizeSave()` automatycznie doda slot i wyczyści nieprawidłowe wartości.
3. `renderEquipped()` i `renderRaidEquip()` są generyczne.
4. Jeśli slot ma zależeć od innego (jak `ranged2` od `holster`), dodaj logikę w `canEquip` i normalizacji.
5. Pamiętaj o `equipButtonsFor()`.

### 14.9. Nowy skill

1. Dodaj do `SKILLS` z `id`, `name`, `desc`, `maxLevel`, `xpFormula`, `statBonus`.
2. `normalizeSave()` automatycznie doda brakujący wpis.
3. Jeśli skill ma wpływać na statystyki, dopisz go w `playerStats()`.
4. Jeśli ma dawać XP, wywołaj `grantSkillXp()` w odpowiedniej akcji.

### 14.10. Nowy typ znacznika węzła

1. Użyj wzorca z `node-return-dot` / `node-danger-dot` w `renderActions()`.
2. Dodaj CSS w `css/style.css`.
3. Nie zmieniaj kolejności listenerów klawiatury bez testu.

---

## 15. Co zostało zmienione w tej iteracji

### 15.1. Rajd

- Naprawiono `R` przez capture-phase handler:
  - `R` obraca zaznaczony przedmiot,
  - `Shift+R` zawsze bierze wszystko,
  - `R` bez zaznaczenia bierze wszystko.
- Dodano przycisk „Zabierz wszystko [Shift+R]”.
- Dodano niebieską kropkę poprzedniej lokacji (`.node-return-dot`).
- Dodano czerwony shimmer i kropkę percepcji (`.node-shimmer-danger`, `.node-danger-dot`).
- Percepcja jest pre-rollowana raz na węzeł; shimmer tylko przy pewnym spawnie.
- Dodano cele tutorialu: części, materiały modułu, `q0_supplies`, przeszukanie lokacji.
- Dodano dynamiczny loot tutorialu zależny od celu.
- Dodano fallback grantów po ukończeniu tutorialu.
- Dodano `data/traders.js` do `raid.html`, żeby `QUESTS` było dostępne.

### 15.2. Schron

- Dodano baner tutorialu i 10 kroków.
- Dodano automatyczne sprawdzanie equip/accept/turnin/upgrade.
- Dodano blokadę rajdu do ukończenia tutorialu.
- Dodano fundusz 250 kr + rację.
- Dodano materiały startowe i ochronę przed sprzedażą.
- Dodano dofinansowanie ulepszenia celu tutorialu.
- Dodano trzeci moduł startowy `Komunikacja`.
- Dodano „Przyjmij wszystkie zlecenia”.
- Dodano filtrowanie questów po dostępnych handlarzach.
- Dodano sloty postaci i obsługę kabury.
- Dodano suwaki ilości i częściowe zakupy.
- Dodano style `.item-quest`, `.it-gear`.

### 15.3. Zapis

- `loadSave()` zapisuje znormalizowany save od razu — zapobiega duplikacji grantów.
- Dodano `tutorialModule` i `hideoutTutorial` do normalizacji.
- Dodano kompatybilność `Warsztat`/`Medyczny`.
- Dodano jednorazowe flagi `grantGiven`, `startSupplies`, `kitGiven`, `traitBonusesApplied`.

### 15.4. Zmiany od v.1.67.0 do v.1.71.0

- **v.1.68.0 – przycisk „Wyczyść cache”** (`js/cachebtn.js`, prawy dolny róg; dołączony do `index`, `hideout`, `raid`, `creator`). Czyści Cache Storage gry, service workery i `sessionStorage`. **Nie rusza** `saveSlot_*`, `currentSlot` ani innych kluczy localStorage. Cache HTTP plików (HTML/CSS/JS) JavaScript nie czyści, potrzebne jest Ctrl+Shift+R.
- **v.1.69.0 – ukryta funkcja dev `testSkipMars()`** (5× P na Marsie, `js/raid.js`) dodaje, oprócz łupu Marsa, do magazynu: `cardboard_box`, `medicine_case`, `weapon_case`.
- **v.1.70.0 – interakcje z kontenerami** (`js/hideout.js`, `js/grid.js`):
  - Podwójny klik w przedmiot z magazynu/zestawu przy **otwartym** kontenerze wkłada go do kontenera (`quickFromInventory`), jeśli kontener go przyjmuje. Bez otwartego kontenera działa jak dotąd (magazyn ↔ zestaw).
  - Podwójny klik w przedmiot wewnątrz kontenera przenosi go do magazynu.
  - Odrzucenie (przeciągnięcie / podwójny klik) pokazuje w logu komunikat „X nie przyjmuje: Y”.
- **v.1.71.0 – upuszczenie na zamknięty kontener w siatce** (`dropCheck` w `js/grid.js`): przeciągnięty przedmiot wpada do wnętrza kontenera leżącego w magazynie, o ile go przyjmuje. Komunikat „Wrzucono do X: Y” albo „Brak miejsca w X”.
- **v.1.71.0 – naprawa utraty zawartości kontenerów** (krytyczny błąd): `sortStash()` odbudowywał magazyn z sumy ilości po `id`, więc kontenery traciły `inner`. Teraz kontenery zostają instancjami z zawartością, a sortowanie działa na kopiach (nieudane sortowanie nic nie zmienia). To samo dotyczyło `quickMove` (podwójny klik kontenera magazyn→zestaw), `clearLoadout` i przeniesienia plecaka z rajdu. Wszystkie używają teraz `placeInstance()`.
- **v.1.72.0 – upuszczenie do kontenera liczy komórkę pod kursorem** (nie lewy górny róg duszka): wrzucenie działa z każdego z 9 pól Medicine Case. Podświetlany jest cały kontener.
- **v.1.73.0 – kontenery nie idą na rajd:** zestaw (`loadView`) ma `canMoveIn` odrzucający kontenery (podwójny klik i przeciąganie), a `startRaid()` blokuje start, jeśli w zestawie jest kontener.
### 15.5. Blokady rajdu i wznowienie (v.1.74.0)

- **Wznowienie po F5:** stan rajdu (`raid`, bez funkcji i timerów) jest zapisywany w `sessionStorage` (`raidSnap`) przy każdym `render()` i na `pagehide`. Przy starcie `initRaid()` wraca dokładnie w to miejsce (`[WZNOWIENIE]`). Ekwipunek zostaje, bo zestaw jest dopiero czyszczony w `finish()`.
- **Cofanie w przeglądarce** nie opuszcza rajdu: `guardRaid()` odkłada wpis w historii i wypisuje komunikat. Po zakończeniu rajdu cofanie działa normalnie.
- **Zamknięcie / F5 w trakcie rajdu** pyta o potwierdzenie (`beforeunload`).
- **Flagi w zapisie:** `raidStart` (oczekujący start ze schronu, ustawiany w `startRaid()`) i `activeRaid` (rajd w toku). `initRaid()` zamienia `raidStart` na `activeRaid` przy świeżym starcie.
- **Rajd przerwany:** jeśli `activeRaid` jest prawdziwe, a stanu w sesji nie ma (nowa karta, zamknięta przeglądarka, wejście bezpośrednim URL), rajd liczy się jak śmierć: `deaths++`, zestaw i założony ekwipunek przepadają, alert i powrót do schronu. Dla samouczka tylko czyszczona jest flaga.
- **Koniec rajdu** (`finish()`) czyści `raidSnap` i `activeRaid`. Transit (`goTransit`) czyści tylko `raidSnap`, rajd trwa dalej.
- Przetestowane w Chromium: start ze schronu, F5 z zachowaniem pozycji i plecaka, cofnięcie zablokowane, nowa karta → rajd przerwany, zakończenie czyści flagi.

- **v.1.74.1:** podwójny klik na kontener w magazynie otwiera jego panel (zamiast próby przeniesienia).
- Minimapa: renderuje się z `MAP.coords` (nie z `raid.pos`). Patrz 17.13 — zgłoszono, że w rajdzie w szybach Prometeusza panel „Mapa” był pusty; nie udało się odtworzyć.


### 15.6. Usuwanie przedmiotów w schronie (v.1.75.0)

- Przycisk kosza (sama ikona SVG, bez napisu, `title`/`aria-label` „Usuń przedmiot”, klasa `trash-btn`) w panelu informacji o przedmiocie (`renderInvInfo()` w `js/hideout.js`). Działa tylko w schronie (magazyn i zestaw). W raidzie nie ma kosza, zostaje „Wyrzuć” (`dropToGround`).
- `deleteSelected(sel)` w `js/hideout.js`: otwiera wbudowane okno modalne potwierdzenia (`#item-delete-modal`) zamiast blokowanego przez iFrame przeglądarki `window.confirm`. Po kliknięciu „USUŃ PRZEDMIOT” usuwa instancję z `view.cont.items` i zapisuje stan (`persist()`).
- Blokady: kontener z zawartością (`inner.items` niepuste) nie do usunięcia („Najpierw opróżnij kontener”). Przedmioty questowe (`quest: true`) nie do usunięcia, chyba że są w `MARS_QUEST_ITEMS` (manual, part_injector, part_coil, part_gasket, czyli gwarantowane przedmioty tutorialu na Marsie). Pozostałe questowe, np. `titan_med_key`, są zablokowane.
- CSS: `button.sm.trash-btn` w `css/style.css`.

### 15.7. Kolorowanie telemetryczne statusu schronu, dwudzielny pasek kondycji i modal cech (v.1.76.0)

- **Kolorowanie sekcji statusu w schronie (`#hub-status`):**
  - Planeta (cyjan `#38bdf8`),
  - Poziom i XP (fiolet `#a855f7` i szary `#64748b`),
  - HP (dynamiczny kolor: zieleń `#4ade80` > 65%, bursztyn `#fbbf24` > 35%, czerwień `#ef4444` <= 35%),
  - Kredyty (złoty `#fbbf24`),
  - Statek (turkus `#06b6d4`),
  - Aktywne stacje (niebieski `#38bdf8`),
  - Rajdy i zgony (zieleń `#10b981` / czerwień `#f87171`).
- **Kondycja — dwudzielny pasek z gradientem i przedziałkiem:**
  - Wartości jedzenia (`hunger`) oraz picia (`thirst`) składają się na kondycję (50% jedzenie zielony gradient `#10b981` -> `#22c55e`, 50% picie niebieski gradient `#0ea5e9` -> `#38bdf8`).
  - Na środku paska znajduje się 2-pikselowy czarny przedziałek separator (`.cond-divider`).
- **Okno modalne cech (`#traits-modal`):**
  - W wierszu „Cechy” dodano przycisk `[Szczegóły 🔍]`, który otwiera modal z pełnym wykazem cech postaci.
  - Karty cech rozróżniają cechy pozytywne (zielona ramka i badge `[ZALETA]`) oraz negatywne (czerwona ramka i badge `[WADA]`).
  - Każda karta wyświetla pełny opis oraz wyliczone modyfikatory cechy (`HIDDEN_STATS_DEF`, `skillBonus`, `maxSkillCap`).

### 15.10. Przypomnienie handlarza o aktywnym zleceniu (v.1.79.0)

- `connectTrader()` w `js/hideout.js`, krok 3: spośród aktywnych zleceń tierowych z dialogiem, które wciąż mają blokadę, wybiera to z największym postępem (`questProgress()`), a przy remisie pierwsze z listy.
- Tekst przypomnienia: „Czego chcesz? Najpierw zajmij się zleceniem „X”. ...” z podpowiedzią z `blockerHint()` (pokonaj cel / ulepsz moduł / wykonaj zadanie / wyciągnij z rajdu / zdobądź przedmioty). Wcześniej gracz słyszał surowy tekst blokera po `toLowerCase()` („gdy ewakuuj się...”).
- Uwaga: `mainBlocker()` sprawdza najpierw wyniesienie, a potem zebranie, więc bez przedmiotów zwraca „Ewakuuj się”. Dlatego podpowiedź jest liczona osobno w `blockerHint()`.
- v.1.79.1: `mainBlocker()` wymaga wyniesienia z rajdu tylko dla zleceń głównych i tierów innych niż 0 (ta sama reguła co `turnInQuest()`). Wcześniej zlecenia tier 0 (np. „Dezynfekcja Rur”) blokowały się na zawsze, bo `finish()` nie zapisuje `questCarry` dla tier 0. Test: `scratchpad/t/carry-test.js`.
- Test: `scratchpad/t/idle-test.js` (3 przypadki: wybór po postępie, wyniesienie, zdobycie).
- v.1.79.2: rozmowy z handlarzem dotyczą wyłącznie zleceń głównych:
  - `connectTrader()`: oddanie i przypomnienie tylko dla `q.isMain`; przypomnienie bez nazwy zlecenia („Czego chcesz? Wróć, gdy ...”).
  - Zlecenia tierowe nie mają dialogu: widok zlecenia pokazuje „Oddaj zlecenie i odbierz nagrodę” (`turnInQuest()` bez rozmowy).
  - `mainDialogLines()` korzysta już tylko z `MAIN_DIALOGS`.
  - `data/dialogues_tier.js` (`TIER_DIALOGS`) nie jest już używany i zawiera nazwy zleceń w tekstach. Można go usunąć z `hideout.html` / `raid.html` w porządku.
  - Test: `scratchpad/t/talk-test.js`.
- Nie zmieniono kwestii `TRADER_IDLE` (część zawiera dużo przekleństw, do decyzji).

### 15.9. Głód, pragnienie, farma i Dr Jan (v.1.78.0)

- **Zużycie w turach** (`nutritionTurn(kind)` w `js/raid.js`, każda tura daje losowanie niezależnie dla jedzenia i picia; spadek o 2%):
  - ruch (`tick("move")`): jedzenie 15%, picie 22%,
  - walka (`attack()`, każde kliknięcie ataku): jedzenie 35%, picie 43%,
  - przeszukiwanie (`tick("search")`): jedzenie 22%, picie 27%.
- **Kara HP:** w turze ruchu, gdy średnia `(hunger + thirst) / 2` jest poniżej 50, tracisz `ceil(maxHp * 0.03)` HP (log `[GŁÓD/PRAGNIENIE]`). Walka i przeszukiwanie kary nie zadają.
- **Odpoczynek w schronie** (`rest()`): podnosi jedzenie do co najmniej 35% i picie do co najmniej 30%; wyższych wartości nie obniża.
- **Używanie:** przedmioty z polami `hunger` / `thirst` uzupełniają odpowiedni wskaźnik (co najwyżej do 100). Działa w schronie (blok „3. Pożywienie” w funkcji używania w `js/hideout.js`) i w rajdzie (przycisk „Użyj” w plecaku).
- **Przedmioty:** `ration` (+30 głodu), `water` (+30 pragnienia), nowe jedzenie: `konserwa` (+35), `suszone_owoce` (+20), `batonik` (+25); nowe picie: `sok_owocowy` (+25), `woda_mineralna` (+35).
- **Dr Jan Vane** (`trader1`): pole `fixedPrices: { ration: 400, water: 300 }` nadpisuje cenę kupna (`buyPrice`). `water` jest w asortymencie tieru 0.
- **Nagroda za tutorial na Marsie:** przy pierwszym udanym ukończeniu (`finish(true)`) do magazynu trafia 5× `ration` i 5× `water`.
- **Farma:** zbiór daje `ration` i `water` (wcześniej bandaż jako woda); produkcja w tle przez `hydroTick()` (sekcja 10.3).
- Test: `scratchpad/t/nutr-test.js` (12 sprawdzeń: ceny, odpoczynek, farma, szanse tur, kara HP). Nie testowano: nagrody za tutorial w pełnym przebiegu i używania jedzenia w rajdzie.

### 15.8. Żywe dialogi handlarzy dla Tier 0 i 1 oraz rozszerzone TRADER_IDLE (v.1.77.0)

- **Plik dialogów tierowych (`data/dialogues_tier.js`):**
  - Wygenerowano pełne, klimatyczne dialogi dla wszystkich 80 zleceń Tier 0 i Tier 1 dla wszystkich 8 handlarzy.
  - Każdy dialog zawiera narrację (`k: "n"`), bezpośrednią kwestię tradera z jego specyficznym głosem i przekleństwami (`k: "t"`), 2 warianty odpowiedzi gracza (`choice`), oraz ripostę handlarza na stacji Exodus.
  - Dialogi oddania (`done`) uwzględniają zdanie raportu, reakcję tradera oraz odbiór nagrody.
- **Aktualizacja TRADER_IDLE (`data/dialogues_main.js`):**
  - Rozszerzono krótkie kwestie wywoływane przyciskiem „Połącz się” dla wszystkich 8 handlarzy (Vane, Karras, Borys, Nadia, Val, Sławiński, Thorne, Jax) zgodnie z przekazanymi profilami psychologicznymi, żargonem, strachem przed Szeptem i wulgaryzmami.
- **Integracja w schronie (`js/hideout.js` i `hideout.html`):**
  - `mainDialogLines()` obsługuje zarówno `MAIN_DIALOGS`, jak i `TIER_DIALOGS`.
  - Karty zleceń w `createQuestCard()` przy gotowości do oddania wyświetlają przycisk „Porozmawiaj i oddaj zlecenie” otwierający pełny dialog.
  - Funkcja `connectTrader()` w pierwszej kolejności pozwala oddać gotowe zlecenia (główne lub tierowe), przypomina o trwających zadaniach lub losuje dopasowaną kwestię z `TRADER_IDLE`.

---

### 15.11. Poprawka questa „Patrol Zachodni” (v.1.79.3)

- Przyczyna: `saga_trader6_1` wymagał `manual` (Instrukcja serwisowa, `quest: true`). Taki przedmiot nie trafia do magazynu po rajdzie, a `turnInQuest` i `mainBlocker` liczyły go w magazynie/zestawie, więc zadanie było nie do oddania. Instrukcja była gwarantowana tylko na tutorialu Marsa.
- Naprawa: `questItemHeld(q, r)` (`js/hideout.js`) liczy przedmioty fabularne z `save.questCarry`, a `turnInQuest` zużywa je z `questCarry`. Instrukcja jest gwarantowana w węźle `Sala Katalogowa` (`titan_archive`, `data/maps.js`). Nie jest w Titan Dome, bo tam są wszystkie questy saga.
- Uwaga: `part_gasket`, `part_injector` i `part_coil` (questy `saga_trader3_*`, `saga_trader7_3`, `saga_trader8_3`) mają tę samą klasę problemu. Turn-in działa już dla nich, ale źródła łupu poza tutorialem nadal nie istnieją.
- Test: `/tmp/patrol.py` (oddanie z wyniesioną instrukcją przechodzi, bez wyniesienia blokuje).

## 16. Weryfikacja

### 16.1. Składnia

```bash
cd /Users/user/space-tarkov-rpg
for f in js/*.js data/*.js; do
  node --check "$f" >/dev/null 2>&1 || echo "FAIL $f"
done
echo "OK"
```

### 16.2. Smoke test w przeglądarce

Uruchom serwer HTTP i przejdź checklistę:

1. **Nowa gra** — utwórz postać dla każdego modułu:
   - `Medyczny`,
   - `Warsztat`,
   - `Komunikacja`.
2. **Pierwsza misja** — ukończ tutorial na Marsie:
   - znajdź instrukcję i 3 części,
   - napraw silnik,
   - wystartuj,
   - sprawdź, że `tutorialDone` jest `true`.
3. **Tutorial schronu**:
   - baner widoczny,
   - krok `equip` zalicza się po założeniu pancerza i broni,
   - `accept` po przyjęciu questa,
   - `turnin` po oddaniu,
   - `buy` i `sell` przez handlarza,
   - `upgrade` celu tutorialu,
   - `skills`, `hydro`, `rest`,
   - `launch` dopiero po wszystkich.
4. **Blokada rajdu** — spróbuj wejść w rajd przed ukończeniem kroków; powinno przenieść do właściwego ekranu.
5. **R w rajdzie**:
   - zaznacz item → `R` obraca,
   - `Shift+R` bierze wszystko,
   - `R` bez zaznaczenia bierze wszystko.
6. **Znaczniki**:
   - po przejściu do innego węzła wróć — niebieska kropka na przycisku,
   - sprawdź czerwony shimmer (może wymagać kilka wejść).
7. **Handlarze**:
   - przy `Komunikacja 0` tylko trader1,
   - przy 1 — trader1 i trader2,
   - przy 2+ — wszyscy.
8. **Questy**:
   - lista nie pokazuje questów zablokowanych traderów,
   - „Przyjmij wszystkie” przyjmuje tylko widoczne nowe,
   - oddanie zużywa itemy z plecaka i magazynu.
9. **Ekwipunek**:
   - założenie pancerza, broni palnej, białej,
   - `ranged2` bez kabury zablokowane,
   - założenie kabury odblokowuje `ranged2`,
   - zdjęcie kabury przy zajętym `ranged2` zablokowane.
10. **Suwaki**:
    - zmiana ilości aktualizuje „Razem”,
    - brak kredytów blokuje przycisk,
    - pełny magazyn → częściowy zakup.
11. **Persistencja**:
    - odśwież stronę po każdym kroku,
    - sprawdź, że granty nie duplikują się,
    - sprawdź, że `tutorialModule` się nie zmienia.

### 16.3. Reset testowy

Aby wyczyścić wszystko:

```js
localStorage.clear();
location.reload();
```

Aby usunąć tylko nadpisania admina:

```js
localStorage.removeItem("gameData_overrides");
location.reload();
```

---

## 17. Znane problemy i dług techniczny

### 17.1. Brak `data/body.js`

`raid.html` ładuje `data/body.js`, którego nie ma. W konsoli pojawia się 404. Nie zatrzymuje to działania gry, ale:

- `anatomy-panel` nie ma renderera,
- panel anatomii jest pusty.

**Rekomendacja:** albo dodać `data/body.js` z modelem ciała, albo usunąć `<script>` i panel.

### 17.2. Kolejność w `startRaid()`

`startRaid()` oznacza `launch` i `done` **przed** sprawdzeniem pustego plecaka i niskiego HP. Jeśli gracz anuluje `confirm`, tutorial jest już ukończony, mimo że nie wyruszył.

**Rekomendacja:** przenieść blok `t.completed.launch = true; t.done = true;` za confirmacje, tuż przed `window.location.href`.

### 17.3. Ekwipunek zachowuje się inaczej niż komunikat

Założone przedmioty (`save.equipped`) przeżywają rajd i śmierć. Komunikat „Straciłeś cały zestaw” dotyczy plecaka, nie slotów. To może być zamierzone, ale jest niespójne.

**Rekomendacja:** zdecydować, czy śmierć ma czyścić `save.equipped`, czy komunikat ma mówić „straciłeś plecak”.

### 17.4. `hunger` / `thirst` nie są używane (ROZWIĄZANE w v.1.78.0, patrz 15.9)

Pola istnieją i są normalizowane, ale nie ma konsumpcji głodu/pragnienia w rajdzie ani w schronie.

**Rekomendacja:** dodać tick głodu/pragnienia w `tick()` lub usunąć pola.

### 17.5. `completedQuests` nie jest używane

Stan questów jest w `save.quests` (`"active"` / `"completed"`). `completedQuests` to martwe pole.

**Rekomendacja:** usunąć albo synchronizować w `turnInQuest()`.

### 17.6. `equipItem()` nie odkłada starego przedmiotu

`equipItem(s, itemId, slot)` podmienia slot, ale nie zwraca starego itemu do kontenera. UI używa `equipFromContainer()`, więc problem nie występuje w normalnej grze, ale funkcja jest pułapką.

**Rekomendacja:** usunąć `equipItem()` lub oznaczyć jako legacy.

### 17.7. `availableTraders()` zależy od kolejności tablicy

`TRADERS.slice(0, 1)`, `slice(0, 2)` i „wszyscy” oznaczają, że kolejność w `data/traders.js` jest logiką gry. Dodanie handlarza w środku tablicy zmieni odblokowania.

**Rekomendacja:** dodać pole `unlockCommLevel` do traderów i filtrować po nim.

### 17.8. `R` podczas przeciągania w rajdzie

Capture-phase handler w `raid.js` przechwytuje `R` także podczas drag & drop, więc nie obraca ducha przeciąganego przedmiotu (rotacja obraca zaznaczony item). W schronie `grid.js` obsługuje rotację ducha.

**Rekomendacja:** w handlerze sprawdzić `drag && drag.moved` i oddać sterowanie `grid.js`, albo ręcznie obracać `drag.r`.

### 17.9. `package.json` i `README.md` są mylące

`package.json` to szablon React/AI Studio; `README.md` mówi o Gemini API. Gra ich nie używa.

**Rekomendacja:** zastąpić README instrukcją uruchamiania tej gry, a `package.json` uprościć lub zostawić jako narzędzie Vite.

### 17.10. Brak wersjonowania zapisu

Nie ma `schemaVersion`. `normalizeSave()` obsługuje stare pola „ad hoc”.

**Rekomendacja:** dodać `schemaVersion` przy następnej migracji i test migracji ze starych zapisów.

### 17.11. Brak testów automatycznych

Nie ma CI ani testów. Wszystko weryfikowane ręcznie.

**Rekomendacja:** dodać Playwright lub prosty harness uruchamiający funkcje `save.js` w Node z zamockowanym `localStorage`.

### 17.12. Hydroponika nie produkuje w tle (ROZWIĄZANE w v.1.78.0, `hydroTick()`)

`renderHydro()` pokazuje `productionRation` i `productionWater`, ale `harvestHydro()` zbiera tylko to, co już jest w `save.hydroponics.food/water`. Po pierwszym zbiorze oba pola wynoszą 0 i nie ma mechanizmu ich uzupełniania (brak timera, brak przeliczenia `lastCheck`).

**Rekomendacja:** dodać funkcję `tickHydroponics(save)` wywoływaną przy wejściu do schronu, która na podstawie `lastCheck` i poziomu modułu uzupełnia `food`/`water`. Albo zmienić UI, żeby nie obiecywało produkcji w tle.

### 17.13. Minimapa pusta w niektórych rajdach (nierozwiązane)

Zgłoszenie od użytkownika: w rajdzie „Szyby Prometeusza” (`titan_mines`) panel „Mapa” jest pusty. W testach Chromium (headless, wszystkie 13 map, wejście bezpośrednie i przez transit, losowe przejścia, szerokości 390–1920 px, walka) minimapa się rysuje, a `MAP.coords` ma wszystkie pokoje. Możliwe przyczyny do sprawdzenia na żywo: błąd JS w konsoli przerywający `render()` przed `renderMinimap()` (kolejność: `renderArt` → `renderMinimap`), albo stan zapisu/rajdu, którego nie odtworzono.

**Pierwszy krok:** poprosić o konsolę (F12) i zrzut z momentu, gdy panel jest pusty. Nie zmieniać kodu bez tego.

**Rekomendacja:** przenieść `renderMinimap()` przed `renderArt()` oraz owinąć każdą funkcję renderującą w `try/catch`, żeby jeden błąd nie zabijał całego ekranu rajdu.

---

## 18. Sugerowane następne kroki

W kolejności od najbezpieczniejszych:

1. **Naprawić `startRaid()`** — przenieść oznaczenie tutorialu za confirmacje.
2. **Dodać lub usunąć `data/body.js`** — oczyścić 404 i martwy panel anatomii.
3. **Zdecydować o utracie `save.equipped` przy śmierci** — spójność z komunikatem.
4. **Dodać `schemaVersion` + migracje** — zanim pojawi się więcej zmian w save.
5. **Dodać testy Playwright** dla:
   - creator → tutorial raid → hideout tutorial,
   - `R` / `Shift+R`,
   - accept-all i filtrowanie questów,
   - equip + holster,
   - kupno/sprzedaż.
6. **Uporządkować `package.json` / README**.
7. **Dodać `unlockCommLevel` do traderów** zamiast indeksów tablicy.
8. **Rozważyć wspólny moduł danych** (np. `js/constants.js`) dla `FISTS`, `EQUIP_SLOT_DEFS`, `HIDEOUT_TUTORIAL_STEPS`, żeby uniknąć zależności kolejności ładowania.
9. **Dodać walidację map** (każde `exits` istnieje, każdy `start` istnieje) przy starcie rajdu.
10. **Dodać ekran podsumowania zmian / changelog w grze** — opcjonalnie.

---

## 19. Checklista przejęcia

- [ ] Przeczytaj `SCHEMA.md` (schemat zapisu i danych).
- [ ] Przeczytaj ten dokument w całości.
- [ ] Uruchom grę przez `python3 -m http.server`.
- [ ] Przejdź creator → pierwsza misja → tutorial schronu.
- [ ] Sprawdź `R` i `Shift+R` w rajdzie.
- [ ] Sprawdź „Przyjmij wszystkie zlecenia”.
- [ ] Sprawdź filtrowanie questów przy różnych poziomach `Komunikacja`.
- [ ] Sprawdź equip + kaburę.
- [ ] Sprawdź zapis po odświeżeniu (brak duplikatów grantów).
- [ ] Przeczytaj sekcję **Invarianty** przed pierwszą zmianą.
- [ ] Nie edytuj `extracted_game/` ani `public/assets/*.zip`.
- [ ] Po zmianach uruchom `node --check` dla wszystkich `js/*.js` i `data/*.js`.

---

## 20. Szybka ściągawka: gdzie co jest

| Chcę zmienić... | Plik |
|---|---|
| koszt/poziomy modułu | `data/ship.js` |
| nagrody/req questów | `data/traders.js` |
| stock handlarza | `data/traders.js` |
| loot / mapy / cele tutorialu | `data/maps.js` |
| przedmioty / zestawy / receptury | `data/items.js` |
| wrogów | `data/enemies.js` |
| skille | `data/skills.js` |
| perki | `data/perks.js` |
| zapis / migracje / sloty | `js/save.js` |
| siatka / drag & drop / rotacja | `js/grid.js` |
| tutorial schronu / handel / questy / moduły | `js/hideout.js` |
| rajd / walka / loot / percepcja | `js/raid.js` |
| kreator postaci | `js/player.js` |
| menu / sloty | `js/main.js` |
| przejścia / terminal / glow | `js/ui.js` |
| wygląd | `css/style.css` |
| ekrany schronu | `hideout.html` |
| ekran rajdu | `raid.html` |

---

**Ostatnia aktualizacja dokumentu:** 2026-11-04  
**Autor zmian:** poprzednia iteracja AI  
**Status:** gotowe do przejęcia; patrz znane problemy w sekcji 17.
