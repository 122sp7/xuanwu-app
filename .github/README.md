# Xuanwu `.github/` Customization Index

This directory contains the repository-local Copilot customization set for Xuanwu App.

## Structure

- [`copilot-instructions.md`](./copilot-instructions.md) — repository-wide Copilot baseline
- [`terminology-glossary.md`](./terminology-glossary.md) — entry point for DDD terminology lookup
- [`agents/`](./agents/) — custom agent definitions plus local knowledge/commands indexes
- [`instructions/`](./instructions/) — `applyTo`-scoped behavioral rules
- [`prompts/`](./prompts/) — reusable task templates
- [`skills/`](./skills/) — installed and repomix-generated skills

## DDD Reference Set

Use `docs/ddd/` as the primary DDD documentation surface:

- [`../docs/ddd/subdomains.md`](../docs/ddd/subdomains.md)
- [`../docs/ddd/bounded-contexts.md`](../docs/ddd/bounded-contexts.md)
- `../docs/ddd/<context>/{README,ubiquitous-language,aggregates,domain-events,context-map,application-services,repositories,domain-services}.md`

## Skill Refresh

Regenerate the checked-in repomix skills with the repository scripts when `.github/*` or docs change materially:

```bash
npm run repomix:skill
npm run repomix:markdown
```

Keep this directory focused on active customizations. Remove stale references, broken links, and unused compatibility notes when the structure changes.
