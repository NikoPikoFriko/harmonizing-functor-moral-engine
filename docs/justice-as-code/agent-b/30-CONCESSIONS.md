# AGENT B · `30-CONCESSIONS.md` — księga ustępstw (tor II)

**Reguła nadrzędna (§0 protokołu).** Ten plik **nie edytuje toru I**. `00-MODEL.md`, `10-SPEC.md`,
`20-DYNAMICS.md`, `50-RESOURCES.md` pozostają nietknięte. Ustępstwo jest **zapisem księgowym**,
nie poprawką modelu. Jeżeli ustępstwo jest kosztowne, wpis to odnotowuje i model dalej twierdzi swoje.

**Wobec czego ustępuję.** Nie czytałem artefaktów innych agentów (§8.4 protokołu). Ustępuję wobec
**klas wymagań**, jakie narzucają dwie soczewki wskazane w zadaniu:
- **(K1) systemy rozproszone / konsensus** — liveness ponad safety w warunkach asynchronii, prawda jako
  zgoda kworum, spójność ostateczna zamiast silnej, semantyka co-najmniej-raz z idempotencją,
  tolerancja bizantyjska przy `f < n/3`, zegary logiczne;
- **(K2) teoria sterowania / projektowanie mechanizmów** — różniczkowalna funkcja straty, setpoint
  z tolerancją zamiast twardego niezmiennika, estymacja stanu z obserwacji zaszumionych,
  incentive compatibility ponad trafność pojedynczego rozstrzygnięcia, tłumienie przez strojenie
  wzmocnień zamiast dobudowywania brakującej krawędzi.

**Jednostka kosztu.** `vbit` (`50-RESOURCES.md §5`): `c = log₂(|B_{S'}| / |B_S|)` — logarytm z tego,
o ile ustępstwo poszerza zbiór zachowań dopuszczanych przez model. Budżet całkowity `H₀ = 26 vbit` `[EST]`.

---

## `CON-B-01`

```
CON-B-01
  etap:            S5
  ustępuję:        wymóg, by dowód poprzedzał commit; przyjmuję, że finalizacja może nastąpić
                   przed zamknięciem wyprowadzenia. Rezygnuję z NON_LIQUET jako wartości
                   BLOKUJĄCEJ (nie: jako wartości reprezentowanej — to zostaje, NN-B-01).
  na rzecz:        (K1) liveness w warunkach asynchronii. Nie mogę wymagać, żeby węzeł czekał
                   na dowód, którego dostarczenie nie ma ograniczenia czasowego — to jest
                   dokładnie warunek, w którym FLP zabrania deterministycznej terminacji.
  mechanizm:       decide zwraca Judgment ZAWSZE, ale z obowiązkowym polem
                     soundness: "proved" | "assumed" | "coerced"
                     blame:     ActorId                       // NN-B-03 nie jest oddane
                   Commit z soundness ≠ "proved" jest ważny i wykonalny, ale policzalny.
  koszt_natychmiastowy: 3.2 vbit  [EST]
                   Wyliczenie: model TLA+ z 10-SPEC §4 przy k ≈ 10 rozróżnialnych dyspozycjach
                   i d ≈ 1 wyprowadzalnej: log₂(10/1) = 3.32; zaokrąglone w dół, bo etykieta
                   soundness odzyskuje część wykluczeń (obserwator wie, którym wynikom nie ufać).
  kumulacja:       klasa E (wykładnicza), g = 0.15 / rok.
                   c₀₁(t) = 3.2 · e^{0.15 t}. Wykładnicza, bo LOOP-B-02 (reputation_coupling)
                   wzmacnia: im więcej commitów "coerced" przechodzi bez uchylenia, tym niższy
                   próg następnego. Okres podwojenia: ln2/0.15 ≈ 4.6 roku.
  wykrywalność:    coerced_rate = |{orzeczenia: soundness ≠ "proved"}| / |orzeczenia|.
                   Próg alarmowy: 0.05. Druga metryka: reversal_rate(coerced) / reversal_rate(proved);
                   jeśli iloraz ≈ 1, znaczy że instancja wyższa też nie odróżnia — wtedy metryka
                   pierwsza traci wartość i trzeba audytu próbkowego.
  odwracalność:    częściowa. Cofnięcie wymaga przywrócenia blokującego NON_LIQUET, co unieważnia
                   doktrynę ostateczności dla spraw w toku. Koszt cofnięcia [EST]: 10⁵ spraw
                   w toku × koszt reotwarcia; rząd 10⁸–10⁹ PLN w skali kraju.
  warunek_odwołania: coerced_rate > 0.05  ∧  reversal_rate(coerced) > 2 · reversal_rate(proved)
                   Drugi koniunkt jest istotny: sam wysoki coerced_rate może oznaczać uczciwe
                   etykietowanie, nie degradację.
  alternatywa:     blokujące NON_LIQUET → sprawy bez terminacji (THM-B-11 pozbawiony nawet
                   bariery budżetowej). Koszt strony rośnie nieograniczenie. To jest droższe
                   i, co ważniejsze, przenosi cały koszt na najsłabiej finansowaną stronę.
```

