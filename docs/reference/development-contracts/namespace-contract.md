---
title: Namespace Core development contract
description: Implementation contract for the Namespace Core domain — canonical named-scope registration, slug validation, collision detection, and resolution for multi-tenant resource addressing.
---

# Namespace Core development contract

## Purpose

This contract defines `core/namespace-core` as the **命名空間基礎** for xuanwu-app:

- a uniform model for registering and validating organization-level and workspace-level slugs
- the resolution boundary for translating slugs to internal Namespace records
- the multi-tenant addressing layer used by organization and workspace modules on creation
- the foundation for human-readable URL routing (`/{org-slug}/{workspace-slug}`)

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Namespace entity | `core/namespace-core/domain/entities` |
| NamespaceSlug value object | `core/namespace-core/domain/value-objects` |
| Slug policy (pure) | `core/namespace-core/domain/services` |
| Namespace repository port | `core/namespace-core/domain/repositories/INamespaceRepository` |
| Register use-case | `core/namespace-core/application/use-cases/RegisterNamespaceUseCase` |
| Resolve use-case | `core/namespace-core/application/use-cases/ResolveNamespaceUseCase` |
| In-memory adapter | `core/namespace-core/infrastructure/repositories/InMemoryNamespaceRepository` |

## Bounded contexts

| Context | Responsibility |
| --- | --- |
| Registration Context | validate slug format, check collision, persist new Namespace record |
| Resolution Context | translate slug + kind to internal Namespace; return null if not found |
| Lifecycle Context | suspend, restore, and archive namespace records |
| Slug Derivation Context | convert display names to slug candidates via pure domain service |

## Namespace entity contract

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | UUID v4 — globally unique |
| `slug` | `NamespaceSlug` | yes | Validated slug value object |
| `kind` | `'organization' \| 'workspace'` | yes | Namespace scope kind |
| `ownerAccountId` | `string` | yes | accountId of the registering user |
| `organizationId` | `string` | yes | Multi-tenant org boundary |
| `status` | `'active' \| 'suspended' \| 'archived'` | yes | Lifecycle state |
| `createdAt` | `Date` | yes | Registration timestamp |
| `updatedAt` | `Date` | yes | Last state-change timestamp |

## NamespaceSlug value object contract

Format rules:
- Length: **3–63 characters**
- Allowed characters: lowercase `a-z`, digits `0-9`, hyphen `-`
- Must not start or end with a hyphen
- Validated and normalised on construction via `NamespaceSlug.create(raw)`

```typescript
NamespaceSlug.create('my-org')     // → ok
NamespaceSlug.create('-bad-')      // → throws Error
NamespaceSlug.create('AB_TEST')    // → throws Error (uppercase / underscore)
```

## Slug policy contract (pure functions)

```typescript
// domain/services/slug-policy.ts

deriveSlugCandidate(displayName: string): string
isValidSlug(slug: string): boolean
```

- Both functions are pure — no side effects, no external dependencies.
- `deriveSlugCandidate` normalises a display name into a slug candidate (does not guarantee uniqueness).
- `isValidSlug` validates the slug format without instantiating the VO.

## INamespaceRepository contract

```typescript
interface INamespaceRepository {
  save(namespace: Namespace): Promise<void>
  findById(id: string): Promise<Namespace | null>
  findBySlug(slug: string, kind: NamespaceKind): Promise<Namespace | null>
  findByOrganization(organizationId: string): Promise<Namespace[]>
  existsBySlug(slug: string, kind: NamespaceKind): Promise<boolean>
}
```

- `findBySlug` must return the **active** namespace matching slug + kind; it must not return suspended or archived records as valid routing targets.
- `existsBySlug` must check across all statuses (not just active) to prevent slug reuse after archive.
- `findByOrganization` returns all namespaces for the org, unfiltered by status.

## Collision detection contract

```
RegisterNamespaceUseCase.execute(dto):
  1. NamespaceSlug.create(dto.slug)          ← format validation
  2. existsBySlug(slug, kind)                ← collision check
  3. if exists → throw "slug already taken"
  4. new Namespace(..., status: 'active')    ← create entity
  5. save(namespace)                         ← persist
```

- Collision check is scoped per `kind` — the same slug string is allowed once for `organization` and once for `workspace`.
- Slug uniqueness is enforced at the application layer via the repository port, not in the domain entity.

## Namespace lifecycle contract

| Transition | From | To | Guard |
| --- | --- | --- | --- |
| `suspend()` | `active` | `suspended` | must be active |
| `restore()` | `suspended` | `active` | must be suspended |
| `archive()` | `active` or `suspended` | `archived` | must not already be archived |

- Archived namespaces cannot be restored (final state).
- The slug of an archived namespace is still reserved (existsBySlug returns true).

## Infrastructure configuration contract

```typescript
NAMESPACE_CORE_CONFIG = {
  STORE: { COLLECTION: 'namespaces' },
  SLUG:  { MIN_LENGTH: 3, MAX_LENGTH: 63 },
}
```

## Layer ownership

| Layer | Owns | Must not |
| --- | --- | --- |
| Domain | entities, value objects, repository ports, slug-policy service | import SDK, HTTP, DB |
| Application | use-cases, DTO composition, collision-check orchestration | directly import infrastructure or UI |
| Infrastructure | namespace store adapter | leak provider details into domain |
| Interfaces | controller facade | bypass application layer |
