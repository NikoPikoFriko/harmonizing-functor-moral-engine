# 10-SPEC — Agent A · tor I (suwerenny)

Specyfikacja wykonawcza modelu z `00-MODEL.md`.

**Status kodu:** wszystkie bloki w sekcjach 1–14 tworzą jeden moduł, który kompiluje się pod
`tsc 5.7 --strict --noUnusedLocals --noUnusedParameters --exactOptionalPropertyTypes --noFallthroughCasesInSwitch`
bez błędów i bez `any`. Sekcja 15 (harness) importuje ten moduł i została **wykonana**; jej wyniki
są podane obok kodu. To nie jest pseudokod: sygnatury są kontraktem, a nie ilustracją.

Kod nie jest zapisywany w `src/` celowo — jest artefaktem specyfikacji, nie częścią aplikacji.

---

## 1. Adresowanie i jednostki

Branded types są tu nośnikiem twierdzenia, nie ozdobą: rozdzielenie `Lamport` od `WallMs` jest
maszynowym wymuszeniem `INV-A-03` (funkcja przejścia nie widzi czasu ściany zegara). Gdyby oba były
`number`, naruszenie tego niezmiennika byłoby niewykrywalne statycznie.

```ts
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type NodeId = Brand<string, "NodeId">;
export type CaseId = Brand<string, "CaseId">;
export type FactId = Brand<string, "FactId">;
export type EntryId = Brand<string, "EntryId">;
export type NormId = Brand<string, "NormId">;
export type Hash = Brand<string, "Hash">;

/** Czas logiczny (Lamport). Jedyny czas dopuszczony w funkcji przejścia delta. */
export type Lamport = Brand<number, "Lamport">;
/** Wall-clock. Dopuszczony WYŁĄCZNIE w lease/timeout, nigdy w delta (INV-A-03). */
export type WallMs = Brand<number, "WallMs">;
/** Wersja semantyki normy (S8). Zmiana = migracja schematu. */
export type SchemaVersion = Brand<number, "SchemaVersion">;

/** force_gas: 1 FG = jedno rozstrzygnięcie kwestii spornej bez dowodu rozstrzygającego. */
export type FG = Brand<number, "FG">;
/** drift-unit: 1 du = utrata 1 pp. rozróżnialności evidence-commit vs authority-commit. */
export type DU = Brand<number, "DU">;

export const nodeId = (s: string): NodeId => s as NodeId;
export const caseId = (s: string): CaseId => s as CaseId;
export const factId = (s: string): FactId => s as FactId;
export const entryId = (s: string): EntryId => s as EntryId;
export const normId = (s: string): NormId => s as NormId;
export const hash = (s: string): Hash => s as Hash;
export const lam = (n: number): Lamport => n as Lamport;
export const wall = (n: number): WallMs => n as WallMs;
export const fg = (n: number): FG => n as FG;
export const du = (n: number): DU => n as DU;
export const sv = (n: number): SchemaVersion => n as SchemaVersion;
```

---

## 2. Węzły i model awarii

`reputationPool` nie jest metadaną opisową — jest **parametrem modelu awarii**. Dwa węzły z tej samej
puli mają skorelowane `b_i` (THM-A-07), więc każdy algorytm liczący „ile niezależnych kontroli mamy"
musi ten atrybut czytać. Analogicznie `Objective` jest zmienny w czasie: to jest cała treść
`reputation_coupling` wyrażona w typie.

```ts
export type Role =
  | "party" | "counsel" | "court" | "expert"
  | "witness" | "bailiff" | "supervisor";

/**
 * Funkcja celu węzła. reputation_coupling = dryf wag w czasie działania
 * protokołu: wClient maleje, wSelf i wSystem rosną.
 * wSystem jest WSPÓLNY dla całej puli reputacyjnej -> czynnik skorelowany.
 */
export interface Objective {
  readonly wClient: number;
  readonly wSelf: number;
  readonly wSystem: number;
}

export interface NodeDescriptor {
  readonly id: NodeId;
  readonly role: Role;
  /** Źródło skorelowanej awarii (THM-A-07). Węzły z tej samej puli nie są niezależne. */
  readonly reputationPool: string;
  /** Czy węzeł ma proceduralne prawo zatajenia części stanu (S2). */
  readonly mayWithhold: boolean;
  readonly objective: Objective;
}

/** Model awarii: nie crash-stop, lecz rational-byzantine (odchylenie opłacalne). */
export type FailureModel = "crash" | "omission" | "rational-byzantine";
```

---

## 3. Fakty, custody, quorum intersection

To jest formalizacja THM-A-02. Zwróć uwagę na `disclosureIncentive`: model przewiduje, że
**fakty u obojętnych osób trzecich są tak samo trudne do uzyskania jak fakty niekorzystne dla pozwanego**,
bo koszt ujawnienia jest dodatni, a korzyść zerowa. To nie jest oczywiste i jest falsyfikowalne:
gdyby banki, operatorzy i szpitale wydawały dokumenty na zwykłe żądanie strony, teza byłaby fałszywa.

