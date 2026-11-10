# SPACE TARKOV RPG - PEŁNY HANDOFF

Wersja dokumentu: po wydaniu v.1.67.0 (kontenery magazynowe).
Ten dokument zastępuje `handoff.txt`, `HANDOFF.md` i `SCHEMA.md` (są nieaktualne, pochodzą z wcześniejszych sesji).
Język gry i komentarzy w kodzie: polski. Rozmowa z użytkownikiem: po polsku.

---------------------------------------------------------------
## 1. CZYM JEST GRA
---------------------------------------------------------------
Przeglądarkowa gra RPG-survival w klimacie sci-fi po wirusie **Szept**. Gracz tworzy postać, wysyła ją na
**rajdy** (misje na mapach, tryb turowy z eksploracją pokoi), wraca do **schronu** (huba), gdzie handluje,
wykonuje **zlecenia** handlarzy, rozwija **moduły bazy**, **umiejętności**, **hydroponikę** i **statek**.
Celem jest przetrwanie i odkrycie, skąd pochodzi Szept (fabuła w 49 misjach głównych).

Podstawowa pętla:
1. Kreator postaci (`creator.html`): imię (losowanie), płeć, zestaw startowy, moduł startowy (Medyczny / Warsztat / Hydroponika), punkty.
2. Samouczek na Marsie (`raid.html?map=tutorial`): napraw silnik statku, wystartuj. Samouczek zalicza się ewakuacją.
3. Schron (`hideout.html`): przewodnik zadaniowy po menu (raz), zlecenia, handel, moduły, galaktyka.
4. Rajd: poruszanie się W/A/S/D po węzłach mapy, przeszukiwanie, wydobycie, walka (QTE), minigry zadań, ewakuacja.
5. Po ewakuacji łup trafia do magazynu; po śmierci tracisz zestaw z rajdu i założony ekwipunek.

Zapis: `localStorage`, trzy sloty `saveSlot_1..3`, aktywny slot w `currentSlot`. Start gry: `index.html`.

---------------------------------------------------------------
## 2. STRUKTURA PLIKÓW
---------------------------------------------------------------
```
index.html          - start, wybór slotu zapisu (js/main.js)
creator.html        - kreator postaci (js/player.js)
hideout.html        - schron/hub: wszystkie ekrany, mapa galaktyk (js/hideout.js)
raid.html           - rajd (js/raid.js)
admin.html          - edytor danych gry (js/admin.js, css/admin.css)
tutorial-raid.html  - stary ekran samouczka (nieużywany w głównym przepływie)

css/style.css       - jedyny główny styl. Dopiski na końcu, w blokach "=== vNN: opis ===".
                      Zasada użytkownika: NIE zmieniać ogólnego stylu, tylko ulepszać.

data/items.js       - ITEMS (przedmioty), RECIPES (receptury Warsztatu)
data/enemies.js     - ENEMIES (wrogowie; pole strain = odmiana wirusa)
data/maps.js        - MAPS (mapy i węzły), LOOT (tabele łupu), MAP_REQUIREMENTS, MAP_TIERS,
                      MAP_SEGMENTS (dodatkowe pokoje), layoutMapGrid (układ siatki), setupEvac (ewakuacja)
data/traders.js     - TRADERS (handlarze, stock), QUESTS (wszystkie zlecenia), MAIN_QUESTS (fabularne)
data/dialogues_main.js - MAIN_DIALOGS (49 dialogów: offer/done), TRADER_IDLE (kwestie "Połącz się")
data/ship.js        - SHIP_MODULES (moduły bazy: poziomy, koszty, efekty)
data/skills.js      - SKILLS (10 umiejętności, xpFormula, statBonus)
data/perks.js       - PERKS (14 perków)
data/body.js        - BODY_EFFECTS (efekty na ciele), applyDamageToPart, naturalHealBody, cureBodyEffect
data/lore.js        - LORE (tekst fabularny: wirus Szept, odmiany) - dane, bez logiki

js/save.js          - normalizeSave, loadSave, writeSave, XP, statystyki, broń, pancerz, ekwipunek postaci,
                      TRADER_TIER_THRESHOLDS, getTraderTier
js/grid.js          - siatka ekwipunku (plecak, ziemia, magazyn): CELL, renderowanie kafelków, drag/rotate
js/ui.js            - wspólne: $(), log, infoInto, edgeGlow (efekt krawędzi)
js/dialogue.js      - silnik dialogów (playDialogue): portret + dymek, pisanie znak po znaku, wybory
js/daynight.js      - nakładka dnia/nocy i etykieta w rogu (applyDayNight)
js/icons.js         - ITEM_ICONS: SVG dla 15 podstawowych przedmiotów
js/wiki.js          - przycisk "W" i wyszukiwarka (przedmioty, wrogowie, zadania)
js/hideout.js       - schron: ekrany, handel, zlecenia, moduły, galaktyka, minigra hasha, klinika, progresja
js/raid.js          - silnik rajdu (patrz sekcja 6.2)
js/player.js        - kreator postaci
js/main.js          - ekran startowy i sloty
js/admin.js         - edytor danych (osobny, nie wpływa na grę)
```

Kolejność `<script>` ma znaczenie: dane (`data/*`) muszą być przed `js/*`. Wszystkie pliki są zwykłymi skryptami
(bez modułów ES), wszystko jest globalne. Nie ma bundlera ani `npm run build` - `vite.config.ts` i `src/` to
pozostałość po szablonie AI Studio i nie są używane. Zasada użytkownika: unikać plików `.ts`.

Skrypty hub (hideout.html): lore, skills, body, items, ship, enemies, maps, traders, perks, wiki, icons, grid, save,
ui, dialogue, dialogues_main, daynight, hideout.
Skrypty raid (raid.html): jak wyżej, bez dialogues_main, z raid.js na końcu.

---------------------------------------------------------------
## 3. ARCHITEKTURA TECHNICZNA
---------------------------------------------------------------
- **Brak frameworka.** DOM przez `$("id")` (= getElementById), tworzenie elementów przez `document.createElement`,
  część widoków przez `innerHTML` (SVG galaktyk, siatki schematów).
