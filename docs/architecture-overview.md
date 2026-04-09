# Architecture Overview

## System View

```mermaid
flowchart LR
  U[Users / External Actors] --> N[Next.js App Router]
  N --> M[Module APIs modules/<context>/api]
  M --> A[Application Layer]
  A --> D[Domain Layer]
  I[Infrastructure Adapters] --> D
  A --> I
  I --> F[Firebase]
  I --> G[Genkit]
  I --> X[External APIs]
```

## Hexagonal Summary

1. Domain owns core business rules and remains framework-agnostic.
2. Application orchestrates use cases through ports.
3. Adapters implement ports for persistence, messaging, and external integrations.
4. Cross-context interaction goes through published API contracts.

## System Boundary Rules

1. Browser-facing orchestration stays in Next.js.
2. Business invariants stay in domain/application, not adapters.
3. External services are accessed only through infrastructure adapters.