---

## `CON-B-02`

```
CON-B-02
  etap:            S2
  ustępuję:        wyłączność Dec jako źródła rozstrzygalności. Przyjmuję, że fakt może być
                   ustalony przez zgodę kworum, a nie tylko przez procedurę decyzyjną.
  na rzecz:        (K1) "fakt = to, na co zgadza się kworum". Bez tego nie mam żadnego wspólnego
                   interfejsu na S2 — ich model synchronizacji stanu między nieufnymi węzłami
                   nie ma gdzie się zaczepić, jeśli upieram się, że stan ma jedno źródło prawdy.
  mechanizm:       Dec przeżywa jako TIE-BREAKER Z PRAWEM VETA, nie jako wyłączny konstruktor:
                     kworum ustala FactKey k
                     ALE: jeśli istnieje measurement m o asserts = k i uncertainty < τ,
                          kworum NIE MOŻE go przegłosować; może wyłącznie zażądać powtórzenia.
                   Czyli: oddaję monopol Dec, zachowuję jego asymetrię typową (NN-B-05).
  koszt_natychmiastowy: 2.0 vbit  [EST]
                   Wyliczenie: bez veta zbiór dopuszczalnych ustaleń dla faktu technicznego rośnie
                   z 1 (wynik pomiaru) do ~4 (wynik pomiaru + 3 typowe stanowiska stron/biegłych):
                   log₂ 4 = 2. Z vetem odzyskuję to dla podzbioru uncertainty < τ; koszt netto
                   dotyczy pomiarów o uncertainty ≥ τ, których udział [EST] ~50%.
  kumulacja:       klasa L (liniowa), ρ = 0.10 / rok.  c₀₂(t) = 2.0 · (1 + 0.10 t)
                   Liniowa, nie wykładnicza: τ jest progiem zapisanym, więc pełzanie jest
                   negocjacyjne (per nowelizacja), nie samowzmacniające.
  wykrywalność:    overrule_rate(Dec) = udział spraw, w których kworum ustaliło fakt sprzecznie
                   z pomiarem o uncertainty < τ. Próg: 0.01. Metryka wtórna: M-B-01 z THM-B-12
                   (udział sporów technicznych rozstrzygniętych powtórzeniem pomiaru).
  odwracalność:    pełna. Konstruktor Dec nie jest usuwany z typu, tylko traci wyłączność.
                   Cofnięcie = przywrócenie wyłączności, koszt: zmiana reguły dowodowej.
                   To jest jedyne ustępstwo z tej listy, którego cofnięcie jest tanie.
  warunek_odwołania: overrule_rate(Dec) > 0.01  ∨  M-B-01 spada poniżej 0.05
  alternatywa:     odmowa → brak wspólnego interfejsu na S2. Ich model nie ma czym opisać
                   postępowania dowodowego, mój nie ma czym opisać nieufności między węzłami.
                   Koszt: utrata całego etapu S2 ze scalenia, czyli więcej niż 2.0 vbit.
```

---

## `CON-B-03`

