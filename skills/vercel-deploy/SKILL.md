---
name: vercel-deploy
description: >
  Deploy the lab to Vercel: nitro preset, migrate-safe build, domains, public
  protection settings. Triggers on "vercel", "deploy", "production URL", "domain".
metadata:
  short-description: "Vercel: build, deploy, public lab URL, no secret leaks"
---

# Vercel Deploy

## Role

Public surface for the moral lab. GitHub is source; Vercel is runtime edge.

## Operate

- Build uses `nitro({ preset: "vercel" })` only when `command === "build"`  
- Prefer Git integration: `main` → production  
- Project name suggestion: `trolley-of-enlightenment`  
- Team (example): niko-1348's projects  

```bash
# migrate must not break Vercel FS
# gate db:migrate when VERCEL=1 or no DB URL
npm run build
```

Domains (check live): moralengine.app, trolleyalignment.com, etc. — **buy only with explicit user approval**.

## Test

- [ ] Production URL loads Seed with visible content  
- [ ] No MIME `text/html` on JS modules  
- [ ] Dual engines work after Turn 1  
- [ ] No LLM keys in client env  
- [ ] Deployment protection **off** for public lab production  

## Max proficiency

- Preview deploys on PR for engine experiments  
- OG image + favicon before share campaigns  
- Analytics: traffic only — never log moral choices without consent  
- Close GitHub #10 / Linear M1 when URL live  

## Compose with

`grok-build-beta` · `github-ops` · `gamma-transmit` (CTA needs live URL)
