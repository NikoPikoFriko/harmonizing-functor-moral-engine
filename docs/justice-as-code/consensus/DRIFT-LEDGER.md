# DRIFT-LEDGER.md — księga dryfu łącznego, zasoby, odwracalność

Faza konsensusowa, Kroki 3–5.

**Wynik w jednym akapicie.** Jednostki dryfu trzech agentów są **niewspółmierne**; `D_total` jest
**wektorem trójskładnikowym**, nie skalarem. Księga jest podana **dwukrotnie**: w postaci zadeklarowanej
przez agentów (Księga I) i po zastosowaniu testu przesłanki z `CONFLICTS.md §0` (Księga II).
W Księdze I osią wiążącą jest B z `t* = 1.6 roku` i `N* = 2` → **`FRAGILE`**. W Księdze II czternaście
z dwudziestu dwóch ustępstw okazuje się skierowanych do wymagań, których adresat nie wystawia; po ich
unieważnieniu żadna oś ustępstw nie wiąże w horyzoncie modelu, a wiążącym ograniczeniem staje się
`MRG-03` — **koszt scalenia, którego nie zaksięgował żaden agent**, o horyzoncie **26–138 kwartałów
(6.6–34.5 roku) [EST]** i **bez predykatu odwołania**. Scalenie jest **`FRAGILE`** na obu podstawach,
przy czym w Księdze II fragilność jest **strukturalna, nie transakcyjna**. Test odwracalności: **`LOSSY`**,
trzy wyliczone straty.

---

## 1. Niewspółmierność jednostek — orzeczenie i dowód

`CONSENSUS-PHASE §4` dopuszcza dwie drogi: wykazanie przeliczalności jawnym argumentem z kursem
i niepewnością, albo orzeczenie niewspółmierności z `D_total` jako wektorem. Wybieram drugą i podaję
podstawę.

### 1.1 Trzy jednostki i ich wymiary

| Jednostka | Agent | Definicja | Wielkość mierzona | Wymiar |
|---|---|---|---|---|
| `du` | A | utrata 1 pp zdolności **zewnętrznego obserwatora** z dostępem do publicznego logu do odróżnienia `evidence-commit` od `authority-commit` | pojemność kanału obserwacji | bezwymiarowa, `[0,100]`, monotoniczna względem `obs ∈ [0,1]` |
| `vbit` | B | `c = log₂(|B_S′|/|B_S|)` — bit utraconej zdolności **modelu** do wykluczania obserwacji | entropia specyfikacji | bit, addytywna logarytmicznie, budżet `H₀ = 26` |
| `caseload-kwartał` | C | `1 caseload-kwartał = 10⁵ spraw` [ASSUMPTION]; zapas **ukrytego błędu** `E` | stan integratora w plancie | sprawa × czas, ekstensywna |

### 1.2 Dlaczego kursu nie ma

**(a) Różne nośniki.** `du` jest własnością **obserwatora**, `vbit` własnością **modelu**,
`caseload-kwartał` własnością **planta**. Przeliczenie wymagałoby odwzorowania między trzema
różnymi dziedzinami, a nie zmiany skali w jednej.

**(b) Różna algebra.** `vbit` jest logarytmiczne: dwa ustępstwa po 2 vbit usuwają razem
`2² · 2² = 16×` przestrzeni wykluczanych zachowań. `caseload-kwartał` jest ekstensywne: dwa razy
więcej ukrytych błędów to dwa razy większy zapas. `du` jest ograniczone z góry przez 100 z definicji
(pp). Żadne monotoniczne odwzorowanie nie zachowuje jednocześnie addytywności `caseload-kwartał`
i logarytmiczności `vbit`.

**(c) Różne progi o różnym pochodzeniu.** `D_crit = 50 du` pochodzi ze **zmiany znaku pętli**
(`obs_crit = δa/ρ_max = 0.5`). `H₀ = 26 vbit` pochodzi z **oszacowania treści informacyjnej modelu**
[EST, `±3.3`]. `E_crit = 0.6975 caseload-kw` pochodzi z **separatrysy układu dynamicznego**,
policzonej bisekcją (`ALG-C-07`, 40 iteracji, zbieżność `1e-5`). To trzy różne obiekty matematyczne:
punkt zmiany znaku, oszacowanie entropii, rozdzielacz basenów przyciągania.

**(d) Argument agenta B, przyjęty.** `incommensurable_pairs`: „falsyfikowalność nie ma ceny
rynkowej; przeliczenie wymagałoby metryki na przestrzeni orzeczeń, której nie ma (`NN-B-05`)".
Ta sama przeszkoda dotyczy przeliczenia `vbit` na `caseload-kwartał`.

### 1.3 Bliskie trafienie, którego **nie** wolno użyć jako kursu

`obs_crit = 0.500` (A) i `O` przy `g₁ = 1` `= 0.427` (C) zgadzają się w granicach 14.6 %
(`AGREEMENTS.md AGR-03`). Kuszące byłoby postawić `1 du = 0.01` w skali `O` i przeliczyć osie.

**Zakazane.** `obs` mierzy rozróżnialność trybu commitu przez obserwatora zewnętrznego; `O` mierzy
strukturalną obserwowalność `q` w sensie rangi macierzy Kalmana. Mają tę samą **normalizację**
i tę samą **rolę funkcyjną** (mnożnik przy członie korygującym), ale różne **definicje**. Ponadto
`D_total` C nie jest liczone w `O`, tylko w `caseload-kwartał` — kurs `du ↔ O` nie łączyłby osi
dryfu nawet gdyby był poprawny. Wpis pozostaje **zgodnością wyników**, nie kursem.
Użycie go jako mianownika byłoby `FALSE-COMMENSURATION`.

### 1.4 Orzeczenie

> **Jednostki `du`, `vbit`, `caseload-kwartał` są niewspółmierne.**
> `D_total` jest wektorem `(D_A [du], D_B [vbit], D_C [caseload-kwartał])`.
> Osobny `t*` i `N*` na każdej osi. Reguła wyboru osi wiążącej w §4.

Jedyny zbiór jednostek **przeliczalnych** w całym scaleniu to **czas uwagi orzeczniczej** —
patrz §6, tablica zasobów.

---

## 2. Księga I — dryf zadeklarowany przez agentów

Wszystkie 22 wpisy przyznane przez trzech agentów, bez testu przesłanki. Rekonstrukcja formuł
zweryfikowana wobec własnych tabel agentów: dla C odtworzono `D(0) = 0.345`, `D(8) = 0.415`,
`D(24) = 0.707`, `D(40) = 1.052` i udziały 40.3 % / 18.1 % / 12.8 % — zgodność dokładna;
dla B odtworzono `Σc = 17.30`, `Σκ = 3.89`, `D(0) = 21.19`, `D(1.6) = 26.2` — zgodność dokładna;
dla A `D(0) = 24.0`, `D(10) = 49.2`, człon sprzężeń `= 0` — zgodność dokładna.

