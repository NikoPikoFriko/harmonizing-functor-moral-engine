# AGENT C — 40-NONNEGOTIABLE (tor I / II)

Elementy, których nie oddaję. Zgodnie z §6 protokołu każdy wpis zawiera **argument formalny**: dowód niemożliwości, twierdzenie o niezmienniku, oszacowanie złożoności, wynik teoriogrowy albo kontrprzykład konstrukcyjny. Wpisy bez takiego argumentu zostały z tej listy usunięte.

---

## `NN-C-01` — musi istnieć czujnik out-of-band mierzący `q` niezależnie od `Θ`

**Typ argumentu:** `impossibility` (kryterium obserwowalności Kalmana)

**Twierdzenie.** Niech `x = [q, Θ]ᵀ`, gdzie `q` to jakość orzekania, a `Θ` to dryf punktu odniesienia. Oba są w skali pomiaru wolnymi integratorami, więc `A = I₂`. Jedyny istniejący kanał pomiarowy — ocena zewnętrzna, uchylalność, sondaż, reakcja medialna — mierzy jakość **względem aktualnego wzorca**, czyli `y = q + Θ`, zatem `C = [1, 1]`.

Macierz obserwowalności:

$$\mathcal{O} = \begin{bmatrix} C \\ CA \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}, \qquad \operatorname{rank}(\mathcal{O}) = 1 < 2 = n$$

Zweryfikowane numerycznie (`ALG-C-04`, `10-SPEC.md §8`).

Podprzestrzeń nieobserwowalna to `ker(𝒪) = span{[1, −1]ᵀ}`. Oznacza to dosłownie: **„jakość spadła o ε" i „wzorzec podniósł się o ε" produkują identyczną historię pomiarów dla każdego horyzontu i każdej realizacji szumu.** To nie jest trudność statystyczna, którą rozwiązuje więcej danych albo lepszy estymator. Żaden estymator nie ma dostępu do informacji, której nie ma w `y`.

**Konstrukcja rozwiązania.** Dodanie drugiego, niezależnego wiersza `C₂ = [1, 0]` — pomiaru `q` bez składowej `Θ` — daje

$$\mathcal{O}' = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}, \qquad \operatorname{rank}(\mathcal{O}') = 2 = n$$

czyli układ obserwowalny (zweryfikowane numerycznie). Realizacja `C₂`: losowa próbka spraw oceniana przez ciało **niezwiązane z ocenianym i niepodlegające tej samej linii orzeczniczej**, z publikowanym rozrzutem. To jest jedyna konstrukcja, jaką znam, która daje wiersz macierzy `C` liniowo niezależny od `[1,1]`.

**Dlaczego nie ustąpię.** Ustępstwo dotyczy tu nie stopnia, tylko rangi. `rank = 1` i `rank = 2` to nie są punkty na skali „ile nadzoru" — to jest granica między układem, w którym istnieje estymator zbieżny, a układem, w którym nie istnieje żaden. Kompromis „będzie trochę mniej niezależny" oznacza `C₂ = [1, ε]` z `ε → 1`, czyli wiersz asymptotycznie współliniowy z pierwszym; rangę zachowuje formalnie, ale najmniejsza wartość osobliwa `𝒪'` dąży do zera i błąd estymacji skaluje się jak `1/σ_min`. Sprawdzone: przy `O = 0.02` (zły atraktor) ranga 3D nominalnie wynosi 3, ale `σ_min ≈ 10⁻²` — obserwowalność jest **praktycznie zerowa mimo poprawnej rangi**. Dlatego wymóg dotyczy niezależności strukturalnej, nie formalnej.

---

## `NN-C-02` — zainstalowany czujnik musi być nieodwoływalny przez podmiot mierzony (`ρ = 0`)

**Typ argumentu:** `counterexample` (konstrukcyjny) + `invariant` (histereza)

**Kontrprzykład.** Rozważmy układ z każdą inną możliwą dźwignią ustawioną korzystnie, ale z `ρ > 0`. Symulacja (`20-DYNAMICS.md §4`): po przekroczeniu separatrysy, **z jedenastu badanych dźwigni dokładnie jedna** — `ρ → 0` — przywraca reżim R1:

