# AGENT B · `20-DYNAMICS.md` — dynamika (tor I)

Pętle sprzężeń, znak, wzmocnienie, opóźnienie, warunek rozbiegania, atraktory degeneracji.
Plus cztery twierdzenia o dynamice: memoizacja (`THM-B-09`), `res judicata` (`THM-B-10`),
terminowanie (`THM-B-11`), erasure rozstrzygalności (`THM-B-12`), sprzężenie reputacyjne (`THM-B-13`),
niewersjonowana zmiana łamiąca (`THM-B-15`).

**Konwencja wzmocnienia.** Wzmocnienie pętli `g` podaję jako bezwymiarowy współczynnik: o ile zmienia się
zmienna sterowana po jednym pełnym obiegu, przy jednostkowym zaburzeniu. `g > 1` ⇒ rozbieganie.
Wszystkie wartości `g` to `[EST]` — nie mam danych, mam rzędy wielkości i kierunek znaku.
Kierunek znaku jest wnioskiem z modelu i **jest falsyfikowalny**; wartość `g` jest zgadywana.

---

## 1. Twierdzenia o dynamice

### `THM-B-09` — precedens jest memoizacją bez inwalidacji, więc niszczy referential transparency; a przy okazji staje się **jedynym** nośnikiem semantyki

**Ustawienie.** `eval : (Γ, F) → J`. Precedens instaluje wpis `cache[h_Γ(F)] ↦ J`.
Funkcja klucza `h_Γ : FactState → HoldingKey` to ekstrakcja „istotnych okoliczności” — **stratna**
i, co gorsza, **zależna od Γ** (sąd cytujący decyduje, co było holdingiem, a nie sąd cytowany).

**Teza (a) — utrata referential transparency.** `eval` nie jest funkcją swoich argumentów;
jest funkcją historii wywołań. **Kontrprzykład (jednolinijkowy, ale to wystarcza):**
weź `F` identyczne co do atomów, złożone w `t₁ < t₂`. Między `t₁` a `t₂` zapada orzeczenie `P`
z `h(F) = k`. Wtedy `eval(Γ_{t₁}, F) = j₁`, `eval(Γ_{t₂}, F) = j₂`, `j₁ ≠ j₂`, przy `F` niezmienionym. ∎
Referential transparency wymaga `eval(F) = eval(F)` w każdym kontekście. Nie zachodzi.

**Teza (b) — brak inwalidacji.** `PrecedentEntry` nie ma pola `deps: Set<NormVersion>` (`10-SPEC.md` §1.5).
Bez `deps` inwalidacja po nowelizacji wymaga **pełnego skanu cache**:
`Θ(|cache|)` na nowelizację. [EST] `|cache| ≈ 10⁵–10⁶` opublikowanych orzeczeń;
tempo nowelizacji `≈ 10³` jednostek redakcyjnych/rok → `10⁸–10⁹` porównań/rok,
wykonywanych ręcznie przez ludzi. Faktycznie wykonywane: `~0`.
Z `deps` byłoby `Θ(|affected|)` ≈ `10¹–10³`. **To zmiana klasy złożoności utrzymania, nie usprawnienie.**

**Teza (c) — cache jest nośnikiem semantyki, tekst jest dekoracją.** Skoro:
(i) klauzule `undefined` nie mają denotacji w tekście (`THM-B-01`);
(ii) jedyne, co je wiąże, to wcześniejsze orzeczenia;
(iii) cache nie ma schematu, wersjonowania ani eviction —
to **denotacja kodeksu żyje w memo-tablicy bez kontraktu**. Prognozowanie wyniku z tekstu ustawy jest
w tym obszarze niemożliwe z definicji; prognozowanie z cache jest możliwe, ale cache nie ma gwarancji
spójności ani kompletności. Stąd zawód-pośrednik nie jest rentą, tylko **koniecznym runtime'em**.