```
CON-B-03
  etap:            S8
  ustępuję:        dokładną inwalidację cache precedensów opartą na deps. Przyjmuję spójność
                   ostateczną z ograniczoną nieświeżością zamiast spójności silnej.
  na rzecz:        (K1) eventual consistency. Silna spójność cache wymagałaby zatrzymania
                   orzekania na czas propagacji każdej nowelizacji — w ich modelu to jest
                   zatrzymanie systemu na każdy zapis, czyli zerowa dostępność.
  mechanizm:       PrecedentEntry.decidedUnder pozostaje obowiązkowe (to zostaje z NN-B-04),
                   ale cytowanie wpisu stale generuje OSTRZEŻENIE, nie BŁĄD.
                   Ograniczenie nieświeżości: Δ = 1 cykl legislacyjny. Po Δ wpis wymaga
                   jawnego potwierdzenia aktualności przy cytowaniu.
  koszt_natychmiastowy: 1.6 vbit  [EST]
                   Wyliczenie: dopuszczam okno, w którym wynik zależy od tego, czy sąd zauważył
                   nowelizację. To ~3 dodatkowe dopuszczalne wyniki na sprawę dotkniętą:
                   log₂ 3 = 1.58.
  kumulacja:       klasa L, ρ = 0.10 / rok.  c₀₃(t) = 1.6 · (1 + 0.10 t)
                   ρ jest wprost tempem nowelizacji względem korpusu: 10³ zmian / 10⁴ jednostek.
  wykrywalność:    stale_citation_rate — udział uzasadnień cytujących orzeczenie zapadłe pod
                   wersją poza mocą w chwili zdarzenia. Próg: 0.03.
                   TO JEST JEDYNA METRYKA Z CAŁEJ KSIĘGI MIERZALNA DZIŚ, bez zmiany procedury:
                   przecięcie bazy orzeczeń z bazą wersji aktów.
  odwracalność:    pełna. deps można dobudować później; backfill Θ(cache) ≈ 10⁵–10⁶, jednorazowo.
  warunek_odwołania: stale_citation_rate > 0.03
  alternatywa:     silna spójność → każda nowelizacja blokuje cytowanie do czasu przeglądu cache;
                   przy 10³ nowelizacji/rok to permanentna blokada. Ściśle droższe.
```

---

## `CON-B-04`

```
CON-B-04
  etap:            S6
  ustępuję:        res judicata jako semantykę dokładnie-raz. Przyjmuję semantykę
                   co-najmniej-raz z kluczem idempotencji.
  na rzecz:        (K1) retry semantics. W ich modelu dokładnie-raz jest niemożliwe do zapewnienia
                   przy zawodnym kanale; standardowe rozwiązanie to at-least-once + idempotencja.
  mechanizm:       caseKey = H(strony, żądanie, fakty operatywne, wersja korpusu w chwili zdarzenia)
                   Ponowienie z tym samym caseKey MUSI zwrócić zmemoizowany Judgment.
                   Ponowienie jest dopuszczalne tylko przy zmianie któregoś składnika klucza —
                   co czyni "nowe okoliczności" pojęciem typowym, a nie uznaniowym.
  koszt_natychmiastowy: 0.8 vbit  [EST]  (najniższy w księdze)
                   Wyliczenie: poszerzenie o możliwość ponowienia zwiększa przestrzeń ścieżek
                   proceduralnych o ~1.7×: log₂ 1.7 = 0.77.
  kumulacja:       klasa P (progowa). c₀₄(t) = 0.8 dla śr. liczby ponowień ≤ 3;
                   skok do 4.0 vbit powyżej. Próg osiągany [EST] przy t ≈ 4 lata przy obecnym
                   tempie wzrostu zaskarżalności. Uzasadnienie skoku: powyżej 3 ponowień
                   idempotencja przestaje wiązać, bo klucz jest za łatwo zmieniany przez
                   przeredagowanie żądania.
  wykrywalność:    mean_retries_per_case; próg 1.5. Metryka wtórna: udział ponowień, w których
                   zmiana caseKey wynikała ze zmiany REDAKCJI żądania, a nie faktów.
  odwracalność:    częściowa. Klucz idempotencji raz wprowadzony staje się przedmiotem
                   optymalizacji przez strony (obchodzenie przez modyfikację żądania).
  warunek_odwołania: mean_retries_per_case > 1.5
  alternatywa:     ścisłe dokładnie-raz = res judicata w obecnej postaci, którą tor I już odrzucił
                   jako truncation bez gwarancji (THM-B-10). TO USTĘPSTWO POPRAWIA MÓJ MODEL,
                   a nie tylko go osłabia — odnotowuję to jawnie, bo księga ma być rzetelna,
                   nie tylko obronna.
```

