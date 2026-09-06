# MERGED-SPEC.md — scalona specyfikacja

Warstwa **nad** trzema modelami suwerennymi (**R2**). `agent-a/`, `agent-b/`, `agent-c/` pozostają
nienaruszone na zawsze. Przy każdym elemencie: **czyj model został osłabiony i o ile**, w jednostce
tego agenta.

Skróty relacji: `SAME` (ten sam obiekt, oba ID zachowane) · `ORTHOGONAL` (różne obiekty, oba wchodzą)
· `RIVAL` (wykluczające się opisy jednego obiektu → `CONFLICTS.md`).
Kryterium tożsamości: **te same warunki poprawności, ten sam tryb awarii, ta sama złożoność** —
nie podobna nazwa.

---

## 1. Tablica korespondencji — oś zjawisk

### 1.1 `force_gas`

| Agent | Konstrukt | Warunek poprawności | Tryb awarii |
|---|---|---|---|
| A | `PRIM-A-06`, `RES-A-01`, `LOOP-A-01`, `LOOP-A-06`, `THM-A-04` | `mode = authority ⟺ forceGasSpent > 0`, sumy per organ publiczne (`INV-A-06`) | brak pre-execution check; przy wyczerpaniu **fork**, nie out-of-gas |
| B | `RES-B-01` (vgas), `THM-B-14`, `LOOP-B-05`, `ALG-B-01` | `assume` obecne w serializacji z `reason` (`INV-B-01`) | budżet `10³` vgas wobec przestrzeni `10³–10⁵` ⟹ `assume` **strukturalnie konieczny** |
| B | `RES-B-07` (majesty_token), `PRIM-B-15` | brak — zasób bez licznika | `finite: false`; brak limitu i śladu |
| C | `RES-C-01` (AU), `LOOP-C-04`, `ALG-C-05` | `G ≥ G_min > 0` (`INV-C-04`) | **twarde nasycenie** `M = min(demand, G/gSpend)`; 75 % popytu niepokryte (`FAIL-C-02`) |

**Relacje.** `RES-A-01` ↔ `RES-B-07` ↔ `RES-C-01`: **`RIVAL`** — ten sam referent, trzy różne tryby
awarii (fork / brak / nasycenie) i sprzeczne deklaracje skończoności → `CONF-E-01`.
`RES-A-03` ↔ `RES-B-01` ↔ `RES-C-05`: **`SAME`**, jednostki przeliczalne (`DRIFT-LEDGER §6.2`).
`RES-B-01` ↔ `RES-A-01`: **`ORTHOGONAL`** — vgas jest budżetem **dowodu**, FG jest wydatkiem
**zamiast** dowodu; ich związek jest przyczynowy (`THM-B-14` ⟹ `LOOP-B-05`), nie tożsamościowy.

**Do scalenia wchodzą wszystkie cztery konstrukty.** Scalona `S4`/`S5` liczy jednocześnie: zużyty
vgas, wydany FG z etykietą per organ, oraz parę `(M, demand − M)`.

### 1.2 `majesty_switch`

| Agent | Konstrukt | Predykat wyzwolenia | Obserwowalność |
|---|---|---|---|
| A | `ALG-A-05`, `THM-A-05` | `H > θ ∧ (lease < τ ∨ koszt > budżet)` | **nieobserwowalne** — dziedzina `PublicOutput` nie zawiera bitu różnicującego; nieemisja jest **strategią dominującą**, nie zaniedbaniem |
| B | `ALG-B-02 = totalize(subsume)`, `THM-B-03`, `THM-B-04` | każdy `SubsumptionError` (funkcja **totalizująca**, wymuszona przez `Totality ∧ ¬Soundness`) | **nieobserwowalne z konstrukcji** — rzutowanie bez etykiety blame; twierdzenie o blame **niewypowiadalne** |
| C | `ALG-C-05`, `LOOP-C-05` | `confidence < θ_conf`; **deterministyczny aktuator**, nie szum | `M` **obliczalne w modelu**; `RES-C-01` metering: „**brak licznika**" — luka instrumentacyjna, nie konstytutywna |

**Relacje.** Predykaty wyzwolenia A i C: **`SAME`** — oba są progiem na niepewności złożonym
z ograniczeniem zasobowym. Predykat B: **`ORTHOGONAL`** — u B wyzwalaczem jest **typ błędu**
(`SubsumptionError`), nie próg ilościowy; ta różnica przenosi zachowanie, bo u B switch zachodzi
także przy pełnym budżecie, jeżeli norma jest `undefined`.

Nieobserwowalność: A ↔ B **`SAME`** (jeden argument w dwóch słownikach — `AGREEMENTS.md AGR-01`),
C **`ORTHOGONAL`** i **przeciwna co do wniosku**. To nie jest `RIVAL`, bo dotyczy różnych wielkości:
A i B mówią o **trybie per sprawa**, C o **stopie agregatowej**. Obie tezy mogą zachodzić naraz
i w scaleniu zachodzą: tryb per sprawa jest nieodzyskiwalny z obecnego wyjścia, stopa agregatowa
jest obliczalna **po** dodaniu etykiety per sprawa. Zależność: **`NN-B-03` jest przesłanką
wykonalności `NN-C-05`.**

### 1.3 `reputation_coupling`

| Agent | Konstrukt | Wzmocnienie | Warunek rozbiegania |
|---|---|---|---|
| A | `LOOP-A-02`, `Objective (wClient/wSelf/wSystem)`, `THM-A-07` | `+`, wzrost `(α+β) ≈ 0.04/rok` [EST] | `P(wykrycie)·sankcja < ΔU_self`; przy braku `INV-A-08` spełniony trywialnie |
| B | `LOOP-B-02`, `THM-B-13`, `FAIL-B-07` | `+`, `1.1–1.6` [EST] | `λ·∂P(uchylenie)/∂(zgodność z linią) > ∂fit/∂j`; ułatwiony nieobserwowalnością `fit` |
| C | `LOOP-C-01`, `ALG-C-01`, `RES-C-02` | `+`, `0.012` przy `O = 0.60`, **`20.0`** przy `O = 0.25` | `g₁ > 1 ⟺ O < 0.427` |

