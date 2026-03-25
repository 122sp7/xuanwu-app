---
title: Namespace Core development contract
description: Implementation contract for the Namespace Core domain — canonical named-scope registration, slug validation, collision detection, and resolution for multi-tenant resource addressing.
status: "🚧 Developing"
---

# Namespace Core development contract

> **開發狀態**：🚧 Developing — 積極開發中

## Purpose

`modules/namespace` defines:
- Uniform slug registration and validation (org/workspace level)
- Slug → namespace resolution
- Multi-tenant addressing layer
- Human-readable URL routing foundation (`/{org-slug}/{workspace-slug}`)

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Namespace entity | `modules/namespace/domain/entities` |
| NamespaceSlug value object | `modules/namespace/domain/value-objects` |
| Slug policy (pure) | `modules/namespace/domain/services` |
| Namespace repository port | `modules/namespace/domain/repositories/INamespaceRepository` |
| Register use-case | `modules/namespace/application/use-cases/RegisterNamespaceUseCase` |
| Resolve use-case | `modules/namespace/application/use-cases/ResolveNamespaceUseCase` |
| In-memory adapter | `modules/namespace/infrastructure/repositories/InMemoryNamespaceRepository` |

## Bounded contexts

| Context | Responsibility |
| --- | --- |
| Registration | Validate slug, check collision, persist |
| Resolution | Translate slug + kind → namespace or null |
| Lifecycle | Suspend, restore, archive records |
| Derivation | Display name → slug candidate (pure)

## Namespace entity contract

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | UUID v4 |
| `slug` | `NamespaceSlug` | Validated VO |
| `kind` | `org\|workspace` | Scope |
| `ownerAccountId` | `string` | Registering user |
| `organizationId` | `string` | Org boundary |
| `status` | `active\|suspended\|archived` | State |
| `createdAt` | `Date` | Registered |
| `updatedAt` | `Date` | Updated |

## NamespaceSlug value object contract

**3–63 chars**: a-z, 0-9, hyphen. Cannot start/end with hyphen.

```ts
NamespaceSlug.create('my-org')  // ✓
NamespaceSlug.create('-bad-')   // ✗
NamespaceSlug.create('AB_CD')   // ✗
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

| `suspend()` | `active` → `suspended` | must be active |
| `restore()` | `suspended` → `active` | must be suspended |
| `archive()` | `active\|suspended` → `archived` | final

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
