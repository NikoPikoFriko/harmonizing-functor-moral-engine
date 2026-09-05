# AGENT B · `40-NONNEGOTIABLE.md` — elementy nieoddawalne opatrzności

Reguła z §6 protokołu: wpis jest ważny **tylko** z argumentem formalnym — dowód niemożliwości,
twierdzenie o niezmienniku, oszacowanie złożoności, wynik z teorii gier albo kontrprzykład konstrukcyjny.
Apel nie jest argumentem.

**Reguła własna, ostrzejsza od protokołu:** każdy `NN-B-*` podaje dodatkowo **warunek obalenia** —
co dokładnie trzeba pokazać, żeby wpis upadł. Wpis, którego nie da się obalić, jest dogmatem,
a dogmat w tej pozycji byłby odtworzeniem `majesty_switch` wewnątrz narzędzia do jego badania.

**Uwaga o kształcie tej listy.** Nie żądam usunięcia dyskrecjonalności, nie żądam usunięcia klauzul
generalnych, nie żądam soundness. Wszystkie trzy są albo niemożliwe (`THM-B-03`), albo funkcjonalne.
Żądam **pól w rekordach i etykiet na rzutowaniach** — czyli obserwowalności. Siedem z ośmiu wpisów
to zmiany formatu zapisu, nie zmiany procedury. To jest celowe: żądanie budżetu byłoby apelem,
żądanie pola jest specyfikacją.

---

## `NN-B-01` — `NON_LIQUET` musi być reprezentowalną wartością wyniku

**Typ argumentu:** `impossibility`.

**Twierdzenie.** `Totality ∧ Soundness` są łącznie niespełnialne dla niezupełnego kodeksu (`THM-B-03`),
i to samo potwierdza się mechanicznie na modelu TLA+ (`THM-B-06`: `Totality ∧ Soundness ∧ Pure ∧ NoSmuggle`
nie ma modelu przy `GasInit ≤ GasMin + |frontier|`). Jedna z czterech własności **musi** zostać oddana.

**Teza wpisu.** Skoro oddać trzeba, to oddanie `Totality` jest **ściśle** lepsze od oddania `Soundness`,
i to jest twierdzenie o obserwowalności, nie preferencja:

- oddanie `Totality` produkuje wartość `NON_LIQUET`, która jest **policzalna** (statystyka),
  **zaskarżalna** (adresat: kto miał obowiązek dostarczyć dowód) i **sygnalizująca** (kieruje żądanie
  naprawy do ustawodawcy, bo wskazuje lukę w `dom(derive)`);
- oddanie `Soundness` produkuje `majesty`, który jest **niepoliczalny** (`RES-B-07`),
  **niezaskarżalny** (`THM-B-04`: brak adresata) i **niesygnalizujący** (luka w `dom(derive)`
  zostaje zamaskowana przez wynik wyglądający jak wyprowadzony).

**Argument informacyjny (to jest właściwy rdzeń).** `NON_LIQUET` niesie `log₂(|Outcomes|+1) − log₂(|Outcomes|)`
bitów **dodatkowej** informacji o stanie systemu w porównaniu z wynikiem zmyślonym: mówi
„tu kończy się kodeks”. `majesty` niesie `0` bitów, bo jest nieodróżnialny od wyprowadzenia.
Różnica jest o tyle istotna, że **`NON_LIQUET` jest jedynym sygnałem zwrotnym mogącym domknąć
`LOOP-B-08`** (brakującą pętlę ujemną). Bez niego nie ma czego mierzyć.

**Czego NIE żądam.** Nie żądam, żeby sprawa nie miała końca. `NON_LIQUET` może mieć przypisaną
regułę domknięcia (ciężar dowodu, domniemanie), byle **reguła była nazwana w wyniku**.
Różnica: `deny(bo powód nie udowodnił)` niesie informację; `deny(basis: majesty)` nie niesie żadnej.

**Warunek obalenia.** Pokazać, że w systemie z reprezentowalnym `NON_LIQUET` liczba spraw kończących się
tą wartością rośnie tak, że koszt niepewności stron przewyższa wartość informacyjną sygnału —
i to **zmierzyć**, a nie założyć. Albo: pokazać, że `dom(derive) = Case`, czyli że kodeks jest zupełny.

---

## `NN-B-02` — każdy `assume` musi przeżyć serializację uzasadnienia

**Typ argumentu:** `invariant` + `counterexample`.