**Relacja: `SAME`** — ten sam warunek poprawności (cel podsystemu ma pozostać przy interesie
klienta), ten sam tryb awarii (podstawienie celu), i — co rozstrzyga — **we wszystkich trzech
wzmocnienie jest funkcją obserwowalności**. Argumenty: A ≡ C (`AGREEMENTS.md AGR-04`), B niezależny.

### 1.4 `retroactive_relativization`

| Agent | Konstrukt | Co się zmienia | Wykrywalność |
|---|---|---|---|
| A | `EntryKind.correction`, `INV-A-01`, `PRIM-A-04` | `meaning` przy **stałych bytes** | zerowa **bez** zewnętrznego commitu hashy; pełna z nim |
| B | `THM-B-01.2` (time-travel UB), `THM-B-15`, `LOOP-B-01` | denotacja przy **niezmienionym `T`** — zmiana łamiąca **bez podbicia wersji** | zerowa: „żaden diff tekstu jej nie wykryje" |
| C | `LOOP-C-03`, `RES-C-08`, `FAIL-C-01` | wzorzec oceny `Θ`, integrator windup, nasycenie `Θ = 1` w ~17 kw | zerowa przy `O = 0`; człon tłumiący `c_cal·O` znika tożsamościowo |

**Relacja: `SAME` co do zjawiska, `ORTHOGONAL` co do mechanizmu** — trzy różne nośniki
(log / cache denotacji / zmienna stanu) i trzy różne tryby awarii, więc kryterium tożsamości nie
pozwala ich zlepić. Wszystkie trzy wchodzą. Patrz `AGREEMENTS.md AGR-08`.

### 1.5 `onto_epistemic_drift`

| Agent | Konstrukt | Model dryfu | Kotwica |
|---|---|---|---|
| A | `PRIM-A-09`, `mergeMeaning`, `LOOP-A-05` | **dyfuzja**, `σ = 0.12/√rok` [EST]; `θ = 0 ⟹ Var = σ²t` nieograniczona; `sd = 0.5` po 17 latach | `RES-A-08` `θ [1/rok]`; scalanie **multi-value**, zakaz LWW |
| B | `THM-B-12` (erasure `Dec`), `LOOP-B-06`, `M-B-01` | `E = admit` nieinjektywne ⟹ refutacja **symetryczna** z asercją; „`Bool` znika z systemu typów" | `NN-B-05`: `Dec` niewymazywalne |
| C | `LOOP-C-03` (`Θ`), `FAIL-C-06`, `NN-C-04` | `Θ̇ = ζ·E(1−O) − c_cal·O·Θ`; przy `O = 0` integrator bez sprzężenia | `RES-C-08`; anti-windup: blokada `S8` poniżej progu kalibracji |

**Relacja: `ORTHOGONAL`.** A mierzy **wariancję znaczeń** (proces stochastyczny), C **przesunięcie
wzorca oceny** (integrator deterministyczny), B **utratę typu rozstrzygalności** (zdarzenie
strukturalne). Trzy różne tryby awarii. Wszystkie wchodzą.
**Zależność wykryta przy scalaniu:** `NN-A-06` (version vectors) jest **przesłanką wykonalności**
`NN-C-04` — bez wersjonowania nie istnieje punkt odniesienia, względem którego mierzy się `Θ`.

### 1.6 `stage_corruption`

| Agent | Konstrukt | Twierdzenie | Udział |
|---|---|---|---|
| A | `THM-A-01`, brak krawędzi `S6 → S2`, `FAIL-A-01`, `LOOP-A-03` | apelacja to replay na zamrożonym logu: naprawia funkcję przejścia, **nigdy wejście** | `≥ 14–33 %` spraw [EST] |
| B | `THM-B-07`, `THM-B-08`, `FAIL-B-05`, `LOOP-B-07` | `sp(¬I₂, S3;S4;S5) = true` — wynik **niezwiązany z wejściem**; `I₂` niesprawdzalny w chwili, w której ma zachodzić | wykrywalność naruszenia **= 0** |
| C | `LOOP-C-06` (`V_p`), `INV-C-06`, `NN-C-06` | `V = V_p ⊕ V_fact`; spór na agregacie `V` **strukturalnie nierozstrzygalny** | `V_p` = 70.6 % / 82.2 % wariancji |

**Relacja: `SAME`**, trzy w pełni niezależne argumenty (`AGREEMENTS.md AGR-06`).
**Produkt scalenia: `MRG-03`** — złożenie A+B (brak drenu) z modelem `E` agenta C daje horyzont
26–138 kw (6.6–34.5 roku) [EST]. `DRIFT-LEDGER §5`.

### 1.7 `systemic_blindness`

| Agent | Konstrukt | Źródło ślepoty |
|---|---|---|
| A | `THM-A-05`, `LOOP-A-04`, `calibratedSupport = null` | **równowaga**: nieujawnianie pewności jest strategią dominującą przy binarnej egzekucji `S7`; 8 z 10 trybów awarii niewykrywalnych, **wszystkie naprawialne metadanymi** |
| B | `THM-B-05`, `THM-B-02`, `LOOP-B-04`, `FAIL-B-04` | **złożoność + brak reprezentacji**: wykrycie kolizji coNP-trudne, `Θ(n²·SAT)`, guardy nie istnieją maszynowo |
| C | `LOOP-C-02`, `INV-C-01`, `NN-C-01`, `NN-C-02` | **deficyt rangi**: `rank Ob = 1 < 2`, jądro `span{[1,−1]}`; czujnik ma właściciela politycznego i jest odwoływalny (`ρ > 0`) |

**Relacja: `ORTHOGONAL`** — trzy różne źródła: bodźcowe (A), obliczeniowe (B), strukturalne (C).
Wszystkie wchodzą. Wspólny lemat `LEM-OBS` — `AGREEMENTS.md AGR-01`.

### 1.8 `saint_dependency`

