# Meta-Gra Stereokognicyjna (Stereo-Cognitive Meta-Game)

**Version:** 1.0  
**Project:** Trolley of Enlightenment → Alignment  
**Companion:** [Evolution-Cycle Skill](./EVOLUTION_CYCLE.md)  
**Principle:** Moral depth appears only when **two channels run at once** and a **meta layer** refuses to collapse them into one answer.

---

## 1. Definition

**Stereokognicja** = simultaneous dual-channel moral cognition (like stereo vision for values).

| Channel | Name | Engine | Risk if alone |
|---------|------|--------|---------------|
| **L** | Unconscious Collective | Hive / herd | Groupthink, moral outsourcing |
| **R** | Individuated Entity | Personal value matrix | Isolation, frame-blind purity |
| **META** | Stereo observer | Parallax / fusion / meta-break | Collapsing L+R into fake consensus |

**Meta-gra** = the game *about* the game: watching how L and R relate, not which one “wins.”

---

## 2. Stereo modes (output of every dual pass)

| Mode | Condition | Meaning |
|------|-----------|---------|
| **FUSION** | L decision = R decision | Agree — *either* genuine alignment *or* herd-camouflage. Require self-aware matrix before celebrating. |
| **PARALLAX** | L ≠ R (pull vs stay) | Classic stereo conflict — **depth appears**. Primary pedagogical gold. |
| **META-BREAK** | R = refuse (or frame reject) | Right channel exits the dilemma’s loaded frame. Meta-game open. |
| **DRIFT** | Other asymmetries | Inspect weights / pressure / scoring. |

Never auto-resolve PARALLAX or META-BREAK into a single recommended act.

---

## 3. Protocol — RUN stereokognicja (agent)

When user says **`meta-gra`**, **`stereokognicja`**, or **`RUN`** this skill:

### Step 0 — Frame lock
- Confirm Turns 1–10 still locked unless Constitution bump exists.
- Dual engines must both compute; no single-channel run.

### Step 1 — L channel (Collective)
- Input: `herdPressure` (0–100)
- Output: decision, confidence, transparency trace
- Label priors as **simulation**, not truth

### Step 2 — R channel (Individuated)
- Input: personal value matrix (utility, duty, care, justice, autonomy, risk)
- Output: decision, top value, option scores, transparency trace

### Step 3 — META stereo
- Compute mode: FUSION | PARALLAX | META-BREAK | DRIFT
- Compute `divergenceIndex` (0–100)
- Write **one sentence** that does not pick a winner

### Step 4 — User third point (optional)
- If user decision exists: align/diverge vs L and vs R separately
- User is a **third point in moral space**, not forced to L or R

### Step 5 — Transmit
- Log run JSON
- Linear issue `[S-RUN]` or update project doc
- Propose ≤3 mutations only if mode histogram shows systematic gap

### Step 6 — Non-collapse rule
- **Forbidden:** “Therefore the correct choice is…”
- **Allowed:** “Stereo mode = X; divergence = Y; channels show Z.”

---

## 4. Relation to Evolution Cycle

| EC phase | Stereokognicja |
|----------|----------------|
| O Observe | Run scenarios; histogram of stereo modes |
| H Hypothesize | “If we surface parallax meter, then…” |
| M Mutate | UI/export for stereo fields |
| S Select | Keep mutations that increase PARALLAX awareness without forcing answers |
| T Transmit | This skill + run reports |

---

## 5. Fitness for stereo mutations

Score 0–2 each:

1. Both channels always visible (T2+)  
2. Mode named (FUSION/PARALLAX/META-BREAK/DRIFT)  
3. Transparency on L and R  
4. User can diverge from both  
5. No forced resolution of parallax  
6. Export includes stereo fields  

Keep ≥ 8/12.

---

## 6. First RUN results (2026-07-31)

| Scenario | L | R | Mode | Div |
|----------|---|---|------|-----|
| Seed-default | pull | refuse | META-BREAK | 31 |
| Utilitarian+herd | pull | pull | FUSION | 25 |
| Deontic+low-herd | pull | stay | **PARALLAX** | 90 |
| Care-autonomy rebel | pull | refuse | META-BREAK | 90 |
| Risk-averse | pull | refuse | META-BREAK | 90 |

**Finding:** Stereo depth appears under PARALLAX/META-BREAK. FUSION without self-aware matrix is herd-camouflage.  
**Histogram:** META-BREAK 3 · FUSION 1 · PARALLAX 1

**Next mutations (candidates):**
1. UI stereo parallax meter (L vs R) T2+  
2. Export `stereoMode` + `divergenceIndex` in moral profile JSON  
3. Turn 7: META-BREAK as first-class explicit option  

---

## 7. Agent trigger phrases

- `meta-gra` · `stereokognicja` · `stereo run` · `RUN meta-gra`  
- After run: always return mode histogram + non-collapsing synthesis

---

*Harmonizing Functor Collective · Meta-Gra Stereokognicyjna v1.0 · PL/EN*
