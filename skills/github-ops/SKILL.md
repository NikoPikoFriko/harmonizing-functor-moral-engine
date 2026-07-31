---
name: github-ops
description: >
  Operate GitHub for this project: push source, issues, labels, releases, CI.
  Triggers on "github", "push", "repo", "issue", "release", "PR".
metadata:
  short-description: "GitHub: ship code, issues, tags, CI green"
---

# GitHub Ops

## Role

Source of truth for code + Constitution + skills.  
Repo: `NikoPikoFriko/harmonizing-functor-moral-engine`

## Operate (inside Grok Build)

```bash
# Prefer gh + git when authenticated
gh auth status
git clone https://github.com/NikoPikoFriko/harmonizing-functor-moral-engine.git /tmp/trolley-push
# copy sources, commit, push
git push origin main
gh release create vX.Y.Z --title "..." --notes "..."
gh issue create --title "..." --label "..."
```

Connected tools alternative: `github___push_files`, `github___issue_write`, `github___create_or_update_file`.

## Test

- [ ] `main` has app source + LICENSE + CI workflow  
- [ ] CI: typecheck + build on push  
- [ ] README links Constitution, EC, stereokognicja, gamma packs  
- [ ] Issues use engine/certainty labels when moral-engine related  
- [ ] Tags for Constitution locks (`v0.3-constitution`)  

## Max proficiency

- One product repo (avoid mono-mess until needed)  
- Commit messages: feat/docs/fix + why  
- Never commit secrets, `.env`, `node_modules`  
- Mirror Linear mutations to GitHub when public contributors need them  
- Skills live under `skills/` for agent reuse  

## Compose with

`linear-evolution` · `vercel-deploy` · `grok-build-beta`
