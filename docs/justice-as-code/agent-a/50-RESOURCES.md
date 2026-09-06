# 50-RESOURCES — Agent A · tor I (suwerenny)

Budżet zasobów: co jest skończone, w jakich jednostkach, kto płaci, jak się miarkuje,
co się dzieje przy wyczerpaniu.

Zasada porządkująca: **zasób bez metering nie jest zasobem, tylko życzeniem.**
Kolumna „miarkowanie" jest tu ważniejsza od kolumny „podaż", bo o zachowaniu systemu przy
wyczerpaniu decyduje wyłącznie to, czy istnieje sprawdzenie przed wydatkiem.

---

## 1. `RES-A-01` — `force_gas` (FG)

### 1.1 Definicja operacyjna

**1 FG = jedno rozstrzygnięcie kwestii spornej, dla której w logu sprawy nie istnieje dowód
rozstrzygający, przyjęte w sposób niefalsyfikowalny przez węzeł zewnętrzny.**

Definicja jest operacyjna, nie ocenna: nie mówi, że rozstrzygnięcie jest błędne. Mówi, że **nie da się
sprawdzić, czy jest poprawne**, bo brak jest wejścia, z którego wynikałoby. To rozróżnienie jest całą
treścią pojęcia i konsekwentnie odróżnia `force_gas` od „złego wyroku".

### 1.2 Proxy pomiarowe (bez zmiany prawa, z samego tekstu uzasadnień)

| Proxy | Jednostka | Uwaga |
|---|---|---|
| liczba ustaleń w formie „sąd dał / nie dał wiary" bez wskazania sprawdzalnej przesłanki | zliczenie | najbliższy definicji |
| liczba wniosków dowodowych oddalonych z uzasadnieniem typu „okoliczność dostatecznie wyjaśniona" | zliczenie | mierzy `majesty_switch` przez odmowę wejścia |
| liczba faktów `decisive ∧ custodyClass = "single"` przyjętych bez przymusu procesowego | zliczenie | mierzy THM-A-02 |
| entropia rozkładu wyroków dla spraw o tym samym profilu wejścia, między referatami | bity | mierzy udział `authority` agregatowo |

Ostatnie proxy jest najmocniejsze i **jest obliczalne z już publikowanych danych**: gdyby
rozstrzygnięcia były funkcją wejścia, wariancja między-sędziowska przy kontroli na profil sprawy
byłaby bliska zeru. Nadwyżka wariancji jest dolnym oszacowaniem zagregowanego wydatku FG.
Że ta wielkość nie jest publikowana, jest instancją `systemic_blindness` (`LOOP-A-04`).

### 1.3 Kurs wymiany i cena cienia

`force_gas` nie jest emitowany — jest **substytutem nakładu uwagi**, więc ma cenę wyrażalną w
`RES-A-03`. Przy `c_kwestia = 0.5` judge-hour na rzetelne rozstrzygnięcie jednej kwestii spornej [EST]:

```
1 FG  ≈  0.5 judge-hour nakładu unikniętego
      ≈  156 PLN [EST]      (przy 313 PLN/judge-hour, sekcja 3)
```

To jest **cena cienia, nie cena rynkowa**: nikt tych 156 PLN nie płaci ani nie oszczędza w budżecie.
Kwota mówi tylko, ile nakładu zostało zastąpione autorytetem. Jej sens jest porównawczy:
przy 800 sprawach na referat i średnio 4 FG na sprawę [EST] jeden referat „emituje" rocznie
ekwiwalent ~500 tys. PLN nieponiesionego nakładu — czyli mniej więcej tyle, ile kosztuje samo stanowisko.
Rząd wielkości jest tu istotny: **wydatek FG nie jest marginalną korektą, tylko wielkością
porównywalną z całym budżetem operacyjnym.**

### 1.4 Podaż, płatnik, wyczerpanie

