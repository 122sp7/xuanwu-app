<!-- Purpose: Subdomain scaffold overview for platform 'billing'. -->

## Billing Subdomain

### Purpose

The **Billing** subdomain manages subscription plans, usage tracking, payment processing, and financial records within the Xuanwu platform. It enforces billing policies, tracks entitlements, and maintains the financial relationship between the platform and tenants.

### Core Concepts

- **Subscription**: Active billing agreement for a tenant, linked to a plan and billing cycle.
- **Plan**: Pricing tier defining features, quotas, and cost structure.
- **Invoice**: Financial record of charges for a billing period.
- **Usage**: Quantified consumption of platform features (e.g., storage, API calls, seats).
- **Payment Method**: Stored credential for recurring or on-demand charges.

### Key Responsibilities

1. **Subscription Lifecycle**: Create, update, upgrade/downgrade, and cancel subscriptions.
2. **Usage Metering**: Track and aggregate tenant consumption across features.
3. **Billing Cycle Management**: Calculate invoices, apply discounts, and schedule payments.
4. **Financial Reporting**: Generate invoices, payment receipts, and reconciliation records.
5. **Entitlement Enforcement**: Publish quota and feature-access signals for other subdomains to consume.

### Dependencies

- **Upstream** (depends on):
    - `identity`: Resolve tenant and payer identity for billing.
    - `account`: Retrieve account metadata and payment profile.
    - `subscription`: Determine active subscription state.

- **Downstream** (subscribed to events):
    - `workspace.created`, `workspace.deleted`: Trigger subscription creation or cancellation.
    - `organization.member_added`: Update seat count and quotas.

### API Boundary

All cross-subdomain access flows through `modules/platform/api`.

### Implementation References

- **Domain Contracts**: `modules/platform/subdomains/billing/domain/`
- **Use Cases**: `modules/platform/subdomains/billing/application/use-cases/`
- **Infrastructure**: `modules/platform/subdomains/billing/infrastructure/` (Firebase, payment provider adapters)
