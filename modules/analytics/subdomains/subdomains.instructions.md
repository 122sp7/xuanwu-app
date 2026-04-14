---
description: 'Analytics subdomains structural rules: read-model orientation, hexagonal shape per subdomain, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/analytics/subdomains/**/*.{ts,tsx}'
---

# Analytics Subdomains Layer (Local)

Use this file as execution guardrails for `modules/analytics/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/analytics/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within analytics goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Analytics is read-model oriented by default; avoid placing write or mutation logic inside analytics subdomains.
- Do not add `GetXxxUseCase` wrappers for pure reads without business logic — route these to query handlers instead.
- Analytics subdomains must never own billing, entitlement, or subscription policy; they may consume usage signals published by other bounded contexts.
- Metrics and reporting models are derived read projections; do not treat them as authoritative state — the owning bounded context remains the source of truth.
- Domain events emitted by a subdomain must use the discriminant format `analytics.<subdomain>.<action>` (e.g. `analytics.reporting.snapshot-generated`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.
- New subdomains should only be introduced when a real analytics capability with independent domain language emerges — prefer query handlers and infrastructure projections for simple read surfaces.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