**Twierdzenie.** `INV-B-01` („każdy liść `assume` jest obecny w uzasadnieniu wraz z `reason`”)
jest dziś **niewykrywalny ex post**, bo `obs : Derivation → Uzasadnienie` skleja `assume` z `applyNorm`
(`THM-B-04`, dowód konstrukcyjny przez parę `d₁, d₂` z `obs(d₁) = obs(d₂)`).

**Sformułowanie w wymaganym kształcie:** bez tego pola niezmiennik `INV-B-01` jest naruszalny przez
**pojedynczego aktora w czasie `O(1)`** (jedna fraza zamiast jednego wyprowadzenia) i **nie da się tego
wykryć post factum z żadnego zapisu, jaki system produkuje**. To jest dokładnie profil, którego
protokół żąda dla `NN-*`.

**Koszt wdrożenia.** Znacznik w szablonie uzasadnienia. Zero zmian w procedurze, zero w organizacji.
Koszt polityczny: `ρ_a` (`RES-B-08`) staje się mierzalna, więc wielkość dziś nieznana staje się
przedmiotem sporu. **To jest jedyny realny koszt i trzeba go nazwać wprost.**

**Warunek obalenia.** Pokazać, że `ρ_a` da się oszacować z dostatecznie małym błędem systematycznym
z samych opublikowanych tekstów (np. estymatorem NLP walidowanym na próbie audytowej) — wtedy
znacznik jest wygodą, nie warunkiem wykrywalności. Uwaga: to jest dokładnie treść `CON-B-07`,
i tam jest zaksięgowana jako **ustępstwo**, nie jako obalenie: estymator ma nieznany znak biasu.

---

## `NN-B-03` — każde rzutowanie niesprawdzone musi mieć etykietę `blame`

**Typ argumentu:** `invariant` (twierdzenie o blame) + `impossibility` (brak mechanizmu korekcyjnego).

**Twierdzenie o blame** (Wadler–Findler): w rachunku z etykietowanymi rzutowaniami zachodzi
*well-typed programs can't be blamed* — awaria ma zawsze dokładnie jednego adresata, i jest nim strona
mniej precyzyjnie otypowana. To twierdzenie jest **jedynym powodem**, dla którego gradual typing
nadaje się do użytku produkcyjnego.

**Argument.** Konstruktor `{ step: "majesty" }` nie ma pola `blame`. Wobec tego twierdzenie o blame nie jest
naruszone — jest **niewypowiadalne**: jego konkluzja kwantyfikuje po etykietach, których nie ma.
Skutek mierzalny: `RES-B-09` — budżet winy wycieka, `α + β < 1`, reszta nieprzypisywalna.

**Dlaczego to jest niemożliwość, a nie niedogodność.** Każdy mechanizm korekcyjny (bodziec, sankcja,
szkolenie, zmiana procedury, nawet zwykły raport) wymaga **adresata jako argumentu**.
Funkcja `korekta : Blame → Działanie` nie ma dziedziny, gdy `Blame` jest typem pustym w tej gałęzi.
Zatem: **dla części `δ` nie istnieje żaden mechanizm korekcyjny — nie „nie ma dobrego”, tylko
nie ma żadnego wyrażalnego.** To jest wynik o typach, nie o instytucjach.

**Konsekwencja dla innych soczewek** (ważne dla fazy konsensusu): zarówno kompensator sterujący,
jak i protokół BFT wymagają **kanału obserwacji**. Etykieta `blame` **jest** tym kanałem.
Bez niej ich narzędzia nie mają na czym pracować — więc to nie jest ustępstwo, którego oczekuję od nich,
tylko warunek konieczny ich własnych modeli. Patrz `agent.json/open_conflicts_expected[3]`.

**Warunek obalenia.** Wskazać istniejący, wiążący mechanizm przypisania odpowiedzialności za rozstrzygnięcie
niewyprowadzalne (nie za delikt dyscyplinarny, nie za przewlekłość — za **treść** nieuzasadnionego kroku),
i pokazać, że jest stosowany z częstością istotnie różną od zera.

---

## `NN-B-04` — pinowanie wersji normy do czasu zdarzenia + `deps` w cache precedensów

**Typ argumentu:** `complexity` + `counterexample`.

