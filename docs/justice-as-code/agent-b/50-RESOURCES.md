# AGENT B · `50-RESOURCES.md` — budżet zasobów (tor I)

Co jest skończone, w jakich jednostkach, kto płaci, jak się miarkuje.
Plus definicja jednostki kosztu ustępstwa (`vbit`), używanej w `30-CONCESSIONS.md`.

**Zasada.** Zasób bez jednostki i bez płatnika nie jest zasobem, tylko retoryką.
Każdy wpis podaje: jednostkę, skończoność, płatnika, mechanizm miarkowania i **co się dzieje przy wyczerpaniu**.
Wszystkie wartości liczbowe: `[EST]`, z podaniem sposobu wyliczenia.

---

## 1. Tablica zasobów

| ID | Zasób | Jednostka | Skończony | Płatnik | Miarkowanie | Przy wyczerpaniu |
|----|-------|-----------|-----------|---------|-------------|-------------------|
| `RES-B-01` | **`vgas`** — budżet weryfikacji | `krok wyprowadzenia` | tak | sąd (stała alokacja) + strony (kierunek przeszukiwania) | pośrednio przez `RES-B-02` | `Search → Assume → Majesty` (`10-SPEC.md` §4) |
| `RES-B-02` | uwaga orzekająca | `s uwagi / sprawę` | tak, twardo | budżet państwa / etatyzacja | referat, normy statystyczne | jw. |
| `RES-B-03` | rozmiar korpusu `n` | `jednostka redakcyjna` | nie (rośnie) | wszyscy czytający | brak (**brak DCE**) | n/d — rośnie monotonicznie |
| `RES-B-04` | budżet link-checku | `wywołanie SAT` | tak | nikt (niewydawany) | brak | kolizje pozostają niewykryte (`FAIL-B-04`) |
| `RES-B-05` | rozmiar cache precedensów | `orzeczenie` | nie (rośnie) | cytujący | brak eviction, brak `deps` | n/d |
| `RES-B-06` | budżet strony | `PLN` | tak | strona | rynek usług prawnych | strona kończy sprawę niezależnie od meritum |
| `RES-B-07` | **`majesty_token`** | `użycie / orzeczenie` | **nie miarkowany** | strona przegrywająca | **brak** | n/d — nie może się wyczerpać |
| `RES-B-08` | gęstość `assume` `ρ_a` | `assume / krok` | pochodna | — | brak pomiaru | patrz §4 |
| `RES-B-09` | budżet winy (`blame`) | `jednostka przypisania` | tak (`= 1` na orzeczenie) | — | brak | **wyciek** — patrz §3 |
| `RES-B-10` | czas do prawomocności | `dzień` | nie | strona (koszt alternatywny) | terminy instrukcyjne (niesankcjonowane) | absorbująca bariera (`THM-B-11`) |
| `RES-B-11` | **`vbit`** — falsyfikowalność | `bit` | tak (`= H₀`) | model | patrz §5 | model przestaje wykluczać cokolwiek |
| `RES-B-12` | okno deprecjacji (*vacatio legis*) | `dzień` | tak | adresat normy | ustawa | zmiana wchodzi bez re-weryfikacji |

---

## 2. `RES-B-01` `vgas` — definicja jednostki i kalibracja

**Definicja.** `1 vgas` = jedna **próba zastosowania normy**: sprawdzenie guarda + rozwiązanie odwołań
do dowodów + wyprowadzenie wniosku pośredniego. To jest najmniejszy krok, na którym da się odróżnić
„udowodnione” od „przyjęte”, więc jest właściwym kwantem dla `force_gas`.

**Kalibracja przez `RES-B-02`** (wszystko `[EST]`, sposób wyliczenia podany):

| Wielkość | Wartość | Wyliczenie |
|---|---|---|
| czas pracy sędziego | `1.6 × 10³ h/rok` | 40 h/tydz × ~40 tyg |
| wpływ na referat | `10² – 10³ spraw/rok` | zależnie od wydziału |
| czas na sprawę | `1.6 – 16 h` | iloraz powyższych |
| czas na sprawę „poważną” (rozprawa + uzasadnienie) | `10 h = 3.6 × 10⁴ s` | górny koniec przedziału |
| koszt jednego kroku wyprowadzenia | `~30 s` skupionej pracy | ASSUMPTION-B-04 |
| **`vgas` dostępny** | **`~1.2 × 10³`, rząd `10³`** | `3.6×10⁴ / 30` |

**Przestrzeń przeszukiwania** (z `10-SPEC.md` §3.3): `O(b^d)` przy `b ≈ 3–8`, `d ≈ 3–5`,
plus przypisanie `e ≈ 20–100` dowodów do `m ≈ 10–50` kluczy faktycznych.
Rząd: **`10³ – 10⁵` kroków**.

