# Space Tarkov RPG — kanoniczny schemat danych

> Dokument opisuje **stan faktyczny kodu** (nie projekt docelowy).  
> Źródłem prawdy dla zapisu gry jest `js/save.js` → `normalizeSave()`.  
> Źródłem prawdy dla danych gry są pliki `data/*.js`, które ładowane są jako zwykłe skrypty globalne (bez importów/eksportów).

---

## 1. Konwencje

- Brak modułów ES. Wszystkie dane i funkcje są globalne.
- Kolejność ładowania skryptów ma znaczenie (patrz `HANDOFF.md`).
- ID przedmiotów, wrogów, map, modułów, handlarzy, questów i skilli to stringi.
- Pola opcjonalne oznaczono `?`.
- Czas zapisywany jest jako `number` (Unix ms, `Date.now()`).
- Zapis gry nie ma obecnie pola `schemaVersion`. Migracje wykonuje `normalizeSave()`.

---

## 2. Klucze `localStorage`

| Klucz | Typ | Znaczenie |
|---|---|---|
| `saveSlot_1` | JSON `Save` | Zapis gracza w slocie 1 |
| `saveSlot_2` | JSON `Save` | Zapis gracza w slocie 2 |
| `saveSlot_3` | JSON `Save` | Zapis gracza w slocie 3 |
| `currentSlot` | `"1" \| "2" \| "3"` | Aktualnie wybrany slot |
| `gameData_overrides` | JSON `GameDataOverrides` | Nadpisania bazy z panelu admina |

`loadSave()` czyta `saveSlot_${getSlot()}`, wywołuje `normalizeSave()` i **natychmiast zapisuje znormalizowany wynik** przez `writeSave()`. Dzięki temu jednorazowe granty (np. fundusz tutorialu) nie powtarzają się przy każdym wejściu.

---

## 3. Schemat zapisu gry (`Save`)

```ts
type SlotId = "1" | "2" | "3";
type LegacyModuleId = "Warsztat" | "Medyczny";
type CreatorModuleId = LegacyModuleId | "Komunikacja";
type ModuleId =
  | "Crafting"
  | "Medstation"
  | "Stash"
  | "Silniki"
  | "Komunikacja"
  | "Hydroponika"
  | "Safe system";
type TutorialStepId =
  | "equip"
  | "accept"
  | "turnin"
  | "buy"
  | "sell"
  | "upgrade"
  | "skills"
  | "hydro"
  | "rest"
  | "launch";
type QuestState = "active" | "completed"; // brak wpisu = "available"
type EquipSlotId = "armor" | "ranged" | "ranged2" | "melee" | "gear";

interface ItemInstance {
  uid: string;          // unikalny identyfikator instancji
  id: string;           // klucz z ITEMS
  x?: number;           // pozycja w kontenerze (tylko itemy w kontenerze)
  y?: number;
  r?: 0 | 1;            // 0 = orientacja bazowa, 1 = obrócona
  qty: number;          // zawsze >= 1
}

interface Container {
  w: number;
  h: number;
  grow: boolean;        // magazyn rośnie w dół, gdy brak miejsca
  items: ItemInstance[];
}

interface EquippedItem {
  uid: string;
  id: string;
  r: 0 | 1;
  qty: 1;               // sprzęt nigdy się nie stackuje
}

interface Equipped {
  armor: EquippedItem | null;
  ranged: EquippedItem | null;
  ranged2: EquippedItem | null; // wymaga holster w "gear"
  melee: EquippedItem | null;
  gear: EquippedItem | null;
}

interface HideoutTutorial {
  started: boolean;
  done: boolean;
  completed: Partial<Record<TutorialStepId, boolean>>;
  startedAt: number;
  grantGiven: boolean;       // czy przyznano 250 kr + rację
  funds?: number;            // 250
  startSupplies?: boolean;   // czy przyznano materiały startowe
  finishedAt?: number;
}

interface ShipModuleState {
  active: boolean;
  level: number;
}

interface SkillState {
  level: number;
  xp: number;
}

interface HydroponicsState {
  lastCheck: number;   // obecnie tylko zapisywane; brak automatycznego cyklu produkcji
  food: number;        // gotowe racje do zebrania
  water: number;       // gotowe "woda" (bandaże) do zebrania
}

interface Save {
  // Kreator postaci
  name: string;
  gender: "m" | "f" | "";
  planet: "TRAPPIST-1 e" | "Kepler-452 b" | "Ross-128 b" | "";
  traits: string[];              // nazwy/ID z PERKS
  points: number;                // bilans cech, start -1
  kit: string;                   // klucz z KITS
  module: CreatorModuleId;       // "Warsztat" | "Medyczny" | "Komunikacja"

  // Statystyki
  hp: number;
  maxHp: number;
  credits: number;
  hunger: number;                // obecnie tylko przechowywane, brak konsumpcji w rajdzie
  thirst: number;                // j.w.
  level: number;
  xp: number;
  raids: number;
  deaths: number;
  maxSkillCap: number;            // 12/15/18 na podstawie perków, domyślnie 15

  // Postęp
  tutorialDone: boolean;          // ukończono misję treningową na Marsie
  hideoutTutorial?: HideoutTutorial;
  tutorialModule?: "Crafting" | "Medstation";
  quests: Record<string, QuestState>;
  completedQuests: string[];      // inicjalizowane, obecnie nieużywane

  // Baza
  ship: { modules: Record<ModuleId, ShipModuleState> };
  skills: Record<string, SkillState>; // brakujące wpisy dopełniane z SKILLS
  traitBonusesApplied: boolean;
  hydroponics: HydroponicsState;

  // Ekwipunek
  equipped: Equipped;
  stash: Container;               // grow = true
  loadout: Container;             // grow = false, startowo 8 x bagRows
  kitGiven: boolean;
  lastLoadout: Array<{ id: string; qty: number }>;
}
```