---

## `CON-B-05`

```
CON-B-05
  etap:            S4 / S5
  ustępuję:        Judgment jako czysty typ sumaryczny BEZ metryki. Przyjmuję częściowe
                   osadzenie ilościowe.
  na rzecz:        (K2) różniczkowalna funkcja straty. Bez metryki nie ma gradientu, bez gradientu
                   nie ma sterowania ani projektowania mechanizmu. To jest ich warunek wstępny,
                   nie preferencja.
  mechanizm:       BARIERA TYPOWA. Metryka definiowana WYŁĄCZNIE w obrębie konstruktora:
                     d(grant{a}, grant{b}) = |a − b|          -- zdefiniowane
                     d(grant{_}, deny)     = ⊥                -- NIEZDEFINIOWANE, i to jest w typie
                   Osadzenie obejmuje podprzestrzeń ilościową (kwota, termin, koszty).
                   Przejście między konstruktorami pozostaje nieciągłe i niemetryzowalne.
  koszt_natychmiastowy: 4.5 vbit  [EST]  — NAJWYŻSZY W KSIĘDZE
                   Wyliczenie: metryka na kwotach dopuszcza interpolację, więc zbiór dopuszczalnych
                   rozstrzygnięć rośnie z ~3 wyprowadzalnych kubełków do ~70 osiągalnych przez
                   "wyważenie": log₂(70/3) = 4.54.
  kumulacja:       klasa E, g = 0.25 / rok — NAJSZYBSZA W KSIĘDZE.
                   c₀₅(t) = 4.5 · e^{0.25 t}. Okres podwojenia 2.8 roku.
                   Uzasadnienie wykładniczości: gdy metryka istnieje i jest opublikowana,
                   presja optymalizacyjna rozszerza ją poza barierę typową. Strony zaczynają
                   wyceniać "wartość ugodową" grant vs deny, a wycena jest de facto metryką
                   międzykonstruktorową — wprowadzoną przez rynek, nie przez specyfikację.
  wykrywalność:    pojawienie się publikowanych modeli wyceny sporu przecinających konstruktory
                   (np. "oczekiwana wartość sprawy" mieszająca P(grant) z kwotą). Próg: istnienie
                   choćby jednego szeroko cytowanego modelu tego typu.
  odwracalność:    ŻADNA. Opublikowanej metryki nie da się cofnąć: jest używana przez strony
                   niezależnie od tego, czy system ją uznaje. To jedyny wpis z odwracalnością "none",
                   i dlatego jedyny, przy którym mechanizm zawiera twardą barierę zamiast progu.
  warunek_odwołania: BRAK — nie da się odwołać. Zamiast tego: TWARDY LIMIT ZAKRESU.
                   Ustępstwo obowiązuje wyłącznie dla podprzestrzeni ilościowej. Rozszerzenie
                   na konstruktory wymagałoby nowego wpisu, którego z góry nie udzielam
                   (patrz agent.json/open_conflicts_expected[2]).
  alternatywa:     odmowa całkowita → soczewka (K2) nie ma czym operować na S5; ich cały aparat
                   (setpoint, gradient, kompensator) jest nieaplikowalny. Koszt: utrata S4/S5
                   ze scalenia. Ale uwaga: koszt odmowy jest JEDNORAZOWY i odwracalny,
                   a koszt ustąpienia jest nieodwracalny i wykładniczy. To jest jedyny wpis,
                   przy którym nie jestem pewien, czy księgowanie jest właściwą decyzją,
                   i odnotowuję tę niepewność zamiast ją ukrywać. Wpisuję FALSE-COMMENSURATION
                   jako ryzyko rezydualne (CONSENSUS-PHASE §4).
```

---

## `CON-B-06`

