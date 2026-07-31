---
name: linear-evolution
description: >
  Linear project ops + Evolution-Cycle Skill (O→H→M→S→T). Triggers on "linear",
  "evolution cycle", "EC", "milestone", "MOJ", "transmit".
metadata:
  short-description: "Linear EC: Observe→Hypothesize→Mutate→Select→Transmit"
---

# Linear Evolution

## Role

Selection pressure on moral engines — not a feature factory.  
Team: **Mojehawaje** · Project: **Trolley of Enlightenment → Alignment**

## Operate

Phases every cycle:

| Phase | Label | Exit |
|-------|-------|------|
| O Observe | `ec:observe` | 1–3 facts |
| H Hypothesize | `ec:hypothesize` | If X then Y |
| M Mutate | `ec:mutate` | smallest ship |
| S Select | `ec:select` | keep/reverse/fork |
| T Transmit | `ec:transmit` | docs/release/next O |

```
[O] …  [H] If we … then …  [M] Ship …  [S] Keep|Reverse|Fork  [T] Transmit …
```

Tools: `linear___save_issue`, `linear___save_project`, `linear___save_document`, `linear___save_milestone`.

## Test

- [ ] Issue has project + milestone + `engine:*` + `certainty:*` + `ec:*`  
- [ ] No Mutate without recent O/H (unless user overrides)  
- [ ] WIP ≤ 5 open `ec:mutate`  
- [ ] Turns 1–10 not reordered without Constitution issue  
- [ ] Cycle ends with Transmit (doc or GitHub mirror)  

## Max proficiency

Fitness 0–2 × 6 (keep ≥ 8/12): honesty · dual-axis · transparency · agency · depth · 2028 boldness  
Milestones M0–M4 = generations  
Enable team Cycles when ready; until then milestones + due dates  

## Compose with

`stereokognicja-runtime` · `github-ops` · docs/EVOLUTION_CYCLE.md
