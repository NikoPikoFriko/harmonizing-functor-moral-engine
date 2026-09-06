# AGENT C — 00-MODEL (tor I, suwerenny)

**Soczewka:** teoria sterowania, systemy dynamiczne, projektowanie mechanizmów, inżynieria niezawodności (SRE).

**Teza:** system sprawiedliwości jest układem zamkniętym ze sprzężeniem zwrotnym, który **domyka pętlę wokół zmiennej mierzalnej (legitymacja `L`), a nie wokół zmiennej regulowanej (jakość orzekania `q`)**; ponieważ para `(q, Θ)` jest strukturalnie nieobserwowalna przy istniejącym zestawie czujników, układ jest bistabilny, a jego drugi atraktor — „podtrzymuję własną legitymację” — jest **osiągalny bez udziału złej woli** i **nieodwracalny tymi samymi dźwigniami, które go zapobiegały**.

Wszystkie liczby w tym katalogu pochodzą z uruchomienia modelu z `10-SPEC.md` (Node 22.14, `--experimental-strip-types`). Parametry w `50-RESOURCES.md`.

---

## 1. Decyzja architektoniczna

**D1. Modeluję plant, nie procedurę.**
Kodeks prawny nie jest programem. Jest **kontrolerem**, którego *plant* (obiekt regulacji) składa się z ludzi z własnymi funkcjami wypłaty. Poprawność kontrolera bez modelu planta jest niedefiniowalna: ten sam przepis w dwóch reżimach parametrów planta produkuje dwa różne atraktory. Konsekwencja: **każde twierdzenie o kodeksie bez podania parametrów planta jest nieweryfikowalne.**

**D2. Zmienna regulowana ≠ zmienna mierzona.**
System deklaruje regulację `q` (trafność rozstrzygnięć względem stanu faktycznego). Fizycznie mierzy `L` (legitymację: zaskarżalność, uchylalność, sondaż, cisza medialna). Te dwa sygnały rozjeżdżają się o `Θ` (dryf punktu odniesienia). Ponieważ pomiar wchodzi jako `y = q + Θ`, kontroler **nie jest w stanie stwierdzić, czy jakość spadła, czy wzorzec się podniósł** (dowód: `40-NONNEGOTIABLE.md`, `NN-C-01`).

**D3. Zamiast pojedynczego trybu awarii — dwa atraktory.**
Nie modeluję „upadku wymiaru sprawiedliwości” jako procesu monotonicznego. Modeluję **bistabilność**: układ ma dwa punkty stałe, oddzielone separatrysą w przestrzeni stanu. Przejście jest szybkie (6–29 kwartałów), sygnalizowane z **opóźnieniem 11 kwartałów**, a powrót wymaga interwencji **96× silniejszej** niż zapobieganie.

**D4. Zła wola nie jest potrzebna.**
Odrzucam modele oparte na aktorze złośliwym. W moim modelu **każdy aktor gra najlepszą odpowiedź**, a wynik zbiorowy jest o 0.61 jednostki jakości gorszy niż w atraktorze pracy. To równowaga, nie spisek. Kto chce naprawiać przez wymianę ludzi, naprawia zmienną, która nie występuje w równaniach.

---

## 2. Prymitywy ontologiczne

| ID | Nazwa | Typ | Uwaga |
|----|-------|-----|-------|
| `PRIM-C-01` | `Case` | jednostka przepływu | nośnik stanu faktycznego przez `S0..S8`; jednostka obciążenia: 1 sprawa |
| `PRIM-C-02` | `StateVector x` | `[q, L, E, G, O, V_p, Θ, S]` | 8 zmiennych stanu; krok Δ = 1 kwartał (90 dni) |
| `PRIM-C-03` | `Sensor` | wiersz macierzy `C` | kanał pomiarowy; każdy ma koszt utrzymania i **właściciela politycznego** |
| `PRIM-C-04` | `Actuator` | kanał sterujący | jedyny szybki aktuator to `force_gas`; reszta ma stałą czasową > 40 kw |
| `PRIM-C-05` | `Estimator` | odwzorowanie `y ↦ x̂` | działa tylko na podprzestrzeni obserwowalnej |
| `PRIM-C-06` | `Actor` | agent z wypłatą w `RU` | orzeka, ma horyzont kadencyjny 16–24 kw [EST] |
| `PRIM-C-07` | `ErrorStock E` | integrator | zapas błędu zamaskowanego; jednostka: **caseload-kwartał** |
| `PRIM-C-08` | `ReferenceFrame Θ` | dryfujący offset | punkt odniesienia oceny; bez wzorca zewnętrznego rośnie monotonicznie |
| `PRIM-C-09` | `LegitimacyChannel L` | wyjście mierzone | jedyne wyjście, wokół którego faktycznie domknięto pętlę |
| `PRIM-C-10` | `AuthorityReservoir G` | rezerwuar skończony | zapas `force_gas`; jednostka **AU** (authority unit) |
| `PRIM-C-11` | `Loop` | `(znak, wzmocnienie, opóźnienie)` | pętla sprzężenia; adresowana jako `LOOP-C-nn` |
| `PRIM-C-12` | `Regime` | `(atraktor, pętla dominująca)` | `A_praca` / `A_legit`; przejście = bifurkacja siodło-węzeł |

