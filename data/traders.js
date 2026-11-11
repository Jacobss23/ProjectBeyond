// === SEKCJA: HANDLARZE I ZLECENIA ===
const TRADERS = [
  {
    id: "trader1",
    name: "Dr Jana Vane - Sanitariuszka Polowa",
    desc: "Specjalista medycyny ratunkowej i epidemiolog. Skupuje próbki biologiczne i zaopatruje w leki.",
    buyMult: 1.4,
    sellMult: 1.0,
    fixedPrices: { ration: 400, water: 300 },
    color: "#10b981", // Emerald
        stock: {
      0: ["ration", "water", "bandage", "hemostatic"],
      1: ["ointment", "splint", "medicine_case", "shield_gel"],
      2: ["medkit", "morphine", "decontam_kit", "antitoksyna"],
    },
  },
  {
    id: "trader2",
    name: "Sierżant Karras - Rusznikarz",
    desc: "Weteran wojen kolonialnych. Dostarcza broń, amunicję oraz modyfikacje taktyczne.",
    buyMult: 1.35,
    sellMult: 0.9,
    color: "#f59e0b", // Amber
        stock: {
      0: ["ammo9", "ammo12", "pistol", "shotgun"],
      1: ["ammo556", "revolver_magnum", "smg", "weapon_case"],
      2: ["ammo762", "ammo_magnum", "sniper_dragoon", "plasma_carbine"],
    },
  },
  {
    id: "trader3",
    name: "Inżynier Borys - Odzysk Komponentów",
    desc: "Zajmuje się demontażem technologii i rzadkimi podzespołami instalacji podtrzymywania życia.",
    buyMult: 1.5,
    sellMult: 1.15,
    color: "#06b6d4", // Cyan
        stock: {
      0: ["scrap", "wrench", "broken_drone"],
      1: ["fuel_cell", "platinum_wire", "geiger"],
      2: ["titan_filter", "titan_fusion_core"],
    },
  },
  {
    id: "trader4",
    name: "Kwatermistrz Nadia - Pancerze i Zaopatrzenie",
    desc: "Oficer zaopatrzeniowy wolnych kolonii. Handluje sprzętem ochronnym i kombinezonami.",
    buyMult: 1.45,
    sellMult: 1.0,
    color: "#6366f1", // Indigo
        stock: {
      0: ["armor_damaged", "helmet_tactical", "kompres_chlodzacy", "armor_light_mesh"],
      1: ["armor_scout", "gas_mask", "racja_wojskowa", "helmet_night"],
      2: ["armor_vest", "armor_exo"],
    },
  },
  {
    id: "trader5",
    name: "Haker Val - Sieci i Wywiad",
    desc: "Kryptograf i analityk danych. Szuka czarnych skrzynek, chipów taktycznych i układów szyfrujących.",
    buyMult: 1.6,
    sellMult: 1.2,
    color: "#8b5cf6", // Violet
        stock: {
      0: ["data_chip", "wires", "old_phone"],
      1: ["circuit", "neural_chip", "stim_adrenal", "lockpick_set"],
      2: ["quantum_core", "nanite_serum"],
    },
  },
  {
    id: "trader6",
    name: "Kapitan Sławiński - Dowódca Straży",
    desc: "Dowódca jednostki porządkowej. Zleca czyszczenie niebezpiecznych stref i polowanie na mutanty.",
    buyMult: 1.4,
    sellMult: 1.0,
    color: "#ef4444", // Crimson
        stock: {
      0: ["combat_knife", "stun_baton", "crowbar", "knife_throw"],
      1: ["vest_kevlar", "tourniquet", "stim_bleedstop"],
      2: ["axe_fire", "machete", "bandaz_zbiorczy"],
    },
  },
  {
    id: "trader7",
    name: "Profesor Thorne - Geolog Głębinowy",
    desc: "Badacz minerałów Tytana. Skupuje czystą rudę, xenonite i Hel-3. Sprzedaje Rękawicę Wydobywczą.",
    buyMult: 1.3,
    sellMult: 1.1,
    color: "#eab308", // Gold
        stock: {
      0: ["mining_glove", "flashlight_uv"],
      1: ["ore_titanium", "meteor_iron", "xenonite_crystal"],
      2: ["helium3"],
    },
  },
  {
    id: "trader8",
    name: "Szturmowiec Jax - Szabrownik Sektora",
    desc: "Handlarz czarnorynkowy i kolekcjoner artefaktów. Odkupuje ultra-rzadkie kosztowności po najwyższych cenach.",
    buyMult: 1.7,
    sellMult: 1.3,
    color: "#ec4899", // Magenta
        stock: {
      0: ["pocket_watch", "holo_portrait"],
      1: ["relic_old_earth", "lunar_pearl"],
      2: ["gold_ingot", "titan_diamond", "sapphire_tesla", "golden_chalice"],
    },
  },
];

