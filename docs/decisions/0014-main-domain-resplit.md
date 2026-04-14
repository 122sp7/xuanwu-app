# 0014 — Main Domain Resplit

## Status

Accepted

## Context

Earlier strategic docs and ADRs assumed a four-main-domain model centered on platform, workspace, notion, and notebooklm. That baseline no longer reflects the intended ownership split after separating identity and access, commercial capability, shared AI capability, and analytics concerns into their own top-level bounded contexts.

Without a superseding decision, the documentation set produces conflicting guidance:

- platform appears to own identity, entitlement, AI, and analytics at the same time;
- newer module scaffolding introduces iam, billing, ai, and analytics roots;
- context ownership becomes ambiguous for future implementation and review.

## Decision

The strategic architecture baseline is updated to an eight-context model:

- iam
- billing
- ai
- analytics
- platform
- workspace
- notion
- notebooklm

Ownership is redistributed as follows:

- iam owns identity, access-control, tenant, and security-policy;
- billing owns billing, subscription, entitlement, and referral;
- ai owns shared AI capability, model policy, provider routing, and safety guardrails;
- analytics owns reporting, metrics, dashboards, and downstream projections;
- platform is narrowed to account, organization, and shared operational services;
- workspace, notion, and notebooklm retain their existing collaboration, canonical-content, and reasoning-output roles.

This ADR supersedes the older "only four main domains" assumption where it conflicts with the new target architecture.

## Consequences

- Root strategic docs must be updated to remove the old four-domain wording.
- Context docs for ai, analytics, billing, and iam must be populated as first-class owners.
- Platform docs must stop claiming direct ownership over billing, entitlement, AI, and analytics concerns.
- Existing code may migrate incrementally, but the documentation authority now follows the eight-context target model.