- **Stan rajdu**: globalne `let raid` (obiekt tworzony w `initRaid()`), nie zapisuje się do localStorage.
  Zapisywany jest tylko `save` (stan gracza). Po ewakuacji/śmierci `finish()` zapisuje do `save` i przekierowuje.
- **Stan gracza**: globalne `save` (załadowane przez `loadSave()` w save.js), zapisywane przez `writeSave(save)`
  (hideout używa `persist()`, który wywołuje writeSave i odświeża widok).
- **Ekrany schronu**: `showScreen(id)` przełącza `.active`; `goTo(screenId)` zmienia ekran, odświeża
  i wywołuje `markTour("visit_"+screenId)`. Ekran `hub-raid` = mapa galaktyk.
- **Mapy galaktyk** to SVG budowane funkcjami `showGalaxies`, `showMilky`, `showSol`, `showVega`, `showTau`,
  `showTitan`, `showExodus`, `showProgression`. Nawigacja przez atrybuty `data-go` (obsługa w `RMAP_GO`),
  `data-map` (mapa rajdowa -> `showMapDetail`), `data-planet` (planeta -> `showPlanetDetail`), `data-prog` (drzewko).
- **Dialogi**: `playDialogue(id, onEnd)` z dialogue.js. Dane wejściowe: `DIALOGUES[id]` (lista
  `{speaker, text}`) i `CHARACTERS[speaker]`. Zlecenia fabularne przez `mainDialogLines` (konwersja
  `k: t|n|p|choice` -> `speaker: trader|narrator|player`).
- **Nakładki**: dialog (z-index 9998), dzień/noc (5), etykieta dnia (6), przycisk wiki (9500), okno wiki (9499),
  dymek przewodnika (9000), minigra hasha (9999). Nie są w `style.css` - style wstrzykiwane przez JS
  (`ensureDialogueStyle`, `applyDayNight`, `wikiStyle`, `ensureBaseTourStyle`), żeby nie zmieniać głównego CSS.
- **Pętla czasu**: w rajdzie czas jest turowy (`tick()` przy każdej akcji), nie ma timera globalnego.
  Wyjątki z timerem: przeszukiwanie (2-3 s, `setTimeout`), QTE (`qteTimer`), auto-walka (`autoFightStepTimeout`),
  animacje dymków (`setInterval` w przewodniku).
- **Pamięć przeglądarki**: tylko `localStorage` dla zapisów. Brak IndexedDB.

---------------------------------------------------------------
## 4. SCHEMAT ZAPISU (obiekt `save`)
---------------------------------------------------------------
Uzupełniany i normalizowany w `normalizeSave()` (save.js). Najważniejsze pola:

| pole | typ | znaczenie |
|---|---|---|
| name, gender | string | dane postaci |
| level, xp | number | poziom i doświadczenie |
| hp, maxHp | number | zdrowie (maks. rośnie co 5 poziomów + witalność) |
| credits | number | kredyty |
| raids, deaths | number | liczniki (raids = liczba rajdów; używane jako "dzień" rynku) |
| kit, kitGiven | - | zestaw startowy |
| module | string | moduł startowy (Medstation / Crafting / Hydroponika) |
| stash | container | magazyn (`{w,h,items:[{id,qty,...}]}`) |
| loadout | container | zestaw na rajd (przed wyjściem) |
| equipped | object | założony ekwipunek: armor, ranged, ranged2, melee, activeWeapon |
| skills | object | umiejętności (poziom, xp) |
| traits, traitBonusesApplied | - | perki |
| quests | object | stan zleceń: "available" / "active" / "completed" |
| completedQuests | array | ukończone zlecenia |
| taskDone | object | czy zadanie minigry zaliczone (per zlecenie) |
| questCarry | object | ile z wymaganych przedmiotów zlecenia wyniesiono z rajdu (per zlecenie, per item) |
| traderRep | object | reputacja per handlarz (liczba punktów) |
| kills | object | zabici wrogowie per id (dla zleceń z polem kill) |
| totalKills | number | łączna liczba zabitych zarażonych (odblokowuje handlarzy) |
| tutorialDone | bool | samouczek zaliczony |
| mapsDone | object | mapy, z których wykonano udaną ewakuację (per id mapy) |
| hashImplemented | bool | kody Hash zaimplementowane (odblokowuje Bastion Tau f) |
| body | object | stan ciała: części z `hp` i `status` (lista efektów) |
| globalBuffs | object | aktywne bufy z rajdu (klucz -> pozostałe tury) |
| hydroponics | object | stan hydroponiki |
| ship | object | stan modułów statku (poziomy) |
| tour | object | flagi przewodnika po bazie (visit_*, bought, rested, tourSum) |
| baseTourDone | bool | przewodnik po bazie zakończony/pominięty |
| lastNight | bool | pora ostatniego rajdu (nakładka w schronie) |
| clinic | - | (brak trwałego stanu; klinika działa na `body`) |

Migracja: `normalizeSave` uzupełnia brakujące pola. Stare zapisy z dawnymi misjami głównymi nie były testowane.

---------------------------------------------------------------
## 5. DANE GRY (data/*) - STRUKTURA I ZAWARTOŚĆ
---------------------------------------------------------------
### 5.1 Przedmioty (ITEMS) - 83 pozycje
Pola: `name`, `type` (consumable, junk, tool, ammo, weapon, armor, valuable, quest), `size: [w,h]`, `value`,
opcjonalnie `stack`, `rarity: "rare"`, `quest: true` (przedmiot zadaniowy: nie wraca do magazynu po ewakuacji
i nie jest blokowany bramką łupu), `heal`, `cures: [efekty]`, `buff`, `buffDuration`, `tone` (kolor kafelka wg
przeznaczenia), `use` (opis działania), `dmg`, `acc`, `ammo` (dla broni palnej: id amunicji), `def` (pancerz).
Bronie (`type: "weapon"`, 16 pozycji) mają dodatkowo:
- `category` - kategoria z `WEAPON_CATEGORIES` (data/items.js): melee_short, melee_long, pistol, smg, shotgun,
  rifle, sniper, plasma, heavy, void. Funkcja `getWeaponCategory(id)` zwraca wpis kategorii albo `null`.
