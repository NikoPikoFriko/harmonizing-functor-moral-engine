# Faza konsensusowa — reguły scalania (v1.0)

Dokument koordynacyjny. Powstaje **przed** wynikami agentów, celowo: reguły scalania ustalone po zobaczeniu
wyników są już wynikiem negocjacji, a nie jej ramą. Agent, który zna kryterium scalania z góry,
nie może go ustawić pod siebie po fakcie.

Wejście: `docs/justice-as-code/agent-{a,b,c}/` zgodne z [`PROTOCOL.md`](./PROTOCOL.md).
Wyjście: `docs/justice-as-code/consensus/` (`MERGED-SPEC.md`, `CONFLICTS.md`, `DRIFT-LEDGER.md`, `merged.json`).

---

## 1. Dlaczego konsensus nie jest tu wartością domyślną

Konsensus jest **kosztem transakcyjnym płaconym za możliwość współdziałania**, a nie kryterium prawdy.
Uśrednienie trzech modeli nie daje modelu lepszego niż najlepszy z nich — daje model, którego
żaden autor nie broni. To jest dokładnie tryb awarii instytucji, który badamy.

Stąd trzy reguły nadrzędne:

**R1 — konsensus nie tworzy prawdy.** Zgodność trzech agentów nie jest argumentem. Argumentem jest dowód,
złożoność, kontrprzykład albo wynik z teorii gier. Jeżeli trzy modele zgadzają się bez argumentu,
zgodność jest oznaczana jako `AGREEMENT-UNARGUED` i traktowana jak dług, nie jak wynik.

**R2 — ustępstwo jest zawsze zapisem księgowym.** Scalenie nie kasuje toru suwerennego.
`00-MODEL.md` każdego agenta pozostaje nienaruszony na zawsze. `MERGED-SPEC.md` jest warstwą *nad* nimi,
z jawnym wskazaniem, czyj model został osłabiony i o ile.

**R3 — nienegocjowalne blokuje scalenie.** Wpis `NN-*` może zostać usunięty z drogi wyłącznie przez
**formalne obalenie** (wskazanie błędu w dowodzie, kontrprzykład, wykazanie, że przesłanka nie zachodzi).
Nie może zostać usunięty przez większość, przez „kompromis”, przez zmęczenie ani przez orkiestratora.
Orkiestrator (czyli agent-rodzic scalający) **nie ma prawa rozstrzygnięcia autorytatywnego** — to jest
`force_gas` i jego użycie tutaj byłoby odtworzeniem badanej patologii wewnątrz narzędzia do jej badania.

---

## 2. Procedura scalania

### Krok 1 — wyrównanie adresów
Zbuduj tablicę korespondencji między prymitywami agentów po osi `S0..S8` i po kluczach zjawisk z §2 protokołu.
Trzy rodzaje relacji, każda jawnie oznaczona:

| Relacja | Znaczenie |
|---------|-----------|
| `SAME` | ten sam obiekt pod różnymi nazwami — łączymy, zachowując oba ID |
| `ORTHOGONAL` | różne obiekty, oba potrzebne — oba wchodzą do scalenia |
| `RIVAL` | wzajemnie wykluczające się opisy tego samego obiektu — idą do `CONFLICTS.md` |

Zakaz: nie wolno oznaczyć jako `SAME` dwóch rzeczy tylko dlatego, że mają podobną nazwę.
Kryterium tożsamości jest **zachowanie**: te same warunki poprawności, ten sam tryb awarii, ta sama złożoność.

### Krok 2 — kwalifikacja konfliktów
Każdy `RIVAL` dostaje jedną z etykiet:

- `DECIDABLE` — da się rozstrzygnąć argumentem formalnym; rozstrzygnij i zapisz dowód;
- `EMPIRICAL` — rozstrzygalny danymi, których nie mamy; zapisz **eksperyment**, który by go rozstrzygnął (co zmierzyć, jaki próg, jaki wynik falsyfikuje którą stronę);
- `FOUNDATIONAL` — wynika z różnicy aksjomatów soczewek; **nie rozstrzygamy**, utrwalamy oba warianty jako równoległe gałęzie z warunkami stosowalności.

`FOUNDATIONAL` nie jest porażką scalenia. Sztuczne rozstrzyganie takich konfliktów jest tym,
co w systemie prawnym produkuje orzeczenia niemożliwe do przewidzenia z góry.

