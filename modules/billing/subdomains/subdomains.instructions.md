---
description: 'Billing subdomains structural rules: hexagonal shape per subdomain, entitlement vs subscription separation, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/billing/subdomains/**/*.{ts,tsx}'
---

# Billing Subdomains Layer (Local)

Use this file as execution guardrails for `modules/billing/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/billing/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within billing goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `billing.<subdomain>.<action>` (e.g. `billing.subscription.plan-changed`, `billing.entitlement.capability-granted`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.
- `entitlement` owns the capability signal (what an actor is allowed to do); `subscription` owns the billing contract lifecycle (plan, billing period, payment state) — never conflate the two.
- `Entitlement` is a capability signal published to downstream contexts; it must not embed subscription billing details.
- `Subscription` manages the commercial lifecycle (creation, renewal, cancellation, upgrade); it must not directly enforce product feature gates — that belongs to `entitlement`.
- Do not place authentication, identity, or workspace product behaviour inside billing subdomains.
- Payment provider SDK details must never appear in `domain/` — they belong in `infrastructure/` adapters only.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