### 3.1. Przykładowy nowy zapis (po `normalizeSave`, przed pierwszą misją)

```json
{
  "name": "Ava",
  "gender": "f",
  "planet": "TRAPPIST-1 e",
  "traits": ["Silny"],
  "points": 0,
  "kit": "Myśliwiec Zwiadowczy",
  "module": "Komunikacja",
  "hp": 100,
  "maxHp": 100,
  "credits": 500,
  "hunger": 100,
  "thirst": 100,
  "level": 1,
  "xp": 0,
  "raids": 0,
  "deaths": 0,
  "maxSkillCap": 15,
  "tutorialDone": false,
  "quests": {},
  "completedQuests": [],
  "ship": {
    "modules": {
      "Crafting": { "active": false, "level": 0 },
      "Medstation": { "active": false, "level": 0 },
      "Stash": { "active": true, "level": 1 },
      "Silniki": { "active": false, "level": 0 },
      "Komunikacja": { "active": true, "level": 1 },
      "Hydroponika": { "active": true, "level": 1 },
      "Safe system": { "active": false, "level": 0 }
    }
  },
  "skills": {
    "sila": { "level": 1, "xp": 0 },
    "wytrzymalosc": { "level": 0, "xp": 0 },
    "witalnosc": { "level": 0, "xp": 0 },
    "przeszukiwanie": { "level": 0, "xp": 0 },
    "percepcja": { "level": 0, "xp": 0 },
    "bronPalna": { "level": 0, "xp": 0 },
    "medycyna": { "level": 0, "xp": 0 },
    "inzynieria": { "level": 0, "xp": 0 },
    "metabolizm": { "level": 0, "xp": 0 },
    "przetrwanie": { "level": 0, "xp": 0 }
  },
  "traitBonusesApplied": true,
  "hydroponics": { "lastCheck": 1730000000000, "food": 1, "water": 1 },
  "equipped": {
    "armor": null,
    "ranged": null,
    "ranged2": null,
    "melee": null,
    "gear": null
  },
  "tutorialModule": "Crafting",
  "stash": { "w": 10, "h": 12, "grow": true, "items": [] },
  "loadout": {
    "w": 8,
    "h": 5,
    "grow": false,
    "items": [
      { "uid": "abc123", "id": "pistol", "x": 0, "y": 0, "r": 0, "qty": 1 },
      { "uid": "def456", "id": "ammo9", "x": 2, "y": 0, "r": 0, "qty": 12 },
      { "uid": "ghi789", "id": "armor_damaged", "x": 3, "y": 0, "r": 0, "qty": 1 },
      { "uid": "jkl012", "id": "bandage", "x": 6, "y": 0, "r": 0, "qty": 1 }
    ]
  },
  "kitGiven": true,
  "lastLoadout": [
    { "id": "pistol", "qty": 1 },
    { "id": "ammo9", "qty": 12 },
    { "id": "armor_damaged", "qty": 1 },
    { "id": "bandage", "qty": 1 }
  ]
}
```

