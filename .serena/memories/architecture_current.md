- Architecture style: Hexagonal DDD; each `modules/<context>/` directory is a bounded context.
- Dependency direction: `interfaces -> application -> domain <- infrastructure`.
- Cross-module rule: synchronous collaboration must go through the target module's public `api/` surface; do not reach into peer internals directly.
- In-module rule: use relative imports within a module; avoid self-import through the module's own public surface unless intentionally consuming an external contract.
- Shared boundaries live in `packages/*` behind `@shared-*`, `@integration-*`, `@ui-*`, and `@lib-*` aliases; legacy `@/shared/*`, `@/libs/*`, and similar paths are blocked.
- Runtime split: Next.js owns browser-facing UX, auth/session, and orchestration; `py_fn` owns ingestion, parsing, chunking, embedding, and worker jobs.
- Current topology baseline: 18 bounded contexts in `modules/`.

## ⚠ 4-Path Routing Guardrail (CRITICAL — prevents agent confusion)

| Path | Role | When to use |
|---|---|---|
| `modules/<context>/` | 完整 Hexagonal DDD 實作；策略邊界 + published language 權威 | 讀規則、context map、API contract |
| `src/modules/<context>/` | 精簡蒸餾骨架；新實作目標層 | 寫新 use case、adapter、entity |
| `app/` | Next.js App Router（原始，仍是 canonical routing） | 當前 production route segments |
| `src/app/` | Next.js App Router 蒸餾骨架（新標準） | 新 route segment、新 layout（依 src/app/AGENT.md） |

- ❌ 不把 `modules/<context>/` 當 `src/modules/<context>/` 使用（路由錯誤）
- ❌ 不把 `src/modules/` 當 `modules/` 的別名
- ❌ 不把 `app/` 與 `src/app/` 互換使用（兩者並存期間，依各自 AGENT.md 決定）
- ✅ 若不確定 → 查 `src/modules/<context>/AGENT.md` 的 Route Here/Elsewhere 段落
- ✅ `src/modules/template/` 是新模組的骨架基線（完整多子域範本）