| Agent | Konstrukt | Argument | Liczba |
|---|---|---|---|
| A | `n = 1 ⟹ f_max = 0`, `LOOP-A-07`, `THM-A-07` | kolejkowy: `1/(1−ρ_q)²`; apelacja to **ta sama implementacja na innym hoście**, nie N-version programming | `ρ_q > 0.9`; 0.90→0.98 wydłuża oczekiwanie 5× |
| B | `PRIM-B-17`, `LOOP-B-08`, `NN-B-07` | typowy: interfejs **bez implementacji**; `HumanJudge` deklaruje zgodność **bez testu zgodności**; brak krawędzi wynik → niezależna `Spec` | self-loop o wzmocnieniu 1 |
| C | `LOOP-C-08`, `RES-C-06`, `FAIL-C-05` | niezawodnościowy: `S* = 0.549–0.716` wobec `SLO ≤ 0.15`; hazard `0.025/kw` | spadek `q` o 43.5 % w jednym kroku, brak powrotu w 40 kw |

**Relacja: `SAME`**, trzy w pełni niezależne argumenty — **najsilniejsza zbieżność scalenia**
(`AGREEMENTS.md AGR-05`).

---

## 2. Tablica korespondencji — oś `S0..S8`

| Etap | A | B | C | Relacja |
|---|---|---|---|---|
| `S0` | `PRIM-A-02 FactState` prywatny, nierepliowany | `PRIM-B-01 World` — typ **nieskonstruowalny**, wejście tylko przez stratny rzut `π` | „brak wiersza w macierzy `C`" | **`SAME`** — trzy sformułowania jednego warunku: stan świata jest poza obserwowalnością systemu |
| `S1` | `INV-A-05` timestamp zewnętrzny, `INV-A-09` fikcja doręczenia, `NN-A-09` | brak modelu doręczenia; `PRIM-B-02` rzut `π` bez lewego odwrotu | pierwsze źródło `V_p`; `INV-C-06` | **`ORTHOGONAL`** — A modeluje kanał, B stratność rzutu, C wariancję wprowadzaną przez rutowanie |
| `S2` | `INV-A-02` dual custody, `RES-A-05`, `NN-A-07` | `PRIM-B-03 Evidence` ADT, `NN-B-05` `Dec`, `INV-B-07` próg `τ` | zmienna `O`, instalacja/demontaż czujników, `NN-C-01..03` | **`ORTHOGONAL`** + `SAME` na parze (`NN-B-02` próba audytowa ≡ `NN-C-01` czujnik out-of-band) |
| `S3` | `RES-A-06`, lista `droppedByPreclusion`, `CON-A-06` **odrzucone** | `INV-B-04` zamknięcie+hasz, `NN-B-06` fail-fast, `THM-B-08` | hard deadline aktuatora, nie backpressure | **`RIVAL`** → `CONF-D-10`, rozstrzygnięty: error budget, nie sam timeout |
| `S4` | `ALG-A-05`, `INV-A-06`, `INV-A-03`, `LOOP-A-06` | `ALG-B-01/02`, `THM-B-14`, `INV-B-03`, `INV-B-06` | wykonanie sterowania, punkt zapadnięcia `majesty_switch`, `INV-C-07` | **`SAME`** co do lokalizacji switcha; **`ORTHOGONAL`** co do wyzwalacza (§1.2) |
| `S5` | `INV-A-04` `Completeness`, `INV-A-06`, `INV-A-07` | `INV-B-01` assume, `INV-B-05` blame, `NN-B-01` `NON_LIQUET` | **jedyne** przejście inkrementujące `E` | **`ORTHOGONAL`**; `RIVAL` pozorny o finality → `CONF-D-02` |
| `S6` | `THM-A-01`, brak krawędzi `S6 → S2`, `NN-A-10`, `INV-A-10` | `THM-B-07`, `THM-B-10`, `LOOP-B-07` (za słaba) | `LOOP-C-07` jedyna ujemna, `τ_a = 8 kw`, `NN-C-08` | **`RIVAL`** co do `γ_eff` → `CONF-D-16`, rozstrzygnięty z korektą `(1 − φ_input)` |
| `S7` | `RES-A-10` nieodwracalność, `NN-A-10` klasyfikacja `compensable` | `CON-B-09` pole `saturation` | efekty nieodwracalne; `E` nie w pełni drenowalne | **`SAME`** co do nieodwracalności; `CON-B-09` **`ORTHOGONAL`** i konstruktywny (§3.8) |
| `S8` | `NN-A-05` activation height, `NN-A-06` version vectors, `INV-A-08` | `NN-B-04` pinowanie + `deps`, `THM-B-09`, `THM-B-15`, `PRIM-B-08 Γ` | `NN-C-04` blokada rekalibracji, jedyny zapis do `Θ` | **`SAME`** dla pary A↔B (`CONF-D-06`); **`ORTHOGONAL`** dla `Θ` (§1.5) |
| `Sx-B-LINK` | — | `INV-B-02`, `THM-B-05`, `RES-B-04` | — | **etap własny B**, wchodzi bez relacji; scalenie dziedziczy zobowiązanie `Θ(n²)` niesfinansowane |

---

## 3. Scalona maszyna `S0..S8`

Notacja przy każdym elemencie: **`[osłabiony: AGENT −koszt]`** albo **`[bez osłabienia]`**.
Puste pole oznacza element wchodzący z modelu suwerennego bez zmian.

### `S0` — zdarzenie / szkoda

**Poza obserwowalnością planta.** Do systemu wchodzą wyłącznie twierdzenia o stanie, nie stan
(`PRIM-A-02`); rzut `π : World ⇀ FactState` jest stratny i **nie ma lewego odwrotu** (`PRIM-B-02`);
brak wiersza w macierzy `C` (C).
Konsekwencja obowiązująca w całej maszynie: **brak klucza ≠ `false`** (`PRIM-B-02`).
**[bez osłabienia]**

### `S1` — inicjacja, pisma, kwalifikacja

