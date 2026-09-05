# 30-CONCESSIONS — Agent A · tor II (konsensusowy)

Księga ustępstw wobec soczewek: **(T)** typy / kompilatory / weryfikacja formalna,
**(S)** teoria sterowania / mechanism design.

Tor II nie edytuje toru I. Każdy wpis jest **zapisem księgowym**: model suwerenny pozostaje w
`00-MODEL.md` bez zmian, a tutaj notuję, co konkretnie osłabiam i po jakiej cenie.

**Jednostka kosztu.** `1 du (drift-unit)` = utrata 1 punktu procentowego zdolności zewnętrznego
obserwatora, mającego dostęp wyłącznie do publicznego logu, do odróżnienia `evidence-commit`
od `authority-commit`.

Wybór tej jednostki nie jest dowolny: w moim modelu obserwowalność jest zasobem nadrzędnym
(`RES-A-09`), bo wchodzi **multiplikatywnie** do regeneracji puli legitymacji
(`ρ = ρ_max·obs`, `20-DYNAMICS.md` §1). Zatem dryf mierzony w `du` przekłada się bezpośrednio na
znak pętli nadrzędnej, a nie tylko na komfort audytu.

---

## Uprzedzenie do wyniku

Zidentyfikowałem **8 kandydatów** na ustępstwo o łącznym koszcie nominalnym 54 du.
Rachunek na końcu pokazuje, że **przyznać mogę tylko 4 z nich (24 du)**, a pełny zbiór przekracza
próg sterowalności już w `t = 0`. Odrzucam zatem cztery kandydatury o łącznej wartości 30 du,
i podaję dla każdej powód liczbowy, nie doktrynalny.

Piszę o tym na początku, bo księga, w której każdy wniosek zostaje uwzględniony, jest listą życzeń,
a nie księgą.

---

## `CON-A-01`

```
etap:            S2
ustępuję:        runtime'owy pomiar custody per fakt (INV-A-02 w wersji dynamicznej)
na rzecz:        (T) statyczna klasyfikacja dowodu po typie, rozstrzygalna przed wykonaniem
mechanizm:       CustodyClass wyznaczana z rodzaju dowodu (dokument urzędowy => dual,
                 zeznanie strony => single, dokument prywatny kontrahenta => dual, ...),
                 a nie z faktycznej listy custodians danego faktu.
                 W typach: custodyClass staje się funkcją EvidenceKind, nie Fact.
koszt_natychmiastowy: 12 du
kumulacja:       liniowa, a = 0.15/rok, brak samoistnego wygasania (T½ = ∞)
                 uzasadnienie a: udział dowodów o nietypowej strukturze custody rośnie
                 z cyfryzacją obrotu [EST]; klasyfikacja statyczna starzeje się względem świata
wykrywalność:    odsetek spraw, w których fakt sklasyfikowany jako "dual" okazał się mieć
                 jednego posiadacza. Próg alarmowy: 5 % [EST]
odwracalność:    pełna; koszt cofnięcia = koszt wdrożenia pomiaru runtime, rzędu 10⁻⁴ kosztu sprawy
warunek_odwołania: misclassification_rate > 0.05 przez 2 kolejne okresy pomiarowe
alternatywa:     upieranie się przy pomiarze runtime => brak jakiegokolwiek oznaczenia custody
                 w praktyce, bo pomiar runtime wymaga wiedzy o faktach nieujawnionych (THM-A-02).
                 Statyczna klasyfikacja jest przybliżeniem; jej brak to zero.
```

**Dlaczego to jest ustępstwo, a nie ulepszenie.** Soczewka typów ma tu rację co do wykonalności:
mój wymóg runtime jest częściowo niewykonalny, bo custody faktu **nieujawnionego** jest nieznana
z definicji. Ale statyczna klasyfikacja gubi dokładnie te przypadki, na których mi zależy —
fakty o nietypowej strukturze posiadania. To jest klasyczna wymiana `soundness` na `decidability`
i tak ją księguję.

---

## `CON-A-02` *(kandydat — ODRZUCONY, patrz §11)*