```ts
/** interest: -1 fakt szkodzi posiadaczowi, 0 neutralny, +1 korzystny. */
export interface Custodian {
  readonly node: NodeId;
  readonly interest: -1 | 0 | 1;
}

export interface Fact {
  readonly id: FactId;
  readonly custodians: readonly Custodian[];
  /** Czy fakt sam zmienia wynik przy ustalonej reszcie stanu. */
  readonly decisive: boolean;
  /** Czy dowód jest self-verifying (podpis + inkluzja), czy wymaga decyzji lidera. */
  readonly selfVerifying: boolean;
}

export type CustodyClass = "dual" | "single" | "none";

/** INV-A-02: dual custody = dwóch posiadaczy o przeciwnych znakach interesu. */
export function custodyClass(f: Fact): CustodyClass {
  if (f.custodians.length === 0) return "none";
  const pos = f.custodians.some((c) => c.interest > 0);
  const neg = f.custodians.some((c) => c.interest < 0);
  return pos && neg ? "dual" : "single";
}

export type DisclosureIncentive = "self-disclosing" | "requires-compulsion";

/**
 * Fakt trafia do logu bez przymusu wtedy i tylko wtedy, gdy istnieje posiadacz,
 * dla którego ujawnienie jest netto dodatnie. Koszt ujawnienia jest dodatni,
 * więc posiadacz OBOJĘTNY (interest === 0) też nie ujawnia z własnej woli:
 * fakty u obojętnych osób trzecich (bank, operator, szpital, rejestr) wymagają
 * takiego samego przymusu jak fakty niekorzystne dla pozwanego.
 */
export function disclosureIncentive(f: Fact): DisclosureIncentive {
  return f.custodians.some((c) => c.interest > 0)
    ? "self-disclosing"
    : "requires-compulsion";
}

export interface DisclosureSet {
  readonly by: NodeId;
  readonly facts: ReadonlySet<FactId>;
}

export function quorumIntersection(
  a: DisclosureSet,
  b: DisclosureSet,
): ReadonlySet<FactId> {
  const out = new Set<FactId>();
  for (const f of a.facts) if (b.facts.has(f)) out.add(f);
  return out;
}

/**
 * THM-A-02 (sprawdzalny wykonawczo): fakty rozstrzygające o single custody
 * nie mogą trafić do przecięcia kworów informacyjnych bez zewnętrznego przymusu.
 * Zwraca zbiór faktów, na których zbieżność jest formalnie niemożliwa.
 */
export function nonConvergentCore(
  facts: readonly Fact[],
  a: DisclosureSet,
  b: DisclosureSet,
): readonly FactId[] {
  const inter = quorumIntersection(a, b);
  return facts
    .filter((f) => f.decisive && custodyClass(f) !== "dual" && !inter.has(f.id))
    .map((f) => f.id);
}
```

---

## 4. Log tylko-do-dopisywania

`EntryKind.correction` jest jedynym dopuszczalnym sposobem zmiany treści: **nowy wpis wskazujący
poprzednika**, nigdy mutacja. To odróżnia korektę (widoczną, datowaną, przypisaną) od
`retroactive_relativization` (niewidocznej). Predykat `isAppendOnly` czyni różnicę maszynowo sprawdzalną.

```ts
export type Stage =
  | "S0" | "S1" | "S2" | "S3" | "S4" | "S5" | "S6" | "S7" | "S8";

export type DecisionMode = "evidence" | "authority";

export type EntryKind =
  | { readonly k: "filing"; readonly payload: Hash }
  | { readonly k: "disclosure"; readonly fact: FactId }
  | { readonly k: "withholding-detected"; readonly fact: FactId }
  | { readonly k: "preclusion"; readonly dropped: readonly FactId[] }
  | { readonly k: "order"; readonly text: Hash }
  | { readonly k: "commit"; readonly verdict: Hash; readonly mode: DecisionMode }
  /** Korekta NIE mutuje wpisu; jest nowym wpisem wskazującym poprzednika (INV-A-01). */
  | { readonly k: "correction"; readonly supersedes: EntryId; readonly reason: Hash }
  | { readonly k: "execution"; readonly effect: Hash; readonly compensable: boolean };

export interface Entry {
  readonly id: EntryId;
  readonly prev: Hash | null;
  readonly self: Hash;
  readonly lamport: Lamport;
  readonly author: NodeId;
  readonly stage: Stage;
  /** Wersja semantyki, w której wpis został wytworzony. Bez tego replay jest niemożliwy. */
  readonly schema: SchemaVersion;
  readonly kind: EntryKind;
}

export type CaseLog = readonly Entry[];

/** INV-A-01: łańcuch haszy spójny i monotoniczny w czasie logicznym. */
export function isAppendOnly(log: CaseLog, link: (e: Entry) => Hash): boolean {
  for (let i = 0; i < log.length; i++) {
    const e = log[i]!;
    if (e.self !== link(e)) return false;
    if (i === 0) {
      if (e.prev !== null) return false;
    } else {
      const p = log[i - 1]!;
      if (e.prev !== p.self) return false;
      if (e.lamport <= p.lamport) return false;
    }
  }
  return true;
}
```

---

## 5. Maszyna stanów `S0..S8`