**Falsyfikacja (a)+(c).** Zmierzyć: udział spraw, w których wynik da się przewidzieć z samego tekstu
przepisów z trafnością istotnie wyższą niż z tekstu + linii orzeczniczej. Jeżeli tekst sam wystarcza —
(c) upada.

---

### `THM-B-15` — precedens jest zmianą łamiącą **bez podbicia wersji**, niewykrywalną żadnym diffem tekstu

**Ustawienie semver.** Nowelizacja = bump wersji. Ale w tym systemie **nie ma pinowania w miejscu wywołania**:
umowa zawarta pod `v1` jest wykonywana pod `v_now`. Odpowiednik lockfile: reguły intertemporalne — ręczny shim.
Odpowiednik deprecation window: *vacatio legis*. [EST] domyślnie 14 dni w PL, przy korpusie, którego
zawodowiec nie zdąży ponownie zweryfikować w 14 dni (`THM-B-05b`: koszt link-checku).

**Teza.** Zmiana semantyki przez `S8` jest **gorszą klasą zmiany łamiącej niż nowelizacja**, bo:
1. nie ma bumpa wersji (tekst pozostaje bajt-w-bajt identyczny);
2. `lex retro non agit` **nie chroni**, bo formalnie nic się nie zmieniło — zmieniła się wykładnia,
   a wykładnia jest traktowana jako „odczytanie tego, co zawsze było w tekście”;
3. **żaden diff tekstowy jej nie wykryje**, więc żadne narzędzie automatyczne jej nie zgłosi.

**Szkic dowodu (3).** Niech `T_t` = tekst korpusu w chwili `t`. Zmiana precedensowa spełnia `T_{t₁} = T_{t₂}`
przy `⟦T⟧_{t₁} ≠ ⟦T⟧_{t₂}`. Każde narzędzie działające na `T` jest funkcją `T`, więc zwraca to samo
dla `t₁` i `t₂`. Zatem wykrycie wymaga narzędzia działającego na `⟦·⟧`, czyli na cache — a cache
nie ma schematu (`THM-B-09c`). ∎

**To jest formalna treść `retroactive_relativization`:** system przepisuje semantykę przeszłych stanów
i robi to w reprezentacji, która z założenia nie jest wersjonowana, więc przepisanie jest **niewidoczne**
dla każdego obserwatora czytającego źródło.

**Falsyfikacja.** Wskazać mechanizm nadawania numeru wersji linii orzeczniczej, wiążący i cytowany
(np. „wykładnia art. X, rewizja 3, od 2024-01-01”), oraz narzędzie sygnalizujące zmianę rewizji.
Wtedy zmiana przestaje być cicha.

---

### `THM-B-10` — `res judicata` **nie jest** widening; jest truncation (miejsce, w którym analogia kompilatorowa się łamie — i to jest wynik)

**Tło.** W abstrakcyjnej interpretacji, gdy krata ma nieskończone łańcuchy rosnące, terminowanie wymusza
operator poszerzania `∇` spełniający: (i) `x ⊑ x∇y` i `y ⊑ x∇y` (**nadaproksymacja**);
(ii) każdy łańcuch poszerzany stabilizuje się w skończonej liczbie kroków.
Kluczowa własność: analizator z `∇` jest **niedokładny, ale sound**: `γ(wynik) ⊇ zachowania_konkretne`.

**Kuszące mapowanie.** `res judicata` / przedawnienie / prekluzja = `∇`: wymuszają terminowanie iteracji
przez utratę precyzji. Kuszące i **fałszywe**.

**Teza.** `res judicata` spełnia (ii), ale **nie spełnia (i)**, bo warunek (i) jest zdefiniowany względem
konkretyzacji `γ`, a `γ` jest tu zdefiniowane przez oracle (`THM-B-02`). Nie ma niezależnego `γ`,
więc zdanie „wynik nadaproksymuje prawdę” jest wakacyjne. Zatem `res judicata` jest **truncation**:
wymusza terminowanie **bez żadnej gwarancji na relację wyniku do stanu konkretnego**.

