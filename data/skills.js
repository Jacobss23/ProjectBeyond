// === SEKCJA: DRZEWKO UMIEJĘTNOŚCI & STATYSTYKI (0-15) ===
const SKILLS = {
  sila: {
    id: "sila",
    name: "Siła",
    desc: "+3% obrażeń w walce wręcz na poziom oraz większy udźwig.",
    maxLevel: 15,
    xpFormula: (lvl) => 60 * (lvl + 1),
    statBonus: (lvl) => ({ meleeMult: 1 + lvl * 0.03 })
  },
  wytrzymalosc: {
    id: "wytrzymalosc",
    name: "Wytrzymałość",
    desc: "+2% szansy na ucieczkę i wolniejsze zmęczenie organizmu.",
    maxLevel: 15,
    xpFormula: (lvl) => 60 * (lvl + 1),
    statBonus: (lvl) => ({ fleeMod: lvl * 0.02 })
  },
  witalnosc: {
    id: "witalnosc",
    name: "Witalność",
    desc: "+3 maks. punktów HP na poziom (+45 HP na poziomie 15).",
    maxLevel: 15,
    xpFormula: (lvl) => 70 * (lvl + 1),
    statBonus: (lvl) => ({ maxHp: lvl * 3 })
  },
  przeszukiwanie: {
    id: "przeszukiwanie",
    name: "Przeszukiwanie",
    desc: "+2.5% szansy na rzuty rzadkich przedmiotów i szybsze przeszukiwanie.",
    maxLevel: 15,
    xpFormula: (lvl) => 55 * (lvl + 1),
    statBonus: (lvl) => ({ rareMult: 1 + lvl * 0.025 })
  },
  percepcja: {
    id: "percepcja",
    name: "Percepcja",
    desc: "Zwiększa czujność i szansę na uniknięcie zasadzki.",
    maxLevel: 15,
    xpFormula: (lvl) => 60 * (lvl + 1),
    statBonus: (lvl) => ({ ambushResist: lvl * 0.03 })
  },
  bronPalna: {
    id: "bronPalna",
    name: "Broń Palna",
    desc: "+1.5% bazowej celności i +2% obrażeń dystansowych na poziom.",
    maxLevel: 15,
    xpFormula: (lvl) => 65 * (lvl + 1),
    statBonus: (lvl) => ({ rangedAcc: 1 + lvl * 0.015, rangedDmg: 1 + lvl * 0.02 })
  },
  medycyna: {
    id: "medycyna",
    name: "Medycyna",
    desc: "+4% skuteczności leczenia ze wszystkich środków medycznych.",
    maxLevel: 15,
    xpFormula: (lvl) => 60 * (lvl + 1),
    statBonus: (lvl) => ({ healMult: 1 + lvl * 0.04 })
  },
  inzynieria: {
    id: "inzynieria",
    name: "Inżynieria",
    desc: "Szansa na podwójny wyrób podczas craftingu oraz tańsze ulepszenia bazy.",
    maxLevel: 15,
    xpFormula: (lvl) => 70 * (lvl + 1),
    statBonus: (lvl) => ({ doubleCraftChance: lvl * 0.03 })
  },
  metabolizm: {
    id: "metabolizm",
    name: "Metabolizm",
    desc: "+20% zaspokojenia głodu i pragnienia z żywności i wody.",
    maxLevel: 15,
    xpFormula: (lvl) => 50 * (lvl + 1),
    statBonus: (lvl) => ({ nutriMult: 1 + lvl * 0.03 })
  },
  przetrwanie: {
    id: "przetrwanie",
    name: "Przetrwanie",
    desc: "Do 25% redukcji obrażeń od burz, mrozu i promieniowania.",
    maxLevel: 15,
    xpFormula: (lvl) => 70 * (lvl + 1),
    statBonus: (lvl) => ({ hazardResist: lvl * 0.016 })
  }
};