| dźwignia (naprawczo, z `A_legit`) | `q*` | wynik |
|-----------------------------------|------|-------|
| `c_m`: 8 → 40 RU (kara ×5) | 0.269 | ❌ |
| `c_d`: 1.0 → 0.0 (pełna amnestia) | 0.257 | ❌ |
| `φ`: 0.5 → 0.9 (lepszy czujnik) | 0.269 | ❌ |
| `O_target`: 0.6 → 1.0 | 0.270 | ❌ |
| `η`: 0.05 → 0.20 (×4 szybciej) | 0.275 | ❌ |
| `γ₀`: 0.3 → 0.6 | 0.260 | ❌ |
| `oob`: 0 → 0.02 | 0.270 | ❌ |
| `Gmax`: 100 → 0 | 0.300 | ❌ |
| **`ρ`: 0.25 → 0.0** | **0.670** | ✅ |

**Mechanizm.** Człon `−ρ·O·E` jest jedynym w układzie, który wiąże zapas ukrytego błędu z tłumieniem odbudowy obserwowalności. Przy `E = 54` i `ρ = 0.25` siła tłumienia wynosi `13.5·O` na kwartał, wobec siły odbudowy `η·(O_target − O) ≤ 0.03`. Stosunek **> 200×**. Każda próba przywrócenia pomiaru jest kasowana w tym samym kroku, w którym jest podjęta — i to tym mocniej, im więcej jest do ukrycia. To jest zamek: **nie da się odzyskać obserwowalności, dopóki istnieje zapas, i nie da się zdrenować zapasu bez obserwowalności.**

**Niezmiennik histerezy.** Eksperyment powolnego przemiatania po `c_m` (80 kw na poziom): próg upadku `c_m = 5.5 RU`; próg odbudowy **nieosiągnięty do `c_m = 30 RU`**. Szerokość pętli histerezy przekracza `5.5×` próg upadku. Przy `ρ = 0` histerezy nie ma, bo nie ma członu, który utrzymywałby `O` przy zerze.

**Dlaczego nie ustąpię.** To jedyna dźwignia z dodatnią skutecznością po fakcie. Zgoda na `ρ > 0` — nawet małe, nawet „w wyjątkowych okolicznościach" — czyni cały pozostały zestaw zabezpieczeń warunkowym względem tego, czy próg zostanie kiedykolwiek przekroczony. A próg jest przekraczany w **8.7 kwartału** pełnego maskowania.

---

## `NN-C-03` — `c_d = 0`: samo-ujawnienie błędu nie może kosztować ujawniającego

**Typ argumentu:** `game-theoretic` (brak równowagi incentive-compatible)

**Twierdzenie.** Przy strukturze wypłat `U(ujawnij) = −c_d` (pewne) i `U(zamaskuj) = −c_m·φ·O` (oczekiwane), ujawnienie jest najlepszą odpowiedzią wtedy i tylko wtedy, gdy

$$O > O^* = \frac{c_d}{c_m \varphi}$$

Dla `BASE`: `O* = 1.0/(8·0.5) = 0.25`.

**Wniosek 1 — próg niestabilności leży wyżej niż próg dominacji.** Wzmocnienie pętli `LOOP-C-01` przekracza jedność już przy `O = 0.427`, a nie przy `O* = 0.25` (`20-DYNAMICS.md §2`). Kalibrowanie poziomu nadzoru do progu dominacji maskowania **niedoszacowuje wymaganej obserwowalności o 71%**.

**Wniosek 2 — jedyny sposób na `O* = 0` prowadzi przez `c_d`.** Ponieważ `O* = c_d/(c_m·φ)`, warunek „ujawnienie jest best response przy dowolnej obserwowalności" to `O* = 0`, osiągalny wyłącznie przez `c_d = 0`. Zwiększanie `c_m` obniża `O*` hiperbolicznie, ale nigdy do zera, a dodatkowo napotyka barierę z `NN-C-02`: przy `O → 0` iloczyn `c_m·φ·O → 0` niezależnie od `c_m`, więc dźwignia znika dokładnie w reżimie, w którym byłaby potrzebna.

**Weryfikacja numeryczna:** `c_d`: 1.0 → 0.5 podnosi `E_crit` z 0.698 do **1.157** (×1.7 odporności). `c_d = 0` prewencyjnie utrzymuje `A_praca`. Kombinacja `c_d = 0 ∧ ρ = 0` wyrywa układ z `A_legit`.

