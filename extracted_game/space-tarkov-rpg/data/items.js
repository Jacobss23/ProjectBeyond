// === SEKCJA: PRZEDMIOTY ===
// size: [szerokość, wysokość] w polach siatki, stack: maks. ilość w jednym polu
const ITEMS = {
  ration: { name: "Racja żywnościowa", type: "consumable", size: [1, 1], value: 30, heal: 10 },
  cloth: { name: "Szmaty", type: "junk", size: [1, 1], stack: 5, value: 8 },
  bandage: { name: "Bandaż", type: "consumable", size: [1, 1], value: 45, heal: 20 },
  medkit: { name: "Apteczka", type: "consumable", size: [2, 1], value: 120, heal: 45 },

  ammo9: { name: "Amunicja 9mm", type: "ammo", size: [1, 1], stack: 30, value: 6 },
  wrench: { name: "Klucz hydrauliczny", type: "weapon", size: [1, 3], value: 40, dmg: [4, 8], acc: 0.9 },
  crowbar: { name: "Łom", type: "weapon", size: [1, 3], value: 70, dmg: [5, 10], acc: 0.85 },
  pistol: { name: "Pistolet P-9", type: "weapon", size: [2, 1], value: 250, dmg: [8, 14], acc: 0.8, ammo: "ammo9" },
  smg: { name: "Pistolet maszynowy Vex", type: "weapon", size: [3, 2], value: 600, dmg: [11, 17], acc: 0.7, ammo: "ammo9", rarity: "rare" },

  armor_damaged: { name: "Uszkodzony pancerz taktyczny", type: "armor", size: [3, 3], value: 150, def: 3 },
  armor_vest: { name: "Kamizelka kompozytowa", type: "armor", size: [3, 3], value: 400, def: 5, rarity: "rare" },

  scrap: { name: "Złom", type: "junk", size: [1, 1], stack: 5, value: 15 },
  wires: { name: "Przewody", type: "junk", size: [1, 1], stack: 5, value: 20 },
  circuit: { name: "Układ scalony", type: "junk", size: [1, 1], stack: 3, value: 60 },
  fuel_cell: { name: "Ogniwo paliwowe", type: "junk", size: [2, 2], value: 140 },
  data_chip: { name: "Chip danych", type: "junk", size: [1, 1], value: 220, rarity: "rare" },

  manual: { name: "Instrukcja serwisowa", type: "quest", quest: true, size: [1, 1], value: 0, read: "repair" },
  part_injector: { name: "Wtryskiwacz plazmowy", type: "quest", quest: true, size: [1, 2], value: 0 },
  part_coil: { name: "Cewka zapłonowa", type: "quest", quest: true, size: [2, 1], value: 0 },
  part_gasket: { name: "Uszczelka komory", type: "quest", quest: true, size: [2, 1], value: 0 },
};

// === SEKCJA: ZESTAWY STARTOWE ===
const KITS = {
  "Lekki Frachtowiec": [
    ["wrench", 1],
    ["ration", 3],
    ["bandage", 2],
    ["medkit", 1],
  ],
  "Myśliwiec Zwiadowczy": [
    ["pistol", 1],
    ["ammo9", 12],
    ["armor_damaged", 1],
    ["bandage", 1],
  ],
};

// === SEKCJA: RECEPTURY MODUŁÓW ===
const RECIPES = [
  { id: "r_ammo", module: "Warsztat", name: "Amunicja 9mm x8", in: [["scrap", 2], ["wires", 1]], out: ["ammo9", 8] },
  { id: "r_vest", module: "Warsztat", name: "Kamizelka kompozytowa", in: [["armor_damaged", 1], ["scrap", 4], ["circuit", 1]], out: ["armor_vest", 1] },
  { id: "r_bandage", module: "Medyczny", name: "Bandaż", in: [["cloth", 2]], out: ["bandage", 1] },
  { id: "r_medkit", module: "Medyczny", name: "Apteczka", in: [["bandage", 2], ["circuit", 1]], out: ["medkit", 1] },
];
