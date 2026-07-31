# GitHub suggestions — Trolley of Enlightenment → Alignment

Actionable GitHub hygiene and roadmap for this public lab.

## 1. Repo strategy (pick one)

| Option | When | Action |
|--------|------|--------|
| **A. Single product repo (recommended)** | Ship the lab as the main artifact | Rename or keep `harmonizing-functor-moral-engine`; push full app source here |
| **B. Monorepo under Collective** | One org surface for all HF products | Mirror under `harmonizing-functor-collective/apps/trolley-enlightenment` |
| **C. Split docs vs app** | Constitution evolves faster than code | Keep Constitution in this repo; app in `trolley-of-enlightenment` |

**Suggestion:** Option A. One public URL, one README, one Issues board.

## 2. Repo metadata

- **Name (optional rename):** `trolley-of-enlightenment` or keep current
- **Description:** `Public moral lab: trolley → collective vs individuated ethics → alignment (Harmonizing Functor)`
- **Topics:** `moral-philosophy` `trolley-problem` `ethics` `ai-alignment` `react` `tanstack` `education` `open-source` `harmoinizing-functor`
- **Website:** Vercel deploy URL when live
- **Visibility:** public (already)

## 3. Labels to create

| Label | Color intent | Use |
|-------|--------------|-----|
| `engine:seed` | gray | Turn 1 |
| `engine:collective` | amber | Hive / herd |
| `engine:individuated` | green | Personal matrix |
| `engine:meta` | teal | Meta-ethics / frame |
| `engine:adaptive` | cyan | v3.0+ |
| `type:bug` | red | Broken flow |
| `type:enhancement` | blue | New turn / lens |
| `type:docs` | purple-gray | Constitution / README |
| `type:design` | pink-gray | UI / graph |
| `certainty:high` | green | Turns 1–7 |
| `certainty:open` | yellow | Post–Turn 10 |
| `good first issue` | purple | Community entry |

## 4. Seed issues (copy-paste titles)

1. **[docs] Add CONTRIBUTING.md + Code of Conduct for public moral lab**
2. **[engine] Multi-agent LLM ensemble for Collective simulation (transparency required)**
3. **[engine] Cultural variants of herd priors (not only Western survey proxies)**
4. **[feature] Shareable fork URLs for personal moral graphs (GraphML/JSON)**
5. **[feature] Group session mode — real multiplayer cohesion without forcing consensus**
6. **[ui] Graph visualization of trajectory across 10 turns (nodes = decisions)**
7. **[a11y] Full keyboard + screen-reader path through all turns**
8. **[i18n] Polish + English UI strings**
9. **[research] Document failure modes: groupthink vs fragmentation**
10. **[deploy] Vercel production + OG image + custom domain**
11. **[test] Playwright e2e for Turns 1–10 happy path**
12. **[security] No remote LLM keys in client; optional server proxy later**

## 5. Branching & releases

```
main          # always deployable
feat/*        # one turn or engine at a time
fix/*
release/v0.3  # Constitution-aligned tag
```

**Tags:** `v0.1-seed` · `v0.3-constitution` · `v1.0-ten-turns-locked`

**Release notes template:**
- Engines changed
- Turns affected
- Transparency surface changes
- Breaking changes to Personal Matrix schema

## 6. Files to add next

| File | Why |
|------|-----|
| `LICENSE` | MIT recommended |
| `CONTRIBUTING.md` | How to propose new dilemmas / lenses without moralizing |
| `CODE_OF_CONDUCT.md` | Lab is about hard topics; keep discussion rigorous, non-abusive |
| `docs/CONSTITUTION.md` | Living constitution (versioned) |
| `docs/TURNS.md` | Locked 10-turn protocol |
| `docs/ENGINES.md` | Maturity table + scoring functions |
| `.github/ISSUE_TEMPLATE/` | bug / engine / dilemma templates |
| `.github/workflows/ci.yml` | `typecheck` + `build` + Playwright smoke |
| `SECURITY.md` | No credentials; report process |

## 7. Issue templates (short)

**Dilemma proposal**
- Variant name
- Relation to Collective vs Individuated
- Failure mode it surfaces
- Does not instruct harm; abstract trolley-class only

**Engine change**
- Which maturity version
- Transparency impact
- Scoring / prior change
- Certainty impact (high vs open)

## 8. Project board columns

`Inbox` → `Constitution` → `Turns 1–4` → `Turns 5–10` → `Adaptive (open)` → `Done`

## 9. Don’t do

- Don’t merge constitution and marketing site into one unclear root
- Don’t hide LLM / simulation priors in UI
- Don’t ship “correct answers” as product features
- Don’t expand post–Turn 10 without labeling **open / decreasing certainty**

## 10. Immediate next commit (when source lands)

1. Push Grok Build app tree (`src/`, `package.json`, `vite.config.ts`)
2. Add MIT LICENSE
3. Add CI workflow
4. Open the 12 seed issues
5. Tag `v0.3-constitution`

---

*Harmonizing Functor Collective — GitHub suggestions v1*
