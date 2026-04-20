# ADR 0003 — Module Public API Surface Contract

## Status

Accepted

## Date

2025-02-11

## Context

`src/modules/<context>/index.ts` 是每個 bounded context 對外的唯一公開入口。然而目前多個模組的 `index.ts` 現況不明，潛在問題包括：

1. **過度暴露**：直接 re-export domain entities、repository factories、infrastructure wiring，讓外部可繞過邊界。
2. **查詢氣味**：存在 `GetXxxUseCase` 直接放在 public surface，而非分流至 query handler。
3. **平行直連**：部分 `src/app/` route components 可能直接 import 模組內部路徑（`/domain/`、`/infrastructure/`），而非只用 `index.ts`。
4. **Context provider 跨模組消費**：route components 可能呼叫其他模組的 Context Provider（如 `useWorkspaceContext()`）而非透過 props 傳遞 scope。

這些都直接違反 Hexagonal Architecture 的邊界規則（AGENTS.md Rule 6、Rule 7、Rule 49、Rule 51）。

## Decision

### index.ts 允許暴露的內容

| 類別 | 允許 | 禁止 |
|---|---|---|
| Use cases | ✅ 可暴露 execute 函數或 use case class | ❌ 不得暴露 domain entity constructor |
| Query handlers | ✅ 可暴露 query function | ❌ 不得暴露 repository instance |
| DTOs / schemas | ✅ 可暴露 input/output types | ❌ 不得暴露 Firestore document shape |
| Domain events | ✅ 可暴露 event type discriminant | ❌ 不得暴露 aggregate class |
| Application services | ✅ 可暴露 service interface | ❌ 不得暴露 DI container 或 factory function |

### GetXxxUseCase 規則

- `GetXxxUseCase` 視同 **query smell**：純讀取不含業務邏輯者，改用 query handler（`queries/` 目錄）。
- 若需業務決策（如 access check）則允許保留為 use case，但命名應反映業務意圖（如 `GetAccessibleWorkspaceUseCase`）。

### 跨模組呼叫規則

```typescript
// ✅ 正確：只從模組 root index.ts import
import { createWorkspace } from "@/modules/workspace";

// ❌ 錯誤：直接 import 內部路徑
import { Workspace } from "@/modules/workspace/domain/entities/Workspace";
import { FirestoreWorkspaceRepository } from "@/modules/workspace/infrastructure/...";
```

### Route Component Scope 傳遞規則

跨模組 route components 必須由 composition owner（`src/app/`）透過 props 傳入 scope：

```typescript
// ✅ 正確：composition owner 傳 scope props
<NotionPageView accountId={accountId} workspaceId={workspaceId} />

// ❌ 錯誤：直接消費他模組的 context provider
const { workspace } = useWorkspaceContext(); // 在 notion/ components 裡
```

### 執行驗證

`eslint.config.mjs` 的 `no-restricted-imports` 規則必須涵蓋所有跨模組內部路徑，確保違規在 CI 層攔截。

## Consequences

**正面：** 邊界穩定，模組可安全重構內部結構而不影響外部消費者。  
**負面：** 需要審查現有 `index.ts` 並移除過度暴露的 export；需更新 ESLint 規則覆蓋範圍。  
**中性：** query handler 與 use case 的分界需每個模組逐一決策，不能一刀切。

## References

- `AGENTS.md` — Rule 6、Rule 7、Rule 49、Rule 51
- `.github/instructions/architecture-core.instructions.md` — index.ts 公開入口規則
- `eslint.config.mjs` — no-restricted-imports 現有配置
- `src/modules/<context>/index.ts` — 待審查文件