Najważniejszy element tej sekcji to **nieobecność krawędzi**. `TRANSITIONS.S6` nie zawiera `"S2"`
i to jest maszynowa treść THM-A-01: apelacja może wrócić do rozprawy (`S4`), zmienić wyrok (`S5`)
albo go utrzymać, ale **nie może otworzyć discovery na nowo**. Log jest zamrożony, więc replay
reprodukuje defekt wejścia.

```ts
/**
 * Krawędzi S6 -> S2 NIE MA i to jest treść THM-A-01:
 * apelacja jest deterministycznym replayem na zamrożonym logu, nie ponownym
 * discovery. Rollback nie sięga poniżej granicy prekluzji, więc nie może
 * naprawić stage_corruption powstałej w S1/S2.
 */
export const TRANSITIONS: Readonly<Record<Stage, readonly Stage[]>> = {
  S0: ["S1"],
  S1: ["S2", "S5"],
  S2: ["S3"],
  S3: ["S2", "S4"],
  S4: ["S3", "S5"],
  S5: ["S6", "S7"],
  S6: ["S4", "S5", "S7"],
  S7: ["S8"],
  S8: [],
};

export function canTransition(from: Stage, to: Stage): boolean {
  return TRANSITIONS[from].includes(to);
}

/** Głębokość rollbacku dostępna z S6. d_max jest deklarowany PRZED commitem (INV-A-07). */
export interface RollbackPolicy {
  readonly dMaxInstances: number;
  readonly floorStage: Stage;
}

export const DEFAULT_ROLLBACK: RollbackPolicy = {
  dMaxInstances: 2,
  floorStage: "S3",
};
```

Krawędź `S1 → S5` (pominięcie discovery) modeluje nakaz zapłaty i wyrok zaoczny: w tej ścieżce
`Q_pozwany = ∅`, więc przecięcie kworów jest puste **trywialnie** i cały ciężar spoczywa na `force_gas`.
`S3 → S2` to jedyny legalny nawrót do discovery i on właśnie **wygasa** z prekluzją.

---

## 6. `force_gas` — metering

Dwa warianty tej samej operacji. Różnica jest w **typie zwracanym**, i to jest cały dowód FAIL-A-04:
wariant faktyczny nie ma konstruktora błędu, więc wywołujący nie ma czego obsłużyć.

```ts
export interface GasMeter {
  readonly balance: FG;
  readonly spent: FG;
}

export type Charge =
  | { readonly ok: true; readonly meter: GasMeter }
  | { readonly ok: false; readonly overdraft: FG };

/** Wariant poprawny: pre-execution check. Odmawia wykonania przy niewypłacalności. */
export function chargeChecked(m: GasMeter, amount: FG): Charge {
  if (amount > m.balance) return { ok: false, overdraft: fg(amount - m.balance) };
  return {
    ok: true,
    meter: { balance: fg(m.balance - amount), spent: fg(m.spent + amount) },
  };
}

/**
 * Wariant faktyczny (FAIL-A-04): brak pre-check. Wydatek zawsze udaje się lokalnie,
 * saldo schodzi poniżej zera, a niewypłacalność jest wykrywalna tylko post-hoc,
 * przez zewnętrzny pomiar dobrowolnej wykonalności w S7.
 */
export function chargeUnchecked(m: GasMeter, amount: FG): GasMeter {
  return { balance: fg(m.balance - amount), spent: fg(m.spent + amount) };
}
```

---

## 7. `majesty_switch`

```ts
export interface Posterior {
  /** Prawdopodobieństwo wariantu wybranego przez lidera. */
  readonly support: number;
  /** Entropia rozkładu na dopuszczalnych rozstrzygnięciach, w bitach. */
  readonly entropyBits: number;
}

export interface SwitchConfig {
  readonly entropyThresholdBits: number;
  readonly leaseSlackMs: WallMs;
}

export interface SwitchContext {
  readonly posterior: Posterior;
  readonly remainingLease: WallMs;
  readonly costToConverge: FG;
  readonly remainingBudget: FG;
}

/**
 * ALG-A-05. Predykat jest formalny i lokalnie sprawdzalny, ale NIEOBSERWOWALNY
 * z zewnątrz, bo żaden jego argument nie jest emitowany do logu publicznego.
 * `switchEmitsSameShape` niżej pokazuje, dlaczego detekcja jest niemożliwa.
 */
export function majestySwitch(ctx: SwitchContext, cfg: SwitchConfig): boolean {
  const uncertain = ctx.posterior.entropyBits > cfg.entropyThresholdBits;
  const outOfTime = ctx.remainingLease < cfg.leaseSlackMs;
  const outOfBudget = ctx.costToConverge > ctx.remainingBudget;
  return uncertain && (outOfTime || outOfBudget);
}

/** Kształt publicznego wyjścia. Identyczny w obu trybach -> detektor niemożliwy. */
export interface PublicJustification {
  readonly narrative: Hash;
  readonly citedNorms: readonly NormId[];
  /** null w systemie faktycznym; NN-A-04 wymaga wartości. */
  readonly calibratedSupport: number | null;
}

export function switchEmitsSameShape(
  a: PublicJustification,
  b: PublicJustification,
): boolean {
  return a.calibratedSupport === null && b.calibratedSupport === null;
}
```

