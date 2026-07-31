---
name: tanstack-lab
description: >
  Build and test the Trolley moral lab app: TanStack Start, React 19, Tailwind v4,
  Zustand, dual engines, 10 turns. Triggers on "lab", "turn", "matrix", "engines",
  "typecheck", "moral constitution".
metadata:
  short-description: "TanStack moral lab: turns, engines, store, verify"
---

# TanStack Lab (this website)

## Role

The product UI: 10-turn moral laboratory with dual engines and stereo META.

## Stack map

| Layer | Path |
|-------|------|
| Routes | `src/routes/index.tsx`, `__root.tsx` |
| Lab shell | `src/components/lab/LabApp.tsx` |
| Dual + META | `src/components/lab/DualEngines.tsx` |
| Engines | `src/lib/moral/engines.ts` |
| State | `src/lib/moral/store.ts` (zustand + persist) |
| Content | `src/lib/moral/content.ts` |
| Styles | `src/styles.css` tokens |

## Operate

```bash
npm run dev        # 0.0.0.0:8080
npm run typecheck
npm run build
```

State keys: `turn`, `phase`, `decision`, `herdPressure`, `matrix`, `history`, `transparencyMode`.  
Export: `exportProfile()` → JSON with `stereo` block, **never** `recommendedDecision`.

## Test

- [ ] Turn 1 Seed: pull/stay without philosopher wall  
- [ ] After commit: DualEngines + Stereo META bar visible  
- [ ] Matrix sliders change R channel decision  
- [ ] Herd pressure changes L confidence/decision path  
- [ ] Export JSON contains `stereo.mode`, `divergenceIndex`  
- [ ] Reset clears persist key `trolley-enlightenment-lab`  
- [ ] typecheck clean  

## Max proficiency

- Progressive density: Turn 1 minimal → later turns denser  
- Transparency modes: full / summary / off  
- Lenses = tools not authorities  
- Stereo modes: FUSION · PARALLAX · META-BREAK · DRIFT  
- Do not reorder turns 1–10 without Constitution bump  

## Compose with

`grok-build-beta` · `stereokognicja-runtime` · `design-ui`