**Szkic dowodu.** Soundness `∇` to twierdzenie `∀c ∈ γ(x). c ∈ γ(x∇y)` — sprawdzalne, bo `γ` jest podane
niezależnie od analizatora. Tu `γ ≜ Oracle`, więc twierdzenie brzmi `∀c ∈ Oracle(x). c ∈ Oracle(x∇y)`,
co jest prawdą wtedy i tylko wtedy, gdy oracle tak orzeknie — czyli jest zdaniem o oracle'u,
nie o operatorze. Brak treści. ∎

**Dlaczego to jest ważne, a nie pedantyczne.** Różnica behawioralna: analizator z prawdziwym `∇`
odpowiada „nie wiem, ale na pewno nie gorzej niż X” — użyteczna informacja przy nieznanej precyzji.
Truncation odpowiada „X”, bez żadnego „nie gorzej niż”. **Prawomocność daje ostateczność, nie daje
ani poprawności, ani jej ograniczenia z żadnej strony.** Wniosek dla projektu instytucji: prawomocność
byłaby `∇`, gdyby orzeczenie niosło jawny przedział ufności („ustalono z materiałem niepełnym w zakresie K”).
Nie niesie. `NN-B-01` i `NN-B-02` są dokładnie żądaniem, żeby niosło.

---

### `THM-B-11` — brak miary terminującej: „czy ta sprawa się skończy” jest własnością budżetów stron, nie meritum

**Ustawienie.** Procedura jako system przepisywania termów z regułami:
`S5 → S6` (zaskarżenie), `S6 → S2` (uchylenie z przekazaniem do ponownego rozpoznania), `S6 → S5'` (zmiana),
`S5' → S6'` (kolejna instancja / skarga).

**Teza.** Nie istnieje dobrze ufundowana miara `μ` malejąca przy każdej regule, więc system nie jest
terminujący **z reguł**. Terminowanie jest wymuszane **zewnętrznie**, wyczerpaniem zasobu.

**Szkic dowodu.** Kandydaci na `μ`:
- `μ₁ = instancja` — rośnie przy `S5 → S6`, **resetuje się** przy `S6 → S2`. Nie maleje leksykograficznie.
- `μ₂ = liczba spornych kwestii` — uchylenie może **zwiększyć** ich liczbę (sąd wyższy wskazuje nowe).
- `μ₃ = czas / koszt` — maleje monotonicznie tylko jako **zasób**, ale nie występuje w warunku
  zatrzymania reguł prawnych. To jest cała pointa: `μ₃` jest jedyną wielkością malejącą,
  i jest **poza** systemem norm.
Brak `μ` ⇒ możliwy cykl `S5 → S6 → S2 → … → S5`. Liczba cykli nie jest ograniczona normą (`ASSUMPTION-B-03`:
jurysdykcje bez twardego limitu ponownych rozpoznań; są wyjątki, i tam teza słabnie). ∎

**Wniosek.** Odpowiedź na „czy ta sprawa się kiedykolwiek skończy” jest rozstrzygalna **wyłącznie
względem modelu zasobów**: kończy się, gdy `min(budżet_powoda, budżet_pozwanego, oczekiwana_długość_życia,
termin_przedawnienia)` się wyczerpie. To nie jest problem stopu w sensie Turinga (nie ma tu
nierozstrzygalności obliczeniowej) — jest **gorzej**: warunek stopu jest dobrze określony, ale
zależy od zmiennej, która nie ma nic wspólnego z rozpoznawanym sporem.

**Powiązanie z `THM-B-07`.** Ponowne rozpoznanie to niezależne losowanie z tym samym `p` skażenia.
Ponieważ kryterium zakończenia to „nie zaskarżono”, a nie „`I₂` zachodzi”, **proces nie ma punktu stałego
w przestrzeni poprawności**; ma punkt stały w przestrzeni budżetów. Formalnie: to nie jest iteracja
zbieżna do punktu stałego funkcji poprawiającej, tylko błądzenie z absorbującą barierą przy zerowym budżecie.