// === SEKCJA: MISJE GŁÓWNE (MAIN QUESTS - BEZ TIERU) ===
const MAIN_QUESTS = [
  {
    id: "q0_supplies",
    traderId: "trader1",
    isMain: true,
    title: "Podstawowe Zaopatrzenie Medyczne",
    desc: "Ulepsz Stację Medyczną do poziomu 1 i dostarcz 2x Szmaty oraz 1x Złom.",
    req: [
      { id: "cloth", qty: 2 },
      { id: "scrap", qty: 1 },
    ],
    needModule: { id: "Medstation", level: 1 },
    reward: { credits: 160, xp: 25, item: "bandage", itemQty: 2, rep: 20 },
  },
  {
    id: "q0_defense",
    traderId: "trader2",
    isMain: true,
    title: "Kalibracja Balistyczna",
    desc: "Pokonaj Pustego Szwendacza i dostarcz 10x Amunicja 9mm oraz 1x Przewody.",
    req: [
      { id: "ammo9", qty: 10 },
      { id: "wires", qty: 1 },
    ],
    kill: "zombie_walker",
    reward: { credits: 200, xp: 30, item: "combat_knife", itemQty: 1, rep: 20 },
  },
  {
    id: "q1_titan_tissue",
    traderId: "trader1",
    isMain: true,
    title: "Próbka Patogenu Tytana",
    desc: "Odczytaj terminal w Laboratorium Izolacji i dostarcz 2x Tkanka mózgowa zarażonego.",
    req: [
      { id: "infected_tissue", qty: 2 },
    ],
    task: { type: "terminal", label: "Odczyt terminala", map: "titan_dome", node: "quarantine_lab", intel: "Próbka patogenu: szczep przenosi się między gatunkami.", key: "PZ3M" },
    reward: { credits: 550, xp: 120, item: "stim_adrenal", itemQty: 1, rep: 30 },
  },
  {
    id: "q1_titan_firepower",
    traderId: "trader2",
    isMain: true,
    title: "Zabezpieczenie Amunicji Śrutowej",
    desc: "Pokonaj Wściekłego Biegacza i dostarcz 15x Amunicja śrutowa 12G.",
    req: [
      { id: "ammo12", qty: 15 },
    ],
    kill: "infected_runner",
    reward: { credits: 500, xp: 110, item: "vest_kevlar", itemQty: 1, rep: 30 },
  },
  {
    id: "q1_titan_filter",
    traderId: "trader3",
    isMain: true,
    title: "Filtry Kopuły Tytana",
    desc: "Podłącz przewody w Tunelu Wentylacyjnym i dostarcz 1x Filtr kopuły.",
    req: [
      { id: "titan_filter", qty: 1 },
    ],
    task: { type: "wires", label: "Podłączenie przewodów", map: "titan_dome", node: "vent_tunnel", intel: "Filtry: sektor C wymaga nowych wkładów." },
    reward: { credits: 650, xp: 130, item: "circuit", itemQty: 3, rep: 30 },
  },
  {
    id: "q1_titan_core",
    traderId: "trader4",
    isMain: true,
    title: "Rdzeń Fuzyjny Nowego Erebu",
    desc: "Ulepsz Warsztat Craftingu do poziomu 2 i dostarcz 1x Rdzeń fuzyjny Tytana.",
    req: [
      { id: "titan_fusion_core", qty: 1 },
    ],
    needModule: { id: "Crafting", level: 2 },
    reward: { credits: 900, xp: 200, item: "armor_exo", itemQty: 1, rep: 40 },
  },
  {
    id: "q1_val_quantum",
    traderId: "trader5",
    isMain: true,
    title: "Kwantowy Rdzeń Szyfrujący",
    desc: "Odczytaj terminal w Hali A i dostarcz 1x Kwantowy rdzeń szyfrujący.",
    req: [
      { id: "quantum_core", qty: 1 },
    ],
    task: { type: "terminal", label: "Odczyt terminala", map: "titan_archive", node: "hall_a", intel: "Rdzeń kwantowy: kod szyfrujący w rejestrze hali.", key: "Q9X2" },
    reward: { credits: 1500, xp: 300, item: "stim_adrenal", itemQty: 2, rep: 50 },
  },
  {
    id: "q1_thorne_ore",
    traderId: "trader7",
    isMain: true,
    title: "Prospekcja Głębinowa Prometeusz",
    desc: "Zhakuj zamek szybu i dostarcz 2x Czysta ruda Tytana oraz 1x Hel-3.",
    req: [
      { id: "ore_titanium", qty: 2 },
      { id: "helium3", qty: 1 },
    ],
    task: { type: "hack", label: "Włamanie do zamka", map: "titan_mines", node: "mine_entry", intel: "Żyła rudy: sonda potwierdza złoże." },
    reward: { credits: 1100, xp: 220, item: "diamond_ring", itemQty: 1, rep: 40 },
  },
  {
    id: "q1_jax_relic",
    traderId: "trader8",
    isMain: true,
    title: "Artefakt Starej Ziemi",
    desc: "Pokonaj Zmutowanego Górnika Kopuły i dostarcz 1x Starożytny Relikt Ziemi.",
    req: [
      { id: "relic_old_earth", qty: 1 },
    ],
    kill: "infected_brute_miner",
    reward: { credits: 2400, xp: 400, item: "gold_ingot", itemQty: 1, rep: 50 },
  },
  {
    id: "mt_trader1_terminal",
    traderId: "trader1",
    isMain: true,
    title: "Sekwencja ZETA-7",
    desc: "Odczytaj terminal w Laboratorium Izolacji (klucz dostępu w logu) i dostarcz 1x Tkanka mózgowa zarażonego.",
    req: [
      { id: "infected_tissue", qty: 1 },
    ],
    task: { type: "terminal", label: "Odczyt terminala", map: "titan_dome", node: "quarantine_lab", key: "K7Q2", intel: "ZETA-7: szczep odporny na standardowe antybiotyki. Próbka do sekwencjonowania." },
    reward: { credits: 400, xp: 90, item: "medkit", itemQty: 1, rep: 25 },
  },
  {
    id: "mt_trader2_terminal",
    traderId: "trader2",
    isMain: true,
    title: "Dziennik Magazynu Karrasa",
    desc: "Włam się do zamka skrytki na Alei Handlowej (zatrzymaj wskaźnik w zielonym polu) i dostarcz 10x Amunicja śrutowa 12G.",
    req: [
      { id: "ammo12", qty: 10 },
    ],
    task: { type: "hack", label: "Włamanie do zamka", map: "titan_dome", node: "concourse", intel: "Magazyn B: skrytka z bronią otwarta. Zapas strzelb w sektorze H." },
    reward: { credits: 350, xp: 80, item: "ammo9", itemQty: 20, rep: 25 },
  },
  {
    id: "mt_trader3_terminal",
    traderId: "trader3",
    isMain: true,
    title: "Diagnostyka Wentylacji",
    desc: "Podłącz przewody w Tunelu Wentylacyjnym do właściwych gniazd i dostarcz 1x Ogniwo paliwowe.",
    req: [
      { id: "fuel_cell", qty: 1 },
    ],
    task: { type: "wires", label: "Podłączenie przewodów", map: "titan_dome", node: "vent_tunnel", intel: "Wentylacja: filtr sektora C naprawiony po podłączeniu obwodu zasilania." },
    reward: { credits: 380, xp: 85, item: "wires", itemQty: 2, rep: 25 },
  },
  {
    id: "mt_trader4_terminal",
    traderId: "trader4",
    isMain: true,
    title: "Rejestr Mieszkalny Hab-4",
    desc: "Zapamiętaj i odtwórz sekwencję sygnałów w Sektorze Mieszkalnym Hab-4 i dostarcz 1x Kamizelka kevlarowa.",
    req: [
      { id: "vest_kevlar", qty: 1 },
    ],
    task: { type: "memory", label: "Sekwencja sygnałów", map: "titan_dome", node: "apartments", intel: "Hab-4: kod przydziału schronu to sekwencja z panelu – zapisana w pamięci strażnika." },
    reward: { credits: 420, xp: 95, item: "bandage", itemQty: 3, rep: 25 },
  },
  {
    id: "mt_trader5_terminal",
    traderId: "trader5",
    isMain: true,
    title: "Podsłuch Sieci Kolejowej",
    desc: "Odczytaj terminal na Stacji Kolejki Szynowej (klucz dostępu w logu) i dostarcz 2x Chip Danych.",
    req: [
      { id: "data_chip", qty: 2 },
    ],
    task: { type: "terminal", label: "Odczyt terminala", map: "titan_dome", node: "subway", key: "6HM1", intel: "Sieć szynowa: przełącznik zwrotnicy o kodzie 6HM1 zmieniono ręcznie. Ktoś tu był." },
    reward: { credits: 600, xp: 120, item: "circuit", itemQty: 2, rep: 30 },
  },
  {
    id: "mt_trader6_terminal",
    traderId: "trader6",
    isMain: true,
    title: "Raport Dowódcy Stacji",
    desc: "Włam się do zamka w laboratorium Wega-7 (zatrzymaj wskaźnik w zielonym polu) i dostarcz 2x Układ scalony.",
    req: [
      { id: "circuit", qty: 2 },
    ],
    task: { type: "hack", label: "Włamanie do zamka", map: "vega", node: "lab", intel: "Wega-7: dowództwo odblokowało sektor. Dane do ewakuacji dostępne." },
    reward: { credits: 550, xp: 110, item: "medkit", itemQty: 1, rep: 30 },
  },
  {
    id: "mt_trader7_terminal",
    traderId: "trader7",
    isMain: true,
    title: "Mapa Głębinowa Prometeusz",
    desc: "Podłącz przewody sondy przy Głębokim złożu Xenonitu i dostarcz 2x Ore Tytanu.",
    req: [
      { id: "ore_titanium", qty: 2 },
    ],
    task: { type: "wires", label: "Podłączenie przewodów", map: "titan_mines", node: "deep_xenonite", intel: "Złoże: sonda wskazuje żyłę xenonitu 40 m poniżej poziomu głównego." },
    reward: { credits: 700, xp: 140, item: "helium3", itemQty: 1, rep: 35 },
  },
  {
    id: "mt_trader8_terminal",
    traderId: "trader8",
    isMain: true,
    title: "Zapis Skarbca Starej Ziemi",
    desc: "Pokonaj Matkę Archiwum i dostarcz 1x Starożytny Relikt Ziemi.",
    req: [
      { id: "relic_old_earth", qty: 1 },
    ],
    kill: "archive_mother",
    reward: { credits: 900, xp: 180, item: "gold_ingot", itemQty: 1, rep: 35 },
  },
  {
      id: "saga_trader1_1",
      traderId: "trader1",
      isMain: true,
      title: "Lekarstwo na Szept",
      desc: "Dr Vane prowadziła w Nowym Ereb klinikę, zanim Szept, który trwa od sześćdziesięciu lat, zamknął szpital za grodziami. Wierzy, że w laboratoriach izolacji zostały próbki, które mogą zatrzymać zarażenie, zanim rozprzestrzeni się dalej. Bez nich każda kolejna apteczka to tylko opóźnienie. Dostarcz 6x Apteczka, 4x Morfina i 2x Szmata. Zdobądź dane z terminala w laboratorium na Tau Ceti - Fabryka Helix.",
      req: [
          {
              id: "medkit",
              qty: 6
          },
          {
              id: "morphine",
              qty: 4
          },
          {
              id: "cloth",
              qty: 2
          }
      ],
      reward: {
          credits: 2400,
          xp: 420,
          rep: 70,
          item: "nanite_serum",
          itemQty: 1
      },
      task: {
          type: "terminal",
          label: "Odczyt terminala",
          map: "tau_e_factory",
          node: "control",
          intel: "Kontrola fabryki: próbki Szeptu przechowywano w chłodni, którą zamknięto z zewnątrz."
      }
  },
  {
      id: "saga_trader1_2",
      traderId: "trader1",
      isMain: true,
      title: "Krew Pierwszej Fali",
      desc: "Pierwsze ofiary Szeptu nie umarły od razu. Ich krew wciąż zawiera fragmenty patogenu, które Dr Vane chce rozłożyć na składniki, zanim zniszczą kolejną dzielnicę. Próbki trzeba zebrać z martwych ciał, a nie z żywych zarażonych. Dostarcz 6x Tkanka mózgowa zarażonego, 4x Skrzep patogenu Tytana i 3x Opatrunek hemostatyczny. Zapamiętaj sekwencję próbek w silosie na Tau Ceti e.",
      req: [
          {
              id: "infected_tissue",
              qty: 6
          },
          {
              id: "pathogen_clot",
              qty: 4
          },
          {
              id: "hemostatic",
              qty: 3
          }
      ],
      reward: {
          credits: 2800,
          xp: 460,
          rep: 80,
          item: "adrenal_patch",
          itemQty: 2
      },
      task: {
          type: "memory",
          label: "Sekwencja próbek",
          map: "tau_e_colony",
          node: "silo",
          intel: "Silos: próbki z pierwszej fali były podpisane kodem szpitala Ereb."
      },
      kill: "zombie_brute"
  },
  {
      id: "saga_trader1_3",
      traderId: "trader1",
      isMain: true,
      title: "Szczepionka z Mrozu",
      desc: "Na Wedze IV pod lodem pracowała stara fabryka syntezy, która produkowała preparaty dla kolonii. Według notatek Vane'a część zapasów nadal leży w reaktorze, pod warunkiem że ktoś poradzi sobie z zabezpieczeniami. Bez szczepionki wszystko, co zbudujemy na powierzchni, zostanie zarażone. Wymaga Stacji Medycznej poz. 2. Dostarcz 2x Serum nanitów, 8x Apteczka i 10x Szmata. Podłącz przewody w reaktorze na Wedze IV.",
      req: [
          {
              id: "nanite_serum",
              qty: 2
          },
          {
              id: "medkit",
              qty: 8
          },
          {
              id: "cloth",
              qty: 10
          }
      ],
      reward: {
          credits: 3400,
          xp: 520,
          rep: 90,
          item: "shield_gel",
          itemQty: 2
      },
      task: {
          type: "wires",
          label: "Podłączenie przewodów",
          map: "vega_iv_glacier",
          node: "reactor",
          intel: "Reaktor: zasilanie zabezpieczeń prowadzi do komory z preparatami."
      },
      kill: "infected_brute_miner",
      needModule: {
          id: "Medstation",
          level: 2
      }
  },
  {
      id: "saga_trader1_4",
      traderId: "trader1",
      isMain: true,
      title: "Ostatnia Dawka",
      desc: "Vane mówi, że ostatnia dawka nie jest lekiem, tylko zakładem: albo zatrzyma Szept w jednym ciele, albo zabije tego, kto ją przyjmie. Potrzebuje układu neuronowego, koncentratu i czasu, a tego ostatniego nikt nie ma wiele. Jeśli się uda, pierwszy raz od miesięcy w Ereb będzie można zacząć od nowa. Dostarcz 1x Neuroprocesor, 3x Serum nanitów i 4x Koncentrat Tytana. Włam się do rdzenia reaktora kopuły Tytana.",
      req: [
          {
              id: "neural_chip",
              qty: 1
          },
          {
              id: "nanite_serum",
              qty: 3
          },
          {
              id: "titan_ration",
              qty: 4
          }
      ],
      reward: {
          credits: 4500,
          xp: 700,
          rep: 120,
          item: "titan_plate",
          itemQty: 1
      },
      task: {
          type: "hack",
          label: "Włamanie do rdzenia",
          map: "titan_dome",
          node: "reactor_core",
          intel: "Rdzeń: system podtrzymania życia kopuły jest sterowany z zewnętrznej stacji."
      },
      kill: "infected_stalker"
  },
  {
      id: "saga_trader2_1",
      traderId: "trader2",
      isMain: true,
      title: "Pierwsza Strzelnica",
      desc: "Sierżant Karras straci posterunek, jeśli strzelnica na Tau Ceti f znów przejdzie w ręce Szeptu. Jego ludzie zginęli, bo zabrakło amunicji, a nie odwagi. Teraz chce wiedzieć, ile zapasów zostało w magazynach i czy da się je przywrócić do użytku. Dostarcz 60x Amunicja 5.56mm NATO, 40x Amunicja 9mm i 3x Przewody. Przeszukaj terminal stanowiska na Tytanie - Kopule Nowy Ereb.",
      req: [
          {
              id: "ammo556",
              qty: 60
          },
          {
              id: "ammo9",
              qty: 40
          },
          {
              id: "wires",
              qty: 3
          }
      ],
      reward: {
          credits: 2200,
          xp: 400,
          rep: 70,
          item: "ammo762",
          itemQty: 60
      },
      task: {
          type: "terminal",
          label: "Odczyt terminala",
          map: "titan_dome",
          node: "evac_pad",
          intel: "Lądowisko: rozkazy ewakuacji wydano przed zerwaniem łączności."
      }
  },
  {
      id: "saga_trader2_2",
      traderId: "trader2",
      isMain: true,
      title: "Szafa Przebijająca",
      desc: "Zbrojownia w szybach Tytana zamknięta jest zamkiem, który połączono z centralą straży. Karras wie, że sam zamek jest prosty, ale do jego otwarcia potrzeba ludzi, którzy znają drogę. Każdy dzień zwłoki to kolejne uzbrojone patrole. Dostarcz 80x Amunicja 5.56mm NATO, 3x Układ scalony i 2x Amunicja 7.62mm Precyzyjna. Włam się do zamka szybu helowego na Tytanie.",
      req: [
          {
              id: "ammo556",
              qty: 80
          },
          {
              id: "circuit",
              qty: 3
          },
          {
              id: "ammo762",
              qty: 20
          }
      ],
      reward: {
          credits: 2600,
          xp: 430,
          rep: 75,
          item: "ammo_magnum",
          itemQty: 20
      },
      task: {
          type: "hack",
          label: "Włamanie do zamka",
          map: "titan_mines",
          node: "crusher_room",
          intel: "Kruszarka: zamek sterowany z centrali straży, hasło w pamięci modułu."
      },
      kill: "raider"
  },
  {
      id: "saga_trader2_3",
      traderId: "trader2",
      isMain: true,
      title: "Działo Strażnika",
      desc: "Plazmowa karabinka, którą Karras znalazł w magazynie, ma uszkodzoną cewkę. Strażnicy twierdzą, że bez niej żaden posterunek nie utrzyma kordonu. Trzeba zdobyć plazmę i części, których nie wydobywa się na powierzchni. Wymaga Warsztatu poz. 2. Dostarcz 30x Ogniwa plazmowe, 4x Układ scalony i 1x Karabinek plazmowy Nova-7 Nova-7. Odczytaj pamięć wieży w fabryce na Tau Ceti e.",
      req: [
          {
              id: "ammo_plasma",
              qty: 30
          },
          {
              id: "circuit",
              qty: 4
          },
          {
              id: "plasma_carbine",
              qty: 1
          }
      ],
      reward: {
          credits: 3800,
          xp: 540,
          rep: 90,
          item: "rail_gauss",
          itemQty: 1
      },
      task: {
          type: "memory",
          label: "Sekwencja celowania",
          map: "tau_e_factory",
          node: "furnace",
          intel: "Piec: wieża celownicza ma zapisane współrzędne ostatniej bitwy."
      },
      kill: "titan_raider",
      needModule: {
          id: "Crafting",
          level: 2
      }
  },
  {
      id: "saga_trader2_4",
      traderId: "trader2",
      isMain: true,
      title: "Zamknięta Zbrojownia",
      desc: "Ostatnia zbrojownia straży została zamknięta przez samych żołnierzy, którzy nie chcieli, by bronie trafiły do zainfekowanych. Karras prosi o jej otwarcie, nawet jeśli oznacza to przejęcie kluczy od ludzi, którzy już nie żyją. Wie, że to będzie najtrudniejsze zadanie w jego karierze. Dostarcz 40x Amunicja .44 Magnum, 1x Karabinek plazmowy Nova-7 i 2x Kryształ Xenonitu. Przecinij przewody w pompowni na Wedze IV.",
      req: [
          {
              id: "ammo_magnum",
              qty: 40
          },
          {
              id: "plasma_carbine",
              qty: 1
          },
          {
              id: "xenonite_crystal",
              qty: 2
          }
      ],
      reward: {
          credits: 5000,
          xp: 760,
          rep: 130,
          item: "void_blade",
          itemQty: 1
      },
      task: {
          type: "wires",
          label: "Przecięcie przewodów",
          map: "vega_iv_glacier",
          node: "pump_hall",
          intel: "Pompownia: zamki zbrojowni są podłączone do pomp chłodzących."
      },
      kill: "infected_brute_miner"
  },
  {
      id: "saga_trader3_1",
      traderId: "trader3",
      isMain: true,
      title: "Złomowisko Tytana",
      desc: "Borys zbiera wszystko, co da się naprawić, bo koloniści zostali bez części zamiennych w dniu, w którym Szept dotarł do kopalń. Złomowisko w szybach Prometeusza jest ostatnim miejscem, gdzie cokolwiek jeszcze działa. Trzeba je uporządkować, zanim zawali się od wilgoci. Dostarcz 15x Złom, 6x Przewody i 4x Układ scalony. Podłącz przewody w głębinowej kopalni Prometeusz.",
      req: [
          {
              id: "scrap",
              qty: 15
          },
          {
              id: "wires",
              qty: 6
          },
          {
              id: "circuit",
              qty: 4
          }
      ],
      reward: {
          credits: 2000,
          xp: 380,
          rep: 60,
          item: "part_coil",
          itemQty: 2
      },
      task: {
          type: "wires",
          label: "Podłączenie przewodów",
          map: "titan_mines",
          node: "deep_xenonite",
          intel: "Głębinowy ksenonit: zasilanie stacji odzysku idzie tym kablem."
      },
      kill: "zombie_crawler"
  },
  {
      id: "saga_trader3_2",
      traderId: "trader3",
      isMain: true,
      title: "Filtr Ostatniej Generacji",
      desc: "Filtr powietrza z kopalni Prometeusz przestał działać, a stare zapasy zostały zarażone pyłem Szeptu. Borys ma plan naprawy, ale potrzebuje części, których nie da się kupić. Każdy zrobiony filtr to kilkadziesiąt osób, które mogą oddychać bez maski. Dostarcz 2x Filtr Tytana, 3x Uszczelka komory i 5x Układ scalony. Odczytaj terminal w jaskini helowej na Tytanie.",
      req: [
          {
              id: "titan_filter",
              qty: 2
          },
          {
              id: "part_gasket",
              qty: 3
          },
          {
              id: "circuit",
              qty: 5
          }
      ],
      reward: {
          credits: 2600,
          xp: 460,
          rep: 75,
          item: "titan_filter",
          itemQty: 1
      },
      task: {
          type: "terminal",
          label: "Odczyt terminala",
          map: "titan_mines",
          node: "cavern_helium",
          intel: "Jaskinia helowa: filtry były kalibrowane według czujników z kopuły."
      }
  },
  {
      id: "saga_trader3_3",
      traderId: "trader3",
      isMain: true,
      title: "Rdzeń Odzysku",
      desc: "Stara sonda z fabryki Helix ma rdzeń, który mógłby zasilić cały posterunek przez rok. Borys nie chce go sprzedać, tylko uruchomić, bo wtedy wszyscy wrócą do pracy. Problem w tym, że zabezpieczenia rdzenia zapalają się przy każdym kontakcie z obcymi systemami. Wymaga Warsztatu poz. 2. Dostarcz 1x Rdzeń fuzyjny Tytana, 2x Wtryskiwacz plazmowy i 3x Ogniwo paliwowe. Włam się do zasilania w magazynie fabryki Helix.",
      req: [
          {
              id: "titan_fusion_core",
              qty: 1
          },
          {
              id: "part_injector",
              qty: 2
          },
          {
              id: "fuel_cell",
              qty: 3
          }
      ],
      reward: {
          credits: 3400,
          xp: 560,
          rep: 90,
          item: "titan_plate",
          itemQty: 1
      },
      task: {
          type: "hack",
          label: "Włamanie do zasilania",
          map: "tau_e_factory",
          node: "storage",
          intel: "Magazyn: zabezpieczenia rdzenia są podpięte pod ten sam obwód co drzwi."
      },
      kill: "raider",
      needModule: {
          id: "Crafting",
          level: 2
      }
  },
  {
      id: "saga_trader3_4",
      traderId: "trader3",
      isMain: true,
      title: "Pełna Rekonstrukcja",
      desc: "Ostatnia część planu Borysa to przebudowa całej stacji odzysku w jedno, samowystarczalne centrum. Potrzeba do tego kryształów, rdzeni i wielu godzin pracy, a każda pomyłka może wszystko wysadzić. To zadanie na tydzień, nie na jeden rajd. Dostarcz 3x Kryształ Xenonitu, 2x Rdzeń fuzyjny Tytana, 6x Meteoryt żelazny i 6x Układ scalony. Odczytaj pamięć sektora Hydroponika w kopule.",
      req: [
          {
              id: "xenonite_crystal",
              qty: 3
          },
          {
              id: "titan_fusion_core",
              qty: 2
          },
          {
              id: "meteor_iron",
              qty: 6
          },
          {
              id: "circuit",
              qty: 6
          }
      ],
      reward: {
          credits: 5200,
          xp: 780,
          rep: 120,
          item: "gold_ingot",
          itemQty: 2
      },
      task: {
          type: "memory",
          label: "Sekwencja rekonstrukcji",
          map: "titan_dome",
          node: "hydro_park",
          intel: "Hydroponika: plan przebudowy zapisano na dysku sektora."
      },
      kill: "zombie_spitter"
  },
  {
      id: "saga_trader4_1",
      traderId: "trader4",
      isMain: true,
      title: "Pancerz dla Ocalałych",
      desc: "Nadia prowadzi magazyn dla ludzi, którzy wrócili z rajdów z połamanymi kamizelkami. Każda zniszczona osłona to kolejny człowiek, który nie wróci na następny patrol. Na pierwszy raz potrzebuje po prostu materiałów, ale za tydzień będzie potrzebować ich dwa razy więcej. Dostarcz 12x Szmata, 1x Kamizelka kevlarowa i 8x Złom. Zaloguj się do terminala lądowiska w kopule.",
      req: [
          {
              id: "cloth",
              qty: 12
          },
          {
              id: "vest_kevlar",
              qty: 1
          },
          {
              id: "scrap",
              qty: 8
          }
      ],
      reward: {
          credits: 2200,
          xp: 400,
          rep: 65,
          item: "helmet_tactical",
          itemQty: 1
      },
      task: {
          type: "terminal",
          label: "Odczyt terminala",
          map: "titan_dome",
          node: "subway",
          intel: "Metro: zapis z magazynu pancerzy pokazuje ostatnią dostawę."
      }
  },
  {
      id: "saga_trader4_2",
      traderId: "trader4",
      isMain: true,
      title: "Ciężka Osłona",
      desc: "Pancerz egzoszkieletowy był kiedyś standardem na stacjach, ale na Tytanie zostały tylko kawałki. Nadia ma plan, by z nich złożyć jedną sprawną zbroję, zanim straż zacznie zabierać każdy kawałek metalu. Potrzebuje do tego rąk, materiałów i kogoś, kto przeżyje w szybach. Wymaga Warsztatu poz. 2. Dostarcz 12x Złom, 2x Ogniwo paliwowe i 1x Głębinowy Chwytak Plazmowy. Przecinij przewody w silosie na Tau Ceti e.",
      req: [
          {
              id: "scrap",
              qty: 12
          },
          {
              id: "fuel_cell",
              qty: 2
          },
          {
              id: "mining_glove",
              qty: 1
          }
      ],
      reward: {
          credits: 3000,
          xp: 500,
          rep: 85,
          item: "shield_gel",
          itemQty: 2
      },
      task: {
          type: "wires",
          label: "Podłączenie przewodów",
          map: "tau_e_colony",
          node: "bunker",
          intel: "Bunkier: zasilanie zbroi zostało odcięte od zapasów."
      },
      kill: "zombie_brute",
      needModule: {
          id: "Crafting",
          level: 2
      }
  },
  {
      id: "saga_trader4_3",
      traderId: "trader4",
      isMain: true,
      title: "Zaopatrzenie Frontu",
      desc: "Na wschodnim kordonie ludzie giną nie od zarażenia, ale od wycieńczenia. Nadia chce wysłać paczki z koncentratem, adrenaliną i bandażami, zanim zima na Tau Ceti zabije resztę zapasów. To długa trasa, ale bez niej kordon się załamie. Dostarcz 6x Koncentrat Tytana, 3x Plaster adrenalinowy i 10x Bandaż. Odczytaj pamięć kaplicy w osadzie Ecru.",
      req: [
          {
              id: "titan_ration",
              qty: 6
          },
          {
              id: "adrenal_patch",
              qty: 3
          },
          {
              id: "bandage",
              qty: 10
          }
      ],
      reward: {
          credits: 3600,
          xp: 540,
          rep: 90,
          item: "nanite_serum",
          itemQty: 2
      },
      task: {
          type: "memory",
          label: "Sekwencja zaopatrzenia",
          map: "tau_e_colony",
          node: "chapel",
          intel: "Kaplica: listy przewozowe ukryto w księgach modlitw."
      },
      kill: "infected_runner"
  },
  {
      id: "saga_trader4_4",
      traderId: "trader4",
      isMain: true,
      title: "Ostateczny Pancerz",
      desc: "Nadia wie, że pancerz, który sama wymyśliła, potrzebuje rdzenia, który mogłyby go napędzać. Plan jest prosty, ale wymaga układu neuronowego, płyty tytanowej i sprawnej osłony. Każdy element zdobędzie się tylko w bitwie. Dostarcz 1x Płyta tytanowa, 3x Żel ochronny, 1x Neuroprocesor i 10x Złom. Włam się do reaktora na Wedze IV.",
      req: [
          {
              id: "titan_plate",
              qty: 1
          },
          {
              id: "shield_gel",
              qty: 3
          },
          {
              id: "neural_chip",
              qty: 1
          },
          {
              id: "scrap",
              qty: 10
          }
      ],
      reward: {
          credits: 5000,
          xp: 760,
          rep: 130,
          item: "armor_exo",
          itemQty: 1
      },
      task: {
          type: "hack",
          label: "Włamanie do reaktora",
          map: "vega_iv_glacier",
          node: "reactor",
          intel: "Reaktor: system sterowania zbroją jest powiązany z obwodem chłodzenia."
      },
      kill: "titan_raider"
  },
  {
      id: "saga_trader5_1",
      traderId: "trader5",
      isMain: true,
      title: "Pierwszy Podsłuch",
      desc: "Val przechwyciła pierwsze sygnały z przekaźnika na Neptunie, ale nie zdążyła ich odczytać przed przerwaniem połączenia. Potrzebuje kolejnych kart danych, by złożyć z nich choćby fragment rozmowy. Jeśli ktoś zrozumie tę rozmowę, może dowiedzieć się, kto stoi za Szeptem. Dostarcz 4x Chip danych i 4x Układ scalony. Odczytaj pamięć z rdzenia na kopule.",
      req: [
          {
              id: "data_chip",
              qty: 4
          },
          {
              id: "circuit",
              qty: 4
          }
      ],
      reward: {
          credits: 2200,
          xp: 400,
          rep: 65,
          item: "circuit",
          itemQty: 6
      },
      task: {
          type: "memory",
          label: "Sekwencja sygnałów",
          map: "titan_dome",
          node: "quarantine_lab",
          intel: "Laboratorium kwarantanny: sygnał idzie w stronę kopuły, nie w stronę Neptuna."
      }
  },
  {
      id: "saga_trader5_2",
      traderId: "trader5",
      isMain: true,
      title: "Szyfr z Ziemi",
      desc: "Stare dane z Ziemi są zaszyfrowane kluczem, który znają tylko ludzie z pierwszej fali. Val ma kilka kluczy, ale żaden nie pasuje, więc potrzebuje kolejnych próbek i dokumentów. Im więcej danych zbierze, tym bliżej będzie prawdy o pierwszych dniach. Dostarcz 6x Chip danych, 1x Starożytny Relikt Ziemi i 6x Przewody. Zaloguj się do terminala w kopalni Prometeusz.",
      req: [
          {
              id: "data_chip",
              qty: 6
          },
          {
              id: "relic_old_earth",
              qty: 1
          },
          {
              id: "wires",
              qty: 6
          }
      ],
      reward: {
          credits: 2900,
          xp: 480,
          rep: 80,
          item: "artifact_orb",
          itemQty: 1
      },
      task: {
          type: "terminal",
          label: "Odczyt terminala",
          map: "titan_mines",
          node: "relic_vault",
          intel: "Skarbiec reliktów: dokumenty z Ziemi mają zakodowane nagłówki."
      },
      kill: "raider"
  },
  {
      id: "saga_trader5_3",
      traderId: "trader5",
      isMain: true,
      title: "Głębokie Sygnały",
      desc: "Sygnały z Neptuna przestały być przypadkowe. Val uważa, że ktoś nadaje z głębi, a nadajnik ukryto w chłodzeniu, by nikt go nie wykrył. Musi go znaleźć, zanim przestanie działać. Wymaga Warsztatu poz. 2. Dostarcz 8x Chip danych, 3x Platynowy drut i 6x Układ scalony. Włam się do systemu chłodzenia w kopalni Prometeusz.",
      req: [
          {
              id: "data_chip",
              qty: 8
          },
          {
              id: "platinum_wire",
              qty: 3
          },
          {
              id: "circuit",
              qty: 6
          }
      ],
      reward: {
          credits: 3500,
          xp: 560,
          rep: 95,
          item: "neural_chip",
          itemQty: 1
      },
      task: {
          type: "hack",
          label: "Włamanie do chłodzenia",
          map: "titan_mines",
          node: "maint_depot",
          intel: "Skład konserwacyjny: chłodzenie nadajnika zapisano w logu sprzętu."
      },
      kill: "infected_stalker",
      needModule: {
          id: "Crafting",
          level: 2
      }
  },
  {
      id: "saga_trader5_4",
      traderId: "trader5",
      isMain: true,
      title: "Czarna Skrzynka",
      desc: "Czarna skrzynka z przekaźnika to jedyna rzecz, która przetrwała zniszczenie stacji. Val wie, że w jej pamięci jest wszystko, co Szept zrobił z ludźmi na Neptunie. Odczyt zajmie dni, a każdy błąd może ją zniszczyć na zawsze. Dostarcz 2x Neuroprocesor, 4x Platynowy drut, 10x Chip danych i 2x Ogniwo paliwowe. Odczytaj pamięć w ekranie lądowiska na Wedze IV.",
      req: [
          {
              id: "neural_chip",
              qty: 2
          },
          {
              id: "platinum_wire",
              qty: 4
          },
          {
              id: "data_chip",
              qty: 10
          },
          {
              id: "fuel_cell",
              qty: 2
          }
      ],
      reward: {
          credits: 5000,
          xp: 780,
          rep: 125,
          item: "titan_diamond",
          itemQty: 2
      },
      task: {
          type: "memory",
          label: "Odczyt czarnej skrzynki",
          map: "vega_iv_glacier",
          node: "ice_field",
          intel: "Pole lodowe: skrzynka wysyłała sygnał ostatni raz w tym miejscu."
      },
      kill: "infected_spitter_heavy"
  },
  {
      id: "saga_trader6_1",
      traderId: "trader6",
      isMain: true,
      title: "Patrol Zachodni",
      desc: "Sławiński utrzymuje posterunki na zachodnich wejściach do kopuły, ale każdy patrol wraca z mniejszą liczbą ludzi. Potrzebuje amunicji, leków i kogoś, kto wróci z informacją o tym, co dzieje się za kolejnymi śluzami. Bez tego kopuła zostanie otoczona. Dostarcz 60x Amunicja 9mm, 4x Apteczka i 1x Instrukcja serwisowa. Odczytaj terminal lądowiska w kopule.",
      req: [
          {
              id: "ammo9",
              qty: 60
          },
          {
              id: "medkit",
              qty: 4
          },
          {
              id: "manual",
              qty: 1
          }
      ],
      reward: {
          credits: 2200,
          xp: 400,
          rep: 65,
          item: "ammo556",
          itemQty: 60
      },
      task: {
          type: "terminal",
          label: "Odczyt terminala",
          map: "titan_dome",
          node: "evac_pad",
          intel: "Lądowisko: patrol zniknął w kierunku szpitala."
      },
      kill: "raider"
  },
  {
      id: "saga_trader6_2",
      traderId: "trader6",
      isMain: true,
      title: "Posterunek Hub",
      desc: "Posterunek w hubie był jednym z najważniejszych punktów straży, aż przestał odpowiadać na wezwania. Sławiński chce wiedzieć, czy to nowy atak, czy zwykła awaria zasilania. Jeśli zasilanie, da się je naprawić, a jeśli atak, trzeba ostrzec resztę. Dostarcz 60x Amunicja 5.56mm NATO, 10x Bandaż i 3x Szyna usztywniająca. Przecinij przewody w szpitalu kopuły.",
      req: [
          {
              id: "ammo556",
              qty: 60
          },
          {
              id: "bandage",
              qty: 10
          },
          {
              id: "splint",
              qty: 3
          }
      ],
      reward: {
          credits: 2900,
          xp: 480,
          rep: 80,
          item: "helmet_tactical",
          itemQty: 1
      },
      task: {
          type: "wires",
          label: "Podłączenie przewodów",
          map: "titan_dome",
          node: "hospital",
          intel: "Szpital: zasilanie posterunku jest podłączone do szpitalnego generatora."
      },
      kill: "zombie_brute"
  },
  {
      id: "saga_trader6_3",
      traderId: "trader6",
      isMain: true,
      title: "Kordon Ognia",
      desc: "Kordon ognia na południowym sektorze to ostatnia linia obrony przed pustymi, którzy schodzą z Tau Ceti. Sławiński wie, że bez amunicji magazynowej kordon się zapadnie. Musi zabezpieczyć zapasy, zanim ktoś z nich zrobi użytek w wojnie. Dostarcz 50x Amunicja 12mm, 6x Bandaż uciskowy i 4x Układ scalony. Włam się do zamka domu mieszkalnego na Tau Ceti e.",
      req: [
          {
              id: "ammo12",
              qty: 50
          },
          {
              id: "tourniquet",
              qty: 6
          },
          {
              id: "circuit",
              qty: 4
          }
      ],
      reward: {
          credits: 3500,
          xp: 560,
          rep: 90,
          item: "shield_gel",
          itemQty: 2
      },
      task: {
          type: "hack",
          label: "Włamanie do zamka",
          map: "tau_e_colony",
          node: "houses",
          intel: "Domy: zamek kordonu jest przypisany do kwater straży."
      },
      kill: "infected_brute_miner"
  },
  {
      id: "saga_trader6_4",
      traderId: "trader6",
      isMain: true,
      title: "Ostatni Rozkaz",
      desc: "Sławiński otrzymał rozkaz, który nie pochodzi z żadnej centrali: utrzymać kopułę za wszelką cenę, nawet kosztem reszty Układu. Ma w rękach ostatnie zapasy plazmy, nanitów i płyty tytanowej, ale nie wie, czy ktoś je jeszcze odbierze. Ten rozkaz trzeba wykonać albo zerwać. Dostarcz 40x Ogniwa plazmowe, 2x Serum nanitów i 1x Płyta tytanowa. Odczytaj dane w maszynowni kopalni Prometeusz.",
      req: [
          {
              id: "ammo_plasma",
              qty: 40
          },
          {
              id: "nanite_serum",
              qty: 2
          },
          {
              id: "titan_plate",
              qty: 1
          }
      ],
      reward: {
          credits: 5000,
          xp: 760,
          rep: 130,
          item: "rail_gauss",
          itemQty: 1
      },
      task: {
          type: "memory",
          label: "Sekwencja rozkazu",
          map: "titan_mines",
          node: "maint_depot",
          intel: "Maszynownia: rozkaz zapisano w kodzie dostępowym śluz."
      },
      kill: "titan_raider"
  },
  {
      id: "saga_trader7_1",
      traderId: "trader7",
      isMain: true,
      title: "Próbki Dna Kopalni",
      desc: "Thorne prowadzi badania nad skałami Tytana od lat i wie, że kopalnia skrywa coś więcej niż minerały. Próbki z najgłębszych warstw mogą wyjaśnić, dlaczego Szept rozprzestrzenia się właśnie tędy. Potrzebuje ich dużo, bo każda warstwa wygląda inaczej. Dostarcz 6x Czysta Ruda Tytana, 2x Kryształ Xenonitu i 4x Przewody. Podłącz przewody w kruszarni na Tytanie.",
      req: [
          {
              id: "ore_titanium",
              qty: 6
          },
          {
              id: "xenonite_crystal",
              qty: 2
          },
          {
              id: "wires",
              qty: 4
          }
      ],
      reward: {
          credits: 2400,
          xp: 420,
          rep: 70,
          item: "helium3",
          itemQty: 3
      },
      task: {
          type: "wires",
          label: "Podłączenie przewodów",
          map: "titan_mines",
          node: "crusher_room",
          intel: "Kruszarka: próbki są analizowane w tym samym obwodzie."
      },
      kill: "zombie_crawler"
  },
  {
      id: "saga_trader7_2",
      traderId: "trader7",
      isMain: true,
      title: "Szyb Helowy",
      desc: "Szyb helowy z jaskini zamknął się po ataku, a Thorne twierdzi, że hel jest jedynym środkiem, który utrzyma stacje przy życiu. Musi przejść przez szyb, zbadać zawalone korytarze i wrócić z próbkami. Bez odpowiedzi nie ma dalszych badań. Dostarcz 5x Izotop Hel-3 (Kriogeniczny), 1x Diament Krystaliczny Tytana i 4x Przewody. Odczytaj terminal w jaskini helowej na Tytanie.",
      req: [
          {
              id: "helium3",
              qty: 5
          },
          {
              id: "titan_diamond",
              qty: 1
          },
          {
              id: "wires",
              qty: 4
          }
      ],
      reward: {
          credits: 3000,
          xp: 500,
          rep: 85,
          item: "gold_ingot",
          itemQty: 2
      },
      task: {
          type: "terminal",
          label: "Odczyt terminala",
          map: "titan_mines",
          node: "cavern_helium",
          intel: "Jaskinia helowa: zapis mówi, że szyb zalano celowo."
      },
      kill: "infected_runner"
  },
  {
      id: "saga_trader7_3",
      traderId: "trader7",
      isMain: true,
      title: "Komora Ciśnień",
      desc: "Komora ciśnień na Jowiszu została zaprojektowana tak, by wytrzymać wszystko, ale Thorne podejrzewa, że ktoś zmienił jej nastawy. Bez ich przywrócenia nie da się uruchomić żadnego badania głębinowego. Potrzebuje meteorytów, uszczelek i paliwa do pierwszego testu. Wymaga Warsztatu poz. 2. Dostarcz 8x Meteoryt żelazny, 4x Uszczelka komory i 3x Ogniwo paliwowe. Włam się do zasilania sektora gazowego w Fabryce Helix.",
      req: [
          {
              id: "meteor_iron",
              qty: 8
          },
          {
              id: "part_gasket",
              qty: 4
          },
          {
              id: "fuel_cell",
              qty: 3
          }
      ],
      reward: {
          credits: 3600,
          xp: 560,
          rep: 95,
          item: "titan_diamond",
          itemQty: 1
      },
      task: {
          type: "hack",
          label: "Włamanie do zasilania",
          map: "tau_e_factory",
          node: "assembly",
          intel: "Montownia: zasilanie komory jest sterowane z hali montażowej."
      },
      kill: "infected_stalker",
      needModule: {
          id: "Crafting",
          level: 2
      }
  },
  {
      id: "saga_trader7_4",
      traderId: "trader7",
      isMain: true,
      title: "Serce Głębin",
      desc: "Thorne ma ostatni plan: uruchomić pompy chłodzące na Wedze IV, które przez lata utrzymywały głębinową stację w ruchu. Pompy pracują na ksenonicie i tytanie, a bez nich każda próba wejścia w lód kończy się śmiercią. Musi to zrobić, zanim jego zespół się rozpadnie. Dostarcz 3x Diament Krystaliczny Tytana, 4x Kryształ Xenonitu, 1x Rdzeń fuzyjny Tytana i 1x Serum nanitów. Przecinij przewody w pompowni na Wedze IV.",
      req: [
          {
              id: "titan_diamond",
              qty: 3
          },
          {
              id: "xenonite_crystal",
              qty: 4
          },
          {
              id: "titan_fusion_core",
              qty: 1
          },
          {
              id: "nanite_serum",
              qty: 1
          }
      ],
      reward: {
          credits: 5200,
          xp: 800,
          rep: 130,
          item: "lunar_pearl",
          itemQty: 1
      },
      task: {
          type: "wires",
          label: "Przecięcie przewodów",
          map: "vega_iv_glacier",
          node: "pump_hall",
          intel: "Pompownia: pompy chłodzące są podłączone do jednego zasilania."
      },
      kill: "titan_raider"
  },
  {
      id: "saga_trader8_1",
      traderId: "trader8",
      isMain: true,
      title: "Zgubiony Łup",
      desc: "Jax wie, że w archiwum leżą przedmioty, których nikt nie zabrał, bo zostały uznane za bezwartościowe. Dla szabrowników to jednak wartość, której nie da się przeliczyć na kredyty. Musi je wynieść, zanim zabiorą je zainfekowani. Dostarcz 2x Starożytny Relikt Ziemi, 2x Kieszonkowy zegarek z Ziemi i 10x Złom. Odczytaj pamięć w stosach archiwum na Tytanie.",
      req: [
          {
              id: "relic_old_earth",
              qty: 2
          },
          {
              id: "pocket_watch",
              qty: 2
          },
          {
              id: "scrap",
              qty: 10
          }
      ],
      reward: {
          credits: 2400,
          xp: 420,
          rep: 70,
          item: "emerald_xenon",
          itemQty: 1
      },
      task: {
          type: "memory",
          label: "Sekwencja magazynowa",
          map: "titan_archive",
          node: "stacks",
          intel: "Stosy: spis łupu zapisano na taśmie magazynowej."
      },
      kill: "zombie_spitter"
  },
  {
      id: "saga_trader8_2",
      traderId: "trader8",
      isMain: true,
      title: "Sztab Szabrownika",
      desc: "Jax zdobył mapę sztabu szabrowników, ale większość oznaczeń jest zdarta. Potrzebuje przedmiotów z tego miejsca, by odczytać trasę do ostatniego skarbca. Bez niej każdy wyjazd to strata czasu i zdrowia. Dostarcz 1x Kamienna tablica Ziemi, 1x Hologram rodzinny z Ziemi i 1x Kula Artefaktu Wega. Odczytaj terminal w hali A archiwum na Tytanie.",
      req: [
          {
              id: "ancient_tablet",
              qty: 1
          },
          {
              id: "holo_portrait",
              qty: 1
          },
          {
              id: "artifact_orb",
              qty: 1
          }
      ],
      reward: {
          credits: 3000,
          xp: 500,
          rep: 85,
          item: "ammo_magnum",
          itemQty: 20
      },
      task: {
          type: "terminal",
          label: "Odczyt terminala",
          map: "titan_archive",
          node: "hall_a",
          intel: "Hala A: mapa sztabu jest zapisana w dzienniku dostaw."
      },
      kill: "raider"
  },
  {
      id: "saga_trader8_3",
      traderId: "trader8",
      isMain: true,
      title: "Chwyt Ocalałych",
      desc: "Ocaleni z kopalni Prometeusz zbudowali własne sejfy, ale ich zamki są zbyt prymitywne dla Jaxa. Potrzebuje wtyków injekcyjnych, cewek i złomu, by przerobić jeden z nich na użyteczny chwyt. To zadanie wymaga cierpliwości, a nie siły. Wymaga Warsztatu poz. 2. Dostarcz 2x Wtryskiwacz plazmowy, 2x Cewka zapłonowa i 15x Złom. Włam się do chwytu w głębinowej kopalni Prometeusz.",
      req: [
          {
              id: "part_injector",
              qty: 2
          },
          {
              id: "part_coil",
              qty: 2
          },
          {
              id: "scrap",
              qty: 15
          }
      ],
      reward: {
          credits: 3600,
          xp: 560,
          rep: 95,
          item: "golden_chalice",
          itemQty: 1
      },
      task: {
          type: "hack",
          label: "Włamanie do chwytu",
          map: "titan_mines",
          node: "deep_xenonite",
          intel: "Głębinowy ksenonit: chwyt jest zamknięty kodem z pieca."
      },
      kill: "infected_brute_miner",
      needModule: {
          id: "Crafting",
          level: 2
      }
  },
  {
      id: "saga_trader8_4",
      traderId: "trader8",
      isMain: true,
      title: "Ostatnie Drzwi Archiwum",
      desc: "Za drzwiami sali skarbców w archiwum leży to, po co Jax przyszedł na Tytana. Wie, że drzwi są zabezpieczone przed szabrownikami, ale nie przed kimś, kto zna drogę przez stare przewody. Jeśli się uda, będzie mógł odejść bogaty, a jeśli nie, zostanie tu na zawsze. Dostarcz 1x Złoty Kielich Kolonistów, 2x Kula Artefaktu Wega, 1x Neuroprocesor i 30x Ogniwa plazmowe. Przecinij przewody przy drzwiach archiwum na Tytanie.",
      req: [
          {
              id: "golden_chalice",
              qty: 1
          },
          {
              id: "artifact_orb",
              qty: 2
          },
          {
              id: "neural_chip",
              qty: 1
          },
          {
              id: "ammo_plasma",
              qty: 30
          }
      ],
      reward: {
          credits: 5400,
          xp: 820,
          rep: 135,
          item: "void_blade",
          itemQty: 1
      },
      task: {
          type: "wires",
          label: "Przecięcie przewodów",
          map: "titan_archive",
          node: "vault_door",
          intel: "Drzwi archiwum: obwód zabezpieczeń biegnie przez salę skarbców."
      },
      kill: "archive_mother"
  },
];