Wszystkie trzy argumenty `SwitchContext` są **prywatne dla lidera**. `PublicJustification` nie zawiera
żadnego z nich. Stąd twierdzenie o nieobserwowalności ma postać czysto typową: nie istnieje totalna
funkcja `PublicJustification → DecisionMode` lepsza od stałej, bo dziedzina nie zawiera informacji
odróżniającej.

---

## 8. Kompletność i wyrok

```ts
export interface Completeness {
  readonly droppedByPreclusion: readonly FactId[];
  readonly singleCustodyDecisive: readonly FactId[];
  readonly assumedDelivery: boolean;
  readonly calibrated: Posterior;
}

export interface Verdict {
  readonly case: CaseId;
  readonly mode: DecisionMode;
  readonly forceGasSpent: FG;
  readonly completeness: Completeness;
  readonly schema: SchemaVersion;
  readonly rollback: RollbackPolicy;
  readonly committedAt: Lamport;
}

/** INV-A-04: finalizacja bez pełnej deklaracji kompletności jest nieważna. */
export function completenessDeclared(v: Verdict): boolean {
  return (
    Number.isFinite(v.completeness.calibrated.support) &&
    v.completeness.calibrated.support >= 0 &&
    v.completeness.calibrated.support <= 1
  );
}

/** INV-A-06: tryb authority wymaga niezerowego wydatku FG i odwrotnie. */
export function gasAccountingConsistent(v: Verdict): boolean {
  return (v.mode === "authority") === (v.forceGasSpent > 0);
}
```

`Completeness` jest polem **wymaganym**, nie opcjonalnym. To jest cała różnica między moim modelem
a systemem faktycznym: obecny `Verdict` ma kształt `{ case, narrative }` i nie da się z niego wyliczyć
ani `mode`, ani `forceGasSpent`, ani niczego z `Completeness`.

---

## 9. Sygnatury algorytmów

```ts
export interface IntakeInput {
  readonly case: CaseId;
  readonly payload: Hash;
  readonly filedBy: NodeId;
  /** Commit poza kontrolą organu (INV-A-05). */
  readonly externalTimestamp: Hash;
}

export type ConvergenceCertificate =
  | { readonly kind: "converged"; readonly witnesses: readonly FactId[] }
  | { readonly kind: "non-convergent"; readonly blockedBy: readonly FactId[] };

export interface DiscoveryResult {
  readonly log: CaseLog;
  readonly cert: ConvergenceCertificate;
  readonly gas: GasMeter;
}

/** ALG-A-01, S1. O(|payload|). */
export type Intake = (i: IntakeInput, log: CaseLog) => CaseLog;

/** ALG-A-02, S2. O(r * |F|) rund; r ograniczone budżetem strony, nie zbieżnością. */
export type DiscoverySync = (
  facts: readonly Fact[],
  disclosures: readonly DisclosureSet[],
  gas: GasMeter,
  log: CaseLog,
) => DiscoveryResult;

/** ALG-A-03, S3. Region-free po czasie życia, nie po osiągalności. O(|F|). */
export type PreclusionGC = (
  log: CaseLog,
  now: WallMs,
  ttl: WallMs,
) => { readonly log: CaseLog; readonly dropped: readonly FactId[] };

/** ALG-A-06, S5. Finalizacja. */
export type Commit = (
  log: CaseLog,
  mode: DecisionMode,
  spent: FG,
  completeness: Completeness,
) => Verdict;

/**
 * ALG-A-07, S6. Sygnatura jest dowodem THM-A-01: funkcja nie przyjmuje świata,
 * tylko log. Jeżeli log jest skorumpowany, replay reprodukuje korupcję.
 */
export type AppealReplay = (
  log: CaseLog,
  policy: RollbackPolicy,
  delta: TransitionFn,
) => Verdict;

export type TransitionFn = (
  log: CaseLog,
  stage: Stage,
  schema: SchemaVersion,
) => { readonly stage: Stage; readonly log: CaseLog };

/** ALG-A-08, S7. Efekty w świecie; część z nich niekompensowalna. */
export type Execute = (
  v: Verdict,
) => { readonly compensable: boolean; readonly effect: Hash };
```

`ConvergenceCertificate` jest wymaganym wyjściem `DiscoverySync`. System faktyczny go nie produkuje:
zamknięcie postępowania dowodowego nie odróżnia „stan uzgodniony" od „skończył się czas".
To jedno brakujące pole odpowiada za większość `stage_corruption`, bo bez niego S4 nie wie,
na jakim stanie pracuje.

---

## 10. Precedens jako migracja schematu

