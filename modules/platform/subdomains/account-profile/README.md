<!-- Purpose: Subdomain scaffold overview for platform 'account-profile'. -->
# account-profile Subdomain

**Subdomain**: `account-profile` | **Module**: `platform` | **Context**: Platform
**Classification**: Generic Subdomain | **Owner**: Platform Team

## Purpose

Manage the human-facing attributes of an account: display name, avatar, locale preference, timezone, UI preferences, and privacy/governance settings. Separates mutable profile data from the stable `Account` identity aggregate to avoid bloating the account lifecycle model.

## Core Responsibility

- Store and update profile attributes keyed on `accountId`
- Validate profile field constraints (display name length, locale format)
- Track consent preferences for data usage and communication
- Publish `account-profile.updated` for downstream consumers that cache display data

## Key Aggregates

- **AccountProfile** — profile aggregate (accountId as FK, displayName, avatarUrl, locale, timezone, preferences, updatedAt)

## Domain Events

- `account-profile.created` — initial profile provisioned after account creation
- `account-profile.updated` — one or more profile fields changed
- `account-profile.avatar-changed` — avatar specifically updated (for notification enrichment)

## Inbound Contracts

- `account.created` → triggers `CreateAccountProfileUseCase` (auto-provision empty profile)
- `account.deleted` → triggers `DeleteAccountProfileUseCase` (GDPR erasure)

## Outbound Contracts

- Publishes `account-profile.updated` for:
  - `notification` (resolve display name for emails)
  - `organization` (member display in org views)
- Exposes `AccountProfileRepository` for read queries by `accountId`

## Technical Notes

- Profile is always 1:1 with Account; `accountId` is the natural primary key
- Avatar storage delegated to file/storage infrastructure; only URL stored in profile
- Locale and timezone values validated against IANA / BCP 47 standards

## Status

🔨 Migration-Pending — scaffold only