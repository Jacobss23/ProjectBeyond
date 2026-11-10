// === SEKCJA: WROGOWIE ===
const ENEMIES = {
  // Podstawowe typy (Mars)
  zombie_walker: { name: "Pusty Szwendacz", strain: "pustka", hp: 32, dmg: [3, 6], acc: 0.6, xp: 12, loot: "zombie", rolls: 1, verb: "drapie i gryzie", statusOnHit: { type: "siniak", chance: 0.25 } },
  zombie_crawler: { name: "Pusty Pełzacz", strain: "pustka", hp: 20, dmg: [2, 5], acc: 0.7, xp: 9, loot: "zombie", rolls: 1, verb: "szarpie za nogi", statusOnHit: { type: "siniak", chance: 0.3 } },
  zombie_spitter: { name: "Pusty Pluj", strain: "pustka", hp: 28, dmg: [5, 9], acc: 0.65, xp: 18, loot: "zombie", rolls: 2, verb: "opluwa kwasem", statusOnHit: { type: "podraznienie", chance: 0.3 } },
  zombie_brute: { name: "Pusty Kolos", strain: "pustka", hp: 70, dmg: [8, 13], acc: 0.55, xp: 40, loot: "zombie", rolls: 3, verb: "miażdży potężną pięścią", statusOnHit: { type: "siniak", chance: 0.45 } },
  raider: { name: "Szabrownik Pustkowi", strain: "human", hp: 45, dmg: [6, 11], acc: 0.7, xp: 30, loot: "raider", rolls: 2, verb: "strzela z broni krótkiej", statusOnHit: { type: "krwawienie", chance: 0.15 } },

  // Typy dla Kopuły Nowy Ereb (Tytan)
  infected_runner: {
    name: "Wściekły Biegacz", strain: "furia",
    hp: 36,
    dmg: [7, 14],
    acc: 0.8,
    xp: 25,
    loot: "titan_infected",
    rolls: 2,
    verb: "rzuca się w dzikim szale z nadludzką prędkością",
    statusOnHit: { type: "siniak", chance: 0.35 },
  },
  infected_stalker: {
    name: "Myślący Tropiciel", strain: "umysl",
    hp: 30,
    dmg: [9, 16],
    acc: 0.84,
    xp: 32,
    loot: "titan_infected",
    rolls: 2,
    verb: "wyprowadza błyskawiczne cięcie z cienia",
    statusOnHit: { type: "krwawienie", chance: 0.22 },
  },
  infected_spitter_heavy: {
    name: "Nosiciel Żrącej Żółci", strain: "furia",
    hp: 45,
    dmg: [10, 18],
    acc: 0.72,
    xp: 38,
    loot: "titan_spitter",
    rolls: 3,
    verb: "wymiotuje strumieniem parzącego biokwasu",
    statusOnHit: { type: "podraznienie", chance: 0.4 },
  },
  infected_brute_miner: {
    name: "Zmutowany Górnik Kopuły", strain: "furia",
    hp: 110,
    dmg: [15, 24],
    acc: 0.65,
    xp: 75,
    loot: "titan_brute",
    rolls: 4,
    verb: "uderza zbrojonym świdrem przemysłowym",
    statusOnHit: { type: "zlamanie", chance: 0.2 },
  },
  titan_raider: {
    name: "Szabrownik Syndykatu Tytana", strain: "human",
    hp: 60,
    dmg: [11, 19],
    acc: 0.76,
    xp: 48,
    loot: "titan_military",
    rolls: 3,
    verb: "prowadzi bezlitosny ogień ze strzelby",
    statusOnHit: { type: "mocne_krwawienie", chance: 0.15 },
  },
  // === BOSS: Archiwum (faza 1: wyrzut kwasu co 3 tury; faza 2 przy 60% HP: szał) ===
  archive_mother: {
    name: "Matka Archiwum", strain: "umysl",
    hp: 180,
    dmg: [10, 16],
    acc: 0.75,
    xp: 300,
    loot: "boss_archive",
    rolls: 3,
    verb: "uderza odnóżami wbitymi w pancerz",
    statusOnHit: { type: "siniak", chance: 0.4 },
    boss: true,
  },
};

if (typeof window !== "undefined") {
  window.ENEMIES = ENEMIES;
}
if (typeof globalThis !== "undefined") {
  globalThis.ENEMIES = ENEMIES;
}
