# 40-NONNEGOTIABLE — Agent A · tor I/II

Elementy, których nie oddaję opatrzności. Każdy wpis ma argument formalny w rozumieniu §6 protokołu:
dowód niemożliwości, twierdzenie o niezmienniku, oszacowanie złożoności, wynik teoriogrowy albo
kontrprzykład konstrukcyjny.

Każdy wpis ma też **test falsyfikacji**: obserwację, po której wpis przestaję traktować jako
nienegocjowalny. Wpis bez testu falsyfikacji jest apelem, a apele tu nie wchodzą.

Kryterium doboru było jedno i celowo wąskie: **wpis jest nienegocjowalny, jeżeli jego brak czyni
naruszenie odpowiadającego niezmiennika niewykrywalnym.** Nie „szkodliwym", nie „ryzykownym" —
niewykrywalnym. Rzeczy wykrywalne można naprawiać iteracyjnie i dlatego nadają się do ustępstw.
Rzeczy niewykrywalne kumulują się bez sygnału i dlatego nie nadają.

---

## `NN-A-01` — log tylko-do-dopisywania z zewnętrznym commitem hashy

**Teza.** Akta sprawy są `append-only`; korekta jest nowym wpisem wskazującym poprzednika
(`EntryKind.correction`), nigdy mutacją. Hasze wpisów są commitowane do rejestru poza kontrolą organu
prowadzącego sprawę.

**Typ argumentu:** niezmiennik + kontrprzykład konstrukcyjny.

**Szkic.** Bez zewnętrznego commitu hashy `INV-A-01` jest naruszalny przez **pojedynczego aktora
w czasie `O(1)` i w sposób niewykrywalny post factum**. Kontrprzykład konstrukcyjny: aktor podmienia
treść wpisu `E_i` i przelicza `self` oraz wszystkie `prev` dla `j > i`. Koszt: `O(n)` w liczbie wpisów,
czyli minuty. Weryfikacja `isAppendOnly` po podmianie zwraca `true`, bo łańcuch jest wewnętrznie
spójny. Jedynym świadkiem oryginału jest kopia zewnętrzna, której istnienie jest przypadkowe.

Zewnętrzny commit `H(E_i)` zmienia to jakościowo: podmiana wymaga albo znalezienia kolizji
(`2^128` przy SHA-256, niewykonalne), albo skorumpowania rejestru zewnętrznego (koszt niezerowy,
skorelowany z innym `reputationPool`, więc niezależny od korupcji organu).

**Co się psuje bez tego.** `retroactive_relativization` staje się operacją bez śladu, a nie tylko
bez sankcji. To z kolei zamyka `LOOP-A-02` (`P(wykrycie) ≈ 0` ⇒ warunek rozbiegania spełniony trywialnie)
i unieważnia `NN-A-05` oraz `NN-A-06`, bo wersjonowanie na mutowalnym nośniku niczego nie gwarantuje.

**Czego nie przyjmę jako substytutu.** Wewnętrznego audytu, podpisu elektronicznego organu na własnym
rejestrze, dziennika zmian utrzymywanego przez ten sam podmiot. Wszystkie trzy mają tego samego
`reputationPool` co podmiot kontrolowany i przez THM-A-07 nie dostarczają niezależnego świadectwa.

**Test falsyfikacji.** Wskazanie mechanizmu, który wykrywa podmianę wpisu z prawdopodobieństwem
`> 0.9` bez odwołania do rejestru poza kontrolą organu.

---

## `NN-A-02` — zewnętrznie commitowany timestamp wpływu i każdej zmiany kolejności

**Teza.** Moment wpływu pisma i każda zmiana pozycji sprawy w kolejce są commitowane w publicznym
rejestrze append-only poza kontrolą organu (`INV-A-05`).

**Typ argumentu:** teoriogrowy, z progiem liczbowym.