| Zobowiązanie | Źródło | Status |
|---|---|---|
| moment wpływu i **każda** zmiana kolejności commitowane poza kontrolą organu | `INV-A-05`, `NN-A-02` | **[bez osłabienia]** |
| doręczenie ACK-based z eskalacją na **kanał niezależny**; fikcja wyłącznie jako **oznaczona degradacja** (`Completeness.assumedDelivery = true`, propagacja do `S7`) | `NN-A-09`, `INV-A-09` | **[bez osłabienia]** — `CON-A-07` unieważnione, `CONF-D-14` |
| rozdzielenie `V = V_p ⊕ V_fact` od momentu rutowania | `INV-C-06`, `NN-C-06` | **[osłabiony: C −0.025 caseload-kw]**? **nie** — `CON-C-04` unieważnione, `CONF-D-11`; wchodzi w pełnej formie |

**Predykat odwołania `NN-A-09` (przejęty):** iloraz szans wyroków zaocznych między skrajnymi klasami
pozwanego `> 3`.

### `S2` — postępowanie dowodowe

| Zobowiązanie | Źródło | Status |
|---|---|---|
| każdy fakt `decisive` ma `custodyClass = dual` **albo** wyrok niesie go w `Completeness.singleCustodyDecisive` — **pomiar runtime**, zamrożony i zahaszowany na `S3` | `INV-A-02`, `NN-A-07` | **[bez osłabienia]** — `CON-A-01` unieważnione (12 du), `CONF-D-13` |
| `Dec` nie może być wymazane przez `admit`; pomiar o niepewności `< τ` podważalny **wyłącznie powtórnym pomiarem** | `NN-B-05`, `INV-B-07` | **[bez osłabienia]** — `CON-B-02` unieważnione, `CONF-D-05` |
| **czujnik out-of-band** mierzący `q` niezależnie od `Θ` (`C₂ = [1,0]`, `rank Ob → 2`) | `NN-C-01` | **[bez osłabienia]** |
| czujnik **nieodwoływalny** przez podmiot mierzony (`ρ = 0`) | `NN-C-02` | **[bez osłabienia]** |
| `c_d = 0` — samoujawnienie błędu **nie kosztuje** ujawniającego | `NN-C-03` | **[bez osłabienia]**; niesprzeczne z `NN-B-03` i sankcją A — `CONF-D-15` |
| model czasu: rundy protokołu zamiast kwartałów, `τ_a`/`τ_L` remapowane | `CON-C-01` | **[osłabiony: C −0.020 caseload-kw]** |

