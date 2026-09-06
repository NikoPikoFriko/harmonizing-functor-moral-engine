# AGENT B · `00-MODEL.md` — model suwerenny (tor I)

**Soczewka:** języki programowania, systemy typów, kompilatory, weryfikacja formalna.

**Teza (jedno zdanie):** System prawny jest językiem programowania, którego specyfikacja jest celowo
niepełna (bogata w *undefined behavior*), którego jedyną „zgodną implementacją” jest pojedynczy,
niereprodukowalny interpreter (sąd), a system typów zawiera uprzywilejowany `unsafeCoerce` (majestat) —
skąd wynika, że wynik nie jest wyprowadzalny z tekstu, a dowody poprawności całości są
**wakacyjne**, bo specyfikacja jest zdefiniowana jako wyjście oracle'a.

---

## 0. Zakres, konwencje, rozszerzenie schematu ID

Ten plik należy w całości do **toru I**. Nie zawiera ustępstw. Jeżeli model wymaga orzeczenia,
że instytucja prawna jest językiem bez semantyki, orzeka to i dowodzi.

**Rozszerzenie schematu §4 protokołu (deklarowane jawnie):** poza typami `PRIM/INV/ALG/LOOP/RES/NN/CON/FAIL`
używam `THM-B-NN` dla twierdzeń i `AD-B-NN` dla decyzji architektonicznych. Oba są adresowalne
i diffowalne, więc nie łamią celu §4 (adresowalność).

**Konwencja dowodowa.** Każde `THM-*` ma: przesłanki (jawne, numerowane), tezę, szkic dowodu,
oraz **warunek falsyfikacji** — co trzeba by pokazać, żeby twierdzenie upadło. Twierdzenie bez warunku
falsyfikacji jest w tym modelu błędem formalnym.

**Jednostki.** Wszystkie liczby mają jednostkę. Oszacowania: `[EST]`. Założenia niedowiedzione: `ASSUMPTION`.

---

## 1. Decyzja architektoniczna

### `AD-B-01` — kodeks modelujemy jako **gradually typed, niedeterministyczny, efektowy język z niesprawdzanym rzutowaniem**, a nie jako program logiczny

**Odrzucone alternatywy i powód odrzucenia:**

| Alternatywa | Dlaczego odrzucona (warunek zachowania, który się nie przenosi) |
|---|---|
| Kodeks = program logiczny (Prolog / Datalog, klauzule Horna) | wnioskowanie prawnicze jest **niemonotoniczne**: dodanie przesłanki (`lex specialis`, wyjątek, kontratyp, klauzula nadużycia prawa) **usuwa** wcześniej wyprowadzalne konkluzje. Datalog jest monotoniczny z definicji; przeniesienie wymagałoby negacji przez porażkę ze stratyfikacją, a hierarchia derogacji nie jest stratyfikowalna (patrz `THM-B-05`). |
| Kodeks = maszyna stanów / automat | przestrzeń stanów nie jest skończona ani nawet efektywnie prezentowalna: stan zawiera kontekst interpretacyjny Γ, który rośnie monotonicznie o każde orzeczenie (`PRIM-B-11`). Automat przenosi tylko cykl życia sprawy (`S0..S8`), i tam go używam — ale nie semantykę norm. |
| Kodeks = system typów **sound** z lukami do uzupełnienia | zakłada, że luki są przypadkowe. Nie są: `THM-B-03` pokazuje, że niesoundowe rozszerzenie jest **wymuszone ustrojowo** (zakaz *non liquet*), nie przypadkowe. |
| Kodeks = specyfikacja + implementacja (dwie warstwy) | wymaga istnienia specyfikacji niezależnej od implementacji. Nie istnieje: `THM-B-02`. |

**Uzasadnienie pozytywne.** *Gradual typing* przenosi cztery zachowania jednocześnie i to jedyny znany mi
model, który przenosi wszystkie cztery:
1. mieszanie regionów statycznie sprawdzonych (przepis o ostrej hipotezie: „14 dni”) z dynamicznymi
   (klauzula generalna: „rozsądny termin”);
2. **rzutowania na granicy** regionów, które mogą zawieść dopiero w runtime (spór o wykładnię);
3. **blame** — przypisanie winy stronie granicy, która złamała kontrakt;
4. istnienie `any` jako typu, przez który przechodzi wszystko — model dyskrecjonalności.

