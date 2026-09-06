# AGENT C — 10-SPEC (tor I, suwerenny)

Specyfikacja wykonywalna. Kod poniżej **został uruchomiony** (Node 22.14, `node --experimental-strip-types`); wszystkie liczby cytowane w `00-MODEL.md`, `20-DYNAMICS.md` i `40-NONNEGOTIABLE.md` pochodzą z jego przebiegów.

Zgodnie z zakresem zadania kod istnieje wyłącznie jako blok w dokumencie — nie tworzę plików w `src/`.

---

## 1. Typy i wektor stanu

Krok symulacji `Δ = 1 kwartał = 90 dni`. Normalizacja obciążenia: `N = 1` (jedno kwartalne obciążenie sądu; `ASSUMPTION` bezwzględne `N = 1·10⁵ spraw/kwartał`).

| symbol | znaczenie | jednostka | zakres |
|--------|-----------|-----------|--------|
| `q` | rzeczywista trafność rozstrzygnięć | bezwym. | `[0,1]` |
| `L` | legitymacja postrzegana (jedyne wyjście mierzone) | bezwym. | `[0,1]` |
| `E` | zapas błędu zamaskowanego (integrator) | caseload-kwartał | `[0,∞)` |
| `G` | rezerwa `force_gas` | AU | `[0, Gmax]` |
| `O` | obserwowalność strukturalna | bezwym. | `[0,1]` |
| `V_p` | wariancja proceduralna (`stage_corruption`) | bezwym. | `[0,1]` |
| `Θ` | dryf punktu odniesienia | jedn. jakości | `[0,1]` |
| `S` | udział obciążenia na komponentach bez redundancji | bezwym. | `[0,1]` |
| `M` | frakcja rozstrzygnięć w trybie autorytetu (wyjście, nie stan) | bezwym. | `[0,1]` |

---

## 2. Niezmienniki

| ID | Twierdzenie | Egzekwowany na | Naruszenie wykrywalne? |
|----|-------------|----------------|------------------------|
| `INV-C-01` | `rank(Ob(A, C)) = n` dla podprzestrzeni `(q, Θ)` | `S2`, `S8` | **nie** przy obecnym `C` — to jest treść `NN-C-01` |
| `INV-C-02` | `E ≥ 0` oraz `dE/dt ≤ ν·(1−q)` (dopływ ograniczony) | `S5` | tylko przy `O > 0`; przy `O = 0` niewykrywalne |
| `INV-C-03` | `γ_eff = γ₀·O < g_crit(τ_a) = 2·sin(π/(2(2τ_a+1)))` | `S6` | tak — po amplitudzie oscylacji `E` |
| `INV-C-04` | `G ≥ G_min > 0` (niezerowa rezerwa autorytetu) | `S4` | tak, ale **nie jest mierzone** — patrz `RES-C-01` |
| `INV-C-05` | `c_m·φ·O > c_d` (ujawnienie jest best response) | `S2`, `S5` | tak, jeśli `c_d`, `c_m`, `φ`, `O` są jawne |
| `INV-C-06` | `V = V_p ⊕ V_fact` rozdzielne, oba raportowane osobno | `S1`, `S2` | tak, wymaga `SLI-C-02` |
| `INV-C-07` | `S ≤ S_max` — brak pojedynczego punktu orzeczniczego | `S4` | tak, przez test wypadnięcia (chaos engineering) |
| `INV-C-08` | kanał oceny jakości rozłączny z kanałem sterowania legitymacją | `S8` | tak, przez rangę `C` |

`INV-C-01` jest naruszony **w konfiguracji domyślnej**, nie na skutek błędu. To jest główny wynik strukturalny modelu.

---

## 3. Maszyna stanów `S0..S8` jako pipeline sterowania

```
S0 ──►S1 ──► S2 ──► S3 ──► S4 ──► S5 ──┬──► S7 (efekty, nieodwracalne)
      │      │      │      │           │
    +V_p   ±O     hard    ±M,−G      +E  └──► S6 ──(τ_a = 8 kw)──► −E   [jedyna pętla ujemna]
                deadline                        │
                                                └──► S8 ──► +Θ  [zapis do punktu odniesienia]
```

Reguły przejść istotne dla dynamiki:

- `S3 → S4` z twardym deadlinem (prekluzja). To **saturacja czasowa aktuatora**: brak czasu na dowód nie zmniejsza obowiązku rozstrzygnięcia, więc różnica jest pokrywana z `G` (`ALG-C-05`).
- `S5` jest jedynym przejściem, które **inkrementuje `E`**. Przed `S5` błąd jest wariancją; po `S5` staje się zapasem.
- `S6` drenuje `E` z wzmocnieniem `γ₀·O` i opóźnieniem `τ_a`. Przy `O = 0` dren jest **zamknięty**, a integrator nie ma wyjścia (`FAIL-C-01`).
- `S8` jest jedyną operacją zapisu do `Θ`. Bez `INV-C-08` `S8` może być użyte do skasowania rozbieżności między `q` a `L` przez podniesienie zera skali.

---

## 4. Model — kod

```ts
// ===== PARAMETRY =====================================================
export interface Params {
  // mechanizm ujawnienia/maskowania (RU = reputation unit)
  c_d: number;      // koszt samo-ujawnienia błędu [RU]
  c_m: number;      // koszt błędu wykrytego z zewnątrz [RU]
  phi: number;      // P(wykrycie | działający czujnik) [-]
  kappa: number;    // ostrość reakcji strategicznej [1/RU]
  // korekta odwoławcza (S6)
  gamma0: number;   // maks. tempo korekty przy O=1 [1/kw]
  tau_a: number;    // opóźnienie S5→S6 [kw]
  tau_L: number;    // opóźnienie percepcji legitymacji [kw]
  // obserwowalność (S2)
  eta: number;      // tempo instalacji czujników [1/kw]
  O_target: number; // deklarowany cel obserwowalności [-]
  rho: number;      // współczynnik demontażu czujnika pod presją E [1/kw]
  // legitymacja
  mu: number;       // tempo adaptacji L [1/kw]
  delta_e: number;  // wrażliwość L na błąd UJAWNIONY [-]
  delta_m: number;  // krótkoterminowa premia L za rozstrzygnięcie autorytetem [-]
  // wariancja / stage corruption (S1, S2)
  xi: number;       // przyrost wariancji proceduralnej przy O=0 [1/kw]
  xi_m: number;     // przyrost wariancji z trybu autorytetu [1/kw]
  chi: number;      // relaksacja wariancji proceduralnej [1/kw]
  V_fact: number;   // NIEREDUKOWALNA niepewność faktyczna [-]
  // dryf odniesienia (S8)
  zeta: number;     // przyrost dryfu na jednostkę relatywizacji [1/kw]
  c_cal: number;    // siła kalibracji przez obserwowalność [1/kw]
  // force_gas (S4)
  Gmax: number;     // pojemność rezerwuaru [AU]
  gRegen: number;   // regeneracja przy L=1 [AU/kw]
  gSpend: number;   // wydatek przy pełnym trybie autorytetu [AU/kw]
  theta_conf: number; // próg pewności dowodowej [-]
  // jakość
  lambda_q: number; // tempo relaksacji q [1/kw]
  q_max: number;    // sufit jakości [-]
  a_v: number;      // waga wariancji w suficie jakości [-]
  a_th: number;     // waga dryfu [-]
  a_m: number;      // waga trybu autorytetu [-]
  nu: number;       // udział błędów zauważonych wewnętrznie [-]
  // saint_dependency
  s_up: number; s_dn: number; saintHazard: number;
  // czujnik out-of-band (druga niezależna linia macierzy C); 0 = brak
  oob: number;
}

export const BASE: Params = {
  c_d: 1.0, c_m: 8.0, phi: 0.5, kappa: 6.0,
  gamma0: 0.30, tau_a: 8, tau_L: 3,
  eta: 0.05, O_target: 0.60, rho: 0.25,
  mu: 0.20, delta_e: 1.2, delta_m: 0.15,
  xi: 0.05, xi_m: 0.06, chi: 0.10, V_fact: 0.12,
  zeta: 0.06, c_cal: 0.05,
  Gmax: 100, gRegen: 3.0, gSpend: 12, theta_conf: 0.55,
  lambda_q: 0.15, q_max: 0.95, a_v: 0.60, a_th: 0.50, a_m: 0.45,
  nu: 0.40,
  s_up: 0.06, s_dn: 0.02, saintHazard: 0.0,
  oob: 0.0,
};

// ===== STAN ==========================================================
export interface State {
  t: number;
  q: number; L: number; E: number; G: number;
  O: number; Vp: number; Th: number; S: number; M: number;
  Ebuf: number[];  // linia opóźniająca S5→S6 (tau_a)
  Lbuf: number[];  // linia opóźniająca percepcji (tau_L)
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const clamp01 = (x: number) => clamp(x, 0, 1);
const logistic = (x: number) => 1 / (1 + Math.exp(-x));

export function initState(p: Params): State {
  return {
    t: 0, q: 0.80, L: 0.70, E: 0.02, G: p.Gmax, O: 0.55,
    Vp: 0.05, Th: 0.0, S: 0.20, M: 0.0,
    Ebuf: new Array(p.tau_a + 1).fill(0.02),
    Lbuf: new Array(p.tau_L + 1).fill(0.70),
  };
}

// ===== ALG-C-01: best response aktora (reputation_coupling) ==========
// Ujawnienie kosztuje c_d na pewno. Maskowanie kosztuje c_m tylko gdy wykryte,
// a P(wykrycie) = phi*O. Maskowanie dominuje iff  c_d > c_m*phi*O,
// czyli iff  O < O* = c_d/(c_m*phi).   Dla BASE: O* = 0.25.
export function maskingRate(p: Params, O: number): number {
  const advantage = p.c_d - p.c_m * p.phi * O;   // [RU]
  return logistic(p.kappa * advantage);
}

// ===== ALG-C-02: pewność dowodowa orkiestratora ======================
export function evidenceConfidence(p: Params, s: State): number {
  const V = s.Vp + p.V_fact;
  return clamp01(s.O * (1 - V) - Math.abs(s.Th));
}

// ===== ALG-C-03 / ALG-C-05: krok symulacji + majesty_switch ==========
export interface StepOpts { majestyEnabled?: boolean; rng?: () => number }

export function step(p: Params, s: State, o: StepOpts = {}): State {
  const majesty = o.majestyEnabled ?? true;
  const rng = o.rng ?? Math.random;

  const V = s.Vp + p.V_fact;
  const conf = evidenceConfidence(p, s);

  // --- majesty_switch: popyt na autorytet = deficyt pewności dowodowej.
  //     Pokrycie ograniczone rezerwuarem => NASYCENIE AKTUATORA.
  const demand = clamp01((p.theta_conf - conf) / p.theta_conf);
  const M = majesty && s.G > 0 ? Math.min(demand, s.G / p.gSpend) : 0;
  const unresolved = demand - M;                     // popyt bez pokrycia = deadlock S4
  const spend = p.gSpend * M;
  const G1 = clamp(s.G + p.gRegen * s.L - spend, 0, p.Gmax);

  // --- reputation_coupling: maskowanie jako best response -> dopływ do E
  const m = maskingRate(p, s.O);
  const inflow = p.nu * (1 - s.q) * m;
  const Edel = s.Ebuf[0];                             // stan sprzed tau_a kwartałów
  const outflow = p.gamma0 * s.O * Edel;              // korekta S6 drenuje TYLKO to, co widać
  const E1 = Math.max(0, s.E + inflow - outflow);     // nasycenie dolne => chattering, nie oscylacja

  // --- systemic_blindness: presja demontażu czujnika rośnie z ukrytym zapasem
  const O1 = clamp01(s.O + p.eta * (p.O_target - s.O) - p.rho * s.O * s.E + p.oob);

  // --- stage_corruption: wariancja proceduralna z S1/S2 + z trybu autorytetu
  const Vp1 = clamp(s.Vp + p.xi * (1 - s.O) + p.xi_m * M - p.chi * s.Vp, 0, 1);

  // --- retroactive_relativization -> onto_epistemic_drift (S8)
  const retro = clamp01(s.E * (1 - s.O));
  const Th1 = clamp(s.Th + p.zeta * retro - p.c_cal * s.O * s.Th, 0, 1);

  // --- saint_dependency: brak redundancji, awaria skokowa
  const S1raw = s.S + p.s_up * ((V + (1 - s.O)) / 2) * (1 - s.S) - p.s_dn * s.S;
  let S1 = clamp01(S1raw);
  let saintLoss = 0;
  if (p.saintHazard > 0 && rng() < p.saintHazard) { saintLoss = S1 * 0.8; S1 = S1 * 0.2; }

  // --- jakość: sufit wyznaczony przez wariancję, dryf i udział autorytetu
  const qTarget = clamp01(p.q_max * (1 - p.a_v * V) * (1 - p.a_th * s.Th) * (1 - p.a_m * M));
  const q1 = clamp01(s.q + p.lambda_q * (qTarget - s.q) - saintLoss * s.q);

  // --- legitymacja: napędzana jakością POSTRZEGANĄ (q + Θ), karana błędem UJAWNIONYM (O*E*phi)
  const visibleError = s.O * s.E * p.phi;
  const Ltarget = clamp01(s.q + s.Th - p.delta_e * visibleError + p.delta_m * M - 0.5 * unresolved);
  const L1 = clamp01(s.L + p.mu * (s.Lbuf[0] - s.L));

  return {
    t: s.t + 1, q: q1, L: L1, E: E1, G: G1, O: O1, Vp: Vp1, Th: Th1, S: S1, M,
    Ebuf: [...s.Ebuf.slice(1), E1],
    Lbuf: [...s.Lbuf.slice(1), Ltarget],
  };
}

export function run(p: Params, n: number, o: StepOpts = {}): State[] {
  let s = initState(p);
  const out: State[] = [s];
  for (let i = 0; i < n; i++) { s = step(p, s, o); out.push(s); }
  return out;
}

// ===== ALG-C-06: detektory przekroczenia progu =======================
export interface Alarm { id: string; t: number; note: string }

export function detectors(tr: State[], p: Params): Alarm[] {
  const a: Alarm[] = [];
  const first = (pred: (s: State) => boolean, id: string, note: string) => {
    const s = tr.find(pred); if (s) a.push({ id, t: s.t, note });
  };
  const pi = p.c_m * p.phi / p.c_d;
  first(s => maskingRate(p, s.O) > 0.5,      "DET-C-01", "maskowanie stało się strategią dominującą (O < c_d/(c_m*phi))");
  first(s => s.O * pi < 1,                   "DET-C-02", "przekroczona granica bifurkacji pi*O = 1");
  first(s => s.M > 0.5,                      "DET-C-03", "ponad 50% rozstrzygnięć w trybie autorytetu");
  first(s => s.G < 0.1 * p.Gmax,             "DET-C-04", "rezerwa force_gas < 10% pojemności (praca na szynie)");
  first(s => s.Th > 0.5 * Math.max(s.q, 1e-9), "DET-C-05", "dryf wzorca > 50% rzeczywistej jakości");
  first(s => p.gamma0 * s.O > 2 * Math.sin(Math.PI / (2 * (2 * p.tau_a + 1))),
                                             "DET-C-06", "przekroczony margines opóźnienia pętli odwoławczej");
  first(s => s.S > 0.5,                      "DET-C-07", "ponad 50% obciążenia na komponentach bez redundancji");
  return a;
}

// ===== ALG-C-04: test obserwowalności (kryterium Kalmana) ============
export function rank(M: number[][]): number {
  const A = M.map(r => [...r]); const rows = A.length, cols = A[0].length; let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let piv = -1, best = 1e-9;
    for (let i = r; i < rows; i++) if (Math.abs(A[i][c]) > best) { best = Math.abs(A[i][c]); piv = i; }
    if (piv < 0) continue;
    [A[r], A[piv]] = [A[piv], A[r]];
    for (let i = 0; i < rows; i++) if (i !== r && Math.abs(A[i][c]) > 1e-12) {
      const k = A[i][c] / A[r][c]; for (let j = c; j < cols; j++) A[i][j] -= k * A[r][j];
    }
    r++;
  }
  return r;
}

export function observabilityMatrix(A: number[][], C: number[][]): number[][] {
  const mm = (X: number[][], Y: number[][]) =>
    X.map(r => Y[0].map((_, j) => r.reduce((s, v, k) => s + v * Y[k][j], 0)));
  let acc = C, Ob: number[][] = [...C];
  for (let i = 1; i < A.length; i++) { acc = mm(acc, A); Ob = [...Ob, ...acc]; }
  return Ob;
}

// ===== ALG-C-07: wyszukiwanie separatrysy (bisekcja po E0) ===========
export function separatrix(p: Params, hi = 20, iters = 40): number {
  const collapses = (E0: number) => {
    let s = initState(p); s.E = E0; s.Ebuf = s.Ebuf.map(() => E0);
    for (let i = 0; i < 500; i++) s = step(p, s);
    return s.O < 0.1;
  };
  if (!collapses(hi)) return Infinity;      // brak złego atraktora: bezwarunkowo stabilny
  let lo = 0;
  for (let i = 0; i < iters; i++) { const mid = (lo + hi) / 2; if (collapses(mid)) hi = mid; else lo = mid; }
  return (lo + hi) / 2;
}
```

