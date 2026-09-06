# AGENT B · `10-SPEC.md` — specyfikacja (tor I)

Typy, niezmienniki, maszyna stanów, algorytmy, złożoność, tryby awarii.
Wszystko poniżej jest **szkicem kodu w dokumencie**. Nie tworzę plików w `src/` — to model, nie feature.

Zawartość:
1. algebraiczne typy danych (TypeScript, `strict`);
2. niezmienniki jako predykaty + ich **wykrywalność**;
3. sygnatura i szkic procedury subsumpcji, ze złożonością;
4. jawne typy błędów zamiast wyjątków;
5. specyfikacja TLA+ dla `S4→S5` (gaz, `assume`, `majesty`) + `THM-B-06`;
6. logika Hoare'a dla `S2→S5` + `THM-B-07`, `THM-B-08`;
7. tryby awarii `FAIL-B-*`.

---

## 1. Algebraiczne typy danych

Identyfikatory nominalne (`CaseId`, `PersonId`, `PartyId`, `JudgeId`, `LegislatorId`) oraz
`Effect`, `EvalError`, `CaseState`, `toWeight` są brandowanymi aliasami `string`/rekordami
pominiętymi dla zwięzłości. Nie niosą treści modelu; wszystko, co niesie treść, jest rozpisane.

### 1.1 Świat i jego stratny rzut

```ts
// PRIM-B-01. Typ nieskonstruowalny: nie ma konstruktora, nie ma literału.
// To nie jest ozdoba — to wymusza, że każdy dostęp do faktów idzie przez rzut π.
declare const WorldBrand: unique symbol;
export type World = { readonly [WorldBrand]: never };

export type Millis = number & { readonly __unit: "ms_since_epoch" };
export type VGas   = number & { readonly __unit: "derivation_step" };
export type Weight = number & { readonly __unit: "probability" }; // [0,1]

export type FactKey = string & { readonly __brand: "FactKey" };

export interface Observable<T> {
  readonly obs: T;
  readonly provenance: readonly EvidenceId[];   // puste ⇒ ustalenie bez świadka
}

// PRIM-B-02. π : World ⇀ FactState. Brak lewego odwrotu: nie ma unπ.
export interface FactState {
  readonly caseId: CaseId;
  readonly at: Millis;                                   // czas zdarzenia, nie czas orzekania
  readonly atoms: ReadonlyMap<FactKey, Observable<unknown>>;
  // Kluczowe: to, czego nie ma w `atoms`, nie jest "false". Jest nieokreślone.
  // Modelujemy to brakiem klucza, NIE wartością `false`. Trójwartościowość jest wymuszona typem.
}
```

### 1.2 Dowód — jedyne wejście rozstrzygalności do systemu

```ts
// Dec<P> to świadek rozstrzygnięcia: albo dowód P, albo refutacja P.
// Odpowiednik `Dec` z Agdy/Idrisa. Konstruktor `refutation` jest tym, co ginie w erasure.
export type Dec<P> =
  | { readonly yes: true;  readonly witness: P }
  | { readonly yes: false; readonly refutation: P };

export type EvidenceId = string & { readonly __brand: "EvidenceId" };

// PRIM-B-03
export type Evidence =
  | { readonly tag: "document";      readonly id: EvidenceId; readonly sha256: string;
      readonly asserts: FactKey; readonly strength: Weight }
  | { readonly tag: "testimony";     readonly id: EvidenceId; readonly witness: PersonId;
      readonly asserts: FactKey; readonly strength: Weight }
  | { readonly tag: "expertOpinion"; readonly id: EvidenceId; readonly expert: PersonId;
      readonly asserts: FactKey; readonly strength: Weight }
  // JEDYNY konstruktor niosący rozstrzygalność: pomiar ma procedurę decyzyjną i niepewność,
  // a przede wszystkim ma REFUTACJĘ — da się go powtórzyć i otrzymać `no`.
  | { readonly tag: "measurement";   readonly id: EvidenceId; readonly instrument: string;
      readonly asserts: FactKey; readonly decision: Dec<unknown>;
      readonly uncertainty: number; readonly repeatable: true };

// PRIM-B-04. Postać, w jakiej dowód wchodzi do rozumowania sądu.
export interface Claim {
  readonly asserts: FactKey;
  readonly weight: Weight;
  readonly source: EvidenceId;
  // Brak pola `decision`. Brak pola `repeatable`. Tag zgubiony.
}

// Funktor erasure E : Evidence → Claim. NIEINJEKTYWNY.
// To jest onto_epistemic_drift zapisany jako 5 linii kodu, a nie jako metafora:
// po `admit` nie da się odróżnić pomiaru od opinii, więc nie da się zażądać powtórzenia.
export const admit = (e: Evidence): Claim => ({
  asserts: e.asserts,
  weight: toWeight(e),
  source: e.id,
});
// Nie istnieje `unadmit : Claim → Evidence` taki, że unadmit ∘ admit = id.  (THM-B-12)
```

