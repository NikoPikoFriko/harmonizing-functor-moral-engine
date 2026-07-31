---
name: skill-creator
description: >
  Author and maintain Grok Build / project skills. Use when creating a new skill,
  skill family, or improving how agents operate tools and apps. Triggers on
  "skill-creator", "new skill", "write a skill", "skill family", "playbook".
metadata:
  short-description: "Create skills: frontmatter, operate/test/max, family maps"
---

# Skill Creator

Skills are **operational playbooks** agents open before acting. They are not marketing docs.

## When to create a skill

Create one when an app or protocol is used **repeatedly** and mistakes are costly:
- Deploy / auth / dual-engine moral lab
- External connectors (GitHub, Linear, Vercel, Gamma)
- Cross-cutting rules (evolution cycles, stereokognicja)

Do **not** create a skill for a one-off file edit.

## File shape (required)

```text
skills/<name>/SKILL.md
skills/<name>/references/   # optional, on-demand depth
```

Frontmatter:

```yaml
---
name: kebab-case-id
description: >
  What it does + WHEN to use + trigger phrases.
metadata:
  short-description: "≤100 chars"
---
```

## Body template (use this structure)

1. **Role** — one paragraph: what app/surface, why it exists here  
2. **Operate** — exact steps / tool names / commands inside Grok Build Beta  
3. **Test** — pass/fail checklist (browser, API, CI)  
4. **Max proficiency** — advanced patterns, anti-patterns, composition with other skills  
5. **Triggers** — phrases that should auto-open this skill  

## Quality bar

| Rule | Why |
|------|-----|
| Actionable verbs | Agents execute, not admire |
| Project-specific examples | Generic docs fail in this monologue |
| Test section mandatory | “Done” without verify is the #1 failure |
| No secrets in skill files | Snapshots persist |
| Link sibling skills | Family, not silos |
| ≤ ~200 lines core | Depth in `references/` |

## Family map pattern

Always maintain `skills/README.md` table: skill → app → triggers.

## After writing

1. Link from root README or Constitution if public  
2. Open Linear `[T] Transmit` if genotype of process changed  
3. Self-test: can an agent who only reads the skill complete Operate + Test?