Punkt 3 jest kluczowy: to na jego **braku** opiera się `THM-B-04`.

---

## 2. Prymitywy ontologiczne

| ID | Nazwa | Typ (szkic) | Uwaga behawioralna |
|----|-------|-------------|---------------------|
| `PRIM-B-01` | `World` | typ nieskonstruowalny (`⊥`-only) | stan faktyczny *sam w sobie*; brak konstruktora → do systemu wchodzi wyłącznie przez stratny rzut |
| `PRIM-B-02` | `FactState` | rekord obserwabli + proweniencja | rzut `π : World ⇀ FactState`; **stratny i nieodwracalny** (brak lewego odwrotu) |
| `PRIM-B-03` | `Evidence` | ADT z 4 konstruktorami, jeden niesie `Dec` | jedyne miejsce, w którym rozstrzygalność wchodzi do systemu |
| `PRIM-B-04` | `Claim` | rekord po **erasure** taga z `Evidence` | wynik funktora `E`, patrz `THM-B-12` w `20-DYNAMICS.md` |
| `PRIM-B-05` | `Norm` | rekord: guard, modalność, efekt, wersja, ranga | symbol w płaskiej przestrzeni nazw z niejednoznacznym linkowaniem |
| `PRIM-B-06` | `Guard` | drzewo predykatów z **denotacją trójwartościową** | `defined` / `implementation_defined` / `undefined` |
| `PRIM-B-07` | `Denotation<T>` | suma: `defined` / `implementation_defined` / `undefined` | rdzeń modelu; klasyfikacja klauzul |
| `PRIM-B-08` | `Context Γ` | korpus × cache precedensów × doktryna, indeksowane czasem | rośnie monotonicznie, brak GC, brak eviction |
| `PRIM-B-09` | `Derivation` | drzewo dowodowe z konstruktorem `assume` i `majesty` | proof-carrying **z dziurami**; dziury są usuwane przy serializacji |
| `PRIM-B-10` | `Judgment` | ADT sumaryczny (`grant`/`deny`/`partial`) + `Derivation` | typ **bez metryki** między konstruktorami — patrz `NN-B-05`, `CON-B-05` |
| `PRIM-B-11` | `PrecedentCache` | memo-tablica `HoldingKey ⇀ Judgment` | brak `deps`, brak inwalidacji, brak wersjonowania klucza |
| `PRIM-B-12` | `Judge` | instancja kompilatora: niedeterministyczna, stanowa, jednoegzemplarzowa | brak drugiej zgodnej implementacji → brak differential testing |
| `PRIM-B-13` | `Advocate` | pass optymalizujący z celem przeciwstawnym | maksymalizuje `P(wygrana` dane `wyprowadzenie)`; dostarcza kierunku przeszukiwania |
| `PRIM-B-14` | `VGas` | licznik kroków wyprowadzenia | budżet weryfikacji, `RES-B-01` |
| `PRIM-B-15` | `MajestyToken` | świadek użycia `unsafeCoerce`, **niereprezentowany w wyjściu** | jedyny zasób bez miarkowania |
| `PRIM-B-16` | `Blame` | etykieta `ℓ` na rzutowaniu | w kodeksie **nieobecna** przy `majesty` — `THM-B-04` |
| `PRIM-B-17` | `Saint` | interfejs bez implementacji | `omniscient ∧ impartial ∧ total ∧ consistent` |

---

## 3. Trzy poziomy denotacji (rdzeń klasyfikacji kodeksu)

Przenoszę wprost rozróżnienie ze standardu C (ISO/IEC 9899, §3.4), bo przenosi **tryb awarii**, nie nastrój:

| Poziom | Definicja operacyjna | Przykład z kodeksu | Konsekwencja dla wnioskowania |
|---|---|---|---|
| `defined` | istnieje procedura decyzyjna dająca tę samą wartość dla każdego ewaluatora | „termin 14 dni od doręczenia” | wynik wyprowadzalny; różnica ewaluatorów = błąd jednego z nich |
| `implementation_defined` | wartość zależy od implementacji, ale implementacja **musi ją udokumentować i trzymać stabilnie** | linia orzecznicza konkretnego sądu apelacyjnego, gdy jest jawnie zadeklarowana | wynik przewidywalny **warunkowo**: znając implementację; wymaga pinowania ewaluatora |
| `undefined` | brak jakiegokolwiek ograniczenia na wartość; ewaluator wolno założyć, że przypadek nie zachodzi | „rozsądny termin”, „dobre obyczaje”, „interes społeczny”, „ważne powody”, „rażące naruszenie” | patrz `THM-B-01` |

