# 3100 Low Cohesion

- Status: ~~Accepted~~ → **Superseded by [ADR 0015](./0015-api-layer-removal.md)**
- Date: 2026-04-13
- Superseded by: [ADR 0015 – api/ Layer Removal](./0015-api-layer-removal.md)
- Category: Modularity Smells > Low Cohesion

> **路徑說明**：此 ADR 描述的 `platform/api/index.ts` 混合四種職責問題使用舊版 `module/api/` 結構。ADR 0015 已整體移除 `api/` 層；本 ADR 描述的違規路徑不再存在。路徑使用舊版 `modules/` 前綴（架構遷移前）。

## Context

低內聚（Low Cohesion）指一個模組或文件承擔了多個不相關的職責，違反了「一個文件/模組只做一件事」的原則。

掃描後發現三類低內聚問題：

### 問題一：`platform/api/index.ts` 混合四種不同職責（153 行）

```typescript
// 1. 基礎設施 API（底層 Firebase adapter）
export { firestoreInfrastructureApi, storageInfrastructureApi, ... }

// 2. 服務 API（跨域能力合約）
export { authApi, permissionApi, fileApi }

// 3. 子域業務 API（identity、account、organization、notification、background-job、ai、access-control）
export * from "../subdomains/identity/api";
export * from "../subdomains/account/api";
...

// 4. UI 元件與 React hooks（Shell 系列、Organization 系列）
export { ShellHeaderControls, ShellThemeToggle, AccountSwitcher, ... }
export { useApp, useShellGlobalSearch }
```

這四種職責的變更頻率、消費者、版本穩定性需求完全不同：
- 基礎設施 API：只有 notion、notebooklm 需要（它們直接訪問 Firestore）
- 服務 API：workspace、notion、notebooklm 跨域呼叫
- 子域業務 API：按功能需求各取所需
- UI 元件：只有 app/(shell) 需要

### 問題二：workspace/api 分為五個文件（427 行總計）無明確凝聚單元

```
workspace/api/
  index.ts    (20 行)   ← 只做 re-export
  contracts.ts (146 行) ← 型別合約
  facade.ts   (91 行)   ← 業務行為
  ui.ts       (170 行)  ← UI 元件
  runtime/    ← runtime factory
```

workspace/api 的設計本身合理（ui、facade、contracts 分離），但 `index.ts` 只有 20 行且做 re-export，暗示這個分層的必要性值得再確認。

### 問題三：`platform/application/` 混合多個不相關子目錄

```
modules/platform/application/
  dtos/
  event-handlers/     ← 事件處理（Pub/Sub 消費）
  event-mappers/      ← 事件轉換（型別映射）
  handlers/           ← 請求處理器
  queries/            ← 查詢
  services/           ← Application services
  use-cases/          ← Use cases
```

`event-handlers/`、`event-mappers/`、`handlers/` 三個目錄的職責邊界不清晰，造成維護者難以判斷「新的 event handler 應放在 event-handlers/ 還是 handlers/」。

## Decision

1. **platform/api/index.ts 按職責拆分**（也見 ADR 2100）：
   - `api/index.ts` — 只放跨域服務 API（authApi、permissionApi、fileApi）及穩定能力合約
   - `api/ui.ts` — 所有 Shell UI 元件與 hooks
   - `api/server.ts` — server-only 能力
   - 子域 api 讓消費者直接從 `platform/subdomains/<name>/api` import
2. **platform/application/ 結構整理**：
   - 合併 `event-handlers/` 與 `handlers/` 或明確區分職責（event-handlers = async domain event subscribers，handlers = sync command handlers）
   - 合併 `event-mappers/` 至 `infrastructure/mappers/`（轉換是 infrastructure 關注點）
3. **新增 `api/` 層合約規範**：每個 `api/index.ts` 的職責為「跨模組語意能力合約」，不允許混入 UI、runtime、infrastructure 職責。

## Consequences

正面：
- 消費者可按實際需求選擇正確的 import 路徑，無需解析 monolithic api/index.ts。
- `platform/application/` 目錄結構清晰，新增事件處理有明確歸屬。

代價：
- 現有消費者需要更新 import 路徑（主要是 app/(shell) 中的 UI 元件 import）。
- `event-handlers/` 與 `handlers/` 合併前需要確認是否有循環依賴風險。