**Falsyfikacja.** Wskazać jurysdykcję z twardym limitem cykli uchyleniowych i pokazać, że limit jest
osiągany, a nie omijany. Wtedy `μ = (limit − cykle)` jest miarą terminującą i teza upada.

---

### `THM-B-12` — `onto_epistemic_drift` jako zanik rozróżnienia `Prop` / `Bool`; skutek: system nie może zostać zrefutowany przez świat

**Ustawienie w języku teorii typów.** W systemie zależnym rozróżniamy:
- `Bool` — nośnik **rozstrzygalności**; istnieje `decide : (b : Bool) → Dec (T b)`, więc istnieje refutacja;
- `Prop` — zdanie; dowodzone termem, może być nierozstrzygalne, refutacja nie zawsze dostępna.

Prawo type-checkuje oba przez **jeden** sąd: `ustalenie faktyczne`, którego reguła wprowadzania brzmi
`Claim ⊢ ustalenie` i **nie rozróżnia**, czy `Claim` pochodzi z pomiaru (`Dec`) czy z opinii (`Weight`).

**Formalizacja.** Funktor erasure `E : Evidence → Claim` (`10-SPEC.md` §1.2), `admit`.
`E` nie jest injektywny: `E(measurement m) = E(expertOpinion o)` gdy oba twierdzą to samo z tą samą wagą.
Zatem `E` nie ma lewego odwrotu; `Dec` jest **nieodzyskiwalne** po `admit`.

**Teza.** Po erasure jedyną dostępną formą refutacji jest **inny `Claim`**. Refutacja staje się
**symetryczna z asercją** (oba są `Claim`ami ważonymi przez ten sam oracle), więc znika asymetria
Popperowska. System nie może zostać **zaskoczony przez świat**: świat wchodzi wyłącznie przez `admit`,
który zdejmuje z niego rozstrzygalność.

**Szkic dowodu.** Refutacja `Prop A` wymaga reguły eliminacji specyficznej dla konstruktora `A`.
Po `E` konstruktora nie ma (wymazany), więc dostępna jest tylko reguła generyczna dla `Claim`:
porównanie wag. Porównanie wag jest relacją totalną i symetryczną co do roli argumentów, więc
`refutuje(x, y)` i `refutuje(y, x)` mają ten sam kształt. Brak asymetrii ⇒ brak refutacji w sensie
mocnym (takiej, która **wymusza** odrzucenie). ∎

**Konkretny mechanizm, obserwowalny.** Wynik pomiaru wchodzi jako *opinia biegłego*: **ważony**,
podważalny inną opinią. Nie wchodzi jako `Dec`, którego jedyną odpowiedzią jest **powtórzenie pomiaru**.
Metryka proxy `M-B-01`: udział sporów o fakt techniczny rozstrzygniętych **powtórzeniem pomiaru**
w stosunku do rozstrzygniętych **trzecią opinią / wyborem sądu**. [EST] rząd `10⁻¹` lub niżej.
Prognoza modelu: monotoniczny spadek w czasie (`LOOP-B-06`).

**Dryf u samych prawników (mechanizm indywidualny, nie instytucjonalny).** Osoba operująca latami
w trybie, w którym **każde** twierdzenie jest ważone i kontrowalne, traci — przez zwykłe uczenie się
rozkładu — rozróżnienie między zdaniem, dla którego istnieje procedura decyzyjna, a zdaniem, dla którego
istnieje tylko przekonywanie. Modelowo: prior nad typem twierdzenia kolapsuje do `Claim`.
Objaw diagnostyczny: traktowanie twierdzenia o zachowaniu maszyny albo o prawie fizyki jako **kwestii
wykładni** — czyli aplikowanie reguł eliminacji `Claim` do obiektu typu `Bool`.
To nie jest błąd inteligencji; to jest **poprawna adaptacja do systemu, w którym `Bool` nie występuje**.