**Uwaga o klasyfikacji.** Klauzula generalna nie jest „nieostra”. „Nieostra” sugeruje rozmycie wokół rdzenia
(typ *fuzzy*, wartość w `[0,1]`, z monotonicznością). To jest empirycznie fałszywe jako model: dla `undefined`
nie istnieje **żadne** ograniczenie zapisane w systemie, więc nie ma rdzenia ani metryki odległości od niego.
Klauzula generalna jest **dziurą typowaną tylko przez typ wyniku**, dokładnie jak `undefined` w C:
`⟦„rozsądny”⟧ : ?_{ℝ⁺}` — jedyne, co wiemy, to że to liczba dodatnia.

**ASSUMPTION-B-01.** Zakładam, że ustawodawca umieszcza klauzule generalne intencjonalnie (koszt redakcyjny
teraz w zamian za elastyczność później), a nie przez niedbalstwo. Ta asumpcja jest potrzebna tylko do
`20-DYNAMICS.md/LOOP-B-03`; twierdzenia poniżej jej nie używają.

---

## 4. Twierdzenia rdzeniowe

### `THM-B-01` — jedna osiągalna klauzula `undefined` wystarcza do nieograniczonej ekspresywności

**Ustawienie.** Kodeks `C` = skończony zbiór norm. `⟦g⟧_{Γ,F} ∈ {tt, ff, ⊥_UB}` — denotacja guarda.
*Uzupełnieniem* `ν` nazywam totalną funkcję przypisującą każdej pozycji `⊥_UB` wartość właściwego typu.
Relacja wyprowadzalności: `C, ν ⊢ F ⇒ j`.
**Rozstrzygnięcie dopuszczalne:** `j` takie, że `∃ν. C, ν ⊢ F ⇒ j`.

**Przesłanki.**
- **(P1) Brak meta-ograniczenia.** Pozycje `⊥_UB` nie są niczym w `C` związane. To jest *definicja* `undefined`:
  gdyby system wiązał je choćby przedziałem („rozsądny = 14..30 dni”), byłyby `implementation_defined`, nie `undefined`.
- **(P2) Osiągalność i dominacja.** Istnieje ścieżka wyprowadzenia z `F` przechodząca przez pozycję `⊥_UB`,
  której wartość steruje rozgałęzieniem między co najmniej dwoma różnymi `j`.
- **(P3) Kryterium akceptacji sądu to spójność z `C`**, a nie wyprowadzalność bez uzupełnień
  (sąd sprawdza, czy rozstrzygnięcie *da się* uzasadnić, nie czy jest jedyne).

**Teza.** Przy (P1)–(P3) dla binarnego guarda `⊥_UB` dominującego rozgałęzienie: **oba** `j` są dopuszczalne.
Dla guarda o wartości w `ℝ⁺` (typowe: próg czasu, próg „rażącości”, próg „istotności”) rodzina uzupełnień
jest nieskończona, a zbiór dopuszczalnych `j` obejmuje **cały osiągalny obraz funkcji efektu**.

**Szkic dowodu.** Z (P1): zbiór uzupełnień `N = ∏ (typy pozycji UB)` jest pełnym produktem, bez ograniczeń.
Dla każdego `j` w obrazie rozgałęzienia z (P2) wybierz `ν_j` ustawiające guard tak, by ścieżka prowadziła do `j`;
`ν_j ∈ N` z (P1). Zatem `C, ν_j ⊢ F ⇒ j`, więc `j` dopuszczalne z (P3). ∎
Indukcyjnie dla `k` niezależnych binarnych pozycji UB otrzymujemy do `2^k` dopuszczalnych wyników;
dla pozycji o wartości rzeczywistej — obraz ciągły.

**Wniosek `THM-B-01.1` (zerowa informacyjność).** Niech `I(C; j | F)` = informacja wzajemna, jaką tekst `C`
niesie o wyniku przy danym `F`. Dla `F` osiągających UB: rozkład dopuszczalnych `j` jest jednostajny na całym
obrazie, więc `I(C; j | F) = 0` bitów. **Kodeks jest w tym obszarze maksymalnie ekspresywny i minimalnie informacyjny.**
To nie jest narzekanie na nieprecyzyjność — to twierdzenie o pojemności kanału: kanał o pełnej ekspresywności
ma zerową przepustowość jako *predyktor*.

