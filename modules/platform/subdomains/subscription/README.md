<!-- Purpose: Subdomain scaffold overview for platform 'subscription'. -->

## Overview

The `subscription` subdomain manages subscription plans, entitlements, and quota enforcement for Xuanwu tenants. It tracks active subscriptions, plan features, seat allocation, and usage limits across the platform.

## Domain Concepts

### Aggregates

- **Subscription** — Root aggregate representing a tenant's active plan contract, including plan type, billing cycle, seat count, and renewal date.
- **Plan** — Value object defining feature set, quota limits, and pricing tier (e.g., Free, Pro, Enterprise).
- **Seat** — Value object representing an allocated user slot within a subscription.
- **EntitlementGrant** — Value object recording a feature or quota entitlement linked to a plan.

### Domain Events

- `SubscriptionCreated` — A new subscription was activated for a tenant.
- `SubscriptionUpgraded` — Plan was upgraded to a higher tier.
- `SubscriptionDowngraded` — Plan was downgraded to a lower tier.
- `SubscriptionCanceled` — Subscription was terminated.
- `SeatAllocated` — A member was granted a seat.
- `SeatRevoked` — A member's seat was removed.
- `QuotaExceeded` — Tenant exceeded a usage limit (warning/enforcement signal).

## Use Cases

| Use Case | Responsibility |
|---|---|
| `list-subscription-plans.use-case.ts` | Retrieve available plans and feature matrices. |
| `create-subscription.use-case.ts` | Activate a new subscription for a tenant. |
| `upgrade-subscription.use-case.ts` | Migrate tenant to a higher-tier plan. |
| `allocate-seat.use-case.ts` | Assign a member to an available seat. |
| `check-entitlement.use-case.ts` | Verify tenant access to a feature. |
| `check-quota.use-case.ts` | Enforce usage limits and raise alerts. |

## Boundaries & Dependencies

- **Upstream** (depends on): `identity` (tenant identity), `account` (billing account).
- **Downstream** (consumed by): `access-control` (plan-based permissions), `billing` (revenue records), `notification` (seat/quota alerts).
- **Cross-context communication**: Publishes `SubscriptionCreated`, `SeatAllocated` events to event bus; subscribes to billing events.

## Implementation Status

- [ ] Aggregate roots and value objects
- [ ] Repository interfaces
- [ ] Core use cases
- [ ] Event handlers
- [ ] API boundary facade