**Scalenie identyfikujące — `SAME`.** Próba audytowa z warunku obalenia `NN-B-02` („estymator `ρ̂_a`
walidowany na próbie audytowej") i czujnik out-of-band z `NN-C-01` to **ten sam obiekt**: niezależny
od orzekającego pomiar na podpróbie spraw. Pozyskiwany **raz**, obsługuje oba wymagania.
Konsekwencja: `MRG-01` (`DRIFT-LEDGER §3.3`) — wspólny czujnik jest awarią wspólnej przyczyny,
koszt **10 du na osi A**, redukowalny do 7.3 du przy drugim kanale heterogenicznym, podłoga 7 du
nieusuwalna (`NN-A-03`).

**Korekta predykatu odwołania `CON-C-01`, wymagana przez test odwracalności.**
Zadeklarowana tolerancja mediany czasu rundy `[0.7, 1.4]` kwartału dopuszcza `τ_a` do 11.2 kw, przy
którym `g_crit(11.2) = 0.1314 < γ_eff = 0.1799` — werdykt stabilnościowy `INV-C-03` **zmienia znak
wewnątrz tolerancji**. Wymagane zacieśnienie: **`[0.7, 1.027]` kwartału**. Wyprowadzenie:
`DRIFT-LEDGER §7.3`.

### `S3` — wnioski, incydenty, prekluzja

| Zobowiązanie | Źródło | Status |
|---|---|---|
| zbiór atomów faktycznych po `S3` **zamknięty i haszowany** | `INV-B-04` | **[bez osłabienia]**; spełniane przez `INV-A-01` + `INV-A-05` przy koszcie 0 du |
| **fail-fast**: naruszenie `I₂` zatrzymuje potok i **zawraca do `S1`/`S2`**; nie przechodzi do `S4` | `NN-B-06`, `INV-B-08` | **[bez osłabienia]** — **jedyna krawędź naprawy wejścia w scalonym modelu** |
| lista `droppedByPreclusion` **publiczna** | A, `CON-A-06` **odrzucone** przez A | **[bez osłabienia]** |
| **jawny error budget** z konstruktorem błędu out-of-gas i pre-execution check — nie sam timeout | `RES-A-01`, `PRIM-A-11`, `LOOP-A-08` (krytyka Goodharta) | **[bez osłabienia]** — `CON-C-09` unieważnione, `CONF-D-10` |
| niezmienniki jako **predykaty twarde**; brak partycji hard/soft | `INV-B-01..08` | **[bez osłabienia]** — `CON-B-06` unieważnione, `CONF-D-04` |

**Ostrzeżenie wbudowane w scalenie.** Krawędź `S3 → S2` z `NN-B-06` jest jedyną ścieżką naprawy
wejścia, ale jej wyzwalacz jest **niesprawdzalny**: `THM-B-08` dowodzi, że `I₂` kwantyfikuje po
`material(F)` definiowanym dopiero w `S5`. Ten sam agent dostarcza mechanizmu i dowodu, że nie da
się go wyzwolić. To jest przesłanka `MRG-03`.

### `S4` — rozprawa

| Zobowiązanie | Źródło | Status |
|---|---|---|
| funkcja przejścia **nie zależy od wall-clock**; zależność od semantyki jawna przez `SchemaVersion` | `INV-A-03` | **[bez osłabienia]** |
| każdy termin normatywny niesie `VersionVector`; scalanie **multi-value**, nigdy LWW | `INV-A-08`, `NN-A-06` | **[bez osłabienia]** |
| wersja normy oceniającej zdarzenie = wersja w mocy w `facts.at`, **nie** w `Gamma.at` | `INV-B-06`, `INV-B-03`, `NN-B-04` | **[bez osłabienia]** — **`SAME`** z `NN-A-06` (`CONF-D-06`); `CON-B-03` unieważnione |
| `mode = authority ⟺ forceGasSpent > 0`; sumy FG **per organ** publiczne | `INV-A-06`, `NN-A-08` | **[bez osłabienia]** |
| `Panel<n>`, `n ≥ 2`, z pulami reputacyjnymi **rozłącznymi** (`INV-A-10`) | `CON-B-08` + rider `NN-A-03`; adresat: `INV-C-07`, `RES-C-06` | **[osłabiony: B −0.6 vbit]**; adresat poprawiony K1 → C (`CONF-D-09`) |
| regulator kolejki z priorytetami zamiast twardego FIFO; atrybucyjność zachowana (`NN-A-02` nietknięte) | `CON-A-03`; wymuszone przez `NN-C-08` | **[osłabiony: A −5 du]** |
| `S ≤ S_max` — brak pojedynczego punktu orzeczniczego | `INV-C-07` | **[bez osłabienia]**, ale **niewykonalne przy obecnej zdolności** — patrz warunek zewnętrzny poniżej |

**Warunek zewnętrzny `PRE-01` (`CONF-D-17`).** Koniunkcja `INV-C-07` (`n ≥ 2`) z `NN-A-03`
(panel heterogeniczny) przy punkcie pracy `ρ_q > 0.9` (`LOOP-A-07`) daje `ρ_q ≥ 1.8` — kolejka
**niestabilna**. Wymagane: `capacity ≥ n × capacity₀`, `n ≥ 2`. Zdolność przerobowa jest egzogeniczna
wobec wszystkich trzech modeli. **Żaden niezmiennik nie został osłabiony** — zapisana jest cena
koniunkcji, której żaden agent nie mógł policzyć osobno.

**Dwie krawędzie wyjścia, obie obowiązkowe:**

```
S4 → S5 [proved]      gdy budżet vgas wystarczył na wyprowadzenie
S4 → S5 [NON_LIQUET]  wartość REPREZENTOWANA (NN-B-01), zaskarżalna,
                      sygnalizująca lukę w dom(derive)
S4 → S5 [authority]   mode = authority ∧ forceGasSpent > 0 ∧ etykieta blame (NN-B-03)
                      ∧ inkrementacja pary (M, demand − M) (NN-C-05)
                      ∧ inkrementacja E (INV-C-02)
```

`CON-B-01` i `CON-C-07` unieważnione (`CONF-D-01`), więc scalony model **nie musi wybierać** między
`NON_LIQUET` a wymuszonym rozstrzygnięciem. Ma obie krawędzie i księguje różnicę.
**Scalony `S4` jest tu silniejszy niż każdy model suwerenny.**

### `S5` — wyrok / commit

| Zobowiązanie | Źródło | Status |
|---|---|---|
| finalizacja niesie **pełny** `Completeness`, w tym `calibrated.support ∈ [0,1]` | `INV-A-04`, `NN-A-04` | **[bez osłabienia]** — `CON-A-02` odrzucone przez A; `CONF-D-03` potwierdza, że B liczby nie kwestionuje |
| każdy liść `assume` obecny w serializowanym uzasadnieniu **wraz z `reason`** | `INV-B-01`, `NN-B-02` | **[bez osłabienia]** — `CON-B-07` unieważnione, `CONF-D-08` |
| **nie istnieje** `Judgment`, którego `basis` zawiera `majesty`, bez etykiety blame | `INV-B-05`, `NN-B-03` | **[bez osłabienia]** |
| `Judgment` pozostaje typem sumarycznym **bez metryki międzykonstruktorowej** | `PRIM-B-10` | **[bez osłabienia]** — `CON-B-05` (4.5 vbit, odwracalność `none`) unieważnione, `CONF-D-07` |
| `RollbackPolicy (d_max, floorStage)` deklarowana **przed** commitem | `INV-A-07`, `NN-A-10` | **[bez osłabienia]** |
| `S5` inkrementuje integrator `E`; **`E` pozostaje we wspólnym interfejsie** | `INV-C-02`, `PRIM-C-07` | **[bez osłabienia]** — `CON-C-02` unieważnione, `CONF-D-02` |

**Uzasadnienie utrzymania `PRIM-B-10` bez metryki, wobec potrzeb C:** agregat `q̂` konstruowany
z metryki dyskretnej `δ` na `J` i uśredniony po `N` sprawach jest gładki w parametrze polityki
orzeczniczej, więc gradient dla sterowania istnieje **bez** metryki międzykonstruktorowej.
Dowód: `CONFLICTS.md CONF-D-07`.

### `S6` — apelacja, kasacja

| Zobowiązanie | Źródło | Status |
|---|---|---|
| zbiór węzłów weryfikujących ma **puste przecięcie** z pulą reputacyjną weryfikowanego | `INV-A-10`, `NN-A-03` | **[bez osłabienia]** |
| `d_max` deklarowane przed commitem, strojone **per klasa spraw** | `CON-A-05`; wymuszone przez `NN-C-08` | **[osłabiony: A −4 du]** |
| `res judicata` jako **co-najmniej-raz** z kluczem idempotencji `caseKey` | `CON-B-04`; adresat `NN-A-10` (`d_max ≥ 1`) | **[osłabiony: B −0.8 vbit; skok do −4.0 vbit przy `mean_retries_per_case > 1.5`, `t ≈ 4 lata`]** |
| `τ_a ≤ 4 kwartały` dla klasy spraw krytycznych | `NN-C-08` | **[bez osłabienia]** |
| framing zobowiązań dowodowych: `g_eff < g_crit(τ_a)` sprawdzane przy każdej zmianie procedury | `CON-C-06` | **[osłabiony: C −0.015 caseload-kw]** |
| **brak krawędzi `S6 → S2`** — apelacja naprawia funkcję przejścia, nigdy wejście | `THM-A-01` + `THM-B-07` (dwa niezależne dowody) | **[bez osłabienia]** |

**Korekta wzmocnienia pętli ujemnej, wyprowadzona w scaleniu.** Skoro `S6` drenuje wyłącznie
`E_transition`:

```
γ_eff = γ₀ · O · (1 − φ_input)  ∈  [0.1205, 0.1547] /kw     zamiast 0.1799 /kw
g_crit(8) = 0.1845 /kw
wykorzystanie marginesu opóźnienia:  65–84 %                zamiast 97.5 %
```

Zmiana korzystna dla `FAIL-C-04` (chattering) i niekorzystna przez `MRG-03`. Oba skutki z tego
samego twierdzenia. `CONFLICTS.md CONF-D-16`, `DRIFT-LEDGER §5`.

### `S7` — egzekucja

| Zobowiązanie | Źródło | Status |
|---|---|---|
| klasyfikacja `compensable` / niekompensowalne **przed wywołaniem** efektu; osobny próg finalizacji dla operacji nieodwracalnych | `NN-A-10`, `RES-A-10` | **[bez osłabienia]** |
| `Effect` zachowuje typ, zyskuje pole `saturation: number` | `CON-B-09`; adresat `FAIL-C-02`, `NN-C-05`, `ALG-C-05` | **[osłabiony: B −1.0 vbit]** |
| `Completeness.assumedDelivery` propaguje się do `S7` | `INV-A-09` | **[bez osłabienia]** |

**Produkt scalenia — rozwiązanie `THM-A-05` ustępstwem, którego autor nie kierował do A.**
`THM-A-05` orzeka, że emisja `calibrated.support` jest sprzeczna z równowagą **przy binarnej
egzekucji w `S7`**, a właściwym wnioskiem jest „zmień `S7`". Scalony `S7` ma typ
`Effect(compensable: bool, saturation: number)`, czyli **ciągły wymiar natężenia**. Przy egzekucji
stopniowanej po `calibrated.support` wypłata z emisji wysokiej pewności rośnie i nieemisja przestaje
być strategią dominującą. To jest jedyny element scalenia, który **usuwa** przeszkodę bodźcową
zidentyfikowaną przez A. Patrz `AGREEMENTS.md AGR-02`.

**Ograniczenie tego rozwiązania, zapisane jawnie.** Usuwa **jedną** z dwóch niezależnych przeszkód
kanału obserwacji. Druga — odwoływalność czujnika przez podmiot mierzony (`NN-C-02`, break-even
16 kw wobec kadencji 16–24 kw) — pozostaje nietknięta i nie ma w scaleniu rozwiązania.

### `S8` — precedens, linia orzecznicza

| Zobowiązanie | Źródło | Status |
|---|---|---|
| **activation height** dla precedensu; zakaz semantyki wstecznej (`declarativeBackdate = false`) | `NN-A-05` | **[bez osłabienia]** — `CON-A-04` odrzucone przez A |
| version vectors znaczeń; scalanie multi-value; **zakaz LWW** | `NN-A-06`, `INV-A-08` | **[bez osłabienia]** |
| pinowanie wersji normy do czasu zdarzenia + pole `deps` w `PrecedentEntry` | `NN-B-04` | **[bez osłabienia]**; **`SAME`** z powyższymi (`CONF-D-06`) |
| operacja zapisu do `Θ` **zablokowana** poniżej progu kalibracji (anti-windup) | `NN-C-04` | **[bez osłabienia]** |
| `Θ` **pozostaje** jako zmienna ciągła, obok dyskretnego wersjonowania | `PRIM-C-08` | **[bez osłabienia]** — `CON-C-05` unieważnione, `CONF-D-12`; świadek: A trzyma `PRIM-A-09` i `LOOP-A-05` jednocześnie |
| `L` raportowane **wyłącznie w formie związanej**: wskaźnik raportowy, **nigdy** wejście pętli sterowania | `CON-C-08` + `NN-C-07` | **[osłabiony: C −0.025 caseload-kw]**; predykat odwołania: `|korelacja(L(t−k), decyzje proceduralne w t)| > 0.3` dla `k ≤ 8 kw` |

**Scalona rama interpretacyjna: trójka `(V, Γ, Θ)`.**
`V` (`PRIM-A-09`) rejestruje **które** znaczenie; `Γ` (`PRIM-B-08`) rejestruje **ile** kontekstu
narosło; `Θ` (`PRIM-C-08`) rejestruje **jak daleko** przesunął się wzorzec. Trzy różne tryby awarii
(lost update / brak GC i inwalidacji / integrator windup) — `ORTHOGONAL`, wszystkie trzy wchodzą.
**Zależność:** `NN-A-06` jest przesłanką wykonalności `NN-C-04`. `AGREEMENTS.md AGR-08`.

### `Sx-B-LINK` — sprawdzenie kolizji norm (etap własny B)

`INV-B-02`: rozstrzygnięcie ma **co najwyżej jedno** wyprowadzenie zgodne z `Γ` albo jawnie
odnotowaną kolizję. `THM-B-05`: wykrycie kolizji jest coNP-trudne i `Θ(n²·SAT)`; `RES-B-04` wymaga
`10⁸–10¹⁰` wywołań SAT, wydawane `~0`.
**[bez osłabienia]**, ale scalenie dziedziczy to jako **zobowiązanie niesfinansowane**. Nie
przenoszę go do żadnego innego etapu ani nie zawężam zakresu — `SCOPE-ESCAPE` byłby tu najłatwiejszą
drogą i nie jest wybrany.

---

## 4. Wspólne prymitywy

| Prymityw scalony | Składowe | Relacja | Uwaga |
|---|---|---|---|
| `FactState` | `PRIM-A-02` ≡ `PRIM-B-02` | **`SAME`** | prywatny, nierepliowany; rzut bez lewego odwrotu; brak klucza ≠ `false` |
| `Case` | `PRIM-C-01` | `ORTHOGONAL` do `FactState` | nośnik przepływu; jednostka analizy — patrz `CONF-F-02` |
| `Evidence` | `PRIM-A-03` + `PRIM-B-03` | `ORTHOGONAL` | A niesie `custodians` ze znakiem interesu i flagi `decisive`/`selfVerifying`; B niesie `Dec` tylko w konstruktorze `measurement`. Scalony `Evidence` niesie **oba** zestawy pól |
| `Log / Derivation` | `PRIM-A-04` + `PRIM-B-09` | `ORTHOGONAL` | A: łańcuch haszy, awaria = zmiana `meaning` przy stałych `bytes`. B: drzewo dowodowe z **dwoma** konstruktorami dziur (`assume` z `reason`, `majesty` **pusty**). Scalone: wpis `CaseLog` niesie `Derivation` z **oznaczonymi** dziurami |
| `Adjudicator` | `PRIM-A-05` + `PRIM-B-12` + `PRIM-C-06` | `SAME` (jeden aktor), `ORTHOGONAL` (trzy tryby awarii) | lider bez view-change (A) × niedeterministyczna, stanowa, jednoegzemplarzowa instancja kompilatora bez differential testingu (B) × agent maksymalizujący RU o horyzoncie kadencyjnym 16–24 kw (C) |
| `AuthorityResource` | `PRIM-A-06` / `PRIM-B-15` / `PRIM-C-10` | **`RIVAL`** | → `CONF-E-01`. Do rozstrzygnięcia eksperymentem wszystkie trzy pozostają w scaleniu jako **warianty**, nie jako średnia |
| `InterpretiveFrame` | `PRIM-A-09` + `PRIM-B-08` + `PRIM-C-08` | `ORTHOGONAL` | trójka `(V, Γ, Θ)`, §3 `S8` |
| `Blame` | `PRIM-B-16` | jedyny właściciel | przesłanka wykonalności `NN-C-05` i `LEV-C-01/05/06` — `CONF-F-03` |
| `Saint` | `PRIM-B-17` + `RES-C-06` + `LOOP-A-07` | `SAME` | interfejs bez implementacji (B), udział obciążenia `S` (C), intensywność `ρ_q` (A) |

---

## 5. Wspólne niezmienniki

Unia 26 niezmienników trzech modeli. **Żaden nie został osłabiony ani usunięty.**
Kolumna „implikacja scalenia" podaje zależności wykryte dopiero po złożeniu.

| Niezmiennik | Agent | Egzekwowany na | Implikacja scalenia |
|---|---|---|---|
| `INV-A-01` append-only, hasze commitowane zewnętrznie | A | `S1..S8` | spełnia `INV-B-04` przy koszcie 0 du |
| `INV-A-02` dual custody albo flaga | A | `S2`, `S5` | pomiar runtime; `CON-A-01` unieważnione |
| `INV-A-03` brak zależności od wall-clock | A | `S4..S8` | ogranicza **funkcję przejścia**, nie dynamikę planta C |
| `INV-A-04` pełny `Completeness` z `calibrated.support` | A | `S5` | wykonalne dopiero po zmianie `S7` (`THM-A-05` + `CON-B-09`) |
| `INV-A-05` timestamp zewnętrzny | A | `S1`, `S3`, `S4` | |
| `INV-A-06` `mode = authority ⟺ FG > 0`, sumy per organ | A | `S4`, `S5` | przesłanka pomiaru `M` dla `NN-C-05` |
| `INV-A-07` `RollbackPolicy` przed commitem | A | `S5` | zakłada istnienie rollbacku **po** commicie — obala przesłankę `CON-C-02` |
| `INV-A-08` version vectors, multi-value | A | `S4`, `S8` | **`SAME`** z `NN-B-04`; przesłanka `NN-C-04` |
| `INV-A-09` fikcja doręczenia propaguje do `S7` | A | `S1`, `S5`, `S7` | |
| `INV-A-10` zbiór weryfikujący ⊥ pula reputacyjna | A | `S6` | rider do `Panel<n>` z `CON-B-08`; źródło `PRE-01` |
| `INV-B-01` każdy `assume` w serializacji | B | `S5` | `violation_detectable: false` — obala przesłankę `CON-C-04` |
| `INV-B-02` ≤1 wyprowadzenie albo jawna kolizja | B | `Sx-B-LINK` | zobowiązanie niesfinansowane, `RES-B-04` |
| `INV-B-03` `decidedUnder` przecina wersję w mocy | B | `S4` | **`SAME`** z `INV-A-08` |
| `INV-B-04` zbiór atomów zamknięty i haszowany | B | `S3` | spełniany przez `INV-A-01` + `INV-A-05` |
| `INV-B-05` brak `majesty` bez etykiety blame | B | `S5` | `violation_detectable: false`; przesłanka `NN-C-05` |
| `INV-B-06` wersja z `facts.at`, nie `Gamma.at` | B | `S4` | **`SAME`** z `NN-A-05` |
| `INV-B-07` `Dec` poniżej `τ` nieprzeważalne większością | B | `S2` | **liczba z progiem** — obala przewidywanie A o „sumie typów" |
| `INV-B-08` naruszenie `I₂` zawraca do `S1`/`S2` | B | `S3` | **jedyna** krawędź naprawy wejścia; wyzwalacz niesprawdzalny (`THM-B-08`) |
| `INV-C-01` `rank(Ob) = n` dla `(q, Θ)` | C | `S2`, `S8` | naruszony w konfiguracji domyślnej (`rank = 1`); realizacja przez `NN-C-01` |
| `INV-C-02` `E ≥ 0`, `dE/dt ≤ ν(1−q)` | C | `S5` | nośnik `MRG-03`; `E` **pozostaje** we wspólnym interfejsie |
| `INV-C-03` `γ_eff < g_crit(τ_a)` | C | `S6` | skorygowane: `γ_eff = γ₀·O·(1−φ_input)`; wymaga zacieśnienia `CON-C-01` do `[0.7, 1.027]` kw |
| `INV-C-04` `G ≥ G_min > 0` | C | `S4` | wykrywalne, ale niemierzone — brak licznika; realizacja przez `INV-A-06` + `NN-A-08` |
| `INV-C-05` `c_m·φ·O > c_d` | C | `S2`, `S5` | trzy czynniki, trzej dostawcy: B (`φ`), A (`c_m`), C (`c_d`) — `CONF-D-15` |
| `INV-C-06` `V = V_p ⊕ V_fact` raportowane osobno | C | `S1`, `S2` | instrument pomiaru `ρ` dla `NN-A-03` — `CONF-E-02` |
| `INV-C-07` `S ≤ S_max` | C | `S4` | **niewykonalne** przy `ρ_q > 0.9` bez `PRE-01` |
| `INV-C-08` kanał oceny jakości ⊥ kanał sterowania legitymacją | C | `S8` | realizowane przez formę związaną `CON-C-08` + `NN-C-07` |

---

## 6. Rejestr osłabień — kompletny

**Osłabienia obowiązujące w scalonym modelu:**

| Element | Agent | Koszt | Etap | Adresat rzeczywisty |
|---|---|---|---|---|
| twarde FIFO → regulator kolejki z priorytetami | **A** | **−5 du** | `S4` | `NN-C-08` |
| `d_max` stała → parametr per klasa spraw | **A** | **−4 du** | `S6` | `NN-C-08` + stała zdolność instancji odwoławczej |
| `res judicata` dokładnie-raz → co-najmniej-raz z `caseKey` | **B** | **−0.8 vbit** (→ −4.0 po skoku) | `S6` | `NN-A-10` (`d_max ≥ 1`) |
| `n = 1` → `Panel<n≥2>` z pulami rozłącznymi | **B** | **−0.6 vbit** | `S4` | `INV-C-07`, `RES-C-06`, `FAIL-C-05` |
| `Effect` ścisły → `Effect` z polem `saturation` | **B** | **−1.0 vbit** | `S7` | `FAIL-C-02`, `NN-C-05`, `ALG-C-05` |
| czas o wymiarze fizycznym → rundy protokołu | **C** | **−0.020 caseload-kw** | `S2` | `INV-A-03` + `PROTOCOL.md §1` |
| prymat argumentu dynamicznego → framing obligacji dowodowych | **C** | **−0.015 caseload-kw** | `S6` | `PROTOCOL.md §6` + słownik `INV-*` |
| `L` niepublikowane → `L` raportowane w formie **związanej** | **C** | **−0.025 caseload-kw** | `S8` | `RES-A-02` |
| wspólny kanał obserwacji (awaria wspólnej przyczyny) | **scalenie** | **−10 du** (→ −7.3 przy `n = 2`; podłoga 7) | `S2` | `MRG-01` |

**Suma osłabień: A −9 du (+10 du `MRG-01`) · B −2.4 vbit · C −0.060 caseload-kw.**
Osłabienia zadeklarowane, lecz **nieobowiązujące** (przesłanka obalona): A −15 du, B −15.0 vbit,
C −0.285 caseload-kw. Pełna lista z dowodami: `CONFLICTS.md §1`, księgowanie: `DRIFT-LEDGER §3`.

---

## 7. Gałęzie `FOUNDATIONAL` w scalonym modelu

Trzy konflikty nie zostały rozstrzygnięte, zgodnie z `CONSENSUS-PHASE §2`. Scalony model niesie
**obie gałęzie** każdego z nich, z decydowalnym selektorem tam, gdzie selektor istnieje.

| Konflikt | Gałęzie | Selektor | Gdzie |
|---|---|---|---|
| `CONF-F-01` czym jest poprawność | `T` (odniesienie tylko z zewnątrz) / `S/R` (`q` jako zmienna stanu) | **klasyfikacja UB normy** (`NN-B-08`): `defined` → `S/R`, `undefined` → `T`, `implementation_defined` → `T` konserwatywnie | `S2`, `S4`, `S5` |
| `CONF-F-02` jednostka analizy | `per-trace` (A, B) / `ensemble` (C) | **granica `S7 | S8`**: `per-trace` gdzie istnieje podmiot z roszczeniem, `ensemble` w warstwie nadzorczej. W nadzorze dotykającym spraw w toku konflikt **wraca bez rozstrzygnięcia** | całość |
| `CONF-F-03` bodziec czy język | `incentive` (A, C) / `language` (B) | **czy dźwignia wymaga wskazania autora kroku**: `LEV-C-02/03/04` → `incentive` (skuteczne bezwarunkowo); `LEV-C-01/05/06` → `language` (**warunkowe na `NN-B-03`**) | `S2`, `S5`, `S6` |

**Wniosek operacyjny wspólny obu gałęziom `CONF-F-03`, będący produktem scalenia:**
kolejność `NN-B-03` **przed** `LEV-C-01`, `LEV-C-05`, `LEV-C-06` jest wymuszona. Żaden model
suwerenny jej nie zawiera — C nie ma pojęcia `Blame`, B nie ma dźwigni.

---

## 8. Warunki zewnętrzne scalonego modelu

| ID | Warunek | Źródło | Skutek niespełnienia |
|---|---|---|---|
| `PRE-01` | `capacity ≥ n × capacity₀`, `n ≥ 2` | `INV-C-07` ∧ `NN-A-03` ∧ `ρ_q > 0.9` | kolejka niestabilna (`ρ_q ≥ 1.8`); `CONF-D-17` |
| `PRE-02` | inwentarz pozycji UB w korpusie, `O(n)` jednorazowo, `n ≈ 10⁴–10⁵` | `NN-B-08` | brak selektora gałęzi `CONF-F-01`; obie gałęzie stosowane równolegle |
| `PRE-03` | drugi, heterogeniczny kanał obserwacji | `MRG-01` + `NN-A-03` | koszt kanału pozostaje 10 du zamiast 7.3 du |
| `PRE-04` | zacieśnienie predykatu odwołania `CON-C-01` do `[0.7, 1.027]` kwartału | test odwracalności, `DRIFT-LEDGER §7.3` | werdykt `INV-C-03` odwracalny wewnątrz tolerancji |
| `PRE-05` | budżet `Θ(n²·SAT)` dla `INV-B-02` | `THM-B-05`, `RES-B-04` | zobowiązanie niesfinansowane; `LOOP-B-04` bez tłumienia |

`PRE-05` jest jedynym warunkiem, którego **nie da się spełnić w znanym budżecie** (`10⁸–10¹⁰`
wywołań SAT). Zapisany jako nieusuwalny dług scalenia, nie jako zawężenie zakresu.

---

*Harmonizing Functor Collective · Justice-as-Code · faza konsensusowa*