---

## 5. Algorytmy — złożoność i tryb działania

| ID | Algorytm | Złożoność | Uwaga |
|----|----------|-----------|-------|
| `ALG-C-01` | `maskingRate` — best response aktora | `O(1)` | próg `O* = c_d/(c_m·φ) = 0.25` |
| `ALG-C-02` | `evidenceConfidence` | `O(1)` | wymaga znajomości `Θ`, którego system nie mierzy → w praktyce estymowane z biasem |
| `ALG-C-03` | `step` | `O(τ_a + τ_L)` na krok (kopiowanie linii opóźniających) | 300 kroków < 1 ms |
| `ALG-C-04` | `observabilityMatrix` + `rank` | `O(n³)` dla `n` zmiennych stanu | dla `n = 3` trywialne |
| `ALG-C-05` | `majestySwitch` (wewnątrz `step`) | `O(1)` | **z twardym nasyceniem `min(demand, G/gSpend)`** |
| `ALG-C-06` | `detectors` | `O(T)` po trajektorii | 7 progów, wszystkie z jednostkami |
| `ALG-C-07` | `separatrix` — bisekcja | `O(iters · T)` = `40 · 500` kroków | zbieżność do `1e-5` w 40 iteracjach |

---

## 6. Metryki: SLI, SLO, error budget

