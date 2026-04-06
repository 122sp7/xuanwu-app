# Development

This section contains repository-local implementation guidance for Xuanwu contributors.

## Entry Points

- [modules-implementation-guide.md](./modules-implementation-guide.md): how the repository maps architecture into `modules/`, `app/`, `packages/`, and `py_fn/`
- [../ddd/subdomains.md](../ddd/subdomains.md): strategic domain classification
- [../ddd/bounded-contexts.md](../ddd/bounded-contexts.md): current bounded-context inventory
- [../architecture/README.md](../architecture/README.md): cross-context architecture reading path
- [../../AGENTS.md](../../AGENTS.md): repository-wide commands, rules, and delivery expectations

## Working Rules

1. Resolve ownership from `docs/ddd/` first, then read the corresponding `modules/<context>/*.md` files.
2. Keep cross-context access on public `api/` boundaries or explicit domain events.
3. Treat `Next.js` and `py_fn/` as separate runtime boundaries with different responsibilities.
4. Update documentation in the same change when module ownership, public contracts, or product language changes.

## Validation

- Web runtime: `npm run lint`, `npm run build`
- Python worker: `cd py_fn && python -m compileall -q .`, `cd py_fn && python -m pytest tests/ -v`