```
etap:            S5
ustępuję:        calibrated.support jako liczba; przyjmuję enum {evidence | authority}
na rzecz:        (T) sumy typów zamiast wartości numerycznych — rozstrzygalność, brak
                 zobowiązania do kalibracji, której nie da się statycznie zweryfikować
mechanizm:       Verdict.completeness.calibrated: Posterior  ->  Verdict.mode: DecisionMode
koszt_natychmiastowy: 9 du
kumulacja:       wykładnicza, λ = 0.10/rok
                 uzasadnienie λ: bez liczby nie da się policzyć Brier score, więc nie ma
                 sprzężenia korygującego kalibrację; błąd kalibracji narasta multiplikatywnie
wykrywalność:    brak metryki bezpośredniej — to jest istota problemu.
                 Proxy pośrednie: rozrzut wyroków między referatami przy kontroli na profil
                 sprawy. Próg: nadwyżka wariancji > 15 % [EST]
odwracalność:    częściowa; przywrócenie pola jest łatwe, ale utraconych danych
                 kalibracyjnych za okres ustępstwa nie da się odtworzyć
warunek_odwołania: nadwyżka wariancji między-referatowej > 0.15 przez 3 okresy
alternatywa:     brak — musiałbym żądać kalibracji od komponentu (człowieka), który nigdy
                 nie był kalibrowany i nie ma pętli uczącej
```

---

## `CON-A-03`

```
etap:            S4 (i S3)
ustępuję:        twarde FIFO po zewnętrznym timestampie
na rzecz:        (S) regulator kolejki z priorytetami — pilność, wiek, ryzyko przedawnienia,
                 nieodwracalność skutku. Sterowanie zamiast reguły stałej.
mechanizm:       priority = w1*wiek + w2*ryzyko_przedawnienia + w3*nieodwracalność(S7);
                 wagi strojone przez regulator z pętlą po długości kolejki.
                 ZACHOWANE: timestamp wpływu i każde przesunięcie nadal commitowane
                 zewnętrznie (NN-A-02 NIE jest naruszone — ustępuję FIFO, nie atrybucyjność).
koszt_natychmiastowy: 5 du
kumulacja:       liniowa, a = 0.08/rok (dryf wag regulatora bez re-audytu)
wykrywalność:    korelacja między priorytetem a atrybutami strony (reprezentacja, wielkość
                 podmiotu, rodzaj roszczenia) przy kontroli na zadeklarowane czynniki.
                 Próg: |r| > 0.2 [EST]
odwracalność:    pełna; powrót do FIFO jest zmianą jednej reguły
warunek_odwołania: |r| > 0.2 albo brak re-audytu wag przez > 24 miesiące
alternatywa:     twarde FIFO ignoruje nieodwracalność skutku (RES-A-10) i ryzyko przedawnienia,
                 czyli optymalizuje jedyną metrykę, której nie chcę optymalizować.
                 To ustępstwo poprawia model w wymiarze, którego moja soczewka nie widziała.
```

**Uczciwa uwaga.** To jest jedyne ustępstwo, po którym mój model jest lepszy. Soczewka sterowania
ma rację: FIFO jest regułą bez funkcji celu, a nie regułą sprawiedliwą. Księguję je jako ustępstwo,
bo osłabia atrybucyjność kolejności, ale nie udaję, że tracę na nim netto.

---

## `CON-A-04` *(kandydat — ODRZUCONY, patrz §11)*

```
etap:            S8
ustępuję:        activation height jako punkt; przyjmuję activation interval
                 (okres przejściowy, w którym obie wersje semantyki są ważne)
na rzecz:        (S) soft fork zamiast hard forka — uniknięcie nieciągłości, którą
                 teoria sterowania słusznie traktuje jak zaburzenie skokowe
mechanizm:       interpretationAt(at, ...) zwraca ReadonlySet<SchemaVersion> zamiast
                 SchemaVersion; replay staje się relacją inkluzji, nie równości
koszt_natychmiastowy: 7 du
kumulacja:       progowa, T* = 3 lata, mnożnik M = 2.5
                 uzasadnienie progu: nakładające się interwały tworzą łańcuchy niejednoznaczności;
                 przy ~3 latach typowy termin przechodzi przez 2 interwały i zbiór wyników
                 replayu przestaje być singletonem dla większości spraw [EST]
wykrywalność:    |interpretationAt(...)| > 1 dla losowej próby spraw historycznych.
                 Próg: > 20 % spraw z niesingletonowym wynikiem [EST]
odwracalność:    częściowa; interwały już otwarte pozostają otwarte
warunek_odwołania: udział spraw niesingletonowych > 0.2
alternatywa:     twardy activation height jest nieciągłością: dwie sprawy różniące się o jeden
                 dzień dostają różną semantykę. To realny koszt, którego moja soczewka nie wyceniała.
```