```ts
export interface Precedent {
  readonly from: SchemaVersion;
  readonly to: SchemaVersion;
  /** Wysokość aktywacji w czasie logicznym. Wymagane przez NN-A-05. */
  readonly activationLamport: Lamport;
  /** true = teoria deklaratywna: „norma zawsze tak brzmiała”. */
  readonly declarativeBackdate: boolean;
}

/**
 * ALG-A-09. Przy declarativeBackdate === false funkcja zależy wyłącznie od `at`
 * i jest deterministyczna. Przy true zależy dodatkowo od zbioru precedensów
 * znanych w chwili zapytania, czyli od wall-clock -> replay traci determinizm
 * (naruszenie INV-A-03).
 */
export function interpretationAt(
  at: Lamport,
  precedents: readonly Precedent[],
  base: SchemaVersion,
): SchemaVersion {
  let v = base;
  for (const p of precedents) {
    if (p.declarativeBackdate || p.activationLamport <= at) v = p.to;
  }
  return v;
}

export function replayDeterministic(ps: readonly Precedent[]): boolean {
  return ps.every((p) => !p.declarativeBackdate);
}
```

Warunek `p.declarativeBackdate || p.activationLamport <= at` jest dosłownym zapisem niespójności:
lewa gałąź ignoruje `at`. Sprawa z `Lamport = 100` dostaje semantykę precedensu aktywowanego na 500.

---

## 11. Zegar semantyczny: version vectors

```ts
export type VersionVector = ReadonlyMap<NormId, number>;

export function dominates(a: VersionVector, b: VersionVector): boolean {
  for (const [k, vb] of b) if ((a.get(k) ?? 0) < vb) return false;
  return true;
}

/** Konkurencyjne wykładnie: żadna nie dominuje. LWW cicho gubi jedną z nich. */
export function concurrent(a: VersionVector, b: VersionVector): boolean {
  return !dominates(a, b) && !dominates(b, a);
}

export type MergeStrategy = "last-write-wins" | "multi-value";

/** NN-A-06: LWW zwraca jedną wersję i gubi drugą bez śladu; MV zwraca konflikt. */
export function mergeMeaning(
  a: VersionVector,
  b: VersionVector,
  s: MergeStrategy,
): { readonly conflict: boolean; readonly heads: readonly VersionVector[] } {
  if (!concurrent(a, b)) {
    return { conflict: false, heads: [dominates(a, b) ? a : b] };
  }
  return s === "multi-value"
    ? { conflict: true, heads: [a, b] }
    : { conflict: false, heads: [b] };
}
```

`onto_epistemic_drift` to dokładnie sytuacja `MergeStrategy = "last-write-wins"`: dwie linie wykładni
tego samego terminu są równoległe (`concurrent`), a system rozstrzyga je nowszą datą orzeczenia.
LWW ma udowodnioną własność **lost update** — traci zapis bez śladu. MV-register jej nie ma:
zwraca zbiór głów i zmusza do jawnego rozstrzygnięcia. Koszt różnicy to jedno pole w metadanych.

---

## 12. Próg bizantyjski przy awarii skorelowanej

```ts
/**
 * THM-A-07. p = prawdopodobieństwo błędu pojedynczej instancji,
 * rho = udział wariancji pochodzącej ze wspólnego czynnika reputacyjnego,
 * n = liczba instancji kontrolnych.
 * Przy rho > 0 dokładność nie zbiega do 1 wraz z n: floor = rho * p.
 */
export function jointFailureProbability(p: number, rho: number, n: number): number {
  return rho * p + (1 - rho) * Math.pow(p, n);
}

export function redundancyIsUseful(p: number, rho: number, target: number): boolean {
  return rho * p < target;
}

/** INV-A-10: zbiór weryfikujący musi być rozłączny z pulą reputacyjną badanego. */
export function heterogeneousReview(
  subject: NodeDescriptor,
  reviewers: readonly NodeDescriptor[],
): boolean {
  return reviewers.every((r) => r.reputationPool !== subject.reputationPool);
}
```

---

## 13. Doręczenie

```ts
export type DeliveryProof =
  | { readonly kind: "acknowledged"; readonly by: NodeId; readonly at: Lamport }
  | { readonly kind: "assumed"; readonly attempts: number; readonly channel: string };

/** INV-A-09: fikcja doręczenia jest dopuszczalna, ale musi propagować się do wyroku. */
export function assumedDeliveryPropagates(
  proofs: readonly DeliveryProof[],
  c: Completeness,
): boolean {
  const anyAssumed = proofs.some((p) => p.kind === "assumed");
  return anyAssumed ? c.assumedDelivery : true;
}
```

Pole `channel` istnieje po to, by wymusić eskalację: bounded retry na **tym samym** kanale nie zmniejsza
skorelowanego `p_loss` (drugie awizo pod ten sam nieistniejący adres to nie druga próba, tylko ta sama).

---

## 14. Dryf sumaryczny `D(t)`

Ten fragment należy formalnie do toru II, ale mechanika jest częścią specyfikacji, bo `senseLost`
jest predykatem systemowym, a nie retoryką. Parametry — `30-CONCESSIONS.md`.

