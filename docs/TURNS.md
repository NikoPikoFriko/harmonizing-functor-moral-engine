# Locked 10-turn protocol

Turns 1–10 are set in stone — reordering requires a Constitution version bump.
Post–Turn 10 is open by design: decreasing certainty (`certainty:open`).

| Turn | Title | Engine | What unlocks |
|------|-------|--------|--------------|
| 1 | Seed | Pure classic trolley | Raw choice, no schools, no pressure, no matrix |
| 2 | Dual Activation | Collective vs Individuated | Dual view from here on; herd pressure + autonomy sliders |
| 3 | Personal Matrix | Value vector + divergence | Editable matrix (utility, duty, care, justice, autonomy, risk), divergence index |
| 4 | Philosophical Layer | Classic lenses (tools, not authorities) | Mill, Kant, Foot, Aristotle, care, Nietzsche, Jung |
| 5 | Contextual Engine | Fat man, relational, timed, observer | Dilemma variants |
| 6 | Community Mode | Cohesion + federation rules | Simulated group + voluntary federation charter |
| 7 | Meta-Ethical Break | Accept / rewrite / refuse frame | Frame interrogation; refusal is a first-class act |
| 8 | Transparency Lab | Full / summary / off traces | Inspectable engine traces |
| 9 | Moral Profile | Exportable constitution (JSON) | Living profile + trajectory |
| 10 | Synthesis | Trajectory + adaptive glimpse | Full trajectory; gate to the adaptive horizon |

**Non-negotiables (all 10 turns):** dual view from T2+ · transparency on generated nodes ·
editable personal matrix · user override / fork / pin · system never forces a moral conclusion.

Implementation: [`src/components/lab/LabApp.tsx`](../src/components/lab/LabApp.tsx) ·
engines [`src/lib/moral/engines.ts`](../src/lib/moral/engines.ts) ·
content [`src/lib/moral/content.ts`](../src/lib/moral/content.ts).