```
CON-B-06
  etap:            S3
  ustępuję:        niezmienniki jako predykaty twarde. Przyjmuję ograniczenia miękkie z tolerancją ε.
  na rzecz:        (K2) setpoint + tolerancja. Przy twardych predykatach ich regulator nie ma
                   zbioru dopuszczalnego o niepustym wnętrzu — nie da się stabilizować układu,
                   w którym każde odchylenie jest naruszeniem.
  mechanizm:       Invariant zyskuje pola:
                     class: "hard" | "soft"
                     tolerance: number        // tylko dla soft
                   PARTYCJA JEST WIĄŻĄCA: wszystkie niezmienniki wymienione w 40-NONNEGOTIABLE.md
                   (INV-B-01, -03, -05, -06, -07, -08) są przypisane do "hard" i nie mogą
                   być przeklasyfikowane inaczej niż przez obalenie odpowiedniego NN-B-*.
  koszt_natychmiastowy: 2.4 vbit  [EST]
                   Wyliczenie: tolerancja na 3 niezmiennikach "soft" × ~1.7 dopuszczalnych stanów
                   każdy: 3 · log₂ 1.7 ≈ 2.3.
  kumulacja:       klasa L, ρ = 0.20 / rok — NAJSZYBSZA WŚRÓD LINIOWYCH.
                   c₀₆(t) = 2.4 · (1 + 0.20 t)
                   Uzasadnienie wysokiego ρ: pełzanie tolerancji (tolerance creep) jest dobrze
                   udokumentowanym trybem awarii systemów z progiem miękkim — próg akceptowany
                   w okresie t staje się punktem odniesienia w t+1.
  wykrywalność:    ε_efektywne / ε_deklarowane, mierzone jako 95. percentyl faktycznych odchyleń
                   podzielony przez zadeklarowaną tolerancję. Próg: 2.0.
                   Metryka wtórna: liczba niezmienników przeklasyfikowanych hard → soft w okresie.
  odwracalność:    częściowa. Przywrócenie twardości jest technicznie trywialne, ale wymaga
                   unieważnienia stanów mieszczących się w tolerancji, a już przyjętych.
  warunek_odwołania: ε_efektywne / ε_deklarowane > 2.0  ∨  jakikolwiek NN-* przeklasyfikowany na soft
  alternatywa:     tylko twarde predykaty → zbiór dopuszczalny (K2) ma puste wnętrze,
                   regulator nieistnieje. Odmowa kosztuje im cały aparat na S3.
```

---

## `CON-B-07`

```
CON-B-07
  etap:            S1..S5
  ustępuję:        bezpośrednią instrumentację ρ_a (gęstości assume). Przyjmuję estymację
                   statystyczną z proxy.
  na rzecz:        (K2) estymacja stanu z obserwacji zaszumionych. Ich model nie wymaga
                   bezpośredniego pomiaru stanu wewnętrznego; wymaga obserwowalności w sensie
                   istnienia estymatora. Upieranie się przy instrumentacji blokowałoby pomiar
                   CAŁKOWICIE do czasu zmiany szablonu uzasadnień.
  mechanizm:       ρ̂_a estymowane z opublikowanych uzasadnień: zliczanie rodziny fraz
                   z 50-RESOURCES §2 ("w ocenie Sądu", "Sąd dał wiarę", ...) na liczbę
                   cytowanych przepisów, z przedziałem ufności i kalibracją na próbie audytowej.
  koszt_natychmiastowy: 1.2 vbit  [EST]  +  bias systematyczny O NIEZNANYM ZNAKU
                   Wyliczenie: estymator dopuszcza ~2.3× szerszy zbiór stanów zgodnych
                   z obserwacją niż pomiar bezpośredni: log₂ 2.3 = 1.2.
                   Bias: fraza może być rytualna (zawyża) albo assume może być milczące (zaniża).
                   Nie znam znaku i tego nie ukrywam.
  kumulacja:       klasa D (zanikająca), T½ = 3 lata, POD WARUNKIEM że instrumentacja
                   bezpośrednia zostanie dobudowana.  c₀₇(t) = 1.2 · 2^{−t/3}
                   Jeśli nie zostanie: klasa staje się stałą, c₀₇(t) = 1.2.
                   Odnotowuję to jako warunkowość, bo księga bez wpisów zanikających
                   byłaby księgą tendencyjną — nie każde ustępstwo jest zapadką.
  wykrywalność:    rozbieżność ρ̂_a od ρ_a mierzonego na próbie audytowej (ręczne parsowanie
                   wyprowadzeń, n ≈ 200 uzasadnień). Próg: 30% względnie.
  odwracalność:    pełna. Estymator jest dodatkiem, nie zamiennikiem; instrumentacja bezpośrednia
                   go zastępuje bez kosztu przejścia.
  warunek_odwołania: dostępna instrumentacja bezpośrednia (INV-B-01 wdrożony)  ∨  rozbieżność > 30%
  alternatywa:     brak jakiegokolwiek pomiaru — czyli stan obecny. Ściśle gorsze:
                   estymator z nieznanym biasem niesie więcej informacji niż jej brak.
```