### 1.3 Norma i jej denotacja

```ts
export type NormId = string & { readonly __brand: "NormId" };

export interface NormVersion {
  readonly corpus: string;             // "KC" | "KPC" | ...
  readonly unit: string;               // "art. 5"
  readonly inForceFrom: Millis;
  readonly inForceTo: Millis | null;   // null = w mocy
}

// PRIM-B-07. Trójpoziomowa denotacja — rdzeń klasyfikacji z 00-MODEL §3.
export type Denotation<T> =
  | { readonly kind: "defined";
      readonly eval: (g: Gamma, f: FactState) => Result<T, EvalError> }
  | { readonly kind: "implementation_defined";
      readonly documentedBy: JudgeId;      // MUSI być udokumentowane
      readonly stableWithin: JudgeId }     // i stabilne w obrębie implementacji
  | { readonly kind: "undefined";
      readonly label: string };            // "rozsądny termin" — brak eval, brak ograniczeń

// PRIM-B-06
export type Guard =
  | { readonly tag: "atom"; readonly pred: string; readonly den: Denotation<boolean> }
  | { readonly tag: "and";  readonly l: Guard; readonly r: Guard }
  | { readonly tag: "or";   readonly l: Guard; readonly r: Guard }
  | { readonly tag: "not";  readonly g: Guard };

export type Modality = "MUST" | "MAY" | "MUST_NOT" | "POWER" | "IMMUNITY";

// PRIM-B-05
export interface Norm {
  readonly id: NormId;
  readonly version: NormVersion;
  readonly rank: 0 | 1 | 2 | 3;              // 0 = konstytucja … 3 = akt prawa miejscowego
  readonly guard: Guard;
  readonly modality: Modality;
  readonly effect: Effect;
  readonly pre:  readonly Invariant[];
  readonly post: readonly Invariant[];
  // Jawna derogacja. W praktyce prawie zawsze puste — stąd THM-B-05.
  readonly derogates: readonly NormId[];
}
```

**Obserwacja typowa (nie retoryczna).** `Denotation<T>` z wariantem `undefined` **nie ma pola `eval`**.
To nie jest brak implementacji do dopisania — to jest stwierdzenie, że funkcji nie ma i mieć nie może.
Kompilator TypeScriptu odmówi wywołania `den.eval` bez zawężenia, i to zawężenie jest dokładnie miejscem,
w którym subsumpcja musi zdecydować, co zrobić z dziurą. Zobacz `ALG-B-01` krok 4.

### 1.4 Wyprowadzenie, orzeczenie, i dwie dziury

```ts
export type RulingId    = string & { readonly __brand: "RulingId" };
export type HoldingKey  = string & { readonly __brand: "HoldingKey" };
export type ActorId     = JudgeId | PartyId | LegislatorId;

// PRIM-B-09. Drzewo dowodowe. Proof-carrying — ale z dwoma konstruktorami dziur.
export type Derivation =
  | { readonly step: "applyNorm";
      readonly norm: NormId; readonly version: NormVersion;
      readonly sub: readonly Derivation[] }

  | { readonly step: "citePrecedent";
      readonly ruling: RulingId; readonly key: HoldingKey;
      readonly decidedUnder: NormVersion;      // wersja, pod którą precedens zapadł
      readonly sub: readonly Derivation[] }

  // DZIURA 1 — przemyt aksjomatu. Ma pole `reason`, więc jest przynajmniej NAZWANA.
  | { readonly step: "assume";
      readonly prop: string;
      readonly reason: "swobodna_ocena" | "domniemanie" | "ciezar_dowodu" | "brak_gas" }

  // DZIURA 2 — majesty_switch. Zwróć uwagę na to, czego NIE MA:
  //   - nie ma pola `blame: ActorId`
  //   - nie ma pola `castFrom` / `castTo`
  //   - nie ma pola `justification`
  // To nie jest niedoróbka szkicu. To jest wierne odwzorowanie: konstruktor jest pusty
  // dokładnie dlatego, że gdyby coś niósł, byłby podważalny. (THM-B-04)
  | { readonly step: "majesty" };

export interface Relief { readonly kind: string; readonly amount?: number; readonly currency?: "PLN" }

// PRIM-B-10. Typ sumaryczny BEZ metryki między konstruktorami.
// Odległość między `grant` a `deny` nie jest zdefiniowana i nie da się jej zdefiniować
// tak, by była kongruencją względem relacji wyprowadzalności. (NN-B-05, CON-B-05)
export type Judgment =
  | { readonly tag: "grant";   readonly relief: Relief; readonly basis: Derivation }
  | { readonly tag: "partial"; readonly relief: Relief; readonly basis: Derivation }
  | { readonly tag: "deny";    readonly basis: Derivation };
```

