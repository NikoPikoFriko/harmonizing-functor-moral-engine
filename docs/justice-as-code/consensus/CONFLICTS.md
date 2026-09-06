# CONFLICTS.md — kwalifikacja i rozstrzygnięcie konfliktów `RIVAL`

Faza konsensusowa, Krok 2. Każdy `RIVAL` ma etykietę `DECIDABLE` / `EMPIRICAL` / `FOUNDATIONAL`.
`DECIDABLE` niesie dowód. `EMPIRICAL` niesie projekt eksperymentu (co mierzyć, jaki próg, jaki
wynik obala którą stronę). `FOUNDATIONAL` niesie obie gałęzie z warunkami stosowalności i ceną.

**Bilans: 25 pozycji `RIVAL` — 17 `DECIDABLE`, 5 `EMPIRICAL`, 3 `FOUNDATIONAL`.**
**Żaden `NN-*` nie został obalony ani pominięty.** Obalono 9 jawnie sformułowanych twierdzeń **nie**
będących `NN-*`: 5 przesłanek ustępstw i 4 przewidywania agentów o pozostałych soczewkach
(spis w `merged.json → nonnegotiables_status.refuted_non_nn_claims`). Skutkiem tych obaleń oraz
siedmiu dalszych negatywnych wyników Testu P (§0) status `VOID-PREMISE-FAILED` dostaje **14 z 22**
przyznanych ustępstw; w mocy zostaje **8**.

---

## 0. Test przesłanki (narzędzie użyte w 12 z 17 pozycji `DECIDABLE`)

Dwanaście konfliktów ma postać: agent X zaksięgował ustępstwo „na rzecz" wymagania, którego
soczewka-adresat **nie stawia**. `CONSENSUS-PHASE §3` R3 dopuszcza usunięcie przeszkody wyłącznie
przez formalne obalenie, w tym przez **„wykazanie, że przesłanka nie zachodzi"**. Test:

> **Test P.** Przesłanka ustępstwa `CON-X-nn` zachodzi wtedy i tylko wtedy, gdy istnieje jawne
> wymaganie `R` w artefaktach suwerennych innego agenta takie, że (a) `R` jest postawione jako
> **konieczne** (`NN-*`, `INV-*` albo hipoteza twierdzenia), oraz (b) suwerenna pozycja X jest
> z `R` niezgodna.

Jeżeli Test P wypada negatywnie, ustępstwo dostaje status **`VOID-PREMISE-FAILED`**: **pozostaje
w księdze wraz z pełną treścią**, ale nie wchodzi do `D_total` i nie osłabia modelu X.
To nie jest kompromis ani unieważnienie autorytatywne — to obalenie przesłanki, z cytatem.

**Zakres testu jest zamknięty do trzech soczewek** (`ASSUMPTION-M-01`). Przy dołączeniu czwartej
soczewki przesłanka może odżyć; wtedy wpis wraca do księgi bez zmiany treści. Warunek jest podany
przed poznaniem wyniku, więc nie jest `SCOPE-ESCAPE`.

**Kierunek błędu tego narzędzia jest znany i niekorzystny dla orkiestratora:** Test P systematycznie
zaniża `D_total`, bo działa tylko w jedną stronę (unieważnia wpisy, nie dodaje ich). Kontrola:
`DRIFT-LEDGER.md` podaje **obie** księgi — przed testem i po nim — a `MERGE-COST` (`MRG-01`,
`MRG-03`) dokłada koszty, których nie zaksięgował żaden agent.

---

## 1. `DECIDABLE` — rozstrzygnięte z dowodem

### `CONF-D-01` — liveness w `S4`: przesłanka obalona (`CON-C-07`, `CON-B-01`)

**Spór.** C ustępuje z prawa do nierozstrzygnięcia, przyjmując „wymóg liveness — deficyt pokrywany
autorytetem na kredyt" (`CON-C-07`, koszt 0.075 caseload-kw, kumulacja wykładnicza `h = 16 kw`
— najszybsza w księdze, odwracalność **`none`**, **40.3 % całego dryfu C**). B ustępuje z „dowodu
przed commitem", powołując się na FLP (`CON-B-01`, 3.2 vbit, wykładnicza `g = 0.15/rok`).
Adresatem obu jest soczewka konsensusowa (K1 = A).

**Rozstrzygnięcie: przesłanka nie zachodzi, i to z dwóch niezależnych powodów.**

**(1) Powołanie się na FLP jest nieprawidłowym zastosowaniem twierdzenia.** FLP orzeka
niemożliwość deterministycznego konsensusu w systemie asynchronicznym **przy `n ≥ 2` procesach,
z których co najmniej jeden może ulec awarii (`f ≥ 1`)**. Model A ma jawnie `n = 1`, więc
`f_max = 0` (`agent-a/agent.json thesis`, `00-MODEL §1.1`). Hipotezy FLP nie zachodzą. Co więcej,
przy `n = 1` konsensus jest rozwiązywalny trywialnie (jedyny proces decyduje o własnym wejściu),
więc **nie ma żadnej przeszkody FLP do obejścia**.

**(2) A nie żąda liveness; A żąda oznaczenia.** `NN-A-07`, dosłownie:
> „Przy `P(wykrycie) → 0` nieujawnienie faktu szkodliwego jest strategią dominującą, więc fakt nie
> należy do przecięcia kworów i zbieżność jest formalnie niemożliwa. **Nie żądam zbieżności tam,
> gdzie jest niemożliwa — żądam oznaczenia.**"

Dalej: `RES-A-01` opisuje brak ścieżki out-of-gas jako **defekt** („przy wyczerpaniu nie out-of-gas,
tylko fork"), `PRIM-A-11` — że `chargeUnchecked` **nie ma konstruktora błędu**, również jako defekt.
A żąda zatem dokładnie tego, co C oddaje: reprezentowalnego wyniku „brak pokrycia".

**(3) Rzeczywista przeszkoda jest zasobowa, nie logiczna, i obie soczewki już ją modelują.**
`THM-B-11`: terminowanie jest wymuszane wyczerpaniem zasobu, więc zakończenie sprawy jest własnością
budżetów stron. To jest argument o **zasobie**, nie dowód niemożliwości, i jego poprawną obsługą
jest ścieżka out-of-gas — czyli `NN-B-01` (`NON_LIQUET` jako wartość reprezentowalna), którego B
nie oddaje.

**Skutek.** `CON-C-07` → `VOID-PREMISE-FAILED`. `CON-B-01` → `VOID-PREMISE-FAILED`.
`NN-B-01` przetrwał nienaruszony i został **wzmocniony**: `NN-A-07` żąda tego samego z innej
soczewki. W scalonej maszynie `S4`/`S5` istnieją **obie** krawędzie wyjścia: `NON_LIQUET`
(reprezentowany) oraz `mode = authority` z pełną księgowością (`INV-A-06` + `NN-B-03` + `NN-C-05`).
Scalony model jest tu **silniejszy** niż każdy suwerenny, bo nie musi wybierać.

**Obserwacja meta.** Dwaj agenci, niezależnie i bez czytania siebie nawzajem, zapłacili łącznie
3.2 vbit i 0.075 caseload-kw (odpowiednio 15 % i 40 % swoich dryfów) za wymaganie, którego adresat
nigdy nie wystawił. Oba ustępstwa są antycypacyjne. `CON-C-07` ma odwracalność `none`.

---

### `CONF-D-02` — finality w `S5`: przesłanka obalona (`CON-C-02`)

**Spór.** C oddaje tezę, że commit nie kończy błędu, na rzecz „dowodów safety i liveness soczewki R,
które wymagają punktu finalności; bez niego nie ma czego dowodzić" (0.060 caseload-kw, wykładnicza
`h = 24 kw`, 18.1 % dryfu C).

**Rozstrzygnięcie: przesłanka nie zachodzi.**

**(1) Własności safety nie wymagają punktu finalności.** Własność safety jest zbiorem śladów
domkniętym na prefiksy: jej naruszenie jest świadkowane skończonym prefiksem (charakteryzacja
Alperna–Schneidera). Dowód safety nie potrzebuje punktu, w którym ślad się kończy. Model A stosuje
to wprost: `INV-A-01` jest egzekwowane na `S1..S8`, a nie „do `S5`".

**(2) Liveness nie jest wymagane — patrz `CONF-D-01`.**

