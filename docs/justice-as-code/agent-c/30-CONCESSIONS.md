# AGENT C — 30-CONCESSIONS (tor II, konsensusowy)

Tor I jest zamknięty. Ten plik go **nie edytuje** — księguje, co musiałbym oddać, żeby mój model dał się scalić z modelami zbudowanymi na dwóch innych soczewkach:

- **Soczewka R** — systemy rozproszone, konsensus, protokoły uzgadniania stanu między nieufnymi węzłami.
- **Soczewka T** — systemy typów, kompilatory, weryfikacja formalna, dowody własności programu.

Każde ustępstwo jest zapisem księgowym o pełnym schemacie z §5 protokołu. **Jednostką kosztu jest `caseload-kwartał`** — ta sama, w której mierzę zapas ukrytego błędu `E` (`RES-C-04`). Wybór nie jest kosmetyczny: pozwala porównać dryf konsensusowy z separatrysą `E_crit = 0.6975` i przez to uczynić próg utraty sensu **wielkością policzalną, a nie deklarowaną**.

---

## `CON-C-01`

```
CON-C-01
  etap:            S2
  ustępuję:        model czasu ciągłego / kroku o wymiarze fizycznym (kwartał).
                   Przechodzę na model zdarzeniowo-komunikatowy soczewki R, w którym
                   "opóźnienie" jest liczbą rund, nie czasem.
  na rzecz:        wspólny interfejs zdarzeń S0..S8; bez niego soczewka R nie może
                   wyrazić żadnego twierdzenia o mojej dynamice.
  mechanizm:       tau_a i tau_L są remapowane z kwartałów na rundy protokołu;
                   g_crit(tau) liczone na rundach.
  koszt_natychmiastowy: 0.020 caseload-kw
  kumulacja:       liniowa, a = 0.020/kw (dryf kalibracji rund do czasu fizycznego)
  wykrywalność:    SLI-C-05 (margines opóźnienia) przestaje mieć jednostkę fizyczną;
                   próg: rozjazd między medianą czasu rundy a 1 kwartałem > 30%
  odwracalność:    pełna; koszt cofnięcia = rekalibracja tau, ~2 kw pracy
  warunek_odwołania: mediana czasu rundy przestaje mieścić się w [0.7, 1.4] kwartału
                     przez 3 kolejne kwartały
  alternatywa:     brak wspólnej osi czasu => twierdzenie o marginesie opóźnienia
                   (NN-C-08) jest nieprzetłumaczalne, czyli praktycznie nieistniejące
                   w fazie scalania. To droższe niż sam dryf kalibracji.
```

---

## `CON-C-02`

```
CON-C-02
  etap:            S5
  ustępuję:        tezę, że commit NIE kończy błędu. W moim modelu S5 jest jedynym
                   przejściem inkrementującym E i zapas trwa po commicie.
                   Przyjmuję abstrakcję finality soczewki R.
  na rzecz:        dowody safety i liveness soczewki R wymagają punktu finalności;
                   bez niego nie ma czego dowodzić.
  mechanizm:       E znika ze wspólnego interfejsu; pozostaje jako zmienna wewnętrzna
                   mojego modelu, niewidoczna w scalonej ontologii.
  koszt_natychmiastowy: 0.060 caseload-kw
  kumulacja:       wykładnicza, okres podwojenia h = 24 kw
                   (im dłużej E jest niewidoczne, tym mniej narzędzi je adresuje)
  wykrywalność:    rozjazd między liczbą spraw "zamkniętych" a SLI-C-01
                   (stopa ujawnień własnych); próg: SLI-C-01 < 0.15
  odwracalność:    częściowa; koszt cofnięcia rośnie z E, bo trzeba wstecznie
                   odtworzyć zapas, którego nikt nie liczył
  warunek_odwołania: SLI-C-03 (luka kalibracyjna) > 0.05 przez 2 kolejne kwartały
  alternatywa:     odmowa oznacza brak wspólnego pojęcia zakończenia sprawy,
                   czyli brak S5 w scalonej ontologii. Bez S5 nie ma S6 ani S7.
```

**Uwaga księgowa:** to jest najgroźniejsze z ustępstw kumulacyjnych, bo dotyczy zmiennej, która w moim modelu jest **integratorem**. Ukrycie integratora we wspólnym interfejsie nie zatrzymuje całkowania; zatrzymuje odczyt.

---

## `CON-C-03`

