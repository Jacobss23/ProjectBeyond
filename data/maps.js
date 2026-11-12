// === SEKCJA: TABELE LOOTU ===
const LOOT = {
  wreck: [
    { id: "scrap", w: 30, min: 1, max: 3 },
    { id: "wires", w: 25, min: 1, max: 2 },
    { id: "ration", w: 20, min: 1, max: 2 },
    { id: "cloth", w: 15, min: 1, max: 3 },
    { id: "bandage", w: 10, min: 1, max: 1 },
    { id: "circuit", w: 8, min: 1, max: 1 },
    { id: "ancient_coin", w: 6, min: 1, max: 1 },
  ],
  junk: [
    { id: "scrap", w: 35, min: 1, max: 2 },
    { id: "cloth", w: 25, min: 1, max: 3 },
    { id: "wires", w: 20, min: 1, max: 2 },
    { id: "crowbar", w: 6, min: 1, max: 1 },
    { id: "combat_knife", w: 4, min: 1, max: 1 },
    { id: "sledge_heavy", w: 4, min: 1, max: 1 },
    { id: "ancient_coin", w: 5, min: 1, max: 1 },
  ],
  supply: [
    { id: "titan_ration", w: 15, min: 1, max: 2 },
    { id: "ration", w: 25, min: 1, max: 2 },
    { id: "bandage", w: 20, min: 1, max: 2 },
    { id: "ammo9", w: 18, min: 6, max: 14 },
    { id: "ammo12", w: 14, min: 4, max: 10 },
    { id: "medkit", w: 10, min: 1, max: 1 },
    { id: "circuit", w: 10, min: 1, max: 1 },
    { id: "pistol", w: 5, min: 1, max: 1 },
  ],
  medical: [
    { id: "nanite_serum", w: 6, min: 1, max: 1 },
    { id: "shield_gel", w: 12, min: 1, max: 2 },
    { id: "adrenal_patch", w: 10, min: 1, max: 1 },
    { id: "bandage", w: 30, min: 1, max: 3 },
    { id: "hemostatic", w: 25, min: 1, max: 2 },
    { id: "medkit", w: 20, min: 1, max: 1 },
    { id: "morphine", w: 15, min: 1, max: 1 },
    { id: "decontam_kit", w: 10, min: 1, max: 1 },
    { id: "stim_adrenal", w: 6, min: 1, max: 1 },
    { id: "diagnostic_scanner", w: 4, min: 1, max: 1 },
  ],
  tech: [
    { id: "neural_chip", w: 6, min: 1, max: 1 },
    { id: "circuit", w: 28, min: 1, max: 2 },
    { id: "wires", w: 25, min: 1, max: 3 },
    { id: "fuel_cell", w: 18, min: 1, max: 1 },
    { id: "titan_filter", w: 14, min: 1, max: 1 },
    { id: "data_chip", w: 10, min: 1, max: 1 },
    { id: "titan_fusion_core", w: 5, min: 1, max: 1 },
    { id: "gas_mask", w: 4, min: 1, max: 1 },
    { id: "quantum_core", w: 1, min: 1, max: 1 },
    { id: "titan_diamond", w: 1, min: 1, max: 1 },
    { id: "sapphire_tesla", w: 3, min: 1, max: 1 },
    { id: "platinum_wire", w: 4, min: 1, max: 1 },
    { id: "artifact_orb", w: 2, min: 1, max: 1 },
    { id: "emerald_xenon", w: 3, min: 1, max: 1 },
    { id: "meteor_iron", w: 3, min: 1, max: 1 },
    { id: "multitool", w: 5, min: 1, max: 1 },
    { id: "mining_drill", w: 3, min: 1, max: 1 },
    { id: "hack_deck", w: 1, min: 1, max: 1 },
    { id: "card_dome", w: 1, min: 1, max: 1 },
  ],
  military: [
    { id: "ammo9", w: 22, min: 8, max: 18 },
    { id: "ammo12", w: 20, min: 6, max: 12 },
    { id: "ammo556", w: 18, min: 8, max: 16 },
    { id: "pistol", w: 10, min: 1, max: 1 },
    { id: "shotgun", w: 8, min: 1, max: 1 },
    { id: "armor_vest", w: 7, min: 1, max: 1 },
    { id: "vest_kevlar", w: 5, min: 1, max: 1 },
    { id: "rifle_assault", w: 4, min: 1, max: 1 },
    { id: "medkit", w: 10, min: 1, max: 1 },
    { id: "lunar_pearl", w: 3, min: 1, max: 1 },
    { id: "golden_chalice", w: 2, min: 1, max: 1 },
    { id: "ancient_tablet", w: 1, min: 1, max: 1 },
    { id: "holo_portrait", w: 4, min: 1, max: 1 },
    { id: "pocket_watch", w: 3, min: 1, max: 1 },
    { id: "relic_old_earth", w: 1, min: 1, max: 1 },
    { id: "gold_ingot", w: 2, min: 1, max: 1 },
    { id: "rifle_orbit", w: 3, min: 1, max: 1 },
    { id: "plate_heavy", w: 1, min: 1, max: 1 },
    { id: "ruby_shard", w: 3, min: 1, max: 1 },
    { id: "diamond_ring", w: 1, min: 1, max: 1 },
    { id: "card_helix", w: 1, min: 1, max: 1 },
  ],
  boss_archive: [
    { id: "quantum_core", w: 6, min: 1, max: 1 },
    { id: "titan_diamond", w: 4, min: 1, max: 1 },
    { id: "ancient_tablet", w: 3, min: 1, max: 1 },
    { id: "artifact_orb", w: 5, min: 1, max: 1 },
    { id: "relic_old_earth", w: 3, min: 1, max: 1 },
    { id: "titan_fusion_core", w: 6, min: 1, max: 1 },
    { id: "ruby_shard", w: 4, min: 1, max: 1 },
    { id: "diamond_ring", w: 2, min: 1, max: 1 },
    { id: "card_vega", w: 2, min: 1, max: 1 },
  ],
  zombie: [
    { id: "cloth", w: 40, min: 1, max: 2 },
    { id: "scrap", w: 25, min: 1, max: 1 },
    { id: "ration", w: 10, min: 1, max: 1 },
    { id: "wires", w: 15, min: 1, max: 1 },
  ],
  raider: [
    { id: "ammo9", w: 30, min: 6, max: 14 },
    { id: "bandage", w: 20, min: 1, max: 2 },
    { id: "pistol", w: 10, min: 1, max: 1 },
    { id: "ration", w: 15, min: 1, max: 2 },
    { id: "data_chip", w: 5, min: 1, max: 1 },
  ],
  // Tytan specyficzne tabele lootu
  titan_infected: [
    { id: "infected_tissue", w: 35, min: 1, max: 2 },
    { id: "infected_tendon", w: 30, min: 1, max: 2 },
    { id: "cloth", w: 20, min: 1, max: 2 },
    { id: "pathogen_clot", w: 8, min: 1, max: 1 },
  ],
  titan_spitter: [
    { id: "toxic_bile", w: 40, min: 1, max: 2 },
    { id: "infected_tissue", w: 25, min: 1, max: 1 },
    { id: "pathogen_clot", w: 15, min: 1, max: 1 },
    { id: "titan_filter", w: 10, min: 1, max: 1 },
  ],
  titan_brute: [
    { id: "titan_fusion_core", w: 20, min: 1, max: 1 },
    { id: "scrap", w: 25, min: 2, max: 4 },
    { id: "pathogen_clot", w: 20, min: 1, max: 2 },
    { id: "axe_fire", w: 15, min: 1, max: 1 },
    { id: "vest_kevlar", w: 10, min: 1, max: 1 },
    { id: "plate_heavy", w: 6, min: 1, max: 1 },
    { id: "card_dome", w: 1, min: 1, max: 1 },
  ],
  titan_military: [
    { id: "ammo556", w: 25, min: 10, max: 20 },
    { id: "ammo12", w: 25, min: 6, max: 12 },
    { id: "shotgun", w: 12, min: 1, max: 1 },
    { id: "rifle_assault", w: 10, min: 1, max: 1 },
    { id: "stim_adrenal", w: 15, min: 1, max: 1 },
    { id: "vest_kevlar", w: 10, min: 1, max: 1 },
    { id: "rifle_orbit", w: 4, min: 1, max: 1 },
    { id: "card_vega", w: 1, min: 1, max: 1 },
  ],
  vault_rare: [
    { id: "ruby_shard", w: 4, min: 1, max: 1 },
    { id: "ancient_coin", w: 5, min: 1, max: 1 },
    { id: "lunar_pearl", w: 2, min: 1, max: 1 },
    { id: "diamond_ring", w: 2, min: 1, max: 1 },

    { id: "gold_ingot", w: 3, min: 1, max: 1 },
    { id: "titan_diamond", w: 2, min: 1, max: 1 },
    { id: "sapphire_tesla", w: 2, min: 1, max: 1 },
    { id: "golden_chalice", w: 1, min: 1, max: 1 },
    { id: "relic_old_earth", w: 2, min: 1, max: 1 },
    { id: "holo_portrait", w: 4, min: 1, max: 1 },
    { id: "pocket_watch", w: 4, min: 1, max: 1 },
  ],};

