---
name: grok-build-beta
description: >
  Operate Grok Build Beta sandbox: live preview on 0.0.0.0:8080, startup.sh,
  browser QA, production build, product-language with the user. Triggers on
  "grok build", "preview", "sandbox", "startup.sh", "live preview", "8080".
metadata:
  short-description: "Grok Build Beta: preview :8080, startup.sh, verify render"
---

# Grok Build Beta

## Role

Agent runs **inside** a Linux sandbox. User only sees **chat + live preview**.  
Success = app listening, **actually rendered**, processes left up, `startup.sh` correct.

## Operate

| Step | Action |
|------|--------|
| 1 | Scaffold/edit under `/workspace` |
| 2 | Own `/workspace/startup.sh` (idempotent, non-blocking, probes 8080) |
| 3 | `sh /workspace/startup.sh` or `npm run dev` → bind **0.0.0.0:8080** |
| 4 | Verify with browser smoke + screenshots under `/workspace/screenshots/` |
| 5 | `npm run typecheck` + `npm run build` before “done” |
| 6 | Leave dev server running |

```sh
# startup.sh shape
#!/bin/sh
set -eu
cd /workspace
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then exit 0; fi
npm run dev >>/tmp/app-startup.log 2>&1 &
```

```bash
mkdir -p /workspace/screenshots
node /workspace/scripts/browser-smoke.mjs http://127.0.0.1:8080/ /workspace/screenshots/preview.png
```

## Test

- [ ] HTTP 200 is **not** enough — visible DOM content  
- [ ] Browser console: no uncaught errors / failed modules  
- [ ] Mobile ~390×844: no horizontal overflow  
- [ ] `npm run build` succeeds; built output also renders if checked  
- [ ] `startup.sh` exists and matches real start command  

## Max proficiency

- Edit in place with HMR; restart only for vite config / deps  
- Speak **product language** to user (never ports/containers/curl)  
- Skills first: `design-ui` for chrome; game skills only if game  
- Nitro `preset: "vercel"` only on `command === "build"`  
- Never ask user to run npm/open localhost  

## Compose with

`tanstack-lab` · `design-ui` · `vercel-deploy` · `stereokognicja-runtime`