```
CON-C-03
  etap:            S2
  ustępuję:        indywidualną identyfikowalność best response. W moim modelu
                   m(O) jest funkcją wypłaty POJEDYNCZEGO aktora (RES-C-02).
                   Przyjmuję agregację kworum / BFT soczewki R.
  na rzecz:        soczewka R potrzebuje kworum, żeby zdefiniować "ustalony fakt"
                   w obecności węzłów niesprawnych.
  mechanizm:       dowód uznany za ustalony przy zgodzie k z n; wypłaty indywidualne
                   nie są obserwowane, tylko wynik agregacji.
  koszt_natychmiastowy: 0.045 caseload-kw
  kumulacja:       progowa: T = 12 kw, skok J = 3.0x
                   (do 12 kw zmowa równowagowa jest rzadka; po 12 kw powtarzana gra
                   z obserwowalnymi historiami stabilizuje kartel zgodnych głosów)
  wykrywalność:    korelacja rozbieżności głosów w czasie; próg: korelacja > 0.6
                   przy oczekiwanej ~0.2 dla niezależnych ocen
  odwracalność:    częściowa; koszt = odtworzenie indywidualnych ścieżek decyzyjnych
  warunek_odwołania: korelacja rozbieżności > 0.6 przez 2 kwartały
                     LUB udział jednomyślnych rozstrzygnięć > 0.85
  alternatywa:     odmowa oznacza brak jakiegokolwiek mechanizmu tolerancji błędu
                   węzła w S2 — czyli w moim języku brak redundancji, czyli
                   wzmocnienie LOOP-C-08 (saint_dependency). To gorsze niż zmowa.
```

**To jest ustępstwo, które najbardziej boli merytorycznie.** Kworum uśrednia dokładnie tę wielkość, na której stoi cały mój model degeneracji: indywidualną różnicę wypłat `U(ujawnij) − U(zamaskuj)`. Agregacja czyni maskowanie **nieidentyfikowalnym per aktor** — a to jest strukturalnie ta sama utrata rangi, o której mówi `NN-C-01`, tylko przeniesiona z osi `(q, Θ)` na oś aktorów. Przyjmuję je, bo alternatywa (brak redundancji) jest w moim własnym modelu wyceniona wyżej: `S* = 0.549` i spadek `q` o 43.5% przy wypadnięciu komponentu.

---

## `CON-C-04`

```
CON-C-04
  etap:            S1
  ustępuję:        tezę, że niezmienniki istotne w tym układzie są własnościami
                   TRAJEKTORII (warunek rangi, margines wzmocnienia), a nie stanu.
                   Przyjmuję statyczną walidację schematu soczewki T jako
                   pierwszorzędny mechanizm egzekwowania INV-*.
  na rzecz:        soczewka T egzekwuje niezmienniki w punkcie konstrukcji; to jest
                   tańsze i wcześniejsze niż mój pomiar runtime.
  mechanizm:       INV-C-02, INV-C-05, INV-C-07 wyrażone jako predykaty na strukturze
                   sprawy w S1. INV-C-01 i INV-C-03 pozostają niewyrażalne.
  koszt_natychmiastowy: 0.025 caseload-kw
  kumulacja:       liniowa, a = 0.015/kw (rośnie udział niezmienników uznanych
                   za "sprawdzone", bo mają typ, mimo że są własnościami trajektorii)
  wykrywalność:    stosunek naruszeń wykrytych statycznie do wykrytych runtime;
                   próg: < 0.3 (czyli statyka łapie mniej niż 30% naruszeń)
  odwracalność:    pełna; koszt = przywrócenie monitoringu runtime
  warunek_odwołania: wykryte runtime naruszenie INV-C-03 albo INV-C-01 przy
                     zielonym wyniku walidacji statycznej — pojedyncze zdarzenie wystarczy
  alternatywa:     odmowa oznacza brak jakiegokolwiek gatingu w S1, czyli pełną
                   ekspozycję na stage_corruption przy mnożniku kosztu naprawy
                   x30 na S6 (RES-C-07). Statyka niepełna jest tańsza niż jej brak.
```

---

## `CON-C-05`