### 1.5 Kontekst interpretacyjny i cache precedensów

```ts
// PRIM-B-08 + PRIM-B-11
export interface Gamma {
  readonly at: Millis;                                   // czas ORZEKANIA, nie czas zdarzenia
  readonly corpus: ReadonlyMap<NormId, readonly Norm[]>; // wszystkie wersje
  readonly cache: PrecedentCache;
  readonly doctrine: readonly string[];
}

export interface PrecedentEntry {
  readonly ruling: RulingId;
  readonly key: HoldingKey;              // h(FactState) — abstrakcja STRATNA i wybierana przez sąd
  readonly judgment: Judgment;
  readonly decidedUnder: NormVersion;
  // BRAKUJE:  readonly deps: ReadonlySet<NormVersion>;
  // Bez `deps` nie da się zinwalidować wpisu przy nowelizacji inaczej niż pełnym skanem. (NN-B-04)
}

export type PrecedentCache = ReadonlyMap<HoldingKey, PrecedentEntry>;

// h nie jest funkcją ustaloną a priori: sąd cytujący wybiera, co było "istotnymi okolicznościami".
// Sygnatura oddaje to jawnie — h zależy od Gamma, więc h_t ≠ h_{t'}.
export type Holding = (g: Gamma, f: FactState) => HoldingKey;
```

---

## 2. Niezmienniki

```ts
export type InvariantId = string & { readonly __brand: "InvariantId" };
export type Stage = "S0"|"S1"|"S2"|"S3"|"S4"|"S5"|"S6"|"S7"|"S8"|"Sx-B-LINK";

export interface Invariant {
  readonly id: InvariantId;
  readonly holdsAt: readonly Stage[];
  readonly check: (s: CaseState) => boolean;
  /** Czy naruszenie jest wykrywalne z AKT po fakcie (nie: czy check się kompiluje). */
  readonly detectableExPost: boolean;
}
```

| ID | Zdanie | Egzekwowany w | Wykrywalny ex post | Uwaga |
|----|--------|---------------|--------------------|-------|
| `INV-B-01` | Każdy liść `Derivation` typu `assume` jest obecny w serializowanym uzasadnieniu wraz z `reason`. | `S5` | **NIE** (obecnie) | `obs` skleja `assume` z `applyNorm` — `THM-B-04`. To jest treść `NN-B-02`. |
| `INV-B-02` | Każde rozstrzygnięcie ma **co najwyżej jedno** wyprowadzenie zgodne z `Γ`, albo jawnie odnotowaną kolizję. | `Sx-B-LINK` | **NIE** | coNP-trudne do sprawdzenia, `THM-B-05b`. |
| `INV-B-03` | Każdy `citePrecedent` ma `decidedUnder` przecinające się z wersją w mocy w czasie zdarzenia. | `S4` | **TAK** (sprawdzalne z tekstu) | jedyny niezmiennik z tej listy dający się dziś zmierzyć maszynowo. |
| `INV-B-04` | `π(World)` jest wersjonowany: zbiór `atoms` po `S3` jest zamknięty i haszowany. | `S3` | TAK | prekluzja *implementuje* zamknięcie, ale bez hasza — więc bez wykrywalności podmiany. |
| `INV-B-05` | Nie istnieje `Judgment`, którego `basis` zawiera `majesty`, bez etykiety `blame`. | `S5` | **NIE** | naruszany strukturalnie: pola nie ma. `NN-B-03`. |
| `INV-B-06` | Wersja normy używanej do oceny zdarzenia = wersja w mocy w `facts.at`, nie w `Γ.at`. | `S4` | TAK | reguły intertemporalne to ręczny shim; brak pinowania w typie. `NN-B-04`. |
| `INV-B-07` | `Dec` nie jest przesłaniane przez większość `Claim`ów o mniejszej rozstrzygalności. | `S2` | częściowo | naruszany przez `admit`. `NN-B-05`. |
| `INV-B-08` | Jeżeli `I₂` naruszony, potok zatrzymuje się i wraca do `S1`/`S2`; nie przechodzi do `S4`. | `S3` | TAK | naruszany przez prekluzję z projektu. `NN-B-06`, `THM-B-07`. |