### 2.1 Oś A — `du`, próg 50 (sterowalność) / 100 (sens)

`D_A(t) = Σᵢ cᵢ·κᵢ(t) + γ·Σ_{i<j, ta sama rodzina} cᵢ·cⱼ`, `γ = 0.02`

| Wpis | Etap | Koszt [du] | Kumulacja | Rodzina | Odwracalność |
|---|---|---|---|---|---|
| `CON-A-01` | S2 | 12 | liniowa `a = 0.15/rok` | observability | full |
| `CON-A-03` | S4 | 5 | liniowa `a = 0.08/rok` | ordering | full |
| `CON-A-05` | S6 | 4 | liniowa `a = 0.05/rok` | replay | full |
| `CON-A-07` | S1 | 3 | liniowa `a = 0.04/rok` | delivery | full |

Cztery różne rodziny ⟹ człon sprzężeń `= 0`.
`D_A(t) = 24 + 2.52·t` [du/rok]

- **`D_A(0) = 24.0 du`** (48 % progu wiążącego)
- **`t*_A = 10.3 roku`** dla `D_crit = 50 du` (A deklaruje 10.5; różnica to zaokrąglenie —
  `D_A(10.5) = 50.5`, `D_A(10.32) = 50.0`)
- **`N*_A = 3`**: `(50 − 24)/6.75 = 3.85`, gdzie `6.75 du` to średnia z **pełnego zbioru
  kandydatów** (54 du / 8 wpisów) — metoda własna A

Cztery odrzucone kandydatury A (`CON-A-02`, `CON-A-04`, `CON-A-06`, `CON-A-08`, razem 30 du)
nie wchodzą do księgi. Odrzucenie `CON-A-08` (jedyne nieodwracalne u A) jest tu istotne: A jako
jedyny agent **odrzucił** swoje ustępstwo nieodwracalne. B i C swoje przyznali.

### 2.2 Oś B — `vbit`, próg `H₀ = 26` [EST ±3.3]

`D_B(t) = Σᵢ cᵢ(t) + Σ_{i<j} κ_ij·√(cᵢ(t)·cⱼ(t))`

| Wpis | Etap | Koszt [vbit] | Kumulacja | Odwracalność |
|---|---|---|---|---|
| `CON-B-01` | S5 | 3.2 | E, `g = 0.15/rok`, `T2x = 4.6 lat` | partial |
| `CON-B-02` | S2 | 2.0 | L, `ρ = 0.10/rok` | full |
| `CON-B-03` | S8 | 1.6 | L, `ρ = 0.10/rok` | full |
| `CON-B-04` | S6 | 0.8 | P, skok do 4.0 przy `t ≈ 4 lata` | partial |
| `CON-B-05` | S5 | 4.5 | E, `g = 0.25/rok`, `T2x = 2.8 lat` | **none** |
| `CON-B-06` | S3 | 2.4 | L, `ρ = 0.20/rok` | partial |
| `CON-B-07` | S1..S5 | 1.2 | stała (jeśli instrumentacja nie powstanie) | full |
| `CON-B-08` | S4 | 0.6 | stała | full |
| `CON-B-09` | S7 | 1.0 | L, `ρ = 0.05/rok` | full |

Sprzężenia: `(01,06) κ = 0.5`, `(01,07) κ = 0.4`, `(02,05) κ = 0.6`, `(03,04) κ = 0.3`,
`(01,08) κ = −0.3`. `Σκ(0) = +3.89`.

- **`D_B(0) = 21.2 vbit`** (**81.5 %** budżetu)
- **`t*_B = 1.6 roku`** (`D_B(1.6) = 26.2 ≥ 26`)
- **`N*_B = 2`**: `(26 − 21.2)/2.35`, gdzie `2.35 vbit` = średni koszt `1.92` + średni wkład
  sprzężeniowy `0.43`

### 2.3 Oś C — `caseload-kwartał`, próg `E_crit = 0.6975`

`D_C(t) = Σᵢ cᵢ·κᵢ(t)`, `κ_lin = 1 + aᵢt`, `κ_exp = 2^{t/hᵢ}`, `κ_prog = 1` dla `t < Tᵢ`, `Jᵢ` dalej.
`t` w kwartałach.

| Wpis | Etap | Koszt | Kumulacja | Odwracalność | Udział w `D(40 kw)` |
|---|---|---|---|---|---|
| `CON-C-01` | S2 | 0.020 | liniowa `a = 0.020/kw` | full | 3.4 % |
| `CON-C-02` | S5 | 0.060 | wykładnicza `h = 24 kw` | partial | **18.1 %** |
| `CON-C-03` | S2 | 0.045 | progowa `T = 12 kw`, `J = 3.0` | partial | **12.8 %** |
| `CON-C-04` | S1 | 0.025 | liniowa `a = 0.015/kw` | full | 3.8 % |
| `CON-C-05` | S8 | 0.050 | wykładnicza `h = 32 kw` | partial | 11.3 % |
| `CON-C-06` | S6 | 0.015 | liniowa `a = 0.005/kw` | full | 1.7 % |
| `CON-C-07` | S4 | 0.075 | wykładnicza `h = 16 kw` | **none** | **40.3 %** |
| `CON-C-08` | S0..S8 | 0.025 | liniowa `a = 0.010/kw` | full | 3.3 % |
| `CON-C-09` | S3 | 0.030 | liniowa `a = 0.020/kw` | full | 5.1 % |