```
CON-C-05
  etap:            S8
  ustępuję:        ciągłą zmienną Theta (dryf punktu odniesienia). Przyjmuję
                   dyskretne wersjonowanie semantyki soczewki T:
                   linia orzecznicza jako ponumerowana wersja schematu.
  na rzecz:        soczewka T potrzebuje dyskretnych wersji, żeby mówić o
                   kompatybilności wstecznej i o migracji.
  mechanizm:       Theta zastąpione przez (wersja_schematu, data_migracji);
                   SLI-C-03 traci ciągłą dziedzinę.
  koszt_natychmiastowy: 0.050 caseload-kw
  kumulacja:       wykładnicza, h = 32 kw
                   (dryf między wersjami jest nieksięgowany i narasta wewnątrz wersji)
  wykrywalność:    wariancja wyników W OBRĘBIE jednej wersji schematu;
                   próg: > 0.5 * wariancji międzywersyjnej
  odwracalność:    częściowa; koszt = rekonstrukcja ciągłego dryfu z dyskretnych wersji,
                   możliwa tylko przy zachowanej próbce out-of-band (NN-C-01)
  warunek_odwołania: wariancja wewnątrz wersji przekracza 0.5 wariancji międzywersyjnej
  alternatywa:     odmowa oznacza brak jakiegokolwiek pojęcia kompatybilności wstecznej
                   w S8 — czyli każda zmiana linii orzeczniczej jest nierozróżnialna
                   od każdej innej. To dokładnie stan A_legit.
```

**Dobra strona tego ustępstwa, którą księguję jako zysk:** wersjonowanie daje **znacznik czasu** operacji zapisu do `Θ`. W moim modelu `S8` był operacją niewidoczną. Dyskretyzacja pogarsza rozdzielczość, ale czyni operację **jawną**. To pierwsze ustępstwo, którego bilans nie jest jednoznacznie ujemny.

---

## `CON-C-06`

```
CON-C-06
  etap:            S6
  ustępuję:        pierwszeństwo argumentu dynamicznego (margines opóźnienia)
                   nad argumentem dowodowym. Przyjmuję framing zobowiązań dowodowych
                   (verification conditions) soczewki T dla pętli odwoławczej.
  na rzecz:        wspólny język poprawności; soczewka T nie ma innego.
  mechanizm:       warunek NN-C-08 wyrażony jako obligacja dowodowa
                   "g_eff < g_crit(tau_a)" sprawdzana przy każdej zmianie procedury.
  koszt_natychmiastowy: 0.015 caseload-kw
  kumulacja:       liniowa, a = 0.005/kw (najwolniejsza w księdze)
  wykrywalność:    liczba obligacji "sprawdzonych" wobec liczby parametrów planta,
                   które faktycznie zmierzono; próg: < 0.5
  odwracalność:    pełna
  warunek_odwołania: obligacja przechodzi przy zmierzonym naruszeniu progu
                     w danych runtime (dowód o niezmierzonym plancie)
  alternatywa:     brak wspólnego pojęcia poprawności. To ustępstwo jest najtańsze
                   w całej księdze i przyjmuję je bez oporu.
```

**Granica tego ustępstwa:** dowód wiąże **kod**, nie **plant**. Plantem są ludzie z funkcją wypłaty `RES-C-02`. Dowód, że procedura spełnia `g_eff < g_crit`, jest prawdziwy warunkowo względem zmierzonego `O`, a `O` jest właśnie tą zmienną, której system nie mierzy (`NN-C-01`). Przyjmuję framing i **jednocześnie odnotowuję, że jego przesłanka jest niesprawdzalna** — to jest treść warunku odwołania.

---

## `CON-C-07`

```
CON-C-07
  etap:            S4
  ustępuję:        prawo do NIEROZSTRZYGNIĘCIA. Przyjmuję wymóg liveness
                   soczewki R: system musi zawsze wyprodukować decyzję.
  na rzecz:        bez liveness soczewka R nie ma żadnego twierdzenia o postępie;
                   protokół, który może się zatrzymać, jest dla niej bezużyteczny.
  mechanizm:       demand > 0 przy G = 0 nie może skutkować unresolved > 0;
                   deficyt jest pokrywany rozstrzygnięciem autorytetem "na kredyt".
  koszt_natychmiastowy: 0.075 caseload-kw
  kumulacja:       wykładnicza, h = 16 kw — NAJSZYBSZA w księdze
  wykrywalność:    para (M, demand − M) z NN-C-05; próg: demand − M > 0.10
                   przy jednoczesnym M > 0.30
  odwracalność:    nieodwracalna w części dotyczącej spraw już rozstrzygniętych
                   na kredyt (S7 nastąpiło); odwracalna prospektywnie
  warunek_odwołania: G < 0.05 * Gmax przez 4 kolejne kwartały
                     LUB udział rozstrzygnięć na kredyt > 0.25
  alternatywa:     odmowa oznacza dopuszczenie deadlocku w S4, którego soczewka R
                   nie zaakceptuje jako protokołu. Koszt odmowy: brak scalenia w S4,
                   czyli utrata całej osi S3-S4-S5 we wspólnej ontologii.
```