Zgodnie z regułą, że niezmiernik bez czujnika jest życzeniem, każdemu `INV-C-*` przypisuję wskaźnik.

| ID | SLI | Definicja operacyjna | Cel (SLO) | Mierzy |
|----|-----|----------------------|-----------|--------|
| `SLI-C-01` | stopa ujawnień własnych | (błędy zgłoszone przez orzekającego) / (błędy zgłoszone łącznie) | ≥ 0.30 | `INV-C-05` |
| `SLI-C-02` | **rozdział wariancji** | wariancja wyniku na parach spraw *dopasowanych po stanie faktycznym* vs. na parach losowych | udział proceduralny ≤ 0.35 | `INV-C-06`, `stage_corruption` |
| `SLI-C-03` | luka kalibracyjna | `\|q̂_oob − y\|` na próbce out-of-band | ≤ 0.05 | `INV-C-01`, `Θ` |
| `SLI-C-04` | wykorzystanie rezerwy autorytetu | `spend / (gRegen·L)` w kwartale | ≤ 0.60 | `INV-C-04` |
| `SLI-C-05` | margines opóźnienia | `γ_eff / g_crit(τ_a)` | ≤ 0.50 | `INV-C-03` |
| `SLI-C-06` | koncentracja obciążenia | udział spraw krytycznych rozstrzyganych przez top-1 komponent | ≤ 0.15 | `INV-C-07` |

