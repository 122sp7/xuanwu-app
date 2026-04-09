<!-- Purpose: Subdomain scaffold overview for platform 'referral'. -->

## Overview

The **Referral** subdomain manages referral relationships, reward tracking, and incentive distribution within the Xuanwu platform. It enables users to refer others and tracks associated rewards and benefits.

## Core Responsibilities

- **Referral Creation & Lifecycle**: Create, track, and manage referral links and relationships between referrers and referred users.
- **Reward Tracking**: Maintain records of rewards earned through successful referrals.
- **Incentive Distribution**: Coordinate reward fulfillment and benefit allocation to referrers.
- **Referral Analytics**: Track conversion metrics and referral program performance.

## Bounded Context

**Module**: `modules/platform/subdomains/referral`

**Owner**: Platform domain

**Upstream Dependencies**:
- `account` — Referrer and referred user identity
- `organization` — Organizational membership and tenant context
- `billing` — Reward fulfillment and subscription benefit linkage

**Downstream Dependents**:
- `notification` — Referral status and reward notifications
- `analytics` — Referral conversion and program metrics

## Key Aggregates

- **Referral** — Root aggregate; represents a referral relationship (referrer → referred user, status, reward details)
- **ReferralCode** — Value object; unique code for referral link distribution
- **ReferralReward** — Value object; reward specification and fulfillment state

## Domain Events

- `ReferralCreated` — New referral link generated
- `ReferralConverted` — Referred user completed target action (e.g., signup, subscription)
- `RewardEarned` — Referrer earned reward from successful referral
- `RewardFulfilled` — Reward distributed to referrer account

## API Boundary

See `modules/platform/subdomains/referral/api/index.ts` for public use cases and contracts.

## Related Documentation

- [Ubiquitous Language](../../docs/ubiquitous-language.md) — Referral terminology
- [Context Map](../../context-map.md) — Platform subdomain relationships