// === SEKCJA: MAPY ===
const MAPS = {
  tutorial: {
    name: "Mars - lądowanie awaryjne",
    tutorial: true,
    tint: "#7c2d12",
    start: "ship",
    intro: "[TUTORIAL] Planeta: Mars. Silnik statku jest uszkodzony. Znajdź części i napraw go.",
    repair: {
      manual: "manual",
      parts: ["part_injector", "part_coil", "part_gasket"],
      steps: [
        "Odetnij zasilanie",
        "Zamontuj uszczelkę komory",
        "Zamontuj wtryskiwacz plazmowy",
        "Podłącz cewkę zapłonową",
        "Uruchom rozruch",
      ],
    },
    tips: {
      start: "[TUTORIAL] Cel: znajdź Instrukcję serwisową i 3 części silnika (cele widać pod grafiką), potem napraw silnik przy statku.",
      hud: "[TUTORIAL] Lewa strona: terminal i akcje. Prawa strona: Plecak i Ziemia. Pasek HP jest na górze.",
      move: "[TUTORIAL] Ruch: klawisze [W], [A], [S], [D] lub kliknięcie. Klawisz [X] to przeszukanie, [R] to zabranie wszystkiego.",
      loot: "[TUTORIAL] Znaleziony loot leży na Ziemi. Przeciągnij przedmiot do Plecaka albo kliknij go dwukrotnie. R obraca.",
      combat: "[TUTORIAL] WALKA: [E] lub Spacja to Atak, [Q] to Auto-walka, [F] to Ucieczka. Przeciwnik odpowiada po twojej turze.",
      heal: "[TUTORIAL] Masz mało HP. Kliknij apteczkę lub bandaż w plecaku i wybierz Użyj.",
      repair: "[TUTORIAL] Masz części. Wróć do statku, kliknij Instrukcję serwisową w plecaku i wybierz Czytaj, potem Napraw silnik.",
      extract: "[TUTORIAL] Silnik działa. Wybierz Start na statku, aby zakończyć rajd.",
    },
    nodes: {
      ship: {
        name: "Statek",
        desc: "Awaryjnie osadzony wrak transportowca. Pancerz zewnętrzny jest nienaruszony, ale napęd plazmowy wymaga wymiany podzespołów.",
        exits: ["dunes", "ravine"],
        loot: { table: "wreck", rolls: 1 },
        guaranteed: [["manual", 1]],
        repair: true,
        extract: true,
        extractRequires: "engineFixed",
      },
      dunes: {
        name: "Wydmy",
        desc: "Czerwone marsjańskie pustkowie z ostrym pyłem kwarcowym. W oddali widać poskręcane szczątki satelity badawczego.",
        exits: ["ship", "wreck"],
        loot: { table: "junk", rolls: 1 },
        enemy: { id: "zombie_walker", chance: 1 },
      },
      wreck: {
        name: "Wrak sondy",
        desc: "Roztrzaskana kapsuła badawcza. Układy chłodzenia wciąż cicho syczą w suchym powietrzu.",
        exits: ["dunes", "depot"],
        loot: { table: "wreck", rolls: 1 },
        guaranteed: [["part_injector", 1]],
        enemy: { id: "zombie_crawler", chance: 0.5 },
      },
      ravine: {
        name: "Wąwóz",
        desc: "Ciemny, bazaltowy jar osłonięty przed bezpośrednim promieniowaniem słonecznym. Ślady walki i rozlana ciecz syntetyczna.",
        exits: ["ship", "depot"],
        loot: { table: "junk", rolls: 1 },
        guaranteed: [["part_gasket", 1]],
        enemy: { id: "zombie_crawler", chance: 0.6 },
      },
      depot: {
        name: "Magazyn",
        desc: "Opuszczona baza przeładunkowa korporacji Caelum. Kontenery logistyczne są częściowo splądrowane.",
        exits: ["ravine", "wreck"],
        loot: { table: "supply", rolls: 2 },
        guaranteed: [["part_coil", 1]],
        enemy: { id: "zombie_walker", chance: 0.7 },
      },
    },
  },

  // Nowa pełna mapa dostępna od razu po tutorialu: Księżyc Saturna - Tytan
  titan_dome: {
    name: "Tytan - Kopuła Nowy Ereb",
    tint: "#0f766e",
    start: "airlock_a",
    storm: 24,
    stormDmg: 5,
    intro: "[KOPUŁA TYTAN] Księżyc Saturna - Biosfera Nowy Ereb. Miasto pod ciśnieniową kopułą padło ofiarą Szeptu, wirusa, który od sześćdziesięciu lat przeskakuje między układami. Wściekli zarażeni z Szeptu-Furii patrolują korytarze, a dalej błąkają się puści z Szeptu-Pustki. Za 24 tury burza metanowa uszkodzi filtry śluzy.",
    nodes: {
      airlock_a: {
        name: "Śluza Sektora A",
        desc: "Główna komora dekompresyjna łącząca lądowisko z wnętrzem kopuły. Lampy awaryjne mrugają na żółto. Punkt ewakuacji zabezpieczony.",
        exits: ["concourse", "vent_tunnel"],
        loot: { table: "junk", rolls: 1 },
        extract: true,
      },
      concourse: {
        name: "Aleja Handlowa",
        desc: "Wielopoziomowy deptak handlowy zasypany szkłem i wrakami automatów. W cieniu słychać nieludzki, szaleńczy ryk biegnącego zakażonego.",
        exits: ["airlock_a", "subway", "apartments"],
        loot: { table: "supply", rolls: 2 },
        enemy: { id: "infected_runner", chance: 0.32 },
      },
      vent_tunnel: {
        name: "Tunel Wentylacyjny",
        desc: "Ciasny ciąg rurociągów filtracyjnych tlenu. Zardzewiałe kraty i plamy toksycznego kondensatu na ścianach.",
        exits: ["airlock_a", "hydro_park"],
        loot: { table: "tech", rolls: 2 },
        enemy: { id: "infected_stalker", chance: 0.2 },
      },
      vault_dome: {
        name: "Zamknięty Skarbiec Kopuły",
        desc: "Grube drzwi z logo Rady Kopuły. Czytnik mruga na czerwono i czeka na kartę dostępu.",
        exits: ["apartments"],
        keyLock: "dome",
        keyLabel: "Karta Kopuły Tytana",
        loot: { table: "vault_rare", rolls: 3 },
        guaranteed: [["rail_cannon", 1], ["ammo_rail", 10], ["ammo_rail", 10]],
        codeChance: 0.15,
      },
      apartments: {
        name: "Sektor Mieszkalny Hab-4",
        desc: "Wyważone grodzie bloków mieszkalnych. Wszędzie porzucone bagaże ewakuacyjne i ślady gwałtownej paniki mieszkańców.",
        exits: ["concourse", "hospital", "vault_dome"],
        loot: { table: "supply", rolls: 2 },
        enemy: { id: "infected_runner", chance: 0.3 },
      },
      subway: {
        name: "Stacja Kolejki Szynowej",
        desc: "Zalana metanem stacja szybkiej kolei kopuły. Wagoniki pociągu magnetycznego ugrzęzły w zablokowanym tunelu tranzytowym.",
        exits: ["concourse", "reactor_core"],
        loot: { table: "junk", rolls: 3 },
        enemy: { id: "infected_runner", chance: 0.28 },
      },
      hospital: {
        name: "Szpital Kwarantanny",
        desc: "Polowy oddział zakaźny. Wybite komory bio-izolacji, rozbity sprzęt podtrzymywania życia i kałuże żrącej żółci.",
        exits: ["apartments", "hydro_park", "quarantine_lab"],
        loot: { table: "medical", rolls: 3 },
        enemy: { id: "infected_spitter_heavy", chance: 0.34 },
      },
      quarantine_lab: {
        name: "Laboratorium Izolacji Biohazard",
        desc: "Wzmocniony bunkier badawczy w podziemiach szpitala. Tutaj wyizolowano szczep patogenu Tytana. Potężna sylwetka zmutowanego górnika stoi nad aparaturą.",
        exits: ["hospital"],
        loot: { table: "tech", rolls: 3 },
        guaranteed: [["pathogen_clot", 1]],
        enemy: { id: "infected_brute_miner", chance: 0.38 },
      },
      hydro_park: {
        name: "Zdziczały Ogród Biosfery",
        desc: "Syntetyczna roślinność przerosła alejki spacerowe. W gęstych paprociach bezgłośnie przemieszcza się drapieżny tropiciel.",
        exits: ["vent_tunnel", "hospital", "evac_pad"],
        loot: { table: "supply", rolls: 2 },
        enemy: { id: "infected_stalker", chance: 0.32 },
      },
      reactor_core: {
        name: "Rdzeń Termojądrowy Kopuły",
        desc: "Pomieszczenie generatora plazmowego. Przebite osłony reaktora emitują promieniowanie jonizujące. Szabrownicy próbują wyciąć ogniwa.",
        exits: ["subway", "evac_pad"],
        loot: { table: "tech", rolls: 3 },
        guaranteed: [["titan_fusion_core", 1]],
        enemy: { id: "titan_raider", chance: 0.3 },
        hazard: { type: "radiation", dmg: 7, label: "promieniowanie reaktora" },
      },
      evac_pad: {
        name: "Lądowisko Ewakuacyjne Kopuły",
        desc: "Górny pomost hangarowy z widokiem na mroźną metanową atmosferę Tytana i gigantyczne pierścienie Saturna na czarnym niebie.",
        exits: ["hydro_park", "reactor_core"],
        loot: { table: "military", rolls: 2 },
        extract: true,
      },
    },
  },

  vega: {
    name: "Stacja Badawcza Wega-7",
    tint: "#1e1b4b",
    start: "dock",
    intro: "[STACJA WEGA] Orbitalna placówka wojskowa. Wymaga sprawnego napędu statku.",
    nodes: {
      dock: {
        name: "Dok cumowniczy",
        desc: "Ciemna rampa rozładunkowa stacji. Migające światła awaryjne oświetlają rozbite grodzie ciśnieniowe.",
        exits: ["hall", "maint"],
        loot: { table: "junk", rolls: 1 },
      },
      hall: {
        name: "Korytarz centralny",
        desc: "Szeroki korytarz techniczny z widocznymi śladami pożaru instalacji elektrycznej.",
        exits: ["dock", "medbay", "crew"],
        loot: { table: "supply", rolls: 1 },
        enemy: { id: "zombie_walker", chance: 0.5 },
      },
      maint: {
        name: "Sektor serwisowy",
        desc: "Rurociągi chłodziwa plazmowego i szafy z narzędziami inżynieryjnymi.",
        exits: ["dock", "reactor"],
        loot: { table: "tech", rolls: 2 },
        enemy: { id: "zombie_crawler", chance: 0.5 },
      },
      vault_vega: {
        name: "Zamknięte Archiwum Wegi-7",
        desc: "Chłodne pomieszczenie z szafami pancerza testowego. Zamek elektroniczny wymaga karty Wegi-7.",
        exits: ["medbay"],
        keyLock: "vega",
        keyLabel: "Karta Wegi-7",
        loot: { table: "vault_rare", rolls: 3 },
        guaranteed: [["armor_singularity", 1]],
        codeChance: 0.15,
      },
      medbay: {
        name: "Skrzydło medyczne",
        desc: "Zdemolowane ambulatorium. Rozbite kapsuły kriogeniczne i porozrzucane medykamenty.",
        exits: ["hall", "lab", "vault_vega"],
        loot: { table: "medical", rolls: 2 },
        enemy: { id: "zombie_spitter", chance: 0.5 },
      },
      crew: {
        name: "Kwatery załogi",
        desc: "Opuszczone kabiny mieszkalne personelu stacji.",
        exits: ["hall", "lab"],
        loot: { table: "military", rolls: 1 },
        enemy: { id: "raider", chance: 0.7 },
      },
      lab: {
        name: "Laboratorium badawcze",
        desc: "Stanowiska badawcze z analizatorami próbek biologicznych.",
        exits: ["medbay", "crew", "pod"],
        loot: { table: "tech", rolls: 2 },
        enemy: { id: "zombie_brute", chance: 0.8 },
      },
      reactor: {
        name: "Komora reaktora",
        desc: "Pomieszczenie głównego reaktora fuzyjnego. Wysoki poziom skażenia radiacyjnego.",
        exits: ["maint", "airlock"],
        loot: { table: "tech", rolls: 3 },
        enemy: { id: "zombie_spitter", chance: 0.5 },
        hazard: { type: "radiation", dmg: 6, label: "promieniowanie" },
      },
      airlock: {
        name: "Śluza ewakuacyjna A",
        desc: "Kapsuła ratunkowa gotowa do wystrzelenia na orbitę.",
        exits: ["reactor"],
        extract: true,
      },
      pod: {
        name: "Śluza ewakuacyjna B",
        desc: "Pomost serwisowy doku awaryjnego.",
        exits: ["lab"],
        extract: true,
      },
    },
  },
  // Nowa kopalnia na Tytanie: Szyby Wydobywcze Prometeusz
  titan_archive: {
    name: "Tytan - Podziemne Archiwum Kolonii",
    tint: "#4c1d95",
    start: "arch_entry",
    viaTransit: "titan_mines",
    unlock: { trader: "trader1", tier: 3 },
    intro: "[ARCHIWUM] Zapomniane sekcje pod Kopułą. Chłodne korytarze, toksyczna mgła i zamknięte grodzie. Tu Szept nauczył się myśleć: zarażeni działają w grupach i zastawiają pułapki. Coś wciąż tu oddycha.",
    nodes: {
      arch_entry: {
        name: "Wejście do Archiwum",
        desc: "Stalowe drzwi, a za nimi woda z pękniętych rur. Tu jest wyjście, jeśli zechcesz się wycofać.",
        exits: ["hall_a", "flood_pass"],
        loot: { table: "junk", rolls: 1 },
        extract: true,
      },
      flood_pass: {
        name: "Zalany Przelot",
        desc: "Woda sięga kolan. Coś przemknęło pod powierzchnią.",
        exits: ["arch_entry", "gas_corr"],
        enemy: { id: "infected_runner", chance: 0.5 },
        loot: { table: "junk", rolls: 1 },
      },
      hall_a: {
        name: "Sala Katalogowa",
        desc: "Kartoteki rozsypane po podłodze. Pod sufitem miga awaryjne światło.",
        exits: ["arch_entry", "stacks", "gas_corr"],
        loot: { table: "tech", rolls: 1 },
        guaranteed: [["manual", 1]],
      },
      gas_corr: {
        name: "Korytarz Mgieł",
        desc: "Żółtawa mgła pali gardło. Bez filtra każdy krok kosztuje zdrowie.",
        exits: ["hall_a", "flood_pass", "vault_door"],
        hazard: { dmg: 7, type: "chem", label: "Toksyczna mgła", mask: "gas_mask" },
        loot: { table: "junk", rolls: 1 },
      },
      stacks: {
        name: "Regały z Danymi",
        desc: "Nośniki pamięci w przeszklonych gablotach. Część z nich wciąż działa.",
        exits: ["hall_a", "vault_door"],
        loot: { table: "tech", rolls: 2 },
      },
      vault_door: {
        name: "Grodzie Archiwum",
        desc: "Trzy grodzie w rzędzie. Panel sterowania miga czerwienią.",
        exits: ["stacks", "gas_corr", "boss_gate"],
        gate: { type: "wires", label: "Otwarcie grodzi", intel: "Grodzie odblokowane. Za nimi sala, z której wieje ciepłem." },
      },
      boss_gate: {
        name: "Za Ścianą",
        desc: "Za ścianą czuć coś. Rytmiczne uderzenia, ciepło i zapach ozonu.",
        exits: ["vault_door", "boss_hall"],
        choice: {
          text: "Za ścianą czuć coś. Rytmiczne uderzenia, ciepło. Coś tam czeka.",
          options: [
            { label: "1. Idź dalej", to: "boss_hall" },
            { label: "2. Zawróć", to: "vault_door" },
          ],
        },
      },
      boss_hall: {
        name: "Sala Matki",
        desc: "Ogromna komora pokryta gęstą pajęczyną kabli. W jej centrum coś się porusza.",
        exits: ["boss_gate", "arch_exit"],
        enemy: { id: "archive_mother", chance: 1, boss: true },
      },
      arch_exit: {
        name: "Ewakuacyjny Szyb Archiwum",
        guaranteed: [["hash_codes", 1]],
        desc: "Stara winda towarowa. Kabina wciąż działa.",
        exits: ["boss_hall"],
        extract: true,
      },
    },
  },
  titan_mines: {
    name: "Tytan - Głębokie Szyby Wydobywcze Prometeusz",
    tint: "#854d0e",
    start: "mine_entry",
    storm: 20,
    stormDmg: 6,
    intro: "[KOPALNIE TYTANA] Głębokie szyby winiarskie pod tektonicznym płaszczem Tytana. Bogate żyły rudy tytana, Helu-3 i rzadkiego Xenonitu. Użyj Głębinowego Chwytaka Plazmowego (Rękawicy Wydobywczej), aby pozyskiwać surowce. Sektor pełen niebezpiecznych zmutowanych górników.",
    nodes: {
      mine_entry: {
        name: "Śluza Wydobywcza Prometeusz",
        desc: "Wzmocniona wjazdowa grodź szybu głębinowego. Tory kolei przemysłowej znikają w ciemnej otchłani kopalni.",
        exits: ["shaft_a", "maint_depot"],
        loot: { table: "junk", rolls: 1 },
        extract: true,
      },
      shaft_a: {
        name: "Szyb Tytanowy A-1",
        desc: "Przemysłowa komora urabiania. Ściany szybu odsłaniają błyszczące żyły czystej rudy tytana.",
        exits: ["mine_entry", "cavern_helium", "crusher_room"],
        loot: { table: "tech", rolls: 1 },
        mine: { type: "ore_titanium", qty: 2, label: "Żyła Czystej Rudy Tytana" },
        enemy: { id: "infected_brute_miner", chance: 0.7 },
      },
      maint_depot: {
        name: "Baza Narzędziowa Górników",
        desc: "Zostawione stanowiska serwisowe chwytaków plazmowych i wiertnic. Szafy narzędziowe są partially nienaruszone.",
        exits: ["mine_entry", "cavern_helium"],
        loot: { table: "tech", rolls: 2 },
        guaranteed: [["mining_glove", 1]],
        enemy: { id: "infected_runner", chance: 0.6 },
      },
      cavern_helium: {
        name: "Kriogeniczna Grota Helu-3",
        desc: "Mroźna jaskinia z wyciekami szronu kriogenicznego. Skroplony izotop Hel-3 zbiera się w zagłębieniach skalnych.",
        exits: ["shaft_a", "maint_depot", "deep_xenonite"],
        loot: { table: "junk", rolls: 2 },
        mine: { type: "helium3", qty: 2, label: "Złoże Izotopu Hel-3" },
        enemy: { id: "infected_spitter_heavy", chance: 0.75 },
      },
      crusher_room: {
        name: "Hala Kruszarek i Sortowni",
        desc: "Olbrzymie walce kruszące i taśmociągi zasypane gruzem. Ciężki kurz metanowy unosi się w powietrzu.",
        exits: ["shaft_a", "deep_xenonite", "relic_vault"],
        loot: { table: "supply", rolls: 2 },
        enemy: { id: "infected_runner", chance: 0.8 },
      },
      deep_xenonite: {
        name: "Najgłębszy Szyb - Żyła Xenonitu",
        desc: "Najgłębszy punkt kopalni Prometeusz. Ściany lśnią tajemniczym, fioletowym blaskiem kryształów Xenonitu.",
        exits: ["cavern_helium", "crusher_room", "relic_vault"],
        loot: { table: "tech", rolls: 3 },
        mine: { type: "xenonite_crystal", qty: 1, label: "Rzadki Kryształ Xenonitu" },
        enemy: { id: "infected_brute_miner", chance: 0.9 },
      },
      relic_vault: {
        name: "Krypta Prastarych Minerałów",
        desc: "Bunkier skarbowy dawnej dyrekcji wydobywczej Caelum. W sejfie kriogenicznym spoczywają najrzadsze artefakty i kosztowności.",
        exits: ["crusher_room", "deep_xenonite", "arch_transit"],
        loot: { table: "military", rolls: 3 },
        enemy: { id: "infected_brute_miner", chance: 0.95 },
      },
      arch_transit: {
        name: "Transit: Przejście do Archiwum",
        desc: "Stary tunel serwisowy schodzący pod kopalnię. Grodź prowadzi do Podziemnego Archiwum Kolonii.",
        exits: ["relic_vault"],
        choice: {
          text: "Grodź do Archiwum. Za nią zimne korytarze i toksyczna mgła. Wejście wymaga zaufania Dr Jana Vane'a (Tier 2).",
          options: [
            { label: "1. Zejdź do Archiwum", transit: "titan_archive" },
            { label: "2. Zawróć", to: "relic_vault" },
          ],
        },
      },
    },
  },

  // === TRUDNE MAPY (trudność 3/5): każda na innej planecie, przygotowane pod Tier 2. Odblokowanie: zaufanie handlarza Tier 2 ===
  ziemia_clinic: {
    name: "Ziemia - Szpital Pierwszej Fali",
    tint: "#065f46",
    start: "clinic_entry",
    tier: 3,
    unlock: { trader: "trader1", tier: 2 },
    intro: "[ZIEMIA] Miejski szpital w ruinach dawnej dzielnicy, zamknięty grodziami w pierwszych godzinach pierwszej fali Szeptu. Dr Vane wierzy, że w starych magazynach leków zostało coś, co zatrzyma zarażenie. Nikt stąd od lat nie wrócił.",
    nodes: {
      clinic_entry: {
        name: "Śluza Izolatki",
        desc: "Drzwi z wyrwanym kodem wejściowym. Czerwone światło miga nad progiem, a na podłodze leżą porzucone maski.",
        exits: ["ward_a", "pharmacy"],
        loot: { table: "medical", rolls: 1 },
        extract: true,
      },
      ward_a: {
        name: "Sala Chorych A",
        desc: "Łóżka pod kroplówkami z popękanymi workami. Część pusta, część nie.",
        exits: ["clinic_entry", "pharmacy", "quarantine_ward"],
        enemy: { id: "infected_runner", chance: 0.8 },
        loot: { table: "medical", rolls: 2 },
      },
      pharmacy: {
        name: "Apteka Szpitalna",
        desc: "Półki wyczyszczone przez szabrowników, ale w szufladach zostało trochę morfiny.",
        exits: ["clinic_entry", "ward_a", "isolation_lab"],
        guaranteed: [["morphine", 2], ["decontam_kit", 1]],
        enemy: { id: "zombie_walker", chance: 0.6 },
        loot: { table: "medical", rolls: 1 },
      },
      quarantine_ward: {
        name: "Oddział Kwarantanny",
        desc: "Terminal przy łóżku zarażonego wciąż świeci. Ktoś zostawił na nim dane z pierwszego dnia.",
        exits: ["ward_a", "isolation_lab", "morgue"],
        enemy: { id: "infected_spitter_heavy", chance: 0.75 },
        loot: { table: "tech", rolls: 1 },
      },
      isolation_lab: {
        name: "Laboratorium Izolacji",
        desc: "Szkło pęknięte, na stołach próbki w cieczy. Część z nich pulsuje.",
        exits: ["pharmacy", "quarantine_ward", "morgue"],
        guaranteed: [["stim_adrenal", 1], ["pathogen_clot", 1]],
        enemy: { id: "infected_stalker", chance: 0.85 },
        loot: { table: "tech", rolls: 1 },
      },
      morgue: {
        name: "Kostnica",
        desc: "Chłodnia z zamkniętymi szufladami. Jedna z nich jest otwarta.",
        exits: ["quarantine_ward", "isolation_lab", "clinic_exit"],
        guaranteed: [["quantum_core", 1], ["medkit", 2]],
        enemy: { id: "infected_brute_miner", chance: 0.9 },
        loot: { table: "medical", rolls: 2 },
      },
      clinic_exit: {
        name: "Wyjście Ambulansowe",
        desc: "Winda towarowa prowadzi na powierzchnię. Kabina wciąż działa, ale tylko raz.",
        exits: ["morgue"],
        extract: true,
        loot: { table: "medical", rolls: 1 },
      },
    },
  },
  uran_armory: {
    name: "Tau Ceti f - Stacja Obrony Orbitalnej",
    tint: "#78350f",
    start: "armory_gate",
    tier: 3,
    unlock: { trader: "trader2", tier: 2 },
    intro: "[TAU CETI f] Orbitalna stacja obrony bastionu, której nadajniki wciąż nadają ostrzeżenia. Sierżant Karras chce wiedzieć, czy zbrojownia stacji jest jeszcze w rękach straży. Strażnicy zostali na posterunkach, a część z nich już nie oddycha.",
    nodes: {
      armory_gate: {
        name: "Śluza Dokowania",
        desc: "Ciężka śluza z kratą. Za nią słychać kroki patrolu, a światło w korytarzu pulsuje na zimno.",
        exits: ["firing_range", "guard_post"],
        loot: { table: "junk", rolls: 1 },
        extract: true,
      },
      firing_range: {
        name: "Strzelnica Orbitalna",
        desc: "Tarcze poszarpane od odłamków. Na stanowisku leżą pudła z amunicją.",
        exits: ["armory_gate", "guard_post", "ammo_locker"],
        guaranteed: [["ammo556", 10], ["ammo12", 6]],
        enemy: { id: "raider", chance: 0.7 },
        loot: { table: "military", rolls: 1 },
      },
      guard_post: {
        name: "Posterunek Strażników",
        desc: "Mapa sektora na stole i puste kubki po kawie. Ktoś zostawił broń w pośpiechu.",
        exits: ["armory_gate", "firing_range", "rifle_store"],
        guaranteed: [["axe_fire", 1]],
        enemy: { id: "raider", chance: 0.8 },
        loot: { table: "military", rolls: 1 },
      },
      ammo_locker: {
        name: "Szafa Amunicyjna",
        desc: "Metalowe szafki z zamkiem elektronicznym. Część drzwi jest otwarta.",
        exits: ["firing_range", "rifle_store", "shotgun_vault"],
        guaranteed: [["circuit", 2]],
        enemy: { id: "zombie_walker", chance: 0.6 },
        loot: { table: "military", rolls: 1 },
      },
      rifle_store: {
        name: "Magazyn Karabinów",
        desc: "Stojaki na karabiny szturmowe. Połowa z nich brakuje, a reszta jest rozbita.",
        exits: ["guard_post", "ammo_locker", "shotgun_vault"],
        guaranteed: [["rifle_assault", 1], ["axe_fire", 1]],
        enemy: { id: "titan_raider", chance: 0.85 },
        loot: { table: "military", rolls: 2 },
      },
      shotgun_vault: {
        name: "Sejf Broni Ciężkiej",
        desc: "Grube drzwi sejfu stoją otworem. W środku jest jeszcze ciepło.",
        exits: ["ammo_locker", "rifle_store", "armory_exit"],
        guaranteed: [["shotgun", 1]],
        enemy: { id: "infected_brute_miner", chance: 0.95 },
        loot: { table: "military", rolls: 2 },
      },
      armory_exit: {
        name: "Kapsuła Ewakuacyjna",
        desc: "Kapsuła transportowa z otwartą pokrywą. Jej silniki wciąż się grzeją.",
        exits: ["shotgun_vault"],
        extract: true,
        guaranteed: [["ammo12", 4]],
        loot: { table: "supply", rolls: 1 },
      },
    },
  },
  neptun_relay: {
    name: "Neptun - Nadajnik Nieznanego Sygnału",
    tint: "#4338ca",
    start: "relay_entry",
    tier: 3,
    unlock: { trader: "trader5", tier: 2 },
    intro: "[NEPTUN] Stacja odbiorcza na najdalszej planecie układu łapie sygnał o nietypowej strukturze. Haker Val chce wiedzieć, kto nią steruje. Serwery pracują w lodowatym zimnie, a w szybie chłodzenia coś się ukrywa.",
    nodes: {
      relay_entry: {
        name: "Wejście do Nadajnika",
        desc: "Metalowa klatka schodowa z kablami zwisającymi z sufitu. Szron pokrywa każdy stopień.",
        exits: ["cable_room", "cooling_shaft"],
        loot: { table: "tech", rolls: 1 },
        extract: true,
      },
      cable_room: {
        name: "Sala Kabli",
        desc: "Przewody w grubych wiązkach. Iskry przeskakują między nimi co kilka sekund.",
        exits: ["relay_entry", "cooling_shaft", "server_hall"],
        guaranteed: [["data_chip", 2], ["platinum_wire", 2]],
        enemy: { id: "infected_runner", chance: 0.7 },
        loot: { table: "tech", rolls: 1 },
      },
      cooling_shaft: {
        name: "Szyb Chłodzenia",
        desc: "Ściany pokryte lodem i ciemnym osadem. Ktoś tu sapie w ciemności.",
        exits: ["relay_entry", "cable_room", "core_room"],
        guaranteed: [["infected_tissue", 2], ["cloth", 2], ["scrap", 3]],
        enemy: { id: "infected_spitter_heavy", chance: 0.75 },
        loot: { table: "junk", rolls: 2 },
      },
      server_hall: {
        name: "Hala Serwerów",
        desc: "Szafy migają na zielono. Na konsoli ktoś zostawił otwartą sesję odbioru.",
        exits: ["cable_room", "core_room", "relay_exit"],
        guaranteed: [["data_chip", 1]],
        enemy: { id: "zombie_crawler", chance: 0.5 },
        loot: { table: "tech", rolls: 2 },
      },
      core_room: {
        name: "Rdzeń Nadajnika",
        desc: "Ogromny rdzeń chłodzony ciekłym azotem. Przy zbiorniku leży stary relikt sprzed pierwszych kolonii.",
        exits: ["cooling_shaft", "server_hall", "relay_exit"],
        guaranteed: [["relic_old_earth", 1], ["quantum_core", 1]],
        enemy: { id: "infected_brute_miner", chance: 0.9 },
        loot: { table: "tech", rolls: 1 },
      },
      relay_exit: {
        name: "Antena Ewakuacyjna",
        desc: "Ciasna kładka na dach nadajnika. Stąd widać słabe światło gwiazdy.",
        exits: ["server_hall", "core_room"],
        extract: true,
        loot: { table: "supply", rolls: 1 },
      },
    },
  },
  jowisz_depths: {
    name: "Jowisz - Europa: Podlodowy Skarbiec",
    tint: "#0e7490",
    start: "depth_lift",
    tier: 3,
    unlock: { trader: "trader7", tier: 2 },
    intro: "[EUROPA] Pod lodową skorupą księżyca Jowisza ciągną się stare tunele wydobywcze. Profesor Thorne wysłał tu sondę, która zaginęła w podlodowym skarbcu. Im niżej w lodzie, tym mniej światła i tym gęściej w ciemności.",
    nodes: {
      depth_lift: {
        name: "Szyb w Lodzie",
        desc: "Winda z kratą zjeżdża w dół, szarpiąc liny. Pod spodem tylko ciemna woda pod lodem.",
        exits: ["plasma_pit", "crystal_hall"],
        loot: { table: "tech", rolls: 1 },
        extract: true,
      },
      plasma_pit: {
        name: "Komora Plazmowa",
        desc: "Plazma buzuje w zbiornikach sondy. Przewody prowadzą do wysokiego napięcia.",
        exits: ["depth_lift", "crystal_hall", "gold_vault"],
        guaranteed: [["titan_diamond", 1], ["xenonite_crystal", 1]],
        enemy: { id: "infected_brute_miner", chance: 0.85 },
        loot: { table: "tech", rolls: 2 },
      },
      crystal_hall: {
        name: "Hala Lodowych Kryształów",
        desc: "Ściany z błękitnego lodu odbijają każdy krok. Coś porusza się w odbiciu.",
        exits: ["depth_lift", "plasma_pit", "vault_gate"],
        mine: { type: "xenonite_crystal", qty: 1, label: "Rzadki Kryształ Xenonitu" },
        enemy: { id: "infected_stalker", chance: 0.8 },
        loot: { table: "tech", rolls: 2 },
      },
      gold_vault: {
        name: "Skarbiec Złota",
        desc: "Półki z kasetami na złoto. Część jest otwarta i pusta, ale nie wszystkie.",
        exits: ["plasma_pit", "vault_gate"],
        guaranteed: [["gold_ingot", 1], ["artifact_orb", 1]],
        enemy: { id: "titan_raider", chance: 0.9 },
        loot: { table: "military", rolls: 2 },
      },
      vault_gate: {
        name: "Grodź Skarbca",
        desc: "Ciężka grodź z pieczęcią Caelum. Od środka dochodzi szum generatora.",
        exits: ["crystal_hall", "gold_vault", "depth_exit"],
        enemy: { id: "infected_brute_miner", chance: 0.9 },
        loot: { table: "military", rolls: 1 },
      },
      depth_exit: {
        name: "Szyb Wentylacyjny",
        desc: "Wąska szyba z podmuchem świeżego powietrza. Wyjście jest blisko.",
        exits: ["vault_gate"],
        extract: true,
        loot: { table: "supply", rolls: 1 },
      },
    },
  },
  tau_e_factory: {
    name: "Tau Ceti e - Ruiny Fabryki Helix",
    tint: "#7c2d12",
    start: "landing",
    intro: "[TAU CETI e] Planeta z normalną atmosferą: rzadka, rdzawa, ale oddychalna z filtrem. Na równinie stoją ruiny fabryki Helix, która produkowała kapsuły dla kolonistów. Według zapisów Helixu to tu Szept po raz pierwszy wyskoczył poza jedną planetę.",
    nodes: {
      landing: {
        name: "Lądowisko Pyłowe",
        desc: "Zardzewiałe platformy lądowania osiadły w czerwonym pyle. Wiatr niesie zapach spalonego metalu.",
        exits: ["assembly", "yard"],
        loot: { table: "junk", rolls: 1 },
      },
      assembly: {
        name: "Hala Montażowa",
        desc: "Taśmy produkcyjne stoją w bezruchu. Na podłodze leżą porzucone kapsuły ratunkowe.",
        exits: ["landing", "furnace", "storage"],
        loot: { table: "wreck", rolls: 1 },
        enemy: { id: "zombie_walker", chance: 0.6 },
      },
      yard: {
        name: "Plac Składowy",
        desc: "Kontenery ułożone w ciasne rzędy. Część z nich otwarto siłą.",
        exits: ["landing", "storage"],
        loot: { table: "supply", rolls: 1 },
        enemy: { id: "zombie_crawler", chance: 0.5 },
      },
      furnace: {
        name: "Piec Plazmowy",
        desc: "Ogromny piec wciąż utrzymuje resztkowe ciepło. Obok leży nietknięty układ scalony.",
        exits: ["assembly", "control"],
        loot: { table: "tech", rolls: 1 },
        guaranteed: [["circuit", 1]],
        enemy: { id: "raider", chance: 0.5 },
      },
      vault_helix: {
        name: "Zamknięty Gabinet Inżynierów Helix",
        desc: "Zabezpieczony gabinet z ciężkimi zamkami. Na biurku leżą zapieczętowane dokumenty. Potrzebna karta fabryki Helix.",
        exits: ["storage"],
        keyLock: "helix",
        keyLabel: "Karta Fabryki Helix",
        loot: { table: "vault_rare", rolls: 3 },
        guaranteed: [["doc_skill", 1]],
        codeChance: 0.15,
      },
      storage: {
        name: "Magazyn Helix",
        desc: "Półki z zapasami sięgają sufitu. Większość jest pusta, ale nie wszystko.",
        exits: ["assembly", "yard", "control", "vault_helix"],
        loot: { table: "supply", rolls: 2 },
      },
      control: {
        name: "Pokój Kontroli",
        desc: "Monitory pokazują wciąż działający plan fabryki. Ktoś zostawił tu kubek z kawą.",
        exits: ["furnace", "storage", "exit"],
        loot: { table: "tech", rolls: 1 },
      },
      exit: {
        name: "Szyb Ewakuacyjny",
        desc: "Winda towarowa prowadzi na powierzchnię. Lampa nad wejściem wciąż mruga na zielono.",
        exits: ["control"],
        extract: true,
      },
    },
  },

  tau_e_colony: {
    name: "Tau Ceti e - Osada Kolonistów Ecru",
    tint: "#713f12",
    start: "pad",
    intro: "[OSADA ECRU] Kolonia, która została na Tau Ceti e po pierwszej fali Szeptu. Część domów wciąż ma światło, ale ludzie zamknęli się w schronie i nie wpuszczają nikogo z zewnątrz.",
    nodes: {
      pad: {
        name: "Lądowisko Osady",
        desc: "Wyrównany plac z prowizorycznym znakiem lądowania. Ktoś namalował na nim strzałkę w stronę schronu.",
        exits: ["houses", "silo"],
        loot: { table: "junk", rolls: 1 },
      },
      houses: {
        name: "Domy Kolonistów",
        desc: "Parterowe domy z zabitymi oknami. W kuchniach stoją talerze, jakby ktoś miał zaraz wrócić na obiad.",
        exits: ["pad", "silo", "chapel"],
        loot: { table: "supply", rolls: 1 },
        enemy: { id: "zombie_walker", chance: 0.6 },
      },
      silo: {
        name: "Silos Zbożowy",
        desc: "Ziarno wysypane na podłogę przez czyjeś szaleńcze poszukiwania. Słychać szuranie gdzieś w głębi.",
        exits: ["pad", "houses", "chapel"],
        loot: { table: "supply", rolls: 2 },
        enemy: { id: "zombie_crawler", chance: 0.5 },
      },
      chapel: {
        name: "Kaplica Osady",
        desc: "Ławki poprzewracane, świece dawno zgasły. Na ołtarzu leży dziennik z listą imion ludzi, którzy odeszli.",
        exits: ["houses", "silo", "bunker"],
        loot: { table: "tech", rolls: 1 },
        enemy: { id: "zombie_spitter", chance: 0.5 },
      },
      bunker: {
        name: "Schron Kolonistów",
        desc: "Drzwi schronu są zaryglowane od wewnątrz. Ktoś po drugiej stronie stuka w rytmie Morse'a, ale nie odpowiada.",
        exits: ["chapel", "escape"],
        loot: { table: "military", rolls: 1 },
        enemy: { id: "raider", chance: 0.5 },
      },
      escape: {
        name: "Rampa Ewakuacyjna",
        desc: "Ciężki transporter czeka na rampie. Silnik mruczy na minimum, ale wystarczy, żeby wzbić się nad atmosferę.",
        exits: ["bunker"],
        extract: true,
      },
    },
  },

  tau_f_bastion: {
    name: "Tau Ceti f - Bastion Kryształowy",
    tint: "#4c1d95",
    start: "gate_pad",
    requiresHash: true,
    intro: "[BASTION] Automatyczny system anty-statkowy. Zestrzeliwuje każdą jednostkę wylatującą z zainfekowanych układów, żeby Szept nie wydostał się w kosmos. Bez zaimplementowanych kodów Hash statek zostanie zestrzelony.",
    nodes: {
      gate_pad: {
        name: "Platforma Lądowania",
        desc: "Pusta platforma z wypalonym znakiem ostrzegawczym. Kryształy w gruncie błyszczą przy każdym ruchu.",
        exits: ["turrets", "ridge"],
        loot: { table: "junk", rolls: 1 },
        enemy: { id: "infected_runner", chance: 0.6 },
      },
      turrets: {
        name: "Sektor Działek",
        desc: "Automatyczne działka obracają się bez przerwy, sprawdzając każdy cel. Nie strzelają na nikim, kto nie jest zarejestrowany.",
        exits: ["gate_pad", "core"],
        loot: { table: "military", rolls: 1 },
        enemy: { id: "raider", chance: 0.8 },
      },
      ridge: {
        name: "Grzbiet Kryształów",
        desc: "Wąski grzbiet z przezroczystego minerału. Pod stopami słychać pulsowanie czegoś głęboko w środku.",
        exits: ["gate_pad", "core"],
        loot: { table: "tech", rolls: 2 },
        enemy: { id: "infected_stalker", chance: 0.6 },
      },
      core: {
        name: "Rdzeń Systemu Anty-Statkowego",
        desc: "Serce bastionu. Panel z zamkiem szyfrowym wymaga podpięcia przewodów pod kontrolę kodów.",
        exits: ["turrets", "ridge", "vault"],
        gate: { type: "wires", label: "Odblokowanie rdzenia", intel: "Rdzeń otwarty. Pod nim leży skarbiec z danymi." },
        loot: { table: "military", rolls: 1 },
      },
      vault: {
        name: "Bank Danych Bastionu",
        desc: "Szafy z dyskami wypełnione zapisami zarejestrowanych statków. Jeden z dysków wciąż się ładuje.",
        exits: ["core", "exit"],
        loot: { table: "tech", rolls: 2 },
        guaranteed: [["data_chip", 1]],
      },
      exit: {
        name: "Ewakuacja Bastionu",
        desc: "Stary tunel serwisowy prowadzi do lądownika. Ktoś pozostawił tu otwarty plecak.",
        exits: ["vault"],
        extract: true,
      },
    },
  },

  vega_iv_glacier: {
    name: "Wega IV - Lodowy Zakład Syntezy",
    tint: "#0c4a6e",
    start: "lock_air",
    intro: "[WEGA IV] Lodowy glob pokryty metanowym szronem. Pod powierzchnią, w starych tunelach, nadal pracuje fabryka syntezy paliw. Szept dotarł tu jako pierwszy, przez transport z Wegi-7.",
    nodes: {
      lock_air: {
        name: "Śluza Lodowa",
        desc: "Grube drzwi pokryte lodem. Gdy się otwierają, do środka wpada mroźne powietrze.",
        exits: ["ice_field", "pump_hall"],
        loot: { table: "junk", rolls: 1 },
      },
      ice_field: {
        name: "Pole Lodowe",
        desc: "Lodowe wiatry wyrzeźbiły szczątki pojazdów w długie, ostre kształty.",
        exits: ["lock_air", "pump_hall", "reactor"],
        loot: { table: "wreck", rolls: 1 },
        enemy: { id: "zombie_walker", chance: 0.5 },
      },
      pump_hall: {
        name: "Hala Pomp",
        desc: "Zimne rury pompujące metan pękają w rytm kroków. Z jednej z nich wycieka mgła.",
        exits: ["lock_air", "ice_field", "reactor"],
        loot: { table: "tech", rolls: 1 },
        enemy: { id: "zombie_spitter", chance: 0.6 },
      },
      reactor: {
        name: "Reaktor Syntezy",
        desc: "Chłodnica reaktora jest pęknięta, ale ogniwa paliwowe w rdzeniu są nietknięte.",
        exits: ["ice_field", "pump_hall", "exit"],
        loot: { table: "supply", rolls: 2 },
        guaranteed: [["fuel_cell", 1]],
        enemy: { id: "raider", chance: 0.7 },
      },
      exit: {
        name: "Szyb Kriogeniczny",
        desc: "Pionowy szyb prowadzi na powierzchnię. Z góry wpada wiatr.",
        exits: ["reactor"],
        extract: true,
      },
    },
  },
};

