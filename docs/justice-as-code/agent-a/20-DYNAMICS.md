# 20-DYNAMICS — Agent A · tor I (suwerenny)

Pętle sprzężeń, znaki, wzmocnienia, opóźnienia, warunki rozbiegania, atraktory degeneracji.

Wszystkie modele poniżej są **dyskretne, roczne** (`t` w latach) i liniowe albo odcinkowo-liniowe.
Parametry są oznaczone `[EST]`; symulacje zostały wykonane, liczby są wyjściem, nie ilustracją.
Warunki rozbiegania są **wyprowadzone**, nie zadeklarowane.

---

## 0. Pętla nadrzędna i jej domknięcie z księgą ustępstw

Wszystkie pozostałe pętle podłączają się do `LOOP-A-01`, bo wszystkie kończą wpływem na
obserwowalność albo na wydatek `force_gas`. To jest jedyny punkt, w którym tor I i tor II łączą się
mechanicznie: **obserwowalność jest zmienną stanu, a księga ustępstw ją zmniejsza.**

---

## 1. `LOOP-A-01` — `force_gas` ↔ pula legitymacji (znak zmienny)

**Zjawisko:** `force_gas`.

**Struktura.** Niech `e_t` = deficyt puli legitymacji w punktach procentowych, `F_t` = średni wydatek
`force_gas` na sprawę.

```
F_t     = F₀ + a·e_t                       (spadek legitymacji zwiększa wydatek FG)
e_{t+1} = (1 + δ·a − ρ(t))·e_t + δ·F₀      (bilans puli)
ρ(t)    = ρ_max · obs(t)                    (regeneracja wymaga obserwowalnej poprawności)
obs(t)  = max(0, 1 − D(t)/100)              (D(t) z 30-CONCESSIONS.md)
```

Uzasadnienie każdego członu:
- `a > 0`: gdy legitymacja spada, rośnie odsetek rozstrzygnięć kwestionowanych, a to zwiększa liczbę
  kwestii domykanych autorytetem, nie dowodem. Znak wynika z THM-A-03, nie z założenia.
- `ρ` mnożone przez `obs`: pula legitymacji regeneruje się **wyłącznie** z rozstrzygnięć, których
  poprawność jest zewnętrznie potwierdzalna. Rozstrzygnięcie nieodróżnialne od autorytatywnego nie
  regeneruje niczego, bo obserwator nie ma z czego wnioskować (THM-A-05).

**Warunek rozbiegania — wyprowadzenie.** Współczynnik przy `e_t` przekracza 1 wtedy i tylko wtedy, gdy

```
δ·a > ρ_max · obs(t)      ⟺      obs(t) < obs_crit = δ·a / ρ_max
```

To jest cały warunek. Jest jednoparametrowy w obserwowalności i **nie zawiera żadnego członu
opisującego jakość orzekania**. Innymi słowy: pętla może się rozbiegać przy dowolnie wysokiej jakości
merytorycznej, jeżeli tylko ta jakość nie jest mierzalna z zewnątrz.

**Parametry [EST]:** `δ = 0.5` pp/(FG·rok), `a = 0.05` FG/pp, `ρ_max = 0.05`/rok, `F₀ = 2` FG/sprawę.
Stąd `δ·a = 0.025`/rok, `obs_crit = 0.5`, czyli **`D_crit = 50 du`**.

**Znak:** ujemny (stabilizujący) dla `D < 50 du`; dodatni (rozbiegający) dla `D > 50 du`.
**Wzmocnienie:** `g = δ·a − ρ(t)`, zakres `[−0.025, +0.025]`/rok.
**Opóźnienie:** 3–15 lat [EST] — tyle trwa przejście od wydatku FG do obserwowalnego spadku
dobrowolnej wykonalności w S7. Opóźnienie jest o rząd wielkości większe od stałej czasowej wydatku
(dni), więc kanał korekcyjny nie widzi tego, co koryguje.

**Równowaga w reżimie stabilnym.** Nawet przy `obs = 1` i zerowych ustępstwach:

```
e* = δ·F₀ / (ρ_max − δ·a) = 1.0 / 0.025 = 40 pp
```

**To jest wynik, którego się nie spodziewałem projektując model, i jest ważniejszy od warunku
rozbiegania:** przy `F₀ > 0` równowagowy deficyt legitymacji jest **dodatni i duży** nawet w najlepszym
możliwym reżimie. System nigdy nie wraca do pełnej puli. `force_gas` nie jest długiem spłacanym —
jest rentą wieczystą. Wynika to wprost z THM-A-11: `F₀ > 0` jest wymuszone przez `B < C`.