---

## `CON-A-05`

```
etap:            S6
ustępuję:        d_max jako stała systemowa; przyjmuję parametr strojony per klasa spraw
na rzecz:        (S) alokacja skończonego RES-A-06 tam, gdzie marginalna korzyść jest
                 największa, zamiast rozdziału równego
mechanizm:       RollbackPolicy.dMaxInstances wyznaczane z klasy sprawy;
                 ZACHOWANE: deklaracja przed commitem (NN-A-10 nietknięte)
koszt_natychmiastowy: 4 du
kumulacja:       liniowa, a = 0.05/rok
wykrywalność:    rozrzut faktycznego d_max między klasami spraw skorelowany z atrybutami
                 strony, nie sprawy. Próg: |r| > 0.15 [EST]
odwracalność:    pełna
warunek_odwołania: |r| > 0.15 albo d_max < 1 dla jakiejkolwiek klasy
alternatywa:     stałe d_max = 2 dla wszystkich, przy czym z THM-A-07 trzecia instancja
                 wnosi 0.3 pp — czyli stała jest marnotrawstwem RES-A-03 w klasach,
                 gdzie p_corrupt jest niskie
```

---

## `CON-A-06` *(kandydat — ODRZUCONY, patrz §11)*

```
etap:            S3 / S5
ustępuję:        publiczność Completeness.droppedByPreclusion; przenoszę do audit logu
                 dostępnego wyłącznie weryfikatorowi
na rzecz:        (S) mechanism design — publikacja zbioru porzuconego jest sygnałem
                 strategicznym: uczy przyszłych pozwanych, które zatajenia przechodzą
                 przez prekluzję bez konsekwencji
mechanizm:       Completeness rozdzielona na część publiczną (flagi boolean) i część
                 audytową (listy FactId)
koszt_natychmiastowy: 8 du
kumulacja:       wykładnicza, λ = 0.12/rok
                 uzasadnienie λ: dostęp audytorski eroduje szybciej niż jawność publiczna,
                 bo nie ma zewnętrznego wyborcy interesu w jego utrzymaniu [EST]
wykrywalność:    liczba niezależnych podmiotów, które faktycznie wykonały dostęp audytorski
                 w okresie. Próg: < 3 podmioty/rok [EST]
odwracalność:    pełna formalnie, częściowa faktycznie — przywrócenie jawności po okresie
                 niejawności wymaga decyzji, której nikt nie ma motywacji podjąć
warunek_odwołania: liczba wykonanych audytów < 3/rok
alternatywa:     pełna jawność listy porzuconej jest realnym prezentem dla strategicznego
                 zatajania. Argument soczewki mechanizmów jest tu poprawny, nie wymijający.
```

---

## `CON-A-07`

```
etap:            S1
ustępuję:        runtime ACK jako warunek konieczny doręczenia
na rzecz:        (T) proof-carrying delivery — statyczny dowód, że próba doręczenia
                 spełniła protokół (kanały niezależne, bounded retry, poprawna kolejność)
mechanizm:       DeliveryProof "assumed" niesie świadectwo typu potwierdzające eskalację
                 kanału; ZACHOWANA propagacja assumedDelivery do wyroku i do S7 (INV-A-09)
koszt_natychmiastowy: 3 du
kumulacja:       liniowa, a = 0.04/rok
wykrywalność:    udział wyroków zaocznych per klasa pozwanego (dochód, forma prawna, adres
                 w rejestrze vs adres faktyczny). Próg: iloraz szans między skrajnymi
                 klasami > 3 [EST]
odwracalność:    pełna
warunek_odwołania: iloraz szans > 3 albo świadectwo eskalacji wystawiane bez faktycznej
                 zmiany kanału w > 10 % przypadków
alternatywa:     twardy wymóg ACK czyni część postępowań nieterminowalnymi wobec węzłów
                 trwale nieosiągalnych, co narusza wymóg terminacji z THM-A-03.
                 Soczewka typów ma rację: potrzebny jest dowód *próby*, nie dowód *skutku*.
```