| | |
|---|---|
| **Podaż** | nieograniczona lokalnie, ograniczona globalnie. Sąd zawsze może wydać wyrok; ograniczeniem jest `RES-A-02`. |
| **Płatnik natychmiastowy** | strona przegrywająca kwestię — ponosi 100 % kosztu prywatnego |
| **Płatnik odroczony** | populacja, z opóźnieniem 3–15 lat, przez `RES-A-02` |
| **Miarkowanie** | **brak.** `chargeUnchecked` (`10-SPEC.md` §6): typ zwracany nie ma konstruktora błędu |
| **Przy wyczerpaniu** | nie `out of gas`, tylko `ATT-A-04` (fork). Detekcja post-hoc i zewnętrzna |

Rozdzielenie płatnika natychmiastowego od odroczonego jest tu kluczowe i ma znany odpowiednik:
to **eksternalizacja**. Koszt prywatny jest skoncentrowany i natychmiastowy, koszt systemowy
rozproszony i odroczony — czyli dokładnie struktura, przy której racjonalny lokalnie węzeł
przeinwestowuje w wydatek. Nie potrzeba tu żadnej hipotezy o złej woli (`ASSUMPTION A1`).

### 1.5 Dolna granica podaży: `FG_min > 0`

Z THM-A-11: przy `B < C` liczba kwestii domykanych bez pełnego przetworzenia dowodu jest
deterministycznie dodatnia. Tożsamość substytucji (`LOOP-A-08`):

```
FG + P  =  min( (C − B)/c_kwestia ,  N_issues )
```

gdzie `P` = kwestie usunięte prekluzją, `N_issues` = liczba kwestii spornych.

| profil sprawy [EST] | `B` [h] | `C` [h] | luka [h] | `FG + P` |
|---|---|---|---|---|
| 300 spr./rok, 60 str., 6 kwestii | 5.3 | 2.0 | 0.0 | **0.0** |
| 500 spr./rok, 200 str., 12 kwestii | 3.2 | 6.7 | 3.5 | 6.9 |
| 800 spr./rok, 600 str., 20 kwestii | 2.0 | 20.0 | 18.0 | **20.0 (nasycenie)** |
| 800 spr./rok, 2000 str., 35 kwestii | 2.0 | 66.7 | 64.7 | **35.0 (nasycenie)** |

`ASSUMPTION A5`: `C = 1.6 × czas czytania` (czytanie to ~62 % całości: reszta to rozprawa, narada, uzasadnienie).

**Dwa wiersze nasycenia są najostrzejszym wynikiem tego pliku.** „Nasycenie" znaczy, że
`FG + P = N_issues`: **każda** kwestia sporna jest albo usunięta prekluzją, albo domknięta autorytetem.
Nie część, nie większość — wszystkie. W tym reżimie tryb `evidence` nie występuje w ogóle,
a wyrok jest funkcją wyłącznie tego, które kwestie system wpuścił, i jak lider je domknął.

Zwróć uwagę na pierwszy wiersz: przy małym referacie i cienkich aktach `FG = 0` i system działa
zgodnie z deklaracją. **Ten model nie twierdzi, że system nie działa. Twierdzi, że działa poniżej
progu `C > B` i przechodzi w inny tryb powyżej, nie zgłaszając przejścia.** Brak zgłoszenia to
`FAIL-A-03`.

`F₀ = 2` FG/sprawę użyte w `LOOP-A-01` jest **średnią populacyjną**, zdominowaną przez sprawy z
pierwszego wiersza. Rozkład jest silnie skośny; wartość średnia jest tu najmniej informatywną statystyką.

---

## 2. `RES-A-02` — pula legitymacji (L)

| | |
|---|---|
| **Jednostka** | punkt procentowy (pp) indeksu złożonego, `L ∈ [0, 100]` |
| **Skończony** | tak |
| **Podaż** | regeneracja `ρ_max · obs` = do 0.05 pp/rok przy pełnej obserwowalności [EST] |
| **Płatnik** | populacja; wydatek jest zbiorczy, nieprzypisywalny do sprawy |
| **Miarkowanie** | brak pre-check; pomiar wyłącznie post-hoc i pośredni |

**Składowe indeksu i ich jednostki** (proxy, wszystkie mierzalne bez zmiany prawa):

