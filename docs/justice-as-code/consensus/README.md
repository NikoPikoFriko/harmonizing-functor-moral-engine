# Justice-as-Code — indeks katalogu `docs/justice-as-code/`

Katalog zawiera modele systemu sprawiedliwości i kodeksu prawnego traktowanych jako code base, zbudowane
przez trzech agentów pracujących **w torach suwerennych** — każdy w innej soczewce teoretycznej, żaden nie
czytał artefaktów pozostałych — oraz wynik **fazy konsensusowej**, w której trzy modele zostały wyrównane
adresowo, skonfrontowane i scalone w warstwę nadrzędną. Podział na tory nie jest organizacyjny, tylko
metodologiczny: zbieżność trzech niezależnych soczewek na tym samym zdaniu jest dowodem tylko wtedy, gdy
przesłanki są rozłączne, a zbieżność bez argumentu jest długiem, nie wynikiem (`CONSENSUS-PHASE.md` R1).
Modele suwerenne są **nietykalne** i pozostają w postaci sprzed konsensusu; wszystko, co faza konsensusowa
ustaliła, leży w `consensus/` jako warstwa **nad** nimi, z jawnym wskazaniem przy każdym elemencie, czyj
model został osłabiony i o ile, w jednostce tego agenta.

---

## Trzy soczewki i ich tezy

| | **Agent A** | **Agent B** | **Agent C** |
|---|---|---|---|
| **Soczewka** | systemy rozproszone, protokoły konsensusu | systemy typów, kompilatory, weryfikacja formalna | teoria sterowania, mechanism design, SRE |
| **Teza główna** | postępowanie to *replicated state machine bez replikacji*: `n = 1`, więc `f_max = 0`; quorum intersection jest strukturalnie niespełnialne na faktach rozstrzygających; wymuszona terminacja domykana wydatkiem `force_gas` | język o celowo niepełnej specyfikacji z uprzywilejowanym `unsafeCoerce` bez etykiety blame; twierdzenia o poprawności całości są wakacyjne, bo specyfikacja jest zdefiniowana jako wyjście oracle'a | pętla domknięta wokół legitymacji `L`, nie wokół jakości orzekania `q`; para `(q, Θ)` strukturalnie nieobserwowalna (`rank 𝒪 = 1 < 2`); układ bistabilny, drugi atraktor to równowaga best-response osiągalna bez złej woli |
| **Nienegocjowalne** | 10 | 8 | 8 (zbiór minimalny `{NN-C-01, NN-C-02, NN-C-03}`) |
| **Ustępstwa przyznane** | 4 z 8 kandydatów | 9 | 9 |
| **Jednostka dryfu** | `du` — utrata 1 pp zdolności zewnętrznego obserwatora do odróżnienia `evidence-commit` od `authority-commit` | `vbit` — bit utraconej zdolności modelu do wykluczania obserwacji | `caseload-kwartał` — zapas ukrytego błędu `E` (`1 caseload-kw = 10⁵ spraw` [ASSUMPTION]) |
| **Próg i horyzont (deklaracja własna)** | `D_crit = 50 du`, ~10,5 roku | `H₀ = 26 vbit`, `D(0) = 21,2`, `N* = 2`, ~1,6 roku | `E_crit = 0,6975 caseload-kw`, 24 kwartały (6 lat) |
| **Katalog** | [`../agent-a/`](../agent-a/) | [`../agent-b/`](../agent-b/) | [`../agent-c/`](../agent-c/) |

Jednostki `du`, `vbit` i `caseload-kwartał` są **niewspółmierne** — orzeczenie z dowodem w
[`DRIFT-LEDGER.md §1`](DRIFT-LEDGER.md). `D_total` jest wektorem trójskładnikowym; wspólny mianownik byłby
antywzorcem `FALSE-COMMENSURATION`.

---

## Zawartość katalogu

### Warstwa proceduralna (wiążąca dla wszystkich torów)

| Plik | Co zawiera |
|---|---|
| [`../PROTOCOL.md`](../PROTOCOL.md) | interfejs zgodności, oś `S0..S8`, osiem obowiązkowych kluczy zjawisk, schemat ID, schemat wpisu ustępstwa |
| [`../CONSENSUS-PHASE.md`](../CONSENSUS-PHASE.md) | reguły R1–R3, pięć kroków scalania, katalog antywzorców (§3), kryterium zakończenia |

### Warstwa suwerenna (nietykalna, po 7 plików na agenta)

Każdy z katalogów `../agent-a/`, `../agent-b/`, `../agent-c/` ma identyczną strukturę:

| Plik | Co zawiera |
|---|---|
| `agent.json` | maszynowe streszczenie: prymitywy, niezmienniki, pętle, zasoby z jednostkami, nienegocjowalne, ustępstwa, pokrycie zjawisk, przewidywane konflikty |
| `00-MODEL.md` | ontologia soczewki: prymitywy i ich odwzorowanie na obiekty prawne |
| `10-SPEC.md` | maszyna `S0..S8`, niezmienniki, tryby awarii |
| `20-DYNAMICS.md` | pętle, twierdzenia (`THM-*`), analiza stabilności i granic |
| `30-CONCESSIONS.md` | księga ustępstw: koszt, jednostka, funkcja kumulacji, predykat odwołania, odwracalność |
| `40-NONNEGOTIABLE.md` | `NN-*` z typem argumentu i **warunkiem obalenia** dla każdego |
| `50-RESOURCES.md` | zasoby z jednostkami, kursami wewnętrznymi i deklaracjami niewspółmierności |

### Warstwa konsensusowa (`consensus/`, ten katalog)