**Falsyfikacja.** Wskazać instytucję proceduralną, w której wynik pomiaru o niepewności poniżej `τ`
**nie może** zostać przeważony opinią, tylko wyłącznie powtórnym pomiarem. Wtedy `Dec` przeżywa
i teza nie stosuje się. (`NN-B-05` żąda dokładnie tego.)

---

### `THM-B-13` — `reputation_coupling`: poprawność zdefiniowana jako punkt stały hierarchii

**Ustawienie.** Cel deklarowany orzekającego: `argmax_j fit(j, F, C)`.
Cel faktyczny: `argmax_j [ fit(j, F, C) − λ·P(uchylenie | j) − μ·P(szkoda_reputacyjna | j) ]`.

`P(uchylenie | j)` jest **proxy** dla `¬fit` tylko wtedy, gdy instancja wyższa jest poprawna.
Poprawność instancji wyższej jest orzekana tym samym kryterium — brakiem uchylenia przez jeszcze wyższą.

**Teza.** Relacja poprawności `Cor` domyka się w punkcie stałym:
`Cor(j) ⟺ ¬uchylone(j)`, a dla instancji szczytowej `¬uchylone ≡ true`, więc `Cor_szczyt ≡ true`.
Zatem **poprawność jest definicyjnie tożsama z przetrwaniem w hierarchii**, czyli z reputacją.
To nie jest metafora ani zarzut moralny — to jest bezpośredni wniosek z `THM-B-02` (brak `Spec ≠ Oracle`).

**Kiedy pętla się rozbiega.** Wzmocnienie: `g₂ = λ · ∂P(uchylenie)/∂(zgodność z linią) / ∂fit/∂j`.
Rozbieganie przy `g₂ > 1`, czyli gdy marginalny zysk z dopasowania do linii przewyższa marginalny zysk
z dopasowania do akt. Warunek jest tym łatwiej spełniony, im **słabiej obserwowalne jest `fit`** —
a `fit` jest nieobserwowalne z `THM-B-04` (erasure). **Nieobserwowalność `fit` jest więc przyczyną
rozbiegania, nie jego skutkiem.**

**Przeniesienie na pełnomocnika (drugi poziom sprzężenia).** Cel deklarowany: interes klienta.
Cel faktyczny: `argmax P(wygrana) − ν·P(szkoda_reputacyjna_u_sądu)`. Drugi człon jest sprzężeniem
z tym samym oracle'em, który orzeka. Skutek: **cel pełnomocnika i cel sądu są skorelowane przez
wspólny człon reputacyjny**, mimo że architektura zakłada ich niezależność (kontradyktoryjność).
To jest w systemach typów odpowiednik **shared mutable state między dwoma rzekomo czystymi passami**:
poprawność całości była dowodzona przy założeniu niezależności, które nie zachodzi.

**Falsyfikacja.** Zmierzyć: czy orzeczenia sędziów bliskich awansu różnią się systematycznie od orzeczeń
sędziów bez perspektywy awansu, przy kontroli rodzaju sprawy. Brak różnicy ⇒ `λ ≈ 0`, teza słabnie.

---

## 2. Katalog pętli

Format: znak · wzmocnienie `g` [EST] · opóźnienie · warunek rozbiegania · atraktor.

### `LOOP-B-01` — memoizacja precedensowa `(+)`

- **Ścieżka:** cache hit ↑ → koszt przeszukiwania ↓ → więcej cytowań tego samego holdingu →
  utrwalenie klucza `h` → cache hit ↑
