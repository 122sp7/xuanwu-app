---
description: 'CI/CD execution rules for lint, build, tests, and release evidence.'
applyTo: '{.github/workflows/**/*.{yml,yaml},package.json,fn/requirements.txt}'
---

# CI CD

## Required Checks

- `npm run lint`
- `npm run build`
- `cd fn && python -m compileall -q .`
- `cd fn && python -m pytest tests/ -v`

## Rules

- Do not skip failing mandatory checks.
- Report unrelated baseline failures separately.

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
