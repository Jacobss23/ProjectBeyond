// === SEKCJA: PRZEDMIOTY ===
// size: [szerokość, wysokość] w polach siatki, stack: maks. ilość w jednym polu
const ITEMS = {
  // Podstawowe zaopatrzenie i medycyna
  ration: { name: "Racja żywnościowa", type: "consumable", size: [1, 1], value: 30, hunger: 30, buff: "sytosc", buffDuration: 8, tone: "food", use: "Uzupełnia głód (+30%). Pasywna regeneracja: +15 HP co turę przez 8 tur. Nie leczy od razu." },
  water: { name: "Czysta woda", type: "consumable", size: [1, 1], value: 30, thirst: 30, tone: "food", use: "Uzupełnia pragnienie (+30%)." },
  konserwa: { name: "Konserwa mięsna", type: "consumable", size: [1, 1], value: 40, hunger: 35, tone: "food", use: "Uzupełnia głód (+35%)." },
  suszone_owoce: { name: "Suszone owoce", type: "consumable", size: [1, 1], value: 25, hunger: 20, tone: "food", use: "Uzupełnia głód (+20%)." },
  batonik: { name: "Batonik energetyczny", type: "consumable", size: [1, 1], value: 28, hunger: 25, tone: "food", use: "Uzupełnia głód (+25%)." },
  sok_owocowy: { name: "Sok owocowy", type: "consumable", size: [1, 1], value: 22, thirst: 25, tone: "food", use: "Uzupełnia pragnienie (+25%)." },
  woda_mineralna: { name: "Woda mineralna", type: "consumable", size: [1, 1], value: 26, thirst: 35, tone: "food", use: "Uzupełnia pragnienie (+35%)." },
  cloth: { name: "Szmaty", type: "junk", size: [1, 1], stack: 5, value: 8 },
  bandage: { name: "Bandaż", type: "consumable", size: [1, 1], value: 45, heal: 8, cures: ["krwawienie"], tone: "blood", use: "Zatrzymuje zwykłe krwawienie. Lekko leczy." },
  tourniquet: { name: "Bandaż uciskowy", type: "consumable", size: [1, 1], value: 65, cures: ["krwawienie", "mocne_krwawienie"], tone: "clamp", use: "Zaciska opaskę: zatrzymuje krwawienie, także mocne. Nie leczy siniaków." },
  hemostatic: { name: "Opatrunek hemostatyczny", type: "consumable", size: [1, 1], value: 50, heal: 25, tone: "plasma", use: "Szybko uzupełnia krew: +25 HP. Nie zatrzymuje krwawienia." },
  ointment: { name: "Maść regeneracyjna", type: "consumable", size: [1, 1], value: 55, cures: ["siniak", "podraznienie"], tone: "skin", use: "Goi stłuczenia i podrażnienia skóry." },
  hash_codes: { name: "Kody Hash (implementacyjne)", type: "tool", size: [2, 2], value: 900 },
  splint: { name: "Szyna usztywniająca", type: "consumable", size: [1, 2], value: 80, cures: ["zlamanie"], tone: "bone", use: "Usztywnia złamaną kończynę. Nie leczy ran." },
  medkit: { name: "Apteczka", type: "consumable", size: [2, 1], value: 120, heal: 45, cures: ["krwawienie", "zlamanie"], tone: "heal", use: "Uniwersalna pomoc: leczy, zatrzymuje krwawienie i usztywnia złamania." },
  morphine: { name: "Strzykawka morfiny", type: "consumable", size: [1, 1], value: 85, cures: ["strach"], buff: "znieczulenie", buffDuration: 6, tone: "pain", use: "Znosi strach i tłumi ból: -30% obrażeń przez 6 tur." },
  stim_adrenal: { name: "Stymulator bojowy Adrenal-X", type: "consumable", size: [1, 1], value: 160, cures: ["strach"], buff: "adrenalina", buffDuration: 8, rarity: "rare", tone: "combat", use: "Bojowy zastrzyk: +25% obrażeń przez 8 tur i zdjęcie strachu." },
  stim_bleedstop: { name: "Stymulant BleedStop", type: "consumable", size: [1, 1], value: 450, buff: "bleedStop", buffDuration: 15, rarity: "rare", tone: "bleedstop", use: "Zatrzymuje wszelkie krwawienie przez 15 tur." },
  saturn_cola: { name: "SaturnCola", type: "consumable", size: [1, 2], value: 110, buff: "saturnCola", buffDuration: 12, tone: "cola", use: "Napój bojowy: +10% celności i +15% szansy na cios krytyczny przez 12 tur." },
  decontam_kit: { name: "Pakiet dekontaminacyjny", type: "consumable", size: [1, 2], value: 130, cures: ["podraznienie", "szept"], tone: "virus", use: "Usuwa wirusa Szept z ciała oraz podrażnienia." },
  // Amunicja
  ammo9: { caliber: "9 mm", name: "Amunicja 9mm", type: "ammo", size: [1, 1], stack: 30, value: 6 },
  ammo12: { caliber: "12G", name: "Amunicja śrutowa 12G", type: "ammo", size: [1, 1], stack: 20, value: 10 },
  ammo556: { caliber: "5,56 mm", name: "Amunicja 5.56mm NATO", type: "ammo", size: [1, 1], stack: 30, value: 12 },
  ammo762: { caliber: "7,62 mm", name: "Amunicja 7.62mm Precyzyjna", type: "ammo", size: [1, 1], stack: 20, value: 18 },
  ammo_magnum: { caliber: ".44 Magnum", name: "Amunicja .44 Magnum", type: "ammo", size: [1, 1], stack: 18, value: 15 },
  ammo_plasma: { caliber: "plazma", name: "Ogniwa plazmowe", type: "ammo", size: [1, 1], stack: 15, value: 25, rarity: "rare" },
  ammo_rail: { caliber: "40 mm szynowe", name: "Pociski szynowe 40mm", type: "ammo", size: [1, 1], stack: 10, value: 60, rarity: "rare" },

  // Broń biała
  wrench: { name: "Klucz hydrauliczny", type: "weapon", caliber: "—", size: [1, 3], value: 40, dmg: [4, 8], acc: 0.9, category: "melee_long" },
  crowbar: { name: "Łom", type: "weapon", caliber: "—", size: [1, 3], value: 70, dmg: [5, 10], acc: 0.85, category: "melee_long" },
  combat_knife: { name: "Nóż bojowy Tanto", type: "weapon", caliber: "—", size: [1, 2], value: 90, dmg: [6, 12], acc: 0.92, category: "melee_short" },
  machete: { name: "Maczeta saperska", type: "weapon", caliber: "—", size: [1, 3], value: 140, dmg: [8, 15], acc: 0.85, category: "melee_long" },
  axe_fire: { name: "Topór ratowniczy", type: "weapon", caliber: "—", size: [2, 3], value: 210, dmg: [12, 20], acc: 0.8, category: "melee_long" },
  stun_baton: { name: "Pałka paraliżująca", type: "weapon", caliber: "—", size: [1, 2], value: 180, dmg: [7, 14], acc: 0.88, category: "melee_short" },

  // Broń palna i zaawansowana
  pistol: { name: "Pistolet P-9", type: "weapon", caliber: "9 mm", size: [2, 1], value: 250, dmg: [8, 14], acc: 0.8, ammo: "ammo9", category: "pistol" },
  revolver_magnum: { name: "Rewolwer Kolonialny .44", type: "weapon", caliber: ".44 Magnum", size: [2, 1], value: 380, dmg: [16, 26], acc: 0.78, ammo: "ammo_magnum", category: "pistol" },
  smg: { name: "Pistolet maszynowy Vex", type: "weapon", caliber: "9 mm", size: [3, 2], value: 600, dmg: [11, 17], acc: 0.72, ammo: "ammo9", rarity: "rare", category: "smg" },
  shotgun: { name: "Strzelba bojowa Striker", type: "weapon", caliber: "12G", size: [3, 1], value: 520, dmg: [18, 28], acc: 0.74, ammo: "ammo12", category: "shotgun" },
  rifle_assault: { name: "Karabin szturmowy ACR-K", type: "weapon", caliber: "5,56 mm", size: [3, 2], value: 780, dmg: [15, 23], acc: 0.82, ammo: "ammo556", rarity: "rare", category: "rifle" },
  sniper_dragoon: { name: "Karabin snajperski Dragoon", type: "weapon", caliber: "7,62 mm", size: [4, 1], value: 980, dmg: [28, 45], acc: 0.92, ammo: "ammo762", rarity: "rare", category: "sniper" },
  plasma_carbine: { name: "Karabinek plazmowy Nova-7", type: "weapon", caliber: "plazma", size: [3, 2], value: 1250, dmg: [22, 34], acc: 0.86, ammo: "ammo_plasma", rarity: "rare", category: "plasma" },

  // Pancerze i hełmy
  armor_damaged: { name: "Uszkodzony pancerz taktyczny", type: "armor", size: [3, 3], value: 150, def: 3 },
  armor_scout: { name: "Kombinezon zwiadowcy", type: "armor", size: [2, 3], value: 320, def: 4 },
  helmet_tactical: { name: "Hełm balistyczny", type: "armor", size: [2, 2], value: 240, def: 3 },
  armor_vest: { name: "Kamizelka kompozytowa", type: "armor", size: [3, 3], value: 450, def: 6, rarity: "rare" },
  vest_kevlar: { name: "Kamizelka kevlarowa S-2", type: "armor", size: [2, 3], value: 550, def: 7, rarity: "rare" },
  armor_exo: { name: "Pancerz szturmowy Exo-Titan", type: "armor", size: [3, 3], value: 920, def: 9, rarity: "rare" },

  // Przedmioty wydobywcze i narzędzia specjalne
  mining_glove: { name: "Głębinowy Chwytak Plazmowy", type: "tool", size: [2, 1], value: 650, uses: 5, rarity: "rare" },
  ore_titanium: { name: "Czysta Ruda Tytana", type: "junk", size: [1, 1], stack: 5, value: 280, rarity: "rare" },
  helium3: { name: "Izotop Hel-3 (Kriogeniczny)", type: "junk", size: [1, 1], stack: 3, value: 450, rarity: "rare" },
  xenonite_crystal: { name: "Kryształ Xenonitu", type: "junk", size: [1, 1], stack: 2, value: 850, rarity: "rare" },

  gas_mask: { name: "Maska filtrująca", type: "tool", size: [2, 1], value: 260, rarity: "rare" },

  // Ultra-rzadkie kosztowności (Valuable / Quests)
  relic_old_earth: { name: "Starożytny Relikt Ziemi", type: "valuable", size: [2, 1], value: 1800, rarity: "rare" },
  quantum_core: { name: "Kwantowy Rdzeń Szyfrujący", type: "valuable", size: [1, 2], value: 2200, rarity: "rare" },
  gold_ingot: { name: "Sztabka Złota Kolonialnego", type: "valuable", size: [1, 1], stack: 3, value: 1500, rarity: "rare" },
  titan_diamond: { name: "Diament Krystaliczny Tytana", type: "valuable", size: [1, 1], value: 3000, rarity: "rare" },
  sapphire_tesla: { name: "Szafir Tesli", type: "valuable", size: [1, 1], value: 1300, rarity: "rare" },
  lunar_pearl: { name: "Perła Księżycowa", type: "valuable", size: [1, 1], value: 1100, rarity: "rare" },
  golden_chalice: { name: "Złoty Kielich Kolonistów", type: "valuable", size: [2, 2], value: 1900, rarity: "rare" },
  platinum_wire: { name: "Platynowy drut mikroprocesorowy", type: "valuable", size: [1, 1], stack: 2, value: 1000, rarity: "rare" },
  ancient_tablet: { name: "Kamienna tablica Ziemi", type: "valuable", size: [2, 2], value: 2500, rarity: "rare" },
  artifact_orb: { name: "Kula Artefaktu Wega", type: "valuable", size: [1, 1], value: 1700, rarity: "rare" },
  holo_portrait: { name: "Hologram rodzinny z Ziemi", type: "valuable", size: [1, 2], value: 800, rarity: "rare" },
  emerald_xenon: { name: "Szmaragd Xenonowy", type: "valuable", size: [1, 1], value: 1400, rarity: "rare" },
  pocket_watch: { name: "Kieszonkowy zegarek z Ziemi", type: "valuable", size: [1, 1], value: 1200, rarity: "rare" },
  meteor_iron: { name: "Meteoryt żelazny", type: "valuable", size: [2, 1], stack: 2, value: 950, rarity: "rare" },

  // Surowce i złom
  scrap: { name: "Złom", type: "junk", size: [1, 1], stack: 5, value: 15 },
  wires: { name: "Przewody", type: "junk", size: [1, 1], stack: 5, value: 20 },
  circuit: { name: "Układ scalony", type: "junk", size: [1, 1], stack: 3, value: 60 },
  fuel_cell: { name: "Ogniwo paliwowe", type: "junk", size: [2, 2], value: 140 },
  data_chip: { name: "Chip danych", type: "junk", size: [1, 1], value: 220, rarity: "rare" },
  titan_filter: { name: "Filtr atmosferyczny kopuły", type: "junk", size: [1, 2], stack: 2, value: 180 },
  titan_fusion_core: { name: "Rdzeń fuzyjny Tytana", type: "junk", size: [2, 2], value: 350, rarity: "rare" },

  // Dropy biologiczne (Kopuła Tytana)
  infected_tissue: { name: "Tkanka mózgowa zarażonego", type: "junk", size: [1, 1], stack: 5, value: 75 },
  toxic_bile: { name: "Fiolka żrącej żółci", type: "junk", size: [1, 1], stack: 4, value: 95 },
  infected_tendon: { name: "Zmutowane ścięgno biegacza", type: "junk", size: [1, 1], stack: 6, value: 60 },
  pathogen_clot: { name: "Skrzep patogenu Tytana", type: "junk", size: [1, 1], stack: 3, value: 160, rarity: "rare" },

  // Przedmioty fabularne
  manual: { name: "Instrukcja serwisowa", type: "quest", quest: true, size: [1, 1], value: 0, read: "repair" },
  part_injector: { name: "Wtryskiwacz plazmowy", type: "quest", quest: true, size: [1, 2], value: 0 },
  part_coil: { name: "Cewka zapłonowa", type: "quest", quest: true, size: [2, 1], value: 0 },
  part_gasket: { name: "Uszczelka komory", type: "quest", quest: true, size: [2, 1], value: 0 },
  titan_med_key: { name: "Karta dostępu do szpitala", type: "quest", quest: true, size: [1, 1], value: 0 },
  // === v43: nowe przedmioty i bronie wysokiego tieru ===
  nanite_serum: { name: "Serum nanitów", type: "consumable", size: [1, 1], value: 210, heal: 30, cures: ["krwawienie", "mocne_krwawienie", "podraznienie"], rarity: "rare", tone: "heal", use: "Nanoboty łatają tkankę: leczy 30 HP i zatrzymuje mocne krwawienie oraz podrażnienie." },
  adrenal_patch: { name: "Plaster adrenalinowy", type: "consumable", size: [1, 1], value: 140, buff: "adrenalina", buffDuration: 6, tone: "combat", use: "Przykleja się do skóry: +25% obrażeń przez 6 tur." },
  titan_ration: { name: "Koncentrat Tytana", type: "consumable", size: [1, 1], value: 65, buff: "sytosc", buffDuration: 10, tone: "food", use: "Gęsty posiłek z hydroponiki: pasywnie +15 HP co turę przez 10 tur." },
  antitoksyna: { name: "Antytoksyna Szeptu", type: "consumable", size: [1, 1], value: 180, heal: 10, cures: ["szept", "podraznienie"], tone: "virus", use: "Neutralizuje Szept w krwiobiegu i łagodzi podrażnienia. Leczy +10 HP." },
  bandaz_zbiorczy: { name: "Bandaż zbiorczy", type: "consumable", size: [1, 2], value: 90, heal: 20, cures: ["krwawienie", "mocne_krwawienie"], tone: "clamp", use: "Gruby opatrunek: +20 HP i zatrzymuje obydwa rodzaje krwawienia." },
  racja_wojskowa: { name: "Racja wojskowa", type: "consumable", size: [1, 1], value: 55, hunger: 45, thirst: 10, tone: "food", use: "Pełnowartościowy posiłek: uzupełnia głód (+45%) i trochę pragnienie (+10%)." },
  kompres_chlodzacy: { name: "Kompres chłodzący", type: "consumable", size: [1, 1], value: 40, heal: 5, cures: ["siniak", "podraznienie"], tone: "heal", use: "Chłodzi stłuczenia i podrażnienia. +5 HP." },
  shield_gel: { name: "Żel ochronny", type: "consumable", size: [1, 2], value: 95, cures: ["siniak", "podraznienie"], tone: "heal", use: "Chłodzi stłuczenia i podrażnienia. Nie leczy HP." },
  titan_plate: { name: "Płyta tytanowa", type: "armor", size: [3, 3], value: 1500, def: 10, rarity: "rare" },
  neural_chip: { name: "Neuroprocesor", type: "valuable", size: [1, 1], value: 700 },
  plasma_cannon: { name: "Działo plazmowe Helios", type: "weapon", caliber: "plazma", size: [4, 2], value: 2100, dmg: [36, 52], acc: 0.93, ammo: "ammo_plasma", rarity: "rare", category: "heavy" },
  rail_gauss: { name: "Karabin szynowy Caelum-X", type: "weapon", caliber: "7,62 mm", size: [4, 1], value: 2600, dmg: [48, 70], acc: 0.97, ammo: "ammo762", rarity: "rare", category: "heavy" },
  void_blade: { name: "Ostrze Próżni Tytana", type: "weapon", caliber: "—", size: [1, 3], value: 2300, dmg: [30, 46], acc: 0.98, rarity: "rare", category: "melee_long" },
  // === v1.67.0: kontenery magazynowe ===
  // size = wymiar zewnętrzny (zajmuje miejsce w magazynie), container.inner = wnętrze [w,h].
  // Filtr: ids (lista przedmiotów) albo types (typy przedmiotów). Kontenery nie mieszczą się w kontenerach.
  medicine_case: { name: "Medicine Case", type: "container", size: [3, 3], value: 3000, price: 4500, container: { inner: [5, 6], label: "leki i medykamenty", ids: ["bandage", "tourniquet", "hemostatic", "ointment", "splint", "medkit", "morphine", "stim_adrenal", "stim_bleedstop", "decontam_kit", "nanite_serum", "adrenal_patch", "shield_gel"] } },
  weapon_case: { name: "Weapon Case", type: "container", size: [2, 4], value: 4000, price: 6000, container: { inner: [7, 6], label: "broń", types: ["weapon"] } },
  ammo_case: { name: "Ammo Case", type: "container", size: [2, 2], value: 800, container: { inner: [5, 5], label: "amunicja", types: ["ammo"] } },
  cardboard_box: { name: "Cardboard Box", type: "container", size: [3, 3], value: 300, container: { inner: [7, 7], label: "zwykłe przedmioty (junk, wartościowe, narzędzia)", types: ["junk", "valuable", "tool"] } },
  rifle_orbit: { name: "Karabin szturmowy Orbit", type: "weapon", caliber: "5,56 mm", size: [3, 2], value: 780, dmg: [14, 22], acc: 0.78, ammo: "ammo556", rarity: "rare", category: "rifle" },
  knife_throw: { name: "Nóż do rzucania", type: "weapon", caliber: "—", size: [1, 1], value: 60, dmg: [5, 9], acc: 0.85, category: "melee_short" },
  sledge_heavy: { name: "Młot kowalski", type: "weapon", caliber: "—", size: [2, 3], value: 230, dmg: [13, 19], acc: 0.7, category: "melee_long" },
  helmet_night: { name: "Hełm nocny z noktowizorem", type: "armor", size: [2, 2], value: 380, def: 4, rarity: "rare" },
  armor_light_mesh: { name: "Lekka kolczuga", type: "armor", size: [2, 2], value: 130, def: 2 },
  plate_heavy: { name: "Płyta ciężka Titan", type: "armor", size: [3, 3], value: 900, def: 9, rarity: "rare" },
  multitool: { name: "Multitool wielofunkcyjny", type: "tool", size: [1, 1], value: 85, uses: 8 },
  geiger: { name: "Licznik Geigera", type: "tool", size: [1, 1], value: 210 },
  lockpick_set: { name: "Zestaw wytrychów", type: "tool", size: [1, 1], value: 140, uses: 6 },
  diagnostic_scanner: { name: "Skaner diagnostyczny", type: "tool", size: [1, 2], value: 320 },
  mining_drill: { name: "Wiertarka górnicza", type: "tool", size: [2, 2], value: 480, uses: 10, rarity: "rare" },
  hack_deck: { name: "Deck hakerski", type: "tool", size: [2, 1], value: 720, uses: 6, rarity: "rare" },
  flashlight_uv: { name: "Latarka UV", type: "tool", size: [1, 1], value: 60 },
  ancient_coin: { name: "Starożytna moneta", type: "valuable", size: [1, 1], value: 300 },
  ruby_shard: { name: "Odłamek rubinu", type: "valuable", size: [1, 1], value: 480, rarity: "rare" },
  diamond_ring: { name: "Pierścień z diamentem", type: "valuable", size: [1, 1], value: 1600, rarity: "rare" },
  broken_drone: { name: "Uszkodzony dron", type: "junk", size: [2, 2], value: 120 },
  old_phone: { name: "Stary telefon", type: "junk", size: [1, 1], value: 45 },
  card_dome: { name: "Karta dostępu: Kopuła Tytana", type: "tool", size: [1, 1], value: 900, keyFor: "dome", rarity: "rare", use: "Otwiera zamknięte pomieszczenie w Kopule Tytana. Karta znika po otwarciu." },
  card_vega: { name: "Karta dostępu: Wega-7", type: "tool", size: [1, 1], value: 900, keyFor: "vega", rarity: "rare", use: "Otwiera zamknięte pomieszczenie na Wedze-7. Karta znika po otwarciu." },
  card_helix: { name: "Karta dostępu: Fabryka Helix", type: "tool", size: [1, 1], value: 900, keyFor: "helix", rarity: "rare", use: "Otwiera zamknięte pomieszczenie w Ruinach Helix. Karta znika po otwarciu." },
  access_code: { name: "Kod dostępu", type: "valuable", size: [1, 1], value: 1500, rarity: "rare" },
  rail_cannon: { name: "Działo szynowe Ares", type: "weapon", caliber: "40 mm szynowe", size: [4, 2], value: 4200, dmg: [38, 55], acc: 0.86, ammo: "ammo_rail", category: "heavy", rarity: "rare" },
  armor_singularity: { name: "Pancerz Osobliwości", type: "armor", size: [3, 3], value: 4500, def: 12, rarity: "rare" },
  doc_skill: { name: "Dokumentacja umiejętności", type: "consumable", size: [1, 1], value: 2500, skillDoc: 3, rarity: "rare", tone: "heal", use: "Po przeczytaniu dodaje 3 pełne poziomy losowej umiejętności, która nie jest jeszcze na maksimum." },
  ammo_crate: { name: "Skrzynia z amunicją", type: "consumable", size: [2, 2], value: 320, unpackAmmo: true, tone: "heal", use: "Otwierasz skrzynię: w środku trzy różne rodzaje amunicji (60–100% pełnego stosu)." },
  pm_034x: { name: "Magazyn Przenośny PM-034X", type: "backpack", size: [3, 3], value: 533, bagRows: 8, use: "Założony w slocie Plecak: zestaw na rajd rośnie do 8 wierszy." },
  pm_g33: { name: "Powiększony magazyn przenośny PM-G33", type: "backpack", size: [3, 3], value: 966, bagRows: 10, use: "Założony w slocie Plecak: zestaw na rajd rośnie do 10 wierszy." },
  pm_military_x23: { name: "Militarny magazyn przenośny PM-MILITARY_X23", type: "backpack", size: [3, 3], value: 1800, bagRows: 12, rarity: "rare", use: "Założony w slocie Plecak: zestaw na rajd rośnie do 12 wierszy." },
};