```ts
export type Accumulation =
  | { readonly f: "linear"; readonly a: number }
  | { readonly f: "exponential"; readonly lambda: number }
  | { readonly f: "threshold"; readonly tStar: number; readonly m: number };

export interface Concession {
  readonly id: string;
  readonly cost: DU;
  readonly kappa: Accumulation;
  readonly channelFamily: string;
  readonly revoked: (t: number) => boolean;
}

export function kappaAt(k: Accumulation, t: number): number {
  switch (k.f) {
    case "linear": return 1 + k.a * t;
    case "exponential": return Math.exp(k.lambda * t);
    case "threshold": return t < k.tStar ? 1 : k.m;
  }
}

/** D(t) = suma c_i*kappa_i(t) + gamma * suma par w tej samej rodzinie kanałów. */
export function drift(cs: readonly Concession[], t: number, gamma: number): DU {
  const live = cs.filter((c) => !c.revoked(t));
  let d = 0;
  for (const c of live) d += c.cost * kappaAt(c.kappa, t);
  for (let i = 0; i < live.length; i++) {
    for (let j = i + 1; j < live.length; j++) {
      const a = live[i]!, b = live[j]!;
      if (a.channelFamily === b.channelFamily) d += gamma * a.cost * b.cost;
    }
  }
  return du(d);
}

export const DRIFT_THRESHOLD: DU = du(100);

export function senseLost(cs: readonly Concession[], t: number, gamma: number): boolean {
  return drift(cs, t, gamma) >= DRIFT_THRESHOLD;
}
```

---

## 15. Harness — twierdzenia sprawdzone wykonawczo

Poniższy moduł importuje powyższy i **został uruchomiony**. Wyniki w komentarzach są rzeczywistym
wyjściem, nie oczekiwaniem.

```ts
import {
  type Fact, type DisclosureSet, type NodeDescriptor, type Concession,
  type Verdict, type Precedent, type VersionVector,
  nodeId, factId, normId, caseId, lam, fg, du, sv,
  custodyClass, disclosureIncentive, nonConvergentCore, canTransition,
  jointFailureProbability, heterogeneousReview,
  interpretationAt, replayDeterministic, mergeMeaning,
  gasAccountingConsistent, completenessDeclared,
  drift, DRIFT_THRESHOLD,
} from "./spec.js";

/* --- Sprawdzian 1: THM-A-02, jądro niezbieżne ------------------------ */

const D_NODE = nodeId("pozwany");
const P_NODE = nodeId("powod");

const FACTS: readonly Fact[] = [
  { id: factId("f-umowa"), decisive: true, selfVerifying: true,
    custodians: [{ node: P_NODE, interest: 1 }, { node: D_NODE, interest: -1 }] },
  { id: factId("f-log-wewnetrzny"), decisive: true, selfVerifying: false,
    custodians: [{ node: D_NODE, interest: -1 }] },
  { id: factId("f-zamiar"), decisive: true, selfVerifying: false,
    custodians: [{ node: D_NODE, interest: -1 }] },
  { id: factId("f-data"), decisive: false, selfVerifying: true,
    custodians: [{ node: P_NODE, interest: 0 }, { node: D_NODE, interest: 0 }] },
];

const Q_P: DisclosureSet = { by: P_NODE, facts: new Set([factId("f-umowa"), factId("f-data")]) };
const Q_D: DisclosureSet = { by: D_NODE, facts: new Set([factId("f-umowa"), factId("f-data")]) };

export const NONCONVERGENT = nonConvergentCore(FACTS, Q_P, Q_D);
// wynik: [ 'f-log-wewnetrzny', 'f-zamiar' ]

export const CUSTODY_REPORT = FACTS.map((f) => [f.id, custodyClass(f)] as const);
// wynik: umowa=dual, log-wewnetrzny=single, zamiar=single, data=single

export const INCENTIVE_REPORT = FACTS.map((f) => [f.id, disclosureIncentive(f)] as const);
// wynik: umowa=self-disclosing, pozostałe trzy=requires-compulsion
// (w tym 'f-data' — fakt NEUTRALNY, obojętny dla obu posiadaczy)

/* --- Sprawdzian 2: THM-A-01, brak krawędzi S6 -> S2 ------------------ */

export const APPEAL_CANNOT_REOPEN_DISCOVERY = canTransition("S6", "S2") === false;
// wynik: true

/* --- Sprawdzian 3: THM-A-07, podłoga redundancji --------------------- */

export const REDUNDANCY = [1, 2, 3, 10].map(
  (n) => 1 - jointFailureProbability(0.1, 0.7, n),
);
// wynik: [0.9000, 0.9270, 0.9297, 0.9300] — dziesiąta instancja daje +0.03 pp.

const mkNode = (id: string, pool: string): NodeDescriptor => ({
  id: nodeId(id), role: "court", reputationPool: pool, mayWithhold: false,
  objective: { wClient: 0.2, wSelf: 0.4, wSystem: 0.4 },
});

export const SELF_REVIEW_REJECTED = heterogeneousReview(
  mkNode("sad-i", "judiciary"),
  [mkNode("sad-ii", "judiciary"), mkNode("sad-iii", "judiciary")],
) === false;
// wynik: true

/* --- Sprawdzian 4: THM-A-06, determinizm replayu --------------------- */

const DECLARATIVE: readonly Precedent[] = [
  { from: sv(1), to: sv(2), activationLamport: lam(500), declarativeBackdate: true },
];
const VERSIONED: readonly Precedent[] = [
  { from: sv(1), to: sv(2), activationLamport: lam(500), declarativeBackdate: false },
];

export const REPLAY_BROKEN = !replayDeterministic(DECLARATIVE);              // true
export const OLD_CASE_UNDER_DECLARATIVE = interpretationAt(lam(100), DECLARATIVE, sv(1)); // 2
export const OLD_CASE_UNDER_VERSIONED = interpretationAt(lam(100), VERSIONED, sv(1));     // 1
// sprawa sprzed aktywacji dostaje nową semantykę tylko w wariancie deklaratywnym

/* --- Sprawdzian 5: onto_epistemic_drift, LWW gubi wykładnię ---------- */

const RAZACE = normId("razace-niedbalstwo");
const vA: VersionVector = new Map([[RAZACE, 3]]);
const vB: VersionVector = new Map([[RAZACE, 2], [normId("nalezyta-starannosc"), 1]]);

export const LWW = mergeMeaning(vA, vB, "last-write-wins"); // conflict: false — cicha strata
export const MV = mergeMeaning(vA, vB, "multi-value");      // conflict: true  — wykrywalne

/* --- Sprawdzian 6: księgowanie force_gas ----------------------------- */

const VERDICT: Verdict = {
  case: caseId("C-1"),
  mode: "authority",
  forceGasSpent: fg(3),
  completeness: {
    droppedByPreclusion: [factId("f-zamiar")],
    singleCustodyDecisive: [factId("f-log-wewnetrzny")],
    assumedDelivery: false,
    calibrated: { support: 0.58, entropyBits: 0.98 },
  },
  schema: sv(2),
  rollback: { dMaxInstances: 2, floorStage: "S3" },
  committedAt: lam(900),
};

export const VERDICT_WELL_FORMED =
  gasAccountingConsistent(VERDICT) && completenessDeclared(VERDICT);
// wynik: true

/* --- Sprawdzian 7: D(t) i próg utraty sensu -------------------------- */

const never = (_t: number): boolean => false;

export const LEDGER: readonly Concession[] = [
  { id: "CON-A-01", cost: du(12), kappa: { f: "linear", a: 0.15 },      channelFamily: "observability", revoked: never },
  { id: "CON-A-02", cost: du(9),  kappa: { f: "exponential", lambda: 0.10 }, channelFamily: "observability", revoked: never },
  { id: "CON-A-03", cost: du(5),  kappa: { f: "linear", a: 0.08 },      channelFamily: "ordering",      revoked: never },
  { id: "CON-A-04", cost: du(7),  kappa: { f: "threshold", tStar: 3, m: 2.5 }, channelFamily: "replay",  revoked: never },
  { id: "CON-A-05", cost: du(4),  kappa: { f: "linear", a: 0.05 },      channelFamily: "replay",        revoked: never },
  { id: "CON-A-06", cost: du(8),  kappa: { f: "exponential", lambda: 0.12 },  channelFamily: "observability", revoked: never },
  { id: "CON-A-07", cost: du(3),  kappa: { f: "linear", a: 0.04 },      channelFamily: "delivery",      revoked: never },
  { id: "CON-A-08", cost: du(6),  kappa: { f: "threshold", tStar: 4, m: 3.0 }, channelFamily: "failure-model", revoked: never },
];

export const D0 = drift(LEDGER, 0, 0.02);   // 60.08 du
export const D4 = drift(LEDGER, 4, 0.02);   // 102.02 du
export const CROSSED = D4 >= DRIFT_THRESHOLD; // true
```