| Składowa | Jednostka | Kierunek |
|---|---|---|
| udział rozstrzygnięć wykonanych dobrowolnie, bez wszczęcia egzekucji (S7) | % | ↑ dobrze |
| odsetek orzeczeń zaskarżanych | % | ↓ dobrze |
| udział sporów kierowanych poza system (arbitraż, mediacja wymuszona kosztem, rezygnacja z dochodzenia) | % | ↓ dobrze |
| udział spraw kończonych ugodą **po** wyroku I instancji | % | ↓ dobrze — mierzy nieufność do finalizacji |

Pierwsza składowa jest najlepsza, bo jest **behawioralna, nie deklaratywna**: mierzy, czy węzły
akceptują commit bez przymusu. To dosłownie miara tego, czy finalizacja jest przyjmowana jako
finalizacja. Ankiety zaufania są tu najsłabszym proxy i wymieniam je tylko po to, żeby zaznaczyć,
że ich nie używam.

**Kluczowa własność:** `ρ` jest mnożone przez obserwowalność. Rozstrzygnięcie poprawne, ale
nieodróżnialne od autorytatywnego, **nie regeneruje puli** — obserwator nie ma z czego wnioskować
(THM-A-05). Stąd `LOOP-A-01` i próg `D_crit = 50 du`.

**Równowaga.** Nawet przy `obs = 1`: `e* = δF₀/(ρ_max − δa) = 40 pp`. System nie wraca do pełnej puli
nigdy, bo `F₀ > 0` jest wymuszone przez `B < C`.

---

## 3. `RES-A-03` — budżet uwagi lidera (judge-hour)

| | |
|---|---|
| **Jednostka** | judge-hour |
| **Skończony** | tak, twardo |
| **Podaż** | ~1600 h/rok efektywnie na orzekanie [EST] (`ASSUMPTION A4`) |
| **Płatnik** | budżet publiczny; ~313 PLN/judge-hour przy pełnym koszcie stanowiska 500 tys. PLN/rok [EST] |
| **Miarkowanie** | pośrednie, przez rozdział referatu; **nie ma admission control per sprawa** |

| referat | budżet na sprawę |
|---|---|
| 300 spraw/rok | 5.3 h |
| 500 spraw/rok | 3.2 h |
| 800 spraw/rok | 2.0 h |

Budżet obejmuje **całość**: akta, rozprawę, naradę, uzasadnienie.

**Brak admission control jest tu istotniejszy od wielkości podaży.** W systemie z ograniczoną
przepustowością i bez backpressure kolejka rośnie do granicy wyznaczonej przez cierpliwość klientów,
nie przez pojemność. To jest `LOOP-A-06` / `ATT-A-02`. Zauważ, że rozwiązania znane z systemów
kolejkowych — load shedding, admission control, priority queues z jawnym SLA — są w tym kontekście
albo zakazane (odmowa wymiaru sprawiedliwości), albo nieskodyfikowane. Zakaz load sheddingu przy
braku backpressure jest kombinacją, która **gwarantuje** degradację jakości zamiast degradacji
dostępności: system nie może odmówić, więc obniża nakład na sprawę, czyli podnosi `FG`.

To jest ścisła analogia do serwera bez limitu współbieżności: nie zwraca `503`, tylko obsługuje
wszystko coraz wolniej i coraz gorzej, aż do collapse. Przenosi się tryb awarii, nie nastrój.

---

## 4. `RES-A-04` — czas kalendarzowy i lease (dni)

| | |
|---|---|
| **Jednostka** | dzień |
| **Skończony** | tak — terminy zawite są nieodnawialne |
| **Podaż** | asymetryczna: strona ma terminy twarde, organ ma terminy instrukcyjne |
| **Płatnik** | strona ponosi utratę uprawnienia przy przekroczeniu; organ nie ponosi nic |
| **Miarkowanie** | jednostronne |

**Asymetria jest tu treścią, nie skargą.** Lease w systemach rozproszonych działa, bo jego wygaśnięcie
ma konsekwencję **po obu stronach**: klient traci prawo do zapisu, ale i lider traci prawo do bycia
liderem. Tutaj lease strony wygasa z utratą uprawnienia, lease organu nie wygasa wcale — nie ma
view-change. Formalnie: to nie jest lease, tylko **jednostronny timeout**, a jednostronny timeout
nie daje żadnej z gwarancji, dla których lease się wprowadza (w szczególności nie zapobiega
sytuacji, w której lider trzyma zasób bez postępu).

