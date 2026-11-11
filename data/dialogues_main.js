// === SEKCJA: TREŚCI DIALOGÓW MISJI GŁÓWNYCH (generowane) ===
// Każda linia: k = t (handlarz), n (narrator), p (gracz); choice = wybór odpowiedzi gracza.
const MAIN_DIALOGS = {
// Każdy dialog: offer (przy przyjęciu) i done (przy oddaniu). Linie: k = t (handlarz), n (narrator), p (gracz, bez wyboru), choice = wybór odpowiedzi gracza.
 "saga_trader1_1": {
  "offer": [
   {
    "k": "n",
    "text": "Klinika w kopule. Vane pochyla się nad stołem zawalonym probówkami i przeciera oczy. Gdy się łączysz, unosi wzrok z wyraźnym zmęczeniem."
   },
   {
    "k": "t",
    "text": "Wróciłeś! Dobrze... Usiądź, mam dla ciebie coś trudniejszego niż opatrunki."
   },
   {
    "k": "p",
    "text": "Co się stało z pacjentami?"
   },
   {
    "k": "t",
    "text": "Część odeszła. Część czeka za tymi drzwiami, bo nikt nie ma serca ich stamtąd wyprowadzić... Cholera, nie chcę o tym mówić."
   },
   {
    "k": "p",
    "text": "Widziałam ludzi, którzy zmienili się w jedną noc."
   },
   {
    "k": "t",
    "text": "Tak! Szept nie zabija od razu. Najpierw daje gorączkę, która wygląda jak zwykła grypa. Potem ciało się zmienia, a człowiek przestaje być sobą - zanim sam to zauważy!"
   },
   {
    "k": "t",
    "text": "Potrzebuję sześciu apteczek, czterech strzykawek z morfiną i dwóch szmat do opatrunków. Wiem, że to niewiele, ale to tyle, ile da się przynieść przez zamknięte dzielnice."
   },
   {
    "k": "p",
    "text": "A jeśli ktoś zachoruje, zanim wrócę?"
   },
   {
    "k": "t",
    "text": "Wtedy liczy się, czy zdążymy go wyleczyć, zanim się zmieni. Nie chcę, żebyś o tym myślał przy każdym kroku - myśl o tym, co przyniesiesz!"
   },
   {
    "choice": [
     {
      "label": "Pomogę. Co dalej?",
      "text": "Pomogę. Co dalej?"
     },
     {
      "label": "Najpierw powiedz, po co ci to.",
      "text": "Najpierw powiedz, po co ci to."
     }
    ]
   },
   {
    "k": "t",
    "text": "Jest jeszcze coś. W fabryce Helix na Tau Ceti e, w Pokoju Kontroli, stoi terminal. Ktoś tam przechowywał próbki w chłodni. Odczytaj z niego dane - ja nie mogę tam pójść, a ty możesz!"
   },
   {
    "k": "p",
    "text": "Ktoś? Kto to był?"
   },
   {
    "k": "t",
    "text": "Nie wiem, psiakrew! Dlatego cię o to proszę. Wracaj z tym, co znajdziesz. Będę tu."
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Vane przegląda pudła z zakupami, mechanicznie układając każdą fiolkę na półce. Zatrzymuje się przy terminalu z danymi i długo patrzy na jeden wiersz."
   },
   {
    "k": "t",
    "text": "Te próbki nie są zwykłym patogenem! Ktoś je tam przechowywał celowo, w chłodni, w tajemnicy. To znaczy, że Szept ma kogoś, kto nim kieruje..."
   },
   {
    "k": "p",
    "text": "Myślisz, że to ktoś z nas?"
   },
   {
    "k": "t",
    "text": "Nie wiem. Ale ludzie nie trzymają w chłodni czegoś, czego się nie boją! Weź serum nanitów. Może uratować kogoś, kto jeszcze nie zdążył się zmienić."
   }
  ]
 },
 "saga_trader1_2": {
  "offer": [
   {
    "k": "n",
    "text": "Pokój izolacji z zakurzoną szybą. Vane stoi przy oknie z rękami w kieszeniach fartucha i nie odwraca się od razu."
   },
   {
    "k": "t",
    "text": "Pierwsze ofiary Szeptu nie umarły od razu... Część zdążyła wrócić do domów, a ich krew wciąż nosi fragmenty patogenu. Tego nie widać gołym okiem!"
   },
   {
    "k": "p",
    "text": "Zbieram próbki z martwych? Nie z żywych?"
   },
   {
    "k": "t",
    "text": "Z martwych! Żywi zarażeni są niebezpieczni, a ich krew zmienia się przy każdym ruchu. Martwi są spokojniejsi - i tylko tyle da się od nich wziąć."
   },
   {
    "k": "t",
    "text": "Potrzebuję sześciu sztuk tkanki mózgowej zarażonego, czterech skrzepów patogenu Tytana i trzech opatrunków hemostatycznych. Tkanka nie trzyma struktury długo, więc nie zwlekaj!"
   },
   {
    "k": "t",
    "text": "Potem zabij Pustego Kolosa - stoi gdzieś w pobliżu i kręci się wokół zamkniętych bram. Nie daj się zaskoczyć, to nie jest zabawa!"
   },
   {
    "k": "t",
    "text": "I w Silosie Zbożowym w osadzie Ecru zapamiętaj sekwencję próbek. Ktoś ją zapisał przed odejściem. Bez tego nie będę wiedział, co rozkładam, cholera!"
   },
   {
    "k": "p",
    "text": "Zrobię to. Ile mam czasu?"
   },
   {
    "k": "t",
    "text": "Czasu nie dam! Niebezpieczne jest wszystko. Idź ostrożnie, a wrócisz z czymś, co pomoże innym."
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Vane układa próbki w pojemnikach chłodniczych, jedną po drugiej, ostrożnie, jakby każda miała zaraz wybuchnąć."
   },
   {
    "k": "t",
    "text": "Dobrze! Teraz wiem, czym jest ta krew. Fragmenty patogenu nie są chaotyczne - mają wzór! Ktoś je projektował..."
   },
   {
    "k": "p",
    "text": "Kto?"
   },
   {
    "k": "t",
    "text": "Tego jeszcze nie wiem! Ale to zmienia wszystko: Szepta da się przewidzieć, a to znaczy, że da się go zatrzymać. Weź płaster adrenalinowy - potrzebujemy ludzi, nie tylko próbek!"
   }
  ]
 },
 "saga_trader1_3": {
  "offer": [
   {
    "k": "n",
    "text": "Gabinet, w miseczce topi się kawałek lodu. Vane trzyma starą ulotkę z fabryki Helix i wpatruje się w nią bez słowa."
   },
   {
    "k": "t",
    "text": "Na Wedze IV, pod lodem, pracowała stara fabryka syntezy! Produkowała preparaty dla kolonii, zanim przestała odpowiadać..."
   },
   {
    "k": "p",
    "text": "Co tam jest?"
   },
   {
    "k": "t",
    "text": "Według moich notatek część zapasów nadal leży w Reaktorze Syntezy. Tylko że reaktor ma zabezpieczenia, które reagują na każdą obcą ingerencję - a to znaczy, że musisz się włamać!"
   },
   {
    "k": "t",
    "text": "Potrzebuję dwóch sztuk serum nanitów, ośmiu apteczek i dziesięciu szmat. Musisz też mieć Stację Medyczną na poziomie drugim - inaczej nie zrobię z tego szczepionki!"
   },
   {
    "k": "t",
    "text": "Uważaj na Zmutowanego Górnika Kopuły. Jest wolniejszy niż kiedyś, ale nadal robi to, co zawsze: nie odpuszcza!"
   },
   {
    "k": "p",
    "text": "Podłączę przewody i wrócę z tym, co wyniosę."
   },
   {
    "k": "t",
    "text": "Dobrze! I pamiętaj - nie zostawiaj niczego w reaktorze. Każda kropla się liczy, cholera!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Gabinet wypełnia zapach środków odkażających. Vane ogląda fiolki, które przyniosłeś, i odkłada jedną z nich na stół ostrożnie."
   },
   {
    "k": "t",
    "text": "Szczepionka! Nie idealna, ale działa! Pierwsza od miesięcy, która nie została wyprodukowana w panice!"
   },
   {
    "k": "p",
    "text": "Ile osób skorzysta?"
   },
   {
    "k": "t",
    "text": "Tyle, ile będzie trzeba! Każda dawka to czas, który kupujemy dzielnicom, które jeszcze żyją. Weź żel ochronny - nałóż go przed wejściem w zakażone strefy!"
   }
  ]
 },
 "saga_trader1_4": {
  "offer": [
   {
    "k": "n",
    "text": "Vane siedzi przy biurku w półmroku, z zapiętym fartuchem. Nie wstaje, gdy się łączysz. Na ekranie widać schemat, który bardziej przypomina mapę miasta niż chemiczny diagram."
   },
   {
    "k": "t",
    "text": "Nie będę ci mówił o ostatniej dawce jak o lekarstwie. To zakład! Albo zatrzyma Szept w jednym ciele, albo zabije tego, kto ją przyjmie..."
   },
   {
    "k": "p",
    "text": "Kto ma to przyjąć?"
   },
   {
    "k": "t",
    "text": "Ja. Albo ktoś, kto już nie ma nic do stracenia. Nie wybiorę za nikogo, dopóki nie zobaczę, co się naprawdę dzieje!"
   },
   {
    "k": "t",
    "text": "Potrzebuję neuroprocesora, trzech serum nanitów i czterech koncentratów z Tytana. Wszystko musi być świeże, a Myślący Tropiciel, który kręci się przy rdzeniu, musi zniknąć z drogi!"
   },
   {
    "k": "t",
    "text": "Włam się do Rdzenia Termojądrowego Kopuły. Tam jest ostatni fragment układu. Tropiciele nie śpią tam dobrze - bądź czujny!"
   },
   {
    "k": "p",
    "text": "Mogę pomóc przy testach."
   },
   {
    "k": "t",
    "text": "Jeśli się uda, po raz pierwszy od miesięcy w Ereb będzie można zacząć od nowa! Idź, do cholery!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Vane podnosi neuroprocesor pod światło i długo go ogląda, jakby w kawałku krzemu chciał zobaczyć odpowiedź."
   },
   {
    "k": "t",
    "text": "Działa! Koncentrat i serum połączą się bez reakcji. Może po raz pierwszy od pierwszej fali mamy dobry dzień!"
   },
   {
    "k": "p",
    "text": "Czy to już koniec?"
   },
   {
    "k": "t",
    "text": "Nie, to dopiero początek! Ale dziś możemy powiedzieć ludziom, że coś działa. Weź płytę tytanową - przyda się, jeśli zbudujesz coś, co wytrzyma więcej niż apteczka!"
   }
  ]
 },
 "saga_trader2_1": {
  "offer": [
   {
    "k": "n",
    "text": "Posterunek na Tytanie. Stos skrzyń z ręcznie wypisanymi numerami. Karras stoi przy mapie, ramiona założone, i nie odwraca się, gdy się łączysz."
   },
   {
    "k": "t",
    "text": "Sierżant Karras. Dowodzę tym, co z niego zostało! Mój oddział zginął, bo zabrakło amunicji, a nie odwagi. Pamiętaj o tym!"
   },
   {
    "k": "p",
    "text": "Co się stało na Tau Ceti f?"
   },
   {
    "k": "t",
    "text": "Strzelnica tam była ostatnią, która trzymała linię. Jeśli wróci w ręce Szeptu, stracimy kolejną dzielnicę. Cholera, nie ma czym strzelać!"
   },
   {
    "k": "t",
    "text": "Przynieś sześćdziesiąt sztuk amunicji 5.56 NATO, czterdzieści sztuk 9mm i trzy przewody. A potem odczytaj terminal na Lądowisku Ewakuacyjnym Kopuły - chcę wiedzieć, ile zapasów zostało!"
   },
   {
    "choice": [
     {
      "label": "Zrobię to, sierżancie.",
      "text": "Zrobię to, sierżancie."
     },
     {
      "label": "Ile jeszcze zostało zapasów?",
      "text": "Ile jeszcze zostało zapasów?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Wystarczy, żebyś wrócił! Reszta to moja sprawa. Idź!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Karras przegląda skrzynie, sprawdzając każdą etykietę, jakby liczył trupy na liście."
   },
   {
    "k": "t",
    "text": "Zapasy są! Mniej, niż chciałem, ale wystarczy na patrol. Dobra robota, żołnierzu!"
   },
   {
    "k": "p",
    "text": "Na Tau Ceti f nadal źle?"
   },
   {
    "k": "t",
    "text": "Źle! Ale przynajmniej mamy czym strzelać. To różnica między posterunkiem a grobem. Weź 7.62 precyzyjną - nie marnuj jej na byle co!"
   }
  ]
 },
 "saga_trader2_2": {
  "offer": [
   {
    "k": "n",
    "text": "Zbrojownia w szybach Tytana. Metalowe drzwi z wgnieceniami. Karras stoi obok z latarką i patrzy na zamek, jakby go nienawidził."
   },
   {
    "k": "t",
    "text": "Zbrojownia jest zamknięta zamkiem połączonym z centralą straży. Sam zamek jest prosty, ale potrzeba kogoś, kto zna drogę! Kurde, znam kilku, ale wszyscy nie żyją..."
   },
   {
    "k": "p",
    "text": "Co mam przynieść?"
   },
   {
    "k": "t",
    "text": "Osiemdziesiąt sztuk amunicji 5.56 NATO, trzy układy scalone i dwadzieścia sztuk 7.62 precyzyjnej. Układy otworzą wszystko, co zamknięte elektronicznie!"
   },
   {
    "k": "t",
    "text": "Zhakuj zamek w Hali Kruszarek i Sortowni, w szybie helowym. A po drodze zabij Szabrownika Pustkowi - gdyby cię zobaczył, zaciągnie cię do kopalni na zawsze!"
   },
   {
    "k": "p",
    "text": "Obawiam się tego miejsca."
   },
   {
    "k": "t",
    "text": "Bo wracasz, a ci, co nie wracają, nie mają już nic do powiedzenia! Idź, żołnierzu!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Karras otwiera szafę z bronią. Metal jest zimny, a na drzwiach ktoś wydrapał cztery litery, których nie da się odczytać."
   },
   {
    "k": "t",
    "text": "Zbrojownia otwarta! Nie wszystko trafiło w dobre ręce, ale część będzie chroniła ludzi, którzy jeszcze żyją!"
   },
   {
    "k": "p",
    "text": "Kto to wydrapał?"
   },
   {
    "k": "t",
    "text": "Ktoś, kto nie chciał, żeby bronie trafiły do zarażonych. Nie oceniam go, cholera... nie wiem, czy miał rację. Weź amunicję .44 Magnum - na większe cele!"
   }
  ]
 },
 "saga_trader2_3": {
  "offer": [
   {
    "k": "n",
    "text": "Garaż przy posterunku, zawalony częściami. Pośrodku stoi plazmowy karabinek, a Karras ostrożnie przesuwa palcem po rysie na lufie."
   },
   {
    "k": "t",
    "text": "Ten karabinek znalazłem w magazynie! Cewka uszkodzona, a bez niej nie wypali ani razu. Strażnicy twierdzą, że bez tego żaden posterunek nie utrzyma kordonu!"
   },
   {
    "k": "p",
    "text": "Co dokładnie muszę przynieść?"
   },
   {
    "k": "t",
    "text": "Trzydzieści ogniw plazmowych, cztery układy scalone i kolejny karabinek plazmowy Nova-7, żeby mieć z czego wymontować części. Potrzebujesz Warsztatu Craftingu na poziomie drugim!"
   },
   {
    "k": "t",
    "text": "W Piecu Plazmowym w fabryce Helix jest pamięć wieży - odczytaj ją. Po drodze zabij Szabrownika Syndykatu Tytana. Będzie niebezpiecznie, bo ktoś tam jeszcze krąży!"
   },
   {
    "choice": [
     {
      "label": "Zrobię to. Zaufaj mi.",
      "text": "Zrobię to. Zaufaj mi."
     },
     {
      "label": "Czy to naprawdę warte ryzyka?",
      "text": "Czy to naprawdę warte ryzyka?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Ryzyko zawsze jest! Wartość to to, co zostaje po nim, żołnierzu. Idź!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Karras podnosi karabinek i przez chwilę trzyma go oburącz. Cewka pulsuje cicho, jakby już czekała na strzał."
   },
   {
    "k": "t",
    "text": "Działa! Po raz pierwszy od miesięcy coś, co miało zabijać zarażonych, zabija zarażonych! Dobra robota!"
   },
   {
    "k": "p",
    "text": "Będziesz go używał?"
   },
   {
    "k": "t",
    "text": "Nie, zanim zamkniemy drugą zbrojownię! Ten karabin jest za dobry, żeby stać w garażu. Weź karabin szynowy Caelum-X - na gorszy dzień, bo zawsze przychodzi!"
   }
  ]
 },
 "saga_trader2_4": {
  "offer": [
   {
    "k": "n",
    "text": "Pusty korytarz straży. Na ścianie wisi zdjęcie żołnierzy, z części przekreślonych czerwonym pisakiem. Karras stoi pod nim i nie patrzy na ciebie."
   },
   {
    "k": "t",
    "text": "Ostatnia zbrojownia straży została zamknięta przez samych żołnierzy. Nie chcieli, żeby bronie trafiły do zarażonych... i część z nich już nie żyje!"
   },
   {
    "k": "p",
    "text": "Mam zdobyć klucze od zmarłych?"
   },
   {
    "k": "t",
    "text": "Potrzebuję kluczy, bo tylko tak da się otworzyć tę zbrojownię. Wiem, że to brzmi jak grabież - może nią jest! Ale bez broni ci ludzie zginęliby tak samo, a może szybciej..."
   },
   {
    "k": "t",
    "text": "Przynieś czterdzieści sztuk amunicji .44 Magnum, karabinek plazmowy Nova-7 i dwa kryształy ksenonitu. Przecinaj przewody w Hali Pomp na Wedze IV. A po drodze pokonaj Zmutowanego Górnika Kopuły - strzeże zbrojowni jak szczur!"
   },
   {
    "k": "p",
    "text": "Zrobię to. Ale nie zostawię ciał bez pochówku."
   },
   {
    "k": "t",
    "text": "Dobrze! Pochowamy ich przy wejściu. A teraz idź, zanim mi się serce połamie, cholera!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Zbrojownia jest otwarta. Karras stoi w drzwiach i długo patrzy w ciemność, jakby liczył coś, czego nikt już nie policzy."
   },
   {
    "k": "t",
    "text": "Otworzyliśmy... Nie mam słów, które byłyby warte tego, co musiałeś zrobić, żołnierzu."
   },
   {
    "k": "p",
    "text": "Co teraz z tym miejscem?"
   },
   {
    "k": "t",
    "text": "Zamkniemy je na nowo - tylko z ludźmi, którzy wiedzą, po co to robią! A zmarłych pochowamy przy wejściu. Weź ostrze próżni Tytana. Nie jest dla każdego, ale ty jesteś gotowy."
   }
  ]
 },
 "saga_trader3_1": {
  "offer": [
   {
    "k": "n",
    "text": "Złomowisko w kopalni Prometeusz. Stosy zardzewiałych części pod sufit. Borys siedzi na krześle z przewodami i majstruje przy czymś, co kiedyś było radiem."
   },
   {
    "k": "t",
    "text": "Inżynier Borys! Albo po prostu Borys, bo tytuły to dla ludzi z czasem! Szept dotarł do kopalni i nagle nie było już ani jednej części zamiennej!"
   },
   {
    "k": "p",
    "text": "Co się psuje?"
   },
   {
    "k": "t",
    "text": "Wszystko! Pompy, filtry, zamki, lampy! Każda naprawa psuje się za tydzień, bo nikt nie ma czasu, żeby zrobić ją porządnie. Kurczę blade!"
   },
   {
    "k": "t",
    "text": "Przynieś piętnaście sztuk złomu, sześć przewodów i cztery układy scalone. A potem zabij Pustego Pełzacza - kręci się przy żyle ksenonitu i wszystko psuje! Podłącz przewody w Najgłębszym Szybie."
   },
   {
    "choice": [
     {
      "label": "Mogę to zrobić, Borys.",
      "text": "Mogę to zrobić, Borys."
     },
     {
      "label": "To brzmi jak zwykły złom.",
      "text": "To brzmi jak zwykły złom."
     }
    ]
   },
   {
    "k": "t",
    "text": "Zwykły złom?! Z tego da się zbudować posterunek, jeśli ktoś wie jak! Wracaj, jak będziesz mieć!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Borys przeskakuje od stosu do stosu, przeliczając wszystko na palcach i mamrocząc do siebie. Wreszcie odwraca się z szerokim uśmiechem."
   },
   {
    "k": "t",
    "text": "Mam! Mam wszystko! Połowa tych części już działa, a druga to tylko cierpliwość i odrobina tłuszczu!"
   },
   {
    "k": "p",
    "text": "Czy to zatrzyma pyły z kopalni?"
   },
   {
    "k": "t",
    "text": "Nie wszystko, ale filtr zacznie działać! Każdy oddech to wygrana, rozumiesz? Weź cewkę zapłonową - przyda się w każdym silniku, który jeszcze nie oddał ducha!"
   }
  ]
 },
 "saga_trader3_2": {
  "offer": [
   {
    "k": "n",
    "text": "Pomieszczenie wentylacyjne pod szybami. Filtr powietrza wisi nad głową jak dogorywająca lampa. Borys wskazuje na cienką warstwę szarego pyłu na podłodze."
   },
   {
    "k": "t",
    "text": "Filtr przestał działać! Wszystko, co było w zapasach, zostało zarażone pyłem Szeptu. Ludzie to wdychają codziennie i nikt tego nie widzi!"
   },
   {
    "k": "p",
    "text": "Co mam przynieść?"
   },
   {
    "k": "t",
    "text": "Dwa filtry atmosferyczne kopuły, trzy uszczelki komory i pięć układów scalonych! A potem odczytaj terminal w Kriogenicznej Grocie Helu-3 - tam jest schemat, którego nie mam, cholera!"
   },
   {
    "k": "p",
    "text": "Zaraz zajmę się tym."
   },
   {
    "k": "t",
    "text": "Groźny?! Nie wiem, czy zabije, ale nie wiem też, czy nie zmieni tego, kto go wdycha! Działajmy, zanim się dowiemy!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Borys wkłada filtr na miejsce i przykręca go z taką czułością, jakby to było dziecko. Lampa nad głową zaczyna mrugać na zielono."
   },
   {
    "k": "t",
    "text": "Działa! Wiatr idzie w dobrym kierunku! Teraz zobaczymy, czy schemat z grot się zgadza!"
   },
   {
    "k": "p",
    "text": "Czy pył zniknie?"
   },
   {
    "k": "t",
    "text": "Nie od razu, ale nie będzie już przybywać! Weź filtr atmosferyczny kopuły - zamontuj go w swojej bazie, jeśli kiedyś będziesz miał gdzie. Dziękuję, naprawdę!"
   }
  ]
 },
 "saga_trader3_3": {
  "offer": [
   {
    "k": "n",
    "text": "Borys stoi nad stołem, na którym leży kadłub starej sondy z fabryki Helix. Z wnętrza wystaje rdzeń, owinięty kablami i izolacją."
   },
   {
    "k": "t",
    "text": "Ta sonda to skarb! Jej rdzeń zasiliłby cały posterunek przez rok! Nie chcę go sprzedać - chcę go uruchomić, bo wtedy wszyscy wrócą do pracy!"
   },
   {
    "k": "p",
    "text": "Co stoi na przeszkodzie?"
   },
   {
    "k": "t",
    "text": "Zabezpieczenia! Każdy kontakt z obcymi systemami to ryzyko, że wszystko wybuchnie. Kurde, nie chcę być tym, który wysadził sondę razem z sobą!"
   },
   {
    "k": "t",
    "text": "Włam się do Magazynu Helix - tam są przełączniki zasilania. Przynieś mi rdzeń fuzyjny Tytana, dwa wtryskiwacze plazmowe i trzy ogniwa paliwowe. Po drodze zabij Szabrownika Pustkowi - grzebie w fabryce i nie lubi gości!"
   },
   {
    "choice": [
     {
      "label": "Zróbmy to razem.",
      "text": "Zróbmy to razem, Borys."
     },
     {
      "label": "Nie znam się na rdzeniach.",
      "text": "Nie znam się na rdzeniach."
     }
    ]
   },
   {
    "k": "t",
    "text": "I pamiętaj - bez Warsztatu Craftingu na poziomie drugim nawet nie dotkniesz tego rdzenia, cholera!"
   },
   {
    "k": "t",
    "text": "Nie musisz się znać! Musisz tylko przynieść! Resztę zrobię ja - ja zawsze robię resztę!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Rdzeń w sondzie błyszczy, z kabli bije ciepłe światło. Borys wyciera ręce o fartuch i z dumą patrzy na wskaźniki, jakby zbudował wszystko od zera."
   },
   {
    "k": "t",
    "text": "Działa! Pierwszy raz od miesięcy coś zbudowanego przez ludzi daje nam prąd bez wstydu! Zobacz, jak się rozświetla!"
   },
   {
    "k": "p",
    "text": "Co dalej z rdzeniem?"
   },
   {
    "k": "t",
    "text": "Zasili stację przez rok! Może wreszcie zaczniemy myśleć o przyszłości. Weź płytę tytanową - dobra na wszystko, co może się rozpaść!"
   }
  ]
 },
 "saga_trader3_4": {
  "offer": [
   {
    "k": "n",
    "text": "Ogromny plan rozłożony na podłodze, pełen strzałek i skreśleń. Borys klęczy przy nim, ołówek za uchem, wzrok utkwiony w jednym punkcie."
   },
   {
    "k": "t",
    "text": "Ostatnia część planu! Przebudowa całej stacji odzysku w jedno, samowystarczalne centrum! Potrzeba kryształów, rdzeni i wielu, wielu godzin pracy!"
   },
   {
    "k": "p",
    "text": "Co mam przynieść, żeby zacząć?"
   },
   {
    "k": "t",
    "text": "Trzy kryształy ksenonitu, dwa rdzenie fuzyjne Tytana, sześć żelaznych meteorytów i sześć układów scalonych! A do tego odczytaj pamięć w Zdziczałym Ogrodzie Biosfery - tam są wymiary, których potrzebuję!"
   },
   {
    "k": "t",
    "text": "Po drodze zabij Pustego Pluja. Plułby na mój plan, gdyby mógł, a ja go nie mogę stracić!"
   },
   {
    "k": "p",
    "text": "Zacznę od razu."
   },
   {
    "k": "t",
    "text": "Bo jeśli coś pójdzie źle, to zginie cała stacja, a nie jedna osoba! Wolę mieć cierpliwość niż pogrzeb, mój drogi!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Borys stoi wśród świeżo złożonych modułów. Stacja cicho buczy, a na ekranach pojawiają się pierwsze poprawne odczyty."
   },
   {
    "k": "t",
    "text": "Mamy to! Stacja się trzyma, wszystkie moduły odpowiadają! Nie wierzę, że się udało, kurczę blade!"
   },
   {
    "k": "p",
    "text": "Będzie spokojniej?"
   },
   {
    "k": "t",
    "text": "Spokojniej to złe słowo - będzie bezpieczniej! Weź złotą sztabkę kolonialną. Nie za wartość, tylko za pamiątkę pierwszej stacji, która działa po Szepcie!"
   }
  ]
 },
 "saga_trader4_1": {
  "offer": [
   {
    "k": "n",
    "text": "Magazyn dla ocalałych pod kopułą. Regały równo ustawione, na każdej półce kartka z liczbą i datą. Nadia stoi przy stole z listą i patrzy na ciebie znad okularów."
   },
   {
    "k": "t",
    "text": "Nadia. Prowadzę magazyn, bo ktoś musi wiedzieć, co zostało! Ludzie wracają z rajdów z połamanymi kamizelkami, a to kolejne osoby, które nie wrócą na patrol!"
   },
   {
    "k": "p",
    "text": "Czego potrzebujesz?"
   },
   {
    "k": "t",
    "text": "Dwunastu szmat, jednej kamizelki kevlarowej S-2 i ośmiu sztuk złomu! Na pierwszy raz tyle, ale za tydzień będzie tego dwa razy więcej, cholera!"
   },
   {
    "k": "t",
    "text": "Kamizelkę przynieś całą, nie kawałkami! I zaloguj się do terminala na Stacji Kolejki Szynowej w kopule - muszę wiedzieć, kto jeszcze wraca."
   },
   {
    "choice": [
     {
      "label": "Ile czasu mam?",
      "text": "Ile czasu mam?"
     },
     {
      "label": "Ludzie naprawdę tak wracają?",
      "text": "Ludzie naprawdę tak wracają?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Czasu? Tyle, ile trzeba, żeby pół kolonii nie wyszło na patrol w czymś, co pęka! Teraz idź!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Nadia przegląda przyniesione materiały, odkładając każdy kawałek na właściwą półkę. Przy kamizelce zatrzymuje się i obraca ją w dłoniach."
   },
   {
    "k": "t",
    "text": "Dobra robota! Ta kamizelka przeżyje kilka patroli więcej niż poprzednie! Wreszcie coś, co nie pęka w pierwszej minucie!"
   },
   {
    "k": "p",
    "text": "Wiesz, kto ją nosił?"
   },
   {
    "k": "t",
    "text": "Nie i nie pytam! Tutaj nie mówimy o tym, kto zginął, tylko o tym, kto ma co założyć. Weź hełm balistyczny - zanim ktoś inny uzna, że jest mu bardziej potrzebny!"
   }
  ]
 },
 "saga_trader4_2": {
  "offer": [
   {
    "k": "n",
    "text": "Hala z resztkami egzoszkieletów. Połamane ramiona stoją pod ścianami jak wystawa po katastrofie. Nadia kręci się między nimi z miarką i liczy, co się jeszcze nadaje."
   },
   {
    "k": "t",
    "text": "Egzoszkielety były standardem na stacjach! Na Tytanie zostały tylko kawałki. Straż zabiera każdy kawałek metalu, bo łatwiej go sprzedać, niż naprawić, cholera!"
   },
   {
    "k": "p",
    "text": "Co zamierzasz z tym zrobić?"
   },
   {
    "k": "t",
    "text": "Złożyć jedną sprawną zbroję! Potrzebuję dwunastu sztuk złomu, dwóch ogniw paliwowych i głębinowego chwytaka plazmowego. Chwytak znajdziesz w osadzie Ecru - w schronie kolonistów, gdzie przecinasz przewody..."
   },
   {
    "k": "t",
    "text": "A po drodze zabij Pustego Kolosa. Stoi przy wejściu do schronu i nie chce go puścić. Warsztatu Craftingu na poziomie drugim też potrzebuję - bez niego nic nie złożymy!"
   },
   {
    "k": "p",
    "text": "Zrobię to. Zbudujemy coś, co przetrwa."
   },
   {
    "k": "t",
    "text": "Warto, bo to jedyna zbroja, która ma szansę wrócić z tobą! Idź, zanim straż zabierze resztę!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Nadia układa przyniesione części, sprawdzając każdą śrubę i każde złącze. Na końcu kładzie dłoń na pancerzu, jakby sprawdzała temperaturę."
   },
   {
    "k": "t",
    "text": "Zbroja się trzyma! Nie jest piękna, ale będzie chronić skuteczniej niż wszystko, co mieliśmy na patrolach!"
   },
   {
    "k": "p",
    "text": "Kto będzie ją nosił?"
   },
   {
    "k": "t",
    "text": "Ktoś, kto wróci z następnego rajdu i przyjdzie tu po nią! To nie będzie mój wybór - tylko twój. Weź żel ochronny, nałożysz go pod pancerz. Przy długich wyprawach to się przydaje!"
   }
  ]
 },
 "saga_trader4_3": {
  "offer": [
   {
    "k": "n",
    "text": "Wschodni kordon, zimny wiatr wchodzi przez nieszczelne drzwi. Nadia rozkłada na stole puste skrzynie i liczy na palcach. Widać na niej więcej zmęczenia niż zwykle."
   },
   {
    "k": "t",
    "text": "Na wschodnim kordonie ludzie giną nie od zarażenia, tylko od wycieńczenia! Brakuje koncentratu, adrenaliny i bandaży. Zima zabierze resztę, jeśli nic nie zrobimy!"
   },
   {
    "k": "p",
    "text": "Czego dokładnie potrzebujesz?"
   },
   {
    "k": "t",
    "text": "Sześciu koncentratów z Tytana, trzech plastrów adrenalinowych i dziesięciu bandaży! Do tego odczytaj pamięć w Kaplicy Osady w Ecru - tam są dane o trasie na wschód."
   },
   {
    "k": "t",
    "text": "Po drodze zabij Wściekłego Biegacza. Ten gnojek rozrzuca nasze paczki po całej drodze i nie daje ich zebrać! Cholera, nie daj mu się, bo ludzie zginą!"
   },
   {
    "choice": [
     {
      "label": "Wyruszam od razu.",
      "text": "Wyruszam od razu."
     },
     {
      "label": "Naprawdę jest tak źle?",
      "text": "Czy na kordonie naprawdę jest tak źle?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Gorzej, niż piszą w raportach! Idź, a sam to zobaczysz."
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Nadia pakuje skrzynie, układając je według kolejności odjazdu. Przy plastrze adrenalinowym zatrzymuje się i pokazuje go, jakby to był klejnot."
   },
   {
    "k": "t",
    "text": "Dobrze! Teraz kordon dostanie to, co potrzebuje. Nie wszystko, ale to, co uratuje najbliższe dni!"
   },
   {
    "k": "p",
    "text": "Wrócą po więcej?"
   },
   {
    "k": "t",
    "text": "Zawsze wracają! To jedyna rzecz, którą w tym miejscu wszyscy robimy dobrze. Weź serum nanitów - zachowaj je na gorszy dzień. Obiecujesz mi, że nie zmarnujesz?"
   }
  ]
 },
 "saga_trader4_4": {
  "offer": [
   {
    "k": "n",
    "text": "Pracownia pancerzy pod kopułą. Na stole leży kadłub zbroi, wyglądający, jakby od tygodnia nikt nie patrzył na jego stan. Nadia przesuwa palcem po pękniętej osłonie."
   },
   {
    "k": "t",
    "text": "Ten pancerz, który sama wymyśliłam, potrzebuje rdzenia! Plan jest prosty, ale wymaga układu neuronowego, płyty tytanowej i sprawnej osłony!"
   },
   {
    "k": "p",
    "text": "Co dokładnie mam przynieść?"
   },
   {
    "k": "t",
    "text": "Płytę tytanową, trzy żele ochronne, neuroprocesor i dziesięć sztuk złomu. A potem włam się do Reaktora Syntezy na Wedze IV i wyciągnij z niego wszystko, co się da!"
   },
   {
    "k": "t",
    "text": "Każdy element zdobędzie się tylko w walce. Po drodze pokonaj Szabrownika Syndykatu Tytana - rozbierze cię na części, jeśli się zawahasz!"
   },
   {
    "k": "p",
    "text": "Zrobię to. Zbuduj zbroję."
   },
   {
    "k": "t",
    "text": "Ma, jeśli ktoś w nim wróci. Dlatego go robię! Idź, a ja pilnuję reszty."
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Nadia stawia gotowy pancerz na stojaku i obchodzi go dookoła. Nie widać na nim ani plamy, ani rysy. Dopiero wtedy kiwa głową."
   },
   {
    "k": "t",
    "text": "Wygląda dobrze! Pancerz szturmowy Exo-Titan - dwa razy cięższy niż wszystko, co mamy, i dwa razy lepszy w walce!"
   },
   {
    "k": "p",
    "text": "Jest jakiś haczyk?"
   },
   {
    "k": "t",
    "text": "Jest! Waży tyle, że bez treningu ledwie się ruszysz. Ale kto go założy i przeżyje, ten będzie wiedział, za co walczy. Weź go, zanim ktoś inny uzna, że jest mu bardziej potrzebny!"
   }
  ]
 },
 "saga_trader5_1": {
  "offer": [
   {
    "k": "n",
    "text": "Pokój z monitorami, zasłonięte okna. Val siedzi tyłem do drzwi z kapturem na głowie i nie odwraca się od ekranu."
   },
   {
    "k": "t",
    "text": "Nie patrz na mnie! Val, nie pytaj o nazwisko... Przechwytuję sygnały z Neptuna. Przerwały się, zanim zdążyłam je odczytać!"
   },
   {
    "k": "p",
    "text": "Co dokładnie możesz odczytać?"
   },
   {
    "k": "t",
    "text": "Szept nie jest przypadkowy - ktoś za nim stoi, ktoś, kto nadaje! Jeśli złożę rozmowę z tych fragmentów, będę wiedziała, kto. Cholera, muszę to złożyć!"
   },
   {
    "k": "t",
    "text": "Przynieś cztery chipy danych i cztery układy scalone. Potem odczytaj pamięć z rdzenia w Laboratorium Izolacji Biohazard - tam jest ślad. Tylko nie zostawaj zbyt długo!"
   },
   {
    "choice": [
     {
      "label": "Dlaczego mi ufasz?",
      "text": "Dlaczego mi ufasz?"
     },
     {
      "label": "Powiedz więcej o tym sygnale.",
      "text": "Powiedz więcej o tym sygnale."
     }
    ]
   },
   {
    "k": "t",
    "text": "Nie ufam! Sprawdzam. Wracaj, a zobaczę, czy masz to, czego potrzebuję."
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Val wyrywa chipy z rąk i od razu wsuwa je w port. Na monitorze pojawia się zniekształcony ciąg znaków."
   },
   {
    "k": "t",
    "text": "Są! Dobrze! Jeszcze kilka sekund i będę miała pierwszy fragment. Nie mów nic!"
   },
   {
    "k": "p",
    "text": "Co znalazłaś?"
   },
   {
    "k": "t",
    "text": "Słowo. Powtarza się setki razy, psiakrew. Nie powiem, bo nie wiem, czy ktoś tego nie czyta razem ze mną. Weź układ scalony - sprawdzę, czy ktoś patrzy na moją stację!"
   }
  ]
 },
 "saga_trader5_2": {
  "offer": [
   {
    "k": "n",
    "text": "Stare dane z Ziemi, na przenośnych dyskach. Val rozkłada je na podłodze jak karty i szuka tej jednej, która nie pasuje do reszty."
   },
   {
    "k": "t",
    "text": "Dane z Ziemi! Zaszyfrowane kluczem, który znali tylko ludzie z pierwszej fali. Mam kilka kluczy, żaden nie pasuje, kurde!"
   },
   {
    "k": "p",
    "text": "Czego potrzebujesz?"
   },
   {
    "k": "t",
    "text": "Sześciu chipów danych, starożytnego reliktu Ziemi i sześciu przewodów! Relikt może mieć klucz. A potem zaloguj się do terminala w Krypcie Prastarych Minerałów w kopalni!"
   },
   {
    "k": "t",
    "text": "I zabij Szabrownika Pustkowi. Patroluje tunele przy krypcie i zaraz zacznie szukać, kto tam grzebie. Nie daj mu się zobaczyć!"
   },
   {
    "k": "p",
    "text": "Zrobię to. Szybko."
   },
   {
    "k": "t",
    "text": "Zawsze! Dlatego nie zostawiaj śladów. Idź, zanim ktoś zmieni hasło!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Val wkłada relikt do czytnika i patrzy, jak liczby przesuwają się na ekranie. Potem wyłącza monitor z kamienną twarzą."
   },
   {
    "k": "t",
    "text": "Klucz! Część danych się otwiera. Ktoś wiedział o Szepcie przed pierwszą falą! Psiakrew, wiedział!"
   },
   {
    "k": "p",
    "text": "Kto wiedział?"
   },
   {
    "k": "t",
    "text": "Ci, którzy go nie zatrzymali. A może ci, którzy go chcieli. Są tylko daty! Weź kulę artefaktu Wega. Trzymaj ją blisko, bo może być kolejnym kluczem!"
   }
  ]
 },
 "saga_trader5_3": {
  "offer": [
   {
    "k": "n",
    "text": "Pokój z ekranami pokazującymi temperaturę i ciśnienie w szybach. Jedna linia mruga w rytmie, którego nie da się przewidzieć. Val pochyla się nad nią z napiętymi ramionami."
   },
   {
    "k": "t",
    "text": "Sygnały z Neptuna przestały być przypadkowe! Ktoś nadaje z głębi, a nadajnik ukryto w chłodzeniu, żeby nikt go nie znalazł!"
   },
   {
    "k": "p",
    "text": "Gdzie mam go szukać?"
   },
   {
    "k": "t",
    "text": "W Bazie Narzędziowej Górników, w systemie chłodzenia! Włam się tam i zrób to cicho. Przynieś mi osiem chipów danych, trzy platynowe druty i sześć układów scalonych!"
   },
   {
    "k": "t",
    "text": "I zabij Myślącego Tropiciela. On pilnuje nadajnika, a jest sprytniejszy niż połowa ludzi, których znam. Uważaj na niego, bo zapłacisz!"
   },
   {
    "choice": [
     {
      "label": "Kto słucha tego sygnału?",
      "text": "Kto słucha?"
     },
     {
      "label": "Wyruszam od razu.",
      "text": "Wyruszam od razu."
     }
    ]
   },
   {
    "k": "t",
    "text": "I bez Warsztatu Craftingu na poziomie drugim nie dam rady tego zdekodować - sprzęt jest stary, a mój też!"
   },
   {
    "k": "t",
    "text": "Gdybym wiedziała, nie pytałabym cię o to. Idź!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Val wybiera komendy na klawiaturze, zerkając na drzwi za plecami. Na ekranie pojawia się mapa kanałów, a jeden z nich świeci na czerwono."
   },
   {
    "k": "t",
    "text": "Mamy go! Nadajnik w chłodzeniu, zasilany z osobnej linii. To nie był przypadek, kurwa mać!"
   },
   {
    "k": "p",
    "text": "Co teraz?"
   },
   {
    "k": "t",
    "text": "Teraz muszę go wyłączyć, zanim zrobi to ktoś inny. Weź neuroprocesor - potrzebujesz czegoś, co myśli szybciej niż ludzie, jeśli chcesz przetrwać w tym, co idzie!"
   }
  ]
 },
 "saga_trader5_4": {
  "offer": [
   {
    "k": "n",
    "text": "Pudło z metalowymi okuciami, przypięte łańcuchem do stołu. W środku coś cicho szumi. Val patrzy na nie przez szybkę z wyrazem bliskim strachu."
   },
   {
    "k": "t",
    "text": "Czarna skrzynka z przekaźnika na Neptunie! Jedyna rzecz, która przetrwała zniszczenie stacji. W jej pamięci jest wszystko, co Szept zrobił z ludźmi tam!"
   },
   {
    "k": "p",
    "text": "Co potrzebujesz, żeby ją odczytać?"
   },
   {
    "k": "t",
    "text": "Dwóch neuroprocesorów, czterech platynowych drutów, dziesięciu chipów danych i dwóch ogniw paliwowych! Odczyt zajmie dni, a każdy błąd może ją zniszczyć!"
   },
   {
    "k": "t",
    "text": "Odczytaj pamięć na Polu Lodowym na Wedze IV - tam jest drugi nośnik. A po drodze zabij Nosiciela Żrącej Żółci. Jego kwas zniszczy każdy dysk, jeśli się nie pilnujesz!"
   },
   {
    "k": "p",
    "text": "Dlaczego to tak ważne?"
   },
   {
    "k": "t",
    "text": "Bo w środku widziałam słowo. Dom. Powtarza się setki razy. Ktoś tęskni, a ja nie wiem, za czym!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Val otwiera skrzynkę ostrożnie, jak delikatny zamek. Wewnątrz błyska światło, a potem wszystko gaśnie. Przez chwilę nie oddycha."
   },
   {
    "k": "t",
    "text": "Mam pełne dane! Diament w pamięci - to nie jest zwykły nośnik, trzeba go trzymać w jednym kawałku, cholera!"
   },
   {
    "k": "p",
    "text": "Co tam jest?"
   },
   {
    "k": "t",
    "text": "Obrazy. Ludzie na lądowisku, zanim przestali odpowiadać. Ktoś to nagrywał do końca. I jedno zdanie, którego nie rozumiem. Weź diament krystaliczny Tytana - zachowaj go."
   }
  ]
 },
 "saga_trader6_1": {
  "offer": [
   {
    "k": "n",
    "text": "Posterunek na zachodnim wejściu do kopuły. Ciężkie śluzy, za nimi pusty korytarz. Kapitan Sławiński stoi przy oknie z dłońmi za plecami i mówi, nie patrząc na ciebie."
   },
   {
    "k": "t",
    "text": "Kapitan Sławiński. Dowodzę zachodnim kordonem. Każdy patrol wraca z mniejszą liczbą ludzi, żołnierzu, i to nie jest przypadek!"
   },
   {
    "k": "p",
    "text": "Co mam zrobić?"
   },
   {
    "k": "t",
    "text": "Dostarczyć sześćdziesiąt sztuk amunicji 9mm, cztery apteczki i jedną instrukcję serwisową. Potem odczytaj terminal na Lądowisku Ewakuacyjnym Kopuły - muszę wiedzieć, co dzieje się za śluzami!"
   },
   {
    "k": "t",
    "text": "I zabij Szabrownika Pustkowi. Pęta się przy śluzach, a ja nie mogę wysłać na to ludzi. Kurwa, nie mogę!"
   },
   {
    "choice": [
     {
      "label": "Rozkaz, kapitanie.",
      "text": "Rozkaz, kapitanie."
     },
     {
      "label": "Kto wydał ten rozkaz?",
      "text": "Kto wydał ten rozkaz?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Tego nie wiem. I to mnie martwi bardziej niż cokolwiek innego. Wracaj z wieściami!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Sławiński przegląda dostawę z kamiennym wyrazem twarzy. Każdą kartkę kładzie na stole, jakby to była lista poległych."
   },
   {
    "k": "t",
    "text": "Amunicja i leki w porządku. Odczytałeś terminal? Mów!"
   },
   {
    "k": "p",
    "text": "Za śluzami jest gorzej, niż myślimy."
   },
   {
    "k": "t",
    "text": "Wiedziałem! Ale teraz mogę to powiedzieć na odprawie. Dobra robota, żołnierzu. Weź amunicję 5.56 NATO - utrzymaj zachodni kordon!"
   }
  ]
 },
 "saga_trader6_2": {
  "offer": [
   {
    "k": "n",
    "text": "Pusty posterunek w hubie. Krzesła przewrócone, na stole stygnie kubek z herbatą. Sławiński stoi nad mapą i wodzi palcem po czerwonym punkcie, który od dwóch dni nie odpowiada."
   },
   {
    "k": "t",
    "text": "Posterunek w hubie był jednym z najważniejszych punktów straży. Przestał odpowiadać na wezwania. Nie wiem, czy to atak, czy zwykła awaria zasilania!"
   },
   {
    "k": "p",
    "text": "Co mam sprawdzić?"
   },
   {
    "k": "t",
    "text": "Dostarczyć sześćdziesiąt sztuk amunicji 5.56 NATO, dziesięć bandaży i trzy szyny usztywniające. Potem przecinaj przewody w Szpitalu Kwarantanny - tam jest punkt, który musi działać!"
   },
   {
    "k": "t",
    "text": "I zabij Pustego Kolosa. Stoi w szpitalu i nie chce się ruszyć. Trzeba go wyciągnąć, zanim wyjdzie na korytarz, cholera!"
   },
   {
    "k": "p",
    "text": "Zajmę się tym, kapitanie."
   },
   {
    "k": "t",
    "text": "Każdy posterunek może być pułapką! Dlatego wracasz z ludźmi, a nie sam, rozumiesz?"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Sławiński odbiera raport przez radio. Słucha w milczeniu, a potem bardzo powoli odkłada słuchawkę."
   },
   {
    "k": "t",
    "text": "Zasilanie. To była awaria, nie atak. Ludzie przeżyli, choć trzech zginęło w pożarze, zanim dotarliśmy. Kurwa mać..."
   },
   {
    "k": "p",
    "text": "Mogło być gorzej."
   },
   {
    "k": "t",
    "text": "Mogło! Ale każde „mogło” to kolejny pogrzeb, którego nie chcę zapisywać. Dobra robota. Weź hełm balistyczny - załóż go, zanim wrócisz na kordon!"
   }
  ]
 },
 "saga_trader6_3": {
  "offer": [
   {
    "k": "n",
    "text": "Południowy kordon ognia. Ogniska na ziemi, zimne stalowe barierki i pustka za nimi. Sławiński stoi na szczycie wału i obserwuje horyzont przez lornetkę."
   },
   {
    "k": "t",
    "text": "Kordon ognia to ostatnia linia obrony przed pustymi, którzy schodzą z Tau Ceti. Trzymamy go tylko dlatego, że mamy amunicję!"
   },
   {
    "k": "p",
    "text": "Co dokładnie jest do zrobienia?"
   },
   {
    "k": "t",
    "text": "Pięćdziesiąt sztuk amunicji śrutowej 12G, sześć bandaży uciskowych i cztery układy scalone. Włam się do zamka w Domach Kolonistów na Tau Ceti e - tam jest magazyn!"
   },
   {
    "k": "t",
    "text": "Po drodze zabij Zmutowanego Górnika Kopuły. Krąży po osadzie i wszystko, co zobaczy, rozrywa na strzępy! Uważaj!"
   },
   {
    "choice": [
     {
      "label": "Zabezpieczę to, kapitanie.",
      "text": "Zabezpieczę to, kapitanie."
     },
     {
      "label": "Kto chciałby z niej skorzystać?",
      "text": "Kto miałby zrobić z niej użytek?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Ci, którzy są głodni. I ci, którzy wierzą, że w ich rękach będzie bezpieczniej. Nie pozwolę na żadne z tych!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Sławiński stoi przy skrzyni z amunicją. Dotyka wieka, jakby sprawdzał, czy jest chłodne."
   },
   {
    "k": "t",
    "text": "Amunicja zabezpieczona. Teraz nikt jej nie rozdzieli bez mojego podpisu! Dobra robota, żołnierzu!"
   },
   {
    "k": "p",
    "text": "Starczy na długo?"
   },
   {
    "k": "t",
    "text": "Na tydzień. A tydzień dla kordonu to bardzo długo! Weź żel ochronny - nałóż go przed następnym patrolem. Mamy za dużo oparzeń po nocnych pożarach, cholera!"
   }
  ]
 },
 "saga_trader6_4": {
  "offer": [
   {
    "k": "n",
    "text": "Maszynownia kopalni Prometeusz. Ogromne tłoki stoją w ciszy, a na pulpicie wciąż świeci jedna zielona lampka. Sławiński stoi przy niej jak strażnik przy grobie."
   },
   {
    "k": "t",
    "text": "Otrzymałem rozkaz, którego nie wydała żadna centrala. Utrzymać kopułę za wszelką cenę, nawet kosztem reszty Układu!"
   },
   {
    "k": "p",
    "text": "Czyj to rozkaz, kapitanie?"
   },
   {
    "k": "t",
    "text": "Nie wiem! Dlatego chcę, żebyś odczytał dane w Bazie Narzędziowej Górników - może tam jest podpis. Potrzebuję czterdziestu ogniw plazmowych, dwóch serum nanitów i płyty tytanowej!"
   },
   {
    "k": "t",
    "text": "Po drodze zabij Szabrownika Syndykatu Tytana. On jest w to wplątany, założę się, kurwa, na wszystko!"
   },
   {
    "k": "p",
    "text": "Mam to zrobić bez pytań?"
   },
   {
    "k": "t",
    "text": "Nie. Z pytaniami! Ale najpierw przynieś to, co trzeba. Potem zdecydujemy, co dalej!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Sławiński wpatruje się w odczyt. Na ekranie widać nazwę jednostki, której nikt nie zna, i datę sprzed kilku tygodni."
   },
   {
    "k": "t",
    "text": "Podpis. Jednostka, która nie istnieje w żadnym rejestrze! Ktoś wydaje rozkazy z miejsca, którego nie ma!"
   },
   {
    "k": "p",
    "text": "Co teraz zrobimy?"
   },
   {
    "k": "t",
    "text": "Zapisujemy wszystko i pokazujemy ludziom. Rozkaz bez nadawcy nie będzie już rozkazem! Dobra robota, żołnierzu. Weź karabin szynowy Caelum-X - może się przydać, jeśli ktoś z tego podpisu zechce przyjechać po wyjaśnienia."
   }
  ]
 },
 "saga_trader7_1": {
  "offer": [
   {
    "k": "n",
    "text": "Laboratorium geologiczne przy wejściu do kopalni. Próbki skał w słoikach, a na stole rozrzucone mapki. Thorne ogląda jedną pod lampą i mamrocze coś pod nosem."
   },
   {
    "k": "t",
    "text": "Thorne. Geolog głębinowy. Ach... bo skały pamiętają! Warstwy nie kłamią, tylko czekają, aż ktoś je przeczyta!"
   },
   {
    "k": "p",
    "text": "Czego potrzebujesz do badań?"
   },
   {
    "k": "t",
    "text": "Sześciu sztuk czystej rudy tytana z najgłębszych warstw, dwóch kryształów ksenonitu i czterech przewodów. Przewody podłącz w Hali Kruszarek i Sortowni - tam jest stary system pomiarowy!"
   },
   {
    "k": "t",
    "text": "Po drodze zabij Pustego Pełzacza. Wpełza w każdą szczelinę i zaburza moje pomiary. Ostrożnie, bo wlezie ci w kark, kurde!"
   },
   {
    "choice": [
     {
      "label": "Co mają te warstwy?",
      "text": "Co dokładnie mają te warstwy?"
     },
     {
      "label": "Zajmę się tym, profesorze.",
      "text": "Zajmę się tym, profesorze."
     }
    ]
   },
   {
    "k": "t",
    "text": "Każda inna! Jedna z nich ma w sobie coś, co się rozrasta. Przynieś próbki, a opowiem ci więcej. Ciekawość to moja jedyna słabość!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Thorne obraca próbki w palcach i co chwilę coś zapisuje na marginesie notatnika. Jego twarz rozjaśnia się, gdy trafia na jedną z warstw."
   },
   {
    "k": "t",
    "text": "Są piękne! I niepokojące... Ta warstwa pulsuje, kiedy ją dotykasz. Jak serce, które jeszcze nie wie, że jest chore!"
   },
   {
    "k": "p",
    "text": "Co to znaczy?"
   },
   {
    "k": "t",
    "text": "Że Szept ma w skałach swoje korzenie. A korzenie zawsze da się prześledzić, jeśli ma się dość cierpliwości! Weź izotop hel-3 - zimny, ale potrzebny!"
   }
  ]
 },
 "saga_trader7_2": {
  "offer": [
   {
    "k": "n",
    "text": "Pomieszczenie pełne mapek i notatek, przyklejonych nawet do sufitu. Thorne kręci się w kółko w pognieceniu płaszczu, szukając czegoś na biurku."
   },
   {
    "k": "t",
    "text": "Szyb helowy w jaskini zamknął się po ataku! Hel jest jedynym środkiem, który utrzyma stacje przy życiu. Musisz przejść przez niego i wrócić z próbkami!"
   },
   {
    "k": "p",
    "text": "Co mam przynieść z jaskini?"
   },
   {
    "k": "t",
    "text": "Pięć izotopów hel-3 kriogenicznych, jeden diament krystaliczny tytana i cztery przewody. Odczytaj terminal w Kriogenicznej Grocie Helu-3 - musi tam być zapis o zawaleniu!"
   },
   {
    "k": "t",
    "text": "Po drodze zabij Wściekłego Biegacza. Rzuca się na wszystko, co się rusza, a w jaskini to nie jest mądre, rozumiesz?"
   },
   {
    "k": "p",
    "text": "Co się stało z tym szybem?"
   },
   {
    "k": "t",
    "text": "Nie wiem! Ale skały w tym miejscu przestały się komunikować z resztą kopalni. To najgorszy znak, jaki może być w geologii, cholera!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Thorne rozkłada pojemniki z izotopem na stole. Wskaźniki drgają, a potem stabilizują się, jakby ktoś po drugiej stronie przestał walczyć."
   },
   {
    "k": "t",
    "text": "Hel jest! I jeszcze jedno: zapis mówi, że szyb nie zawalił się sam. Ktoś go zamknął od wewnątrz!"
   },
   {
    "k": "p",
    "text": "Kto mógł to zrobić?"
   },
   {
    "k": "t",
    "text": "Ten, kto wiedział, co kryje się w głębi! Mam domysły, ale nie wypowiem ich, zanim je sprawdzę. Weź sztabkę złota kolonialnego - ludzie wciąż wierzą w złoto, a ja muszę ich trzymać przy badaniach!"
   }
  ]
 },
 "saga_trader7_3": {
  "offer": [
   {
    "k": "n",
    "text": "Hala montażowa w ruinach fabryki Helix. Pośrodku stoi podwozie komory ciśnień, osłonięte plandekami. Thorne dotyka jej metalu jak lekarz pacjenta."
   },
   {
    "k": "t",
    "text": "Komora na Jowiszu została zaprojektowana, żeby wytrzymać wszystko! Ale ktoś zmienił jej nastawy, a bez ich przywrócenia nie uruchomię żadnego badania głębinowego!"
   },
   {
    "k": "p",
    "text": "Czyli ktoś celowo tu grzebał?"
   },
   {
    "k": "t",
    "text": "Podejrzewam, że tak! Ktoś nie chciał, żebyśmy schodzili zbyt głęboko. A to znaczy, że ktoś wie, co tam jest, kurczę blade!"
   },
   {
    "k": "t",
    "text": "Przynieś osiem meteorytów żelaznych, cztery uszczelki komory i trzy ogniwa paliwowe. Włam się do zasilania w Hali Montażowej - tam jest przełącznik. Po drodze zabij Myślącego Tropiciela. Sprytny jest, więc uważaj!"
   },
   {
    "choice": [
     {
      "label": "Dlaczego ktoś by to zrobił?",
      "text": "Dlaczego ktoś by to zrobił?"
     },
     {
      "label": "Zrobię to, profesorze.",
      "text": "Zrobię to, profesorze."
     }
    ]
   },
   {
    "k": "t",
    "text": "A na koniec - bez Warsztatu Craftingu na poziomie drugim nie ruszysz tej komory. Zrób to najpierw, kurczę!"
   },
   {
    "k": "t",
    "text": "Strach przed prawdą to najsilniejszy motyw, jaki znam! Idź, zanim ten strach się rozmnoży!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Komora ciśnień cicho się uruchamia. Thorne stoi przed nią z ręką na szkle, patrząc, jak wskaźniki wracają do normy."
   },
   {
    "k": "t",
    "text": "Przywrócone! Nastawy odpowiadają moim obliczeniom. Ktoś je zmienił, żeby nikt nie zszedł tam, gdzie chcę zejść!"
   },
   {
    "k": "p",
    "text": "Możemy teraz zejść?"
   },
   {
    "k": "t",
    "text": "Możemy! Ale nie sami. Potrzebuję ludzi, którzy wiedzą, co robią. Weź diament krystaliczny tytana - zachowaj go. Kiedyś może być ważniejszy niż dzisiejsze pytania!"
   }
  ]
 },
 "saga_trader7_4": {
  "offer": [
   {
    "k": "n",
    "text": "Pokój z dużym oknem na lodową pustkę Wegi IV. Thorne stoi przy szybie i patrzy na odległą pompownię, której światła migoczą jak gwiazdy w mgle."
   },
   {
    "k": "t",
    "text": "Pompy na Wedze IV przez lata utrzymywały głębinową stację w ruchu! Pracują na ksenonicie i tytanie. Bez nich każda próba wejścia w lód kończy się śmiercią!"
   },
   {
    "k": "p",
    "text": "Co mam przynieść?"
   },
   {
    "k": "t",
    "text": "Trzy diamenty krystaliczne tytana, cztery kryształy ksenonitu, rdzeń fuzyjny i serum nanitów. A potem przecinaj przewody w Hali Pomp na Wedze IV!"
   },
   {
    "k": "t",
    "text": "Po drodze zabij Szabrownika Syndykatu Tytana. Chce tę pompownię dla siebie i nie przebiera w środkach, cholera!"
   },
   {
    "k": "p",
    "text": "Zapłacisz mi za ryzyko?"
   },
   {
    "k": "t",
    "text": "Zapłacę tyle, ile mam, ale to nie jest najważniejsze! Najważniejsze, żeby ktoś tam wszedł i zobaczył, co dzieje się w lodzie!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Pompy na Wedze IV ożywają. Z daleka dźwięk brzmi jak głębokie westchnienie, które wraca po latach ciszy. Thorne liczy oddechy, jakby to było badanie."
   },
   {
    "k": "t",
    "text": "Działają! Stacja znów oddycha! Nie wiem jeszcze, czy to dobrze, ale wiem, że coś ruszyło!"
   },
   {
    "k": "p",
    "text": "Co zobaczymy pod lodem?"
   },
   {
    "k": "t",
    "text": "Coś, czego się nie spodziewałem! I coś, czego wolałbym nigdy nie widzieć. Najlepsze badania zawsze mają obie te cechy. Weź perłę księżycową - nie dla pieniędzy, tylko dla pamięci!"
   }
  ]
 },
 "saga_trader8_1": {
  "offer": [
   {
    "k": "n",
    "text": "Zaplecze archiwum, pełne przewróconych skrzyń i starych półek. Jax stoi pośrodku, opierając się o stos pudeł, jakby był ich właścicielem."
   },
   {
    "k": "t",
    "text": "Jax! Szabrownik sektora. Zanim zaczniesz mnie oceniać, wiedz, że mam kodeks: nie zabieram tego, co ktoś kochał! Reszta jest na sprzedaż, cholera!"
   },
   {
    "k": "p",
    "text": "Co tu zostało do zabrania?"
   },
   {
    "k": "t",
    "text": "Przedmioty, które uznano za bezwartościowe. Dla nas to skarb, którego nie przeliczysz na kredyty! Przynieś mi dwa relikty Ziemi, dwa kieszonkowe zegarki z Ziemi i dziesięć sztuk złomu."
   },
   {
    "k": "t",
    "text": "Odczytaj pamięć w Regałach z Danymi w archiwum - jest tam mapa, której nikt nie zauważył. A po drodze zabij Pustego Pluja. Plunie ci kwasem w twarz, jeśli się zagapisz!"
   },
   {
    "choice": [
     {
      "label": "Ile zapłacisz?",
      "text": "Ile zapłacisz?"
     },
     {
      "label": "Mam swój kodeks.",
      "text": "Mam swój kodeks, Jax."
     }
    ]
   },
   {
    "k": "t",
    "text": "Kodeks to dobra rzecz! Ale kredyty lepsze. Idź, zanim ktoś inny zrobi to pierwszy!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Jax przeciera zegarek rękawem, uważnie go oglądając, jakby czytał napis wygrawerowany na spodzie. Potem uśmiecha się krzywo i odkłada go na stół."
   },
   {
    "k": "t",
    "text": "Zegarek z Ziemi! Ktoś go musiał lubić, skoro został tutaj zamiast w kieszeni. Nie sprzedam go, nie dzisiaj, cholera jasna!"
   },
   {
    "k": "p",
    "text": "Dlaczego go nie sprzedasz?"
   },
   {
    "k": "t",
    "text": "Bo ktoś, kto go tu zostawił, pewnie też był szabrownikiem. A szabrownicy szanują tych, co przed nimi wynieśli coś wartościowego! Weź szmaragd xenonowy - zapłacisz mi kiedyś, jak zbogacisz się w archiwum!"
   }
  ]
 },
 "saga_trader8_2": {
  "offer": [
   {
    "k": "n",
    "text": "Stół zawalony mapami i kartkami z odręcznymi notatkami. Jax przesuwa palcem po zdartym szkicu i mruczy coś pod nosem. Na krześle leży stara, zakurzona kurtka."
   },
   {
    "k": "t",
    "text": "Mam mapę sztabu szabrowników! Większość oznaczeń zdarta, ale wiem, że prowadzi do ostatniego skarbca. Bez trasy każdy wyjazd to strata czasu i zdrowia!"
   },
   {
    "k": "p",
    "text": "Czego brakuje na mapie?"
   },
   {
    "k": "t",
    "text": "Kamiennej tablicy Ziemi, hologramu rodzinnego z Ziemi i kuli artefaktu Wega! Każdy z nich ma coś do powiedzenia, a ja nie chcę domyślać się resztą. Przynieś mi wszystkie trzy!"
   },
   {
    "k": "t",
    "text": "Odczytaj terminal w Sali Katalogowej - tam są dane o tym, co zostało wywiezione. I zabij Szabrownika Pustkowi, zanim cię obróci w ruinach. Cholera, sporo tu takich!"
   },
   {
    "k": "p",
    "text": "Zajmę się tym."
   },
   {
    "k": "t",
    "text": "Czyja to już nie ma znaczenia! Ale kiedyś może mieć, więc niech tu leży."
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Jax rozkłada przyniesione przedmioty na mapie, dopasowując każdy do wyrysowanego punktu. Na jego twarzy pojawia się skupienie."
   },
   {
    "k": "t",
    "text": "Są! Trasa! Ostatni skarbiec jest pod halą A, za drzwiami, które sam kiedyś zamknąłem. Ironia losu, kurczę blade!"
   },
   {
    "k": "p",
    "text": "Kiedy tam pójdziemy?"
   },
   {
    "k": "t",
    "text": "Kiedy będziesz gotowy! Przygotuję sprzęt. Ale uważaj - w tych korytarzach nikt nie chodzi sam. Weź amunicję .44 Magnum. Na pierwszy raz będzie ci potrzebna bardziej niż cokolwiek innego!"
   }
  ]
 },
 "saga_trader8_3": {
  "offer": [
   {
    "k": "n",
    "text": "Sejfy ocalałych z kopalni poukładane pod ścianą. Każdy ma inny zamek, zrobiony z przypadkowych części. Jax przesuwa dłonią po jednym z nich i kręci głową z niesmakiem."
   },
   {
    "k": "t",
    "text": "Ocaleni zbudowali własne sejfy, ale ich zamki są zbyt prymitywne! Otwierają się od pierwszego uderzenia. Ja chcę zrobić taki, który wytrzyma, cholera!"
   },
   {
    "k": "p",
    "text": "Co dokładnie mam przynieść?"
   },
   {
    "k": "t",
    "text": "Dwa wtryskiwacze plazmowe, dwie cewki zapłonowe i piętnaście sztuk złomu. Do tego potrzebujesz Warsztatu Craftingu na poziomie drugim - bez niego nic tu nie zadziała!"
   },
   {
    "k": "t",
    "text": "Zhakuj chwyt w Najgłębszym Szybie, w żyle xenonitu. A po drodze zabij Zmutowanego Górnika Kopuły - krąży po szybach i psuje wszystko, co się da!"
   },
   {
    "choice": [
     {
      "label": "Ten zamek jest bezpieczny?",
      "text": "Ten zamek jest bezpieczny?"
     },
     {
      "label": "Zróbmy to dobrze.",
      "text": "Zróbmy to dobrze, Jax."
     }
    ]
   },
   {
    "k": "t",
    "text": "Bezpieczny to słowo dla ludzi, którzy nie wiedzą, co robią! Ja wiem. Przynieś mi tylko sprzęt!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Jax przykłada oko do świeżo złożonego chwytu i sprawdza każdą sprężynę pod światło. Zamek kliknął raz, płynnie, bez zgrzytu."
   },
   {
    "k": "t",
    "text": "Działa! Wytrzyma uderzenie, wytrzyma próbę, a przy odrobinie szczęścia wytrzyma nawet mnie, kurwa!"
   },
   {
    "k": "p",
    "text": "Co jest w środku?"
   },
   {
    "k": "t",
    "text": "Na razie nic. Ale to nie jest puste - to obietnica, że następny skarb nie zginie w czyjejś szufladzie! Weź złoty kielich kolonistów. Pamiątka po ludziach, którzy wierzyli, że wszystko da się naprawić."
   }
  ]
 },
 "saga_trader8_4": {
  "offer": [
   {
    "k": "n",
    "text": "Korytarz za stalowymi drzwiami archiwum. Na ścianach wiszą resztki plakatów, a na podłodze leżą ślady butów, które nie prowadzą w żadną stronę. Jax stoi przed wrotami i nie uśmiecha się, co zdarza mu się rzadko."
   },
   {
    "k": "t",
    "text": "Za tymi drzwiami leży sala skarbców. To, po co tu przyszedłem! I to, czego nie przyniosły mi wszystkie poprzednie wyprawy, cholera..."
   },
   {
    "k": "p",
    "text": "Co mam przynieść, zanim tam wejdziemy?"
   },
   {
    "k": "t",
    "text": "Złoty kielich, dwie kule artefaktu Wega, neuroprocesor i trzydzieści ogniw plazmowych! Przecinaj przewody w Grodziach Archiwum - obwód biegnie przez salę skarbców."
   },
   {
    "k": "t",
    "text": "Matka Archiwum strzeże wnętrza. Musisz ją pokonać! Nie wiem, co jeszcze tam zostało, i nie chcę się dowiedzieć, kurde!"
   },
   {
    "k": "p",
    "text": "Pójdę z tobą, Jax."
   },
   {
    "k": "t",
    "text": "To zostaniemy tu na zawsze, jak wielu przed nami! Ale wierzę, że wrócimy. Jesteś mi to winien, partnerze!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Jax wychodzi z sali skarbców z pustymi rękami i długo patrzy w pustą przestrzeń za sobą. Matka Archiwum leży nieruchomo, a ciszę przerywa tylko metaliczny szum."
   },
   {
    "k": "t",
    "text": "Żyjemy. Ona nie. Skarbiec był pusty, ale zostawił nam coś ważniejszego... Kurwa mać, naprawdę ważniejszego."
   },
   {
    "k": "p",
    "text": "Co zostawił?"
   },
   {
    "k": "t",
    "text": "Pytanie: dlaczego ludzie z Ziemi zostawiali tu swoje rzeczy? I dlaczego nikt z nich nie wrócił po nie? Weź ostrze próżni Tytana - zachowaj je jako pamiątkę. Partnerstwo to coś więcej niż kredyty, nawet dla takiego jak ja!"
   }
  ]
 },
 "q0_supplies": {
  "offer": [
   {
    "k": "n",
    "text": "Połączenie wideo z kliniką w kopule Nowego Ereb. Na ścianie wisi zdjęcie szpitala sprzed czasów Szeptu. Vane, w zakrwawionym fartuchu, klnie cicho nad jakimś pudełkiem bez wieka."
   },
   {
    "k": "t",
    "text": "Cholera, znowu ten zamek... Jestem doktor Jana Vane. Prowadziłam tu szpital, zanim się wszystko posypało."
   },
   {
    "k": "p",
    "text": "Mówią, że potrzebujesz pomocy. Co się dzieje?"
   },
   {
    "k": "t",
    "text": "Dzieje się to, że nie mam czym opatrywać ludzi! Szept zaczyna krwawić, a krew nie chce przestać."
   },
   {
    "k": "t",
    "text": "Stacja medyczna jest za słaba. Ulepsz ją do poziomu pierwszego w swoim schronie. Bez tego nie zrobię nawet porządnego opatrunku."
   },
   {
    "k": "p",
    "text": "Ulepszyć? Sam?"
   },
   {
    "k": "t",
    "text": "Tak, sam! Ja nie mam czasu na majsterkowanie. A potem przynieś mi dwie szmaty i jeden złom, z tego zrobię pierwsze bandaże."
   },
   {
    "choice": [
     {
      "label": "Zajmę się tym, doktorze.",
      "text": "Zajmę się tym, doktorze.",
      "lines": [
       { "k": "t", "text": "Dobrze. Wracaj, jak będziesz miał." }
      ]
     },
     {
      "label": "Czy to naprawdę jest pilne?",
      "text": "Czy to naprawdę jest pilne?",
      "lines": [
       { "k": "t", "text": "Pilne? Wszystko jest pilne... ale zacznij od tego, co dziś zrobisz. Wracaj, jak będziesz miał." }
      ]
     }
    ]
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Vane przegląda szmaty i złom, po czym na stacji medycznej zapala się zielona lampka. Lekarz odetchnął z ulgą."
   },
   {
    "k": "t",
    "text": "No proszę! Stacja działa - nie piękna, ale działa! To różnica między umieraniem a czekaniem."
   },
   {
    "k": "p",
    "text": "Co teraz?"
   },
   {
    "k": "t",
    "text": "Opatrunki dla pierwszej linii. Weź bandaż - i nie oddawaj go, dopóki nie zobaczysz, kto go naprawdę potrzebuje!"
   }
  ]
 },
 "q0_defense": {
  "offer": [
   {
    "k": "n",
    "text": "Strzelnica w podziemiach posterunku. Huk wystrzałów odbija się od betonu. Karras stoi z tyłu, z tarczą na ramieniu, i ocenia każdy strzał."
   },
   {
    "k": "t",
    "text": "Sierżant Karras. Dowodzę tym, co z niego zostało. Tu nie ma miejsca na pytania o to, czy wystarczy!"
   },
   {
    "k": "p",
    "text": "Słyszałam, że przy kopule robi się coraz gorzej."
   },
   {
    "k": "t",
    "text": "Gorzej?! Gorzej to jest wtedy, gdy Pusty Szwendacz stoi pod bramą i pyta o ciebie. Tacy jeszcze pamiętają swoją ulicę. To najgorsze."
   },
   {
    "k": "t",
    "text": "Masz zabić jednego Pustego Szwendacza, dziesięć sztuk amunicji 9mm i przynieść przewód. Ten przewód trzyma alarm przy bramie - bez niego oślepniemy!"
   },
   {
    "k": "p",
    "text": "Zrobię to, sierżancie."
   },
   {
    "k": "t",
    "text": "Bo jest najwolniejszy, więc łatwo go wyczaić! Żołnierz uczy się od najprostszych celów. Nie zawiedź mnie!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Karras ogląda amunicję, potem przykłada przewód do lampy i sprawdza izolację."
   },
   {
    "k": "t",
    "text": "Dobra robota, żołnierzu! Szwendacz nie wróci pod naszą bramę. Na tym posterunku to już coś!"
   },
   {
    "k": "p",
    "text": "To koniec?"
   },
   {
    "k": "t",
    "text": "Koniec? Ha! Następny patrol już na ciebie czeka. Weź nóż bojowy Tanto. Zrób z nim lepszy użytek niż ja, bo ja już za stary na takie gierki!"
   }
  ]
 },
 "q1_titan_tissue": {
  "offer": [
   {
    "k": "n",
    "text": "Laboratorium izolacji, zapieczętowane szybą. Probówki w rzędach, część pełna ciemnej cieczy. Vane stoi przy terminalu i nie odwraca się, gdy się łączysz."
   },
   {
    "k": "t",
    "text": "Zamknij drzwi! Nie chcę, żeby cokolwiek z zewnątrz tu wpadło... Doktor Vane. Chciałbym powiedzieć, że laboratorium jest bezpieczne, ale nie będę cię okłamywał."
   },
   {
    "k": "p",
    "text": "Co się dzieje z próbkami?"
   },
   {
    "k": "t",
    "text": "Patogen przenosi się między gatunkami! To nie jest wirus, który zostaje w jednym ciele. Muszę wiedzieć, jak działa, zanim zdecyduję, co z nim zrobić."
   },
   {
    "k": "t",
    "text": "Potrzebuję dwóch sztuk tkanki mózgowej zarażonego. Ostrożnie - to nie jest coś, co chcesz trzymać w dłoni dłużej, niż musisz!"
   },
   {
    "k": "t",
    "text": "Potem odczytaj terminal w Laboratorium Izolacji Biohazard. Klucz dostępu pojawi się w logu. Bez tego nie zrozumiesz, dlaczego to ważne."
   },
   {
    "choice": [
     {
      "label": "Zajmę się tym, doktorze.",
      "text": "Zajmę się tym, doktorze."
     },
     {
      "label": "Czy to nie jest zbyt niebezpieczne?",
      "text": "Czy to nie jest zbyt niebezpieczne?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Wszystko jest niebezpieczne - różni się tylko tym, czy ktoś o tym wie. Idź ostrożnie, cholera jasna!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Vane przesuwa probówki na stole i ogląda tkankę przez lupę. Jego oddech przyspiesza."
   },
   {
    "k": "t",
    "text": "Ma wzór! Szept nie jest chaotyczny - on jest zaprojektowany! Ktoś go stworzył i wiedział, co robi."
   },
   {
    "k": "p",
    "text": "Czyli da się go zatrzymać?"
   },
   {
    "k": "t",
    "text": "Da się go zrozumieć, a to już połowa drogi. Weź adrenal-X - przyda się, zanim wrócisz do świata, który na ciebie nie czeka!"
   }
  ]
 },
 "q1_titan_firepower": {
  "offer": [
   {
    "k": "n",
    "text": "Magazyn amunicji pod posterunkiem. Skrzynie ustawione w równych rzędach. Karras przeciąga palcem po liście i klnie pod nosem."
   },
   {
    "k": "t",
    "text": "Sierżant Karras. Mamy amunicję, ale za mało, do cholery! Każdy patrol wraca z mniejszą liczbą nabojów, niż wyszedł."
   },
   {
    "k": "p",
    "text": "Co się stało z zapasami?"
   },
   {
    "k": "t",
    "text": "Część zabrali ludzie, którzy się bali. Część zjadła wilgoć. A część wypalił Wściekły Biegacz, zanim udało nam się go zatrzymać!"
   },
   {
    "k": "t",
    "text": "Przynieś piętnaście sztuk amunicji śrutowej 12G. I zabij Wściekłego Biegacza - nie odpuści, dopóki nie zginie któryś z nas!"
   },
   {
    "k": "p",
    "text": "Biegacz to mój problem, sierżancie."
   },
   {
    "k": "t",
    "text": "Bo my mamy ludzi do obrony! A ty masz szansę przeżyć, tak jak on. Idź już!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Karras liczy skrzynie z amunicją, jedna po drugiej, i kiwa głową po każdej."
   },
   {
    "k": "t",
    "text": "Piętnaście sztuk, zgadza się! Biegacz już nie będzie wyć pod bramą. Jedna noc spokoju więcej - to dużo, żołnierzu!"
   },
   {
    "k": "p",
    "text": "Będzie trudniej?"
   },
   {
    "k": "t",
    "text": "Zawsze! Weź kamizelkę kevlarową. Noś ją, bo jest twoja, a nie dlatego, że ktoś ci kazał!"
   }
  ]
 },
 "q1_titan_filter": {
  "offer": [
   {
    "k": "n",
    "text": "Tunel wentylacyjny pod kopułą. Kratka szczęka przy każdym podmuchu. Borys stoi na drabinie i szarpie za przewód, mrucząc pod nosem."
   },
   {
    "k": "t",
    "text": "Inżynier Borys! Witaj w tunelu, gdzie nic nie działa, a wszystko może zadziałać, jeśli się postarasz!"
   },
   {
    "k": "p",
    "text": "Podobno filtry sektora C przestały działać."
   },
   {
    "k": "t",
    "text": "Przestały, bo ktoś je zostawił bez napięcia! Kurczę blade, przecież każdy filtr miał swoje przewody - a teraz nikt nie pamięta, gdzie co jest!"
   },
   {
    "k": "t",
    "text": "Przynieś mi filtr atmosferyczny kopuły. Ten filtr to serce całej wentylacji. A potem podłącz przewody w Tunelu Wentylacyjnym, do właściwych gniazd!"
   },
   {
    "k": "p",
    "text": "A jak się pomylę?"
   },
   {
    "k": "t",
    "text": "To filtr się przepali, a dym pójdzie na korytarz! Ale spokojnie - mam zapasowy. Chyba..."
   },
   {
    "choice": [
     {
      "label": "Zrobię to, Borys.",
      "text": "Zrobię to, Borys."
     },
     {
      "label": "Zapasowy? Naprawdę?",
      "text": "Zapasowy? Naprawdę?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Naprawdę! No, prawie... Idź, zanim zmienię zdanie!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Borys wkłada filtr do kratki i przekręca pokrętłem. Wentylator zaczyna szumieć, a lampa mruga na zielono."
   },
   {
    "k": "t",
    "text": "Działa! Powietrze idzie w dobrą stronę! Mówiłem, że się uda - trzeba tylko ludzi, którzy się nie boją przewodów!"
   },
   {
    "k": "p",
    "text": "Co dalej z sektorem C?"
   },
   {
    "k": "t",
    "text": "Dalej będzie lepiej! Weź kryształ ksenonitu - pamiątka z wentylacji. Nigdy nie wiadomo, co się przyda!"
   }
  ]
 },
 "q1_titan_core": {
  "offer": [
   {
    "k": "n",
    "text": "Warsztat craftingu w kopule. Narzędzia i części leżą wszędzie. Nadia stoi przy stole z listą i liczy coś na palcach, wyraźnie zirytowana."
   },
   {
    "k": "t",
    "text": "Kwatermistrz Nadia. Prowadzę magazyn i liczę wszystko, co wraca z rajdów. Ostatnio liczę tylko to, czego brakuje - a brakuje dużo!"
   },
   {
    "k": "p",
    "text": "Czego brakuje?"
   },
   {
    "k": "t",
    "text": "Rdzenia fuzyjnego Tytana! Jednego, ale dobrego. Bez niego warsztat nie zrobi nic, co wytrzyma dłużej niż tydzień."
   },
   {
    "k": "t",
    "text": "Ulepsz Warsztat Craftingu do poziomu drugiego - bez tego nie wpuszczę cię do pracy nad rdzeniem. Potem przynieś mi rdzeń."
   },
   {
    "k": "p",
    "text": "Ile to potrwa?"
   },
   {
    "k": "t",
    "text": "Tyle, ile trzeba! Im szybciej, tym mniej ludzi zginie w międzyczasie. Ile masz czasu? Mniej, niż myślisz!"
   },
   {
    "k": "p",
    "text": "Zaraz się tym zajmę."
   },
   {
    "k": "t",
    "text": "To znajdę kogoś innego, ale wolę, żebyś to był ty. Idź, do cholery!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Nadia obraca rdzeń w dłoniach i sprawdza każdy zacisk. Warsztat za jej plecami cicho buczy, jakby się budził."
   },
   {
    "k": "t",
    "text": "Dobry rdzeń! Wreszcie coś, co można do czegoś podłączyć. Mało kto to rozumie, a to jest początek wszystkiego!"
   },
   {
    "k": "p",
    "text": "Zbudujecie z tego coś większego?"
   },
   {
    "k": "t",
    "text": "Zbudujemy! Pancerz szturmowy Exo-Titan - jeśli wytrzymamy tydzień bez kolejnej awarii. Weź go, jak będzie gotowy!"
   }
  ]
 },
 "q1_val_quantum": {
  "offer": [
   {
    "k": "n",
    "text": "Pokój z monitorami i zasłoniętymi oknami. Val siedzi w kącie, z kapturem na głowie, palce stukają w klawiaturę. Nie odrywa wzroku od ekranu."
   },
   {
    "k": "t",
    "text": "Val. Nie pytaj o nazwisko! Przechwytuję sygnały, a te, które mam teraz, są gorsze niż wszystkie wcześniej."
   },
   {
    "k": "p",
    "text": "Co dokładnie przechwytujesz?"
   },
   {
    "k": "t",
    "text": "Szyfr. Kwantowy, z rdzenia, który ktoś ukrył w Sali Katalogowej archiwum. Jeśli go odczytam, dowiem się, kto nadaje sygnał od tygodnia!"
   },
   {
    "k": "t",
    "text": "Przynieś kwantowy rdzeń szyfrujący. Potem odczytaj terminal w Sali Katalogowej - klucz będzie w logu. Nie przegap go, psiakrew!"
   },
   {
    "k": "p",
    "text": "Dlaczego ja?"
   },
   {
    "k": "t",
    "text": "Bo nie mam tu nikogo, komu mogę zaufać. A ty jeszcze nie zdążyłeś mnie zdradzić... Chyba."
   },
   {
    "choice": [
     {
      "label": "Mogę to zrobić.",
      "text": "Mogę to zrobić."
     },
     {
      "label": "Mówisz to każdemu?",
      "text": "Mówisz to każdemu?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Nie. Dlatego mówię to tobie. Idź, zanim ktoś zacznie mnie szukać!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Val wkłada rdzeń do portu. Na ekranie zaczyna się przewijać ciąg znaków. Jej palce na chwilę zamierają."
   },
   {
    "k": "t",
    "text": "Mam! Część szyfru się otwiera... Ktoś nadaje z Sali Katalogowej. Nie wiem, czy to przeszłość, czy teraźniejszość - i to mnie przeraża!"
   },
   {
    "k": "p",
    "text": "Co to znaczy?"
   },
   {
    "k": "t",
    "text": "Że nie jesteśmy sami w tej sieci. Weź kulę artefaktu Wega. Może ci pomoże, jeśli ktoś zacznie szukać, kto tu był."
   }
  ]
 },
 "q1_thorne_ore": {
  "offer": [
   {
    "k": "n",
    "text": "Laboratorium geologiczne przy wejściu do kopalni. Próbki skał w słoikach, a Thorne ogląda jedną pod lampą, mamrocząc coś z ekscytacją."
   },
   {
    "k": "t",
    "text": "Thorne. Geolog głębinowy... ach, fascynujące! Od lat badam skały Tytana, bo one pamiętają rzeczy, których my nie pamiętamy."
   },
   {
    "k": "p",
    "text": "Co takiego pamiętają te skały?"
   },
   {
    "k": "t",
    "text": "Warstwy reagują na obecność czegoś, co je obserwuje! Nie wiem jeszcze co - ale to na pewno nie jest przypadek, mój drogi!"
   },
   {
    "k": "t",
    "text": "Potrzebuję dwóch sztuk czystej rudy tytana i jednego izotopu hel-3 kriogenicznego. A do tego zhakuj zamek w Śluzie Wydobywczej Prometeusz - tam sonda pokaże złoże."
   },
   {
    "k": "p",
    "text": "Zamek to nie problem. A co, jeśli coś tam jest?"
   },
   {
    "k": "t",
    "text": "Wtedy będę wiedział, że miałem rację! Czyż to nie jest ekscytujące? Choć... trochę przerażające, przyznaję."
   },
   {
    "k": "p",
    "text": "Dobrze, profesorze."
   },
   {
    "k": "t",
    "text": "Mówię o czymś ciekawym - a to zwykle jest najstraszniejsze. Idź, zanim skała zmieni zdanie!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Thorne układa próbki w rzędzie. Jedna z nich lekko się mieni, jakby reagowała na jego oddech. Profesor zamarł."
   },
   {
    "k": "t",
    "text": "Są! Ruda, która pamięta! Warstwa po warstwie wiem już, gdzie szukać, i to jest odpowiedź... prawie!"
   },
   {
    "k": "p",
    "text": "Co teraz?"
   },
   {
    "k": "t",
    "text": "Teraz musimy zrozumieć, dlaczego skała czeka na nas, zamiast nas zignorować. Weź kryształ ksenonitu - na drogę w ciemność. Ostrożnie, proszę!"
   }
  ]
 },
 "q1_jax_relic": {
  "offer": [
   {
    "k": "n",
    "text": "Zaplecze archiwum. Jax siedzi na stercie skrzyń, z cygarem w zębach, i pokazuje ci kawałek mapy z wydartym rogiem. Uśmiecha się krzywo."
   },
   {
    "k": "t",
    "text": "Jax. Szturmowiec sektora. Mam kodeks, młody: nie zabieram tego, co ktoś kochał. Reszta to towar na sprzedaż!"
   },
   {
    "k": "p",
    "text": "Co masz na myśli?"
   },
   {
    "k": "t",
    "text": "Relikty Ziemi! Ludzie je tu zostawili przed ucieczką, a potem nikt nie wrócił. Jeden z nich chcę mieć, zanim zrobi to ktoś inny."
   },
   {
    "k": "t",
    "text": "Pokonaj Zmutowanego Górnika Kopuły - on pilnuje tego przedmiotu jak pies kości. Potem przynieś mi starożytny relikt Ziemi. Zapłacę dobrze, cholera jasna!"
   },
   {
    "k": "p",
    "text": "A jeśli zginę?"
   },
   {
    "k": "t",
    "text": "To zostaniesz tu na zawsze - jak wielu przed tobą! Ale nie zginiesz, bo widzę, że masz oczy otwarte."
   },
   {
    "choice": [
     {
      "label": "Ile zapłacisz?",
      "text": "Ile zapłacisz?"
     },
     {
      "label": "Mam swój kodeks.",
      "text": "Mam swój kodeks, Jax."
     }
    ]
   },
   {
    "k": "t",
    "text": "Kodeks? Dobry! Ale kredyty lepsze - idź, zanim ktoś inny się zgłosi!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Jax przewraca relikt w dłoni. Oglądając go, cicho gwiżdże, jakby to był stary przyjaciel."
   },
   {
    "k": "t",
    "text": "Ładny, cholera jasna! Ktoś go musiał kochać - ma ślady dotyku. Zapłacę ci, a potem zrobimy kolejną wyprawę!"
   },
   {
    "k": "p",
    "text": "Co ci to daje?"
   },
   {
    "k": "t",
    "text": "Wspomnienie, że nie wszystko, co zostawili ludzie, jest na sprzedaż. Weź sztabkę złota kolonialnego - taką samą, jaką mam w sejfie!"
   }
  ]
 },
 "mt_trader1_terminal": {
  "offer": [
   {
    "k": "n",
    "text": "Laboratorium izolacji, znowu. Vane siedzi przy biurku nad papierami z zakrwawionymi rogami. Podnosi wzrok dopiero, gdy stawiasz krok bliżej."
   },
   {
    "k": "t",
    "text": "Doktor Vane. Wracaj, bo mam pytanie, na które chyba tylko ty możesz odpowiedzieć... albo nikt."
   },
   {
    "k": "p",
    "text": "Jakie pytanie?"
   },
   {
    "k": "t",
    "text": "Szczep ZETA-7. Jest odporny na standardowe antybiotyki! Nie wiem, jak to możliwe, ale nie możemy go zignorować."
   },
   {
    "k": "t",
    "text": "Odczytaj terminal w Laboratorium Izolacji Biohazard. Klucz dostępu pojawi się w logu. I przynieś jedną sztukę tkanki mózgowej zarażonego - tylko jedną, bo więcej nie wytrzymam na stole!"
   },
   {
    "k": "p",
    "text": "Czy to coś zmieni?"
   },
   {
    "k": "t",
    "text": "Może wszystko. Albo nic! Ale bez danych nie wiem, czy to nowy wariant, czy stara odpowiedź na stary problem."
   },
   {
    "k": "p",
    "text": "Zrobię to, doktorze."
   },
   {
    "k": "t",
    "text": "Nie jestem pewna niczego! Ale wiem, że nic się nie zmieni, jeśli nikt nie spojrzy. Idź!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Vane czyta wyniki z terminala, przesuwając palcem po wierszach. Nagle zatrzymuje się i odsuwa od ekranu, jakby się oparzył."
   },
   {
    "k": "t",
    "text": "ZETA-7 nie jest nowy! Ktoś go już kiedyś sekwencjonował... To znaczy, że ktoś o nim wiedział wcześniej."
   },
   {
    "k": "p",
    "text": "Kto?"
   },
   {
    "k": "t",
    "text": "Nie wiem, ale dane są stare. Zbyt stare, żeby były przypadkiem. Weź apteczkę - potrzebujesz jej bardziej, niż myślisz!"
   }
  ]
 },
 "mt_trader2_terminal": {
  "offer": [
   {
    "k": "n",
    "text": "Aleja Handlowa pod kopułą. Puste witryny i zerwane szyldy. Karras stoi przy skrytce w ścianie i patrzy na zamek, który ktoś już raz rozbił."
   },
   {
    "k": "t",
    "text": "Żołnierzu! W Alei Handlowej jest skrytka z bronią. Zamek zepsuty, ktoś zdążył przed nami!"
   },
   {
    "k": "p",
    "text": "Co tam jest?"
   },
   {
    "k": "t",
    "text": "Strzelby. Stare, ale działające - nie pozwolę, żeby trafiły w czyjeś ręce! Zhakuj zamek, zatrzymując wskaźnik w zielonym polu."
   },
   {
    "k": "t",
    "text": "I przynieś dziesięć sztuk amunicji śrutowej 12G. Strzelby bez naboi to kij do miotły, rozumiesz?"
   },
   {
    "choice": [
     {
      "label": "Zrobię to, sierżancie.",
      "text": "Zrobię to, sierżancie."
     },
     {
      "label": "Dlaczego zamek był zepsuty?",
      "text": "Dlaczego zamek był zepsuty?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Bo ktoś nie chciał, żeby bronie tu były. Zgadnij, kto! Idź, zanim wróci!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Karras otwiera skrzynkę i sprawdza każdą kolbę dłonią. Na jego twarzy nie widać zadowolenia - tylko czujność."
   },
   {
    "k": "t",
    "text": "Dziennik magazynu potwierdza, że strzelby są na miejscu. Dobra robota! Nie będziemy musieli się martwić, że ktoś je ukradnie."
   },
   {
    "k": "p",
    "text": "Kto je chciał ukraść?"
   },
   {
    "k": "t",
    "text": "Ci, którzy się boją. Strach zawsze znajduje sobie drzwi! Weź dziesięć sztuk amunicji 9mm - przyda się bardziej niż strzelba w rękach kogoś, kto nie wie, jak jej użyć."
   }
  ]
 },
 "mt_trader3_terminal": {
  "offer": [
   {
    "k": "n",
    "text": "Tunel wentylacyjny pod kopułą. Z sufitu zwisają przewody, jeden iskrzy co kilka sekund. Borys na drabinie wskazuje palcem w górę, podekscytowany jak dziecko."
   },
   {
    "k": "t",
    "text": "Borys! Wentylacja sektora C to moja największa zagadka! Ktoś przestawił zasilanie i teraz nikt nie wie, co gdzie idzie!"
   },
   {
    "k": "p",
    "text": "Czyli trzeba to naprawić?"
   },
   {
    "k": "t",
    "text": "Trzeba podłączyć przewody w Tunelu Wentylacyjnym do właściwych gniazd. Odczytaj terminal przy wejściu - jest tam schemat! A potem przynieś ogniwo paliwowe, bo bez niego wentylator stanie!"
   },
   {
    "k": "p",
    "text": "Ogniwo? Zwykły akumulator nie wystarczy?"
   },
   {
    "k": "t",
    "text": "Akumulator to zabawka! Ogniwo to prawdziwa siła - tylko uważaj, bo lubi wybuchać, jak je źle potrzymasz!"
   },
   {
    "k": "p",
    "text": "Zajmę się tym, Borys."
   },
   {
    "k": "t",
    "text": "To dowiemy się, czy wentylacja ma zapas! Ha! Żartuję... prawie. Idź, zanim się rozmyślę!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Wentylator rusza z cichym szumem. Borys przykłada dłoń do kratki, czując podmuch, i aż podskakuje z radości."
   },
   {
    "k": "t",
    "text": "Działa! Schemat się zgadza, przewody na swoim miejscu! Filtr wreszcie przestanie się dusić!"
   },
   {
    "k": "p",
    "text": "Co teraz?"
   },
   {
    "k": "t",
    "text": "Teraz będę pilnował, żeby nic nie wybuchło! Weź przewody - zawsze czegoś brakuje, zanim się zorientujesz!"
   }
  ]
 },
 "mt_trader4_terminal": {
  "offer": [
   {
    "k": "n",
    "text": "Sektor mieszkalny Hab-4. Puste korytarze, drzwi z zamalowanymi numerami. Nadia przytrzymuje jedne drzwi nogą i z niezadowoleniem patrzy na ciebie."
   },
   {
    "k": "t",
    "text": "Nadia. Pamiętasz, jak mówiłam, że każdy schron ma kod przydziału? Ten jest w pamięci strażnika - a strażnik już nie odpowie!"
   },
   {
    "k": "p",
    "text": "Co mam zrobić?"
   },
   {
    "k": "t",
    "text": "Zapamiętać i odtworzyć sekwencję z panelu w Sektorze Mieszkalnym Hab-4. A potem przynieś mi kamizelkę kevlarową S-2, bo ktoś z tego sektora bardzo jej potrzebuje!"
   },
   {
    "k": "p",
    "text": "Czyli muszę zapamiętać ciąg i go powtórzyć?"
   },
   {
    "k": "t",
    "text": "Tak! Nie tłumacz mi, jak to działa - ja liczę kamizelki, a nie sygnały!"
   },
   {
    "choice": [
     {
      "label": "Dobrze, zrobię to.",
      "text": "Dobrze, zrobię to."
     },
     {
      "label": "Dlaczego to takie ważne?",
      "text": "Dlaczego to takie ważne?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Bo bez kodu schron się nie otworzy, a bez schronu ludzie śpią na korytarzu! Wracaj, nie zwlekaj!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Nadia odbiera kamizelkę i przerzuca ją przez ramię. Na chwilę zatrzymuje się przy drzwiach, jakby nasłuchiwała."
   },
   {
    "k": "t",
    "text": "Schron się otworzył! Teraz ktoś będzie miał gdzie spać, zamiast liczyć, ile wytrzyma na zimnie. Wreszcie coś dobrego!"
   },
   {
    "k": "p",
    "text": "Kto tam będzie spał?"
   },
   {
    "k": "t",
    "text": "Ci, którzy wrócili z rajdu. Ale nie zawsze ci, którzy powinni! Weź hełm balistyczny - przyda ci się bardziej niż komukolwiek."
   }
  ]
 },
 "mt_trader5_terminal": {
  "offer": [
   {
    "k": "n",
    "text": "Stacja Kolejki Szynowej pod kopułą. Pociąg stoi bez ruchu, a na peronie leżą porzucone walizki. Val siedzi na ławce i wpatruje się w tory, jakby ktoś miał się zaraz pojawić."
   },
   {
    "k": "t",
    "text": "Nie patrz na mnie! Patrz na tory... Ktoś przełączył zwrotnicę ręcznie. Ktoś tu był, i nie chciał, żeby to wiedziano!"
   },
   {
    "k": "p",
    "text": "Kto mógł to zrobić?"
   },
   {
    "k": "t",
    "text": "Nie wiem, cholera. Dlatego masz odczytać terminal na Stacji Kolejki Szynowej. Klucz dostępu jest w logu. A potem przynieś dwa chipy danych."
   },
   {
    "k": "p",
    "text": "Po co ci chipy?"
   },
   {
    "k": "t",
    "text": "Bo ktoś mógł na nich zostawić ślad! Przy okazji - nie zaglądaj do walizek. Nie wiem, co w nich jest, i nie chcę, żebyś wiedział!"
   },
   {
    "k": "p",
    "text": "Zrobię to, Val."
   },
   {
    "k": "t",
    "text": "Nie wiem i nie chcę wiedzieć! Idź, zanim ktoś zmieni zwrotnicę z powrotem!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Val wkłada chipy do portu i wpatruje się w ekran z nazwami stacji. Jej palce zamierają."
   },
   {
    "k": "t",
    "text": "Mam ślad! Zwrotnica była przełączona przez kogoś, kto znał kody. To nie był zwykły włamywacz - psiakrew, to ktoś z nas!"
   },
   {
    "k": "p",
    "text": "Co to znaczy?"
   },
   {
    "k": "t",
    "text": "Że ktoś ma dostęp do systemu. Weź układ scalony - będzie potrzebny, jeśli chcesz sprawdzić, kto to był. Ostrożnie, bo to nie jest zabawka!"
   }
  ]
 },
 "mt_trader6_terminal": {
  "offer": [
   {
    "k": "n",
    "text": "Laboratorium badawcze na Wedze-7. Zimne i ciche, lampy świecą słabo. Na ścianach wiszą mapy sektorów. Sławiński stoi przy jednej z nich i nie odwraca się."
   },
   {
    "k": "t",
    "text": "Żołnierzu. Dowództwo odblokowało sektor - w laboratorium są dane do ewakuacji. Masz je odczytać."
   },
   {
    "k": "p",
    "text": "Co dokładnie mam zrobić?"
   },
   {
    "k": "t",
    "text": "Zhakować zamek laboratorium badawczego, zatrzymując wskaźnik w zielonym polu. Potem przynieś mi dwa układy scalone. Bez nich ewakuacja się nie uruchomi."
   },
   {
    "k": "p",
    "text": "Czy dowództwo wie, że tu jestem?"
   },
   {
    "k": "t",
    "text": "Nie wiem. Dlatego działaj szybko i nie zostawiaj śladów. Kurwa, nie lubię takich zleceń."
   },
   {
    "choice": [
     {
      "label": "Rozkaz, kapitanie.",
      "text": "Rozkaz, kapitanie."
     },
     {
      "label": "Kto wydał ten rozkaz?",
      "text": "Kto wydał ten rozkaz?"
     }
    ]
   },
   {
    "k": "t",
    "text": "Tego nie wiem. Ale rozkaz jest rozkazem. Idź!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Sławiński przegląda dane w milczeniu. Palce zaciskają się na krawędzi stołu, aż zbielały."
   },
   {
    "k": "t",
    "text": "Dane są. Ewakuacja może ruszyć. Dobra robota, żołnierzu. Trzymaj się blisko kordonu!"
   },
   {
    "k": "p",
    "text": "Kto to odblokował?"
   },
   {
    "k": "t",
    "text": "Rozkaz bez nadawcy - dlatego nie mówię o tym głośno. Weź apteczkę. Przyda się, zanim wrócisz na kordon."
   }
  ]
 },
 "mt_trader7_terminal": {
  "offer": [
   {
    "k": "n",
    "text": "Najgłębszy Szyb w kopalni Prometeusz, przy żyle xenonitu. Ściany migoczą słabym światłem, a na ziemi leżą resztki sondy. Thorne klęczy przy nich i zbiera fragmenty do pudełka."
   },
   {
    "k": "t",
    "text": "Profesor Thorne! Ach, to ty! Świetnie, mam dla ciebie zadanie, które wymaga cierpliwości i odrobiny odwagi!"
   },
   {
    "k": "p",
    "text": "Jakie zadanie?"
   },
   {
    "k": "t",
    "text": "Sonda wskazuje żyłę czterdzieści metrów pod poziomem głównym. Podłącz jej przewody w Najgłębszym Szybie - wtedy dane zaczną płynąć!"
   },
   {
    "k": "t",
    "text": "I przynieś mi dwie sztuki czystej rudy tytana. Ta ruda pamięta więcej niż ludzie, a ja chcę wiedzieć, co!"
   },
   {
    "k": "p",
    "text": "Podłączę przewody, profesorze."
   },
   {
    "k": "t",
    "text": "Że nie jest pusta! Ktoś ją kiedyś oznaczył, zanim ktokolwiek tu zszedł. Idź, zanim sonda zapomni, gdzie jest!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Thorne wpatruje się w dane z sondy. Jego twarz rozjaśnia się, a potem na chwilę zasnuwa cieniem."
   },
   {
    "k": "t",
    "text": "Żyła jest prawdziwa! I ktoś ją oznaczył - nie wiem jeszcze po co, ale to nie jest przypadek!"
   },
   {
    "k": "p",
    "text": "Co teraz?"
   },
   {
    "k": "t",
    "text": "Teraz musimy zdecydować, czy chcemy wiedzieć, co jest na dole. Weź izotop hel-3 - przyda się, jeśli zdecydujemy się zejść. Ostrożnie, to zimne!"
   }
  ]
 },
 "mt_trader8_terminal": {
  "offer": [
   {
    "k": "n",
    "text": "Zaplecze archiwum, pełne skrzyń i kurzu. Jax siedzi na skrzyni i gasi cygaro o obcas buta. Uśmiecha się krzywo, gdy cię widzi."
   },
   {
    "k": "t",
    "text": "Szturmowiec Jax! Mam dla ciebie interes, ale najpierw wysłuchaj - bo to nie jest zabawa!"
   },
   {
    "k": "p",
    "text": "Czyli muszę ją zabić?"
   },
   {
    "k": "t",
    "text": "Musisz pokonać Matkę Archiwum! Strzeże zapisu skarbca, a w nim jest relikt Ziemi - przynieś mi go, a zapłacę za każdy krok!"
   },
   {
    "k": "p",
    "text": "Nie boisz się jej?"
   },
   {
    "k": "t",
    "text": "Boję się jak cholera! Ale szabrownik, który się boi, zawsze zostaje na zewnątrz. Ja wolę wchodzić!"
   },
   {
    "choice": [
     {
      "label": "Ile zapłacisz?",
      "text": "Ile zapłacisz?"
     },
     {
      "label": "Mam swój kodeks.",
      "text": "Mam swój kodeks, Jax."
     }
    ]
   },
   {
    "k": "t",
    "text": "Dobry kodeks, ale kredyty są lepsze! Idź, zanim zmienię zdanie!"
   }
  ],
  "done": [
   {
    "k": "n",
    "text": "Jax obraca relikt w palcach, po czym wkłada go do pudełka wyłożonego aksamitem. Na jego twarzy pojawia się coś na kształt ulgi."
   },
   {
    "k": "t",
    "text": "Matka Archiwum nie żyje! Skarbiec otwarty! Dobrze się spisałeś, partnerze!"
   },
   {
    "k": "p",
    "text": "Będzie spokojniej?"
   },
   {
    "k": "t",
    "text": "Spokojniej, ale nie spokojnie. Weź sztabkę złota kolonialnego - to za odwagę, nie za relikt. Odwaga w tych korytarzach jest rzadsza niż złoto!"
   }
  ]
 }
};

const TRADER_IDLE = {
 "trader1": [
  "Nie mam teraz czasu na puste gadki. Pacjenci czekają za grodzią, a krew nie schnie na zawołanie.",
  "Jeśli coś ci dolega, mów od razu, do cholery. Szept zaczyna się od niewinnej gorączki, a potem już tylko trup.",
  "Szukasz kogoś innego? Tu nie ma bohaterów. Wszyscy mądrale leżą dwa metry pod skażonym żwirem Kopuły.",
  "Słyszałem, że chłodnia na Tau Ceti kryje gorsze rzeczy niż zwykłe szczepy. Ktoś to tam schował celowo... Cholerny świat."
 ],
 "trader2": [
  "Meldunek: bez zmian! Idź na rajd, nie stój mi tu jak ślepy kloc w zbrojowni!",
  "Żołnierz nie pieprzy głupot przy radiu. Zrób swoje, oczyść sektor i wracaj w jednym kawałku, psiakrew.",
  "Moi ludzie zaryglowali zbrojownię od środka, żeby te zmutowane ścierwa nie dorwały karabinów. I tam zginęli. Szanuj tę broń.",
  "Dopóki ja tu stoję, ta kolonia ma czym strzelać. Jak skończą się naboje, będziemy gryźć zębami."
 ],
 "trader3": [
  "Jasny gwint, mam pięć projektów naraz i wszystkie szlag trafia! Przewody palą się w rękach!",
  "Nowy filtr kopalniany działa tylko wtedy, gdy ktoś go przetestuje w pyle. Chcesz sprawdzić, czy nie wyplujesz płuc?",
  "Ktoś kurwa celowo przestawił czujniki w Prometeuszu, żeby nie wyły na pył z Kopuły! Mówię ci, to nie był wypadek!",
  "Części, więcej części! Złom to jedyne, co trzyma tę stację w kupie, zanim rozpadnie się na atomy!"
 ],
 "trader4": [
  "Pusto w magazynie, psiakrew. Przynieś pancerze, zanim zacznę wydawać ludziom koce zamiast kevlaru.",
  "Nie dotykaj niczego bez pytania. Każda uszkodzona płyta to czyjeś połamane żebra. Ile masz dla mnie płyt?",
  "Straż rozkrada egzoszkielety na czysty metal, durnie jedne! Zanim się obejrzą, nie będzie w czym wyjść po zapasy.",
  "Wracasz cały? Cud. A teraz zrzuć ten sprzęt do ewidencji, nie mam całego dnia na pogawędki."
 ],
 "trader5": [
  "Nie przeszkadzaj... szlag by to trafił, sygnał z Neptuna znowu zanika!",
  "Wiem, że stoisz za moimi plecami. Przestań się gapić w monitor, bo odetnę ci zasilanie w kajucie.",
  "Przechwyciłam transmisję z Ziemi... w kółko to samo słowo: 'dom'. Oni wiedzą, że Szept przyszedł od środka. Ktoś nas sprzedał.",
  "Czuję, jak coś bada moje węzły sieciowe. To nie boty... to coś uczy się moich kluczy. Kurwa, muszę przepiąć obwody."
 ],
 "trader6": [
  "Kordon zachodni trzyma. Na razie... kurwa mać, tylko na razie. Znowu straciłem dwóch chłopaków na patrolu.",
  "Rozkaz to rozkaz, żołnierzu. Nie pytaj, od kogo przyszedł przydział na Kopułę, po prostu zabezpiecz perymetr.",
  "Ten przeklęty rozkaz 'utrzymać za wszelką cenę' nie ma podpisu dowództwa. Ktoś wewnątrz sztabu gra naszym życiem.",
  "Brakuje nam wszystkiego: amunicji, ludzi, opatrunków. Przynieś cokolwiek do obrony kordonu."
 ],
 "trader7": [
  "Próbki z Prometeusza czekają, ale nie mogę zebrać myśli... Te skały dosłownie drżą, gdy ktoś na nie patrzy!",
  "Ciekawe, czy Szept to biologia, czy raczej geologiczna infekcja minerałów... Fascynujące i cholernie przerażające.",
  "Szyb helowy zalano z premedytacją, mój drogi. Ktoś wolał utopić sprzęt za miliony kredytów, byle nikt nie dokopał się do jądra.",
  "Nie stój tak, przynieś mi czystą rudę Tytana! Warstwy pamiętają wszystko, muszę tylko rozłupać te kłamstwa."
 ],
 "trader8": [
  "Mam dla ciebie gruby interes, przyjacielu. Ale najpierw pokaż kredyty, u Jaxa nie ma nic na gębę.",
  "Zasada jest prosta: nie tykam tego, co ktoś kochał, ale reszta trupiego złomu z ruin jest moja. I twoja, jak zapłacisz.",
  "W starym archiwum leżą skarby Starej Ziemi, o jakich ci się nie śniło. Tyle że pilnuje ich Matka, a ona nie lubi gości, kurwa mać.",
  "Widziałem szabrowników, którzy poszli za głęboko i zostali tam na zawsze jako mięso dla zmutowanych. Nie bądź chciwy, bierz ile udźwigniesz."
 ]
};
