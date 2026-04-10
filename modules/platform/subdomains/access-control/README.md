<!-- Purpose: Subdomain scaffold overview for platform 'access-control'. -->
# access-control Subdomain

**Subdomain**: `access-control` | **Module**: `platform` | **Context**: Platform
**Classification**: Generic Subdomain | **Owner**: Platform Team

## Purpose

Determine and enforce authorization decisions: what a verified subject is currently permitted to do on a given resource within a given context. `access-control` is the single runtime authority that evaluates policy rules and returns allow/deny verdicts; it does **not** define policies (that is `security-policy`'s job).

## Core Responsibility

- Evaluate whether a subject holds the required permission on a resource
- Provide role-based and attribute-based access decision APIs
- Cache and invalidate permission snapshots for performance
- Propagate `access-control.permission-changed` events when effective rights change

## Key Aggregates

- **AccessPolicy** — resolved set of grants for a subject + resource scope (derives from `security-policy` rules)
- **AccessDecision** — a single allow/deny verdict with audit metadata (subjectId, resourceId, action, result, evaluatedAt)

## Domain Events

- `access-control.permission-changed` — effective permission set for a subject has been updated
- `access-control.access-denied` — a deny verdict was issued (for audit and alerting)

## Inbound Contracts

- Receives `security-policy.policy-published` → rebuilds cached permission snapshots
- Receives `organization.role-assigned`, `organization.role-revoked` → invalidates subject snapshots
- Receives `identity.subject-authenticated` → pre-warms permission cache on login

## Outbound Contracts

- Exposes `checkPermission(subjectId, resourceId, action): AccessDecision` via query use case / API
- Publishes `access-control.permission-changed` for downstream audit and notification

## Technical Notes

- Decisions are read-heavy; use in-memory or Redis cache keyed on (subjectId, scope)
- All verdicts must be logged to `audit-log` subdomain
- Do not embed business rules here; delegate policy interpretation to `security-policy`

## Status

🔨 Migration-Pending — scaffold only