**Trajektorie (symulacja, `e_t` w pp):**

| `t` [lat] | pełny zbiór 8 ustępstw | dopuszczalny podzbiór (4) |
|---|---|---|
| 5 | 5.2 | 4.9 |
| 10 | 11.1 | 9.8 |
| 20 | 25.4 | 20.7 |
| 30 | 43.8 | 35.6 |
| 40 | 67.2 | 56.8 |

---

## 2. `LOOP-A-02` — `reputation_coupling` → ukrycie → `retroactive_relativization` (+)

**Zjawiska:** `reputation_coupling`, `retroactive_relativization`.

**Struktura.** Funkcja celu węzła: `U_i(t) = (1−α−β)·U_client + α·U_self + β·U_system`.
Wykrycie błędu obniża `U_self` i `U_system`. Przy `α + β` rosnącym w czasie kariery węzła,
opłacalność ujawnienia własnego błędu maleje monotonicznie. Ukrycie realizowane jest przez
przepisanie interpretacji przeszłego stanu (sprostowanie z „oczywistej omyłki", uzupełnienie
uzasadnienia po zaskarżeniu, przypisanie błędu stronie) — czyli operację na logu, która zmienia
`meaning` przy stałych `bytes`.

**Znak:** dodatni. Ukryty błąd zwiększa rozbieżność `L` od `L*`, co zwiększa prawdopodobieństwo
kolejnego błędu opartego na tym samym logu, co zwiększa koszt ujawnienia całej serii.

**Wzmocnienie:** `g₂ = ∂(P(ukrycie))/∂(α+β) · ∂(α+β)/∂t`. Kluczowe jest, że drugi czynnik jest
**strukturalnie dodatni**: nie istnieje mechanizm obniżający wagę reputacyjną w trakcie kariery.
Rząd wielkości: `α+β` rośnie od ~0.2 na starcie do ~0.8 po 15 latach [EST], czyli ~0.04/rok.

**Opóźnienie:** krótkie, tygodnie–miesiące. To jest niebezpieczne połączenie: **szybka pętla dodatnia
podpięta pod wolną pętlę korekcyjną**. W teorii sterowania to standardowy przepis na
niestabilność; tutaj ma dodatkową własność — pętla szybka operuje na logu, który pętla wolna
przyjmuje za wejście.

**Warunek rozbiegania:** `P(wykrycie ukrycia) · sankcja < ΔU_self`. Ponieważ wykrycie wymaga
porównania `meaning` sprzed i po, a system nie wersjonuje `meaning` (`INV-A-08` nie jest utrzymywany),
`P(wykrycie) ≈ 0`. Warunek jest spełniony trywialnie. **Pętla jest rozbiegana z konstrukcji**,
a nie przy pewnych wartościach parametrów.

**Przerwanie:** wyłącznie `INV-A-01` + `INV-A-08` (append-only z zewnętrznym commitem hashy i version
vectors znaczeń). Koszt: metadane. Bez tego żadna sankcja nie działa, bo nie ma czego sankcjonować.

---

## 3. `LOOP-A-03` — `stage_corruption` → apelacja utrwala → precedens zamyka (+)

**Zjawiska:** `stage_corruption`, precedens (S8).

**Struktura.** Defekt wejścia w S1/S2 → wyrok → apelacja jako replay na tym samym logu (THM-A-01)
→ utrzymanie → wyrok utrzymany staje się materiałem linii orzeczniczej → semantyka utrwalona dla
wszystkich przyszłych spraw.

Kluczowa własność: **nie istnieje operacja odwrotna.** Precedens oparty na wadliwym ustaleniu
faktycznym nie jest odwoływalny przez wykazanie wadliwości tego ustalenia, bo linia orzecznicza
abstrahuje od faktów sprawy źródłowej — dziedziczy z niej wyłącznie tezę prawną.
To jest utrata informacji przy migracji: `(fakty, teza) → teza`.

**Znak:** dodatni, bez członu tłumiącego.

**Model.** `share_{t+1} = share_t + q · p_corrupt`, gdzie `q` = odsetek spraw z defektem, których teza
wchodzi do linii orzeczniczej. Brak członu `−λ·share_t`, bo brak mechanizmu wycofania.
Wzrost jest **liniowy i nieograniczony** (do nasycenia przy 1).

