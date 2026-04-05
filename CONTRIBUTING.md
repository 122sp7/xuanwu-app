# Contributing to Xuanwu App

Contributions are welcome. Please follow these guidelines to keep the codebase consistent and easy to review.

## House Rules

### 👥 Prevent Work Duplication

Before opening a new issue or PR, check whether it already exists in [Issues](https://github.com/122sp7/xuanwu-app/issues) or [Pull Requests](https://github.com/122sp7/xuanwu-app/pulls).

### ✅ Work on Approved Issues

For new feature requests, wait for a maintainer to approve the issue before starting implementation. Bug fixes, security, performance, and documentation improvements can begin immediately.

### 🚫 One Concern per PR

Keep PRs small and focused. A PR should address one feature, bug, or refactor. Split large changes into a sequence of smaller PRs that can be reviewed and merged independently.

### 📚 Write for Future Readers

Every PR contributes to the long-term understanding of the codebase. Write clearly enough that someone — possibly you — can revisit it months later and still understand what happened and why.

### ✅ Summarize Your PR

Provide a short summary at the top of every PR describing the intent. Use `Closes #123` or `Fixes #456` in the description to auto-link related issues.

### 🧪 Describe What Was Tested

Explain how you validated your changes. For example: _"Tested locally with npm run dev, verified the new route renders without errors."_

---

## Development

### Prerequisites

- Node.js 24
- npm

### Setup

```bash
npm install
npm run dev      # Start Next.js dev server (port 3000)
```

### Validation

Before pushing, ensure these all pass:

```bash
npm run lint     # ESLint — must have 0 errors
npm run build    # Next.js production build + TypeScript type-check
```

For the Python worker:

```bash
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

---

## Architecture Conventions

This project follows **Module-Driven Domain Design (MDDD)**. Before making changes, read:

- [`.github/agents/README.md`](.github/agents/README.md) — rules index
- [`.github/agents/knowledge-base.md`](.github/agents/knowledge-base.md) — domain knowledge and module inventory
- [`CLAUDE.md`](CLAUDE.md) — key architecture rules and patterns

### Key Rules

- Business logic lives in `modules/<context>/` with four layers: `domain/`, `application/`, `infrastructure/`, `interfaces/`.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must be framework-free.
- Use `@alias` package imports (e.g., `@shared-types`, `@ui-shadcn`). Never use legacy `@/shared/*`, `@/libs/*`, `@/ui/*` paths.
- Keep Next.js Server Actions thin — delegate to use cases, return `CommandResult`.

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Domain entity | `PascalCase.ts` | `Organization.ts` |
| Repository interface | `MyRepository.ts` | `WorkspaceRepository.ts` |
| Firebase repository | `FirebaseMyRepository.ts` | `FirebaseWorkspaceRepository.ts` |
| Use case | `my-use-case.ts` | `create-workspace.ts` |
| Server Action | `*.actions.ts` | `workspace.actions.ts` |
| React component | `PascalCase.tsx` | `WorkspaceCard.tsx` |

---

## Making a Pull Request

1. Fork the repository and create a branch from `main`.
2. Make focused, incremental changes.
3. Ensure `npm run lint` and `npm run build` pass with no new errors.
4. Fill out the PR description with intent, changes, and testing notes.
5. Link related issues with `Closes #N` or `Refs #N`.
6. Request a review.

---

## Spec-Driven Development

For larger features, consider using spec-driven development. See [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## AI Delivery Workflow

For larger or cross-module changes, prefer the formal Copilot delivery workflow:

- Plan first with [`docs/swarm.md`](docs/swarm.md)
- Use the implementation plan as the execution contract for implementation, review, and QA
- Keep documentation updates in the same change whenever scope, boundaries, or public workflows move