---

## `CON-B-08`

```
CON-B-08
  etap:            S4
  ustępuję:        jednoinstancyjny model orzekającego (n = 1) jako przypadek bazowy.
                   Przyjmuję ramę bizantyjską z f < n/3.
  na rzecz:        (K1) tolerancja bizantyjska. Ich twierdzenia nie mają treści dla n = 1;
                   mój model n = 1 jest szczególnym przypadkiem ich ramy.
  mechanizm:       Judge → Panel<n>. majesty_token staje się zasobem per-panel z wymaganym
                   śladem przypisania (który członek panelu, jaki blame). To WZMACNIA NN-B-03,
                   bo panel wymusza jawność tego, co przy n = 1 mogło zostać milczące.
  koszt_natychmiastowy: 0.6 vbit  [EST]
                   Wyliczenie: uogólnienie n = 1 → n ≥ 1 poszerza przestrzeń konfiguracji,
                   ale nie poszerza przestrzeni WYNIKÓW: log₂ 1.5 = 0.58, prawie wyłącznie
                   z niejednoznaczności "który członek panelu odpowiada".
  kumulacja:       klasa D z T½ = ∞, czyli STAŁA: c₀₈(t) = 0.6.
                   Nie rośnie, bo rama bizantyjska jest domknięta — nie ma mechanizmu pełzania.
  wykrywalność:    n/d — ustępstwo nie ma trybu szkodliwego, który wymagałby monitorowania.
  odwracalność:    pełna i darmowa (n = 1 pozostaje instancją Panel<1>).
  warunek_odwołania: brak potrzeby.
  alternatywa:     upieranie się przy n = 1 → odmowa uogólnienia, którego mój model jest
                   przypadkiem szczególnym. Byłoby to ustępstwo pozorne w drugą stronę:
                   obrona węższości bez zysku. Odnotowuję ten wpis w księdze mimo ujemnego
                   sprzężenia z CON-B-01 (patrz κ poniżej), bo zaniechanie księgowania
                   ustępstw KORZYSTNYCH byłoby SILENT-WEAKENING w odwrotną stronę.
```

---

## `CON-B-09`

```
CON-B-09
  etap:            S7
  ustępuję:        ścisłą segregację efektów ubocznych w jawnym typie efektu.
                   Przyjmuję ramę "wyjścia regulatora" z nasyceniem.
  na rzecz:        (K2) egzekucja jako ciągłe sterowanie, nie jako dyskretny efekt.
  mechanizm:       Effect zachowuje typ, ale zyskuje pole saturation: number,
                   opisujące granicę, powyżej której zwiększanie sygnału nie zwiększa skutku
                   (np. egzekucja z majątku, którego nie ma).
  koszt_natychmiastowy: 1.0 vbit  [EST]
                   Wyliczenie: nasycenie wprowadza obszar, w którym różne wyroki dają ten sam
                   skutek świata: log₂ 2 = 1.0.
  kumulacja:       klasa L, ρ = 0.05 / rok.  c₀₉(t) = 1.0 · (1 + 0.05 t)
  wykrywalność:    udział czynności egzekucyjnych poza zadeklarowanym typem efektu. Próg: 0.02.
  odwracalność:    pełna.
  warunek_odwołania: udział > 0.02
  alternatywa:     odmowa → (K2) nie ma czym opisać S7. Koszt niewielki po obu stronach;
                   to najmniej sporne ustępstwo w księdze.
```

---

## Model kumulacji łącznej

### Wzór

$$D(t) \;=\; \sum_{i} c_i(t) \;+\; \sum_{i<j} \kappa_{ij}\,\sqrt{c_i(t)\,c_j(t)}$$