- Przypisanie: broń biała krótka (1x2) = Nóż, Pałka; broń biała długa (1x3 i większe) = Klucz, Łom, Maczeta,
  Topór, Ostrze Próżni; Pistolet P-9 i Rewolwer = pistol; Vex = smg; Striker = shotgun; ACR-K = rifle;
  Dragoon = sniper; Nova-7 = plasma; Helios i Caelum-X = heavy.
- Pole `tone` NIE jest używane przez bronie (kolor broni idzie z kategorii, patrz 6.4).

Konsumpcyjne (12): Racja (sytość), Bandaż, Bandaż uciskowy, Opatrunek hemostatyczny, Maść, Szyna usztywniająca,
Apteczka, Morfina, Adrenal-X, BleedStop, SaturnCola, Pakiet dekontaminacyjny. Każdy ma inne działanie.
Ikony SVG: 15 podstawowych (`js/icons.js`).

### 5.2 Wrogowie (ENEMIES) - 11 pozycji
Pola: `name`, `hp`, `dmg: [min,max]`, `acc`, `def`, `loot` (nazwa tabeli LOOT), `strain` (odmiana wirusa),
`statusOnHit` (efekt na ciele, np. siniak), `boss: true` (Matka Archiwum: faza wściekłości i kwasowy atak),
`enraged`, `turns`.
Odmiany wirusa Szept: `umysl` (Myślący Tropiciel, Matka Archiwum), `furia` (Wściekły Biegacz, Nosiciel Żrącej Żółci,
Zmutowany Górnik Kopuły), `pustka` (Pusty Szwendacz, Pusty Pełzacz, Pusty Pluj, Pusty Kolos), `human`
(Szabrownik Pustkowi, Szabrownik Syndykatu Tytana). Pusta odmiana może zarazić trafioną część ciała (efekt
`szept`, 20% szansy).

### 5.3 Mapy (MAPS) - 13 pozycji
Każda mapa: `name`, `tint` (kolor tła minimapy), `start` (id pokoju startowego), `intro` (opis wejścia),
`tier` (poziom trudności 0-4; używany do skalowania wrogów i bramki łupu), `nodes` (pokoje), opcjonalnie
`storm`/`stormDmg` (burza po N ruchach), `tutorial: true`, `unlock: {trader, tier}`, `requiresHash: true`,
`requiresMap` (mapa, którą trzeba wcześniej ukończyć - ustawiane z MAP_REQUIREMENTS), `coords` (współrzędne
pokojów z layoutMapGrid), `evac: {minTurns, lever: {node, label}}` (ustawiane przez setupEvac).

Pokój (node): `name`, `desc`, `exits: [W, A, S, D]` (4 pozycje, `null` = brak wyjścia), `loot: {table, rolls}`,
`guaranteed: [[id, qty]]`, `enemy: {id, chance}`, `extract: true`, `extractRequires` (flaga z zadania, np. engineFixed),
`mine: {type, qty, label}`, `repair: true`, `gate: {type, label, intel}` (bramka minigry), `hazard`,
`choice: {text, options: [{label, to}]}`, `task: {type, label, map, node, key?, intel}` (zadanie minigry).

Pokoje dodatkowe (MAP_SEGMENTS) dodają po 3 pokoje do każdej mapy jako korytarz od jednego pokoju.

Lista map i tierów:
| mapa | tier | węzłów | start | odblokowanie |
|---|---|---|---|---|
| tutorial (Mars) | 0 | 8 | ship | tylko na start |
| titan_dome (Kopuła Tytana) | 1 | 13 | airlock_a | od początku |
| tau_e_colony (Osada Ecru) | 1 | 9 | pad | od początku |
| titan_mines (Kopalnia Prometeusz) | 2 | 11 | mine_entry | po Kopule |
| tau_e_factory (Fabryka Helix) | 2 | 10 | landing | po Osadzie Ecru |
| titan_archive (Archiwum) | 3.5 | 12 | arch_entry | po Kopalni + zaufanie Dr Vane'a T3 |
| vega (Wega-7) | 3 | 12 | dock | po Archiwum + Napęd Statku poz.1 + 1x Ogniwo paliwowe |
| vega_iv_glacier (Wega IV) | 3 | 8 | lock_air | po Fabryce Helix |
| tau_f_bastion (Bastion Tau f) | 4 | 9 | gate_pad | po Fabryce + zaimplementowane kody Hash |
| ziemia_clinic (Szpital Pierwszej Fali) | 3 | 7 | clinic_entry | zaufanie Dr Vane'a T2 |
| uran_armory (Stacja Obrony) | 3 | 7 | armory_gate | zaufanie Karrasa T2 |
| neptun_relay (Nadajnik) | 3 | 6 | relay_entry | zaufanie Val T2 |
| jowisz_depths (Podlodowy Skarbiec) | 3 | 6 | depth_lift | zaufanie Thorne'a T2 |

Uwaga: `titan_archive` i Wega-7 mają `tier` niecałkowity lub wyższy; `Math.floor` jest używany w setupEvac.

### 5.4 Ewakuacja (setupEvac, data/maps.js)
Każda mapa poza samouczkiem: start NIE jest wyjściem. Wyjście wymaga:
1. **Dźwigni** (`evac.lever.node`) - stały pokój, najdalszy od startu, nie-wyjście. Uruchamiana klawiszem **G**.
2. **Minimalnej liczby tur** (`evac.minTurns` = 8 + 2*tier + 2 jeśli >= 10 pokoi, max 16) - licznikiem `raid.moves`.
Jeśli mapa nie ma żadnego wyjścia poza startem, najdalszy pokój dostaje wyjście (`extract: true`).

### 5.5 Układ siatki (layoutMapGrid, data/maps.js)
Przy ładowaniu każda mapa jest układana w siatce BFS od startu, z preferencją oryginalnego kierunku wyjścia.
Połączenia między pokojami, które nie są sąsiadami w siatce, są usuwane. Wynik: `exits` i `coords` są zgodne:
wyjście W = pokój o (x, y-1), A = (x-1, y), S = (x, y+1), D = (x+1, y). **Minimapa czyta `MAP.coords`**, a przyciski
ruchu czytają `exits` - obie wersje pochodzą z tego samego układu (naprawa z ostatniej sesji).