### `THM-B-14` — budżet weryfikacji jest o `10⁰–10²` mniejszy od przestrzeni przeszukiwania, więc `assume` jest strukturalnie konieczny

**Teza.** `gas_dostępny / |przestrzeń| ∈ [10⁻², 10⁰]`. Dla przeważającej masy spraw iloraz `< 1`.
Zatem pełne wyprowadzenie jest **niedostępne budżetowo**, niezależnie od kompetencji i sumienności.
`assume` nie jest lenistwem — jest wymuszony arytmetyką, dokładnie tak jak solver z limitem czasu
zwraca `unknown` albo przyjmuje hipotezę.

**Konsekwencja 1 — kto dostarcza kierunku przeszukiwania.** Skoro pełne przeszukiwanie jest niewykonalne,
przeszukiwanie musi być **prunowane**. Dwa dostępne pruner-y:
(a) `PrecedentCache` (`LOOP-B-01`), (b) **pisma stron** (`PRIM-B-13`).
Czyli: **przeciwnik dostarcza heurystyki**. To jest kanoniczny warunek, w którym optymalizator
działa na wejściu kontrolowanym przez adwersarza — i dokładnie stąd `LOOP-B-09`.

**Konsekwencja 2 — punkt przemytu aksjomatu (`axiom smuggle point`).**
Definicja operacyjna: **miejsce w uzasadnieniu, w którym propozycja jest wprowadzona bez wyprowadzenia**.
To jest **mierzalne dziś, bez zmiany procedury**, z opublikowanych uzasadnień:

```
rodzina fraz sygnalizujących `assume`:
  "w ocenie Sądu"          "Sąd dał wiarę"        "Sąd nie znalazł podstaw"
  "w okolicznościach sprawy"  "zdaniem Sądu"      "brak jest podstaw do przyjęcia"
  "jest oczywiste, że"     "nie budzi wątpliwości"
```

`ρ_a = n_assume / n_kroków_wyprowadzenia` (`RES-B-08`).
Proxy wykonalne bez parsowania wyprowadzenia: `ρ'_a = n_assume / n_cytowanych_przepisów`.
[EST] rząd `10⁰ – 10¹` fraz na uzasadnienie; brak danych, bo nikt tego nie liczy.

**Gdzie kończy się dowód, a zaczyna aksjomat — precyzyjnie.** Granicą jest ostatni krok, dla którego
istnieje **świadek** (`Evidence` albo `applyNorm` z rozstrzygalnym guardem). Wszystko po tym kroku
w drzewie wyprowadzenia jest aksjomatem wprowadzonym ukradkiem, przy czym „ukradkiem” ma tu znaczenie
techniczne, nie moralne: **erasure `obs` renderuje aksjomat i dowód tą samą frazą** (`THM-B-04`).
Sędzia nie ukrywa aksjomatu — **format wyjściowy nie ma dla niego pola**.

**Falsyfikacja.** Zmierzyć `ρ_a` na próbie uzasadnień i pokazać, że `n_assume ≈ 0` przy pełnych
wyprowadzeniach. Albo pokazać, że `gas_dostępny > |przestrzeń|` — czyli że sprawy są prostsze,
niż zakłada model `b^d`.

---

## 3. `RES-B-07` i `RES-B-09` — jedyny zasób bez miarkowania i wyciek winy

**`RES-B-07 majesty_token`.** Wszystkie pozostałe zasoby w tablicy mają miarkowanie albo przynajmniej
obserwowalne zużycie. `majesty_token` nie ma **ani limitu, ani licznika, ani śladu**.
Formalnie (z `10-SPEC.md`): konstruktor `{ step: "majesty" }` jest pusty i znika w `obs`.

To jest osobliwość projektowa warta nazwania: w systemie, w którym **wszystko inne jest reglamentowane**
(terminy, opłaty, liczba świadków, zakres apelacji, limity stron pisma), **zasób rozstrzygający
o wyniku jest jedynym nieograniczonym**. Model nie twierdzi, że jest to celowe; twierdzi,
że jest to **wymuszone przez `THM-B-03`**: gdyby `majesty` był reglamentowany, przy wyczerpaniu limitu
system musiałby zwrócić `NON_LIQUET`, czego ustrój zakazuje.

**`RES-B-09` budżet winy — wyciek.** W blame calculus wina jest **zachowywana**: każda awaria rzutowania
ma dokładnie jednego adresata. Przyjmijmy budżet `1` jednostki przypisania na orzeczenie i rozpiszmy,
gdzie ląduje w wypadku błędnego wyroku:

| Adresat | Przypisywalna część | Dlaczego |
|---|---|---|
| strona (nieudźwignięcie ciężaru dowodu) | `α` | jedyny w pełni adresowalny człon |
| pełnomocnik (błąd w sztuce) | `β` | adresowalny, ale tylko przy błędzie proceduralnym |
| ustawodawca (klauzula UB) | `γ ≈ 0` | brak procedury przypisania winy ustawodawcy za pojedyncze orzeczenie |
| sąd (`majesty`) | `δ ≈ 0` | **brak etykiety** — `THM-B-04` |
| **suma** | `α + β < 1` | **reszta `1 − α − β` wycieka** |

**Wniosek.** Nie jest tak, że winę ponosi „system” — to zdanie jest w tym modelu niewyrażalne, bo
`blame` jest typu `ActorId`, a `system` nie jest `ActorId`. Właściwe zdanie brzmi: **część winy
nie jest przypisywalna do żadnego termu, bo term, który ją wygenerował, nie ma pola na adresata.**
Konsekwencja praktyczna: nie da się skonstruować bodźca korygującego dla `δ`, bo bodziec wymaga adresata.
To jest formalny powód, dla którego `NN-B-03` jest nienegocjowalny — nie „bo odpowiedzialność jest ważna”,
tylko: **bez etykiety żaden mechanizm korekcyjny nie ma na czym operować.**

---

## 4. Kursy wymiany między zasobami

Wymóg `CONSENSUS-PHASE.md` §4: jednostki muszą być przeliczalne **albo jawnie niewspółmierne**.
Deklaruję jedno i drugie, jawnie.

**Przeliczalne:**

| Z | Na | Kurs [EST] | Podstawa |
|---|---|---|---|
| `RES-B-06` PLN | `RES-B-01` vgas | `~0.24 vgas/PLN` (rząd `10⁻¹`) | stawka pełnomocnika `~500 PLN/h`, `1 vgas ≈ 30 s` → `1 vgas ≈ 4.2 PLN` |
| `RES-B-02` s uwagi | `RES-B-01` vgas | `1 vgas = 30 s` | `ASSUMPTION-B-04` |
| `RES-B-03` `n` | `RES-B-04` SAT | `Θ(n²)` wywołań | `THM-B-05b` |
| `RES-B-05` cache | koszt inwalidacji | `Θ(cache)` bez `deps`, `Θ(affected)` z `deps` | `THM-B-09b` |

**Jawnie niewspółmierne (zakaz przeliczania — `FALSE-COMMENSURATION`):**

1. **`RES-B-11 vbit` ↮ `RES-B-06 PLN`.** Falsyfikowalność modelu nie ma ceny rynkowej.
   Każde przeliczenie „ile warta jest sprawdzalność” wymagałoby metryki na przestrzeni orzeczeń,
   której nie ma (`NN-B-05`).
2. **`RES-B-07 majesty_token` ↮ cokolwiek.** Zasób bez licznika nie ma kursu. Przypisanie mu ceny
   („koszt użycia autorytetu”) byłoby wprowadzeniem liczby tam, gdzie nie ma pomiaru — dokładnie
   ta operacja, którą model bada.
3. **`RES-B-09 blame` ↮ `RES-B-06 PLN`.** Odszkodowanie **nie jest** przeliczeniem winy na pieniądz;
   jest osobnym efektem o własnym typie. Sklejenie ich to `FALSE-COMMENSURATION` par excellence,
   i jest to główny kanał, przez który system zamienia pytanie „kto złamał kontrakt” na
   „ile to kosztuje” — czyli usuwa `blame` z modelu przez zmianę typu.

---

## 5. `RES-B-11 vbit` — jednostka kosztu ustępstwa

**Definicja.** Specyfikacja `S` wyklucza pewien zbiór zachowań. Jej treść informacyjna:

$$H(S) = \log_2 \frac{|B_{all}|}{|B_S|}$$

gdzie `B_all` = wszystkie zachowania typowo dopuszczalne, `B_S` = zachowania dopuszczane przez `S`.
**Ustępstwo poszerza `B_S` do `B_{S'}`. Jego koszt to:**