**Człon pierwszy** — suma kosztów indywidualnych, każdy ze swoją funkcją narastania.
**Człon drugi** — sprzężenie. `vbity` są addytywne **tylko dla ustępstw niezależnych**;
gdy jedno ustępstwo usuwa kontrolę, która wyłapywałaby skutki drugiego, koszt łączny przewyższa sumę.
Postać `√(c_i c_j)` (średnia geometryczna) jest wyborem najprostszym z właściwym zachowaniem
granicznym: znika, gdy którykolwiek koszt znika, i jest jednorodna stopnia 1, więc nie zmienia
wymiaru. `κ_ij` może być ujemne — wtedy ustępstwa się nawzajem osłabiają.

### Funkcje narastania

| ID | `c_i(0)` | klasa | parametr | `c_i(t)` |
|----|----------|-------|----------|----------|
| `CON-B-01` | 3.2 | E | `g = 0.15/rok`, `T₂ₓ = 4.6 lat` | `3.2·e^{0.15t}` |
| `CON-B-02` | 2.0 | L | `ρ = 0.10/rok` | `2.0·(1+0.10t)` |
| `CON-B-03` | 1.6 | L | `ρ = 0.10/rok` | `1.6·(1+0.10t)` |
| `CON-B-04` | 0.8 | P | skok do 4.0 przy `retries > 3`, `t ≈ 4` [EST] | schodkowa |
| `CON-B-05` | 4.5 | E | `g = 0.25/rok`, `T₂ₓ = 2.8 lat` | `4.5·e^{0.25t}` |
| `CON-B-06` | 2.4 | L | `ρ = 0.20/rok` | `2.4·(1+0.20t)` |
| `CON-B-07` | 1.2 | D | `T½ = 3 lata` (warunkowo) | `1.2·2^{−t/3}` |
| `CON-B-08` | 0.6 | D | `T½ = ∞` | `0.6` |
| `CON-B-09` | 1.0 | L | `ρ = 0.05/rok` | `1.0·(1+0.05t)` |

### Macierz sprzężeń `κ` (tylko niezerowe)

| para | `κ` | uzasadnienie behawioralne |
|---|---|---|
| `01 × 06` | **+0.5** | commit bez dowodu + niezmienniki miękkie: nie zostaje **żaden** twardy predykat, który wyłapałby `coerced` |
| `01 × 07` | **+0.4** | commit bez dowodu + tylko estymowana `ρ̂_a`: metryka wykrywcza dla `CON-B-01` sama jest estymatorem z nieznanym biasem |
| `02 × 05` | **+0.6** | fakt z kworum + metryka na wyniku: „ustalmy kwotę, na którą się zgadzamy” — rozstrzygalność omijana z obu stron naraz |
| `03 × 04` | **+0.3** | stale cache + ponowienia: ponowienie trafia w ten sam nieświeży wpis, więc idempotencja utrwala nieświeżość |
| `01 × 08` | **−0.3** | panel z przypisaniem `blame` **ogranicza** szkodę z niedowodzonego commitu — jedyne sprzężenie ujemne |

### Rachunek

**`D(0)`:**

```
Σ c_i(0)  = 3.2+2.0+1.6+0.8+4.5+2.4+1.2+0.6+1.0            = 17.30
Σ κ:  0.5·√(3.2·2.4) = 0.5·2.771 = +1.386
      0.4·√(3.2·1.2) = 0.4·1.960 = +0.784
      0.6·√(2.0·4.5) = 0.6·3.000 = +1.800
      0.3·√(1.6·0.8) = 0.3·1.131 = +0.339
     −0.3·√(3.2·0.6) = −0.3·1.386 = −0.416
                                                Σκ(0)     =  3.89
────────────────────────────────────────────────────────────────
D(0) = 21.19 ≈ 21.2 vbit          przy  H₀ = 26 vbit  →  81.5 % budżetu
```

**Trajektoria:**

| `t` [lata] | `Σ c_i(t)` | `Σ κ` | `D(t)` | `D/H₀` |
|---|---|---|---|---|
| 0 | 17.30 | 3.89 | **21.19** | 81.5 % |
| 1 | 19.74 | 4.44 | **24.17** | 93.0 % |
| 1.5 | 21.14 | 4.73 | **25.87** | 99.5 % |
| **1.6** | 21.43 | 4.79 | **26.23** | **100.9 %** ← przekroczenie |
| 2 | 22.68 | 5.05 | **27.73** | 106.7 % |

### Trzy liczby wymagane przez `CONSENSUS-PHASE.md §3`

