// === SEKCJA: MODUŁY SCHRONU (7 STACJI) ===
const SHIP_MODULES = [
  {
    id: "Crafting",
    name: "Warsztat Craftingu",
    maxLevel: 3,
    desc: "Wytwarzanie amunicji, opatrunków, pancerzy i modyfikacji broni.",
    levels: [
      { level: 0, title: "Brak warsztatu", desc: "Tylko polowy demontaż.", cost: 0, items: [] },
      { level: 1, title: "Stół rusznikarski", desc: "Wytwarzanie amunicji 9mm i bandaży.", cost: 200, items: [["scrap", 4], ["wires", 2]] },
      { level: 2, title: "Warsztat precyzyjny", desc: "Produkcja kamizelek i apteczek polowych.", cost: 600, items: [["scrap", 8], ["circuit", 3], ["wires", 4]] },
      { level: 3, title: "Fabrykator zaawansowany", desc: "Produkcja egzoszkieletów i amunicji specjalnej.", cost: 1400, items: [["fuel_cell", 2], ["circuit", 5]] }
    ]
  },
  {
    id: "Medstation",
    name: "Stacja Medyczna",
    maxLevel: 2,
    desc: "Regeneracja zdrowia w schronie oraz wytwarzanie środków medycznych.",
    levels: [
      { level: 0, title: "Polowa izolatka", desc: "Odpoczynek regeneruje do 50% HP.", cost: 0, items: [] },
      { level: 1, title: "Ambulatorium", desc: "Odpoczynek regeneruje do 85% HP.", cost: 250, items: [["cloth", 4], ["wires", 2]] },
      { level: 2, title: "Kapsuła nanitowa", desc: "Natychmiastowe 100% HP i usuwanie skażenia radiacją.", cost: 800, items: [["circuit", 4], ["fuel_cell", 1]] }
    ]
  },
  {
    id: "Stash",
    name: "Magazyn (Stash)",
    maxLevel: 5,
    desc: "Zwiększa rozmiar głównego magazynu w bazie.",
    levels: [
      { level: 1, title: "Standardowy schowek (10x12)", desc: "120 pól pojemności.", cost: 0, items: [], size: [10, 12] },
      { level: 2, title: "Wzmocnione szafy (10x15)", desc: "150 pól pojemności.", cost: 300, items: [["scrap", 6], ["wires", 3]], size: [10, 15] },
      { level: 3, title: "Kontener hermetyczny (12x16)", desc: "192 pola pojemności.", cost: 750, items: [["scrap", 12], ["circuit", 3]], size: [12, 16] },
      { level: 4, title: "Ładownia Zero-G (12x20)", desc: "240 pól pojemności.", cost: 1400, items: [["scrap", 16], ["fuel_cell", 2]], size: [12, 20] },
      { level: 5, title: "Skarbiec orbitalny (14x24)", desc: "336 pól pojemności (Tarkov Max).", cost: 2600, items: [["fuel_cell", 4], ["circuit", 6]], size: [14, 24] }
    ]
  },
  {
    id: "Silniki",
    name: "Napęd Statku",
    maxLevel: 2,
    desc: "Pozwala na podróże do odległych sektorów i planet.",
    levels: [
      { level: 0, title: "Uszkodzony napęd Marsjański", desc: "Dostęp tylko do Marsa (trening).", cost: 0, items: [] },
      { level: 1, title: "Napęd podświetlny", desc: "Odblokowuje rajd: Stacja orbitalna Vega.", cost: 400, items: [["scrap", 8], ["fuel_cell", 1]] },
      { level: 2, title: "Hipernapęd skokowy", desc: "Odblokowuje rajd: Głęboka przestrzeń i Wraki dreadnoughtów.", cost: 1200, items: [["fuel_cell", 3], ["circuit", 4]] }
    ]
  },
  {
    id: "Komunikacja",
    name: "Łączność i Zlecenia",
    maxLevel: 3,
    desc: "Odblokowuje nowych handlarzy, kontrakty i zlecenia.",
    levels: [
      { level: 0, title: "Radio SOS", desc: "Dostępny tylko lokalny Handlarz 1.", cost: 0, items: [] },
      { level: 1, title: "Transponder orbitalny", desc: "Odblokowuje Handlarza 2 (zbrojmistrz) i codzienne zlecenia.", cost: 300, items: [["wires", 4], ["circuit", 2]] },
      { level: 2, title: "Przekaźnik kwantowy", desc: "Odblokowuje Handlarzy 3 i 4 (elektronika, pancerze) oraz questy frakcyjne.", cost: 850, items: [["circuit", 4], ["data_chip", 1]] },
      { level: 3, title: "Satelita Czarnego Rynku", desc: "Zaszyfrowany Czarny Rynek i 10% rabatu u kupców.", cost: 1800, items: [["data_chip", 3]] }
    ]
  },
  {
    id: "Hydroponika",
    name: "Hydroponika (Farma)",
    maxLevel: 5,
    desc: "Farma pożywienia i wody pitnej. Zapobiega odwodnieniu i głodowi w rajdach.",
    levels: [
      { level: 0, title: "Wyschnięte koryta", desc: "Brak produkcji.", cost: 0, items: [] },
      { level: 1, title: "Taca kiełkująca LED", desc: "Produkuje 1x Rację i 1x Czystą wodę na cykl.", cost: 150, items: [["scrap", 3], ["cloth", 2]] },
      { level: 2, title: "Półki wertykalne", desc: "Produkuje 2x Racje i 2x Czystą wodę na cykl.", cost: 350, items: [["scrap", 5], ["wires", 3]] },
      { level: 3, title: "Hydroponika aero", desc: "Produkuje 3x Racje i 3x Czystą wodę na cykl.", cost: 700, items: [["circuit", 2], ["fuel_cell", 1]] },
      { level: 4, title: "Bioreaktor odżywczy", desc: "Produkuje 4x zapasy oraz pasywnie regeneruje głód w schronie.", cost: 1200, items: [["circuit", 4], ["fuel_cell", 2]] },
      { level: 5, title: "Biosfera Eden", desc: "Maksymalna produkcja zbiorcza (5x zapasów).", cost: 2200, items: [["circuit", 6], ["fuel_cell", 3]] }
    ]
  },
  {
    id: "Safe system",
    name: "Safe System (Radar Intel)",
    maxLevel: 2,
    desc: "Pre-raid recon: pozwala przeskanować wybraną mapę, ujawniając średnią liczbę wrogów, questy i loot.",
    levels: [
      { level: 0, title: "Radar offline", desc: "Brak rozpoznania przed rajdem.", cost: 0, items: [] },
      { level: 1, title: "Skaner orbitalny", desc: "Wyświetla mini-mapę ze średnią liczbą wrogów i punktami ewakuacji.", cost: 300, items: [["wires", 4], ["circuit", 2]] },
      { level: 2, title: "Sieć taktyczna SAR", desc: "Ujawnia cele questów, skrytki z łupem i daje +10% szansy na ucieczkę.", cost: 900, items: [["data_chip", 1], ["circuit", 3]] }
    ]
  }
];