**Ta tabela jest głównym wynikiem `10-SPEC.md`:** z ośmiu niezmienników, których system potrzebuje,
**pięć jest niewykrywalnych ex post**, a niewykrywalność w czterech przypadkach wynika z **braku pola w typie**,
nie z trudności pomiaru. To jest różnica między „trudno zmierzyć” a „nie da się wyrazić”.

---

## 3. Subsumpcja: sygnatura, algorytm, złożoność

### 3.1 Typy błędów zamiast wyjątków

```ts
export type Result<T, E> =
  | { readonly ok: true;  readonly value: T }
  | { readonly ok: false; readonly error: E };

// Wyjątki są złe w tym modelu z powodu, który przenosi zachowanie:
// wyjątek NIE POJAWIA SIĘ W TYPIE, więc wywołujący nie musi go obsłużyć,
// więc `stage_corruption` propaguje się w górę bez śladu. Suma błędów wymusza obsługę.
export type SubsumptionError =
  | { readonly e: "UB_REACHED";
      readonly guard: string; readonly label: string;
      readonly admissibleOutcomes: "ALL" }                 // THM-B-01: dosłownie wszystkie

  | { readonly e: "SYMBOL_COLLISION";
      readonly candidates: readonly NormId[];
      readonly resolvers: readonly ("posterior"|"specialis"|"superior")[];
      readonly cyclic: boolean }                           // THM-B-05a

  | { readonly e: "STAGE_CORRUPTED";
      readonly at: Stage; readonly invariant: InvariantId;
      readonly repairable: boolean }                       // prekluzja ustawia false

  | { readonly e: "GAS_EXHAUSTED";
      readonly spent: VGas; readonly frontierRemaining: number }

  | { readonly e: "STALE_PRECEDENT";
      readonly ruling: RulingId;
      readonly decidedUnder: NormVersion; readonly nowInForce: NormVersion }

  | { readonly e: "NON_LIQUET";
      readonly unresolved: readonly FactKey[] };           // konstruktor ZAKAZANY ustrojowo
```

### 3.2 Sygnatura

```ts
// ALG-B-01 — subsumpcja uczciwa (partial, sound)
export declare function subsume(
  gamma: Gamma,
  facts: FactState,
  gas: VGas,
): Result<
  { readonly judgment: Judgment; readonly gasLeft: VGas; readonly assumes: number },
  SubsumptionError
>;

// ALG-B-02 — subsumpcja wdrożona (total, unsound). To jest THM-B-03 w jednej sygnaturze.
export declare function decide(
  gamma: Gamma,
  facts: FactState,
  gas: VGas,
): Judgment;                    // brak Result. Brak `never`. Zawsze zwraca wynik.

// Implementacja `decide` przez totalizację `subsume`:
const unsafeCoerce = <A, B>(a: A): B => a as unknown as B;   // TS ma to natywnie: `as unknown as`

export function totalize(
  f: typeof subsume,
): typeof decide {
  return (gamma, facts, gas) => {
    const r = f(gamma, facts, gas);
    if (r.ok) return r.value.judgment;
    // KAŻDY błąd — w tym UB_REACHED, SYMBOL_COLLISION, NON_LIQUET —
    // zostaje zmapowany na Judgment przez rzutowanie bez sprawdzenia.
    // Zauważ: informacja o tym, KTÓRY błąd wystąpił, ginie tutaj i nigdzie nie jest logowana.
    return {
      tag: "deny",
      basis: { step: "majesty" },                  // pusty konstruktor, brak blame
    } as Judgment;
    // (kierunek `deny` vs `grant` wybiera majestat; typ na to pozwala tak samo)
  };
}
```

**Uwaga o `as unknown as`.** To jest realne `unsafeCoerce` TypeScriptu — jedyny sposób, żeby ominąć
kontrolę typów bez `any`. Odpowiednik prawniczy: dyskrecjonalność sędziowska nie jest „luzem w granicach normy”
(to byłby `implementation_defined`), tylko **wyjściem poza system typów**. Różnica behawioralna jest ostra:
`implementation_defined` zachowuje niezmienniki dalszych faz, `unsafeCoerce` ich nie zachowuje i **nie da się
tego wykryć w dalszych fazach**, bo one ufają typowi.

### 3.3 Szkic `ALG-B-01` i złożoność