// === SEGMENTY: +3 pomieszczenia na każdą mapę (korytarz odchodzący od jednego pokoju) ===
// Nowe węzły mają exits: [wstecz, dalej] (indeks 0 = W, 1 = A). Minimapa ustawia je zgodnie z klawiszami.
const MAP_SEGMENTS = {
  tutorial: { attach: "dunes", nodes: [
    { id: "seg_t1", name: "Wrak Modułu Mieszkalnego", desc: "Rozerwany moduł mieszkalny. Łóżka wbite w ścianę siłą wybuchu.", loot: { table: "junk", rolls: 1 } },
    { id: "seg_t2", name: "Rura Chłodnicza", desc: "Długa, zardzewiała rura. Woda dawno wyparowała, zostawiając osad.", loot: { table: "wreck", rolls: 1 } },
    { id: "seg_t3", name: "Schowek Serwisowy", desc: "Mała komora z narzędziami. Ktoś zabrał wszystko, co było cenne.", loot: { table: "supply", rolls: 1 }, enemy: { id: "zombie_crawler", chance: 0.5 } },
  ] },
  titan_dome: { attach: "apartments", nodes: [
    { id: "seg_d1", name: "Zalana Pralnia", desc: "Podłoga pod wodą, a z kranów wciąż cieknie. Czuć chlorem i rozkładem.", loot: { table: "junk", rolls: 1 }, enemy: { id: "infected_runner", chance: 0.5 } },
    { id: "seg_d2", name: "Korytarz Serwisowy", desc: "Wąski korytarz z kablami. Stukot z góry sugeruje, że coś tam czeka.", loot: { table: "tech", rolls: 1 } },
    { id: "seg_d3", name: "Biuro Administracji", desc: "Biurka pokryte kurzem. Na tablicy wisi plan ewakuacji sprzed miesiąca.", loot: { table: "supply", rolls: 1 }, enemy: { id: "zombie_walker", chance: 0.5 } },
  ] },
  titan_archive: { attach: "stacks", nodes: [
    { id: "seg_a1", name: "Pokój Archiwisty", desc: "Biurko zawalone notatkami. Ktoś próbował zaszyfrować dane przed ucieczką.", loot: { table: "tech", rolls: 1 } },
    { id: "seg_a2", name: "Przejście Wentylacyjne", desc: "Ciasna szyba wentylacyjna. Pajęczyna zalega grubą warstwą.", loot: { table: "junk", rolls: 1 }, enemy: { id: "infected_stalker", chance: 0.5 } },
    { id: "seg_a3", name: "Magazyn Taśm", desc: "Rolki taśm magnetycznych sięgają sufitu. Część z nich wciąż cicho szumi.", loot: { table: "tech", rolls: 2 } },
  ] },
  titan_mines: { attach: "maint_depot", nodes: [
    { id: "seg_m1", name: "Przechowalnia Lin", desc: "Liny i haki na ścianach. Część z nich przecięto ostrym narzędziem.", loot: { table: "junk", rolls: 1 } },
    { id: "seg_m2", name: "Ślepy Szyb", desc: "Szyb kończy się ścianą. Ktoś próbował wydostać się tędy na powierzchnię.", loot: { table: "wreck", rolls: 1 }, enemy: { id: "infected_brute_miner", chance: 0.5 } },
    { id: "seg_m3", name: "Komora Kontrolna", desc: "Monitory pokazują ciśnienie w szybach. Jeden z nich mruga na czerwono.", loot: { table: "tech", rolls: 1 } },
  ] },
  vega: { attach: "crew", nodes: [
    { id: "seg_v1", name: "Kwatera Techników", desc: "Łóżka z pościelą, na ścianie zdjęcia rodziny. Ktoś tu mieszkał do końca.", loot: { table: "supply", rolls: 1 } },
    { id: "seg_v2", name: "Hangar Serwisowy", desc: "Drony rozłożone na części. Narzędzia leżą w równym rzędzie.", loot: { table: "military", rolls: 1 }, enemy: { id: "raider", chance: 0.5 } },
    { id: "seg_v3", name: "Mostek Awaryjny", desc: "Panel z mrugającymi kontrolkami. Otwarty dziennik pokładowy leży na pulpicie.", loot: { table: "tech", rolls: 1 } },
  ] },
  tau_e_factory: { attach: "yard", nodes: [
    { id: "seg_f1", name: "Składzik Farb", desc: "Puszki z farbą, część otwarta. Czerwona plama pokrywa całą podłogę.", loot: { table: "junk", rolls: 1 }, enemy: { id: "zombie_crawler", chance: 0.5 } },
    { id: "seg_f2", name: "Tunel Kablowy", desc: "Wąski tunel pełen przewodów. Iskry przeskakują między nimi co kilka sekund.", loot: { table: "tech", rolls: 1 } },
    { id: "seg_f3", name: "Stołówka Fabryki", desc: "Stoły nakryte, jakby zmiana dopiero co wyszła na przerwę.", loot: { table: "supply", rolls: 1 }, enemy: { id: "zombie_walker", chance: 0.5 } },
  ] },
  tau_e_colony: { attach: "pad", nodes: [
    { id: "seg_c1", name: "Piekarnia Osady", desc: "Piec wciąż ciepły. Na blacie leżą niedokończone bochenki.", loot: { table: "supply", rolls: 1 } },
    { id: "seg_c2", name: "Stajnia", desc: "Boksy otwarte, a w słomie walają się ślady butów.", loot: { table: "junk", rolls: 1 }, enemy: { id: "zombie_spitter", chance: 0.5 } },
    { id: "seg_c3", name: "Strych Kaplicy", desc: "Stare zdjęcia i listy na sznurze. Część opisuje ostatnie dni osady.", loot: { table: "tech", rolls: 1 } },
  ] },
  tau_f_bastion: { attach: "ridge", nodes: [
    { id: "seg_b1", name: "Stanowisko Radarowe", desc: "Ekrany pokazują pustą orbitę. Na oparciu krzesła wisi czyjaś kurtka.", loot: { table: "tech", rolls: 1 }, enemy: { id: "infected_runner", chance: 0.5 } },
    { id: "seg_b2", name: "Kryształowa Piwnica", desc: "Ściany świecą słabym, pulsującym światłem. Słychać cichy szum.", loot: { table: "military", rolls: 1 } },
    { id: "seg_b3", name: "Kanał Chłodzenia", desc: "Rura z lodowym osadem. Ciepło z dołu sprawia, że kryształy pękają.", loot: { table: "junk", rolls: 1 }, enemy: { id: "infected_stalker", chance: 0.5 } },
  ] },
  vega_iv_glacier: { attach: "lock_air", nodes: [
    { id: "seg_g1", name: "Magazyn Lodu", desc: "Bloki lodu ułożone w stosy. Pod nimi skrzynie z zapasami.", loot: { table: "supply", rolls: 1 } },
    { id: "seg_g2", name: "Przejście Termiczne", desc: "Korytarz z grzejnikami, które jeszcze działają. Ciepło pachnie metalem.", loot: { table: "tech", rolls: 1 }, enemy: { id: "zombie_walker", chance: 0.5 } },
    { id: "seg_g3", name: "Pompownia Zapasowa", desc: "Zapasowa pompa metanu. Szczelina w rurze syczy co kilka sekund.", loot: { table: "junk", rolls: 1 }, enemy: { id: "zombie_spitter", chance: 0.5 } },
  ] },
};