Po pierwszym udanym rajdzie treningowym pojawia się:

```json
{
  "tutorialDone": true,
  "hideoutTutorial": {
    "started": true,
    "done": false,
    "completed": {},
    "startedAt": 1730000000000,
    "grantGiven": true,
    "funds": 250,
    "startSupplies": true
  }
}
```

Po ukończeniu tutorialu schronu:

```json
{
  "hideoutTutorial": {
    "started": true,
    "done": true,
    "completed": {
      "equip": true, "accept": true, "turnin": true, "buy": true,
      "sell": true, "upgrade": true, "skills": true, "hydro": true,
      "rest": true, "launch": true
    },
    "startedAt": 1730000000000,
    "grantGiven": true,
    "funds": 250,
    "startSupplies": true,
    "finishedAt": 1730000500000
  }
}
```

---

## 4. Kontrakt normalizacji (`normalizeSave`)

`normalizeSave(s)` jest wywoływane:

1. przy tworzeniu postaci (`js/player.js` → `finishCreation`),
2. przy każdym `loadSave()`.

Kolejność operacji:

1. Domyślne pola: `traits`, `maxHp`, `hp`, `credits`, `hunger`, `thirst`, `level`, `xp`, `raids`, `deaths`, `tutorialDone`, `quests`, `completedQuests`.
2. Wyliczenie `maxSkillCap` z perków (`maxSkillCap`, domyślnie 15).
3. Inicjalizacja **7 modułów** w `s.ship.modules`:
   - zawsze istnieją wszystkie klucze,
   - `Stash` i `Hydroponika` startują na poziomie 1,
   - `Komunikacja` jest `active: true`, ale poziom 0, chyba że wybrano ją na start (wtedy 1),
   - wybrany moduł (`s.module`) ma poziom 1.
4. Kompatybilność starych nazw:
   - `s.module === "Warsztat"` → `Crafting` poziom 1,
   - `s.module === "Medyczny"` → `Medstation` poziom 1.
5. Inicjalizacja skilli z `SKILLS` (brakujące wpisy dostają `{ level: 0, xp: 0 }`).
6. Jednorazowe bonusy skilli z perków (`skillBonus`), flagowane `traitBonusesApplied`.
7. Inicjalizacja hydroponiki: `{ lastCheck, food: 1, water: 1 }`.
8. Normalizacja `s.equipped`:
   - każdy slot musi istnieć,
   - nieprawidłowy item lub niezgodny typ → `null`,
   - `ranged2` bez kabury → `null`,
   - stringi ze starych zapisów zamieniane na obiekty `EquippedItem`.
9. Wyliczenie `s.tutorialModule = tutorialTargetModule(s)`.
10. Jeśli `s.tutorialDone === true` i brak `hideoutTutorial`, utworzenie stanu tutorialu schronu.
11. Przeliczenie pojemności:
    - magazyn: `w/h` ustawiane dokładnie wg `stashSizeForLevel(Stash.level)`, `grow = true`,
    - plecak: bazowo `8 x playerStats(s).bagRows`, `grow = false`, a następnie `w = max(w, 8)` i `h = max(h, bagRows)`,
    - istniejące kontenery są zachowywane (te same obiekty), a ich wymiary są korygowane.
12. Jednorazowe wydanie zestawu startowego z `KITS[s.kit]`, flagowane `kitGiven`.
13. Jednorazowy grant tutorialu (`tutorialDone && hideoutTutorial && !done && !grantGiven`):
    - `+250 kr`,
    - `+1 ration` do magazynu,
    - `food/water = max(1, ...)`,
    - `grantGiven = true`, `funds = 250`.

**Ważne:** `normalizeSave` nie jest czystą funkcją — mutuje i uzupełnia obiekt. `loadSave` zapisuje wynik, więc każda nowa reguła migracyjna musi być idempotentna.

---

## 5. Schematy danych gry

### 5.1. `ITEMS` (`data/items.js`)