**(3) A twierdzi wprost, że błąd trwa po commicie.** `LOOP-A-03` (`stage_corruption`) ma znak `+`
i **brak członu wycofania**, z warunkiem rozbiegania „zawsze — nie istnieje operacja wycofania tezy
prawnej z powodu wadliwości podstawy faktycznej sprawy źródłowej". `RES-A-06`: `floorStage = S3`
leży **wyżej** niż źródło defektów (`S1`/`S2`). `INV-A-07` zakłada istnienie rollbacku **po**
commicie. B zgadza się niezależnie: `THM-B-10` — `res judicata` to **truncation**, nie widening,
„daje terminowanie bez żadnej gwarancji na relację wyniku do stanu konkretnego".

**Skutek.** `CON-C-02` → `VOID-PREMISE-FAILED`. Integrator `E` **pozostaje we wspólnym interfejsie**.
To jest przesłanka `MRG-03` — patrz `CONF-D-16`.

---

### `CONF-D-03` — `NN-A-04` (skalibrowana pewność liczbowa) kontra soczewka typów

**Spór zapowiedziany przez A.** A przewiduje, że B zażąda sumy typów `{evidence|authority}` zamiast
liczby, bo enum jest statycznie rozstrzygalny, a kalibracja nie. A odmawia: bez liczby nie ma
Brier score, więc nie istnieje sprzężenie korygujące kalibrację.

**Rozstrzygnięcie: konflikt nie istnieje — przewidywanie A jest falsyfikowane przez artefakty B.**

- `NN-B-05`: „`Dec` nie może być wymazane przez `admit`; **pomiar o niepewności poniżej `τ`**
  podważalny wyłącznie powtórnym pomiarem." Wielkość `niepewność` z progiem `τ` jest **liczbą**,
  nie enumem.
- `INV-B-07`: „`Dec` o **niepewności poniżej `τ`** nie jest przeważane przez większość `Claimów`."
  Znów liczba i próg.
- `PRIM-B-03`: tylko konstruktor `measurement` niesie `Dec`, czyli rozstrzygalność **i refutację**.

B nie żąda enuma zamiast liczby. B żąda liczby **przy dowodzie**, A żąda liczby **przy wyroku**.
Są to dwa różne miejsca tego samego wymagania i wchodzą do scalenia oba.

**Co B rzeczywiście broni**, i co A pomylił z powyższym: `PRIM-B-10 Judgment` jest typem sumarycznym
**bez metryki międzykonstruktorowej** — nie ma odległości `grant ↔ deny`. To jest twierdzenie
o **przestrzeni wyników**, nie o **pewności co do podstawy faktycznej**. `calibrated.support ∈ [0,1]`
agenta A jest wiarygodnością ustalenia, nie odległością między wyrokami. **Niesprzeczne.**

**Skutek.** `NN-A-04` przetrwał nienaruszony. `CON-A-02` (oddanie liczby na rzecz enuma) było już
przez A **odrzucone** — odrzucenie potwierdzone jako trafne, choć z innego powodu niż podany przez A
(A odrzucił z powodu budżetu rodziny `observability`; właściwym powodem jest brak adresata).

**Reszta sporu, rozstrzygnięta konstruktywnie.** A wyprowadził (`THM-A-05`), że emisja pewności jest
sprzeczna z równowagą **przy binarnej egzekucji w `S7`**, i odmówił ustąpienia, bo właściwym
wnioskiem jest „zmień `S7`". Scalenie dostarcza tę zmianę: `CON-B-09` dodaje `Effect.saturation`,
czyli ciągły wymiar natężenia egzekucji. Przy egzekucji stopniowanej wypłata z emisji wysokiej
pewności rośnie, więc nieemisja przestaje być strategią dominującą. **Wniosek A jest realizowany
przez ustępstwo B, którego B nie kierował do A.** Patrz `AGREEMENTS.md AGR-02` i `MERGED-SPEC.md §S7`.

---

### `CONF-D-04` — safety kontra performance: różnica pozorna

**Spór zapowiedziany przez A.** „Soczewka sterowania będzie traktować niezmienniki jako ograniczenia
miękkie podlegające tradeoffowi. Nie ustąpię dla `INV-A-01`, `INV-A-03` i `RES-A-10`." Symetrycznie
B ustępuje z twardych predykatów na rzecz partycji hard/soft (`CON-B-06`, 2.4 vbit), bo „przy
twardych predykatach ich regulator nie ma zbioru dopuszczalnego o niepustym wnętrzu".

**Rozstrzygnięcie: `FOUNDATIONAL` odrzucone — różnica jest pozorna, obalona kontrprzykładem
z modelu samego C.**

Minimalny zbiór nienegocjowalnych C to `{NN-C-01, NN-C-02, NN-C-03}` (`nonnegotiable_minimal_set`).
Ich forma:

| Wpis | Predykat | Typ |
|---|---|---|
| `NN-C-01` | `rank(Ob) = 2` | **dyskretny**, całkowitoliczbowy — tolerancja niewyrażalna |
| `NN-C-02` | `ρ = 0` | **równość dokładna**, zbiór miary zero |
| `NN-C-03` | `c_d = 0` | **równość dokładna**, zbiór miary zero |

Soczewka, która „nie może stabilizować układu, w którym każde odchylenie jest naruszeniem",
musiałaby odrzucić **własny zbiór minimalny**. Sprzeczność. Przesłanka `CON-B-06` nie zachodzi.

Prawidłowa dystynkcja, którą model C już zawiera i którą scalenie przejmuje: C ma **twarde
warunki strukturalne** (ranga czujnika, nieodwoływalność, koszt ujawnienia, `INV-C-03`
`γ_eff < g_crit` — nierówność **ostra**) oraz **miękkie setpointy śledzenia** (`q`, `L`, `O`, `E`).
Niezmienniki A i B są warunkami strukturalnymi wyprowadzalności, nie celami śledzenia, więc trafiają
do klasy twardej — czyli tam, gdzie były.

Osobno: `RES-A-10` (nieodwracalność egzekucji). C nie żąda uśrednienia — `stage_mapping S7` C:
„efekty **nieodwracalne**; `E` nie jest w pełni drenowalne". Zgodność, nie spór.

**Skutek.** `CON-B-06` → `VOID-PREMISE-FAILED`. `INV-A-01`, `INV-A-03`, `RES-A-10` nienaruszone.
Przewidywanie A o soczewce sterowania **falsyfikowane**.

---

### `CONF-D-05` — „fakt = zgoda kworum": przesłanka obalona (`CON-B-02`, `CON-C-03`)

**Spór.** B oddaje wyłączność `Dec` jako źródła rozstrzygalności „na rzecz (K1) »fakt = to, na co
zgadza się kworum«" (2.0 vbit). C oddaje indywidualną identyfikowalność best response „na rzecz
agregacji kworum/BFT", bo „soczewka R potrzebuje kworum, żeby zdefiniować »ustalony fakt«"
(0.045 caseload-kw, kumulacja progowa `T = 12 kw`, `J = 3.0`, 12.8 % dryfu C).

**Rozstrzygnięcie: przesłanka nie zachodzi. Soczewka konsensusowa twierdzi coś przeciwnego.**

Teza A, dosłownie: „warunek quorum intersection jest **strukturalnie niespełnialny** na faktach
rozstrzygających". `NN-A-07`: „fakt nie należy do przecięcia kworów i zbieżność jest **formalnie
niemożliwa**". A nie definiuje faktu jako zgody kworum; A dowodzi, że taka definicja jest pusta
tam, gdzie jest potrzebna.