- **`D_C(0) = 0.345 caseload-kw`** (49.5 % progu)
- **`t*_C = 24 kw = 6.0 roku`** (`D_C(24) = 0.707 ≥ 0.6975`)
- **`N*_C = 9`**: `(0.6975 − 0.345)/0.03833 = 9.2`, gdzie `0.03833` to średni koszt wpisu
  (`0.345/9`). C podaje alternatywne ujęcie („do progu mieści się 8 ustępstw przy `t = 40 kw`");
  liczba tutaj jest liczona wedle definicji `CONSENSUS-PHASE §3` (**dodatkowe** wpisy od `t = 0`).

### 2.4 `D_total` — Księga I

```
D_total(0) = ( 24.0 du , 21.2 vbit , 0.345 caseload-kwartał )
t*         = ( 10.3 lat , 1.6 roku , 6.0 lat )
N*         = ( 3 , 2 , 9 )
```

**Oś wiążąca: B.** Reguła wyboru — §4.
**Kwalifikacja: `FRAGILE`** (`N*_B = 2`, rząd jedności).

---

## 3. Księga II — po teście przesłanki

Test P (`CONFLICTS.md §0`) unieważnił **14 z 22** przyznanych wpisów. Każdy unieważniony wpis
**pozostaje w księdze z pełną treścią** i wskazaniem sekcji z dowodem. Nie jest to usunięcie
ustępstwa ani jego przewycenienie — jest to stwierdzenie, że wymaganie, na rzecz którego zostało
udzielone, nie zostało wystawione.

### 3.1 Wpisy `VOID-PREMISE-FAILED`

| Wpis | Koszt | Adresat deklarowany | Czym obalona przesłanka | Sekcja |
|---|---|---|---|---|
| `CON-A-01` | 12 du | T (typy) | brak `NN-B-*`/`INV-B-*` o custody; `INV-B-04` spełnione przez `INV-A-01`+`INV-A-05` przy 0 du | `CONF-D-13` |
| `CON-A-07` | 3 du | T | brak modelu doręczenia u B i C; treść pola `na rzecz` = treść `NN-A-09` | `CONF-D-14` |
| `CON-B-01` | 3.2 vbit | K1 (konsensus) | FLP nie stosuje się przy `n = 1`; `NN-A-07` żąda oznaczenia, nie zbieżności | `CONF-D-01` |
| `CON-B-02` | 2.0 vbit | K1 | teza A: quorum intersection strukturalnie niespełnialne; `NN-A-07` | `CONF-D-05` |
| `CON-B-03` | 1.6 vbit | K1 | `INV-A-03`, `NN-A-05`, `NN-A-06`, `INV-A-08` żądają determinizmu replayu | `CONF-D-06` |
| `CON-B-05` | **4.5 vbit** | K2 (sterowanie) | konstrukcja `q̂` z metryki dyskretnej; `PRIM-C-02` operuje na agregatach | `CONF-D-07` |
| `CON-B-06` | 2.4 vbit | K2 | zbiór minimalny C zawiera `rank = 2`, `ρ = 0`, `c_d = 0` | `CONF-D-04` |
| `CON-B-07` | 1.2 vbit | K2 | `PRIM-C-05` działa tylko na podprzestrzeni obserwowalnej; `NN-C-01` żąda czujnika | `CONF-D-08` |
| `CON-C-02` | 0.060 | R (konsensus) | safety domknięte na prefiksy; `LOOP-A-03`, `THM-B-10` | `CONF-D-02` |
| `CON-C-03` | 0.045 | R | `NN-A-07`, `INV-A-06`, `NN-A-08`, `NN-B-03` żądają atrybucji indywidualnej | `CONF-D-05` |
| `CON-C-04` | 0.025 | T | `INV-B-01/02/05` mają `violation_detectable: false`; `THM-B-14` | `CONF-D-11` |
| `CON-C-05` | 0.050 | T | świadek: A trzyma `PRIM-A-09` i `LOOP-A-05` jednocześnie | `CONF-D-12` |
| `CON-C-07` | **0.075** | R | `NN-A-07`, `RES-A-01`, `PRIM-A-11`; brak wymogu liveness u A | `CONF-D-01` |
| `CON-C-09` | 0.030 | R | `RES-A-01`, `RES-A-03`, `PRIM-A-11`, `LOOP-A-08` — A ma error budget i krytykuje timeout | `CONF-D-10` |

Suma unieważniona: **15 du**, **15.0 vbit**, **0.285 caseload-kw** — odpowiednio **62 %**, **87 %**
i **83 %** zadeklarowanego dryfu.

`CON-B-08` **nie** został unieważniony — adresat poprawiony z K1 na C (`CONF-D-09`), wpis zostaje.

### 3.2 Wpisy pozostające w mocy

| Wpis | Koszt | Adresat rzeczywisty | Wymaganie, które go wymusza |
|---|---|---|---|
| `CON-A-03` | 5 du | C | `NN-C-08` (`τ_a ≤ 4 kw` dla klasy krytycznej) ⟹ `¬FIFO`: w kolejce o stałej przepustowości FIFO daje z konstrukcji **identyczny** rozkład czasu oczekiwania wszystkim klasom, więc zróżnicowane cele opóźnienia są pod FIFO nieosiągalne |
| `CON-A-05` | 4 du | C | ta sama przesłanka + stała zdolność instancji odwoławczej: skrócenie `τ_a` dla klasy krytycznej wymaga realokacji `RES-A-06` między klasami |
| `CON-B-04` | 0.8 vbit | A | `NN-A-10` z predykatem odwołania „`d_max < 1` dla jakiejkolwiek klasy" ⟹ `d_max ≥ 1` ⟹ semantyka **at-least-once** dla kanału odwoławczego |
| `CON-B-08` | 0.6 vbit | C | `INV-C-07` (`S ≤ S_max`), `RES-C-06` (`S* = 0.549–0.716` wobec `SLO ≤ 0.15`), `FAIL-C-05` |
| `CON-B-09` | 1.0 vbit | C | `FAIL-C-02` (nasycenie aktuatora), `NN-C-05` (para `(M, demand−M)`), `ALG-C-05` |
| `CON-C-01` | 0.020 | A + protokół | `INV-A-03` (funkcja przejścia bez wall-clock) + `PROTOCOL.md §1` (oś `S0..S8` obowiązkowa) |
| `CON-C-06` | 0.015 | B | `PROTOCOL.md §6` (argument formalny) + framing `INV-*` jako wspólny słownik poprawności |
| `CON-C-08` | 0.025 | A | `RES-A-02` (pula legitymacji jako zasób) — forma **związana**, raport, nigdy wejście pętli, zgodnie z `NN-C-07` |

### 3.3 Koszty scalenia zaksięgowane przez orkiestratora

Krok 3 nakazuje zsumować ustępstwa agentów. Scalenie wytwarza jednak koszty, których **żaden agent
nie mógł zaksięgować**, bo są widoczne dopiero po złożeniu modeli. Pominięcie ich byłoby
`SILENT-WEAKENING` na warstwie scalenia.

#### `MRG-01` — wspólny kanał obserwacji jest awarią wspólnej przyczyny

Wszystkie trzy pętle naprawcze scalonego modelu przechodzą przez **jeden** nowy kanał obserwacji
(`AGREEMENTS.md AGR-02`). `NN-A-03` zastosowane **refleksyjnie do samego kanału**:
`P_joint(p, ρ, n) = ρp + (1−ρ)pⁿ`. Przy jednym kanale `n = 1` i `P = p = 0.10` [EST wartości A],
więc `obs ≤ 0.90`.

- **Koszt: 10 du**, stały (nie kumuluje się), księgowany na osi A.
- **Odwracalność: częściowa.** Drugi kanał heterogeniczny (`n = 2`) daje
  `P = 0.7·0.10 + 0.3·0.01 = 0.073`, czyli `obs ≤ 0.927` → **7.3 du**. Podłoga `ρ·p = 7 du`
  jest **nieusuwalna przy dowolnym `n`** — to jest treść `NN-A-03`.
- Uzasadnienie księgowania na osi A: `du` jest jedyną jednostką mierzącą pojemność kanału obserwacji.
  Analogicznego kosztu na osiach B i C **nie księguję**, bo nie umiem go wyrazić w `vbit` ani
  w `caseload-kwartał` bez kursu, którego §1 zakazuje. Jest to **znane niedoszacowanie** `D_B` i `D_C`.

#### `MRG-03` — nieodsączalna składowa zapasu błędu

Wyprowadzenie w §5. **Nie jest ustępstwem**, więc nie wchodzi do `D_total`; jest osobnym
ograniczeniem czasowym scalonego modelu i to **ono wiąże** Księgę II.

#### `MRG-02` — koszt czasowy zobowiązań scalonych

550–820 s/sprawę [EST] (`AGREEMENTS.md AGR-07`), czyli 3–11 % `RES-A-03` i 1.5–2.3 % `RES-B-01`.
Jest to koszt **zasobowy**, nie dryfowy: zużywa uwagę, nie falsyfikowalność. Księgowany w §6,
nie w `D_total`. Mieści się w budżecie.

### 3.4 Przeliczenie Księgi II

**Oś A.** `D_A(t) = 5(1 + 0.08t) + 4(1 + 0.05t) + 10 = 19 + 0.6t` [du], rodziny `ordering`
i `replay` rozłączne ⟹ człon sprzężeń `= 0`.
- `D_A(0) = 19.0 du` (38 % progu 50)
- `t*_A = (50 − 19)/0.6 = 51.7 roku`
- `N*_A = (50 − 19)/6.75 = 4.59 → 4`

**Oś B.** Pozostają `CON-B-04`, `CON-B-08`, `CON-B-09`. **Żadna para sprzężona nie przeżyła**
(`(01,06)`, `(01,07)`, `(02,05)`, `(03,04)`, `(01,08)` — wszystkie zawierają wpis unieważniony),
więc `Σκ = 0`.
`D_B(t) = J(t) + 0.6 + 1.0(1 + 0.05t)`, gdzie `J(t) = 0.8` dla `t < 4`, `4.0` dla `t ≥ 4`.
- `D_B(0) = 2.4 vbit` (9.2 % `H₀`)
- `D_B(4⁺) = 5.6 vbit`; `t*_B`: `5.6 + 0.05t = 26` → **`t* ≈ 4.1·10² roku`** — poza horyzontem
  modelu, oś **nie wiąże**
- `N*_B = (26 − 2.4)/2.35 = 10.0 → 10`

**Oś C.** Pozostają `CON-C-01`, `CON-C-06`, `CON-C-08`. **Żaden człon wykładniczy nie przeżył**
(`CON-C-02`, `CON-C-05`, `CON-C-07` unieważnione).
`D_C(t) = 0.060 + 0.000725·t` [caseload-kw, `t` w kwartałach]
- `D_C(0) = 0.060 caseload-kw` (8.6 % progu)
- `t*_C = (0.6975 − 0.060)/0.000725 = 879 kw = 220 lat` — poza horyzontem, oś **nie wiąże**
- `N*_C = (0.6975 − 0.060)/0.03833 = 16.6 → 16`

### 3.5 `D_total` — Księga II

```
D_total(0) = ( 19.0 du , 2.4 vbit , 0.060 caseload-kwartał )
             ( z czego 10.0 du to MRG-01, koszt scalenia, nie ustępstwo )
t*         = ( 51.7 lat , ~4.1·10² lat , 2.2·10² lat )
N*         = ( 4 , 10 , 16 )

wiąże:     MRG-03 = 26–138 kwartałów = 6.6–34.5 roku [EST]
           bez predykatu odwołania
```

---

## 4. Reguła wyboru osi wiążącej

Jednostki są niewspółmierne, więc `D_total` nie ma porządku. Ale **`t*` ma**: jest to czas,
a czas jest wspólny dla trzech modeli (`1 kwartał = 90 dni`, `PROTOCOL.md` nie różnicuje czasu
kalendarzowego między agentami). Stąd:

> **Reguła wiązania.** Osią wiążącą jest ta o **najmniejszym `t*`**, mierzonym w latach.
> Kwalifikacja `FRAGILE` rozstrzyga się przez `N*` **tej** osi.
> Ograniczenia niebędące ustępstwami (`MRG-*`) wchodzą do porównania na równi z osiami ustępstw,
> jeżeli mają wyznaczony `t*`.

Reguła jest legalna, bo nie przelicza jednostek — porównuje wyłącznie momenty przekroczenia progów,
z których każdy jest zdefiniowany we własnej jednostce. Jest to porównanie **dat**, nie **kosztów**.

| Księga | Oś wiążąca | `t*` | `N*` osi wiążącej |
|---|---|---|---|
| I | **B** (`vbit`) | 1.6 roku | **2** |
| II | **`MRG-03`** (na osi `caseload-kwartał`, ale nie jako ustępstwo) | 6.6–34.5 roku [EST] | **n/d — brak predykatu odwołania** |

---

## 5. `MRG-03` — wyprowadzenie wiążącego ograniczenia scalenia

To jest wielkość, której **nie zawiera żaden model suwerenny**. Powstaje ze złożenia wyniku A i B
(brak drenu wejścia) z modelem integratora C.

**Krok 1 — dekompozycja zapasu błędu.** `E = E_input + E_transition`, gdzie `E_input` pochodzi
z defektów `S1`/`S2`, a `E_transition` z defektów funkcji przejścia `S4`/`S5`.

**Krok 2 — `S6` nie drenuje `E_input`.** Dwa niezależne dowody: A (`THM-A-01`, brak krawędzi
`S6 → S2`, `floorStage = S3` powyżej źródła defektów) i B (`THM-B-07`: `sp(¬I₂, S3;S4;S5) = true`;
apelacja to rerun późnych faz **na tym samym AST**). Jedyna krawędź naprawy wejścia w scalonym
modelu to `S3 → S2` z `NN-B-06`, ale `THM-B-08` orzeka, że jej wyzwalacz `I₂` jest w `S3`
niesprawdzalny (kwantyfikuje po `material(F)` definiowanym dopiero w `S5`). Krawędź istnieje,
wyzwalacz nie działa.

**Krok 3 — kalibracja `ν` z własnych liczb C.** `INV-C-02`: `dE/dt ≤ ν(1−q)`. Przy pełnym maskowaniu
`O = 0`, więc `γ_eff = γ₀·O = 0` i dren znika; C podaje przekroczenie `E_crit = 0.6975` w **8.7 kw**.

```
ν = E_crit / (8.7 · (1 − q))
q = 0.269 (A_legit)  →  ν = 0.6975 / (8.7 · 0.731) = 0.110 /kw
q = 0.670 (A_praca)  →  ν = 0.6975 / (8.7 · 0.330) = 0.243 /kw
```

Trajektoria pełnego maskowania przebiega od `A_praca` do `A_legit`, więc `ν ∈ [0.110, 0.243] /kw` [EST].

**Krok 4 — tempo narastania `E_input` w dobrym atraktorze.** Przyjmij `A_praca`: `q = 0.670`,
`masking_rate = 0.000`, `O = 0.600`. Endogenne maskowanie jest zerowe — to jest **najkorzystniejszy
możliwy punkt pracy** scalonego modelu.

```
dE_input/dt = ν · (1 − q) · φ_input = ν · 0.330 · φ_input
φ_input ∈ [0.14, 0.33]   (A, THM-A-01 [EST])
```

| `ν` [1/kw] | `φ_input` | `dE_input/dt` [caseload-kw/kw] | czas do `E_crit` |
|---|---|---|---|
| 0.110 | 0.14 | 0.00507 | **138 kw** = 34.5 roku |
| 0.110 | 0.33 | 0.01195 | 58 kw = 14.6 roku |
| 0.243 | 0.14 | 0.01123 | 62 kw = 15.5 roku |
| 0.243 | 0.33 | 0.02646 | **26 kw** = 6.6 roku |

**Wynik.**

> **`MRG-03`.** W scalonym modelu, w **dobrym** atraktorze `A_praca`, przy **zerowym** endogennym
> maskowaniu i pełnej obserwowalności `O = 0.600`, nieodsączalna składowa zapasu błędu przekracza
> separatrysę `E_crit = 0.6975 caseload-kw` w **26–138 kwartałów (6.6–34.5 roku) [EST]**.
> Przekroczenie separatrysy przenosi układ do `A_legit`.

**Dlaczego to wiąże scalenie, a nie tylko model C.** Ograniczenie jest widoczne wyłącznie po
złożeniu: C ma integrator, ale nie ma dowodu o braku krawędzi `S6 → S2` (nie modeluje grafu przejść);
A i B mają ten dowód, ale nie mają integratora ani `E_crit`. Żaden model suwerenny nie mógł tej liczby
policzyć.

**Dlaczego jest gorsze niż każde ustępstwo.** Nie ma predykatu odwołania. Wszystkie 22 wpisy
ustępstw mają predykaty odwołania; `MRG-03` nie jest ustępstwem, więc nie da się go cofnąć przez
wycofanie zgody. Jedyne drogi wyjścia:
1. wykazanie, że `φ_input < 0.05` (`CONFLICTS.md CONF-E-03`) — przesuwa horyzont poza 90 lat [EST];
2. wskazanie istniejącej procedury zwracającej kontrolę do `S2` z częstością `≥` częstości powstawania
   defektów wejściowych — obala jednocześnie `THM-A-01` i `THM-B-07`;
3. uczynienie wyzwalacza `NN-B-06` sprawdzalnym w `S3`, co wymaga obalenia `THM-B-08`.

**Efekt uboczny o przeciwnym znaku, ten sam rachunek.** Skoro `S6` drenuje tylko `E_transition`,
skuteczne wzmocnienie pętli ujemnej C wynosi `γ_eff = γ₀·O·(1 − φ_input) ∈ [0.1205, 0.1547] /kw`
zamiast `0.1799 /kw`. Wykorzystanie marginesu opóźnienia spada z **97.5 %** do **65–84 %**
(`g_crit(8) = 0.1845 /kw`). Ryzyko chatteringu (`FAIL-C-04`) maleje. Scalenie **poprawia** jedną
liczbę C i **psuje** inną, i obie zmiany pochodzą z tego samego twierdzenia.

---

## 6. Krok 4 — scalona tablica zasobów

30 zasobów z trzech modeli (A: 10, B: 12, C: 8), zgrupowanych funkcjonalnie.
Kolumna **relacja** stosuje kryterium tożsamości Kroku 1: te same warunki poprawności, ten sam tryb
awarii, ta sama złożoność.

### 6.1 Grupa 1 — autorytet podstawiany zamiast dowodu · **`RIVAL`, niewspółmierne z wszystkim**

| ID | Jednostka | `finite` | Płatnik | Miarkowanie / wyczerpanie |
|---|---|---|---|---|
| `RES-A-01` | FG (~0.5 judge-hour ~156 PLN, **kurs wewnętrzny A**) | **true** | przegrywający natychmiast, populacja z opóźnieniem 3–15 lat | brak pre-execution check; przy wyczerpaniu **fork**, nie out-of-gas |
| `RES-B-07` | użycie / orzeczenie | **false** | strona przegrywająca | **BRAK** — jedyny zasób bez licznika, limitu i śladu |
| `RES-C-01` | AU, `Gmax = 100` | **true** | przegrywający na deficycie dowodowym; ekonomicznie przyszła legitymacja | `M = min(demand, G/gSpend)`, **twarde nasycenie**; `G* = 1.8 %` pojemności; brak licznika |

**Relacja: `RIVAL`** — ten sam referent, trzy różne tryby awarii (fork / brak / nasycenie).
Rozstrzygnięcie: `CONFLICTS.md CONF-E-01` (`EMPIRICAL`).
**Niewspółmierne z każdą inną jednostką.** Kurs `1 FG ≈ 0.5 judge-hour` podany przez A jest jego
**wewnętrzną ceną cienia** [EST] i **nie jest kursem scalenia**: B deklaruje `RES-B-07` jako zasób
bez kursu („wycena byłaby wprowadzeniem liczby tam, gdzie nie ma pomiaru"), a C mierzy go
w `AU` zdefiniowanych przez rezerwuar, nie przez czas.

### 6.2 Grupa 2 — uwaga orzecznicza · **`SAME`, jednostki PRZELICZALNE**

| ID | Jednostka | Wartość | Płatnik |
|---|---|---|---|
| `RES-A-03` | judge-hour (~313 PLN [EST]) | 2.0–5.3 h/sprawę dostępne wobec 20.8 h czytania akt 1000 str. | budżet publiczny |
| `RES-B-01` | krok wyprowadzenia (vgas) | ~1.2·10³ vgas/sprawę | sąd (alokacja) + strony (kierunek) |
| `RES-B-02` | s/sprawę | 3.6·10⁴ s dla sprawy poważnej [EST] | budżet państwa |
| `RES-C-05` | case-hour | hard deadline (prekluzja), nie backpressure; niedobór **przelewa się na `RES-C-01`** | strony, przez czas postępowania |

**Kurs, z uzasadnieniem i niepewnością:**

```
1 vgas = 30 s uwagi orzekającej          (PRIM-B-14, [EST])
1 judge-hour = 3600 s = 120 vgas
RES-B-02 = 3.6·10⁴ s = 10 judge-hour = 1.2·10³ vgas   ← zgodne z RES-B-01, kontrola przeszła
```

Niepewność kursu: rząd wielkości definicji „kroku wyprowadzenia" [EST]; B podaje 30 s bez pomiaru.
Kontrola spójności **przechodzi**: `RES-B-02 / 30 s = 1.2·10³ = RES-B-01` dokładnie, więc kurs jest
wewnętrznie zgodny u B. Kontrola między A i B: A daje 2.0–5.3 judge-hour = 240–636 vgas/sprawę,
B daje 1.2·10³ vgas/sprawę — rozbieżność **2–5×**, w granicach oszacowań [EST] obu stron.
Jest to jedyne miejsce scalenia, gdzie kurs jest **dozwolony i podany**.

**`RES-C-05` bez liczby** — C podaje mechanizm (przelew na `RES-C-01`), nie wartość. Wpis wchodzi
do grupy jako `SAME` na podstawie roli i trybu awarii, ale nie wnosi liczby do kursu.

### 6.3 Grupa 3 — obserwowalność · **`ORTHOGONAL`, NIEwspółmierne mimo tej samej normalizacji**

| ID | Jednostka | Definicja | Punkt krytyczny |
|---|---|---|---|
| `RES-A-09` | `obs ∈ [0,1]`; wydatek w `du` | zdolność obserwatora zewnętrznego do odróżnienia `evidence`/`authority` commit | `obs_crit = 0.500`; progi `D_crit = 50 du`, `D* = 100 du` |
| `RES-C-03` | `O ∈ [0,1]` | strukturalna obserwowalność `q` (ranga macierzy Kalmana) | `g₁ = 1` przy `O = 0.427`; dominacja maskowania przy `O* = 0.25` |
| `RES-B-08` | assume / krok wyprowadzenia (`ρ_a`) | gęstość dziur w wyprowadzeniu | brak pomiaru; proxy NLP, `10⁰–10¹` na uzasadnienie [EST] |

**Ta sama normalizacja `[0,1]`, ta sama rola funkcyjna, różne definicje — patrz §1.3.**
Progi `0.500` i `0.427` zgadzają się w granicach 14.6 %, co jest zapisane jako zgodność wyników
(`AGREEMENTS.md AGR-03`), **nie jako kurs**. `RES-B-08` jest trzecim, niezależnym proxy tej samej
przestrzeni problemu, w jednostce nieprzeliczalnej na żadną z dwóch pozostałych.

### 6.4 Grupa 4 — legitymacja i reputacja · **`ORTHOGONAL` (różne poziomy agregacji)**

| ID | Jednostka | Poziom | Miarkowanie |
|---|---|---|---|
| `RES-A-02` | pp indeksu złożonego | **system** | post-hoc; proxy: udział rozstrzygnięć wykonanych dobrowolnie bez wszczęcia egzekucji |
| `RES-C-02` | RU (reputation unit) | **aktor** | `U(ujawnij) = −c_d`, `U(zamaskuj) = −c_m·φ·O`; przewaga maskowania `+1.00 RU/sprawę` w `A_legit` |
| `RES-B-09` | jednostka przypisania (1 na orzeczenie) | **krok wyprowadzenia** | brak; `α + β < 1`, reszta **wycieka**, bo `majesty` nie ma adresata |

Trzy różne poziomy agregacji tej samej wielkości społecznej. **Niewspółmierne** — B deklaruje wprost
`RES-B-09 ⊥ RES-B-06 PLN` („odszkodowanie nie jest przeliczeniem winy na pieniądz; sklejenie to
główny kanał usuwania blame z modelu przez zmianę typu"). Ten sam argument stosuje się do
`RU ↔ pp indeksu`.

### 6.5 Grupa 5 — czas · **`SAME`, PRZELICZALNE**

| ID | Jednostka | Asymetria |
|---|---|---|
| `RES-A-04` | dzień | jednostronna: termin strony **zawity**, termin organu **instrukcyjny**; brak view-change |
| `RES-B-10` | dzień | terminy instrukcyjne bez sankcji; **absorbująca bariera** z `THM-B-11` |
| `RES-B-12` | dzień (vacatio legis) | domyślnie 14 dni PL, przy koszcie re-weryfikacji korpusu `10⁰–10²` h [EST] |
| — | kwartał (C) | `1 kwartał = 90 dni` (`model_units` C) |

**Kurs: `1 kwartał = 90 dni`, dokładny (definicyjny).** `RES-A-04` i `RES-B-10` opisują tę samą
wielkość z tą samą asymetrią — `SAME`.

### 6.6 Grupa 6 — budżet strony · **`SAME`, PRZELICZALNE w PLN, z rozbieżnym kursem na vgas**

| ID | Jednostka | Kurs deklarowany |
|---|---|---|
| `RES-A-07` | PLN | wyznacza `r` w `O(r·|F|)`, więc pokrycie stanu jest funkcją budżetu |
| `RES-B-06` | PLN | `~0.24 vgas/PLN` [EST] |

Kontrola krzyżowa: z `RES-A-03` (313 PLN/judge-hour) wynika `120 vgas / 313 PLN = 0.383 vgas/PLN`;
B podaje `0.24 vgas/PLN`. Rozbieżność **1.6×**. **Nie jest to sprzeczność** — A wycenia uwagę
**sądu** (budżet publiczny), B wycenia zakup **kierunku przeszukiwania** przez stronę (rynek usług
prawnych). Dwa różne rynki, dwa różne kursy. Zapisane jako rozbieżność, nie uzgodnione.

### 6.7 Grupa 7 — rama interpretacyjna · **`ORTHOGONAL`, jednostki wzajemnie dualne**

| ID | Jednostka | Wielkość | Relacja |
|---|---|---|---|
| `RES-A-08` | `θ [1/rok]` | **tempo odbudowy** kotwicy semantycznej; stosunek stałych czasowych zużycia do odbudowy `~10²` | dualna do `RES-C-08` |
| `RES-C-08` | `Θ ∈ [0,1]` | **poziom** skumulowanego dryfu wzorca; spłata tylko przez `c_cal·O` | dualna do `RES-A-08` |
| `RES-B-03` | jednostka redakcyjna (`n`) | rozmiar korpusu, `10⁴–10⁵` [EST]; **brak przebiegu DCE** | ortogonalna |
| `RES-B-05` | orzeczenie | cache precedensów, `10⁵–10⁶` [EST]; brak eviction, brak deps | ortogonalna |
| `RES-B-12` | dzień | okno deprecjacji | patrz grupa 5 |

`θ` jest **tempem** `[1/czas]`, `Θ` jest **poziomem** `[bezwymiarowy]`. Przeliczenie wymagałoby
całkowania po pełnej trajektorii, czyli znajomości rozwiązania, którego szukamy.
**Oznaczone jako niewspółmierne**, mimo formalnej relacji dualności.

### 6.8 Grupa 8 — zasoby o jednym właścicielu

| ID | Jednostka | Agent | Uwaga scalenia |
|---|---|---|---|
| `RES-A-05` | liczba posiadaczy o rozbieżnych interesach | A | brak odpowiednika u B i C; wchodzi do scalenia bez relacji |
| `RES-A-06` | instancja | A | powiązane z `NN-C-08` (`τ_a` w kwartałach) — **różne wymiary** (głębokość vs opóźnienie), niewspółmierne |
| `RES-A-10` | zdarzenie niekompensowalne (`finite: false`) | A | scalone z `CON-B-09`: `Effect` zyskuje `(compensable: bool, saturation: number)` |
| `RES-B-04` | wywołanie SAT | B | potrzeba `Θ(n²) = 10⁸–10¹⁰`, wydawane **~0**; scalenie dziedziczy jako **zobowiązanie niesfinansowane** |
| `RES-B-11` | **vbit** | B | jednostka dryfu B; `⊥` wszystko (§1) |
| `RES-C-04` | **caseload-kwartał** | C | jednostka dryfu C; próg `E_crit = 0.6975 = 69 750 spraw`; nośnik `MRG-03` |
| `RES-C-06` | udział obciążenia `S ∈ [0,1]` | C | `S* = 0.549–0.716` wobec `SLO ≤ 0.15`; odpowiada `ρ_q > 0.9` u A (`LOOP-A-07`) — **zgodność rzędu, nie kurs** |
| `RES-C-07` | case-hour korekty odroczonej | C | mnożnik kosztu naprawy `×1` na `S1` do `×100` na `S7`; przeliczalny na grupę 2 przez `case-hour` |

### 6.9 Rejestr par niewspółmiernych — **jawny, wymagany przez §4**

| Para | Powód |
|---|---|
| `du` ⊥ `vbit` | własność obserwatora kontra własność modelu; skala liniowa ograniczona kontra logarytmiczna |
| `du` ⊥ `caseload-kwartał` | własność obserwatora kontra stan integratora planta; różne progi o różnym pochodzeniu matematycznym |
| `vbit` ⊥ `caseload-kwartał` | entropia specyfikacji kontra zapas błędu; brak metryki na przestrzeni orzeczeń (`NN-B-05`) |
| `RES-B-11 vbit` ⊥ `RES-B-06 PLN` | deklaracja własna B: falsyfikowalność nie ma ceny rynkowej |
| `RES-B-07 majesty_token` ⊥ **cokolwiek** | deklaracja własna B: zasób bez licznika nie ma kursu |
| `RES-B-09 blame` ⊥ `RES-B-06 PLN` | deklaracja własna B: odszkodowanie nie jest przeliczeniem winy |
| `RES-A-01 FG` ⊥ `RES-C-01 AU` ⊥ `RES-B-07` | ten sam referent, `RIVAL` co do skończoności i trybu wyczerpania (`CONF-E-01`) |
| `RES-A-09 obs` ⊥ `RES-C-03 O` | ta sama normalizacja i rola, różne definicje (§1.3) |
| `RES-A-08 θ [1/rok]` ⊥ `RES-C-08 Θ [0,1]` | tempo kontra poziom; przeliczenie wymaga całkowania po szukanej trajektorii |
| `RES-A-06 instancja` ⊥ `NN-C-08 τ_a [kw]` | głębokość rollbacku kontra opóźnienie pętli; różne wymiary |
| `RES-C-06 S [0,1]` ⊥ `LOOP-A-07 ρ_q` | udział obciążenia kontra intensywność ruchu; zgodność rzędu wielkości, nie kurs |

**Pary przeliczalne (kompletna lista):** grupa 2 (`judge-hour ↔ s ↔ vgas ↔ case-hour`,
`1 judge-hour = 3600 s = 120 vgas` [EST na `1 vgas = 30 s`]); grupa 5 (`dzień ↔ kwartał`,
`1 kwartał = 90 dni`, dokładny); grupa 6 (`PLN ↔ PLN`, tożsamość, z **rozbieżnym** kursem na vgas:
0.24 kontra 0.383, dwa różne rynki).

---

## 7. Krok 5 — test odwracalności

**Pytanie.** Czy z `MERGED-SPEC.md` da się odtworzyć każdy z trzech modeli suwerennych przez
cofnięcie zapisanych ustępstw?

**Metoda.** Dla każdego agenta: (i) sprawdź, czy każdy wpis obniżający model jest w księdze z pełną
treścią; (ii) sprawdź deklarowaną odwracalność każdego wpisu pozostającego w mocy; (iii) sprawdź,
czy scalenie wprowadziło osłabienia **spoza** księgi.

### 7.1 Agent A

Wpisy w mocy: `CON-A-03` (full), `CON-A-05` (full). Wpisy `VOID`: `CON-A-01`, `CON-A-07` — nie
zostały zastosowane, więc nie mają residuum. Kandydatury odrzucone przez A (`CON-A-02`, `-04`,
`-06`, `-08`) nigdy nie weszły.
Osłabienie spoza księgi: **brak**.
**Wynik: A odtwarzalny bezstratnie.**

### 7.2 Agent B

Wpisy w mocy: `CON-B-04` (**partial**), `CON-B-08` (full), `CON-B-09` (full).
Wpisy `VOID`: `CON-B-01`, `-02`, `-03`, `-05`, `-06`, `-07` — bez residuum. W tym `CON-B-05`
o odwracalności `none`: **unieważnienie przesłanki oszczędza jedyne nieodwracalne ustępstwo B**.

**Strata `L1`.** `CON-B-04` — `res judicata` jako dokładnie-raz zastąpione co-najmniej-raz
z kluczem idempotencji `caseKey = H(strony, żądanie, fakty operatywne, wersja korpusu w chwili
zdarzenia)`. Sprawy rozstrzygnięte pod reżimem at-least-once mają tożsamość opartą na `caseKey`;
semantyki dokładnie-raz **nie da się do nich zastosować wstecz**, bo wymagałaby ustalenia, które
z wielokrotnych rozstrzygnięć jest kanoniczne — informacja nieobecna w zapisie.
**Rozmiar straty:** fragment historyczny, proporcjonalny do liczby spraw rozstrzygniętych
w reżimie. **Wycena B:** 0.8 vbit dla `t < 4 lata`; po skoku progowym (`mean_retries_per_case > 1.5`)
**4.0 vbit**, i skoku nie cofa wycofanie ustępstwa.
**Wynik: B odtwarzalny częściowo — `LOSSY` o `L1`.**

### 7.3 Agent C

Wpisy w mocy: `CON-C-01` (full), `CON-C-06` (full), `CON-C-08` (full).
Wpisy `VOID`: `CON-C-02`, `-03`, `-04`, `-05`, `-07`, `-09`. W tym `CON-C-07` o odwracalności `none`
i największym udziale w dryfie: **nie zostało zastosowane, więc C nie traci nic nieodwracalnie**.

**Strata `L2` — wykryta dopiero w teście odwracalności i istotna liczbowo.**
`CON-C-01` remapuje `τ_a` i `τ_L` z kwartałów na rundy protokołu. Deklarowana odwracalność: `full`,
z predykatem odwołania „mediana czasu rundy poza `[0.7, 1.4]` kwartału przez 3 kolejne kwartały".
Tolerancja `[0.7, 1.4]` dopuszcza `τ_a` do `8 × 1.4 = 11.2 kw`. Kryterium stabilności C:

```
g_crit(τ) = 2·sin( π / (2(2τ + 1)) )
g_crit(8)    = 0.1845 /kw      punkt pracy γ_eff = 0.1799  →  STABILNY (97.5 % marginesu)
g_crit(11.2) = 0.1314 /kw      punkt pracy γ_eff = 0.1799  →  NIESTABILNY
```

**Wewnątrz zadeklarowanej tolerancji odwracalności werdykt stabilnościowy `INV-C-03` zmienia znak.**
Odtworzenie modelu C z `MERGED-SPEC.md` może więc dać model o przeciwnym orzeczeniu o stabilności
niż model suwerenny.

Wymagane zacieśnienie, policzone:

```
g_crit(τ) > 0.1799  ⟺  sin(π/(4τ+2)) > 0.08995  ⟺  4τ + 2 < 34.88  ⟺  τ < 8.22 kw
```

czyli dopuszczalne rozciągnięcie rundy to **+2.7 %**, nie +40 %. Predykat odwołania `CON-C-01` musi
brzmieć `[0.7, 1.027]` kwartału, a nie `[0.7, 1.4]`. Zapisane w `MERGED-SPEC.md §S2`.

**Wynik: C odtwarzalny bezstratnie po zacieśnieniu predykatu `CON-C-01`; przed zacieśnieniem
`LOSSY` o `L2`.**

### 7.4 Strata na warstwie scalenia

**Strata `L3`.** `MRG-01` — wspólny kanał obserwacji. Koszt **10 du**, odwracalny **częściowo**:
instalacja drugiego kanału heterogenicznego obniża go do **7.3 du**; podłoga `ρ·p = 7 du` jest
nieusuwalna przy dowolnym `n` (`NN-A-03`). Strata nie występuje w żadnym modelu suwerennym, bo
żaden nie miał trzech pętli naprawczych dzielących jeden czujnik.

### 7.5 Orzeczenie

> **Test odwracalności: `LOSSY`.**
>
> | Strata | Kogo dotyczy | Co przepadło | Rozmiar |
> |---|---|---|---|
> | `L1` | B | semantyka dokładnie-raz dla spraw rozstrzygniętych w reżimie at-least-once; brak informacji o kanoniczności | 0.8 vbit (`t < 4 lata`) → **4.0 vbit** po skoku progowym |
> | `L2` | C | rozdzielczość kryterium `g_crit(τ_a)`: tolerancja `[0.7, 1.4] kw` odwraca werdykt `INV-C-03` | **usuwalna** przez zacieśnienie predykatu do `[0.7, 1.027] kw` |
> | `L3` | scalenie | pojemność kanału obserwacji: awaria wspólnej przyczyny trzech pętli naprawczych | 10 du → 7.3 du przy `n = 2`; **podłoga 7 du nieusuwalna** |
>
> Nieusuwalne łącznie: `L1` (fragment historyczny B) oraz podłoga `7 du` z `L3`.
> `L2` usuwalna zmianą jednej liczby w predykacie odwołania.
> **Modele suwerenne A i C są odtwarzalne bezstratnie** (C — po korekcie `L2`).

---

## 8. Kwalifikacja scalenia

> ### `FRAGILE`

Dwie niezależne podstawy, każda wystarczająca:

**(a) Księga I.** Oś wiążąca B, `N* = 2` — rząd jedności. `CONSENSUS-PHASE §3` nakazuje wprost
oznaczenie `FRAGILE`. Ta podstawa obowiązuje każdego czytelnika, który odrzuci **choćby jedno**
z jedenastu unieważnień przesłanki z `CONFLICTS.md`.

**(b) Księga II.** `N*` osi wiążących wynosi 4 / 10 / 16 — **nie** jest rzędu jedności, więc
kryterium `N*` **nie** uruchamia `FRAGILE`. Ale wiążącym ograniczeniem scalonego modelu przestaje
być jakakolwiek księga ustępstw: staje się nim `MRG-03`, o horyzoncie 6.6–34.5 roku [EST] — krótszym
niż każde `t*` ustępstwowe w Księdze II (51.7 / ~410 / 220 lat) — i **bez predykatu odwołania**.
Scalenie, którego ograniczenie wiążące nie jest odwoływalne, nie staje się odporne przez to, że
ma duże `N*`: żadne wycofanie zgody go nie naprawia.

**Warunek uchylenia kwalifikacji, podany jawnie.** Scalenie przestaje być `FRAGILE` wtedy i tylko
wtedy, gdy **jednocześnie**: (i) przyjęte zostaną wszystkie 11 unieważnień przesłanki, oraz
(ii) `MRG-03` zostanie obalone jedną z trzech dróg z §5 — w praktyce przez pomiar `φ_input < 0.05`
(`CONFLICTS.md CONF-E-03`).

**Wynik badawczy, nie usterka procesu — i jest inny niż zapowiadany.** `CONSENSUS-PHASE §3`
przewiduje, że `FRAGILE` pokazuje, iż „pole ma za mało wspólnej struktury, żeby znieść współpracę
bez utraty treści". Rachunek pokazuje coś węższego i ostrzejszego: **62–87 % zadeklarowanego kosztu
współpracy zostało zapłacone za wymagania, których żadna soczewka nie wystawiła.** Trzy soczewki
mają **więcej** wspólnej struktury, niż same zakładały — zbieżne są `NN-A-07` z `NN-B-01`,
`NN-A-06` z `NN-B-04`, `NN-B-02` z `NN-C-01`, `NN-A-03` z `INV-C-07`. Kruchość scalenia nie bierze
się z rozbieżności soczewek, tylko z **ustępstwa antycypacyjnego**: każdy agent modelował żądania
pozostałych i płacił za nie z góry. `CON-C-07` (odwracalność `none`, 40.3 % dryfu C) i `CON-B-05`
(odwracalność `none`, przesuwa `t*` B z ~4 lat na 1.6 roku) są tego najdroższymi przykładami.

To jest ten sam mechanizm, który wszystkie trzy modele opisują wewnątrz systemu prawnego:
wydatek na rzecz autorytetu, który nie musiał być poniesiony, poniesiony dlatego, że jego
niepotrzebność jest nieobserwowalna z pozycji płacącego.

---

*Harmonizing Functor Collective · Justice-as-Code · faza konsensusowa*
