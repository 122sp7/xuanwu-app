# Bounded Contexts

## Boundary Matrix

| Context | Responsible For | Not Responsible For | Published Language | Upstream/Downstream (Simplified) |
|---|---|---|---|---|
| identity | Authentication identity lifecycle | Billing policy decisions | identity commands/events | Upstream: config; Downstream: account, audit |
| account | Account profile and membership state | Payment settlement | account contracts/events | Upstream: identity; Downstream: billing, notification |
| billing | Charges, invoices, payment state policy | Identity lifecycle | billing contracts/events | Upstream: account, subscription; Downstream: audit |
| subscription | Plan lifecycle and entitlement policy | Invoice bookkeeping | subscription contracts/events | Upstream: account; Downstream: billing, feature-flags |
| notification | Delivery policy and notification orchestration | Domain ownership of business state | notification commands/events | Upstream: all business contexts |
| audit | Immutable audit trails | Primary business command execution | audit event schema | Upstream: all business contexts |
| feature-flags | Feature gating policies | Billing/identity ownership | feature flag contracts | Upstream: subscription, config |
| config | Runtime configuration policy | Business aggregates | config contracts | Upstream: observability/integration |
| integration | External API and partner boundary adapters | Domain business decisions | integration API contracts | Upstream: core/supporting contexts |
| observability | Metrics/logging/tracing policy | Business use-case decisions | telemetry contracts | Upstream: all contexts |

## Boundary Rules

1. No context directly imports another context internals.
2. Cross-context communication uses published contracts or domain events.
3. Context ownership changes must be reflected in this file first.