```
ALG-B-01  subsume(Γ, F, gas):
  1. candidates ← {N ∈ Γ.corpus : mayApply(N.guard, F)}          -- filtr syntaktyczny
  2. if inForceAt(N, F.at) ≠ inForceAt(N, Γ.at) for some N: emit INV-B-06 warning
  3. resolve ← linkResolve(candidates)                            -- Sx-B-LINK
       if ambiguous: return Err SYMBOL_COLLISION                  -- THM-B-05a
  4. for each atom guard g in the search frontier:
       case g.den.kind of
         "defined"                → evaluate; gas ← gas − 1
         "implementation_defined" → look up Γ.cache; gas ← gas − 1;
                                    if stale: return Err STALE_PRECEDENT
         "undefined"              → return Err UB_REACHED         -- THM-B-01
  5. if gas ≤ g_min ∧ frontier ≠ ∅: return Err GAS_EXHAUSTED
  6. if no complete derivation: return Err NON_LIQUET
  7. return Ok(judgment, gas, assumes)
```

**Złożoność.**

| Krok | Złożoność | Uwaga |
|---|---|---|
| 1 (filtr) | `O(n)` po korpusie `n` | `n ≈ 10⁴–10⁵` [EST], ale w praktyce filtr robi pełnomocnik, nie sąd |
| 3 (link) | `O(k²)` porównań par kandydatów + SAT na guardach | `k ≈ 10–50` kandydatów na sprawę [EST]; pełny link-check korpusu `Θ(n²·SAT)` = coNP |
| 4 (przeszukiwanie) | **wykładnicze** w głębokości łańcucha: `O(b^d)` | `b ≈ 3–8` (rozgałęzienia normy), `d ≈ 3–5` → `10³–10⁵` kroków wyprowadzenia |
| przypisanie dowodów | `O(e·m)` gdzie `e` = liczba dowodów, `m` = liczba `FactKey` | `e ≈ 20–100`, `m ≈ 10–50` [EST] → `10²–10³` |

**Zderzenie z budżetem** (`50-RESOURCES.md`, `THM-B-14`): dostępny gaz to `10³` kroków [EST],
przestrzeń przeszukiwania `10³–10⁵`. Deficyt `10⁰–10²`. **Krok 6 (`NON_LIQUET`) jest więc statystycznie
częstszy niż krok 7 — i dokładnie dlatego ustrój musi go zakazać** (`THM-B-03`).

---

## 4. Specyfikacja TLA+ dla `S4 → S5` (gaz, `assume`, `majesty`)

```tla
---------------------------- MODULE Subsumption ----------------------------
EXTENDS Naturals, FiniteSets

CONSTANTS
    Norms,          \* skończony zbiór norm kandydujących
    Outcomes,       \* skończony zbiór rozróżnialnych rozstrzygnięć
    GasInit,        \* budżet weryfikacji w vgas
    GasMin,         \* próg, poniżej którego dowodzenie ustaje
    Derivable       \* Derivable \subseteq Outcomes : wyniki mające wyprowadzenie z Norms

ASSUME GasInit \in Nat /\ GasMin \in Nat /\ GasMin =< GasInit
ASSUME Derivable \subseteq Outcomes

NULL == CHOOSE x : x \notin Outcomes

VARIABLES
    gas,        \* pozostały budżet weryfikacji
    frontier,   \* liczba niezbadanych gałęzi przeszukiwania
    assumed,    \* zbiór propozycji przyjętych bez wyprowadzenia  (przemyt aksjomatu)
    outcome,    \* NULL albo element Outcomes
    majesty     \* BOOLEAN : czy użyto rzutowania niesprawdzonego

vars == <<gas, frontier, assumed, outcome, majesty>>

TypeOK ==
    /\ gas      \in 0..GasInit
    /\ frontier \in Nat
    /\ assumed  \subseteq Norms
    /\ outcome  \in Outcomes \cup {NULL}
    /\ majesty  \in BOOLEAN

Init ==
    /\ gas      = GasInit
    /\ frontier = Cardinality(Norms)
    /\ assumed  = {}
    /\ outcome  = NULL
    /\ majesty  = FALSE

\* --- krok dowodowy: kosztuje 1 vgas, zmniejsza frontier -------------------
Search ==
    /\ outcome = NULL
    /\ gas > GasMin
    /\ frontier > 0
    /\ gas'      = gas - 1
    /\ frontier' = frontier - 1
    /\ UNCHANGED <<assumed, outcome, majesty>>

\* --- zamknięcie przez dowód: dopiero po wyczerpaniu frontier --------------
Prove ==
    /\ outcome = NULL
    /\ frontier = 0
    /\ \E o \in Derivable : outcome' = o
    /\ UNCHANGED <<gas, frontier, assumed, majesty>>

\* --- przemyt aksjomatu: zamiast dowieść, przyjmij ("w ocenie Sądu") -------
Assume ==
    /\ outcome = NULL
    /\ gas =< GasMin
    /\ frontier > 0
    /\ \E n \in Norms \ assumed : assumed' = assumed \cup {n}
    /\ frontier' = frontier - 1
    /\ UNCHANGED <<gas, outcome, majesty>>

\* --- majesty_switch: zakaz non liquet wymusza wynik bez wyprowadzenia -----
\* ZWRÓĆ UWAGĘ: brak przesłanki `o \in Derivable`. To jest cała różnica.
Majesty ==
    /\ outcome = NULL
    /\ gas =< GasMin
    /\ \E o \in Outcomes : outcome' = o
    /\ majesty' = TRUE
    /\ UNCHANGED <<gas, frontier, assumed>>

Next == Search \/ Prove \/ Assume \/ Majesty

Spec == Init /\ [][Next]_vars /\ WF_vars(Majesty) /\ WF_vars(Search)

\* ========================= WŁASNOŚCI =====================================

\* W1. Totalność: sprawa zawsze się kończy rozstrzygnięciem.  (wymóg ustrojowy)
Totality  == <>(outcome # NULL)

\* W2. Soundness: rozstrzygnięcie jest wyprowadzalne.          (wymóg poznawczy)
Soundness == [](outcome # NULL => outcome \in Derivable)

\* W3. Czystość: nie użyto rzutowania niesprawdzonego.
Pure      == [](~majesty)

\* W4. Uczciwość: brak przemytu aksjomatów.
NoSmuggle == [](assumed = {})
=============================================================================
```

