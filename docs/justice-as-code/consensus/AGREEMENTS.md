# AGREEMENTS.md — zbieżności między soczewkami

Faza konsensusowa, Krok 1–2. Zgodnie z **R1** zgodność nie jest argumentem. Każdy wpis ma:
zdanie zbieżne, argument każdej soczewki osobno, **audyt niezależności przesłanek** i etykietę
`ARGUED` / `AGREEMENT-UNARGUED`.

Kryterium niezależności użyte w całym pliku:

> Dwa argumenty są **niezależne**, jeżeli obalenie przesłanki jednego nie obala przesłanki drugiego.
> Jeżeli oba redukują się do tego samego lematu wypowiedzianego w dwóch słownikach, liczą się jako
> **jeden** argument, niezależnie od tego, że pochodzą od dwóch agentów. Przeciwne policzenie jest
> `VOCABULARY-PEACE` odwrócone: mnożeniem wagi przez tłumaczenie.

Skala niezależności: `FULL` (rozłączne przesłanki i rozłączne metody) · `PARTIAL` (rozłączne
instancje, wspólna metoda) · `NONE` (ten sam argument w dwóch słownikach).

---

## AGR-01 — nieobserwowalność autorytetu: **zbieżność dwustronna, nie trójstronna**

To jest zbieżność o najwyższej wadze wskazana w zadaniu. Wynik weryfikacji jest **negatywny dla
tezy o trójstronności**.

### Co twierdzi każda soczewka

| Soczewka | Zdanie | Miejsce |
|---|---|---|
| **A** | Detektor `d: PublicOutput → {evidence, authority}` **nie istnieje**, bo dziedzina nie zawiera informacji odróżniającej (`switchEmitsSameShape`). „Nie jest to trudność statystyczna, tylko niewystarczalność dziedziny." | `NN-A-04`, `THM-A-05` |
| **B** | `majesty` jest rzutowaniem bez etykiety blame, a `obs` skleja je z `applyNorm`; twierdzenie o blame jest **niewypowiadalne**, użycie majestatu nieobserwowalne **z konstrukcji**. | `THM-B-04`, `NN-B-03` |
| **C** | **Nie stawia tego twierdzenia.** Nieobserwowalność strukturalna dotyczy u C pary `(q, Θ)`, nie trybu rozstrzygania. Wobec samego użycia autorytetu C twierdzi coś **przeciwnego**: `M = min(demand, G/gSpend)` jest wielkością modelu, a `NN-C-05` **żąda jej raportowania** razem z `demand − M`. `RES-C-01` opisuje stan faktyczny jako „**brak licznika**" — czyli lukę instrumentacyjną, nie konstytutywną. | `NN-C-01`, `NN-C-05`, `RES-C-01`, `ALG-C-05` |

### Audyt niezależności A ↔ B

A i B **nie są niezależne**. Redukcja:

- A: zbiór `PublicOutput` nie zawiera pola różnicującego tryb ⟹ każdy detektor na tej dziedzinie
  jest stały na włóknie zawierającym oba tryby.
- B: `obs` (i `E = admit`) nie jest injektywna ⟹ brak lewego odwrotu ⟹ etykieta nieodzyskiwalna.

„Niewystarczalność dziedziny kodziedziny" i „brak lewego odwrotu odwzorowania w tę kodziedzinę" są
**tym samym zdaniem**. Obalenie jednej przesłanki (pokazanie, że w wyjściu jest jednak bit
różnicujący) obala obie jednocześnie. Niezależność: **`NONE`**. Waga argumentacyjna: **1, nie 2.**

### Co jednak jest zbieżne trójstronnie

Słabsze, ale nietrywialne zdanie zachodzi u wszystkich trzech:

> **LEM-OBS.** Dla każdej soczewki istnieje zmienna stanu rozstrzygająca o działaniu pętli
> korygującej, która **nie jest funkcją emitowanych obserwacji**, i przeszkodą jest
> **nieinjektywność odwzorowania obserwacji**, a nie szum pomiarowy.