### 5.6 Handlarze (TRADERS) - 8 pozycji
Pola: `id`, `name`, `desc`, `buyMult`, `sellMult`, `color`, `stock: {tier: [itemId...]}`.
Handlarze: trader1 Dr Jan Vane (medyczny, klinika), trader2 Sierżant Karras (rusznikarz), trader3 Inżynier Borys
(części), trader4 Kwatermistrz Nadia (pancerze), trader5 Haker Val (sieci), trader6 Kapitan Sławiński (straż),
trader7 Profesor Thorne (geolog), trader8 Szturmowiec Jax (szabrownik).
Reputacja: progi Tieru w `TRADER_TIER_THRESHOLDS = {1:240, 2:520, 3:800}` (js/save.js). Tier 0 = brak.
Odblokowanie handlarza: `TRADER_TREE` (hideout.js) - warunki mogą być: poziom postaci, umiejętność,
zabici wrogowie (`totalKills`), moduł Łączności, tier innego handlarza. Np. Karras wymaga 5 zabitych zarażonych.
Cena zakupu = `buyMult` x mnożnik rynku `marketMult(trId)` (0,85-1,20, zmienia się z liczbą rajdów) x rabat z Komunikacji.

### 5.7 Zlecenia (QUESTS) - 171 pozycji
Pola: `id`, `traderId`, `tier` (0-2), `phase` (1, 2, 3 lub "final"), `isMain` (fabularne), `title`, `desc`,
`req: [{id, qty}]`, `kill` (id wroga do pokonania), `task` (minigra: `type` terminal/hack/wires/memory, `map`, `node`,
`key` (dla terminala), `intel`), `needModule: {id, level}` (ulepsz moduł), `reward: {credits, xp, rep, item, itemQty}`.

Zasady:
- **Tier 0**: dozwolone kupowanie przedmiotów u handlarza i oddanie.
- **Tier 1+ i zlecenia fabularne**: wymagane przedmioty muszą być **wyniesione z rajdu** (licznik `questCarry`
  zapisywany przy udanej ewakuacji; liczą się tylko przedmioty znalezione w rajdzie - `raid.found`).
  Na karcie zlecenia widać "Ewakuuj się z X n/m".
- **Zlecenia fabularne (MAIN_QUESTS, 49)**: jedna misja naraz u handlarza; kolejna dopiero po ukończeniu poprzedniej.
  Każda ma dokładnie jeden cel: zabij (kill), minigra (task) albo ulepsz moduł (needModule); plus opcjonalnie oddanie przedmiotów.
  Przyjmowane i oddawane WYŁĄCZNIE przez rozmowę ("Połącz się"), nie automatycznie.
- Zlecenia niefabularne przyjmują się automatycznie (`autoAcceptQuests`).

### 5.8 Dialogi (data/dialogues_main.js)
`MAIN_DIALOGS[questId] = { offer: [...], done: [...] }` dla 49 misji fabularnych.
Linie: `{k:"t", text}` (handlarz), `{k:"n", text}` (narrator), `{k:"p", text}` (gracz, wolna odpowiedź),
`{choice: [{label, text}, ...]}` (wybór gracza; pierwsza opcja to tekst, który gracz wypowie przy zamianie na wolną odpowiedź).
Zasada: w offer muszą być nazwy przedmiotów, wróg do pokonania, minigra z nazwą węzła i wymagany moduł.
Charaktery handlarzy opisuje (poza repo) plik `traderPersonality.txt` od użytkownika.
`TRADER_IDLE[traderId] = [kwestia1, kwestia2]` - losowa kwestia na przycisk "Połącz się", gdy nic nie ma do zrobienia.

### 5.9 Moduły bazy (SHIP_MODULES) - 7
Crafting (Warsztat Craftingu, poz. max 4), Medstation (Stacja Medyczna, 3), Stash (Magazyn, 5), Silniki (Napęd Statku, 3),
Komunikacja (Łączność i Zlecenia, 4 - odblokowuje zlecenia, zniżki), Hydroponika (Farma, 6), Safe system (Radar Intel, 3).
Ulepszenie: `upgradeModule(modId)` w hideout.js, koszt z `ship.js`.

### 5.10 Umiejętności (SKILLS) - 10
sila, wytrzymalosc, witalnosc (+3 maks. HP za poziom), przeszukiwanie, percepcja, bronPalna, medycyna, inzynieria,
metabolizm, przetrwanie. XP: `grantSkillXp(save, id, amount)`; wymagania: `xpFormula(lvl)` (z awaryjnym `skillXpReq`).

### 5.11 Perki (PERKS) - 14, efekty ciała (BODY_EFFECTS) - 9
Efekty: szept, krwawienie, mocne_krwawienie, siniak, podraznienie, zlamanie, strach, bleedStop, saturnCola.
(bleedStop i saturnCola to bufy traktowane jak efekty w tym samym słowniku.)
Odpoczynek (`rest()`) usuwa siniaki, podrażnienia i strach; krwawienie znika; mocne krwawienie zmienia się w zwykłe;
złamanie i szept zostają. Resztę leczy **klinika** (Dr Vane, sekcja w panelu handlarza): krwawienie 150 kr,
mocne krwawienie 300 kr, złamanie 500 kr, szept 1000 kr.

### 5.12 Receptury (RECIPES) - 20
Warsztat Craftingu (poziom 1-4). Przykład: r_splint (Szyna usztywniająca: 2 złom + 2 szmaty).

### 5.13 Tabele łupu (LOOT)
Tabele: wreck, junk, supply, medical, tech, military, boss_archive, zombie, raider, titan_infected, titan_spitter,
titan_brute, titan_military. Losowanie: `rollLoot(table, rolls)` z bramką łupu (`itemLootTier` vs `MAP.tier`):
tani przedmiot (<=150) na każdej mapie, drogi i rzadki tylko na trudniejszych. Przedmioty z zadań nie są blokowane.
Wydobycie (`mineNode`) NIE przechodzi przez bramkę (rudy Tytana, Hel-3, ksenonit).