**Szkic.** Z THM-A-10 wartość ekstrahowalna ze zwłoki wynosi `V_MEV = P(zmiana wyniku | Δ) × stawka > 0`.
Z `LOOP-A-06` układ traci punkt stały przy `β > β_crit`, gdzie
`β_crit = [(μ+λ₀)² − 4λ₀μ]/(4λ₀) = 0.00662` dla `μ = 1`, `λ₀ = 0.85` [EST].
`β` to przyrost napływu wniosków przewlekających na jednostkę oczekiwania. Próg **0.66 %** jest
tak niski, że jego nieprzekroczenie nie jest realistycznym założeniem — wymagałoby, by zwłoka była
opłacalna dla mniej niż jednego uczestnika na sto pięćdziesiąt.

Zewnętrzny timestamp obniża `β`, bo czyni zwłokę atrybucyjną: staje się możliwe wskazanie, który
wniosek i o ile przesunął sprawę. Bez atrybucji sankcja jest niewykonalna nie dlatego, że jej nie ma,
tylko dlatego, że nie ma czego przypisać.

**Koszt obrony.** Podpis i wpis do rejestru: rząd 10⁻⁶ kosztu sprawy [EST]. Stosunek kosztu do
efektu jest tu najlepszy w całym modelu (`20-DYNAMICS.md` §11, rząd 1).

**Czego nie przyjmę.** Rejestru prowadzonego przez organ, choćby publicznie dostępnego. Publiczna
widoczność bez zewnętrznej niezmienności nie zmienia `β`, bo nie zmienia atrybucyjności historycznej.

**Test falsyfikacji.** Wykazanie, że `β < 0.0066` empirycznie — czyli że wydłużenie oczekiwania
nie zwiększa napływu wniosków o charakterze przewlekającym.

---

## `NN-A-03` — heterogeniczność puli weryfikującej

**Teza.** Zbiór węzłów weryfikujących musi mieć puste przecięcie z pulą reputacyjną węzła
weryfikowanego (`INV-A-10`).

**Typ argumentu:** niemożliwość (podłoga niezależna od `n`).

**Szkic.** Z THM-A-07: przy skorelowanym komponencie funkcji celu prawdopodobieństwo awarii łącznej
wynosi `P_joint(p, ρ, n) = ρ·p + (1−ρ)·pⁿ` i jest ograniczone z dołu przez `ρ·p` **niezależnie od `n`**.
To jest dowód niemożliwości, nie oszacowanie: żadna liczba instancji z tej samej puli nie osiągnie
dokładności lepszej niż `1 − ρp`.

Liczby przy `p = 0.10` [EST]:

| ρ | n=2 | n=3 | n=10 | podłoga |
|---|-----|-----|------|---------|
| 0.0 | 0.990 | 0.999 | 1.000 | 1.000 |
| 0.7 | 0.927 | **0.930** | 0.930 | 0.930 |

Przy `ρ = 0.7` [EST] trzecia instancja wnosi 0.3 pp, dziesiąta 0.03 pp. Cały możliwy zysk z
redundancji jednorodnej wynosi 3 pp i jest wyczerpany po drugiej instancji.

**Co to znaczy operacyjnie.** Postulat „więcej kontroli instancyjnej" jest formalnie pusty powyżej
`n = 2`. Co więcej, przez `LOOP-A-07` każda dodatkowa instancja podnosi `ρ_q`, a przy `ρ_q > 0.9`
zależność `W = 1/(μ(1−ρ_q))` sprawia, że **dodanie instancji pogarsza system netto**: koszt jest
globalny i nieliniowy, korzyść lokalna i ograniczona przez `ρp`.

**Czego nie przyjmę.** Żadnego argumentu z niezależności formalnej (odrębny sąd, odrębny skład,
odrębna właściwość). Niezależność w THM-A-07 dotyczy **funkcji celu**, nie struktury organizacyjnej.
Dwa węzły w tej samej strukturze awansu, szkolenia i odpowiedzialności dyscyplinarnej mają wspólny
`ξ_sys` niezależnie od tego, ile organizacyjnych linii je dzieli.