// === SEKCJA: STRUKTURALNE MISJE TIEROWE (TIER 0, TIER 1, TIER 2) ===
// Każdy Tier zawiera: 2 startowe (phase: 1), kolejne 2 odblokowywane po zrobieniu 1 z nich (phase: 2) oraz 1 ostateczny quest (phase: "final").
const TIER_QUESTS = [
  // --- TRADER 1: Dr Jan Vane ---
  // Tier 0
  { id: "q0_t1_1", traderId: "trader1", tier: 0, phase: 1, title: "Opatrunki Polowe", desc: "Przekaż 6x Bandaż do przerobienia na bandaże uciskowe.", req: [{ id: "bandage", qty: 6 }], reward: { credits: 180, xp: 30, rep: 30, item: "hemostatic", itemQty: 1 } },
  { id: "q0_t1_2", traderId: "trader1", tier: 0, phase: 1, title: "Dezynfekcja Rur", desc: "Dostarcz 3x Złom i 3x Przewody do produkcji sterylizatorów.", req: [{ id: "scrap", qty: 3 }, { id: "wires", qty: 3 }], reward: { credits: 200, xp: 35, rep: 30, item: "ointment", itemQty: 1 } },
  { id: "q0_t1_3", traderId: "trader1", tier: 0, phase: 2, title: "Sterylne Naczynia", desc: "Przekaż 6x Przewody do podłączenia autoklawu.", req: [{ id: "wires", qty: 6 }], reward: { credits: 240, xp: 40, rep: 35, item: "bandage", itemQty: 2 } },
  { id: "q0_t1_4", traderId: "trader1", tier: 0, phase: 2, title: "Zapas Opatrunków Uciskowych", desc: "Zabezpiecz 6x Opatrunek uciskowy.", req: [{ id: "hemostatic", qty: 6 }], reward: { credits: 280, xp: 45, rep: 35, item: "saturn_cola", itemQty: 1 } },
  { id: "q0_t1_final", traderId: "trader1", tier: 0, phase: "final", title: "[FINAL TIER 0] Mobilny Punkt Sanitarny", desc: "Przekaż 6x Opatrunek hemostatyczny i 6x Racja żywnościowa na utworzenie izby przyjęć.", req: [{ id: "hemostatic", qty: 6 }, { id: "ration", qty: 6 }], reward: { credits: 800, xp: 120, rep: 80, item: "medkit", itemQty: 1 } },

  // Tier 1
  { id: "q2_t5_archive", traderId: "trader5", tier: 2, phase: 1, title: "Dane z Archiwum", desc: "Przynieś z rajdów: 2x Złom.", req: [{ id: "scrap", qty: 2 }], task: { type: "memory", label: "Sekwencja sygnałów", map: "titan_archive", node: "stacks", intel: "Archiwum: plany Kolonii ukryte w sektorze Z-9." }, reward: { credits: 900, xp: 160, rep: 50, item: "titan_fusion_core", itemQty: 1 } },
  { id: "q2_t8_boss", traderId: "trader8", tier: 2, phase: "final", title: "Głowa Matki", desc: "Pokonaj Matkę Archiwum w Sali Matki i dostarcz 1x Kwantowy Rdzeń Szyfrujący.", req: [{ id: "quantum_core", qty: 1 }], kill: "archive_mother", reward: { credits: 1800, xp: 400, rep: 80, item: "gold_ingot", itemQty: 1 } },
  { id: "q1_t1_1", traderId: "trader1", tier: 1, phase: 1, title: "Synteza Antybiotyku", desc: "Dostarcz 2x Opatrunek hemostatyczny do syntezy antybiotyku.", req: [{ id: "hemostatic", qty: 2 }], reward: { credits: 450, xp: 90, rep: 40, item: "splint", itemQty: 2 } },
  { id: "q1_t1_2", traderId: "trader1", tier: 1, phase: 1, title: "Chłodzenie Szczepionek", desc: "Przekaż 2x Komórka paliwowa do zasilania chłodni leków.", req: [{ id: "fuel_cell", qty: 2 }], reward: { credits: 500, xp: 100, rep: 40, item: "medkit", itemQty: 1 } },
  { id: "q1_t1_3", traderId: "trader1", tier: 1, phase: 2, title: "Neutralizacja Toksyn", desc: "Dostarcz 2x Układ scalony do produkcji odtrutek.", req: [{ id: "circuit", qty: 2 }], reward: { credits: 550, xp: 110, rep: 45, item: "decontam_kit", itemQty: 1 } },
  { id: "q1_t1_4", traderId: "trader1", tier: 1, phase: 2, title: "Stymulanty Bojowe", desc: "Przekaż 4x Pakiet dekontaminacyjny na wzmocnienie krążenia pacjentów.", req: [{ id: "decontam_kit", qty: 4 }], reward: { credits: 600, xp: 120, rep: 45, item: "stim_bleedstop", itemQty: 1 } },
  { id: "q1_t1_final", traderId: "trader1", tier: 1, phase: "final", title: "[FINAL TIER 1] Klinika Epidemiologiczna Vane'a", desc: "Dostarcz 4x Zestaw dekontaminacyjny i 2x Skrzep patogenu.", req: [{ id: "decontam_kit", qty: 4 }, { id: "pathogen_clot", qty: 2 }], reward: { credits: 1800, xp: 280, rep: 120, item: "morphine", itemQty: 2, bonusItem: "medicine_case" } },

  // Tier 2
  { id: "q2_t1_1", traderId: "trader1", tier: 2, phase: 1, title: "Serum Przeciwbólowe", desc: "Przekaż 2x Morfina dla stacji medycznej.", req: [{ id: "morphine", qty: 2 }], reward: { credits: 1000, xp: 200, rep: 50, item: "stim_adrenal", itemQty: 2 } },
  { id: "q2_t1_2", traderId: "trader1", tier: 2, phase: 1, title: "Dekontaminacja Sektora H", desc: "Dostarcz 2x Zestaw dekontaminacyjny.", req: [{ id: "decontam_kit", qty: 2 }], reward: { credits: 1100, xp: 220, rep: 50, item: "armor_exo", itemQty: 1 } },
  { id: "q2_t1_3", traderId: "trader1", tier: 2, phase: 2, title: "Biologiczny Przełom", desc: "Przekaż 2x Strzykawka morfiny do badań nad biologią.", req: [{ id: "morphine", qty: 2 }], reward: { credits: 1300, xp: 250, rep: 60, item: "stim_adrenal", itemQty: 2 } },
  { id: "q2_t1_4", traderId: "trader1", tier: 2, phase: 2, title: "Bariera Antywirusowa", desc: "Dostarcz 3x Apteczka i 1x Kwantowy rdzeń.", req: [{ id: "medkit", qty: 3 }, { id: "quantum_core", qty: 1 }], task: { type: "terminal", label: "Odczyt terminala", map: "ziemia_clinic", node: "quarantine_ward", intel: "Oddział kwarantanny: próbki Szeptu sklasyfikowano jako pamięć biologiczną." }, reward: { credits: 1600, xp: 300, rep: 60, item: "morphine", itemQty: 3 } },
  { id: "q2_t1_final", traderId: "trader1", tier: 2, phase: "final", title: "[FINAL TIER 2] Bioniczna Terapia Regeneracyjna", desc: "Przekaż 3x Morfina i 2x Stymulant adrenaliny.", req: [{ id: "morphine", qty: 3 }, { id: "stim_adrenal", qty: 2 }], reward: { credits: 4000, xp: 600, rep: 200, item: "gold_ingot", itemQty: 1 } },

  // --- TRADER 2: Sierżant Karras ---
  // Tier 0
  { id: "q0_t2_1", traderId: "trader2", tier: 0, phase: 1, title: "Zapas Pistoletowy", desc: "Przekaż 45x Amunicja 9mm do testów celności.", req: [{ id: "ammo9", qty: 45 }], reward: { credits: 200, xp: 35, rep: 30, item: "crowbar", itemQty: 1 } },
  { id: "q0_t2_2", traderId: "trader2", tier: 0, phase: 1, title: "Chłodzenie Lufy", desc: "Dostarcz 6x Złom na radiatory lufowe.", req: [{ id: "scrap", qty: 6 }], reward: { credits: 220, xp: 40, rep: 30, item: "ammo9", itemQty: 20 } },
  { id: "q0_t2_3", traderId: "trader2", tier: 0, phase: 2, title: "Ostrze Bojowe", desc: "Przynieś z rajdów: 3x Topór ratowniczy.", req: [{ id: "axe_fire", qty: 3 }], reward: { credits: 260, xp: 45, rep: 35, item: "ammo12", itemQty: 15 } },
  { id: "q0_t2_4", traderId: "trader2", tier: 0, phase: 2, title: "Obróbka Zamków", desc: "Dostarcz 6x Przewody do sprężyn automatycznych.", req: [{ id: "wires", qty: 6 }], reward: { credits: 300, xp: 50, rep: 35, item: "ammo9", itemQty: 25 } },
  { id: "q0_t2_final", traderId: "trader2", tier: 0, phase: "final", title: "[FINAL TIER 0] Zbrojownia Karrasa", desc: "Przekaż 3x Pistolet oraz 60x Amunicja 9mm.", req: [{ id: "pistol", qty: 3 }, { id: "ammo9", qty: 60 }], reward: { credits: 900, xp: 130, rep: 80, item: "shotgun", itemQty: 1 } },

  // Tier 1
  { id: "q1_t2_1", traderId: "trader2", tier: 1, phase: 1, title: "Kaliber 12G", desc: "Dostarcz 40x Amunicja śrutowa na zbrojenie.", req: [{ id: "ammo12", qty: 40 }], reward: { credits: 500, xp: 100, rep: 40, item: "vest_kevlar", itemQty: 1 } },
  { id: "q1_t2_2", traderId: "trader2", tier: 1, phase: 1, title: "Konserwacja Strzelb", desc: "Przynieś z rajdów: 2x Topór ratowniczy.", req: [{ id: "axe_fire", qty: 2 }], reward: { credits: 650, xp: 130, rep: 40, item: "ammo556", itemQty: 30 } },
  { id: "q1_t2_3", traderId: "trader2", tier: 1, phase: 2, title: "Standard Karabinu", desc: "Dostarcz 50x Amunicja 5.56mm.", req: [{ id: "ammo556", qty: 50 }], reward: { credits: 700, xp: 140, rep: 45, item: "pistol", itemQty: 1 } },
  { id: "q1_t2_4", traderId: "trader2", tier: 1, phase: 2, title: "Zapasy Szturmowe", desc: "Przekaż 2x Układ scalony i 2x Złom na moduły celownicze.", req: [{ id: "circuit", qty: 2 }, { id: "scrap", qty: 2 }], reward: { credits: 750, xp: 150, rep: 45, item: "ammo556", itemQty: 30 } },
  { id: "q1_t2_final", traderId: "trader2", tier: 1, phase: "final", title: "[FINAL TIER 1] Baza Ogniowa Kolonii", desc: "Dostarcz 2x Karabin Szturmowy i 60x Amunicja 5.56mm.", req: [{ id: "rifle_assault", qty: 2 }, { id: "ammo556", qty: 60 }], reward: { credits: 2000, xp: 320, rep: 120, item: "axe_fire", itemQty: 1, bonusItem: "weapon_case" } },

  // Tier 2
  { id: "q2_t2_1", traderId: "trader2", tier: 2, phase: 1, title: "Modyfikacja Snajperska", desc: "Przekaż 1x Karabin Szturmowy i 1x Układ scalony.", req: [{ id: "rifle_assault", qty: 1 }, { id: "circuit", qty: 1 }], reward: { credits: 1200, xp: 220, rep: 50, item: "ammo556", itemQty: 50 } },
  { id: "q2_t2_2", traderId: "trader2", tier: 2, phase: 1, title: "Ogień Ciężki", desc: "Dostarcz 50x Amunicja 5.56mm oraz 20x Amunicja 12G.", req: [{ id: "ammo556", qty: 50 }, { id: "ammo12", qty: 20 }], reward: { credits: 1500, xp: 280, rep: 60, item: "armor_exo", itemQty: 1 } },
  { id: "q2_t2_3", traderId: "trader2", tier: 2, phase: 2, title: "Rusznikarstwo Eksperymentalne", desc: "Przynieś z rajdów: 2x Topór ratowniczy.", req: [{ id: "axe_fire", qty: 2 }], reward: { credits: 1800, xp: 320, rep: 60, item: "sniper_dragoon", itemQty: 1 } },
  { id: "q2_t2_4", traderId: "trader2", tier: 2, phase: 2, title: "Amunicja Przebijająca", desc: "Przekaż 1x Kwantowy rdzeń i 2x Układ scalony.", req: [{ id: "quantum_core", qty: 1 }, { id: "circuit", qty: 2 }], task: { type: "hack", label: "Włamanie do szafy", map: "uran_armory", node: "ammo_locker", intel: "Szafa amunicyjna: zamek sterowany z centrali straży." }, reward: { credits: 2100, xp: 360, rep: 60, item: "ammo556", itemQty: 100 } },
  { id: "q2_t2_final", traderId: "trader2", tier: 2, phase: "final", title: "[FINAL TIER 2] Działo Wyborowe Dragoon", desc: "Dostarcz 1x Karabin Wyborowy Dragoon i 50x Amunicja 5.56mm.", req: [{ id: "shotgun", qty: 1 }, { id: "ammo556", qty: 50 }], reward: { credits: 4500, xp: 650, rep: 200, item: "gold_ingot", itemQty: 1, bonusItem: "ammo_case" } },

  // --- TRADER 3: Inżynier Borys ---
  // Tier 0
  { id: "q0_t3_1", traderId: "trader3", tier: 0, phase: 1, title: "Miedziane Przewody", desc: "Przynieś z rajdów: 6x Skrzep patogenu Tytana.", req: [{ id: "pathogen_clot", qty: 6 }], reward: { credits: 200, xp: 35, rep: 30, item: "scrap", itemQty: 2 } },
  { id: "q0_t3_2", traderId: "trader3", tier: 0, phase: 1, title: "Złom na Przetop", desc: "Przynieś z rajdów: 9x Skrzep patogenu Tytana.", req: [{ id: "pathogen_clot", qty: 9 }], reward: { credits: 220, xp: 40, rep: 30, item: "wrench", itemQty: 1 } },
  { id: "q0_t3_3", traderId: "trader3", tier: 0, phase: 2, title: "Odzysk Płytki", desc: "Przynieś z rajdów: 3x Łom.", req: [{ id: "crowbar", qty: 3 }], reward: { credits: 280, xp: 50, rep: 35, item: "wires", itemQty: 2 } },
  { id: "q0_t3_4", traderId: "trader3", tier: 0, phase: 2, title: "Ogniwo Maszynowni", desc: "Przynieś z rajdów: 6x Skrzep patogenu Tytana.", req: [{ id: "pathogen_clot", qty: 6 }], reward: { credits: 320, xp: 55, rep: 35, item: "scrap", itemQty: 2 } },
  { id: "q0_t3_final", traderId: "trader3", tier: 0, phase: "final", title: "[FINAL TIER 0] Reaktor Borysa", desc: "Dostarcz 6x Układ scalony i 3x Komórka paliwowa.", req: [{ id: "circuit", qty: 6 }, { id: "fuel_cell", qty: 3 }], reward: { credits: 1000, xp: 150, rep: 80, item: "titan_filter", itemQty: 1, bonusItem: "cardboard_box" } },

  // Tier 1
  { id: "q1_t3_1", traderId: "trader3", tier: 1, phase: 1, title: "Wentylacja Sektora", desc: "Przynieś z rajdów: 2x Rdzeń fuzyjny Tytana.", req: [{ id: "titan_fusion_core", qty: 2 }], reward: { credits: 600, xp: 120, rep: 40, item: "fuel_cell", itemQty: 2 } },
  { id: "q1_t3_2", traderId: "trader3", tier: 1, phase: 1, title: "Chłodzenie Reaktora", desc: "Przynieś z rajdów: 4x Rdzeń fuzyjny Tytana.", req: [{ id: "titan_fusion_core", qty: 4 }], reward: { credits: 700, xp: 140, rep: 40, item: "circuit", itemQty: 2 } },
  { id: "q1_t3_3", traderId: "trader3", tier: 1, phase: 2, title: "Mikroprocesory Szyfrujące", desc: "Dostarcz 4x Chip Danych.", req: [{ id: "data_chip", qty: 4 }], reward: { credits: 800, xp: 160, rep: 45, item: "quantum_core", itemQty: 1 } },
  { id: "q1_t3_4", traderId: "trader3", tier: 1, phase: 2, title: "Magazyn Narzędzi", desc: "Przynieś z rajdów: 2x Nóż bojowy Tanto, 6x Chip danych.", req: [{ id: "combat_knife", qty: 2 }, { id: "data_chip", qty: 6 }], reward: { credits: 850, xp: 170, rep: 45, item: "circuit", itemQty: 3 } },
  { id: "q1_t3_final", traderId: "trader3", tier: 1, phase: "final", title: "[FINAL TIER 1] Zintegrowana Sieć Borysa", desc: "Dostarcz 4x Układ scalony, 4x Komórka paliwowa i 2x Filtr Tytan.", req: [{ id: "circuit", qty: 4 }, { id: "fuel_cell", qty: 4 }, { id: "titan_filter", qty: 2 }], reward: { credits: 2200, xp: 350, rep: 120, item: "quantum_core", itemQty: 1 } },

  // Tier 2
  { id: "q2_t3_1", traderId: "trader3", tier: 2, phase: 1, title: "Rdzeń Syntezy", desc: "Przynieś z rajdów: 1x Platynowy drut mikroprocesorowy.", req: [{ id: "platinum_wire", qty: 1 }], reward: { credits: 1400, xp: 250, rep: 50, item: "titan_filter", itemQty: 2 } },
  { id: "q2_t3_2", traderId: "trader3", tier: 2, phase: 1, title: "Sieć Maszynowa", desc: "Przynieś z rajdów: 3x Chip danych, 2x Tkanka mózgowa zarażonego.", req: [{ id: "data_chip", qty: 3 }, { id: "infected_tissue", qty: 2 }], reward: { credits: 1600, xp: 290, rep: 60, item: "armor_exo", itemQty: 1 } },
  { id: "q2_t3_3", traderId: "trader3", tier: 2, phase: 2, title: "Filtry Hybrydowe", desc: "Przynieś z rajdów: 2x Chip danych.", req: [{ id: "data_chip", qty: 2 }], reward: { credits: 1800, xp: 320, rep: 60, item: "quantum_core", itemQty: 1 } },
  { id: "q2_t3_4", traderId: "trader3", tier: 2, phase: 2, title: "Komponenty Antymaterii", desc: "Przynieś z rajdów: 2x Platynowy drut mikroprocesorowy.", req: [{ id: "platinum_wire", qty: 2 }], reward: { credits: 2200, xp: 380, rep: 60, item: "gold_ingot", itemQty: 1 } },
  { id: "q2_t3_final", traderId: "trader3", tier: 2, phase: "final", title: "[FINAL TIER 2] Generator Pola Antymaterii", desc: "Dostarcz 2x Kwantowy Rdzeń i 2x Filtr Tytan.", req: [{ id: "quantum_core", qty: 2 }, { id: "titan_filter", qty: 2 }], reward: { credits: 5000, xp: 700, rep: 200, item: "gold_ingot", itemQty: 1 } },

  // --- TRADER 4: Kwatermistrz Nadia ---
  // Tier 0
  { id: "q0_t4_1", traderId: "trader4", tier: 0, phase: 1, title: "Łaty na Pancerz", desc: "Dostarcz 6x Przewody i 3x Złom.", req: [{ id: "wires", qty: 6 }, { id: "scrap", qty: 3 }], reward: { credits: 210, xp: 35, rep: 30, item: "armor_damaged", itemQty: 1 } },
  { id: "q0_t4_2", traderId: "trader4", tier: 0, phase: 1, title: "Wzmocnienie Płyt", desc: "Przekaż 6x Złom.", req: [{ id: "scrap", qty: 6 }], reward: { credits: 230, xp: 40, rep: 30, item: "helmet_tactical", itemQty: 1 } },
  { id: "q0_t4_3", traderId: "trader4", tier: 0, phase: 2, title: "Sprawdzenie Hełmu", desc: "Dostarcz 3x Hełm Taktyczny.", req: [{ id: "helmet_tactical", qty: 3 }], reward: { credits: 280, xp: 45, rep: 35, item: "armor_damaged", itemQty: 1 } },
  { id: "q0_t4_4", traderId: "trader4", tier: 0, phase: 2, title: "Pancerz Lekki", desc: "Przekaż 3x Uszkodzony pancerz.", req: [{ id: "armor_damaged", qty: 3 }], reward: { credits: 320, xp: 50, rep: 35, item: "vest_kevlar", itemQty: 1 } },
  { id: "q0_t4_final", traderId: "trader4", tier: 0, phase: "final", title: "[FINAL TIER 0] Zbrojownia Nadii", desc: "Dostarcz 3x Uszkodzony pancerz i 3x Hełm Taktyczny.", req: [{ id: "armor_damaged", qty: 3 }, { id: "helmet_tactical", qty: 3 }], reward: { credits: 950, xp: 140, rep: 80, item: "armor_scout", itemQty: 1 } },

  // Tier 1
  { id: "q1_t4_1", traderId: "trader4", tier: 1, phase: 1, title: "Pancerz Zwiadu", desc: "Dostarcz 2x Pancerz Zwiadowcy.", req: [{ id: "vest_kevlar", qty: 2 }], reward: { credits: 650, xp: 130, rep: 40, item: "vest_kevlar", itemQty: 1 } },
  { id: "q1_t4_2", traderId: "trader4", tier: 1, phase: 1, title: "Kevlar dla Straży", desc: "Przekaż 2x Kamizelka Kevlar.", req: [{ id: "vest_kevlar", qty: 2 }], reward: { credits: 700, xp: 140, rep: 40, item: "armor_vest", itemQty: 1 } },
  { id: "q1_t4_3", traderId: "trader4", tier: 1, phase: 2, title: "Płyty Balistyczne", desc: "Dostarcz 6x Złom i 2x Przewody.", req: [{ id: "scrap", qty: 6 }, { id: "wires", qty: 2 }], reward: { credits: 750, xp: 150, rep: 45, item: "helmet_tactical", itemQty: 1 } },
  { id: "q1_t4_4", traderId: "trader4", tier: 1, phase: 2, title: "Zbroja Bojowa", desc: "Przekaż 2x Kamizelka kevlarowa S-2 do wzmocnienia zbroi.", req: [{ id: "vest_kevlar", qty: 2 }], reward: { credits: 900, xp: 180, rep: 45, item: "armor_exo", itemQty: 1 } },
  { id: "q1_t4_final", traderId: "trader4", tier: 1, phase: "final", title: "[FINAL TIER 1] Przednia Linia Nadii", desc: "Dostarcz 2x Uszczelniona Kamizelka i 2x Kamizelka Kevlar.", req: [{ id: "armor_vest", qty: 2 }, { id: "vest_kevlar", qty: 2 }], reward: { credits: 2300, xp: 360, rep: 120, item: "armor_exo", itemQty: 1 } },

  // Tier 2
  { id: "q2_t4_1", traderId: "trader4", tier: 2, phase: 1, title: "Tarcza Egzoszkieletu", desc: "Przekaż 1x Pancerz Egzoszkielet.", req: [{ id: "vest_kevlar", qty: 1 }], reward: { credits: 1500, xp: 260, rep: 50, item: "fuel_cell", itemQty: 2 } },
  { id: "q2_t4_2", traderId: "trader4", tier: 2, phase: 1, title: "Pancerz Tytanowy", desc: "Dostarcz 2x Ruda Tytana i 2x Złom.", req: [{ id: "ore_titanium", qty: 2 }, { id: "scrap", qty: 2 }], reward: { credits: 1800, xp: 300, rep: 60, item: "quantum_core", itemQty: 1 } },
  { id: "q2_t4_3", traderId: "trader4", tier: 2, phase: 2, title: "Kombinezon Ciężki", desc: "Dostarcz 1x Pancerz Egzoszkielet i 1x Uszczelniona Kamizelka.", req: [{ id: "vest_kevlar", qty: 1 }, { id: "armor_vest", qty: 1 }], reward: { credits: 2200, xp: 380, rep: 60, item: "gold_ingot", itemQty: 1 } },
  { id: "q2_t4_4", traderId: "trader4", tier: 2, phase: 2, title: "Osłona Reaktorowa", desc: "Przekaż 2x Filtr Tytan i 2x Komórka paliwowa.", req: [{ id: "titan_filter", qty: 2 }, { id: "fuel_cell", qty: 2 }], reward: { credits: 2500, xp: 420, rep: 60, item: "quantum_core", itemQty: 1 } },
  { id: "q2_t4_final", traderId: "trader4", tier: 2, phase: "final", title: "[FINAL TIER 2] Forteca Kolonialna", desc: "Dostarcz 1x Pancerz Egzoszkielet i 1x Hel-3.", req: [{ id: "vest_kevlar", qty: 1 }, { id: "helium3", qty: 1 }], reward: { credits: 4800, xp: 680, rep: 200, item: "gold_ingot", itemQty: 1 } },

  // --- TRADER 5: Haker Val ---
  // Tier 0
  { id: "q0_t5_1", traderId: "trader5", tier: 0, phase: 1, title: "Logi Terminalu", desc: "Przynieś z rajdów: 3x Skrzep patogenu Tytana.", req: [{ id: "pathogen_clot", qty: 3 }], reward: { credits: 250, xp: 40, rep: 30, item: "circuit", itemQty: 1 } },
  { id: "q0_t5_2", traderId: "trader5", tier: 0, phase: 1, title: "Kable Danych", desc: "Przekaż 6x Przewody.", req: [{ id: "wires", qty: 6 }], reward: { credits: 230, xp: 35, rep: 30, item: "data_chip", itemQty: 1 } },
  { id: "q0_t5_3", traderId: "trader5", tier: 0, phase: 2, title: "Płytka Łącza", desc: "Przynieś z rajdów: 3x Skrzep patogenu Tytana.", req: [{ id: "pathogen_clot", qty: 3 }], reward: { credits: 300, xp: 50, rep: 35, item: "wires", itemQty: 2 } },
  { id: "q0_t5_4", traderId: "trader5", tier: 0, phase: 2, title: "Czarne Skrzynki", desc: "Przynieś z rajdów: 6x Skrzep patogenu Tytana.", req: [{ id: "pathogen_clot", qty: 6 }], reward: { credits: 350, xp: 60, rep: 35, item: "fuel_cell", itemQty: 1 } },
  { id: "q0_t5_final", traderId: "trader5", tier: 0, phase: "final", title: "[FINAL TIER 0] Serwerownia Val", desc: "Dostarcz 6x Chip Danych i 3x Układ scalony.", req: [{ id: "data_chip", qty: 6 }, { id: "circuit", qty: 3 }], reward: { credits: 1100, xp: 160, rep: 80, item: "quantum_core", itemQty: 1 } },

  // Tier 1
  { id: "q1_t5_1", traderId: "trader5", tier: 1, phase: 1, title: "Szyfr Kwantowy", desc: "Przynieś z rajdów: 2x Szafir Tesli.", req: [{ id: "sapphire_tesla", qty: 2 }], reward: { credits: 800, xp: 160, rep: 40, item: "data_chip", itemQty: 2 } },
  { id: "q1_t5_2", traderId: "trader5", tier: 1, phase: 1, title: "Dekodowanie Relektro", desc: "Przynieś z rajdów: 4x Rdzeń fuzyjny Tytana.", req: [{ id: "titan_fusion_core", qty: 4 }], reward: { credits: 750, xp: 150, rep: 40, item: "stim_adrenal", itemQty: 1 } },
  { id: "q1_t5_3", traderId: "trader5", tier: 1, phase: 2, title: "Zasilanie Węzła", desc: "Przynieś z rajdów: 4x Rdzeń fuzyjny Tytana.", req: [{ id: "titan_fusion_core", qty: 4 }], reward: { credits: 850, xp: 170, rep: 45, item: "quantum_core", itemQty: 1 } },
  { id: "q1_t5_4", traderId: "trader5", tier: 1, phase: 2, title: "Przechwycony Sygnał", desc: "Przekaż 4x Układ scalony i 2x Przewody.", req: [{ id: "circuit", qty: 4 }, { id: "wires", qty: 2 }], reward: { credits: 900, xp: 180, rep: 45, item: "stim_bleedstop", itemQty: 2 } },
  { id: "q1_t5_final", traderId: "trader5", tier: 1, phase: "final", title: "[FINAL TIER 1] Czarne Łącze Val", desc: "Dostarcz 2x Kwantowy rdzeń i 4x Układ scalony.", req: [{ id: "quantum_core", qty: 2 }, { id: "circuit", qty: 4 }], reward: { credits: 2500, xp: 380, rep: 120, item: "relic_old_earth", itemQty: 1 } },

  // Tier 2
  { id: "q2_t5_1", traderId: "trader5", tier: 2, phase: 1, title: "Krypto-Rdzenie", desc: "Przynieś z rajdów: 2x Platynowy drut mikroprocesorowy.", req: [{ id: "platinum_wire", qty: 2 }], reward: { credits: 1600, xp: 280, rep: 50, item: "fuel_cell", itemQty: 2 } },
  { id: "q2_t5_2", traderId: "trader5", tier: 2, phase: 1, title: "Infiltracja Danych", desc: "Przynieś z rajdów: 3x Złom, 2x Szmaty.", req: [{ id: "scrap", qty: 3 }, { id: "cloth", qty: 2 }], reward: { credits: 1900, xp: 320, rep: 60, item: "gold_ingot", itemQty: 1 } },
  { id: "q2_t5_3", traderId: "trader5", tier: 2, phase: 2, title: "Krypto-Skanery", desc: "Przynieś z rajdów: 3x Złom, 2x Szmaty.", req: [{ id: "scrap", qty: 3 }, { id: "cloth", qty: 2 }], reward: { credits: 2200, xp: 380, rep: 60, item: "quantum_core", itemQty: 1 } },
  { id: "q2_t5_4", traderId: "trader5", tier: 2, phase: 2, title: "Czarna Skrzynka Relektro", desc: "Przynieś z rajdów: 2x Platynowy drut mikroprocesorowy.", req: [{ id: "platinum_wire", qty: 2 }], task: { type: "memory", label: "Sekwencja sygnałów", map: "neptun_relay", node: "server_hall", intel: "Przekaźnik: sygnał kieruje się do sektora Z-9." }, reward: { credits: 2600, xp: 440, rep: 60, item: "titan_diamond", itemQty: 1 } },
  { id: "q2_t5_final", traderId: "trader5", tier: 2, phase: "final", title: "[FINAL TIER 2] Głęboki Wywiad Sektora", desc: "Dostarcz 2x Kwantowy rdzeń i 1x Starożytny Relikt.", req: [{ id: "quantum_core", qty: 2 }, { id: "relic_old_earth", qty: 1 }], reward: { credits: 5000, xp: 700, rep: 200, item: "xenonite_crystal", itemQty: 1 } },

  // --- TRADER 6: Kapitan Sławiński ---
  // Tier 0
  { id: "q0_t6_1", traderId: "trader6", tier: 0, phase: 1, title: "Patrol Marsa", desc: "Dostarcz 3x Nóż bojowy Tanto i 30x Amunicja 9mm.", req: [{ id: "combat_knife", qty: 3 }, { id: "ammo9", qty: 30 }], reward: { credits: 220, xp: 40, rep: 30, item: "ammo9", itemQty: 15 } },
  { id: "q0_t6_2", traderId: "trader6", tier: 0, phase: 1, title: "Pacyfikacja Sektora", desc: "Przynieś z rajdów: 3x Łom.", req: [{ id: "crowbar", qty: 3 }], reward: { credits: 250, xp: 45, rep: 30, item: "armor_damaged", itemQty: 1 } },
  { id: "q0_t6_3", traderId: "trader6", tier: 0, phase: 2, title: "Ostrzał Obronny", desc: "Dostarcz 45x Amunicja Śrutowa.", req: [{ id: "ammo12", qty: 45 }], reward: { credits: 300, xp: 50, rep: 35, item: "vest_kevlar", itemQty: 1 } },
  { id: "q0_t6_4", traderId: "trader6", tier: 0, phase: 2, title: "Zabezpieczenie Trasy", desc: "Przekaż 6x Złom.", req: [{ id: "scrap", qty: 6 }], reward: { credits: 280, xp: 45, rep: 35, item: "ammo9", itemQty: 20 } },
  { id: "q0_t6_final", traderId: "trader6", tier: 0, phase: "final", title: "[FINAL TIER 0] Posterunek Straży", desc: "Dostarcz 3x Nóż Bojowy i 60x Amunicja 9mm.", req: [{ id: "combat_knife", qty: 3 }, { id: "ammo9", qty: 60 }], reward: { credits: 1000, xp: 150, rep: 80, item: "axe_fire", itemQty: 1 } },

  // Tier 1
  { id: "q1_t6_1", traderId: "trader6", tier: 1, phase: 1, title: "Zapas na Polowanie", desc: "Przekaż 2x Opatrunek hemostatyczny do zabezpieczenia wypraw.", req: [{ id: "hemostatic", qty: 2 }], reward: { credits: 750, xp: 150, rep: 40, item: "axe_fire", itemQty: 1 } },
  { id: "q1_t6_2", traderId: "trader6", tier: 1, phase: 1, title: "Zapasy Szturmowe Straży", desc: "Dostarcz 50x Amunicja 5.56mm.", req: [{ id: "ammo556", qty: 50 }], reward: { credits: 800, xp: 160, rep: 40, item: "vest_kevlar", itemQty: 1 } },
  { id: "q1_t6_3", traderId: "trader6", tier: 1, phase: 2, title: "Broń Ciężka Straży", desc: "Przynieś z rajdów: 2x Pistolet P-9.", req: [{ id: "pistol", qty: 2 }], reward: { credits: 900, xp: 180, rep: 45, item: "ammo556", itemQty: 50 } },
  { id: "q1_t6_4", traderId: "trader6", tier: 1, phase: 2, title: "Pancerze Oddziału", desc: "Przynieś z rajdów: 2x Kamizelka kompozytowa.", req: [{ id: "armor_vest", qty: 2 }], reward: { credits: 850, xp: 170, rep: 45, item: "stim_bleedstop", itemQty: 2 } },
  { id: "q1_t6_final", traderId: "trader6", tier: 1, phase: "final", title: "[FINAL TIER 1] Garnizon Straży Sławińskiego", desc: "Dostarcz 2x Karabin Szturmowy i 2x Skrzep patogenu.", req: [{ id: "rifle_assault", qty: 2 }, { id: "pathogen_clot", qty: 2 }], reward: { credits: 2400, xp: 370, rep: 120, item: "armor_exo", itemQty: 1 } },

  // Tier 2
  { id: "q2_t6_1", traderId: "trader6", tier: 2, phase: 1, title: "Eliminacja Zakażonych", desc: "Dostarcz 20x Amunicja śrutowa 12G do eliminacji zakażonych.", req: [{ id: "ammo12", qty: 20 }], reward: { credits: 1500, xp: 270, rep: 50, item: "stim_bleedstop", itemQty: 2 } },
  { id: "q2_t6_2", traderId: "trader6", tier: 2, phase: 1, title: "Szturm na Kopalnię", desc: "Dostarcz 50x Amunicja 5.56mm i 1x Topór Strażacki.", req: [{ id: "ammo556", qty: 50 }, { id: "axe_fire", qty: 1 }], reward: { credits: 1800, xp: 310, rep: 60, item: "sniper_dragoon", itemQty: 1 } },
  { id: "q2_t6_3", traderId: "trader6", tier: 2, phase: 2, title: "Oczyszczanie Sektora C", desc: "Dostarcz 3x Pakiet dekontaminacyjny do oczyszczania sektora.", req: [{ id: "decontam_kit", qty: 3 }], reward: { credits: 2200, xp: 380, rep: 60, item: "armor_exo", itemQty: 1 } },
  { id: "q2_t6_4", traderId: "trader6", tier: 2, phase: 2, title: "Ciężkie Uzbrojenie Straży", desc: "Przekaż 1x Karabin Wyborowy Dragoon.", req: [{ id: "shotgun", qty: 1 }], reward: { credits: 2600, xp: 440, rep: 60, item: "gold_ingot", itemQty: 1 } },
  { id: "q2_t6_final", traderId: "trader6", tier: 2, phase: "final", title: "[FINAL TIER 2] Operacja Czyste Niebo", desc: "Dostarcz 1x Karabin Wyborowy Dragoon i 2x Skrzep patogenu.", req: [{ id: "shotgun", qty: 1 }, { id: "pathogen_clot", qty: 2 }], reward: { credits: 5000, xp: 720, rep: 200, item: "gold_ingot", itemQty: 1 } },

  // --- TRADER 7: Profesor Thorne ---
  // Tier 0
  { id: "q0_t7_1", traderId: "trader7", tier: 0, phase: 1, title: "Rękawice Górnicze", desc: "Przynieś z rajdów: 3x Maska filtrująca.", req: [{ id: "gas_mask", qty: 3 }], reward: { credits: 300, xp: 50, rep: 30, item: "scrap", itemQty: 2 } },
  { id: "q0_t7_2", traderId: "trader7", tier: 0, phase: 1, title: "Próbka Surowca", desc: "Dostarcz 9x Złom do analizy próbek.", req: [{ id: "scrap", qty: 9 }], reward: { credits: 350, xp: 55, rep: 30, item: "mining_glove", itemQty: 1 } },
  { id: "q0_t7_3", traderId: "trader7", tier: 0, phase: 2, title: "Stabilizacja Paliwa", desc: "Przekaż 6x Przewody do przygotowania paliwa.", req: [{ id: "wires", qty: 6 }], reward: { credits: 400, xp: 65, rep: 35, item: "fuel_cell", itemQty: 2 } },
  { id: "q0_t7_4", traderId: "trader7", tier: 0, phase: 2, title: "Narzędzia Odwiertu", desc: "Dostarcz 3x Klucz Francuski i 6x Złom.", req: [{ id: "wrench", qty: 3 }, { id: "scrap", qty: 6 }], reward: { credits: 320, xp: 50, rep: 35, item: "mining_glove", itemQty: 1 } },
  { id: "q0_t7_final", traderId: "trader7", tier: 0, phase: "final", title: "[FINAL TIER 0] Stacja Geologiczna Thorne'a", desc: "Dostarcz 6x Ruda Tytana i 3x Hel-3.", req: [{ id: "ore_titanium", qty: 6 }, { id: "helium3", qty: 3 }], reward: { credits: 1200, xp: 180, rep: 80, item: "xenonite_crystal", itemQty: 1 } },

  // Tier 1
  { id: "q1_t7_1", traderId: "trader7", tier: 1, phase: 1, title: "Czysta Ruda Tytana", desc: "Przynieś z rajdów: 4x Rdzeń fuzyjny Tytana.", req: [{ id: "titan_fusion_core", qty: 4 }], reward: { credits: 800, xp: 160, rep: 40, item: "helium3", itemQty: 1 } },
  { id: "q1_t7_2", traderId: "trader7", tier: 1, phase: 1, title: "Reaktor Helowy", desc: "Przynieś z rajdów: 4x Rdzeń fuzyjny Tytana.", req: [{ id: "titan_fusion_core", qty: 4 }], reward: { credits: 900, xp: 180, rep: 40, item: "fuel_cell", itemQty: 2 } },
  { id: "q1_t7_3", traderId: "trader7", tier: 1, phase: 2, title: "Kryształ Xenonite", desc: "Przynieś z rajdów: 2x Rdzeń fuzyjny Tytana.", req: [{ id: "titan_fusion_core", qty: 2 }], reward: { credits: 1100, xp: 210, rep: 45, item: "quantum_core", itemQty: 1 } },
  { id: "q1_t7_4", traderId: "trader7", tier: 1, phase: 2, title: "Głębinowe Próbki", desc: "Przynieś z rajdów: 4x Rdzeń fuzyjny Tytana, 2x Chip danych.", req: [{ id: "titan_fusion_core", qty: 4 }, { id: "data_chip", qty: 2 }], reward: { credits: 1000, xp: 200, rep: 45, item: "xenonite_crystal", itemQty: 1 } },
  { id: "q1_t7_final", traderId: "trader7", tier: 1, phase: "final", title: "[FINAL TIER 1] Rafineria Prometeusz", desc: "Dostarcz 4x Kryształ Xenonite i 4x Hel-3.", req: [{ id: "xenonite_crystal", qty: 4 }, { id: "helium3", qty: 4 }], reward: { credits: 2600, xp: 400, rep: 120, item: "titan_diamond", itemQty: 1 } },

  // Tier 2
  { id: "q2_t7_1", traderId: "trader7", tier: 2, phase: 1, title: "Diamenty Głębinowe", desc: "Dostarcz 1x Diament Tytana.", req: [{ id: "titan_diamond", qty: 1 }], reward: { credits: 2000, xp: 320, rep: 50, item: "xenonite_crystal", itemQty: 2 } },
  { id: "q2_t7_2", traderId: "trader7", tier: 2, phase: 1, title: "Izotopy Antymaterii", desc: "Przynieś z rajdów: 2x Układ scalony, 2x Złom.", req: [{ id: "circuit", qty: 2 }, { id: "scrap", qty: 2 }], reward: { credits: 2200, xp: 350, rep: 60, item: "gold_ingot", itemQty: 1 } },
  { id: "q2_t7_3", traderId: "trader7", tier: 2, phase: 2, title: "Super-Ruda Tytana", desc: "Przynieś z rajdów: 4x Układ scalony, 2x Złom.", req: [{ id: "circuit", qty: 4 }, { id: "scrap", qty: 2 }], reward: { credits: 2600, xp: 420, rep: 60, item: "titan_diamond", itemQty: 1 } },
  { id: "q2_t7_4", traderId: "trader7", tier: 2, phase: 2, title: "Plazma Głębinowa", desc: "Przekaż 2x Diament Tytana.", req: [{ id: "titan_diamond", qty: 2 }], task: { type: "wires", label: "Podłączenie przewodów", map: "jowisz_depths", node: "plasma_pit", intel: "Dół plazmowy: przewody sondy połączone z komorą Xenonitu." }, reward: { credits: 3000, xp: 480, rep: 60, item: "gold_ingot", itemQty: 1 } },
  { id: "q2_t7_final", traderId: "trader7", tier: 2, phase: "final", title: "[FINAL TIER 2] Skarb Tytana Thorne'a", desc: "Dostarcz 2x Diament Tytana i 2x Kryształ Xenonite.", req: [{ id: "titan_diamond", qty: 2 }, { id: "xenonite_crystal", qty: 2 }], reward: { credits: 5500, xp: 750, rep: 200, item: "gold_ingot", itemQty: 2 } },

  // --- TRADER 8: Szturmowiec Jax ---
  // Tier 0
  { id: "q0_t8_1", traderId: "trader8", tier: 0, phase: 1, title: "Tajne Pliki", desc: "Przynieś z rajdów: 3x Skrzep patogenu Tytana.", req: [{ id: "pathogen_clot", qty: 3 }], reward: { credits: 300, xp: 50, rep: 30, item: "scrap", itemQty: 2 } },
  { id: "q0_t8_2", traderId: "trader8", tier: 0, phase: 1, title: "Narzędzia Włamania", desc: "Przekaż 3x Łom i 6x Przewody.", req: [{ id: "crowbar", qty: 3 }, { id: "wires", qty: 6 }], reward: { credits: 280, xp: 45, rep: 30, item: "data_chip", itemQty: 1 } },
  { id: "q0_t8_3", traderId: "trader8", tier: 0, phase: 2, title: "Ogniwo Zasilania", desc: "Przynieś z rajdów: 3x Skrzep patogenu Tytana.", req: [{ id: "pathogen_clot", qty: 3 }], reward: { credits: 350, xp: 60, rep: 35, item: "circuit", itemQty: 1 } },
  { id: "q0_t8_4", traderId: "trader8", tier: 0, phase: 2, title: "Drogocenny Złom", desc: "Przekaż 9x Złom.", req: [{ id: "scrap", qty: 9 }], reward: { credits: 300, xp: 50, rep: 35, item: "data_chip", itemQty: 1 } },
  { id: "q0_t8_final", traderId: "trader8", tier: 0, phase: "final", title: "[FINAL TIER 0] Czarny Rynek Jaxa", desc: "Dostarcz 6x Chip Danych i 3x Komórka paliwowa.", req: [{ id: "data_chip", qty: 6 }, { id: "fuel_cell", qty: 3 }], reward: { credits: 1250, xp: 190, rep: 80, item: "relic_old_earth", itemQty: 1 } },

  // Tier 1
  { id: "q1_t8_1", traderId: "trader8", tier: 1, phase: 1, title: "Relikt Starej Ziemi", desc: "Przynieś z rajdów: 2x Platynowy drut mikroprocesorowy.", req: [{ id: "platinum_wire", qty: 2 }], reward: { credits: 1000, xp: 200, rep: 40, item: "quantum_core", itemQty: 1 } },
  { id: "q1_t8_2", traderId: "trader8", tier: 1, phase: 1, title: "Kwantowe Szyfry", desc: "Przynieś z rajdów: 2x Platynowy drut mikroprocesorowy.", req: [{ id: "platinum_wire", qty: 2 }], reward: { credits: 1100, xp: 210, rep: 40, item: "gold_ingot", itemQty: 1 } },
  { id: "q1_t8_3", traderId: "trader8", tier: 1, phase: 2, title: "Kolonialny Relikt", desc: "Przynieś z rajdów: 2x Platynowy drut mikroprocesorowy.", req: [{ id: "platinum_wire", qty: 2 }], reward: { credits: 1500, xp: 250, rep: 45, item: "titan_diamond", itemQty: 1 } },
  { id: "q1_t8_4", traderId: "trader8", tier: 1, phase: 2, title: "Cenne Komponenty", desc: "Przekaż 4x Układ scalony i 2x Komórka paliwowa.", req: [{ id: "circuit", qty: 4 }, { id: "fuel_cell", qty: 2 }], reward: { credits: 1200, xp: 220, rep: 45, item: "relic_old_earth", itemQty: 1 } },
  { id: "q1_t8_final", traderId: "trader8", tier: 1, phase: "final", title: "[FINAL TIER 1] Przemyt Sektora Jaxa", desc: "Dostarcz 2x Starożytny Relikt Ziemi i 2x Sztabka Złota.", req: [{ id: "relic_old_earth", qty: 2 }, { id: "gold_ingot", qty: 2 }], reward: { credits: 3000, xp: 450, rep: 120, item: "sniper_dragoon", itemQty: 1 } },

  // Tier 2
  { id: "q2_t8_1", traderId: "trader8", tier: 2, phase: 1, title: "Legenda Dragoona", desc: "Przynieś z rajdów: 1x Strzelba bojowa Striker.", req: [{ id: "shotgun", qty: 1 }], reward: { credits: 2500, xp: 380, rep: 50, item: "gold_ingot", itemQty: 2 } },
  { id: "q2_t8_2", traderId: "trader8", tier: 2, phase: 1, title: "Diamentowy Skarbiec", desc: "Przynieś z rajdów: 1x Kula Artefaktu Wega.", req: [{ id: "artifact_orb", qty: 1 }], reward: { credits: 2800, xp: 420, rep: 60, item: "quantum_core", itemQty: 1 } },
  { id: "q2_t8_3", traderId: "trader8", tier: 2, phase: 2, title: "Złoty Zapas Czarnorynkowy", desc: "Przynieś z rajdów: 2x Kula Artefaktu Wega.", req: [{ id: "artifact_orb", qty: 2 }], reward: { credits: 3500, xp: 500, rep: 60, item: "titan_diamond", itemQty: 1 } },
  { id: "q2_t8_4", traderId: "trader8", tier: 2, phase: 2, title: "Ostateczny Relikt", desc: "Przynieś z rajdów: 2x Kula Artefaktu Wega.", req: [{ id: "artifact_orb", qty: 2 }], reward: { credits: 4000, xp: 550, rep: 60, item: "gold_ingot", itemQty: 2 } },
  { id: "q2_t8_final", traderId: "trader8", tier: 2, phase: "final", title: "[FINAL TIER 2] Władca Czarnego Rynku", desc: "Dostarcz 2x Sztabka Złota, 1x Diament Tytana i 1x Starożytny Relikt.", req: [{ id: "gold_ingot", qty: 2 }, { id: "titan_diamond", qty: 1 }, { id: "relic_old_earth", qty: 1 }], reward: { credits: 8000, xp: 1000, rep: 200, item: "gold_ingot", itemQty: 2 } },
];

// Połączenie zadań głównych i zadań tierowych
const QUESTS = [...MAIN_QUESTS, ...TIER_QUESTS];

if (typeof window !== "undefined") {
  window.TRADERS = TRADERS;
  window.QUESTS = QUESTS;
}
if (typeof globalThis !== "undefined") {
  globalThis.TRADERS = TRADERS;
  globalThis.QUESTS = QUESTS;
}