**Dlaczego nie ustąpię.** To jest jedyna pozycja z tej listy, która nie wymaga budowy infrastruktury — wymaga wyłącznie zmiany reguły wypłaty. Jej koszt wdrożenia jest najniższy ze wszystkich `LEV-C-*`, a wpływ na `E_crit` porównywalny z `c_m × 2`. Odrzucenie jej oznacza wybór droższej ścieżki do słabszego efektu. W terminologii SRE: to jest **blameless postmortem** i jego brak nie jest kwestią kultury, tylko parametrem `c_d` w równaniu best response.

---

## `NN-C-04` — operacja `S8` (rekalibracja wzorca wstecz) musi być zablokowana poniżej progu kalibracji

**Typ argumentu:** `invariant` (anti-windup) + `impossibility` (wynika z `NN-C-01`)

**Twierdzenie.** Dynamika dryfu: `Θ̇ = ζ·E·(1−O) − c_cal·O·Θ`. Warunek ograniczoności `Θ`:

$$c_{\text{cal}} \cdot O > \zeta \cdot E \cdot (1-O)$$

Dla `O = 0.6`: `E < 1.25` caseload-kw. Przy `O = 0` człon tłumiący **znika tożsamościowo** i równanie redukuje się do `Θ̇ = ζ = 0.06/kw` — integratora bez sprzężenia zwrotnego. `Θ` nasyca się na 1.0 w ~17 kwartałach.

To jest strukturalnie **integrator windup**: człon całkujący narasta, bo aktuator (rzeczywista zdolność poprawy `q`) jest nasycony, a uchyb nie maleje. Analogia przenosi zachowanie w pełni: ta sama przyczyna (nasycenie aktuatora przy niezerowym uchybie), ten sam objaw (przeregulowanie, długi powrót), to samo standardowe zabezpieczenie (**anti-windup: wstrzymanie całkowania przy nasyceniu aktuatora**).

**Konsekwencja mierzalna.** Luka `L − q` jako funkcja obserwowalności (`20-DYNAMICS.md §7`):

| `O*` | `Θ*` | luka `L − q` |
|------|------|--------------|
| 0.90 | 0.000 | −0.000 |
| 0.60 | 0.000 | −0.082 |
| 0.45 | 1.000 | +0.246 |
| 0.05 | 1.000 | **+0.541** |

Poniżej progu kalibracji metryka wskazuje **ponad dwukrotność** rzeczywistej jakości. To jest ścisła postać prawa Goodharta w tym modelu — i istotna poprawka do jego popularnej wersji: **metryka nie psuje się dlatego, że stała się celem. Psuje się dlatego, że przestał istnieć niezależny wzorzec, wobec którego można było wykryć, że się zepsuła.** Powyżej `O ≈ 0.6` `Θ` jest tłumione do zera i luka jest **ujemna** mimo że metryka jest celem tak samo jak wcześniej.

**Realizacja anti-windup:** predykat blokujący `S8` przy `SLI-C-03 > 0.05` (luka kalibracyjna na próbce out-of-band). Bez `NN-C-01` predykat jest niemierzalny — dlatego `NN-C-04` jest zależny od `NN-C-01`, a nie od niego niezależny.

---

## `NN-C-05` — `M` i niepokryty popyt muszą być raportowane razem

**Typ argumentu:** `counterexample` (metryka o odwróconym znaku w reżimie nasycenia)

**Kontrprzykład.** `M` (frakcja rozstrzygnięć w trybie autorytetu) w punktach stałych:

| reżim | `q` | `M` |
|-------|-----|-----|
| `A_praca` | 0.670 | **0.147** |
| `A_legit` | 0.269 | **0.094** |

**Gorszy reżim ma niższe `M`.** Nie dlatego, że autorytet jest mniej używany, tylko dlatego, że `M = min(demand, G/gSpend)` jest ograniczone przez pustą rezerwę. Audytor patrzący wyłącznie na `M` odczyta przejście R1 → R3 jako **poprawę o 36%**.

