---
title: Key File Locations
impact: LOW
impactDescription: Quick reference for navigating the codebase
tags: reference, file-locations, navigation
---

## Key File Locations

**Impact: LOW**

Quick reference for the most frequently needed files and directories.

| Path | Purpose |
|------|---------|
| `modules/` | All 20 business modules (MDDD bounded contexts) |
| `packages/` | 21 shared packages (stable public boundaries) |
| `app/` | Next.js App Router pages and layouts |
| `agents/` | MDDD architecture knowledge system (this directory) |
| `docs/architecture/` | Detailed architecture specifications per module |
| `.github/agents/` | VS Code Copilot custom agents |
| `.github/instructions/` | Copilot custom instruction files |
| `.github/skills/` | Agent skills (documentation-writer, etc.) |
| `tsconfig.json` | TypeScript config with all `@alias` path mappings |
| `eslint.config.mjs` | ESLint config with package boundary enforcement |
| `package.json` | Dependencies and npm scripts |
| `firebase.json` | Firebase project configuration |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Cloud Storage security rules |
| `components.json` | shadcn CLI configuration |

**Module structure pattern:**

```
modules/<domain-id>/
├── api/index.ts                # Cross-module API boundary
├── domain/entities/            # Aggregate roots, value objects
├── domain/repositories/        # Repository interfaces
├── domain/services/            # Domain services (optional)
├── domain/ports/               # Hexagonal ports (optional)
├── application/use-cases/      # Use case implementations
├── infrastructure/firebase/    # Firebase repository implementations
├── interfaces/components/      # React components
├── interfaces/queries/         # TanStack Query hooks
├── interfaces/_actions/        # Next.js Server Actions
└── interfaces/hooks/           # Custom React hooks
```