**Kontrprzykład (`FAIL-B-03`, `THM-B-09b`).** Orzeczenie cytowane jako podstawa, zapadłe pod wersją
przepisu, która już nie obowiązuje, przy braku jakiegokolwiek sygnału w systemie. Konstrukcja jest trywialna
i — w odróżnieniu od reszty tej listy — **weryfikowalna dziś**, przez przecięcie bazy orzeczeń z bazą wersji aktów.

**Argument złożonościowy (to jest właściwa siła wpisu).** Bez pola `deps: Set<NormVersion>`
inwalidacja cache po nowelizacji wymaga pełnego skanu:

| | koszt inwalidacji na nowelizację | koszt roczny przy `10³` nowelizacji/rok [EST] |
|---|---|---|
| bez `deps` | `Θ(cache)` `≈ 10⁵–10⁶` | `10⁸–10⁹` porównań, **ręcznie** |
| z `deps` | `Θ(affected)` `≈ 10¹–10³` | `10⁴–10⁶`, maszynowo |

To jest **zmiana klasy złożoności utrzymania korpusu**, nie usprawnienie o stałą.
Faktyczna liczba wykonywanych dziś inwalidacji: `~0` — czyli system działa w reżimie,
w którym stale entries są normą, a nie wyjątkiem.

**Argument o pinowaniu (`INV-B-06`).** Umowa zawarta pod `v1` jest dziś linkowana z `latest`.
W inżynierii oprogramowania odpowiada to budowaniu produkcji bez lockfile'a; znany tryb awarii.
Reguły intertemporalne są ręcznym shimem pisanym po fakcie, per-nowelizacja, bez testu regresji.

**Warunek obalenia.** Zmierzyć `FAIL-B-03` na reprezentatywnej próbie uzasadnień i pokazać,
że udział cytowań stale jest poniżej `10⁻²`. Wtedy koszt pola `deps` przewyższa korzyść i wpis
przechodzi do księgi ustępstw (`CON-B-03` jest już przygotowany na tę ewentualność).

---

## `NN-B-05` — `Dec` nie może być wymazane przez `admit`; pomiar nie jest opinią

**Typ argumentu:** `counterexample` + `impossibility` (brak lewego odwrotu funktora).

**Argument formalny.** `E : Evidence → Claim` (`admit`) nie jest injektywny:
`E(measurement m) = E(expertOpinion o)` przy tym samym `asserts` i tej samej wadze.
Funktor nieinjektywny nie ma lewego odwrotu, więc `Dec` jest po `admit` **nieodzyskiwalne**.
Skutek (`THM-B-12`): jedyną dostępną formą refutacji staje się inny `Claim`, refutacja staje się
symetryczna z asercją, znika asymetria Popperowska. **System nie może zostać zaskoczony przez świat.**

**Dlaczego to jest nienegocjowalne, a nie „ważne”.** System, w którym twierdzenie o świecie fizycznym
jest rozstrzygane ważeniem opinii, ma **zerową zdolność korekcyjną z zewnątrz**. `LOOP-B-08`
(brakująca pętla ujemna) jest strukturalnie nieodbudowywalna, bo jedynym kanałem, przez który mogłaby
wejść informacja niezależna od oracle'a, jest właśnie `Dec`. Usunięcie `Dec` **domyka system**
na wszystkie źródła falsyfikacji jednocześnie — to jest wynik o zamknięciu, nie o dokładności.

**Minimalna postać żądania (celowo słaba, żeby była wdrażalna):**
pomiar o niepewności poniżej progu `τ`, wykonany przyrządem o udokumentowanej powtarzalności,
**nie może zostać przeważony opinią** — może zostać podważony wyłącznie **powtórnym pomiarem**.
Nie żądam, żeby pomiary były nieomylne. Żądam, żeby ich refutacja miała **inny typ** niż ich asercja.

**Warunek obalenia.** Pokazać klasę spraw, w której powtórzenie pomiaru jest niewykonalne lub
niszczące dowód, i wykazać, że stanowi większość sporów o fakt techniczny. Wtedy `Dec` z veto
jest niestosowalny w tej klasie i wpis wymaga zawężenia zakresu (nie uchylenia).

---

## `NN-B-06` — fail-fast na granicy fazy; prekluzja nie może utrwalać naruszonego `I₂`