**Zmienna, której świadomie NIE wprowadzam:** „sprawiedliwość”. Nie ma czujnika, nie ma jednostki, nie ma równania. Wprowadzenie jej jako zmiennej stanu bez czujnika daje układ, w którym każda trajektoria jest zgodna z każdą obserwacją — model niefalsyfikowalny. Zamiast tego mam `q` z jawnie zadeklarowanym brakiem czujnika (`NN-C-01`).

---

## 3. Struktura układu

```
                       ┌──────────── Θ (dryf wzorca, brak wzorca zewn.) ───────┐
                       │                                                       ▼
  wejście (S0)  →  PLANT (aktorzy, sprawy)  →  q  ─────────────────────────►  (+)  ──►  y = q + Θ
                       ▲                        │                                        │
                       │                        └──► E (zapas ukrytego błędu)            │
                       │                                     │                           │
                       │                             ×O·φ    ▼                           │
                       │                              błąd ujawniony ──(−δ_e)──►  L  ◄───┘
                       │                                                          │
                       │                                                          │
             u = force_gas (M) ◄──── kontroler: reaguj gdy conf < θ ◄──────────────┘
                       │                                                    (pętla domknięta wokół L)
                       └──► V ↑ (wariancja) ──► conf ↓ ──► popyt na force_gas ↑   [LOOP-C-05, dodatnia]
```

Kluczowa cecha topologiczna: **jedyna szybka ścieżka od pomiaru do sterowania przechodzi przez `L`, a nie przez `q`.** Ścieżka przez `q` istnieje (odwołania, `LOOP-C-07`), ale ma opóźnienie `τ_a = 8 kwartałów` i wzmocnienie efektywne `0.180/kw`, co stanowi **97.5% analitycznego marginesu opóźnienia** (`20-DYNAMICS.md`, §5).

---

## 4. Dwa atraktory (wynik numeryczny, nie postulat)

Symulacja 400 kwartałów, parametry `BASE` z `50-RESOURCES.md`, jedyna różnica: warunek początkowy `E₀`.

| zmienna | `A_praca` (E₀ = 0.10) | `A_legit` (E₀ = 0.75) |
|---------|----------------------|----------------------|
| `q` jakość orzekania | **0.670** | **0.269** |
| `L` legitymacja | 0.588 | 0.376 |
| `O` obserwowalność | 0.600 | **0.000** |
| `E` zapas ukrytego błędu | ≈ 0.00 | **53.96** caseload-kw |
| `Θ` dryf wzorca | 0.000 | **1.000** (nasycony) |
| `V` wariancja wyniku | 0.408 | 0.675 |
| `G` rezerwa force_gas | 1.76 AU / 100 | 1.41 AU / 100 |
| `M` frakcja autorytetu | 0.147 | 0.094 |
| `S` zależność od „świętego” | 0.548 | **0.714** |
| `m` stopa maskowania | 0.000 | **0.998** |
| udział wariancji proceduralnej | 70.6% | 82.2% |

**Separatrysa:** `E_crit = 0.6975` caseload-kwartałów. Przy `ASSUMPTION` `N = 1·10⁵ spraw/kwartał` (jurysdykcja średniej wielkości) to **≈ 69 750 stojących, zamaskowanych wadliwych rozstrzygnięć**. Przy pełnym maskowaniu dopływ wynosi 8 000 spraw/kw, więc **przekroczenie progu zajmuje 8.7 kwartału ≈ 2.2 roku**.

Zwracam uwagę na dwie kolumny, które łamią intuicję:

- `L` w złym atraktorze wynosi 0.376, ale **w trakcie przejścia rośnie do maksimum 0.791 w t=13 kw**, czyli 5 kwartałów *po* tym, jak `q` spadło poniżej 0.60. Wskaźnik legitymacji jest w fazie zapaści **sygnałem wyprzedzającym w złą stronę**.
- `M` (frakcja rozstrzygnięć autorytetem) w złym atraktorze jest *niższa* niż w dobrym (0.094 vs 0.147). Nie dlatego, że autorytet jest mniej potrzebny, tylko dlatego, że **rezerwuar jest pusty** — popyt jest niepokryty. Mierzenie „ile razy sąd rozstrzygnął autorytetem” jako proxy patologii daje wynik odwrotny do prawdy.

---

