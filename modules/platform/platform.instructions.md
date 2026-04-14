---
description: 'Platform bounded context rules: governance upstream role, module shape, subdomain routing, and cross-context dependency direction.'
applyTo: 'modules/platform/**/*.{ts,tsx,md}'
---

# Platform Bounded Context (Local)

Use this file as execution guardrails for `modules/platform/`.
For full reference, align with `.github/instructions/architecture-core.instructions.md`, `docs/contexts/platform/README.md`, and `docs/bounded-contexts.md`.

## Core Rules

- `platform` is the **governance upstream** for all other bounded contexts (`workspace`, `notion`, `notebooklm`); never invert this dependency.
- Cross-module consumers must import from `modules/platform/api` only — never from `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Route work to the correct subdomain first; do not place subdomain-specific logic in the context-wide `application/` or `domain/` layers.
- New top-level main domains are forbidden — follow the repo strategic docs for the canonical eight-context model and do not re-centralize IAM or AI back into platform.
- Use ubiquitous language from `docs/contexts/platform/ubiquitous-language.md`: `Actor` not `User`, `Entitlement` not `Plan`, `Membership` not `User` for workspace participant.
- Shell account scope uses `accountId`; `organizationId` remains an organization-scoped downstream identifier, not a shell route param.
- Code-level account scope values remain `"user" | "organization"`; keep personal account / organization account as display language only.
- Canonical governance URLs are flattened account-scoped routes, not legacy `/{accountId}/organization/*` paths.

## Route to Subdomain When

| Concern | Subdomain |
|---|---|
| Account lifecycle | `account` |
| Account profile & preferences | `account-profile` |
| Organization, tenant structure | `organization` |
| Team membership | `team` |
| Subscription & billing plan | `subscription` |
| Capability grants | `entitlement` |
| Access policy enforcement | `access-control` |
| Notification dispatch | `notification` |
| Background / ingestion jobs | `background-job` |

## Route Elsewhere When

- Workspace lifecycle, membership, presence → `workspace`
- Knowledge content creation, taxonomy, publishing → `notion`
- Conversation, retrieval, synthesis → `notebooklm`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
