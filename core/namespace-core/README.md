# Namespace Core

`core/namespace-core` is the canonical namespace and slug domain foundation for Xuanwu.

It provides a uniform model for registering, validating, and resolving named scopes
(organization-level and workspace-level) used for multi-tenant resource addressing and URL routing.

## Absorbed From

| Source | Status |
|--------|--------|
| N/A — original core module (scaffold only, now implemented) | — |

## Dependency Direction

```
interfaces -> application -> domain <- infrastructure
```

- Domain is framework-free (no SDK/HTTP/DB imports)
- Infrastructure implements domain ports only
- Interfaces never bypass Application

## Structure

```
namespace-core/
├── domain/
│   ├── entities/          # Namespace
│   ├── repositories/      # INamespaceRepository
│   ├── services/          # slugPolicy (pure — deriveSlugCandidate, isValidSlug)
│   └── value-objects/     # NamespaceSlug
├── application/
│   └── use-cases/         # RegisterNamespaceUseCase, ResolveNamespaceUseCase
├── infrastructure/
│   ├── persistence/       # config (collection name, slug length limits)
│   └── repositories/      # InMemoryNamespaceRepository
└── interfaces/
    └── api/               # NamespaceController
```

## Core Flow

```mermaid
flowchart TD
    A[Display Name<br/>原始顯示名稱] --> B[Slug Derivation<br/>deriveSlugCandidate]
    B --> C[Slug Validation<br/>NamespaceSlug.create]
    C --> D[Collision Check<br/>existsBySlug]
    D --> E[Register Namespace<br/>持久化命名空間]
    E --> F[Resolve Slug<br/>findBySlug → route]
    F --> A
```

## Fill-In Order (Recommended)

1. Domain slug invariants and NamespaceSlug value-object behaviour
2. Slug policy pure functions (deriveSlugCandidate, isValidSlug)
3. Application orchestration and collision-check composition
4. Infrastructure adapter implementation (Firestore)
5. Interface validation and serialization