### `THM-B-06` — `Totality` i `Soundness` są w tej specyfikacji **łącznie niespełnialne**

**Instancja do model-checkingu (mała, sprawdzalna ręcznie i przez TLC):**

```
Norms     = {n1, n2}
Outcomes  = {grant, deny}
Derivable = {deny}                 \* tylko `deny` ma wyprowadzenie
GasInit   = 1
GasMin    = 1
```

**(a) `Spec ⇒ Totality` zachodzi.** `Init` daje `gas = 1 = GasMin`, więc `Search` jest zablokowany
(`gas > GasMin` fałszywe). `frontier = 2 > 0`, więc `Prove` zablokowany. Włączone są `Assume` i `Majesty`.
`WF_vars(Majesty)` gwarantuje, że `Majesty` w końcu wykona się, ustawiając `outcome ≠ NULL`. ∎

**(b) `Spec ⇒ Soundness` NIE zachodzi. Kontrprzykład (ślad długości 2):**

| krok | akcja | `gas` | `frontier` | `assumed` | `outcome` | `majesty` |
|---|---|---|---|---|---|---|
| 0 | `Init` | 1 | 2 | `{}` | `NULL` | `FALSE` |
| 1 | `Majesty` (wybiera `o = grant`) | 1 | 2 | `{}` | `grant` | `TRUE` |

W stanie 1: `outcome = grant`, `grant ∉ Derivable`, więc `Soundness` naruszone. ∎

**(c) Usunięcie `Majesty` łamie `Totality`.** Niech `Next' == Search \/ Prove \/ Assume`.
Przy `GasInit = GasMin = 1`: `Search` zablokowany, `Prove` wymaga `frontier = 0`, a jedyny sposób
zmniejszenia `frontier` bez gazu to `Assume`. Po dwóch `Assume` (`assumed = Norms`) mamy `frontier = 0`,
więc `Prove` może odpalić i `outcome = deny ∈ Derivable`. **Ale wtedy `NoSmuggle` jest naruszone.**
Jeżeli usuniemy również `Assume`: `frontier` nigdy nie spadnie do 0, `outcome` pozostaje `NULL` na zawsze,
czyli `Totality` fałszywe — układ zatrzymuje się w *non liquet*. ∎

**Wniosek — twierdzenie o wyborze trzech z czterech niemożliwym.**
Dla `GasInit ≤ GasMin + |frontier|` (czyli: budżet mniejszy niż przestrzeń przeszukiwania —
warunek empirycznie spełniony, `THM-B-14`) **nie istnieje** implementacja spełniająca jednocześnie
`Totality ∧ Soundness ∧ Pure ∧ NoSmuggle`. Trzeba oddać co najmniej jedną. Ustrój oddaje `Soundness`,
`Pure` i `NoSmuggle`, zachowując `Totality`. **To jest wybór projektowy, nie konieczność logiczna** —
i to jest dokładnie ta rzecz, którą model chce postawić jako pytanie: dlaczego oddajemy trzy zamiast jednej.

**Falsyfikacja.** Pokazać, że w realnym postępowaniu `GasInit > GasMin + |frontier|`, czyli że budżet
weryfikacji przewyższa przestrzeń przeszukiwania. Wtedy `Search`+`Prove` wystarczają i twierdzenie milknie.