| `q` [EST] | udział po 5 latach | po 10 | po 20 |
|---|---|---|---|
| 0.02 | 2.5 % | 5.0 % | 10.0 % |
| 0.05 | 6.3 % | 12.5 % | 25.0 % |
| 0.10 | 12.5 % | 25.0 % | 50.0 % |

przy `p_corrupt = 0.25` [EST].

**Opóźnienie:** 2–8 lat od wyroku do ugruntowania linii [EST].

**Warunek zatrzymania:** wymaga członu `−λ·share_t`, czyli **mechanizmu wycofania tezy prawnej
z powodu wadliwości podstawy faktycznej sprawy źródłowej**. Taki mechanizm nie istnieje w żadnej
znanej mi konstrukcji proceduralnej i jego brak nie jest przypadkowy: wymagałby utrzymywania
powiązania `teza → fakty źródłowe`, czyli dokładnie tego, co migracja odrzuca.

---

## 4. `LOOP-A-04` — `systemic_blindness` samowzmacniająca się (+)

**Zjawisko:** `systemic_blindness`.

**Struktura.** Brak telemetrii → brak sygnału błędu → brak korekty → wzrost rzeczywistego poziomu
błędu → wzrost oczekiwanego kosztu włączenia telemetrii → silniejszy opór przed instrumentacją.

**Znak:** dodatni.
**Wzmocnienie:** rośnie w czasie, bo koszt włączenia pomiaru jest proporcjonalny do skumulowanego,
niezmierzonego błędu. To pętla o **rosnącym** wzmocnieniu, czyli superwykładnicza w reżimie
nieograniczonym.
**Opóźnienie:** brak (pętla natychmiastowa) — decyzja o nieinstrumentowaniu jest podejmowana
w tym samym cyklu, co obserwacja rosnącego ryzyka.

**Uwaga metodologiczna, ważniejsza od samej pętli.** THM-A-05 pokazuje, że ta pętla **nie jest
patologią zamontowaną na poprawnym protokole**. Nieujawnianie skalibrowanej pewności jest strategią
dominującą systemu, dopóki egzekucja w S7 jest binarna, a rozstrzygnięcia bywają graniczne.
Zatem `LOOP-A-04` nie da się przerwać przez „więcej jawności" — wymaga zmiany w S7
(egzekucja proporcjonalna do pewności) albo w regule domykania FLP. To jedyna pętla w tym modelu,
której nie da się przerwać tanio, i dlatego jest ona najważniejszym miejscem sporu z innymi soczewkami.

---

## 5. `LOOP-A-05` — `onto_epistemic_drift` jako błądzenie losowe bez kotwicy

**Zjawisko:** `onto_epistemic_drift`.

**Struktura.** Znaczenie terminu normatywnego `x_t` ewoluuje w krokach wykładni. Jeżeli tekst normy
jest wiążącym punktem odniesienia, dynamika jest procesem Ornsteina–Uhlenbecka z siłą powrotną `θ`:

```
x_{t+1} = x_t − θ·x_t + σ·ξ_t
```

Jeżeli wykładnia może przesłonić tekst (a `retroactive_relativization` i `LWW` na wersjach znaczeń
dokładnie to umożliwiają), to `θ = 0` i proces staje się czystym błądzeniem losowym.

**To jest różnica jakościowa, nie ilościowa:**

| | `θ = 0` (bez kotwicy) | `θ = 0.05` | `θ = 0.2` |
|---|---|---|---|
| odchylenie po `t` latach | `σ√t`, nieograniczone | stacjonarne | stacjonarne |
| `sd(∞)` | ∞ | 0.379 | 0.190 |
| czas do `sd = 0.5` | 17 lat | nigdy systematycznie | nigdy systematycznie |

przy `σ = 0.12`/√rok [EST].

**Znak:** zerowy w sensie sprzężenia (to dyfuzja, nie pętla), ale skutek jest jednokierunkowy:
wariancja rośnie liniowo, `Var(x_t) = σ²t`.

**Konsekwencja operacyjna.** Bez kotwicy odległość między znaczeniem użytym dziś a znaczeniem użytym
17 lat temu przekracza 0.5 na skali, na której 1.0 oznacza „inny termin". Dwa organy stosujące
„ten sam" przepis stosują wtedy różne przepisy, a system tego nie wykrywa, bo LWW nie zgłasza
konfliktu (`FAIL-A-06`). Przełączenie na `multi-value` (`INV-A-08`) nie przywraca `θ > 0`, ale
**czyni dryf mierzalnym** — zamienia cichy błąd w widoczny konflikt wersji.