| Soczewka | Jądro nieobserwowalne | Metoda dowodu |
|---|---|---|
| A | pary wyprowadzeń o identycznym `PublicOutput`, różniące się trybem | argument o mocy/dziedzinie + gra (`THM-A-05`: nieemisja jest strategią dominującą) |
| B | jądro `obs`: `applyNorm` sklejone z `majesty`; `E = admit` bez lewego odwrotu | teoriotypowa nieinjektywność funktora |
| C | `span{[1,−1]}` dla `x = [q, Θ]ᵀ`, `A = I₂`, `C = [1,1]`, `rank Ob = 1 < 2` | kryterium Kalmana, `ALG-C-04`, zweryfikowane numerycznie |

Trzy **różne, rozłączne jądra** w trzech **różnych przestrzeniach stanu**, ale **ta sama metoda**
(deficyt rangi = nieinjektywność). Niezależność: **`PARTIAL`** — instancje niezależne, metoda wspólna.

**Etykieta: `ARGUED`** (każda instancja niesie własny dowód; żaden agent nie powołuje się na cudzy).

### Konsekwencja dla wagi

Zapowiedź B, że soczewka sterownicza potraktuje `majesty_switch` jako **szum o zerowej średniej**
i zaprojektuje kompensator, jest **falsyfikowana**: `ALG-C-05` to deterministyczny aktuator z twardym
nasyceniem `M = min(demand, G/gSpend)`, `LOOP-C-05` ma znak `+` i wzmocnienie `g₅ = 0.65`, a
`FAIL-C-02` opisuje nasycenie, nie wariancję. C nie modeluje majestatu jako szumu **ani** nie
twierdzi, że jest on konstytutywnie nieobserwowalny.

**Wniosek dla zadania:** zbieżność trzech soczewek na zdaniu „użycie autorytetu jest konstytutywnie
nieobserwowalne" **nie jest realna**. Realna jest zbieżność A ↔ B, i to jako **jeden argument
w dwóch słownikach**. Trójstronna jest tylko `LEM-OBS`, o istotnie słabszej treści.

---

## AGR-02 — kanał obserwacji ma **dwie niezależne przeszkody**, i to jest zbieżność realna

Wszystkie trzy soczewki żądają **tego samego nowego kanału obserwacji** i każda dostarcza **inną
brakującą część**:

| Soczewka | Wkład w kanał | Miejsce |
|---|---|---|
| B | **datum**: etykieta blame na każdym rzutowaniu niesprawdzonym (poziom kroku wyprowadzenia) | `NN-B-03`, `NN-B-02` |
| A | **agregat i skalar**: publiczny licznik `force_gas` per organ + `calibrated.support ∈ [0,1]` w wyroku | `NN-A-08`, `NN-A-04` |
| C | **warunek dostateczny**: nieodwoływalność czujnika `ρ = 0` + para `(M, demand − M)` | `NN-C-02`, `NN-C-05` |

Kluczowa treść: **dwie przeszkody dla instalacji tego kanału są wyprowadzone niezależnie.**

- **Przeszkoda bodźcowa (A, `THM-A-05`).** Nieujawnianie skalibrowanej pewności jest strategią
  dominującą **przy binarnej egzekucji w `S7`**. Kanał nie powstanie, dopóki `S7` jest binarne.
- **Przeszkoda własnościowa (C, `NN-C-02`).** Czujnik ma właściciela politycznego i jest odwoływalny
  (`ρ > 0`); break-even instalacji 16 kw wobec kadencji 16–24 kw (`PRIM-C-06`). Zainstalowany
  czujnik zostanie zdemontowany, zanim się zwróci.

Obalenie jednej nie obala drugiej: `S7` można ugradować bez zmiany własności czujnika, i odwrotnie.
Niezależność: **`FULL`**.

**Etykieta: `ARGUED`.**

**Produkt scalenia (nie występuje w żadnym modelu suwerennym):** `CON-B-09` dodaje `Effect.saturation`,
czyli **ciągły wymiar egzekucji w `S7`** — dokładnie zmianę, o której `THM-A-05` mówi, że jest
warunkiem koniecznym uczynienia emisji pewności równowagą. Soczewka, która nie miała problemu
bodźcowego (B), dostarcza rozwiązania problemu bodźcowego postawionego przez A. Patrz `MERGED-SPEC.md §S7`.

---

## AGR-03 — próg krytyczny obserwowalności: zbieżność liczbowa A ↔ C w granicach 15 %