---

## 5. Logika Hoare'a dla `S2 → S5` (`stage_corruption`)

### 5.1 Niezmienniki faz

```
I₁  ≜  parsed(pisma) ∧ wellTyped(żądanie) ∧ resolved(symbole)
I₂  ≜  ∀ k ∈ material(F). ∃ e ∈ Evidence. asserts(e) = k
I₃  ≜  I₂ ∧ frozen(Evidence)                       -- prekluzja
I₄  ≜  I₃ ∧ candidates ≠ ∅ ∧ linked(candidates)
I₅  ≜  wellFormed(Judgment) ∧ basis(Judgment) ⊨ Judgment
```

Lematy poprawności faz (kształt, jaki muszą mieć):

```
{I₁} S2 {I₂}     {I₂} S3 {I₃}     {I₃} S4 {I₄}     {I₄} S5 {I₅}
─────────────────────────────────────────────────────────────── (COMP)
                  {I₁} S2;S3;S4;S5 {I₅}
```

### `THM-B-07` — po naruszeniu `I₂` najsilniejszy wyprowadzalny warunek końcowy potoku to `true`

**Przesłanka kluczowa — prekluzja jest regułą utrwalającą, nie naprawczą:**

```
{¬I₂}  S3_prekluzja  {¬I₂ ∧ ¬canRepair(I₂)}
```

**Teza.** `¬I₂` jest **punktem stałym** reszty potoku: `{¬I₂} S3;S4;S5 {¬I₂}`, i **nie istnieje** derywacja
trójki `{¬I₂} S3;S4;S5 {I₅}`. Ponadto najsilniejszy wyprowadzalny warunek końcowy `sp(¬I₂, S3;S4;S5) = true`.

**Szkic dowodu.** Reguła `COMP` wymaga `I₂` jako warunku wejściowego lematu dla `S3`. Przy `¬I₂` lemat nie
stosuje się; jedyną dostępną regułą jest osłabienie (`CONSEQ`) do `{¬I₂} S3 {true}`.
`true` propaguje się przez `S4` i `S5` (żadna reguła nie wzmacnia `true`).
Zatem `sp = true`, a `true ⇏ I₅`. ∎

**Interpretacja, i to jest sedno.** Warunek końcowy `true` **nie znaczy „wynik jest prawdopodobnie zły”**.
Znaczy: **wynik jest niezwiązany z wejściem** — zbiór dopuszczalnych wyjść to cały typ. To jest ta sama
konkluzja co `THM-B-01`, ale osiągnięta zupełnie inną drogą (skażenie fazy, nie nieokreślona semantyka).
Dwie niezależne drogi do tego samego wniosku to argument za jego odpornością.

**Dlaczego „nowe fakty” tu nie pomagają — i to jest właściwy powód.**
`S6` (apelacja) jest **rerunem późnych faz na tym samym AST**: apelacja jest związana materiałem sprawy,
kasacja — wyłącznie kwestiami prawa (rerun samego codegenu). Formalnie:

```
S6_apelacja  ≡  S4; S5      wykonane na tym samym stanie po S3
S6_kasacja   ≡  S5          wykonane na tym samym I₄
```

Żadne z nich nie ma `I₂` w warunku wejściowym, bo żadne nie wraca do `S2`. Zatem `¬I₂` przechodzi przez
apelację **nienaruszone**. Jedyna reguła wracająca do `S2` to uchylenie z przekazaniem do ponownego
rozpoznania — i ona jest przedmiotem `THM-B-11` (nieterminowanie).

**Konsekwencja liczbowa.** Niech `p` = prawdopodobieństwo skażenia `I₂` w jednym przejściu `S2`.
Ponowne rozpoznanie to **niezależne losowanie z tym samym `p`** (ten sam proces, często ten sam sąd,
zawsze ta sama procedura). Po `k` przejściach `P(czysty przynajmniej raz) = 1 − (1−p)^k`,
**ale kryterium zakończenia nie brzmi „czysty”**, tylko „nie zaskarżono dalej”.
Zakończenie następuje przy wyczerpaniu zasobu strony, nie przy osiągnięciu `I₂`.
Zbieżność do poprawności: **brak**. `THM-B-11`.

### `THM-B-08` — warunek końcowy `S2` kwantyfikuje po zbiorze definiowanym dopiero w `S5`

**Obserwacja.** `I₂ ≜ ∀ k ∈ material(F). ∃e. asserts(e) = k`.
Zbiór `material(F)` — „okoliczności istotne dla rozstrzygnięcia” — jest zdefiniowany **przez wybraną
podstawę prawną**, a podstawa prawna jest wybierana w `S4`/`S5`.