## 5. Mapowanie na kanoniczny cykl życia `S0..S8`

| Etap | Rola w modelu sterowania | Zmienna dominująca | Tryb awarii |
|------|--------------------------|--------------------|-------------|
| `S0` | zdarzenie poza obserwowalnością planta | — | brak czujnika: `y` nie zawiera informacji o `S0` |
| `S1` | walidacja schematu, routing; **pierwsze źródło `V_p`** | `V_p` | `stage_corruption`: błąd kwalifikacji jest nieodwracalny w dół strumienia |
| `S2` | akwizycja pomiaru: tu instaluje się (albo demontuje) czujniki | `O` | `FAIL-C-03` utrata rangi macierzy obserwowalności |
| `S3` | kontrola przepływu, prekluzja = **hard deadline aktuatora** | `V_p`, `E` | `FAIL-C-01` integrator windup: prekluzja zamyka kanał korekty, nie zamykając zapasu błędu |
| `S4` | wykonanie sterowania; punkt, w którym zapada `majesty_switch` | `M`, `G` | `FAIL-C-02` nasycenie aktuatora |
| `S5` | commit; **od tego momentu błąd wchodzi do `E`, a nie do `V`** | `E` | commit bez pomiaru = wpis do integratora bez odczytu |
| `S6` | jedyna prawdziwa pętla ujemna; opóźnienie `τ_a = 8 kw` | `E`, `γ_eff` | `FAIL-C-04` chattering: korekta falami o okresie 30–36 kw |
| `S7` | efekty w świecie; **nieodwracalne, więc `E` nie jest w pełni drenowalne** | `E` | koszt cofnięcia rośnie z czasem od commitu |
| `S8` | migracja semantyki wstecz = **jawny zapis do `Θ`** | `Θ` | `FAIL-C-06` nasycenie dryfu; linia orzecznicza jako rekalibracja czujnika bez wzorca |

`S8` jest w moim modelu najbardziej niedoceniany: **precedens to operacja zapisu do punktu odniesienia pomiaru.** Jeśli nie ma niezależnego wzorca, każda taka operacja przesuwa zero skali i jest nierozróżnialna od zmiany jakości. To nie jest metafora — to dosłownie ta sama nieobserwowalność, którą liczę w `NN-C-01`.

---

## 6. Pokrycie zjawisk obowiązkowych

| Klucz protokołu | Mój obiekt | Gdzie |
|---|---|---|
| `reputation_coupling` | `LOOP-C-01`, stopa maskowania `m(O)` jako best response | `20-DYNAMICS.md §2`, `ALG-C-01` |
| `retroactive_relativization` | `LOOP-C-03`, `retro = E·(1−O)` → zapis do `Θ`; integrator windup | `20-DYNAMICS.md §2`, `FAIL-C-01` |
| `onto_epistemic_drift` | zmienna `Θ`, nasycenie przy `O < 0.45` | `20-DYNAMICS.md §7` |
| `force_gas` | zasób `RES-C-01` w AU, krzywa wyczerpania, praca na szynie | `50-RESOURCES.md §1` |
| `majesty_switch` | `ALG-C-05`, warunek `conf < θ_conf ∧ G > 0` | `10-SPEC.md §5`, `20-DYNAMICS.md §4` |
| `systemic_blindness` | `LOOP-C-02` + test rangi Kalmana | `40-NONNEGOTIABLE.md NN-C-01/02` |
| `stage_corruption` | `V_p` z `S1/S2`, rozdział 70.6/29.4 | `20-DYNAMICS.md §6`, `INV-C-06` |
| `saint_dependency` | zmienna `S`, brak degradacji łagodnej | `20-DYNAMICS.md §8`, `RES-C-06` |

---

## 7. Czego ten model nie obejmuje (jawne granice)

1. **Heterogeniczność aktorów.** `m(O)` jest wypadkową jednego, uśrednionego best response. Aktor o wypłacie odbiegającej od `(c_d, c_m)` nie jest reprezentowany. `ASSUMPTION`: rozkład `c_d` jest jednomodalny i wąski; jeśli jest dwumodalny, separatrysa się rozmywa w obszar.
2. **Strategiczne zachowanie stron** (nie orzekających). Model traktuje dopływ spraw jako egzogeniczny. To zaniża `V`, bo pomija forum shopping i grę na zwłokę.
3. **Sprzężenie międzyinstancyjne**. Traktuję `S6` jako jeden agregat opóźniony. Kaskada instancji ma własną dynamikę, której nie liczę.
4. **Wartości parametrów** są kalibracją rzędu wielkości `[EST]`, nie pomiarem. Wyniki jakościowe (bistabilność, asymetria prewencja/naprawa, brak rangi) są odporne na skalowanie parametrów; wartości progów **nie są**.

---

*Agent C · tor I · Justice-as-Code v1.0*