- **`g₁ ≈ 1.2–2.0`** [EST]. Rozbieganie natychmiastowe, bo `g > 1` już przy umiarkowanym niedoborze gazu.
- **Opóźnienie:** czas do publikacji + czas do pierwszego cytowania, `10¹–10²` dni [EST].
- **Warunek rozbiegania:** `koszt(przeszukiwanie od zera) > koszt(cytowanie) · (1 + ryzyko uchylenia)`.
  Przy deficycie gazu `10⁰–10²` (`THM-B-14`) spełniony praktycznie zawsze.
- **Atraktor degeneracji:** *kodeks jako dekoracja* — wynik jest w pełni wyznaczony przez cache,
  tekst służy do renderowania uzasadnienia post hoc. Sygnatura obserwowalna: stosunek
  liczby cytowań orzeczeń do liczby cytowań przepisów w uzasadnieniach `> 1`.

### `LOOP-B-02` — sprzężenie reputacyjne `(+)` — `reputation_coupling`

- **Ścieżka:** unikanie uchylenia → dopasowanie do linii wyższej instancji → wariancja orzeczeń ↓ →
  mniej informacji o poprawności → uchyleń mniej → potwierdzenie, że system działa → silniejsze
  traktowanie „braku uchyleń” jako miary jakości → unikanie uchylenia ↑
- **`g₂ ≈ 1.1–1.6`** [EST]; patrz `THM-B-13`.
- **Opóźnienie:** cykl instancyjny, `10²–10³` dni [EST].
- **Atraktor:** *samopotwierdzająca się hierarchia*. Miara jakości mierzy zgodność wewnętrzną,
  a nie trafność. Rozpoznawalne po tym, że wskaźnik jakości poprawia się przy jednoczesnym
  wzroście czasu do prawomocności i wzroście udziału ugód „bo nie wiadomo, jak orzeknie”.

### `LOOP-B-03` — ekspansja UB `(+)`

- **Ścieżka:** klauzula generalna obniża koszt redakcyjny **teraz** → ustawodawca optymalizuje horyzont
  krótki → udział pozycji `undefined` w korpusie ↑ → więcej sporów o wykładnię → więcej presji na
  „elastyczność” → więcej klauzul generalnych
- **`g₃ ≈ 1.05–1.3`** [EST] na cykl legislacyjny.
- **Opóźnienie:** czas od uchwalenia do ustalenia linii, `10²–10³` dni [EST]. **Bardzo długie opóźnienie
  przy dodatnim znaku** — to jest kanoniczny warunek oscylacji o rosnącej amplitudzie: koszt jest płacony
  przez inną kadencję niż ta, która go zaciągnęła.
- **Atraktor:** *korpus o zerowej informacyjności predykcyjnej* (`THM-B-01.1`).
- **Zależy od `ASSUMPTION-B-01`** (intencjonalność klauzul). Jeśli klauzule są przypadkowe, znak pętli
  pozostaje `+`, ale `g₃` spada.

### `LOOP-B-04` — wzrost korpusu bez DCE `(+, z opóźnieniem)`

- **Ścieżka:** `n` ↑ → koszt link-checku `Θ(n²)` ↑ → check pomijany → kolizji więcej →
  więcej dyskrecjonalności → więcej precedensu → więcej materiału do cytowania → `n_efektywne` ↑
- **`g₄ ≈ 1.02–1.1`/rok** [EST], ale człon `n²` czyni koszt kontroli superliniowym.
- **Martwy kod.** Norma bez cytowania przez `T` lat przy niepustym guardzie jest albo **nieosiągalna**
  (guard praktycznie niespełnialny), albo **przesłonięta** (`dead store`: późniejsza norma ogólna nadpisuje
  przypisanie wcześniejszej szczególnej, zanim ktokolwiek je odczyta). Systemy prawne **nie mają
  przebiegu DCE** ani błędu linkera *duplicate symbol*.
- **Koszt martwego kodu jest niezerowy i ma dwa składniki:**
  1. **koszt przeszukiwania** — martwe gałęzie są w przestrzeni `O(b^d)` i zjadają gaz;
  2. **ryzyko rewitalizacji** — nieosiągana gałąź osiągnięta raz przez kreatywnego pełnomocnika
     zachowuje się jak *use-after-free*: latentny błąd manifestujący się po latach, w losowym momencie,
     z pełną mocą wiążącą (`FAIL-B-10`).