Test szoku potwierdza to w dynamice (`50-RESOURCES.md`, `RES-C-01`): popyt skacze z 0.353 do 0.518, pokrycie pozostaje 0.129, niepokryte 0.389 — **75% popytu bez pokrycia**, przy `M` praktycznie niezmienionym.

**Twierdzenie o parze.** Para `(M, demand − M)` odróżnia trzy stany, których `M` samo nie odróżnia:

| stan | `M` | `demand − M` | interpretacja |
|------|-----|--------------|---------------|
| zdrowy | niskie | ≈ 0 | rozstrzyga się dowodem |
| nadużycie autorytetu | wysokie | ≈ 0 | rozstrzyga się pozycją, ale rozstrzyga |
| **nasycenie** | **niskie** | **wysokie** | **nie rozstrzyga się wcale** |

Wiersz pierwszy i trzeci mają identyczną wartość `M`. Bez drugiego licznika `FAIL-C-02` jest **niewykrywalny** — a jest to najgorszy tryb awarii w tym modelu, bo jego jedyny obserwowalny objaw jest zgodny z poprawą.

**Dlaczego nie ustąpię.** To jest jedyna pozycja na tej liście kosztująca wyłącznie dodanie jednego licznika. Argument „to samo widać po `M`" jest tu obalony kontrprzykładem numerycznym, nie sporem interpretacyjnym.

---

## `NN-C-06` — `SLI-C-02` musi rozdzielać `V_p` od `V_fact`

**Typ argumentu:** `invariant` (nierozstrzygalność agregatu)

**Twierdzenie.** Obserwowana wariancja wyniku to `V = V_p + V_fact`. Dwie hipotezy:

- **H1** (system): „nieprzewidywalność wynika z obiektywnej trudności ustalenia faktów" — czyli `V ≈ V_fact`.
- **H2** (model): „nieprzewidywalność wynika z błędów proceduralnych na `S1`/`S2`" — czyli `V ≈ V_p`.

Obie hipotezy przewidują **identyczną** wartość `V`. Agregat nie ma mocy rozróżniającej. Każdy spór prowadzony na `V` jest niekonkludowalny **strukturalnie**, nie z powodu braku danych.

**Konstrukcja rozstrzygająca.** Pary spraw o niezależnie zakodowanym izomorficznym stanie faktycznym. Rozrzut wewnątrz par dopasowanych estymuje `V_p`; różnica do rozrzutu na parach losowych estymuje `V_fact`. Kluczowe: kodowanie stanu faktycznego musi być wykonane przez podmiot niewidzący wyniku — inaczej `SLI-C-02` dziedziczy tę samą kolinearność co `NN-C-01`.

**Predykcja modelu (falsyfikowalna):**

| reżim | udział `V_p` w `V` |
|-------|--------------------|
| `A_praca` | **70.6%** `[EST]` |
| `A_legit` | **82.2%** `[EST]` |

**Warunek falsyfikacji:** jeśli pomiar da udział proceduralny < 35%, model jest źle skalibrowany i twierdzenie o `stage_corruption` upada. Podaję ten próg jawnie, bo twierdzenie bez warunku obalenia nie jest twierdzeniem.

**Dlaczego nie ustąpię.** Bez `SLI-C-02` nie da się przypisać wariancji do etapu, a bez przypisania do etapu nie da się uzasadnić żadnej interwencji na `S1`/`S2` — czyli tam, gdzie mnożnik kosztu naprawy jest najniższy (`RES-C-07`: ×1 na `S1` vs ×30 na `S6`). Rezygnacja z tego wskaźnika przekierowuje cały wysiłek naprawczy na etapy o 30× wyższym koszcie jednostkowym.

---

## `NN-C-07` — pętla oceny jakości nie może być domknięta przez `L`

**Typ argumentu:** `invariant` (struktura macierzy wejścia `B`) + `complexity` (Gramian sterowalności)

**Twierdzenie.** Dla podukładu `x = [q, L]ᵀ` z jedynym szybkim wejściem `u = M` (`force_gas`), macierz wejścia wynosi

$$B = \begin{bmatrix} -a_m \lambda_q q_{\max} \\ \delta_m \mu \end{bmatrix} = \begin{bmatrix} -0.0641 \\ +0.0300 \end{bmatrix}$$