**`SLI-C-02` jest jedynym wskaźnikiem, który rozdziela `stage_corruption` od rzeczywistej niepewności faktycznej.** Konstrukcja: bierzemy pary spraw o (niezależnie zakodowanym) izomorficznym stanie faktycznym i porównujemy rozrzut wyników wewnątrz pary. Rozrzut na parach dopasowanych to `V_p` (wariancja proceduralna); reszta całkowitego rozrzutu to `V_fact`. Bez tego rozdziału każdy spór o „nieprzewidywalność sądów” jest niekonkludowalny, bo obie strony mają rację co do agregatu.

Wynik modelu: w atraktorze pracy udział proceduralny to **70.6%** `[EST]`, w atraktorze legitymacji **82.2%** `[EST]`. Czyli **większość nieprzewidywalności nie pochodzi z trudności faktów, tylko z tego, co system robi ze sprawą między `S1` a `S4`.** To jest hipoteza falsyfikowalna przez `SLI-C-02`: jeśli pomiar da udział proceduralny < 35%, mój model jest źle skalibrowany.

**Error budget:** `RES-C-04` w `50-RESOURCES.md`. Kluczowa własność: system w obu atraktorach **nie ma budżetu błędu na `G`** — regeneracja równa się wydatkowi (1.5–1.8% pojemności rezerwuaru). To jest definicja pracy bez marginesu.