---

## 16. Niezmienniki

| ID | Treść | Egzekwowany w | Wykrywalność naruszenia |
|----|-------|---------------|--------------------------|
| `INV-A-01` | Log jest append-only; korekta to nowy wpis wskazujący poprzednika, nigdy mutacja. `isAppendOnly` musi zwracać `true` po każdym zapisie. | S1–S8 | tak, `O(n)`, o ile hasze są commitowane zewnętrznie; bez tego **nie** |
| `INV-A-02` | Każdy fakt `decisive` ma `custodyClass = "dual"` albo wyrok niesie go w `singleCustodyDecisive`. | S2, S5 | tak, `O(\|F\|)` |
| `INV-A-03` | `δ` nie zależy od wall-clock; zależność od semantyki jest jawna przez `SchemaVersion`. | S4–S8 | tak, przez replay: `replayDeterministic` |
| `INV-A-04` | Finalizacja niesie pełny `Completeness`, w tym `calibrated.support ∈ [0,1]`. | S5 | tak, `O(1)`, `completenessDeclared` |
| `INV-A-05` | Moment wpływu i każda zmiana kolejności są commitowane poza kontrolą organu. | S1, S3, S4 | tak, przez porównanie z rejestrem zewnętrznym |
| `INV-A-06` | `mode = "authority" ⟺ forceGasSpent > 0`; suma FG per organ jest publiczna. | S4, S5 | tak, `O(1)`, `gasAccountingConsistent` |
| `INV-A-07` | `RollbackPolicy` jest deklarowana **przed** commitem; to, co poniżej `floorStage`, jest oznaczone jako nieodwracalne przed, nie po. | S5 | tak, `O(1)` |
| `INV-A-08` | Każdy termin normatywny w uzasadnieniu niesie `VersionVector`; strategia scalania to `multi-value`, nigdy LWW. | S4, S8 | tak, `concurrent()` |
| `INV-A-09` | `assumed delivery ⇒ Completeness.assumedDelivery === true`, flaga propaguje się do S7. | S1, S5, S7 | tak, `assumedDeliveryPropagates` |
| `INV-A-10` | Zbiór weryfikujący jest rozłączny z pulą reputacyjną weryfikowanego. | S6 | tak, `heterogeneousReview` — ale w systemie faktycznym zwraca `false` zawsze |

