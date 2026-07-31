---
name: stereokognicja-runtime
description: >
  Run Meta-Gra Stereokognicyjna: L Collective + R Matrix + META modes, lab UI bar,
  export fields. Triggers on "meta-gra", "stereokognicja", "stereo", "RUN", "parallax".
metadata:
  short-description: "Stereo L/R/META: run, test bar, never collapse"
---

# Stereokognicja Runtime

## Role

Dual-channel moral cognition in code + protocol.  
Full skill: `docs/META_GRA_STEREOKOGNICYJNA.md`

## Operate — RUN pipeline

1. **O** — scenarios / lab state  
2. **L** — `collectiveDecision(herdPressure)`  
3. **R** — `individuatedDecision(matrix)`  
4. **META** — `stereoMode(L,R)` → FUSION | PARALLAX | META-BREAK | DRIFT  
5. **div** — `divergenceScore(user, matrix, herd)`  
6. **T** — log JSON + Linear `[S-RUN]` + optional ≤3 mutations  
7. **Non-collapse** — never emit recommendedDecision  

Code: `src/lib/moral/engines.ts` → `stereoMode`, `stereoSnapshot`  
UI: `DualEngines` Stereo META bar after Turn 1 commit  
Export: `store.exportProfile()` stereo block  

## Test

- [ ] After T1 commit, META bar shows mode + div + L + R  
- [ ] Changing matrix can move R and mode  
- [ ] High herd keeps L lean pull under current sim  
- [ ] Export has `stereo.mode`, no `recommendedDecision`  
- [ ] RUN report does not pick a moral winner  

## Max proficiency

| Mode | Teaching use |
|------|----------------|
| PARALLAX | Gold — depth visible |
| META-BREAK | Frame literacy |
| FUSION | Probe camouflage vs alignment |
| DRIFT | Debug weights |

Triggers: `meta-gra` · `stereokognicja` · `RUN`  
Histogram modes after RUN; propose mutations only from gaps  

## Compose with

`tanstack-lab` · `linear-evolution` · `gamma-transmit` (pack G)