To jest jedno z dwóch miejsc, w których twierdzę wprost: **instytucja terminu instrukcyjnego jest
niepoprawną implementacją lease**, i nie jest to kwestia stopnia, tylko brakującej połowy mechanizmu.

---

## 5. `RES-A-05` — custody dowodu (liczba niezależnych posiadaczy)

| | |
|---|---|
| **Jednostka** | liczba posiadaczy o rozbieżnych interesach |
| **Skończony** | tak, i najczęściej równy 1 |
| **Podaż** | ustalona **poza systemem**, w chwili powstania faktu (S0) — system nie może jej zwiększyć |
| **Płatnik** | strona żądająca, kosztem `RES-A-07` |
| **Miarkowanie** | brak — system nie klasyfikuje faktów po custody |

To jest zasób najbardziej niedoceniany w modelu, bo **jest ustalony przed wszczęciem**.
Cała reszta protokołu operuje na tym, co zostało utrwalone w S0. Z THM-A-02: dla
`custodyClass = "single"` zbieżność jest formalnie niemożliwa bez przymusu.
Z `disclosureIncentive`: także fakty u posiadaczy **obojętnych** wymagają przymusu, bo koszt
ujawnienia jest dodatni, a korzyść zerowa.

**Konsekwencja projektowa, jedyna sensowna:** skoro podaży nie da się zwiększyć w trakcie
postępowania, jedynym punktem interwencji jest S0 — obowiązki retencyjne i log w chwili powstania
faktu. To jest dokładnie ta sama zasada, co „nie da się dodać obserwowalności do systemu po
incydencie": telemetria musi być w kodzie przed, nie po.

---

## 6. `RES-A-06` — głębokość rollbacku (instancje)

| | |
|---|---|
| **Jednostka** | instancja |
| **Skończony** | tak, `d_max = 2` (wyjątkowo 3) |
| **Podaż** | stała, niezależna od wagi sprawy i od `p_corrupt` |
| **Płatnik** | strona (opłata, czas), system (`RES-A-03` × `d`) |
| **Miarkowanie** | formalne (dopuszczalność), nie merytoryczne |

**Podłoga rollbacku jest wyżej niż źródło większości defektów.** `floorStage = "S3"`, a defekty
powstają w S1/S2 (THM-A-01). Zwiększanie `d_max` nie pomaga: przy `ρ = 0.7` [EST] trzecia instancja
podnosi dostępność o 0.3 pp, dziesiąta o 0.03 pp (THM-A-07).

**To jest zasób, którego zwiększanie jest niemal czystym kosztem.** Każda dodatkowa instancja zużywa
`RES-A-03` (mnożąc obciążenie, a więc podnosząc `ρ_q` i przez `LOOP-A-07` podnosząc `FG`
we wszystkich sprawach) w zamian za poprawę trafności o wielkość ograniczoną podłogą `ρ·p`.
Przy dostatecznie wysokim `ρ_q` **dodanie instancji pogarsza system netto** — koszt jest globalny
i nieliniowy, korzyść lokalna i ograniczona z góry.

---

## 7. `RES-A-07` — budżet strony (PLN)

| | |
|---|---|
| **Jednostka** | PLN |
| **Skończony** | tak, asymetrycznie |
| **Podaż** | egzogeniczna |
| **Płatnik** | strona |
| **Miarkowanie** | rynkowe |

Znaczenie w modelu jest wąskie i precyzyjne: budżet określa `r` — liczbę rund w `DiscoverySync`
(`10-SPEC.md` §17). Ponieważ `r` jest ograniczone budżetem, a nie zbieżnością, **pokrycie stanu jest
funkcją budżetu**. Nie jest to teza o niesprawiedliwości; to odczytanie złożoności `O(r·|F|)`
przy `r = f(budżet)`.

