# 1100 Layer Violation

- Status: Partially Resolved
- Date: 2026-04-13
- Resolved (workspace interfaces/api/): 2026-04-14
- Category: Architectural Smells > Layer Violation

## Context

Hexagonal Architecture 規定固定依賴方向：`interfaces/ → application/ → domain/ ← infrastructure/`。「Layer Violation」指某一層對不該依賴的層產生直接 import，穿越了層邊界。

掃描後發現兩類違規：

### 違規一：`interfaces/` 內部建立了 `api/` 子目錄（workspace、platform）

```
modules/workspace/interfaces/api/       ← interfaces 內部包含 API 層職責
modules/platform/interfaces/api/        ← 同上
```

`interfaces/api/` 放的是 facades、actions、queries、runtime 等**公開邊界行為**，這些本應在 `modules/*/api/` 中協調，卻被下移至 `interfaces/` 層，造成：

- `interfaces/` 同時承擔「輸入/輸出轉換」（本職）與「公開邊界協調」（api/ 職責）。
- 外部消費者必須知道 `interfaces/api/facades/workspace.facade.ts` 存在，否則無法追蹤實際 export 路徑。

**受影響文件（workspace）：**
```
interfaces/api/runtime/workspace-runtime.ts
interfaces/api/facades/workspace.facade.ts
interfaces/api/facades/workspace-member.facade.ts
interfaces/api/actions/workspace.command.ts
interfaces/api/queries/workspace.query.ts
interfaces/api/queries/workspace-member.query.ts
interfaces/api/contracts/workspace.contract.ts
```

### 違規二：Firebase SDK 直接出現在 `platform/api/infrastructure-api.ts`（非 `infrastructure/`）

```typescript
// modules/platform/api/infrastructure-api.ts
import { collectionGroup } from "firebase/firestore";   // Firebase SDK in api/ layer
```

`api/` 層應只做邊界協調，Firebase SDK 屬於 `infrastructure/` 層職責。此文件將 Firebase 低階能力暴露為「基礎設施 API」，混淆了 api/infrastructure 的職責邊界。

## Decision

1. **`interfaces/api/` 子目錄不應存在**：façade、action、query、runtime 等公開邊界行為應放在 `modules/*/api/` 或 `modules/*/interfaces/` 根下的指定子目錄，不允許在 `interfaces/` 內嵌套 `api/`。
2. **遷移路徑（workspace）**：`interfaces/api/facades/` → `api/` 根（或保留在 interfaces/ 內不命名 api/）；runtime 可保留在 `interfaces/` 的 `runtime/` 子目錄。
3. **Firebase SDK 不得出現在 `api/` 層**：`platform/api/infrastructure-api.ts` 中的 Firebase SDK 直接呼叫應移至 `infrastructure/` 或透過 `@integration-firebase` 提供的 adapter，`api/` 層只持有 adapter interface 引用。

## Consequences

正面：
- `interfaces/` 的職責回歸「輸入/輸出轉換與 UI 組裝」，不再兼任公開邊界協調。
- 追蹤任何模組的公開邊界只需讀 `api/index.ts`，不需進入 `interfaces/` 深層。

代價：
- workspace `interfaces/api/` 的遷移需要同步更新 `workspace/api/facade.ts` 的 import 路徑，以及所有消費 `workspace/interfaces/api/` 的 app 層文件。
- `platform/api/infrastructure-api.ts` 重構需要確認哪些呼叫者依賴其低階行為，避免破壞 Firebase adapter 注入鏈。

## Resolution (HX-1-001 — 2026-04-14)

### 違規一已修復：`workspace/interfaces/api/` 已展平

`modules/workspace/interfaces/api/` 目錄已完全移除。原有的 15 個文件遷移至：

```
modules/workspace/interfaces/
  actions/workspace.command.ts    ← 原 interfaces/api/actions/
  contracts/{index,...}.ts        ← 原 interfaces/api/contracts/
  facades/{index,...}.ts          ← 原 interfaces/api/facades/
  queries/{workspace,...}.ts      ← 原 interfaces/api/queries/
  runtime/{index,...}.ts          ← 原 interfaces/api/runtime/
```

`modules/workspace/api/facade.ts` 的 import 路徑已同步更新：
- `"../interfaces/api/facades/workspace.facade"` → `"../interfaces/facades/workspace.facade"`
- `"../interfaces/api/facades/workspace-member.facade"` → `"../interfaces/facades/workspace-member.facade"`

### 違規二仍開放：`platform/api/infrastructure-api.ts` Firebase SDK

見 HX-1-002（待後續 Batch T1-B 處理）。