**To jest najdroższe ustępstwo w księdze: 40.3% całego `D(40)`.** Powód jest strukturalny, nie retoryczny. Wymóg liveness to dokładnie mechanizm, który w moim modelu **zamienia niedobór `RES-C-05` (uwaga orzecznicza) na wydatek `RES-C-01` (`force_gas`)**. To nie jest analogia — to ten sam człon: `M = min(demand, G/gSpend)` z usuniętym ograniczeniem górnym. Usunięcie ogranicznika nie tworzy zdolności rozstrzygania; tworzy rozstrzygnięcia bez pokrycia.

Przyjmuję je mimo to, bo alternatywa — dopuszczalny deadlock w `S4` — usuwa ze wspólnej ontologii całą oś `S3–S4–S5`, a wtedy nie ma czego scalać. Ale księguję je z **najkrótszym okresem podwojenia (16 kw)** i z warunkiem odwołania opartym na obserwowalnym stanie rezerwuaru, nie na ocenie.

---

## `CON-C-08` — przyznane **wyłącznie w formie związanej**

```
CON-C-08
  etap:            S0..S8 (przekrojowe)
  ustępuję:        raportowanie L (legitymacji) jako wspólnej metryki zdrowia systemu.
                   L jest jedyną zmienną obserwowalną przez wszystkie trzy soczewki.
  na rzecz:        wspólny dashboard; bez niego trzy modele nie mają ani jednej
                   wspólnej liczby.
  mechanizm:       FORMA ZWIĄZANA: L jest publikowane jako wskaźnik raportowy,
                   ale NIE może być wejściem żadnej pętli sterowania. Kontroler
                   nie ma dostępu do L; ma dostęp wyłącznie do SLI-C-01..06.
                   Rozdzielenie egzekwowane strukturalnie: kanał raportowy
                   nie ma krawędzi zwrotnej do kanału decyzyjnego.
  koszt_natychmiastowy: 0.025 caseload-kw (forma związana)
  kumulacja:       liniowa, a = 0.010/kw
  wykrywalność:    korelacja między L(t−k) a decyzjami proceduralnymi w t;
                   próg: |korelacja| > 0.3 dla dowolnego k <= 8 kw
  odwracalność:    pełna, o ile rozdzielenie kanałów jest strukturalne, nie regulaminowe
  warunek_odwołania: wykryta korelacja > 0.3 => natychmiastowe wygaszenie publikacji L
  alternatywa:     brak wspólnej metryki. Kosztowne, ale nie fatalne.
```

**Forma nieograniczona jest ODRZUCONA** na podstawie `NN-C-07`.

Uzasadnienie liczbowe, nie deklaratywne. Domknięcie pętli sterowania przez `L` oznacza kontroler minimalizujący uchyb na `L` z jedynym szybkim aktuatorem `u = M`, którego macierz wejścia to `B = [−0.0641, +0.0300]ᵀ`. Kondycja Gramiana sterowalności `κ(W) = 330` oznacza, że ruch wzdłuż `λ_max` (który zawiera składową **ujemną na `q`**) jest **330× tańszy** niż ruch poprawiający `q` bez ruszania `L`. Kontroler poprawnie realizujący zadany cel będzie zatem systematycznie obniżał `q` — i nie będzie to błąd, tylko rozwiązanie zadania.

Wpływ na księgę: forma nieograniczona kosztowałaby 0.100 caseload-kw z okresem podwojenia 12 kw, co przesuwa przekroczenie progu z **t = 24 kw na t = 12 kw** — czyli **kosztuje 3 lata sensu systemu**. Ograniczenie do formy raportowej redukuje wkład tego wpisu z 49.8% do 3.3% `D(40)`.

---

## `CON-C-09`

```
CON-C-09
  etap:            S3
  ustępuję:        jawny error budget na rzecz polityki bounded retry / timeout.
                   W moim modelu S3 powinno być backpressure; przyjmuję hard deadline
                   z ograniczoną liczbą powtórzeń.
  na rzecz:        soczewka R wyraża kontrolę przepływu przez timeouty i retry;
                   nie ma w niej pojęcia budżetu błędu.
  mechanizm:       prekluzja z k dozwolonymi wnioskami o przywrócenie terminu,
                   zamiast miarkowania dopływu do zdolności przerobowej.
  koszt_natychmiastowy: 0.030 caseload-kw
  kumulacja:       liniowa, a = 0.020/kw
  wykrywalność:    stosunek (sprawy przekraczające deadline) / (zdolność przerobowa);
                   próg: > 1.15 przez 2 kwartały
  odwracalność:    pełna
  warunek_odwołania: przekroczenie progu 1.15 przez 2 kolejne kwartały
  alternatywa:     odmowa oznacza brak jakiejkolwiek kontroli przepływu w S3,
                   czyli nieograniczone narastanie RES-C-05. Retry bez budżetu
                   jest gorsze niż budżet, ale lepsze niż brak obu.
```