**Wniosek `THM-B-01.2` (UB działa wstecz — *time-travel UB*).** W C `undefined behavior` nie oznacza
„dowolna wartość w tym punkcie”, tylko „program nie ma semantyki”, co licencjonuje kompilator do **usuwania
ograniczeń położonych wcześniej** (klasyka: eliminacja null-checka, który następuje po dereferencji, bo
dereferencja „dowodzi” niepustości). Przeniesienie zachowania: przyjęcie w `S5` wykładni `X` dla klauzuli
generalnej licencjonuje przekwalifikowanie ustaleń z `S2` („skoro klauzula znaczy `X`, dowód na `Y` nigdy nie
był istotny”), czyli **wsteczne skasowanie ograniczenia**, nie tylko niedeterminizm w przód.
To jest formalna treść `retroactive_relativization`.

**Gdzie analogia się kończy (obowiązkowo).** W C licencja na UB jest udzielona przez **spisany standard**
i zinwentaryzowana (ISO/IEC 9899, Annex J.2 wylicza pozycje UB). W kodeksie licencja wynika z **braku**
zapisu, więc nie ma Annexu J. Ta różnica jest źródłem `NN-B-08`: nie żądam usunięcia UB (jest nieusuwalne
i pełni funkcję adaptacyjną), żądam **inwentarza**.

**Warunek falsyfikacji.** Pokazać kodeks, w którym klauzula generalna jest związana operacyjnym testem
(procedura decyzyjna albo przedział), i wykazać, że sąd nie może wyjść poza to związanie bez naruszenia
kryterium akceptacji. Wtedy klauzula jest `implementation_defined`, a `THM-B-01` do niej nie stosuje się.

---

### `THM-B-02` — specyfikacja jest zdefiniowana jako wyjście oracle'a, więc twierdzenia o poprawności są wakacyjne (`saint_dependency`)

**Przesłanki.**
- **(P1)** Nie istnieje druga niezależna, zgodna implementacja tej samej sprawy: dwa sądy nigdy nie rozpoznają
  *tego samego* stanu faktycznego w *tym samym* stanie Γ (drugi zna pierwszy). Brak **differential testing**.
- **(P2)** Nie istnieje conformance suite: nie ma zbioru par (stan faktyczny, oczekiwane orzeczenie) uznanego
  za wiążący test poprawności niezależnie od orzeczeń.
- **(P3)** Kryterium poprawności orzeczenia w obrocie brzmi: *nieuchylone przez instancję wyższą*.
  Dla instancji najwyższej ono degeneruje do `true`.

**Teza.** `Spec(c) ≜ Oracle(c)`. Wobec tego zdanie `∀c. Oracle(c) = Spec(c)` jest tautologią, jego treść
informacyjna wynosi 0 bitów, a każda „weryfikacja systemu wobec specyfikacji” jest **wakacyjna** (vacuous truth).

**Szkic dowodu.** Weryfikacja niesie informację tylko wtedy, gdy istnieje behavior wykluczany przez `Spec`.
Z (P1)+(P2) nie ma niezależnego opisu `Spec`, więc jedyną dostępną definicją jest `Spec := Oracle`.
Z (P3) zbiór behaviorów wykluczanych przez `Spec` na szczycie hierarchii jest pusty. Zbiór pusty wykluczonych
behaviorów ⇒ `log₂(|B_all| / |B_spec|) = log₂ 1 = 0` bitów. ∎

**Konsekwencja dla `Saint`.** Cały dowód poprawności systemu ma kształt `Saint_correct ⊢ System_correct`.
`Saint` to interfejs (`PRIM-B-17`). W runtime jest podstawiona klasa `HumanJudge`, która interfejs
**deklaruje**, ale nie ma testu zgodności (P2). Gdy `Saint` jest omylny z częstością `ε > 0` na decyzję:

- naiwna degradacja przy `k` zależnych decyzjach: `1 − (1−ε)^k`;
- **ale to nie jest właściwa konsekwencja.** Właściwa jest ostrzejsza: skoro `Spec := Oracle`, to błąd oracle'a
  **z definicji nie jest błędem**. `ε` nie jest mierzalne wewnątrz systemu. Degradacja nie jest „duża” —
  jest **nieokreślona**, bo brak miary.

