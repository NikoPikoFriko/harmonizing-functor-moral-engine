---
name: gamma-transmit
description: >
  Use Gamma for narrative transmit: pitch decks, teacher one-pagers, social,
  stereokognicja pack. Triggers on "gamma", "deck", "one-pager", "all-core",
  "presentation pack".
metadata:
  short-description: "Gamma: Borealis packs, no correct answers, paste if auth fails"
---

# Gamma Transmit

## Role

**T** in Evolution Cycle — storytelling without moralizing.  
Does **not** replace the interactive lab.

## Operate

Tools: `gamma___generate`, `gamma___get_themes`, `gamma___export_gamma`.  
Theme default: **Borealis** (`themeId: "borealis"`).  
Images: abstract / lineArt; teacher docs: `noImages`.

Packs (source outlines in `docs/gamma/`):

| ID | Artifact |
|----|----------|
| A | Vision pitch 12 |
| B | Teacher one-pager |
| C | 10-turn map |
| S1–S3 | Social trio |
| G | Stereokognicja 8 |

If MCP auth fails: push outlines to `docs/gamma/` and tell user to reconnect connector.

## Test

- [ ] No gore / real-harm imagery  
- [ ] No “correct trolley answer” slides  
- [ ] Decreasing certainty mentioned on maturity slides  
- [ ] CTA only when public URL exists (or soft CTA)  
- [ ] gammaUrl returned and shared  

## Max proficiency

- `all-core` = A+B+C+S1–S3  
- PL twin decks at M3  
- After share: `gamma___get_gamma_analytics` for drop-off  
- Footer: never forces moral conclusion  

## Compose with

`linear-evolution` (Transmit) · `vercel-deploy` (CTA) · `stereokognicja-runtime`