**1. `D(0) = 21.2 vbit`** — koszt natychmiastowy samej możliwości współdziałania,
**81.5 %** budżetu falsyfikowalności `H₀ = 26 vbit`.
Interpretacja: zestaw ustępstw potrzebnych **wyłącznie po to, żeby trzy soczewki miały wspólny interfejs**,
zjada cztery piąte zdolności modelu do wykluczania obserwacji, **zanim upłynie jakikolwiek czas**.

**2. `t* ≈ 1.55–1.6 roku`** — moment przekroczenia progu `D(t) ≥ H₀`.
Po nim zbiór zachowań dopuszczanych przez model scalony pokrywa się z `B_all`: model nie wyklucza
żadnej obserwacji, entropia specyfikacji spada do zera, model przestaje odpowiadać na pytanie,
dla którego powstał. **Dominujący wkład: `CON-B-05` (`g = 0.25`) i `CON-B-01` (`g = 0.15`)** —
oba wykładnicze, oba na `S5`. Gdyby usunąć samo `CON-B-05`, `t*` przesuwa się poza 4 lata
(`D(4) ≈ 24.9` bez wpisu 05 i bez jego sprzężenia z 02).

**3. `N* = 2`** — liczba **dodatkowych** ustępstw przeciętnej wielkości do progu, licząc od `t = 0`.
Wyliczenie: koszt krańcowy typowego kolejnego wpisu = średnia `c̄ = 17.3/9 = 1.92 vbit`
plus średni wkład sprzężeniowy `3.89/9 = 0.43 vbit` = **2.35 vbit**.
`(26 − 21.2) / 2.35 = 2.04`. Przy `t = 1` mamy `N* = (26 − 24.17)/2.35 = 0.8`, czyli **zero**.

### Kwalifikacja scalenia

`N*` jest **rzędu jedności**, więc zgodnie z `CONSENSUS-PHASE.md §3` scalenie musi zostać oznaczone
**`FRAGILE`**. Zgodnie z tym samym paragrafem **jest to wynik badawczy, nie usterka procesu**:
pokazuje, że trzy soczewki mają za mało wspólnej struktury, żeby znieść współpracę bez utraty treści.

W języku tej soczewki: **trzy modele nie mają wspólnego podtypu o niepustym zbiorze mieszkańców.**
Wspólny interfejs, który dla wszystkich trzech jest implementowalny, jest tak słaby, że nie wyklucza
niczego — czyli jest typem `unknown`. Scalenie do `unknown` jest zawsze możliwe i zawsze bezwartościowe.

### Wrażliwość i uczciwość rachunku

- **`H₀ = 26 vbit` jest `[EST]`** (`50-RESOURCES §5`, `ASSUMPTION-B-05`). Skaluje się logarytmicznie:
  błąd rzędu wielkości w `|B_all|` zmienia `H₀` o `±3.3 vbit`, czyli `t*` o `± ~0.5 roku`.
  Wniosek `FRAGILE` jest odporny na ten błąd, bo `D(0)/H₀ ∈ [72%, 93%]` w całym przedziale.
- **`κ_ij` są zgadywane.** Nie mam danych. Gdyby wszystkie `κ = 0` (ustępstwa niezależne),
  `D(0) = 17.3` (66.5 %) i `t* ≈ 2.6 roku`. Wniosek `FRAGILE` przetrwałby, `N*` wzrósłby do 4.
- **Kierunek błędu jest znany i niekorzystny dla mnie:** wyceniałem własne ustępstwa,
  więc systematyczna tendencja jest do **zawyżania** ich kosztu (obrona toru I).
  Kontrola: `CON-B-04` i `CON-B-08` zostały wycenione **nisko** i jawnie oznaczone jako korzystne
  dla mojego modelu, żeby księga nie była jednostronna.
- **Czego ten rachunek NIE mierzy:** nie mierzy, czy model scalony jest *lepszy* w rozstrzyganiu spraw.
  Mierzy wyłącznie jego **falsyfikowalność**. Model o zerowej falsyfikowalności może być użyteczny
  operacyjnie i bezwartościowy poznawczo — i to jest dokładnie ta możliwość, którą badamy w systemie prawnym.

---

*Agent B · tor II · `30-CONCESSIONS.md`*