- **Atraktor:** *korpus, którego nikt nie zna w całości, i o którym każde twierdzenie „nie ma takiego
  przepisu” jest niesprawdzalne*. Odpowiednik: baza kodu bez indeksu i bez kompilatora.

### `LOOP-B-05` — niedobór gazu → gęstość `assume` `(+)`

- **Ścieżka:** obciążenie ↑ → gaz/sprawę ↓ → więcej kroków zamykanych przez `assume` →
  uzasadnienia krótsze i mniej sprawdzalne → mniej materiału do kontroli instancyjnej →
  mniej uchyleń → potwierdzenie, że obciążenie jest znośne → obciążenie ↑
- **`g₅ ≈ 1.1–1.4`** [EST].
- **Opóźnienie:** `10¹–10²` dni (cykl sprawozdawczy).
- **Metryka:** `ρ_a = n_assume / n_kroków_wyprowadzenia` (`RES-B-08`).
- **Atraktor:** *orzeczenie jako sygnatura bez ciała* — uzasadnienie zawiera konkluzję i cytat przepisu,
  bez kroków między nimi.

### `LOOP-B-06` — erozja rozstrzygalności `(+)` — `onto_epistemic_drift`

- **Ścieżka:** `admit` zdejmuje `Dec` → spór o fakt techniczny rozstrzygany ważeniem opinii →
  biegli selekcjonowani przez rynek za **przekonywalność**, nie za trafność →
  jakość predykcyjna opinii ↓ → jeszcze mniej powodów, by traktować je jak `Dec` → silniejsze ważenie
- **`g₆ ≈ 1.05–1.2`** [EST].
- **Opóźnienie:** pokoleniowe w populacji biegłych, `10³` dni [EST].
- **Atraktor:** *świat jako kolejna strona sporu*. Formalnie: `Bool` znika z systemu typów; zostaje `Claim`.
- **Uwaga o kierunku:** ta pętla jest jedyną w katalogu, która **wychodzi poza system**: degraduje
  zdolność systemu do przyjęcia informacji z zewnątrz. Wszystkie pozostałe degradują spójność wewnętrzną.

### `LOOP-B-07` — apelacja jako **niesprawna** pętla ujemna `(−, g < 1)`

- **Ścieżka:** błąd → zaskarżenie → korekta. Znak ujemny, czyli **właściwy kierunek**.
- **`g₇ ≈ 0.1–0.4`** [EST]. Cztery niezależne tłumiki: (i) zaskarżana jest mniejszość orzeczeń;
  (ii) kontrola nie wraca do `S2` (`THM-B-07`), więc nie naprawia najczęstszego skażenia;
  (iii) instancja wyższa dzieli oracle z niższą (`THM-B-13`), więc korekta jest skorelowana z błędem;
  (iv) opóźnienie `10²–10³` dni.
- **Wniosek sterowniczy w języku tej soczewki:** to jest pętla ujemna o wzmocnieniu **znacznie poniżej 1**
  i opóźnieniu o rząd wielkości większym niż stała czasowa pętli dodatnich `LOOP-B-01/02/05`.
  Nie stabilizuje. **Nie jest to wada implementacji — to konsekwencja tego, że kontrola instancyjna
  jest rerunem późnych faz, a nie ponownym parsowaniem.**

### `LOOP-B-08` — brakująca krawędź: sprzężenie ze specyfikacją zewnętrzną `(pętla nie istnieje)`

- **Ścieżka, której NIE MA:** wynik systemu → porównanie z niezależną `Spec` → korekta.
- **Powód nieistnienia:** `Spec := Oracle` (`THM-B-02`). Krawędź `wynik → porównanie` prowadzi do
  tego samego węzła, z którego wychodzi. Formalnie: to nie jest pętla ujemna o małym wzmocnieniu,
  tylko **self-loop** o wzmocnieniu 1, czyli identyczność.