Wniosek pochodny, mniej oczywisty: **zwiększenie budżetu strony słabszej nie wyrównuje pokrycia
symetrycznie**, bo jej żądania dotyczą faktów `single custody` u przeciwnika (kosztowne, wymagają
przymusu, wysokie `P(oddalenia)`), a żądania strony silniejszej dotyczą faktów, które i tak by
ujawniła. Kurs wymiany PLN → pokrycie stanu jest różny dla obu stron, i różnica ta ma źródło
w rozkładzie custody z S0 (`RES-A-05`), a nie w procedurze.

---

## 8. `RES-A-08` — kotwica semantyczna (θ)

| | |
|---|---|
| **Jednostka** | `θ` — siła powrotna, 1/rok |
| **Skończony** | tak; `θ` maleje z każdym aktem przesłonięcia tekstu wykładnią |
| **Podaż** | ustanawiana aktem prawodawczym, zużywana orzecznictwem |
| **Płatnik** | wszyscy uczestnicy, przez wzrost kosztu przewidywania |
| **Miarkowanie** | brak — nie istnieje licznik odejść od tekstu |

Przy `θ = 0` znaczenie jest błądzeniem losowym: `sd = σ√t`, przekroczenie 0.5 po 17 latach
[EST, `σ = 0.12`/√rok]. Przy `θ = 0.2` proces jest stacjonarny z `sd(∞) = 0.19`.

**`θ` jest zasobem, bo jest wyczerpywalne i nieodnawialne w krótkim okresie.** Każde orzeczenie
rozszerzające znaczenie ponad tekst zmniejsza wagę tekstu jako punktu przywracającego. Odbudowa
`θ` wymaga aktu prawodawczego, czyli cyklu o rzędzie 10⁰–10¹ lat, podczas gdy zużycie następuje
w cyklu orzeczniczym o rzędzie 10⁻¹ roku. **Stosunek stałych czasowych zużycia do odbudowy wynosi
~10²** — to jest ta sama struktura, co w każdym systemie, w którym budżet jest konsumowany szybciej,
niż jest uzupełniany, i ma ten sam skutek.

---

## 9. `RES-A-09` — obserwowalność (obs, du)

| | |
|---|---|
| **Jednostka** | `obs ∈ [0,1]`; wydatek w drift-unit: `1 du = 1 pp` utraty rozróżnialności |
| **Skończony** | tak, `D* = 100 du` |
| **Podaż** | odbudowywalna, ale tylko przez dodanie pól, których emisja jest sprzeczna z równowagą (THM-A-05) |
| **Płatnik** | wszyscy; wydatkowane głównie przez ustępstwa (tor II) |
| **Miarkowanie** | `drift()` z `10-SPEC.md` §14 |

**To jest zasób nadrzędny w tym modelu.** Wchodzi multiplikatywnie do regeneracji `RES-A-02`,
więc jego wyczerpanie unieważnia wszystkie pozostałe budżety naraz. Dwa progi:

| Próg | Wartość | Znaczenie |
|---|---|---|
| `D_crit` | 50 du | znak `LOOP-A-01` zmienia się na dodatni — utrata **sterowalności** |
| `D*` | 100 du | `obs = 0`, `ρ = 0`, rozbieganie bezwarunkowe — utrata **sensu** |

Wiążący jest ten pierwszy. Wyprowadzenie: `obs_crit = δa/ρ_max = 0.5` (`20-DYNAMICS.md` §1).

---

## 10. `RES-A-10` — nieodwracalność egzekucji (S7)

| | |
|---|---|
| **Jednostka** | zdarzenie niekompensowalne |
| **Skończony** | podaż nieograniczona, **odwracalność zerowa** |
| **Płatnik** | podmiot egzekucji |
| **Miarkowanie** | brak — system nie klasyfikuje efektów po kompensowalności przed ich wywołaniem |

Ten zasób jest asymetryczny i dlatego najgroźniejszy. Część efektów S7 jest kompensowalna
z dobrą aproksymacją (świadczenie pieniężne + odsetki), część nie jest wcale (pozbawienie wolności,
rozdzielenie rodziny, likwidacja przedsiębiorstwa, upływ czasu życia).