| Plik | Co zawiera |
|---|---|
| [`MERGED-SPEC.md`](MERGED-SPEC.md) | Krok 1 i 4: tablice korespondencji po osi zjawisk i po osi `S0..S8` z relacjami `SAME`/`ORTHOGONAL`/`RIVAL`, wspólne prymitywy i niezmienniki, wspólna maszyna `S0..S8`, przy każdym elemencie czyj model osłabiono i o ile, pięć warunków zewnętrznych `PRE-*` |
| [`CONFLICTS.md`](CONFLICTS.md) | Krok 2: 25 pozycji `RIVAL` — 17 `DECIDABLE` z dowodem, 5 `EMPIRICAL` z projektem eksperymentu, 3 `FOUNDATIONAL` z obiema gałęziami i ceną każdej; §0 definiuje **Test przesłanki**, narzędzie użyte w 12 z 17 rozstrzygnięć |
| [`AGREEMENTS.md`](AGREEMENTS.md) | Krok 2: 9 zbieżności, każda z **audytem niezależności przesłanek** i etykietą `ARGUED` / `AGREEMENT-UNARGUED`; `AGR-01` niesie rozstrzygnięcie sprawy nieobserwowalności autorytetu |
| [`DRIFT-LEDGER.md`](DRIFT-LEDGER.md) | Kroki 3–5: dowód niewspółmierności jednostek, scalona tablica zasobów z parami niewspółmiernymi, Księga I (jak zadeklarowano) i Księga II (po Teście P), `D_total` jako wektor, `t*`, `N*`, koszty scalenia `MRG-*`, kwalifikacja scalenia, test odwracalności |
| [`merged.json`](merged.json) | maszynowe scalenie całości: korespondencje, konflikty z etykietami, zbieżności, wektor dryfu, `NN-*` ze statusem po scaleniu, audyt antywzorców |
| `README.md` | ten plik |

---

## Co czytać i w jakiej kolejności

**Ścieżka 1 — chcę wynik (najkrócej).**
`README.md` → [`DRIFT-LEDGER.md`](DRIFT-LEDGER.md) akapit otwierający → [`AGREEMENTS.md` `AGR-01`](AGREEMENTS.md)
→ [`CONFLICTS.md` §3 (`FOUNDATIONAL`)](CONFLICTS.md). To daje: co jest niewspółmierne, czy zbieżność na
nieobserwowalności autorytetu jest realna i co pozostaje sporne bez możliwości rozstrzygnięcia.

**Ścieżka 2 — chcę sprawdzić rozstrzygnięcia.**
[`../CONSENSUS-PHASE.md`](../CONSENSUS-PHASE.md) (reguły R1–R3 i antywzorce — bez nich nie da się ocenić, czy
rozstrzygnięcie jest legalne) → [`CONFLICTS.md` §0](CONFLICTS.md) (Test przesłanki wraz z deklaracją kierunku
jego błędu) → `CONFLICTS.md` §1–§3 po kolei → [`merged.json`](merged.json) → punkt sporny w artefakcie
suwerennym wskazanym w danym rozstrzygnięciu. Każde rozstrzygnięcie `DECIDABLE` cytuje `NN-*`/`INV-*`/`THM-*`,
na których się opiera; cytat jest sprawdzalny bez czytania całego modelu.

**Ścieżka 3 — chcę zrozumieć jedną soczewkę.**
`../agent-X/agent.json` → `00-MODEL.md` → `10-SPEC.md` → `40-NONNEGOTIABLE.md` → `20-DYNAMICS.md` →
`30-CONCESSIONS.md` → `50-RESOURCES.md`. Dopiero potem `consensus/`, żeby zobaczyć, co z tej soczewki
przetrwało scalenie i co zostało jej dopisane przez pozostałe dwie.

**Ścieżka 4 — chcę kontynuować pracę empiryczną.**
[`CONFLICTS.md` §2](CONFLICTS.md) — pięć konfliktów `EMPIRICAL`, każdy z wielkością do zmierzenia, progiem
i wskazaniem, który wynik obala którą stronę. `CONF-E-05` (`stale_citation_rate`) jest jedynym mierzalnym
**dziś, bez interwencji w system**, więc jest naturalnym punktem startu. Następnie
[`MERGED-SPEC.md`](MERGED-SPEC.md), sekcja `PRE-*` — pięć warunków zewnętrznych, których scalony model nie
umie sam wymusić.

---

## Konwencje

- Język polski, terminy techniczne po angielsku.
- Każda liczba z jednostką. `[EST]` oznacza oszacowanie, `ASSUMPTION` oznacza założenie przyjęte jawnie.
- ID: `NN-*` nienegocjowalne, `INV-*` niezmienniki, `THM-*` twierdzenia, `CON-*` ustępstwa, `RES-*` zasoby,
  `LOOP-*` pętle, `PRIM-*` prymitywy, `FAIL-*` tryby awarii — wszystkie z sufiksem agenta (`-A-`, `-B-`, `-C-`).
  ID wprowadzone w fazie konsensusowej: `CONF-D-*` / `CONF-E-*` / `CONF-F-*` (konflikty), `AGR-*` (zbieżności),
  `MRG-*` (koszty scalenia), `PRE-*` (warunki zewnętrzne), `ASSUMPTION-M-*` (założenia orkiestratora).
- Ustępstwo ze statusem `VOID-PREMISE-FAILED` **pozostaje w księdze z pełną treścią** — nie jest usunięte,
  tylko wykazano, że wymaganie, na rzecz którego zostało udzielone, nie zostało przez adresata wystawione.