**Odzyskanie treści.** Żeby `Spec` niosła informację, musi być niezależna od `Oracle`.
Aksjomat wejściowy protokołu (podmiot zindywiduowany jest lepiej określony niż uśrednienie instytucjonalne)
daje jedyne dostępne w tym modelu źródło niezależnej `Spec`: **per-podmiotową macierz wartości**.
To rozbija architekturę jednego oracle'a: `Spec` staje się rodziną `Spec_p` indeksowaną podmiotem,
a poprawność — relacją, nie predykatem. Model tego nie „proponuje jako lepszego”; stwierdza, że jest to
jedyna konstrukcja przywracająca niezerową treść informacyjną twierdzeń o poprawności.

**Warunek falsyfikacji.** Wskazać istniejący, wiążący conformance suite dla orzekania — zbiór spraw
z rozstrzygnięciami uznanymi za poprawne **niezależnie od tego, jak orzekłby sąd** — i pokazać, że jest
używany do stwierdzania błędu orzeczenia. Wtedy (P2) upada i `Spec ≠ Oracle`.

---

### `THM-B-03` — nakaz totalności + niezupełność kodeksu ⇒ **wymuszone** rozszerzenie niesoundowe

**Przesłanki.**
- **(P1) Nakaz totalności.** Ustrój zakazuje *non liquet* / odmowy wymiaru sprawiedliwości:
  `decide : Case → Judgment` musi być funkcją **totalną**.
- **(P2) Częściowość wyprowadzania.** `derive : Case ⇀ Judgment` — funkcja częściowa dana przez kodeks —
  ma `dom(derive) ⊊ Case`. Dwa niezależne źródła częściowości:
  (a) **brak wyprowadzenia**: predykaty typu „czy X chciał Y” nie są nawet półrozstrzygalne z rzutu `π(World)`;
  (b) **nadmiar wyprowadzeń**: kolizja symboli bez rozstrzygającej meta-reguły (`THM-B-05`) — wtedy `derive`
      nie jest funkcją, więc nie jest funkcją częściową w sensie potrzebnym do rozszerzenia.

**Teza.** Każde totalne rozszerzenie `decide ⊇ derive` definiuje wartości poza `dom(derive)`.
Te wartości **nie są uzasadnione kodeksem**. Zatem: *soundness* i *totality* są **łącznie niespełnialne**
dla niezupełnego kodeksu. Nie ma trzeciej opcji.

**Szkic dowodu.** Argument dziedzinowy, nie Gödlowski, więc tani i mocny: `Case \ dom(derive) ≠ ∅` (P2).
`decide` jest totalna (P1), więc dla `c ∈ Case \ dom(derive)` przypisuje jakieś `j`.
*Soundness* = `∀c. decide(c) = j ⇒ C ⊢ c ⇒ j`. Dla naszego `c` prawa strona jest fałszywa z definicji `dom`.
Zatem `¬soundness`. ∎

**Wniosek.** `majesty_switch` **nie jest patologią osobowościową sędziego ani nadużyciem**.
Jest to **wymagana przez ustrój** funkcja totalizująca. Model nazywa ją:

```
totalize : (Case ⇀ Judgment) → (Case → Judgment)
totalize(f)(c) = case f(c) of Just j → j ; Nothing → unsafeCoerce(⟨autorytet⟩)
```

**Predykat wyzwalania (jawny, testowalny):**

```
majesty_trigger(σ) ≜
     gas_remaining(σ) ≤ g_min                                        -- budżet weryfikacji wyczerpany
  ∧ ¬∃d. derivable(Γ_σ, facts_σ, d) ∧ cost(d) ≤ gas_remaining(σ)     -- brak dowodu w budżecie
  ∧ deadline_pressure(σ) ≥ θ_d                                       -- presja terminu / sprawozdawczości
  ∧ cost_reputational(non_liquet) > cost_reputational(unproved_ruling)
```

Ostatni koniunkt jest sednem: majestat odpala nie wtedy, gdy sędzia jest zły, tylko wtedy, gdy **rozstrzygnięcie
nieudowodnione jest tańsze reputacyjnie niż jawne przyznanie się do braku rozstrzygnięcia**.
Ustrój ustawił ten koszt na nieskończoność (zakaz *non liquet*), więc koniunkt jest spełniony **zawsze**.