| Soczewka | Wielkość | Wyprowadzenie | Wartość |
|---|---|---|---|
| A | `obs_crit` | znak `LOOP-A-01`: `δ·a − ρ_max·obs = 0` ⟹ `obs_crit = δa/ρ_max = 0.025/0.05` | **0.500** |
| C | `O` przy `g₁ = 1` | wzmocnienie `LOOP-C-01`: `g₁ = |∂m/∂O|·(ρO/η)·(ν(1−q)/γ₀O)` | **0.427** |

Rozbieżność 14.6 %. Dwa **rozłączne zestawy parametrów**, dwa różne modele, ta sama metoda
(przejście wzmocnienia pętli przez wartość krytyczną). Niezależność: **`PARTIAL`**.

**Etykieta: `ARGUED`.**

**Zakaz przeliczania.** `obs` (A) i `O` (C) mają tę samą normalizację `[0,1]` i tę samą **rolę
funkcyjną** (mnożnik przy członie korygującym: `LOOP-A-01` ma `ρ_max·obs`, `LOOP-C-07` ma
`γ_eff = γ₀·O`), ale **różne definicje**: A mierzy zdolność zewnętrznego obserwatora do odróżnienia
`evidence-commit` od `authority-commit`, C mierzy strukturalną obserwowalność `q`. Uznanie ich za tę
samą wielkość i przeliczenie `du ↔ caseload-kwartał` przez ten kurs byłoby `FALSE-COMMENSURATION`
(`CONSENSUS-PHASE §4`). Wpis jest **zgodnością wyników, nie kursem wymiany**. Patrz
`DRIFT-LEDGER.md §2`.

---

## AGR-04 — bodziec do zatajenia: dwa argumenty, nie trzy; i trzy części jednej dźwigni

Zbieżne zdanie: **zatajenie jest opłacalne, dopóki iloczyn (wykrywalność × sankcja) nie przekroczy
prywatnego zysku, a wykrywalność jest tą zmienną, której system nie mierzy.**

| Soczewka | Nierówność | Metoda |
|---|---|---|
| A | `P(wykrycie)·sankcja < ΔU_self` ⟹ `LOOP-A-02` rozbiega się; przy braku `INV-A-08` `P(wykrycie) ≈ 0`, więc warunek spełniony trywialnie | teoria gier |
| C | ujawnienie jest best response ⟺ `O > O* = c_d/(c_m·φ)`; przy `O → 0` iloczyn `c_m·φ·O → 0` **niezależnie od `c_m`** | mechanism design |
| B | poprawność ≡ reputacja jako **punkt stały** hierarchii (`THM-B-13`); nieobserwowalność `fit` jest **przyczyną** rozbiegania, nie skutkiem | punkt stały definicji, nie wypłata |

A i C to **ta sama nierówność w dwóch notacjach** (`P(wykrycie)` ≡ `φ`, `sankcja` ≡ `c_m`,
`ΔU_self` ≡ zysk z maskowania). Niezależność A↔C: **`NONE`**. B jest niezależne: teza B zachodzi
nawet przy nieskończonej sankcji, bo nie mówi o wypłacie, tylko o tym, że *kryterium* poprawności
jest wewnętrznym punktem stałym. Niezależność B↔{A,C}: **`FULL`**.

**Etykieta: `ARGUED`** (dwa niezależne argumenty).

**Rozwiązanie pozornego konfliktu `NN-B-03` ⊥ `NN-C-03`** — patrz `CONFLICTS.md CONF-D-15`.
W skrócie: `c_d` (koszt **samo**ujawnienia) i `c_m` (kara za **zatajenie**) to dwie różne wielkości
w `ALG-C-01` C. Trzy soczewki obsługują trzy różne czynniki tej samej nierówności:

```
B: etykieta blame            →  podnosi  φ   (wykrywalność)
A: sankcja za zatajenie      →  podnosi  c_m
C: blameless postmortem      →  zeruje   c_d
```

Żadna nie jest substytutem pozostałych, bo w `O > c_d/(c_m·φ)` występują wszystkie trzy czynniki.

---

## AGR-05 — zależność od „świętego": trzy w pełni niezależne argumenty

Zbieżne zdanie: **system ma nieredundowany komponent orzeczniczy o skoncentrowanym obciążeniu, a
jego awaria jest skokowa, nie łagodna.**

