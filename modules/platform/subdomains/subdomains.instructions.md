---
description: 'Platform subdomains structural rules: hexagonal shape per subdomain, status discipline, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/platform/subdomains/**/*.{ts,tsx}'
---

# Platform Subdomains Layer (Local)

Use this file as execution guardrails for `modules/platform/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/platform/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within platform goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `platform.<subdomain>.<action>` (e.g. `platform.identity.subject-authenticated`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