Różnica, którą tracę i którą warto zapisać, bo przenosi zachowanie: **backpressure zmniejsza dopływ i chroni zasób, degradując opóźnienie; hard deadline utrzymuje dopływ i degraduje jakość, pokrywając niedobór z innego zasobu.** Przy `RES-C-01` zużytym w 100% w nominale, „inny zasób" nie istnieje — deficyt trafia wprost do `V_p`, a stąd do `E`.

---

## Czego **nie** ustępuję — i co to kosztuje w fazie scalania

| odrzucone żądanie | soczewka | podstawa | koszt odmowy |
|-------------------|----------|----------|--------------|
| `L` jako zmienna sterowana | R, T | `NN-C-07` (`κ(W) = 330`, znaki `B` przeciwne) | brak wspólnej pętli sterowania; trzy kontrolery zamiast jednego |
| czujnik out-of-band jako opcjonalny | R, T | `NN-C-01` (`rank 𝒪 = 1 < 2`) | wyższy koszt wdrożenia, osobny właściciel budżetu |
| odwoływalność czujnika „w wyjątkowych okolicznościach" | R | `NN-C-02` (jedyna dźwignia po fakcie; histereza > 5.5×) | sztywność architektury, brak trybu awaryjnego |
| `c_d > 0` jako element odpowiedzialności | T | `NN-C-03` (`O* = c_d/(c_m·φ)`) | konflikt z intuicją odpowiedzialności indywidualnej |
| `M` bez licznika niepokrytego popytu | R | `NN-C-05` (kontrprzykład: `M` niższe w gorszym reżimie) | jeden dodatkowy licznik |
| `V` jako agregat bez rozdziału | R, T | `NN-C-06` (nierozstrzygalność strukturalna) | koszt `SLI-C-02`: kodowanie stanu faktycznego w ciemno |

---

## Model kumulacji łącznej

### Wzór na dryf sumaryczny

$$D(t) = \sum_{i} c_i \cdot \kappa_i(t - t_i) \cdot \mathbb{1}[t \ge t_i]$$

gdzie `c_i` jest kosztem natychmiastowym w **caseload-kwartałach**, a `κ_i` funkcją kumulacji:

$$\kappa_{\text{lin}}(s) = 1 + a_i s, \qquad
\kappa_{\text{exp}}(s) = 2^{s/h_i}, \qquad
\kappa_{\text{prog}}(s) = \begin{cases} 1 & s < T_i \\ J_i & s \ge T_i \end{cases}$$

| wpis | `c_i` | `κ_i` | parametr |
|------|-------|-------|----------|
| `CON-C-01` | 0.020 | liniowa | `a = 0.020/kw` |
| `CON-C-02` | 0.060 | wykładnicza | `h = 24 kw` |
| `CON-C-03` | 0.045 | progowa | `T = 12 kw`, `J = 3.0` |
| `CON-C-04` | 0.025 | liniowa | `a = 0.015/kw` |
| `CON-C-05` | 0.050 | wykładnicza | `h = 32 kw` |
| `CON-C-06` | 0.015 | liniowa | `a = 0.005/kw` |
| `CON-C-07` | 0.075 | wykładnicza | **`h = 16 kw`** |
| `CON-C-08` (związane) | 0.025 | liniowa | `a = 0.010/kw` |
| `CON-C-09` | 0.030 | liniowa | `a = 0.020/kw` |

### Próg utraty sensu

$$D(t) \ge E_{\text{crit}} = 0.6975 \ \text{caseload-kw}$$

Próg **nie jest arbitralny**. `E_crit` to separatrysa policzona w torze I (`20-DYNAMICS.md §3`): wartość zapasu ukrytego błędu, powyżej której układ zbiega do `A_legit` niezależnie od pozostałych parametrów. Interpretacja `D(t) ≥ E_crit`: **sam dryf konsensusowy, przy zerowym endogenicznym maskowaniu, wystarcza do przeniesienia układu przez separatrysę.** Od tego momentu model nie opisuje już systemu, który rozstrzyga sprawy — opisuje system, który podtrzymuje własną legitymację, a wszystkie moje twierdzenia z toru I stają się twierdzeniami o czymś innym niż to, co scalono.