### Krok 3 — księga dryfu łącznego
Zsumuj ustępstwa wszystkich agentów w jedną księgę. Dla każdego wpisu zachowaj koszt jednostkowy,
funkcję kumulacji i predykat odwołania. Następnie policz:

$$D_{total}(t) = \sum_{i \in \{A,B,C\}} \sum_{k} c_{i,k} \cdot f_{i,k}(t)$$

gdzie $c$ to koszt jednostkowy, a $f$ funkcja narastania danego ustępstwa.

Obowiązkowo raportuj trzy liczby:
1. **$D_{total}(0)$** — koszt natychmiastowy samej możliwości współpracy;
2. **$t^{*}$** — moment przekroczenia progu, po którym scalony model przestaje odpowiadać na pytanie, dla którego powstał;
3. **$N^{*}$** — liczba dodatkowych ustępstw do tego progu przy obecnym tempie.

Jeżeli $N^{*}$ jest małe (rząd jedności), scalenie należy oznaczyć jako `FRAGILE` i to jest wynik badawczy,
nie usterka procesu: pokazuje, że pole ma za mało wspólnej struktury, żeby znieść współpracę bez utraty treści.

### Krok 4 — jednostki i zasoby
Scal `50-RESOURCES.md` do jednej tablicy zasobów. Wymóg twardy: **jednostki muszą być przeliczalne albo jawnie
niewspółmierne**. Niewspółmierność jest dopuszczalnym wynikiem; ukryte przeliczanie niewspółmiernych jednostek
przez wspólny mianownik (typowo: pieniądz albo „waga interesu”) jest zakazane i oznaczane jako `FALSE-COMMENSURATION`.
To jest dokładnie ta operacja, którą system prawny wykonuje milcząco i której skutki badamy.

### Krok 5 — test odwracalności
Dla scalonego modelu sprawdź: czy z `MERGED-SPEC.md` da się odtworzyć każdy z trzech modeli suwerennych
przez cofnięcie zapisanych ustępstw? Jeżeli nie — scalenie utraciło informację nieodwracalnie i musi zostać
oznaczone `LOSSY` ze wskazaniem, co dokładnie przepadło. Scalenie bezstratne jest celem;
scalenie stratne jest dopuszczalne tylko z jawną listą strat.

---

## 3. Antywzorce scalania (odrzucane automatycznie)

| Antywzorzec | Objaw | Dlaczego odrzucany |
|-------------|-------|--------------------|
| `AVERAGING` | „prawda leży pośrodku” dwóch modeli | średnia dwóch niesprzecznych z sobą modeli zwykle nie spełnia niezmienników żadnego |
| `AUTHORITY-CUT` | orkiestrator rozstrzyga, bo trzeba iść dalej | to jest `majesty_switch` — patologia, którą modelujemy |
| `VOCABULARY-PEACE` | konflikt znika po ujednoliceniu nazw | konflikt zachowań nie znika przez zmianę nazw; wraca w trybie awarii |
| `SILENT-WEAKENING` | niezmiennik zostaje osłabiony bez wpisu w księdze | ustępstwa nieksięgowane to dokładnie mechanizm kumulacji dryfu |
| `SCOPE-ESCAPE` | konflikt „poza zakresem” | zakres wolno zawęzić tylko przed poznaniem konfliktu, nie po |

---

## 4. Kryterium zakończenia

Faza konsensusowa jest zamknięta, gdy zachodzą wszystkie:

1. każdy `RIVAL` ma etykietę i, jeśli `DECIDABLE`, rozstrzygnięcie z dowodem;
2. każdy `EMPIRICAL` ma zaprojektowany eksperyment falsyfikujący;
3. każdy `FOUNDATIONAL` ma zapisane warunki stosowalności obu gałęzi;
4. księga dryfu podaje $D_{total}(0)$, $t^{*}$ i $N^{*}$;
5. żaden `NN-*` nie został pominięty bez formalnego obalenia;
6. test odwracalności wykonany, straty (jeśli są) wyliczone.

Brak zgody nie blokuje zamknięcia. **Ukryta niezgoda — blokuje.**

---

*Harmonizing Functor Collective · Justice-as-Code · faza konsensusowa v1.0*
