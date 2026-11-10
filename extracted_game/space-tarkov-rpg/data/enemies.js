// === SEKCJA: WROGOWIE ===
const ENEMIES = {
  zombie_walker: { name: "Zombie - Szwendacz", hp: 32, dmg: [3, 6], acc: 0.6, xp: 12, loot: "zombie", rolls: 1, verb: "drapie" },
  zombie_crawler: { name: "Zombie - Pełzacz", hp: 20, dmg: [2, 5], acc: 0.7, xp: 9, loot: "zombie", rolls: 1, verb: "gryzie" },
  zombie_spitter: { name: "Zombie - Pluj", hp: 28, dmg: [5, 9], acc: 0.65, xp: 18, loot: "zombie", rolls: 2, verb: "opluwa kwasem" },
  zombie_brute: { name: "Zombie - Brutal", hp: 70, dmg: [8, 13], acc: 0.55, xp: 40, loot: "zombie", rolls: 3, verb: "miażdży" },
  raider: { name: "Szabrownik", hp: 45, dmg: [6, 11], acc: 0.7, xp: 30, loot: "raider", rolls: 2, verb: "strzela do ciebie" },
};