(function addMapSegments() {
  Object.entries(MAP_SEGMENTS).forEach(([mapId, def]) => {
    const m = MAPS[mapId];
    if (!m) return;
    const attach = m.nodes[def.attach];
    if (!attach || attach.exits.length >= 4) return;
    const ids = def.nodes.map((n) => n.id);
    attach.exits.push(ids[0]);
    let prev = def.attach;
    def.nodes.forEach((n, i) => {
      const exits = [prev];
      if (i + 1 < def.nodes.length) exits.push(ids[i + 1]);
      m.nodes[n.id] = { name: n.name, desc: n.desc, exits, ...(n.loot ? { loot: n.loot } : {}), ...(n.enemy ? { enemy: n.enemy } : {}) };
      prev = n.id;
    });
  });
})();

// === UKŁAD SIATKI: wyjścia zawsze prowadzą do sąsiedniego pokoju w siatce ===
// exits = tablica 4 pozycji [W, A, S, D]; null = brak wyjścia w tym kierunku.
// Pokoje układane są BFS od startu (preferowany jest oryginalny kierunek wyjścia).
// Połączenia między pokojami, które nie są sąsiadami w siatce, zostają usunięte.
const GRID_DIRS = [[0, -1], [-1, 0], [0, 1], [1, 0]]; // W, A, S, D
function layoutMapGrid(m) {
  const ids = Object.keys(m.nodes);
  const adj = {};
  ids.forEach((id) => (adj[id] = new Set()));
  ids.forEach((id) =>
    (m.nodes[id].exits || []).forEach((e) => {
      if (e && m.nodes[e]) {
        adj[id].add(e);
        adj[e].add(id);
      }
    })
  );
  const pos = { [m.start]: { x: 0, y: 0 } };
  const occ = { "0,0": m.start };
  const queue = [m.start];
  while (queue.length) {
    const u = queue.shift();
    const p = pos[u];
    const cand = [];
    (m.nodes[u].exits || []).forEach((e, slot) => {
      if (e && adj[u].has(e)) cand.push({ id: e, pref: slot });
    });
    [...adj[u]].forEach((e) => {
      if (!cand.some((c) => c.id === e)) cand.push({ id: e, pref: 9 });
    });
    for (const { id: v, pref } of cand) {
      if (pos[v]) continue;
      const order = [pref, 0, 1, 2, 3].filter((d, i, a) => d < 4 && a.indexOf(d) === i);
      for (const d of order) {
        const q = { x: p.x + GRID_DIRS[d][0], y: p.y + GRID_DIRS[d][1] };
        const key = q.x + "," + q.y;
        if (occ[key]) continue;
        pos[v] = q;
        occ[key] = v;
        queue.push(v);
        break;
      }
    }
  }
  // współrzędne pokojów: źródło prawdy dla minimapy (ten sam układ co wyjścia W/A/S/D)
  m.coords = pos;
  ids.forEach((id) => {
    const n = m.nodes[id];
    if (!pos[id]) {
      console.warn("[mapa] pokój bez miejsca w siatce:", id);
      return;
    }
    const ex = [null, null, null, null];
    for (let d = 0; d < 4; d++) {
      const q = { x: pos[id].x + GRID_DIRS[d][0], y: pos[id].y + GRID_DIRS[d][1] };
      const other = occ[q.x + "," + q.y];
      if (other && adj[id].has(other)) ex[d] = other;
    }
    n.exits = ex;
  });
}
Object.values(MAPS).forEach(layoutMapGrid);