Dla `CON-C-03` dodatkowo: agregacja niszcząca indywidualną identyfikowalność jest wprost sprzeczna
z `INV-A-06` („**sumy FG per organ** są publiczne") i `NN-A-08` („publiczny licznik `force_gas`
**per organ**"), a także z `NN-B-03` (etykieta blame na **każdym** rzutowaniu). Trzy z trzech
soczewek wymagają atrybucji indywidualnej.

Argument, którego B używa przeciw sobie, jest trafny i zostaje przyjęty: „BFT gwarantuje agreement,
nie validity — przy skażonym wejściu wszystkie repliki uzgadniają śmieć."

**Skutek.** `CON-B-02` → `VOID-PREMISE-FAILED`. `CON-C-03` → `VOID-PREMISE-FAILED`.
`NN-B-05` i `NN-A-07` nienaruszone. Przewidywanie B („soczewka konsensusowa zdefiniuje fakt jako
zgodę kworum") **falsyfikowane**.

---

### `CONF-D-06` — eventual consistency: przesłanka obalona (`CON-B-03`)

**Spór.** B przyjmuje ograniczoną nieświeżość cache `Δ = 1 cykl legislacyjny` „na rzecz (K1)
eventual consistency" (1.6 vbit).

**Rozstrzygnięcie: przesłanka nie zachodzi; soczewka konsensusowa żąda determinizmu replayu.**

`INV-A-03`: funkcja przejścia **nie zależy od wall-clock**. `NN-A-05`: activation height, **zakaz
semantyki wstecznej**, uzasadnienie — „uniemożliwia replay i audyt". `NN-A-06`: version vectors,
**zakaz last-write-wins**, z wykonanym kontrprzykładem `lost update`. `INV-A-08`: scalanie
multi-value. A **odrzucił własne** `CON-A-04` (activation interval, replay jako inkluzja) jako
nieabsorbowalne. To jest przeciwieństwo eventual consistency.

**Dodatkowo — `SAME` zidentyfikowane przy okazji.** `NN-A-05` + `NN-A-06` + `INV-A-08` (A) oraz
`NN-B-04` + `INV-B-06` (B: „pinowanie wersji normy do czasu zdarzenia oraz pole `deps`") są
**tym samym konstruktem** wedle kryterium tożsamości: ten sam warunek poprawności (wersja
oceniająca = wersja w mocy w czasie zdarzenia), ten sam tryb awarii (`stale citation` / `lost
update`), ta sama złożoność (`Θ(affected)` zamiast `Θ(cache)`). B ustąpił na rzecz soczewki, która
niezależnie żąda dokładnie tego, czego B broni.

**Skutek.** `CON-B-03` → `VOID-PREMISE-FAILED`. `NN-B-04` nienaruszone i wzmocnione przez `NN-A-06`.

---

### `CONF-D-07` — różniczkowalna funkcja straty na przestrzeni orzeczeń (`CON-B-05`)

To jest **najkosztowniejsze ustępstwo w całym scaleniu**: 4.5 vbit, najwyższe `g = 0.25/rok`,
odwracalność **`none`**, i — wedle własnego rachunku B — pojedynczo odpowiedzialne za przesunięcie
`t*` z ~4 lat na 1.6 roku.

**Spór.** B osadza `Judgment` w podprzestrzeni ilościowej z barierą typową „na rzecz (K2)
różniczkowalna funkcja straty. Bez metryki nie ma gradientu, bez gradientu nie ma sterowania ani
projektowania mechanizmu. **To jest ich warunek wstępny, nie preferencja.**"

**Rozstrzygnięcie: przesłanka jest fałszywa. Dowód konstrukcyjny.**

Niech `J` będzie skończonym typem sumarycznym z rozstrzygalną równością (`Judgment` nim jest).
Zdefiniuj metrykę dyskretną `δ : J × J → {0,1}`, `δ(j, j′) = 0 ⟺ j = j′`. Dla populacji `N` spraw
z referencją out-of-band `j*`:

```
q̂ = 1 − (1/N) · Σᵢ δ(jᵢ, j*ᵢ)   ∈ [0,1] ⊂ ℝ
```

Niech `π_θ` będzie rodziną rozkładów na `J` indukowaną przez politykę orzeczniczą o ciągłym
parametrze `θ`. Wtedy `E[q̂](θ) = 1 − E_{π_θ}[δ]` jest gładkie w `θ`, ilekroć `θ ↦ π_θ` jest gładkie
— standardowy fakt: wartość oczekiwana **ograniczonej straty dyskretnej** przy gładkiej rodzinie
rozkładów jest gładka. Gradient `∂q̂/∂θ` istnieje. **Metryka międzykonstruktorowa na `J` nie jest
do tego potrzebna.**

Zgodność z modelem C, sprawdzona wpis po wpisie:
- `PRIM-C-02`: wektor stanu `[q, L, E, G, O, V_p, Θ, S]` — **wszystkie składowe agregatowe**, żadna
  nie żyje w przestrzeni pojedynczego `Judgment`.
- `NN-C-07`: gramian sterowalności na `x = [q, L]`, `u = M` — na agregatach.
- `NN-C-06`: `V = V_p + V_fact` — **wariancja** wyników na parach spraw izomorficznych. Wariancja
  wyniku kategorialnego jest dobrze określona bez metryki międzykonstruktorowej (wariancja wskaźnika
  rozbieżności; równoważnie indeks Giniego rozkładu na `J`).
- `ALG-C-01`, `ALG-C-02`: `O(1)`, funkcje skalarnych agregatów.

**Żaden artefakt C nie wymaga metryki na `J`.** Wymagana jest wyłącznie **rozstrzygalna równość**
na `J`, którą typ sumaryczny ma z definicji.

**Skutek.** `CON-B-05` → `VOID-PREMISE-FAILED`. `PRIM-B-10` (brak metryki międzykonstruktorowej)
przywrócony. To jest jednocześnie usunięcie ryzyka `FALSE-COMMENSURATION`, które **sam B**
zidentyfikował w `open_conflicts_expected`, a mimo to ustąpił.

---

### `CONF-D-08` — estymacja z proxy kontra instrumentacja bezpośrednia (`CON-B-07`)

**Spór.** B oddaje bezpośrednią instrumentację `ρ_a` „na rzecz (K2) estymacja stanu z obserwacji
zaszumionych. Ich model nie wymaga bezpośredniego pomiaru stanu wewnętrznego; wymaga obserwowalności
w sensie istnienia estymatora" (1.2 vbit).

**Rozstrzygnięcie: przesłanka nie zachodzi. C żąda czujnika, nie lepszego estymatora.**

`PRIM-C-05 Estimator`: „działa **wyłącznie na podprzestrzeni obserwowalnej**". `INV-C-01` jest
naruszone w konfiguracji domyślnej (`rank = 1 < 2`). `NN-C-01` żąda **nowego wiersza macierzy `C`**
(`C₂ = [1,0]`), a nie lepszego przetwarzania istniejących wierszy. Cały argument C polega na tym,
że **żaden estymator nie odzyska informacji spoza podprzestrzeni obserwowalnej** — dokładnie
przeciwieństwo przesłanki B. `LEV-C-03` („czujnik out-of-band") ma rangę 3 i jest „jedyną dźwignią
przywracającą rangę".

Ponadto `NN-B-02` ma warunek obalenia: „pokazać estymator `ρ̂_a` o kontrolowanym biasie, **walidowany
na próbie audytowej**" — czyli B sam uzależnia dopuszczalność estymatora od istnienia pomiaru
bezpośredniego na próbie. To jest ta sama próba, którą C nazywa czujnikiem out-of-band.

**Skutek.** `CON-B-07` → `VOID-PREMISE-FAILED`. Wykryta **synergia**: próba audytowa z `NN-B-02`
i czujnik out-of-band z `NN-C-01` to ten sam obiekt (`SAME`), pozyskiwany raz i używany dwa razy.

---

### `CONF-D-09` — `n = 1` kontra tolerancja bizantyjska: **adresat błędny, ustępstwo zachowane**

**Spór.** B oddaje jednoinstancyjny model orzekającego „na rzecz (K1) tolerancja bizantyjska.
Ich twierdzenia nie mają treści dla `n = 1`" (0.6 vbit).

**Rozstrzygnięcie: przesłanka nie zachodzi wobec adresata, ale zachodzi wobec innego agenta.
Ustępstwo zostaje, z korektą adresata i z riderem.**

- Adresat wskazany (A) trzyma `n = 1`, `f_max = 0` jako **tezę**, a nie jako brak. `THM-A-07`:
  skorelowana awaria **łamie próg bizantyjski**; `NN-A-03`: `P_joint = ρp + (1−ρ)pⁿ` ma podłogę
  `ρ·p` **niezależną od `n`** — to dowód niemożliwości, nie parametr. A nie proponuje BFT.
- Adresat rzeczywisty to **C**: `INV-C-07` — „`S ≤ S_max` — **brak pojedynczego punktu
  orzeczniczego**", `RES-C-06` — `S* = 0.549–0.716` wobec `SLO ≤ 0.15` (366 % SLO), `FAIL-C-05` —
  awaria komponentu bez redundancji, spadek `q` o 43.5 %.

**Skutek.** `CON-B-08` **zachowane** (0.6 vbit), adresat poprawiony `K1 → C`. **Rider z `NN-A-03`:**
`Panel<n>` musi spełniać `INV-A-10` (zbiór weryfikujący rozłączny z pulą reputacyjną weryfikowanego).
Panel jednorodny nie realizuje `INV-C-07`, bo przy `ρ ≈ 1` podłoga `ρ·p` czyni redundancję pozorną.
Konsekwencja wykonalnościowa: `CONF-D-17`.

---

### `CONF-D-10` — error budget kontra bounded retry (`CON-C-09`)

**Spór.** C oddaje jawny error budget na rzecz bounded retry / timeout, bo „soczewka R wyraża
kontrolę przepływu przez timeouty i retry; **nie ma w niej pojęcia budżetu błędu**"
(0.030 caseload-kw).

**Rozstrzygnięcie: przesłanka jest fałszywa. Model A jest w całości zbudowany na pojęciu budżetu.**

- `RES-A-01`: metering `force_gas` — „**BRAK pre-execution check**; przy wyczerpaniu **nie
  out-of-gas**, tylko fork". Nazwanie tego brakiem jest żądaniem obecności: gaz z pre-checkiem
  i konstruktorem błędu **jest** error budgetem.
- `PRIM-A-11 GasMeter`: „wariant faktyczny (`chargeUnchecked`) nie ma pre-execution check ani
  konstruktora błędu" — ten sam zapis.
- `RES-A-03`: „**brak admission control** per sprawa" — jako defekt. Admission control jest
  mechanizmem backpressure, którego C się zrzeka.
- `LOOP-A-08`: jedyna pętla ujemna, „sterowana po jedynej obserwowalnej metryce (czas), czyli
  **Goodhart**". A **krytykuje** sterowanie po timeoucie, którego C przyjmuje prymat.

**Skutek.** `CON-C-09` → `VOID-PREMISE-FAILED`. Scalona maszyna `S3` niesie **jawny error budget
z out-of-gas**, nie sam timeout. Zgodne z `NN-B-01`.

---

### `CONF-D-11` — prymat statycznej walidacji (`CON-C-04`)

**Spór.** C oddaje pierwszeństwo niezmienników trajektorii nad statyczną walidacją schematu, bo
„soczewka T egzekwuje niezmienniki w punkcie konstrukcji; to jest tańsze i wcześniejsze niż mój
pomiar runtime" (0.025 caseload-kw).

**Rozstrzygnięcie: przesłanka nie zachodzi. B nie twierdzi, że statyka wystarcza — B twierdzi
przeciwnie.**

- `INV-B-01`, `INV-B-02`, `INV-B-05`: wszystkie trzy mają `violation_detectable: false`.
  B jawnie deklaruje, że jego własne kluczowe niezmienniki **nie są sprawdzalne** narzędziami,
  którymi dysponuje.
- `THM-B-14`: budżet weryfikacji jest o `10⁰–10²` mniejszy od przestrzeni przeszukiwania, więc
  `assume` jest **strukturalnie konieczny**.
- `THM-B-05`: wykrycie kolizji norm jest coNP-trudne i `Θ(n²·SAT)`, a guardy „**nie istnieją
  maszynowo**" — statyczna weryfikacja korpusu jest poza budżetem trwale (`LOOP-B-04`).
- `NN-B-02` warunek obalenia żąda **walidacji na próbie audytowej**, czyli pomiaru runtime.

**Skutek.** `CON-C-04` → `VOID-PREMISE-FAILED`. Stanowisko C z `open_conflicts_expected` („`INV-C-01`
i `INV-C-03` są niewyrażalne statycznie: są własnościami trajektorii i macierzy obserwowalności,
nie struktury danych") jest w scaleniu **utrzymane bez sporu** — B je podziela.

---

### `CONF-D-12` — `Θ` zastąpione dyskretnym wersjonowaniem (`CON-C-05`)

**Spór.** C oddaje ciągłą zmienną `Θ`, przyjmując dyskretne wersjonowanie semantyki, bo „soczewka T
potrzebuje dyskretnych wersji, żeby mówić o kompatybilności wstecznej i o migracji"
(0.050 caseload-kw, wykładnicza `h = 32 kw`; **jedyny człon wykładniczy pozostający w księdze C
po pozostałych obaleniach**).

**Rozstrzygnięcie: przesłanka zachodzi dla *dodania* wersji, ale nie dla *usunięcia* `Θ`.
Świadek konstrukcyjny: model A.**

Model A zawiera **jednocześnie**:
- `PRIM-A-09 VersionVector` — dyskretny zegar semantyczny, `NN-A-06`, scalanie multi-value;
- `LOOP-A-05` — `onto_epistemic_drift` jako **ciągła dyfuzja**, `σ = 0.12/√rok` [EST], `Var = σ²t`,
  przekroczenie `sd = 0.5` po 17 latach.

Istnieje zatem model, w którym dyskretne wersjonowanie i ciągła zmienna dryfu współistnieją.
Wymaganie „wersje" nie implikuje „bez `Θ`". Ani `NN-B-04`, ani `INV-B-06`, ani `NN-A-05`, ani
`NN-A-06` nie zawierają zakazu ciągłej zmiennej dryfu.

Zauważ, skąd bierze się kumulacja wykładnicza tego wpisu: z uzasadnienia C — „dryf **między** wersjami
jest nieksięgowany i narasta **wewnątrz** wersji". Ten dryf jest dokładnie `Θ`. Zachowanie `Θ`
usuwa mechanizm kumulacji, a nie tylko koszt natychmiastowy.

**Skutek.** `CON-C-05` → `VOID-PREMISE-FAILED` **w części usuwającej**; część dodająca (wersjonowanie)
wchodzi do scalenia jako **zysk bez kosztu** — sam C zauważa, że wersjonowanie nadaje operacji zapisu
do `Θ` znacznik czasu, której to jawności model C nie miał. Scalona rama interpretacyjna jest trójką
`(V, Γ, Θ)` — `AGREEMENTS.md AGR-08`, `MERGED-SPEC.md §S8`.

---

### `CONF-D-13` — statyczna klasyfikacja custody (`CON-A-01`)

**Spór.** A oddaje runtime'owy pomiar custody per fakt „na rzecz (T) statyczna klasyfikacja dowodu
po typie, rozstrzygalna przed wykonaniem" (12 du — **największe pojedyncze ustępstwo A**, 50 %
jego dryfu).

**Rozstrzygnięcie: przesłanka nie zachodzi.**

Żaden `NN-B-*` ani `INV-B-*` nie dotyczy custody; pojęcie nie występuje w modelu B ani C.
To, czego B rzeczywiście żąda na `S2`/`S3`, to `INV-B-04`: „zbiór atomów faktycznych po `S3` jest
zamknięty i haszowany". Ten warunek jest już spełniony przez `INV-A-01` (append-only z haszami
commitowanymi zewnętrznie) i `INV-A-05` (moment wpływu i zmiany kolejności commitowane poza kontrolą
organu) — **kosztem 0 du**. Pomiar runtime, zamrożony i zahaszowany na `S3`, spełnia `INV-B-04`
bez rezygnacji z pomiaru.

**Skutek.** `CON-A-01` → `VOID-PREMISE-FAILED`. `INV-A-02` (dual custody albo jawna flaga) egzekwowane
w pełnej formie runtime.

---

### `CONF-D-14` — proof-carrying delivery (`CON-A-07`)

**Spór.** A oddaje runtime ACK jako warunek konieczny „na rzecz (T) proof-carrying delivery —
statyczny dowód, że próba doręczenia spełniła protokół (kanały niezależne, bounded retry, poprawna
kolejność)" (3 du).

**Rozstrzygnięcie: przesłanka nie zachodzi, a ustępstwo jest treściowo puste.**

- Żaden artefakt B ani C nie modeluje doręczenia. `S1` nie występuje w `enforced_at` żadnego
  `NN-B-*` ani `NN-C-*` dotyczącego doręczeń.
- Treść „proof-carrying delivery" wymieniona w polu `na rzecz` — *kanały niezależne, bounded retry,
  poprawna kolejność* — jest **dosłownie treścią `NN-A-09`**: „doręczenie ACK-based z eskalacją na
  kanał niezależny; fikcja tylko jako oznaczona degradacja", z argumentem, że retry na tym samym
  kanale daje `P ≈ p` zamiast `p²`.

Ustępstwo oddaje więc rzecz na rzecz samej siebie. Koszt 3 du zaksięgowany bez odbiorcy.

**Skutek.** `CON-A-07` → `VOID-PREMISE-FAILED`. `NN-A-09` i `INV-A-09` w pełnej formie.

---

### `CONF-D-15` — `NN-B-03` (etykieta blame) kontra `NN-C-03` (`c_d = 0`) kontra sankcja A

**Spór.** Pozornie sprzeczne trzy `NN-*`. B żąda etykiety blame na każdym rzutowaniu niesprawdzonym,
bo bez niej `korekta : Blame → Działanie` ma **pustą dziedzinę** i żaden mechanizm korekcyjny nie
jest **wyrażalny**. C żąda `c_d = 0`: samoujawnienie błędu nie może kosztować ujawniającego, bo
przy `O → 0` iloczyn `c_m·φ·O → 0` niezależnie od `c_m`. A żąda niezerowej sankcji, bo `LOOP-A-02`
rozbiega się przy `P(wykrycie)·sankcja < ΔU_self`.

**Rozstrzygnięcie: sprzeczność pozorna. Trzy wielkości, nie jedna. Rozróżnienie pochodzi z modelu C.**

`ALG-C-01` porównuje dwie wypłaty:

```
U(ujawnij)   = − c_d              ← koszt SAMOujawnienia
U(zamaskuj)  = − c_m · φ · O      ← kara za ZATAJENIE, ważona wykrywalnością
```

To są **dwie różne wielkości**. `NN-C-03` żąda `c_d = 0`. Sankcja A to `c_m`, nie `c_d`. Etykieta
blame B podnosi `φ`. Warunek dominacji ujawnienia `O > c_d/(c_m·φ)` zawiera **wszystkie trzy**
czynniki i jest spełniony najłatwiej dokładnie wtedy, gdy `c_d = 0` (C), `c_m > 0` (A) i `φ`
maksymalne (B). Trzy `NN-*` są komplementarne, nie sprzeczne.

Realizacja: `korekta : Blame → Działanie` z niepunitywną wypłatą dla autora **samo**ujawnionego kroku
i punitywną dla kroku ujawnionego przez audyt. `dom(korekta) ≠ ∅` (`NN-B-03` spełnione),
`c_d = 0` (`NN-C-03` spełnione), `c_m > 0` (`LOOP-A-02` tłumione). Konstrukcja jest u C już nazwana:
`LEV-C-05` „blameless postmortem".

**Skutek.** `NN-B-03`, `NN-C-03`, `LOOP-A-02` — wszystkie nienaruszone. Patrz `AGREEMENTS.md AGR-04`.

---

### `CONF-D-16` — gdzie leży pętla ujemna i ile realnie wynosi `γ_eff`

**Spór.** C: `LOOP-C-07` (korekta odwoławcza na `S6`) jest jedyną pętlą ujemną, `γ_eff = γ₀·O
= 0.1799/kw` w `A_praca`, wobec `g_crit(8) = 0.1845/kw` — punkt pracy wykorzystuje **97.5 %**
marginesu opóźnienia. B: `LOOP-B-07` jest ujemna, ale o wzmocnieniu 0.1–0.4, „**za słabe**", i „nie
stabilizuje, bo kontrola nie wraca do `S2` i dzieli oracle z instancją niższą". A: apelacja naprawia
funkcję przejścia, **nigdy wejście**; brak krawędzi `S6 → S2`.

**Rozstrzygnięcie: `DECIDABLE`, z policzoną korektą. C przypisuje pętli ujemnej dren, którego ona
nie ma dla części zapasu.**

Dekompozycja `E = E_input + E_transition`:
- `E_input` — defekty powstałe na `S1`/`S2` (skażona podstawa faktyczna),
- `E_transition` — defekty funkcji przejścia na `S4`/`S5` (błędna subsumpcja).

A (`THM-A-01`, brak krawędzi `S6 → S2`, `floorStage = S3`) i B (`THM-B-07`: `sp(¬I₂, S3;S4;S5) = true`;
apelacja to rerun na tym samym AST) **niezależnie** dowodzą, że `S6` drenuje wyłącznie `E_transition`.
Zatem:

```
γ_eff_skorygowane = γ₀ · O · (1 − φ_input)
```

gdzie `φ_input` to udział spraw o defekcie wejściowym. A podaje `φ_input ∈ [0.14, 0.33]` [EST].
Podstawiając `γ₀·O = 0.1799/kw`:

```
γ_eff_skorygowane ∈ [0.1205, 0.1547] /kw    wobec g_crit(8) = 0.1845 /kw
```

**Dwa skutki o przeciwnych znakach, oba nowe:**

1. **Dobry:** wykorzystanie marginesu opóźnienia spada z 97.5 % do **65–84 %**. Ryzyko chatteringu
   (`FAIL-C-04`) maleje. Wpis `NN-C-08` (τ_a ≤ 4 kw) pozostaje uzasadniony, ale przestaje być
   pilny w trybie „97.5 % marginesu".
2. **Zły, i to on wiąże scalenie:** składowa `E_input` **nie ma drenu w ogóle**. Nie jest to
   opóźnienie ani słaba pętla — to brak krawędzi w grafie. Wyprowadzenie horyzontu (`MRG-03`)
   w `DRIFT-LEDGER.md §5`.

**Jedyna ścieżka naprawy wejścia w scalonym modelu** pochodzi od B: `NN-B-06` (fail-fast na granicy
fazy; naruszenie `I₂` **zawraca do `S1`/`S2`**), czyli krawędź `S3 → S2`. Ale `THM-B-08` tego samego
agenta orzeka, że `I₂` kwantyfikuje po `material(F)` definiowanym dopiero w `S5`, więc **wykrywalność
naruszenia w `S3` wynosi 0**. Krawędź istnieje, wyzwalacz jest niesprawdzalny. Ten sam agent
dostarcza jedynego mechanizmu naprawy i dowodu, że nie da się go wyzwolić.

---

### `CONF-D-17` — `INV-C-07` (`n ≥ 2`) kontra wykonalność kolejkowa: **jointly infeasible**

**Spór.** `INV-C-07` żąda braku pojedynczego punktu orzeczniczego. `NN-A-03` żąda, by redundancja
była **heterogeniczna** (`INV-A-10`), inaczej podłoga `ρ·p` czyni ją pozorną. `CON-B-08` realizuje
oba przez `Panel<n>`.

**Rozstrzygnięcie: przy obecnych parametrach zbiór wymagań jest niespełnialny. Liczba poniżej,
żaden niezmiennik nieosłabiony.**

`LOOP-A-07` podaje punkt pracy `ρ_q > 0.9` i wzmocnienie `1/(1−ρ_q)²`. Jeżeli każda sprawa wymaga
`n` niezależnych orzekających zamiast jednego, przy **stałej** zdolności przerobowej obciążenie
mnoży się przez `n`:

| `n` | `ρ_q` | stan kolejki |
|---|---|---|
| 1 | 0.90 | stabilna, oczekiwanie `∝ 1/(1−0.90)² = 100` |
| 2 | 1.80 | **niestabilna** (`ρ_q > 1`) |
| 3 | 2.70 | **niestabilna** |

Nawet `n = 2` jest niewykonalne bez **podwojenia** zdolności przerobowej. Zdolność przerobowa jest
egzogeniczna wobec wszystkich trzech modeli (`RES-A-03` — budżet publiczny; `RES-C-05`; `RES-B-02`).

**Skutek.** `INV-C-07`, `NN-A-03`, `INV-A-10` — wszystkie **nienaruszone**. Ich koniunkcja zostaje
zapisana w `MERGED-SPEC.md` jako **zewnętrzny warunek wstępny**: `capacity ≥ n × capacity₀`, z
`n ≥ 2`. Ustalenie tego warunku nie jest osłabieniem żadnego modelu ani `SCOPE-ESCAPE` — jest
wyliczeniem ceny koniunkcji, której żaden agent nie mógł policzyć osobno, bo `ρ_q` jest u A,
a `INV-C-07` u C.

---

## 2. `EMPIRICAL` — projekty eksperymentów falsyfikujących

### `CONF-E-01` — `force_gas`: skończony z twardym progiem, skończony bez pre-checku, czy nieskończony?

**Spór.** Ten sam referent (autorytet podstawiany zamiast dowodu), **trzy różne tryby awarii** —
więc wedle kryterium tożsamości Kroku 1 to `RIVAL`, nie `SAME`.

| Agent | Zasób | `finite` | Zachowanie przy wyczerpaniu |
|---|---|---|---|
| A | `RES-A-01` FG | **true** | **fork** — brak `out-of-gas`, brak pre-execution check |
| B | `RES-B-07` majesty_token | **false** | n/d — „jedyny zasób bez licznika, limitu i śladu" |
| C | `RES-C-01` AU, `Gmax = 100 AU` | **true** | **twarde nasycenie** `M = min(demand, G/gSpend)`; 75 % popytu niepokryte |

**Co mierzyć.** Parę `(M, demand − M)` zgodnie z `NN-C-05`, kwartalnie, przez `≥ 12` kwartałów.
Definicja wskaźnika nasycenia: `σ = (demand − M)/demand`.

`M` — liczba rozstrzygnięć zamkniętych przy deficycie dowodowym, operacjonalizowana jako liczba
wyroków z `mode = authority` (`INV-A-06`) albo, równoważnie, z niepustym zbiorem etykiet blame na
krokach `majesty` (`NN-B-03`). `demand` — liczba spraw, w których kwestia sporna nie ma dowodu
rozstrzygającego w rozumieniu `PRIM-B-03.measurement`.

**Progi i falsyfikacje:**

| Wynik | Obala | Uzasadnienie |
|---|---|---|
| `σ > 0.25` utrzymane przez `≥ 4` kolejne kwartały | **B** (`finite: false`) | zasób bez ograniczenia nie produkuje trwałego niepokrytego popytu |
| `σ < 0.05` przez `≥ 12` kwartałów **przy rosnącym `demand`** | **C** (`Gmax = 100 AU`) i **A** (fork przy wyczerpaniu) | rezerwuar o twardym progu musiałby się ujawnić przy rosnącym popycie |
| `M` **maleje** przy rosnącym `demand` | potwierdza **C** (`FAIL-C-02`: „spadek `M` wygląda jak poprawa") | to jest sygnatura, której `M` samo nie odróżnia |

**Warunek wykonalności eksperymentu — i on jest treścią, nie zastrzeżeniem.** Pomiar `M` wymaga
kanału obserwacji, o którym `NN-A-04` i `THM-B-04` dowodzą, że **nie istnieje** w obecnej dziedzinie
wyjścia (`AGREEMENTS.md AGR-01`). Eksperyment jest zatem **warunkowy na wdrożeniu `NN-B-03` +
`NN-A-08` + `NN-A-04`**, a te — wedle `THM-A-05` i `NN-C-02` — nie powstaną samoistnie
(`AGREEMENTS.md AGR-02`). Konflikt jest empirycznie rozstrzygalny **dopiero po** interwencji, którą
ma uzasadnić. To nie jest błąd projektu eksperymentu; to zmierzona własność systemu.

---

### `CONF-E-02` — `ρ`: korelacja celów orzekających

**Spór.** `NN-A-03` opiera dowód niemożliwości na `P_joint(p, ρ, n) = ρp + (1−ρ)pⁿ` z `ρ = 0.7`
[EST]. Model C używa **agenta reprezentatywnego** ze wspólnym `O` i wspólnymi `c_d`, `c_m` — czyli
implicite `ρ ≈ 1`. Klasyczny mechanism design zakłada `ρ = 0`.

**Nie jest to spór o strukturę — to spór o wartość parametru.** Przy `ρ → 1` podłoga `ρ·p → p`
i redundancja nie daje nic, co jest **dokładnie** wynikiem C (`INV-C-07`, `LOOP-C-08`). A i C
zgadzają się co do modelu; różnią się co do punktu na jego osi.

**Co mierzyć.** Konstrukcja pochodzi od C i już istnieje: `NN-C-06` — pary spraw o **niezależnie
zakodowanym izomorficznym stanie faktycznym**, rozdzielone między orzekających z różnych pul
reputacyjnych. Mierzyć korelację odchyleń wyniku od referencji, między orzekającymi.

**Progi:**

| Wynik | Obala | Skutek |
|---|---|---|
| `ρ < 0.3` | agenta reprezentatywnego C **i** podłogę `NN-A-03` jako wiążącą | redundancja heterogeniczna działa; `CONF-D-17` łagodnieje, bo wystarczy mniejsze `n` |
| `ρ > 0.9` | oszacowanie `ρ = 0.7` A jako **zaniżone** | `CON-A-08` (i.i.d. + correlation budget), już przez A odrzucone, jest odrzucone tym mocniej; `Panel<n>` przestaje pomagać przy dowolnym `n` |
| `0.3 ≤ ρ ≤ 0.9` | nikogo | oba modele stosowalne w swoich reżimach; `n` optymalne wyliczalne z `P_joint` |

Ten sam pomiar zwraca `V_p / V` z `NN-C-06` (predykcja C: 70.6 % / 82.2 %; warunek falsyfikacji C:
pomiar `< 35 %`). Jeden instrument, dwie falsyfikacje.

---

### `CONF-E-03` — `φ_input`: udział defektów pochodzących z `S1`/`S2`

**Znaczenie.** `φ_input` jest jedynym wolnym parametrem `MRG-03` — wielkości, która okazała się
**wiążącym ograniczeniem całego scalenia** (`DRIFT-LEDGER.md §5`). A podaje `φ_input ∈ [0.14, 0.33]`
[EST] bez pomiaru.

**Co mierzyć.** Na próbie out-of-band (`NN-C-01`): dla każdej sprawy z wykrytym defektem ustalić
**najwcześniejszy etap, na którym defekt jest już obecny** w zamrożonym logu (`INV-A-01`).
Klasyfikacja binarna: `S0–S2` (wejście) kontra `S3–S5` (przejście).

**Progi:**

| Wynik | Skutek dla scalenia |
|---|---|
| `φ_input < 0.05` | `MRG-03` przesuwa się poza 90 lat [EST] i **przestaje być osią wiążącą**; scalenie traci kwalifikację `FRAGILE` z podstawy strukturalnej |
| `0.05 ≤ φ_input ≤ 0.40` | `MRG-03` wiąże; horyzont 6.8–34.3 roku [EST] |
| `φ_input > 0.40` | horyzont skraca się poniżej 7 lat; `NN-B-06` (krawędź `S3 → S2`) staje się jedynym `NN-*` o znaczeniu operacyjnym |

**Falsyfikacja dodatkowa.** Jeżeli w danych znajdzie się procedura, która **faktycznie** zwraca
kontrolę do `S2` z częstością `≥` częstości powstawania defektów wejściowych, `MRG-03` znika, a
`THM-A-01` i `THM-B-07` wymagają zawężenia zakresu. Jest to jedyna znana droga obalenia `MRG-03`.

---

### `CONF-E-04` — deficyt budżetu weryfikacji: jedyny konflikt o jednostkach przeliczalnych

**Spór.** Trzy oszacowania deficytu tej samej wielkości: A **5.7×** [EST], B **0.83–83×** [EST],
C bez liczby (mechanizm przelewu na `RES-C-01`). Rozpiętość dwóch rzędów wielkości.

**Co mierzyć.** Faktyczny czas uwagi orzeczniczej per sprawa (`RES-B-02`, sekundy) wobec
zadaniowo-analitycznego oszacowania czasu wymaganego. Jednostki są przeliczalne:
`1 judge-hour = 3600 s = 120 vgas` (`PRIM-B-14`: 1 vgas ≈ 30 s [EST]).

**Progi:**

| Wynik | Obala |
|---|---|
| deficyt `< 1×` (budżet wystarcza) | **`THM-B-14`**, a przez to `LOOP-B-05`, `LOOP-B-09` i przesłankę strukturalnej konieczności `assume` |
| deficyt `> 10×` | oszacowanie A (5.7×) jako **zaniżone**; `NN-A-03` zyskuje na wadze, bo redundancja przy takim deficycie nie jest opcją |
| deficyt rośnie z `n` korpusu | potwierdza `LOOP-B-03`, `LOOP-B-04` (`RES-B-03` bez DCE) |

**Kontrola scalenia.** Ten sam pomiar weryfikuje rachunek z `AGREEMENTS.md AGR-07`: koszt czasowy
zobowiązań `NN-*` scalonych wynosi 550–820 s/sprawę [EST], czyli 3–11 % budżetu A i 1.5–2.3 %
budżetu B. Jeżeli pomiar wykaże `> 25 %`, scalone zobowiązania nie mieszczą się i wymagają
priorytetyzacji — czego żaden model suwerenny nie przewiduje.

---

### `CONF-E-05` — `stale_citation_rate`: jedyny konflikt mierzalny **dziś, bez interwencji**

**Spór.** `NN-B-04` (deps + pinowanie) opiera się na `Θ(cache) ≈ 10⁵–10⁶` porównań na nowelizację
wobec `Θ(affected) ≈ 10¹–10³`, z warunkiem obalenia „zmierzyć `stale_citation_rate < 10⁻²`".
`M-B-02` jest oznaczone jako **mierzalne dziś**. `LOOP-A-05` mierzy tę samą erozję jako dyfuzję
o `σ = 0.12/√rok` [EST], z przekroczeniem `sd = 0.5` po 17 latach. Dwie parametryzacje jednego
zjawiska, dotąd nieskonfrontowane.

**Co mierzyć.** Na próbie cytowań precedensów: udział cytowań, w których `decidedUnder` nie przecina
się z wersją w mocy w czasie zdarzenia sprawy cytującej (`INV-B-03`, `INV-B-06`).

**Progi:**

| Wynik | Obala |
|---|---|
| `stale_citation_rate < 10⁻²` | **`NN-B-04`** (własny warunek obalenia B) |
| `stale_citation_rate > 10⁻¹` | oszacowanie `σ = 0.12/√rok` A jako **zaniżone**; horyzont `LOOP-A-05` skraca się poniżej 17 lat |
| `M-B-04` (cytowania orzeczeń / cytowania przepisów) `> 1` | potwierdza atraktor `LOOP-B-01` „kodeks jako dekoracja" |

Ten eksperyment jest jedynym w zestawie, którego wykonanie **nie zależy** od kanału z `AGR-02`.
Powinien być wykonany pierwszy.

---

## 3. `FOUNDATIONAL` — obie gałęzie z warunkami stosowalności

Zgodnie z `CONSENSUS-PHASE §2`: nie rozstrzygamy. Utrwalamy oba warianty i **podajemy cenę każdego**.

### `CONF-F-01` — czym jest „poprawność": czy istnieje odniesienie zewnętrzne

**Rdzeń sporu.** `THM-B-02`: `Spec := Oracle`, więc `∀c. Oracle(c) = Spec(c)` jest tautologią
o treści **0 bitów**; błąd oracle'a definicyjnie nie jest błędem, więc `ε` jest **nieokreślone**,
nie tylko duże. `NN-C-01`: dodanie wiersza `C₂ = [1,0]` podnosi `rank Ob` do 2 — czyli **istnieje**
pomiar `q` niezależny od `Θ`. `NN-A-04`: `calibrated.support` plus Brier score dają sprzężenie
korygujące kalibrację.

Sporne jest **nie to, czy odniesienie zewnętrzne jest potrzebne** (tu wszyscy trzej zgadzają się —
`NN-B-07`, `NN-C-01`, `NN-A-04`), lecz **czy może istnieć**.

**Gałąź `T` (soczewka typów).** Poprawność ma treść wyłącznie względem `Spec` **zaimportowanej
z zewnątrz systemu**: z `Dec` (pomiar fizyczny, `PRIM-B-03.measurement`) oraz z per-podmiotowej
rodziny `Spec_p` (aksjomat wejściowy `PROTOCOL.md §0`). Wewnątrz systemu poprawność ≡ reputacja
(`THM-B-13`) i punkt stały się domyka.

**Gałąź `S/R` (sterowanie / konsensus).** Poprawność ma treść jako zmienna stanu `q` planta,
mierzalna czujnikiem out-of-band; pytanie jest instrumentacyjne, nie definicyjne.

**Warunek stosowalności — selektor jest decydowalny na fragmencie.** Rozgraniczenie daje `NN-B-08`
(inwentarz pozycji UB): klasyfikacja klauzuli na `defined` / `implementation_defined` / `undefined`.

| Klasa normy w sporze | Obowiązująca gałąź | Uzasadnienie |
|---|---|---|
| spór o **fakt techniczny**, `Dec` dostępne, pomiar powtarzalny | **`S/R`** | mierzona wielkość istnieje niezależnie od orzeczenia; czujnik out-of-band jest realizowalny jako powtórzony pomiar |
| spór o **wykładnię** normy sklasyfikowanej `undefined` | **`T`** | `THM-B-01`: jedna osiągalna pozycja UB czyni każdy wynik dopuszczalnym; mierzona wielkość jest **definiowana** przez oracle, więc czujnik mierzyłby oracle |
| norma `implementation_defined` | **`T` konserwatywnie** | B: „klasyfikacja konserwatywna jest sound" (`NN-B-08`) |

**Cena gałęzi `T`:** na fragmencie interpretacyjnym nie istnieje `q`, nie istnieje Brier score,
nie istnieje pętla korygująca. Wszystkie dźwignie C (`LEV-C-01..06`) tracą tam zastosowanie, bo
sterują wielkością, która nie ma odniesienia. Pozostaje wyłącznie `NON_LIQUET` (`NN-B-01`) jako
sygnał, że fragment został osiągnięty.

**Cena gałęzi `S/R`:** trzeba przyjąć, że na fragmencie interpretacyjnym `q` mierzone jest
**zanieczyszczone** przez `THM-B-13` — referencja out-of-band jest sama produktem systemu, więc
mierzy zgodność z linią orzeczniczą, nie trafność. `NN-C-06` daje wtedy `V_p`, ale nie daje `q`.

**Czego brakuje do rozstrzygnięcia:** pomiaru udziału spraw, w których kwestia sporna jest
klasyfikowalna jako `defined` przy klasyfikacji konserwatywnej. `NN-B-08` żąda tego inwentarza
i jest to koszt `O(n)` jednorazowo, `n ≈ 10⁴–10⁵`. Do czasu jego wykonania obie gałęzie stoją.

---

### `CONF-F-02` — jednostka analizy: ślad pojedynczy kontra ensemble

**Rdzeń sporu.** A i B formułują niezmienniki jako własności **pojedynczego śladu**
(`INV-A-01..10`, `INV-B-01..08`): naruszenie jest własnością jednej sprawy i jest świadkowane
jednym prefiksem. C formułuje je jako własności **ensemble'u** (`INV-C-01..08`, `PRIM-C-02`,
`1 caseload-kwartał = 10⁵ spraw` [ASSUMPTION]): `rank Ob`, `E ≥ 0`, `γ_eff < g_crit` są
własnościami rodziny trajektorii, nie jednej.

To jest różnica **typu logicznego**, nie stopnia. Własność ensemble'u może zachodzić przy naruszeniu
w każdym pojedynczym śladzie (np. `V_p` na akceptowalnym poziomie przy każdej sprawie rozstrzygniętej
błędnie w tę samą stronę), i odwrotnie. Nie ma reguły przenoszenia w żadną stronę.

Podstawa jest **nieargumentowana po obu stronach** — `AGREEMENTS.md UNARG-02`. Żaden agent nie
uzasadnia wyboru jednostki. To utrzymuje konflikt w klasie `FOUNDATIONAL`: gdyby któraś strona
podała argument, mógłby przejść do `DECIDABLE`.

**Gałąź `per-trace`.** Wszystkie `NN-A-*` i `NN-B-*` egzekwowane na każdej sprawie.
**Cena:** koszt egzekucji skaluje się z caseloadem. Rachunek z `AGR-07`: 550–820 s/sprawę [EST].
Przy `10⁵` spraw/kwartał to `1.5–2.3 · 10⁴` judge-hour/kwartał — wielkość porównywalna z całym
budżetem uwagi. Ponadto `CONF-D-17`: koniunkcja `INV-C-07` z `NN-A-03` żąda `n`-krotnej zdolności
przerobowej. Gałąź `per-trace` jest **droga w zdolności przerobowej**, czyli uderza dokładnie w
`RES-C-05`, którego niedobór C przelewa na `force_gas`.

**Gałąź `ensemble`.** Wszystkie `NN-C-*` egzekwowane na populacji; kontrola statystyczna zamiast
per-case.
**Cena, i jest ona poważniejsza niż koszt:** **żaden pojedynczy podmiot nie ma legitymacji do
powołania się na własność ensemble'u.** „Wariancja proceduralna w populacji wynosi 70.6 %" nie jest
zarzutem, który strona może podnieść w swojej sprawie. Mechanizm egzekucji tej gałęzi narusza więc
**aksjomat wejściowy `PROTOCOL.md §0`** (system wartości podmiotu zindywiduowanego jest lepiej
określony niż uśrednienie instytucjonalne) — i narusza go **przez własną konstrukcję**, nie przez
nadużycie. Gałąź `ensemble` jest **tania w wykonaniu i sprzeczna z aksjomatem zadania**.

**Warunek stosowalności.** Gałąź `per-trace` obowiązuje wszędzie tam, gdzie istnieje podmiot
z roszczeniem (`S1..S7`). Gałąź `ensemble` obowiązuje na `S8` i w warstwie nadzorczej, gdzie
przedmiotem oceny jest **linia orzecznicza**, a nie sprawa — tam podmiotem zindywiduowanym jest
system, a nie strona, i aksjomat nie jest naruszany. Granica przebiega dokładnie po granicy `S7|S8`.

To rozgraniczenie **nie jest rozstrzygnięciem sporu** — jest podziałem osi adresowania, na którym
obie gałęzie są niesprzeczne. W obszarze `S8` nadzorczym, gdzie decyzja dotyka spraw indywidualnych
(np. zmiana linii orzeczniczej stosowana do spraw w toku), konflikt wraca w pełni i nie ma
rozstrzygnięcia.

---

### `CONF-F-03` — bodziec czy język: czy patologia jest własnością wypłat, czy typu

**Rdzeń sporu.** Trzy różne odpowiedzi na pytanie „dlaczego korekta nie działa".

| Soczewka | Odpowiedź | Konsekwencja |
|---|---|---|
| **C** | Zły atraktor jest **równowagą best-response** osiągalną bez złej woli; z 11 dźwigni jedna (`ρ → 0`) działa jako naprawa | patologia jest własnością **wypłat**; zmiana wypłat ją usuwa |
| **A** | Nieemisja jest **strategią dominującą** (`THM-A-05`); ale nawet przy `obs = 1` równowaga to `e* = 40 pp`, **nigdy zero** (`LOOP-A-01`) | patologia jest własnością wypłat, ale **nieusuwalna do zera** |
| **B** | `korekta : Blame → Działanie` przy pustej dziedzinie **nie istnieje jako wyrażenie** (`NN-B-03`); twierdzenie o blame jest **niewypowiadalne**, nie tylko naruszone (`THM-B-04`) | patologia jest własnością **języka**; żadna zmiana wypłat nie pomaga przed zmianą typu |

Różnica jest zachowaniowa, nie retoryczna: gałąź bodźcowa przewiduje, że zmiana `c_m`, `c_d`, `ρ`
poprawia system; gałąź językowa przewiduje **zerową reakcję** na dowolną zmianę tych parametrów,
dopóki `Blame` nie jest w typie. C sam dostarcza obserwacji zgodnej z gałęzią językową:
`FAIL-C-07` „zamek histerezy — brak reakcji na zaostrzenie sankcji; `c_m` `5.5 → 30 RU` nie
przywraca reżimu `R1`".

**Gałąź `incentive` (A, C).** Patologia jest własnością wypłat.
**Cena:** trzeba przyjąć liczbę A — przy pełnej obserwowalności residuum `e* = 40 pp` pozostaje.
Pętla nie domyka się do zera nigdy, więc każda obietnica „przy dobrym mechanizmie system działa
poprawnie" jest fałszywa co do rzędu wielkości.

**Gałąź `language` (B).** Patologia jest własnością typu.
**Cena:** **ranking dźwigni C przestaje obowiązywać jako uporządkowanie.** `LEV-C-01..06` są
uszeregowane wedle skuteczności zmierzonej w modelu, w którym atrybucja istnieje. Jeżeli atrybucja
nie jest wyrażalna, część dźwigni ma skuteczność 0, a nie niższą rangę — a ranking tego nie odróżnia.

**Warunek stosowalności — podział zbioru dźwigni, nie arbitraż.** Kryterium: czy dźwignia wymaga
**wskazania autora kroku**.

| Dźwignia | Wymaga atrybucji? | Obowiązująca gałąź |
|---|---|---|
| `LEV-C-01` `ρ → 0` (nieodwoływalność **wskazanego** czujnika) | tak | `language` — bezskuteczna przed `NN-B-03` |
| `LEV-C-05` `c_d → 0` (blameless postmortem) | tak — postmortem dotyczy **kroku i autora** | `language` |
| `LEV-C-06` publikacja `(M, demand−M)` | tak — `M` wymaga etykietowania kroków | `language` |
| `LEV-C-02` `η ≥ 0.1667/kw` (stała czasowa odbudowy `O`) | **nie** — parametr systemowy | `incentive` — skuteczna niezależnie |
| `LEV-C-03` czujnik out-of-band (druga linia `C`) | **nie** — pomiar równoległy, nie atrybucja | `incentive` |
| `LEV-C-04` `τ_a: 8 → 4 kw` | **nie** — parametr proceduralny | `incentive` |

**Skutek operacyjny, który obie gałęzie akceptują:** dźwignie z kolumny `incentive`
(`LEV-C-02`, `LEV-C-03`, `LEV-C-04`) są skuteczne pod obiema gałęziami i mogą być wdrożone bez
rozstrzygnięcia sporu. Dźwignie z kolumny `language` są **warunkowe na `NN-B-03`**, więc kolejność
jest wymuszona: `NN-B-03` przed `LEV-C-01`, `LEV-C-05`, `LEV-C-06`. Ta kolejność jest wnioskiem
scalenia — żaden model suwerenny jej nie zawiera, bo C nie ma pojęcia `Blame`, a B nie ma dźwigni.

**Czego brakuje do rozstrzygnięcia:** wyniku interwencji zmieniającej wyłącznie `c_m` przy stałym
typie. `FAIL-C-07` jest taką obserwacją, ale pochodzi z symulacji modelu C, nie z pomiaru; jako
dowód na rzecz gałęzi językowej byłaby cyrkularna.

---

## 4. Rejestr twierdzeń formalnie obalonych

**Żaden `NN-*` nie został obalony.** Obalono następujące twierdzenia **nie** będące `NN-*`:

| # | Twierdzenie | Autor | Czym obalone |
|---|---|---|---|
| 1 | „Soczewka typów zażąda sumy typów zamiast liczby" | A, `open_conflicts_expected[0]` | `NN-B-05` + `INV-B-07` — B sam żąda liczby z progiem `τ` (`CONF-D-03`) |
| 2 | „Soczewka sterowania potraktuje niezmienniki jako miękkie" | A, `open_conflicts_expected[2]` | minimalny zbiór `{NN-C-01, NN-C-02, NN-C-03}` C składa się z predykatów twardych, dwóch równości dokładnych (`CONF-D-04`) |
| 3 | „Soczewka konsensusowa zdefiniuje fakt jako zgodę kworum" | B, `open_conflicts_expected[0]` | teza A + `NN-A-07` (`CONF-D-05`) |
| 4 | „Soczewka sterownicza zamodeluje majesty jako szum o zerowej średniej" | B, `open_conflicts_expected[2]` | `ALG-C-05` — deterministyczny aktuator z twardym nasyceniem; `LOOP-C-05` znak `+` (`AGREEMENTS.md AGR-01`) |
| 5 | Przesłanka `CON-B-01`: FLP zabrania czekania na dowód | B | hipotezy FLP (`n ≥ 2`, `f ≥ 1`) nie zachodzą przy `n = 1` (`CONF-D-01`) |
| 6 | Przesłanka `CON-B-05`: bez metryki na `Judgment` nie ma gradientu | B | konstrukcja `q̂` z metryki dyskretnej `δ` i agregacji po `N` (`CONF-D-07`) |
| 7 | Przesłanka `CON-B-06`: regulator wymaga zbioru dopuszczalnego o niepustym wnętrzu | B | zbiór minimalny C zawiera `rank = 2`, `ρ = 0`, `c_d = 0` (`CONF-D-04`) |
| 8 | Przesłanka `CON-C-07`: soczewka R wymaga liveness | C | `NN-A-07`, `RES-A-01`, `PRIM-A-11` (`CONF-D-01`) |
| 9 | Przesłanka `CON-C-02`: dowody safety wymagają punktu finalności | C | domkniętość safety na prefiksy; `LOOP-A-03`, `THM-B-10` (`CONF-D-02`) |

Pozostałe obalenia przesłanek (`CON-A-01`, `CON-A-07`, `CON-B-02`, `CON-B-03`, `CON-B-07`,
`CON-C-03`, `CON-C-04`, `CON-C-05`, `CON-C-09`) są odmianami powyższych mechanizmów i mają własne
sekcje `CONF-D-*`.

---

*Harmonizing Functor Collective · Justice-as-Code · faza konsensusowa*