| Soczewka | Argument | Metoda | Liczba |
|---|---|---|---|
| A | `n = 1 ⟹ f_max = 0`; `LOOP-A-07` wzmocnienie `1/(1−ρ_q)²`; wzrost obciążenia 0.90→0.98 wydłuża oczekiwanie **5×** | teoria kolejek | `ρ_q > 0.9` |
| B | `PRIM-B-17 Saint` to **interfejs bez implementacji**; `HumanJudge` deklaruje zgodność **bez testu zgodności**; `LOOP-B-08` — krawędź porównania z niezależną `Spec` **nie istnieje** | zgodność typów / brak conformance suite | self-loop o wzmocnieniu 1 |
| C | `LOOP-C-08`: udział obciążenia `S* = 0.549–0.716` wobec `SLO ≤ 0.15` (**366 % SLO**); hazard `0.025/kw`; awaria = spadek `q` o **43.5 %** w jednym kroku, brak powrotu w 40 kw | niezawodność / hazard rate | `S* = 0.549–0.716` |

Trzy rozłączne przesłanki, trzy rozłączne metody. Obalenie którejkolwiek nie rusza pozostałych.
Niezależność: **`FULL`**. Dodatkowo zgodność ilościowa: A mówi `ρ_q > 0.9`, C mówi `S*` na poziomie
`3.7×` SLO — obie liczby lokują koncentrację obciążenia w tym samym rzędzie.

**Etykieta: `ARGUED`** — najsilniejsza zbieżność w całym scaleniu.

---

## AGR-06 — zatrucie etapowe: trzy w pełni niezależne argumenty

Zbieżne zdanie: **defekt powstały na `S1`/`S2` nie jest naprawiany przez `S6`; instancja odwoławcza
naprawia funkcję przejścia, nigdy wejście.**

| Soczewka | Argument | Metoda |
|---|---|---|
| A | brak krawędzi `S6 → S2` w `TRANSITIONS`; apelacja to **replay na zamrożonym logu** (`THM-A-01`); `floorStage = S3` leży **wyżej** niż źródło defektów (`RES-A-06`) | osiągalność w grafie przejść |
| B | po naruszeniu `I₂` najsilniejszy wyprowadzalny warunek końcowy potoku to `true` (`THM-B-07`); apelacja to rerun późnych faz **na tym samym AST**; dodatkowo `I₂` kwantyfikuje po zbiorze definiowanym dopiero w `S5` (`THM-B-08`), więc wykrywalność naruszenia = 0 | logika Hoare'a, `sp` |
| C | dekompozycja `V = V_p ⊕ V_fact`; udział wariancji proceduralnej `70.6 %` (`A_praca`) / `82.2 %` (`A_legit`); `NN-C-06` konstruuje test rozstrzygający na parach spraw izomorficznych | dekompozycja wariancji |

Niezależność: **`FULL`**.
**Etykieta: `ARGUED`.**

**Wkład wyłączny B:** `THM-B-08` daje coś, czego nie ma ani A, ani C — dowód, że warunek `I₂` jest
**niesprawdzalny w chwili, w której ma zachodzić**, bo kwantyfikuje po `material(F)` definiowanym
dopiero w `S5`. To zamyka drogę „wystarczy sprawdzać `I₂` staranniej".

**Produkt scalenia — `MRG-03`.** Złożenie A+B (brak drenu dla `E_input`) z modelem `E` agenta C daje
liczbę, której nie ma żaden model suwerenny: w **dobrym** atraktorze, przy zerowym maskowaniu,
nieodsączalna składowa zapasu błędu przekracza separatrysę `E_crit` w **27–137 kwartałów
(6.8–34.3 roku) [EST]**. Wyprowadzenie w `DRIFT-LEDGER.md §5`.

---

## AGR-07 — deficyt budżetu weryfikacji: trzy niezależne pomiary, jednostki **przeliczalne**

Zbieżne zdanie: **budżet uwagi orzeczniczej jest mniejszy od przestrzeni przeszukiwania o
`10⁰–10²` rzędu wielkości, a niedobór przelewa się na wydatek autorytetu.**

| Soczewka | Pomiar | Wartość |
|---|---|---|
| A | `RES-A-03`: 2.0–5.3 h/sprawę dostępne wobec **20.8 h** samego czytania akt 1000 str. | deficyt ≈ **5.7×** [EST] |
| B | `RES-B-01` + `THM-B-14`: ~1.2·10³ vgas/sprawę wobec przestrzeni 10³–10⁵ | deficyt **0.83–83×** [EST] |
| C | `RES-C-05`: uwaga orzecznicza z hard deadline, „niedobór **przelewa się** na `RES-C-01`" | mechanizm, bez liczby |