**Test falsyfikacji.** Pomiar `ρ` — korelacji błędów między instancjami przy kontroli na trudność
sprawy. Jeżeli `ρ < 0.1`, wpis upada i redundancja jednorodna wystarcza.

---

## `NN-A-04` — skalibrowana pewność i deklaracja kompletności przy finalizacji

**Teza.** Każdy `Verdict` niesie pełny `Completeness`: zbiór porzucony przez prekluzję, fakty
`decisive ∧ single custody`, flagę fikcji doręczenia oraz `calibrated.support ∈ [0,1]` (`INV-A-04`).

**Typ argumentu:** niemożliwość detekcji.

**Szkic.** Detektor `d: PublicOutput → {evidence, authority}` istnieje tylko wtedy, gdy jego dziedzina
zawiera informację odróżniającą. `PublicJustification` zawiera `narrative` i `citedNorms` — wielkości,
które oba tryby produkują w tej samej gramatyce (THM-A-05, `switchEmitsSameShape`). Zatem żaden
detektor nie jest lepszy od stałej. Nie jest to trudność statystyczna: dziedzina jest niewystarczająca,
więc problem jest nierozstrzygalny na tym wejściu niezależnie od metody.

Dodanie jednej liczby zmiennoprzecinkowej czyni detekcję trywialną (`O(1)`), a przy tym pozwala
zróżnicować próg dla `RES-A-10` (efekty niekompensowalne przy wyższej pewności niż kompensowalne) —
czyli odblokowuje osobną, niezależną poprawę.

**Świadomie przyjmowany koszt.** Wiem z THM-A-05, że emisja `calibrated` jest sprzeczna z równowagą
systemu: przy binarnej egzekucji jawna pewność `0.55` obniża legitymację szybciej niż jej nieujawnianie.
**Nie ustępuję mimo to**, ponieważ ta równowaga jest równowagą **przy ustalonym S7**. Właściwym
wnioskiem nie jest „nie mierz", tylko „zmień S7 albo przyjmij, że pomiar odsłoni koszt, który już
ponosisz". Ustąpienie tutaj oznacza akceptację wniosku, że system ma prawo nie wiedzieć o sobie
rzeczy, które wie, i to jest dokładnie granica, za którą tor I przestaje mieć sens.