// === DRZEWA PROGRESJI MAP ===
// Dwa punkty startowe (po samouczku na Marsie):
//   DRZEWO A (Tytan):  Kopuła Tytana -> Kopalnia Prometeusz -> Archiwum -> Wega-7
//                      Archiwum wymaga zaufania Dr Jana Vane'a (medyczny handlarz, Tier 2).
//                      Wega-7 wymaga też Napędu Statku poz. 1 (sprawdzane w mapLockReason).
//   DRZEWO B (Tau):    Osada Kolonistów Ecru -> Fabryka Helix -> (Bastion Tau Ceti f / Wega IV)
//                      Bastion wymaga też kodów Hash (sprawdzane w mapLockReason).
// Map nie da się "ukończyć". MAP_REQUIREMENTS opisuje tylko ścieżkę na schemacie progresji (nie blokuje map).
// Archiwum: wejście wyłącznie przez węzeł "Transit" w Szybach Prometeusz (viaTransit) + zaufanie handlarza (unlock).
// Tylko realne zależności map od map (zgodne z blokadami w mapLockReason). Reszta blokad: trader / Napęd / Hash.
const MAP_REQUIREMENTS = {
  titan_archive: "titan_mines",
};
const MAP_ROOTS = ["titan_dome", "tau_e_colony"];

