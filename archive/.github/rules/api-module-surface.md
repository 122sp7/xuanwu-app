---
title: Module API Surface via Domain API
impact: HIGH
impactDescription: Defines the contract between modules and external consumers
tags: api, module-surface, domain-api, contracts
---

## Module API Surface via Domain API

**Impact: HIGH**

Every module's `api/` directory is its **public cross-module contract**. It defines exactly what other modules can consume. Treat it like a published library interface.

**Guidelines:**

1. **Export only what consumers need** — types, use cases, query hooks, and components
2. **Don't export internal helpers** — domain services, repository implementations, or infrastructure details stay private unless needed for DI wiring
3. **Use `export type` for type-only exports** — prevents runtime import of things that are only needed at compile time
4. **Group exports logically** — types first, then use cases, then infrastructure (if needed)

**Example:**

```typescript
// modules/<target-domain>/api/index.ts

// ── Types ──────────────────────────────────────
export type { PublicEntity } from "./domain/entities/public-entity";
export type { PublicView } from "./domain/entities/public-view";

// ── Use Cases ──────────────────────────────────
export { createPublicEntity } from "./application/use-cases/create-public-entity";
export { searchPublicEntities } from "./application/use-cases/search-public-entities";
export { getPublicSummary } from "./application/use-cases/get-public-summary";

// ── Queries (React hooks) ──────────────────────
export { usePublicEntities } from "./interfaces/queries/public.queries";

// ── Components ─────────────────────────────────
export { PublicPanel } from "./interfaces/components/PublicPanel";

// Keep infrastructure details private to the module.
```