To jedyne miejsce w całym scaleniu, gdzie jednostki trzech agentów są **przeliczalne**:
`1 judge-hour = 3600 s = 120 vgas` (z `PRIM-B-14`: 1 vgas ≈ 30 s uwagi orzekającej [EST]);
`RES-B-02` = 3.6·10⁴ s/sprawę poważną = 10 judge-hour. Kurs i jego uzasadnienie w
`DRIFT-LEDGER.md §4`.

Niezależność: **`FULL`** (trzy rozłączne instrumenty pomiaru tej samej wielkości fizycznej).
**Etykieta: `ARGUED`.**

**Rachunek scalenia [EST]** — koszt czasowy wypełnienia zobowiązań `NN-*` scalonych, per sprawa:

| Zobowiązanie | Koszt [s/sprawę] | Podstawa |
|---|---|---|
| `NN-A-08` licznik FG per organ | ~10 | zapis `O(1)`, `mode` znany w chwili commitu |
| `NN-A-04` `calibrated.support` | ~60 | jedna liczba + jej uzasadnienie |
| `NN-A-07` flaga dual/single custody | ~300 | `O(|F_decisive|)` ≈ 10¹ faktów × 30 s |
| `NN-B-02` + `NN-B-03` assume i blame | 30–300 | `ρ_a ≈ 10⁰–10¹` fraz × 30 s |
| `NN-B-04` pole `deps` przy cytowaniu | ~150 | `O(k)` cytowań × 30 s |
| `NN-A-02`, `NN-C-01`, `NN-C-05` | ~0 | infrastruktura albo próbka, nie per sprawa |
| **razem** | **550–820 s** | **0.15–0.23 judge-hour = 18–27 vgas** |

Wobec `RES-A-03` (2.0–5.3 h) to **3–11 %** budżetu; wobec `RES-B-01` (1.2·10³ vgas) to **1.5–2.3 %**.
**Zobowiązania scalone mieszczą się w budżecie.** Nie mieści się natomiast sam deficyt z `THM-B-14`
— scalenie go nie zmniejsza i żaden agent nie ma na niego mechanizmu.

---

## AGR-08 — kanał `Θ` / `VersionVector` / `Γ`: trzy tryby awarii jednego obiektu

Zbieżne zdanie: **rama interpretacyjna dryfuje, a dryf jest nierejestrowany.**
Trzy soczewki opisują **różne tryby awarii**, więc zgodnie z kryterium tożsamości Kroku 1 to nie
jest `SAME`, tylko `ORTHOGONAL` — wszystkie trzy wchodzą do scalenia.

| Soczewka | Obiekt | Tryb awarii |
|---|---|---|
| A | `PRIM-A-09 VersionVector` | `lost update` przy `LWW` (kontrprzykład wykonany, `NN-A-06`) |
| B | `PRIM-B-08 Gamma` + `PRIM-B-11 PrecedentCache` | monotoniczny wzrost bez GC; memoizacja bez inwalidacji (`THM-B-09`); zmiana łamiąca bez podbicia wersji (`THM-B-15`) |
| C | `PRIM-C-08 Θ` | `integrator windup`: przy `O = 0` człon tłumiący znika tożsamościowo, `Θ̇ = 0.06/kw`, nasycenie w ~17 kw (`NN-C-04`) |

**Zależność jednokierunkowa wykryta przy scalaniu:** `Θ` jest mierzalne **tylko wtedy**, gdy znaczenia
są wersjonowane — bez `V` nie ma punktu odniesienia, względem którego mierzy się przesunięcie
wzorca. Zatem **`NN-A-06` jest przesłanką wykonalności `NN-C-04`**. Ani A, ani C tego nie zauważyli,
bo żaden nie miał drugiego obiektu.

**Etykieta: `ARGUED`** dla każdego trybu z osobna; **niezależność `FULL`**.

---

## AGR-09 — `AGREEMENT-UNARGUED`: zgodności bez argumentu (dług, nie wynik)

Poniższe zdania są przyjęte przez wszystkie trzy soczewki i **żadna nie podaje dla nich argumentu
formalnego** w rozumieniu `PROTOCOL.md §6`. Zgodnie z **R1** zapisuję je jako dług.