// === POZIOM TRUDNOŚCI MAP (0-4): wrogowie są mocniejsi, a łup lepszy wraz z poziomem ===
const MAP_TIERS = {
  tutorial: 0,
  titan_dome: 1,
  tau_e_colony: 1,
  titan_mines: 2,
  tau_e_factory: 2,
  titan_archive: 3.5,
  vega: 3,
  vega_iv_glacier: 3,
  tau_f_bastion: 4,
  ziemia_clinic: 3,
  uran_armory: 3,
  neptun_relay: 3,
  jowisz_depths: 3,
};
Object.entries(MAP_TIERS).forEach(([mapId, t]) => {
  if (MAPS[mapId]) MAPS[mapId].tier = t;
});


// === EWAKUACJA: poza samouczkiem start nigdy nie jest wyjściem; wyjście wymaga dźwigni i minimalnej liczby tur ===
(function setupEvac() {
  Object.entries(MAPS).forEach(([id, m]) => {
    if (id === "tutorial") return;
    const tier = Math.max(1, Math.floor(m.tier != null ? m.tier : 1));
    const count = Object.keys(m.nodes).length;
    const minTurns = Math.min(16, 8 + tier * 2 + (count >= 10 ? 2 : 0));
    // odległości od startu (BFS)
    const dist = { [m.start]: 0 };
    const q = [m.start];
    while (q.length) {
      const x = q.shift();
      (m.nodes[x].exits || []).forEach((e) => {
        if (e && dist[e] === undefined) {
          dist[e] = dist[x] + 1;
          q.push(e);
        }
      });
    }
    m.nodes[m.start].extract = false;
    const others = Object.keys(m.nodes).filter((n) => n !== m.start && dist[n] !== undefined);
    others.sort((a, b) => dist[b] - dist[a]);
    // jeśli mapa nie ma już żadnego wyjścia (było tylko na starcie), najdalszy pokój staje się wyjściem
    if (!others.some((n) => m.nodes[n].extract)) m.nodes[others[0]].extract = true;
    // dźwignia: najdalszy pokój od startu, który nie jest wyjściem
    const cands = others.filter((n) => !m.nodes[n].extract);
    m.evac = { minTurns, lever: { node: cands[0], label: "Dźwignia ewakuacji" } };
  });
})();

if (typeof window !== "undefined") {
  window.LOOT = LOOT;
  window.MAPS = MAPS;
}
if (typeof globalThis !== "undefined") {
  globalThis.LOOT = LOOT;
  globalThis.MAPS = MAPS;
}