- **To jest najważniejszy wpis w tym katalogu.** Wszystkie pętle dodatnie mogłyby być tłumione przez
  jedną sprawną pętlę ujemną. Nie ma jej **nie dlatego, że jest słaba, tylko dlatego, że nie ma
  drugiego końca**. Konstrukcja drugiego końca to `NN-B-07`.

### `LOOP-B-09` — kompetencja pełnomocnika jako mnożnik UB `(+, dystrybucyjnie asymetryczna)`

- **Ścieżka:** budżet strony ↑ → głębokość eksplorowanego drzewa wyprowadzeń ↑ →
  szansa znalezienia korzystnego uzupełnienia `ν` pozycji UB ↑ (`THM-B-01`) → wygrane ↑ →
  budżet kancelarii ↑ → kompetencja ↑
- **`g₉ ≈ 1.1–1.5`** [EST].
- **To jest dokładnie „optymalizujący kompilator” z `THM-B-01`:** UB nie daje przewagi „temu, kto ma rację”,
  tylko **temu, kto eksploruje więcej uzupełnień**. Kurs wymiany budżet → gaz: `RES-B-06`,
  rząd `10⁻¹ vgas/PLN` [EST].
- **Atraktor:** *ekspresywność jako towar*. Im więcej UB, tym większa wartość rynkowa dostępu do gazu.
  Uwaga: to przewiduje, że zawód-pośrednik **nie ma bodźca do redukcji UB**, i to jest predykcja
  falsyfikowalna (sprawdzić stanowiska samorządów zawodowych wobec projektów kodyfikacji zwiększających
  określoność).

---

## 3. Bilans dynamiki

| | liczba | wzmocnienie |
|---|---|---|
| pętle dodatnie | 7 (`01,02,03,04,05,06,09`) | wszystkie `g > 1` [EST] |
| pętle ujemne działające | 1 (`07`) | `g ≈ 0.1–0.4` — **za słaba**, opóźnienie o rząd większe |
| pętle ujemne brakujące | 1 (`08`) | krawędź nie istnieje strukturalnie |

**Wniosek (w języku tej soczewki, nie teorii sterowania).** Układ nie ma **punktu stałego w przestrzeni
poprawności**, bo nie ma funkcji, względem której poprawność byłaby mierzona (`LOOP-B-08`).
Ma punkt stały w przestrzeni zasobów: zatrzymuje się na wyczerpaniu (`THM-B-11`).
Iteracja `S5 → S6 → S2 → S5` nie zbiega, bo dziedzina nie jest kratą z dobrze ufundowanym porządkiem,
a operator wymuszający terminowanie (`res judicata`) nie jest widening, tylko truncation (`THM-B-10`).

**Trzy atraktory degeneracji, uporządkowane wg tego, jak trudno je odwrócić:**

1. **`kodeks jako dekoracja`** (`LOOP-B-01`) — odwracalny przez `deps` w cache (`NN-B-04`);
   koszt: zmiana schematu bazy orzeczeń, `Θ(|cache|)` jednorazowo.
2. **`sygnatura bez ciała`** (`LOOP-B-05`) — odwracalny przez `INV-B-01` (`NN-B-02`);
   koszt: wzrost `n_assume` widoczny w statystyce, czyli koszt polityczny, nie techniczny.
3. **`świat jako strona sporu`** (`LOOP-B-06`) — **najtrudniejszy**, bo wymaga przywrócenia konstruktora
   (`Dec`), który został z systemu typów usunięty, a odzyskanie wymazanej informacji nie jest możliwe
   z zapisów post factum. Odwrócenie działa tylko w przód, od momentu wprowadzenia.

---

*Agent B · tor I · `20-DYNAMICS.md`*