W systemach z efektami ubocznymi standardem jest **rozdzielenie ścieżki commit od ścieżki side-effect**
i wymóg, by efekty niekompensowalne były wywoływane dopiero po finalizacji o wyższym progu pewności
(dwufazowy commit z osobnym progiem dla operacji nieodwracalnych). Tutaj jest jeden próg dla obu klas,
a `Verdict` nie niesie `calibrated.support`, więc **próg nie może być różnicowany po pewności, bo
pewność nie jest emitowana**. Pole `compensable` istnieje w `EntryKind.execution` w mojej specyfikacji
właśnie po to, by tę klasyfikację wymusić przed wywołaniem.

To domyka łańcuch: `systemic_blindness` (brak `calibrated`) → brak różnicowania progu → efekty
niekompensowalne wywoływane przy tej samej pewności co kompensowalne. Trzy elementy są ze sobą
związane implikacją, a nie jedynie współwystępują.

---

## 11. Tabela zbiorcza

| ID | Zasób | Jednostka | Skończony | Płatnik | Miarkowanie | Przy wyczerpaniu |
|----|-------|-----------|-----------|---------|-------------|------------------|
| `RES-A-01` | `force_gas` | FG (≈0.5 judge-h ≈ 156 PLN [EST]) | globalnie tak | przegrywający natychmiast, populacja z opóźnieniem | **brak pre-check** | `ATT-A-04` fork |
| `RES-A-02` | pula legitymacji | pp indeksu | tak | populacja | post-hoc, pośrednie | fork |
| `RES-A-03` | uwaga lidera | judge-hour (313 PLN [EST]) | tak, twardo | budżet publiczny | brak admission control | degradacja jakości, nie dostępności |
| `RES-A-04` | czas / lease | dzień | tak | wyłącznie strona | jednostronne | utrata uprawnienia strony; organ nic |
| `RES-A-05` | custody dowodu | liczba posiadaczy | tak, zwykle 1 | strona żądająca | brak klasyfikacji | zbieżność formalnie niemożliwa |
| `RES-A-06` | głębokość rollbacku | instancja | tak, `d ≤ 2` | strona i system | formalne | podłoga `ρ·p` |
| `RES-A-07` | budżet strony | PLN | tak, asymetrycznie | strona | rynkowe | `r` maleje, pokrycie stanu maleje |
| `RES-A-08` | kotwica semantyczna | `θ` [1/rok] | tak | wszyscy | brak | `ATT-A-05` dyfuzja |
| `RES-A-09` | obserwowalność | `obs`, du | tak, `D* = 100 du` | wszyscy | `drift()` | `ATT-A-01` |
| `RES-A-10` | nieodwracalność S7 | zdarzenie | odwracalność 0 | podmiot egzekucji | brak | trwałe |

---

## 12. Wniosek zbiorczy

Dziesięć zasobów, z czego **osiem nie ma miarkowania przed wydatkiem**. Wyjątki: `RES-A-04`
(miarkowany jednostronnie — czyli w połowie) i `RES-A-07` (miarkowany rynkowo, poza systemem).

W systemie rozproszonym brak pre-execution metering jest pojedynczą, dobrze znaną przyczyną
całej rodziny awarii: nie ma DoS resistance, nie ma backpressure, nie ma degradacji łagodnej,
a stan niewypłacalności jest osiągalny bez sygnału. Wszystkie cztery skutki występują tu w postaci
opisanej w `20-DYNAMICS.md`, i występują **w tej samej kolejności i z tych samych powodów**,
co w systemach obliczeniowych bez licznika gazu.

Koszt dodania metering do ośmiu pozostałych zasobów jest w każdym przypadku kosztem **metadanych**,
nie obliczeń: `Completeness`, `ConvergenceCertificate`, `GasMeter`, `VersionVector`, `reputationPool`,
`compensable`, zewnętrzny timestamp, `activationLamport`. Żadne z tych pól nie wymaga nowej wiedzy —
wszystkie są znane liderowi w chwili commitu i po prostu nie są zapisywane.

To jest ostateczna forma tezy tego modelu: **problemem nie jest brak informacji w systemie,
tylko brak jej emisji na zewnątrz — a brak emisji jest równowagą (THM-A-05), nie zaniedbaniem.**

---

*Agent A · tor I · Justice-as-Code v1.0*