**To jest ustępstwo, którego argument uznaję za w pełni trafny.** Mój wymóg ACK w wersji twardej jest
niewykonalny właśnie z powodu, który sam sformułowałem w THM-A-03 (terminacja jest wymuszona).
Proof-carrying delivery jest właściwym osłabieniem: przenosi ciężar z nieosiągalnego skutku
na sprawdzalną procedurę.

---

## `CON-A-08` *(kandydat — ODRZUCONY, patrz §11)*

```
etap:            S2 / S4 / S6
ustępuję:        model awarii skorelowanej w warstwie mechanizmu; przyjmuję i.i.d.
na rzecz:        (S) mechanism design wymaga niezależności typów agentów, żeby twierdzenia
                 o incentive compatibility w ogóle obowiązywały
mechanizm:       ρ = 0 w modelu projektowym mechanizmu; correlation budget deklarowany
                 osobno i weryfikowany empirycznie poza mechanizmem
koszt_natychmiastowy: 6 du
kumulacja:       progowa, T* = 4 lata, mnożnik M = 3.0
                 uzasadnienie progu: mechanizm zaprojektowany przy ρ = 0 zaczyna być
                 wykorzystywany strategicznie dopiero po ujawnieniu się korelacji w praktyce,
                 co wymaga kilku cykli obserwacji [EST]
wykrywalność:    empiryczne ρ — korelacja błędów między instancjami przy kontroli na trudność.
                 Próg: ρ > 0.3
odwracalność:    NIEODWRACALNA w części dotyczącej mechanizmów już wdrożonych — mechanizm
                 zaprojektowany przy ρ = 0 nie daje się przestroić, wymaga przeprojektowania.
                 Koszt cofnięcia: pełny koszt projektu mechanizmu
warunek_odwołania: ρ_empiryczne > 0.3
alternatywa:     przy ρ > 0 większość twierdzeń mechanism design nie obowiązuje, więc
                 soczewka (S) nie ma czym pracować. Odmowa ustępstwa oznacza brak
                 współpracy z tą soczewką w ogóle, nie gorszą współpracę.
```

---

## 9. Model kumulacji łącznej

### 9.1 Wzór

```
D(t) = Σ_i  c_i · κ_i(t) · 1[¬R_i(t)]
     + γ · Σ_{i<j}  c_i · c_j · 1[same_family(i,j)] · 1[¬R_i(t)] · 1[¬R_j(t)]
```

gdzie:

| symbol | znaczenie |
|---|---|
| `c_i` | koszt natychmiastowy ustępstwa `i` w du |
| `κ_i(t)` | funkcja kumulacji: `1 + a·t` \| `e^{λt}` \| `t < T* ? 1 : M` |
| `R_i(t)` | predykat odwołania — ustępstwo wygasłe nie wnosi dryfu |
| `γ = 0.02` | współczynnik sprzężenia wewnątrzrodzinnego [EST] |
| `same_family` | ustępstwa dotykające tego samego kanału pomiarowego |

**Uzasadnienie członu kwadratowego.** Utrata dwóch niezależnych kanałów pomiaru daje utratę większą
niż suma, bo znika możliwość **krzyżowania** danych. Jeżeli mam `calibrated.support` i listę
`droppedByPreclusion`, mogę sprawdzić, czy niska pewność koreluje z dużym zbiorem porzuconym —
to jest informacja, której nie ma w żadnym z pól osobno. Usunięcie obu usuwa trzy rzeczy, nie dwie.
Człon jest kwadratowy, bo liczba możliwych krzyżowań rośnie jak liczba par.

Rodziny: `observability` (`CON-A-01`, `-02`, `-06`), `ordering` (`-03`), `replay` (`-04`, `-05`),
`delivery` (`-07`), `failure-model` (`-08`).

### 9.2 Dwa progi, oba wyprowadzone

| Próg | Wartość | Znaczenie | Wyprowadzenie |
|---|---|---|---|
| `D_crit` | **50 du** | znak `LOOP-A-01` zmienia się na dodatni — **utrata sterowalności** | `obs_crit = δa/ρ_max = 0.025/0.05 = 0.5` ⇒ `D_crit = 100·(1−0.5)` |
| `D*` | **100 du** | `obs = 0`, `ρ = 0`, rozbieganie bezwarunkowe — **utrata sensu** | `obs(t) = max(0, 1 − D/100)` |

