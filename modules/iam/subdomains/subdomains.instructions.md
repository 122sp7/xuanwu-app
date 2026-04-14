---
description: 'IAM subdomains structural rules: hexagonal shape per subdomain, identity/access-control/tenant separation, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/iam/subdomains/**/*.{ts,tsx}'
---

# IAM Subdomains Layer (Local)

Use this file as execution guardrails for `modules/iam/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/iam/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within iam goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `iam.<subdomain>.<action>` (e.g. `iam.identity.subject-authenticated`, `iam.access-control.permission-denied`, `iam.tenant.tenant-provisioned`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.
- `identity` owns who the Actor is (authentication, credential lifecycle, session) — it must not own access decisions.
- `access-control` owns what the Actor is allowed to do (permission evaluation, role assignment, policy enforcement) — it must not own authentication or credential details.
- `tenant` owns organisation-level isolation and provisioning; it must not duplicate identity or access-control logic.
- Authentication (AuthN) and authorisation (AuthZ) are strictly separate concerns — do not merge identity and access-control subdomain logic.
- Auth provider SDK details (Firebase Auth, OAuth, etc.) must never appear in `domain/` — they belong in `infrastructure/` adapters only.
- Do not place billing, AI orchestration, or workspace product behaviour inside IAM subdomains.
- Use `Actor` (not `User`) as the canonical identity term across all subdomain published language.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