---------------------------------------------------------------
## 6. MECHANIKI GRY
---------------------------------------------------------------
### 6.1 Schron (hideout)
- **Ekrany**: hub-main (status, menu: Wyrusz, Ekwipunek, Handlarze, Misje, Moduły, Umiejętności, Hydroponika, Odpocznij),
  hub-inv (magazyn i ekwipunek), hub-trader (handel + zakładka misji), hub-quests, hub-ship (moduły), hub-skills,
  hub-hydro, hub-raid (galaktyka).
- **Ekwipunek**: siatka 2D, przeciąganie, obrót klawiszem R, dwuklik = szybki transfer, sortowanie magazynu.
  Opis przedmiotu pokazuje `use`, leczenie, bufy i wymagany poziom.
- **Handel**: `buyFromTrader`, `sell`, ceny z mnożnikiem rynku; zakładka "Drzewo handlarzy" (SVG z krawędziami
  odblokowania); `traderDetail` opisuje warunki.
- **Klinika** (u Dr Vane'a): leczenie efektów ciała za kredyty.
- **Hydroponika**: uprawy w czasie (`harvestHydro`), zapas żywności.
- **Moduły**: poziomy ulepszeń, koszty, efekty (np. Medstation odblokowuje kreację leków, Crafting receptury).
- **Odpoczynek**: `rest()` - leczy HP i usuwa część efektów; zużywa zasoby.
- **Galaktyka** (hub-raid): widoki Droga Mleczna (Sol, Vega, Tau Ceti), Wirlpool M51 (puste), Titan, Exodus.
  Planety z lokacjami mają stałe etykiety; reszta po najechaniu. Panel planety (`showPlanetDetail`) pokazuje opis
  i przyciski map. Blokady: `mapLockReason(id)` (wymaga mapy, zaufania, Napędu, paliwa, kodów Hash).
- **Progresja** (przycisk "Progresja Map"): schemat drzewka (`showProgression`) - węzły odblokowane/zablokowane,
  zielone krawędzie, klik = powód blokady. Układ ręczny (PROG_LAYOUT), połączenia z MAP_REQUIREMENTS.
- **Minigra "Protokół Hash"** (`startHashMinigame`): przedmiot `hash_codes` (2x2) z magazynu. 3 rundy zapamiętywania
  ciągu znaków, 3 życia. Sukces zużywa kody i ustawia `save.hashImplemented`.
- **Przewodnik po bazie** (`BASE_TOUR_STEPS`): po ukończeniu samouczka, raz. Zadaniowy: załóż wyposażenie, otwórz
  Misje, kup przedmiot, ulepsz moduł, odpocznij, otwórz wyprawę. Zawiesza się przy wejściu na inny ekran.
- **Wiki** (przycisk "W" w lewym górnym rogu, `js/wiki.js`): wyszukiwanie przedmiotów (3 mapy z największym
  oczekiwanym łupem, sklepy, zlecenia), wrogów (mapy i pokoje), przedmiotów zadaniowych.
- **Dzień/noc**: nakładka i etykieta w rogu (`applyDayNight`), pora z ostatniego rajdu.

### 6.2 Rajd (raid.js)
**Start**: `initRaid()` - `raid = {node, hp, bag (kopia loadout), ground, visited, searched, cleared, flags,
moves, kills, xp, enemy, stealthMode, unawareTurns, autoFighting, over, repairing, ...}`.
Pora dnia (`raid.isNight`, 50%) wpływa na ciche ataki (80% vs 65%).

**Ruch**: klawisze W/A/S/D -> `exits[0..3]`. `move(id)` -> `enterNode(id)`. Każdy ruch to tura (`tick()`):
licznik `raid.moves`, opadanie hałasu, burza (jeśli mapa ma `storm`), efekty ciała (`dmgPerTurn`), bufy (`sytosc` = +3 HP/turę).
Pokój: wchodzisz -> `visited`, może wypaść łup (rollLoot), wróg (`startCombat`, szansa `enemy.chance`),
zdarzenie losowe (15% dla pustego pokoju: `rollNodeEvent`), bramka, wybór (`choice`), zadanie (`task`).

**Przeszukiwanie** (X): `search()` -> 2-3 s animacji (pasek w logu, blokada ruchu i ataku) -> `doSearch(nodeId)`:
łup do ziemi (`addGround`), zapis `raid.found` (liczy się do zleceń).

**Wydobycie** (M): `mineNode()` - surowce z węzła z `mine` (raz na węzeł).

**Walka**: wróg ma `hp`, `dmg`, `acc`. Gracz: `attack()` (ręczny, broń z `getActiveWeaponObject`),
broń palna zużywa amunicję z plecaka i bez niej nie strzela; broń biała (`FISTS` jako domyślna).
QTE (`triggerQTE`): szansa `qteChance()` (wyższa przy niskim HP). Ucieczka (F, `flee()`).
Pancerz zmniejsza obrażenia (`bestArmor`). Ukrycie (stealth): cichy atak (`stealthAttack`).
Hałas z ataków przyciąga Pustych (`attractPustych`).
Auto-walka (Q): `stepAutoFight()` - używa leków tylko gdy są potrzebne (`itemUsefulNow`), przy braku amunicji
przechodzi na broń białą.
Skalowanie wrogów: `DIFF_MULT` wg `MAP.tier` (0.8 - 1.9).

**Leczenie w walce**: `useInst(inst)` - działanie przedmiotu (leczenie, leczenie efektów, bufy).

**Ewakuacja**: patrz 5.4. Dźwignia (G), potem wyjście (`extract()`, przycisk na pokoju z `extract: true`).
Samouczek: wyjście od startu (`extractRequires: engineFixed`), bez tur i dźwigni.
Udana ewakuacja: `finish(true)` - łup do magazynu, zapis `mapsDone`, `questCarry`, `tutorialDone` (dla samouczka).
Śmierć: `die()` -> `finish(false)` - tracisz zestaw rajdowy i założony ekwipunek.

**Minigry zadań** (`openTask`, `terminalPick`, `hackStop`, `wirePickLeft`, `memoryPick`): terminal (odczyt klucza z logu),
włamanie (wskaźnik w zielonym polu), przewody (łączenie kolorów), pamięć (zapamiętaj i powtórz sekwencję).
Zaliczenie zapisuje `taskDone[questId]`. Gate (`openGate`) to bramka tego samego typu, otwierana przy wejściu.

**Naprawa** (`startRepair` / `repairStep`): w węzłach z `repair: true`.

**Wybór** (`choice`): `pickChoice` - zmiana pokoju wg opcji.

**Minimapa** (`renderMinimap`): odwiedzone pokoje, znane wyjścia (`?`), bieżący pokój, etykiety klawiszy
na połączeniach. Współrzędne z `MAP.coords`.

**Śmierć i koniec**: `finish(success)` pokazuje ekran końca (`renderEnd`).

**Ukryty skrót testowy**: 5x P na Marsie (`testSkipMars`) - dodaje cały łup Marsa, zalicza samouczek,
podbija `totalKills` do 5 (odblokowuje Rusznikarza). NIE jest w interfejsie. Usunąć przed wydaniem produkcyjnym.

### 6.4 Wygląd broni (kafelki ekwipunku)
- `grid.js` (renderGrid i duch przeciągania) dodaje klasę `it-cat-<kategoria>` do kafelka broni.
- `css/style.css`, blok `v1.66.0` na końcu: reguły `.it-weapon.it-cat-*` z `border-style: dashed`,
  `border-width: 2px` i kolorem ramki/tła wg kategorii. Ogólna klasa `.it-weapon` (amber) zostaje jako fallback.
- Grubość 1.25px i 1.5px NIE działa: Chromium zaokrągla `border-width` do pełnych pikseli (sprawdzone
  w headless Chromium, 1x i 2x). Dlatego ramka to 2px.
- Testowanie wyglądu: headless Chromium (playwright) na prawdziwym magazynie, patrz sekcja 9.

### 6.5 Kontenery magazynowe (v.1.67.0)
- Kontener to przedmiot `type: "container"` w ITEMS. `size` = wymiar zewnętrzny (zajmuje miejsce w magazynie),
  `container.inner` = wnętrze [w,h], `container.label` = opis dla gracza, filtr: `container.ids` (lista
  przedmiotów) albo `container.types` (typy). Kontenery nigdy nie mieszczą się w kontenerach (containerAccepts).
- Instancja kontenera ma pole `inner` = `{w,h,grow,items}` (zwykły kontener siatki). `addToContainer` dodaje je
  automatycznie, `ensureInner` (wywoływane w `toContainer`) dopina je starym zapisom.
- Obecne kontenery: Medicine Case 3x3 (wnętrze 5x6, tylko leki, cena stała 4500 kr u Dr Jana tier 1),
  Weapon Case 2x4 (wnętrze 7x6, tylko broń, cena stała 6000 kr u Karrasa tier 1), Ammo Case 2x2 (wnętrze 5x5,
  amunicja), Cardboard Box 3x3 (wnętrze 7x7, junk/valuable/tool, bez broni i leków).
- Otwieranie: zaznacz kontener w magazynie, przycisk "Otwórz kontener" w panelu informacji. Panel
  `#container-panel` w hub-inv (`openContainer`, `closeContainer`, `refreshContainerPanel`). Przeciąganie
  i Dwuklik działają jak w zwykłym magazynie, a filtr sprawdza hak `canMoveIn` (dropCheck i quickMove).
- Liczenie i zdejmowanie przedmiotów (`countItem`, `removeById` -> `removeFromTree`) obejmuje kontenery,
  więc zadania i crafting widzą przedmioty w środku.
- Sprzedaż kontenera z zawartością jest zablokowana (najpierw opróżnij).
- Nagrody: pole `reward.bonusItem` (dodatkowa nagroda obok `reward.item`). Ustawione na finałach:
  q0_t3_final (Cardboard Box), q1_t1_final (Medicine Case), q1_t2_final (Weapon Case), q2_t2_final (Ammo Case).
- Ograniczenie: w rajdzie kontenery są zwykłymi przedmiotami bez panelu. Ich zawartość wraca do magazynu
  po rajdzie, ale nie jest liczona przy zbieraniu zadań rajdowych ani używana w walce.

### 6.3 Ekonomia i postęp
- Kredyty: sprzedaż łupu, nagrody zleceń, klinika (koszt).
- Reputacja: punkty za zlecenia (rep w `reward`), progi Tieru 1/2/3 (240/520/800).
- Poziom postaci: XP z rajdów i zadań; co 5 poziomów +10 maks. HP; witalność +3 HP/poziom.
- Crafting: receptury wymagają Warsztatu na odpowiednim poziomie.
- Rynek: mnożnik cen zmienia się z liczbą rajdów (`marketMult`).

---------------------------------------------------------------
## 7. EKRANY I UI - SZCZEGÓŁY
---------------------------------------------------------------
- **Dialog** (`playDialogue`): portret po lewej (placeholder = inicjał, gdy brak grafiki), dymek po prawej z imieniem
  mówiącego, pisanie znak po znaku. Klik/Enter/Spacja = dalej, klik w trakcie pisania = dokończ, Esc = pomiń.
  Wybór pojawia się jako przyciski. Wyborów w rozmowach jest mało (około połowy dialogów ma wybór).
- **Raid** (raid.html): lewa kolumna - log (terminal, pasek przeszukiwania), panel akcji 3x3 (klawisze 1-9),
  pasek broni i leczenia; prawa kolumna - minimapa, anatomia, plecak, ziemia, szczegóły przedmiotu.
  Przycisk "Wróć do schronu" po zakończeniu używa `location.replace` (rajd nie zostaje w historii).
- **Schemat ruchu**: aktywne przyciski ruchu = wyjścia z pokoju; W/A/S/D odpowiadają im 1:1.
- **Przycisk W** (wiki) i **nakładka dnia** działają na stronach schronu i rajdu.

---------------------------------------------------------------
## 8. HISTORIA WERSJI (SKRÓT, NAJNOWSZE NA KOŃCU)
---------------------------------------------------------------
Paczki są nazywane `space-tarkov-rpg v.1.x.y <słowo>` (jeden wyraz opisujący aktualizację).
Wcześniejsze numery (do v.1.59) to kolejne zipy `space-tarkov-rpg_vNN_*`.

- v.1.59.0 dialog - pierwsza rozmowa Dr Vane'a, skrót P na Marsie
- v.1.60.0 dialogi - dialogi dla wszystkich 49 misji fabularnych (przed tym tylko 32 saga)
- v.1.61.0 zycie - dialogi z wykrzyknikami/przekleństwami, cele zgodne z zadaniami, TRADER_IDLE
- v.1.62.0 wiki - przycisk W, wyszukiwarka
- v.1.63.0 ewakuacja - start poza ekstraktem, dźwignia G, minimalne tury, setupEvac
- v.1.63.1 mapa - czytelność etykiet minimapy
- minimapa czyta MAP.coords - naprawa rozjazdu kierunków A/D (ta paczka wydana jako część v.1.63.2)
- v.1.64.0 bronie - pierwsze kolory broni wg typu (tone), później wycofane w wersji kategorii
- v.1.64.1 / v.1.64.2 - poprawki kolorów i grubości (wersje robocze, zastąpione przez 1.66.x)
- v.1.65.0 kategorie - WEAPON_CATEGORIES i pole `category` dla 16 broni, getWeaponCategory()
- v.1.66.0 kolory-broni - kolory wg kategorii, przerywana ramka, klasa it-cat-* w grid.js
- v.1.66.1 naprawa - save.js: nadpisania `gameData_overrides` SCALAJĄ pola zamiast kasować wpis
  (stary zapis z panelu admina gubił category/tone; to była przyczyna "nic się nie zmienia")
- v.1.66.2 / v.1.66.3 - grubość ramki (1.25 / 1.5px, zaokrąglane przez przeglądarkę)
- v.1.66.4 obramowka - ramka broni 2px (1.5px niemożliwe w CSS, patrz 6.4)
- v.1.66.5 dokumentacja - aktualizacja tego dokumentu
- v.1.67.0 kontenery - Medicine/Weapon/Ammo Case i Cardboard Box, panel kontenera, filtry, nagrody finałów
  (patrz 6.5). Testy: logika w Node (filtry, zagnieżdżenie, liczenie) i headless Chromium (panel, ceny, nagroda)

Wcześniej (skrót): klinika (v.1.30+), progresja map i drzewka (v.1.4x), handlarze z drzewkiem SVG,
przewodnik po bazie, system zapisu zleceń, rozbudowa łupu, dzień/noc, pogłębiona walka (QTE, auto-walka),
ikony przedmiotów, bufy, 12 leków z własnym działaniem, bramka łupu wg poziomu mapy.

---------------------------------------------------------------
## 9. JAK TESTOWANO (I JAK POWTÓRZYĆ)
---------------------------------------------------------------
Testy w tej sesji były wykonywane w **Node.js** (nie w przeglądarce, poza kilkoma wcześniejszymi sesjami z Playwright):
1. **Składnia**: `node --check` na każdym `js/*.js` i `data/*.js`.
2. **Kolizje globalne**: skrypt ładujący skrypty strony w jednym kontekście `vm` i szukający
   `Identifier '...' has already been declared` (błąd wywala cały widok).
3. **Dane map**: wzajemność wyjść (`exits[d]` <-> `exits[opposite]`), osiągalność od startu, dźwignia i wyjście
   osiągalne, brak wyjścia na starcie (poza samouczkiem), współrzędne zgodne z kierunkami (216 wyjść na wszystkich mapach).
4. **Dane zleceń**: każde zlecenie fabularne ma cel (kill/task/needModule); wymagane przedmioty mają źródło
   (łup, sklep na właściwym tierze, wydobycie, gwarantowane); dialogi wymieniają przedmioty/wrogów/węzły
   (walidacja z tolerancją odmiany - patrz uwagi).
5. **Atrapa DOM** (Proxy zwracające pusty element dla każdego wywołania): uruchamia `initRaid()` i losowe ruchy
   (`move`, `attack`, `stepAutoFight`), `renderMinimap`, `showProgression`, `showGalaxies`, `progDetail`.
   Wykrywa wyjątki w logice. NIE sprawdza wyglądu ani klikania.
6. **Symulacje**: losowe przejścia po mapie z porównaniem pozycji sąsiadów z kierunkami wyjść (0 niezgodności).

Nie testowano w prawdziwej przeglądarce po wielu ostatnich zmianach (dialogi, wiki, ewakuacja, minimapa).
Priorytet przed wydaniem: uruchomienie `raid.html` i `hideout.html` w przeglądarce, przejście Marsa, pierwszej
rozmowy z Dr Vane'em, jednego rajdu z ewakuacją, otwarcia wiki.

Narzędzia testowe NIE są w repozytorium (były w /tmp): odtworzenie to ~80 linii kodu (vm + Proxy jako DOM).

---------------------------------------------------------------
## 10. ZNANE PROBLEMY I OTWARTE PUNKTY (PRIORYTETY)
---------------------------------------------------------------
Wysokie:
1. Brak testów w przeglądarce po ostatnich zmianach (patrz 9).
2. Minimapa - naprawa kierunków A/D wprowadzona w tej paczce, niezweryfikowana na ekranie.
3. Ukryty skrót P (5x na Marsie) - usunąć przed wydaniem.
4. Zlecenie Nadii "Ciężka Osłona" w opisie mówi o silosie, a węzeł zadania to schron kolonistów (bunker). Ujednolicić opis w traders.js.
5. Stare zapisy (sprzed v.1.5x) mogą nie przejść poprawnie na nową sekwencję misji fabularnych i łańcuchy map.

Średnie:
6. Balans nieprzetestowany: tury do ewakuacji (8-16), bramka łupu, ceny kliniki i rynku, progi reputacji.
7. Walidacja dialogów jest przybliżona (odmiana wyrazów); pozostałe drobne rozbieżności w nazwach przedmiotów w rozmowach.
8. Nazwy: część etykiet na mapie Układu Słonecznego nachodzi (Exodus Prime / Tytan) - kosmetyka.
9. Opis planety Uran (desc) może nadal opisywać dawną stację, która została przeniesiona na Tau Ceti f.
10. Wiki: ranking to przybliżenie (nie uwzględnia rzadkości ani mnożników); przycisk "W" może zasłaniać elementy UI.
11. Dźwignia ewakuacji jest stała (zawsze to samo miejsce). Można dodać klucz gwarantowany jako alternatywę.
12. Sekwencja i progresja Wegi-7 vs Archiwum: Archiwum wymaga zaufania Dr Vane'a T3 i jest w Sali Bossa dźwigni.

Niskie:
13. Dodatkowe opisy przedmiotów/wrogów (brak `desc` dla wrogów - tylko name, hp, dmg).
14. Dźwięk i animacje: brak dźwięku; animacje tylko CSS/SVG/JS.
15. Panel admin.html nie jest zsynchronizowany z najnowszymi polami danych (np. evac, tone, use).

---------------------------------------------------------------
## 11. KONWENCJE I ZASADY (OD UŻYTKOWNIKA)
---------------------------------------------------------------
- Rozmowa po polsku; odpowiedzi krótkie, konkretne.
- **Nie zmieniać ogólnego stylu CSS** - tylko ulepszać. Nowe style: dopisywać na końcu `css/style.css` w bloku
  `/* === vNN: opis === */` lub wstrzykiwać z JS (dialogi, wiki, dzień/noc, przewodnik).
- **Pliki .ts tylko w ostateczności** (nie są używane przez grę).
- Paczka wydania: cały folder gry w zip, nazwa `space-tarkov-rpg v.1.x.y <słowo>` (folder w środku zipa ma taką samą nazwę).
  Nie wysyłać pojedynczych plików.
- Funkcje ukryte (np. skrót P) nie mogą być opisywane w interfejsie ani w tekstach gry.
- Wykrzykniki, myślniki, wielokropki i łagodne przekleństwa w dialogach handlarzy są zamierzone (życzenie użytkownika).
- Zasada "wynieś z raidu": zlecenia tier 1+ i fabularne muszą być wykonane przez wyniesienie z rajdu, nie z zakupu.
- Zasada zleceń fabularnych: jeden cel (zabij / minigra / sprawdź / ulepsz) + opcjonalnie oddanie przedmiotów.
- Ewakuacja: nigdy na starcie (poza Marsem); dźwignia + minimalne tury; liczba tur zależy od mapy (8-16).
- Paczka wydania: nazwa `space-tarkov-rpg v.1.x.y <słowo>.zip`, w środku folder o tej samej nazwie.
- Kolory i wygląd: po zmianie CSS/JS sprawdzać w headless Chromium (zrzut magazynu), nie tylko składnię.

---------------------------------------------------------------
## 12. JAK DODAWAĆ TREŚCI
---------------------------------------------------------------
- **Przedmiot**: wpis w `ITEMS` (items.js) z `name`, `type`, `size`, `value`; dla konsumpcyjnych `use`, `tone`,
  `heal`/`cures`/`buff`. Opcjonalnie ikona: wpis w `ITEM_ICONS` (icons.js). Receptura: wpis w `RECIPES`.
- **Wróg**: wpis w `ENEMIES` z `strain`, dodać do tabeli łupu (`loot`) i do pokoju w `maps.js` (`enemy`).
- **Mapa**: wpis w `MAPS` z `tier`, `start`, `intro`, `nodes` (wyjścia w 4 slotach W/A/S/D lub dowolnie - layout
  i tak je ułoży); dodać do `MAP_REQUIREMENTS` (co trzeba wcześniej ukończyć) i `MAP_TIERS` oraz do galaktyki
  (przycisk w odpowiednim `show*` w hideout.js, PLANET_INFO, PROG_LAYOUT).
  Samo `setupEvac` nada dźwignię i tury.
- **Zlecenie**: wpis w `QUESTS` (traders.js) z `req`, `reward`, opcjonalnie `task`/`kill`/`needModule`.
  Fabularne: dodać do `MAIN_QUESTS` (kolejność = kolejność sekwencji u handlarza) i napisać dialog w `MAIN_DIALOGS`.
- **Dialog**: `MAIN_DIALOGS[questId] = {offer, done}`; ustawić cele w tekście (przedmioty, wróg, węzeł, moduł).
- **Handlarz**: wpis w `TRADERS` (stock per tier), w `TRADER_TREE` (warunki), w `CHARACTERS` (nazwa), w `TRADER_IDLE`.
- **Moduł bazy**: `SHIP_MODULES` (data/ship.js) + obsługa w hideout.js (renderModule, upgradeModule).
- **Efekt ciała**: `BODY_EFFECTS` (body.js) + ewentualnie `cureBodyEffect`, cena w `CLINIC_PRICES`.

---------------------------------------------------------------
## 13. KONTAKT Z PLIKAMI SPOZA REPOZYTORIUM
---------------------------------------------------------------
- `traderPersonality.txt` - charaktery handlarzy (użytkownik). Przy dodawaniu dialogów trzymać się tych charakterów.
- `zmiany_w_grze (2).txt` - dokumentacja poprzedniego AI (zmiany od v.1.5x). Historycznie przydatna, częściowo nieaktualna.
- Zipy wydań w `/mnt/user-data/outputs/` - jedyna kopia historii wersji.
- `gameData_overrides` (localStorage) - kopia danych z panelu admina. Ładowana przy starcie (save.js,
  loadOverrides). Scala pola przedmiotów, więc stare zapisy nie kasują nowych pól z kodu. Wpisy innych
  typów (enemies, maps, traders, quests, loot) nadal są podmieniane w całości - przy zmianie ich struktury
  trzeba to pamiętać, bo stara kopia może je nadpisać.

KONIEC DOKUMENTU.