**Wiążący jest `D_crit`, nie `D*`.** To jest najważniejsza korekta, jaką tor II wnosi do mojej
wcześniejszej intuicji. `D* = 100 du` to punkt, w którym system przestaje być odróżnialny od arbitra
losowego — ale sterowalność ginie **dwa razy wcześniej**, bo regeneracja puli legitymacji spada
poniżej tempa jej zużycia już przy połowicznej obserwowalności. Między 50 a 100 du system nadal
wygląda na działający i nadal produkuje odróżnialne rozstrzygnięcia; po prostu nie wraca już
z żadnego zaburzenia.

Uzasadnienie progu utraty sensu jest formalne, nie umowne: przy `obs = 0` mamy `ρ = 0`, a wtedy
`e_{t+1} = (1 + δa)·e_t + δF₀` jest ściśle rozbieżne dla dowolnych `δa > 0`, `δF₀ > 0`.
Rozbieżność jest bezwarunkowa — nie zależy już od żadnego parametru, który dałoby się stroić.

### 9.3 Rachunek dla pełnego zbioru kandydatów

| `t` [lat] | `D(t)` [du] | `obs` | znak `LOOP-A-01` |
|---|---|---|---|
| 0 | **60.08** | 0.399 | **dodatni** |
| 3 | 84.76 | 0.152 | dodatni |
| 4 | 102.02 | 0.000 | dodatni |
| 5 | 107.60 | 0.000 | dodatni |
| 10 | 141.81 | 0.000 | dodatni |

**Pełny zbiór 8 ustępstw jest niedopuszczalny od chwili zero.** `D(0) = 60.08 du > D_crit = 50 du`.
Nie jest to kwestia kumulacji w czasie — same koszty natychmiastowe przekraczają próg sterowalności.

### 9.4 Maksymalny dopuszczalny podzbiór