// === SEKCJA: ZESTAWY STARTOWE ===
const KITS = {
  "Lekki Frachtowiec": [
    ["wrench", 1],
    ["ration", 3],
    ["bandage", 2],
    ["ointment", 1],
    ["medkit", 1],
  ],
  "Myśliwiec Zwiadowczy": [
    ["pistol", 1],
    ["ammo9", 12],
    ["armor_damaged", 1],
    ["tourniquet", 1],
    ["saturn_cola", 1],
  ],
};

// === SEKCJA: RECEPTURY MODUŁÓW ===
const RECIPES = [
  { id: "r_glove", module: "Crafting", minLevel: 1, name: "Głębinowy Chwytak Plazmowy (Rękawica)", in: [["scrap", 3], ["wires", 2], ["fuel_cell", 1]], out: ["mining_glove", 1] },
  { id: "r_ammo", module: "Crafting", minLevel: 1, name: "Amunicja 9mm x8", in: [["scrap", 2], ["wires", 1]], out: ["ammo9", 8] },
  { id: "r_ammo12", module: "Crafting", minLevel: 1, name: "Amunicja śrutowa 12G x6", in: [["scrap", 2], ["wires", 1]], out: ["ammo12", 6] },
  { id: "r_ammo556", module: "Crafting", minLevel: 2, name: "Amunicja 5.56mm x10", in: [["scrap", 3], ["wires", 2], ["circuit", 1]], out: ["ammo556", 10] },
  { id: "r_knife", module: "Crafting", minLevel: 1, name: "Nóż bojowy Tanto", in: [["scrap", 3], ["cloth", 2]], out: ["combat_knife", 1] },
  { id: "r_splint", module: "Crafting", minLevel: 1, name: "Szyna usztywniająca", in: [["scrap", 2], ["cloth", 2]], out: ["splint", 1] },
  { id: "r_shotgun", module: "Crafting", minLevel: 2, name: "Strzelba bojowa Striker", in: [["scrap", 8], ["wires", 3], ["circuit", 1]], out: ["shotgun", 1] },
  { id: "r_vest", module: "Crafting", minLevel: 2, name: "Kamizelka kompozytowa", in: [["armor_damaged", 1], ["scrap", 4], ["circuit", 1]], out: ["armor_vest", 1] },
  { id: "r_smg", module: "Crafting", minLevel: 3, name: "Pistolet maszynowy Vex", in: [["pistol", 1], ["scrap", 6], ["circuit", 2]], out: ["smg", 1] },
  { id: "r_bandage", module: "Medstation", minLevel: 1, name: "Bandaż", in: [["cloth", 2]], out: ["bandage", 1] },
  { id: "r_tourniquet", module: "Medstation", minLevel: 1, name: "Bandaż uciskowy", in: [["cloth", 3], ["wires", 1]], out: ["tourniquet", 1] },
  { id: "r_ointment", module: "Medstation", minLevel: 1, name: "Maść regeneracyjna", in: [["ration", 1], ["cloth", 1]], out: ["ointment", 1] },
  { id: "r_hemostatic", module: "Medstation", minLevel: 1, name: "Opatrunek hemostatyczny", in: [["cloth", 3], ["bandage", 1]], out: ["hemostatic", 1] },
  { id: "r_medkit", module: "Medstation", minLevel: 1, name: "Apteczka", in: [["bandage", 2], ["circuit", 1]], out: ["medkit", 1] },
  { id: "r_stim", module: "Medstation", minLevel: 2, name: "Stymulator bojowy Adrenal-X", in: [["morphine", 1], ["fuel_cell", 1], ["pathogen_clot", 1]], out: ["stim_adrenal", 1] },
  { id: "r_stim_bleedstop", module: "Medstation", minLevel: 2, name: "Stymulant BleedStop", in: [["hemostatic", 1], ["fuel_cell", 1]], out: ["stim_bleedstop", 1] },
  { id: "r_titan_plate", module: "Crafting", minLevel: 3, name: "Płyta tytanowa", in: [["armor_vest", 1], ["ore_titanium", 3], ["circuit", 2]], out: ["titan_plate", 1] },
  { id: "r_plasma_cannon", module: "Crafting", minLevel: 3, name: "Działo plazmowe Helios", in: [["plasma_carbine", 1], ["xenonite_crystal", 2], ["circuit", 4], ["fuel_cell", 2]], out: ["plasma_cannon", 1] },
  { id: "r_rail_gauss", module: "Crafting", minLevel: 3, name: "Karabin szynowy Caelum-X", in: [["sniper_dragoon", 1], ["platinum_wire", 3], ["titan_filter", 1]], out: ["rail_gauss", 1] },
  { id: "r_void_blade", module: "Crafting", minLevel: 3, name: "Ostrze Próżni Tytana", in: [["combat_knife", 1], ["titan_diamond", 2], ["gold_ingot", 1]], out: ["void_blade", 1] },
  { id: "r_multitool", module: "Crafting", minLevel: 1, name: "Multitool wielofunkcyjny", in: [["scrap", 3], ["wires", 3], ["circuit", 1]], out: ["multitool", 1] },
  { id: "r_sledge", module: "Crafting", minLevel: 1, name: "Młot kowalski", in: [["scrap", 6], ["cloth", 2]], out: ["sledge_heavy", 1] },
  { id: "r_drill", module: "Crafting", minLevel: 2, name: "Wiertarka górnicza", in: [["fuel_cell", 1], ["scrap", 4], ["circuit", 2]], out: ["mining_drill", 1] },
  { id: "r_scanner", module: "Crafting", minLevel: 2, name: "Skaner diagnostyczny", in: [["circuit", 2], ["wires", 2], ["scrap", 2]], out: ["diagnostic_scanner", 1] },
  { id: "r_plate", module: "Crafting", minLevel: 3, name: "Płyta ciężka Titan", in: [["armor_vest", 1], ["scrap", 6], ["circuit", 2]], out: ["plate_heavy", 1] },
  { id: "r_hack", module: "Crafting", minLevel: 3, name: "Deck hakerski", in: [["neural_chip", 1], ["circuit", 3], ["wires", 2]], out: ["hack_deck", 1] },
  { id: "r_rifle_orbit", module: "Crafting", minLevel: 3, name: "Karabin szturmowy Orbit", in: [["smg", 1], ["scrap", 6], ["circuit", 3]], out: ["rifle_orbit", 1] },
  { id: "r_pm_military", module: "Crafting", minLevel: 3, name: "Militarny magazyn PM-MILITARY_X23", in: [["pm_g33", 2], ["scrap", 8], ["titan_diamond", 1], ["golden_chalice", 1]], out: ["pm_military_x23", 1] },
];

