- Architecture style: Hexagonal DDD; each `modules/<context>/` directory is a bounded context.
- Dependency direction: `interfaces -> application -> domain <- infrastructure`.
- Cross-module rule: synchronous collaboration must go through the target module's `index.ts` public boundary; do not reach into peer internals directly.
- In-module rule: use relative imports within a module; avoid self-import through the module's own public surface unless intentionally consuming an external contract.
- Shared boundaries live in `packages/*` behind `@shared-*`, `@integration-*`, `@ui-*`, and `@lib-*` aliases; legacy `@/shared/*`, `@/libs/*`, and similar paths are blocked.
- Runtime split: Next.js owns browser-facing UX, auth/session, and orchestration; `py_fn` owns ingestion, parsing, chunking, embedding, and worker jobs.
- Current topology baseline: `src/modules/` 是唯一模組實作層（`modules/` 根目錄已於 2026-04-17 刪除）。

## Module & App Path Guardrail (SINGLE-LAYER — 2026-04-17+)

| Path | Role | When to use |
|---|---|---|
| `src/modules/<context>/` | 唯一 Hexagonal DDD 實作層；策略邊界 + published language 權威 | 讀規則、寫 use case、adapter、entity |
| `src/app/` | 唯一 Next.js App Router 層 | 所有 route segment、layout |

- ❌ 不再有 `modules/<context>/` 根目錄（已刪除）
- ❌ 不再有平行 `app/` 根目錄（已刪除）
- ✅ 若不確定 → 查 `src/modules/<context>/AGENT.md` 的 Route Here/Elsewhere 段落
- ✅ `src/modules/template/` 是新模組的骨架基線（完整多子域範本）