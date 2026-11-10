// === SEKCJA: BAZA CECH I PERKÓW ORAZ NIEWIDZIALNE STATYSTYKI ===
const HIDDEN_STATS_DEF = {
  luck: {
    id: "luck",
    name: "Szczęście",
    desc: "Zwiększa szansę na znalezienie większej ilości i rzadszego lootu.",
    unit: "%",
    defaultVal: 0,
  },
  critChance: {
    id: "critChance",
    name: "Krytyczne uderzenia",
    desc: "Szansa na zadanie potężnego trafienia krytycznego w walce (1.75x dmg).",
    unit: "%",
    defaultVal: 5,
  },
  immunity: {
    id: "immunity",
    name: "Immunity (Odporność)",
    desc: "Odporność na toksyny, infekcje zombie i skażenie środowiskowe.",
    unit: "%",
    defaultVal: 0,
  },
  intuition: {
    id: "intuition",
    name: "Intuicja",
    desc: "Ostrzega przed zasadzkami i pozwala na wcześniejsze wykrycie wrogów.",
    unit: "%",
    defaultVal: 0,
  },
  stealth: {
    id: "stealth",
    name: "Stealth (Kamuflaż)",
    desc: "Zmniejsza ryzyko zainicjowania walki przez wrogów w lokacji.",
    unit: "%",
    defaultVal: 0,
  },
  scavenger: {
    id: "scavenger",
    name: "Scavenger (Zbieracz)",
    desc: "Szansa na zaoszczędzenie amunicji podczas wystrzału i dodatkowy złom.",
    unit: "%",
    defaultVal: 0,
  },
  adrenaline: {
    id: "adrenaline",
    name: "Adrenalina",
    desc: "Bonus do obrażeń i ucieczki, gdy poziom zdrowia spadnie poniżej 35%.",
    unit: "%",
    defaultVal: 0,
  },
  maxSkillCap: {
    id: "maxSkillCap",
    name: "Limit poziomu umiejętności",
    desc: "Maksymalny pułap poziomu (domyślnie 15, może wynosić 12 lub 18).",
    unit: "lvl",
    defaultVal: 15,
  },
};