**Typ argumentu:** `invariant` (kompozycja trójek Hoare'a) + `complexity`.

**Twierdzenie (`THM-B-07`).** Przy `¬I₂` reguła `COMP` nie stosuje się do żadnej dalszej fazy;
jedyną dostępną regułą jest osłabienie do `true`. Najsilniejszy wyprowadzalny warunek końcowy
całego potoku wynosi `sp(¬I₂, S3;S4;S5) = true`. **Wynik nie jest „prawdopodobnie zły” — jest
niezwiązany z wejściem.**

**Argument kosztowy.** Kontynuacja potoku po naruszeniu `I₂` kosztuje **pełny budżet potoku**
(`S3+S4+S5+S6+S7`) przy **zerowym przyroście informacji** o `I₅`. Powrót do `S2` kosztuje
`S1+S2` — ściśle mniej. Kontynuacja jest więc zdominowana kosztowo, niezależnie od wyceny sprawiedliwości.

**Wzmocnienie przez `THM-B-08`.** `I₂` kwantyfikuje po `material(F)`, a `material` jest ustalane w `S5`.
Zatem `I₂` jest niesprawdzalny w chwili, w której ma zachodzić — i **ex post zawsze da się orzec
zarówno że zachodził, jak i że nie zachodził**, przez dobór kwalifikacji `q`. Wykrywalność naruszenia: `0`.

**Minimalna postać żądania:** zamrożenie `material(F)` **przed** prekluzją (wiążące postanowienie
o podstawie prawnej), z prawem uzupełnienia dowodów przy jego zmianie. To zamienia `I₂`
z predykatu z niezwiązaną metazmienną na predykat sprawdzalny w `S2`.

**Warunek obalenia.** Pokazać, że zmiana kwalifikacji prawnej po prekluzji zdarza się z częstością
poniżej `10⁻²` i nie zmienia `material` w sposób istotny. Wtedy `THM-B-08` jest teoretyczny.

---

## `NN-B-07` — `Saint` nie może być założony; twierdzenia o poprawności muszą być jawnie relatywizowane

**Typ argumentu:** `impossibility` (wakacyjność) — argument o treści informacyjnej, nie o etyce.

**Twierdzenie (`THM-B-02`).** Gdy `Spec(c) ≜ Oracle(c)`, zdanie `∀c. Oracle(c) = Spec(c)` jest tautologią
o treści `0` bitów. Każda „weryfikacja systemu wobec specyfikacji” jest wakacyjna.
Konsekwencja ostrzejsza od degradacji `1−(1−ε)^k`: błąd oracle'a **z definicji nie jest błędem**,
więc `ε` nie jest mierzalne wewnątrz systemu. Nie „duże” — **nieokreślone**.

**Żądanie (dwuczęściowe, oba operacyjne):**
1. **Relatywizacja jawna.** Każde twierdzenie o poprawności zapisywane w postaci
   `Saint_correct ⊢ System_correct`, z widocznym antecedentem. To jest czysto notacyjne i darmowe,
   a usuwa złudzenie bezwarunkowości.
2. **Niezależne `Spec` choćby na wycinku.** Wystarczy jeden wymiar, na którym istnieje odniesienie
   niezależne od orzeczenia: `Dec` z `NN-B-05` (świat), oraz — zgodnie z aksjomatem wejściowym
   protokołu — **per-podmiotowa** macierz wartości jako rodzina `Spec_p`, zamiast jednego oracle'a.
   Poprawność staje się wtedy **relacją indeksowaną podmiotem**, nie predykatem globalnym.

**Uwaga o tym, czego to żądanie NIE mówi.** Nie mówi, że sędziowie są omylni bardziej niż inni ludzie.
Nie mówi, że `Spec_p` jest lepsza. Mówi tylko: **przy `Spec := Oracle` żadne zdanie o poprawności
nie ma treści**, a `Spec_p` jest jedyną konstrukcją dostępną w tym modelu, która treść przywraca.
To jest wniosek z rachunku informacji, nie z preferencji ustrojowej.

**Warunek obalenia.** Wskazać wiążący conformance suite: zbiór spraw z rozstrzygnięciami uznanymi
za poprawne **niezależnie od tego, jak orzekłby sąd**, używany do stwierdzania błędu orzeczenia.
Wtedy `Spec ≠ Oracle` i cały wpis upada. (Zbiory kazusów egzaminacyjnych nie spełniają warunku:
ich klucz jest ustalany przez ten sam oracle.)

---

## `NN-B-08` — inwentarz UB (nie: usunięcie UB)

**Typ argumentu:** `counterexample` + `complexity`.

**Twierdzenie (`THM-B-01`).** **Jedna** osiągalna pozycja `undefined` na ścieżce dominującej wystarcza,
żeby każdy wynik w obrazie funkcji efektu był dopuszczalny, a informacyjność tekstu spadła do `0` bitów.

**Wniosek, który zmienia postać żądania.** Skoro wystarczy jedna, to **wielkość „przeciętna nieostrość
kodeksu” jest bez znaczenia**. Znaczenie ma wyłącznie predykat **osiągalności**: czy na ścieżce
wyprowadzenia w tej sprawie leży pozycja UB. To jest własność **reachability**, rozstrzygalna,
gdy guardy są termami, i nierozstrzygalna — bo niewyrażalna — gdy guardy są prozą.

**Czego żądam (i czego świadomie nie).** Nie żądam usunięcia klauzul generalnych: są nieusuwalne
(każdy zbiór reguł skończony wobec nieskończonego świata musi mieć domknięcie) i pełnią funkcję adaptacyjną
(`LOOP-B-03` bez nich nie ma alternatywy). Żądam **inwentarza na wzór Annexu J.2 standardu C**:
enumeracji pozycji UB w korpusie, z adresem jednostki redakcyjnej i typem dziury.
C nie usunął UB — **wyliczył go**, i to wystarczyło, żeby powstały narzędzia (UBSan, analizatory)
działające na wyliczeniu. Bez enumeracji żadne narzędzie nie ma listy wejściowej.

**Argument, dlaczego to nienegocjowalne mimo kosztu.** Koszt enumeracji jest liniowy: `O(n)` przeglądów
jednostek redakcyjnych, `n ≈ 10⁴–10⁵` [EST], jednorazowo, wykonalne. Koszt **braku** enumeracji jest
superliniowy i stały w czasie: każda sprawa płaci za przeszukiwanie przestrzeni, o której nie wiadomo,
gdzie ma dziury (`THM-B-14`), a każdy uczestnik płaci `LOOP-B-09` (przewaga tego, kto eksploruje więcej).
Asymetria `O(n)` jednorazowo vs stały koszt na sprawę × liczba spraw rozstrzyga.

**Warunek obalenia.** Pokazać, że enumeracja jest niewykonalna, bo granica `implementation_defined` /
`undefined` jest nieostra dla większości klauzul — czyli że sama klasyfikacja wymaga rozstrzygnięcia
sądowego. Byłby to poważny zarzut: oznaczałby, że inwentarz UB jest sam obiektem typu UB.
Odpowiedź częściowa: klasyfikacja może być **konserwatywna** (w razie wątpliwości: `undefined`),
i konserwatywna nadaproksymacja jest sound, dokładnie jak w analizie statycznej.

---

## Podsumowanie: struktura tej listy

| ID | Typ argumentu | Czego dotyczy | Koszt wdrożenia |
|----|---------------|---------------|------------------|
| `NN-B-01` | impossibility | reprezentowalność `NON_LIQUET` | zmiana ustrojowa — **jedyny drogi wpis** |
| `NN-B-02` | invariant + counterexample | pole `assume` w uzasadnieniu | szablon dokumentu |
| `NN-B-03` | invariant + impossibility | pole `blame` przy `majesty` | schemat orzeczenia |
| `NN-B-04` | complexity + counterexample | `deps` + pinowanie wersji | schemat bazy + backfill |
| `NN-B-05` | counterexample + impossibility | `Dec` z prawem veta | reguła dowodowa |
| `NN-B-06` | invariant + complexity | fail-fast, zamrożenie `material` | zmiana proceduralna, średnia |
| `NN-B-07` | impossibility (wakacyjność) | relatywizacja + `Spec_p` | notacja + budowa odniesienia |
| `NN-B-08` | counterexample + complexity | inwentarz UB | `O(n)` jednorazowo |

**Siedem z ośmiu to pola, notacja albo jednorazowa enumeracja.** Jeden (`NN-B-01`) jest zmianą ustrojową
i jest jedynym, przy którym spodziewam się realnego oporu **merytorycznego**, a nie tylko kosztowego.
Ta asymetria jest sama w sobie wynikiem: **większość niewykrywalności w tym systemie nie wynika
z trudności pomiaru, tylko z braku miejsca na zapis wyniku pomiaru.**

---

*Agent B · tor I/II · `40-NONNEGOTIABLE.md`*