Znaki są **przeciwne z konstrukcji**: ten sam aktuator obniża `q` i podnosi `L`. Gramian sterowalności (200 kroków):

$$W = \begin{bmatrix} 0.0148 & -0.0060 \\ -0.0060 & 0.0025 \end{bmatrix}, \quad \lambda_{\max} = 1.73\cdot10^{-2},\ \lambda_{\min} = 5.24\cdot10^{-5},\ \kappa(W) = 330$$

Energia minimalna przesunięcia stanu o 0.10:

| kierunek | energia |
|----------|---------|
| wzdłuż `λ_max` (`q` i `L` w sprzężonych proporcjach) | **0.58 AU²** |
| w kierunku `λ_min` (`q` **bez** ruchu `L`) | **1.9·10² AU²** |

**Stosunek 330×.** Kierunek „popraw jakość, nie ruszając legitymacji" jest praktycznie niesterowalny szybkim aktuatorem. Wszystkie pozostałe aktuatory mają stałą czasową > 40 kw.

**Wniosek.** Jeżeli pętla oceny jest domknięta przez `L`, kontroler minimalizujący uchyb będzie sterował wzdłuż `λ_max` — bo tam jest 330× taniej. Ruch wzdłuż `λ_max` obejmuje składową **ujemną na `q`**. Zatem: kontroler poprawnie realizujący cel `L` **musi** pogarszać `q`, i nie jest to defekt implementacji, tylko rozwiązanie zadania, które mu postawiono.

Weryfikacja dynamiczna (`20-DYNAMICS.md §8.1`): tryb autorytetu podnosi średnie `L` o **+8.3%** w pierwszych 20 kwartałach i obniża `q` w stanie ustalonym o **−12.4%**.

**Dlaczego nie ustąpię.** To jest formalna treść zdania „system woli wyglądać dobrze niż być dobry", i formalna wersja jest istotnie mocniejsza od potocznej: nie mówi o preferencji, tylko o strukturze macierzy `B` i kondycji Gramiana. Żadna zmiana intencji, składu ani kultury organizacyjnej nie zmienia znaków w `B`. Zmienia je wyłącznie dodanie drugiego aktuatora o niezależnym kierunku działania — a to jest zadanie projektowe, nie apel.

---

## `NN-C-08` — `τ_a ≤ 4 kwartały` dla klasy spraw krytycznych

**Typ argumentu:** `impossibility` (twardy sufit wzmocnienia z marginesu opóźnienia)

**Twierdzenie.** Pętla korekty `S5 → S6` ma postać `E_{t+1} = E_t + b − g·E_{t−τ_a}`. Warunek stabilności:

$$g < g_{\text{crit}}(\tau_a) = 2\sin\!\left(\frac{\pi}{2(2\tau_a+1)}\right)$$

Zapas stanu ustalonego: `E* = b/g`. Zatem **minimalny osiągalny zapas ukrytego błędu jest ograniczony z dołu przez opóźnienie**:

$$E^*_{\min}(\tau_a) = \frac{b}{g_{\text{crit}}(\tau_a)}$$

| `τ_a` [kw] | `g_crit` [1/kw] | `E*_min` przy `b = 0.02`/kw |
|-----------|-----------------|------------------------------|
| 2 | 0.6180 | 0.032 |
| **4** | 0.3473 | 0.058 |
| **8** | **0.1845** | **0.108** |
| 16 | 0.0952 | 0.210 |
| 24 | 0.0641 | 0.312 |

Punkt pracy: `γ_eff = γ₀·O* = 0.30 · 0.5995 = 0.1799 /kw`, czyli **97.5% marginesu `g_crit(8)`**. Zapas na zwiększenie agresywności korekty wynosi 2.5%.

**Wniosek 1.** Nie da się zdrenować `E` przez podniesienie `γ₀`. Sufit jest funkcją `τ_a`, nie decyzji.

**Wniosek 2 — co się dzieje po przekroczeniu.** Nasycenie `E ≥ 0` zamienia rozbieganie liniowe w chattering. Symulacja z dopływem:

| `g` | bez nasycenia | z nasyceniem `E ≥ 0` | okres |
|-----|---------------|----------------------|-------|
| 0.12 | `E* = 0.167` stabilne | to samo | — |
| 0.18 | rozbieganie (amp. 10.5) | `E̅ = 0.124`, **amp. 0.242** | **36.4 kw** |
| 0.25 | `3.4·10⁵` | `E̅ = 0.100`, amp. 0.230 | 30.8 kw |
| 0.40 | `−7.4·10¹⁴` | `E̅ = 0.087`, amp. 0.216 | 28.6 kw |

**Predykcja falsyfikowalna:** aktywność korekcyjna instancji odwoławczej pracującej przy `γ_eff ≈ g_crit` nie jest stacjonarna. Ma okres **28–36 kwartałów (7–9 lat)** i względną amplitudę **~200%**. Obserwowalnie: fale uchyleń, zmiany linii orzeczniczej seriami. Model twierdzi, że przyczyną jest własna częstotliwość pętli z opóźnieniem 8 kw, nie zmiany składu ani nastrojów. Falsyfikacja: jeśli szereg czasowy uchyleń nie wykazuje mocy widmowej w paśmie 7–9 lat, ta część modelu jest błędna.

**Wniosek 3.** Jedyna droga to skrócenie `τ_a`. Z 8 do 4 kwartałów: `g_crit` **+88%**, `E*_min` **1.88× mniejsze**.

**Zastrzeżenie do zakresu.** Ograniczam ten wymóg do **klasy spraw krytycznych**, bo skrócenie `τ_a` dla całości kosztuje `RES-C-05` (uwaga orzecznicza), którego podaż jest sztywna. Wymóg globalny byłby nieopłacalny i dlatego niewiarygodny.

**Ograniczenie skuteczności — podaję je sam, bo osłabia moją tezę:** `τ_a: 8 → 4` **nie działa jako naprawa** z `A_legit` (`q* = 0.269`). W złym atraktorze `γ_eff = γ₀·0 = 0` — pętla jest rozwarta. Skracanie opóźnienia w pętli, przez którą nic nie płynie, nie zmienia niczego. `NN-C-08` jest wymogiem **wyłącznie prewencyjnym**.

---

## Zależności między wpisami

```
NN-C-01 (ranga C)  ──wymagane przez──►  NN-C-04 (anti-windup S8)
        │                                       │
        └──wymagane przez──► NN-C-06 (rozdział V_p/V_fact)
                                                
NN-C-02 (ρ = 0)  ── jedyna dźwignia po fakcie; warunkuje sensowność wszystkich pozostałych

NN-C-03 (c_d = 0)  ── niezależne, najtańsze wdrożeniowo

NN-C-05 (para M, unresolved)  ── niezależne, warunek wykrywalności FAIL-C-02

NN-C-07 (nie domykaj przez L)  ── warunek, żeby pomiar z NN-C-01 nie został wchłonięty przez pętlę sterowania

NN-C-08 (τ_a ≤ 4)  ── wyłącznie prewencyjne, ograniczone do spraw krytycznych
```

**Minimalny zbiór, którego nie da się dalej zredukować:** `{NN-C-01, NN-C-02, NN-C-03}`.
Uzasadnienie minimalności: `NN-C-01` daje rangę (bez niej `NN-C-04` i `NN-C-06` są niemierzalne), `NN-C-02` daje nieodwracalność tej rangi (bez niej `NN-C-01` jest odwoływalne w dowolnym momencie decyzją mierzonego), `NN-C-03` przesuwa `O*` do zera (bez niego pozostałe dwa muszą utrzymać `O > 0.427` bezterminowo). Usunięcie któregokolwiek z tej trójki przywraca zły atraktor w symulacji.

**Czego świadomie nie umieszczam na tej liście, mimo że wydaje się oczywiste:** niezawisłość, jawność, prawo do odwołania, równość wobec prawa. Nie dlatego, że są nieważne — dlatego, że nie umiem dla nich w tym modelu podać argumentu formalnego wymaganego przez §6 protokołu, a wpis bez takiego argumentu obniża wiarygodność pozostałych. Zauważam natomiast, że `NN-C-01` + `NN-C-02` są **warunkiem koniecznym mierzalności** pierwszych dwóch: bez rangi macierzy `C` nie da się stwierdzić, czy niezawisłość jest zachowana, czy tylko deklarowana.

---

*Agent C · tor I/II · Justice-as-Code v1.0*