### Wynik obliczenia

| scenariusz | `D(0)` | przekroczenie progu |
|-----------|--------|---------------------|
| **przyznany zbiór (9 wpisów, `CON-C-08` związane)** | **0.345** | **t = 24 kw = 6.0 roku** |
| gdyby `CON-C-08` bez ograniczeń | 0.420 | t = 12 kw = 3.0 roku |
| po odwołaniu `CON-C-07` w t = 24 kw | — | t = 47 kw = 11.8 roku |

Trajektoria zbioru przyznanego:

| `t` [kw] | 0 | 8 | 16 | **24** | 32 | 40 | 56 | 80 |
|---------|---|---|----|--------|----|----|----|----|
| `D(t)` | 0.345 | 0.415 | 0.593 | **0.707** | 0.856 | 1.052 | 1.664 | 3.674 |

### Liczba ustępstw do progu

Przy horyzoncie audytu `t = 40 kw` (10 lat), dodając wpisy w kolejności rosnącego kosztu:

| # | wpis | koszt @40 kw | `D` skumulowane |
|---|------|--------------|-----------------|
| 1 | `CON-C-06` | 0.018 | 0.018 |
| 2 | `CON-C-08` (zw.) | 0.035 | 0.053 |
| 3 | `CON-C-01` | 0.036 | 0.089 |
| 4 | `CON-C-04` | 0.040 | 0.129 |
| 5 | `CON-C-09` | 0.054 | 0.183 |
| 6 | `CON-C-05` | 0.119 | 0.302 |
| 7 | `CON-C-03` | 0.135 | 0.437 |
| 8 | `CON-C-02` | 0.191 | 0.627 |
| **9** | **`CON-C-07`** | **0.424** | **1.052 ← próg przekroczony** |

**Do progu mieści się 8 ustępstw; dziewiąte go przekracza.**

Uwaga do interpretacji: to nie jest budżet „ośmiu dowolnych ustępstw". `CON-C-07` sam odpowiada za **40.3%** `D(40)`, a `CON-C-02` za 18.1%. Pierwszych sześć wpisów łącznie daje 0.302 — mniej niż połowę progu. **Ryzyko nie jest rozłożone równomiernie i nie kumuluje się liniowo z liczbą ustępstw**, tylko koncentruje się w dwóch: liveness (`CON-C-07`) i finality (`CON-C-02`) — czyli dokładnie w tych dwóch, które usuwają z modelu, odpowiednio, **nasycenie aktuatora** i **integrator**. To są dwa obiekty, wokół których zbudowana jest cała moja analiza degeneracji.

### Okres półtrwania sensu

Czas podwojenia `D` dla zbioru pełnego (bez ograniczenia `CON-C-08`): **17 kw** w `t=0`, skracający się do **14 kw** w `t=60`. Skracanie wynika z dominacji członów wykładniczych nad liniowymi w miarę upływu czasu. Praktyczna konsekwencja: **rewizja księgi ustępstw rzadsza niż co 14 kwartałów (3.5 roku) jest bezużyteczna**, bo między rewizjami dryf zdąży się podwoić.

### Warunek wznowienia negocjacji

Ustępstwa są przyznane **warunkowo i wygasają automatycznie**. Predykat globalny:

```
if (D(t) >= 0.5 * E_crit) => zamrożenie nowych ustępstw
if (D(t) >= 0.8 * E_crit) => automatyczne wygaśnięcie wszystkich wpisów o kumulacji wykładniczej
                              (CON-C-02, CON-C-05, CON-C-07)
if (D(t) >= E_crit)       => tor II wygasa w całości; obowiązuje wyłącznie tor I
```

Dla zbioru przyznanego: pierwszy próg (`D = 0.349`) osiągany w **t = 1 kw**, drugi (`D = 0.558`) w **t = 14 kw**, trzeci w **t = 24 kw**. Oznacza to, że zamrożenie nowych ustępstw obowiązuje praktycznie od początku, a automatyczne wygaszenie wpisów wykładniczych następuje po 3.5 roku. Podaję to jawnie, bo księga ustępstw bez daty ważności jest kapitulacją zapisaną w formie tabeli.

---

*Agent C · tor II · Justice-as-Code v1.0*