$$c = \log_2 \frac{|B_{S'}|}{|B_S|} \quad [\text{vbit}]$$

**Dlaczego to jest właściwa jednostka, a nie ozdoba.** `vbit` mierzy dokładnie to, co ustępstwo zabiera:
**zdolność modelu do wykluczenia obserwacji**. Model, który nic nie wyklucza, ma `H = 0` i jest bezużyteczny
niezależnie od tego, jak elegancko jest napisany. Jednostka jest **obliczalna** na modelu TLA+ z `10-SPEC.md`:
wystarczy policzyć stany osiągalne z własnością i bez niej.

**Przykład rachunku na modelu z `10-SPEC.md` §4.** `Outcomes = {grant, deny}`, `Derivable = {deny}`.
Ze `Soundness`: dopuszczalny 1 wynik. Bez `Soundness`: 2. Koszt oddania `Soundness` = `log₂(2/1) = 1 vbit`
w tej minimalnej instancji. Dla realnej sprawy z `k = 10²` rozróżnialnymi rozstrzygnięciami (kwota
zasądzona w kubełkach × rozstrzygnięcie o kosztach) i `d = 3` wyprowadzalnymi:
`log₂(100/3) ≈ 5.06 vbit`. Rząd: **jednostki vbitów na ustępstwo.**

**Budżet całkowity `H₀`** — treść informacyjna modelu suwerennego, czyli **ile w ogóle mam do stracenia**:

| Wymiar, na którym model coś wyklucza | rozmiar `B_all` | rozmiar `B_S` | wkład [bit] |
|---|---|---|---|
| rozstrzygnięcie (kubełki kwoty × dyspozycja × koszty) | `~10³` | `~3` | `≈ 8.4` |
| ścieżka proceduralna (dopuszczalne uporządkowania `S1..S7`) | `2²⁰` | `2⁸` | `≈ 12` |
| czas do prawomocności (kubełki) | `~32` | `~4` | `= 3` |
| przypisanie blame (kto może być adresatem) | `~8` | `~2` | `= 2` |
| **`H₀`** | | | **`≈ 25.4`, przyjmuję `26 vbit`** `[EST]` |

**Interpretacja progu.** Gdy skumulowany dryf `D(t) ≥ H₀`, zbiór zachowań dopuszczanych przez model
zrównuje się z `B_all`: model **nie wyklucza żadnej obserwacji**, więc jest niefalsyfikowalny,
więc — w kryterium przyjętym w `00-MODEL.md §0` — przestaje być modelem.
To jest operacyjna definicja „utraty sensu” użyta w `30-CONCESSIONS.md`.
**Nie jest to metafora ani skala uznaniowa: to entropia zerowa.**

**`ASSUMPTION-B-05`.** Liczby w tabeli `H₀` są rzędami wielkości opartymi na zgrubnym zliczeniu
rozróżnialnych wyników, nie na danych. Wrażliwość: `H₀` skaluje się logarytmicznie, więc błąd
rzędu wielkości w `|B_all|` zmienia `H₀` o `~3.3 vbit`, czyli o `~13%`. Wniosek o kolejności ustępstw
jest odporny na ten błąd; wniosek o **dokładnym** `t*` — nie.

---

## 6. Miarkowanie, którego nie ma (lista braków jako specyfikacja)

Dla każdego zasobu, który powinien być miarkowany, a nie jest, podaję **licznik**, który by wystarczył.
To jest najtańsza część `40-NONNEGOTIABLE.md`: liczniki nie zmieniają procedury, zmieniają tylko format zapisu.

| Zasób | Brakujący licznik | Koszt wdrożenia | Co odblokowuje |
|---|---|---|---|
| `RES-B-07` `majesty_token` | pole `blame: ActorId` w konstruktorze | zmiana schematu orzeczenia | `NN-B-03`, wszystkie mechanizmy korekcyjne dla `δ` |
| `RES-B-08` `ρ_a` | znacznik `assume` przeżywający serializację | zmiana szablonu uzasadnienia | `NN-B-02`, `INV-B-01` |
| `RES-B-04` link-check | maszynowa reprezentacja guardów | **duży**: formalizacja korpusu, `10⁴–10⁵` jednostek | `INV-B-02`, `THM-B-05b` |
| `RES-B-05` inwalidacja | pole `deps: Set<NormVersion>` w `PrecedentEntry` | zmiana schematu bazy orzeczeń + jednorazowy backfill `Θ(\|cache\|)` | `NN-B-04`, `FAIL-B-03` |
| `RES-B-11` `vbit` | jawna lista wykluczanych zachowań przy każdym niezmienniku | dokumentacyjny | pomiar dryfu w ogóle |

**Obserwacja porządkująca.** Cztery z pięciu braków to **brak pola w rekordzie**, nie brak zasobu.
Różnica jest zasadnicza: brak zasobu wymaga pieniędzy, brak pola wymaga decyzji o formacie.
Dlatego w `40-NONNEGOTIABLE.md` żądam pól, nie budżetów — żądanie budżetu byłoby apelem,
żądanie pola jest specyfikacją.

---

*Agent B · tor I · `50-RESOURCES.md`*