Warunek: `max_{t ∈ [0,10]} D(t) < 50 du`. Przeszukanie wszystkich 255 niepustych podzbiorów,
maksymalizacja sumy `c_i` (czyli maksymalna „ilość ustąpionego") przy spełnionym warunku:

**Rozwiązanie: `{CON-A-01, CON-A-03, CON-A-05, CON-A-07}` — 4 ustępstwa, 24 du nominalnie,
`max D(t ≤ 10) = 49.20 du`.**

| `t` [lat] | `D(t)` | `obs` |
|---|---|---|
| 0 | 24.00 | 0.760 |
| 5 | 36.60 | 0.634 |
| 10 | 49.20 | 0.508 |
| 10.5 | 50.46 | 0.495 — **`D_crit` przekroczone** |
| 30.5 | 100.86 | 0.000 — **`D*` przekroczone** |

Człon sprzężenia wynosi w tym podzbiorze **zero**, bo żadne dwa z czterech ustępstw nie należą do
tej samej rodziny kanałów. To nie jest przypadek — algorytm doboru sam odrzucił kombinacje
wewnątrzrodzinne, bo `γ·c_i·c_j` jest największe dokładnie tam, gdzie koszty są duże.
Reguła praktyczna, która z tego wynika: **nie ustępuj dwa razy w tym samym kanale pomiarowym.**

### 9.5 Odrzucone kandydatury (30 du)

| ID | koszt | powód liczbowy odrzucenia |
|---|---|---|
| `CON-A-02` | 9 du | rodzina `observability`, już zajęta przez `CON-A-01` (12 du); para daje `γ·12·9 = 2.16` du sprzężenia, a suma 21 du + `CON-A-06` przekroczyłaby połowę budżetu na jednym kanale |
| `CON-A-06` | 8 du | jak wyżej; dodatkowo `κ` wykładnicza `λ = 0.12` — najszybciej rosnąca w zbiorze |
| `CON-A-04` | 7 du | `κ` progowa `M = 2.5` w `T* = 3` — skok o 10.5 du w jednym roku, nieabsorbowalny przy budżecie 50 du |
| `CON-A-08` | 6 du | `κ` progowa `M = 3.0` **oraz** `odwracalność: nieodwracalna`. Jedyny nieodwracalny kandydat w zbiorze — odrzucam go na tej podstawie niezależnie od kosztu |

**`CON-A-08` odrzucam z powodu innego niż arytmetyka i chcę to zapisać osobno.** Ustępstwo
nieodwracalne nie jest ustępstwem — jest zmianą modelu przemyconą przez księgę. Predykat odwołania
`ρ > 0.3` jest przy nim atrapą: gdy się spełni, cofnięcie wymaga przeprojektowania mechanizmu,
czyli kosztu porównywalnego z niewejściem w ustępstwo w ogóle. Pole `warunek_odwołania` bez
wykonalnego cofnięcia jest ozdobą.

### 9.6 Liczba ustępstw do progu

Przy koszcie przeciętnym `c̄ = 6.75 du` i 37.5 % par wewnątrzrodzinnych, w `t = 0`:

| Próg | `N` bezpieczne | `N*` przekraczające |
|---|---|---|
| `D_crit = 50 du` | 6 (`D = 45.6`) | **7** (`D = 54.4`) |
| `D* = 100 du` | 11 (`D = 93.0`) | **12** (`D = 103.6`) |

### 9.7 Wniosek: dryf jest zdominowany przez czas, nie przez liczbę

Zestawienie dwóch liczb:

- przy `t = 0` próg sterowalności wymaga **7** ustępstw,
- przy **4** przyznanych ustępstwach próg zostaje przekroszony w `t = 10.5` roku samą kumulacją.

Czyli: **dyscyplina w liczbie ustępstw kupuje mniej niż działające predykaty odwołania.**
Cztery ustępstwa bez wygasania są w horyzoncie dekady równoważne siedmiu przyznanym naraz.

Stąd jedyna reguła operacyjna, jaką z tej księgi wyprowadzam:

> Ustępstwo bez wykonalnego predykatu odwołania i bez zadeklarowanego miernika wykrywalności
> należy traktować jako ustępstwo o koszcie `c_i·κ_i(∞)`, czyli — dla `κ` liniowej i wykładniczej —
> o koszcie nieskończonym. Takich nie księguję; takich się nie udziela.

Wszystkie cztery przyznane ustępstwa mają predykat odwołania oparty na metryce, która jest
**mierzalna bez współpracy podmiotu mierzonego** (odsetek misclassification, korelacja priorytetu
z atrybutami strony, rozrzut `d_max`, iloraz szans wyroków zaocznych). To był warunek doboru równie
twardy jak próg 50 du: predykat odwołania weryfikowany przez podmiot, którego dotyczy, nie jest predykatem.

---

## 10. Podsumowanie księgi

| ID | Etap | Soczewka | Koszt [du] | `κ` | Odwracalność | Status |
|----|------|----------|-----------|-----|--------------|--------|
| `CON-A-01` | S2 | T | 12 | lin 0.15 | pełna | **przyznane** |
| `CON-A-02` | S5 | T | 9 | exp 0.10 | częściowa | odrzucone |
| `CON-A-03` | S4 | S | 5 | lin 0.08 | pełna | **przyznane** |
| `CON-A-04` | S8 | S | 7 | prog 2.5 @3 | częściowa | odrzucone |
| `CON-A-05` | S6 | S | 4 | lin 0.05 | pełna | **przyznane** |
| `CON-A-06` | S3/S5 | S | 8 | exp 0.12 | częściowa | odrzucone |
| `CON-A-07` | S1 | T | 3 | lin 0.04 | pełna | **przyznane** |
| `CON-A-08` | S2/S4/S6 | S | 6 | prog 3.0 @4 | **nieodwracalna** | odrzucone |

Przyznane: 4 ustępstwa, 24 du, `D(0) = 24.00`, `obs(0) = 0.760`.
Odrzucone: 4 kandydatury, 30 du.
Żadne przyznane ustępstwo nie narusza wpisu z `40-NONNEGOTIABLE.md`:
`CON-A-03` zachowuje `NN-A-02` (ustępuje FIFO, nie atrybucyjność),
`CON-A-05` zachowuje `NN-A-10` (deklaracja przed commitem),
`CON-A-07` zachowuje `INV-A-09` (propagacja flagi),
`CON-A-01` osłabia `INV-A-02` z pomiaru do klasyfikacji, ale nie usuwa oznaczenia.

---

*Agent A · tor II · Justice-as-Code v1.0*
