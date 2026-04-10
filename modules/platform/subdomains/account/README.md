<!-- Purpose: Subdomain scaffold overview for platform 'account'. -->
# account Subdomain

**Subdomain**: `account` | **Module**: `platform` | **Context**: Platform
**Classification**: Core Subdomain | **Owner**: Platform Team

## Purpose

Own the `Account` aggregate root and its full lifecycle: creation, activation, suspension, deactivation, and deletion. An `Account` is the primary platform-level identity container for a single user's operational presence on the platform.

## Core Responsibility

- Create and persist `Account` aggregates with stable `accountId`
- Manage account status transitions (`PENDING → ACTIVE → SUSPENDED → DEACTIVATED`)
- Enforce account-level invariants (unique email, allowed status transitions)
- Publish lifecycle domain events consumed by downstream subdomains

## Key Aggregates

- **Account** — root aggregate (accountId, email, status, createdAt, lastActiveAt)

## Domain Events

- `account.created` — a new account has been provisioned
- `account.activated` — account transitioned to ACTIVE
- `account.suspended` — account temporarily suspended
- `account.deactivated` — account permanently deactivated
- `account.deleted` — account and its data removed

## Inbound Contracts

- `identity.subject-registered` → triggers `CreateAccountUseCase`
- `identity.subject-deleted` → triggers `DeleteAccountUseCase`

## Outbound Contracts

- Publishes `account.*` lifecycle events consumed by:
  - `organization` (membership cleanup on deactivation)
  - `audit-log` (compliance record)
  - `notification` (welcome, suspension notices)
- Exposes `AccountRepository` interface (read account by id/email)

## Technical Notes

- `accountId` is the stable cross-subdomain reference; never expose internal DB primary key
- Email uniqueness enforced at domain + infrastructure layer
- Status transitions validated as domain invariants in the aggregate

## Status

🔨 Migration-Pending — scaffold only