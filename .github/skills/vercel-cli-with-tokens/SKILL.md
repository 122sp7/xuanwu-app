---
name: vercel-cli-with-tokens
description: Use Vercel CLI with token-based auth for deploy, link, and project management without interactive login.
metadata:
  author: vercel
  version: "1.0.0"
disable-model-invocation: true
---

# Vercel CLI with Tokens (Condensed)

Use `VERCEL_TOKEN` from environment. Do not pass tokens via CLI flags.

## Token Discovery Order

1. `printenv VERCEL_TOKEN`
2. `.env` key `VERCEL_TOKEN`
3. `.env` other Vercel-like key (often `vca_...`)
4. If missing, ask user for token.

## Project Target Discovery

Check:
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`
- `.vercel/project.json` or `.vercel/repo.json`

If project URL exists, extract team slug from it.

## Required Rules

- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` must be set together.
- Avoid exposing token in command history.
- Default to preview deploy.

## Deploy Paths

### Quick deploy (IDs already set)

- `vercel deploy -y --no-wait [--scope <team>]`
- Production only when explicit: `vercel deploy --prod -y --no-wait [--scope ...]`
- Validate with `vercel inspect <url>`.

### Full flow (no IDs)

1. Check git remote and linked state.
2. Link:
   - remote exists: `vercel link --repo --scope <team> -y`
   - no remote: `vercel link --scope <team> -y`
3. Deploy:
   - with remote: ask then push
   - no remote: `vercel deploy --scope <team> -y --no-wait`

## Guardrails

- Never push without approval.
- Never leak tokens in command args.
- Keep scope/project targeting explicit.