---

## 6. `LOOP-A-06` — kolejność jako produkt: congestion collapse (+)

**Zjawisko:** MEV kolejności (THM-A-10), pochodna `force_gas`.

**Struktura.** Kolejka `M/M/1`: `W = 1/(μ − λ)`. Opóźnienie ma wartość dla części uczestników
(THM-A-10), więc napływ wniosków przewlekających rośnie z `W`:

```
λ = λ₀·(1 + β·W),     W = 1/(μ − λ)
```

**Warunek rozbiegania — wyprowadzenie.** Punkt stały spełnia
`λ² − λ(μ + λ₀) + λ₀μ + λ₀β = 0`. Rozwiązanie rzeczywiste istnieje wtedy i tylko wtedy, gdy
wyróżnik jest nieujemny:

```
β ≤ β_crit = [ (μ + λ₀)² − 4λ₀μ ] / (4λ₀)
```

Dla `μ = 1`, `λ₀ = 0.85` [EST]: **`β_crit = 0.00662`**. Weryfikacja numeryczna:

| `β` | wynik |
|---|---|
| 0.0040 | punkt stały, `W = 8.19`, `ρ_q = 0.878` |
| 0.0066 | punkt stały, `W = 12.68`, `ρ_q = 0.921` |
| 0.0080 | **brak punktu stałego** — kolejka rośnie bez ograniczenia |
| 0.0200 | brak punktu stałego |

**Interpretacja liczby.** `β = 0.0066` znaczy: jeżeli wydłużenie oczekiwania o jedną jednostkę
`1/μ` generuje więcej niż 0.66 % dodatkowego napływu wniosków przewlekających, układ nie ma
równowagi. To jest **bardzo mały próg**. Nie potrzeba masowego nadużycia; potrzeba marginalnej
opłacalności zwłoki u niecałego jednego procenta uczestników.

**Znak:** dodatni. **Opóźnienie:** krótkie (miesiące) — to najszybsza pętla w modelu.
**Atraktor:** `ρ_q → 1`, `W → ∞`. System nie odmawia przyjęcia sprawy (brak backpressure),
więc nie ma mechanizmu, który zatrzyma napływ. To jest dosłowny **congestion collapse**:
przepustowość użyteczna spada, bo rosnący udział pracy to obsługa wniosków o charakterze wyłącznie
opóźniającym.

**Obrona:** `INV-A-05` (zewnętrzny timestamp) obniża `β`, bo czyni zwłokę atrybucyjną, a więc karalną.
Nie zmienia `μ`. To jest tani i skuteczny punkt interwencji — jedyny w tym modelu, w którym
metadane wystarczą do zmiany znaku.

---

## 7. `LOOP-A-07` — `saint_dependency` i nieliniowość kolejki (+)

**Zjawisko:** `saint_dependency`.

**Struktura.** Wymagania wobec lidera rosną (`n = 1 ⇒ f_max = 0`, sekcja 1.1 `00-MODEL.md`).
Więcej wymagań → więcej czasu na sprawę → wzrost `ρ_q` → dłuższa kolejka → presja na skrócenie
czasu na sprawę → spadek `B` → wzrost `F` (THM-A-11) → wzrost wydatku `force_gas`.

**Nieliniowość jest tu istotą.** `W = 1/(μ(1−ρ_q))`:

| `ρ_q` | `W` w jednostkach `1/μ` |
|---|---|
| 0.50 | 2.0 |
| 0.80 | 5.0 |
| 0.90 | 10.0 |
| 0.95 | 20.0 |
| 0.98 | 50.0 |
| 0.99 | 100.0 |