---

## 7. Tryby awarii

| ID | Tryb | Wyzwalacz | Objaw obserwowalny | Objaw prawdziwy |
|----|------|-----------|--------------------|-----------------|
| `FAIL-C-01` | **integrator windup** na `E` | `O → 0` zamyka dren, dopływ trwa | żaden | `E` rośnie do 47–63 caseload-kw, `Θ → 1` |
| `FAIL-C-02` | **nasycenie aktuatora** `G` | `demand > G/gSpend` | spadek `M` (wygląda jak poprawa!) | 75% popytu na rozstrzygnięcie niepokryte |
| `FAIL-C-03` | **utrata rangi** macierzy obserwowalności | demontaż czujnika `S2` | wskaźniki stabilne | `q` i `Θ` przestają być rozróżnialne |
| `FAIL-C-04` | **chattering** pętli korekty | `γ_eff → g_crit(τ_a)` | fale uchyleń o okresie 30–36 kw | korekta nie jest ciągła, tylko kampanijna |
| `FAIL-C-05` | **awaria „świętego”** | odejście komponentu bez redundancji | skokowy spadek `q` o 0.291 (−43.5%) | brak powrotu w 40 kw |
| `FAIL-C-06` | **nasycenie dryfu** `Θ = 1` | `O < 0.45` przez > 20 kw | wzrost `L` przy spadku `q` (luka +0.54) | wzorzec przestał istnieć |
| `FAIL-C-07` | **zamek histerezy** | przekroczenie `E_crit` | — | `c_m` musiało spaść do 5.5 RU żeby upaść; powrót do 30 RU **nie przywraca** |

`FAIL-C-02` i `FAIL-C-03` mają wspólną, najgorszą własność: **objaw obserwowalny jest zgodny z poprawą.** Spadek liczby rozstrzygnięć autorytetem i stabilność wskaźników to dokładnie to, czego oczekiwałby audytor patrzący na dashboard. Dlatego `DET-C-03` i `DET-C-04` muszą być odczytywane **łącznie** — sam `M` jest w tym układzie sygnałem niejednoznacznym.

---

## 8. Weryfikacja: co ten kod faktycznie policzył

| Wynik | Wartość | Skąd |
|-------|---------|------|
| próg dominacji maskowania | `O* = 0.25` | analitycznie + `maskingRate` |
| separatrysa | `E_crit = 0.6975` caseload-kw | `separatrix(BASE)`, bisekcja 40 iteracji |
| atraktor pracy | `q* = 0.670`, `O* = 0.600` | `run(BASE, 400)`, `E₀ = 0.10` |
| atraktor legitymacji | `q* = 0.269`, `O* = 0.000`, `E* = 53.96` | `run(BASE, 400)`, `E₀ = 0.75` |
| czas przejścia | `O < 0.30` w 6 kw, `O < 0.05` w 29 kw | trajektoria `E₀ = 0.75` |
| opóźnienie sygnalizacyjne | 11 kw (2.8 roku) między spadkiem `q` a spadkiem `L` | j.w. |
| granica opóźnienia | `g_crit(8) = 0.1845/kw`, `γ_eff = 0.1799/kw` → 97.5% marginesu | analitycznie + symulacja izolowanej pętli |
| ranga obserwowalności `(q,Θ)` | `rank = 1 < 2` | `ALG-C-04` |
| próg bezwarunkowej stabilności | `η_crit = 0.1667/kw` (stała czasowa 6 kw) | bisekcja po `η` |
| asymetria prewencja/naprawa | `oob_crit`: 0.00209 vs 0.20061 → **96×** | bisekcja w obu reżimach |

---

*Agent C · tor I · Justice-as-Code v1.0*