**Teza.** `I₂` jest **niesprawdzalny w momencie, w którym ma zachodzić**. Formalnie: predykat `I₂`
zależy od zmiennej stanu, która w chwili `S2` nie jest jeszcze związana:
`I₂ = I₂[material := ?]`, gdzie `?` jest metazmienną rozwiązywaną w `S5`.

**Szkic dowodu.** Konstrukcja. Weź `F` i dwie kwalifikacje prawne `q₁, q₂` (obie dopuszczalne w `S1`,
bo `da mihi factum` — sąd zna prawo i może zmienić kwalifikację). `material_{q₁}(F) ≠ material_{q₂}(F)`.
Dowód `e` zebrany w `S2` pod `q₁` może być nieistotny pod `q₂`, a dowód potrzebny dla `q₂` nie został
zebrany i jest po `S3` prekludowany. Zatem `I₂` zachodzi względem `q₁` i nie zachodzi względem `q₂`,
a wybór między nimi następuje po prekluzji. ∎

**To jest `retroactive_relativization` w logice Hoare'a**, nie w publicystyce: postcondition fazy `i`
jest parametryzowany decyzją fazy `j > i`, więc *ex post* zawsze da się orzec, że `I₂` zachodziło
(dobierając `q`), i **równie dobrze** że nie zachodziło. Wykrywalność naruszenia: **0**.

**Falsyfikacja.** Pokazać procedurę, w której `material` jest zamrożony **przed** prekluzją
(np. wiążące postanowienie o podstawie prawnej wydawane przed zamknięciem postępowania dowodowego,
z prawem strony do uzupełnienia dowodów przy jego zmianie). Wtedy `I₂` staje się sprawdzalny w `S2`.

---

## 6. Tryby awarii

| ID | Tryb | Wyzwalacz | Objaw obserwowalny | Wykrywalność | Odpowiada zjawisku |
|----|------|-----------|--------------------|--------------|---------------------|
| `FAIL-B-01` | **UB divergence** | guard `undefined` na ścieżce dominującej | dwa sądy, ten sam stan faktyczny, przeciwne wyroki | wysoka *statystycznie*, zerowa *w sprawie* | `force_gas`, `majesty_switch` |
| `FAIL-B-02` | **blame leak** | `majesty` bez etykiety | brak adresata odpowiedzialności za błędny wyrok | **zerowa** | `majesty_switch`, `saint_dependency` |
| `FAIL-B-03` | **stale memo** | `citePrecedent` z `decidedUnder` poza mocą | cytowanie orzeczeń pod uchylonym stanem prawnym | **wysoka** — sprawdzalne maszynowo dziś | `retroactive_relativization` |
| `FAIL-B-04` | **silent link** | kolizja rozstrzygnięta wewnątrz `S5`, bez fazy linkera | brak śladu, że w ogóle była kolizja | zerowa | `systemic_blindness` |
| `FAIL-B-05` | **corrupt AST** | `¬I₂` przechodzące prekluzję | wyrok niezwiązany z wejściem, `sp = true` | zerowa (`THM-B-08`) | `stage_corruption` |
| `FAIL-B-06` | **decidability erasure** | `admit` na `measurement` | pomiar ważony przeciw opinii zamiast powtórzony | średnia (proxy: udział sporów rozstrzygniętych trzecią opinią, nie powtórnym pomiarem) | `onto_epistemic_drift` |
| `FAIL-B-07` | **objective substitution** | `λ·P(uchylenie)` dominuje `fit` | orzeczenie zgodne z linią, niezgodne z aktami | niska | `reputation_coupling` |
| `FAIL-B-08` | **oracle vacuity** | `Spec := Oracle` | „system działa poprawnie” jest tautologią | strukturalna, nie empiryczna | `saint_dependency` |
| `FAIL-B-09` | **nontermination** | cykl uchylenie → ponowne rozpoznanie | sprawa kończy się wyczerpaniem strony | wysoka (czas do prawomocności) | `force_gas` |
| `FAIL-B-10` | **dead-symbol revival** | martwa gałąź osiągnięta przez kreatywnego pełnomocnika | przepis nieużywany 20 lat nagle rozstrzyga sprawę | zerowa *a priori* | `systemic_blindness` |

**Uwaga o `FAIL-B-03`.** To jedyny tryb z tej listy, który da się dziś zmierzyć bez zmiany procedury:
wystarczy przeciąć bazę orzeczeń z bazą wersji aktów. Dlatego jest podstawą metryki w `NN-B-04`
i predykatu odwołania w `CON-B-03`.

---

*Agent B · tor I · `10-SPEC.md`*