if (typeof window !== "undefined") {
  window.ITEMS = ITEMS;
  window.KITS = KITS;
  window.RECIPES = RECIPES;
}
if (typeof globalThis !== "undefined") {
  globalThis.ITEMS = ITEMS;
  globalThis.KITS = KITS;
  globalThis.RECIPES = RECIPES;
}

// === v1.65.0: kategorie broni ===
// Każda broń (type: "weapon") ma pole category wskazujące na jeden wpis z WEAPON_CATEGORIES.
// Kategorie służą do grupowania i opisu; kolory nie są jeszcze z nich wyprowadzane.
const WEAPON_CATEGORIES = {
  melee_short: { name: "Broń biała krótka", desc: "Ostrza i pałki do 2 pól długości." },
  melee_long:  { name: "Broń biała długa",  desc: "Łomy, maczety, topory i ostrza do 3 pól długości." },
  pistol:      { name: "Pistolet",          desc: "Broń palna jednoręczna." },
  smg:         { name: "Pistolet maszynowy", desc: "Szybkostrzelna broń palna na pistoletowy nabój." },
  shotgun:     { name: "Strzelba",          desc: "Duże obrażenia na krótki dystans, amunicja 12." },
  rifle:       { name: "Karabin szturmowy", desc: "Uniwersalna broń palna na średni dystans." },
  sniper:      { name: "Karabin snajperski", desc: "Precyzyjna broń palna na duży dystans." },
  plasma:      { name: "Broń plazmowa",     desc: "Broń energetyczna na amunicję plazmową." },
  heavy:       { name: "Broń ciężka",       desc: "Ciężkie działa i karabiny szynowe, zajmują dużo miejsca." },
  void:        { name: "Broń próżniowa",    desc: "Ostrza z energii Próżni." },
};

// Zwraca kategorię broni albo null dla przedmiotów innych niż broń.
function getWeaponCategory(itemId) {
  const it = ITEMS[itemId];
  if (!it || it.type !== "weapon" || !it.category) return null;
  return WEAPON_CATEGORIES[it.category] || null;
}