**Wzrost obciążenia z 0.90 do 0.98 — czyli o 8.9 % — wydłuża oczekiwanie pięciokrotnie.**
To jest dokładnie ten reżim, w którym intuicja liniowa („dołożymy 10 % etatów, będzie 10 % lepiej")
jest fałszywa o rząd wielkości, i w obie strony: przy `ρ_q = 0.98` redukcja obciążenia o 8 %
skraca oczekiwanie 5-krotnie. **W tym reżimie marginalna zmiana `μ` lub `λ` ma wpływ niemal
niemierzalnie większy niż jakakolwiek zmiana proceduralna** — i to jest jedyna rekomendacja
ilościowa, jaką ten model wystawia bez zastrzeżeń.

**Opóźnienie:** 1–3 lata (cykl obsadowy) [EST].
**Znak:** dodatni w reżimie `ρ_q > 0.9`, praktycznie neutralny poniżej 0.7.

---

## 8. `LOOP-A-08` — prekluzja ↔ `force_gas` (−, jedyna stabilizująca)

**Zjawiska:** `stage_corruption` (przez prekluzję), `force_gas`.

**Struktura.** Z THM-A-11: przy `B < C` nadmiar `C − B` musi zostać gdzieś ulokowany. Prekluzja
zmniejsza `C` (odrzuca wejście), `force_gas` domyka lukę (zgaduje wyjście). To substytuty:

```
(C − B) ≈ c_kwestia · F  +  c_kwestia · P
```

gdzie `F` = liczba kwestii domkniętych autorytetem, `P` = liczba kwestii usuniętych prekluzją.

**Znak:** ujemny (stabilizujący) względem przeciążenia. To **jedyna pętla ujemna w całym modelu**
i jedyna, która utrzymuje system w stanie działającym.

**Cena.** Stabilizuje przepustowość, destabilizuje trafność. Zaostrzenie prekluzji obniża `F`
(mniej wydatku FG), ale podnosi `p_corrupt` (`FAIL-A-05`, use-after-free). Poluzowanie prekluzji
działa odwrotnie. Ponieważ **żaden z dwóch skutków nie jest mierzony**, nastawa jest wybierana
w oparciu o jedyną obserwowalną zmienną — czas trwania postępowania. To jest klasyczny Goodhart:
sterowanie po jedynej dostępnej metryce, która jest proxy dla obu wielkości, których zmienić nie chcemy.

**To jest jedyne miejsce w modelu z dwoma jawnie sterowalnymi nastawami i realnym tradeoffem.**
Fakt, że publiczna dyskusja nie formułuje go jako tradeoffu, jest sam w sobie obserwacją
o `systemic_blindness`: obie nastawy są widoczne, oba skutki nie.

---

## 9. Tabela zbiorcza

| ID | Zjawisko | Znak | Wzmocnienie | Opóźnienie | Warunek rozbiegania |
|----|----------|------|-------------|------------|---------------------|
| `LOOP-A-01` | `force_gas` | zmienny | `δa − ρ_max·obs` ∈ [−0.025, 0.025]/rok | 3–15 lat | `obs < 0.5` ⟺ `D > 50 du` |
| `LOOP-A-02` | `reputation_coupling`, `retroactive_relativization` | + | ~0.04/rok wzrostu `α+β` | tygodnie | `P(wykrycie)·sankcja < ΔU_self` — spełniony trywialnie przy braku `INV-A-08` |
| `LOOP-A-03` | `stage_corruption`, S8 | + | `q·p_corrupt` liniowo | 2–8 lat | brak członu wycofania ⇒ zawsze |
| `LOOP-A-04` | `systemic_blindness` | + | rosnące | brak | równowaga z THM-A-05 ⇒ zawsze |
| `LOOP-A-05` | `onto_epistemic_drift` | dyfuzja | `σ = 0.12`/√rok | — | `θ = 0` ⇒ `Var = σ²t` nieograniczona |
| `LOOP-A-06` | MEV kolejności | + | `β` | miesiące | `β > 0.00662` |
| `LOOP-A-07` | `saint_dependency` | + | `1/(1−ρ_q)²` | 1–3 lata | `ρ_q > 0.9` |
| `LOOP-A-08` | prekluzja ↔ `force_gas` | **−** | ~1 (substytucja) | miesiące | — (jedyna stabilizująca) |

Siedem pętli dodatnich, jedna ujemna, i ta jedna stabilizuje przepustowość kosztem trafności.
**Model nie zawiera ani jednej pętli ujemnej działającej na trafność.** To nie jest retoryczne
podsumowanie, tylko wniosek z tabeli: nie znalazłem mechanizmu, którego wyjściem byłaby korekta
błędu merytorycznego z ujemnym sprzężeniem. Apelacja nim nie jest (THM-A-01: replay, nie korekta
wejścia), nadzór nim nie jest (THM-A-07: skorelowany, `ρ·p` floor), precedens nim nie jest
(THM-A-06: migracja bez wycofania).

---

## 10. Atraktory degeneracji

Stany absorbujące — po wejściu system nie wraca bez interwencji zewnętrznej.

### `ATT-A-01` — równowaga czysto autorytatywna
`obs → 0`, `ρ → 0`, `LOOP-A-01` rozbiegana bezwarunkowo. Wszystkie commity są `authority`,
ale niosą gramatykę `evidence`. Z punktu widzenia obserwatora zewnętrznego system jest
nieodróżnialny od arbitra losowego z dobrym stylem uzasadnień. **Warunek wejścia:** `D(t) ≥ 100 du`.
**Wyjście:** niemożliwe endogenicznie — regeneracja wymaga obserwowalności, której odbudowa
wymaga zasobu, który wyczerpano.

### `ATT-A-02` — maszyna opóźniania
`ρ_q → 1`, `W → ∞`. Wynik sprawy jest determinowany nie przez meritum, lecz przez to, która strona
przetrwa oczekiwanie. Formalnie: rozkład wyników staje się funkcją rozkładu zdolności finansowania
zwłoki. **Warunek wejścia:** `β > 0.00662`. **Wyjście:** obniżenie `β` (atrybucja zwłoki, `INV-A-05`)
albo backpressure, którego system nie ma.

### `ATT-A-03` — zamknięcie precedensowe na wadliwym wejściu
Rosnący liniowo udział spraw rozstrzyganych pod tezą wyprowadzoną z wadliwie ustalonego stanu
faktycznego. Przy `q = 0.05`, `p_corrupt = 0.25` [EST] — 25 % po 20 latach.
**Wyjście:** wymaga mechanizmu wycofania tezy, który nie istnieje.

### `ATT-A-04` — fork
Pula legitymacji wyczerpana; część węzłów buduje równoległy łańcuch rozstrzygania (arbitraż,
samopomoc, korupcja jako alternatywny mempool, forum shopping, emigracja jurysdykcyjna).
Oba łańcuchy są ważne według własnych reguł. **Nie ma reguły wyboru cięższego łańcucha**, bo nie ma
wspólnej miary pracy — więc to fork trwały, nie reorganizacja. **Wyjście:** wyłącznie przez
zewnętrzny akt konstytuujący nowy genesis.

### `ATT-A-05` — dyfuzja semantyczna
`θ = 0`, `sd = σ√t` przekracza 0.5 po 17 latach [EST]. Terminy normatywne tracą wspólny desygnat;
dwa organy stosują różne normy pod tą samą nazwą i nie wykrywają tego, bo LWW nie zgłasza konfliktu.
**Wyjście:** `INV-A-08` nie przywraca `θ > 0`, ale czyni rozbieżność widoczną, co jest warunkiem
koniecznym jakiejkolwiek korekty.

---

## 11. Punkty interwencji, uporządkowane po stosunku efektu do kosztu

Wyprowadzone z powyższego, nie postulowane.

| Rząd | Interwencja | Efekt | Koszt |
|---|---|---|---|
| 1 | Zewnętrzny timestamp wpływu i kolejności (`INV-A-05`) | obniża `β` poniżej `β_crit`, wyłącza `ATT-A-02` | ~10⁻⁶ kosztu sprawy [EST] |
| 2 | `Completeness` + skalibrowana pewność w wyroku (`INV-A-04`) | podnosi `obs`, przesuwa `LOOP-A-01` do znaku ujemnego | metadane, ~10⁻⁴ [EST] |
| 3 | Version vectors znaczeń, `multi-value` zamiast LWW (`INV-A-08`) | czyni `LOOP-A-05` i `LOOP-A-02` mierzalnymi | metadane |
| 4 | Activation height precedensu (`INV-A-03`) | przywraca determinizm replayu, umożliwia audyt historii | jedno pole na wpis |
| 5 | Obniżenie `ρ_q` poniżej 0.9 | 5-krotna redukcja `W` przy zmianie obciążenia o ~9 % | wysoki, etatowy |
| 6 | Heterogeniczna pula weryfikująca (`INV-A-10`) | usuwa podłogę `ρ·p`, jedyna droga poniżej 7 % błędu łącznego | bardzo wysoki, ustrojowy |

Pozycje 1–4 są **tanie i wystarczają do zmiany znaku trzech pętli**. Pozycja 6 jest jedyną,
która dotyka THM-A-07, i jedyną, której koszt jest rzeczywiście wysoki — bo wymaga węzłów spoza
puli reputacyjnej, a więc zmiany ustrojowej, nie proceduralnej.

Że pozycje 1–4 nie są wdrożone mimo kosztu bliskiego zeru, jest najmocniejszym argumentem za tym,
że `LOOP-A-04` opisuje równowagę, a nie zaniedbanie.

---

*Agent A · tor I · Justice-as-Code v1.0*