**Czego nie przyjmę.** Trójstopniowej skali opisowej („wysokie / średnie / niskie prawdopodobieństwo").
Skala porządkowa bez kalibracji nie pozwala policzyć `Brier score`, więc nie pozwala sprawdzić,
czy deklarowana pewność ma jakikolwiek związek z trafnością — a to jest jedyny powód, dla którego
pole jest cokolwiek warte.

**Test falsyfikacji.** Wskazanie detektora trybu o `AUC > 0.7` działającego na obecnie publikowanych
uzasadnieniach.

---

## `NN-A-05` — activation height dla precedensu; zakaz semantyki wstecznej

**Teza.** Każda zmiana semantyki normy (S8) niesie `activationLamport`. Wpisy o niższym czasie
logicznym są interpretowane starą `SchemaVersion` (`INV-A-03`).

**Typ argumentu:** niezmiennik (determinizm funkcji przejścia).

**Szkic.** Z THM-A-06: przy `declarativeBackdate = true` funkcja `interpretationAt` zależy nie od
argumentu `at`, lecz od zbioru precedensów znanych w chwili wywołania. Zatem `δ` jest funkcją stanu
**i wall-clock**, co narusza `INV-A-03`. System o funkcji przejścia zależnej od wall-clock nie jest
deterministycznie odtwarzalny; replay jest niemożliwy; audyt jest niemożliwy. Weryfikacja jest
statyczna i `O(|P|)`: `replayDeterministic`.

Wykonany sprawdzian (`10-SPEC.md` §15): sprawa o `Lamport = 100` otrzymuje `SchemaVersion = 2`
z precedensu aktywowanego na 500 w wariancie deklaratywnym, a `SchemaVersion = 1` w wariancie
wersjonowanym.

**Co się psuje bez tego.** Nie da się zadać pytania regresyjnego „czy sprawa `X` byłaby dziś
rozstrzygnięta tak samo?", bo nie ma zdefiniowanego zbioru rekordów objętych migracją
(`10-SPEC.md` §17, wiersz S8: złożoność **nieokreślona**). Znika jedyne narzędzie pomiaru `LOOP-A-03`
i `ATT-A-03`.

**Czego nie przyjmę.** Argumentu, że wsteczność deklaratywna jest wyłącznie retoryką bez skutków
praktycznych, bo spraw prawomocnych się nie wznawia. Skutek nie polega na wznawianiu — polega na tym,
że przy wstecznej narracji **nie istnieje wartość oczekiwana**, względem której można zmierzyć dryf.
Narracja jest tu specyfikacją, a specyfikacja niedeterministyczna psuje testowalność nawet wtedy,
gdy implementacja jest deterministyczna.

**Test falsyfikacji.** Przedstawienie procedury, która przy zachowanej wsteczności deklaratywnej
wyznacza dla dowolnej sprawy historycznej jednoznaczną odpowiedź na pytanie regresyjne.

---

## `NN-A-06` — version vectors znaczeń; zakaz last-write-wins

**Teza.** Każdy termin normatywny użyty w uzasadnieniu niesie `VersionVector`; scalanie równoległych
linii wykładni odbywa się strategią `multi-value`, nigdy LWW (`INV-A-08`).

**Typ argumentu:** kontrprzykład konstrukcyjny (lost update).

**Szkic.** LWW ma udowodnioną własność utraty zapisu: przy zapisach współbieżnych zachowuje jeden
i odrzuca drugi **bez sygnału**. MV-register tej własności nie ma — zwraca zbiór głów i wymusza jawne
rozstrzygnięcie. Kontrprzykład wykonany (`10-SPEC.md` §15): dla wektorów
`vA = {rażące_niedbalstwo: 3}` i `vB = {rażące_niedbalstwo: 2, należyta_staranność: 1}`,
które są `concurrent`, LWW zwraca `conflict: false` (cicha strata `vA`), MV zwraca `conflict: true`.

Odwzorowanie na zjawisko: dwie linie wykładni tego samego terminu rozwijają się równolegle w różnych
gałęziach orzecznictwa; system rozstrzyga je datą nowszego orzeczenia. Jedna linia znika bez wpisu
o tym, że istniała i została odrzucona. To jest `FAIL-A-06` i jest to dokładnie `onto_epistemic_drift`
w postaci mechanicznej.

**Koszt.** Pole metadanych na termin. Bez obliczeń — porównanie wektorów jest `O(|V|)`.

**Czego nie przyjmę.** Zasady „nowsze orzeczenie ma pierwszeństwo" w jakiejkolwiek postaci. To jest
LWW pod inną nazwą i ma dokładnie tę samą własność utraty zapisu.

**Test falsyfikacji.** Wykazanie, że równoległe linie wykładni nie występują — że relacja `dominates`
zachodzi dla każdej pary wersji dowolnego terminu.

---

## `NN-A-07` — dual custody albo jawna flaga single-custody

**Teza.** Każdy fakt `decisive` ma `custodyClass = "dual"` albo wyrok niesie go w
`Completeness.singleCustodyDecisive` (`INV-A-02`).

**Typ argumentu:** niemożliwość (puste quorum intersection).

**Szkic.** Z THM-A-02: dla faktu rozstrzygającego o jedynym posiadaczu, dla którego fakt jest
niekorzystny, nieujawnienie jest strategią dominującą przy `P(wykrycie) → 0`. Zatem fakt nie należy
do przecięcia kworów informacyjnych i **zbieżność jest formalnie niemożliwa**, a nie tylko kosztowna.

Nie żądam zbieżności tam, gdzie jest niemożliwa — to byłby postulat, nie wymóg.
Żądam **oznaczenia**: system musi odróżnić „stan uzgodniony" od „stan uzgodniony poza podzbiorem,
na którym uzgodnienie było wykluczone". Bez tego S4 nie wie, na czym pracuje, a `Verdict` nie niesie
informacji, która jest liderowi znana w chwili commitu.

Rozszerzenie z `disclosureIncentive`: dotyczy to również faktów u posiadaczy **obojętnych**
(bank, operator, szpital, rejestr), bo koszt ujawnienia jest dodatni, a korzyść zerowa.
To jest przewidywanie falsyfikowalne i mniej oczywiste niż samo THM-A-02.

**Czego nie przyjmę.** Zastąpienia flagi domniemaniem materialnoprawnym (przerzuceniem ciężaru dowodu).
Domniemanie zmienia **wynik** przy braku dowodu, ale nie zmienia **obserwowalności** faktu, że dowodu
zabrakło. Jest to rozwiązanie ortogonalne do mojego wymogu, nie substytut, i mogę je przyjąć obok — nie zamiast.

**Test falsyfikacji.** Empiryczne wykazanie, że fakty `decisive ∧ single custody` trafiają do logu
z częstością porównywalną z faktami `dual custody`.

---

## `NN-A-08` — publiczny licznik `force_gas` per organ

**Teza.** Każde rozstrzygnięcie kwestii bez dowodu rozstrzygającego jest oznaczone i zliczone;
`mode = "authority" ⟺ forceGasSpent > 0`; sumy per organ są publiczne (`INV-A-06`).

**Typ argumentu:** niemożliwość wykrycia niewypłacalności + złożoność.

**Szkic.** Z THM-A-04: `chargeUnchecked` nie ma konstruktora błędu, więc wywołujący nie ma czego obsłużyć,
a saldo schodzi poniżej zera bez sygnału. Jedyny odbiornik sygnału jest zewnętrzny, opóźniony o 3–15 lat
[EST] i nieprzypisywalny do konkretnego wydatku. System z wydatkiem bez licznika nie ma DoS resistance,
nie ma backpressure i nie ma degradacji łagodnej — to nie są trzy osobne braki, tylko trzy nazwy
tego samego braku.

Licznik nie wymaga nowej wiedzy: `mode` jest znany liderowi w chwili commitu. Koszt zapisu `O(1)`.

**Dlaczego to nienegocjowalne, mimo że nie zmienia żadnego wyroku.** Bo `ρ` w `LOOP-A-01` jest mnożone
przez obserwowalność. Bez licznika `obs` spada, `ρ → 0`, i warunek rozbiegania `δa > ρ` jest spełniony
bezwarunkowo. Licznik jest zatem **jedyną tanią dźwignią na znak pętli nadrzędnej** — jego wpływ jest
nie na sprawę, lecz na stabilność całego układu.

**Czego nie przyjmę.** Agregatów bez podziału na organy. Podłoga `ρp` z THM-A-07 jest własnością puli;
agregat ogólnokrajowy nie pozwala oszacować `ρ`, bo miesza wariancję wewnątrz- i między-pulową.

**Test falsyfikacji.** Wykazanie, że nadwyżka wariancji między-sędziowskiej przy kontroli na profil
sprawy jest statystycznie nieodróżnialna od zera. Wtedy zagregowany wydatek FG jest bliski zeru
i licznik jest zbędny.

---

## `NN-A-09` — doręczenie oparte na potwierdzeniu, z eskalacją kanału

**Teza.** Domyślnym trybem jest ACK. Fikcja doręczenia jest dopuszczalna wyłącznie po wyczerpaniu
bounded retry z **eskalacją na kanał niezależny** i musi propagować flagę `assumedDelivery`
aż do S7 (`INV-A-09`).

**Typ argumentu:** niemożliwość (dwóch generałów) + korelacja strat.

**Szkic.** Z THM-A-08: common knowledge nie jest osiągalne przy zawodnym kanale w skończonej liczbie
wiadomości, więc jakaś forma `assume` jest konieczna — tego nie kwestionuję. Kwestionuję dwie rzeczy:

1. **Retry na tym samym kanale nie jest drugą próbą.** Drugie awizo pod ten sam nieistniejący adres
   ma `p_loss` skorelowane z pierwszym w stopniu bliskim 1. Formalnie: `P(obie próby nieudane) ≈ p`,
   nie `p²`. Eskalacja na kanał niezależny przywraca mnożenie prawdopodobieństw. To jest ta sama
   poprawka, co w `NN-A-03`, zastosowana do innego zasobu — i to nie jest zbieg okoliczności:
   oba przypadki to redundancja jednorodna udająca niezależną.
2. **Strata jest skorelowana z klasą węzła.** Bezdomność, hospitalizacja, migracja, błąd rejestru —
   wszystkie korelują z byciem stroną słabszą. Zatem błąd nie rozkłada się losowo, tylko koncentruje.

W ścieżce `S1 → S5` (wyrok zaoczny) `Q_pozwany = ∅`, więc przecięcie kworów jest puste **trywialnie**
i cały ciężar spoczywa na `force_gas`. Nieoznaczenie tego stanu jest przemilczeniem informacji znanej
systemowi w chwili commitu.

**Czego nie przyjmę.** Zwiększenia liczby awiz na tym samym kanale jako substytutu eskalacji.
Nie zmienia `p`, zmienia tylko koszt.

**Test falsyfikacji.** Pomiar, że `p_loss` fikcji doręczenia jest nieskorelowane z klasą pozwanego
i mniejsze niż 0.01.

---

## `NN-A-10` — deklaracja `d_max` przed commitem i klasyfikacja nieodwracalności w S7

**Teza.** `RollbackPolicy` jest częścią `Verdict` i jest deklarowana **przed** finalizacją
(`INV-A-07`). Każdy efekt w S7 jest klasyfikowany jako `compensable: boolean` **przed** wywołaniem.

**Typ argumentu:** niezmiennik + kontrprzykład.

**Szkic.** Nieodwracalność ogłoszona po fakcie nie jest właściwością systemu, tylko obserwacją o nim.
Kontrprzykład: sprawa, w której obie strony działają w przekonaniu o dostępności rewizji rozstrzygnięcia
faktycznego, podczas gdy `floorStage = "S3"` czyni je niedostępnym. Obie strony optymalizują pod błędny
model `d_max`, więc ich alokacja `RES-A-07` w S2 jest błędna — a S2 jest jedynym etapem, na którym ta
alokacja ma znaczenie (THM-A-01). Błąd jest zatem **nieodwracalny i wywołany brakiem deklaracji**,
a nie brakiem rewizji.

Dla `RES-A-10`: bez rozdzielenia efektów kompensowalnych od niekompensowalnych system stosuje jeden
próg finalizacji do obu klas. Dwufazowy commit z osobnym progiem dla operacji nieodwracalnych jest
standardem tam, gdzie efekty wychodzą poza system, i jest tani. Warunkiem koniecznym jego działania
jest `NN-A-04` — bez `calibrated.support` progu nie ma czym różnicować. **`NN-A-04` i `NN-A-10`
są zatem powiązane implikacją, nie sąsiedztwem tematycznym.**

**Czego nie przyjmę.** Klasyfikacji nieodwracalności dokonywanej przez organ egzekucyjny w S7.
To za późno: decyzja o wywołaniu została podjęta w S5, na progu, który już nie uwzględnił klasy efektu.

**Test falsyfikacji.** Wykazanie, że strony poprawnie przewidują faktyczne `d_max` i faktyczną
kompensowalność bez ich jawnej deklaracji.

---

## Podsumowanie i struktura zależności

| ID | Twierdzenie | Typ argumentu | Wykrywalność bez wpisu |
|----|-------------|---------------|------------------------|
| `NN-A-01` | append-only + zewnętrzny commit hashy | invariant + counterexample | brak |
| `NN-A-02` | zewnętrzny timestamp wpływu i kolejności | game-theoretic (`β_crit = 0.0066`) | brak |
| `NN-A-03` | heterogeniczna pula weryfikująca | impossibility (podłoga `ρp`) | brak |
| `NN-A-04` | `Completeness` + `calibrated.support` | impossibility of detection | brak |
| `NN-A-05` | activation height precedensu | invariant (determinizm `δ`) | statyczna, ale bez wpisu bezużyteczna |
| `NN-A-06` | version vectors, zakaz LWW | counterexample (lost update) | brak |
| `NN-A-07` | dual custody albo flaga | impossibility (quorum intersection) | brak |
| `NN-A-08` | publiczny licznik FG | impossibility + complexity | tylko post-hoc, 3–15 lat |
| `NN-A-09` | ACK z eskalacją kanału | impossibility (two generals) + korelacja | częściowa |
| `NN-A-10` | `d_max` i `compensable` przed commitem | invariant + counterexample | brak |

**Zależności (nie są to niezależne postulaty):**

```
NN-A-01  ──podstawa dla──▶  NN-A-05, NN-A-06     (wersjonowanie na mutowalnym nośniku jest puste)
NN-A-04  ──warunek dla──▶   NN-A-10               (bez pewności nie ma czym różnicować progu)
NN-A-03  ──ta sama wada──   NN-A-09               (redundancja jednorodna udająca niezależną)
NN-A-08  ──dźwignia na──▶   LOOP-A-01             (jedyny tani wpływ na znak pętli nadrzędnej)
```

**Wspólna cecha wszystkich dziesięciu:** żaden nie wymaga od systemu nowej wiedzy. Wszystkie żądane
pola — `mode`, `Completeness`, `custodyClass`, `activationLamport`, `VersionVector`, `reputationPool`,
`compensable`, `d_max`, timestamp — są **znane liderowi w chwili commitu** i po prostu nie są zapisywane.
Koszt jest kosztem metadanych. Dlatego uważam je za nienegocjowalne: ustępstwo w tych punktach
nie kupuje ani wydajności, ani prostoty — kupuje wyłącznie nieobserwowalność.

---

## Co **jest** negocjowalne (dla porządku)

Żeby lista powyżej miała wagę, muszę powiedzieć, czego nie bronię:

- **Konkretne wartości progów.** `θ_H`, `τ`, `d_max`, `ttl` prekluzji — wszystkie do strojenia.
- **Kształt `force_gas` jako skalara.** Może być wektorem per typ kwestii; nie mam argumentu za skalarem.
- **`D* = 100 du` i `γ = 0.02`.** Kalibracja, nie twierdzenie. Wyprowadzony jest `obs_crit = δa/ρ_max`, nie `D*`.
- **Model `M/M/1`.** Rozkłady są w rzeczywistości grubo-ogonowe; `M/G/1` byłby lepszy i pogorszyłby
  moje wnioski, nie poprawił.
- **Sam mechanizm prekluzji.** Z THM-A-11 jest on racjonalną odpowiedzią na `B < C`. Kwestionuję jego
  **tryb awarii** (`fail-silent` zamiast `fail-loud`), nie jego istnienie.
- **Wybór między naprawą przez `B` a naprawą przez `C`.** Model dostarcza tożsamości substytucji
  `FG + P = min((C−B)/c, N_issues)`, ale nie preferencji co do tego, którą stronę równania ruszać.

---

*Agent A · tor I/II · Justice-as-Code v1.0*
