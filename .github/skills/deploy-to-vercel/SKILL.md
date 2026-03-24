---
name: deploy-to-vercel
description: Deploy projects to Vercel. Use for preview/production deployments, project linking, team scope selection, and deployment URL retrieval.
metadata:
  author: vercel
  version: "3.0.0"
disable-model-invocation: true
---

# Deploy to Vercel (Condensed)

Default to preview deploy unless user explicitly asks for production.

## Preflight Checks

1. `git remote get-url origin`
2. `.vercel/project.json` or `.vercel/repo.json` exists?
3. `vercel whoami`
4. `vercel teams list --format json` (if authenticated)

## Team Scope

- If multiple teams, list slugs and ask user to pick one.
- Use `--scope <team-slug>` on all Vercel CLI commands.
- If already linked, trust `orgId` from `.vercel/*`.

## Method Selection

### A) Linked + git remote

- Ask before pushing.
- `git add . && git commit -m "deploy: ..." && git push`
- Retrieve latest deployment URL with `vercel ls --format json`.

### B) Linked + no git remote

- `vercel deploy -y --no-wait [--scope ...]`
- Check with `vercel inspect <url>`.

### C) Not linked + authenticated

- With remote: `vercel link --repo --scope <team-slug>`
- Without remote: `vercel link --scope <team-slug>`
- Then use A or B.

### D) Not linked + not authenticated

- `npm install -g vercel`
- `vercel login`
- Link and deploy as above.

## Last-Resort Fallback

Use bundled fallback scripts only when CLI auth/install is unavailable in sandbox environments.

## Guardrails

- Never push without explicit user approval.
- Do not run production deploy unless explicitly requested.
- Prefer linked+git flow as long-term setup.
