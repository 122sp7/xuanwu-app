---
title: Module API Surface via Barrel Exports
impact: HIGH
impactDescription: Defines the contract between modules and external consumers
tags: api, module-surface, barrel, exports
---

## Module API Surface via Barrel Exports

**Impact: HIGH**

Every module's `index.ts` is its **public API contract**. It defines exactly what other modules and the `app/` layer can consume. Treat it like a published library interface.

**Guidelines:**

1. **Export only what consumers need** — types, use cases, query hooks, and components
2. **Don't export internal helpers** — domain services, repository implementations, or infrastructure details stay private unless needed for DI wiring
3. **Use `export type` for type-only exports** — prevents runtime import of things that are only needed at compile time
4. **Group exports logically** — types first, then use cases, then infrastructure (if needed)

**Example:**

```typescript
// modules/wiki/index.ts

// ── Types ──────────────────────────────────────
export type { WikiDocument } from "./domain/entities/wiki-document.entity";
export type { WikiPage } from "./domain/entities/wiki-page.entity";

// ── Use Cases ──────────────────────────────────
export { createWikiDocument } from "./application/use-cases/create-wiki-document";
export { searchWikiDocuments } from "./application/use-cases/search-wiki-documents.use-case";
export { getWorkspaceKnowledgeSummary } from "./application/use-cases/get-workspace-knowledge-summary.use-case";

// ── Queries (React hooks) ──────────────────────
export { useWikiDocuments } from "./interfaces/queries/wiki.queries";

// ── Components ─────────────────────────────────
export { WikiEditor } from "./interfaces/components/WikiEditor";

// ── Infrastructure (for DI wiring at app root) ─
export { WikiDocumentFirebaseRepository } from "./infrastructure/repositories/WikiDocumentRepository";
```