**Warunek falsyfikacji.** Pokazać system prawny, w którym `NON_LIQUET` jest reprezentowalną, liczoną
i apelowalną wartością wyniku, i zmierzyć jego częstość > 0. Wtedy (P1) nie zachodzi i teza nie stosuje się.
(Historycznie: rzymskie *non liquet* i szkockie *not proven* są dokładnie takimi konstruktorami —
model przewiduje, że w systemach je posiadających gęstość `assume` jest niższa. To jest hipoteza `EMPIRICAL`.)

---

### `THM-B-04` — `majesty_switch` jest rzutowaniem **bez etykiety blame** i jest **nieobserwowalne**, więc pozycja orzekającego jest niepodważalna z definicji

**Tło formalne.** W *blame calculus* (Wadler–Findler) rzutowanie ma etykietę: `⟨T ⇐ S⟩^ℓ e`.
Twierdzenie o blame: *well-typed programs can't be blamed* — winę zawsze ponosi strona **mniej precyzyjnie
otypowana**. To twierdzenie jest jedynym powodem, dla którego gradual typing nadaje się do użytku:
gwarantuje, że awaria ma **adresata**.

**Przesłanki.**
- **(P1)** Konstruktor `majesty` w drzewie wyprowadzenia nie ma pola `blame` (patrz `10-SPEC.md`, `Derivation`).
- **(P2) Erasure przy serializacji.** Uzasadnienie orzeczenia jest tekstem w słowniku norm.
  Funkcja obserwacji `obs : Derivation → Uzasadnienie` mapuje `assume` i `majesty` na frazy nieodróżnialne
  od kroków wyprowadzenia („w ocenie Sądu”, „Sąd dał wiarę”, „w okolicznościach sprawy”).

**Teza (dwuczęściowa).**
1. **Blame nie da się przypisać.** Twierdzenie o blame nie jest *naruszone* — jest **niewypowiadalne**:
   jego konkluzja kwantyfikuje po etykietach `ℓ`, a etykiety nie ma. Awaria nie ma adresata jako **typ**,
   nie jako fakt socjologiczny.
2. **Użycie majestatu jest nieobserwowalne.** Istnieją wyprowadzenia `d₁` (z `majesty`) i `d₂` (bez, w pełni
   wyprowadzone) takie, że `obs(d₁) = obs(d₂)`.

**Szkic dowodu (2).** Konstrukcja. Weź sprawę z guardem `undefined` (`THM-B-01`) i dwa wyprowadzenia:
`d₂` używa `applyNorm` z uzupełnieniem `ν` dającym wynik `j`; `d₁` używa `majesty` dającego to samo `j`.
`obs` renderuje oba jako: *„Sąd uznał, że termin nie był rozsądny, i na podstawie art. X zasądził j.”*
Zdanie „Sąd uznał” jest ważnym renderem **obu** konstruktorów. Zatem `obs(d₁) = obs(d₂)`. ∎

**Wniosek (dokładnie ta konstrukcja, która czyni pozycję niepodważalną).**
Podważenie orzeczenia wymaga wskazania kroku, który nie ma uzasadnienia. Skoro `obs` jest **nieinjektywna**
i skleja krok uzasadniony z nieuzasadnionym, to zbiór podważalnych orzeczeń jest pusty względem tego kryterium.
Pozostaje kryterium z `THM-B-02(P3)`: *nieuchylone przez instancję wyższą* — czyli reputacyjne, nie dowodowe.
**Nieobserwowalność nie jest ubocznym skutkiem; jest warunkiem koniecznym trwałości konstrukcji z `THM-B-03`:**
gdyby `majesty` był widoczny, każde jego użycie byłoby jawnym przyznaniem, że ustrój wymaga niesoundowości.

**Warunek falsyfikacji.** Wskazać w praktyce orzeczniczej **wymagany** znacznik odróżniający „ustalone dowodowo”
od „przyjęte mocą urzędu” i pokazać, że jego brak jest podstawą uchylenia. Wtedy `obs` staje się injektywna
na tej parze i teza (2) upada. (`NN-B-02` żąda dokładnie tego znacznika.)

---

### `THM-B-05` — reguły derogacyjne nie tworzą porządku częściowego, więc linkowanie norm jest wyborem oracle'a, a wykrycie kolizji jest coNP-trudne (`systemic_blindness`)

