# 6113 Migration Gap — 消失的 packages


> ⚠️ **本文件為「僅記錄」文件 — 不執行實施**
> 此 ADR 的唯一目的是記錄遷移缺口，作為未來蒸餾工作的基線參考。
> **任何 agent 或開發者不得依據本文件直接新增、修改或刪除任何程式碼。**

- Status: ⛔ 僅記錄 — 不實施（Record Only — Do Not Implement）
- Date: 2026-04-17
- Category: Migration Gap > packages

## Context

`xuanwu-app-skill` 快照列出了 8 個 packages，總計 1,751 lines。

對應的 `src/` 下的 packages 只保留了部分，計算後損失約 20 個獨立模組（611 lines），其中包含生產功能所需的視覺化元件與事件契約。

### 遺失的 packages

#### 1. `packages/ui-vis`（視覺化元件，205 lines）

```
packages/ui-vis/
  src/
    network.tsx      (105 lines) — 知識圖譜網絡視覺化元件
      ← 使用 D3.js 渲染 node-edge 知識網絡圖
      ← 支援 zoom/pan、node click 事件、edge label
    timeline.tsx     (96 lines) — 時間軸視覺化元件
      ← 渲染事件時間軸（文件版本、活動記錄等）
      ← 支援 filter by date range
    index.ts
  package.json       ← alias: @ui-vis
```

這是 `@ui-vis` 套件的唯一實作，移除後知識圖譜功能失去唯一的 UI 元件。

#### 2. `packages/shared-events`（跨域事件契約，139 lines）

```
packages/shared-events/
  src/
    workspace.events.ts    (37 lines) — workspace domain events published language
    notion.events.ts       (31 lines) — notion domain events published language
    notebooklm.events.ts   (42 lines) — notebooklm domain events published language
    platform.events.ts     (29 lines) — platform domain events published language
    index.ts
  package.json             ← alias: @shared-events
```

定義了跨域 Pub/Sub 的 published language（事件型別 + payload schema），是 QStash event 訊息的 Zod validation schema 來源。

#### 3. `packages/shared-types`（共用型別，107 lines）

```
packages/shared-types/
  src/
    command-result.ts    (25 lines) — CommandResult<T> 共用型別
    pagination.ts        (19 lines) — PageRequest/PageResult 共用型別
    published-language.ts (42 lines) — 跨域 Published Language token 型別
      ← ActorReference, WorkspaceReference, KnowledgeArtifactReference 等
    index.ts
  package.json           ← alias: @shared-types
```

**注意**：`src/modules/shared/index.ts` 已包含 `DomainEvent` 基礎介面，但 `CommandResult`、`PageRequest` 及跨域 Published Language token 型別尚未遷移至此。

#### 4. 其餘消失的小型 packages（共計 ~160 lines）

```
packages/shared-i18n/         — i18n key 共用型別與 locale 定義
packages/shared-error-codes/  — 跨域錯誤碼常數
packages/ui-charts/           — 簡易圖表元件（Recharts wrappers）
```

## Decision

**不實施**。僅記錄缺口。

修復優先順序：
1. `shared-types`：`CommandResult` 與 `PageRequest` 是最常被引用的共用型別，應優先遷移至 `src/modules/shared/index.ts`。
2. `shared-events`：QStash event validation 依賴此 package，影響事件驅動流程。
3. `ui-vis`：知識圖譜 UI 需要此 package，但依賴 D3.js，添加時需進行 security advisory 檢查。

## Consequences

- `@shared-types` 缺失：`CommandResult` 型別只能靠各模組各自定義，增加不一致風險。
- `@shared-events` 缺失：QStash event subscriber 無 schema 可驗證收到的 event payload。
- `@ui-vis` 缺失：知識圖譜功能的唯一 UI 元件不存在。

## 關聯 ADR

- **6108** platform API contracts：`contracts.ts` 引用 `@shared-types` 中的 `CommandResult`。
- **6114** docs/semantic-model.md：語意模型引用了 `@shared-types` 中的 Published Language token 型別。