```ts
interface ItemDef {
  name: string;
  type: "consumable" | "ammo" | "weapon" | "armor" | "gear" | "junk" | "quest";
  size: [number, number];   // [szerokość, wysokość] w polach siatki
  value: number;            // bazowa wartość w kredytach
  stack?: number;           // maks. sztuk w jednym polu
  heal?: number;            // HP przy użyciu
  dmg?: [number, number];   // obrażenia broni
  acc?: number;             // 0..1 celność
  ammo?: string;            // ID amunicji dla broni palnej
  def?: number;             // redukcja obrażeń pancerza
  rarity?: "rare";
  quest?: boolean;          // przedmiot fabularny
  read?: "repair";          // czytelna instrukcja
  holster?: boolean;        // kabura odblokowuje slot ranged2
}
```

### 5.2. `KITS` (`data/items.js`)

```ts
const KITS: Record<string, Array<[itemId: string, qty: number]>>;
```

Zestaw jest dodawany do `loadout` tylko raz (`kitGiven`).

### 5.3. `RECIPES` (`data/items.js`)

```ts
interface Recipe {
  id: string;
  module: "Crafting" | "Medstation" | "Warsztat" | "Medyczny";
  minLevel: number;
  name: string;
  in: Array<[itemId: string, qty: number]>;
  out: [itemId: string, qty: number];
}
```

Crafting pobiera materiały **tylko z magazynu** (`save.stash`), nie z plecaka.

### 5.4. `LOOT` (`data/maps.js`)

```ts
interface LootEntry {
  id: string;
  w: number;    // waga losowania
  min: number;
  max: number;
}
type LootTable = LootEntry[];
const LOOT: Record<string, LootTable>;
```

Waga rzadkich przedmiotów (`ITEMS[id].rarity === "rare"`) jest mnożona przez `playerStats(s).rareMult`.

### 5.5. `MAPS` (`data/maps.js`)

```ts
interface MapRepair {
  manual: string;
  parts: string[];
  steps: string[];
}

interface MapNode {
  name: string;
  desc: string;
  exits: string[];
  loot?: { table: string; rolls: number };
  guaranteed?: Array<[itemId: string, qty: number]>;
  enemy?: { id: string; chance: number };  // chance 0..1
  hazard?: { type: "frost" | "radiation" | "toxic"; dmg: number; label: string };
  extract?: boolean;
  extractRequires?: string;  // nazwa flagi w raid.flags
  repair?: boolean;
}

interface GameMap {
  name: string;
  tutorial?: boolean;
  tint?: string;
  start: string;
  intro: string;
  storm?: number;       // liczba akcji do burzy
  stormDmg?: number;
  repair?: MapRepair;
  tips?: Record<string, string>;
  tutorialModuleLoot?: Record<"Crafting" | "Medstation", Record<nodeId, Array<[itemId, qty]>>>;
  tutorialCommonLoot?: Record<nodeId, Array<[itemId, qty]>>;
  nodes: Record<string, MapNode>;
}
```

Mapy w projekcie: `tutorial`, `titan_dome`, `vega`.

### 5.6. `ENEMIES` (`data/enemies.js`)

```ts
interface EnemyDef {
  name: string;
  hp: number;
  dmg: [number, number];
  acc: number;          // 0..1
  xp: number;
  loot: string;         // klucz LOOT
  rolls: number;        // liczba rzutów na loot
  verb: string;
}
const ENEMIES: Record<string, EnemyDef>;
```

### 5.7. `TRADERS` (`data/traders.js`)

```ts
interface Trader {
  id: string;
  name: string;
  desc: string;
  stock: string[];      // ID przedmiotów
  buyMult: number;      // mnożnik ceny zakupu
  sellMult: number;     // mnożnik ceny sprzedaży
}
```

Kolejność tablicy `TRADERS` wyznacza odblokowanie:

| Poziom `Komunikacja` | Dostępni handlarze |
|---|---|
| 0 | `TRADERS[0]` (trader1) |
| 1 | `TRADERS[0..1]` (trader1, trader2) |
| ≥2 | wszyscy |

### 5.8. `QUESTS` (`data/traders.js`)

```ts
interface Quest {
  id: string;
  traderId: string;
  tier: 0 | 1;
  title: string;
  desc: string;
  req: Array<[itemId: string, qty: number]>;
  reward: {
    credits: number;
    xp: number;
    item?: string;
    itemQty?: number;
  };
}
```

Stan questa:

- brak wpisu w `save.quests` → `available`,
- `"active"` → przyjęty,
- `"completed"` → oddany i odebrany.

### 5.9. `SHIP_MODULES` (`data/ship.js`)

```ts
interface ModuleLevel {
  level: number;
  title: string;
  desc: string;
  cost: number;
  items: Array<[itemId: string, qty: number]>;
  size?: [number, number]; // tylko Stash
}

interface ShipModule {
  id: ModuleId;
  name: string;
  maxLevel: number;
  desc: string;
  levels: ModuleLevel[];
}
```

### 5.10. `SKILLS` (`data/skills.js`)

```ts
interface SkillDef {
  id: string;
  name: string;
  desc: string;
  maxLevel: number;
  xpFormula: (level: number) => number;
  statBonus: (level: number) => Record<string, number>;
}
```

### 5.11. `PERKS` / `HIDDEN_STATS_DEF` (`data/perks.js`)

```ts
interface PerkStat {
  stat: string;       // np. "luck" | "critChance" | "skillBonus" | "maxSkillCap"
  val: number;
  skill?: string;     // dla skillBonus
}

interface PerkDef {
  id: string;
  name: string;
  type: "pos" | "neg";
  points: number;     // ujemne = koszt, dodatnie = zysk
  desc: string;
  stats: PerkStat[];
}
```

`DEFAULT_PERKS` jest klonowane do mutowalnego `PERKS` (panel admina może nadpisywać).

---

## 6. Stan rajdu (runtime, nie zapisywany)

```ts
interface RaidState {
  node: string;
  prevNode: string | null;
  hp: number;
  bag: Container;                 // klon save.loadout
  ground: Record<string, Container>;
  visited: Record<string, boolean>;
  searched: Record<string, boolean>;
  cleared: Record<string, boolean>;
  flags: Record<string, boolean>;
  moves: number;
  kills: number;
  xp: number;
  enemy: RuntimeEnemy | null;
  listenMode: { enemyId: string; e: EnemyDef } | null;
  over: boolean;
  repairing: { progress: number; order: number[] } | null;
  activeSlot: "auto" | "ranged" | "ranged2" | "melee";
  weaponLocked: boolean;          // auto-walka blokuje zmianę broni
  weaponChoices: Array<{ slot: string; label: string }>;
  nodeShimmers: Record<string, boolean>;
  nodeSpawn: Record<string, boolean>;
  perceptionRolled: Record<string, boolean>;
  tutorialSupplies: string[];
  startLoadout?: Array<{ id: string; qty: number }>;
  usedAutoFight?: boolean;
}

interface RuntimeEnemy extends EnemyDef {
  id: string;
  hp: number;
  maxHp: number;
}
```

---

## 7. Stan UI schronu (runtime)

```ts
let curTrader: string;                 // ID aktualnego handlarza
let openModule: "Crafting" | "Medstation" | null;
let stashView: GridView | null;
let loadView: GridView | null;
let sellView: GridView | null;
let questFilterTier: "all" | 0 | 1;
const traderQty: Record<string, number>; // zapamiętane ilości suwaków
```

`GridView` pochodzi z `js/grid.js`:

```ts
interface GridView {
  el: HTMLElement;
  cont: Container;
  opts: {
    canMoveIn?: (inst: ItemInstance, from: GridView) => boolean;
    onMoveIn?: (inst: ItemInstance, from: GridView) => void;
    onSelect?: (inst: ItemInstance, view: GridView) => void;
    onChange?: () => void;
    onQuickMove?: (inst: ItemInstance, view: GridView) => void;
  };
}
```

---

## 8. Rekomendowane rozszerzenia schematu (niezaimplementowane)

Te pola nie istnieją obecnie. Warto je dodać przy następnej większej migracji:

```ts
interface SaveV2 extends Save {
  schemaVersion: number;          // np. 2
  createdAt: number;
  updatedAt: number;
  tutorial: {
    firstMissionDone: boolean;
    hideout: HideoutTutorial | null;
  };
  statistics: {
    questsCompleted: number;
    itemsCrafted: number;
    modulesUpgraded: number;
  };
  settings: {
    autoFightConfirm: boolean;
    reduceMotion: boolean;
  };
}
```

Nie dodawaj `schemaVersion` bez migracji — `normalizeSave` musi wtedy obsłużyć stare zapisy.