**Ustawienie.** Normy są symbolami w płaskiej globalnej przestrzeni nazw. Rozstrzyganie kolizji odbywa się
trzema regułami: `lex superior` (ranga), `lex posterior` (czas), `lex specialis` (zakres guarda).

**Teza (a) — brak porządku.** Relacja `≺` generowana przez te trzy reguły **nie jest antysymetryczna**.
**Kontrprzykład konstrukcyjny.** `N₁`: wcześniejsza, szczególna, ranga r. `N₂`: późniejsza, ogólna, ranga r.
`lex posterior` daje `N₁ ≺ N₂`. `lex specialis` daje `N₂ ≺ N₁`. Rangi równe, więc `lex superior` milczy.
Brak meta-reguły o stałym priorytecie między `posterior` a `specialis` (w systemach kontynentalnych jest to
przedmiot doktryny, nie normy pozytywnej — `ASSUMPTION-B-02`). Zatem `N₁ ≺ N₂ ∧ N₂ ≺ N₁ ∧ N₁ ≠ N₂`. ∎
Konsekwencja: brak elementu minimalnego ⇒ rozstrzygnięcie kolizji jest **funkcją wyboru**, czyli oracle'em,
czyli kolejnym wejściem dla `THM-B-01`.

**Teza (b) — niewykrywalność.** Sprawdzenie, czy dwie normy kolidują, to sprawdzenie, czy ich guardy są
**łącznie spełnialne** przy różnych efektach: `SAT(g₁ ∧ g₂) ∧ effect₁ ⊥ effect₂`. Dla guardów w logice
zdaniowej z predykatami: problem „czy kodeks jest bezkolizyjny” = `∀ par. ¬SAT(...)` — **coNP-trudny**.
Złożoność praktyczna: `Θ(n²)` wywołań SAT dla korpusu `n` norm.

**Rząd wielkości** [EST]: korpus polskich przepisów w mocy — `10⁴–10⁵` jednostek redakcyjnych →
`10⁸–10¹⁰` par. Przy `10⁻³ s` na wywołanie SAT (a guardy prawnicze **nie są** w logice zdaniowej, więc to
optymistyczne o rzędy) daje `10⁵–10⁷ s` = `10⁰–10²` lat CPU. **Nikt tego nie liczy, bo guardy nie istnieją
w formie maszynowej.** Praktyczny budżet wydany na link-check korpusu: `0`.

**Wniosek — `systemic_blindness` jako twierdzenie, nie jako oskarżenie.** System nie „nie chce” widzieć kolizji.
System nie ma **reprezentacji**, w której kolizja jest wyrażalna: guardy są prozą, nie termami.
Obserwacja kolizji wymagałaby uprzedniej formalizacji korpusu, a formalizacja ujawniłaby `THM-B-01`
(ile pozycji UB jest w kodeksie) i `THM-B-05a` (ile par jest nierozstrzygalnych) — czyli podważyłaby
przesłankę legitymizacyjną „prawo jest poznawalne z tekstu”. Ślepota jest **konstytutywna**: warunkiem
zachowania przesłanki, nie skutkiem zaniedbania.

**Warunek falsyfikacji.** Wskazać jurysdykcję z maszynowo reprezentowanymi guardami i uruchamianym
link-checkiem korpusu, publikującym listę kolizji. Wtedy blindness nie jest konstytutywna, tylko techniczna.

---

## 5. Mapowanie `S0..S8` na fazy potoku kompilacji

| `S` | Etap prawny | Faza kompilatora | Niezmiennik fazy `I_i` | Czy jest fail-fast? |
|-----|---|---|---|---|
| `S0` | zdarzenie / szkoda | wykonanie programu **poza** obserwowalnością; `World` | — | n/d |
| `S1` | pisma, kwalifikacja | **lexing + parsing + name resolution**: pozew → AST; kwalifikacja = wybór przestrzeni nazw | `I₁`: żądanie sparsowane, well-typed, symbole rozwiązane | częściowo (braki formalne → zwrot) |
| `S2` | postępowanie dowodowe | **type checking + elaboration**: uzupełnienie dziur w AST świadkami (`Evidence`) | `I₂`: każdy istotny `FactKey` ma świadka | **nie** — patrz `THM-B-07` |
| `S3` | wnioski, prekluzja | **przepisy o przepływie + GC roszczeń**; prekluzja = **zamrożenie AST** | `I₃`: zbiór świadków zamknięty | nie |
| `S4` | rozprawa | **przebiegi optymalizujące** sterowane przez `Advocate` | `I₄`: wybrany zbiór norm-kandydatów | nie |
| `S5` | wyrok | **codegen + commit**; totalizacja (`THM-B-03`) | `I₅`: `Judgment` dobrze uformowany | n/d (commit) |
| `S6` | apelacja, kasacja | **rerun późnych faz na tym samym AST**; kasacja = rerun samego codegenu | `I₆`: brak nowych wejść | nie |
| `S7` | egzekucja | **efekty uboczne w świecie**; brak rollbacku dla efektów nieodwracalnych | `I₇`: efekt ⊆ zadeklarowany typ efektu | nie |
| `S8` | precedens | **migracja semantyki wstecz**; zapis do `PrecedentCache` bez `deps` | `I₈`: — (brak) | n/d |