const DEFAULT_PERKS = {
  // === POZYTYWNE CECHY ===
  Silny: {
    id: "Silny",
    name: "Silny",
    type: "pos",
    points: -4,
    desc: "Większy udźwig (+1 rząd w plecaku) oraz +25% do obrażeń w walce wręcz.",
    stats: [
      { stat: "skillBonus", skill: "sila", val: 1 },
      { stat: "critChance", val: 5 },
    ],
  },
  Bystry: {
    id: "Bystry",
    name: "Bystry",
    type: "pos",
    points: -3,
    desc: "Szybsze zdobywanie punktów doświadczenia (+25% XP) i wyższa spostrzegawczość.",
    stats: [
      { stat: "intuition", val: 10 },
      { stat: "skillBonus", skill: "percepcja", val: 1 },
    ],
  },
  Szczesciarz: {
    id: "Szczesciarz",
    name: "Szczęściarz",
    type: "pos",
    points: -3,
    desc: "Natura ci sprzyja: +15% do szczęścia i +5% szansy na trafienie krytyczne.",
    stats: [
      { stat: "luck", val: 15 },
      { stat: "critChance", val: 5 },
      { stat: "scavenger", val: 10 },
    ],
  },
  SzostyZmysl: {
    id: "SzostyZmysl",
    name: "Szósty Zmysł",
    type: "pos",
    points: -3,
    desc: "Wyostrzona intuicja pozwala wyczuć zagrożenie i bezszelestnie przemierzać korytarze.",
    stats: [
      { stat: "intuition", val: 20 },
      { stat: "stealth", val: 15 },
    ],
  },
  ZelaznyOrganizm: {
    id: "ZelaznyOrganizm",
    name: "Żelazny Organizm",
    type: "pos",
    points: -3,
    desc: "Wysoka tolerancja na toksyny, mutacje i skażenie biologiczne (+25% immunity).",
    stats: [
      { stat: "immunity", val: 25 },
      { stat: "skillBonus", skill: "witalnosc", val: 1 },
    ],
  },
  WybitnyTalent: {
    id: "WybitnyTalent",
    name: "Wybitny Talent",
    type: "pos",
    points: -8,
    desc: "Genom o nadzwyczajnym potencjale neuronowym: limit rozwoju umiejętności wzrasta do poziomu 18 (zamiast 15).",
    stats: [
      { stat: "maxSkillCap", val: 18 },
      { stat: "luck", val: 5 },
    ],
  },

  // === NEGATYWNE CECHY ===
  Astmatyk: {
    id: "Astmatyk",
    name: "Astmatyk",
    type: "neg",
    points: 4,
    desc: "Niewydolność oddechowa: trudniej uciec z walki i szybciej się męczysz.",
    stats: [
      { stat: "stealth", val: -10 },
    ],
  },
  Pechowiec: {
    id: "Pechowiec",
    name: "Pechowiec",
    type: "neg",
    points: 3,
    desc: "Mniejsza szansa na wartościowy loot i obniżone szczęście (-15%).",
    stats: [
      { stat: "luck", val: -15 },
      { stat: "critChance", val: -3 },
    ],
  },
  Krotkowidz: {
    id: "Krotkowidz",
    name: "Krótkowidz",
    type: "neg",
    points: 2,
    desc: "Mniejsza celność z broni palnej na dystansie i słabsza percepcja.",
    stats: [
      { stat: "intuition", val: -10 },
    ],
  },
  Watly: {
    id: "Watly",
    name: "Wątły",
    type: "neg",
    points: 3,
    desc: "Osłabiona bariera immunologiczna: -20% immunity, większe obrażenia od infekcji.",
    stats: [
      { stat: "immunity", val: -20 },
    ],
  },
  OgraniczonyPotencjal: {
    id: "OgraniczonyPotencjal",
    name: "Ograniczony Potencjał",
    type: "neg",
    points: 8,
    desc: "Wada genetyczna ograniczająca zdolności adaptacyjne: maksymalny poziom umiejętności wynosi tylko 12 (zamiast 15).",
    stats: [
      { stat: "maxSkillCap", val: 12 },
    ],
  },
  // === v43: nowe cechy ===
  Zahartowany: {
    id: "Zahartowany",
    name: "Zahartowany",
    type: "pos",
    points: -3,
    desc: "Organizm przyzwyczajony do zarazy: +20% odporności i +1 poziom Witalności.",
    stats: [
      { stat: "immunity", val: 20 },
      { stat: "skillBonus", skill: "witalnosc", val: 1 },
    ],
  },
  Cichy: {
    id: "Cichy",
    name: "Cichy",
    type: "pos",
    points: -3,
    desc: "Stąpasz bezgłośnie: +15% kamuflażu i +5 intuicji.",
    stats: [
      { stat: "stealth", val: 15 },
      { stat: "intuition", val: 5 },
    ],
  },
  Pechowiec: {
    id: "Pechowiec",
    name: "Pechowiec",
    type: "neg",
    points: 3,
    desc: "Złe szczęście: -15% szczęścia i -5% szansy na krytyka.",
    stats: [
      { stat: "luck", val: -15 },
      { stat: "critChance", val: -5 },
    ],
  },
  Halasliwy: {
    id: "Halasliwy",
    name: "Hałaśliwy",
    type: "neg",
    points: 4,
    desc: "Każdy krok słychać: -15% kamuflażu, więc wrogowie częściej cię zauważają.",
    stats: [{ stat: "stealth", val: -15 }],
  },
};

var PERKS = JSON.parse(JSON.stringify(DEFAULT_PERKS));
if (typeof window !== "undefined") {
  window.PERKS = PERKS;
  window.HIDDEN_STATS_DEF = HIDDEN_STATS_DEF;
  window.DEFAULT_PERKS = DEFAULT_PERKS;
}
if (typeof globalThis !== "undefined") {
  globalThis.PERKS = PERKS;
  globalThis.HIDDEN_STATS_DEF = HIDDEN_STATS_DEF;
  globalThis.DEFAULT_PERKS = DEFAULT_PERKS;
}