| ID | Zdanie | Kto zakłada | Czego brakuje |
|---|---|---|---|
| `UNARG-01` | Kanoniczna oś `S0..S8` jest właściwą dekompozycją postępowania | A (`TRANSITIONS`), B (`stage_mapping`), C (`stage_mapping`) | Oś pochodzi z `PROTOCOL.md §1`, gdzie jest **podana, nie wyprowadzona**. Żaden agent nie testował, czy jego zjawiska respektują tę granicę. B musiał dodać `Sx-B-LINK`, co jest przesłanką, że oś jest niepełna. |
| `UNARG-02` | Sprawa jest właściwą jednostką analizy dla `S1..S7` | A, B (per sprawa), C (per populacja) | Trzy soczewki **nie zgadzają się** co do jednostki, ale żadna nie argumentuje za swoją. Patrz `CONFLICTS.md CONF-F-02`. |
| `UNARG-03` | Zjawiska z `PROTOCOL.md §2` są rozłączne i wyczerpujące | wszystkie trzy (`phenomena_coverage`) | Pokrycia zachodzą na siebie: C mapuje `LOOP-C-03` jednocześnie na `retroactive_relativization` i `onto_epistemic_drift`; A mapuje `LOOP-A-01` i `LOOP-A-06` na jeden klucz. Rozłączność nie jest nigdzie wykazana. |
| `UNARG-04` | Aksjomat wejściowy protokołu (podmiot zindywiduowany lepiej określony niż uśrednienie) | A, B (`NN-B-07`, `Spec_p`), C | `PROTOCOL.md §0` podaje go jako **dany, nie do udowodnienia przez agenta**. B jako jedyny go formalizuje (per-podmiotowa rodzina `Spec_p`); A i C używają go milcząco. Jest to przesłanka `CONF-F-02`, więc nie jest neutralny. |
| `UNARG-05` | Horyzont 10–40 lat jest właściwym horyzontem oceny dryfu | A (10.5 roku), B (1.6 roku), C (6 lat) | Trzy różne horyzonty, żadnego uzasadnienia wyboru. Horyzont determinuje, który człon kumulacji dominuje, więc wybór nie jest neutralny wobec wyniku. |

`UNARG-02` i `UNARG-04` są **przesłankami konfliktu fundamentalnego** `CONF-F-02`. Ich status
nieargumentowany oznacza, że ten konflikt może okazać się pozorny, jeżeli któraś strona dostarczy
argument. Do tego czasu obie gałęzie stoją.

---

## Podsumowanie audytu niezależności

| Zbieżność | Agenci | Liczba **niezależnych** argumentów | Etykieta |
|---|---|---|---|
| `AGR-01` `LEM-OBS` | A, B, C | 3 instancje / **1 metoda** → `PARTIAL` | `ARGUED` |
| `AGR-01` nieobserwowalność **autorytetu** | A, B (nie C) | **1** (ten sam argument, dwa słowniki) | `ARGUED`, waga 1 |
| `AGR-02` dwie przeszkody kanału | A, C | **2** (`FULL`) | `ARGUED` |
| `AGR-03` próg `obs_crit ≈ 0.43–0.50` | A, C | 2 wyprowadzenia / 1 metoda → `PARTIAL` | `ARGUED` |
| `AGR-04` bodziec do zatajenia | A≡C, B | **2** | `ARGUED` |
| `AGR-05` `saint_dependency` | A, B, C | **3** (`FULL`) | `ARGUED` |
| `AGR-06` `stage_corruption` | A, B, C | **3** (`FULL`) | `ARGUED` |
| `AGR-07` deficyt budżetu | A, B, C | **3** (`FULL`), jednostki przeliczalne | `ARGUED` |
| `AGR-08` rama interpretacyjna | A, B, C | **3** (`FULL`), `ORTHOGONAL` | `ARGUED` |
| `UNARG-01..05` | wszyscy | **0** | `AGREEMENT-UNARGUED` |

Suma: **9 zbieżności `ARGUED`, 5 pozycji `AGREEMENT-UNARGUED`.**
Zbieżność wskazana w zadaniu jako najwyżej ważona (nieobserwowalność autorytetu) okazała się
**dwustronna i jednoargumentowa**, czyli warta mniej niż `AGR-05`, `AGR-06` i `AGR-07`, gdzie
niezależność jest pełna.

---

*Harmonizing Functor Collective · Justice-as-Code · faza konsensusowa*