**Etap własny:** `Sx-B-LINK` — rozwiązanie kolizji symboli. W potoku kompilatora to osobna faza (linker)
z twardym błędem *duplicate symbol*. W procedurze prawnej **nie ma odpowiadającej fazy**: kolizja jest
rozstrzygana implicite wewnątrz `S4`/`S5`, przez tego samego aktora, który wybiera wynik.
Brak separacji linkera od codegenu to `FAIL-B-04`.

---

## 6. Mapowanie zjawisk obowiązkowych (§2 protokołu) na konstrukty modelu

| Klucz §2 | Konstrukt w tym modelu | Adres |
|---|---|---|
| `force_gas` | `VGas` — budżet weryfikacji; przy wyczerpaniu przejście `Search → Assume → Majesty` | `RES-B-01`, `ALG-B-01`, `THM-B-14` |
| `majesty_switch` | `unsafeCoerce` bez etykiety blame, jako **wymuszona** funkcja totalizująca | `THM-B-03`, `THM-B-04`, `ALG-B-02` |
| `reputation_coupling` | podmiana funkcji celu: `fit` → `fit − λ·P(uchylenie)`; poprawność = punkt stały hierarchii | `THM-B-13`, `LOOP-B-02` |
| `retroactive_relativization` | *time-travel UB* + precedens jako **niewersjonowana** zmiana łamiąca | `THM-B-01.2`, `THM-B-15` |
| `onto_epistemic_drift` | erasure funktor `E : Evidence → Claim` gubi `Dec`; zanik rozróżnienia `Prop` / `Bool` | `THM-B-12`, `LOOP-B-06` |
| `stage_corruption` | naruszenie `I₂` przy braku fail-fast; najsilniejszy warunek końcowy potoku = `true` | `THM-B-07`, `THM-B-08` |
| `systemic_blindness` | brak reprezentacji, w której kolizja/UB/`assume` są wyrażalne; coNP-trudność | `THM-B-05`, `THM-B-02`, `THM-B-04` |
| `saint_dependency` | `Saint` jako interfejs bez implementacji; `Spec := Oracle` ⇒ wakacyjność | `THM-B-02`, `NN-B-07` |

---

## 7. Granice tej soczewki (deklarowane, nie ukrywane)

1. **Nie modeluję dobrostanu stron.** Model mówi o wyprowadzalności i obserwowalności, nie o krzywdzie.
   Zdanie „orzeczenie było niesprawiedliwe” nie jest w tym modelu wyrażalne; wyrażalne jest
   „orzeczenie nie było wyprowadzalne i nie da się tego stwierdzić z akt”.
2. **Nie modeluję intencji aktorów** poza funkcją celu `Advocate` i sprzężeniem reputacyjnym.
3. **Analogia kompilatorowa przenosi zachowanie w czterech miejscach i tylko tam**: (a) UB → nieograniczona
   ekspresywność i wsteczne kasowanie ograniczeń; (b) blame → adresowalność awarii; (c) kompozycja trójek
   Hoare'a → propagacja skażenia fazy; (d) memoizacja → utrata referential transparency.
   Wszędzie indziej, gdzie użyłem słownictwa kompilatorowego, oznaczyłem to jako nazwę, nie jako argument.
4. **`THM-B-10` (`20-DYNAMICS.md`) jawnie **zrywa** analogię** z abstrakcyjną interpretacją: `res judicata`
   nie jest widening, tylko truncation. Zerwanie analogii jest tam wynikiem, nie potknięciem.

---

*Agent B · tor I · `00-MODEL.md`*