Kolumna „wykrywalność" jest tu najważniejsza. Niezmiennik niewykrywalny nie jest niezmiennikiem,
tylko postulatem. Wszystkie dziesięć są wykrywalne w czasie co najwyżej liniowym — **pod warunkiem**,
że system emituje odpowiednie pola. Żadnego z nich nie emituje. Koszt emisji jest w każdym przypadku
metadanymi, nie obliczeniem.

---

## 17. Złożoność

| Etap | Algorytm | Złożoność | Czynnik dominujący |
|------|----------|-----------|--------------------|
| S1 | `Intake` | `O(\|payload\|)` | walidacja schematu |
| S2 | `DiscoverySync` | `O(r · \|F\|)` | `r` = liczba rund; **ograniczone budżetem strony, nie zbieżnością** — to jest sedno |
| S3 | `PreclusionGC` | `O(\|F\|)` | region-free, bez traversal |
| S4 | `orchestrate` | `O(\|F\| · c_attention)` | `c_attention` skończone i mniejsze od `\|F\|` (THM-A-11) |
| S5 | `Commit` | `O(1)` | jedno przejście |
| S6 | `AppealReplay` | `O(d · \|L\|)`, `d ≤ 2` | replay całego logu na instancję |
| S7 | `Execute` | `O(1)` amortyzowane, ale **nieidempotentne** dla efektów niekompensowalnych | |
| S8 | `precedentMigration` | `O(1)` przy activation height; **nieokreślone** przy `declarativeBackdate` | migracja wsteczna nie ma zdefiniowanego zbioru rekordów |

Wiersz S2 jest twierdzeniem, nie tabelką: w poprawnym protokole synchronizacji liczba rund jest funkcją
rozbieżności stanu i zatrzymuje się na zbieżności. Tutaj zatrzymuje się na wyczerpaniu budżetu strony.
Zatem **asymetria budżetów stron przekłada się bezpośrednio na asymetrię pokrycia stanu**, i to jest
w pełni deterministyczny, przewidywalny efekt, nie „nierówność szans" w sensie publicystycznym.

---

## 18. Tryby awarii

| ID | Tryb | Wyzwalacz | Objaw | Wykrywalny? |
|----|------|-----------|-------|-------------|
| `FAIL-A-01` | `stage_corruption` | defekt w S1/S2 | wynik nieodróżnialny od poprawnego; apelacja go utrwala | nie |
| `FAIL-A-02` | non-convergent core przemilczany | `decisive ∧ single custody` | wyrok na niepełnym stanie bez oznaczenia | nie (brak `ConvergenceCertificate`) |
| `FAIL-A-03` | `majesty_switch` bez śladu | `H > θ ∧ lease < τ` | authority-commit z gramatyką evidence-commitu | nie (THM-A-05) |
| `FAIL-A-04` | overdraft `force_gas` | `chargeUnchecked` przy `balance ≤ 0` | brak sygnału; fork społeczny z opóźnieniem lat | tylko post-hoc, zewnętrznie |
| `FAIL-A-05` | use-after-free po prekluzji | fakt zwolniony, potem potrzebny | undefined behavior zamiast `panic` | nie |
| `FAIL-A-06` | lost update wykładni | LWW na `concurrent` wersjach | jedna linia orzecznicza znika bez śladu | nie przy LWW; tak przy MV |
| `FAIL-A-07` | skorelowana awaria instancji | `ρ > 0` | trzy zgodne wyroki mylnie czytane jako trzy niezależne potwierdzenia | nie bez `reputationPool` |
| `FAIL-A-08` | fałszywa fikcja doręczenia | `p_loss` skorelowane z klasą pozwanego | `Q_pozwany = ∅`, przecięcie kworów puste trywialnie | częściowo, przez wskaźnik wyroków zaocznych per klasa |
| `FAIL-A-09` | niedeterministyczny replay | `declarativeBackdate` | pytanie audytowe bez zdefiniowanej odpowiedzi | tak, statycznie: `replayDeterministic` |
| `FAIL-A-10` | MEV kolejności | brak zewnętrznego timestampu | opóźnienie jako produkt | tak, przy `INV-A-05`; inaczej nie |

Osiem z dziesięciu trybów awarii jest **niewykrywalnych**, i wszystkie osiem stałyby się wykrywalne
przez dodanie pól metadanych, których koszt obliczeniowy jest zerowy. To jest najostrzejszy wniosek
całej specyfikacji: **bariera nie jest techniczna ani kosztowa; brak instrumentacji jest równowagą
(THM-A-05), a nie zaniedbaniem.**

---

*Agent A · tor I · Justice-as-Code v1.0*
