# workspace-flow — Domain Services

> **Canonical DDD reference:** `../../docs/ddd/workspace-flow/domain-services.md`

本文件對齊 `docs/ddd/workspace-flow/domain-services.md`，整理 `workspace-flow` 的 domain services 與相關設計約束。

## Domain Service Files
- `domain/services/invoice-guards.ts`
- `domain/services/invoice-transition-policy.ts`
- `domain/services/issue-transition-policy.ts`
- `domain/services/task-guards.ts`
- `domain/services/task-transition-policy.ts`

## 設計規則

- domain service 只承載純業務規則
- 單一 aggregate 能封裝的規則，不應外提到 domain service
- framework-specific 依賴必須留在 infrastructure

## 參考

- `../../docs/ddd/workspace-flow/domain-services.md`
- `../../docs/ddd/workspace-flow/aggregates.md`
